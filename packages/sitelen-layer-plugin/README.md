# sitelen-layer-plugin

Display-layer plugin for pages with toki pona content.

Listed on ABVX Lab: https://lab.abvx.xyz/tools/sitelen-layer-plugin/

It switches **one existing page copy** between:

- latin (`TP`)
- `sitelen-pona`
- `sitelen-emoji`

`sitelen-layer-plugin` does **not** translate text from English or other languages.
It only changes how existing toki pona content is displayed.

## Related projects

- `sitelen-emoji-truth` is the adjacent mapping/data layer: https://github.com/markoblogo/sitelen-emoji-truth
- `toki-pona-translator` is a related application-layer repo: https://github.com/markoblogo/toki-pona-translator
- `lab.abvx` catalogs this package, but it is a separate cluster from the AI coding tools stack: https://github.com/markoblogo/lab.abvx

---

## Install

```bash
npm i sitelen-layer-plugin
```

Python static-asset package:

```bash
pip install sitelen-layer-static
```

See [python/sitelen-layer-static](python/sitelen-layer-static) if you want to vendor the built JS/CSS/font assets into Django, Flask, FastAPI, or another Python deployment without requiring npm on the target system.

Import the base styles and (for recommended sitelen pona rendering) font styles:

```ts
import 'sitelen-layer-plugin/styles.css';
import 'sitelen-layer-plugin/sitelen-pona-font.css';
```

---

## 1-minute setup

```ts
import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';

const plugin = createSitelenLayerPlugin({
  container: '#tok-content',
  toggleMode: 'auto',
  defaultLayer: 'latin'
});

plugin.init();
```

Then call `plugin.destroy()` when this page/view is unmounted.

---

## Framework examples

### React

```tsx
'use client';

import { SitelenLayerProvider } from 'sitelen-layer-plugin/react';

export default function Layout({ children }) {
  return (
    <SitelenLayerProvider config={{ container: '#app', defaultLayer: 'latin' }}>
      {children}
    </SitelenLayerProvider>
  );
}
```

### Next.js

```tsx
'use client';

import { SitelenLayerNextProvider } from 'sitelen-layer-plugin/next';

export default function RootLayout({ children }) {
  return <SitelenLayerNextProvider config={{ container: '#app' }}>{children}</SitelenLayerNextProvider>;
}
```

### Vue 3

```ts
import { vSitelenLayer } from 'sitelen-layer-plugin/vue';

app.directive('sitelen-layer', vSitelenLayer);
// <div v-sitelen-layer="{ container: '#app' }"></div>
```

### Svelte

```svelte
<script>
  import { sitelenLayerAction } from 'sitelen-layer-plugin/svelte';
</script>

<section use:sitelenLayerAction={{ container: '#app' }}></section>
```

---

## Build helpers

For auto-init + auto style injection in bundlers:

### Vite

```ts
import { defineConfig } from 'vite';
import sitelenLayerVitePlugin from 'sitelen-layer-plugin/vite-plugin';

export default defineConfig({
  plugins: [
    sitelenLayerVitePlugin({
      autoInit: true,
      container: '#app',
      initConfig: { toggleMode: 'inline', showToggle: true }
    })
  ]
});
```

### Webpack

```js
const { SitelenLayerWebpackPlugin } = require('sitelen-layer-plugin/webpack-plugin');

module.exports = {
  plugins: [
    new SitelenLayerWebpackPlugin({
      autoInit: true,
      initConfig: { container: '#app', showToggle: true }
    })
  ]
};
```

---

## Core options you usually need

- `container`: selector or element that contains editable text
- `defaultLayer`: `'latin' | 'sitelen-pona' | 'sitelen-emoji'`
- `toggleMode`: `'auto' | 'inline' | 'floating'`
- `toggleMount`: selector/element for inline control placement
- `showToggle`: show/hide switch UI
- `layers`: list of enabled layers
- `toggleLabels`: text/icons for buttons
- `sitelenPona`: render settings (recommended `renderStrategy: 'ligature-font'`)

For full API, see typed docs in the repository.

---

## Toggle and UI

By default, the toggle tries to mount inline when `toggleMount` is present and falls back to floating.

- `latin`: `TP`
- `sitelen-pona`: `SP`
- `sitelen-emoji`: `🙂`

The UI supports animation (`fade`, `fade-blur`) and CSS variables for sizing, radius, and colors.

---

## CLI

```bash
npx sitelen-layer-cli scan ./public/index.html
npx sitelen-layer-cli emoji-candidates ./public/index.html --limit 20 --json
```

Use CLI in CI to check content eligibility before deployment.

---

## v0.3 integration track

This repo now includes PoC integration packages:

- Browser extension
- Obsidian
- Logseq
- WordPress
- Ghost

See:

- [docs/V0.3_INTEGRATION_TRACK.md](docs/V0.3_INTEGRATION_TRACK.md)
- [docs/MIGRATION_v0.3.0.md](docs/MIGRATION_v0.3.0.md)

Demo pages:

- `demo/integration/vite-webpack-route-guard.html`
- `demo/integration/extension-csp-flow.html`

---

## CDN / static pages (experimental)

ESM browser usage:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sitelen-layer-plugin@latest/dist/sitelen-layer-plugin.css">
<script type="module">
  import { createSitelenLayerPlugin } from 'https://cdn.jsdelivr.net/npm/sitelen-layer-plugin@latest/dist/sitelen-layer-plugin.js';

  createSitelenLayerPlugin({ container: '#app' }).init();
</script>
```

For strict CSP, use external scripts only and avoid inline init logic.

---

## Recommended font notes

For best sitelen pona typography, import font styles:

```ts
import 'sitelen-layer-plugin/sitelen-pona-font.css';
```

This plugin includes SIL OFL licensed `sitelen seli kiwen asuki` font assets.

---

## What it does not do

- no auto-translation from English
- no image/OCR processing
- no guaranteed perfect rendering for any website CSS without adjustments

If your site has unusual selectors, run with a dedicated CSS pass to avoid overrides.

---

## Release and artifacts

`v0.3.9` is available on npm as `latest` and with GitHub release assets for adapters.

- Docs: `docs/RELEASE_PIPELINE_SETUP.md` (workflow + secrets)
- Release notes in `RELEASE_NOTES_v*` and `CHANGELOG.md`
