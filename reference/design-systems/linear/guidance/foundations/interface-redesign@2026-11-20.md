---
system: linear
category: foundations
topic: interface-redesign
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://linear.app/now/how-we-redesigned-the-linear-ui
license: "Company blog post, no open licence; tier 3 (synthesis with attribution)"
tags: [color, theming, lch, contrast, chrome, hierarchy, redesign]
---

# Linear: how the interface was redesigned (March 2024)

Source: "How we redesigned the Linear UI (part II)", Karri Saarinen, Yann-Edern Gillet, Andreas Eldh, Romain Cascino. https://linear.app/now/how-we-redesigned-the-linear-ui

## Aims

- Reduce visual noise in the sidebar, tabs, headers, and panels; keep visual alignment; increase the hierarchy and density of navigation elements.
- Focus on the "inverted L" (sidebar plus top chrome) that frames the content.
- A neutral, "timeless" appearance: reached by **limiting how much of the brand hue goes into the calculated colors of the chrome**.
- Higher content contrast: darker text and neutral icons in light mode, lighter in dark mode.

## Method notes

- Explorations worked largely with **opacities of black and white**, which made the relationship between elements, their elevation, and their hierarchy quick to see.
- Themes are generated in **LCH** (perceptually uniform) from **three inputs: base color, accent color, and contrast**, instead of defining 98 variables per theme. Surfaces at different elevations (background, foreground, panels, dialogs, modals) come from that generation. The contrast input yields high-contrast themes for accessibility.
- Alignment of labels, icons, and buttons in a small area was treated as something "you'll feel after a few minutes" rather than see.
- Stress tests of the direction across real views (list, board, timeline, split) before building; behaviors defined per main component.
- Type: a display cut of the UI typeface for headings, for more expression, with the text cut for everything else.

## Relevance to Sistema

- Evidence for low-chroma chrome with color held back for meaning (craft baseline 2), and for content contrast pushed up.
- A small number of generating inputs (base, accent, contrast) producing every surface: the same idea as the specimen tool's parameters.
- Test a direction on real screens before committing.
