---
id: color.scheme
title: Generate the color scheme
description: Build primitive ramps with the palette tool, assign every semantic color role, and verify every pairing with the contrast tool, in every theme.
topic: color
kind: create
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:a11y-standard", "project:theme"]
produces: [tokens/src/color.json, "tokens/src/color.dark.json?"]
tools: [palette, contrast]
knowledge:
  - guide.color.architecture#the-decision-framework
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.color.architecture#neutral-palette-design
  - guide.color.primitive-ramp-scalability#how-ramps-feed-the-semantic-layer
  - guide.quality.visual-quality-signals#4-oklch-color-commitment-levels
rules: [color.ramps.from-tool, color.roles.required, color.contrast.text, color.contrast.ui, color.dark.tonal-shift, quality.color.first-order-reflex, quality.color.bans, quality.color.commitment-level, tokens.naming.role]
evidence: A contrast table with one row per on-* pairing and the border-focus pairing, in every theme, each showing the ratio from the contrast tool and the required value. Every required pairing passes.
overrides: [color_direction, color_mode]
last_reviewed: 2026-11-14
---
1. From the DESIGN.md Overview "Direction values", take the commitment level and the seeds. From `sistema.json`, take the theme and the accessibility standard. If this play is run on its own, use `color_direction` and `color_mode` when given.

2. **Choose the color model** that fits the product, using the decision framework in the color guide. Record the choice and the reason.

3. **Generate ramps with the palette tool.** Send every seed (primary, neutral, and any secondary) in one request. Do not compute or adjust ramps yourself. For error, success, and warning, use the pre-built ramps in `{{sistema_url}}/palettes/library.json` (red, amber, and green, or the closest fit) unless DESIGN.md names custom ones.

4. **Assign the roles** in `color.roles.required` from the returned stops. Write `tokens/src/color.json` as DTCG JSON, with the structure `{"color": {"<role>": {"$type": "color", "$value": "#...", "$description": "..."}}}`. In each `$description`, note the ramp and stop you used.

5. **Dark theme.** If the theme is `light-dark` or `dark`, assign dark values by tonal shift from the same ramps. Write `tokens/src/color.dark.json` with only the roles that change.

6. **Verify with the contrast tool.** Check every on-* role against the surface or container it sits on, and `border-focus` against `surface`, in every theme. Find the required values in the rules below, for the standard in `sistema.json`. When a pairing fails, move to a different stop and check again. Do not write a failing pair, and do not estimate a ratio.

7. **Check quality.** Compare the result against the first-order reflex, the color bans, and the commitment level. Fix what you can. Explain anything you keep on purpose.

8. Add each pairing's final ratio to its on-* role's `$description`, then show the evidence table.
