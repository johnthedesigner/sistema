---
version: alpha
name: Sistema
description: Design system knowledge base and playbook tool for designers and developers. Bold, utilitarian, typographically driven. Light primary; dark on time-based trigger.

colors:
  primary: "#0070FF"
  secondary: "#FFE135"
  tertiary: "#E60026"
  neutral-0: "#FFFFFF"
  neutral-50: "#F8F9FA"
  neutral-100: "#F1F3F5"
  neutral-200: "#E5E7EB"
  neutral-500: "#6B7280"
  neutral-700: "#374151"
  neutral-900: "#111827"
  dark-surface: "#111111"
  dark-surface-raised: "#1C1C1C"
  dark-surface-overlay: "#252525"
  dark-border: "#2D2D2D"
  dark-text-primary: "#F3F4F6"
  dark-text-secondary: "#9CA3AF"

typography:  # [default — review: Inter not yet configured; add via next/font before shipping]
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0em
  h4:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.02em
  code:
    fontFamily: JetBrains Mono  # [default — review]
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em

rounded:  # [default — review]
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:  # [default — review: 4px base unit]
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-0}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "#0055CC"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-700}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.neutral-0}"
    borderColor: "{colors.neutral-200}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  input-focus:
    borderColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.neutral-0}"
    borderColor: "{colors.neutral-200}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# Sistema Design System

## Overview

Sistema is a knowledge base and playbook tool for designers and developers who build and maintain design systems. The UI handles two modes without switching personalities: text-dense knowledge base reading, and focused step-by-step playbook flows.

