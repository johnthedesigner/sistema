# INDEX.md
# Design System Knowledge Base — Master Index

**Version:** 2.0
**Created:** 2026-05-11
**Last Updated:** 2026-05-12
**Systems Indexed:** 4
**Total Content Files:** 46

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

**Legend:** ✓ = content available · ◑ = partial · — = not yet captured · ⚠ = deprecated

---

## Section 1: By Design System

### Material Design 3
**Slug:** `material` | **Status:** Active | **Last updated:** 2026-05-11

Google's current design system. Best reference for: three-tier token architecture, Dynamic Color, tonal surface elevation, accessibility-first color design, cross-platform (Android/Flutter/Web) targets.

- System index: `kb/design-systems/material/_index.md`
- Guidance: `kb/design-systems/material/guidance/foundations/` (color-system, color-roles, typography, shape, design-tokens)
- Implementation: `kb/design-systems/material/implementation/` (getting-started, tokens/token-schema)
- Assets: `kb/design-systems/material/assets/tokens/` (colors, typography, shape)
- DESIGN.md: `kb/design-systems/material/design-md/DESIGN.md` *(community-generated, unofficial)*

### Atlassian Design System
**Slug:** `atlassian` | **Status:** Active | **Last updated:** 2026-05-12

Atlassian's enterprise product design system (Atlaskit). Best reference for: all-semantic token architecture (no primitive tier exposed), role + emphasis + state token naming (`color.background.brand.bold.hovered`), 10 color roles with multi-level emphasis, full-coverage token vocabulary (color, spacing, radius, elevation, motion, border), dark mode via `setGlobalTheme()`.

- System index: `kb/design-systems/atlassian/_index.md`
- Guidance: `kb/design-systems/atlassian/guidance/foundations/` (color, typography, design-tokens)
- Implementation: `kb/design-systems/atlassian/implementation/` (getting-started)
- Assets: `kb/design-systems/atlassian/assets/tokens/` (colors)
- DESIGN.md: `kb/design-systems/atlassian/design-md/DESIGN.md`

---

### Carbon Design System
**Slug:** `carbon` | **Status:** Active | **Last updated:** 2026-05-12

IBM's enterprise design system. Best reference for: neutral-first flat color palette, two-tier token architecture (primitive + semantic, no component tier), four built-in light/dark themes, productive/expressive type split on IBM Plex, enterprise React component library.

- System index: `kb/design-systems/carbon/_index.md`
- Guidance: `kb/design-systems/carbon/guidance/foundations/` (color-system, typography, themes)
- Implementation: `kb/design-systems/carbon/implementation/` (getting-started)
- Assets: `kb/design-systems/carbon/assets/tokens/` (colors, white-theme)
- DESIGN.md: `kb/design-systems/carbon/design-md/DESIGN.md`

---

## Section 1b: Standards

*Authoritative format specifications and normative standards you conform to. See `_meta/SCHEMA.md` Section 0 for full category definitions.*

### WCAG 2.2
**Slug:** `wcag` | **Status:** Active | **Last updated:** 2026-05-12

W3C normative accessibility standard (October 2023). Covers the criteria most relevant to UI component implementation.

- System index: `kb/standards/wcag/_index.md`
- Color contrast: `kb/standards/wcag/color-contrast@2026-05-12.md` — 1.4.3 (4.5:1/3:1), 1.4.6 (7:1/4.5:1), 1.4.11 (3:1 UI components)
- Keyboard and focus: `kb/standards/wcag/keyboard-and-focus@2026-05-12.md` — 2.1.1 (keyboard), 2.1.2 (no trap), 2.4.7 (focus visible), 2.4.11 (focus not obscured)
- Components: `kb/standards/wcag/components@2026-05-12.md` — 2.5.5 (44×44px), 2.5.8 (24×24px), 4.1.2 (name/role/value)

---

### DESIGN.md Format Specification
**Slug:** `design-md` | **Status:** Active | **Last updated:** 2026-05-12

Google Stitch's specification for a plain-text format that encodes a product's visual language for AI coding agents. Two-layer format: YAML front matter (machine-readable tokens) + markdown body (human-readable rationale). 8 canonical sections with defined conformance behavior.

- System index: `kb/standards/design-md/_index.md`
- Overview: `kb/standards/design-md/overview@2026-05-12.md` — what DESIGN.md is, philosophy, creation paths, minimal example
- Spec: `kb/standards/design-md/spec@2026-05-12.md` — YAML token schema, 8 sections, type system, consumer behavior

---

## Section 1c: Foundations

*Scientific and theoretical underpinnings of design — the why behind design decisions. See `_meta/SCHEMA.md` Section 0 for full category definitions.*

### Color Science
**Slug:** `color` | **Status:** Active | **Last updated:** 2026-05-12

Perceptual color models and contrast algorithms — the scientific basis for why design systems structure color the way they do.

- Section index: `kb/foundations/color/_index.md`
- Perceptual models: `kb/foundations/color/perceptual-models@2026-05-12.md` — HSL, CIELAB, CAM16-UCS, HCT, OKLab; perceptual uniformity; which models CSS, Material, and image tools use
- Contrast and accessibility: `kb/foundations/color/contrast-and-accessibility@2026-05-12.md` — WCAG relative luminance formula, APCA Lc values, tonal palette design for accessibility

---

## Section 2: By Category

*This section cross-references all content across systems by topic category. It allows an LLM to quickly find all available documentation on a given subject regardless of which system it belongs to.*

