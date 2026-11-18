---
id: spacing.tokens
title: Generate spacing tokens
description: Define the spacing scale on a consistent base unit, calibrated to density, with named layout aliases for the decisions every page repeats.
topic: spacing
kind: create
milestone: foundations
entry: true
requires: ["design-md#overview", "project:density"]
produces: [tokens/src/spacing.json]
tools: []
knowledge:
  - guide.spacing.layout#base-unit-4px-vs-8px
  - guide.spacing.layout#the-scale-as-a-unified-system
  - guide.spacing.layout#density-axis
  - guide.spacing.layout#starting-step-sets-by-density
  - guide.spacing.layout#naming-the-steps
  - guide.spacing.layout#the-never-arbitrary-rule
  - guide.typography.architecture#how-typography-interacts-with-the-spacing-system
rules: [spacing.scale.base-unit, spacing.never-arbitrary, tokens.source.dtcg]
evidence: The base unit, every step with its value, the layout aliases with what each is for and why it maps to its step, and tokens/src/spacing.json.
overrides: []
last_reviewed: 2026-11-15
---
1. **Read the project:** density in `sistema.json`, the DESIGN.md Layout section if it exists, the type scale in `tokens/src/typography.json` if it exists (spacing should fit the body line height), and the spacing shown in `sistema-review/style-preview.html`.

2. **Choose the base unit** from the spacing guide: 4px or 8px. Then choose the steps for the product's density, starting from the guide's step sets by density. Record the choice and the reason.

3. **Name each step** as the spacing guide describes in "Naming the steps."

4. **Define the layout aliases** that pages repeat, as references to steps: at least `page-gutter`, `section-gap`, and `component-gap`, plus any the direction calls for. Each alias says what it is for.

5. **Write `tokens/src/spacing.json`** as DTCG JSON:

   ```json
   {
     "space": {
       "1": { "$type": "dimension", "$value": "4px" },
       "4": { "$type": "dimension", "$value": "16px" }
     },
     "layout": {
       "page-gutter": { "$type": "dimension", "$value": "{space.6}", "$description": "Horizontal padding on page containers" }
     }
   }
   ```

6. If DESIGN.md has a Layout section, update it to match. Then show the evidence.
