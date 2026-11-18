---
system: shadcn
category: design-systems
topic: typography
content_type: guidance
status: latest
version_label: "shadcn/ui v4 docs"
retrieved: 2026-11-17
source_url: https://ui.shadcn.com/docs/typeset
license: MIT
tags: [shadcn, typography, typeset, prose]
---

# Typography

**Sources:** `ui.shadcn.com/docs/components/radix/typography` and `ui.shadcn.com/docs/typeset` (both from `shadcn-ui/ui` `apps/v4/content/docs/`, with class names from `apps/v4/examples/radix/typography-*.tsx`). Firecrawl returned nothing for the typography component page; the GitHub source was used.

## No type tokens; Tailwind sizes in components

shadcn/ui ships no typography styles or type tokens. Its typography page is a set of examples showing how to style text with Tailwind utilities. Each element combines a Tailwind size with weight, tracking, and color:

| Element | Classes |
|---|---|
| h1 | `text-4xl font-extrabold tracking-tight text-balance` |
| h2 | `text-3xl font-semibold tracking-tight`, bottom border and padding |
| h3 | `text-2xl font-semibold tracking-tight` |
| h4 | `text-xl font-semibold tracking-tight` |
| p | `leading-7`, top margin between paragraphs |
| blockquote | left border, italic |
| inline code | `font-mono text-sm font-semibold`, `bg-muted`, small padding, rounded |
| lead | `text-xl text-muted-foreground` |
| large | `text-lg font-semibold` |
| small | `text-sm leading-none font-medium` |
| muted | `text-sm text-muted-foreground` |

So in a shadcn project, sizes are Tailwind's T-shirt scale, and the role (heading, lead, muted) lives in the component or element classes. Muted and lead text use the color token `muted-foreground` rather than a separate type token.

## Typeset: prose styled from three controls

shadcn/typeset is a CSS file the project owns that styles rendered markdown and HTML inside a `typeset` container (docs, articles, chat messages). Instead of exposing every typographic variable, it derives everything from three:

- `--typeset-size`: base text size (default `1em`, so it follows its container; nudged up on small screens)
- `--typeset-leading`: line height (default 1.75)
- `--typeset-flow`: space between blocks (default 1.25em); heading spacing, list indents, and rule spacing derive from it

Fonts come from `--typeset-font-body`, `--typeset-font-heading`, and `--typeset-font-mono`, defaulting to the app's fonts; colors and radius come from the theme, so dark mode follows. It sets no max width; the layout owns measure. Several presets can coexist as classes, for example a tighter `typeset-chat` and a roomier `typeset-docs`, or a serif reading mode and a compact UI mode. It is designed so streamed content doesn't restyle earlier blocks as new ones arrive.