### 2.1 Color

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/foundations/colors.md` | guidance | latest | 2026-05-11 |
| Material | `kb/design-systems/material/guidance/foundations/color-system.md` | guidance | latest | 2026-05-11 |
| Material | `kb/design-systems/material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |
| Material | `kb/design-systems/material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Carbon | `kb/design-systems/carbon/guidance/foundations/color-system.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/guidance/foundations/themes.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/assets/tokens/colors.json` | asset | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/assets/tokens/white-theme.json` | asset | latest | 2026-05-12 |
| Atlassian | `kb/design-systems/atlassian/guidance/foundations/color.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/design-systems/atlassian/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/design-systems/atlassian/assets/tokens/colors.json` | asset | latest | 2026-05-12 |

### 2.2 Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/foundations/typography.md` | guidance | latest | 2026-05-11 |
| Material | `kb/design-systems/material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |
| Carbon | `kb/design-systems/carbon/guidance/foundations/typography.md` | guidance | latest | 2026-05-12 |
| Atlassian | `kb/design-systems/atlassian/guidance/foundations/typography.md` | guidance | latest | 2026-05-12 |

### 2.3 Spacing and Layout

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.4 Elevation and Depth

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(see Material color-roles — surface container tonal elevation)* | `kb/design-systems/material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |

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
| Material | `kb/design-systems/material/guidance/components/text-field.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/guidance/components/text-input.md` | guidance | latest | 2026-05-12 |

### 2.8 Components — Navigation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/components/navigation-bar.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/guidance/components/ui-shell.md` | guidance | latest | 2026-05-12 |

### 2.9 Components — Buttons and Actions

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/components/button.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/guidance/components/button.md` | guidance | latest | 2026-05-12 |

### 2.10 Components — Overlays and Dialogs

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/components/dialog.md` | guidance | latest | 2026-05-12 |
| Carbon | `kb/design-systems/carbon/guidance/components/modal.md` | guidance | latest | 2026-05-12 |

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
| Material | `kb/design-systems/material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Material | `kb/design-systems/material/implementation/tokens/token-schema.md` | implementation | latest | 2026-05-11 |

### 2.15 Tokens — Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |

### 2.16 Tokens — Spacing

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.17 Getting Started / Installation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/implementation/getting-started.md` | implementation | latest | 2026-05-11 |
| Carbon | `kb/design-systems/carbon/implementation/getting-started.md` | implementation | latest | 2026-05-12 |
| Atlassian | `kb/design-systems/atlassian/implementation/getting-started.md` | implementation | latest | 2026-05-12 |

### 2.18 Design System Shape

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/foundations/shape.md` | guidance | latest | 2026-05-11 |
| Material | `kb/design-systems/material/assets/tokens/shape.json` | asset | latest | 2026-05-11 |

### 2.19 Design Tokens — Architecture

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `kb/design-systems/material/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-11 |

### 2.20 DESIGN.md Files

| System | File | Status | Retrieved | Notes |
|---|---|---|---|---|
| Material | `kb/design-systems/material/design-md/DESIGN.md` | latest | 2026-05-11 | Community-generated, unofficial |
| Carbon | `kb/design-systems/carbon/design-md/DESIGN.md` | latest | 2026-05-12 | Community-generated, unofficial |
| Atlassian | `kb/design-systems/atlassian/design-md/DESIGN.md` | latest | 2026-05-12 | Community-generated, unofficial |

---

## Section 3: Coverage Matrix

*A compact view of which topic areas have been captured for each system. Updated as content is added.*

| Topic | Material | Carbon | Atlassian | Ant Design | Primer | Radix | Lightning |
|---|---|---|---|---|---|---|---|
| Color — Guidance | ✓ | ✓ | ✓ | — | — | — | — |
| Color — Tokens | ◎ | ◎ | ◎ | — | — | — | — |
| Typography — Guidance | ✓ | ✓ | ✓ | — | — | — | — |
| Typography — Tokens | ◎ | — | — | — | — | — | — |
| Spacing — Guidance | — | — | ✓ | — | — | — | — |
| Spacing — Tokens | — | — | ◎ | — | — | — | — |
| Shape / Elevation | ✓◎ | — | ✓◎ | — | — | — | — |
| Design Token Architecture | ✓ | ✓ | ✓ | — | — | — | — |
| Motion | — | — | — | — | — | — | — |
| Iconography | — | — | — | — | — | — | — |
| Button | ✓ | ✓ | — | — | — | — | — |
| Form Elements | ✓ | ✓ | — | — | — | — | — |
| Navigation | ✓ | ✓ | — | — | — | — | — |
| Modals / Dialogs | ✓ | ✓ | — | — | — | — | — |
| Data Display | — | — | — | — | — | — | — |
| Layout Patterns | — | — | — | — | — | — | — |
| State Patterns | — | — | — | — | — | — | — |
| Getting Started | ⚙ | ⚙ | ⚙ | — | — | — | — |
| DESIGN.md | ✓ | ✓ | ✓ | — | — | — | — |

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
| Ant Design | Medium | Large component surface; different design philosophy |
| ~~Primer (GitHub)~~ | ~~Medium~~ | *Captured 2026-05-12 — see `kb/design-systems/primer/`* |
| Radix / Radix Themes | Medium | Modern primitive-first approach; headless-friendly |
| Lightning (Salesforce) | Medium | Enterprise CRM context; very thorough |
