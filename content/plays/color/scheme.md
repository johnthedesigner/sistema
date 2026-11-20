---
id: color.scheme
title: Generate the color scheme
description: Build primitive ramps with the palette tool, assign every semantic color role, and verify every pairing with the contrast tool, in every theme.
topic: color
kind: create
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:a11y-standard", "project:theme"]
produces: [tokens/src/palette.json, tokens/src/color.json, "tokens/src/color.dark.json?"]
tools: [palette, contrast]
knowledge:
  - guide.color.architecture#the-decision-framework
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.color.architecture#stops-in-a-dark-theme
  - guide.color.architecture#neutral-palette-design
  - guide.color.architecture#emphasis-surfaces
  - guide.color.primitive-ramp-scalability#how-ramps-feed-the-semantic-layer
  - guide.quality.visual-quality-signals#4-oklch-color-commitment-levels
rules: [color.ramps.from-tool, color.preview.ramp-strips, color.roles.required, color.contrast.text, color.contrast.large-text, color.contrast.ui, color.dark.tonal-shift, color.dark.surface-steps, quality.color.first-order-reflex, quality.color.bans, quality.color.commitment-level, quality.craft.text-tones, quality.craft.accent-for-meaning, tokens.naming.role]
evidence: A contrast table with one row per on-* pairing and the border-focus pairing, in every theme, each showing the ratio from the contrast tool and the required value. Every required pairing passes.
overrides: [color_direction, color_mode]
last_reviewed: 2026-11-20
---
1. From the DESIGN.md Overview "Direction values", take the color presence, the commitment level, the seeds, and the ramp stops the approved composition used for each role, and read the emphasis map. From `sistema.json`, take the theme and the accessibility standard. If this play is run on its own, use `color_direction` and `color_mode` when given.

2. **Choose the color model** that fits the product, using the decision framework in the color guide. Record the choice and the reason.

3. **Generate ramps with the palette tool.** Send every seed (primary, neutral, and any secondary) in one request. Do not compute or adjust ramps yourself. For error, success, and warning, use the pre-built ramps in `{{sistema_url}}/palettes/library.json` (red, amber, and green, or the closest fit) unless DESIGN.md names custom ones. Write every ramp you use to `tokens/src/palette.json` as the primitive tier, exactly as the tool or library gave it: `{"palette": {"<ramp>": {"<stop>": {"$type": "color", "$value": "#..."}}}}`.

4. **Assign the roles** in `color.roles.required`, including the emphasis surfaces, from the returned stops. Where the approved composition used a stop for a role, use the same stop; the color guide's "Emphasis surfaces" says how to choose the rest (small steps for quiet levels, big steps for emphasis). Text takes three or four tones from the neutral ramp, and the accent appears only where the color presence allows. If a role must change, for example to pass contrast, list it in the evidence as a change from the approved preview. Write `tokens/src/color.json` as DTCG JSON, with each role referring to its primitive: `{"color": {"<role>": {"$type": "color", "$value": "{palette.primary.600}", "$description": "..."}}}`. Say what the role is for in each `$description`.

5. **Dark theme.** If the theme is `light-dark` or `dark`, assign dark values by tonal shift from the same ramps: text and fills start at the mirrored stop (1000 − n), and surfaces step one stop at a time from 950, as the color guide's "Stops in a dark theme" describes. Write `tokens/src/color.dark.json` with only the roles that change.

6. **Verify with the contrast tool.** Send all pairs together; one POST takes up to 200. Check every color used as text, as an icon, or as an essential indicator against the surface it sits on, in every theme: every `on-*` role (including `on-surface-inverse` and `on-surface-brand`), muted text on the emphasis surfaces, feedback colors used as text (such as error text on a surface), links, and `border-focus`. Find the required values in the rules below, for the standard in `sistema.json`. When a pairing fails, move to a different stop and check again. Do not write a failing pair, and do not estimate a ratio.

7. **Check quality.** Compare the result against the first-order reflex, the color bans, and the commitment level. Fix what you can. Explain anything you keep on purpose.

8. Add each pairing's final ratio to its on-* role's `$description`, then show the evidence table.
