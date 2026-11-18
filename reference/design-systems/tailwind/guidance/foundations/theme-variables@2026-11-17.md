---
system: tailwind
category: design-systems
topic: theme-variables
content_type: guidance
status: latest
version_label: "Tailwind CSS v4"
retrieved: 2026-11-17
source_url: https://tailwindcss.com/docs/theme
license: public documentation, no explicit license (framework code MIT)
tags: [tailwind, tokens, theme, css-variables]
---

# Theme variables

**Source:** `tailwindcss.com/docs/theme`

## What they are

In Tailwind v4, design tokens are stored as *theme variables*: CSS custom properties declared inside an `@theme` block. A theme variable does two things: it is emitted as an ordinary CSS variable (usable in `var()`, inline styles, and arbitrary values), and it tells Tailwind to generate utility classes or variants for it. Declaring `--color-mint-500` creates `bg-mint-500`, `text-mint-500`, `fill-mint-500`, and so on.

`@theme` is used instead of `:root` because the declaration generates utilities, so it must be explicit and top-level (not nested under selectors or media queries). Plain `:root` variables are still appropriate for values that should not produce utilities.

## Namespaces

The prefix of a theme variable decides which utilities it drives. You can name variables freely within a namespace; the utility takes the same name.

| Namespace | Drives |
|---|---|
| `--color-*` | Color utilities (`bg-*`, `text-*`, `border-*`, `fill-*`, …) |
| `--font-*` | Font family (`font-sans`) |
| `--text-*` | Font size (`text-xl`), with optional paired line height |
| `--font-weight-*` | Font weight (`font-bold`) |
| `--tracking-*` | Letter spacing (`tracking-wide`) |
| `--leading-*` | Line height (`leading-tight`) |
| `--tab-size-*` | Tab size |
| `--breakpoint-*` | Responsive variants (`sm:*`) |
| `--container-*` | Container query variants and max-width sizes |
| `--spacing-*` / `--spacing` | Spacing and sizing utilities (`px-4`, `max-h-16`) |
| `--radius-*` | Border radius (`rounded-sm`) |
| `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*` | Shadows |
| `--blur-*`, `--perspective-*`, `--zoom-*`, `--aspect-*` | Filters and layout helpers |
| `--ease-*`, `--animate-*` | Easing and animation |

## Defaults and customization

Importing `tailwindcss` brings in `theme.css`, the default theme: color palette, type scale, shadows, fonts, and more. Utilities like `bg-red-200` exist only because the default theme defines them.

- **Extend:** declare new variables in `@theme` alongside the defaults.
- **Override:** redeclare a default variable with a new value.
- **Replace a namespace:** set it to `initial` (for example `--color-*: initial;`) and declare only your own values. `--*: initial` removes the whole default theme.
- **Reference other variables:** `@theme inline` makes utilities use the referenced value directly rather than a `var()` chain, which matters when the referenced variable is defined elsewhere (this is how shadcn/ui maps its semantic tokens into Tailwind).
- **Share** a theme by putting `@theme` blocks in a CSS file other projects import.
- **Use** theme variables in custom CSS through `var()`, in arbitrary values, and from JavaScript via computed styles.

## Default typographic tokens (v4)

- Weights: `thin` 100, `extralight` 200, `light` 300, `normal` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800, `black` 900.
- Line heights: `tight` 1.25, `snug` 1.375, `normal` 1.5, `relaxed` 1.625, `loose` 2.
- Tracking: `tighter` -0.05em, `tight` -0.025em, `normal` 0em, `wide` 0.025em, `wider` 0.05em, `widest` 0.1em.
- Spacing: one base value, `--spacing: 0.25rem` (4px); every numeric spacing utility is a multiple of it.
