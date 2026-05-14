# LIVING_BRIEF.md

*Per-project state document. Read at session start; append to at session end. Max 150 lines. See `_meta/LIVING_BRIEF_SPEC.md` for full spec.*

---

## 1. Project Identity

**Product:** Sistema — design system knowledge base and playbook tool for designers and developers
**Audience:** Designers and developers building, auditing, or maintaining design systems
**Density:** balanced — text-dense KB reading and focused playbook flows in the same product
**Theme:** both — light primary; dark triggered by browser time check (JS-based, not prefers-color-scheme)
**Stance:** utilitarian with strong brand expression — minimal layout, bold and deliberate color

---

## 2. Key Decisions

**Color:** Named palette model. Primary #0070FF — UI components and large text (3:1 ✓); small text requires #005CE6 (5.2:1). Secondary #FFCC33 — accent/non-text on light surfaces; free use as text on dark (15:1). Tertiary brand red #E60026 — not mapped to a semantic token; reserved for future brand-expression role. Error: #B91C1C (crimson, distinct from brand red) / #FCA5A5 dark. Success: #15803D / #4ADE80 dark. Warning: #B45309 (amber) / #FCD34D dark. Surfaces: #F8F9FA page / #FFFFFF raised / #FFFFFF overlay (light); #111111 / #1C1C1C / #252525 (dark). Token file: `src/styles/tokens/colors.css`.

**Typography:** Hand-tuned scale, 10 named roles (semantic, not numeric steps), 11px–56px. Three typefaces: Inter (headings/UI, weights 400–800), Fraunces (quirky serif body, weights 400–500, optical sizing enabled), JetBrains Mono (code, weight 400). Role taxonomy: display (56px/800), heading-xl (40px/700), heading-lg (32px/700), heading-md (24px/600), heading-sm (20px/600), body-lg (18px serif), body-md (16px serif), body-sm (14px serif), label (12px/500 sans), caption (11px sans), code (14px mono). Letter-spacing: negative for large sizes (display −0.025em), positive for small (label +0.02em, caption +0.025em). Token file: `src/styles/tokens/typography.css`.

**Spacing:** [to be determined — base unit and scale TBD in generate-shape-tokens play]

**Shape:** [to be determined — radius personality TBD in generate-shape-tokens play]

**Motion:** [to be determined — stance TBD; prefers-reduced-motion will be implemented globally as a baseline]

**Tokens:** [to be determined — tier model and naming convention TBD in generate-style-dictionary play; dark mode strategy: both themes fully resolved; switching via JS time-based trigger, not CSS media query]

---

## 3. Current State

**Token files:** none yet

**Components implemented:** none yet (Next.js app exists with ad-hoc Tailwind utility classes; no token layer)

**Components stubbed:** none yet

**Known gaps:** No token architecture. No component library. Existing styles are ad-hoc Tailwind — will need migration once token layer is established.

---

## 4. Open Questions

- [x] Error/warning/success semantic colors — resolved: error #B91C1C, warning #B45309, success #15803D. All distinct from brand palette.
- [x] Yellow usage rules — resolved: light mode accent/non-text only (badge fills, decorative borders); dark mode free use as text/signal.
- [ ] Dark mode trigger — time-based JS check: what time boundaries (e.g. 7pm–7am)? Are these user-adjustable?
- [ ] Component count estimate — medium scale (20–60) assumed; confirm as component inventory is built
- [x] Font family — resolved: Inter (headings/UI), Fraunces (serif body), JetBrains Mono (code)

---

## 5. Decision Log

*[2026-05-14] — Positioning brief completed — brand palette locked (#0070FF, #FFE135, #E60026); light primary, dark on time trigger; WCAG 2.2 AA; Next.js + Tailwind stack*
*[2026-05-14] — Generated initial DESIGN.md — key decisions: Inter + JetBrains Mono (both default — review, not yet configured); 4px base spacing unit; 4-step radius scale (4/8/12/9999px); #0070FF fails 4.5:1 on white for small text — #0055CC required for body links; tertiary #E60026 must not be used as error token; error semantic color TBD*
*[2026-05-14] — Color scheme generated — Named palette model (Model 3); both light and dark themes via [data-theme] attribute; 15 semantic roles defined; error/success/warning intentionally distinct from brand palette; primary ⚠️ verify at small text sizes; token file: src/styles/tokens/colors.css*
*[2026-05-14] — Type scale generated — Hand-tuned 10-role named scale (display→code); three-typeface system: Inter (headings/UI), Fraunces (quirky serif body, opsz enabled), JetBrains Mono (code); negative tracking at large sizes, positive at small; token file: src/styles/tokens/typography.css*
