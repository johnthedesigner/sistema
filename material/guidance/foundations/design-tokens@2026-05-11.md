---
system: material
category: foundations
topic: design-tokens
content_type: guidance
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://m3.material.io/foundations/design-tokens
tags: [design-tokens, token-tiers, reference, system, component, naming-conventions]
---

# Material Design 3 — Design Tokens

## Overview

Design tokens are the building blocks of all UI elements in Material 3. They encode design decisions as named values that can be shared across design tools, platforms, and code. M3's token system is designed to be platform-agnostic: the same token names exist in Android (Compose/MDC), Flutter, and Web, even though their implementation format differs.

The core principle: *"The same tokens are used in designs, tools, and code."*

---

## Three Tiers

M3 organizes tokens into three tiers. Understanding this hierarchy is essential to using the system correctly.

### Reference Tokens (`md.ref.*`)

**What they are:** Concrete, raw values. The palette.

**What they contain:** Every tone of every key color (primary-0 through primary-100), the typeface names, and fixed spacing values.

**How they're used:** As the source from which system tokens are derived. Reference tokens are set once when building a theme and are not typically changed by component authors or product customizers.

**CSS naming:** `--md-ref-palette-primary40`, `--md-ref-typeface-brand`

**Rule:** Do not reference these in component styles. If you find yourself writing `background: var(--md-ref-palette-primary40)`, you are bypassing the semantic layer and your component will not theme correctly.

### System Tokens (`md.sys.*`)

**What they are:** Semantic role definitions. The design decisions.

**What they contain:** Color roles (primary, on-primary, surface, etc.), typescale definitions (display-large-size, body-medium-weight, etc.), and shape values (corner-small, corner-full, etc.).

**How they're used:** Components consume these. Product customizers change these to adapt the system to a brand. These are the public API of the token system.

**CSS naming:** `--md-sys-color-primary`, `--md-sys-typescale-body-medium-size`, `--md-sys-shape-corner-medium`

**Rule:** Use these in your own component styles. Changing these values changes the visual character of everything that references them.

### Component Tokens

**What they are:** Scoped overrides for a specific component.

**What they contain:** Aliases to system tokens, plus a few component-specific values that have no system-level equivalent.

**How they're used:** When you need to change the appearance of a single component type without affecting others. Component tokens are the upgrade-safe way to customize.

**CSS naming (web):** `--md-filled-button-container-color`, `--md-checkbox-selected-icon-color`

**Rule:** Do not override component tokens' internal mappings (e.g. breaking the reference to a system token). Override the component token with a new value; don't rewire what it points to.

---

## Naming Conventions

M3 token names follow a structured pattern. On the web they are CSS custom properties.

**Reference palette:** `--md-ref-palette-<color><tone>`
Examples: `--md-ref-palette-primary40`, `--md-ref-palette-neutral99`

**Reference typeface:** `--md-ref-typeface-<role>`
Examples: `--md-ref-typeface-brand`, `--md-ref-typeface-plain`

**System color:** `--md-sys-color-<role>`
Examples: `--md-sys-color-primary`, `--md-sys-color-on-surface`, `--md-sys-color-surface-container-high`

**System typescale:** `--md-sys-typescale-<role>-<size>-<property>`
Examples: `--md-sys-typescale-body-medium-size`, `--md-sys-typescale-headline-large-weight`

**System shape:** `--md-sys-shape-corner-<scale>`
Examples: `--md-sys-shape-corner-small`, `--md-sys-shape-corner-full`

**Component tokens:** `--md-<component-name>-<property>`
Examples: `--md-filled-button-container-shape`, `--md-checkbox-selected-icon-color`
Note: unlike ref and sys tokens, component tokens do not use a `comp` prefix.

---

## Cross-Platform Token Names

M3's token names are consistent across platforms, with format adaptations:

| Platform | Format | Example |
|---|---|---|
| Web (CSS) | `--md-sys-color-primary` | CSS custom property |
| Android (Compose) | `MaterialTheme.colorScheme.primary` | Kotlin property |
| Flutter | `Theme.of(context).colorScheme.primary` | Dart property |
| Figma / Design tools | `md.sys.color.primary` | Dot-notation variable |

The semantic intent is identical across all platforms. When a designer sets a Figma variable called `md.sys.color.primary`, they are referencing the same role as a developer using `--md-sys-color-primary` in CSS.

---

## Theming with Tokens

The token system enables theming at multiple granularities:

**Full theme swap:** Replace all reference palette values (generate via Material Theme Builder) → every system and component token inherits the new values automatically.

**Role-level override:** Change a system token (e.g. `--md-sys-color-primary`) without touching reference tokens → affects every component that uses that role.

**Component-level override:** Change a component token (e.g. `--md-filled-button-container-shape`) → affects only that component type.

**Instance-level override:** Scope a component token to a CSS selector → affects only matching instances.

```css
/* Scope to a specific context */
.marketing-section {
  --md-filled-button-container-color: var(--md-sys-color-tertiary);
  --md-filled-button-label-text-color: var(--md-sys-color-on-tertiary);
}
```

---

## Sources

- Design Tokens Overview: https://m3.material.io/foundations/design-tokens
- Material Web Theming: https://material-web.dev/theming/material-theming/
