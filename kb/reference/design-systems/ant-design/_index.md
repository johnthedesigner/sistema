# Ant Design — System Index

**Slug:** `ant-design`
**Version captured:** Current as of 2026-05-13
**Maintained by:** Ant Financial / Ant Group
**Status:** Active — open-source enterprise React component library

---

## Overview

Ant Design is a design system created by Ant Financial's User-Experience Design Team for enterprise products. It is the dominant design system in the Chinese tech ecosystem and widely used in enterprise B2B applications globally. The system prioritizes **efficiency, consistency, and certainty** over expressiveness — it is designed to help users complete tasks quickly and reliably in complex data-heavy applications.

Ant Design's defining characteristics compared to other systems in this KB:

- **Design Values as first-class documentation:** Four named values (Natural, Certain, Meaningful, Growing) explicitly govern every design decision. This is unusual — most systems document *what* but not *why*.
- **Restrained color philosophy:** Color is a tool for information delivery, not identity. The system discourages decorative color use and explicitly instructs designers to be "restrained" with color in enterprise contexts.
- **Three-layer algorithmic token architecture:** Seed Tokens → Map Tokens → Alias Tokens. A single seed token change (`colorPrimary`) generates dozens of derivative tokens algorithmically — a more automated approach than Material's manual token vocabulary or Carbon's two-tier system.
- **Chinese/CJK typography considerations:** Documentation acknowledges CJK character considerations in font stack selection and typography scale decisions.
- **Component density modes:** `compactAlgorithm` provides a built-in compact layout preset — not a design variable but an algorithm that recalculates all control heights and spacing proportionally.

**When to reference this system:**
- Enterprise B2B / back-office application design
- Reference for algorithmic token derivation (seed → derivative pattern)
- Reference for design values as governance document structure
- Applications needing programmatic theme generation from a brand color

**When not to use as primary reference:**
- Consumer-facing or expressive product design where color and personality matter
- Non-React implementations (Ant Design is React-first, though community ports exist)

---

## Source Map

| Content type | Source | URL |
|---|---|---|
| Design values / introduction | ant.design/docs/spec | https://ant.design/docs/spec/introduce |
| Color system | ant.design/docs/spec | https://ant.design/docs/spec/colors |
| Typography | ant.design/docs/spec | https://ant.design/docs/spec/font |
| Design token system | ant.design/docs/react | https://ant.design/docs/react/customize-theme |
| Theme editor | ant.design/theme-editor | https://ant.design/theme-editor |

**Scrape notes:** ant.design renders server-side — WebFetch retrieves content successfully. Typography page is at `/docs/spec/font` (not `/docs/spec/typography`); design token page is at `/docs/react/customize-theme` (not `/docs/react/design-token`).

---

## Content Inventory

| Stub path | Topic | Type | Status |
|---|---|---|---|
| `ant-design/guidance/foundations/color-system` | Color — HSB model, 12-color palette, 10-step scales, brand color, functional colors, neutral tokens | guidance | latest |
| `ant-design/guidance/foundations/typography` | Typography — system font stack, 14px base, 10-step scale, weights, CJK considerations, color tokens | guidance | latest |
| `ant-design/guidance/foundations/design-tokens` | Design tokens — Seed/Map/Alias architecture, ConfigProvider, algorithms, token categories and defaults | guidance | latest |
| `ant-design/guidance/foundations/design-values` | Design values — Natural, Certain, Meaningful, Growing; philosophy and enterprise context | guidance | latest |
| `ant-design/design-md/DESIGN` | Ant Design DESIGN.md — visual language specification for AI coding tools | design-md | latest |

---

## Version History

| Date | Change |
|---|---|
| 2026-05-13 | Initial capture — design values, color system, typography, design tokens, DESIGN.md |
