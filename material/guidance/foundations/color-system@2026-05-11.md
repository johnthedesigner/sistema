---
system: material
category: foundations
topic: color-system
content_type: guidance
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://m3.material.io/styles/color/system/how-the-system-works
tags: [color, dynamic-color, tonal-palette, theming, light-dark, token-tiers]
---

# Material Design 3 — Color System

## Overview

Material 3's color system is built around a single central insight: rather than requiring designers to hand-pick every color in a UI, a full, harmonious, accessible color scheme can be derived algorithmically from a small number of key colors. This process is called **Dynamic Color**.

The system is designed to handle three major concerns automatically:
- **Accessibility** — all color role pairings (e.g. `primary` and `on-primary`) are guaranteed to meet WCAG AA contrast requirements
- **Theming** — the same role names resolve to different values in light and dark mode, making theme switching a property change rather than a style rewrite
- **Harmony** — all colors in a scheme are algorithmically related through the HCT color space, ensuring visual coherence even when generated at runtime from user wallpaper or brand input

---

## The Three-Tier Token Model

Material 3's token architecture has three tiers, each serving a distinct purpose:

### Tier 1: Reference Tokens (`md.ref.*`)

Reference tokens hold raw, concrete values. They are the palette — a complete range of tones for each key color. They are not used directly in components; they exist as the source of truth from which system tokens are derived.

Example reference token: `md.ref.palette.primary40` → `#6750A4`

The tonal palette for each key color runs from tone 0 (black) to tone 100 (white) in increments. Tone 40 is typically used for the light-theme primary role; tone 80 is used for the dark-theme primary role.

### Tier 2: System Tokens (`md.sys.color.*`)

System tokens are semantic roles — they define *what a color is for*, not what its value is. They are aliased to reference tokens and are what components consume. System tokens change value between light and dark themes; the role name stays constant.

Example: `md.sys.color.primary` → resolves to `md.ref.palette.primary40` in light theme, `md.ref.palette.primary80` in dark theme.

On the web, system tokens are CSS custom properties: `--md-sys-color-primary`.

### Tier 3: Component Tokens

Component tokens are scoped to a specific component and typically alias a system token. They exist to allow per-component overrides without affecting the broader system.

Example: `--md-filled-button-container-color` → defaults to `var(--md-sys-color-primary)`

---

## Key Colors

A Material color scheme is generated from five **key colors**:

| Key Color | Role |
|---|---|
| **Primary** | The main brand/identity color. Used for prominent interactive elements. |
| **Secondary** | A supportive accent color, used for less prominent components. |
| **Tertiary** | A contrasting accent for differentiation and expressive moments. |
| **Error** | Used exclusively for error states and destructive actions. |
| **Neutral** | Drives surface colors and text. Less saturated, provides visual rest. |

From each key color, a **tonal palette** of 13 tones is generated: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100.

---

## Color Scheme

A **color scheme** is the set of system token role assignments for a given theme (light or dark). It maps each role to a specific tone from the tonal palettes.

Material 3's baseline color scheme uses a purple primary (`#6750A4`) derived from Google's brand. Products are expected to replace this with their own seed color.

**Light theme assignments (key roles):**
- `primary` → primary-40
- `on-primary` → primary-100
- `primary-container` → primary-90
- `on-primary-container` → primary-10
- `surface` → neutral-99
- `on-surface` → neutral-10
- `background` → neutral-99
- `error` → error-40

**Dark theme assignments (key roles):**
- `primary` → primary-80
- `on-primary` → primary-20
- `primary-container` → primary-30
- `on-primary-container` → primary-90
- `surface` → neutral-10
- `on-surface` → neutral-90

---

## Dynamic Color

Dynamic Color is M3's mechanism for generating a personalized color scheme at runtime from a single seed — such as a user's wallpaper, a brand hex value, or content imagery.

The `material-color-utilities` library (published by Google, available on npm) performs the HCT tonal palette generation and scheme assignment. The Material Theme Builder Figma plugin provides the same capability in design tools.

For products that don't use dynamic color, a static scheme generated once from a brand seed is fully supported — the token architecture is identical.

---

## Theming Support

Material 3 officially supports three theme variants:
- **Light** — default, moderate brightness
- **Dark** — deep background, elevated surface brightness
- **High Contrast** — enhanced contrast ratios beyond AA for users with visual impairments (available in Android; partial web support)

All three variants use the same system token names. Theme switching is done by changing the values assigned to the CSS custom properties, not by changing class names or selectors.

---

## Do's and Don'ts

**Do:**
- Generate your color scheme from a single brand seed using the Material Theme Builder or `material-color-utilities`
- Use `on-*` tokens (e.g. `on-primary`) for all text and icons placed on colored surfaces — these are pre-calculated for contrast
- Use `*-container` tokens for lower-emphasis, larger surface areas; use `*` tokens for high-emphasis interactive elements
- Apply the same token names in both light and dark themes — let the values change, not the names

**Don't:**
- Use reference palette tokens directly in components — they bypass the semantic layer and break theme switching
- Invent color roles outside the system without careful consideration — M3 has roles for almost every common UI need
- Mix M2 and M3 token conventions in the same codebase
- Hard-code hex values in components — this defeats the entire purpose of the token system

---

## Sources

- Material Design 3 Color Overview: https://m3.material.io/styles/color/overview
- Color System — How It Works: https://m3.material.io/styles/color/system/how-the-system-works
- Material Web Color Guide: https://material-web.dev/theming/color/
- material-color-utilities (npm): https://www.npmjs.com/package/@material/material-color-utilities
