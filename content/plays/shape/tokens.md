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
  - guide.depth.architecture#shadow-color
  - guide.depth.architecture#the-hybrid-approach
  - guide.depth.architecture#emphasis-and-separation
  - guide.visual-language.overview#ways-to-separate-and-lift
  - guide.quality.visual-quality-signals#3-absolute-bans-for-design-system-token-decisions
rules: [shape.radius.hierarchy, quality.shape.bans, tokens.source.dtcg, tokens.naming.role, quality.craft.elevation-by-role, quality.craft.nested-radius, quality.craft.borders-have-a-job]
evidence: The radius scale with the component families mapped to each level, the shadows by role with how each theme shows them, where borders are used and the job each does, any change from the approved preview, and tokens/src/shape.json.
overrides: [shape_direction]
last_reviewed: 2026-11-20
---
1. **Read the direction:** the control radius, chip shape, and how surfaces separate in the DESIGN.md Overview "Direction values", the emphasis map, the shape and surface specimens in `sistema-review/style-preview.html`, the DESIGN.md Shapes and Elevation & Depth sections if they exist, and the theme in `sistema.json`. If this play runs on its own, use `shape_direction` when given.

2. **Choose the radius approach** from the shape guide: a named scale, numeric steps, or a global factor. Start from the direction's control radius and scale from it: chips and small parts smaller, panels larger, the featured surface and floating layers largest, as the approved composition showed. Then map each component family to a level. Use the full radius only where the direction calls for it (for example pill chips).

3. **Define the shadows by role,** as the depth guide describes in "Emphasis and separation": `shadow.overlay` for menus, popovers, dialogs, and toasts; `shadow.featured` for the featured surface; `shadow.raised` only if the direction separates panels by shadow; and `shadow.control` if controls should feel touchable. Build them layered, from one light source, and tinted. In dark themes, shadows need more opacity and raised surfaces also step lighter. Then list where borders are used (fields, selects, checkboxes, secondary buttons, rows if needed) and the job each does; panels, chips, tooltips, and menus don't get one unless the direction separates panels by line.

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
       "overlay": { "$type": "shadow", "$value": [
         { "offsetX": "0px", "offsetY": "4px", "blur": "8px", "spread": "-2px", "color": "#..." },
         { "offsetX": "0px", "offsetY": "16px", "blur": "32px", "spread": "-8px", "color": "#..." }
       ], "$description": "Menus, popovers, dialogs, toasts" }
     }
   }
   ```

   Take shadow colors as the depth guide describes in "Shadow color." If dark values differ, put only the changed tokens in `tokens/src/shape.dark.json`.

5. **Check quality** against the shape bans and the craft rules below (shadows by role, nested radius, borders with a job). Start from the preview's values. If a value must change, list it as a change from the approved preview.

6. If DESIGN.md has Shapes or Elevation & Depth sections, update them to match. Then show the evidence.
