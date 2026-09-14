#!/usr/bin/env python3
"""Build or verify the non-normative crosswalk adapter for current Pictiq IDs."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from pathlib import Path


HERE = Path(__file__).resolve().parent
CROSSWALK = HERE / "crosswalk-120.json"
OUTPUT = HERE / "adapter-v1.json"


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(pictiq_root: Path) -> dict:
    crosswalk = load(CROSSWALK)
    lexicon_path = pictiq_root / "lexicon/icon-index.json"
    compatibility_path = pictiq_root / "lexicon/compatibility.json"
    lexicon = load(lexicon_path)
    compatibility = load(compatibility_path)
    active = {item["id"] for item in lexicon["icons"]}
    migrations = {item["legacy_id"]: item for item in compatibility["migrations"]}
    used = sorted({icon_id for row in crosswalk["mappings"] for icon_id in row["pictiq"]["ids"]})
    resolutions = {}

    for icon_id in used:
        if icon_id in active:
            resolutions[icon_id] = {"status": "active", "current_ids": [icon_id]}
            continue
        migration = migrations.get(icon_id)
        if not migration:
            raise SystemExit(f"unresolved Pictiq identifier: {icon_id}")
        current_ids = ([migration["preferred_id"]] if "preferred_id" in migration
                       else migration.get("preferred_composition", []))
        if not current_ids or any(current_id not in active for current_id in current_ids):
            raise SystemExit(f"invalid Pictiq migration for {icon_id}: {current_ids}")
        resolutions[icon_id] = {
            "status": "migrated",
            "current_ids": current_ids,
            "kind": migration["kind"],
        }

    return {
        "schema_version": "1.0.0",
        "status": "NON_NORMATIVE_COMPATIBILITY_ADAPTER",
        "source_crosswalk": {
            "file": "crosswalks/pictiq/crosswalk-120.json",
            "schema_version": crosswalk["schema_version"],
            "accepted_pictiq_commit": crosswalk["sources"]["pictiq"]["commit"],
        },
        "target_pictiq": {
            "repository": "https://github.com/markoblogo/pictiq",
            "commit": subprocess.check_output(
                ["git", "-C", str(pictiq_root), "rev-parse", "HEAD"], text=True
            ).strip(),
            "lexicon_file": "lexicon/icon-index.json",
            "lexicon_version": lexicon["version"],
            "lexicon_sha256": digest(lexicon_path),
            "compatibility_file": "lexicon/compatibility.json",
            "compatibility_sha256": digest(compatibility_path),
        },
        "policy": (
            "Research classifications remain frozen. Consumers may resolve historical Pictiq IDs "
            "through this adapter; the adapter does not change the Pictiq protocol or crosswalk semantics."
        ),
        "resolutions": resolutions,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pictiq-root", type=Path, required=True)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    result = build(args.pictiq_root.resolve())
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("Pictiq compatibility adapter is stale; regenerate adapter-v1.json")
        print(f"adapter current: {len(result['resolutions'])} identifiers")
    else:
        OUTPUT.write_text(rendered, encoding="utf-8")
        print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
