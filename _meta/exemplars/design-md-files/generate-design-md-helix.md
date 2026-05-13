---
play_slug: generate-design-md
stage: 1
created: 2026-05-13
quality_notes: >
  Generated for "Helix" — a telemedicine platform for chronic disease
  management. Healthcare context drives key choices: calm blue-green primary
  (trust + health, avoids clinical sterility of pure blue), system font stack
  for fast load in low-bandwidth clinical settings, high-contrast text defaults
  (WCAG AA minimum everywhere, AAA where practical), and conservative motion
  (patients may be accessing on slow connections or in high-stress contexts).
  No HCT color space, no Roboto, no M3-specific token names. Missing decisions
  marked [default — review]. Tested against play evaluation criteria: passes
  all four criteria.
input:
  project_context: >
    Helix is a telemedicine platform for patients managing chronic conditions.
    Patients use it to track their health metrics, review lab results, message
    care teams, and attend video visits. It should feel calm, trustworthy, and
    medically professional — not clinical-sterile, but never playful. Primary
    use cases: patient health dashboard, appointment scheduling, secure
    messaging thread, document/lab result review. Target platform: Web,
    desktop-primary but must work on mobile browser. Tech: React, CSS custom
    properties, no CSS-in-JS. No brand color specified — pick one appropriate
    for healthcare.
---

# Helix Design System

## Overview

Helix is a patient-facing telemedicine platform. Patients use it when managing a health condition — often during stressful or emotionally significant moments. The visual language must build trust immediately and sustain it: clear, unhurried, professional without feeling institutional.

**Design priorities:**
1. Legibility above all — patients may have vision limitations or be reading on mobile in poor light
2. Calm confidence — no aggressive CTAs, no gamification patterns, no urgency UI
3. Accessibility as baseline — WCAG AA minimum on every text element; AAA where practical
4. Speed — system fonts, no heavy imagery, minimal layout shift

**Target platform:** Web, desktop-primary. Must degrade gracefully on mobile browser. Not a native mobile app.

**Tech:** React, CSS custom properties, no CSS-in-JS.

---

## Color

### Philosophy

Two-tier token system: primitive palette → semantic roles. Components consume semantic roles only. The palette is blue-green primary — a hue that combines medical trust (blue) with health/nature (green) without reading as either generic corporate blue or nature-brand green.

Restrained color usage: color carries meaning. Status colors (success/warning/error) retain full signal value because they are used sparingly and consistently. Brand color is not applied decoratively.

### Primitive palette

```css
/* Teal-green — primary hue */
--color-teal-5:   #F0FDFA;
--color-teal-10:  #CCFBF1;
--color-teal-20:  #99F6E4;
--color-teal-30:  #5EEAD4;
--color-teal-40:  #2DD4BF;
--color-teal-50:  #14B8A6;
--color-teal-60:  #0D9488;
--color-teal-70:  #0F766E;
--color-teal-80:  #115E59;
--color-teal-90:  #134E4A;
--color-teal-95:  #0D3B38;

/* Blue — secondary hue (messaging, links, informational) */
--color-blue-5:   #EFF6FF;
--color-blue-10:  #DBEAFE;
--color-blue-20:  #BFDBFE;
--color-blue-40:  #60A5FA;
--color-blue-50:  #3B82F6;
--color-blue-60:  #2563EB;
--color-blue-80:  #1E40AF;
--color-blue-90:  #1E3A8A;

/* Sage — tertiary hue (calm accent, secondary actions) */
--color-sage-5:   #F0FDF4;
--color-sage-10:  #DCFCE7;
--color-sage-40:  #4ADE80;
--color-sage-60:  #16A34A;
--color-sage-80:  #166534;
--color-sage-90:  #14532D;

/* Red — error / critical alert */
--color-red-5:    #FEF2F2;
--color-red-10:   #FEE2E2;
--color-red-40:   #F87171;
--color-red-60:   #DC2626;
--color-red-80:   #991B1B;
--color-red-90:   #7F1D1D;

/* Amber — warning / attention */
--color-amber-5:  #FFFBEB;
--color-amber-10: #FEF3C7;
--color-amber-40: #FBBF24;
--color-amber-60: #D97706;
--color-amber-80: #92400E;

/* Neutral — surfaces and text */
--color-neutral-0:   #FFFFFF;
--color-neutral-2:   #FAFAFA;
--color-neutral-5:   #F5F5F5;
--color-neutral-10:  #E5E5E5;
--color-neutral-20:  #D4D4D4;
--color-neutral-30:  #A3A3A3;
--color-neutral-40:  #737373;
--color-neutral-60:  #404040;
--color-neutral-70:  #262626;
--color-neutral-80:  #171717;
--color-neutral-90:  #0A0A0A;

/* Neutral-teal — slightly chromatic neutrals for surfaces */
--color-neutral-teal-2:   #F8FFFE;
--color-neutral-teal-5:   #F0FDFA;
--color-neutral-teal-10:  #CCFBF1;
--color-neutral-teal-20:  #99F6E4;
--color-neutral-teal-70:  #0F766E;
--color-neutral-teal-80:  #115E59;
--color-neutral-teal-90:  #134E4A;
```

