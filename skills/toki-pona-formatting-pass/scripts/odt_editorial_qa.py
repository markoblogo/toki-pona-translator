#!/usr/bin/env python3
"""Audit-only editorial QA for layered English/Toki Pona ODT manuscripts.

This tool reads source artifacts and writes reports. It has no replacement or
write-back operation.
"""

from __future__ import annotations

import argparse
import csv
import dataclasses
import hashlib
import json
import re
import subprocess
import sys
import unicodedata
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Iterable
from xml.etree import ElementTree as ET


NS = {
    "office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
    "text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
}


def qn(prefix: str, local: str) -> str:
    return f"{{{NS[prefix]}}}{local}"


BOOK_RE = re.compile(r"^BOOK\s+([IVX]+)$")
WORD_RE = re.compile(r"[A-Za-z]+(?:[’'][A-Za-z]+)?|[А-Яа-яЁё]+")
SEVERITIES = ("critical", "high", "medium", "low")


TOKI_PONA_WORDS = {
    "a", "akesi", "ala", "alasa", "ale", "ali", "anpa", "ante", "anu", "awen",
    "e", "en", "epiku", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan",
    "jasima", "jelo", "jo", "kala", "kalama", "kama", "kasi", "ken", "kepeken",
    "kijetesantakalu", "kili", "kin", "kipisi", "kiwen", "ko", "kokosila", "kon",
    "ku", "kule", "kulupu", "kute", "la", "lanpan", "lape", "laso", "lawa",
    "leko", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka",
    "lukin", "lupa", "ma", "majuna", "mama", "mani", "meli", "meso", "mi", "mije",
    "misikeke", "moku", "moli", "monsi", "monsuta", "mu", "mun", "musi", "mute",
    "n", "namako", "nanpa", "nasa", "nasin", "nena", "ni", "nimi", "noka", "o",
    "oko", "olin", "ona", "open", "pakala", "pali", "palisa", "pan", "pana", "pi",
    "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "pu", "sama", "seli",
    "selo", "seme", "sewi", "sijelo", "sike", "sin", "sina", "sinpin", "sitelen",
    "soko", "sona", "soweli", "suli", "suno", "supa", "suwi", "tan", "taso", "tawa",
    "telo", "tenpo", "toki", "tomo", "tonsi", "tu", "unpa", "uta", "utala", "walo",
    "powe", "soto", "teje", "wan", "waso", "wawa", "weka", "wile",
}


@dataclass(frozen=True)
class GuideEntry:
    section: str
    key: str
    variant: str
    rendered: str
    location: str
    render_style_complete: bool = True
    has_rendered_copy: bool = True


@dataclass(frozen=True)
class LatinBlock:
    book: str
    location: str
    text: str


@dataclass
class Segment:
    text: str
    style: str
    font: str


@dataclass
class Line:
    text: str
    segments: list[Segment]


@dataclass
class Paragraph:
    section: str
    global_index: int
    section_index: int
    style: str
    font: str
    text: str
    lines: list[Line]

    @property
    def location(self) -> str:
        slug = self.section.lower().replace(" ", "-") if self.section else "front-matter"
        return f"{slug}:p{self.section_index}"


@dataclass
class ExtractedDocument:
    headings: list[str]
    paragraphs: list[Paragraph]
    guide_entries: list[GuideEntry]
    books: dict[str, list[Paragraph]]
    style_fonts: dict[str, str]
    counts: dict[str, int]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def assert_source_unchanged(path: Path, expected_hash: str) -> None:
    actual = sha256_file(path)
    if actual != expected_hash:
        raise RuntimeError(f"Audit-only guard failed: source changed: {path}")


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value)
    value = value.replace("\u00a0", " ")
    return re.sub(r"\s+", " ", value).strip()


def normalize_key(value: str) -> str:
    return normalize_text(value).casefold()


