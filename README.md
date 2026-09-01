# TempConv

A frontend-only, desktop-first, minimalistic temperature converter (°C · °F · K · °R), built to the [Google Labs `design.md` spec](https://github.com/google-labs-code/design.md).

- **Design contract:** [`DESIGN.md`](./DESIGN.md) — YAML design tokens + binding prose rules. **Source of truth: edit this before any CSS.**
- **Build plan:** [`PLAN.md`](./PLAN.md) — 20 phases × 30 steps, all execution phases implemented and verified; status boxes ticked with notes.
- **Docs set:** [`docs/`](./docs/README.md) — architecture, conventions, QA evidence, copy guide, decisions (ADRs), roadmap.
- **Component gallery:** [`docs/styleguide.html`](./docs/styleguide.html) — every component × state × theme.

Live conversion (both directions, real time), forgiving parsing, presets, 0–6 decimal precision, reference table, local history, copy/share, three-state theme, AA accessibility, zero runtime dependencies, no build step.

```bash
python3 -m http.server 8000 --bind 0.0.0.0   # serve  → http://127.0.0.1:8000/
node --test                                   # unit tests
node scripts/tokens-check.mjs                 # DESIGN.md ↔ CSS drift gate
node scripts/bundle.mjs                       # → dist/tempconv.html (single file, file://-able)
npm run check                                 # all gates
```

Deploy: any static host — on GitHub, Pages works with no config (Settings → Pages → deploy from branch `main`, root folder).
