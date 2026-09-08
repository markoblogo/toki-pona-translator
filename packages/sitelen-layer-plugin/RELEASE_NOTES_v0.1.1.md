# Release Notes v0.1.1

## 1) What's new

- Added a working `sitelen-pona` transform MVP path via `sitelenPona.renderStrategy: 'transform'`.
- Added transform diagnostics: `sitelenPonaReplacementCount`, `sitelenPonaWordTokenCount`, `sitelenPonaCoverageRatio`.
- Improved integration UX for site owners:
  - `toggleMount` + inline header mount
  - `toggleMode`, `toggleSize`
  - `toggleLabels`
  - stable default labels (`TP / SP / 🙂`)
  - `emojiExcludeSelectors`

## 2) Real-world validation (toki-free-kit)

Validated on live `/tp`: <https://toki-free.abvx.xyz/tp>

- Header-mounted toggle works in inline mode.
- Emoji transform works on TP content, including header text.
- Locale switcher (`EN/TP`) remains excluded.
- `/en` remains unaffected (no toggle, no transforms).

## 3) sitelen-pona transform MVP: what it does / does not do

What it does:

- Replaces known tokens via MVP subset mapping.
- Preserves punctuation and spacing.
- Falls back to original latin token when mapping is missing.

What it does not do yet:

- Full sitelen pona grammar/typesetting engine.
- Phrase-level composition rules or cartouche/name logic.
- Complete dictionary coverage.

## 4) Known limitations

- Transform coverage is content-dependent and mapping-dependent.
- `font-only` path is still the most compatibility-friendly styling route.
- Transform mode is intentionally incremental and partial in v0.1.x.

## 5) Upgrade notes

- No breaking API changes from v0.1.0.
- Existing configs continue to work.
- To try transform mode:

```ts
sitelenPona: {
  enabled: true,
  renderStrategy: 'transform'
}
```

## 6) Short roadmap

- Expand mapping quality/coverage with measured real-content iterations.
- Add coverage-oriented QA reporting for sitelen-pona transform.
- Improve typography/cartouche handling in future releases.

---

## GitHub Release Description (copy-paste)

`v0.1.1` adds a working **sitelen-pona transform MVP** path (`renderStrategy: 'transform'`) with fallback-safe token replacement and new coverage diagnostics.  
It also includes practical integration UX improvements validated on live `toki-free-kit` (`/tp`), including header-mounted toggle behavior and clearer mode controls.  
No breaking API changes from `v0.1.0`.