def style_maps(*roots: ET.Element) -> tuple[dict[str, dict[str, str]], dict[str, str]]:
    definitions: dict[str, dict[str, str]] = {}
    for root in roots:
        for node in root.iter(qn("style", "style")):
            name = node.get(qn("style", "name"))
            if not name:
                continue
            props = node.find(qn("style", "text-properties"))
            definitions[name] = {
                "parent": node.get(qn("style", "parent-style-name"), ""),
                "font": (props.get(qn("style", "font-name"), "") if props is not None else ""),
            }

    resolved: dict[str, str] = {}

    def resolve(name: str, seen: set[str] | None = None) -> str:
        if not name:
            return ""
        if name in resolved:
            return resolved[name]
        seen = set() if seen is None else seen
        if name in seen:
            return ""
        seen.add(name)
        item = definitions.get(name, {})
        font = item.get("font", "") or resolve(item.get("parent", ""), seen)
        resolved[name] = font
        return font

    for style_name in definitions:
        resolve(style_name)
    return definitions, resolved


def line_segments(element: ET.Element, fonts: dict[str, str]) -> list[Line]:
    lines: list[list[Segment]] = [[]]

    def append(text: str | None, style_name: str) -> None:
        if text:
            lines[-1].append(Segment(text, style_name, fonts.get(style_name, "")))

    def visit(node: ET.Element, inherited_style: str) -> None:
        style_name = node.get(qn("text", "style-name"), inherited_style)
        append(node.text, style_name)
        for child in list(node):
            if child.tag == qn("text", "line-break"):
                lines.append([])
            elif child.tag == qn("text", "tab"):
                append("\t", style_name)
            else:
                visit(child, style_name)
            append(child.tail, style_name)

    visit(element, element.get(qn("text", "style-name"), ""))
    return [Line("".join(segment.text for segment in row), row) for row in lines]


def visible_text(element: ET.Element, fonts: dict[str, str]) -> str:
    return "\n".join(line.text for line in line_segments(element, fonts)).strip()


