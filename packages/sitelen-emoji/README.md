# sitelen-emoji
A pinned, versioned “source of truth” profile for toki pona → sitelen emoji, with reproducible book-ready visuals.

[![build](https://github.com/markoblogo/toki-pona-translator/actions/workflows/monorepo-ci.yml/badge.svg?branch=main)](https://github.com/markoblogo/toki-pona-translator/actions/workflows/monorepo-ci.yml)
[![tag](https://img.shields.io/github/v/tag/markoblogo/toki-pona-translator?filter=sitelen-emoji-*)](https://github.com/markoblogo/toki-pona-translator/tags)
[![license](https://img.shields.io/github/license/markoblogo/toki-pona-translator)](https://github.com/markoblogo/toki-pona-translator/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/sitelen-emoji)](https://www.npmjs.com/package/sitelen-emoji)
[![PyPI](https://img.shields.io/pypi/v/sitelen-emoji)](https://pypi.org/project/sitelen-emoji/)
[![Reader's Kit](https://img.shields.io/badge/Reader's%20Kit-free%20PDF-0f766e)](https://toki.abvx.xyz/kit)
[![Viewer](https://img.shields.io/badge/live-mapping%20viewer-2563eb)](https://toki.abvx.xyz/mapping/)

<p align="center">
  <img src="docs/cover.png" alt="sitelen emoji mapping cover" width="980" />
</p>

Canonical **frozen** mapping for **toki pona → sitelen emoji**.

**License:** MIT. See [LICENSE](LICENSE).

> Goal: one stable “source of truth” for production (translator, books), with reproducible visuals.

**Browse the mapping:** https://toki.abvx.xyz/mapping/

**Free toki pona Reader’s Kit:** https://toki.abvx.xyz/kit

---

## Use the data

- Browser: open the [live mapping viewer](https://toki.abvx.xyz/mapping/).
- npm: `npm install sitelen-emoji`
- PyPI: `python -m pip install sitelen-emoji`
- JSON: pin a release tag and fetch `profiles/default-stable.v1.json`.
- Profile variants: use `profiles/minimal.v1.json` for core words only or `profiles/extended.v1.json` for community/upstream entries.

## What is frozen vs generated

- **Frozen (source of truth):**
  - `profiles/default-stable.v1.json` — pinned mapping intended for integrations and publishing.
  - `profiles/minimal.v1.json` — core 120 toki pona words only.
  - `profiles/extended.v1.json` — broader community/upstream mapping.
  - `profiles/schema.json` — JSON Schema for validating profile files.

- **Generated (for comparison / upstream tracking):**
  - `dist/default-stable.json` — produced by `tools/build_default_stable.py` from upstream sources.
  - Use `tools/diff_profiles.py` to see what changed vs frozen.

---

## Pinned profile URL (recommended for integrations)

Pin to a **git tag** (recommended) and fetch the frozen profile via `raw.githubusercontent.com`.

Example:

```text
https://raw.githubusercontent.com/markoblogo/toki-pona-translator/sitelen-emoji-v1.1.0/packages/sitelen-emoji/profiles/default-stable.v1.json
```

Replace `sitelen-emoji-v1.1.0` with the release tag you want to pin to.

Why pin: your translator/book pipeline should not change output unless **you** intentionally update the pinned version.

---

## **Translator integration (runtime behavior)**


**Recommended approach:**

1. Fetch the pinned frozen JSON on startup (by tag URL above).
2. Parse JSON and keep it in memory (optionally cache to disk/redis).
3. Resolve aliases (e.g. ali → ale) and map word → entries[word].


Do **not** auto-update from main or “latest” without a version bump/tag change.

---

## **Dev setup**

```
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

---

## **Build (generate dist)**

```
python tools/build_default_stable.py
```

---

## Documentation

- [Mapping reference](docs/mapping.md)
- [Coverage report](docs/coverage.md)
- [Design principles](docs/design-principles.md)
- [Publishing setup](docs/publishing.md)
- [Changelog](CHANGELOG.md)

Generated docs should be regenerated after profile changes:

```bash
python3 -m tools.export_mapping_md
python3 -m tools.coverage_report
```

---

## Examples

```bash
python3 examples/python-load-profile.py
node examples/node-load-profile.js
```

## Packages

Python:

```bash
python -m pip install sitelen-emoji
```

```python
from sitelen_emoji import lookup, translate

lookup("toki")          # "🗣️"
translate("jan pona")  # "👤 👍"
```

Node:

```bash
npm install sitelen-emoji
```

```js
const { lookup, translate } = require("sitelen-emoji");

lookup("toki");          // "🗣️"
translate("jan pona");  // "👤 👍"
```

---

## **Books pipeline**

### **1) Convert toki pona text → sitelen emoji tokens**


Input: .txt or .md with toki pona text

Output: a text file where tokens are mapped to emoji (spaces preserved, newlines preserved)

```
python3 -m tools.convert_tp_text --in book_tp.txt --out book_se.txt
```

Options:

- --no-dot to keep . as text (otherwise mapped to _punct_period)
- --no-colon to keep : as text (otherwise mapped to _punct_colon)


### **2) Visual-stable build (HTML + optional PDF)**

This renders emoji as **Twemoji PNG** so visuals are consistent across Kindle/apps/devices.

Fetch Twemoji assets (once per machine/version):

```
python3 -m tools.fetch_twemoji_assets
```

Build visual HTML (copies only used PNGs into the output folder):

```
./scripts/visual_build.sh book_se.txt out/visual
open out/visual/index.html
```

Optional PDF (requires Google Chrome installed):

```
./scripts/visual_build.sh --fetch --pdf book_se.txt out/visual
open out/visual/book.pdf
```

---

## **Updating upstream safely (without breaking published output)**

1. Regenerate dist/ from upstream:

```
python tools/build_default_stable.py
```

2. Compare frozen vs new generated:

```
python3 -m tools.diff_profiles
```

3. If you intentionally want a new frozen version, create a new file under profiles/
    
    (e.g. profiles/default-stable.v2.json), update tests if needed, then tag a new release.
    

---

## **Releasing a pinned version**

Releases are managed by release-please from Conventional Commits.

1. Merge feature/fix commits into `main`.
2. Let the `release-please` workflow open a release PR.
3. Merge the release PR to create the GitHub Release and tag.

Consumers can pin to release tags:

```
https://raw.githubusercontent.com/markoblogo/toki-pona-translator/sitelen-emoji-v1.1.0/packages/sitelen-emoji/profiles/default-stable.v1.json
```

---

## License & attribution

- Repository code and profiles: MIT License (see `LICENSE`).
- Twemoji graphics are **not included** in this repository and are fetched separately.
  If you publish outputs that embed Twemoji PNG, include attribution (Twemoji is CC BY 4.0).

## Want to read more toki pona?

Free beginner-friendly Reader’s Kit (PDF): https://toki.abvx.xyz/kit
