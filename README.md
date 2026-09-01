# TempConv

A frontend-only, desktop-first, minimalistic temperature converter (°C · °F · K · °R), built to the [Google Labs `design.md` spec](https://github.com/google-labs-code/design.md).

## What's here

| File | Purpose |
| --- | --- |
| [`DESIGN.md`](./DESIGN.md) | The design system — YAML design tokens + binding prose rules (Google's design.md format). **Source of truth: edit this before any CSS.** |
| [`PLAN.md`](./PLAN.md) | The 20-phase build plan (600 steps), phases → acceptance criteria → release. |

## Planned stack

Hand-written HTML + CSS + native ES modules. No framework, no bundler, no runtime dependencies — deployable to any static host.

```bash
# dev server (planned workflow)
python3 -m http.server 8000 --bind 0.0.0.0
```

Status: **planning phase** — design system and plan complete, implementation follows PLAN.md Phases 1–20.
