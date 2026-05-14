# Color Architecture — Principles

## Overview

How to design a color system that is accessible, themeable, and honest about the tradeoffs of different architectural approaches. This section synthesizes patterns from multiple production design systems and the underlying color science into a system-agnostic framework.

---

## What's in this section

- **architecture** — The four major architectural models (tonal palettes, step scales, named palettes, contextual tokens) with decision framework, non-negotiable floor, dark mode tonal shift logic, and neutral palette design.

- **palette-generation** — Complete algorithm for generating 19-stop shade palettes (50–950) from seed hex colors using contrast-targeting: dense OKLCH candidate generation, logarithmic target contrast table (1.01–19.0), WCAG contrast selection, dual white/black contrast tracking, gamut handling, output JSON schema, and pre-generated library approach.

---

## Source Map

| Source | URL | License tier |
|---|---|---|
| Material Design 3 — Color System | `kb/reference/design-systems/material/guidance/foundations/color-system` | Tier 2 (official public docs) |
| Material Design 3 — Color Roles | `kb/reference/design-systems/material/guidance/foundations/color-roles` | Tier 2 (official public docs) |
| Radix Themes — Color System | `kb/reference/design-systems/radix/guidance/foundations/color-system` | Tier 2 (official public docs) |
| Carbon Design System — Color System | `kb/reference/design-systems/carbon/guidance/foundations/color-system` | Tier 2 (official public docs) |
| Ant Design — Color System | `kb/reference/design-systems/ant-design/guidance/foundations/color-system` | Tier 2 (official public docs) |
| Foundations — Perceptual Color Models | `kb/reference/foundations/color/perceptual-models` | Tier 3 (see audit task 6.10) |
| Foundations — Contrast and Accessibility | `kb/reference/foundations/color/contrast-and-accessibility` | Tier 2 (W3C) + Tier 3 (APCA) |
| Standards — WCAG Color Contrast | `kb/reference/standards/wcag/color-contrast` | Tier 1 (W3C, open) |
