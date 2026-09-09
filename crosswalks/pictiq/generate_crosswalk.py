#!/usr/bin/env python3
"""Validate and render the full 120-word Toki Pona/Pictiq crosswalk."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import tomllib
import urllib.request
from collections import Counter
from pathlib import Path

from generate_pilot import centered_text, fetch_twemoji, fit_lines, font_path, require, sha256


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DATA_PATH = HERE / "crosswalk-120.json"
CLASSES = ("direct", "partial", "composed", "contextual", "none")
CONFIDENCES = ("high", "medium", "low")
CLASS_COLORS = {
    "direct": "#DDF2E3", "partial": "#F5E9BF", "composed": "#E8DFF2",
    "contextual": "#DDEAF5", "none": "#E7E7E7",
}
PILOT_WORDS = {
    "telo", "moku", "mani", "tomo", "ilo", "jan", "luka", "lukin", "tawa", "pali",
    "jo", "wile", "pona", "ike", "suli", "lili", "seme", "ala", "ken", "pilin",
}
FINAL_DECISIONS = {
    "esun": ("composed", ("place_shop", "money_coins")),
    "mute": ("composed", ("qty_5", "qty_plus")),
    "a": ("none", ()), "nasa": ("none", ()), "o": ("none", ()),
    "ike": ("contextual", ("logic_no",)), "ken": ("contextual", ("logic_yes",)),
    "lape": ("contextual", ("place_hotel",)), "pakala": ("contextual", ("service_tools",)),
    "pini": ("contextual", ("logic_no",)), "pona": ("contextual", ("logic_yes",)),
    "wile": ("contextual", ("need_water",)), "musi": ("contextual", ("place_disco",)),
    "toki": ("contextual", ("comm_phone",)), "unpa": ("contextual", ("item_condom",)),
    "wawa": ("contextual", ("power_plug",)), "kasi": ("partial", ("nature_flower",)),
    "kili": ("partial", ("need_food",)), "open": ("partial", ("logic_yes",)),
    "pan": ("partial", ("need_food",)), "pilin": ("partial", ("love_heart",)),
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def fetch_pinned_glosses(data: dict) -> dict:
    source = data["sources"]["english_glosses"]
    request = urllib.request.Request(source["url"].replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/"),
                                     headers={"User-Agent": "toki-pona-pictiq-crosswalk/1.1"})
    with urllib.request.urlopen(request, timeout=30) as response:
        content = response.read()
    require(hashlib.sha256(content).hexdigest() == source["file_sha256"], "pinned English gloss source hash changed")
    return tomllib.loads(content.decode("utf-8"))


def review_items(data: dict) -> list[dict]:
    selected = []
    for item in data["mappings"]:
        mapping = item["pictiq"]["mapping"]
        confidence = item["review_confidence"]
        if mapping in {"none", "composed", "contextual"} or confidence == "low" or (
            confidence == "medium" and mapping in {"partial", "direct"}
        ):
            selected.append(item)
    return selected


def validate(data: dict, pictiq_root: Path, *, online: bool = True) -> dict:
    sources = data["sources"]
    vocab_path = ROOT / sources["toki_pona_repository"]["vocabulary_file"]
    recognition_path = ROOT / sources["toki_pona_repository"]["display_recognition_lexicon"]
    emoji_path = ROOT / sources["sitelen_emoji"]["canonical_profile"]
    font_file = ROOT / sources["sitelen_pona"]["font_file"]
    font_license = ROOT / sources["sitelen_pona"]["license_file"]
    pictiq_lexicon_path = pictiq_root / sources["pictiq"]["lexicon_file"]
    notices = ROOT / data["third_party_notices"]
    for path, expected in [
        (vocab_path, sources["toki_pona_repository"]["vocabulary_sha256"]),
        (recognition_path, sources["toki_pona_repository"]["display_recognition_lexicon_sha256"]),
        (emoji_path, sources["sitelen_emoji"]["profile_sha256"]),
        (font_file, sources["sitelen_pona"]["font_sha256"]),
        (pictiq_lexicon_path, sources["pictiq"]["lexicon_sha256"]),
    ]:
        require(path.is_file(), f"missing source: {path}")
        require(sha256(path) == expected, f"source hash changed: {path}")
    require(font_license.is_file() and notices.is_file(), "source license/notice missing")
    require(sources["english_glosses"]["commit"] == "c2c56d2769b369af89c6c239d45aa616ba6d7b77", "gloss pin changed")
    require(sources["sitelen_emoji"]["upstream_license"] == "BSD-3-Clause", "sitelen emoji license changed")

    words = vocab_path.read_text(encoding="utf-8").splitlines()
    require(len(words) == len(set(words)) == 120, "canonical nimi_pu scope must be exactly 120 unique words")
    mappings = data["mappings"]
    require([item["word"] for item in mappings] == words, "crosswalk order/set differs from canonical nimi_pu")
    require(len(mappings) == 120, "crosswalk must contain exactly 120 rows")
    require(data["human_review"]["status"] == "resolved", "human review is not resolved")
    emoji = load_json(emoji_path)["entries"]
    require(all(word in emoji for word in words), "frozen sitelen emoji profile does not resolve all 120 words")
    pictiq = load_json(pictiq_lexicon_path)
    require(pictiq["version"] == sources["pictiq"]["lexicon_version"], "Pictiq lexicon version changed")
    pictiq_ids = {entry["id"] for entry in pictiq["icons"]}
    actual_commit = subprocess.check_output(["git", "-C", str(pictiq_root), "rev-parse", "HEAD"], text=True).strip()
    require(actual_commit == sources["pictiq"]["commit"], f"Pictiq checkout is {actual_commit}, expected pinned commit")
    glosses = fetch_pinned_glosses(data) if online else None
    hb_shape = subprocess.run(["which", "hb-shape"], capture_output=True, text=True).stdout.strip()
    require(bool(hb_shape), "hb-shape is required for exact sitelen pona glyph validation")

    for item in mappings:
        word, mapping = item["word"], item["pictiq"]["mapping"]
        ids = item["pictiq"]["ids"]
        require(mapping in CLASSES, f"invalid mapping class: {word}")
        require(item["review_confidence"] in CONFIDENCES, f"invalid confidence: {word}")
        require((mapping == "none") == (not ids), f"NONE/id mismatch: {word}")
        require(mapping != "composed" or len(ids) > 1, f"COMPOSED needs multiple IDs: {word}")
        require(mapping != "contextual" or item["pictiq"]["context_required"], f"CONTEXTUAL flag missing: {word}")
        require(all(icon_id in pictiq_ids for icon_id in ids), f"invented Pictiq ID: {word}")
        require(all((pictiq_root / "icons/svg" / f"{icon_id}.svg").is_file() for icon_id in ids), f"missing Pictiq SVG: {word}")
        require(item["sitelen_emoji"]["representation"] == emoji[word], f"emoji mismatch: {word}")
        require(item["sitelen_pona"]["representation"] == word, f"ligature input mismatch: {word}")
        shaped = subprocess.check_output([hb_shape, str(font_file), word], text=True).strip()
        require("," not in shaped, f"sitelen pona does not shape to one glyph: {word}")
        match = re.match(r"\[u([0-9A-Fa-f]+)(?:\.[^=]+)?=", shaped)
        require(match is not None and item["sitelen_pona"]["glyph"] == f"U+{match.group(1).upper()}", f"glyph mismatch: {word}")
        if glosses is not None:
            require(word in glosses and item["source_definition"] == glosses[word], f"pinned gloss mismatch: {word}")
            require(item["meaning"] == glosses[word], f"display meaning is not pinned source text: {word}")

    for word, (expected_mapping, expected_ids) in FINAL_DECISIONS.items():
        item = next(row for row in mappings if row["word"] == word)
        require(item["pictiq"]["mapping"] == expected_mapping, f"accepted class changed: {word}")
        require(tuple(item["pictiq"]["ids"]) == expected_ids, f"accepted IDs changed: {word}")

    pilot = load_json(ROOT / data["pilot_consistency"]["pilot_file"])
    pilot_by_word = {item["word"]: item for item in pilot["mappings"]}
    current = {item["word"]: item for item in mappings}
    require(set(pilot_by_word) == PILOT_WORDS, "accepted pilot word set changed")
    changes = []
    for word, old in pilot_by_word.items():
        new = current[word]
        if old["pictiq"]["mapping"] != new["pictiq"]["mapping"] or old["pictiq"]["ids"] != new["pictiq"]["ids"]:
            changes.append(word)
    require(changes == data["pilot_consistency"]["classification_changes"], "pilot classification change not declared")

    counts = Counter(item["pictiq"]["mapping"] for item in mappings)
    confidence = Counter(item["review_confidence"] for item in mappings)
    stats = {
        "mapping": {key: counts[key] for key in CLASSES},
        "confidence": {key: confidence[key] for key in CONFIDENCES},
        "one_tile": sum(len(item["pictiq"]["ids"]) == 1 for item in mappings),
        "multiple_tiles": sum(len(item["pictiq"]["ids"]) > 1 for item in mappings),
        "no_representation": sum(not item["pictiq"]["ids"] for item in mappings),
        "review_status": data["human_review"]["status"],
        "reviewed_rows": len(review_items(data)),
        "unresolved_review_rows": 0,
    }
    require(sum(stats["mapping"].values()) == 120 and sum(stats["confidence"].values()) == 120, "statistics mismatch")
    return stats


def pct(value: int) -> str:
    return f"{value / 120 * 100:.1f}%"


def pictiq_md(item: dict, commit: str) -> str:
    ids = item["pictiq"]["ids"]
    if not ids:
        return "**NONE**"
    links = [f"[`{icon_id}`](https://github.com/markoblogo/pictiq/blob/{commit}/icons/svg/{icon_id}.svg)" for icon_id in ids]
    value = " + ".join(links)
    return f"example: {value}" if item["pictiq"]["mapping"] == "contextual" else value


def crosswalk_markdown(data: dict, stats: dict) -> str:
    commit = data["sources"]["pictiq"]["commit"]
    lines = [
        "# Toki Pona x Pictiq: canonical 120-word semantic crosswalk", "",
        "> **Status: ACCEPTED. Human review resolved 2026-09-09.** Useful overlap is not lexical equivalence.", "",
        "> Toki Pona primarily compresses vocabulary through broad lexical concepts. Pictiq often compresses short communication through intent and context.", "",
        "Sources are pinned in `crosswalk-120.json`; notices are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The Pictiq source is commit `" + commit + "`.", "",
        "## Statistics", "",
        "These figures describe semantic coverage under the accepted method; they are not a Pictiq score.", "",
        "| Mapping | Count | Percent |", "|---|---:|---:|",
    ]
    lines += [f"| {key.upper()} | {stats['mapping'][key]} | {pct(stats['mapping'][key])} |" for key in CLASSES]
    lines += ["", "| Confidence | Count | Percent |", "|---|---:|---:|"]
    lines += [f"| {key} | {stats['confidence'][key]} | {pct(stats['confidence'][key])} |" for key in CONFIDENCES]
    lines += ["", f"One tile: **{stats['one_tile']}**. Multiple tiles: **{stats['multiple_tiles']}**. No representation: **{stats['no_representation']}**. Human review: **RESOLVED** across **{stats['reviewed_rows']}** reviewed rows; unresolved: **0**.", "",
              "## Reference table", "", "| Toki Pona | Meaning | sitelen pona | sitelen emoji | Pictiq | Mapping | Confidence | Notes |",
              "|---|---|---|---|---|---|---|---|"]
    for item in data["mappings"]:
        meaning = item["meaning"].replace("|", "\\|")
        note = item["notes"].replace("|", "\\|")
        sp = item["sitelen_pona"]
        lines.append(f"| `{item['word']}` | {meaning} | ligature `{sp['representation']}` -> `{sp['glyph']}` | {item['sitelen_emoji']['representation']} | {pictiq_md(item, commit)} | **{item['pictiq']['mapping'].upper()}** | {item['review_confidence']} | {note} |")
    lines += ["", "## Pilot consistency", "", "All 20 accepted pilot classifications and ordered Pictiq IDs are unchanged. `pilot-20.json`, `PILOT.md`, and the pilot visual artifacts remain historical and were not regenerated.", "",
              "## Regenerate", "", "```bash", "python3 crosswalks/pictiq/generate_crosswalk.py --pictiq-root /path/to/pictiq", "```", ""]
    return "\n".join(lines)


def review_markdown(data: dict) -> str:
    commit = data["sources"]["pictiq"]["commit"]
    buckets = [("NONE", lambda x: x["pictiq"]["mapping"] == "none"),
               ("COMPOSED", lambda x: x["pictiq"]["mapping"] == "composed"),
               ("CONTEXTUAL", lambda x: x["pictiq"]["mapping"] == "contextual"),
               ("LOW CONFIDENCE", lambda x: x["review_confidence"] == "low"),
               ("MEDIUM-CONFIDENCE PARTIAL / DIRECT", lambda x: x["review_confidence"] == "medium" and x["pictiq"]["mapping"] in {"partial", "direct"})]
    pending = review_items(data)
    used = set()
    accepted_changes = data["human_review"]["accepted_changes"]
    lines = ["# Human review record", "", "**Status: RESOLVED — 2026-09-09.**", "",
             f"The final review resolved **{len(pending)} unique rows**. This retained file records the reviewed scope; it is no longer an action queue.", "",
             "Rows are assigned to the first applicable section to avoid duplication. English fields come from the pinned sona Linku source.", ""]
    for title, predicate in buckets:
        rows = [item for item in pending if item["word"] not in used and predicate(item)]
        used.update(item["word"] for item in rows)
        lines += [f"## {title}", ""]
        if not rows:
            lines += ["No additional unique rows; applicable low-confidence rows are already listed under CONTEXTUAL.", ""]
            continue
        lines += ["| Word | Semantic field | Final Pictiq | Final class | Confidence | Reason | Resolution |", "|---|---|---|---|---|---|---|"]
        for item in rows:
            mapping = item["pictiq"]["mapping"]
            resolution = accepted_changes.get(item["word"], "Accepted unchanged")
            lines.append(f"| `{item['word']}` | {item['meaning'].replace('|','/')} | {pictiq_md(item, commit)} | {mapping.upper()} | {item['review_confidence']} | {item['notes']} | {resolution} |")
        lines.append("")
    require(set(used) == {item["word"] for item in pending}, "review queue generation omitted rows")
    return "\n".join(lines)


def render_svg(svg: Path, output: Path, size: int) -> None:
    qlmanage = subprocess.run(["which", "qlmanage"], capture_output=True, text=True).stdout.strip()
    require(bool(qlmanage), "Quick Look is required to rasterize Pictiq SVGs")
    prepared = output.with_suffix(".svg")
    prepared.write_text(svg.read_text(encoding="utf-8").replace("currentColor", "#111111"), encoding="utf-8")
    subprocess.run([qlmanage, "-t", "-s", str(size * 4), "-o", str(output.parent), str(prepared)], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    generated = output.parent / f"{prepared.name}.png"
    require(generated.is_file(), f"Quick Look did not render {svg.name}")
    generated.replace(output)


def visual_page(data: dict, pictiq_root: Path, rows: list[dict], page_no: int, page_count: int,
                emoji_cache: Path, icon_cache: Path):
    from PIL import Image, ImageDraw, ImageFont
    width, row_h, title_h, header_h, footer_h = 2200, 100, 145, 76, 58
    height = title_h + header_h + row_h * len(rows) + footer_h
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    regular = ImageFont.truetype(font_path(), 24)
    small = ImageFont.truetype(font_path(), 19)
    bold = ImageFont.truetype(font_path(True), 25)
    title = ImageFont.truetype(font_path(True), 42)
    sitelen_font = ImageFont.truetype(str(ROOT / data["sources"]["sitelen_pona"]["font_file"]), 68, layout_engine=ImageFont.Layout.RAQM)
    draw.text((34, 22), "Toki Pona x Pictiq - visual dictionary 120", font=title, fill="#111111")
    draw.text((36, 78), "Accepted research | overlap is not lexical equivalence", font=regular, fill="#555555")
    draw.text((36, 110), "Contextual rows are explicitly marked EXAMPLE.", font=small, fill="#555555")
    columns = [0, 190, 520, 830, 1830, 2200]
    headers = ["TOKI PONA", "SITELEN PONA", "SITELEN EMOJI", "PICTIQ", "MATCH"]
    draw.rectangle((0, title_h, width, title_h + header_h), fill="#171717")
    for i, label in enumerate(headers):
        centered_text(draw, (columns[i], title_h, columns[i + 1], title_h + header_h), label, bold, "white")
    for idx, item in enumerate(rows):
        top = title_h + header_h + idx * row_h
        bottom = top + row_h
        if idx % 2: draw.rectangle((0, top, width, bottom), fill="#FAFAF8")
        for x in columns[1:-1]: draw.line((x, top, x, bottom), fill="#DDDDDD")
        draw.line((0, bottom, width, bottom), fill="#D3D3D3")
        centered_text(draw, (columns[0], top, columns[1], bottom), item["word"], bold)
        word = item["word"]
        box = draw.textbbox((0, 0), word, font=sitelen_font, features=["liga"])
        draw.text((columns[1] + (columns[2]-columns[1]-(box[2]-box[0]))/2,
                   top + (row_h-(box[3]-box[1]))/2-box[1]-4), word, font=sitelen_font, fill="#111111", features=["liga"])
        emoji_file = fetch_twemoji(item["sitelen_emoji"]["representation"], emoji_cache)
        emoji_image = Image.open(emoji_file).convert("RGBA").resize((60, 60), Image.Resampling.LANCZOS)
        image.paste(emoji_image, (columns[2] + (columns[3]-columns[2]-60)//2, top+20), emoji_image)
        ids = item["pictiq"]["ids"]
        if not ids:
            centered_text(draw, (columns[3], top, columns[4], bottom), "NONE", bold, "#666666")
        else:
            tile_size = 66
            total_tiles = len(ids) * tile_size + max(0, len(ids)-1) * 16
            label = "EXAMPLE" if item["pictiq"]["mapping"] == "contextual" else " + ".join(ids)
            label_width = min(530, int(draw.textlength(label, font=small)) + 30)
            cursor = columns[3] + (columns[4]-columns[3]-total_tiles-label_width-16)/2
            for icon_id in ids:
                png = icon_cache / f"{icon_id}.png"
                if not png.exists(): render_svg(pictiq_root / "icons/svg" / f"{icon_id}.svg", png, tile_size)
                tile = Image.open(png).convert("RGBA"); tile.thumbnail((tile_size, tile_size), Image.Resampling.LANCZOS)
                image.paste(tile, (int(cursor), top+17), tile); cursor += tile_size + 16
            draw.text((cursor, top+37), label, font=small, fill="#27506D" if item["pictiq"]["mapping"] == "contextual" else "#333333")
        mapping = item["pictiq"]["mapping"]
        badge = (columns[4]+28, top+27, columns[5]-28, bottom-27)
        draw.rounded_rectangle(badge, radius=13, fill=CLASS_COLORS[mapping], outline="#AAAAAA")
        centered_text(draw, badge, mapping.upper(), bold)
    footer_y = height-footer_h
    draw.text((32, footer_y+17), f"Page {page_no}/{page_count} | Pictiq {data['sources']['pictiq']['commit'][:8]} | sitelen seli kiwen asuki 2.2 | frozen sitelen emoji profile", font=small, fill="#555555")
    return image


def render_visuals(data: dict, pictiq_root: Path) -> None:
    from PIL import Image
    rows = data["mappings"]
    page_size = 24
    chunks = [rows[i:i+page_size] for i in range(0, len(rows), page_size)]
    with tempfile.TemporaryDirectory(prefix="tp-pictiq-120-") as directory:
        tmp = Path(directory); emoji_cache = tmp/"emoji"; icon_cache = tmp/"icons"
        emoji_cache.mkdir(); icon_cache.mkdir()
        pages = [visual_page(data, pictiq_root, chunk, i+1, len(chunks), emoji_cache, icon_cache) for i, chunk in enumerate(chunks)]
        tall = Image.new("RGB", (pages[0].width, sum(page.height for page in pages)), "white")
        y = 0
        for page in pages: tall.paste(page, (0, y)); y += page.height
        tall.save(HERE / "visual-dictionary-120.png", optimize=True)
        page_paths = []
        for index, page in enumerate(pages, start=1):
            page_path = tmp / f"page-{index:02d}.png"
            page.save(page_path, optimize=True, dpi=(180, 180))
            page_paths.append(page_path)
        img2pdf = subprocess.run(["which", "img2pdf"], capture_output=True, text=True).stdout.strip()
        require(bool(img2pdf), "img2pdf is required for deterministic multi-page PDF output")
        pdf_path = HERE / "visual-dictionary-120.pdf"
        subprocess.run([
            img2pdf, "--nodate", "--title", "Toki Pona x Pictiq - visual dictionary 120",
            "--output", str(pdf_path), *(str(path) for path in page_paths),
        ], check=True)
        pdf = pdf_path.read_bytes()
        document_id = hashlib.sha256(b"".join(path.read_bytes() for path in page_paths)).hexdigest()[:32].encode()
        pdf, replacements = re.subn(
            rb"/ID \[<[0-9a-fA-F]{32}><[0-9a-fA-F]{32}>\]",
            b"/ID [<" + document_id + b"><" + document_id + b">]",
            pdf,
        )
        require(replacements >= 1, "img2pdf output did not contain the expected document ID")
        pdf_path.write_bytes(pdf)


def write_outputs(data: dict, stats: dict, pictiq_root: Path, *, render: bool) -> None:
    (HERE / "CROSSWALK_120.md").write_text(crosswalk_markdown(data, stats), encoding="utf-8")
    (HERE / "REVIEW_QUEUE.md").write_text(review_markdown(data), encoding="utf-8")
    if render: render_visuals(data, pictiq_root)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pictiq-root", type=Path, required=True)
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--offline", action="store_true", help="Skip live download of the pinned gloss file")
    args = parser.parse_args()
    data = load_json(DATA_PATH)
    stats = validate(data, args.pictiq_root.resolve(), online=not args.offline)
    if not args.validate_only:
        write_outputs(data, stats, args.pictiq_root.resolve(), render=True)
    print(json.dumps(stats, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
