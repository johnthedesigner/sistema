---
system: fluent
category: foundations
topic: elevation-and-layout
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://fluent2.microsoft.design/elevation
license: "No open licence stated for the documentation; tier 2 (synthesis only)"
tags: [elevation, shadow, spacing, hierarchy, layout]
---

# Fluent 2 (Microsoft): elevation and layout

Sources: https://fluent2.microsoft.design/elevation, https://fluent2.microsoft.design/layout

## Elevation conveys importance

- Elevation is the perceived distance between an object and the surface behind it, shown with shadow and light. Fluent uses it to "convey levels of importance" and aid scanning, not only to show layering.
- Consistent shadow direction implies one light source. Sharp, crisp shadows mean close to the surface; larger, softer shadows mean farther away.
- Each shadow combines a **key** shadow (sharp, directional, defines the edge) and an **ambient** shadow (soft, diffuse, implies distance). Shadow tokens are named by blur (shadow2 to shadow64).
- Separate ramps for light and dark themes: dark uses higher opacity for the same perceived elevation.
- Usage examples in light: cards without an edge use low shadows (2 to 4); raised cards and app bars 8; callouts and hover cards 16; dialogs and panels higher.
- **Shadows on color surfaces:** the same shadow on a brand-colored surface reads as a different elevation than on a neutral one, so shadow opacity is adjusted by the surface color's luminosity, with separate brand shadow tokens. Don't use the neutral ramp on colored surfaces.
- Windows uses strokes instead of key shadows to outline an object (a platform distinction).

## Layout: space before lines

- Proximity signals relationship; more space weakens it. Spacing "creates logical sections of content on a page without having to use lines or other graphical elements as a divider."
- Elements with more space around them draw more focus and read as more important; crowded elements may be overlooked.
- Global spacing ramp on a 4px base, plus 2, 6, and 10 for icon alignment.
- Spacing is applied at three scales: within components (small, strong relationships), in patterns (consistent rhythm), in layouts (direct the eye to what matters most). Use the ramp for consistency, but adjust where alignment needs it, rather than "blindly using consistent spacers".
- Grid regions: the most important content takes the largest regions.

## Relevance to Sistema

- Elevation as a carrier of importance (D24 emphasis), key plus ambient layering, and theme-specific shadow strength.
- Shadow adjusted for colored surfaces: needed for the brand surface role.
- Space as the first separator (craft baseline 1).
