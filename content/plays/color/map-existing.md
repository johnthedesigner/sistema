---
id: color.map-existing
title: Bring existing colors into the system
description: Show how a project's existing colors fit Sistema's ramps, let the person choose how to treat each hue, then map the result to semantic roles as DTCG JSON and verify every pairing.
topic: color
kind: change
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:a11y-standard", "project:theme"]
produces: [tokens/src/color.json, "tokens/src/color.dark.json?", sistema-review/color.map-existing.html]
tools: [palette, contrast]
knowledge:
  - guide.color.architecture#the-decision-framework
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.color.primitive-ramp-scalability#how-ramps-feed-the-semantic-layer
rules: [color.existing.consent, quality.review.compare-visually, quality.review.outline, color.preview.ramp-strips, color.ramps.from-tool, color.roles.required, color.contrast.text, color.contrast.ui, color.dark.tonal-shift, quality.color.bans, tokens.naming.role]
evidence: The comparison page, the person's choice for each hue, a mapping table (existing value, source location, ramp and stop, assigned role, and whether its name changed), and a contrast table for every required pairing in every theme. Every required pairing passes.
overrides: []
last_reviewed: 2026-11-15
---
Use this play when the project already has colors in another format, for example a Tailwind config, CSS custom properties, or SCSS variables. Nothing existing changes until the person has seen the options and chosen.

1. **Collect the existing colors.** List each value with where it lives (file and name) and how it is used today. Spot-check components to see which values do which jobs. Group the values by hue.

2. **Get reference ramps.** Send one seed per hue to the palette tool, in one request: the value the project uses most for that hue. For error, success, and warning with no existing value, use the pre-built ramps in `{{sistema_url}}/palettes/library.json`. Do not compute or adjust ramps yourself.

3. **Diagnose each existing value against its hue's ramp.** Use the contrast against white from the palette tool's stops, and the contrast tool for the existing values. Flag:
   - **Misaligned index:** the value sits one stop or more away from the stop its name implies. For example, a `-500` that matches the ramp's `400`.
   - **Saturation jump:** its chroma is far from its neighbors on the ramp, so the strip will show a visible jump.
   - **Duplicate step:** two existing values land on the same stop.
   - **Contrast failure:** a value fails a pairing its current job needs.

4. **Build `sistema-review/color.map-existing.html`.** Start with the workflow outline strip. For each hue, show:
   - The existing values as a continuous strip, with each flag labeled.
   - One strip per option, with existing values marked and changed values called out:
     - **Keep exactly.** Only the existing values. Roles they can't fill, and pairings that fail, are listed for the person to decide one by one.
     - **Keep and complete.** Existing values pinned at the stops they match. The tool's stops fill the rest, and the jumps from step 3 stay visible.
     - **Regenerate.** The tool's ramp, with each old name mapped to its nearest stop.
   - The same small sample under each option: a primary button, an alert, and body text on the main surface.

   End the page with the line naming the `continue` URL from `sistema.json`.

5. **Ask the person to choose, per hue.** Explain the flags in plain words and what each option changes. "Keep and complete" is the usual suggestion when a project has established tokens, but the choice is theirs, and they can mix options across hues. Do not continue until each hue has a choice. Record the choices in DECISIONS.md.

6. **Map values to roles.** Assign values to the roles in `color.roles.required` where they fit the job, following the chosen option for each hue. A brand blue used on buttons becomes `primary`, for example. Keep chosen existing values exactly. Do not rename or move an existing value to a different stop unless the person chose an option that does.

7. **Verify with the contrast tool.** Send every on-* pairing and `border-focus`, in every theme, in one batch request, against the standard in `sistema.json`. When a pairing fails, propose the nearest passing stop from the same ramp, and ask before changing any existing value.

8. **Write `tokens/src/color.json`**, and `tokens/src/color.dark.json` if the theme includes dark, as DTCG JSON. Each `$description` notes where the value came from: an existing location, or a palette ramp and stop.

9. **Leave the old sources alone.** Do not edit the Tailwind config, existing CSS, or components in this play. The token pipeline play replaces them with compiled output. In DECISIONS.md, list the old sources the pipeline should replace, and any old names that now map to a different stop.

10. Show the mapping table and the contrast table.
