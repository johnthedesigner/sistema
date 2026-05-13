# INDEX.md
# Design System Knowledge Base — Master Index

**Version:** 3.0
**Created:** 2026-05-11
**Last Updated:** 2026-05-13
**Systems Indexed:** 7
**Total Content Files:** 83

**KB structure (Phase 6+):** `kb/reference/` contains design-systems, standards, and foundations. `kb/principles/` (new in Phase 6) contains cross-system synthesis documents. App URLs are unchanged — `/kb/design-systems/`, `/kb/standards/`, etc. continue to work; `reference/` does not appear in URLs.

This is the master index for the design system knowledge base. It provides two cross-referenced views of all content: by design system, and by category. Use this file as your first navigation stop in any LLM session before retrieving specific content.

For instructions on how to use this index and the broader knowledge base, see `USAGE_GUIDE.md`.
For instructions on how to update this index when content is added, see `MAINTENANCE.md`.

---

## Quick Reference: Available Systems

| System | Slug | Status | Guidance | Implementation | Assets | DESIGN.md | Last Updated |
|---|---|---|---|---|---|---|---|
| Material Design 3 | `material` | active | ✓ | ✓ | ✓ | ✓ | 2026-05-11 |
| Carbon Design System | `carbon` | active | ✓ | ✓ | ✓ | ✓ | 2026-05-12 |
| Atlassian Design System | `atlassian` | active | ✓ | ✓ | ✓ | ✓ | 2026-05-12 |
| Primer (GitHub) | `primer` | active | ✓ | — | ✓ | ✓ | 2026-05-12 |
| Radix / Radix Themes | `radix` | active | ✓ | ✓ | — | ✓ | 2026-05-13 |
| Ant Design | `ant-design` | active | ✓ | — | — | ✓ | 2026-05-13 |

**Legend:** ✓ = content available · ◑ = partial · — = not yet captured · ⚠ = deprecated

---

## Section 1: By Design System

### Material Design 3
**Slug:** `material` | **Status:** Active | **Last updated:** 2026-05-11

Google's current design system. Best reference for: three-tier token architecture, Dynamic Color, tonal surface elevation, accessibility-first color design, cross-platform (Android/Flutter/Web) targets.

- System index: `kb/reference/design-systems/material/_index.md`
- Guidance: `kb/reference/design-systems/material/guidance/foundations/` (color-system, color-roles, typography, shape, design-tokens)
- Implementation: `kb/reference/design-systems/material/implementation/` (getting-started, tokens/token-schema)
- Assets: `kb/reference/design-systems/material/assets/tokens/` (colors, typography, shape)
- DESIGN.md: `kb/reference/design-systems/material/design-md/DESIGN.md` *(community-generated, unofficial)*

### Atlassian Design System
**Slug:** `atlassian` | **Status:** Active | **Last updated:** 2026-05-12

Atlassian's enterprise product design system (Atlaskit). Best reference for: all-semantic token architecture (no primitive tier exposed), role + emphasis + state token naming (`color.background.brand.bold.hovered`), 10 color roles with multi-level emphasis, full-coverage token vocabulary (color, spacing, radius, elevation, motion, border), dark mode via `setGlobalTheme()`.

- System index: `kb/reference/design-systems/atlassian/_index.md`
- Guidance: `kb/reference/design-systems/atlassian/guidance/foundations/` (color, typography, design-tokens)
- Implementation: `kb/reference/design-systems/atlassian/implementation/` (getting-started)
- Assets: `kb/reference/design-systems/atlassian/assets/tokens/` (colors)
- DESIGN.md: `kb/reference/design-systems/atlassian/design-md/DESIGN.md`

---

### Carbon Design System
**Slug:** `carbon` | **Status:** Active | **Last updated:** 2026-05-12

IBM's enterprise design system. Best reference for: neutral-first flat color palette, two-tier token architecture (primitive + semantic, no component tier), four built-in light/dark themes, productive/expressive type split on IBM Plex, enterprise React component library.

