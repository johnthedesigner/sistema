---
title: "Depth and elevation"
description: "The two ways systems express depth (shadow and surface tone), when to use each, layering, and z-index."
topic: depth
sources:
  - { source: material, url: "https://m3.material.io/styles/color/roles" }
  - { source: atlassian, url: "https://atlassian.design/tokens/design-tokens" }
  - { source: carbon, url: "https://carbondesignsystem.com/elements/color/overview/" }
  - { source: geist, url: "https://vercel.com/geist/materials" }
  - { source: fluent, url: "https://fluent2.microsoft.design/elevation" }
  - { source: comeau-shadows, url: "https://www.joshwcomeau.com/css/designing-shadows/" }
  - { source: spectrum, url: "https://spectrum.adobe.com/foundations/attention-hierarchy" }
last_reviewed: 2026-05-13
---

# Depth and elevation

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

### Shadow color

Take shadow colors from the neutral ramp, tinted toward the surface they fall on, rather than pure black at low opacity. Pure black reads as grey and slightly dirty on warm or tinted surfaces, and it looks harsher as opacity rises. A tinted shadow sits in the same color world as the surface. In a dark theme, shadows need more opacity to read at all, and floating layers usually need a lighter surface as well (see the hybrid approach below).

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
| Data-dense applications | Tone or a light shadow, with lines only where they help follow rows | Many outlined surfaces read as noise; many tonal layers can blur together, so keep the levels few |
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
surface          light → gray 50,   dark → gray 950
surface-raised   light → white,     dark → gray 900  + shadow.raised
surface-featured light → white,     dark → gray 850  + shadow.featured
surface-overlay  light → white,     dark → gray 800  + shadow.overlay
```

In dark themes, step one stop at a time (the color guide's "Stops in a dark theme").

The surface colors do the work in dark mode; the shadows do the work in light mode. The same token names work in both contexts.

---

## Emphasis and separation

Elevation does two jobs: it shows what floats above the page, and it shows what matters. Fluent uses elevation to "convey levels of importance", not only layering ([Fluent](https://fluent2.microsoft.design/elevation)), and closer things are noticed first ([Comeau](https://www.joshwcomeau.com/css/designing-shadows/)). Both jobs work only if most things don't have it. Geist names over-elevating as a common source of visual noise and asks for the lowest elevation that still reads ([Geist](https://vercel.com/geist/materials)).

Sistema's default (`opinion.elevation-by-role`) gives each shadow a role rather than a number:

| Shadow | Used for | Character |
|---|---|---|
| `shadow.control` (optional) | Buttons and fields that should feel touchable | A barely visible edge shadow |
| `shadow.raised` | Panels, only when the direction separates panels by shadow | Soft and close |
| `shadow.featured` | The featured surface, what should lead on a screen | Much further: a clear lift above everything else on the page |
| `shadow.overlay` | Menus, popovers, dialogs, toasts | Far, with a faint edge so the layer reads against anything beneath it |

How to build them:

- **One light source.** Every shadow shares the same direction and the same ratio of vertical to horizontal offset. As a shadow gets "higher", its offset and blur grow and its opacity falls.
- **Layered.** Each shadow stacks two or three layers: a tight one that defines the edge and a wide, faint one that implies distance (Fluent calls them key and ambient). A single blurred shadow tends to look like a soft border.
- **Tinted.** Take the shadow color from the darkest neutral stop, not pure black (see "Shadow color" above).
- **Dark themes.** Shadows need more opacity to read, and raised, featured, and overlay surfaces also step lighter (the color guide's emphasis surfaces).

### Choosing a treatment by role

Shadow is one of several ways to separate and lift; the others are space, tone, a hairline, an inset well, and a block of color (the visual-language guide lists them with quiet and strong versions). Choose per context from the role of the content:

- A zone that frames the work (sidebar, toolbar): quiet, by tone.
- A group of related controls or records: space first; a panel by tone if it needs a boundary.
- What should lead: strong, by the featured shadow or a block of color, not both.
- Something above the page: the overlay shadow.
- Rows of data: a hairline only if the eye needs help following them.

Spectrum suggests one high-attention element or group per page as a rule of thumb ([Spectrum](https://spectrum.adobe.com/foundations/attention-hierarchy)).

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
