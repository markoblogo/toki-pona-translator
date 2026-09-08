from __future__ import annotations

import json
import re
from functools import lru_cache
from importlib import resources
from pathlib import Path
from typing import Any

DEFAULT_PROFILE_RESOURCE = ("profiles", "default-stable.v1.json")
TOKEN_RE = re.compile(r"[A-Za-z_][A-Za-z0-9_-]*|[.:]")


def load_profile(path: str | Path | None = None) -> dict[str, Any]:
    """Load a profile JSON file, or the bundled default profile when no path is provided."""
    if path is None:
        return default_profile()
    return json.loads(Path(path).read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def default_profile() -> dict[str, Any]:
    profile_text = resources.files(__package__).joinpath(*DEFAULT_PROFILE_RESOURCE).read_text(encoding="utf-8")
    return json.loads(profile_text)


def lookup(word: str, profile: dict[str, Any] | None = None) -> str | None:
    """Return the sitelen emoji for a word, alias, or utility token."""
    data = profile or default_profile()
    entries = data.get("entries") or {}
    aliases = data.get("aliases") or {}
    key = word.strip().lower()
    base = aliases.get(key, key)
    return entries.get(key) or entries.get(base)


def translate(text: str, profile: dict[str, Any] | None = None) -> str:
    """Translate known toki pona tokens to sitelen emoji, preserving other text."""
    data = profile or default_profile()
    punct = {".": "_punct_period", ":": "_punct_colon"}

    def replace(match: re.Match[str]) -> str:
        token = match.group(0)
        key = punct.get(token, token)
        return lookup(key, data) or token

    return TOKEN_RE.sub(replace, text)


defaultProfile = default_profile()

__all__ = ["defaultProfile", "default_profile", "load_profile", "lookup", "translate"]
