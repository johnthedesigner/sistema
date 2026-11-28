---
id: components.build-page
title: Build a page
description: Build one of the product's pages or screens from the system's components and tokens, adding any component it needs the system's way first.
topic: components
kind: create
milestone: maintain
entry: true
requires: ["project:component-library", tokens/src/color.json]
produces: []
tools: []
knowledge:
  - guide.spacing.layout#the-scale-as-a-unified-system
  - guide.components.architecture#tokens-in-components
  - guide.quality.visual-quality-signals#reflexes
rules: [tokens.usage.no-raw-values, spacing.never-arbitrary, content.voice.baseline, quality.consistency.system-first]
evidence: The page in the app, screenshots at desktop, 768px, and phone width in every theme, the components it uses, any component added for it, and a passing build.
overrides: [page]
last_reviewed: 2026-11-28
---
1. **Agree on the page:** the one in `page`, or ask. Confirm what it's for, who uses it, and the main things on it. If DESIGN.md's "What stands out" list applies (a featured item, a brand block), say where it goes.

2. **List the components it needs,** from the system's component folder. For each one the system doesn't have, stop and add it first through the add-component route (`components.specify`, then `components.implement`), so it joins the system rather than living in this page.

3. **Build the page** in the app's own routes, from those components and the role tokens. No one-off styles: spacing from the scale, colors and type from roles (`tokens.usage.no-raw-values`). Use real content in the product's voice, from VOICE_AND_TONE.md if it exists. No placeholder text.

4. **Check it at full desktop width, at 768px, and at phone width (390px),** in every theme. Take screenshots and look at them: hierarchy, density, alignment, and how navigation works at each width. Run the build without disturbing a running dev server.

5. Show the evidence, list any component you added, and add a line to DECISIONS.md if the page settled something new, such as a layout other pages will repeat.
