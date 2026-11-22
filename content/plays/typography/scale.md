---
id: typography.scale
title: Generate the type scale
description: Define named type roles with size, weight, line height, and tracking, calibrated to the product's density and the approved direction, and load the typefaces.
topic: typography
kind: create
milestone: foundations
entry: true
requires: ["design-md#overview", "gate:direction-approved", "project:density"]
produces: [tokens/src/typography.json]
tools: [type_scale]
knowledge:
  - guide.typography.architecture#the-density-axis-comes-first
  - guide.typography.architecture#scale-construction-modular-vs-hand-tuned
  - guide.typography.architecture#naming-type
  - guide.typography.architecture#choosing-an-approach
  - guide.typography.architecture#two-tiers-whatever-the-names
  - guide.typography.architecture#legibility
  - guide.quality.visual-quality-signals#reflexes
rules: [typography.line-height.by-role, typography.line-height.body, typography.roles.distinct, typography.fonts.self-hosted, tokens.source.dtcg, tokens.naming.role]
evidence: A table of every type role (size, weight, line height, letter spacing, and purpose), any change from the approved preview, how the typefaces are loaded, and tokens/src/typography.json.
overrides: [typography_direction]
last_reviewed: 2026-11-15
---
1. **Read the direction:** the typographic character and typefaces in the DESIGN.md Overview "Direction values", the type specimens in `sistema-review/visual-direction.html`, the role names in the DESIGN.md Typography section if it exists, and the density in `sistema.json`. If this play runs on its own, use `typography_direction` when given. If no typeface was chosen, ask.

2. **Choose the scale approach** from the guide: modular, hand-tuned, or the middle path. Record the choice and the reason.

3. **Choose how type is named,** using the guide's section "Naming type." If DESIGN.md already names the roles, keep those names. Otherwise, if `project.component_library` is set, follow that library's convention. Otherwise propose one approach for the product's expected complexity, say why, and let the person choose. Record the choice in DECISIONS.md.

4. **Get the sizes from the type scale tool.** Call it with the base size, ratio, and naming convention you chose, the roles placed on their steps, and the standard in `sistema.json`. Do not calculate sizes yourself. For a hand-tuned scale, call it with the closest ratio and record each size you change and why.

5. **Define the roles or steps.** For each, set size, weight, line height (unitless), and letter spacing. Start from the tool's sizes and line heights and the preview's specimens. If a value must change, list it as a change from the approved preview or the tool's suggestion. Any check the tool reports as failed must pass before you continue.

6. **Write `tokens/src/typography.json`** as DTCG JSON:

   ```json
   {
     "font": {
       "sans": { "$type": "fontFamily", "$value": ["Inter", "system-ui", "sans-serif"] },
       "mono": { "$type": "fontFamily", "$value": ["IBM Plex Mono", "ui-monospace", "monospace"] }
     },
     "type": {
       "body": {
         "$description": "Default text: descriptions, table cells, form values",
         "family":         { "$type": "fontFamily", "$value": "{font.sans}" },
         "size":           { "$type": "dimension",  "$value": "14px" },
         "weight":         { "$type": "fontWeight", "$value": 400 },
         "line-height":    { "$type": "number",     "$value": 1.5 },
         "letter-spacing": { "$type": "dimension",  "$value": "0em" }
       }
     }
   }
   ```

   Every role has a `$description` naming its purpose.

7. **Load the typefaces in the app.** Prefer files served by the project: for Next.js, `next/font/local`, or `next/font/google`, which downloads at build time. Include only the weights the roles use. If the font can't be self-hosted, say why. Make sure the `font` tokens' first family matches the loaded font's name.

8. **Check quality.** Roles must differ by weight, size, or tracking, not size alone. Check line heights against the rule below. Fix what fails.

9. If DESIGN.md has a Typography section, update its role list to match. Then show the evidence table.
