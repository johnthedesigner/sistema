---
title: "Spacing and layout"
description: "Base units, spacing scales as one system, density, breakpoints, and why spacing values are never arbitrary."
topic: spacing
sources:
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/spacing" }
  - { source: atlassian, url: "https://atlassian.design/tokens/design-tokens" }
  - { source: material, url: "https://m3.material.io/foundations/design-tokens" }
  - { source: fluent, url: "https://fluent2.microsoft.design/layout" }
  - { source: apple-hig, url: "https://developer.apple.com/design/human-interface-guidelines/layout" }
  - { source: nngroup-hierarchy, url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/" }
last_reviewed: 2026-05-13
---

# Spacing and layout

## Overview

A spacing system is one scale, built on one base unit, that every component and layout uses. Its value is the consistency, not any particular numbers.

---

## Base unit: 4px vs. 8px

Most systems use a 4px or 8px base. Both work; using one consistently matters more. Sistema defaults to 4px.

**4px base** (Radix, Material, Atlassian): More granular. Enables steps at 4, 8, 12, 16, 20, 24px — the tighter values (4px, 8px, 12px) are useful for component-internal spacing (icon gaps, badge padding, button icon margins) where 8px is often too large. A 4px base generates more usable steps without requiring half-steps or arbitrary values.

**8px base** (Carbon, many utility-class systems): Fewer steps, cleaner multiples. 8, 16, 24, 32, 40, 48px covers most layout and component needs. The coarser grid forces designers to commit more decisively — there are fewer values to disagree about.

**The practical rule:** Use 4px if your UI has dense components with many internal spacing decisions (data tables, form controls, navigation items). Use 8px if the product is more spacious and layout-level spacing dominates. Either way, never define arbitrary values outside the scale — if a value doesn't exist in the scale, that's a signal to round to the nearest step or to add the step.

---

## The scale as a unified system

The spacing scale should connect three levels of the UI as a coherent system:

**Component-internal spacing** (4–16px range): gaps between an icon and its label, padding inside a button, space between form field label and input. These values are small and precise — the 4px half-steps matter here.

**Component-to-component spacing** (8–32px range): the gap between a heading and its body text, space between cards in a list, margin around a form group. This is where the rhythm of a UI becomes visible.

**Layout-level spacing** (16–64px range): section padding, page margins, major whitespace zones. These values create the breathing room that separates content regions and establishes visual hierarchy at the page level.

A scale that only works at one level fails at the others. A 4-step scale (8, 16, 24, 32) is insufficient for component-internal use. A scale with too many steps (Atlassian's 14-step scale from 2px to 80px) gives designers too much freedom and produces inconsistent results without strong convention.

A practical starting scale for a mixed product, on a 4px base (names follow "Naming the steps" below):

| Token | Value | Typical use |
|---|---|---|
| `space.1` | 4px | Icon gaps, badge padding, tight insets |
| `space.2` | 8px | Button padding (vertical), small component gaps |
| `space.3` | 12px | Component padding (tight), between label and input |
| `space.4` | 16px | Standard component padding, between list items |
| `space.6` | 24px | Between components in a section, card padding |
| `space.8` | 32px | Section gaps, sidebar padding |
| `space.12` | 48px | Major layout gaps, section vertical padding |
| `space.16` | 64px | Large section whitespace, hero padding |

## Naming the steps

Name each step by its multiple of the base unit. On a 4px base, `space.4` is 4 × 4px = 16px and `space.12` is 48px. A half step uses a hyphen: `space.0-5` is 2px.

This has three advantages over numbering steps in order (1, 2, 3…):
- The name tells you the value, so nobody needs a lookup table.
- Adding a step later doesn't renumber the others. A 20px step slots in as `space.5`.
- It matches the convention of utility-first CSS frameworks such as Tailwind, where `p-4` is four base units. Tokens and utility classes then mean the same thing in code.

Layout aliases sit on top of the steps and say what they're for: `page-gutter`, `section-gap`, `component-gap`, and any the product repeats, such as a table row height. Each alias refers to a step rather than holding its own value.

---

## Density axis

The density axis governs how tight or generous spacing is throughout a product. It is not a single value — it pervades every spacing decision.

Dense products (data-heavy apps, admin tools, dashboards) need: tighter component padding, smaller gaps between elements, and smaller step values used throughout the scale. A button with 8px vertical padding instead of 16px, a table row at 32px tall instead of 48px.

Spacious products (editorial, onboarding, marketing) need: generous padding, visible whitespace between sections, larger step values as defaults.

### Starting step sets by density

These are starting points on a 4px base, to adjust to the product:

| Density | Steps (px) | Why |
|---|---|---|
| Dense | 2, 4, 6, 8, 12, 16, 20, 24, 32, 48 | Many small steps, for tight component internals and compact rows |
| Balanced | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 | Even coverage from component internals to page sections |
| Sparse | 4, 8, 16, 24, 32, 48, 64, 80, 96, 128 | Fewer small steps, more large ones for generous layout |

If density varies within the product (dense tables inside a balanced layout), keep the small steps for component internals and the large ones for layout, rather than defining two scales.

**Design the density before designing the scale.** A scale calibrated for a dense dashboard will feel cramped if repurposed for a marketing page; a spacious scale will waste screen space in a dense application.

For mixed products that need both densities, define a density axis rather than two separate scales:
- A global scaling multiplier applied uniformly (Radix's `scaling` prop at 90–110%)
- A discrete "compact/default/comfortable" mode that remaps specific spacing tokens
- A set of density-variant component tokens for the highest-frequency components (tables, forms, navigation)

The multiplier approach is simpler to implement; the token-remap approach gives more granular control. Neither is universally correct.

---

## Space before lines

Space is the first way to separate and group, before tone, lines, or shadow (`opinion.hierarchy-before-lines`). Proximity says things belong together; more space says they don't. Fluent's layout guidance says spacing "creates logical sections of content on a page without having to use lines or other graphical elements as a divider" ([Fluent](https://fluent2.microsoft.design/layout)), and Apple's guidelines name negative space, containers, and separators as alternatives for grouping ([Apple](https://developer.apple.com/design/human-interface-guidelines/layout)). Containers help when space alone isn't enough, but each one adds clutter ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)).

What this means for a scale:

- **Steps far enough apart to read as different.** The gap inside a group and the gap between groups need a clear difference, often two steps on the scale, or the grouping disappears.
- **Space as emphasis.** More room around an element draws attention to it. The featured item and section breaks can use the larger steps.
- **Generous outer spacing, even when dense.** A dense table can sit in a page with comfortable margins. Density applies to the inside of components first.
- **One control height per density.** Buttons, fields, and selects in a row share a height, so the row lines up (`quality.craft.rhythm`).

---

## Breakpoint philosophy

**Content-first, not device-first.** Define breakpoints at the sizes where your specific content needs to reflow — where the text measure becomes too wide, where the navigation no longer fits side-by-side, where the grid needs to collapse. Don't define breakpoints at device sizes (375, 768, 1024) unless those happen to coincide with your content's needs.

**Minimize the number of breakpoints.** Each additional breakpoint multiplies the design and implementation surface area. Most products need 3–4 breakpoints; more is usually a sign of premature specificity. Start with two (mobile, desktop), add a tablet breakpoint only when the content genuinely needs different treatment at that width.

**Spacing should change at breakpoints, not just layout.** It is common to restructure layouts at breakpoints (1 column → 2 columns) while leaving spacing unchanged. This is usually wrong — a component that was 24px padded on mobile often needs 32px or 40px on desktop because the surrounding whitespace has expanded. Define spacing tokens that are breakpoint-aware, or use responsive token values.

**Responsive spacing approaches:**

The simplest: define baseline scale values that are used as-is across all breakpoints, and override specific tokens at breakpoints where needed.

The more systematic: define spacing tokens as fluid values that scale smoothly between a min and max using `clamp()`:
```css
--space-section: clamp(24px, 5vw, 64px);
```
This eliminates hard breakpoints for spacing while maintaining the scale semantics. Best suited for layout-level spacing tokens; component-internal spacing rarely needs to be fluid.

---

## The never-arbitrary rule

Every spacing value in a component or layout should reference a scale token or be derivable from one. A value of `17px` is a design smell — it means a decision was made that bypasses the scale, which will need to be explained and justified every time someone reads the code.

When you feel the pull toward an off-scale value, ask: Is the scale missing a needed step? Is the component's internal padding trying to compensate for something else (wrong base font size, wrong line height)? Fixing the root cause is almost always better than introducing an off-scale value.
