# TempConv — Copy style guide

Voice: a lab report. Plain, sentence case, no exclamation marks, no marketing, no jargon.

## Rules
- Label units exactly: Celsius, Fahrenheit, Kelvin, Rankine. Symbols: °C °F K °R (Kelvin never °K).
- Non-breaking space between number and unit: `20 °C` (U+00A0, `unitString()` in converter.js).
- Minus sign in rendered output: U+2212 − (inputs accept ASCII hyphen; parse normalizes).
- Empty ≠ zero: an empty field means "no value", never 0.
- Error formula: what we expected, not what you did wrong. "Enter a number, like 20." never "invalid input".

## Strings (single source — grep before adding)
| Where | Text |
| --- | --- |
| Hint (first field) | Type in any field — the others update instantly. |
| Error: not-a-number | Enter a number, like 20. |
| Error: too-large | That number is too large. |
| Error: below-zero | Below absolute zero — −273.15 °C is the floor. (unit-localized: `errorText()` in ui.js) |
| Toast: copied | Copied |
| Toast: copy failed | Couldn't copy — the number is selected, press Ctrl+C. |
| Toast: history saved off | Couldn't save this to history. |
| Toast: history cleared | History cleared |
| History empty | No conversions yet — results land here. |
| History storage off | History isn't available in this browser session. |
| Clear (idle / confirm) | Clear / Confirm? |
| Table footnote | 0 °C water freezes · 100 °C boils · −273.15 °C absolute zero |
| Table caption line | Values rounded to up to N decimals · step 20 °C |
| Presets | Freezing 0 °C · Boiling 100 °C · Body 37 °C · Room 20 °C · Absolute zero −273.15 °C |
| Page title (dynamic) | 20 °C → 68 °F · TempConv (≤60 chars, base title when empty) |
| Meta description | Convert between Celsius, Fahrenheit, Kelvin and Rankine in real time. Bidirectional, precise, and computed entirely in your browser. |
