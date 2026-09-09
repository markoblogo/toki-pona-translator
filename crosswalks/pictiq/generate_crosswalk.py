#!/usr/bin/env python3
"""Validate and render the full 120-word Toki Pona/Pictiq crosswalk."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import time
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
GAP_CANDIDATES = [
    {"concept": "generic person", "source_words": ["jan", "meli", "mije", "mi", "ona", "sina"],
     "recommendation": "strong_candidate", "reason": "A generic person is useful in travel, interpersonal and safety messages without encoding gender or pronoun grammar.",
     "suggested_role": "canonical reusable concept"},
    {"concept": "generic building or home", "source_words": ["tomo"],
     "recommendation": "strong_candidate", "reason": "Home/building is independently useful beyond the current specific hotel, shop and landmark tiles.",
     "suggested_role": "canonical reusable concept"},
    {"concept": "look, see or eye", "source_words": ["lukin"],
     "recommendation": "possible_candidate", "reason": "Visual attention is useful, but an eye may be read as surveillance or anatomy and needs testing.",
     "suggested_role": "tested visual-attention concept"},
    {"concept": "clothing", "source_words": ["len"],
     "recommendation": "possible_candidate", "reason": "Clothing can support travel and physical needs, but the existing fashion-shopping tile may already cover some contexts.",
     "suggested_role": "context-tested object concept"},
    {"concept": "body", "source_words": ["sijelo"],
     "recommendation": "possible_candidate", "reason": "A body concept could support medical communication, but its scope and silhouette need evidence.",
     "suggested_role": "medical and interpersonal context candidate"},
    {"concept": "hot or fire", "source_words": ["seli"],
     "recommendation": "possible_candidate", "reason": "Heat/fire warnings are independently useful, while warmth and burning should not be conflated without testing.",
     "suggested_role": "safety or state candidate"},
    {"concept": "cold", "source_words": ["lete"],
     "recommendation": "possible_candidate", "reason": "Cold is useful for comfort and safety, but frozen/raw senses should remain outside a first tile.",
     "suggested_role": "state candidate"},
    {"concept": "large and small modifiers", "source_words": ["suli", "lili"],
     "recommendation": "possible_candidate", "reason": "Scale modifiers could help physical requests, but must not inherit age, importance or evaluation senses.",
     "suggested_role": "future composition modifiers"},
]


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
        "review_queue": len(review_items(data)),
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
        "> **Research artifact pending human review.** Useful overlap is not lexical equivalence.", "",
        "> Toki Pona primarily compresses vocabulary through broad lexical concepts. Pictiq often compresses short communication through intent and context.", "",
        "Sources are pinned in `crosswalk-120.json`; notices are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The Pictiq source is commit `" + commit + "`.", "",
        "## Statistics", "",
        "These figures describe semantic coverage under the accepted method; they are not a Pictiq score.", "",
        "| Mapping | Count | Percent |", "|---|---:|---:|",
    ]
    lines += [f"| {key.upper()} | {stats['mapping'][key]} | {pct(stats['mapping'][key])} |" for key in CLASSES]
    lines += ["", "| Confidence | Count | Percent |", "|---|---:|---:|"]
    lines += [f"| {key} | {stats['confidence'][key]} | {pct(stats['confidence'][key])} |" for key in CONFIDENCES]
    lines += ["", f"One tile: **{stats['one_tile']}**. Multiple tiles: **{stats['multiple_tiles']}**. No representation: **{stats['no_representation']}**. Human review queue: **{stats['review_queue']}**.", "",
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
    lines = ["# Human review queue", "", f"**{len(pending)} unique rows.** Decide accept / revise / reject; do not infer new Pictiq icons from this queue.", "",
             "Rows are assigned to the first applicable section to avoid duplication. English fields come from the pinned sona Linku source.", ""]
    for title, predicate in buckets:
        rows = [item for item in pending if item["word"] not in used and predicate(item)]
        used.update(item["word"] for item in rows)
        lines += [f"## {title}", ""]
        if not rows:
            lines += ["No additional unique rows; applicable low-confidence rows are already listed under CONTEXTUAL.", ""]
            continue
        lines += ["| Word | Semantic field | Pictiq | Class | Confidence | Reason | Alternative | Recommendation |", "|---|---|---|---|---|---|---|---|"]
        for item in rows:
            mapping = item["pictiq"]["mapping"]
            if mapping == "none":
                alternative = "Context/composition only if a real use case supplies the missing meaning."
                recommendation = "Accept NONE unless independent Pictiq evidence supports a gap candidate."
            elif mapping == "composed":
                alternative = "`place_shop` alone; or NONE for abstract exchange."
                recommendation = "Test the ordered sequence as practical commerce."
            elif mapping == "contextual":
                alternative = "NONE is the conservative lexical classification."
                recommendation = "Keep only as an explicitly labelled example."
            else:
                alternative = "NONE is the conservative alternative."
                recommendation = "Confirm overlap is useful enough to retain PARTIAL."
            lines.append(f"| `{item['word']}` | {item['meaning'].replace('|','/')} | {pictiq_md(item, commit)} | {mapping.upper()} | {item['review_confidence']} | {item['notes']} | {alternative} | {recommendation} |")
        lines.append("")
    require(set(used) == {item["word"] for item in pending}, "review queue generation omitted rows")
    return "\n".join(lines)


def gap_markdown(data: dict) -> str:
    return """# Pictiq semantic gap report

