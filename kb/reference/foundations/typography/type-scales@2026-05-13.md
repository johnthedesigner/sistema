---
system: typography
category: foundations
topic: type-scales
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-13
source_url: https://spencermortensen.com/articles/typographic-scale/
derived_from:
  - https://spencermortensen.com/articles/typographic-scale/
  - https://practicaltypography.com/typography-in-ten-minutes.html
tags: [typography, type-scale, modular-scale, musical-intervals, foundations]
---

# Type Scales

**Sources:**
- Typographic Scale: `spencermortensen.com/articles/typographic-scale/` (Spencer Mortensen)
- Modular Scale tool: `modularscale.com` (Tim Brown & Scott Kellum) — interactive ratio calculator, canonical enumeration of named ratios
- Practical Typography: `practicaltypography.com` (Matthew Butterick)
- *The Elements of Typographic Style* — Robert Bringhurst (classic scale reference)

---

## What a modular type scale is

A **modular type scale** is a geometric sequence of font sizes where each step is the previous step multiplied by a fixed ratio. If the base size is `f₀` and the ratio is `r`, then every size in the scale is:

```
f_i = f₀ × r^i
```

For a scale with multiple steps per interval (like a musical scale with `n` notes per octave):

```
f_i = f₀ × r^(i/n)
```

The three parameters that define any scale:
- **Ratio (r)** — how much each size grows relative to the previous step
- **Notes per interval (n)** — how many distinct sizes fit within one ratio span
- **Base (f₀)** — the anchor size everything is calculated from

This is the same mathematical structure as a musical scale. The analogy is not metaphorical — it's the reason the same ratios appear in both domains.

---

## The musical interval connection

Musical harmony is built on frequency ratios. A note sounds harmonious with another note when their frequencies have a simple integer ratio:

| Interval | Ratio | Decimal |
|---|---|---|
| Unison | 1:1 | 1.000 |
| Minor Second | 16:15 | 1.067 |
| Major Second | 9:8 | 1.125 |
| Minor Third | 6:5 | 1.200 |
| Major Third | 5:4 | 1.250 |
| Perfect Fourth | 4:3 | 1.333 |
| Tritone | √2:1 | 1.414 |
| Perfect Fifth | 3:2 | 1.500 |
| Minor Sixth | 8:5 | 1.600 |
| Major Sixth | 5:3 | 1.667 |
| Minor Seventh | 16:9 | 1.778 |
| Major Seventh | 15:8 | 1.875 |
| Octave | 2:1 | 2.000 |

Human visual perception responds to relative differences, not absolute ones — just like hearing. When comparing two sizes, the eye perceives the *ratio* between them, not the arithmetic difference. 16px vs 24px and 24px vs 36px both have a 3:2 ratio — and both feel like the "same jump" visually.

This is why modular scales produce sizes that feel visually coherent even as the scale grows large: all the jumps between adjacent sizes are the same ratio, producing a consistent sense of proportion.

---

## The classical typographic scale

Robert Bringhurst documented the historical scale used in Western typography since the Renaissance in *The Elements of Typographic Style*. It is approximately a geometric scale with ratio 2 and 5 notes per interval (r = 2^(1/5) ≈ 1.149):

```
6 · 7 · 8 · 9 · 10 · 11 · 12 · 14 · 16 · 18 · 21 · 24 · 30 · 36 · 48 · 60 · 72
```

These were the sizes available to metal type compositors. They are not perfectly regular — the scale has some historical anomalies (30pt falls between mathematically correct values of 28 and 32) — but they approximate a geometric progression that produces visually harmonious sizing relationships.

This is the scale that still implicitly governs much of modern type design. When a system designer picks sizes like 12, 14, 16, 18, 24, 30, 36 — they are selecting from this tradition.

---

## Common ratios in practice

