---
version: "alpha"
name: TempConv Minimal
description: Design system for TempConv — a desktop-first, minimalistic, frontend-only temperature converter (°C · °F · K · °R) built to the Google Labs design.md spec.
colors:
  primary: "#1A73E8"
  on-primary: "#FFFFFF"
  primary-tint: "#E8F0FE"
  ink: "#1F1F1F"
  ink-muted: "#5F6368"
  hairline: "#DADCE0"
  surface: "#FFFFFF"
  surface-tonal: "#F8F9FA"
  surface-sunken: "#F1F3F4"
  error: "#D93025"
  success: "#188038"
  temp-cold: "#1967D2"
  temp-warm: "#E37400"
  dark-primary: "#8AB4F8"
  dark-primary-tint: "#283C5E"
  dark-ink: "#E8EAED"
  dark-ink-muted: "#9AA0A6"
  dark-hairline: "#5F6368"
  dark-surface: "#1E1F20"
  dark-surface-tonal: "#131314"
  dark-surface-sunken: "#2D2E30"
  dark-error: "#F28B82"
  dark-success: "#81C995"
typography:
  h1:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  h2:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  h3:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.06em
  numeric-xl:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.1
    fontFeature: "'tnum' on, 'lnum' on"
  numeric-lg:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "'tnum' on, 'lnum' on"
  numeric-md:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "'tnum' on, 'lnum' on"
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  full: 999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input-field:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.ink-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
    height: 48px
  input-field-focus:
    borderColor: "{colors.primary}"
    ring: "0 0 0 3px {colors.primary-tint}"
  input-field-error:
    borderColor: "{colors.error}"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
    height: 40px
  button-primary-hover:
    backgroundColor: "#1765CC"
  button-ghost:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
    height: 40px
  chip:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.sm}"
    height: 32px
  chip-selected:
    backgroundColor: "{colors.primary-tint}"
    borderColor: "{colors.primary}"
  segmented-option:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    height: 32px
    padding: "{spacing.xxs} {spacing.sm}"
  segmented-option-checked:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.ink}"
  table-row:
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.sm} {spacing.md}"
  table-row-current:
    backgroundColor: "{colors.primary-tint}"
    tick: "3px solid {colors.primary}"
  toast:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
    shadow: "0 1px 2px rgba(60,64,67,0.10), 0 1px 3px 1px rgba(60,64,67,0.08)"
  banner:
    backgroundColor: "{colors.surface-sunken}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
---

## Overview

Lab-notebook minimalism. TempConv should feel like a precise scientific instrument: calm, flat, generous whitespace, numbers as the hero. No chrome, no decoration, no marketing noise. One screen answers one question — "what is this temperature in the other units?" — in under a second.

Audience: students, engineers, cooks, travelers, and the merely curious, on desktop first (1280–1920px is the design canvas; 1024px is the minimum supported desktop width; the layout degrades gracefully below that but mobile is not the target).

Emotional tone: trustworthy like Google's product surfaces (Material neutrals, blue accent), austere like a lab report. This file is binding: every UI decision must trace to a token here or a rule in Do's and Don'ts. If CSS and this file disagree, this file is right.

## Colors

The palette is high-contrast neutrals with a single interaction accent. Never invent colors outside this list.

