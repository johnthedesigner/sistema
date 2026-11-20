---
system: geist
category: foundations
topic: surfaces-and-materials
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://vercel.com/geist/materials
license: "No open licence stated; tier 2 (synthesis only)"
tags: [elevation, surfaces, radius, shadow, borders, color-roles]
---

# Geist (Vercel): surfaces, materials, and color steps

Sources: https://vercel.com/geist/materials, https://vercel.com/geist/colors, https://vercel.com/geist/introduction

## Materials: one preset per elevation role

Geist bundles radius, fill, stroke, and shadow into named "materials" so a surface's elevation role decides its chrome, rather than each element hand-picking values.

- **On the page (surfaces):** base (everyday, 6px radius), small (slightly raised, 6px), medium and large (further raised, 12px).
- **Above the page (floating):** tooltip (lightest shadow, 6px, the only floating element with a stem), menu (lift, 12px), modal (further lift, 12px), fullscreen (biggest lift, 16px).
- Radius grows with elevation: resting things are tighter, floating and large things rounder.

Practices stated on the page (paraphrased):
- Pick the material from where the element sits in the layered hierarchy; don't stack two materials on one element; lift a child into its own higher material instead.
- Keep the elevation choice consistent with z-index, so a tooltip never looks lower than a card.
- Use the lowest elevation that still reads as elevated; over-elevating is named as a common source of visual noise.
- Don't rely on shadow alone for elevation; test in both themes, because shadow reads more weakly on dark backgrounds.

## Color: steps with assigned jobs

- Ten scales (gray, gray-alpha, blue, red, amber, green, teal, purple, pink), P3 where supported.
- Gray is the default for text, icons, fills, borders, and dividers; gray-alpha only where the background should show through (shadows, overlays).
- **Two page backgrounds:** Background 1 for most things, especially under color; Background 2 "sparingly" for subtle differentiation.
- **Steps 1 to 3:** component backgrounds (default, hover, active). Small elements like badges use steps 2 or 3.
- **Steps 4 to 6:** borders (default, hover, active). Solid gray by default; alpha only to blend with the surface.
- **Steps 7 and 8:** high-contrast backgrounds (and hover).
- **Steps 9 and 10:** secondary and primary text and icons.
- Do's and don'ts: draw each border once (keep a divider inside its container's border; overlapping alpha borders make intersections stand out); keep shadows translucent (opaque shadows leave a gray halo).

## Relevance to Sistema

- Elevation as a small set of named roles with radius scaled to the role (D24, craft baseline 4 and 5).
- "Over-elevating is visual noise" and the sparing second background support quiet levels.
- Steps with assigned jobs parallel Radix's 12-step model; Sistema's ramps are contrast-placed instead, so the mapping is by role, not step number.
