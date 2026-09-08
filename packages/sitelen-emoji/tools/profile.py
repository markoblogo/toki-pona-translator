from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass(frozen=True)
class Profile:
    name: str
    version: str
    aliases: dict[str, str]
    entries: dict[str, str]


def load_profile(path: Path) -> Profile:
    data = json.loads(path.read_text(encoding="utf-8"))
    return Profile(
        name=data.get("name", ""),
        version=data.get("version", ""),
        aliases={k.lower(): v.lower() for k, v in (data.get("aliases") or {}).items()},
        entries={k.lower(): v for k, v in (data.get("entries") or {}).items()},
    )


def resolve(word: str, profile: Profile) -> Optional[str]:
    w = word.strip().lower()
    base = profile.aliases.get(w, w)
    return profile.entries.get(w) or profile.entries.get(base)
