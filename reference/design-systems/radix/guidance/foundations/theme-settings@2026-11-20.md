---
system: radix
category: foundations
topic: theme-settings
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://www.radix-ui.com/themes/docs/components/theme
license: "No open licence stated for the documentation; tier 2 (synthesis only)"
tags: [theming, radius, panel-background, scaling, parameters]
---

# Radix Themes: theme settings as a few parameters

Sources: https://www.radix-ui.com/themes/docs/components/theme, https://www.radix-ui.com/themes/docs/theme/radius

- The Theme component takes a handful of settings that restyle every component: `accentColor`, `grayColor` (default `auto`, matched to the accent), `panelBackground` (`solid` or `translucent`), `radius` (`none`, `small`, `medium`, `large`, `full`), and `scaling` (90% to 110%), plus `appearance` (light or dark).
- **Radius is a factor, not one value.** The resulting radius differs by component: at `full`, a button becomes a pill but a checkbox never becomes a circle. Some components accept their own `radius` to override the theme.
- Panel background is a separate choice from color: solid or translucent panels.

## Relevance to Sistema

The closest published precedent for the specimen tool: taste choices expressed as a few independent parameters that restyle everything consistently, with radius scaled per component rather than applied uniformly.