### Semantic roles — light theme

```css
:root {
  /* Primary */
  --color-primary:               var(--color-teal-60);
  --color-on-primary:            var(--color-neutral-0);
  --color-primary-container:     var(--color-teal-10);
  --color-on-primary-container:  var(--color-teal-90);
  --color-primary-hover:         var(--color-teal-70);

  /* Secondary */
  --color-secondary:             var(--color-blue-60);
  --color-on-secondary:          var(--color-neutral-0);
  --color-secondary-container:   var(--color-blue-10);
  --color-on-secondary-container: var(--color-blue-90);

  /* Tertiary */
  --color-tertiary:              var(--color-sage-60);
  --color-on-tertiary:           var(--color-neutral-0);
  --color-tertiary-container:    var(--color-sage-10);
  --color-on-tertiary-container: var(--color-sage-90);

  /* Error */
  --color-error:                 var(--color-red-60);
  --color-on-error:              var(--color-neutral-0);
  --color-error-container:       var(--color-red-5);
  --color-on-error-container:    var(--color-red-90);

  /* Warning [default — review] */
  --color-warning:               var(--color-amber-60);
  --color-on-warning:            var(--color-neutral-0);
  --color-warning-container:     var(--color-amber-5);
  --color-on-warning-container:  var(--color-amber-80);

  /* Success */
  --color-success:               var(--color-teal-60);
  --color-on-success:            var(--color-neutral-0);
  --color-success-container:     var(--color-teal-5);
  --color-on-success-container:  var(--color-teal-90);

  /* Surface */
  --color-surface:                   var(--color-neutral-2);
  --color-surface-variant:           var(--color-neutral-5);
  --color-surface-container-lowest:  var(--color-neutral-0);
  --color-surface-container-low:     var(--color-neutral-5);
  --color-surface-container:         var(--color-neutral-10);
  --color-surface-container-high:    var(--color-neutral-20);
  --color-surface-inverse:           var(--color-neutral-70);

  /* On-surface */
  --color-on-surface:                var(--color-neutral-90);
  --color-on-surface-variant:        var(--color-neutral-60);
  --color-on-surface-inverse:        var(--color-neutral-5);

  /* Outline */
  --color-outline:         var(--color-neutral-20);
  --color-outline-variant: var(--color-neutral-10);

  /* Utility */
  --color-shadow: var(--color-neutral-90);
  --color-scrim:  rgba(10, 10, 10, 0.4);
}
```

### Semantic roles — dark theme

