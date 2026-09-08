from __future__ import annotations

import unicodedata

# Variation selectors: text/emoji presentation
VS15 = 0xFE0E
VS16 = 0xFE0F

def emoji_to_codepoints(s: str) -> list[int]:
    # Python strings are Unicode scalar values; iterating gives code points.
    return [ord(ch) for ch in s]

def to_twemoji_slug(s: str) -> str:
    """
    Twemoji assets are named by hex codepoints joined with '-'.
    In most cases FE0F is omitted in filenames (Twemoji convention).
    """
    cps = []
    for cp in emoji_to_codepoints(s):
        if cp in (VS15, VS16):
            continue
        cps.append(cp)
    return "-".join(f"{cp:x}" for cp in cps)

def is_probably_emoji_token(token: str) -> bool:
    # Heuristic: if it contains any char in emoji-ish categories or is non-ascii symbol.
    # Good enough for our space-separated pipeline.
    return any(ord(ch) > 0x7F for ch in token) and token.strip() != ""
