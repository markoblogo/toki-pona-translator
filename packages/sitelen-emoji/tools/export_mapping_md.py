#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROFILE = ROOT / "profiles" / "default-stable.v1.json"
DEFAULT_WORDS = ROOT / "words" / "nimi_pu.txt"
DEFAULT_ALIASES = ROOT / "words" / "aliases.json"
DEFAULT_OUT = ROOT / "docs" / "mapping.md"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def read_words(path: Path) -> list[str]:
    return [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]


def md_cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ")


def generated_at() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def build_mapping_markdown(profile_path: Path, words_path: Path, aliases_path: Path) -> str:
    profile = read_json(profile_path)
    entries = profile.get("entries") or {}
    aliases = read_json(aliases_path)
    words = read_words(words_path)
    utility_keys = sorted(key for key in entries if key.startswith("_"))

    lines = [
        "# Mapping: toki pona → sitelen emoji",
        "",
        f"Source profile: `{display_path(profile_path)}`",
        f"Generated: `{generated_at()}` UTC",
        "",
        "This document is generated. Do not edit it by hand; run `python3 -m tools.export_mapping_md`.",
        "",
        "## Core words",
        "",
        "| toki pona | sitelen emoji | status | notes |",
        "| --- | --- | --- | --- |",
    ]

    for word in words:
        emoji = entries.get(word, "")
        status = "covered" if emoji else "missing"
        lines.append(f"| `{md_cell(word)}` | {md_cell(emoji)} | {status} |  |")

    lines.extend(
        [
            "",
            "## Aliases",
            "",
            "| alias | canonical | sitelen emoji |",
            "| --- | --- | --- |",
        ]
    )

    for alias, canonical in sorted(aliases.items()):
        emoji = entries.get(alias) or entries.get(canonical, "")
        lines.append(f"| `{md_cell(alias)}` | `{md_cell(canonical)}` | {md_cell(emoji)} |")

    lines.extend(
        [
            "",
            "## Utility entries",
            "",
            "| key | value |",
            "| --- | --- |",
        ]
    )

    for key in utility_keys:
        lines.append(f"| `{md_cell(key)}` | {md_cell(entries[key])} |")

    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Export the frozen sitelen emoji mapping as Markdown.")
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE, help="Profile JSON")
    ap.add_argument("--words", type=Path, default=DEFAULT_WORDS, help="Core words list")
    ap.add_argument("--aliases", type=Path, default=DEFAULT_ALIASES, help="Aliases JSON")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Output Markdown path")
    args = ap.parse_args(argv)

    text = build_mapping_markdown(args.profile, args.words, args.aliases)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
