---
id: project.audit
title: Audit the existing system
description: Take stock of an existing UI or design system in whatever form it takes, measure what's consistent, what fails, and what's missing, and report it with a recommendation, before anything changes.
topic: project
kind: check
milestone: direction
entry: true
requires: ["project:a11y-standard", "project:stack"]
produces: [sistema-review/project.audit.html]
tools: [contrast, validate]
knowledge:
  - guide.tokens.architecture#what-every-system-needs
  - guide.tokens.architecture#naming-principles
  - guide.color.architecture#what-every-color-system-requires
  - guide.color.architecture#pairs-to-check
  - guide.accessibility.floor#1-color-contrast
rules: [color.roles.required, color.contrast.text, color.contrast.ui, tokens.usage.no-raw-values, tokens.naming.role, quality.review.outline]
evidence: The report in docs/audits/ and the review page, with every distinct value counted and located, every contrast ratio from the tool, the token validator's results if the project has DTCG files, and the person's choice recorded in DECISIONS.md.
overrides: [scope]
last_reviewed: 2026-11-28
---
This play reads and measures. It changes nothing in the project's code. The person decides what happens next, from what it finds.

1. **Find the system,** starting from `project.assess`'s findings: token sources in any form (DTCG files, a Tailwind theme or `@theme` block, CSS custom properties, SCSS or JS constants), theme or mode files, the component folder, and the main pages. If `scope` names part of the product, audit only that part.

2. **Take stock of every value in use:** colors, typefaces, font sizes and weights, line heights, spacing, radii, and shadows. For each, note how many places use it and where. Group near-duplicates: colors a small step apart, sizes a pixel or two apart, spacing that's almost a step of the scale. Count values written straight into components (`tokens.usage.no-raw-values`) against values that come from a token or theme.

3. **Compare it with what a system needs** (the token and color guides): which roles in `color.roles.required` exist under any name, and which are missing; whether type has named roles or only sizes; whether spacing follows a base unit; whether hover, focus, and selected states are defined; whether there's a dark theme, and whether it's complete. Note names that describe a value rather than a job (`tokens.naming.role`).

4. **Check what can be measured:**
   - **Contrast:** the pairs the UI actually uses (the color guide's "Pairs to check"), in every theme, batched to the contrast tool, against the standard in `sistema.json`.
   - **Token files:** if the project has DTCG JSON, send it to the token validator and include its results. Its role and contrast checks assume Sistema's naming, so say which of its findings come from that.
   - **The screens:** if the app runs, take screenshots of the main pages in each theme, and note what looks consistent and what doesn't (the same job done two ways, spacing that drifts, one-off colors).

5. **Write the report** to `docs/audits/project.audit-<YYYY-MM-DD>.md`, in this order:
   - **What exists:** the sources, the counts, and the stack.
   - **What's consistent and worth keeping:** values and patterns used the same way throughout. These are what a new system should start from.
   - **What's inconsistent:** near-duplicates, the same job done different ways, raw values.
   - **What fails:** contrast failures and other blocking problems, with the ratio and where.
   - **What's missing:** roles, states, a theme, a scale.
   - **Recommendation:** either bring the system into Sistema, keeping what's consistent (the start workflow's existing-colors path keeps chosen values exactly), or fix specific findings in place (each with the Sistema route that does it), with what each would take. Recommend one, and say why.

6. **Build `sistema-review/project.audit.html`.** Start with the outline strip if a workflow is running. Show the inventory as the person would see it: colors as swatches grouped by hue with their counts, near-duplicates side by side, the type sizes in use set in the product's typeface, the spacing and radius values as bars and shapes, and each failing contrast pair as text on its background with its ratio. Then the report's summary and recommendation.

7. **Ask the person to choose:** bring the system into Sistema, fix specific findings, or stop here. Record the choice and the reason in DECISIONS.md. Don't change any code in this play.
