# Browser Extension PoC (Route-safe + idempotent bootstrap)

Manifest V3 PoC scaffold with:
- route allow/deny checks
- route-match mode (`contains`)
- optional extension flag persistence (`enabled`)
- idempotent bootstrap guard to avoid double-init on SPA-like extension reinjections

## Files
- `manifest.json`
- `content.js`
- `background.js`

## Distribution pack

Bundle bundle should be placed as

- `sitelen-layer-plugin.bundle.js`

and loaded from extension assets. The content script uses `chrome.runtime.getURL()` and dynamic import, so it does not rely on inline scripts.

## Smoke scenarios

- Route allowed + `enabled=true` -> plugin instance is initialized once.
- Route blocked by denylist -> plugin is not initialized.
- Re-run content script on same page -> existing `window.__sitelenLayerPlugin__` prevents duplicate `create()`/`init()`.
