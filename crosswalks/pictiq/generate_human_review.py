#!/usr/bin/env python3
"""Validate and render the compact human review for the 120-word crosswalk."""

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
OUTPUT_PATH = HERE / "HUMAN_REVIEW.md"
SECTION_A_RECOMMENDATIONS = {
    "ACCEPT", "CHANGE TO PARTIAL", "CHANGE TO CONTEXTUAL", "CHANGE TO COMPOSED",
    "CHANGE TO NONE", "NEEDS HUMAN DECISION",
}
CLUSTER_RECOMMENDATIONS = {
    "STRONG CANDIDATE", "POSSIBLE CANDIDATE", "COMPOSITION / CONTEXT", "DO NOT ADD",
}
CANDIDATE_RECOMMENDATIONS = {"STRONG", "POSSIBLE", "DEFER", "REJECT"}
UTILITY = {"HIGH", "MEDIUM", "LOW"}


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


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

    for candidate in review["candidate_concepts"]:
        require(set(candidate["source_words"]) <= none_words, f"candidate not grounded exclusively in NONE: {candidate['concept']}")
        require(candidate["recommendation"] in CANDIDATE_RECOMMENDATIONS, "invalid candidate recommendation")
        require(candidate["independent_utility"] in UTILITY, "invalid candidate utility")
        require("_" not in candidate["concept"], "candidate appears to propose a final ID")

    cluster_names = {cluster["name"] for cluster in review["candidate_clusters"]}
    safe_refs = [name for group in review["safe_none_groups"] for name in group["clusters"]]
    require(len(safe_refs) == len(set(safe_refs)), "Safe-to-remain-NONE groups overlap")
    require(set(safe_refs) == cluster_names, "Safe-to-remain-NONE groups must summarize every NONE cluster")

    pictiq_commit = crosswalk["sources"]["pictiq"]["commit"]
    actual_commit = subprocess.check_output(["git", "-C", str(pictiq_root), "rev-parse", "HEAD"], text=True).strip()
    require(actual_commit == pictiq_commit, "Pictiq checkout differs from crosswalk pin")
    pictiq_ids = {item["id"] for item in load(pictiq_root / "lexicon/icon-index.json")["icons"]}
    for item in expected_a:
        require(all(icon_id in pictiq_ids for icon_id in item["pictiq"]["ids"]), f"invented Pictiq ID: {item['word']}")

    recommendations = Counter(item["recommendation"] for item in review["candidate_concepts"])
    return {
        "section_a": len(review_a),
        "none_clusters": len(review["candidate_clusters"]),
        "strong_candidates": recommendations["STRONG"],
        "possible_candidates": recommendations["POSSIBLE"],
        "defer_candidates": recommendations["DEFER"],
        "reject_candidates": recommendations["REJECT"],
        "none_accounted": len(cluster_words),
    }


def pictiq_text(item: dict) -> str:
    ids = item["pictiq"]["ids"]
    if not ids:
        return "NONE"
    value = " + ".join(f"`{icon_id}`" for icon_id in ids)
    return f"example: {value}" if item["pictiq"]["mapping"] == "contextual" else value


def markdown(review: dict, crosswalk: dict, stats: dict) -> str:
    source_by_word = {item["word"]: item for item in crosswalk["mappings"]}
    lines = [
        "# Human Review - Full 120-word Crosswalk", "",
        "> **Decision proposal only.** This document does not change a mapping, approve a candidate, or request a new Pictiq icon.", "",
        review["independent_utility_rule"], "",
        f"The decision workload is reduced from 106 queued rows to **{stats['section_a']} semantic mapping decisions**, **{stats['none_clusters']} NONE clusters**, and a concept-level candidate shortlist.", "",
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
              "All 85 source `NONE` rows appear exactly once below. A candidate label identifies an area for independent Pictiq research; every source mapping remains `NONE`.", "",
              "| Cluster | Toki Pona words | Semantic concepts | Current workaround | Independent utility | Recommendation |",
              "|---|---|---|---|---|---|"]
    for cluster in review["candidate_clusters"]:
        words = ", ".join(f"`{word}`" for word in cluster["words"])
        lines.append(f"| {cluster['name']} | {words} | {cluster['concepts']} | {cluster['workaround']} | {cluster['independent_utility']} | **{cluster['recommendation']}** - {cluster['note']} |")

    lines += ["", "## C. Proposed reusable Pictiq concepts", "",
              "These are concept-level questions, not approved additions or final canonical IDs.", "",
              "| Candidate concept | Source Toki Pona words | Proposed Pictiq role | Existing workaround | Independent utility | Recommendation |",
              "|---|---|---|---|---|---|"]
    for candidate in review["candidate_concepts"]:
        words = ", ".join(f"`{word}`" for word in candidate["source_words"])
        lines.append(f"| {candidate['concept']} | {words} | {candidate['role']} | {candidate['workaround']} | {candidate['independent_utility']} | **{candidate['recommendation']}** |")

    lines += ["", "## D. Safe to remain NONE", "",
              "All 85 rows can remain `NONE` by default while concept-level questions are evaluated separately. Individual review is unnecessary in these grouped areas:", ""]
    for group in review["safe_none_groups"]:
        clusters = "; ".join(group["clusters"])
        lines.append(f"- **{group['name']}** ({clusters}): {group['reason']}")

    lines += ["", "## E. Key methodological observations", "",
              "- No strict DIRECT lexical equivalents were found in the 120-word dataset.",
              "- Toki Pona minimizes vocabulary through broad lexical concepts; Pictiq minimizes short communication through intent and context.",
              "- NONE remains the correct default when independent Pictiq utility is absent or unproven.",
              "- Coverage percentages describe this crosswalk and must not be optimized as a score.",
              "- Lexical completeness is not a Pictiq goal.",
              "- The most controversial current examples are `a`, `nasa`, and `o`; each is recommended to change to NONE at the later decision stage.",
              "- The strongest reusable questions remain a neutral person and a generic building/home.", "",
              "## Recommended review order", "",
              "1. Decide the single `esun` COMPOSED row.",
              "2. Decide the 10 CONTEXTUAL rows, starting with `a`, `nasa`, and `o`.",
              "3. Decide the 10 medium-confidence PARTIAL rows, focusing on `musi`, `toki`, `unpa`, and `wawa`.",
              "4. Review the two STRONG concept candidates, then the POSSIBLE shortlist.",
              "5. Accept the grouped Safe-to-remain-NONE default unless a concrete Pictiq use case reopens a cluster.", ""]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pictiq-root", required=True, type=Path)
    parser.add_argument("--check", action="store_true", help="Validate and confirm generated Markdown is current")
    args = parser.parse_args()
    review = load(REVIEW_PATH)
    crosswalk = load(HERE / "crosswalk-120.json")
    stats = validate(review, crosswalk, args.pictiq_root.resolve())
    rendered = markdown(review, crosswalk, stats)
    if args.check:
        require(OUTPUT_PATH.is_file() and OUTPUT_PATH.read_text(encoding="utf-8") == rendered, "HUMAN_REVIEW.md is stale")
    else:
        OUTPUT_PATH.write_text(rendered, encoding="utf-8")
    print(json.dumps(stats, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