def split_exact_duplicate(value: str) -> tuple[str, str] | None:
    value = normalize_text(value)
    tokens = value.split()
    if len(tokens) % 2 == 0 and tokens[: len(tokens) // 2] == tokens[len(tokens) // 2 :]:
        half = " ".join(tokens[: len(tokens) // 2])
        return half, half
    for match in re.finditer(r"\s+", value):
        left = normalize_text(value[: match.start()])
        right = normalize_text(value[match.end() :])
        if left and left == right:
            return left, right
    return None


def extract_guide_entry(section: str, paragraph: Paragraph, line: Line, line_number: int) -> GuideEntry | None:
    match = re.match(r"^\s*(.+?)\s+[—–]\s+(.+?)\s*$", line.text)
    if not match:
        return None
    key, right = match.groups()
    right = normalize_text(right)
    duplicate = split_exact_duplicate(right)
    has_rendered_copy = duplicate is not None
    if duplicate:
        variant, rendered = duplicate
    else:
        variant, rendered = right, ""
    if not variant:
        return None
    styled_glyph = " ".join(
        segment.text.strip() for segment in line.segments
        if "nasin" in segment.font.casefold() and segment.text.strip()
    )
    styled_words = WORD_RE.findall(styled_glyph)
    rendered_words = WORD_RE.findall(rendered)
    style_complete = bool(rendered_words) and styled_words == rendered_words
    location = f"{section.lower().replace(' ', '-')}:p{paragraph.section_index}:l{line_number}"
    return GuideEntry(
        section, normalize_text(key), normalize_text(variant), normalize_text(rendered), location,
        render_style_complete=style_complete, has_rendered_copy=has_rendered_copy,
    )


def extract_odt(path: Path) -> ExtractedDocument:
    with zipfile.ZipFile(path) as archive:
        content = ET.fromstring(archive.read("content.xml"))
        styles = ET.fromstring(archive.read("styles.xml"))
    _, fonts = style_maps(styles, content)
    body = content.find(f"{qn('office', 'body')}/{qn('office', 'text')}")
    if body is None:
        raise ValueError("ODT has no office:text body")

    headings: list[str] = []
    paragraphs: list[Paragraph] = []
    books: dict[str, list[Paragraph]] = {}
    guide_entries: list[GuideEntry] = []
    section = ""
    section_index = 0
    paragraph_count = 0
    empty_count = 0

    for node in list(body):
        if node.tag == qn("text", "h"):
            section = normalize_text(visible_text(node, fonts))
            headings.append(section)
            section_index = 0
            if BOOK_RE.match(section):
                books[section] = []
            continue
        if node.tag != qn("text", "p"):
            continue
        paragraph_count += 1
        section_index += 1
        style = node.get(qn("text", "style-name"), "")
        lines = line_segments(node, fonts)
        text = "\n".join(line.text for line in lines).strip()
        if not text:
            empty_count += 1
        paragraph = Paragraph(section, paragraph_count, section_index, style, fonts.get(style, ""), text, lines)
        paragraphs.append(paragraph)
        if BOOK_RE.match(section):
            books[section].append(paragraph)
        if section in {"Recurring anchors", "Name Guide"}:
            for line_number, line in enumerate(lines, 1):
                entry = extract_guide_entry(section, paragraph, line, line_number)
                if entry:
                    guide_entries.append(entry)

    counts = {
        "headings": len(headings),
        "paragraphs": paragraph_count,
        "empty_paragraphs": empty_count,
        "guide_entries": len(guide_entries),
        "books": len(books),
    }
    return ExtractedDocument(headings, paragraphs, guide_entries, books, fonts, counts)


def finding(
    category: str,
    severity: str,
    confidence: str,
    location: str,
    message: str,
    *,
    observed: str = "",
    proposed_fix: str = "",
    safe_automatic: bool = False,
    manual: bool = False,
    evidence_source: str = "ODT",
) -> dict[str, Any]:
    return {
        "category": category,
        "severity": severity,
        "confidence": confidence,
        "location": location,
        "message": message,
        "observed": observed,
        "proposed_fix": proposed_fix,
        "safe_automatic": safe_automatic,
        "requires_manual_decision": manual,
        "evidence_source": evidence_source,
    }


def is_glyph_paragraph(paragraph: Paragraph) -> bool:
    return "nasin" in paragraph.font.casefold() or paragraph.style in {"P11"}


def audit_structure(document: ExtractedDocument) -> tuple[list[dict[str, Any]], list[LatinBlock]]:
    findings: list[dict[str, Any]] = []
    latin_blocks: list[LatinBlock] = []
    expected = [f"BOOK {roman}" for roman in (
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
        "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV",
    )]
    actual = [heading for heading in document.headings if BOOK_RE.match(heading)]
    if actual != expected:
        findings.append(finding(
            "STRUCTURE", "critical", "high", "document:headings",
            "Book headings are missing, duplicated, or out of order.",
            observed=json.dumps(actual, ensure_ascii=False), proposed_fix="Restore BOOK I–XXIV in order.", manual=True,
        ))

    for book in expected:
        rows = [paragraph for paragraph in document.books.get(book, []) if normalize_text(paragraph.text)]
        i = 0
        while i < len(rows):
            if i + 2 < len(rows) and normalize_text(rows[i + 1].text) == normalize_text(rows[i + 2].text):
                source, latin, glyph = rows[i], rows[i + 1], rows[i + 2]
                latin_blocks.append(LatinBlock(book, latin.location, latin.text))
                if is_glyph_paragraph(latin):
                    findings.append(finding(
                        "STYLE", "high", "high", latin.location,
                        "Latin Toki Pona layer uses a sitelen pona paragraph style.",
                        observed=latin.style, proposed_fix="Apply the surrounding Latin Toki Pona/Georgia style.",
                        safe_automatic=True,
                    ))
                if not is_glyph_paragraph(glyph):
                    findings.append(finding(
                        "STYLE", "medium", "high", glyph.location,
                        "Sitelen pona copy matches the Latin layer but lacks the expected sitelen pona paragraph style.",
                        observed=glyph.style, proposed_fix="Apply nasin-sitelen-pu to this complete paragraph.", safe_automatic=True,
                    ))
                i += 3
                continue

            if i + 2 < len(rows) and is_glyph_paragraph(rows[i + 2]):
                source, latin, glyph = rows[i], rows[i + 1], rows[i + 2]
                latin_blocks.append(LatinBlock(book, latin.location, latin.text))
                findings.append(finding(
                    "STRUCTURE", "critical", "high", glyph.location,
                    "Latin Toki Pona and sitelen pona layers differ.",
                    observed=f"LATIN: {latin.text[:180]} | SITELEN: {glyph.text[:180]}",
                    proposed_fix="Compare both ODT paragraphs and restore one identical Toki Pona text.", manual=True,
                ))
                i += 3
                continue

            if i + 1 < len(rows) and normalize_text(rows[i].text) == normalize_text(rows[i + 1].text):
                latin, glyph = rows[i], rows[i + 1]
                latin_blocks.append(LatinBlock(book, latin.location, latin.text))
                findings.append(finding(
                    "STRUCTURE", "critical", "high", latin.location,
                    "Toki Pona pair has no preceding English source paragraph.",
                    observed=latin.text[:240], proposed_fix="Restore or identify the missing English source layer.", manual=True,
                ))
                if not is_glyph_paragraph(glyph):
                    findings.append(finding(
                        "STYLE", "medium", "high", glyph.location,
                        "Probable sitelen pona copy lacks the expected font style.",
                        observed=glyph.style, proposed_fix="Apply nasin-sitelen-pu after confirming the pair.", safe_automatic=True,
                    ))
                i += 2
                continue

            next_start = None
            for candidate in range(i + 1, min(i + 8, len(rows))):
                if candidate + 2 >= len(rows):
                    break
                paired = normalize_text(rows[candidate + 1].text) == normalize_text(rows[candidate + 2].text)
                if paired or is_glyph_paragraph(rows[candidate + 2]):
                    next_start = candidate
                    break
            end = next_start if next_start is not None else len(rows)
            stray = rows[i:end]
            preview = " | ".join(item.text[:100] for item in stray[:3])
            findings.append(finding(
                "STRUCTURE", "critical", "medium", stray[0].location,
                f"Unpaired or inserted paragraph block interrupts EN → Toki Pona → sitelen pona sequence ({len(stray)} paragraph(s)).",
                observed=preview, proposed_fix="Review this ODT block and restore or explicitly classify its layer(s).", manual=True,
            ))
            if next_start is None:
                break
            i = next_start

    return findings, latin_blocks


def phrase_occurrences(phrase: str, blocks: Iterable[LatinBlock]) -> tuple[int, dict[str, int], list[str]]:
    escaped = re.escape(normalize_text(phrase))
    pattern = re.compile(rf"(?<![A-Za-z]){escaped}(?![A-Za-z])")
    by_book: Counter[str] = Counter()
    locations: list[str] = []
    for block in blocks:
        count = len(pattern.findall(normalize_text(block.text)))
        if count:
            by_book[block.book] += count
            locations.extend([block.location] * count)
    return sum(by_book.values()), dict(by_book), locations


def build_canonical_proposals(entries: list[GuideEntry], blocks: list[LatinBlock]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], list[GuideEntry]] = defaultdict(list)
    for entry in entries:
        grouped[(entry.section, normalize_key(entry.key))].append(entry)
    proposals: list[dict[str, Any]] = []
    for (section, _), group in sorted(grouped.items(), key=lambda item: (item[0][0], item[0][1])):
        forms: dict[str, list[GuideEntry]] = defaultdict(list)
        for entry in group:
            forms[normalize_text(entry.variant)].append(entry)
        variants = []
        for form, form_entries in forms.items():
            frequency, by_book, locations = phrase_occurrences(form, blocks)
            variants.append({
                "form": form,
                "guide_frequency": len(form_entries),
                "frequency": frequency,
                "by_book": by_book,
                "locations": locations,
                "guide_locations": [entry.location for entry in form_entries],
            })
        variants.sort(key=lambda item: (-item["frequency"], -item["guide_frequency"], item["form"]))
        unresolved = len(variants) > 1
        proposals.append({
            "section": section,
            "key": group[0].key,
            "status": "unresolved" if unresolved else "canonical",
            "confidence": "low" if unresolved else "high",
            "suggested_form": variants[0]["form"] if variants else None,
            "manual_decision_required": unresolved,
            "variants": variants,
        })
    return proposals


def audit_guides(entries: list[GuideEntry], proposals: list[dict[str, Any]]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for entry in entries:
        if entry.rendered and normalize_text(entry.variant) != normalize_text(entry.rendered):
            findings.append(finding(
                "STRUCTURE", "critical", "high", entry.location,
                "Guide Latin and sitelen pona copies differ.",
                observed=f"LATIN: {entry.variant} | SITELEN: {entry.rendered}",
                proposed_fix="Restore identical Toki Pona text in both guide copies.", manual=True,
            ))
        if not entry.has_rendered_copy:
            findings.append(finding(
                "STRUCTURE", "high", "medium", entry.location,
                "Guide entry has no exact second Toki Pona copy for sitelen pona rendering.",
                observed=f"{entry.key} — {entry.variant}",
                proposed_fix="Confirm the intended wording, then restore the duplicated sitelen pona copy.", manual=True,
            ))
        elif not entry.render_style_complete:
            findings.append(finding(
                "STYLE", "medium", "high", entry.location,
                "Guide copies match visibly, but the rendered copy is only partly styled as sitelen pona.",
                observed=f"{entry.key} — {entry.variant}",
                proposed_fix="Apply nasin-sitelen-pu to the complete second Toki Pona copy.", safe_automatic=True,
            ))
    for proposal in proposals:
        if proposal["status"] == "unresolved":
            detail = "; ".join(
                f"{variant['form']}={variant['frequency']} body/{variant['guide_frequency']} guide"
                for variant in proposal["variants"]
            )
            findings.append(finding(
                "CANONICAL_CONFLICT", "high", "high",
                proposal["variants"][0]["guide_locations"][0],
                f"Conflicting canonical forms for {proposal['key']}.",
                observed=detail, proposed_fix=f"Choose one canonical form; current frequency leader: {proposal['suggested_form']}.", manual=True,
            ))
    duplicate_groups: dict[tuple[str, str, str], list[GuideEntry]] = defaultdict(list)
    for entry in entries:
        duplicate_groups[(entry.section, normalize_key(entry.key), normalize_text(entry.variant))].append(entry)
    for (_, _, _), group in duplicate_groups.items():
        if len(group) > 1:
            findings.append(finding(
                "GUIDE_DUPLICATE", "low", "high", group[0].location,
                f"Exact guide entry repeats {len(group)} times.",
                observed=f"{group[0].key} — {group[0].variant}",
                proposed_fix="Review whether repeated guide entries are intentional.", manual=False,
            ))
    return findings


def edit_distance(a: str, b: str) -> int:
    previous = list(range(len(b) + 1))
    for i, char_a in enumerate(a, 1):
        current = [i]
        for j, char_b in enumerate(b, 1):
            current.append(min(current[-1] + 1, previous[j] + 1, previous[j - 1] + (char_a != char_b)))
        previous = current
    return previous[-1]


def unique_known_split(token: str) -> str | None:
    candidates = [f"{token[:i]} {token[i:]}" for i in range(1, len(token))
                  if token[:i] in TOKI_PONA_WORDS and token[i:] in TOKI_PONA_WORDS]
    return candidates[0] if len(candidates) == 1 else None


def audit_tokens(blocks: list[LatinBlock]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    unknown: dict[str, list[str]] = defaultdict(list)
    cyrillic: dict[str, list[str]] = defaultdict(list)
    for block in blocks:
        for token in WORD_RE.findall(block.text):
            if re.search(r"[А-Яа-яЁё]", token):
                cyrillic[token].append(block.location)
            elif token.islower() and token not in TOKI_PONA_WORDS:
                unknown[token].append(block.location)
    for token, locations in sorted(cyrillic.items(), key=lambda item: (-len(item[1]), item[0])):
        findings.append(finding(
            "TYPO_ANOMALY", "high", "high", locations[0],
            "Cyrillic text appears inside a Latin Toki Pona layer.", observed=token,
            proposed_fix="Review the ODT paragraph and remove or translate the inserted marker.", manual=True,
        ))
    for token, locations in sorted(unknown.items(), key=lambda item: (-len(item[1]), item[0])):
        split = unique_known_split(token)
        nearest = sorted(
            ((edit_distance(token, known), known) for known in TOKI_PONA_WORDS),
            key=lambda item: (item[0], item[1]),
        )
        suggestions = [known for distance, known in nearest if distance == nearest[0][0] and distance <= 2]
        if split:
            findings.append(finding(
                "TYPO_ANOMALY", "medium", "high", locations[0],
                f"Probable glued Toki Pona words occur {len(locations)} time(s).", observed=token,
                proposed_fix=split, safe_automatic=True,
            ))
        elif len(suggestions) == 1 and nearest[0][0] == 1:
            findings.append(finding(
                "TYPO_ANOMALY", "medium", "medium", locations[0],
                f"Unknown lowercase token occurs {len(locations)} time(s) and is one edit from a known word.",
                observed=token, proposed_fix=suggestions[0], manual=True,
            ))
        else:
            findings.append(finding(
                "TYPO_ANOMALY", "low", "low", locations[0],
                f"Unknown lowercase token occurs {len(locations)} time(s).", observed=token,
                proposed_fix=", ".join(suggestions[:3]), manual=True,
            ))
    return findings


def audit_pdf_extraction(pdf_text: str, expected_books: list[str]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    replacement_count = pdf_text.count("\ufffd")
    private_use_count = sum(1 for char in pdf_text if 0xE000 <= ord(char) <= 0xF8FF)
    extracted_books = []
    for line in pdf_text.splitlines():
        normalized = normalize_text(line)
        if BOOK_RE.match(normalized) and normalized not in extracted_books:
            extracted_books.append(normalized)
    if replacement_count:
        findings.append(finding(
            "SOURCE_ARTIFACT", "low", "high", "pdf:extracted-text",
            f"PDF extraction produced {replacement_count} replacement character(s); no manuscript typo is inferred.",
            observed="U+FFFD", evidence_source="PDF_ONLY",
        ))
    if private_use_count:
        findings.append(finding(
            "SOURCE_ARTIFACT", "low", "high", "pdf:extracted-text",
            f"PDF extraction produced {private_use_count} private-use glyph(s), likely from sitelen pona encoding.",
            evidence_source="PDF_ONLY",
        ))
    missing = [book for book in expected_books if book not in extracted_books]
    if missing:
        findings.append(finding(
            "SOURCE_ARTIFACT", "medium", "medium", "pdf:extracted-headings",
            "PDF text extraction did not expose every ODT book heading; this is not classified as a manuscript defect.",
            observed=", ".join(missing), evidence_source="PDF_ONLY",
        ))
    return findings


def run_tool(command: list[str]) -> tuple[str, str | None]:
    try:
        result = subprocess.run(command, check=False, capture_output=True, text=True)
    except FileNotFoundError:
        return "", f"missing tool: {command[0]}"
    if result.returncode:
        return result.stdout, result.stderr.strip() or f"exit {result.returncode}"
    return result.stdout, None


def inspect_pdf(path: Path, expected_books: list[str]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    info, info_error = run_tool(["pdfinfo", str(path)])
    fonts, fonts_error = run_tool(["pdffonts", str(path)])
    text, text_error = run_tool(["pdftotext", "-layout", str(path), "-"])
    metadata: dict[str, Any] = {"sha256": sha256_file(path), "tool_errors": []}
    for line in info.splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            if key in {"Pages", "Page size", "File size", "PDF version", "Producer", "CreationDate", "ModDate"}:
                metadata[key] = value.strip()
    metadata["fonts"] = [line.split()[0] for line in fonts.splitlines()[2:] if line.split()]
    for error in (info_error, fonts_error, text_error):
        if error:
            metadata["tool_errors"].append(error)
    findings = audit_pdf_extraction(text, expected_books) if not text_error else [finding(
        "SOURCE_ARTIFACT", "low", "high", "pdf:tooling",
        "PDF text extraction could not be run; ODT audit remains valid.", observed=text_error or "",
        evidence_source="PDF_ONLY",
    )]
    if fonts and "nasin" not in fonts.casefold():
        findings.append(finding(
            "STYLE", "high", "high", "pdf:fonts",
            "PDF does not report an embedded nasin sitelen pona font.",
            proposed_fix="Re-export the PDF with the sitelen pona font embedded.", manual=True, evidence_source="PDF_RENDER",
        ))
    return metadata, findings


def summarize(findings: list[dict[str, Any]], proposals: list[dict[str, Any]]) -> dict[str, Any]:
    severity = Counter(item["severity"] for item in findings)
    categories = Counter(item["category"] for item in findings)
    for category in (
        "STRUCTURE", "CANONICAL_CONFLICT", "CONSISTENCY", "TYPO_ANOMALY",
        "STYLE", "GUIDE_DUPLICATE", "SOURCE_ARTIFACT",
    ):
        categories.setdefault(category, 0)
    unresolved = sum(1 for item in proposals if item["status"] == "unresolved")
    manual_findings = sum(1 for item in findings if item["requires_manual_decision"] and item["category"] != "CANONICAL_CONFLICT")
    manual = unresolved + manual_findings
    safe = sum(1 for item in findings if item["safe_automatic"])
    counts = {level: severity.get(level, 0) for level in SEVERITIES}
    return {
        "severity_counts": counts,
        "category_counts": dict(sorted(categories.items())),
        "unresolved_canonical_conflicts": unresolved,
        "manual_decisions_required": manual,
        "safe_automatic_fixes_proposed": safe,
        "ready_for_kdp": counts["critical"] == 0 and counts["high"] == 0 and manual == 0,
    }


def render_report(
    summary: dict[str, Any],
    findings: list[dict[str, Any]],
    proposals: list[dict[str, Any]],
    manifest: dict[str, Any],
) -> str:
    counts = summary["severity_counts"]
    lines = [
        "# Publication readiness",
        "",
        f"- Critical: {counts['critical']}",
        f"- High: {counts['high']}",
        f"- Medium: {counts['medium']}",
        f"- Low: {counts['low']}",
        f"- Manual decisions required: {summary['manual_decisions_required']}",
        f"- Safe automatic fixes proposed: {summary['safe_automatic_fixes_proposed']}",
        f"- READY FOR KDP: {'YES' if summary['ready_for_kdp'] else 'NO'}",
        "",
        "> Audit-only result. No source text or formatting was modified.",
        "",
        "## Scope and source",
        "",
        f"- ODT: `{manifest.get('odt', {}).get('path', '')}`",
        f"- ODT SHA-256: `{manifest.get('odt', {}).get('sha256', '')}`",
    ]
    if manifest.get("pdf"):
        lines.extend([
            f"- PDF: `{manifest['pdf'].get('path', '')}`",
            f"- PDF pages: {manifest['pdf'].get('Pages', 'unknown')}",
        ])
    lines.extend(["", "## Critical and high findings", ""])
    important = [item for item in findings if item["severity"] in {"critical", "high"}]
    if not important:
        lines.append("None.")
    else:
        for index, item in enumerate(important, 1):
            lines.extend([
                f"### {index}. [{item['severity'].upper()}] {item['category']} — `{item['location']}`",
                "",
                item["message"],
                "",
                f"- Confidence: {item['confidence']}",
                f"- Evidence: {item['evidence_source']}",
                f"- Observed: {item['observed'] or 'n/a'}",
                f"- Proposed fix: {item['proposed_fix'] or 'manual review only'}",
                "",
            ])
    unresolved = [item for item in proposals if item["status"] == "unresolved"]
    lines.extend(["## Unresolved canonical conflicts", ""])
    if not unresolved:
        lines.append("None.")
    else:
        for item in unresolved:
            lines.append(f"### {item['section']}: {item['key']}")
            lines.append("")
            for variant in item["variants"]:
                distribution = ", ".join(f"{book}={count}" for book, count in variant["by_book"].items()) or "not found"
                lines.append(
                    f"- `{variant['form']}` — body {variant['frequency']}; guide {variant['guide_frequency']}; {distribution}"
                )
            lines.append("")
    safe = [item for item in findings if item["safe_automatic"]]
    lines.extend(["## Safe automatic fixes proposed", ""])
    if not safe:
        lines.append("None.")
    else:
        for item in safe:
            lines.append(f"- `{item['location']}`: {item['observed']} → {item['proposed_fix']}")
    lines.extend(["", "## Counts by category", ""])
    for category, count in summary.get("category_counts", {}).items():
        lines.append(f"- {category}: {count}")
    lines.extend([
        "",
        "## Interpretation boundary",
        "",
        "`SOURCE_ARTIFACT` findings come only from PDF/sitelen-pona extraction and are not manuscript typos without corroborating ODT evidence. The audit checks mechanical consistency, structure, styles, and proposed canonical forms; it does not certify literary or translation quality.",
        "",
    ])
    return "\n".join(lines)


def serializable_paragraph(paragraph: Paragraph) -> dict[str, Any]:
    return {
        "section": paragraph.section,
        "location": paragraph.location,
        "style": paragraph.style,
        "font": paragraph.font,
        "text": paragraph.text,
    }


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_jsonl(path: Path, values: Iterable[Any]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for value in values:
            if dataclasses.is_dataclass(value):
                value = dataclasses.asdict(value)
            handle.write(json.dumps(value, ensure_ascii=False) + "\n")


def write_fix_csv(path: Path, findings: list[dict[str, Any]]) -> None:
    fields = [
        "severity", "confidence", "category", "location", "observed", "proposed_fix",
        "safe_automatic", "requires_manual_decision", "evidence_source", "message",
    ]
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for item in findings:
            writer.writerow({field: item.get(field, "") for field in fields})


def run_extract(odt: Path, out: Path) -> int:
    before = sha256_file(odt)
    document = extract_odt(odt)
    out.mkdir(parents=True, exist_ok=True)
    write_jsonl(out / "extracted-blocks.jsonl", (serializable_paragraph(item) for item in document.paragraphs))
    write_jsonl(out / "guide-entries.jsonl", document.guide_entries)
    write_json(out / "extraction-summary.json", document.counts)
    assert_source_unchanged(odt, before)
    print(json.dumps(document.counts, ensure_ascii=False))
    return 0


def run_audit(odt: Path, pdf: Path | None, out: Path) -> int:
    odt_hash = sha256_file(odt)
    pdf_hash = sha256_file(pdf) if pdf else None
    document = extract_odt(odt)
    findings, latin_blocks = audit_structure(document)
    proposals = build_canonical_proposals(document.guide_entries, latin_blocks)
    findings.extend(audit_guides(document.guide_entries, proposals))
    findings.extend(audit_tokens(latin_blocks))

    expected_books = [heading for heading in document.headings if BOOK_RE.match(heading)]
    pdf_metadata: dict[str, Any] | None = None
    if pdf:
        pdf_metadata, pdf_findings = inspect_pdf(pdf, expected_books)
        findings.extend(pdf_findings)

    severity_rank = {severity: index for index, severity in enumerate(SEVERITIES)}
    findings.sort(key=lambda item: (severity_rank[item["severity"]], item["category"], item["location"]))
    for index, item in enumerate(findings, 1):
        item["id"] = f"QA-{index:05d}"

    summary = summarize(findings, proposals)
    manifest: dict[str, Any] = {
        "mode": "audit-only",
        "odt": {"path": str(odt), "sha256": odt_hash, **document.counts},
    }
    if pdf and pdf_metadata is not None:
        manifest["pdf"] = {"path": str(pdf), **pdf_metadata}

    out.mkdir(parents=True, exist_ok=True)
    write_json(out / "manifest.json", manifest)
    write_json(out / "summary.json", summary)
    write_json(out / "canonical-proposals.json", proposals)
    write_jsonl(out / "findings.jsonl", findings)
    write_fix_csv(out / "proposed-fixes.csv", findings)
    write_jsonl(out / "extracted-blocks.jsonl", (serializable_paragraph(item) for item in document.paragraphs))
    write_jsonl(out / "guide-entries.jsonl", document.guide_entries)
    (out / "report.md").write_text(render_report(summary, findings, proposals, manifest), encoding="utf-8")

    assert_source_unchanged(odt, odt_hash)
    if pdf and pdf_hash:
        assert_source_unchanged(pdf, pdf_hash)
    print(json.dumps(summary, ensure_ascii=False))
    return 0


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description="Audit-only editorial QA for layered Toki Pona ODT manuscripts.")
    subcommands = result.add_subparsers(dest="command", required=True)
    extract = subcommands.add_parser("extract", help="Extract ODT blocks without changing the source.")
    extract.add_argument("--odt", required=True, type=Path)
    extract.add_argument("--out", required=True, type=Path)
    audit = subcommands.add_parser("audit", help="Run complete audit and write reports; never modifies sources.")
    audit.add_argument("--odt", required=True, type=Path)
    audit.add_argument("--pdf", type=Path)
    audit.add_argument("--out", required=True, type=Path)
    audit.add_argument("--dry-run", action="store_true", required=True, help="Required audit-only safety acknowledgement.")
    return result


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    if args.command == "extract":
        return run_extract(args.odt.resolve(), args.out.resolve())
    return run_audit(args.odt.resolve(), args.pdf.resolve() if args.pdf else None, args.out.resolve())


if __name__ == "__main__":
    sys.exit(main())
