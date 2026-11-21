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
  - guide.visual-language.overview#the-craft-baseline
  - guide.color.architecture#pairs-to-check
rules: [color.states.visible, tokens.usage.no-raw-values, accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, accessibility.reduced-motion, accessibility.focus-not-lost, quality.review.outline, components.busy.keep-focus, components.toast.scope, components.css.one-utility-per-property, quality.craft.borders-have-a-job, quality.craft.nested-radius, quality.craft.quiet-states, quality.craft.status-as-detail, quality.craft.both-themes, quality.craft.type-weights, quality.craft.one-icon-set, quality.craft.motion, quality.craft.emphasis-scarce]
evidence: The component foundation and why, the list of components built, the showcase route, an automated accessibility scan with zero violations in every theme, and a passing build.
overrides: []
last_reviewed: 2026-11-20
---
The tokens are compiled and wired into the app (`tokens.pipeline`). This play builds the first components on them. It does not change token values. If a component needs a value the system doesn't have, stop and say which play adds it. If the person asks to change a foundation value during the review ("fewer borders", "rounder"), run `{{sistema_url}}/raw/plays/project.revise` for that change, then return to this review.

1. **Read the system:** DESIGN.md (Components, and Do's and Don'ts), `tokens/src/`, the compiled token CSS, `sistema.json`, and DECISIONS.md. Note the product's density and its first screens, from the positioning statement.

2. **Choose the component foundation with the person.** If `project.component_library` is already set, confirm it and move on. Otherwise recommend one for the stack and explain why:
   - shadcn/ui for React with Tailwind (copied into the repo; Radix or Base UI primitives underneath)
   - Base UI, Radix, or React Aria directly for unstyled primitives
   - native elements only, for a small set

   Record the choice as `project.component_library` in `sistema.json`.

   **If the foundation is shadcn/ui,** point its theme variables at the role tokens instead of keeping its default values, in one file (for example `src/styles/shadcn-theme.css`) imported after the compiled tokens, rather than changing colors in each component.

   | shadcn variable | Role token |
   |---|---|
   | `--background`, `--foreground` | `surface`, `on-surface` |
   | `--card`, `--card-foreground` | `surface-raised`, `on-surface` |
   | `--popover`, `--popover-foreground` | `surface-overlay`, `on-surface` |
   | `--primary`, `--primary-foreground` | `primary`, `on-primary` |
   | `--secondary`, `--secondary-foreground` | `secondary`, `on-secondary` |
   | `--muted`, `--muted-foreground` | a subdued surface (such as `surface-hover`), `on-surface-muted` |
   | `--accent`, `--accent-foreground` | the hover or selected surface, `on-surface` |
   | `--destructive` | `error` |
   | `--border`, `--input`, `--ring` | `border`, the input border (`border` or `border-strong`), `border-focus` |

   shadcn derives `--radius-sm` to `--radius-4xl` from one `--radius`. Set each level the components use to the system's radius tokens directly, so the hierarchy holds. Add shadcn's variables to the token check page by extending its generator (from `tokens.pipeline`) to read the mapping file, record the mapping in DECISIONS.md, and if a role has no match, say so rather than inventing a value.

   **After `shadcn init`, check what it changed.** The CLI does more than add components:
   - It may add its own font (for example Geist) as `--font-sans` in the root layout. Restore the project's approved typefaces.
   - It writes default `:root` and `.dark` color values and `@theme` names that can collide with role names (`--color-primary`, `--color-border`). Replace its values with the mapping above, and keep one definition per name.
   - Its `dark:` variant follows a `.dark` class. Point it at the project's theme switch (for example `[data-theme="dark"]` and the system setting).
   - Its `cn` helper uses tailwind-merge, which treats custom text utilities (`text-body`, `text-label`) as colors and drops them next to a text color. Register the project's type role names with tailwind-merge as font sizes, and check that `cn("text-body text-on-surface")` keeps both. Generated components must import `cn` from that helper (`@/lib/utils`), not from the package; check each component you add.
   - Adding components later stops at an overwrite prompt when a file exists. Run the CLI non-interactively (check `npx shadcn add --help` for the yes and overwrite flags of the installed version), and after an overwrite, reapply the changes recorded in DECISIONS.md.

   Record which primitives the style uses (Base UI or Radix) and which style preset, in DECISIONS.md.

   **Where shadcn's component styles disagree with DESIGN.md, change the component, not the system.** Components are copied into the project to be edited. Two common cases:
   - Radius: a style may give buttons a different radius level than DESIGN.md assigns to controls. Change the class to the level DESIGN.md names.
   - Transparency: styles often make hover and subtle colors by lowering opacity (`bg-primary/80`). Where DESIGN.md or the color bans rule out opacity-derived colors, use the role tokens for those states instead.

   Note each change in DECISIONS.md, so later updates of a component can reapply it.

