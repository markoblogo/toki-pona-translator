#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR_DIR="$ROOT_DIR/src/vendor/stoic-landing"
SNAPSHOT_FILE="$ROOT_DIR/src/vendor/stoic-landing.snapshot.sha256"

if [[ ! -d "$VENDOR_DIR" ]]; then
  echo "Missing vendor directory: $VENDOR_DIR" >&2
  exit 1
fi

if [[ ! -f "$SNAPSHOT_FILE" ]]; then
  echo "Missing snapshot file: $SNAPSHOT_FILE" >&2
  exit 1
fi

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

(
  cd "$VENDOR_DIR"
  find . -type f | sed 's#^\./##' | sort | while read -r rel; do
    shasum -a 256 "$rel" | awk '{print $1 "  " $2}'
  done
) > "$TMP_FILE"

if ! diff -u "$SNAPSHOT_FILE" "$TMP_FILE"; then
  echo
  echo "Vendor guard failed: frontend/src/vendor/stoic-landing differs from snapshot." >&2
  echo "If you intentionally updated the vendor copy, regenerate stoic-landing.snapshot.sha256." >&2
  exit 1
fi

echo "Vendor guard passed: stoic-landing matches snapshot."