This report analyzes the complete 120-word crosswalk. A `NONE` row is evidence of non-equivalence, not automatically a request for an icon.

> A Toki Pona gap becomes a Pictiq candidate only when the concept is independently useful for Pictiq outside the crosswalk.

## A. Strong reusable Pictiq candidates

- **Generic person** (`jan`; potentially useful for `mi`, `sina`, `ona`, `meli`, `mije` without copying pronoun or gender grammar). Travel, safety and interpersonal messages often need a participant.
- **Generic building/home** (`tomo`). The current lexicon has specific venues but no generic shelter, home or building.

Both require independent use-case evidence, silhouette testing and the Pictiq visual QA workflow before any icon proposal.

## B. Possible Pictiq candidates

- **Look / see / eye** (`lukin`): useful for attention and wayfinding, but an eye can imply surveillance or anatomy.
- **Clothing** (`len`) and **body** (`sijelo`): plausible travel/medical needs; scope and silhouette need testing.
- **Hot/fire** (`seli`) and **cold** (`lete`): plausible safety or comfort states; avoid bundling unrelated senses.
- **Large/small modifiers** (`suli`, `lili`): potentially useful in requests, but must not inherit importance, age or evaluation.
- **Generic communication/message** (`toki`) and **light** (`suno`): independently plausible, but current use cases do not yet justify priority.
- **Color modifiers** (`jelo`, `laso`, `loje`, `pimeja`, `walo`): potentially useful for identification; test whether pointing and surrounding context already suffice.

## C. Composition candidates

- Practical commerce: `place_shop + money_coins` for `esun`, tested as a sequence rather than a generic trade tile.
- Exact number senses: retain `qty_1`, `qty_2`, `qty_5` for `wan`, `tu`, `luka`; do not import the words' other senses.
- Specific food/plant contexts: use existing food or flower tiles when the intended referent is concrete; do not treat them as lexical equivalents for `kili`, `pan`, or `kasi`.
- Future person/building concepts, if independently accepted, may compose roles and destinations without adding pronoun grammar.

## D. Context-only concepts

- Approval/rejection (`pona`, `ike`, `ken`) can use `logic_yes` or `logic_no` only in a concrete exchange.
- Want/need (`wile`) is supplied by a concrete need tile and situation.
- Sleep/rest (`lape`) may be inferred from a hotel in a travel request.
- Broken/end/open (`pakala`, `pini`, `open`) may be conveyed by repair or logic tiles only in a clear operational context.
- Demonstratives and participants (`ni`, `mi`, `sina`, `ona`) are often supplied by pointing and conversational roles.

## E. Do-not-add concepts

- Grammar particles and relations: `e`, `en`, `la`, `li`, `pi`, `anu`, `tan`, `taso`, `kepeken`, `o`.
- Possession as a generic relation (`jo`) and broad modality (`ken`, `wile`).
- Toki Pona-specific book interaction (`pu`).
- Broad bundles whose meanings cannot honestly share one Pictiq tile: `kon`, `lawa`, `nasin`, `sewi`, `suwi`, and grammatical/polysemous readings of `lon`.
- Gendered and person pronoun tiles (`meli`, `mije`, `mi`, `sina`, `ona`) until independent Pictiq research establishes a need; a neutral person concept is the stronger first question.

## Reading the result

High `NONE` coverage is expected because Pictiq targets short intent-oriented communication rather than a general lexicon. Candidate priority must come from Pictiq use cases and perceptual testing, not from maximizing this crosswalk's mapping percentage.
"""


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
    draw.text((36, 78), "Research artifact | overlap is not lexical equivalence", font=regular, fill="#555555")
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
        fixed_pdf_time = time.gmtime(1788912000)  # 2026-09-09 00:00:00 UTC
        pages[0].save(
            HERE / "visual-dictionary-120.pdf", "PDF", save_all=True,
            append_images=pages[1:], resolution=180.0,
            title="Toki Pona x Pictiq - visual dictionary 120",
            creationDate=fixed_pdf_time, modDate=fixed_pdf_time,
        )


def write_outputs(data: dict, stats: dict, pictiq_root: Path, *, render: bool) -> None:
    (HERE / "CROSSWALK_120.md").write_text(crosswalk_markdown(data, stats), encoding="utf-8")
    (HERE / "REVIEW_QUEUE.md").write_text(review_markdown(data), encoding="utf-8")
    (HERE / "GAP_REPORT.md").write_text(gap_markdown(data), encoding="utf-8")
    (HERE / "pictiq-gap-candidates.json").write_text(json.dumps({"pictiq_commit": data["sources"]["pictiq"]["commit"], "rule": "A gap is a candidate only when independently useful for Pictiq.", "candidates": GAP_CANDIDATES}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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
