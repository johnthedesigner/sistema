# Typography Science — Section Index

**Category:** `foundations`
**Slug:** `typography`
**Status:** Active
**Last updated:** 2026-05-13

---

## Overview

The scientific and mathematical basis for type decisions in design systems. These files explain *why* type scales, line heights, and legibility heuristics are structured the way they are — the reasoning behind the numbers that design systems publish.

Understanding these foundations helps AI agents generate typographic specifications that follow coherent logic, not just copy existing token values from one system into another.

---

## Content

| Stub path | Topic | Status |
|---|---|---|
| `foundations/typography/type-scales` | Modular type scales — ratio mathematics, musical interval basis, optical scaling, design system applications | latest |
| `foundations/typography/legibility` | Legibility and readability — x-height, cap-height, line height mathematics, optimal measure, UPM and CSS line-height | latest |
| `foundations/typography/typographic-rhythm` | Typographic rhythm — rag, vertical rhythm, word spacing, hyphenation, small caps, numeral figure selection | latest |
| `foundations/typography/responsive-typography` | Responsive typography — variable fonts (axes, CSS implementation), optical sizing, fluid type with clamp(), letter-spacing by size, dark mode weight adjustment | latest |

---

## Source Map

| Source | URL | License tier | Assessment |
|---|---|---|---|
| Spencer Mortensen — Typographic Scale | `spencermortensen.com/articles/typographic-scale/` | **Tier 3** — "All rights reserved" © 2011; no license granted | Primary source for modular scale ratio mathematics. "All rights reserved" is the most restrictive claim. **Assessment:** Mathematical ratios (1.125, 1.250, 1.333, etc.) are mathematical facts, not copyrightable expression. Our content synthesizes the mathematical concepts at concept level, not reproducing Spencer's analysis or prose verbatim. Acceptable as synthesis. |
| Modular Scale tool — Tim Brown & Scott Kellum | `modularscale.com` | **Unconfirmed** — copyright 2010–2017 Tim Brown; no open license found on page; ratio values are mathematical facts regardless | Supplementary citation for modular scale ratio enumeration and named intervals. The ratio/name pairs (Minor Second 1.067 through Octave 2.000) are mathematical facts, not copyrightable expression. Added as a citable canonical reference in `type-scales.md`. |
| Practical Typography — Matthew Butterick | `practicaltypography.com` | **Tier 3** — "No part may be reproduced without written permission"; fair use excepted; © 2010–2026 | Used across type-scales and legibility files. Explicit reproduction prohibition; fair use exception applies to educational synthesis. **Assessment:** The legibility principles in our KB (1.5 minimum line height, 45–90 character measure, 16px minimum body text) are established typographic canon documented across the field for decades — they predate Practical Typography and are stated in WCAG 1.4.8, Bringhurst's Elements of Typographic Style, and wide typographic literature. Our synthesis describes these principles as established standards, not as Butterick's original claims. Acceptable under fair use for synthesis of established principles. |
| The Elements of Typographic Style Applied to the Web | `webtypography.net` | **CC BY-NC 4.0** — Creative Commons Attribution-NonCommercial confirmed | Bringhurst's typographic principles applied to CSS. Used as primary source for `typographic-rhythm.md` (rag, vertical rhythm, word spacing, hyphenation, small caps). NC clause: synthesized in own words with attribution; not reproduced verbatim. |
| Google Fonts Knowledge — Foundations of Web Typography | `fonts.google.com/knowledge/using_type/the_foundations_of_web_typography` | **Unconfirmed** — JS-rendered, license unverifiable by fetch | Evaluated but not used as source. License could not be confirmed (page fully JS-rendered). Topics (optical sizing, variable fonts, responsive type) synthesized instead from MDN Web Docs (CC BY-SA 2.5) and W3C CSS Fonts Level 4 — more authoritative primary sources. See `responsive-typography.md`. |
| MDN Web Docs — CSS Fonts, clamp(), font-optical-sizing | `developer.mozilla.org` | **CC BY-SA 2.5** — confirmed standard MDN license | Primary source for `responsive-typography.md`. Variable fonts guide, CSS clamp(), font-optical-sizing, letter-spacing — all synthesized with attribution. |
| W3C CSS Fonts Module Level 4 | `drafts.csswg.org/css-fonts-4/` | **W3C Document License** — permissive for documentation use | Supplementary source for variable font axis definitions and `font-optical-sizing` specification. |
| Figma Resource Library — Typography in Design | `figma.com/resource-library/typography-in-design/` | **All-rights-reserved** — no license grant found | **SKIP.** No open license; content is beginner-to-intermediate level with no novel technical depth. Line-length figure (40–60 chars) conflicts with KB standard (45–90ch). Do not synthesize. |

---

## Related

- Color science foundations: `kb/foundations/color/`
- Typography in design systems: see the `typography` topic across `kb/design-systems/*/guidance/foundations/`
