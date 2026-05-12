---
system: primer
category: foundations
topic: color-system
content_type: guidance
status: latest
version_label: "current"
retrieved: 2026-05-12
source_url: https://github.com/primer/design/blob/main/content/foundations/color/overview.mdx
tags: [color, tokens, semantic, theming, light-dark, functional-tokens, base-tokens]
---

# Primer — Color System

## Overview

GitHub's UI supports two color modes: `light` and `dark`. Primer extends this across nine themes, with every pattern built to work across all color modes by default. Themes include light, dark, light high contrast, dark high contrast, dark dimmed, and colorblind-accommodating variants.

Colors are delivered as design tokens — CSS variables in code, Figma variables in design. When `bgColor-default` is referenced, the token value automatically adjusts based on the active color mode. This means components are built once and work across all nine themes without modification.

---

## Three-tier token architecture

Primer design tokens are organized into three tiers:

### Base tokens
Raw value tokens. Map directly to a specific color value with no semantic meaning. Base tokens are **only** to be used as references when building functional or component tokens — never used directly in code or design.

Example: `color-scale-pink-5`, `base.color.neutral.13`

Base tokens don't respect color modes — they always resolve to the same value regardless of theme.

### Functional tokens
Global UI pattern tokens. These are the most commonly used tokens throughout Primer and GitHub UI. Functional tokens reference base tokens and **do** respect color modes — their value changes per theme.

Example: `bgColor-default`, `fgColor-muted`, `borderColor-accent-emphasis`

Functional tokens cover: text (`fgColor`), backgrounds (`bgColor`), borders (`borderColor`), shadows (`shadow`).

### Component/pattern tokens
Scoped tokens for specific components or patterns. More specific than functional tokens and limited in scope. May reference both base and functional tokens. Used when a functional token isn't specific enough.

Example: `focus-outlineColor`, `control-borderColor-danger`

---

## Neutral colors

Shades of gray used for text, borders, backgrounds, and shadows.

### Foreground (`fgColor`)

Foreground tokens use the `fgColor` property for text and icons.

| Token | Usage |
|---|---|
| `fgColor-default` | Primary text — headings, body text, primary labels |
| `fgColor-muted` | Secondary text — timestamps, metadata, helper text, placeholder |
| `fgColor-onEmphasis` | Text on emphasis backgrounds — always pair with `bgColor-*.emphasis` |
| `fgColor-link` | Interactive link text |
| `fgColor-disabled` | Disabled text and icons |

### Background (`bgColor`)

Background tokens use the `bgColor` property for backgrounds and fills.

| Token | Usage |
|---|---|
| `bgColor-default` | Primary page and content area backgrounds |
| `bgColor-muted` | Secondary areas — code blocks, table headers, sidebars, subtle grouping |
| `bgColor-inset` | Recessed areas — wells, sunken panels, input fields |
| `bgColor-emphasis` | High-emphasis backgrounds — tooltips, badges; pair with `fgColor-onEmphasis` |
| `bgColor-inverse` | Opposite-theme element; pair with `fgColor-onInverse` |

### Border (`borderColor`)

Border tokens use the `borderColor` property for borders and dividers.

| Token | Usage |
|---|---|
| `borderColor-default` | Standard borders on cards, inputs, dropdowns |
| `borderColor-muted` | Subtle dividers within components |
| `borderColor-emphasis` | High-contrast borders for strong visual definition |

### Shadow

Shadow tokens use the `shadow` property for elevation.

| Token | Usage |
|---|---|
| `shadow-floating-small` | Small floating elements (tooltips, small menus) |
| `shadow-resting-xsmall` | Cards and resting surfaces |
| `shadow-inset` | Inset/sunken elements, active inputs |

---

## Semantic colors

Semantic colors communicate status, action, or emphasis. Each role has foreground, background, and border tokens. Background and border tokens offer both `muted` (subtle) and `emphasis` (strong) variants.

### Color roles

| Role | Usage |
|---|---|
| `accent` | Links, selected states, active and focus states, neutral information |
| `success` | Primary buttons, positive messaging, successful states |
| `attention` | Warning states, active processes (queued PRs, tests in progress) |
| `danger` | Danger buttons, error states, destructive actions |
| `open` | Open tasks, pull requests, or workflows |
| `closed` | Closed tasks, pull requests, or workflows |
| `done` | Completed tasks, pull requests, or workflows |
| `sponsors` | GitHub Sponsors-related text and icons |

### Token patterns per role

Each semantic role (`accent`, `success`, `attention`, `danger`, etc.) exposes this set of tokens:

```
fgColor-{role}               — foreground/text color for this role
bgColor-{role}-muted         — subtle background (light tint), for callouts and highlights
bgColor-{role}-emphasis      — strong background, always pair with fgColor-onEmphasis
borderColor-{role}-muted     — subtle border, pair with bgColor-{role}-muted
borderColor-{role}-emphasis  — strong border, pair with bgColor-{role}-emphasis
```

### Muted vs. emphasis backgrounds

**Muted** background and border colors draw subtle attention to content — used for informational callouts, status indicators in low-emphasis contexts.

**Emphasis** background colors provide stronger visual weight — used for filled badges, status chips, primary action colors. Always combined with `fgColor-onEmphasis` for text on emphasis backgrounds.

---

## Neutral base scales

Primer's neutral scales run from 0 to 13, including white and black. There are two versions: light and dark. The light and dark scale directions are **inverted** — light scale starts at white (0), dark scale starts at black (0). This inversion allows light and dark themes to share functional token definitions without per-theme overrides for most values.

### Scale usage zones

| Scale steps | Typical use |
|---|---|
| 0–5 | Backgrounds (page, muted, inset) |
| 6–7 | Rest/hover/active states for control backgrounds |
| 7–8 | Borders and dividers |
| 9–10 | Text and icons |
| 11–13 | High-emphasis text, strong borders |

High contrast themes shift the zones upward — backgrounds use steps 2–7, borders use step 10, text uses steps 11–13.

---

## Developers

Colors are available as CSS variables and CSS utility classes:
- CSS variable: `var(--fgColor-default)`
- Utility class: `.color-fg-default`

Both are available for all frameworks including React and Rails.
