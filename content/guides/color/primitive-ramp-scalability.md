---
title: "Primitive ramp scalability"
description: "Why a full primitive ramp for every hue lets a color system grow, and how semantic roles map onto ramp stops."
topic: color
sources: []
related:
  - guide.color.palette-generation
  - guide.color.architecture
  - guide.tokens.architecture
last_reviewed: 2026-11-16
---

# Primitive ramp scalability

## The core principle

**Generate a full primitive color ramp before mapping any semantic roles.**

A full ramp is a complete set of stops (50–950, 19 values) derived from a single seed color using the contrast-targeting algorithm in the Palette generation guide. Every stop has a predictable contrast ratio against white and black, precomputed and documented.

The alternative — hand-picking individual hex values for specific semantic roles — produces a color system that works at initial scope but creates compounding constraints as the product grows.

---

## Why ramps beat hand-picked values for SaaS

SaaS products do not stay at initial scope. New feature areas, new surface patterns, new interactive states, and new UI density requirements arrive after the first ship. Each one creates demand for color values the original hand-picked set doesn't cover.

### The scalability gap

When a design system defines colors as a hand-picked set — `"primary": "#2563EB"`, `"primary-light": "#DBEAFE"`, `"primary-dark": "#1D4ED8"` — every new semantic role either:

1. **Requires re-generating color** — the team picks a new value, usually ad hoc, usually outside the system. Color consistency degrades incrementally.
2. **Reuses an existing stop for the wrong role** — forcing compromise that produces contrast failures or visual ambiguity.
3. **Adds a one-off token** — a value with no relationship to the rest of the palette, making the primitive layer incoherent over time.

A full 19-stop ramp prevents all three failure modes. Every semantic role maps to a ramp stop. The ramp is the authority; semantic mapping is configuration, not generation.

### The contrast interchangeability benefit

The 19-stop OKLCH ramp has a specific property beyond mere completeness: cross-hue stops at the same index meet the same contrast target. If `blue-600` meets 6.95:1 against white, then `green-600` also meets approximately 6.95:1. This makes semantic role mapping deterministic regardless of which hue is chosen.

Without full ramps, adding a secondary or accent hue requires hand-verifying every contrast pair from scratch. With ramps, the stop selection for the new hue follows the same rules as the primary — the team doesn't need to repeat the contrast research.

### The dark mode benefit

Dark mode requires a different stop assignment for each semantic role — a role that uses stop 600 in light mode may use stop 300 in dark mode. This mapping is straightforward when the full ramp exists: the team selects the dark-mode stop by black-contrast target instead of white-contrast target.

Without full ramps, dark mode requires generating new color values for roles where the hand-picked light-mode value has no dark counterpart in the set. This is where most ad hoc color proliferation happens.

---

## When to use a full ramp

**Always generate full ramps when:**

- The product is a SaaS application with an expected multi-year lifespan
- The system will support more than one theme or mode (light + dark, multiple brands)
- The team anticipates adding feature areas after the initial launch
- The design system will be consumed by more than one product or team

**A full ramp may be excessive when:**

- The scope is a contained marketing site or landing page (fixed scope, unlikely to extend)
- The team needs a prototype for a short-lived experiment (weeks, not months)
- The color direction is intentionally minimal — a single neutral with one accent, and no plans to extend

The heuristic: if you can describe a clear future scenario where you'd need a color value that isn't in your initial set, generate the full ramp now.

---

## The Sistema palette API

The palette API at `{{sistema_url}}/api/palette` implements the full contrast-targeting algorithm from the Palette generation guide.

**Request:** `{ "colors": { "[name]": "#hex", ... } }` — one or more seed hex colors, keyed by name.

**Response:** `{ "palettes": { "[name]": { "seed": "...", "stops": { "50": { "hex": "...", "contrast_white": ..., "contrast_black": ... }, ... } } } }` — a complete 19-stop ramp per color, with both contrast values precomputed for every stop.

Color-generating plays call this endpoint directly from the seed hex(es) determined by the color direction or living brief. The returned stop values become the primitive layer; semantic roles are assigned to stops in the same play.

**Pre-built library:** A curated set of 22 named ramps (slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) is available as static JSON at `{{sistema_url}}/palettes/library.json`. Use these for neutral grays and feedback hues (error/warning/success) when the brief does not specify custom seeds for those roles.

---

## How ramps feed the semantic layer

Primitive ramps are the raw material; semantic tokens are the interface.

The mapping pattern:

```
Primary role assignments (light mode):
--color-primary              → [primary ramp, stop ~550–600]   /* 5.54:1 to 6.95:1 against white */
--color-primary-container    → [primary ramp, stop ~150–200]   /* 1.22:1–1.37:1, tinted background */
--color-on-primary           → white or [primary ramp, stop ~950]
--color-on-primary-container → [primary ramp, stop ~700–750]   /* high contrast against container */

Surface role assignments (from neutral ramp):
--color-surface              → [neutral ramp, stop ~50]         /* near-white */
--color-surface-raised       → white or stop 50
--color-surface-hover        → [neutral ramp, stop ~100–150]
--color-on-surface           → [neutral ramp, stop ~850]        /* high contrast against surface */
--color-on-surface-muted     → [neutral ramp, stop ~550–600]   /* secondary text */
--color-border               → [neutral ramp, stop ~200–250]   /* subtle boundary */
--color-border-control       → [neutral ramp, stop ~450]        /* input and control edges */
```

These are starting points. The actual stop assignments depend on the architecture model (tonal, step scale, named palette — see the Color architecture guide) and the visual direction commitment level. But the principle is the same: every semantic role maps to a ramp stop, not a free-floating hex value.

---

## Multi-hue ramp strategy for SaaS

For a complete SaaS color system, generate ramps for at minimum:

1. **Primary hue** — the brand color and primary action color
2. **Neutral/gray** — surfaces, borders, text; select a seed with slight chroma (warm or cool) rather than a pure achromatic gray
3. **Feedback hues** — generate ramps for error (red-adjacent), success (green-adjacent), and warning (amber-adjacent) even if only a few stops will be used immediately

The feedback ramps matter even at initial scope because feedback colors must coordinate with the primary hue at a perceptual level. A brand-generated feedback palette (same algorithm, adjacent hues) is visually cohesive in a way that off-the-shelf Bootstrap colors are not.

Optionally, generate a secondary hue ramp if the product has a secondary brand color or a distinct information state color (info blue, when primary is not blue).

All ramps should be generated with the same algorithm — they will share the stop structure and contrast guarantees, making semantic role assignment predictable across all hues.

---

## Connection to the positioning brief

When `positioning-brief` establishes the OKLCH commitment level and color direction, that output should include the seed hex(es) to feed into the palette tool. The positioning brief is complete when the designer has:

1. An OKLCH commitment level (Restrained / Committed / Full palette / Drenched)
2. A primary seed hex (brand color, or a deliberate non-blue choice)
3. A neutral seed hex (warm, cool, or pure)
4. Any secondary or feedback hue direction

These four outputs map directly to the inputs of the palette tool. The ramp generation step is the bridge between positioning and semantic token mapping.
