---
id: components.implement
title: Implement a component
description: Build one component from its specification against the system's tokens, verify its states, keyboard behavior, and accessibility in every theme, and add it to the showcase.
topic: components
kind: create
milestone: patterns
entry: true
requires: [style-dictionary.config.mjs, "project:stack", "project:a11y-standard"]
produces: []
tools: [contrast]
knowledge:
  - guide.components.architecture#tokens-in-components
  - guide.components.architecture#accessibility-by-component-family
  - guide.accessibility.floor#3-focus-visibility
  - guide.accessibility.floor#4-touch-and-pointer-targets
  - guide.accessibility.floor#6-motion
rules: [tokens.usage.no-raw-values, accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, accessibility.reduced-motion, accessibility.focus-not-lost, components.busy.keep-focus, components.toast.scope, components.css.one-utility-per-property]
evidence: The component file, its entry in the showcase, the result of an automated accessibility scan with zero violations in every theme, a keyboard walkthrough of each state, and contrast results for any new color pairing.
overrides: [component]
last_reviewed: 2026-11-15
---
1. **Read the spec** at `docs/components/<name>.md`. If there isn't one, run `components.specify` first, or ask the person to describe the component and write a short spec with them.

2. **Follow the project's conventions:** the component library recorded in `sistema.json` `project.component_library`, the folder and export pattern of the existing components, and their prop names. Build on the library's primitive when it has one for this pattern, rather than writing the behavior by hand.

3. **Implement it** with role tokens only, every state in the spec, and the keyboard behavior the spec gives. Use native elements wherever they fit.

4. **Add it to the showcase** (the review route `components.scaffold-core` created), in every variant and state, in every theme.

5. **Verify:**
   - Check any color pairing the component introduces with the contrast tool, batched (one POST takes up to 200 pairs).
   - Run an automated accessibility scan (for example axe) on the showcase in every theme. If you use Playwright, run it with a fixed, small number of workers (for example `--workers=2`), so a slow machine doesn't look like flaky tests.
   - Walk through it with the keyboard: Tab in, operate it, dismiss it, Tab out. Confirm the focus ring actually renders in a screenshot.
   - Run the build. If the person may have a dev server running, build into a separate folder or a copy of the project, or stop the server first and say so: in Next.js, a build and a running dev server share `.next`, and the build breaks the server.

6. If the component adds a family DESIGN.md doesn't list, add it to the Components section. Then show the evidence.
