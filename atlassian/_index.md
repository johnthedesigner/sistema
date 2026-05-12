# Atlassian Design System — System Index

**Slug:** `atlassian`
**Version captured:** v1 / current (packages versioned independently as of 2026-05-12)
**Maintained by:** Atlassian
**Status:** Active — design system for Jira, Confluence, and all Atlassian products

---

## Overview

The Atlassian Design System (implemented as **Atlaskit**) is Atlassian's open-source design system for building product interfaces across its suite — Jira, Confluence, Trello, Bitbucket, and others. It is a comprehensive React component library backed by a robust design token system built on semantic role-based naming.

Atlassian's most distinctive architectural feature is its **all-semantic token system**: all consumer-facing tokens are role-based with a structured dot-path naming convention (`color.background.brand.bold`). There are no primitive tokens exposed to consumers — the palette is an internal implementation detail. This is a significant departure from both Material's three-tier system and Carbon's two-tier approach.

A second key feature is the **emphasis tier** baked into token names (`subtlest` → `subtler` → `subtle` → *(default)* → `bold` → `boldest`) — a nuanced system that lets a single role (e.g. `danger`) express a full range of visual weight without requiring new role names.

Key characteristics:
- **All-semantic token architecture:** `color.*`, `elevation.*`, `font.*`, `space.*`, `radius.*`, `border.*`, `motion.*` — no primitive layer exposed to consumers
- **Role + emphasis + state model:** Token names encode property, role, emphasis, and interaction state in one path
- **10 color roles:** neutral, brand, information, success, warning, danger, discovery, accent, inverse, input
- **Light and dark theme support:** tokens resolve to different values per theme; theme switching via `setGlobalTheme()`
- **Atlassian Sans typeface:** Custom typeface for product UI; Charlie Display/Text for brand/marketing
- **Spacing, radius, elevation fully tokenized:** Complete coverage beyond color — a unified token vocabulary across all design decisions
- **Atlaskit package ecosystem:** Each component is a separate package under `@atlaskit/`; `@atlaskit/tokens` is the foundation

**When to reference this system:**
- Enterprise SaaS product interfaces (especially team collaboration tools)
- Reference for all-semantic token architectures (no primitive tier)
- Reference for the role + emphasis + state token naming convention
- Dark mode theming via token system (no manual CSS overrides)
- Full-coverage token systems (color, spacing, radius, elevation, motion all in one package)

**When not to use as primary reference:**
- Consumer-facing mobile apps (not a mobile design system)
- Projects not using React (Atlaskit is React-only)
- Teams that want to manage their own primitive palette

---

## Source Map

| Content Type | Source | Notes |
|---|---|---|
| Guidance | https://atlassian.design/foundations | JS SPA; scraped via Firecrawl |
| Tokens | https://atlassian.design/tokens/design-tokens | JS SPA; token values from CDN package |
| Token package | https://cdn.jsdelivr.net/npm/@atlaskit/tokens@13.0.4/ | npm CDN; `token-default-values.js` for light theme values |
| Source code | https://bitbucket.org/atlassian/atlassian-frontend-mirror | Bitbucket; not GitHub |

---

## Content Inventory

| File Path | Topic | Content Type | Status | Retrieved |
|---|---|---|---|---|
| guidance/foundations/color@2026-05-12.md | Color roles, emphasis levels, interaction states | guidance | latest | 2026-05-12 |
| guidance/foundations/typography@2026-05-12.md | Typefaces, type scale, font tokens | guidance | latest | 2026-05-12 |
| guidance/foundations/design-tokens@2026-05-12.md | Token system, spacing, elevation, border, radius | guidance | latest | 2026-05-12 |
| implementation/getting-started@2026-05-12.md | Installation, token setup, primitives, usage | implementation | latest | 2026-05-12 |
| assets/tokens/colors@2026-05-12.json | Light-theme color + elevation token values | asset | latest | 2026-05-12 |
| design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Atlassian DS | design-md | latest | 2026-05-12 |

**Total files:** 6 versioned content files + 6 redirect stubs

---

## Version History

| Date | Action |
|---|---|
| 2026-05-12 | Initial capture — 6 content files added across guidance (3), implementation (1), assets (1), and design-md (1) |
