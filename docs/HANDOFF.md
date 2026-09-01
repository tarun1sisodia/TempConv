# TempConv — Handoff notes (v1.0, 2026-09-01)

**State:** every PLAN.md execution phase implemented; all automated gates green (see QA.md). Outstanding, in priority order:

1. Human QA pass — docs/QA-SCRIPT.md on real browsers (matrix in §9 not screenshot-diffed; Lighthouse/axe not executed: no browser in this build sandbox).
2. SR checklists (docs/SR-QA.md) — authored, not executed for the same reason.
3. `dist/tempconv.html` regenerates via `node scripts/bundle.mjs`; it is a release artifact, not kept in git.

**Thing to not break** (hard-won, ADR-014 + QA.md table): the `edited`-flag caret guard, the `lastPushC` history dedupe, Celsius-canonical rendering path (`toCelsius(active, parsed)` before `fromCelsius`), bundle script placement before `</body>`, single-scope bundle names.

**Quirks:** html-validate exceptions (2, justified) in .htmlvalidate.json; raw px/1px exemptions in tokens-check; `--t-label-md-*` naming; jsdom cannot parse `@layer` (harness filters that CSS parse error only).

**Local history format:** `tempconv.history.v1` = array of `{id, units:{c,f,k,r}, p, ts, c}` — `c` is the canonical dedupe key; bump the version suffix with a migration if the shape changes.

Questions start with: docs/ARCHITECTURE.md → docs/CONVENTIONS.md → PLAN.md phase for the area.
