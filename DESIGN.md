version: "1.1"
name: Sistema
description: >
  Design system knowledge base and playbook tool for designers and developers
  building, auditing, or maintaining design systems. Bold, typographically driven,
  utilitarian with strong brand expression. Light primary; dark follows
  prefers-color-scheme by default.

stack:
  framework: Next.js 15 (App Router)
  styling: Tailwind CSS v3.4 + CSS custom properties
  tokens: Style Dictionary v5 — source in tokens/semantic/, output to src/styles/tokens/generated.css
  fonts: next/font/google (Inter, Fraunces, JetBrains Mono)
  language: TypeScript

# ─── Colors ──────────────────────────────────────────────────────────────────

colors:
  # Light mode (default)
  canvas: "#FFFFFF"          # page background — pure white, deliberate flat-surface aesthetic
  surface: "#FFFFFF"
  surface-raised: "#FFFFFF"  # cards, panels
  surface-sunken: "#F7F6F2"  # input backgrounds, code blocks
  on-surface: "#0E1116"
  on-surface-muted: "#5B6470"
  on-surface-subtle: "#8A929C"
  border: "#E4E7EB"
  border-strong: "#C9CFD6"
  border-focus: "#0070FF"

  primary: "#0070FF"         # UI components, large text (3:1 on white); use #005CE6 for small text
  on-primary: "#FFFFFF"
  primary-container: "#E8F1FF"
  on-primary-container: "#003A9E"

  secondary: "#FFCC33"       # accent only on light surfaces; non-text or large text
  on-secondary: "#1A1200"

  brand-red: "#E60026"       # logo and deliberate brand moments only — not for error states
  brand-yellow: "#FFCC33"

  error: "#B91C1C"
  on-error: "#FFFFFF"
  success: "#15803D"
  on-success: "#FFFFFF"
  warning: "#B45309"
  on-warning: "#FFFFFF"

  # Dark mode — applied via [data-theme="dark"] (set by prefers-color-scheme)
  dark-canvas: "#0D0D0D"
  dark-surface: "#111111"
  dark-surface-raised: "#1C1C1C"
  dark-surface-overlay: "#252525"
  dark-surface-sunken: "#0A0A0A"
  dark-on-surface: "#F3F4F6"
  dark-on-surface-muted: "#9CA3AF"
  dark-on-surface-subtle: "#6B7280"
  dark-border: "#2D2D2D"
  dark-border-strong: "#3D3D3D"
  dark-primary: "#4D9FFF"
  dark-secondary: "#FFCC33"  # same value — sufficient contrast on dark canvas
  dark-error: "#FCA5A5"
  dark-success: "#4ADE80"
  dark-warning: "#FCD34D"

# ─── Typography ──────────────────────────────────────────────────────────────

fonts:
  sans: "'Inter', system-ui, -apple-system, sans-serif"      # headings, UI, labels
  serif: "'Fraunces', Georgia, 'Times New Roman', serif"     # body text; variable weight + optical sizing (opsz)
  mono: "'JetBrains Mono', 'Cascadia Code', 'Fira Mono', monospace"  # code

typography:
  display:
    fontFamily: sans
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.025em

  heading-xl:
    fontFamily: sans
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em

  heading-lg:
    fontFamily: sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em

  heading-md:
    fontFamily: sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em

  heading-sm:
    fontFamily: sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0em

  body-lg:
    fontFamily: serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0em

  body-md:
    fontFamily: serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0em

  body-sm:
    fontFamily: serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.005em

  label:
    fontFamily: sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em

  caption:
    fontFamily: sans
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.025em

  code:
    fontFamily: mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0em

# ─── Shape ───────────────────────────────────────────────────────────────────

radii:
  none: 0px
  sm: 6px      # tooltips, tags
  md: 10px     # buttons, inputs, form controls
  lg: 16px     # cards, panels
  xl: 22px     # prompt box, large featured surfaces
  full: 9999px # pills, chips, badges

shadows:
  sm: "0 1px 2px rgba(14,17,22,0.05)"
  md: "0 4px 14px rgba(14,17,22,0.06), 0 1px 2px rgba(14,17,22,0.04)"

# ─── Spacing ─────────────────────────────────────────────────────────────────

spacing:
  base-unit: 4px
  approach: >
    Tailwind CSS default spacing scale (multiples of 4px) used via utility classes
    throughout. No custom spacing token file. Backlog: evaluate semantic spacing
    layer via generate-spacing-tokens play.

# ─── Motion ──────────────────────────────────────────────────────────────────

motion:
  stance: minimal
  transitions: "color and opacity only — no transform or layout animations"
  reduced-motion: not yet explicitly implemented

# ─── Do's ────────────────────────────────────────────────────────────────────

dos:
  - Use Fraunces for all body copy; Inter for headings, labels, and UI text
  - Use primary (#0070FF) for interactive elements and large text; use #005CE6 for small text links
  - Use secondary (#FFCC33) as a decorative accent on light surfaces — never as the sole indicator of state
  - Use brand-red (#E60026) only for the logo and intentional brand moments; never for errors
  - Use error/success/warning semantic tokens for all feedback states
  - Keep surfaces flat and white; let border and shadow provide depth, not background tones
  - Use radius-md (10px) for interactive controls, radius-lg (16px) for containers, radius-full for chips
  - Implement dark mode via CSS custom property overrides on [data-theme="dark"] — never inline dark values

# ─── Don'ts ──────────────────────────────────────────────────────────────────

donts:
  - Don't use brand-red (#E60026) for error states — use --color-error (#B91C1C)
  - Don't use secondary yellow (#FFCC33) as body text on light backgrounds — contrast fails at small sizes
  - Don't use Inter for body prose — Fraunces is the designated body typeface
  - Don't write CSS custom properties for tokens directly — edit source JSON in tokens/semantic/ and run npm run tokens
  - Don't hardcode dark mode colors inline — use semantic token variables that resolve per theme
  - Don't add motion or transform animations without considering the minimal-motion stance
