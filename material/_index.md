# Material Design 3 — System Index

**Slug:** `material`
**Version captured:** M3 / Material You (current as of 2026-05-11; includes M3 Expressive)
**Maintained by:** Google
**Status:** Active — primary development target

---

## Overview

Material Design 3 (M3), also called Material You, is Google's current design system — the third major iteration since Material Design launched in 2014. It was publicly released with Android 12 in 2021 and has since expanded across web, Flutter, and Jetpack Compose platforms.

M3's defining philosophical departure from its predecessors is the shift from brand-dictated color to **user-personalized color**. Its Dynamic Color system algorithmically generates an entire UI color scheme from a user's wallpaper or a seed color, meaning an application's visual identity adapts to each individual user. This required a fundamental redesign of how color is modeled: the multi-tier token architecture (reference → system → component) was built specifically to make dynamic theming feasible at scale.

Beyond color, M3 is characterized by:
- **Softness and expressiveness:** Rounded corners, pill-shaped components, tonal elevation over shadows
- **Adaptive layout:** Window Size Classes and Canonical Layouts for phone-to-foldable-to-tablet scaling
- **Accessibility as a core value:** WCAG AA contrast built into tonal palette generation by default
- **M3 Expressive (May 2025):** An expansion adding physics-based motion, emphasized typography styles, and new components for emotionally engaging interactions

**When to reference this system:**
- Consumer mobile applications (Android, cross-platform)
- Products requiring robust light/dark theme support with a single token set
- Any project needing a well-documented multi-tier token architecture as a structural model
- Reference for Dynamic Color implementation patterns
- Adaptive layout across diverse screen sizes (phone, tablet, foldable, desktop)
- When accessibility is a primary constraint — M3's tonal palette system produces accessible contrast by default

**When not to use as primary reference:**
- Enterprise SaaS with dense data layouts (Carbon or Lightning are stronger references)
- Web-only projects — Material Web (`@material/web`) is in maintenance mode; M3 Expressive is not available on web

---

## Source Map

| Content Type | Source | Notes |
|---|---|---|
| Guidance | https://m3.material.io | JavaScript SPA; content accessed via search + material-web.dev |
| Implementation (Web) | https://material-web.dev | Material Web component docs; web token reference |
| Implementation (Android/Compose) | https://developer.android.com/develop/ui/compose/designsystems/material3 | Primary implementation platform |
| Tokens / Assets (Web) | https://github.com/material-components/material-web/tree/main/tokens | SCSS token files |

---

## Content Inventory

| File Path | Topic | Content Type | Status | Retrieved |
|---|---|---|---|---|
| guidance/foundations/colors@2026-05-11.md | Color — consolidated overview | guidance | latest | 2026-05-11 |
| guidance/foundations/color-system@2026-05-11.md | Color system architecture and Dynamic Color | guidance | latest | 2026-05-11 |
| guidance/foundations/color-roles@2026-05-11.md | Color roles catalogue | guidance | latest | 2026-05-11 |
| guidance/foundations/design-tokens@2026-05-11.md | Token tier model (reference/system/component) | guidance | latest | 2026-05-11 |
| guidance/foundations/typography@2026-05-11.md | Typography system — typeface and type scale | guidance | latest | 2026-05-11 |
| guidance/foundations/shape@2026-05-11.md | Shape system — corner radius scale | guidance | latest | 2026-05-11 |
| implementation/getting-started@2026-05-11.md | Web installation and setup | implementation | latest | 2026-05-11 |
| implementation/tokens/token-schema@2026-05-11.md | Token architecture and CSS custom properties | implementation | latest | 2026-05-11 |
| assets/tokens/colors@2026-05-11.json | Color tokens (CSS custom properties) | asset | latest | 2026-05-11 |
| assets/tokens/typography@2026-05-11.json | Typography tokens (CSS custom properties) | asset | latest | 2026-05-11 |
| assets/tokens/shape@2026-05-11.json | Shape tokens (CSS custom properties) | asset | latest | 2026-05-11 |
| design-md/DESIGN@2026-05-11.md | Community DESIGN.md | design-md | latest | 2026-05-11 |

**Total files:** 12 versioned content files + 12 redirect stubs

---

## Version History

| Date | Action |
|---|---|
| 2026-05-11 | Initial capture — 12 content files added across guidance (6), implementation (2), assets (3), and design-md (1) |
