# Release Notes — v0.3.9

## Scope

- Finalize v0.3.0-track for production with `v0.3.9`.

## What changed

- Browser-extension PoC hardening:
  - route-aware bootstrap now evaluates full route (`pathname + search + hash`);
  - guarded `chrome.runtime.sendMessage` callback and robust state handling in content bootstrap path.
- Floating toggle polish:
  - refined animation and hover/focus polish for preview/mode transitions.

## Validation checklist

- `npm run build`
- `npm run test:run`
- `npm run ci:release`
- `npm run pack:adapters`
- `npm run smoke:adapters`
- `npm run smoke:publication`
- `workflow_dispatch` in `release-publish.yml` with:
  - `publishMode=trusted`, `dryRun=true`, `tag=v0.3.9`
  - then `publishMode=trusted`, `dryRun=false`, `tag=v0.3.9`
