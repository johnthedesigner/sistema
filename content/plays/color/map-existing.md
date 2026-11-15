---
id: color.map-existing
title: Bring existing colors into the system
description: Keep a project's existing colors and map them to Sistema's semantic roles as DTCG JSON, filling gaps with the palette tool and verifying every pairing.
topic: color
kind: change
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:a11y-standard", "project:theme"]
produces: [tokens/src/color.json, "tokens/src/color.dark.json?"]
tools: [palette, contrast]
knowledge:
  - guide.color.architecture#the-decision-framework
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.color.primitive-ramp-scalability#how-ramps-feed-the-semantic-layer
rules: [color.ramps.from-tool, color.roles.required, color.contrast.text, color.contrast.ui, color.dark.tonal-shift, quality.color.bans, tokens.naming.role]
evidence: A mapping table (existing value, source location, assigned role) and a contrast table for every required pairing in every theme. Every required pairing passes.
overrides: []
last_reviewed: 2026-11-14
---
Use this play when the project already has colors in another format, for example a Tailwind config, CSS custom properties, or SCSS variables. The goal is to keep what the team chose, not to replace it.

1. **Collect the existing colors.** List each value with where it lives (file and name) and how it is used today. Spot-check components to see which values do which jobs.

2. **Map values to roles.** Assign existing values to the roles in `color.roles.required` where they fit the job. A brand blue used on buttons becomes `primary`, for example. Keep the existing values exactly.

3. **Complete the ramps with the palette tool.** If a hue has fewer than 10 stops, send its main value as a seed to the palette tool, in one request for all such hues, and use the returned ramp around the existing values. If the palette is a fixed brand specification that must not be expanded, keep it as is and flag each role it cannot fill. For error, success, and warning with no existing value, use the pre-built ramps in `{{sistema_url}}/palettes/library.json`. Do not invent values by hand.

4. **Verify with the contrast tool.** Check every on-* pairing and `border-focus`, in every theme, against the standard in `sistema.json`. When an existing pairing fails, propose the nearest passing stop from the same hue's ramp. Ask the person before changing a brand color.

5. **Write `tokens/src/color.json`**, and `tokens/src/color.dark.json` if the theme includes dark, as DTCG JSON. Each `$description` notes where the value came from: an existing location, or a palette ramp and stop.

6. **Leave the old sources alone.** Do not edit the Tailwind config or existing CSS in this play. The token pipeline play replaces them with compiled output. Note in DECISIONS.md which old sources the pipeline should replace.

7. Show the mapping table and the contrast table.
