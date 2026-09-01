# TempConv — Credits & licenses

Code & design: Apache-2.0 (see /LICENSE — short-form notice; full text: https://www.apache.org/licenses/LICENSE-2.0). The canonical license file was fetched and is linked rather than copied here; if strict redistribution packaging is required, drop the full text at /LICENSE-full.txt.

Fonts (loaded from Google Fonts CDN, served under their own terms):
- Inter — OFL: https://openfontlicense.org / https://fonts.google.com/specimen/Inter
- JetBrains Mono — OFL: https://fonts.google.com/specimen/JetBrains+Mono

Icons: hand-drawn inline SVG (stroke style consistent with Material Symbols but not derived from it) — no third-party icon set shipped.

Design contract format: Google `design.md` spec — https://github.com/google-labs-code/design.md (Apache-2.0). This project's DESIGN.md is original content authored to that spec.

Tooling referenced (dev-time only, unmodified via npx): @google/design.md lint, html-validate, Node's built-in test runner.

Absolute-zero constants from SI/ITS-90 definitions: −273.15 °C = 0 K; °R = °F + 459.67. No data scraped; all conversion math is first-party (js/converter.js).
