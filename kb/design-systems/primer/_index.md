# Primer Design System — System Index

**Slug:** `primer`
**Version captured:** Current as of 2026-05-12
**Maintained by:** GitHub
**Status:** Active — GitHub's design system, used across all GitHub products

---

## Overview

Primer is GitHub's open-source design system. Built to serve GitHub's own products — github.com, GitHub Mobile, GitHub Desktop, and GitHub Docs — Primer has been public and open-source since 2016. It provides React components, CSS utilities, design tokens, and Figma libraries.

Primer's defining characteristic is its **all-semantic, role-based color model**. Unlike Material Design (which derives color algorithmically) or Carbon (which uses a minimal two-tier palette), Primer's functional token layer maps directly to named UI roles (`bgColor-default`, `fgColor-muted`, `borderColor-accent-emphasis`) with separate values compiled per theme. The result is a token system that supports nine distinct themes — including light high contrast, dark dimmed, and two colorblindness-accommodating themes — without any algorithmic color generation.

Key characteristics:
- **Three-tier token architecture:** Base (raw values) → Functional (global UI patterns) → Component/pattern (scoped, specific)
- **Nine themes:** light, dark, light high contrast, dark high contrast, light colorblind, dark colorblind, dark dimmed, and more
- **Semantic naming by UI role:** Tokens describe what they do (`bgColor-success-muted`) not what they are (`green-200`)
- **GitHub-specific semantic roles:** `open`, `closed`, `done`, `sponsors` — named after GitHub workflow concepts
- **Built on system fonts:** No custom typeface; uses OS-native font stacks for performance

**When to reference this system:**
- Products requiring a strong all-semantic color token model without algorithmic generation
- Reference for multi-theme architectures (9 themes, single token set)
- Interfaces that need colorblind-safe themes built in from the start
- Products where token names should describe UI intent rather than visual appearance
- Developer-facing or productivity tools with a GitHub-adjacent aesthetic

**When not to use as primary reference:**
- Consumer or brand-forward products needing expressive, personalized color
- Products where a custom typeface is part of the brand identity (Primer uses system fonts)
- Native mobile (iOS/Android) apps — Primer is web-only

---

## Source Map

| Content type | Source | URL |
|---|---|---|
| Guidance docs | primer/design GitHub repo (MDX) | https://github.com/primer/design/tree/main/content |
| Component docs | primer/design GitHub repo | https://github.com/primer/design/tree/main/content/components |
| Design tokens | primer/primitives GitHub repo | https://github.com/primer/primitives |
| Token source files | primer/primitives src/tokens | https://github.com/primer/primitives/tree/main/src/tokens |
| Functional color tokens | primer/primitives functional | https://github.com/primer/primitives/tree/main/src/tokens/functional/color |
| Base typography tokens | primer/primitives base | https://github.com/primer/primitives/tree/main/src/tokens/base/typography |

**Scrape notes:** primer.style documentation site is fully JS-rendered (Firecrawl returns 0 pages). All content sourced directly from the primer/design GitHub repository MDX source files and primer/primitives token JSON5 files via GitHub raw URLs.

---

## Content Inventory

| Stub path | Topic | Type | Status |
|---|---|---|---|
| `primer/guidance/foundations/color-system` | Color system — three-tier token model, semantic roles, neutral/semantic colors | guidance | latest |
| `primer/guidance/foundations/typography` | Typography — type scale, weights, font stacks, best practices | guidance | latest |
| `primer/guidance/components/button` | Button — variants, sizing, anatomy, accessibility | guidance | latest |
| `primer/assets/tokens/colors` | Functional color tokens — fgColor, bgColor, borderColor (light/dark values) | assets | latest |
| `primer/design-md/DESIGN` | Primer DESIGN.md — visual language specification for AI coding tools | design-md | latest |

---

## Version History

| Date | Change |
|---|---|
| 2026-05-12 | Initial capture — color system, typography, button, functional color tokens, DESIGN.md |