| Ratio | Decimal | Character | Common use |
|---|---|---|---|
| Minor Second | 1.067 | Subtle | Tight body text hierarchies |
| Major Second | 1.125 | Small steps | Dense UI, data tables |
| Minor Third | 1.200 | Moderate | Ant Design's scale; many enterprise systems |
| Major Third | 1.250 | Medium | Clear hierarchy; comfortable reading |
| Perfect Fourth | 1.333 | Pronounced | Most web type scales; strong heading contrast |
| Augmented Fourth | 1.414 | Bold | Expressive UI with clear scale jumps |
| Perfect Fifth | 1.500 | Large | Display-heavy designs |
| Golden Ratio | 1.618 | Very large | Marketing, posters — impractical for body+heading |
| Octave | 2.000 | Dramatic | Maximum contrast; often too large for UI |

**Practical guidance:** Larger ratios produce more dramatic heading contrast but reduce the number of usable intermediate steps. For UI type scales covering 5–9 steps (as in Material 3, Radix, and Ant Design), ratios of 1.125–1.333 are most workable. For scales with fewer, larger steps (display typography), 1.414–1.618 produce strong visual interest.

---

## Why steps feel harmonious: optical scaling

Mathematical ratio alone explains why steps feel *proportional*, but not why each individual size looks *right*. Optical scaling explains that second phenomenon.

As type grows larger, its design requirements change:
- At small sizes, letters need **open apertures**, high x-height, and wide proportions to survive optical compression
- At large sizes, tight letter-spacing becomes correct, fine hairlines become visible, and subtle details emerge

A typeface designed at all sizes (or an optical size axis in variable fonts) adjusts these properties per size. When using a single design across a scale, optical phenomena create apparent inconsistency: two sizes with the same weight value may look different in visual weight because the human eye perceives stroke contrast differently at different sizes.

This is why large-scale type systems like Material Design 3's `displayLarge` through `bodySmall` vary letter-spacing across the scale — the `−0.025em` letter-spacing on display sizes and `+0.005em` on body compensates for optical spread at large sizes and optical compression at small sizes. It's the same principle as the classical negative tracking on display type.

---

## The productive / expressive split

IBM Carbon introduced an explicit two-scale model documented as productive vs. expressive type:

| Type | Scale characteristics | Use context |
|---|---|---|
| **Productive** | Tighter scale, smaller steps, text-dense sizes (12–20px range) | Data tables, dashboards, back-office, developer tools |
| **Expressive** | Looser scale, larger range, display sizes included | Marketing, landing pages, editorial, brand expression |

The insight is that the *same* modular ratio produces poor results for both contexts simultaneously. A scale calibrated to provide clear heading contrast in a marketing hero will have insufficient distinction between labels and subheadings in a data table. A scale calibrated for data density will feel cramped as display type.

Design systems serving both contexts need either two scales (Carbon's approach) or a scale large enough to cover both ranges with the understanding that different sub-ranges are used in different contexts (Material Design's approach: 5 type roles × 4 size variants = 15 named sizes from `displayLarge` to `labelSmall`).

---

## Design system scale comparison

| System | Steps | Base | Max display | Ratio (approx) | Approach |
|---|---|---|---|---|---|
| Material Design 3 | 15 named sizes | 11px (labelSmall) | 57px (displayLarge) | Variable | Named role + size; letter-spacing varies per step |
| Carbon | ~14 (productive + expressive) | 12px | 54px | ~1.25 productive / ~1.333 expressive | Two scales; explicit productive/expressive split |
| Atlassian | ~10 | 11px | 35px | ~1.2–1.25 | Semantic names (heading-xlarge through body-small) |
| Radix Themes | 9 (steps 1–9) | 12px | 60px | ~1.125–1.5 (widening) | Numeric steps; letter-spacing tightens at large sizes |
| Ant Design | 10 (derived) | 12px | 38px | ~1.2 | Token-derived; base 14px; headings h1–h5 |

The fact that all major systems converge on 9–15 steps from roughly 11–60px is not coincidence — it reflects the practical range from small UI labels to large display type, bounded by legibility at the small end and screen proportion at the large end.