- System index: `kb/reference/design-systems/carbon/_index.md`
- Guidance: `kb/reference/design-systems/carbon/guidance/foundations/` (color-system, typography, themes)
- Implementation: `kb/reference/design-systems/carbon/implementation/` (getting-started)
- Assets: `kb/reference/design-systems/carbon/assets/tokens/` (colors, white-theme)
- DESIGN.md: `kb/reference/design-systems/carbon/design-md/DESIGN.md`

---

### Primer (GitHub)
**Slug:** `primer` | **Status:** Active | **Last updated:** 2026-05-12

GitHub's design system. Best reference for: functional, developer-centric visual language, Octicons icon system, accessible color primitives, CSS custom property tokens.

- System index: `kb/reference/design-systems/primer/_index.md`
- Guidance: `kb/reference/design-systems/primer/guidance/foundations/` (color-system, typography)
- Guidance: `kb/reference/design-systems/primer/guidance/components/` (button)
- DESIGN.md: `kb/reference/design-systems/primer/design-md/DESIGN.md`

---

### Radix / Radix Themes
**Slug:** `radix` | **Status:** Active | **Last updated:** 2026-05-13

WorkOS's config-first React component library built on Radix Primitives. Best reference for: two-axis color model (accent × gray), 12-step semantic color scales, cross-component variant vocabulary (classic/solid/soft/surface/outline/ghost), 9-step spacing scale with global density scaling, single-prop radius system, theme configuration via `<Theme>` props, CSS custom property architecture.

- System index: `kb/reference/design-systems/radix/_index.md`
- Guidance: `kb/reference/design-systems/radix/guidance/foundations/` (color-system, typography, design-tokens, spacing, radius)
- Implementation: `kb/reference/design-systems/radix/implementation/` (getting-started)
- DESIGN.md: `kb/reference/design-systems/radix/design-md/DESIGN.md`

---

### Ant Design
**Slug:** `ant-design` | **Status:** Active | **Last updated:** 2026-05-13

Ant Financial's enterprise design system. Best reference for: explicit design values as governance document (Natural, Certain, Meaningful, Growing), three-layer algorithmic token architecture (Seed → Map → Alias), restrained color philosophy for data-dense enterprise UIs, CJK/Chinese typography considerations, preset density and dark mode algorithms via ConfigProvider.

- System index: `kb/reference/design-systems/ant-design/_index.md`
- Guidance: `kb/reference/design-systems/ant-design/guidance/foundations/` (design-values, color-system, typography, design-tokens)
- DESIGN.md: `kb/reference/design-systems/ant-design/design-md/DESIGN.md`

---

## Section 1b: Standards

*Authoritative format specifications and normative standards you conform to. See `_meta/SCHEMA.md` Section 0 for full category definitions.*

### WCAG 2.2
**Slug:** `wcag` | **Status:** Active | **Last updated:** 2026-05-12

W3C normative accessibility standard (October 2023). Covers the criteria most relevant to UI component implementation.

- System index: `kb/reference/standards/wcag/_index.md`
- Color contrast: `kb/reference/standards/wcag/color-contrast@2026-05-12.md` — 1.4.3 (4.5:1/3:1), 1.4.6 (7:1/4.5:1), 1.4.11 (3:1 UI components)
- Keyboard and focus: `kb/reference/standards/wcag/keyboard-and-focus@2026-05-12.md` — 2.1.1 (keyboard), 2.1.2 (no trap), 2.4.7 (focus visible), 2.4.11 (focus not obscured)
- Components: `kb/reference/standards/wcag/components@2026-05-12.md` — 2.5.5 (44×44px), 2.5.8 (24×24px), 4.1.2 (name/role/value)

---

### DESIGN.md Format Specification
**Slug:** `design-md` | **Status:** Active | **Last updated:** 2026-05-12

Google Stitch's specification for a plain-text format that encodes a product's visual language for AI coding agents. Two-layer format: YAML front matter (machine-readable tokens) + markdown body (human-readable rationale). 8 canonical sections with defined conformance behavior.

- System index: `kb/reference/standards/design-md/_index.md`
- Overview: `kb/reference/standards/design-md/overview@2026-05-12.md` — what DESIGN.md is, philosophy, creation paths, minimal example
- Spec: `kb/reference/standards/design-md/spec@2026-05-12.md` — YAML token schema, 8 sections, type system, consumer behavior