The visual stance is bold and utilitarian. The brand palette — electric blue (#0070FF), high-contrast yellow (#FFE135), and red (#E60026) — is graphic and primary in spirit, signaling design expertise and a strong point of view. Color is used as signal and accent, not decoration; typography and spacing carry the layout.

The tone is professional, not clinical. This product has opinions. It should feel like it was made by someone who understands design systems deeply, not assembled from a generic component kit.

Light mode is the primary experience. Dark mode activates via a time-based browser trigger (JavaScript) — not a manual toggle or OS preference. Both themes are fully resolved.

WCAG 2.2 AA applies throughout.

This system does not look like: Notion, Linear, or any gray-on-white productivity default. It does not look like a marketing site or a consumer app.

## Colors

The palette is built on three brand colors and a cool neutral scale. Every text/background pairing must meet 4.5:1 for normal text and 3:1 for UI components and large text.

- **Primary (#0070FF):** Electric blue. Primary interactive actions, links, focus rings. Contrast on white: 3.95:1 — passes for large text and UI components, not for small body text. For body-copy links, use #0055CC (5.9:1 on white). On dark surfaces (#111111), passes at 4.93:1 and may be used freely.
- **Secondary (#FFE135):** High-contrast yellow. Accent use only — badges, highlight fills, decorative borders, non-text emphasis. Must not appear as text or icon on any light surface (1.3:1 on white). On dark surfaces, yellow text passes at 15:1 — use deliberately, not liberally.
- **Tertiary (#E60026):** Brand red. Brand expression, callouts, and emphasis that is not an error state. On white: 4.73:1 (passes AA). On dark (#111111): 4.1:1 — use only for large text or UI components in dark mode. A separate error token (distinct value) must be defined for form validation and error states; do not reuse this value.
- **Neutral scale:** Cool grays. Surfaces, text, borders, and metadata. Not warm-tinted, not blue-tinted.
- **Dark mode surfaces:** Designed explicitly, not inverted from light values. Base: #111111. Raised (cards, panels): #1C1C1C. Overlay (modals, dropdowns): #252525. Elevated surfaces in dark mode use lighter tonals — not darker shadows — to express hierarchy.

## Typography

Two typefaces serve distinct roles. [default — review: neither font is yet configured in the codebase; install via next/font before implementation.]

- **UI and body (Inter):** All interface text, headings, and body copy. Variable weight from 400 (body) to 700 (display). Highly legible at all sizes; excellent variable font support for optical sizing and weight.
- **Code (JetBrains Mono):** Code blocks, token names, CLI examples, and technical data labels. A first-class content type for this product — monospace is not an afterthought. [default — review]

**Scale (9 levels):**

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | 40px | 700 | 1.1 | −0.02em |
| H1 | 32px | 700 | 1.15 | −0.015em |
| H2 | 24px | 600 | 1.2 | −0.01em |
| H3 | 20px | 600 | 1.25 | 0 |
| H4 | 16px | 600 | 1.35 | 0 |
| Body LG | 18px | 400 | 1.7 | 0 |
| Body MD | 16px | 400 | 1.6 | 0 |
| Body SM | 14px | 400 | 1.5 | 0 |
| Label | 12px | 500 | 1 | +0.02em |

Negative letter-spacing applies at Display and H1 — part of the system's confident, compressed voice at large sizes. Tracking is zero from H3 downward, slightly positive for labels only.

## Layout

Two layout modes share the same grid and spacing primitives. [default — review]

- **Knowledge base:** Primary reading column max 720px, optional sidebar. Generous vertical rhythm for extended reading.
- **Playbook flows:** Single-column max 640px. Minimal chrome — step indicator, content, action. No sidebar.
- **Tools (palette, etc.):** Full-width up to 1280px with standard gutter spacing.

12-column grid at desktop, 4-column at mobile. Max content width: 1280px. Page margin: 48px at desktop, 24px at tablet, 16px at mobile.

Spacing scale uses a 4px base unit with named levels (xs–2xl). All component padding, gap, and inset values must reference a scale step — no arbitrary pixel values.

## Elevation & Depth

Depth is achieved through tonal layering, not heavy shadows. Three surface levels:

1. **Page surface:** The background. `neutral-50` (#F8F9FA) in light mode; `dark-surface` (#111111) in dark mode.
2. **Raised surface:** Cards, panels, sidebars. `neutral-0` (white) in light mode; `dark-surface-raised` (#1C1C1C) in dark mode.
3. **Overlay surface:** Modals, dropdowns, tooltips. Light border + single-layer `box-shadow` (low opacity, tight spread) in light mode; `dark-surface-overlay` (#252525) with a subtle border in dark mode.

No heavy drop shadows. Borders carry more visual weight than shadow. In dark mode, elevated surfaces are lighter than the base — not darker.

## Shapes

Four-step radius scale. Personality: minimal and friendly — enough softness to feel approachable, not enough to read as consumer or playful. [default — review]

- **sm (4px):** Small interactive elements — tags, badges, chips, inline code, small icon containers.
- **md (8px):** Primary interactive elements — buttons, text inputs, select controls, form fields.
- **lg (12px):** Container components — cards, panels, modal dialogs, drawers.
- **full (9999px):** Pill shapes — toggle switches, pill badges, avatar containers.

No 0px radius. No component uses a square corner. Radius is consistent within a component family — all buttons use md, all cards use lg.

## Components

- **Buttons:** Primary (blue fill, white text), Secondary (transparent, blue border and text), Ghost (no border, neutral text). Minimum 44px touch target height. Focus ring: 2px solid primary (#0070FF) at 2px offset — passes 3:1 against all system surfaces.
- **Inputs:** White surface, neutral-200 border, md radius, 44px minimum height. Focus: primary border color + 2px focus ring. Error state: distinct error red token (not tertiary). Placeholder: neutral-500.
- **Cards:** White surface on neutral-50 page background. Neutral-200 border. lg radius. In dark mode: dark-surface-raised on dark-surface.
- **Code blocks:** Monospace (JetBrains Mono), 14px. Slightly darker surface — neutral-100 in light, dark-surface-overlay in dark. sm radius. Syntax highlighting palette TBD.
- **Navigation:** Neutral-900 for active items in light mode; dark-text-primary in dark. Neutral-500 for inactive. Primary blue as selected/active state indicator (underline or left border, not fill).
- **Badges/tags:** sm radius. Yellow (#FFE135) fill is the primary accent use — black text on yellow passes 13.5:1. On light-mode surfaces, yellow badges must appear on a colored or dark container, never on white.

## Do's and Don'ts

**Do:**
- Use primary blue (#0070FF) for the single most important interactive element per view — it signals the next action
- Use secondary yellow (#FFE135) as a non-text accent: badge fills, border highlights, decorative emphasis, or text on dark surfaces
- Use tertiary red (#E60026) for brand expression and non-error callouts; define a separate error token for validation states
- Apply negative letter-spacing to Display and H1 headings — it is part of the system's voice
- Check contrast for both light and dark mode when introducing any new color pairing
- Use tonal surface layering (raised/overlay tokens) rather than shadows to express elevation

**Don't:**
- Use #FFE135 as text or an icon color on any light or white surface — it fails contrast at 1.3:1
- Use #E60026 as the error semantic token — it is a brand color; error needs a distinct value
- Use primary blue decoratively — it signals interactivity and loses meaning if applied to non-interactive elements
- Mix radius values outside the scale — buttons are always md, cards are always lg
- Use heavy multi-layer box shadows — one subtle layer maximum; prefer tonal surface differences
- Hardcode any hex, rgb, or spacing px value in a component — all values must reference a token
