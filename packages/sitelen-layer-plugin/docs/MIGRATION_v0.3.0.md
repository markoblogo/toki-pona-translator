# Migration Notes for v0.3.0

## Route guard in auto-init helpers

If you previously used `sitelenLayerVitePlugin({ autoInit: true })` or `new SitelenLayerWebpackPlugin({ autoInit: true })`, behavior changed only when `routeInclude`/`routeExclude` are provided:

- `routeInclude` restricts initialization to matching routes.
- `routeExclude` skips initialization for matching routes.
- `routeMatchMode` accepts `contains | startsWith | exact | regex`.

When no include/exclude is configured, behavior stays as before.

## CMS/adapter lifecycle hardening

PoC adapters now ship with explicit lifecycle/entry manifests:
- browser extension content bootstrap guard (`window.__sitelenLayerPlugin__`)
- Obsidian/Logseq re-init strategy notes in their adapter entry manifests
- WordPress/Ghost theme/plugin entry manifests with route filters

If you integrate adapters as separate distributables, treat each as versioned payload with its own `entry.json`.

## Packaging note

`adapters/*` and `demo/integration/*` are now included in npm package `files` to support demo/docs-driven distribution and release artifacts.
