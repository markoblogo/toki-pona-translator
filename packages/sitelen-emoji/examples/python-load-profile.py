#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILE_PATH = ROOT / "profiles" / "default-stable.v1.json"


profile = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
entries = profile.get("entries") or {}
aliases = profile.get("aliases") or {}


def resolve(word: str) -> str | None:
    base = aliases.get(word, word)
    return entries.get(word) or entries.get(base)


for word in ("jan", "pona", "ali", "ale", "_punct_period"):
    print(f"{word}\t{resolve(word) or '<missing>'}")
