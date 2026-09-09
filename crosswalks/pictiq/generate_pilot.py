#!/usr/bin/env python3
"""Validate and render the non-canonical 20-word Toki Pona/Pictiq pilot."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import textwrap
import time
import urllib.request
from collections import Counter
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[1]
DATA_PATH = HERE / "pilot-20.json"
EXPECTED_WORDS = [
    "telo", "moku", "mani", "tomo", "ilo", "jan", "luka", "lukin", "tawa", "pali",
    "jo", "wile", "pona", "ike", "suli", "lili", "seme", "ala", "ken", "pilin",
]
MAPPING_CLASSES = {"direct", "partial", "composed", "contextual", "none"}
CLASS_COLORS = {
    "direct": "#DDF2E3",
    "partial": "#F5E9BF",
    "composed": "#E8DFF2",
    "contextual": "#DDEAF5",
    "none": "#E7E7E7",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate(data: dict, pictiq_root: Path) -> Counter:
    sources = data["sources"]
    notices_path = REPO_ROOT / data["third_party_notices"]
    vocab_path = REPO_ROOT / sources["toki_pona_repository"]["vocabulary_file"]
    recognition_lexicon_path = REPO_ROOT / sources["toki_pona_repository"]["display_recognition_lexicon"]
    emoji_path = REPO_ROOT / sources["sitelen_emoji"]["canonical_profile"]
    font_path = REPO_ROOT / sources["sitelen_pona"]["font_file"]
    license_path = REPO_ROOT / sources["sitelen_pona"]["license_file"]
    pictiq_lexicon_path = pictiq_root / sources["pictiq"]["lexicon_file"]

    checked_hashes = [
        (vocab_path, sources["toki_pona_repository"]["vocabulary_sha256"]),
        (recognition_lexicon_path, sources["toki_pona_repository"]["display_recognition_lexicon_sha256"]),
        (emoji_path, sources["sitelen_emoji"]["profile_sha256"]),
        (font_path, sources["sitelen_pona"]["font_sha256"]),
        (pictiq_lexicon_path, sources["pictiq"]["lexicon_sha256"]),
    ]
    for path, expected in checked_hashes:
        require(path.is_file(), f"missing source: {path}")
        require(sha256(path) == expected, f"source hash changed: {path}")
    require(license_path.is_file(), f"missing font license: {license_path}")
    require(notices_path.is_file(), f"missing third-party notices: {notices_path}")
    require(sources["english_glosses"]["license"] == "CC-BY-SA-4.0", "English gloss license changed")
    require(sources["sitelen_emoji"]["upstream_license"] == "BSD-3-Clause", "emoji upstream license changed")

    vocab = set(vocab_path.read_text(encoding="utf-8").splitlines())
    emoji_profile = load_json(emoji_path)
    pictiq_lexicon = load_json(pictiq_lexicon_path)
    pictiq_by_id = {item["id"]: item for item in pictiq_lexicon["icons"]}
    mappings = data["mappings"]
    mappings_by_word = {item["word"]: item for item in mappings}

    require([item["word"] for item in mappings] == EXPECTED_WORDS, "pilot word order/set changed")
    require(len(set(EXPECTED_WORDS)) == 20, "pilot words must be unique")
    require(pictiq_lexicon["version"] == sources["pictiq"]["lexicon_version"], "Pictiq lexicon version changed")
    require(mappings_by_word["ala"]["pictiq"]["mapping"] == "partial", "ala must remain PARTIAL")
    require(mappings_by_word["wile"]["pictiq"].get("display_label") == "example: need_water", "wile example label changed")

    hb_shape = shutil.which("hb-shape")
    for item in mappings:
        word = item["word"]
        mapping = item["pictiq"]["mapping"]
        ids = item["pictiq"]["ids"]
        require(word in vocab, f"word absent from current vocabulary: {word}")
        require(mapping in MAPPING_CLASSES, f"invalid mapping class for {word}: {mapping}")
        require(item.get("meaning_source") == "sona_linku_pinned", f"unattributed English gloss: {word}")
        require(bool(item.get("source_definition")), f"missing pinned source definition: {word}")
        require(item["sitelen_emoji"]["representation"] == emoji_profile["entries"].get(word), f"emoji mismatch: {word}")
        require(item["sitelen_pona"]["representation"] == word, f"ligature input mismatch: {word}")
        require((mapping == "none") == (not ids), f"NONE/id mismatch: {word}")
        require(mapping != "composed" or len(ids) > 1, f"COMPOSED needs multiple IDs: {word}")
        for icon_id in ids:
            require(icon_id in pictiq_by_id, f"invented Pictiq ID: {icon_id}")
            require((pictiq_root / "icons" / "svg" / f"{icon_id}.svg").is_file(), f"missing canonical SVG: {icon_id}")

        if hb_shape:
            shaped = subprocess.check_output([hb_shape, str(font_path), word], text=True).strip()
            require("," not in shaped, f"sitelen pona input did not shape to one glyph: {word}: {shaped}")
            match = re.match(r"\[u([0-9A-Fa-f]+)=", shaped)
            require(match is not None, f"unexpected hb-shape output for {word}: {shaped}")
            actual_glyph = f"U+{match.group(1).upper()}"
            require(actual_glyph == item["sitelen_pona"]["glyph"], f"glyph mismatch: {word}")

    none_words = [item["word"] for item in mappings if item["pictiq"]["mapping"] == "none"]
    assessed_words = [item["word"] for item in data["gap_assessment"]]
    require(len(assessed_words) == len(set(assessed_words)), "gap assessment contains duplicate words")
    require(set(assessed_words) == set(none_words), "gap assessment must cover every NONE row once")
    counts = Counter(item["pictiq"]["mapping"] for item in mappings)
    require(sum(counts.values()) == 20, "mapping count is not 20")
    return counts


def twemoji_slug(value: str) -> str:
    return "-".join(f"{ord(char):x}" for char in value if ord(char) not in {0xFE0E, 0xFE0F})


def fetch_twemoji(value: str, cache: Path) -> Path:
    slug = twemoji_slug(value)
    target = cache / f"{slug}.png"
    if not target.exists():
        url = f"https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.0/assets/72x72/{slug}.png"
        request = urllib.request.Request(url, headers={"User-Agent": "toki-pona-pictiq-pilot/1.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            target.write_bytes(response.read())
    return target


def font_path(bold: bool = False) -> str:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).is_file():
            return candidate
    raise RuntimeError("No supported text font found")


def fit_lines(draw, text: str, font, max_width: int, max_lines: int = 3) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or draw.textlength(candidate, font=font) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while draw.textlength(lines[-1] + "...", font=font) > max_width and lines[-1]:
            lines[-1] = lines[-1][:-1]
        lines[-1] += "..."
    return lines


def centered_text(draw, box, text: str, font, fill="#111111") -> None:
    left, top, right, bottom = box
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    draw.text((left + (right - left - width) / 2, top + (bottom - top - height) / 2 - bounds[1]), text, font=font, fill=fill)


def render_grid(data: dict, pictiq_root: Path) -> None:
    from PIL import Image, ImageDraw, ImageFont

    qlmanage = shutil.which("qlmanage")
    rsvg_convert = shutil.which("rsvg-convert")
    if not qlmanage and not rsvg_convert:
        raise RuntimeError("Quick Look (macOS) or rsvg-convert is required to rasterize canonical Pictiq SVG files")

    width = 2400
    title_h, rule_h, header_h, row_h, footer_h = 125, 115, 82, 112, 105
    height = title_h + rule_h + header_h + row_h * 20 + footer_h
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    regular = ImageFont.truetype(font_path(), 29)
    small = ImageFont.truetype(font_path(), 23)
    tiny = ImageFont.truetype(font_path(), 19)
    bold = ImageFont.truetype(font_path(True), 29)
    header_font = ImageFont.truetype(font_path(True), 23)
    title = ImageFont.truetype(font_path(True), 48)
    sitelen_font_file = REPO_ROOT / data["sources"]["sitelen_pona"]["font_file"]
    sitelen_font = ImageFont.truetype(str(sitelen_font_file), 76, layout_engine=ImageFont.Layout.RAQM)

    draw.text((40, 28), "Toki Pona x Pictiq - pilot semantic crosswalk", font=title, fill="#111111")
    draw.text((42, 85), "20 words | research artifact | no lexical-equivalence claim", font=small, fill="#555555")
    draw.rectangle((30, title_h, width - 30, title_h + rule_h - 10), fill="#F5F5F2")
    rule = "Toki Pona compresses broad lexical concepts. Pictiq compresses short communication through intent and context."
    for index, line in enumerate(fit_lines(draw, rule, bold, width - 100, 2)):
        draw.text((50, title_h + 20 + index * 35), line, font=bold, fill="#222222")
    draw.text((50, title_h + 76), "Example: telo is not equal to need_water; the tile is narrower and already intent-oriented.", font=small, fill="#555555")

    columns = [0, 180, 830, 1050, 1240, 2090, 2400]
    headers = ["TOKI PONA", "MEANING", "SITELEN PONA", "SITELEN EMOJI", "PICTIQ", "MATCH"]
    header_top = title_h + rule_h
    draw.rectangle((0, header_top, width, header_top + header_h), fill="#171717")
    for index, label in enumerate(headers):
        centered_text(draw, (columns[index], header_top, columns[index + 1], header_top + header_h), label, header_font, "white")
    for x in columns[1:-1]:
        draw.line((x, header_top + 14, x, header_top + header_h - 14), fill="#555555", width=1)

    with tempfile.TemporaryDirectory(prefix="tp-pictiq-pilot-") as tmp_name:
        tmp = Path(tmp_name)
        emoji_cache = tmp / "twemoji"
        icon_cache = tmp / "pictiq"
        emoji_cache.mkdir()
        icon_cache.mkdir()

        for row_index, item in enumerate(data["mappings"]):
            top = header_top + header_h + row_index * row_h
            bottom = top + row_h
            if row_index % 2:
                draw.rectangle((0, top, width, bottom), fill="#FAFAF8")
            for x in columns[1:-1]:
                draw.line((x, top, x, bottom), fill="#DDDDDD", width=1)
            draw.line((0, bottom, width, bottom), fill="#D3D3D3", width=1)

            centered_text(draw, (columns[0], top, columns[1], bottom), item["word"], bold)
            meaning_lines = fit_lines(draw, item["meaning"], regular, columns[2] - columns[1] - 34, 3)
            line_y = top + (row_h - len(meaning_lines) * 31) / 2
            for line in meaning_lines:
                draw.text((columns[1] + 18, line_y), line, font=regular, fill="#222222")
                line_y += 31

            word = item["sitelen_pona"]["representation"]
            box = draw.textbbox((0, 0), word, font=sitelen_font, features=["liga"])
            glyph_width, glyph_height = box[2] - box[0], box[3] - box[1]
            glyph_x = columns[2] + (columns[3] - columns[2] - glyph_width) / 2
            glyph_y = top + (row_h - glyph_height) / 2 - box[1] - 5
            draw.text((glyph_x, glyph_y), word, font=sitelen_font, fill="#111111", features=["liga"])
            centered_text(draw, (columns[2], bottom - 28, columns[3], bottom), item["sitelen_pona"]["glyph"], tiny, "#666666")

            emoji_file = fetch_twemoji(item["sitelen_emoji"]["representation"], emoji_cache)
            emoji_image = Image.open(emoji_file).convert("RGBA").resize((64, 64), Image.Resampling.LANCZOS)
            image.paste(emoji_image, (columns[3] + (columns[4] - columns[3] - 64) // 2, top + 22), emoji_image)

            icon_ids = item["pictiq"]["ids"]
            if not icon_ids:
                centered_text(draw, (columns[4], top, columns[5], bottom), "NONE", bold, "#666666")
            else:
                tile_size = 72
                cursor_x = columns[4] + 24
                for icon_id in icon_ids:
                    png_path = icon_cache / f"{icon_id}.png"
                    svg_path = pictiq_root / "icons" / "svg" / f"{icon_id}.svg"
                    render_svg_path = icon_cache / f"{icon_id}.svg"
                    render_svg_path.write_text(
                        svg_path.read_text(encoding="utf-8").replace("currentColor", "#111111"),
                        encoding="utf-8",
                    )
                    if rsvg_convert:
                        subprocess.run(
                            [rsvg_convert, "-w", str(tile_size * 4), "-h", str(tile_size * 4), "-o", str(png_path), str(render_svg_path)],
                            check=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.PIPE,
                        )
                    else:
                        subprocess.run(
                            [qlmanage, "-t", "-s", str(tile_size * 4), "-o", str(icon_cache), str(render_svg_path)],
                            check=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.PIPE,
                        )
                        quicklook_output = icon_cache / f"{render_svg_path.name}.png"
                        require(quicklook_output.is_file(), f"Quick Look did not render {icon_id}")
                        quicklook_output.replace(png_path)
                    tile = Image.open(png_path).convert("RGBA")
                    tile.thumbnail((tile_size, tile_size), Image.Resampling.LANCZOS)
                    image.paste(tile, (cursor_x, top + 20), tile)
                    cursor_x += tile_size + 12
                label_x = cursor_x + 8
                label_width = columns[5] - label_x - 18
                label = item["pictiq"].get("display_label", " + ".join(icon_ids))
                label_lines = fit_lines(draw, label, small, label_width, 2)
                label_y = top + (row_h - len(label_lines) * 27) / 2
                for line in label_lines:
                    draw.text((label_x, label_y), line, font=small, fill="#222222")
                    label_y += 27

            mapping = item["pictiq"]["mapping"]
            badge = (columns[5] + 24, top + 29, columns[6] - 24, bottom - 29)
            draw.rounded_rectangle(badge, radius=15, fill=CLASS_COLORS[mapping], outline="#AAAAAA", width=1)
            centered_text(draw, badge, mapping.upper(), bold)

    footer_top = height - footer_h
    draw.text((38, footer_top + 18), "Sources: sona Linku glosses; frozen sitelen-emoji profile; sitelen seli kiwen asuki 2.2; Pictiq lexicon 0.2.0.", font=tiny, fill="#555555")
    draw.text((38, footer_top + 48), "Pictiq (c) Anton Biletskyi-Volokh - github.com/markoblogo/pictiq - CC BY-NC 4.0. Twemoji graphics - CC BY 4.0.", font=tiny, fill="#555555")
    draw.text((38, footer_top + 78), "sitelen seli kiwen by KreativeKorp / jan Lepeka - OFL-1.1. Generated from pilot-20.json; NONE requests no new icon.", font=tiny, fill="#555555")

    png_path = HERE / "pilot-20-grid.png"
    pdf_path = HERE / "pilot-20-grid.pdf"
    image.save(png_path, optimize=True)
    fixed_pdf_time = time.gmtime(1788912000)  # 2026-09-09 00:00:00 UTC
    image.save(
        pdf_path,
        "PDF",
        resolution=180.0,
        title="Toki Pona x Pictiq - 20-word pilot",
        creationDate=fixed_pdf_time,
        modDate=fixed_pdf_time,
    )


def markdown(data: dict, counts: Counter) -> str:
    pictiq_commit = data["sources"]["pictiq"]["commit"]
    rows = []
    for item in data["mappings"]:
        ids = item["pictiq"]["ids"]
        if ids:
            parts = [
                f"[`{icon_id}`](https://github.com/markoblogo/pictiq/blob/{pictiq_commit}/icons/svg/{icon_id}.svg)"
                for icon_id in ids
            ]
            pictiq = " + ".join(parts)
            display_label = item["pictiq"].get("display_label")
            if display_label:
                pictiq = f"{display_label.replace(ids[0], parts[0])}"
        else:
            pictiq = "**NONE**"
        sp = item["sitelen_pona"]
        rows.append(
            f"| `{item['word']}` | {item['meaning']} | ligature `{sp['representation']}` -> `{sp['glyph']}` | "
            f"{item['sitelen_emoji']['representation']} | {pictiq} | **{item['pictiq']['mapping'].upper()}** | {item['notes']} |"
        )

    count_line = " | ".join(f"{name.upper()} **{counts.get(name, 0)}**" for name in ["direct", "partial", "composed", "contextual", "none"])
    gaps = []
    for gap in data["gap_assessment"]:
        label = gap["recommendation"].replace("_", " ").title()
        gaps.append(f"| `{gap['word']}` | {gap['candidate']} | **{label}** | {gap['reason']} |")

    p_link = data["linking_plan"]["pictiq_readme"]
    t_link = data["linking_plan"]["toki_pona_readme"]
    return "\n".join([
        "# Toki Pona x Pictiq: 20-word pilot",
        "",
        "> **Research artifact.** This crosswalk tests useful semantic overlap. It does not claim that Toki Pona words, sitelen pona glyphs, sitelen emoji, and Pictiq tiles are equivalent.",
        "",
        "> Toki Pona primarily compresses vocabulary by allowing broad lexical concepts.",
        "> Pictiq often compresses communication by relying on context and communicative intent.",
        "",
        "For example, `telo` covers water and many other liquids. Pictiq `need_water` is narrower and already carries practical intent. Therefore `telo != need_water`, even when it is the best current mapping.",
        "",
        "![Pilot visual grid](pilot-20-grid.png)",
        "",
        "Printable version: [pilot-20-grid.pdf](pilot-20-grid.pdf)",
        "",
        "## Sources inspected before editing",
        "",
        "- Toki Pona vocabulary membership: `packages/sitelen-emoji/words/nimi_pu.txt`.",
        "- Display-layer recognition lexicon: `packages/sitelen-layer-plugin/src/tokiPonaLexicon.ts` (139 words, including community additions); the pilot uses the 120-word list above.",
        "- sitelen pona mechanism: `packages/sitelen-layer-plugin/sitelen-pona-font.css` and `assets/fonts/sitelen-seli-kiwen-asuki.ttf`; Latin words shape into ligatures.",
        "- sitelen emoji source of truth: `packages/sitelen-emoji/profiles/default-stable.v1.json`; consumer copies are generated from this frozen profile.",
        "- English glosses: `lipu-linku/sona` `words/source/definition.toml` pinned to commit `c2c56d2769b369af89c6c239d45aa616ba6d7b77`.",
        "- Pictiq registry and assets: `lexicon/icon-index.json` and `icons/svg/{id}.svg` at commit `7e9663d5a1236a881faf6a030e3258cf99e74a73`.",
        "- Pictiq packs: `packs/universal-core.json`, `packs/universal-v1.json`, and contextual packs. No pack or core file was changed.",
        "",
        "The source snapshots and SHA-256 values are recorded in [`pilot-20.json`](pilot-20.json).",
        "",
        "## Pilot crosswalk",
        "",
        "| Toki Pona | Meaning | sitelen pona | sitelen emoji | Pictiq | Mapping | Notes |",
        "|---|---|---|---|---|---|---|",
        *rows,
        "",
        "## Result",
        "",
        count_line,
        "",
        "No row required a defensible multi-tile composition. `COMPOSED = 0` is a pilot result; the schema still supports multiple ordered Pictiq IDs.",
        "",
        "## Gap analysis",
        "",
        "A Toki Pona gap becomes a Pictiq candidate only when the concept is independently useful for Pictiq outside this crosswalk.",
        "",
        "| Word | Possible Pictiq concept | Recommendation | Reason |",
        "|---|---|---|---|",
        *gaps,
        "",
        "The strongest current candidates are a **generic person** and a **generic building/home**. Both occur independently in short cross-language messages. They still require Pictiq user testing and design review before icon work.",
        "",
        "This pilot does not justify new generic tiles for `jo`, `wile`, `pona`, `ike`, or `ken`. Their abstract or evaluative readings depend on grammar and context. Toki Pona's bundled polysemy in `suli`, `lili`, and `luka` must also not be copied into single Pictiq icons.",
        "",
        "## Licensing and provenance",
        "",
        "- **Toki Pona vocabulary:** the repository's 120-word `nimi_pu.txt` validates membership. English source definitions come from the pinned `sona Linku` dataset; the shorter display glosses are adaptations under CC BY-SA 4.0.",
        "- **sitelen pona:** `sitelen seli kiwen asuki` v2.2 by KreativeKorp / jan Lepeka, bundled under SIL OFL 1.1. The grid renders the actual OpenType ligatures; it does not copy the font into Pictiq.",
        "- **sitelen emoji:** the canonical frozen profile identifies Dev Bali's BSD-3-Clause `desktop-sitelen-emoji` mapping as its upstream source. [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) now preserves its copyright, license conditions, disclaimer, source URL, and reuse description.",
        "- **Emoji artwork:** the grid uses Twemoji 17.0.0 artwork under CC BY 4.0 to render the profile's exact Unicode sequences consistently.",
        "- **Pictiq:** canonical SVG icons are CC BY-NC 4.0. The generated grid embeds those tiles, so its Pictiq-derived visual content remains non-commercial unless separately licensed.",
        "",
        "## Suitability for scaling",
        "",
        "The schema is suitable for the full vocabulary because it keeps representation sources, ordered Pictiq IDs, mapping class, context dependence, semantic caveats, and pinned English definitions separate. Scaling should wait for review of the class boundaries and the six NONE decisions, and should test at least a few genuine COMPOSED cases.",
        "",
        "Unresolved semantic issues:",
        "",
        "- `ala` is PARTIAL: `logic_no` covers no/not, while nothing, zero, absence, and question formation remain uncovered.",
        "- `wile` displays `example: need_water` as one concrete need-intent tile plus context; it is not a lexical mapping for `wile` alone.",
        "- `pona`, `ike`, and `ken` map to response/logic tiles only in situations that supply the missing predicate.",
        "- `suli` and `lili` bundle size, degree, age, and evaluation in ways a Pictiq modifier should not inherit.",
        "",
        "## Draft cross-repository links (not applied)",
        "",
        "Suggested Pictiq README wording:",
        "",
        "```markdown",
        p_link,
        "```",
        "",
        "Suggested Toki Pona README wording:",
        "",
        "```markdown",
        t_link,
        "```",
        "",
        "## Reproduce and validate",
        "",
        "From the Toki Pona repository root:",
        "",
        "```bash",
        "python3 crosswalks/pictiq/generate_pilot.py --pictiq-root /path/to/pictiq --validate-only",
        "python3 crosswalks/pictiq/generate_pilot.py --pictiq-root /path/to/pictiq",
        "```",
        "",
        "Rendering requires Pillow with libraqm, HarfBuzz (`hb-shape`), an SVG renderer (`rsvg-convert` or macOS Quick Look), and network access to the pinned Twemoji 17.0.0 assets. Validation itself uses only Python and repository files; HarfBuzz adds exact ligature verification when installed.",
        "",
    ])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pictiq-root", type=Path, required=True)
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    data = load_json(DATA_PATH)
    pictiq_root = args.pictiq_root.resolve()
    counts = validate(data, pictiq_root)
    if not args.validate_only:
        render_grid(data, pictiq_root)
        (HERE / "PILOT.md").write_text(markdown(data, counts), encoding="utf-8")
    ordered = {name: counts.get(name, 0) for name in ["direct", "partial", "composed", "contextual", "none"]}
    print(f"pilot validation passed: {ordered}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
