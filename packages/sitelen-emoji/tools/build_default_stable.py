#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen, Request

ROOT = Path(__file__).resolve().parents[1]
WORDS_FILE = ROOT / "words" / "nimi_pu.txt"
ALIASES_FILE = ROOT / "words" / "aliases.json"
DIST_DIR = ROOT / "dist"
DIST_DIR.mkdir(exist_ok=True)

UPSTREAM_URL = "https://raw.githubusercontent.com/devbali/desktop-sitelen-emoji/master/sitelenemoji.json"

def load_lines(path: Path):
    return [ln.strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.strip() and not ln.strip().startswith("#")]

def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))

def fetch_json(url: str):
    req = Request(url, headers={"User-Agent": "sitelen-emoji-truth/0.1"})
    with urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))

def normalize_word(w: str) -> str:
    return w.strip().lower()

def extract_mapping(upstream) -> dict[str, str]:
    """
    Пытается вытянуть word->emoji из нескольких распространённых форматов:
    - dict: {"a":"❗", ...}
    - list: [{"Word":"a","Emoji":"❗", ...}, ...]
    - list: [{"word":"a","emoji":"❗", ...}, ...]
    - dict с вложением: {"data":[...]} или {"words":[...]} и т.п.
    """
    def pick_fields(obj: dict):
        # ищем ключи без учёта регистра
        lk = {k.lower(): k for k in obj.keys()}
        w_key = lk.get("word") or lk.get("nimi") or lk.get("tp_word")
        e_key = lk.get("emoji") or lk.get("glyph") or lk.get("char")
        if not w_key or not e_key:
            return None
        w = obj.get(w_key)
        e = obj.get(e_key)
        if isinstance(w, str) and isinstance(e, str) and w.strip() and e.strip():
            return normalize_word(w), e
        return None

    # 1) прямой dict word->emoji
    if isinstance(upstream, dict):
        # если это “обёртка”, попробуем найти в ней список
        for k in ("data", "words", "items", "entries", "dictionary"):
            if k in upstream and isinstance(upstream[k], (list, dict)):
                try_map = extract_mapping(upstream[k])
                if try_map:
                    return try_map

        # иначе пробуем как mapping
        if all(isinstance(k, str) for k in upstream.keys()):
            out = {}
            for k, v in upstream.items():
                if isinstance(v, str) and v.strip():
                    out[normalize_word(k)] = v
            if out:
                return out

    # 2) список объектов
    if isinstance(upstream, list):
        out = {}
        for item in upstream:
            if isinstance(item, dict):
                pair = pick_fields(item)
                if pair:
                    w, e = pair
                    out[w] = e
        if out:
            return out

    return {}

def strip_variation_selectors(s: str) -> str:
    # на всякий случай нормализуем VS16/VS15, если нужно
    return s

def main():
    pu_words = [normalize_word(w) for w in load_lines(WORDS_FILE)]
    aliases = {normalize_word(k): normalize_word(v) for k, v in load_json(ALIASES_FILE).items()}

    upstream = fetch_json(UPSTREAM_URL)
    mapping = extract_mapping(upstream)

    # В stable добавляем: 120 слов + алиасы
    required = set(pu_words) | set(aliases.keys())

    missing = []
    entries = {}

    for w in sorted(required):
        base = aliases.get(w, w)
        emoji = mapping.get(w) or mapping.get(base)
        if not emoji:
            missing.append(w)
            continue
        entries[w] = strip_variation_selectors(emoji)

    # Добавим рекомендованную пунктуацию как отдельные “служебные” записи
    # (это не слова toki pona, но полезно для книг/экспорта)
    entries["_punct_period"] = "➖️"
    entries["_punct_colon"] = "➗️"

    out = {
        "name": "sitelen-emoji default-stable",
        "version": "0.1.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sources": [
            {"type": "upstream_json", "url": UPSTREAM_URL}
        ],
        "aliases": aliases,
        "entries": entries
    }

    (DIST_DIR / "default-stable.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    # отчёт
    extras = sorted(set(mapping.keys()) - required)
    report = []
    report.append(f"# Build report\n")
    report.append(f"- required words (pu+aliases): {len(required)}")
    report.append(f"- entries produced (incl. punct): {len(entries)}")
    report.append(f"- missing: {len(missing)}")
    if missing:
        report.append("\n## Missing\n")
        report.extend([f"- {w}" for w in missing])
    report.append(f"\n## Upstream extra keys (first 50)\n")
    for w in extras[:50]:
        report.append(f"- {w}")
    (DIST_DIR / "report.md").write_text("\n".join(report), encoding="utf-8")

    if missing:
        print("Build finished with missing words:", ", ".join(missing))
        sys.exit(2)

    print("OK: dist/default-stable.json generated")

if __name__ == "__main__":
    main()
