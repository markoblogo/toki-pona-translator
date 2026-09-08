# Changelog

## v0.3.9

### Added/Improved

- Browser-extension PoC hardening finalization (`route-aware` bootstrap, duplicate-safe guards).
- Floating toggle polish final pass (hover/focus micro-interactions, preview transition refinements).

### Validation

- `workflow_dispatch` staging + production run for `release-publish.yml` on `v0.3.9`.


## v0.3.8

### Added/Improved

- Browser-extension PoC hardening:
  - route-aware bootstrap now evaluates full route (`pathname + search + hash`), not only path;
  - guarded `chrome.runtime.sendMessage` callback with `chrome.runtime.lastError` handling;
  - robust plugin lifecycle state guard to avoid duplicate init races across repeated content-script injections;
  - clearer status surface for disabled/bootstrapping/failure states.
- UI polish in floating toggle:
  - refined expansion micro-interactions and hover feedback;
  - improved focus and reduced-motion friendly transitions.
- Release prep updates:
  - added `RELEASE_NOTES_v0.3.8.md` and updated changelog entry for the v0.3.0-track closure.

### Validation

- `npm run build`
- `npm run ci:release`
- workflow dispatch `release-publish.yml` dry run + production checks for fresh tag.

## v0.3.7 (release prep)

### Planned

- Finalize v0.3.0-track polish and UX/integration hardening before final production publish.
- Run release validation with a fresh tag (`publishMode=trusted`, `dryRun=true`, then `dryRun=false`) from `release-publish.yml`.

### Fixed

- Package metadata cleanup for npm publish stability:
  - normalized `repository.url` to `git+https://github.com/markoblogo/sitelen-layer-plugin.git`.
  - removed `./` prefix in `bin` path to avoid publish auto-corrections.

## v0.3.5

### Added

- Integration PoC artifacts are now included in release distribution (`adapters/*`, `demo/integration/*`).
- Release pipeline documentation and workflow hardening for v0.3.0-track (staging mode and manual inputs).
- Release notes for the v0.3.x integration state (`RELEASE_NOTES_v0.3.5.md`).

### Improved

- Trusted publishing workflow reliability improvements: Node.js 24 runtime in CI and repository provenance metadata (`repository.url`) for npm OIDC verification.
- CLI packaging metadata cleanup to prevent npm bin auto-correction warnings.
- Stronger release checks: adapter zip smoke and tarball publication smoke in CI release path.

### Docs

- Updated migration and integration docs for route-guarded adapter lifecycle and distribution packaging in this track.


## v0.3.0

### Added

- v0.3 integration pack: browser-extension, obsidian, logseq, wordpress, ghost PoC artifacts under `adapters/*`.
- `entry.json` manifests for adapter distribution metadata and release workflow.
- `demo/integration/*` pages for smoke/manual testing of route guard and extension flow.
- `npm run pack:adapters`, `npm run smoke:adapters`, `npm run smoke:publication`, and GitHub workflow `.github/workflows/release-preflight.yml` for v0.3.0 preflight packaging validation.
- Added release pipeline (`.github/workflows/release-publish.yml`) for tag/manual releases: build, test, adapter packaging/smoke, `npm publish`, and GitHub release asset upload (adapter zip + npm tarball).
- Added release hardening for staging/manual dispatch: `workflow_dispatch` now supports `dryRun` plus explicit instructions for `NPM_TOKEN`/`GITHUB_TOKEN` setup in [docs/RELEASE_PIPELINE_SETUP.md](docs/RELEASE_PIPELINE_SETUP.md).

### Improved

- `routeInclude` / `routeExclude` support in `vite-plugin` and `webpack-plugin` for allowlist/denylist initialization control.
- CSP-safe integration safeguards in browser-extension PoC: route-guarded bootstrap and idempotent plugin instance guard.
- Packaging updates in `package.json` to include adapter and demo artifacts in distributed `files` list.
- Added CI preflight checks for adapter zip artifacts and npm tarball (`npm pack`) output in addition to `npm run build` and tests.

### Docs

- Updated v0.3 integration track and migration note for route-guard and CMS adapter lifecycle behavior.

## v0.1.1

### Added

- `sitelen-pona` transform MVP path (`sitelenPona.renderStrategy: 'transform'`) with token mapping subset and fallback for unknown tokens.
- Sitelen pona transform diagnostics fields: replacement count, word-token count, and coverage ratio.
- Transformer and DOM integration tests for sitelen-pona transform mode and latin restoration flow.

### Improved

- Toggle integration UX for real sites: header inline mount mode, size variants, custom labels, and stable default labels (`TP / SP / 🙂`).
- Expanded MVP sitelen-pona mapping based on validated `/tp` content integration in toki-free-kit.
- Debug diagnostics/overlay coverage for toggle state, profile match context, emoji coverage, and sitelen-pona transform metrics.

### Docs

- README and integration docs updated with live-validated toki-free-kit integration details and runtime verification fingerprints.
- Explicit guidance for `font-only` vs `transform` sitelen-pona modes.

### Known Limitations

- Sitelen pona transform remains an MVP subset; coverage depends on current mapping and page content.
- `font-only` remains available and is still the safer styling path for broad compatibility.

## v0.1.0

### Added

- Public site-owner plugin API for layered toki pona display.
- Profiles API for hostname/path/lang matching with priority.
- Debug diagnostics overlay with profile and observer details.
- MutationObserver batching/debounce with incremental update mode.
- Optional SPA navigation observation.
- QA fixtures and automated tests (tokenizer, detector, transformers, profile resolver, jsdom integration).

### Improved

- Package ergonomics for npm usage (`exports`, css subpath export, type exports).
- README with copy-paste integrations, troubleshooting, and production guidance.

### Notes

- This package does not perform machine translation.