- **Primary (#1A73E8):** The only interaction color. Focus rings, selected states, links, the "current value" tick in the table, and the single primary CTA (Copy). Never for large fills, never for headings.
- **On-primary (#FFFFFF):** Text/icons on primary fills only.
- **Primary-tint (#E8F0FE):** Selected chip/segment backgrounds, focus ring glow, current-row highlight. 6–16% surfaces only, never text background at body size without dark ink on it.
- **Ink (#1F1F1F):** All body text and headings. Not pure black.
- **Ink-muted (#5F6368):** Labels, suffixes, captions, hints, secondary table headers.
- **Hairline (#DADCE0):** All card/chip/table borders. Not for input borders (too low contrast against tonal page — see next).
- **Input border (ink-muted at 60%, or #BDC1C6):** The one exception to hairline: interactive field borders must hit 3:1 non-text contrast on the tonal page.
- **Surface (#FFFFFF):** Cards, inputs, header, toasts.
- **Surface-tonal (#F8F9FA):** Page background. Cards float on it by whiteness + border, not shadow.
- **Surface-sunken (#F1F3F4):** Banner backgrounds, segmented-control track, disabled fills.
- **Error (#D93025):** Validation borders, error text, error icon only. Text at body size must sit on Surface (never on error-tint fills) to keep 4.5:1.
- **Success (#188038):** Copy-confirm check icon only. No success banners.
- **Temp-cold (#1967D2) / Temp-warm (#E37400):** Semantic status only — 8px dots beside a value (below 10°C cold, above 37°C warm) if ever used. Never backgrounds, never text, never gradients.
- **Dark-* tokens:** Dark theme is a full re-palette, not a filter. dark-ink #E8EAED on dark-surface-tonal #131314; dark-primary #8AB4F8 replaces primary wherever primary touched dark surfaces; borders step up to dark-hairline #5F6368.

## Typography

Two families, four weights total across the system: **Inter** (UI text, 400/600) and **JetBrains Mono** (every number, 500). If a value is numeric, it is monospaced and tabular (`tnum`/`lnum` on) so columns and inputs never jitter.

- **h1 40/600:** Page title only, once per page.
- **h2 28/600:** Not used on the converter screen (card titles are h3). Reserved for future pages.
- **h3 18/600:** Card titles ("Convert", "Reference", "History").
- **body-lg 16/400:** Sub-title paragraph, intro text only.
- **body-md 14/400:** Default app text, hints, footnotes.
- **label-md 12/600 +0.06em:** Field labels, table headers. Sentence case — no all-caps shouting; letter-spacing does the structuring instead.
- **numeric-xl 32/500:** The live inputs themselves — numbers are the hero.
- **numeric-lg 20/500:** Unit suffixes.
- **numeric-md 14/500:** Table cells, history values.
- Never more than two Inter weights on a screen. Negative space in numbers: use U+2212 minus in rendered output; non-breaking space between value and unit ("20 °C"). Kelvin renders "K" with no degree symbol, always.
- No italics anywhere. No display fonts. Font size hierarchy is 12 → 14 → 16 → 20 → 32 → 40; do not introduce in-between sizes.

## Layout

Desktop-first, centered, fixed-max-width grid — max-width 1200px, gutters 24px, 8px spacing grid with 4px half-steps (spacing tokens xs→xxxl are the only allowed gaps).

- **≥1280px:** Two columns — converter (3fr, min 0) left, Reference table + History stacked (2fr) right, 32px column gap. Cards keep their own 24px padding; 48px rhythm between stacked cards.
- **1024–1279px:** Single column, converter capped at 720px, table capped at 420px scroll height.
- **<1024px:** Graceful degradation, not a design target: gutters 16px, single column, nothing may break or clip.
- Field rows use a fixed label column (116px) so suffixes align vertically across rows — this column alignment is the layout signature.
- Header 64px sticky (solid surface, no blur); footer is a thin band holding a small centered decorative illustration (`assets/footer-art.png`, `{spacing.xxxl}` tall, no text). No sidebars, no nested cards inside cards, no full-bleed sections, no carousels, no hero images.
- Section order on the page: converter card → reference table card → history card → shortcuts (inside converter card as details) → footer.

## Elevation & Depth

Flat. Depth comes from tonal layers (page tonal → card white → sunken banners) and hairline borders — not shadows.

- Exactly one shadow exists: level-1 `0 1px 2px rgba(60,64,67,0.10), 0 1px 3px 1px rgba(60,64,67,0.08)`, permitted only on the toast (floating over content).
- No elevation on hover — hover is expressed through border-color and background tint only.
- No backdrop-filter, no glass, no neumorphism, no inner shadows.

## Shapes

Architectural restraint: small, consistent radii; tables and grid cells are square (0).

- **xs (4px):** kbd chips, tiny badges.
- **sm (8px):** inputs, buttons, toasts, banners, segmented control.
- **md (12px):** cards only.
- **lg (16px):** reserved, unused in v1 — do not deploy casually.
- **full (999px):** chips only (pill shape marks "quick pick").
- Do not mix radii families in one row of controls; borders are 1px everywhere except focus ring (outer glow, never layout-shifting border-width changes).

## Components

- **card:** Surface #FFF, 1px hairline border, radius md, padding 24px. Title is h3 with 16px margin-bottom. Never more than one card border depth on screen.
- **input-field:** 48px tall, radius sm, 1px solid input-border color (see Colors), padding 8px 12px, number in numeric-xl. States: hover (border ink-muted solid), focus-within (border primary + 3px primary-tint ring), error (border error, numeric text stays ink, message line below), disabled (sunken fill, muted text). The unit suffix sits inside the field on the right, numeric-lg, ink-muted, fixed 52px column.
- **button-primary:** Primary fill, on-primary text, body-md/600 label, height 40, radius sm, padding 8px 16px. One per screen maximum. Hover darkens 8%, active darkens 16%, no shadow, no translate.
- **button-ghost:** Surface fill, hairline border, ink text. Same metrics as primary. Hover fills surface-sunken.
- **button-icon:** 40px box (44px effective hit target via padding), transparent border, hover background tint at 6% ink. Only for copy/clear/theme/delete.
- **chip:** Pill, height 32, 1px hairline, surface fill, body-md 500 label with the value baked into the copy ("Boiling 100 °C"). Selected/pressed (toggles only): primary-tint fill + primary border + darkened ink label.
- **segmented control:** 32px strip, sunken track, 1px hairline between options; checked option gets primary-tint fill, ink label, 600 weight. Radios semantics: arrow keys move selection, roving tabindex.
- **table:** Square cells, header row label-md ink-muted, numeric cells numeric-md right-aligned with thin-space thousand grouping, row borders bottom-only hairline. The current-value row: primary-tint background + 3px primary left tick + `aria-current`. Sticky header within a scroll box. Read-only — rows are never clickable.
- **history-item:** Row grid (value | delta | time | actions), numeric-md, bottom hairline, actions (restore/delete icon buttons) opacity-in on row hover and focus-within. Restore is a full-width button behind the row text.
- **toast:** Surface card, level-1 shadow, radius sm, bottom-right 24px, auto-dismiss 2.4s, `role="status"`. One at a time, replacement not stacking.
- **banner:** Sunken fill, hairline, radius sm, 20px inline icon, used for noscript/privacy notes only.
- All interactive components: visible :focus-visible ring (the input-field-focus ring recipe), ≥44×44 hit target, transitions limited to colors at 120ms ease-out.

## Do's and Don'ts

Do:
- Do keep every color, size, radius and gap traceable to a front-matter token; change this file before CSS, never after.
- Do keep WCAG 2.2 AA: ≥4.5:1 for all text (12px labels included), ≥3:1 for borders, icons, focus rings and checked states — in both themes, verified with contrast tooling.
- Do reserve primary for interaction only; the accent is scarce, so it means "act here".
- Do right-align table numerics, keep them tabular, and always use non-breaking spaces between value and unit.
- Do keep motion functional and short: color/opacity transitions ≤160ms ease-out; nothing bounces, nothing parallaxes; fully honor prefers-reduced-motion.
- Do use whitespace (spacing scale) to separate, rather than borders or dividers.
- Don'ts are as binding as Do's.
- Do treat this file as the agent prompt guide: read it before generating any UI in this repo; re-run `npx @google/design.md lint` after editing it.

Don't:
- Don't use gradients, background blur, image heroes, emoji icons, or third-party icon sets (icons are hand-drawn 20px inline SVG, 1.8 stroke).
- Don't use more than one shadow token, ever, and only on the toast.
- Don't use all-caps labels, italics, or a third Inter weight.
- Don't exceed one primary-filled button on screen; don't put the accent on text.
- Don't nest cards, draw dividers inside a card, or round anything rectangular more than md (12px).
- Don't introduce a font size outside 12/14/16/20/32/40 or a gap off the 4/8px grid.
- Don't animate transform or layout properties (width/height/box-shadow) — color transitions only.
- Don't add decorative microcopy, exclamation marks, or marketing voice; UI text is a lab report: sentence case, plain verbs, no jargon.