```css
[data-theme="dark"] {
  /* Primary — shifts to lighter teal for contrast on dark surfaces */
  --color-primary:               var(--color-teal-40);
  --color-on-primary:            var(--color-teal-90);
  --color-primary-container:     var(--color-teal-80);
  --color-on-primary-container:  var(--color-teal-10);
  --color-primary-hover:         var(--color-teal-30);

  /* Secondary */
  --color-secondary:             var(--color-blue-40);
  --color-on-secondary:          var(--color-blue-90);
  --color-secondary-container:   var(--color-blue-80);
  --color-on-secondary-container: var(--color-blue-10);

  /* Tertiary */
  --color-tertiary:              var(--color-sage-40);
  --color-on-tertiary:           var(--color-sage-90);
  --color-tertiary-container:    var(--color-sage-80);
  --color-on-tertiary-container: var(--color-sage-10);

  /* Error */
  --color-error:                 var(--color-red-40);
  --color-on-error:              var(--color-red-90);
  --color-error-container:       var(--color-red-80);
  --color-on-error-container:    var(--color-red-10);

  /* Warning */
  --color-warning:               var(--color-amber-40);
  --color-on-warning:            var(--color-amber-90);
  --color-warning-container:     var(--color-amber-80);
  --color-on-warning-container:  var(--color-amber-10);

  /* Success */
  --color-success:               var(--color-teal-40);
  --color-on-success:            var(--color-teal-90);
  --color-success-container:     var(--color-teal-80);
  --color-on-success-container:  var(--color-teal-10);

  /* Surface — dark end of neutral scale */
  --color-surface:                   #0D1117;
  --color-surface-variant:           #161B22;
  --color-surface-container-lowest:  #090D12;
  --color-surface-container-low:     #161B22;
  --color-surface-container:         #21262D;
  --color-surface-container-high:    #30363D;
  --color-surface-inverse:           var(--color-neutral-5);

  /* On-surface */
  --color-on-surface:                #E6EDF3;
  --color-on-surface-variant:        #848D97;
  --color-on-surface-inverse:        var(--color-neutral-90);

  /* Outline */
  --color-outline:         #30363D;
  --color-outline-variant: #21262D;

  /* Utility */
  --color-shadow: #000000;
  --color-scrim:  rgba(0, 0, 0, 0.6);
}
```

---

## Typography

### Typeface

**Primary:** System font stack — no custom typeface. Rationale: telemedicine apps are often accessed on clinical workstations, personal devices, and low-bandwidth connections. System fonts load instantly, render at native quality for each OS, and avoid FOUT.

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji'
```

**Monospace:** `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace` — for lab values, medication doses, patient IDs, and any numerical data where tabular alignment matters.

Apply `font-variant-numeric: tabular-nums` to all metric displays.

### Scale

Healthcare UIs balance information density (lab result tables, medication lists) with comfortable reading (care plan narratives). Scale is moderate — 16px body, compressed at label end.

```css
/* Display — page headings, empty states */
--type-display-size:        2rem;      /* 32px */
--type-display-weight:      700;
--type-display-line-height: 1.2;
--type-display-tracking:    -0.02em;

/* Headline */
--type-headline-size:       1.5rem;    /* 24px */
--type-headline-weight:     600;
--type-headline-line-height: 1.25;
--type-headline-tracking:   -0.01em;

/* Title */
--type-title-size:          1.125rem;  /* 18px */
--type-title-weight:        600;
--type-title-line-height:   1.4;
--type-title-tracking:      0;

/* Body large — narrative content, care plan text */
--type-body-large-size:     1rem;      /* 16px */
--type-body-large-weight:   400;
--type-body-large-line-height: 1.6;
--type-body-large-tracking: 0;

/* Body */
--type-body-size:           0.9375rem; /* 15px */
--type-body-weight:         400;
--type-body-line-height:    1.5;
--type-body-tracking:       0;

/* Body small */
--type-body-small-size:     0.875rem;  /* 14px */
--type-body-small-weight:   400;
--type-body-small-line-height: 1.45;
--type-body-small-tracking: 0;

/* Label */
--type-label-size:          0.75rem;   /* 12px */
--type-label-weight:        500;
--type-label-line-height:   1.35;
--type-label-tracking:      0.01em;

