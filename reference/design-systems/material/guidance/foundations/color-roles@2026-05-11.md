---
system: material
category: foundations
topic: color-roles
content_type: guidance
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://m3.material.io/styles/color/roles
tags: [color-roles, on-color, container, surface, semantic-tokens]
---

# Material Design 3 — Color Roles

## Overview

Color roles are the semantic layer of the M3 color system. Each role defines *where* a color is used and *what purpose it serves* in the UI. Roles are the names that components consume — not palette values. This semantic naming is what enables theme switching: the role name stays constant, the resolved value changes.

M3's official description: *"Color roles are like the numbers in a paint-by-number canvas. They're the connective tissue between elements of the UI and what color goes where."*

---

## Role Families

Roles are organized into families. Each family represents a visual "tier" of the UI.

### Primary Family
The main brand color family. Used for the most prominent interactive elements.

| Role | Purpose |
|---|---|
| `primary` | High-emphasis interactive elements: filled buttons, FABs, active states |
| `on-primary` | Text and icons placed directly on `primary` |
| `primary-container` | Lower-emphasis containers: selected chips, tinted cards |
| `on-primary-container` | Text and icons on `primary-container` |
| `inverse-primary` | Primary color for use on dark surfaces in a light theme (e.g. snackbar action) |

### Secondary Family
A supporting accent. Less visually prominent than primary.

| Role | Purpose |
|---|---|
| `secondary` | Medium-emphasis interactive elements |
| `on-secondary` | Content on `secondary` |
| `secondary-container` | Tinted background for chips, filter components |
| `on-secondary-container` | Content on `secondary-container` |

### Tertiary Family
A contrasting accent for expressive moments or differentiation.

| Role | Purpose |
|---|---|
| `tertiary` | Decorative or differentiation use |
| `on-tertiary` | Content on `tertiary` |
| `tertiary-container` | Tinted surfaces using tertiary hue |
| `on-tertiary-container` | Content on `tertiary-container` |

### Error Family
Reserved exclusively for error states.

| Role | Purpose |
|---|---|
| `error` | Error indicators, destructive action buttons |
| `on-error` | Content on `error` |
| `error-container` | Background for error banners, input error states |
| `on-error-container` | Content on `error-container` |

### Surface Family
Drives backgrounds and UI planes. Derived from the neutral palette.

| Role | Purpose |
|---|---|
| `surface` | Default background for cards, sheets, menus |
| `on-surface` | Primary text and icons on surface |
| `on-surface-variant` | Secondary text, icons, and borders on surface |
| `surface-variant` | An alternative surface with slight tinting |
| `surface-dim` | A dimmed surface for scrim backgrounds |
| `surface-bright` | A brighter surface variant |
| `surface-container-lowest` | Lowest-emphasis container |
| `surface-container-low` | Low-emphasis container |
| `surface-container` | Default container |
| `surface-container-high` | High-emphasis container |
| `surface-container-highest` | Highest-emphasis container (e.g. filled text fields) |
| `inverse-surface` | A dark surface for use in light themes (e.g. tooltips, snackbars) |
| `inverse-on-surface` | Text on `inverse-surface` |
| `background` | The app background behind all surfaces |
| `on-background` | Text on `background` |

### Outline Family

| Role | Purpose |
|---|---|
| `outline` | Borders for interactive components (text fields, outlined buttons) |
| `outline-variant` | Decorative borders, dividers — lower emphasis |

### Inverse Family

Inverse roles are applied selectively to components to achieve colors that are the reverse of those in the surrounding UI, creating a contrasting effect.

| Role | Purpose |
|---|---|
| `inverse-surface` | Background fills for elements that contrast against surface (e.g. snackbars, tooltips) |
| `inverse-on-surface` | Text and icons against `inverse-surface` |
| `inverse-primary` | Actionable elements (e.g. text buttons) against `inverse-surface` |

### Shadow and Scrim

| Role | Purpose |
|---|---|
| `shadow` | Drop shadow color |
| `scrim` | Scrim overlays (modal backgrounds) |

---

## The `on-*` Pattern

Every colored surface role has a paired `on-*` role for content placed on it. This is M3's primary accessibility mechanism: the tone relationship between a surface role and its `on-*` pair is always at least 4.5:1 contrast.

