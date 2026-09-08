# Release Notes — v0.3.5

## Release summary
- v0.3.0-track integration infrastructure has reached publishable state: framework/CMS PoC adapter artifacts are now part of distributable outputs, include route-guarded initialization metadata, and are validated in CI.
- Release pipeline is now production-ready with trusted publishing support and manual workflow controls (`workflow_dispatch`, `dryRun`, `publishMode`).

## Package/CI changes
- Repository metadata was aligned for provenance workflows (`repository.url = https://github.com/markoblogo/sitelen-layer-plugin`).
- Release workflows now use Node.js 24 in GitHub Actions for trusted publishing compatibility.
- `package.json` `files` list now contains adapter/demo/integration artifacts for release packaging.
- Smoke checks were added for:
  - adapter zip generation (`npm run pack:adapters`, `npm run smoke:adapters`)
  - npm tarball publication shape (`npm run smoke:publication`)
- Added v0.3.0 integration notes and migration guidance:
  - [docs/V0.3_INTEGRATION_TRACK.md](docs/V0.3_INTEGRATION_TRACK.md)
  - [docs/MIGRATION_v0.3.0.md](docs/MIGRATION_v0.3.0.md)

## Follow-up (v0.3.6)
- Next step is `v0.3.6`/next patch with UI polish + remaining adapter hardening, then dry-run (`--field dryRun=true`) and production (`--field dryRun=false`) release validation.
