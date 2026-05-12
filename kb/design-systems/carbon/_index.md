# Carbon Design System — System Index

**Slug:** `carbon`
**Version captured:** v11 (current as of 2026-05-12)
**Maintained by:** IBM
**Status:** Active — enterprise design system for IBM products

---

## Overview

Carbon is IBM's open-source design system for digital products and experiences. Now in its fourth major iteration (v11), Carbon provides a comprehensive set of working code, design tools, and guidelines for building consistent IBM product interfaces.

Carbon's design philosophy centers on enabling IBM's diverse product portfolio to achieve visual and behavioral consistency without sacrificing team autonomy. It achieves this through a role-based token system that decouples design decisions from implementation — tokens define what a color or type style *does* in the UI, while themes define the actual values. A product team can adopt a dark theme or brand customization by changing token values, not component code.

Key characteristics:
- **Neutral-first color system:** The IBM Design Language gray palette dominates; blue is the single primary action color
- **Four built-in themes:** White and Gray 10 (light), Gray 90 and Gray 100 (dark) — all designed for the full range of IBM product contexts
- **Two-tier token architecture:** Primitive palette (`@carbon/colors`) → semantic role tokens (`@carbon/themes`); no three-tier component token layer
- **Productive/Expressive type split:** A unique typographic model that maintains separate styles for dense product interfaces vs. editorial/marketing contexts using the IBM Plex typeface family
- **IBM Plex typeface:** Carbon's type system is built exclusively on IBM Plex, IBM's open-source typeface

**When to reference this system:**
- Enterprise SaaS and B2B product interfaces with dense, data-heavy layouts
- Products requiring a proven IBM Design Language implementation
- Teams building in React who want a battle-tested enterprise component library
- Reference for neutral-first color systems with a flat palette (no algorithmic generation)
- Reference for two-tier token architectures (primitive + semantic, no component tier)

**When not to use as primary reference:**
- Consumer mobile apps (M3 is stronger for iOS/Android-native feel)
- Projects requiring expressive, personalized, or brand-forward color systems
- Non-React web projects (community libs exist but React is the primary supported target)

---

## Source Map

| Content Type | Source | Notes |
|---|---|---|
| Guidance | https://carbondesignsystem.com | JavaScript SPA; content accessed via Firecrawl |
| Implementation | https://carbondesignsystem.com/developing/ | React framework docs |
| Color palette | https://github.com/carbon-design-system/carbon/blob/main/packages/colors/src/colors.ts | Raw TypeScript source |
| Theme tokens | https://github.com/carbon-design-system/carbon/blob/main/packages/themes/src/white.js | White theme semantic mappings |

---

## Content Inventory

| File Path | Topic | Content Type | Status | Retrieved |
|---|---|---|---|---|
| guidance/foundations/color-system@2026-05-12.md | Color system — themes, tokens, layering model | guidance | latest | 2026-05-12 |
| guidance/foundations/typography@2026-05-12.md | Typography — IBM Plex, type tokens, productive/expressive sets | guidance | latest | 2026-05-12 |
| guidance/foundations/themes@2026-05-12.md | Themes — built-in themes, token categories, customization | guidance | latest | 2026-05-12 |
| implementation/getting-started@2026-05-12.md | React installation, components, styles, icons | implementation | latest | 2026-05-12 |
| assets/tokens/colors@2026-05-12.json | IBM Design Language color palette (all hues, steps 10–100) | asset | latest | 2026-05-12 |
| assets/tokens/white-theme@2026-05-12.json | White theme semantic token assignments | asset | latest | 2026-05-12 |
| design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Carbon | design-md | latest | 2026-05-12 |

**Total files:** 7 versioned content files + 7 redirect stubs

---

## Version History

| Date | Action |
|---|---|
| 2026-05-12 | Initial capture — 7 content files added across guidance (3), implementation (1), assets (2), and design-md (1) |