---

## Section 1c: Foundations

*Scientific and theoretical underpinnings of design — the why behind design decisions. See `_meta/SCHEMA.md` Section 0 for full category definitions.*

### Color Science
**Slug:** `color` | **Status:** Active | **Last updated:** 2026-05-12

Perceptual color models and contrast algorithms — the scientific basis for why design systems structure color the way they do.

- Section index: `kb/reference/foundations/color/_index.md`
- Perceptual models: `kb/reference/foundations/color/perceptual-models@2026-05-12.md` — HSL, CIELAB, CAM16-UCS, HCT, OKLab; perceptual uniformity; which models CSS, Material, and image tools use
- Contrast and accessibility: `kb/reference/foundations/color/contrast-and-accessibility@2026-05-12.md` — WCAG relative luminance formula, APCA Lc values, tonal palette design for accessibility

---

### Typography Science
**Slug:** `typography` | **Status:** Active | **Last updated:** 2026-05-13

Modular type scales and legibility — the scientific basis for why design systems structure type the way they do.

- Section index: `kb/reference/foundations/typography/_index.md`
- Type scales: `kb/reference/foundations/typography/type-scales@2026-05-13.md` — ratio mathematics, musical interval basis, classical scale (Bringhurst), common ratios, optical scaling, productive/expressive split, design system scale comparison
- Legibility: `kb/reference/foundations/typography/legibility@2026-05-13.md` — x-height, cap-height, UPM, line height mathematics (120–145% rule, unitless CSS), measure (45–90 chars), the four body-text variables

---

## Section 1d: Principles

*Cross-system synthesis documents. These distill what good looks like across all reference systems. Use as the foundation for building original design systems — not as references to a specific system's approach.*

### Spacing and Layout
**Topic:** `layout` | **Status:** Active | **Last updated:** 2026-05-13

Base unit selection (4px vs. 8px), the scale as a unified system, density axis, content-first breakpoint philosophy, responsive token approaches.

- Section index: `kb/principles/spacing/_index.md`
- Layout: `kb/principles/spacing/layout@2026-05-13.md`

### Shape Architecture
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

Border radius as personality signal, named/numeric/global-factor scale approaches, component family consistency, pill shape usage.

- Section index: `kb/principles/shape/_index.md`
- Architecture: `kb/principles/shape/architecture@2026-05-13.md`

### Depth and Elevation
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

Shadow-based vs. tonal surface elevation models, when to use each, the hybrid approach for dual-mode products, layering rules, z-index scale pattern.

- Section index: `kb/principles/depth/_index.md`
- Architecture: `kb/principles/depth/architecture@2026-05-13.md`

### Motion Architecture
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

Easing semantics (enter/exit/move), duration guidelines, functional vs. expressive stance, `prefers-reduced-motion` requirement, composite token structure.

- Section index: `kb/principles/motion/_index.md`
- Architecture: `kb/principles/motion/architecture@2026-05-13.md`

---

### Typography Architecture
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

Density axis, scale construction (modular vs. hand-tuned with ratio selection guide), role taxonomy (named roles vs. numeric steps), non-negotiable legibility constraints, variable fonts, and the relationship between typography and spacing.

- Section index: `kb/principles/typography/_index.md`
- Architecture: `kb/principles/typography/architecture@2026-05-13.md` — density axis first; ratio selection by context; named role vs. numeric step decision framework; line height per role (non-negotiable), measure 45–90 chars, letter-spacing direction by size, x-height and apparent size; variable font decision framework; spacing-typography interaction

---

### Color Architecture
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

The four architectural models (tonal palettes, step scales, named palettes, contextual tokens) with decision framework, non-negotiable floor, dark mode tonal shift logic, and neutral palette design.

- Section index: `kb/principles/color/_index.md`
- Architecture: `kb/principles/color/architecture@2026-05-13.md` — four models with "use when" framing, decision framework (3 questions), non-negotiable floor (contrast minimums, foreground pairings, never-hardcode), dark mode tonal shift logic, neutral chroma decisions

---

### Token Architecture
**Topic:** `architecture` | **Status:** Active | **Last updated:** 2026-05-13