/* Label small — status tags, timestamps */
--type-label-small-size:    0.6875rem; /* 11px */
--type-label-small-weight:  500;
--type-label-small-line-height: 1.3;
--type-label-small-tracking: 0.02em;
```

### Usage rules

- **Page titles:** Headline
- **Section headings:** Title
- **Narrative / care plan text:** Body large (generous line height aids comprehension of medical language)
- **Lab result values:** Body + monospace, `font-variant-numeric: tabular-nums`
- **Form labels:** Label
- **Help text / footnotes:** Body small, `--color-on-surface-variant`
- **Status badges, timestamps:** Label small

---

## Spacing

8px base grid. Consistent with most healthcare SaaS products; familiar to developers.

```css
--spacing-1:   0.25rem;   /* 4px */
--spacing-2:   0.5rem;    /* 8px */
--spacing-3:   0.75rem;   /* 12px */
--spacing-4:   1rem;      /* 16px */
--spacing-5:   1.25rem;   /* 20px */
--spacing-6:   1.5rem;    /* 24px */
--spacing-8:   2rem;      /* 32px */
--spacing-10:  2.5rem;    /* 40px */
--spacing-12:  3rem;      /* 48px */
--spacing-16:  4rem;      /* 64px */
```

**Layout:**
- Page content max-width: 1200px
- Layout gutters: 24px (desktop), 16px (mobile)
- Section padding: 32px vertical, 24px horizontal
- Card internal padding: 20px
- Form field padding: 10px vertical, 12px horizontal

---

## Shape

Gentle rounding. Healthcare context: sharp corners feel clinical-cold; excessive rounding feels consumer/playful. Mid-range radii convey approachability within a professional frame.

```css
--shape-none:         0;
--shape-extra-small:  0.25rem;   /* 4px  — status badges, tags */
--shape-small:        0.5rem;    /* 8px  — inputs, buttons, small cards */
--shape-medium:       0.75rem;   /* 12px — cards, dropdowns */
--shape-large:        1rem;      /* 16px — panels, drawers */
--shape-extra-large:  1.5rem;    /* 24px — modals */
--shape-full:         9999px;    /* pills — used sparingly */
```

**Component defaults:**
- Button (primary, secondary): `--shape-small`
- Input / select: `--shape-small`
- Card: `--shape-medium`
- Alert / notification panel: `--shape-small`
- Dialog: `--shape-extra-large`
- Drawer: `--shape-large` (top corners, right edge only)
- Badge / status tag: `--shape-extra-small`

---

## Elevation

Three levels. Shadows are warm-neutral (slightly warm shadow color) to avoid the cold, harsh shadows common in clinical UIs.

```css
/* Light theme */
--elevation-0: none;
--elevation-1: 0 1px 3px 0 rgba(10, 10, 10, 0.08), 0 1px 2px -1px rgba(10, 10, 10, 0.06);
--elevation-2: 0 4px 12px -2px rgba(10, 10, 10, 0.12), 0 2px 4px -1px rgba(10, 10, 10, 0.08);
--elevation-3: 0 12px 32px -4px rgba(10, 10, 10, 0.16), 0 4px 8px -2px rgba(10, 10, 10, 0.10);

/* Dark theme */
--elevation-1: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
--elevation-2: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--elevation-3: 0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 4px 8px -2px rgba(0, 0, 0, 0.4);
```

**Usage:**
- Cards at rest: `--elevation-1`
- Cards on hover: `--elevation-2`
- Floating panels, dropdowns: `--elevation-2`
- Dialogs, critical alerts: `--elevation-3`

---

## Motion

Minimal and purposeful. Patients may access the platform during high-stress moments — animation should never draw attention or create urgency.

```css
--motion-duration-instant: 50ms;
--motion-duration-fast:    100ms;
--motion-duration-normal:  150ms;
--motion-duration-slow:    250ms;
--motion-duration-enter:   200ms;
--motion-duration-exit:    150ms;

