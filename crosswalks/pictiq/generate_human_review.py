#!/usr/bin/env python3
"""Validate and render the compact human review and gap-analysis artifacts."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REVIEW_PATH = HERE / "human-review.json"
HUMAN_OUTPUT = HERE / "HUMAN_REVIEW.md"
GAP_OUTPUT = HERE / "GAP_REPORT.md"
CANDIDATE_OUTPUT = HERE / "pictiq-gap-candidates.json"
SECTION_A_RECOMMENDATIONS = {
    "ACCEPT", "CHANGE TO PARTIAL", "CHANGE TO CONTEXTUAL", "CHANGE TO COMPOSED",
    "CHANGE TO NONE", "NEEDS HUMAN DECISION",
}
CLUSTER_RECOMMENDATIONS = {
    "STRONG CANDIDATE", "POSSIBLE CANDIDATE", "COMPOSITION / CONTEXT", "DO NOT ADD",
}
CANDIDATE_RECOMMENDATIONS = {"STRONG", "POSSIBLE", "DEFER", "REJECT"}
GAP_STATES = {"EMBODIED-OMITTABLE", "STANDALONE-GAP", "OUT-OF-SCOPE"}
UTILITY = {"HIGH", "MEDIUM", "LOW"}


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def git_output(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def section_a_source_rows(crosswalk: dict) -> list[dict]:
    rows = []
    for item in crosswalk["mappings"]:
        mapping = item["pictiq"]["mapping"]
        confidence = item["review_confidence"]
        if mapping in {"composed", "contextual"} or confidence == "low" or (
            confidence == "medium" and mapping in {"partial", "direct"}
        ):
            rows.append(item)
    return rows


def validate(review: dict, crosswalk: dict, pictiq_root: Path) -> dict:
    dataset_path = ROOT / review["source_dataset"]
    require(dataset_path == HERE / "crosswalk-120.json", "unexpected source dataset")
    require(sha256(dataset_path) == review["source_dataset_sha256"], "source dataset changed")
    require(review["source_commit"] == "50a58e7bfdd6004f7b52e6e3368149a8ac2f4fd1", "source commit changed")
    require(set(review["communication_mode_method"]["states"]) == GAP_STATES, "gap-state definitions changed")

    full_by_word = {item["word"]: item for item in crosswalk["mappings"]}
    require(len(full_by_word) == 120, "full crosswalk is not 120 unique words")
    expected_a = section_a_source_rows(crosswalk)
    review_a = review["semantic_review"]
    require({item["word"] for item in review_a} == {item["word"] for item in expected_a}, "Section A selection mismatch")
    require(len({item["word"] for item in review_a}) == len(review_a), "duplicate Section A word")
    require(all(item["recommendation"] in SECTION_A_RECOMMENDATIONS for item in review_a), "invalid Section A recommendation")

    none_words = {item["word"] for item in crosswalk["mappings"] if item["pictiq"]["mapping"] == "none"}
    cluster_words = [word for cluster in review["candidate_clusters"] for word in cluster["words"]]
    require(len(cluster_words) == len(set(cluster_words)), "NONE cluster words overlap")
    require(set(cluster_words) == none_words and len(none_words) == 85, "NONE clusters must account for exactly all 85 NONE rows")
    require(all(cluster["recommendation"] in CLUSTER_RECOMMENDATIONS for cluster in review["candidate_clusters"]), "invalid cluster recommendation")
    require(all(cluster["independent_utility"] in UTILITY for cluster in review["candidate_clusters"]), "invalid cluster utility")

    word_state_sets = {state: set() for state in GAP_STATES}
    for cluster in review["candidate_clusters"]:
        require(set(cluster["gap_states"]) <= GAP_STATES, f"invalid gap state in cluster: {cluster['name']}")
        classified = set()
        for state, words in cluster["gap_states"].items():
            require(len(words) == len(set(words)), f"duplicate state word in cluster: {cluster['name']}")
            require(set(words) <= set(cluster["words"]), f"state word outside cluster: {cluster['name']}")
            classified.update(words)
            word_state_sets[state].update(words)
        require(classified == set(cluster["words"]), f"unclassified NONE word in cluster: {cluster['name']}")

    for candidate in review["candidate_concepts"]:
        require(set(candidate["source_words"]) <= none_words, f"candidate not grounded exclusively in NONE: {candidate['concept']}")
        require(candidate["recommendation"] in CANDIDATE_RECOMMENDATIONS, "invalid candidate recommendation")
        require(candidate["independent_utility"] in UTILITY, "invalid candidate utility")
        require("_" not in candidate["concept"], "candidate appears to propose a final ID")
        require(set(candidate["gap_states"]) <= GAP_STATES and candidate["gap_states"], f"invalid candidate gap states: {candidate['concept']}")

    cluster_names = {cluster["name"] for cluster in review["candidate_clusters"]}
    safe_refs = [name for group in review["safe_none_groups"] for name in group["clusters"]]
    require(len(safe_refs) == len(set(safe_refs)), "Safe-to-remain-NONE groups overlap")
    require(set(safe_refs) == cluster_names, "Safe-to-remain-NONE groups must summarize every NONE cluster")

    source_pin = crosswalk["sources"]["pictiq"]["commit"]
    require(git_output(pictiq_root, "cat-file", "-t", source_pin) == "commit", "Pictiq source pin unavailable")
    actual_commit = git_output(pictiq_root, "rev-parse", "HEAD")
    require(actual_commit == review["methodology_pictiq_commit"], "Pictiq methodology checkout differs from review pin")
    pinned_index = json.loads(git_output(pictiq_root, "show", f"{source_pin}:lexicon/icon-index.json"))
    pictiq_ids = {item["id"] for item in pinned_index["icons"]}
    for item in expected_a:
        require(all(icon_id in pictiq_ids for icon_id in item["pictiq"]["ids"]), f"invented Pictiq ID: {item['word']}")

    recommendations = Counter(item["recommendation"] for item in review["candidate_concepts"])
    candidate_states = Counter(state for item in review["candidate_concepts"] for state in item["gap_states"])
    require(recommendations == Counter({"POSSIBLE": 9, "STRONG": 2, "DEFER": 2, "REJECT": 2}), "candidate recommendation counts changed")
    require(all("STANDALONE-GAP" in item["gap_states"] for item in review["candidate_concepts"] if item["recommendation"] in {"STRONG", "POSSIBLE"}), "advanced candidate lacks standalone need")
    require(all("OUT-OF-SCOPE" in item["gap_states"] for item in review["candidate_concepts"] if item["recommendation"] == "REJECT"), "rejected candidate lacks out-of-scope classification")
    return {
        "candidate_concepts": len(review["candidate_concepts"]),
        "candidate_embodied_omittable": candidate_states["EMBODIED-OMITTABLE"],
        "candidate_out_of_scope": candidate_states["OUT-OF-SCOPE"],
        "candidate_standalone_gap": candidate_states["STANDALONE-GAP"],
        "defer_candidates": recommendations["DEFER"],
        "none_accounted": len(cluster_words),
        "none_embodied_omittable": len(word_state_sets["EMBODIED-OMITTABLE"]),
        "none_out_of_scope": len(word_state_sets["OUT-OF-SCOPE"]),
        "none_standalone_gap": len(word_state_sets["STANDALONE-GAP"]),
        "none_clusters": len(review["candidate_clusters"]),
        "possible_candidates": recommendations["POSSIBLE"],
        "reject_candidates": recommendations["REJECT"],
        "section_a": len(review_a),
        "strong_candidates": recommendations["STRONG"],
    }


def pictiq_text(item: dict) -> str:
    ids = item["pictiq"]["ids"]
    if not ids:
        return "NONE"
    value = " + ".join(f"`{icon_id}`" for icon_id in ids)
    return f"example: {value}" if item["pictiq"]["mapping"] == "contextual" else value


def states_text(states) -> str:
    return "<br>".join(f"`{state}`" for state in states)


def human_markdown(review: dict, crosswalk: dict, stats: dict) -> str:
    source_by_word = {item["word"]: item for item in crosswalk["mappings"]}
    lines = [
        "# Human Review - Full 120-word Crosswalk", "",
        "> **Decision proposal only.** This document does not change a mapping, approve a candidate, or request a new Pictiq icon.", "",
        review["independent_utility_rule"], "",
        f"The decision workload is reduced from 106 queued rows to **{stats['section_a']} semantic mapping decisions**, **{stats['none_clusters']} NONE clusters**, and **{stats['candidate_concepts']} concept-level candidates**.", "",
        "## Communication-mode interpretation", "",
        review["communication_mode_method"]["rule"], "",
        f"> **Research finding:** {review['communication_mode_method']['finding']}", "",
        "The semantic mapping class and the communication-mode interpretation are separate dimensions. A word can remain `NONE` while its absence is acceptable in live use and still exposes a standalone need. State counts overlap by design.", "",
        f"Across the 85 `NONE` rows: **{stats['none_embodied_omittable']} EMBODIED-OMITTABLE**, **{stats['none_standalone_gap']} STANDALONE-GAP**, and **{stats['none_out_of_scope']} OUT-OF-SCOPE** word classifications.", "",
        "- `EMBODIED-OMITTABLE`: " + review["communication_mode_method"]["states"]["EMBODIED-OMITTABLE"],
        "- `STANDALONE-GAP`: " + review["communication_mode_method"]["states"]["STANDALONE-GAP"],
        "- `OUT-OF-SCOPE`: " + review["communication_mode_method"]["states"]["OUT-OF-SCOPE"], "",
        "## A. Semantic mappings requiring judgment", "",
        "The sole COMPOSED row is **`esun` -> `place_shop + money_coins`**. The sequence communicates practical cash shopping/commerce, but not the full barter/exchange field. Recommendation: **ACCEPT** as a composed approximation; CONTEXTUAL remains the strongest alternative.", "",
        "| Word | Meaning | Current Pictiq | Class | Confidence | Why review? | Alternative | Recommendation |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for decision in review["semantic_review"]:
        source = source_by_word[decision["word"]]
        lines.append(
            f"| `{decision['word']}` | {decision['meaning']} | {pictiq_text(source)} | {source['pictiq']['mapping'].upper()} | "
            f"{source['review_confidence']} | {decision['why_review']} | {decision['alternative']} | **{decision['recommendation']}** |"
        )
    lines += ["", "## B. Candidate concept clusters", "",
              "All 85 source `NONE` rows appear exactly once below. Gap-state word lists are analytical and may overlap; every source mapping remains `NONE`.", "",
              "| Cluster | Toki Pona words | Semantic concepts | Mode classification | Current workaround | Independent utility | Recommendation |",
              "|---|---|---|---|---|---|---|"]
    for cluster in review["candidate_clusters"]:
        words = ", ".join(f"`{word}`" for word in cluster["words"])
        mode = "<br>".join(f"`{state}`: " + ", ".join(f"`{word}`" for word in state_words) for state, state_words in cluster["gap_states"].items())
        lines.append(f"| {cluster['name']} | {words} | {cluster['concepts']} | {mode} | {cluster['workaround']} | {cluster['independent_utility']} | **{cluster['recommendation']}** - {cluster['note']} |")
    lines += ["", "## C. Proposed reusable Pictiq concepts", "",
              f"The re-evaluated shortlist contains **{stats['strong_candidates']} STRONG**, **{stats['possible_candidates']} POSSIBLE**, **{stats['defer_candidates']} DEFER**, and **{stats['reject_candidates']} REJECT** recommendations. Candidate mode tags overlap: **{stats['candidate_embodied_omittable']} EMBODIED-OMITTABLE**, **{stats['candidate_standalone_gap']} STANDALONE-GAP**, and **{stats['candidate_out_of_scope']} OUT-OF-SCOPE**.", "",
              "These remain concept-level questions, not approved additions or final canonical IDs. The color proposal is a parametric modifier direction, not a set of color icons.", "",
              "| Candidate concept | Source words | Mode classification | Proposed role | Existing workaround | Utility | Recommendation | Reason |",
              "|---|---|---|---|---|---|---|---|"]
    for candidate in review["candidate_concepts"]:
        words = ", ".join(f"`{word}`" for word in candidate["source_words"])
        lines.append(f"| {candidate['concept']} | {words} | {states_text(candidate['gap_states'])} | {candidate['role']} | {candidate['workaround']} | {candidate['independent_utility']} | **{candidate['recommendation']}** | {candidate['mode_reason']} |")
    lines += ["", "## D. Safe to remain NONE", "",
              "All 85 rows can remain `NONE` while communication-mode questions are evaluated separately. Individual lexical review is unnecessary in these grouped areas:", ""]
    for group in review["safe_none_groups"]:
        clusters = "; ".join(group["clusters"])
        lines.append(f"- **{group['name']}** ({clusters}): {group['reason']}")
    lines += ["", "## E. Key methodological observations", "",
              "- No strict DIRECT lexical equivalents were found in the 120-word dataset.",
              "- Toki Pona minimizes vocabulary through broad lexical concepts; Pictiq can omit information carried by a present body or situation.",
              "- Standalone signs, cards, stickers, screens, and remote instructions must be re-tested after the communicator and transient context are removed.",
              "- NONE remains the correct mapping class unless semantic equivalence changes; a STANDALONE-GAP is a separate research result.",
              "- Coverage percentages describe this crosswalk and must not be optimized as a score.",
              "- The most controversial current examples remain `a`, `nasa`, and `o`; each is recommended to change to NONE at the later decision stage.", "",
              "## Recommended review order", "",
              "1. Decide the single `esun` COMPOSED row.",
              "2. Decide the 10 CONTEXTUAL rows, starting with `a`, `nasa`, and `o`.",
              "3. Decide the 10 medium-confidence PARTIAL rows, focusing on `musi`, `toki`, `unpa`, and `wawa`.",
              "4. Review the two STRONG candidates, then the nine POSSIBLE standalone questions.",
              "5. Keep every source `NONE` unchanged unless a separate semantic decision changes it.", ""]
    return "\n".join(lines)


def gap_markdown(review: dict, stats: dict) -> str:
    groups = [("STRONG", "Strong reusable candidates"), ("POSSIBLE", "Possible reusable candidates"), ("DEFER", "Deferred questions"), ("REJECT", "Out-of-scope proposals")]
    lines = [
        "# Pictiq semantic gap report", "",
        "This report adds communication mode as a second analytical dimension to the complete 120-word crosswalk. It does not change `crosswalk-120.json` or approve any Pictiq addition.", "",
        "> " + review["communication_mode_method"]["rule"], "",
        f"> **Research finding:** {review['communication_mode_method']['finding']}", "",
        f"All 85 `NONE` rows remain accounted for. Word-level tags overlap: **{stats['none_embodied_omittable']} EMBODIED-OMITTABLE**, **{stats['none_standalone_gap']} STANDALONE-GAP**, and **{stats['none_out_of_scope']} OUT-OF-SCOPE**.", "",
        f"At concept level the shortlist is **{stats['strong_candidates']} STRONG / {stats['possible_candidates']} POSSIBLE / {stats['defer_candidates']} DEFER / {stats['reject_candidates']} REJECT**. It contains **{stats['candidate_standalone_gap']} standalone-gap concepts** and **{stats['candidate_out_of_scope']} out-of-scope concepts**; overlap with the **{stats['candidate_embodied_omittable']} embodied-omittable concepts** is intentional.", "",
        "## How to read the states", "",
        "- **EMBODIED-OMITTABLE** means a live person or visible situation can supply the meaning; it is not evidence that every standalone use is covered.",
        "- **STANDALONE-GAP** means the meaning must remain after the communicator is gone and no current representation preserves it honestly.",
        "- **OUT-OF-SCOPE** means the proposed encoding would copy grammar, create excessive lexical breadth, or lack independent Pictiq utility.", "",
        "A concept can be both EMBODIED-OMITTABLE and STANDALONE-GAP. `lukin`, for example, can be communicated by gaze or pointing live but may need an explicit visual-attention cue in an unattended artifact.", "",
    ]
    for recommendation, title in groups:
        lines += [f"## {title}", ""]
        for candidate in review["candidate_concepts"]:
            if candidate["recommendation"] != recommendation:
                continue
            states = " + ".join(candidate["gap_states"])
            lines.append(f"- **{candidate['concept']}** (`{states}`): {candidate['mode_reason']}")
        lines.append("")
    lines += [
        "## Parametric color direction", "",
        "Color is a strong example of the mode distinction: pointing to a visible color is often sufficient live, while a remote instruction must preserve which color identifies the object. The analytical proposal is one stable parametric visual-modifier family, not separate noun-like icons copied from Toki Pona color words. No form, geometry, palette, ID, syntax, or acceptance decision is proposed here.", "",
        "## Mapping impact", "",
        "- No DIRECT, PARTIAL, COMPOSED, CONTEXTUAL, or NONE classification changed.",
        "- The source dataset, pilot, visual dictionary, and headline statistics remain unchanged.",
        "- Candidate priority still requires independent Pictiq use cases and the normal specification, perceptual, and acceptance workflow.", "",
    ]
    return "\n".join(lines)


def candidate_json(review: dict, crosswalk: dict, stats: dict) -> str:
    recommendation_names = {"STRONG": "strong_candidate", "POSSIBLE": "possible_candidate", "DEFER": "defer", "REJECT": "reject"}
    payload = {
        "pictiq_source_commit": crosswalk["sources"]["pictiq"]["commit"],
        "pictiq_methodology_commit": review["methodology_pictiq_commit"],
        "rule": review["communication_mode_method"]["rule"],
        "counts": {
            "strong": stats["strong_candidates"], "possible": stats["possible_candidates"],
            "defer": stats["defer_candidates"], "reject": stats["reject_candidates"],
            "embodied_omittable_concepts": stats["candidate_embodied_omittable"],
            "standalone_gap_concepts": stats["candidate_standalone_gap"],
            "out_of_scope_concepts": stats["candidate_out_of_scope"],
        },
        "candidates": [
            {
                "concept": item["concept"], "source_words": item["source_words"],
                "gap_states": item["gap_states"], "recommendation": recommendation_names[item["recommendation"]],
                "reason": item["mode_reason"], "suggested_role": item["role"],
            }
            for item in review["candidate_concepts"]
        ],
    }
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pictiq-root", required=True, type=Path)
    parser.add_argument("--check", action="store_true", help="Validate and confirm all generated outputs are current")
    args = parser.parse_args()
    review = load(REVIEW_PATH)
    crosswalk = load(HERE / "crosswalk-120.json")
    stats = validate(review, crosswalk, args.pictiq_root.resolve())
    outputs = {
        HUMAN_OUTPUT: human_markdown(review, crosswalk, stats),
        GAP_OUTPUT: gap_markdown(review, stats),
        CANDIDATE_OUTPUT: candidate_json(review, crosswalk, stats),
    }
    if args.check:
        for path, rendered in outputs.items():
            require(path.is_file() and path.read_text(encoding="utf-8") == rendered, f"{path.name} is stale")
    else:
        for path, rendered in outputs.items():
            path.write_text(rendered, encoding="utf-8")
    print(json.dumps(stats, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
