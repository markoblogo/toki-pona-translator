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
    require(review["status"] == "resolved" and review["resolution"]["unresolved_rows"] == 0, "human review is unresolved")
    require(set(review["communication_mode_method"]["states"]) == GAP_STATES, "gap-state definitions changed")

    full_by_word = {item["word"]: item for item in crosswalk["mappings"]}
    require(len(full_by_word) == 120, "full crosswalk is not 120 unique words")
    mapping_counts = Counter(item["pictiq"]["mapping"].upper() for item in crosswalk["mappings"])
    confidence_counts = Counter(item["review_confidence"] for item in crosswalk["mappings"])
    require({key: mapping_counts[key] for key in review["resolution"]["mapping_counts"]} == review["resolution"]["mapping_counts"], "resolved mapping counts are stale")
    require(dict(confidence_counts) == review["resolution"]["confidence_counts"], "resolved confidence counts are stale")
    require(sum(len(item["pictiq"]["ids"]) == 1 for item in crosswalk["mappings"]) == review["resolution"]["one_tile"], "resolved one-tile count is stale")
    require(sum(len(item["pictiq"]["ids"]) > 1 for item in crosswalk["mappings"]) == review["resolution"]["multiple_tiles"], "resolved multi-tile count is stale")
    require(sum(not item["pictiq"]["ids"] for item in crosswalk["mappings"]) == review["resolution"]["no_representation"], "resolved NONE count is stale")
    expected_a = section_a_source_rows(crosswalk)
    review_a = review["semantic_review"]
    require({item["word"] for item in review_a} == {item["word"] for item in expected_a}, "Section A selection mismatch")
    require(len({item["word"] for item in review_a}) == len(review_a), "duplicate Section A word")
    require(all(item["recommendation"] in SECTION_A_RECOMMENDATIONS for item in review_a), "invalid Section A recommendation")

    none_words = {item["word"] for item in crosswalk["mappings"] if item["pictiq"]["mapping"] == "none"}
    cluster_words = [word for cluster in review["candidate_clusters"] for word in cluster["words"]]
    require(len(cluster_words) == len(set(cluster_words)), "NONE cluster words overlap")
    require(set(cluster_words) == none_words and len(none_words) == 88, "NONE clusters must account for exactly all 88 NONE rows")
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
    require(review["accepted_architecture"]["pictiq_commit"] == actual_commit, "accepted architecture pin differs from Pictiq checkout")
    architecture = review["accepted_architecture"]
    require([len(architecture[key]) for key in ("strong_development_candidates", "standalone_implementation_candidates", "protocol_mechanisms", "deferred", "rejected")] == [2, 12, 4, 3, 7], "accepted architecture backlog changed")
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


def architecture_item(item: dict) -> str:
    words = ", ".join(f"`{word}`" for word in item["source_words"])
    source = f" — source: {words}" if words else ""
    return f"- **{item['concept']}** (`{item['class']}`){source}"


