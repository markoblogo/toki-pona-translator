#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/visual_build.sh input.txt
#   ./scripts/visual_build.sh input.txt out/visual
#   ./scripts/visual_build.sh --fetch input.txt
#   ./scripts/visual_build.sh --fetch --pdf input.txt

FETCH=0
PDF=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fetch) FETCH=1; shift ;;
    --pdf)   PDF=1; shift ;;
    -h|--help)
      echo "Usage: $0 [--fetch] [--pdf] <input.txt> [outdir]"
      exit 0
      ;;
    *) break ;;
  esac
done

if [[ $# -lt 1 ]]; then
  echo "Error: input file required. Try: $0 --fetch input.txt out/visual"
  exit 2
fi

INP="$1"
OUTDIR="${2:-out/visual}"

if [[ ! -f "$INP" ]]; then
  echo "Error: input file not found: $INP"
  exit 2
fi

# Always run from repo root (where this script lives in scripts/)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [[ $FETCH -eq 1 ]]; then
  echo "Fetching Twemoji assets (if needed)..."
  python3 -m tools.fetch_twemoji_assets
fi

echo "Exporting to HTML..."
python3 -m tools.emojify_to_html --in "$INP" --outdir "$OUTDIR"

echo "OK: $OUTDIR/index.html"

if [[ $PDF -eq 1 ]]; then
  # Try Chrome headless for PDF
  CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  if [[ ! -x "$CHROME_BIN" ]]; then
    echo "PDF requested, but Google Chrome not found at:"
    echo "  $CHROME_BIN"
    echo "Open $OUTDIR/index.html in a browser and print to PDF, or install Chrome."
    exit 0
  fi

  FILE_URL="file://$REPO_ROOT/$OUTDIR/index.html"
  PDF_OUT="$OUTDIR/book.pdf"

  echo "Rendering PDF via Chrome headless..."
  "$CHROME_BIN" --headless --disable-gpu --print-to-pdf="$PDF_OUT" "$FILE_URL"
  echo "OK: $PDF_OUT"
fi