The tier model, naming principles, dark mode approaches, required categories, and common failure modes for design token systems.

- Section index: `kb/principles/tokens/_index.md`
- Architecture: `kb/principles/tokens/architecture@2026-05-13.md` — tier model (primitive → semantic → component), naming for role vs. value, three dark mode approaches and tradeoffs, required vs. optional categories, decision framework

---

### Accessibility Floor
**Topic:** `floor` | **Status:** Active | **Last updated:** 2026-05-13

WCAG 2.2 AA requirements stated as constraints with verification methods. Covers color contrast, keyboard navigation, focus visibility, touch targets, semantic structure and ARIA, motion accommodation, and text readability.

- Section index: `kb/principles/accessibility/_index.md`
- Floor: `kb/principles/accessibility/floor@2026-05-13.md` — 1.4.3 normal text 4.5:1 / large 3:1; 1.4.11 UI components 3:1; dark mode separate + APCA supplemental; no raw values; 2.1.1 keyboard; 2.1.2 no trap; 2.4.7 focus visible; 2.4.11 not obscured; 2.5.8 24×24 AA; 2.5.5 44×44 industry standard; semantic HTML first; accessible names; ARIA state; prefers-reduced-motion; 16px body min; 90-char measure; 1.5 line height

---

## Section 2: By Category

*This section cross-references all content across systems by topic category. It allows an LLM to quickly find all available documentation on a given subject regardless of which system it belongs to.*

### 2.1 Color

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/foundations/colors.md` | guidance | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/guidance/foundations/color-system.md` | guidance | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Carbon | `kb/reference/design-systems/carbon/guidance/foundations/color-system.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/guidance/foundations/themes.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/assets/tokens/colors.json` | asset | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/assets/tokens/white-theme.json` | asset | latest | 2026-05-12 |
| Atlassian | `kb/reference/design-systems/atlassian/guidance/foundations/color.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/reference/design-systems/atlassian/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/reference/design-systems/atlassian/assets/tokens/colors.json` | asset | latest | 2026-05-12 |
| Ant Design | `kb/reference/design-systems/ant-design/guidance/foundations/color-system.md` | guidance | latest | 2026-05-13 |

### 2.2 Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/foundations/typography.md` | guidance | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |
| Carbon | `kb/reference/design-systems/carbon/guidance/foundations/typography.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/reference/design-systems/atlassian/guidance/foundations/typography.md` | guidance | latest | 2026-05-12 |
| Ant Design | `kb/reference/design-systems/ant-design/guidance/foundations/typography.md` | guidance | latest | 2026-05-13 |

### 2.3 Spacing and Layout

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Atlassian | `kb/reference/design-systems/atlassian/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-12 |
| Radix | `kb/reference/design-systems/radix/guidance/foundations/spacing.md` | guidance | latest | 2026-05-13 |

### 2.4 Elevation and Depth

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(see Material color-roles — surface container tonal elevation)* | `kb/reference/design-systems/material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |

### 2.5 Motion and Animation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.6 Iconography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.7 Components — Form Elements

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/components/text-field.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/guidance/components/text-input.md` | guidance | latest | 2026-05-12 |

### 2.8 Components — Navigation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/components/navigation-bar.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/guidance/components/ui-shell.md` | guidance | latest | 2026-05-12 |

### 2.9 Components — Buttons and Actions

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/components/button.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/guidance/components/button.md` | guidance | latest | 2026-05-12 |

### 2.10 Components — Overlays and Dialogs

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/components/dialog.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/reference/design-systems/carbon/guidance/components/modal.md` | guidance | latest | 2026-05-12 |

### 2.11 Components — Data Display

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.12 Patterns — Page Layout

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.13 Patterns — States (Empty, Loading, Error)

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.14 Tokens — Color

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/implementation/tokens/token-schema.md` | implementation | latest | 2026-05-11 |

### 2.15 Tokens — Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |

### 2.16 Tokens — Spacing

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.17 Getting Started / Installation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/implementation/getting-started.md` | implementation | latest | 2026-05-11 |
| Carbon | `kb/reference/design-systems/carbon/implementation/getting-started.md` | implementation | latest | 2026-05-12 |
| Atlassian | `kb/reference/design-systems/atlassian/implementation/getting-started.md` | implementation | latest | 2026-05-12 |

