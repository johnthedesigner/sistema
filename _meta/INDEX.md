# INDEX.md
# Design System Knowledge Base — Master Index

**Version:** 1.2
**Created:** 2026-05-11
**Last Updated:** 2026-05-12
**Systems Indexed:** 2
**Total Content Files:** 19

This is the master index for the design system knowledge base. It provides two cross-referenced views of all content: by design system, and by category. Use this file as your first navigation stop in any LLM session before retrieving specific content.

For instructions on how to use this index and the broader knowledge base, see `USAGE_GUIDE.md`.
For instructions on how to update this index when content is added, see `MAINTENANCE.md`.

---

## Quick Reference: Available Systems

| System | Slug | Status | Guidance | Implementation | Assets | DESIGN.md | Last Updated |
|---|---|---|---|---|---|---|---|
| Material Design 3 | `material` | active | ✓ | ✓ | ✓ | ✓ | 2026-05-11 |
| Carbon Design System | `carbon` | active | ✓ | ✓ | ✓ | ✓ | 2026-05-12 |

**Legend:** ✓ = content available · ◑ = partial · — = not yet captured · ⚠ = deprecated

---

## Section 1: By Design System

### Material Design 3
**Slug:** `material` | **Status:** Active | **Last updated:** 2026-05-11

Google's current design system. Best reference for: three-tier token architecture, Dynamic Color, tonal surface elevation, accessibility-first color design, cross-platform (Android/Flutter/Web) targets.

- System index: `material/_index.md`
- Guidance: `material/guidance/foundations/` (color-system, color-roles, typography, shape, design-tokens)
- Implementation: `material/implementation/` (getting-started, tokens/token-schema)
- Assets: `material/assets/tokens/` (colors, typography, shape)
- DESIGN.md: `material/design-md/DESIGN.md` *(community-generated, unofficial)*

### Carbon Design System
**Slug:** `carbon` | **Status:** Active | **Last updated:** 2026-05-12

IBM's enterprise design system. Best reference for: neutral-first flat color palette, two-tier token architecture (primitive + semantic, no component tier), four built-in light/dark themes, productive/expressive type split on IBM Plex, enterprise React component library.

- System index: `carbon/_index.md`
- Guidance: `carbon/guidance/foundations/` (color-system, typography, themes)
- Implementation: `carbon/implementation/` (getting-started)
- Assets: `carbon/assets/tokens/` (colors, white-theme)
- DESIGN.md: `carbon/design-md/DESIGN.md`

---

## Section 2: By Category

*This section cross-references all content across systems by topic category. It allows an LLM to quickly find all available documentation on a given subject regardless of which system it belongs to.*

### 2.1 Color

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/guidance/foundations/colors.md` | guidance | latest | 2026-05-11 |
| Material | `material/guidance/foundations/color-system.md` | guidance | latest | 2026-05-11 |
| Material | `material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |
| Material | `material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Carbon | `carbon/guidance/foundations/color-system.md` | guidance | latest | 2026-05-12 |
| Carbon | `carbon/guidance/foundations/themes.md` | guidance | latest | 2026-05-12 |
| Carbon | `carbon/assets/tokens/colors.json` | asset | latest | 2026-05-12 |
| Carbon | `carbon/assets/tokens/white-theme.json` | asset | latest | 2026-05-12 |

### 2.2 Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/guidance/foundations/typography.md` | guidance | latest | 2026-05-11 |
| Material | `material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |
| Carbon | `carbon/guidance/foundations/typography.md` | guidance | latest | 2026-05-12 |

### 2.3 Spacing and Layout

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.4 Elevation and Depth

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(see Material color-roles — surface container tonal elevation)* | `material/guidance/foundations/color-roles.md` | guidance | latest | 2026-05-11 |

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
| *(none yet)* | | | | |

### 2.8 Components — Navigation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.9 Components — Buttons and Actions

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.10 Components — Overlays and Dialogs

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

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
| Material | `material/assets/tokens/colors.json` | asset | latest | 2026-05-11 |
| Material | `material/implementation/tokens/token-schema.md` | implementation | latest | 2026-05-11 |

### 2.15 Tokens — Typography

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/assets/tokens/typography.json` | asset | latest | 2026-05-11 |

### 2.16 Tokens — Spacing

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| *(none yet)* | | | | |

### 2.17 Getting Started / Installation

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/implementation/getting-started.md` | implementation | latest | 2026-05-11 |
| Carbon | `carbon/implementation/getting-started.md` | implementation | latest | 2026-05-12 |

### 2.18 Design System Shape

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/guidance/foundations/shape.md` | guidance | latest | 2026-05-11 |
| Material | `material/assets/tokens/shape.json` | asset | latest | 2026-05-11 |

### 2.19 Design Tokens — Architecture

| System | File | Content Type | Status | Retrieved |
|---|---|---|---|---|
| Material | `material/guidance/foundations/design-tokens.md` | guidance | latest | 2026-05-11 |

### 2.20 DESIGN.md Files

| System | File | Status | Retrieved | Notes |
|---|---|---|---|---|
| Material | `material/design-md/DESIGN.md` | latest | 2026-05-11 | Community-generated, unofficial |
| Carbon | `carbon/design-md/DESIGN.md` | latest | 2026-05-12 | Community-generated, unofficial |

---

## Section 3: Coverage Matrix

*A compact view of which topic areas have been captured for each system. Updated as content is added.*

| Topic | Material | Carbon | Atlassian | Ant Design | Primer | Radix | Lightning |
|---|---|---|---|---|---|---|---|
| Color — Guidance | ✓ | ✓ | — | — | — | — | — |
| Color — Tokens | ◎ | ◎ | — | — | — | — | — |
| Typography — Guidance | ✓ | ✓ | — | — | — | — | — |
| Typography — Tokens | ◎ | — | — | — | — | — | — |
| Spacing — Guidance | — | — | — | — | — | — | — |
| Spacing — Tokens | — | — | — | — | — | — | — |
| Shape / Elevation | ✓◎ | — | — | — | — | — | — |
| Design Token Architecture | ✓ | ✓ | — | — | — | — | — |
| Motion | — | — | — | — | — | — | — |
| Iconography | — | — | — | — | — | — | — |
| Button | — | — | — | — | — | — | — |
| Form Elements | — | — | — | — | — | — | — |
| Navigation | — | — | — | — | — | — | — |
| Modals / Dialogs | — | — | — | — | — | — | — |
| Data Display | — | — | — | — | — | — | — |
| Layout Patterns | — | — | — | — | — | — | — |
| State Patterns | — | — | — | — | — | — | — |
| Getting Started | ⚙ | ⚙ | — | — | — | — | — |
| DESIGN.md | ✓ | ✓ | — | — | — | — | — |

**Legend:** ✓ guidance · ⚙ implementation · ◎ assets · ✓⚙◎ all three · — not captured

---

## Section 4: Planned Systems

*For the full history of additions and updates to this knowledge base, see `CHANGELOG.md`.*

*Systems identified for future capture, not yet added.*

| System | Priority | Notes |
|---|---|---|
| ~~Carbon (IBM)~~ | ~~High~~ | *Captured 2026-05-12* |
| Atlassian Design System | High | Strong component depth; good rationale documentation |
| Ant Design | Medium | Large component surface; different design philosophy |
| Primer (GitHub) | Medium | Clean and opinionated; strong color system |
| Radix / Radix Themes | Medium | Modern primitive-first approach; headless-friendly |
| Lightning (Salesforce) | Medium | Enterprise CRM context; very thorough |
