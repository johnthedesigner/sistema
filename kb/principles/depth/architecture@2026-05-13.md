---
category: principles
topic: depth-architecture
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [depth, elevation, shadow, surface, layering, tokens, synthesis]
sources:
  - kb/reference/design-systems/material/guidance/foundations/color-roles
  - kb/reference/design-systems/atlassian/guidance/foundations/design-tokens
  - kb/reference/design-systems/carbon/guidance/foundations/color-system
---

# Depth and Elevation — Synthesis

## Overview

Depth and elevation communicate the vertical structure of a UI — which layers are above others, which surfaces are interactive, and how far apart layers are in the Z-axis. Two fundamentally different models exist. The choice between them (or a hybrid) depends on your product's visual language and the complexity of its surface vocabulary.

---

## The two models

### Model 1 — Shadow-based elevation

Components at higher elevation cast shadows on the surfaces beneath them. The shadow strength (blur radius, spread, opacity) communicates relative height.

**How it works:** A set of shadow tokens (typically 3–5 levels) defines elevation tiers. Components are assigned to tiers based on their structural role: base surface, raised container, overlay, modal.

Example tiers:
```
elevation-0: no shadow          → page background
elevation-1: subtle shadow      → cards, sidebars
elevation-2: moderate shadow    → sticky headers, dropdowns
elevation-3: prominent shadow   → dialogs, drawers
elevation-4: strong shadow      → tooltips, popovers
```

**What it communicates well:** Physical analogy — objects above a surface cast shadows. Universally understood. Works in both light and dark themes because shadows are additive (they darken, which is visible on any surface).

**Failure modes:**
- Overused: too many elevation levels competing for attention produces visual noise
- Under-designed: flat shadows with the wrong blur/opacity look like borders, not depth
- Dark mode: shadows become invisible or very subtle on dark surfaces because dark objects on dark backgrounds don't cast visible shadows. This forces a secondary strategy for dark mode (see hybrid approach below).

### Model 2 — Tonal surface elevation

Surfaces at higher elevations are lighter than lower-elevation surfaces. No shadows — depth is communicated entirely through surface color tones.

**How it works:** A set of surface-level tokens defines a lightness progression. Components assigned to higher layers get a lighter surface color, creating the perception of being closer to the viewer (lighter = more light reflected = closer to a light source).

Example tiers (dark mode, where this model is most legible):
```
surface-base:    tone 10   → page background
surface-low:     tone 14   → cards, sidebars
surface-mid:     tone 18   → sticky headers, popovers
surface-high:    tone 22   → dialogs, drawers
surface-overlay: tone 28   → tooltip backgrounds
```

**What it communicates well:** Depth without visual noise. Especially effective in dark mode where shadows are invisible. Creates a clean, modern aesthetic with no drop shadows competing for attention.

**Failure modes:**
- Light mode: the difference between a white surface and a near-white elevated surface is extremely subtle and often invisible to users
- Accessibility: users with low contrast sensitivity may not perceive the elevation hierarchy at all
- Without a boundary: surfaces at adjacent levels may appear merged if there is no border or shadow to separate them

---

## When to use each model

| Context | Recommended model | Why |
|---|---|---|
| Primarily light mode | Shadow-based | Tonal elevation is nearly invisible in light mode |
| Primarily dark mode | Tonal elevation | Shadows are nearly invisible in dark mode |
| Both modes with consistent vocabulary | Hybrid | Each model covers the other's failure mode |
| Flat, minimalist aesthetic | Neither — use borders | Elevation suggests depth; some designs are intentionally flat |
| Data-dense applications | Shadow-based or borders | Tonal layers become visually confusing with many surface types |
| Rich consumer apps | Hybrid | Users expect physical metaphors for surfaces and modals |

---

## The layering problem

The core challenge of any depth model is making surface layers distinguishable without creating visual noise. Too little distinction and layers feel flat; too much distinction and the UI looks busy.

**Rules for manageable layering:**

**Limit to 4–5 levels.** Base, one raised level, overlay (popover/dropdown), modal, tooltip. More layers than this become unmaintainable and rarely serve real navigation hierarchy.

**Use boundaries at layer transitions.** When the visual difference between two adjacent layers is subtle, a 1px border or a subtle shadow line at the edge creates unambiguous separation. This is especially important in light mode tonal approaches where tone difference alone is insufficient.

**Assign components to layers systematically.** Not "whatever looks right" but a deliberate assignment: this component is always elevation-1, this is always elevation-3. Document it. Components that have inconsistent elevation assignment undermine the model.

**Background overlays need consistent treatment.** Modals and dialogs typically use a background scrim (semi-transparent overlay) on top of the page surface before the modal itself. The scrim's opacity communicates how much the underlying content is receding. A standard value (e.g. 50% black) should be defined as a token, not chosen case-by-case.

---

## The hybrid approach

The most practical approach for products with both light and dark modes: use shadow-based elevation as the primary model, supplemented by tonal surface values in dark mode.

In light mode: drop shadows communicate elevation with familiar physical metaphor. Surface colors are all near-white and don't differentiate well by tone.

In dark mode: surface colors become the primary elevation signal. Shadows remain as secondary cues for the highest-elevation elements (modals, tooltips) where some shadow is still perceptible on dark backgrounds.

**Token structure for hybrid:**
```
elevation-surface-base:    light → #ffffff,    dark → tone-10
elevation-surface-raised:  light → #ffffff,    dark → tone-14  + shadow-subtle
elevation-surface-overlay: light → #ffffff,    dark → tone-18  + shadow-moderate
elevation-surface-modal:   light → #ffffff,    dark → tone-22  + shadow-prominent
```

The surface colors do the work in dark mode; the shadows do the work in light mode. The same token names work in both contexts.

---

## Z-index

Z-index is the CSS implementation of elevation layering. Without a defined system, z-index values proliferate arbitrarily (z-index: 9999 is a common signal of an unmaintained system).

Define a z-index scale with named tiers:
```
z-base:      0      → page content
z-raised:    1      → sticky elements within content flow
z-dropdown:  100    → dropdowns, tooltips, non-blocking overlays
z-modal:     200    → modals, dialogs, drawers
z-toast:     300    → notifications, toasts (above modals)
z-maximum:   400    → emergency override; document every use
```

The specific values matter less than the relative ordering and the constraint that all usage goes through the named scale. A component should never set its own z-index outside the scale without explanation.
