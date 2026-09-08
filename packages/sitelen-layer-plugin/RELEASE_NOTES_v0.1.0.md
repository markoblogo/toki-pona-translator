# Release Notes v0.1.0

## Core Features

- Toki pona dominance detector and eligibility gate (`>= 70%` by default)
- Layer switching for:
  - `latin`
  - `sitelen-pona` (font-only pipeline, `nasin-sitelen-pu` recommended)
  - `sitelen-emoji` (mapping snapshot integration)
- Diagnostics API + debug overlay
- Site/locale profiles (`/tok/`, `/en/`, hostname/lang/path matching)
- Dynamic content support with MutationObserver batching/debounce + incremental updates
- SPA navigation support (`popstate`, `hashchange`, optional history patching)
- Test suite (unit + jsdom integration) and QA fixtures

## Known Limitations

- Not a machine translation tool
- No image text/OCR support
- sitelen pona rendering may need site-specific CSS tuning
- Complex SPAs may still benefit from explicit route hooks calling `refresh()`
- sitelen emoji output quality depends on upstream mapping snapshot coverage

## Roadmap

- Playwright e2e scenarios
- CI coverage thresholds
- Richer mapping QA/coverage reports
- Typography/cartouche refinements
- Versioned profile packs/presets

## GitHub Release Description (copy/paste)

`v0.1.0` introduces a production-ready site-owner plugin for toki pona display layers.

Highlights:

- Eligibility detector (`>=70%` default)
- Layer switching (`latin`, `sitelen-pona`, `sitelen-emoji`)
- sitelen pona font pipeline (`nasin-sitelen-pu`-oriented)
- Diagnostics overlay + API
- Profiles for locale/path targeting
- Dynamic content support for SPA-like pages
- Tests + QA fixtures

This package is not a translator, does not process image text, and is intended for site creators integrating into their own pages.
