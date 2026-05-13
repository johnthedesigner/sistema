---
category: principles
topic: typography-architecture
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [typography, type-scale, legibility, line-height, roles, density, variable-fonts, synthesis]
sources:
  - kb/reference/design-systems/material/guidance/foundations/typography
  - kb/reference/design-systems/carbon/guidance/foundations/typography
  - kb/reference/design-systems/radix/guidance/foundations/typography
  - kb/reference/design-systems/atlassian/guidance/foundations/typography
  - kb/reference/design-systems/ant-design/guidance/foundations/typography
  - kb/reference/design-systems/primer/guidance/foundations/typography
  - kb/reference/foundations/typography/type-scales
  - kb/reference/foundations/typography/legibility
---

# Typography Architecture — Synthesis

## Overview

Typography decisions in a design system are upstream of most other visual decisions. The scale determines spatial cadence. The role taxonomy determines how hierarchy is communicated. Line height and measure affect how every component with text feels to use. Getting these right means fewer corrections cascading through the rest of the system.

This document covers the structural decisions that shape a type system — not specific font choices, which are a downstream concern, but the architecture that makes type choices work at scale.

---

## The density axis comes first

Before selecting a scale or ratio, identify where your product sits on the density axis. This single decision shapes more of your typography architecture than any aesthetic preference.

**Information-dense contexts** (data tables, dashboards, admin tools, code editors, developer interfaces):
- More text elements compete for vertical space
- Users scan rather than read — hierarchy needs to be legible at a glance
- Generous line heights waste space that could show more data
- Scale steps are closer together — fewer jumps between the smallest and largest sizes used in a single view

**Reading and editorial contexts** (marketing pages, documentation, blog content, onboarding flows):
- Text is read, not scanned
- Visual impact of large type is part of the communication
- Generous spacing aids comprehension
- Scale covers a wider range with more dramatic steps

**Mixed contexts** (most products):
- App shells and navigation are dense; content areas are editorial
- The same scale must serve both modes, either through separate sub-scales or through using different ranges of a single scale

Most design systems serving mixed contexts either split into two explicit type sets (dense-UI and editorial) or define a long scale with enough steps to cover both ranges without compromise. Neither approach is wrong; the mistake is designing a single short scale that tries to work in both contexts and does neither well.

---

## Scale construction: modular vs. hand-tuned

### Modular scales

A modular scale is a geometric sequence — each step is the previous step multiplied by a fixed ratio. The mathematical structure ensures that all size relationships are consistent. The visual result is a set of sizes where the perceived jump between any two adjacent steps feels equivalent throughout the scale.

**Choosing a ratio:**

| Ratio | Character | Works well for |
|---|---|---|
| 1.125 (Major Second) | Small, tight steps | Dense UI scales; many usable intermediate sizes |
| 1.200 (Minor Third) | Moderate steps | Enterprise product UI; enough hierarchy without drama |
| 1.250 (Major Third) | Clear steps | General-purpose product scales; comfortable heading contrast |
| 1.333 (Perfect Fourth) | Pronounced | Scales covering a wide size range; strong heading contrast |
| 1.414 (Augmented Fourth) | Bold | Expressive layouts; display-heavy designs |
| 1.618 (Golden Ratio) | Very large | Marketing/poster work; typically too dramatic for multi-step UI scales |

The ratio is most consequential at the small end of the scale. A 1.333 ratio from a 14px base gives 19px, 25px, 33px for the next three steps — clean for headings. The same ratio from a 12px base gives 16px, 21px, 28px. The base and ratio together determine whether the scale steps fall on workable values.

Modular scales with ratios above 1.333 tend to produce too few usable intermediate steps for a product scale (which needs 7–12 named sizes from label to display). They work better as a 4–6 step display-only scale with a separate, tighter base scale for UI text.

### Hand-tuned scales

A hand-tuned scale starts from a list of desired sizes and works backward to verify the relationships are acceptable. The classical typographic scale (6–7–8–9–10–11–12–14–16–18–21–24–30–36–48–60–72pt) is hand-tuned from centuries of printing practice and approximates a geometric ratio of ~1.14 with some deliberate deviations.

**Use hand-tuning when:**
- You have specific pixel values that must land on clean numbers (a modular scale from 14px at 1.25× gives 17.5px — not ideal)
- The scale needs to cover an unusually wide range (11px to 60px) and no single ratio produces good steps throughout
- You are adapting an existing brand scale that doesn't follow a clean ratio

**Use a modular scale when:**
- You want the mathematical regularity to enforce consistency as the scale grows
- The design tool or framework will generate intermediate values (e.g. tokens computed from base + ratio)
- You want to be able to explain the scale's structure to others without enumerating every value

### The practical middle path

