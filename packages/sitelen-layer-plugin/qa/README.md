# QA Fixtures

Run:

```bash
npm run dev
```

Open:

- `/qa/index.html`

## Manual Checklist

1. `tp-dominant.html`
   - PASS: toggle visible
   - PASS: all layers switch
2. `non-tp-dominant.html`
   - PASS: toggle hidden
   - PASS: diagnostics `eligible: false`
3. `mixed-layout.html`
   - PASS: `code/pre/input/textarea` unchanged
   - PASS: nodes under `data-sitelen-layer-ignore` unchanged
4. `dynamic-content.html`
   - PASS: appended/replaced content receives active layer
   - PASS: no runaway re-render loop
5. `profile-routes/tok` and `profile-routes/en`
   - PASS: correct profile match by route
   - PASS: profile-specific config is applied