3. **Choose the core set.** Propose the components the product's first screens need, usually 8 to 12. A typical set is button, text field, select, checkbox, switch, tag or badge, inline message, panel or card, menu, dialog, tooltip, and a table for data-heavy products. Include the panel variants DESIGN.md's "What stands out" list uses (a featured panel, a brand block), so pages don't have to compose them by hand. Agree on the list with the person.

4. **Set up the structure:** one folder (for example `src/components/ui/`) with one file per component or per small family, and an `index.ts` that exports every public component. Put the shared focus ring style in one place, so every component uses the same one.

5. **Build each component** on the chosen foundation, with role tokens only, every interactive state, and the keyboard behavior its pattern expects. Follow the spec in `docs/components/` where one exists. Apply the craft baseline as you go; foundation presets often break it:
   - Borders only where DESIGN.md's Elevation & Depth section gives them a job (fields, selects, checkboxes, secondary buttons). Panels, chips, tooltips, and menus separate by tone or shadow, and containers don't get inner dividers by default.
   - Quiet states: hover a small tone change, focus the shared ring, selected a neutral step stronger than hover with an accent detail (the checked box, an edge).
   - Status as detail: inline messages and banners sit on a neutral surface and carry their status in the icon and the title. Tinted status fills are for small marks such as chips.
   - Both themes: build and review each component in light and dark side by side. If a treatment works in only one theme, change the treatment, not just the dark value.
   - Medium weight for labels, tabular figures for numbers, one icon set, nested radius following the outer radius.
   - Short, eased-out motion on floating layers only, none on menus opened from the keyboard many times a day.
   - Featured, brand, and inverse surfaces only where the "What stands out" list puts them.

6. **Build the showcase:** a route in the app (for example `/sistema-review/components`) that shows every component in each variant and state, with a theme switch. Put the workflow outline strip at the top.

7. **Verify:**
   - Check every pair in the color guide's "Pairs to check" that the components use, with the contrast tool, batched (one POST takes up to 200 pairs), in every theme, with `purpose` set for each pair. States are where most failures are: text and control edges on hover, selected, and highlight fills, destructive menu items, and the focus ring on each.
   - Check that hover, selected, and highlight fills are visible on every surface they appear on (`color.states.visible`), including inside menus.
   - Run an automated accessibility scan (for example axe) on the showcase in every theme, with each overlay open. Scan after animations finish, or with reduced motion on, or fades report false contrast failures. If the scan flags a library behavior that is correct on purpose (for example a combobox hiding the rest of the page from screen readers while open), you may keep it as a documented exception: name the rule, the component, and why, in DECISIONS.md. If you use Playwright, run it with a fixed, small number of workers (for example `--workers=2`), so a slow machine doesn't look like flaky tests.
   - Check by keyboard that focus rings render, in a screenshot.
   - Run the build. If the person may have a dev server running, build into a separate folder or a copy of the project, or stop the server first and say so: in Next.js, a build and a running dev server share `.next`, and the build breaks the server.

   Fix everything before asking for review.

8. **Update DESIGN.md** Components with the components built and one line each on when to use it. Then show the evidence, and ask the person to open the showcase in the running app.
