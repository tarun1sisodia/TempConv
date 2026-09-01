# TempConv — Roadmap (backlog of deliberately-cut work)

v1.1
- [ ] Self-host Inter + JetBrains Mono subsets (remove CDN; enables true offline + CSP tightening)
- [ ] Lighthouse/axe CI job (needs a real browser runner; gates are already scripted — see QA.md)
- [ ] Mobile-first polish pass: one-hand layout, larger presets row, table collapse to 3 cols <480
- [ ] Réaumur + Delisle as hidden-by-default units (engine already supports new units cheaply)
- [ ] Share-target: PWA manifest share_target to receive `?c=` from other apps

v1.2
- [ ] i18n scaffold: strings are centralized per COPY.md — extract catalog, ship `en` + one pilot locale; decimal-comma locale aware
- [ ] CSV export button (data-action "export"; one function in table.js)
- [ ] History: pin favorites + per-entry timestamp tooltip (data model already stores `ts`)
- [ ] Custom unit slot (user formula → °C) — needs input sanitation review

Always-on restraints for any of the above
- DESIGN.md updated first; no new raw values; no runtime deps; ≤25 requests; AA on both themes;
  reduced-motion/contrast accommodations extend to new surfaces automatically.

Won't do
- Analytics, accounts, backend of any kind, framework migration, minifier/build step, web workers.
