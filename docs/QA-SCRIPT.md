# TempConv — QA Script (v1.0 release candidate)

Run against `npm run serve` → http://127.0.0.1:8000/ unless stated. Each section = one browser session; pass all checks to sign off.

## 0 · Automated (must pass before anything else)
- [ ] `npm run check` — lint/tokens/tests green
- [ ] `npx -y html-validate index.html 404.html docs/styleguide.html`
- [ ] `node scripts/bundle.mjs && open dist/tempconv.html` via `file://` — app works with no server (copy/history degrade gracefully)

## 1 · First load (Chrome, 1920×1080, Light)
- [ ] No FOUC flashing to dark (test with throttled 3G + `prefers-color-scheme: dark`)
- [ ] Two-column grid; left card fields; right card table visible without scroll
- [ ] Lighthouse Performance ≥95, console: zero errors, network: zero third-party except fonts CDN

## 2 · Conversion math (all three themes)
- [ ] Type `20` C → F `68`, K `293.15`; type `68` in F → C `20`; −40 ↔ −40 exact
- [ ] Paste `72°F` → parses 72; paste `21°C` in F field → **error** (space+unit is C, wrong field) — by design, message says "Enter a number, like 20."
- [ ] `12.` no error while typing; blur → 12; `abc` blur → error announced (NVDA/VoiceOver: message read once)
- [ ] `-300` in C → red inline "Below absolute zero…"; other fields dimmed, values retained; fix to `-3` → live recovery, error clears
- [ ] `0 K` accepted; `-1 K` → floor message says **0 K**, field suffix bare `K`

## 3 · Interaction states
- [ ] Focused row: tint + 3px tick; second tab stop inside card after fields = chip row
- [ ] Tab order: theme → fields (C,F,K[,R]) → chips → presets → Copy/Reset/Rotate/Share → table header → precision seg → table rows → history → footer
- [ ] Copy enabled only with a valid value; click → toast "Copied", button shows ✓ ~1.2s; focus returns
- [ ] Seg: ←/→ wrap, Home/End, Space/Enter select; screen reader says "2 decimals, radio button, 3 of 4"
- [ ] Show °R chip: pressed state persists across reload? **No** — session-only by design (verify sessionStorage cleared on tab close)

## 4 · History
- [ ] Blur a valid value → entry appears newest-first, relative time; same value twice → single entry
- [ ] Focus steals to delete button on hover only (mouse) / always (touch emulation); delete keeps list scroll position
- [ ] Restore click → C field shows restored value, list scroll restored; then delete that just-restored entry → value stays gone (regression for ADR-014)
- [ ] Clear → "Confirm?" → second click empties; timeout 3s reverts label; toast "History cleared"
- [ ] Two tabs: clear in one → list empties in the other

## 5 · Theme
- [ ] Toggle cycles system→light→dark→system; label announces; reload keeps choice; second tab follows instantly
- [ ] DevTools emulation: prefers-color-scheme dark with "system" → dark; high contrast → borders 2px + palette swap; forced-colors → no invisible elements, `forced-color-adjust:auto` elements keep system colors

## 6 · Keyboard & SR
- [ ] Alt+T theme, Alt+S copy, Alt+R reset, Alt+P focus precision, Alt+1..4 presets; Alt+F does not block browser File menu (it may — documented, browser wins)
- [ ] Skip link first Tab, visible, works; Esc in a field clears value+error; Enter commits
- [ ] NVDA/VoiceOver pass: intro text, live value announcements don't spam (no aria-live on fields), table headers read per cell, errors announced on blur

## 7 · Responsive & zoom
- [ ] 1440/1280: 2-col; 1024: 1-col; 768/390: 1-col, usable, no h-scroll, touch targets ≥44
- [ ] 400% zoom: reflow only — no horizontal scrollbar anywhere; toast never covers input
- [ ] Landscape phone 844×390: header fits, fields usable

## 8 · Print & misc
- [ ] Print preview: converter+table only, one page, no history/toasts/shadows; print dark-mode page → light
- [ ] `/404.html` → styled page; favicon, meta title/desc, `?c=37&p=1` reload = same state
- [ ] Fonts CDN blocked (DevTools network condition) → layout intact (metric overrides)

## 9 · Visual matrix (screenshot diff, deferred — NOT yet executed)
1920/1440/1280/1024/768/390 × light/dark × index/404/styleguide — compare against docs/styleguide.html token pages. Status: pending human run; layout invariants above are the pass criteria.
