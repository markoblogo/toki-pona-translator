# Editorial QA mode

Run the deterministic audit before proposing manuscript edits:

```bash
python3 scripts/odt_editorial_qa.py audit \
  --odt /absolute/path/manuscript.odt \
  --pdf /absolute/path/reference.pdf \
  --out /absolute/path/audit-output \
  --dry-run
```

The script uses only the Python standard library plus optional system PDF tools (`pdfinfo`, `pdffonts`, `pdftotext`). It reads ODT ZIP/XML directly and has no apply, replace, or write-back operation.

## Evidence model

- ODT is source of truth. Every manuscript typo or structural claim needs ODT evidence.
- PDF-only extraction anomalies use category `SOURCE_ARTIFACT` and evidence source `PDF_ONLY`.
- Latin Toki Pona and sitelen pona copies are expected to have identical normalized text. The sitelen copy is distinguished by ODT style/font evidence plus adjacent equality, not fixed paragraph offsets alone.
- Guide duplication caused by the readable Latin copy plus the rendered sitelen copy is intentional and is not a duplicate entry.
- Canonical proposals retain every variant's guide frequency, body frequency, per-Book counts, and exact body/guide locations. Conflicting forms remain unresolved until human approval.

## Severity and confidence

- `critical`: missing/reordered books or layers; differing Latin/sitelen text.
- `high`: canonical conflicts, mixed-script content, or a wrong layer role.
- `medium`: probable typo/glued token, font mismatch with identical text, or incomplete PDF extraction.
- `low`: exact guide duplicates, low-confidence unknown tokens, or extraction artifacts.

Confidence is independent: `high` for exact XML/text evidence, `medium` for strong heuristics, and `low` for fuzzy candidates.

## Outputs

- `report.md`: publication-readiness summary first, then critical/high findings, unresolved canonical conflicts, and safe automatic proposals.
- `summary.json`: counts and the KDP readiness decision.
- `canonical-proposals.json`: variants, frequencies, Book distribution, and locations.
- `findings.jsonl`: complete machine-readable findings.
- `proposed-fixes.csv`: review queue; proposals only.
- `manifest.json`: source hashes and ODT/PDF metadata.
- `extracted-blocks.jsonl`, `guide-entries.jsonl`: traceable extraction evidence.

`READY FOR KDP: YES` requires zero critical findings, zero high findings, and zero manual decisions. A `NO` result is a mechanical publication gate, not a judgment of literary quality.
