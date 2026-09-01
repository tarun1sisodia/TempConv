# Contributing to TempConv

Short. The rules that matter, in order:

1. **DESIGN.md first.** Any visual change edits DESIGN.md prose/tokens, then tokens.css, then components. `node scripts/tokens-check.mjs` fails the build on drift, raw hex outside tokens.css, raw px without a `/* raw-allow: why */` comment, or undefined `var()` references.
2. **No dependencies, no build step.** Runtime: vanilla. Tooling: `npx` only. New fonts/CDN = ADR in DECISIONS.md first.
3. **State lives in the store; DOM is a projection.** Events → one `state.set` → render writes idempotently with dirty checks (see ADR-014 for why the caret guard is `edited`-flagged). Never read DOM text as input except in the input/blur listeners that feed `setField`.
4. **New unit = one table in converter.js + one `.field` block in index.html.** Table/history/state adapt automatically.
5. **Gates:** `npm run check` (tests + tokens) before pushing; keep `node --test` DOM-free; anything browser-only needs a smoke scenario (harness pattern in docs/QA.md, lives outside the repo — ask for the script or replicate with jsdom).
6. **A11y is non-negotiable:** new interactive control ⇒ name, keyboard, focus-visible, AA contrast both themes, reduced-motion behavior, styleguide entry, docs/SR-QA checklist line.
7. **Copy:** follow docs/COPY.md (sentence case, error formula, nbsp before units, U+2212 in output). Strings live once.
8. Commits: Conventional (`feat:`, `fix:`, `docs:`, `chore:`), one concern each; reference the QA finding id when fixing QA output.

PRs are small; the diff *is* the review artifact. LICENSE: Apache-2.0 — same license, no CLA.
