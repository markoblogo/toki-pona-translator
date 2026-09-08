# Release Notes — v0.3.8

## Scope

- v0.3.0-track closure: final UI polish + adapter hardening.

## What changed

- Browser-extension PoC hardening
  - Route checks in `adapters/browser-extension/content.js` now evaluate full client route (`pathname + search + hash`).
  - `chrome.runtime.sendMessage` flow now handles runtime `lastError` safely.
  - Duplicate-init guard made resilient to repeated script injections and partial bootstrap states.
  - Bootstrap state is now explicitly tracked (`bootstrapping` / `ready` / `disabled` / `error`) in the injected global.
- UI polish in floating toggle
  - Added refined transition details for expanded/collapsed states, focus rings, and hover micro-motion.
  - Kept transitions reduced-motion-safe via existing media-query guard.

## Validation checklist

- `npm run build`
- `npm run test:run`
- `npm run ci:release`
- `npm run pack:adapters`
- `npm run smoke:adapters`
- `npm run smoke:publication`
- GitHub release includes:
  - `dist/adapters/*.zip`
  - `<package>-<version>.tgz`
- `workflow_dispatch` in `release-publish.yml` with:
  - `publishMode=trusted`, `dryRun=true`, `tag=v0.3.8`
  - then `publishMode=trusted`, `dryRun=false`, `tag=v0.3.8`
