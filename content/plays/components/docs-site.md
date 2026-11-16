---
id: components.docs-site
title: Publish the system reference
description: Turn the component showcase into a reference the team maintains, with the token reference, the components with usage notes, and links to the page examples.
topic: components
kind: create
milestone: patterns
entry: true
requires: ["project:component-library"]
produces: []
tools: []
knowledge:
  - guide.tokens.architecture#the-tier-model
rules: [tokens.usage.no-raw-values]
evidence: The reference route with its four sections, rendering from the compiled tokens and real components, and a passing build.
overrides: []
last_reviewed: 2026-11-15
---
The reference lives in the app, built from the same tokens and components the product uses, so it can't drift. It is not Storybook. Recommend that approach, and confirm it with the person.

1. **Build a reference route** (for example `/design-system`), or extend the showcase, with:
   - **Tokens:** every color role as a swatch with its value read from the compiled CSS, ramps as continuous strips, every type role as a specimen, and every radius, shadow, and spacing step.
   - **Components:** each one in its variants and states, with one or two lines on when to use it and when not to, from DESIGN.md and the specs in `docs/components/`.
   - **Pages:** links to the page examples.
   - **Direction:** the DESIGN.md Overview, condensed.

2. **Keep it maintainable:** read token values at runtime from the CSS variables rather than copying them, and import the real components.

3. Run the build, then show the evidence.
