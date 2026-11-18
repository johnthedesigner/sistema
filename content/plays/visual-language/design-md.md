---
id: visual-language.design-md
title: Write DESIGN.md
description: Complete DESIGN.md from the approved direction, so every agent in the repo reads the same visual language, with values left to the generated front matter.
topic: visual-language
kind: create
milestone: direction
entry: false
requires: ["design-md#overview", "gate:direction-approved"]
produces: ["design-md#colors", "design-md#typography", "design-md#layout", "design-md#elevation-depth", "design-md#shapes", "design-md#components", "design-md#dos-donts"]
tools: []
knowledge:
  - guide.tokens.architecture#naming-principles
  - guide.tokens.architecture#the-tier-model
  - guide.visual-language.overview#3-translating-positioning-to-visual-direction
  - guide.quality.visual-quality-signals#3-absolute-bans-for-design-system-token-decisions
rules: [visual-language.design-md.roles-not-values, tokens.naming.role]
evidence: DESIGN.md with all eight sections in the specification's order, each filled from the approved direction, naming roles rather than values, with any open decision marked as provisional and the play that will settle it.
overrides: []
last_reviewed: 2026-11-15
---
DESIGN.md is the reference every agent in the repo reads before touching the interface. This play writes its body. The token values arrive later, in front matter generated from `tokens/src/` by the token pipeline, so the body names roles and explains how to use them. It does not repeat hex codes or pixel values.

1. **Read the approved direction:** the DESIGN.md Overview and its "Direction values", `sistema-review/style-preview.html`, the positioning statement in DECISIONS.md, and `sistema.json` for theme and density.

2. **Read the specification** for the section order and what each section covers: `{{sistema_url}}/raw/files/design-md#sections`.

3. **Write each section after Overview,** in the specification's order. Keep Overview as it is.
   - **Colors:** the color roles the system will have (from rule `color.roles.required`, plus any the preview introduced), what each is for, and which pairs go together. Say how color is used: where it appears, where it doesn't, and what it never signals on its own.
   - **Typography:** the type roles by name (for example `display`, `heading-lg`, `body`, `label`, `caption`, `code`), what each is for, the typeface choices, and how hierarchy is built: by weight, size, or both.
   - **Layout:** the base spacing unit, the density, how spacing scales from inside components to between page sections, and the main grid or container rules.
   - **Elevation & Depth:** which layers float (menus, dialogs, toasts), and whether depth is shown with shadows, surface tone, or both, in each theme.
   - **Shapes:** the radius personality and which component families use which level.
   - **Components:** the component families this product will need first, from its positioning and density, with one line on how each uses the roles above. This is a plan, not a spec.
   - **Do's and Don'ts:** six to ten specific rules drawn from the direction's exclusions and the quality bans. Each one should be checkable by reading code.

4. **Name roles, not values.** Later plays read these role names and must use them. Where the direction left a decision open, write it as `Provisional: <what is undecided>. Set by <play id>.`

5. **Add the pointer line** at the top, if it is not there yet: `<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->`

6. Show the evidence: list each section with its first line, and every provisional item.
