---
title: "Shape architecture"
description: "How corner radius signals personality, how to build a radius scale, and where full rounding fits."
topic: shape
sources:
  - { source: material, url: "https://m3.material.io/styles/shape" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/radius" }
  - { source: atlassian, url: "https://atlassian.design/tokens/design-tokens" }
last_reviewed: 2026-05-13
---

# Shape architecture

## Overview

Shape is mostly border radius: a dial from sharp to round with little functional meaning, so it's mainly a matter of character.

---

## Border radius as a personality signal

| Control radius | Tends to read as |
|---|---|
| 0px | Architectural, editorial, deliberately stark |
| 2 to 4px | Crisp |
| 6 to 10px | Balanced; common across current product interfaces, technical ones included |
| 12 to 20px | Soft, friendly |
| Fully round | Playful; common for chips and mobile actions |

These are tendencies, not rules; context changes them. Sharp corners don't make a product more serious, and many precise, technical tools use a moderate radius.

Choose the control radius as a character decision before designing components, then scale everything else from it (`opinion.radius-by-size`): smaller parts less round, containers more, floating layers most. Radius that doesn't follow size, such as a very round button in a square card, looks inconsistent.

---

## Scale approaches

### Named scale (semantic)

Define a small number of named radius tiers and assign components to tiers:

```
none    → 0px
small   → 4px
medium  → 8px
large   → 16px
full    → 9999px (pill)
```

**Why named tiers work:** They enforce a limited vocabulary. When a new component needs a radius, the designer or developer picks the tier that matches the component's purpose — not the pixel value that looks right to them. This makes the scale teachable and auditable.

**How to name tiers:** two conventions work, and the choice is the project's.
- **By role:** `radius-control` for buttons and inputs, `radius-panel` for cards and dialogs, `radius-small` for inline elements, `radius-pill` for chips. Each name says what it's for and survives a change of value.
- **By size:** `sm`, `md`, `lg`, as in the example above and in Tailwind, with each component family assigned a size in DESIGN.md's Shapes section and in each token's `$description`. This fits projects built on Tailwind or shadcn/ui, where components already speak in sizes.

Either way, components follow the level DESIGN.md assigns them, and the hierarchy holds: small parts below controls, controls below panels, floating layers the roundest. The shape play proposes one convention and the person chooses.

### Numeric scale (steps)

A 4–6 step numeric scale (1 through N) where each step is a specific pixel value. Components consume step numbers rather than semantic names.

Works well for library systems where consumers compose freely. Has the same composability tradeoff as numeric type scales: no communication of purpose, but maximum flexibility. More suitable for a component library than a prescriptive product system.

### Global factor

A single theme-level setting that recalculates all component radii proportionally (Radix's `radius` prop: none / small / medium / large / full). Extremely simple to use — one knob controls the whole product.

**Tradeoff:** Some components should not round fully even when the system-level setting is `full`. A checkbox should never become a circle (visual confusion with radio buttons); a data table cell should not have individual rounded corners. The global factor approach requires component-level exceptions, which defeats some of its simplicity.

---

## Component consistency

**Components within the same family should share a radius tier.** A button family (filled, outlined, ghost) that mixes 8px, 4px, and 0px radii reads as incoherent. The different variants express emphasis through fill and border, not through shape.

**Size variants of the same component should scale radius proportionally.** A small button and a large button with the same 8px radius will look different — the small button appears more rounded relative to its height. Either scale the radius with the component size (small: 4px, large: 8px) or accept that the larger variant will look more subtle.

**Surface containers (cards, panels, modals) usually warrant a higher-radius tier than small interactive elements.** A large container with the same radius as a chip looks proportionally different. Cards typically warrant medium-to-large radius; small badges and chips use small-to-medium.

**The exception: data components.** Tables, grids, code blocks, and data lists are typically `none` or `small` regardless of the system's overall personality. Sharp edges communicate structure and precision in data contexts even in an otherwise rounded system.

---

## The pill (full radius) — using sparingly vs. as a default

**Used sparingly:** Pill shapes are high-emphasis signals. They draw the eye. When used selectively — primary action buttons, badges, tag pills — they indicate "this is important and interactive." When overused, the signal disappears.

**As a system default:** Some systems (particularly mobile-native and consumer products) use full radius as the default for all interactive elements. This creates a consistent, approachable feel but loses the distinction pill shapes usually carry.

**The middle path:** Use pill shapes for badges, tags, and selection chips (where the pill shape is the category convention); use moderate radius for interactive buttons and inputs; use larger-but-not-full radius for prominent CTAs.

**Never full-radius:** Data table cells, code blocks, image containers (distorts the image crop), and form fields in dense layouts.