Most production design systems use a hybrid: a loosely modular structure as a guide, with deliberate deviations to land on clean values and preserve good line-height relationships. Define the scale by listing its values — don't describe it by ratio unless the ratio holds cleanly across the full range.

---

## Role taxonomy: named roles vs. numeric steps

This is the second major structural decision, and it has more influence on how your system communicates than on how it looks.

### Named roles (semantic taxonomy)

Named roles assign communicative meaning to each size: `display`, `headline`, `title`, `body`, `label`. The name tells a developer what the text *is for*, not how large it is.

**What named roles enable:**
- Communication: a developer reading `type-role-body-large` knows what it does. They can use it correctly without seeing the pixel value.
- Role-based theming: you can change the body text size system-wide by updating the `body` token, without knowing which components use it
- Cross-system legibility: named roles are familiar across design systems; a new team member can read the role names and understand the hierarchy

**The tradeoff:**
- Named roles couple the token to a semantic intent. If a designer wants to use `headline-small` for a non-heading context because it's the right size, they're either misusing the name or revealing that the scale doesn't have a size for that use case
- Adding a new step between existing named roles requires careful naming that fits the existing pattern

**The 5-role pattern** (display / headline / title / body / label) emerged from mobile typography practice and maps well to most product UIs. Each role may have 2–4 size variants (large / medium / small / xsmall) to cover the range within that role's purpose.

### Numeric steps

Numeric steps (1 through N) assign no semantic meaning — they're a size ladder. Step 5 is larger than step 4; what it means in context is up to the component consuming it.

**What numeric steps enable:**
- Composability: a component can use any step for any purpose, and the system doesn't prescribe what that purpose is
- Easy extension: add step 10 without naming implications
- Developer ergonomics: `size="6"` is predictable and composable; no need to remember semantic distinctions

**The tradeoff:**
- Numbers communicate nothing about purpose. A team with 5 engineers will make 5 different size choices for the same UI element because the scale doesn't constrain the choice
- Without semantic names, the system can't enforce that the same role looks consistent across all components

### Decision framework

**Use named roles when:**
- You want the type system to actively constrain and communicate purpose
- Multiple teams are consuming the system and consistency across those teams matters
- The system serves a product context where semantic hierarchy (this is a heading, this is body text) is meaningful

**Use numeric steps when:**
- You are building a library for other developers to compose with, not a system that prescribes usage
- The consuming team will make their own component-level decisions about hierarchy
- You want maximum flexibility at the cost of system-level prescription

**Mixed approach:** Named roles at the token/design level, numeric implementation internally. Define `type-body-default` as an alias for the equivalent numeric step. Developers who know the system use named tokens; the underlying scale is still numeric and composable.

---

## Legibility constraints (non-negotiable)

These are not design preferences — they are cognitive limits. Violating them reduces readability for all users.

### Line height

**Body text:** Line height must be **120–145% of font size** (unitless values 1.2–1.45 in CSS). Below 1.2 and lines feel cramped; above ~1.6 and the space between lines becomes larger than the line itself, disrupting reading flow.

**Per-size calibration:** The optimal line-height ratio is not constant across the scale. It decreases as font size increases:
- Display / hero (48px+): 1.05–1.1
- Large heading (28–36px): 1.1–1.2
- Small heading (18–24px): 1.2–1.35
- Body (14–18px): 1.4–1.6
- Small / label (11–13px): 1.3–1.5

This is why a correct type system specifies `line-height` per role, not once globally. A global `line-height: 1.5` is too generous at display sizes and may be too tight at the smallest sizes if the product uses 11px labels.

**Always use unitless values:** CSS `line-height` should be a bare number, not a `px` or `em` value. Unitless values are inherited as a multiplier and recalculate correctly when child elements have different font sizes. A `px` value is inherited as a computed value — child elements with different font sizes inherit the wrong line height.

### Line length (measure)

**Optimal: 45–90 characters per line for body text.** Outside this range, readability degrades.

- Below 45 characters: excessive line breaks disrupt reading flow, especially for multi-clause sentences
- Above 90 characters: the eye loses its return position, making line-finding effortful for sustained reading

This translates to a content column width of roughly 480–720px at 16px body text (depending on typeface). Components that constrain content width (cards, panels, inline edits) implicitly control measure. When designing these components, verify that the text at the intended width stays within the optimal range.

Line length and line height interact: longer lines require more line height. When you have no choice but to use a wider column, compensate with more generous line spacing.

### Letter-spacing at scale

Letter-spacing should move in the same direction as reading demands:
- **Small sizes (≤ 12px):** slight positive tracking (+0.01–0.03em) opens the letterforms and aids legibility under compression
- **Body sizes (14–18px):** zero or minimal adjustment (0 to +0.005em); the font's default tracking is calibrated for this range
- **Display sizes (24px+):** negative tracking (–0.01em to –0.025em) compensates for optical spread — large letterforms appear loosely spaced at default tracking, and negative values restore apparent density

