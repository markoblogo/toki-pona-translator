# Release Notes — v0.3.7

## Scope

- Finalize v0.3.0-track UI polish and adapter hardening.
- Remove npm publish auto-correct warnings by normalizing package metadata (`bin`, `repository.url`).

## Validation checklist

- `npm run build`
- `npm run test:run`
- `npm run ci:release`
- `npm run pack:adapters`
- `npm run smoke:adapters`
- `npm run smoke:publication`
- GitHub release contains `dist/adapters/*.zip` and `<package>-<version>.tgz`
- Staged release run: `workflow_dispatch` + `publishMode=trusted`, `dryRun=true`.
- Production run: `workflow_dispatch` + `publishMode=trusted`, `dryRun=false` with a new patch tag.
