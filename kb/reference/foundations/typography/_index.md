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

---

## Source Map

| Source | URL | License tier | Assessment |
|---|---|---|---|
| Spencer Mortensen — Typographic Scale | `spencermortensen.com/articles/typographic-scale/` | **Tier 3** — "All rights reserved" © 2011; no license granted | Primary source for modular scale ratio mathematics. "All rights reserved" is the most restrictive claim. **Assessment:** Mathematical ratios (1.125, 1.250, 1.333, etc.) are mathematical facts, not copyrightable expression. Our content synthesizes the mathematical concepts at concept level, not reproducing Spencer's analysis or prose verbatim. Acceptable as synthesis. **Plan:** Add modularscale.com (Tim Brown & Scott Kellum) as a supplementary citation for the same mathematical content — the tool is Apache-licensed and broadly cited as the canonical modular scale reference. |
| Practical Typography — Matthew Butterick | `practicaltypography.com` | **Tier 3** — "No part may be reproduced without written permission"; fair use excepted; © 2010–2026 | Used across type-scales and legibility files. Explicit reproduction prohibition; fair use exception applies to educational synthesis. **Assessment:** The legibility principles in our KB (1.5 minimum line height, 45–90 character measure, 16px minimum body text) are established typographic canon documented across the field for decades — they predate Practical Typography and are stated in WCAG 1.4.8, Bringhurst's Elements of Typographic Style, and wide typographic literature. Our synthesis describes these principles as established standards, not as Butterick's original claims. Acceptable under fair use for synthesis of established principles. **Plan:** Supplement with webtypography.net and Google Fonts Knowledge (both already in `_meta/PENDING_SOURCES.md`) once those sources are crawled and vetted — these will provide more permissively-licensed citations for the same content. |

---

## Related

- Color science foundations: `kb/foundations/color/`
- Typography in design systems: see the `typography` topic across `kb/design-systems/*/guidance/foundations/`
