#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"

npm test --prefix "$ROOT_DIR/backend"
npm run vendor:check --prefix "$ROOT_DIR/frontend"
npm run build --prefix "$ROOT_DIR/frontend"
npm run lint --prefix "$ROOT_DIR/frontend"

(
  cd "$ROOT_DIR/packages/sitelen-emoji"
  "$PYTHON_BIN" -m pytest -q
  npm test --prefix packages/js
)

(
  cd "$ROOT_DIR/packages/sitelen-layer-plugin"
  npm run emoji:update
  git diff --exit-code -- src/generated/emojiMapping.generated.ts
  npm run ci:release
)

PYTHONPATH="$ROOT_DIR/packages/sitelen-layer-plugin/python/sitelen-layer-static/src" \
  "$PYTHON_BIN" -m pytest -q "$ROOT_DIR/packages/sitelen-layer-plugin/python/sitelen-layer-static/tests"
"$PYTHON_BIN" -m unittest discover -s "$ROOT_DIR/skills/toki-pona-formatting-pass/tests"