This is not an aesthetic preference. A 60px heading with default tracking will visually appear to have too much space between letters, even if the measurement is technically zero. Negative tracking at display sizes is the correct choice.

### X-height and apparent size

Two fonts at the same CSS font-size may appear visually different sizes. The cause is x-height: the ratio of lowercase letter height to the total em square. A high-x-height font at 14px looks larger than a low-x-height font at 14px.

**Implications:**
- When switching typefaces, the specified sizes may need adjustment. An 18px body in Roboto (high x-height) will look larger than 18px in a low-x-height typeface; you may need to step up to 19–20px to match the visual weight.
- This is why some systems expose a `font-size-adjust` token (or equivalent) that multiplies the step size for a specific typeface — not changing the scale, just correcting for x-height differences

---

## Variable fonts: when the complexity is worth it

Variable fonts encode a continuous range of variation axes in a single font file, rather than discrete font weights and styles. The browser can render any point along each axis.

**The common axes and when they matter:**

| Axis | Tag | Effect | Worth the complexity when… |
|---|---|---|---|
| Weight | `wght` | Continuous weight from thin to black | You use more than 2–3 weights, or need micro-weight adjustments for display text |
| Width | `wdth` | Compressed to expanded | You need condensed variants for data display (fixed-width columns at small sizes) |
| Optical size | `opsz` | Adjusts design for small vs. large rendering | You're using a typeface with an optical size axis and the system covers a wide size range |
| Italic/Slant | `ital`/`slnt` | True italic vs. slanted roman | You want true italics without loading a separate italic file |

**The real cost of variable fonts** is not file size (variable fonts are often smaller than multiple static files) but cognitive complexity in the token system. If you expose the weight axis as a continuous range, developers must decide what value to use rather than picking from a finite set of named weights. Most systems expose variable font axes through a fixed set of named tokens (`weight-regular: 400`, `weight-medium: 500`, `weight-bold: 700`) rather than exposing the axis directly.

**When variable fonts add clear value:**
- The system uses 4+ weight variants (the file size savings are real)
- You need optical-size adjustment across a wide scale (11px to 60px) and the typeface has an `opsz` axis
- The product has a true condensed-layout mode where `wdth` compression is genuinely needed

**When to skip them:**
- The product uses two weights (regular + bold). Load two static files; simpler.
- The chosen typeface doesn't have variable axes that map to your system's needs
- The team using the system isn't equipped to reason about axis values

---

## How typography interacts with the spacing system

Typography and spacing are not independent. Every decision in the type scale has a corresponding constraint in the spacing system.

**Line height and vertical rhythm:** The line height of body text typically becomes the base unit for vertical spacing within a text container. If body text has a 24px line height, vertical margins between paragraphs should be multiples or fractions of 24px — this creates visual rhythm. Systems with a strict 8px spacing grid work well with 16px/24px line heights (multiples of 8); they work poorly with 20px or 22px line heights.

**Scale steps and component height:** Interactive components (buttons, form fields, select controls) have a minimum height that should relate to the type scale. A button using `label-large` text at 14px/20px line height needs enough vertical padding to produce a comfortable click target (44px minimum). 14px + (2 × 15px padding) = 44px — the 15px padding is the spacing system value. When the type scale changes, the component height tokens that reference it may also need adjustment.

**Spacing and type density:** A dense type scale (small steps, small base) requires a proportionally tighter spacing scale. A system with 12px body text and an 8px base spacing unit feels correct; the same spacing unit with 18px body text feels compressed. The key ratio: base spacing should be roughly 50–75% of the body text line height. If body text has a 24px line height, the base spacing unit of 12–16px works well.

**Type and layout columns:** Measure (line length) constrains column width. If optimal measure for your body text is 45–75 characters, and body text is 16px in a regular-width sans-serif, the optimal column width is roughly 520–680px. Layout columns should be defined to land content containers within this range. Design systems that define content column widths separately from the type system often produce column widths that are too wide (90+ characters per line) or too narrow (35 characters per line) for the specified body size.

---

## Decision summary

| Decision | Ask first | Then |
|---|---|---|
| Scale construction | Hand-tuned or modular? | Modular if consistency > specific values; hand-tuned if specific values > consistency |
| Ratio | Dense or editorial? | 1.125–1.200 for dense; 1.250–1.333 for mixed; 1.333+ for editorial-only |
| Role taxonomy | Library or system? | Numeric steps for composable libraries; named roles for prescriptive systems |
| Line height | Specified per role? | Always. One global value is wrong for both ends of the scale |
| Variable fonts | 4+ weights needed? | Yes: consider variable font. 2–3 weights: load static files |
| Spacing relationship | 8px grid? | Verify body line height is a multiple of the grid base; adjust either if not |
