# Toki Pona workspace

- Treat `packages/sitelen-emoji/profiles/default-stable.v1.json` as the canonical sitelen emoji mapping.
- Keep the translator app, mapping packages, and display-layer package independently buildable and publishable.
- Do not duplicate or hand-edit generated mappings. Update the canonical profile, run the package generators, and verify consumers.
- Preserve existing npm and PyPI package names and public APIs unless a breaking release is explicitly approved.
- Keep translation, transliteration/display, and editorial manuscript QA as separate capabilities.
- For layered ODT manuscript work, load `skills/toki-pona-formatting-pass/SKILL.md`; mechanical QA is not translation certification.
- Before deleting or redirecting a former repository, preserve its release assets, tags, package metadata, and migration path.

## Verification

- Translator: `cd frontend && npm ci && npm run build`
- Backend syntax: `node --check backend/server.js && node --check backend/api/translate.js`
- Sitelen emoji: install `packages/sitelen-emoji/requirements-dev.txt`, then run `pytest` in that package and `npm test --prefix packages/js`.
- Sitelen layer: `cd packages/sitelen-layer-plugin && npm ci && npm run ci:release`.
- Formatting skill: `python -m unittest discover -s skills/toki-pona-formatting-pass/tests`.
