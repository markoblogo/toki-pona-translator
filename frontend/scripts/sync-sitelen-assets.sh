#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE_DIR="$ROOT_DIR/packages/sitelen-emoji"
TARGET_DIR="$ROOT_DIR/frontend/public/mapping"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/profiles"
cp "$SOURCE_DIR/docs/index.html" "$TARGET_DIR/index.html"
cp "$SOURCE_DIR/docs/mapping.md" "$TARGET_DIR/mapping.md"
cp "$SOURCE_DIR/docs/coverage.md" "$TARGET_DIR/coverage.md"
cp "$SOURCE_DIR/profiles/"*.json "$TARGET_DIR/profiles/"
