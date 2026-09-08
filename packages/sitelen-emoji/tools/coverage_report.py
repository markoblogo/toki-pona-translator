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
DEFAULT_OUT = ROOT / "docs" / "coverage.md"


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


def analyze(
    entries: dict[str, str],
    words: list[str],
    aliases: dict[str, str],
) -> tuple[list[str], list[tuple[str, str, str, str]], list[str]]:
    missing_words = [word for word in words if word not in entries]
    alias_rows: list[tuple[str, str, str, str]] = []
    broken_aliases: list[str] = []

    for alias, canonical in sorted(aliases.items()):
        alias_emoji = entries.get(alias)
        canonical_emoji = entries.get(canonical)
        resolved_emoji = alias_emoji or canonical_emoji
        if canonical_emoji and resolved_emoji == canonical_emoji:
            status = "resolved"
            emoji = resolved_emoji
        else:
            status = "broken"
            emoji = resolved_emoji or ""
            broken_aliases.append(alias)
        alias_rows.append((alias, canonical, status, emoji))

    return missing_words, alias_rows, broken_aliases


def build_coverage_markdown(profile_path: Path, words_path: Path, aliases_path: Path) -> tuple[str, int]:
    profile = read_json(profile_path)
    entries = profile.get("entries") or {}
    aliases = read_json(aliases_path)
    words = read_words(words_path)
    utility_keys = sorted(key for key in entries if key.startswith("_"))
    missing_words, alias_rows, broken_aliases = analyze(entries, words, aliases)
    covered_count = len(words) - len(missing_words)
    resolved_count = len(alias_rows) - len(broken_aliases)

    lines = [
        "# Coverage report",
        "",
        f"Source profile: `{display_path(profile_path)}`",
        f"Generated: `{generated_at()}` UTC",
        "",
        "## Summary",
        "",
        f"- Core words covered: **{covered_count}/{len(words)}**",
        f"- Missing core words: **{len(missing_words)}**",
        f"- Aliases resolved: **{resolved_count}/{len(alias_rows)}**",
        f"- Utility entries: **{len(utility_keys)}**",
        "",
        "## Core word coverage",
        "",
        "| word | status | sitelen emoji |",
        "| --- | --- | --- |",
    ]

    for word in words:
        emoji = entries.get(word, "")
        status = "covered" if emoji else "missing"
        lines.append(f"| `{md_cell(word)}` | {status} | {md_cell(emoji)} |")

    lines.extend(
        [
            "",
            "## Aliases",
            "",
            "| alias | canonical | status | sitelen emoji |",
            "| --- | --- | --- | --- |",
        ]
    )

    for alias, canonical, status, emoji in alias_rows:
        lines.append(f"| `{md_cell(alias)}` | `{md_cell(canonical)}` | {status} | {md_cell(emoji)} |")

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

    if missing_words:
        lines.extend(["", "## Missing words", ""])
        for word in missing_words:
            lines.append(f"- `{md_cell(word)}`")

    if broken_aliases:
        lines.extend(["", "## Broken aliases", ""])
        for alias, canonical, status, emoji in alias_rows:
            if status == "broken":
                lines.append(f"- `{md_cell(alias)}` → `{md_cell(canonical)}` ({md_cell(emoji) or 'missing'})")

    rc = 1 if missing_words or broken_aliases else 0
    return "\n".join(lines) + "\n", rc


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Generate a coverage report for the frozen sitelen emoji profile.")
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE, help="Profile JSON")
    ap.add_argument("--words", type=Path, default=DEFAULT_WORDS, help="Core words list")
    ap.add_argument("--aliases", type=Path, default=DEFAULT_ALIASES, help="Aliases JSON")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Output Markdown path")
    args = ap.parse_args(argv)

    text, rc = build_coverage_markdown(args.profile, args.words, args.aliases)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(text, encoding="utf-8")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
