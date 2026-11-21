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
  - guide.components.architecture#choosing-a-foundation
  - guide.components.architecture#states-and-variants
  - guide.components.architecture#accessibility-by-component-family
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
Builds the first components on the compiled tokens. It doesn't change token values: if a component needs a value the system lacks, stop and say which play adds it. If the person asks to change a foundation value during review ("rounder", "fewer borders"), run `{{sistema_url}}/raw/plays/project.revise`, then return here.

1. **Read the system:** DESIGN.md (Components, Do's and Don'ts), `tokens/src/`, the compiled CSS, `sistema.json`, and DECISIONS.md. Note the density and the first screens.

2. **Choose the component foundation with the person.** If `project.component_library` is set, confirm it. Otherwise recommend one and say why:
   - shadcn/ui, for React with Tailwind (copied into the repo; Radix or Base UI underneath);
   - Base UI, Radix, or React Aria, for unstyled primitives;
   - native elements, for a small set.

   Record it as `project.component_library`.

   **With shadcn/ui,** point its variables at the roles in one file (for example `src/styles/shadcn-theme.css`), imported after the compiled tokens:

   | shadcn variable | Role |
   |---|---|
   | `--background`, `--foreground` | `surface`, `on-surface` |
   | `--card`, `--card-foreground` | `surface-raised`, `on-surface` |
   | `--popover`, `--popover-foreground` | `surface-overlay`, `on-surface` |
   | `--primary`, `--primary-foreground` | `primary`, `on-primary` |
   | `--secondary`, `--secondary-foreground` | `secondary`, `on-secondary` |
   | `--muted`, `--muted-foreground` | `surface-hover`, `on-surface-muted` |
   | `--accent`, `--accent-foreground` | `surface-hover` or `surface-selected`, `on-surface` |
   | `--destructive` | `error` |
   | `--border`, `--input`, `--ring` | `border`, `border` or `border-strong`, `border-focus` |

   Set each radius level the components use to the system's radius tokens. Extend the token check page's generator (from `tokens.pipeline`) to show these variables. Record the mapping in DECISIONS.md; if a role has no match, say so.

   **After `shadcn init`, check what it changed:**
   - It may add its own font. Restore the approved typefaces.
   - It writes default colors and `@theme` names that can collide with roles. Replace them with the mapping above; keep one definition per name.
   - Its `dark:` variant follows a `.dark` class. Point it at the project's theme switch.
   - Its `cn` helper (tailwind-merge) treats custom text utilities such as `text-body` as colors. Register the type roles as font sizes, and check `cn("text-body text-on-surface")` keeps both. Components must import `cn` from `@/lib/utils`.
   - Adding components later stops at an overwrite prompt. Run the CLI non-interactively (see `npx shadcn add --help`), and reapply recorded changes after an overwrite.

   Record the primitives (Base UI or Radix) and the style preset in DECISIONS.md.

   **Where a component disagrees with DESIGN.md, change the component.** Common cases: a button radius different from the control radius, and hover colors made with opacity (`bg-primary/80`). Note each change in DECISIONS.md so it can be reapplied.

3. **Choose the core set** with the person, usually 8 to 12: for example button, text field, select, checkbox, switch, badge, inline message, panel, menu, dialog, tooltip, and a table for data-heavy products. Include the panel variants DESIGN.md's "What stands out" list needs, such as a featured panel or brand block.

4. **Set up the structure:** one folder (for example `src/components/ui/`), one file per component or small family, an `index.ts` exporting them, and one shared focus ring style.

5. **Build each component** with role tokens only, every state, and the keyboard behavior its pattern expects. Follow `docs/components/` specs where they exist. Follow DESIGN.md and the craft baseline, unless DECISIONS.md overrides an item; component presets often break it:
   - Borders only where DESIGN.md gives them a job, such as fields and secondary buttons. No inner dividers in containers by default.
   - States, messages, and selection as DESIGN.md describes them (Sistema's defaults are a gray selection with an accent detail, and messages with color in the icon and title).
   - Build and review each component in light and dark side by side. If a treatment works in only one, change the treatment.
   - Medium weight for labels, tabular figures for numbers, one icon set, nested radius.
   - Short motion on floating layers only; none on menus opened often from the keyboard.
   - Featured, brand, and inverse surfaces only where the "What stands out" list puts them.

6. **Build the showcase:** a route (for example `/sistema-review/components`) with every component in each variant and state, a theme switch, and the workflow outline strip at the top.

7. **Verify:**
   - Check every pair from the color guide's "Pairs to check" that the components use with the contrast tool, batched, in every theme, with `purpose` set. Most failures are in states: text and edges on hover and selected fills, destructive menu items, the focus ring.
   - Check hover, selected, and highlighted fills are visible on every surface they appear on, including menus (`color.states.visible`).
   - Run an accessibility scan (for example axe) in every theme, with each overlay open, after animations finish or with reduced motion on. A library behavior that is correct on purpose can be a documented exception in DECISIONS.md. With Playwright, use a small fixed number of workers.
   - Screenshot the focus rings.
   - Run the build without disturbing a running dev server: build into a separate folder, or stop the server first.

   Fix everything before review.

8. **Update DESIGN.md** Components with each component and when to use it. Show the evidence, and ask the person to open the showcase.
