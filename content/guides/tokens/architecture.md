---
title: "Tokens"
description: "How Sistema structures design tokens: two tiers by default, role names, DTCG source compiled to CSS, independent modes for theme, density, and motion, and mapping a component library onto the roles."
topic: tokens
sources:
  - { source: material, url: "https://m3.material.io/foundations/design-tokens" }
  - { source: atlassian, url: "https://atlassian.design/tokens/design-tokens" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/overview" }
  - { source: ant-design, url: "https://ant.design/docs/react/customize-theme" }
  - { source: atlassian, url: "https://atlassian.design/get-started" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/spacing" }
  - { source: tailwind, url: "https://tailwindcss.com/docs/theme" }
related:
  - guide.color.architecture
  - guide.typography.architecture
last_reviewed: 2026-11-20
---

# Tokens

## Where Sistema stands

Tokens keep design decisions in one place. Components read them by name, so changing the accent or adding a dark theme means editing tokens, not components.

- **Two tiers.** Primitives (the raw palette and scales) and roles (what each value is for). A third tier, component tokens, only when a component must vary independently of the roles.
- **Role names, never values** (`tokens.naming.role`). `on-surface-muted`, not `gray-600`.
- **DTCG source, compiled.** Token files in `tokens/src/` follow the Design Tokens Community Group format and compile to CSS custom properties (and Tailwind's theme, where the project uses it). Nobody edits the compiled files (`opinion.dtcg-compiled`).
- **Modes are independent kinds.** Theme, density, and motion each change their own tokens, and combine freely.

## The tier model

Most systems separate raw values from decisions. Atlassian, Material, and Spectrum all do, with different numbers of tiers and names.

### Tier 1: primitives

Raw values named for what they are: ramp stops (`palette.accent.550`), spacing steps, radii. Only roles use them.

### Tier 2: roles

Names for decisions: `surface`, `primary`, `border-focus`, `space.gap`, `radius.control`. Each points to a primitive. Components read only roles. Light and dark are two assignments of the same roles.

### Tier 3: component tokens (scoped overrides)

Per-component names (`button.background`) that point to roles and change only where a component must differ. Add them when several themes or brands need one component to differ, or when others will theme the library. Otherwise skip them. More than three tiers costs more than it gives.

## What every system needs

| Category | What it covers | The minimum |
|---|---|---|
| Color | Surfaces, text, borders, states, feedback | The roles in `color.roles.required`, in every theme |
| Typography | Families, sizes, weights, line heights | Type roles, not only sizes; line height as a token |
| Spacing | Padding, gaps, control heights | One base unit and a scale; nothing outside it (`spacing.never-arbitrary`) |
| Shape and depth | Radius, shadows | Radius by element size; shadows by role |

Motion and z-index are added when there are real decisions to record, not as empty placeholders.

## Naming principles

### Name for role, not value

`on-surface-muted` says what it's for and survives a rebrand. `gray-600` does neither. Don't mix the two in one tier.

### Use a consistent structure

One structure per tier. Roles: category, role, modifier (`color.on-surface-muted`). Component tokens add property and state (`button.background-hover`).

### Communicate the pairing

Name a surface and its text as a pair (`surface-brand`, `on-surface-brand`), as Material's `on-*` convention does.

### Avoid encoding values in names

`radius-4` names a value; `radius.control` names a role. Scales are the exception people expect: a size scale (`size.sm`, `size.lg`) is a primitive tier, and roles point into it.

How type roles are named is a taste choice, covered in the typography guide.

## Modes: theme, density, and motion

A mode swaps some token values without changing components. Three kinds are common:

| Kind | Typical modes | Changes | Examples |
|---|---|---|---|
| Theme | light, dark, sometimes high contrast | Color roles | Radix Themes' `appearance`, Atlassian's `colorMode`, Ant Design's dark algorithm |
| Density | comfortable, compact | Spacing inside components, control heights, sometimes type sizes | Radix Themes' `scaling`, Ant Design's compact algorithm |
| Motion | standard, reduced | Durations and easing | The operating system's reduced-motion setting |

### Keep the kinds independent

Each kind switches separately, and they combine: a page can be dark, compact, and reduced-motion at once. Ant Design lets its dark and compact algorithms apply together for the same reason. Two practices keep combinations safe:

- **Each token belongs to one kind.** Color changes only with theme, spacing only with density, durations only with motion, so no two modes compete for a value.
- **A mode only replaces tokens that already exist.** It never adds new ones. A component that breaks in a mode was using a raw value.

### How modes are stored and switched

Each mode is a file holding only what changes, beside the defaults: `color.dark.json`, `spacing.compact.json`, `motion.reduced.json`. Each compiles to a selector:

```css
[data-theme="dark"] { /* changed color roles */ }
[data-density="compact"] { /* changed spacing and control heights */ }
@media (prefers-reduced-motion: reduce) { :root { /* changed durations */ } }
```

Theme usually follows the operating system too, unless the person picked one. Reduced motion always follows it. Density is a product choice and can apply to part of a page, such as a compact table in a comfortable layout.

### Density: remap or scale

- **Remap chosen tokens.** Compact sets new values for specific spacing steps and control heights. Most control; dense tables usually need it.
- **Scale everything.** Compact changes one base value and everything derived from it shrinks. Radix Themes does this with `scaling`; in Tailwind, it means changing `--spacing`. Simpler, blunter.

Either way, compact controls still meet the project's minimum target size, and body text keeps its required line height.

## Dark mode at the token level

Dark mode is a context for the same roles, not a parallel set of names. Never create `surface-dark`: a component that has to know the theme has lost the contract. Which values the roles take in dark is a color decision (the color guide's "Stops in a dark theme").

How the switch happens in CSS:

| Approach | How | Suits |
|---|---|---|
| An attribute, plus the system setting | `[data-theme="dark"]` from a switch; `prefers-color-scheme` when the person hasn't chosen | Sistema's default: the person can choose, and the system setting still works |
| The system setting only | A `prefers-color-scheme` media query | Sites with no theme switch |
| Separate theme files | A stylesheet per theme, swapped at runtime | Very large token sets, or packages consumed by many teams |

## Component library mapping

A component library usually brings its own variable names. shadcn/ui, for example, styles every component from `--background`, `--primary`, `--muted`, `--accent`, `--ring`, and a few more. Point those at the roles in one file, imported after the compiled tokens, rather than editing colors inside components:

| Library variable | Role |
|---|---|
| `--background`, `--foreground` | `surface`, `on-surface` |
| `--card`, `--popover` | `surface-raised`, `surface-overlay` |
| `--primary`, `--primary-foreground` | `primary`, `on-primary` |
| `--muted`, `--accent` | `surface-hover` (or `surface-selected`), with `on-surface-muted` and `on-surface` |
| `--destructive`, `--border`, `--ring` | `error`, `border`, `border-focus` |

If a library variable has no matching role, say so; don't invent a value. Record the mapping in DECISIONS.md, and show the variables on the token check page.

## Rules

The token rules are listed at the end of this page and at `{{sistema_url}}/raw/rules`.

## Worked example: Relay

Relay's token sources, in `tokens/src/`:

| File | Holds |
|---|---|
| `palette.json` | The primitive ramps from the palette tool (accent, neutral, red, amber, green, blue) plus `base.white` |
| `color.json`, `color.dark.json` | The color roles, and the dark theme's replacements (only the roles that change) |
| `typography.json` | The font family, the size scale from the type scale tool, and the type roles |
| `spacing.json` | The 4px scale, control and row heights, panel padding, gaps |
| `shape.json`, `shape.dark.json` | Radii by element size and shadows by role, with stronger dark shadows |

One role traced through the layers:

```
palette.json   palette.accent.550 = #7A47E0            (from the palette tool)
color.json     color.primary      = {palette.accent.550}
color.dark.json color.primary     = {palette.accent.450}
tokens.css     --color-primary: #7A47E0;  [data-theme="dark"] { --color-primary: #9672F7; }
shadcn-theme   --primary: var(--color-primary);
button.tsx     className="bg-primary text-on-primary"
```

The palette isn't emitted as CSS, so only roles reach a stop. `npm run tokens` compiles the sources, updates DESIGN.md's front matter, and rebuilds the token check page. Adding a gray selected row later took one new role (`surface-selected`), and every component picked it up.

## Common failure modes

- **Too many tiers,** or component tokens for every property: a stylesheet disguised as a token system.
- **Names that describe values** (`blue`, `space-16`) used as roles.
- **Missing pairs:** a surface with no text role, which pushes contrast decisions into components.
- **Skipping the role tier,** so dark mode or a second brand means touching every component.
- **Dark-specific names** (`surface-dark`) instead of a dark assignment of the same roles.
- **A mode that adds tokens,** or two kinds of mode changing the same token.
- **Edits to compiled files,** lost on the next build.

## Checking the work

- **The build** compiles the tokens and the app with no missing variables.
- **The token check page** shows every role in every mode, the colors in use, and whether each matches the approved direction.
- **The coverage audit** (`tokens.coverage-audit`) finds raw values in components and roles nothing uses.
- **Switch every mode** in the running app and look for anything that didn't change, or broke.

## Plays

- `tokens.pipeline` compiles the sources and builds the token check page.
- `tokens.add-mode` adds a theme, density, or motion mode.
- `tokens.coverage-audit` checks how the tokens are used.
- The foundation plays (`color.scheme`, `typography.scale`, `shape.tokens`, `spacing.tokens`) write the sources.
