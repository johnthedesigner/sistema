# Radix Themes — System Index

**Slug:** `radix`
**Version captured:** Current as of 2026-05-12
**Maintained by:** WorkOS
**Status:** Active — open-source React component library

---

## Overview

Radix Themes is a pre-styled, accessible component library built on top of Radix Primitives (the headless, unstyled component layer). It provides a complete UI toolkit — components, layout primitives, typography, and theming — that works out of the box with minimal configuration. All components are built on the ARIA-compliant foundations of Radix Primitives.

Radix's defining characteristic is its **config-first theming model**. Rather than requiring developers to manually specify a token set, the entire theme is derived from a small set of high-level props on the `<Theme>` component: accent color, gray color, radius, panel background, and scaling. Changing `accentColor="indigo"` to `accentColor="crimson"` updates every interactive element in the system consistently. This is a fundamentally different model from Material Design (algorithmic color generation from a source color) or Carbon (manual token specification) or Atlassian (all-semantic token vocabulary).

Key characteristics:
- **Config-first theming:** Full visual theme generated from 5 props (`accentColor`, `grayColor`, `radius`, `panelBackground`, `scaling`) — not manual token definition
- **Two-axis color model:** Every theme has an accent color (27 options) and a gray color (6 options) that are automatically paired; the system handles harmonization
- **Semantic 12-step color scales:** Each color is a 12-step scale where step ranges have defined semantic usage (backgrounds, interactive states, borders, solid fills, text) — consistent across all 27+ accent colors
- **CSS variable token system:** All theme values are CSS custom properties scoped to `.radix-themes`, fully accessible and overrideable
- **Cross-component variant system:** All components share a consistent variant vocabulary (`classic`, `solid`, `soft`, `surface`, `outline`, `ghost`) with harmonized appearance across the library
- **System font stack default:** No custom typeface required; uses OS-native fonts for portability

**When to reference this system:**
- Products where the developer wants a complete, coherent UI out of the box without extensive token configuration
- Reference for a consistent cross-component variant model
- Systems that need to support many different accent colors with automatic harmonization
- Web apps (especially React/Next.js) where Radix Primitives are already in use

**When not to use as primary reference:**
- Products with strict brand color requirements that don't map to the Radix color scales
- Native mobile apps — Radix is web/React only
- Teams that need a full design token vocabulary for design tools (Figma tokens, etc.) — Radix's model is code-first, not token-design-first

---

## Source Map

| Content type | Source | URL |
|---|---|---|
| Getting started | radix-ui.com/themes/docs | https://www.radix-ui.com/themes/docs/overview/getting-started |
| Theme system | radix-ui.com/themes/docs/theme | https://www.radix-ui.com/themes/docs/theme/overview |
| Color system | radix-ui.com/themes/docs/theme/color | https://www.radix-ui.com/themes/docs/theme/color |
| Typography | radix-ui.com/themes/docs/theme/typography | https://www.radix-ui.com/themes/docs/theme/typography |
| Spacing | radix-ui.com/themes/docs/theme/spacing | https://www.radix-ui.com/themes/docs/theme/spacing |
| Radius | radix-ui.com/themes/docs/theme/radius | https://www.radix-ui.com/themes/docs/theme/radius |
| Source tokens | GitHub radix-ui/themes | https://github.com/radix-ui/themes/tree/main/packages/radix-ui-themes/src/styles/tokens |

**Scrape notes:** radix-ui.com is a Next.js app that renders successfully with Firecrawl. Each theme page is a single page — one scrape call per page at 1-page limit. Rate limit (3 req/min on free tier) applies; scrapes must be spaced ≥60s apart.

---

## Content Inventory

| Stub path | Topic | Type | Status |
|---|---|---|---|
| `radix/guidance/foundations/color-system` | Color system — 12-step scales, accent/gray axes, CSS variable tokens, customization | guidance | latest |
| `radix/guidance/foundations/typography` | Typography — 9-step size scale, weights, font family tokens, next/font integration | guidance | latest |
| `radix/guidance/foundations/design-tokens` | Design tokens — Theme component props, variant system, token categories, CSS variables | guidance | latest |
| `radix/guidance/foundations/spacing` | Spacing — 9-step 4px-grid scale, CSS variable tokens, layout props, responsive breakpoints, global scaling | guidance | latest |
| `radix/guidance/foundations/radius` | Radius — Global radius prop (none/small/medium/large/full), CSS variable tokens, component-level overrides | guidance | latest |
| `radix/implementation/getting-started` | Getting started — Installation, Theme component setup, ThemePanel | implementation | latest |
| `radix/design-md/DESIGN` | Radix Themes DESIGN.md — visual language specification for AI coding tools | design-md | latest |

---

## Version History

| Date | Change |
|---|---|
| 2026-05-12 | Initial capture — color system, typography, design tokens, getting started, DESIGN.md |
| 2026-05-13 | Added spacing and radius KB files; updated DESIGN.md to v2 (incorporates all 6 topic areas) |
