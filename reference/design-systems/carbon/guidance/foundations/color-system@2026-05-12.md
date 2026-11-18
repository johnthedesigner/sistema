---
system: carbon
category: foundations
topic: color-system
content_type: guidance
status: latest
version_label: "v11"
retrieved: 2026-05-12
source_url: https://carbondesignsystem.com/elements/color/overview/
tags: [color, tokens, themes, layering, light-dark, ibm-design-language]
---

# Carbon Design System — Color System

## Overview

Carbon's color system is built on the IBM Design Language color palette. Consistent, engaging digital interfaces are achieved through a token-and-theme architecture: tokens define color roles that remain constant across themes, while themes assign the actual palette values to those roles.

The neutral gray family dominates Carbon's default themes, creating depth through subtle value shifts. Blue is the primary action color across all IBM products. Additional colors (red, orange, yellow, magenta, purple, teal, green) are used sparingly for status, support, and data visualization.

---

## Core Concepts

| Term | Definition |
|---|---|
| **Theme** | A collection of visual attributes assigned to tokens. Controls the color value assigned to each token. |
| **Token** | A role-based identifier that assigns a color. Tokens apply universally across themes — only the value changes. |
| **Role** | The systematic usage of a color assigned to a token. Roles are fixed and cannot change between themes. |
| **Value** | The actual hex code or rgba value assigned to a token through a theme. |

---

## The Four Themes

Carbon ships with four default themes — two light, two dark:

| Theme | Background Token | Background Value | Mode |
|---|---|---|---|
| White | `$background` | `#ffffff` | Light |
| Gray 10 | `$background` | `#f4f4f4` | Light |
| Gray 90 | `$background` | `#262626` | Dark |
| Gray 100 | `$background` | `#161616` | Dark |

When `@carbon/react` is installed, components use the White theme by default. To switch to a different default theme, configure the Sass module:

```scss
@use '@carbon/react/scss/themes';
@use '@carbon/react/scss/theme' with (
  $theme: themes.$g100
);
```

---

## Layering Model

Colors in the neutral gray palette are layered on top of each other to create depth. The layering logic differs between light and dark themes:

**Light themes** — layers alternate between White and Gray 10:
- **White theme**: background White → layer-01 Gray 10 → layer-02 White → layer-03 Gray 10
- **Gray 10 theme**: background Gray 10 → layer-01 White → layer-02 Gray 10 → layer-03 White

**Dark themes** — layers become one step lighter with each added layer:
- **Gray 100 theme**: background Gray 100 → layer-01 Gray 90 → layer-02 Gray 80 → layer-03 Gray 70
- **Gray 90 theme**: background Gray 90 → layer-01 Gray 80 → layer-02 Gray 70 → layer-03 Gray 60

This layering model is built directly into the token system via layer tokens (`$layer-01`, `$layer-02`, `$layer-03`), so components automatically adapt when placed in different layer contexts.

---

## Token Architecture

### Core Token Groups

Color tokens that apply across components are called *core tokens*. There are ten main groups:

| Token Group | Applied To |
|---|---|
| `$background` | Page or primary backgrounds |
| `$layer` | Stacked backgrounds; implements the layering model |
| `$field` | Form and input backgrounds |
| `$border` | Dividers, rules, and borders between elements |
| `$text` | Type and type styles |
| `$link` | Standalone and inline links |
| `$icon` | Icons and pictograms |
| `$support` | Notification elements and status indicators |
| `$focus` | Focus states |
| `$skeleton` | Skeleton loading states |

Individual tokens outside groups include `$overlay`, `$highlight`, and `$interactive`.

### Token Naming Convention

Token names encode their role directly:
- First segment: UI element category (`background`, `text`, `border`)
- Second segment: specific role within category (`$border-subtle`, `$text-primary`)
- Optional third segment: interaction state (`$background-hover`, `$layer-selected`)

### Component Tokens

Some components define their own specific tokens (e.g. `$button-primary`, `$notification-background-info`). These are not global and should only be used for their specific component.

---

## Interaction States

Five interaction states are defined with tokens for each theme:

| State | Token pattern | Notes |
|---|---|---|
| Hover | `-hover` suffix | "Half step" lighter or darker than enabled value; falls outside the core IBM palette steps |
| Focus | `-focus` suffix (or `$focus` global token) | Blue 60 in the White theme |
| Active/Pressed | `-active` suffix | Darker than hover |
| Selected | `-selected` suffix | Background + text shifts to indicate selection |
| Disabled | Not a token suffix; handled with opacity | Text at 38% opacity, background at 12% opacity |

**Hover logic**: values between Black and Gray 70 get a half step lighter on hover; values between Gray 60 and White get a half step darker.

**Secondary-to-primary shift**: elements using `$text-secondary` for their enabled state shift to `$text-primary` on hover, giving subtle emphasis. This is typically paired with a background `$layer-hover` shift.

---

## High Contrast Moments

In some cases, light components on dark backgrounds (or vice versa) are intentional. Carbon supports this through:
- **Inverse tokens** (`$text-inverse`, `$icon-inverse`, `$layer-selected-inverse`) — baked into components like tooltips
- **Inline theming** — applying a different theme to a subsection of the UI (e.g. a dark header shell in a light-theme page)

---

## Accessibility

Carbon's color palette and token system are designed to meet WCAG AA contrast requirements. Key rules:
- Text tokens (`$text-primary`, `$text-secondary`) are paired with background and layer tokens to maintain contrast across all four themes
- The 3:1 minimum contrast requirement for UI components is met by default token pairings
- Hover state values (half-steps) are not palette steps — they are purpose-built to preserve both aesthetics and contrast in interactive states