### 2.18 Design System Shape

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/foundations/shape.md` | guidance | latest | 2026-05-11 |
| Material | `kb/reference/design-systems/material/assets/tokens/shape.json` | asset | latest | 2026-05-11 |

### 2.19 Design Tokens — Architecture

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-11 |

### 2.20 DESIGN.md Files

| System | File | Status | Retrieved | Notes |
|---|---|---|---|---|
| Material | `kb/reference/design-systems/material/design-md/DESIGN.md` | latest | 2026-05-11 | Community-generated, unofficial |
| Carbon | `kb/reference/design-systems/carbon/design-md/DESIGN.md` | latest | 2026-05-12 | Community-generated, unofficial |
| Atlassian | `kb/reference/design-systems/atlassian/design-md/DESIGN.md` | latest | 2026-05-12 | Community-generated, unofficial |

### 2.21 Foundations — Typography Science

| Source | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Foundations | `kb/reference/foundations/typography/type-scales.md` | guidance | latest | 2026-05-13 |
| Foundations | `kb/reference/foundations/typography/legibility.md` | guidance | latest | 2026-05-13 |

---

## Section 3: Coverage Matrix

*A compact view of which topic areas have been captured for each system. Updated as content is added.*

| Topic | Material | Carbon | Atlassian | Ant Design | Primer | Radix | Lightning |
|---|---|---|---|---|---|---|---|
| Color — Guidance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Color — Tokens | ◎ | ◎ | ◎ | — | — | — | — |
| Typography — Guidance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Typography — Tokens | ◎ | — | — | — | — | — | — |
| Spacing — Guidance | — | — | ✓ | — | — | ✓ | — |
| Spacing — Tokens | — | — | ◎ | — | — | — | — |
| Shape / Elevation | ✓◎ | — | ✓◎ | — | — | ✓ | — |
| Design Token Architecture | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Design Values / Philosophy | — | — | — | ✓ | — | — | — |
| Motion | — | — | — | — | — | — | — |
| Iconography | — | — | — | — | — | — | — |
| Button | ✓ | ✓ | — | — | ✓ | — | — |
| Form Elements | ✓ | ✓ | — | — | — | — | — |
| Navigation | ✓ | ✓ | — | — | — | — | — |
| Modals / Dialogs | ✓ | ✓ | — | — | — | — | — |
| Data Display | — | — | — | — | — | — | — |
| Layout Patterns | — | — | — | — | — | — | — |
| State Patterns | — | — | — | — | — | — | — |
| Getting Started | ⚙ | ⚙ | ⚙ | — | — | ⚙ | — |
| DESIGN.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |

**Legend:** ✓ guidance · ⚙ implementation · ◎ assets · ✓⚙◎ all three · — not captured

---

## Section 4: Planned Systems

*For the full history of additions and updates to this knowledge base, see `CHANGELOG.md`.*

*Systems identified for future capture, not yet added.*

| System | Priority | Notes |
|---|---|---|
| ~~Carbon (IBM)~~ | ~~High~~ | *Captured 2026-05-12* |
| ~~Atlassian Design System~~ | ~~High~~ | *Captured 2026-05-12* |
| Google Stitch | High | Created the DESIGN.md format; native AI-first design system; spec at stitch.withgoogle.com |
| Claude Design | High | Anthropic's design language; directly relevant to Claude Code / AI tool UI patterns |
| ~~Ant Design~~ | ~~Medium~~ | *Captured 2026-05-13 — see `kb/reference/design-systems/ant-design/`* |
| ~~Primer (GitHub)~~ | ~~Medium~~ | *Captured 2026-05-12 — see `kb/reference/design-systems/primer/`* |
| ~~Radix / Radix Themes~~ | ~~Medium~~ | *Captured 2026-05-12 — see `kb/reference/design-systems/radix/`* |
| Radix / Radix Themes | Medium | Modern primitive-first approach; headless-friendly |
| Lightning (Salesforce) | Medium | Enterprise CRM context; very thorough |
