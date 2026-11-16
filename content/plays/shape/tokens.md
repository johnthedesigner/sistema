---
id: shape.tokens
title: Generate shape and elevation tokens
description: Define the radius scale and elevation levels as a personality decision, with a mapping to component families, in every theme.
topic: shape
kind: create
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:theme"]
produces: [tokens/src/shape.json]
tools: []
knowledge:
  - guide.shape.architecture#border-radius-as-a-personality-signal
  - guide.shape.architecture#scale-approaches
  - guide.shape.architecture#component-consistency
  - guide.shape.architecture#the-pill-full-radius-using-sparingly-vs-as-a-default
  - guide.depth.architecture#when-to-use-each-model
  - guide.depth.architecture#the-hybrid-approach
  - guide.quality.visual-quality-signals#3-absolute-bans-for-design-system-token-decisions
rules: [shape.radius.hierarchy, quality.shape.bans, tokens.source.dtcg, tokens.naming.role]
evidence: The radius scale with the component families mapped to each level, the elevation levels with how each theme shows them, any change from the approved preview, and tokens/src/shape.json.
overrides: [shape_direction]
last_reviewed: 2026-11-15
---
1. **Read the direction:** the radius personality in the DESIGN.md Overview "Direction values", the shape and surface specimens in `sistema-review/style-preview.html`, the DESIGN.md Shapes and Elevation & Depth sections if they exist, and the theme in `sistema.json`. If this play runs on its own, use `shape_direction` when given.

2. **Choose the radius approach** from the shape guide: a named scale, numeric steps, or a global factor. Then map each component family to a level. Radius must form a hierarchy: small controls, larger containers, the largest for floating layers. Use the full radius only where the direction calls for it.

3. **Choose the depth model** from the depth guide: shadows, surface tone, or both. In dark themes, shadows barely read, so floating layers usually need a lighter surface as well. Define two or three elevation levels, and name which layers use each.

4. **Write `tokens/src/shape.json`** as DTCG JSON:

   ```json
   {
     "radius": {
       "sm":   { "$type": "dimension", "$value": "4px",    "$description": "Inputs, checkboxes, tags" },
       "md":   { "$type": "dimension", "$value": "6px",    "$description": "Buttons, panels" },
       "lg":   { "$type": "dimension", "$value": "10px",   "$description": "Menus, dialogs, toasts" },
       "full": { "$type": "dimension", "$value": "9999px", "$description": "Pills and avatars only" }
     },
     "shadow": {
       "1": { "$type": "shadow", "$value": { "offsetX": "0px", "offsetY": "1px", "blur": "3px", "spread": "0px", "color": "#..." }, "$description": "Menus, popovers" }
     }
   }
   ```

   Shadow colors use the neutral ramp, tinted to the surface, not pure black. If dark values differ, put only the changed tokens in `tokens/src/shape.dark.json`.

5. **Check quality** against the shape bans. Start from the preview's values. If a value must change, list it as a change from the approved preview.

6. If DESIGN.md has Shapes or Elevation & Depth sections, update them to match. Then show the evidence.