def human_markdown(review: dict, crosswalk: dict, stats: dict) -> str:
    source_by_word = {item["word"]: item for item in crosswalk["mappings"]}
    resolution = review["resolution"]
    lines = [
        "# Human Review - Full 120-word Crosswalk", "",
        "> **Status: RESOLVED — 2026-09-09.** The decisions below are applied to the canonical research dataset.", "",
        resolution["context"], "",
        f"Final mapping counts: **0 DIRECT / 19 PARTIAL / 2 COMPOSED / 11 CONTEXTUAL / 88 NONE**. Confidence remains **98 high / 19 medium / 3 low**. One tile: **30**; multiple tiles: **2**; no representation: **88**; unresolved review rows: **0**.", "",
        review["independent_utility_rule"], "",
        "## Communication-mode interpretation", "",
        review["communication_mode_method"]["rule"], "",
        f"> **Research finding:** {review['communication_mode_method']['finding']}", "",
        "Semantic mapping class and communication-mode interpretation remain separate dimensions. A word can remain `NONE` while embodiment covers live use and standalone use exposes a future development need.", "",
        f"Across the 88 `NONE` rows: **{stats['none_embodied_omittable']} EMBODIED-OMITTABLE**, **{stats['none_standalone_gap']} STANDALONE-GAP**, and **{stats['none_out_of_scope']} OUT-OF-SCOPE** word classifications. State counts overlap by design.", "",
        "- `EMBODIED-OMITTABLE`: " + review["communication_mode_method"]["states"]["EMBODIED-OMITTABLE"],
        "- `STANDALONE-GAP`: " + review["communication_mode_method"]["states"]["STANDALONE-GAP"],
        "- `OUT-OF-SCOPE`: " + review["communication_mode_method"]["states"]["OUT-OF-SCOPE"], "",
        "## A. Resolved semantic decisions", "",
        "The table preserves the review reasoning and historical proposal while recording the applied final decision.", "",
        "| Word | Meaning | Final Pictiq | Final class | Confidence | Why reviewed? | Historical proposal | Final decision |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for decision in review["semantic_review"]:
        source = source_by_word[decision["word"]]
        historical = f"{decision['recommendation']}: {decision['alternative']}"
        lines.append(
            f"| `{decision['word']}` | {decision['meaning']} | {pictiq_text(source)} | {source['pictiq']['mapping'].upper()} | "
            f"{source['review_confidence']} | {decision['why_review']} | {historical} | **{decision['final_decision']}** |"
        )
    lines += ["", "## B. NONE concept clusters", "",
              "All 88 final `NONE` rows appear exactly once below. Gap-state word lists may overlap; future Pictiq candidates do not change the semantic mapping.", "",
              "| Cluster | Toki Pona words | Semantic concepts | Mode classification | Current workaround | Independent utility | Research disposition |",
              "|---|---|---|---|---|---|---|"]
    for cluster in review["candidate_clusters"]:
        words = ", ".join(f"`{word}`" for word in cluster["words"])
        mode = "<br>".join(f"`{state}`: " + ", ".join(f"`{word}`" for word in state_words) for state, state_words in cluster["gap_states"].items())
        lines.append(f"| {cluster['name']} | {words} | {cluster['concepts']} | {mode} | {cluster['workaround']} | {cluster['independent_utility']} | **{cluster['recommendation']}** - {cluster['note']} |")
    lines += ["", "## C. Historical concept shortlist", "",
              f"The pre-acceptance shortlist contained **{stats['strong_candidates']} STRONG**, **{stats['possible_candidates']} POSSIBLE**, **{stats['defer_candidates']} DEFER**, and **{stats['reject_candidates']} REJECT** recommendations. It is retained as research history; the accepted architectural backlog below supersedes it for development planning.", "",
              "| Candidate concept | Source words | Mode classification | Proposed role | Existing workaround | Utility | Historical recommendation | Reason |",
              "|---|---|---|---|---|---|---|---|"]
    for candidate in review["candidate_concepts"]:
        words = ", ".join(f"`{word}`" for word in candidate["source_words"])
        lines.append(f"| {candidate['concept']} | {words} | {states_text(candidate['gap_states'])} | {candidate['role']} | {candidate['workaround']} | {candidate['independent_utility']} | **{candidate['recommendation']}** | {candidate['mode_reason']} |")
    architecture = review["accepted_architecture"]
    lines += ["", "## D. Accepted Pictiq architecture backlog", "",
              "These are accepted development directions, not implemented icons, IDs, modifiers, parameters, entity registries, or canonical lexicon entries.", "",
              "### Strong development candidates", ""]
    lines += [architecture_item(item) for item in architecture["strong_development_candidates"]]
    lines += ["", "### Standalone implementation candidates", ""]
    lines += [architecture_item(item) for item in architecture["standalone_implementation_candidates"]]
    lines += ["", "### Protocol mechanisms", ""]
    lines += [architecture_item(item) for item in architecture["protocol_mechanisms"]]
    lines += ["", "### Deferred", ""]
    lines += [architecture_item(item) for item in architecture["deferred"]]
    lines += ["", "### Rejected directions", ""]
    lines += [f"- {item}" for item in architecture["rejected"]]
    lines += ["", "## E. Final methodological findings", "",
              "- `NONE` is not a single failure state and does not imply an icon gap.",
              "- `jan`, `lukin`, and color words remain `NONE` even though they expose standalone development mechanisms.",
              "- GOOD/BAD and LARGE/SMALL belong in modifier research rather than noun-like lexical expansion.",
              "- Proper names expose scoped entity symbols rather than lexical or alphabetic completeness.",
              "- Color exposes a proposed parametric mechanism rather than a finite color vocabulary.",
              "- Toki Pona grammar remains outside Pictiq scope.",
              "- Coverage percentages describe interoperability and were not optimization targets.", ""]
    return "\n".join(lines)


def gap_markdown(review: dict, stats: dict) -> str:
    architecture = review["accepted_architecture"]
    lines = [
        "# Pictiq semantic gap report", "",
        "> **Status: ACCEPTED RESEARCH DIRECTION — IMPLEMENTATION NOT STARTED.**", "",
        "This report interprets the final 120-word crosswalk through Pictiq's Embodied/Standalone architecture. It does not create canonical icons, IDs, modifiers, parameters, entity symbols, packs, or registries.", "",
        "> " + review["communication_mode_method"]["rule"], "",
        f"> **Research finding:** {review['communication_mode_method']['finding']}", "",
        f"All 88 final `NONE` rows are accounted for. Word-level tags overlap: **{stats['none_embodied_omittable']} EMBODIED-OMITTABLE**, **{stats['none_standalone_gap']} STANDALONE-GAP**, and **{stats['none_out_of_scope']} OUT-OF-SCOPE**.", "",
        "## Strong development candidates", "",
    ]
    lines += [architecture_item(item) for item in architecture["strong_development_candidates"]]
    lines += ["", "## Standalone implementation candidates", ""]
    lines += [architecture_item(item) for item in architecture["standalone_implementation_candidates"]]
    lines += ["", "GOOD/BAD remain separate from YES/NO. Energy/electricity does not include physical strength. Light and sun/day remain separate until tested.", "",
              "## Protocol mechanisms", ""]
    lines += [architecture_item(item) for item in architecture["protocol_mechanisms"]]
    lines += ["", "LARGE/SMALL are scale modifiers, not aliases for quantity. Emission marks are a visual convention, not a standalone semantic tile.", "",
              "## Entity-symbol finding", "", architecture["entity_symbol_finding"], "",
              "No entity symbols or namespaces are implemented by this research cycle.", "",
              "## Parametric color finding", "", architecture["parametric_color_finding"], "",
              "No red, yellow, blue, green, or other canonical lexical color icons are proposed.", "",
              "## Deferred", ""]
    lines += [architecture_item(item) for item in architecture["deferred"]]
    lines += ["", "## Rejected directions", ""]
    lines += [f"- {item}" for item in architecture["rejected"]]
    lines += ["", "## Final semantic impact", "",
              "- `esun` remains COMPOSED as `place_shop + money_coins`.",
              "- `mute` is COMPOSED as `qty_5 + qty_plus`.",
              "- `a`, `nasa`, and `o` are NONE.",
              "- `musi`, `toki`, `unpa`, and `wawa` are CONTEXTUAL examples.",
              "- Existing future candidates do not convert any other NONE mapping.",
              "- Final counts are 0 DIRECT / 19 PARTIAL / 2 COMPOSED / 11 CONTEXTUAL / 88 NONE.", ""]
    return "\n".join(lines)


def candidate_json(review: dict, crosswalk: dict, stats: dict) -> str:
    architecture = review["accepted_architecture"]
    payload = {
        "status": architecture["status"],
        "pictiq_source_commit": crosswalk["sources"]["pictiq"]["commit"],
        "pictiq_methodology_commit": review["methodology_pictiq_commit"],
        "semantic_mapping_counts": review["resolution"]["mapping_counts"],
        "communication_mode_counts": {
            "none_words": stats["none_accounted"],
            "embodied_omittable_words": stats["none_embodied_omittable"],
            "standalone_gap_words": stats["none_standalone_gap"],
            "out_of_scope_words": stats["none_out_of_scope"],
            "counts_overlap": True,
        },
        "strong_development_candidates": architecture["strong_development_candidates"],
        "standalone_implementation_candidates": architecture["standalone_implementation_candidates"],
        "protocol_mechanisms": architecture["protocol_mechanisms"],
        "deferred": architecture["deferred"],
        "rejected": architecture["rejected"],
        "entity_symbol_finding": architecture["entity_symbol_finding"],
        "parametric_color_finding": architecture["parametric_color_finding"],
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
