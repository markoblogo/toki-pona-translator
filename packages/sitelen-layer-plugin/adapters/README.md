# v0.3 Adapter Distribution Pack

PoC adapter set prepared for separate release artifacts:
- browser-extension
- obsidian
- logseq
- wordpress
- ghost

Each adapter folder includes:
- a manifest/entry manifest
- README for consumption
- a small implementation entrypoint (`.js`/`.ts`/`.php`/`.hbs`)

Release convention: copy the corresponding folder as-is (or zip for browser-extension), fill bundling outputs if needed, and distribute as separate artifacts.
