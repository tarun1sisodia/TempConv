# Changelog

All notable changes to TempConv. Format follows Keep a Changelog; this project adheres to Semantic Versioning.

## [Unreleased]

### Changed
- Footer: replaced the two text lines with a centered decorative thermometer illustration (`assets/footer-art.png`, transparent, palette-matched, `{spacing.xxxl}` tall); DESIGN.md footer prose updated to match.
- Theme toggle: fixed both sun/moon icons rendering at once — exactly one icon now shows per mode (visibility keyed off the JS-flipped `aria-pressed`), with an opacity-only crossfade (120ms).
- Theme toggle now crossfades the whole page on toggle: the opt-in `html.theme-anim` scope extends to header, footer and cards (color properties only, 160ms; still zero-fade on reload).

### Fixed
- `scripts/bundle.mjs` inlines local PNGs as data URIs so the single-file bundle stays self-contained.


First release — complete implementation of PLAN.md phases 1–20.

### Added
- DESIGN.md (Google design.md spec: 60 tokens + 8 prose sections), drift-gated against css/tokens.css by scripts/tokens-check.mjs.
- Conversion engine (js/converter.js): °C/°F/K/°R, tolerant parsing ("72°F", "−273,15", "1e3"), U+2212 display minus, absolute-zero floors per unit, 0/1/2/3/6-decimal precision.
- Live bidirectional UI: four fields with active-row highlight, stale-sibling retention on invalid input, soft/hard validation split (syntax on blur, range live).
- Rankine toggle (hidden by default, session-persisted chip), presets (freezing/boiling/body/room/absolute zero), rotate, reset, copy-all + per-field copy (clipboard → execCommand → manual fallback), Web Share when available, toasts.
- Reference table −60…200 °C (step 20) with current-row tick, keyboard-scrollable region, precision-aware captions, incremental updates.
- History (localStorage, cap 20, dedupe, restore with scroll-anchored focus, per-item delete, two-step clear, cross-tab sync, quota-quiet degradation).
- Theme: light / dark / follow-system, zero-FOUC inline boot, cross-tab sync, theme-color meta sync.
- Accessibility: ARIA wiring (radiogroup seg, live regions, invalid/describedby), full keyboard model (roving tabindex, Enter commit, Esc clear, Alt shortcuts via keymap), skip link, prefers-reduced-motion/contrast/forced-colors, print stylesheet, WCAG 2.2 AA token pairs both themes.
- 404.html, manifest, robots, favicon (inline SVG), SEO meta + dynamic title, `?c=&p=` deep links with replaceState sync.
- docs/: 16-file set incl. styleguide.html gallery, QA evidence & scripts, ADR log.
- Tooling: node --test suites (25), tokens-check (drift + literal + undefined-var gates), bundle script → dist/tempconv.html (82.0 KB raw / 21.8 KB gz), html-validate config with 2 documented exceptions, branch-root GitHub Pages deploy path.

### Fixed (pre-launch hardening, adversarial pass — regression-tested)
- Corrupt non-array JSON in history storage bricked boot (Array.isArray guard); history load now capped at 20 like push; `snapshotEntry` NaN leak closed (`Number.isFinite` guard + unit test).
- Celsius-canonical render/copy paths; edited-flag caret guard; lastPushC history dedupe; boot-time doc sync; bundle script placement; [hidden] in layers; token rename drift. (Details: docs/QA.md bug ledger, docs/DECISIONS.md ADR-014.)

### Known limitations
- Payload 83.1 KB raw exceeds the plan's 45 KB pre-docs budget; 26.5 KB gzip within budget (docs/PERFORMANCE.md).
- Real-browser passes (Lighthouse/axe/SR/visual matrix) authored but pending human execution — no browser in the build sandbox (docs/QA-SCRIPT.md, docs/SR-QA.md).
- Full Apache-2.0 text linked, not embedded (docs/CREDITS.md).
