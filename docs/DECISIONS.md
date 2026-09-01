# TempConv — Decisions (ADR log)

Format: Context / Decision / Consequences. Newest last.

## ADR-001 · Vanilla over frameworks & utility CSS
Context: frontend-only minimal utility; static hosting; no build step promised.
Decision: hand-written HTML/CSS/ES modules, zero runtime deps; `npx` tooling only.
Consequences: instant loads, auditable surface, bundle is trivial; no component framework ergonomics (accepted for a one-screen app).

## ADR-002 · Desktop-first responsive
Context: brief specifies desktop responsive. Decision: design canvas 1280–1920 two-column; single column 1024–1279; graceful-but-unsupported below 1024 (nothing may break). Consequences: fewer media queries, clearer alignment rules; mobile polish deferred (ROADMAP).

## ADR-003 · Inter + JetBrains Mono via Google Fonts CDN
Context: DESIGN.md needs concrete families with numeric discipline. Decision: CDN link with system fallbacks + metric overrides for swap stability. Consequences: first paint with fallback fonts is legible; offline degrades by design; self-hosting listed in ROADMAP.

## ADR-004 · Apache-2.0
Context: alignment with the Google design.md spec ecosystem (also Apache-2.0). Decision: LICENSE short-form notice + canonical link (full text fetch blocked in build sandbox). Consequences: none material; CREDITS records font OFL separately.

## ADR-005 · DESIGN.md binding
Context: agent-generated UI drifts without a contract. Decision: DESIGN.md tokens + prose are the source of truth; `tokens-check.mjs` + `design.md lint` gate drift; code follows file, never reverse. Consequences: two extra audit steps per change; near-zero drift — proven through this build (three "fix prose first" moments: clamp floors, sizing vars, label-md rename).

## ADR-006 · Container queries rejected
Context: only two real breakpoints; static app. Decision: media queries only. Consequences: simpler mental model; revisit if cards become embeddable widgets.

## ADR-007 · Fonts CDN vs self-host
Context: minimalism vs offline robustness. Decision: CDN for v1 (fallback stack verified under blocked-fonts test); self-host = ROADMAP. Consequences: one network dependency; cold-offline still renders correctly.

## ADR-008 · No analytics, no storage beyond localStorage
Context: privacy is a feature; "computed in your browser" claim must be literally true. Decision: zero trackers, zero fetches (Network-tab audited). Consequences: no usage telemetry; support relies on QA docs.

## ADR-009 · No content-hashing / cache-busting
Context: no build step → no hashed filenames. Decision: rely on Pages default caching; artifacts are small enough that stale risk ≈ zero; document trade-off. Consequences: a redeploy may serve stale html for ≤10 min on some caches.

## ADR-010 · Hand-mirrored tokens + drift script (no generator)
Context: "no build" promise vs single source of truth. Decision: tokens.css is written by hand from DESIGN.md; scripts/tokens-check.mjs enforces equivalence in CI-less life (run via `npm run check`). Consequences: one extra file to keep honest, mechanically checked.

## ADR-011 · Blur-time syntax validation; live range validation
Context: scolding users mid-token ("1." → error!) is hostile; below-absolute-zero is a fact at every keystroke. Decision: `setField(unit, raw, validateSoft)` — soft (not-a-number) commits on blur/Enter; hard (range) commits live. Consequences: one validation model everywhere; Enter = commit documented in shortcuts.

## ADR-012 · Seven ES modules shipped unbundled
Context: HTTP/2 multiplexes; a bundler would violate "no build". Decision: keep modules; single-file `dist/tempconv.html` exists only as a release artifact (scripts/bundle.mjs). Consequences: ~16 requests on first load (all 200s, cached after); one-file mode available by script.

## ADR-013 · VERSION constant without UI
Context: package.json says 1.0.0; nothing in a minimal UI should print it. Decision: no user-visible version; release provenance lives in tags/CHANGELOG. Consequences: debug via `git describe` — fine for this scope.

## ADR-014 · Focus-guarded paint via `edited` flag (bug-driven)
Context: smoke test caught two real bugs — (a) programmatic writes (preset/rotate/reset/restore) were skipped when the target field happened to hold focus (stale text), (b) history delete's focus restore fired a spurious blur-commit that re-pushed a deleted value. Decision: render skips writing ONLY the focused-and-user-edited field; history dedupes against the last committed value (`lastPushC`). Consequences: caret safety preserved; paint is always final. Recorded here because the plan's 11.04 predicted the first symptom; the plan was corrected during execution (see PLAN.md notes).
