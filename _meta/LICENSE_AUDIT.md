# LICENSE_AUDIT.md
# Design System Knowledge Base — License Compliance Audit

**Audit date:** 2026-05-13
**Auditor:** LLM-assisted
**Scope:** All Tier 3 sources identified in KB content. Triggered by Task 6.10.

---

## Audit methodology

For each Tier 3 source:
1. Fetched the source URL and checked for license/copyright statements on the main page and any linked license/legal/about pages
2. Assessed whether KB content is synthesis (references mathematical/scientific facts, describes concepts, does not reproduce prose verbatim) or substantial reproduction (copies text, tables, or analysis from the source)
3. Documented tier classification and a compliance verdict in the relevant `_index.md` Source Map

---

## Sources audited

### 1. bottosson.github.io/posts/oklab/

**Used in:** `kb/reference/foundations/color/perceptual-models@2026-05-12.md`

**License findings:**
- Code (C++ implementation): MIT License + public domain option. License text at `bottosson.github.io/misc/License.txt`. Explicitly: "Permission is hereby granted, free of charge, to any person obtaining a copy..."
- Article prose: No copyright notice for the prose. No license statement for the article text. No "all rights reserved" claim.

**KB content assessment:**
The KB file synthesizes the mathematical properties of the OKLab color space: what it optimizes for, how it compares to HSL and CIELAB, and its practical implications for design systems. It does not reproduce Spencer Mortensen's prose or analysis verbatim. The OKLab formula and perceptual uniformity properties are scientific facts and mathematical relationships — not copyrightable expression.

**Verdict: Cleared.** Tier 3 synthesis with attribution. Code is MIT. Prose has no copyright claim. No replacement needed.

---

### 2. spencermortensen.com/articles/typographic-scale/

**Used in:** `kb/reference/foundations/typography/type-scales@2026-05-13.md`

**License findings:**
- Footer: "Copyright © 2011. All rights reserved."
- No license granted. No Creative Commons. No fair use statement. No contact for permissions noted.

**KB content assessment:**
The KB file covers modular type scale mathematics: the concept of geometric sequences, the ratio table (1.067 through 1.618), the musical interval naming convention (major second, minor third, etc.), how optical size affects ratio selection, and how design systems apply these concepts. The mathematical ratios themselves (1.125, 1.333, 1.414, etc.) are mathematical constants — not copyrightable. The musical interval naming for type scale ratios is a convention documented across the field (Bringhurst, Brown, and others). Our synthesis describes the mathematical structure of modular scales without reproducing Spencer's specific written analysis.

**Verdict: Acceptable as synthesis.** "All rights reserved" applies to the creative expression of the article (word choice, analysis, examples), not to mathematical facts. Ratios are not copyrightable. The concept of modular scales and their mathematical properties are documented in many places. **However:** to reduce reliance on this source and strengthen the citation base, supplement with modularscale.com (Tim Brown & Scott Kellum, Apache-licensed tool) as an additional citation in the type-scales file. This is tracked as a plan item, not a blocking issue.

**Action required:** Non-blocking. Add modularscale.com reference to type-scales `_index.md` Source Map when that source is evaluated.

---

### 3. practicaltypography.com

**Used in:**
- `kb/reference/foundations/typography/type-scales@2026-05-13.md`
- `kb/reference/foundations/typography/legibility@2026-05-13.md`

**License findings:**
- Legal page (`practicaltypography.com/legal.html`): "© 2010–26 Matthew Butterick. No part of this book may be reproduced without written permission from me. Reproductions that qualify as fair use under U.S. copyright law do not require permission."

**KB content assessment:**
The KB files reference Practical Typography as a source for established legibility principles:
- Line height minimum of 1.5× for body text
- Optimal measure of 45–90 characters per line
- 16px minimum for body text
- Letter-spacing behavior at different size ranges

None of these are Matthew Butterick's original inventions. These principles are:
- **Line height 1.5×**: Also stated in WCAG 1.4.8 (AAA success criterion), and in Bringhurst's *Elements of Typographic Style* (widely considered the canonical typographic reference)
- **45–90 character measure**: From Bringhurst, widely cited in web typography literature for decades
- **16px body minimum**: A practical web convention documented across W3C CSS specs, browser defaults, and accessibility research
- **Letter-spacing**: Well-documented in type design literature

Our KB content synthesizes these established principles as established standards, citing Practical Typography as one of multiple sources documenting them. This qualifies under fair use: the synthesis is educational, transformative, and does not substitute for the book.

**Verdict: Acceptable under fair use.** The specific typographic principles cited are established canon, not Butterick's original contributions. Fair use applies to educational synthesis of established facts. **Plan:** Supplement with webtypography.net (*The Elements of Typographic Style Applied to the Web*) and Google Fonts Knowledge, both already in `_meta/PENDING_SOURCES.md`. These will provide additional, more permissively-licensed citations for the same content once crawled and vetted.

**Action required:** Non-blocking. Add webtypography.net and Google Fonts Knowledge citations once those pending sources are evaluated (see `_meta/PENDING_SOURCES.md`).

---

## Summary

| Source | Tier | Verdict | Action |
|---|---|---|---|
| bottosson.github.io/posts/oklab/ | 3 | **Cleared** — code is MIT; prose has no copyright claim; content is mathematical synthesis | None |
| spencermortensen.com/articles/typographic-scale/ | 3 | **Acceptable** — mathematical ratios not copyrightable; synthesis does not reproduce analysis | Non-blocking: add modularscale.com as supplementary citation |
| practicaltypography.com | 3 | **Acceptable under fair use** — principles are established typographic canon; fair use applies to educational synthesis | Non-blocking: supplement with webtypography.net + Google Fonts Knowledge (pending in PENDING_SOURCES.md) |

**Blocking violations:** None.

**Non-blocking actions outstanding:**
1. Evaluate modularscale.com (Tim Brown & Scott Kellum) and add as supplementary citation in type-scales
2. Crawl and evaluate webtypography.net (in PENDING_SOURCES.md)
3. Crawl and evaluate Google Fonts Knowledge — Foundations of Web Typography (in PENDING_SOURCES.md)

---

## Scope note — design system and standards sources

This audit covers only the three Tier 3 sources identified prior to this audit. All other KB sources are:
- **Tier 1** (W3C specs, WCAG): Explicitly licensed under W3C Document License
- **Tier 2** (design system official doc sites, official GitHub repos, official npm packages): Official public documentation from system maintainers — synthesis-acceptable per AGENTS.md policy

No Tier 1 or Tier 2 compliance issues were identified. Full source map documentation has been added to the two `_index.md` files covering foundations content.