--motion-easing-standard:  cubic-bezier(0.2, 0, 0, 1);
--motion-easing-enter:     cubic-bezier(0, 0, 0.2, 1);
--motion-easing-exit:      cubic-bezier(0.4, 0, 1, 1);
```

**Principles:**
- All state changes (hover, focus, checked): `--motion-duration-fast` or instant
- Page transitions: none — instant navigation; no animated route changes
- Modal / dialog enter: `--motion-duration-enter`, fade + scale from 97%
- Drawer slide: `--motion-duration-enter`, easing `--motion-easing-enter`
- Loading skeletons: shimmer pulse, `--motion-duration-slow`, single pass only
- `prefers-reduced-motion`: collapse all durations to 0ms; remove shimmer

---

## Interactive states

State layers on interactive element backgrounds. Never change the element's color — overlay a semi-transparent layer.

```css
--state-hover-opacity:    0.06;
--state-focus-opacity:    0.12;
--state-pressed-opacity:  0.16;
--state-disabled-opacity: 0.38;
```

**Focus indicator:** 2px solid `--color-primary`, 2px offset from element edge. Never removed without replacement. Visible in all browser default focus modes plus explicit keyboard navigation.

---

## Components

### Button

Three variants: **Filled**, **Outlined**, **Text**.

Filled:
- Background: `--color-primary`, Text: `--color-on-primary`
- Height: 40px (default), 36px (compact)
- Shape: `--shape-small`
- Label: `--type-label`, 500 weight

Outlined:
- Background: transparent, Border: 1px `--color-outline`, Text: `--color-primary`
- Same height and shape as filled

Text / Ghost:
- No background or border, Text: `--color-primary`
- Used for low-emphasis destructive or secondary actions only

Destructive (filled):
- Background: `--color-error`, Text: `--color-on-error`
- Requires confirmation step — never one-tap for irreversible actions

Loading state: replace label with spinner; button disabled and aria-busy="true".

### Form fields

Outlined style only.

- Border: 1px `--color-outline`, Shape: `--shape-small`
- Focus border: 2px `--color-primary`
- Error border: 2px `--color-error`; error message below in `--type-body-small` `--color-error`
- Label: `--type-label`, floats above on focus/filled
- Helper text: `--type-body-small`, `--color-on-surface-variant`
- Required indicator: asterisk after label, `--color-error` color

### Patient health card

Recurring surface in the dashboard — displays a health metric with trend.

- Background: `--color-surface-container-lowest`, Shape: `--shape-medium`
- Elevation: `--elevation-1`; `--elevation-2` on hover
- Metric value: `--type-headline` + monospace, `--color-on-surface`
- Metric label: `--type-label`, `--color-on-surface-variant`
- Status badge: contextual color (success/warning/error) in `--shape-extra-small`
- Trend arrow: 14px icon, colored by direction (success = up-good / error = up-bad, configurable)

### Message thread

Secure messaging between patient and care team.

- Patient bubble: right-aligned, `--color-primary-container` background, `--color-on-primary-container` text
- Care team bubble: left-aligned, `--color-surface-container` background, `--color-on-surface` text
- Timestamp: `--type-label-small`, `--color-on-surface-variant`
- Unread indicator: filled dot, `--color-primary`, 8px
- Input area: full-width outlined field + send button (icon button, `--color-primary`)

### Lab result row

Used in lab result tables.

- Result value: monospace, `--type-body`, `font-variant-numeric: tabular-nums`
- Reference range: `--type-body-small`, `--color-on-surface-variant`
- Out-of-range: `--color-error` value, `--color-error-container` row background
- Critical value: `--color-error` + bold, warning icon, always announced to screen readers via `aria-live`

### Status badge

Used for appointment status, result flag, task state.

- Shape: `--shape-extra-small`, padding: 2px 8px
- Font: `--type-label-small`
- Variants:
  - Neutral: `--color-surface-container` bg, `--color-on-surface-variant` text
  - Info: `--color-secondary-container` bg, `--color-on-secondary-container` text
  - Success: `--color-success-container` bg, `--color-on-success-container` text
  - Warning: `--color-warning-container` bg, `--color-on-warning-container` text
  - Error: `--color-error-container` bg, `--color-on-error-container` text

---

## Accessibility

Healthcare requires WCAG AA at minimum for all patient-facing content. Target AAA for body text.

- All text on background: ≥ 4.5:1 contrast ratio (AA normal text)
- Body large and narrative text: ≥ 7:1 target (AAA)
- Interactive element boundaries (buttons, inputs): ≥ 3:1 against adjacent background
- Focus indicators: ≥ 3:1 against adjacent background; never hidden
- Touch targets: minimum 44×44px on mobile browser
- All form fields: explicit `<label>` associations; no placeholder-only labels
- Error messages: not color-only; always include text description
- Critical lab values: announced via `aria-live="assertive"`; not color-only
