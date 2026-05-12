---
system: atlassian
category: foundations
topic: design-tokens
content_type: guidance
status: latest
version_label: "v1 (current)"
retrieved: 2026-05-12
source_url: https://atlassian.design/tokens/design-tokens
tags: [tokens, design-tokens, css-custom-properties, theming, light-dark, atlaskit]
---

# Atlassian Design System — Design Tokens

## Overview

Design tokens are the single source of truth for naming and storing design decisions in the Atlassian Design System. They abstract the actual values (hex codes, rem sizes) behind meaningful names — enabling consistent theming, dark mode, and coordinated updates across all Atlassian products.

---

## What Tokens Cover

The `@atlaskit/tokens` package defines tokens across six categories:

| Category | Token prefix | Description |
|---|---|---|
| **Color** | `color.*` | Backgrounds, borders, text, icons, links, charts, overlays |
| **Elevation** | `elevation.*` | Surface colors and shadow definitions for layered UI |
| **Typography** | `font.*` | Font families, font shorthand (size + weight + line-height), font weights |
| **Spacing** | `space.*` | Spacing scale (0 → 1000, in 0.125rem increments) |
| **Border** | `border.*` | Border width values |
| **Radius** | `radius.*` | Corner radius scale |
| **Motion** | `motion.*` | Duration, easing, and keyframe animation tokens |
| **Opacity** | `opacity.*` | Opacity levels for disabled and loading states |
| **Utility** | `utility.*` | Escape hatches and special-case values |

---

## Token Naming Convention

All token names use a dot-separated path structure that encodes the full intent of the value:

```
<category>.<property>.<role>.<emphasis>.<state>
```

Examples:
- `color.background.brand.bold` — brand-colored, bold-emphasis background
- `color.text.danger` — danger-role text
- `elevation.surface.overlay` — overlay surface (modal, popover background)
- `space.200` — spacing scale step 200 (= 1rem)
- `font.heading.large` — large heading text style
- `radius.medium` — medium corner radius

---

## Token Tiers

Atlassian's token system has two tiers:

**1. Semantic tokens** — role-based tokens used in application code. These are the `color.*`, `elevation.*`, `font.*`, `space.*`, etc. tokens. They resolve to palette values through the active theme.

**2. Palette/raw tokens** — primitive color values (e.g. `Blue700`, `Neutral0`). These are the underlying values but are not exposed for direct use in product code. Only semantic tokens should be referenced in application code.

---

## Themes

Atlassian tokens support multiple themes. Each theme assigns a different palette value to each semantic token:

- **Light** (default) — white/light surfaces, dark text
- **Dark** — dark surfaces, light text

The active theme is set via an HTML attribute and resolved automatically by the token system — no manual CSS variable override is needed.

---

## Token Package

All tokens are in `@atlaskit/tokens`:

```bash
yarn add @atlaskit/tokens
```

Tokens are available as:
1. **CSS custom properties** (`--ds-*`) — applied via the generated theme stylesheet
2. **JavaScript/TypeScript constants** — typed token names for static analysis
3. **Babel plugin** — transforms `token('color.background.brand.bold')` calls to CSS var references at build time

### Basic usage (CSS)

Include the theme stylesheet to activate CSS custom properties:

```html
<link rel="stylesheet" href="path/to/@atlaskit/tokens/atlassian-light.css" />
```

Then reference tokens in CSS:

```css
.my-button {
  background: var(--ds-background-brand-bold);
  color: var(--ds-text-inverse);
}
```

### Usage in JavaScript/TypeScript

```tsx
import { token } from '@atlaskit/tokens';

const buttonStyle = {
  background: token('color.background.brand.bold'),
  color: token('color.text.inverse'),
};
```

---

## Spacing Scale

Spacing tokens use a numeric scale where the number represents the size in units of 0.5rem (8px base):

| Token | Value | Pixels (at 16px base) |
|---|---|---|
| `space.0` | 0rem | 0px |
| `space.025` | 0.125rem | 2px |
| `space.050` | 0.25rem | 4px |
| `space.075` | 0.375rem | 6px |
| `space.100` | 0.5rem | 8px |
| `space.150` | 0.75rem | 12px |
| `space.200` | 1rem | 16px |
| `space.250` | 1.25rem | 20px |
| `space.300` | 1.5rem | 24px |
| `space.400` | 2rem | 32px |
| `space.500` | 2.5rem | 40px |
| `space.600` | 3rem | 48px |
| `space.800` | 4rem | 64px |
| `space.1000` | 5rem | 80px |

Negative spacing tokens also exist (`space.negative.025` through `space.negative.400`) for negative margins.

---

## Elevation and Shadows

Elevation tokens define both surface backgrounds and shadows, creating a coherent layering model:

| Token | Light value | Use |
|---|---|---|
| `elevation.surface` | `#FFFFFF` | Default page surface |
| `elevation.surface.sunken` | `#F8F8F8` | Recessed surfaces (sidebars, wells) |
| `elevation.surface.raised` | `#FFFFFF` | Cards, raised containers |
| `elevation.surface.overlay` | `#FFFFFF` | Modals, popovers, dropdowns |
| `elevation.shadow.raised` | `0px 1px 1px ...` | Shadow for raised surfaces |
| `elevation.shadow.overlay` | `0px 8px 12px ...` | Shadow for overlay surfaces |
| `elevation.shadow.overflow` | `0px 0px 8px ...` | Shadow for scroll overflow indicators |

---

## Border and Radius Tokens

### Border width

| Token | Value |
|---|---|
| `border.width` | 0.0625rem (1px) |
| `border.width.selected` | 0.125rem (2px) |
| `border.width.focused` | 0.125rem (2px) |

### Radius scale

| Token | Value | Pixels |
|---|---|---|
| `radius.xsmall` | 0.125rem | 2px |
| `radius.small` | 0.25rem | 4px |
| `radius.medium` | 0.375rem | 6px |
| `radius.large` | 0.5rem | 8px |
| `radius.xlarge` | 0.75rem | 12px |
| `radius.xxlarge` | 1rem | 16px |
| `radius.full` | 624.9375rem | Pill/full-round |
| `radius.tile` | 25% | Percentage-based (used for avatars) |