The pattern applies universally:
- `primary` / `on-primary`
- `primary-container` / `on-primary-container`
- `surface` / `on-surface`
- `error-container` / `on-error-container`

**Never place content using a role directly on a surface of the same family.** Always use the appropriate `on-*` partner.

---

## Container vs. Non-Container Roles

The `*-container` pattern creates two tiers of emphasis within each color family:

- **Non-container** (e.g. `primary`): Higher saturation, higher visual weight. For high-emphasis interactive elements — filled buttons, FABs, active navigation indicators.
- **Container** (e.g. `primary-container`): More muted, larger surface areas. For lower-emphasis elements — selected states, tinted cards, filter chips.

This distinction allows designers to express hierarchy within a color family without introducing additional hues.

---

## Surface Containers

The five surface container roles (`surface-container-lowest` through `surface-container-highest`) represent a tonal elevation system. Rather than using drop shadows to convey depth (as in M2), M3 uses progressively tinted surface colors.

Higher-numbered containers appear slightly more tinted with the primary color, which creates depth without shadows. Common usage:
- `surface-container-lowest`: App background behind main content
- `surface-container-low`: Navigation drawers, side panels
- `surface-container`: Cards, dialogs
- `surface-container-high`: Modal sheets, text field fills
- `surface-container-highest`: Filled text fields, highest-elevation modals

---

## Pairing and Layering Rules

Apply colors only in their intended pairs. Improper pairings break accessible contrast, especially when colors shift with dynamic color or user-controlled contrast levels.

**Do:** Pair `primary` with `on-primary`, `secondary-container` with `on-secondary-container`, etc. These pairs maintain legibility across all three contrast levels (standard, medium, high).

**Don't:** Mix roles from different families (e.g. `primary` background with `primary-container` text, or `on-surface` text on a `secondary-container` background). These combinations may appear fine at default contrast but break at medium or high contrast.

---

## Add-on Color Roles

Most products don't need these. Add-on roles provide greater flexibility for specific use cases — if you're unsure whether you need them, you probably don't.

### Fixed Accent Colors

Fixed colors maintain the same tone in both light and dark themes (unlike regular container colors, which shift between themes). Use them where theme-independent color is required.

| Role | Purpose |
|---|---|
| `primary-fixed` | Fill color against surface; same tone in light and dark |
| `primary-fixed-dim` | A deeper, more emphasized version of `primary-fixed` |
| `secondary-fixed` | Fixed secondary fill |
| `secondary-fixed-dim` | Deeper fixed secondary fill |
| `tertiary-fixed` | Fixed tertiary fill |
| `tertiary-fixed-dim` | Deeper fixed tertiary fill |

**Don't** use fixed colors where contrast matters — they don't adapt to theme context and will likely cause contrast failures.

### On-Fixed Accent Colors

| Role | Purpose |
|---|---|
| `on-primary-fixed` | Text and icons on `primary-fixed` |
| `on-primary-fixed-variant` | Lower-emphasis text and icons on `primary-fixed` |
| `on-secondary-fixed` | Text and icons on `secondary-fixed` |
| `on-secondary-fixed-variant` | Lower-emphasis text and icons on `secondary-fixed` |
| `on-tertiary-fixed` | Text and icons on `tertiary-fixed` |
| `on-tertiary-fixed-variant` | Lower-emphasis text and icons on `tertiary-fixed` |

### Bright and Dim Surface Roles

| Role | Purpose |
|---|---|
| `surface-dim` | Dimmest surface in both light and dark themes |
| `surface-bright` | Brightest surface in both light and dark themes |

Unlike the default `surface` role (which is lightest in light theme and flips to darkest in dark theme), `surface-bright` and `surface-dim` preserve their relative brightness across both themes. Use them where you need a consistently brighter or dimmer area regardless of theme — for example, a navigation rail (`surface-dim`) alongside a content panel (`surface-bright`).

---

## Sources

- Color Roles: https://m3.material.io/styles/color/roles
- Key Colors and Tones: https://m3.material.io/styles/color/the-color-system/key-colors-tones
- Material Web Color: https://material-web.dev/theming/color/
