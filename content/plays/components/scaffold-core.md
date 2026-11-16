---
id: components.scaffold-core
title: Scaffold the core components
description: Choose a component foundation, build the core set the product needs first on the compiled tokens, and publish a showcase route that shows every component in every state and theme for review.
topic: components
kind: create
milestone: patterns
entry: true
requires: [style-dictionary.config.mjs, "gate:foundations-approved", "project:stack", "project:a11y-standard"]
produces: ["project:component-library"]
tools: [contrast]
knowledge:
  - guide.accessibility.floor#2-keyboard-navigation
  - guide.accessibility.floor#3-focus-visibility
  - guide.accessibility.floor#5-semantic-structure-and-aria
  - guide.tokens.architecture#tier-3-component-tokens-scoped-overrides
rules: [tokens.usage.no-raw-values, accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, accessibility.reduced-motion, accessibility.focus-not-lost, quality.review.outline]
evidence: The component foundation and why, the list of components built, the showcase route, an automated accessibility scan with zero violations in every theme, and a passing build.
overrides: []
last_reviewed: 2026-11-15
---
The tokens are compiled and wired into the app (`tokens.pipeline`). This play builds the first components on them. It does not change token values. If a component needs a value the system doesn't have, stop and say which play adds it.

1. **Read the system:** DESIGN.md (Components, and Do's and Don'ts), `tokens/src/`, the compiled token CSS, `sistema.json`, and DECISIONS.md. Note the product's density and its first screens, from the positioning statement.

2. **Choose the component foundation with the person.** Recommend one for the stack and explain why:
   - shadcn/ui for React with Tailwind (copied into the repo; Radix or Base UI primitives underneath)
   - Base UI, Radix, or React Aria directly for unstyled primitives
   - native elements only, for a small set

   Record the choice as `project.component_library` in `sistema.json`.

3. **Choose the core set.** Propose the components the product's first screens need, usually 8 to 12. A typical set is button, text field, select, checkbox, switch, tag or badge, inline message, panel or card, menu, dialog, tooltip, and a table for data-heavy products. Agree on the list with the person.

4. **Set up the structure:** one folder (for example `src/components/ui/`) with one file per component or per small family, and an `index.ts` that exports every public component. Put the shared focus ring style in one place, so every component uses the same one.

5. **Build each component** on the chosen foundation, with role tokens only, every interactive state, and the keyboard behavior its pattern expects. Follow the spec in `docs/components/` where one exists.

6. **Build the showcase:** a route in the app (for example `/sistema-review/components`) that shows every component in each variant and state, with a theme switch. Put the workflow outline strip at the top.

7. **Verify:**
   - Check every new color pairing with the contrast tool, in one batch request.
   - Run an automated accessibility scan (for example axe) on the showcase in every theme.
   - Check by keyboard that focus rings render, in a screenshot.
   - Run the build.

   Fix everything before asking for review.

8. **Update DESIGN.md** Components with the components built and one line each on when to use it. Then show the evidence, and ask the person to open the showcase in the running app.
