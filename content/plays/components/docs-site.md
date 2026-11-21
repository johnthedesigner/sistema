---
id: components.docs-site
title: Publish the system reference
description: Give the team a reference they maintain, in Storybook or as a page in the app, with the tokens, the components with usage notes, the page examples, and the direction.
topic: components
kind: create
milestone: patterns
entry: true
requires: ["project:component-library"]
produces: []
tools: []
knowledge:
  - guide.tokens.architecture#the-tier-model
rules: [tokens.usage.no-raw-values, quality.craft.both-themes]
evidence: The reference (Storybook, or the in-app route) with its four sections, rendering from the compiled tokens and the real components in every theme, an accessibility check of each component, and a passing build of the reference.
overrides: [reference_kind]
last_reviewed: 2026-11-20
---
The reference is where the team looks up a token or a component and how to use it. Both ways below build from the same compiled tokens and real components as the product, so neither drifts. Which one fits is the person's choice: recommend one for this project, say why, and let them choose. Use `reference_kind` if given.

| | Storybook | A page in the app |
|---|---|---|
| What it is | A separate workshop for components, built and published on its own | A route in the product (for example `/design-system`), or the component showcase extended |
| Gives | A format engineers recognize; controls to try each prop; docs pages per component; an accessibility panel; interaction and visual regression testing; a static site to share | No second toolchain; components shown inside the real app shell |
| Costs | A second build setup that has to match the app's (styles, fonts, the theme switch), and upgrades to keep working | Every tool beyond viewing has to be built by hand |
| Suits | Teams, systems shared across products or published, anyone who wants the testing tools | Small projects, one product, people who want the least to maintain |

If the workflow's offer of this play already asked which one, use that answer.

1. **Whichever you choose, the reference has four parts:**
   - **Tokens:** every color role as a swatch with its value read at runtime from the compiled CSS variables, ramps as continuous strips, every type role as a specimen, and every radius, shadow, and spacing step.
   - **Components:** each one in its variants and states, with one or two lines on when to use it and when not to, from DESIGN.md and the specs in `docs/components/`.
   - **Pages:** the page examples, embedded or linked.
   - **Direction:** the DESIGN.md Overview, condensed.

   Never copy token values into the reference; read them from the CSS. The raw ramps are the exception: the token pipeline keeps them out of the CSS on purpose, so read them from `tokens/src/palette.json`. Import the real components.

2. **Storybook:**
   - Install it with its own CLI for the project's framework, using the current version and its docs (for Next.js, the Next.js framework package). Don't pin a version from memory. The CLI adds more than this play needs (example stories, extra addons, sometimes a rewritten config file, and a closing suggestion to run another setup command): keep what serves the four parts, the accessibility checks, and the story tests, remove the rest, and list what you removed or changed.
   - In the preview configuration, import the same global styles and compiled token CSS the app imports, load the same fonts, and add a toolbar control for every theme and mode that sets the attribute the app's theme switch sets. Check that a story looks exactly like the component in the app, in every theme. Two known differences: Storybook's preview sets its own body font, and its docs pages show stories on a white block. Give the story wrapper the app's page background and body styles. Storybook's docs pages themselves keep their own light theme when the toolbar is set to dark; only the story blocks follow it. Say so on the token docs page, or theme the docs pages to match.
   - Write a story file per component with a story for each variant and state, and set the component docs to generate from them. Put the when-to-use lines in each component's docs page.
   - Write the token, page, and direction sections as docs pages. Page examples can be stories that render the page components, if they don't depend on the app's routing; otherwise link to them.
   - Add the accessibility addon, and check every story in every theme.
   - Build the static Storybook into its own output folder, and add scripts for running and building it.

3. **A page in the app:** build the route with the four parts, and a theme switch. Extend the component showcase if one exists, rather than building a second page of the same components.

4. **Build without disturbing a running dev server.** A framework build and its dev server can share an output folder (in Next.js, `.next`), and a build then breaks the running server. Build into a separate folder or a copy of the project, or stop the dev server first and say so.

5. Show the evidence, and say how to open the reference (the command, or the URL).
