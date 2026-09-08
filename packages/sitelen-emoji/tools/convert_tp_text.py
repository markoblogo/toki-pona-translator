#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

from tools.profile import load_profile, resolve

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROFILE = ROOT / "profiles" / "default-stable.v1.json"

# Leading/trailing punctuation we peel off tokens.
# We keep internal hyphens/apostrophes inside the core.
PUNCT_EDGE_RE = re.compile(r"^([\"'“”‘’(\[\{<]*)(.*?)([\"'“”‘’)\]\}>.,!?;:…]*)$")


def convert_trailing_punct(trailing: str, profile, convert_dot: bool, convert_colon: bool) -> list[str]:
    out: list[str] = []
    for ch in trailing:
        if ch == "." and convert_dot:
            p = resolve("_punct_period", profile)
            out.append(p if p else ch)
        elif ch == ":" and convert_colon:
            p = resolve("_punct_colon", profile)
            out.append(p if p else ch)
        else:
            out.append(ch)
    return out


def convert_line(line: str, profile, convert_dot: bool, convert_colon: bool) -> str:
    # Preserve empty lines
    if not line.strip():
        return ""

    tokens = line.split()
    out_tokens: list[str] = []

    for tok in tokens:
        m = PUNCT_EDGE_RE.match(tok)
        if not m:
            out_tokens.append(tok)
            continue

        leading, core, trailing = m.group(1), m.group(2), m.group(3)

        # leading punctuation: split into individual chars as separate tokens
        for ch in leading:
            if ch:
                out_tokens.append(ch)

        if core:
            mapped = resolve(core, profile)
            out_tokens.append(mapped if mapped else core)
        else:
            # token was only punctuation
            pass

        # trailing punctuation: convert . and : if enabled
        out_tokens.extend(convert_trailing_punct(trailing, profile, convert_dot, convert_colon))

    return " ".join([t for t in out_tokens if t != ""])


def main() -> int:
    ap = argparse.ArgumentParser(description="Convert toki pona text into sitelen emoji tokens using a frozen profile.")
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE, help="Profile JSON (default: frozen v1)")
    ap.add_argument("--in", dest="inp", type=Path, required=True, help="Input .txt/.md file in toki pona")
    ap.add_argument("--out", dest="outp", type=Path, required=True, help="Output file (sitelen emoji tokens)")
    ap.add_argument("--no-dot", action="store_true", help="Do not convert '.' to _punct_period emoji")
    ap.add_argument("--no-colon", action="store_true", help="Do not convert ':' to _punct_colon emoji")
    args = ap.parse_args()

    profile = load_profile(args.profile)

    src = args.inp.read_text(encoding="utf-8")
    lines = src.splitlines()

    out_lines: list[str] = []
    for line in lines:
        out_lines.append(
            convert_line(
                line,
                profile,
                convert_dot=not args.no_dot,
                convert_colon=not args.no_colon,
            )
        )

    # Preserve trailing newline if present
    out_text = "\n".join(out_lines)
    if src.endswith("\n"):
        out_text += "\n"

    args.outp.parent.mkdir(parents=True, exist_ok=True)
    args.outp.write_text(out_text, encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
