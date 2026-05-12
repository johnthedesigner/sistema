---
play_slug: generate-design-md
stage: 1
created: 2026-05-12
quality_notes: >
  Generated for "Meridian" — a fictional B2B analytics SaaS. Covers all major
  sections. Color values are coherent with a blue primary palette. Typography
  uses Inter, a common choice for data-dense UIs. Component notes are specific
  enough to inform implementation without prescribing code. Token names follow
  a two-tier primitive/semantic pattern consistent with the plan-token-architecture
  play output. Marked [default — review] where the brief was silent.
---

# Meridian Design System

## Overview

Meridian is an analytics platform for operations teams. The UI is dense and data-forward — tables, charts, status indicators, and inline editing are the primary interaction surfaces. The visual language should feel precise and trustworthy: clean without being sterile, structured without being rigid.

**Primary use cases:** dashboard views with many data points in view simultaneously; detail drawers; bulk action flows; configuration forms.

**Target platform:** Web (desktop-primary, responsive to tablet). No native mobile app.

---

## Color

### Philosophy

Two-tier token system: primitive palette → semantic roles. Components consume semantic roles only — never raw palette values.

### Primitive palette

```
/* Blue — primary hue */
--color-blue-5:   #EFF6FF;
--color-blue-10:  #DBEAFE;
--color-blue-20:  #BFDBFE;
--color-blue-30:  #93C5FD;
--color-blue-40:  #60A5FA;
--color-blue-50:  #3B82F6;
--color-blue-60:  #2563EB;
--color-blue-70:  #1D4ED8;
--color-blue-80:  #1E40AF;
--color-blue-90:  #1E3A8A;
--color-blue-95:  #172554;

/* Indigo — secondary hue */
--color-indigo-5:   #EEF2FF;
--color-indigo-10:  #E0E7FF;
--color-indigo-20:  #C7D2FE;
--color-indigo-30:  #A5B4FC;
--color-indigo-40:  #818CF8;
--color-indigo-50:  #6366F1;
--color-indigo-60:  #4F46E5;
--color-indigo-70:  #4338CA;
--color-indigo-80:  #3730A3;
--color-indigo-90:  #312E81;

/* Teal — tertiary / success accent */
--color-teal-5:   #F0FDFA;
--color-teal-10:  #CCFBF1;
--color-teal-20:  #99F6E4;
--color-teal-40:  #2DD4BF;
--color-teal-60:  #0D9488;
--color-teal-80:  #115E59;
--color-teal-90:  #134E4A;

/* Red — error / destructive */
--color-red-5:    #FEF2F2;
--color-red-10:   #FEE2E2;
--color-red-20:   #FECACA;
--color-red-40:   #F87171;
--color-red-60:   #DC2626;
--color-red-80:   #991B1B;
--color-red-90:   #7F1D1D;

/* Amber — warning */
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
--color-neutral-50:  #525252;
--color-neutral-60:  #404040;
--color-neutral-70:  #262626;
--color-neutral-80:  #171717;
--color-neutral-90:  #0A0A0A;
--color-neutral-100: #000000;

/* Neutral-blue — slightly chromatic neutrals for surfaces */
--color-neutral-blue-2:   #F8FAFC;
--color-neutral-blue-5:   #F1F5F9;
--color-neutral-blue-10:  #E2E8F0;
--color-neutral-blue-20:  #CBD5E1;
--color-neutral-blue-30:  #94A3B8;
--color-neutral-blue-70:  #334155;
--color-neutral-blue-80:  #1E293B;
--color-neutral-blue-90:  #0F172A;
```

### Semantic roles — light theme

```css
:root {
  /* Primary */
  --color-primary:               var(--color-blue-60);
  --color-on-primary:            var(--color-neutral-0);
  --color-primary-container:     var(--color-blue-10);
  --color-on-primary-container:  var(--color-blue-90);
  --color-primary-hover:         var(--color-blue-70);

  /* Secondary */
  --color-secondary:             var(--color-indigo-60);
  --color-on-secondary:          var(--color-neutral-0);
  --color-secondary-container:   var(--color-indigo-10);
  --color-on-secondary-container: var(--color-indigo-90);

  /* Tertiary */
  --color-tertiary:              var(--color-teal-60);
  --color-on-tertiary:           var(--color-neutral-0);
  --color-tertiary-container:    var(--color-teal-10);
  --color-on-tertiary-container: var(--color-teal-90);

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

  /* Success [default — review] */
  --color-success:               var(--color-teal-60);
  --color-on-success:            var(--color-neutral-0);
  --color-success-container:     var(--color-teal-5);
  --color-on-success-container:  var(--color-teal-90);

  /* Surface */
  --color-surface:               var(--color-neutral-blue-2);
  --color-surface-variant:       var(--color-neutral-blue-5);
  --color-surface-container-low:    var(--color-neutral-blue-5);
  --color-surface-container:        var(--color-neutral-blue-10);
  --color-surface-container-high:   var(--color-neutral-20);
  --color-surface-inverse:       var(--color-neutral-blue-80);

  /* On-surface */
  --color-on-surface:            var(--color-neutral-blue-90);
  --color-on-surface-variant:    var(--color-neutral-blue-70);
  --color-on-surface-inverse:    var(--color-neutral-blue-2);

  /* Outline */
  --color-outline:               var(--color-neutral-blue-20);
  --color-outline-variant:       var(--color-neutral-blue-10);

  /* Utility */
  --color-shadow:                var(--color-neutral-blue-90);
  --color-scrim:                 rgba(15, 23, 42, 0.4);
}
```

### Semantic roles — dark theme

```css
[data-theme="dark"] {
  /* Primary */
  --color-primary:               var(--color-blue-40);
  --color-on-primary:            var(--color-blue-90);
  --color-primary-container:     var(--color-blue-80);
  --color-on-primary-container:  var(--color-blue-10);
  --color-primary-hover:         var(--color-blue-30);

  /* Secondary */
  --color-secondary:             var(--color-indigo-40);
  --color-on-secondary:          var(--color-indigo-90);
  --color-secondary-container:   var(--color-indigo-80);
  --color-on-secondary-container: var(--color-indigo-10);

  /* Tertiary */
  --color-tertiary:              var(--color-teal-40);
  --color-on-tertiary:           var(--color-teal-90);
  --color-tertiary-container:    var(--color-teal-80);
  --color-on-tertiary-container: var(--color-teal-10);

  /* Error */
  --color-error:                 var(--color-red-40);
  --color-on-error:              var(--color-red-90);
  --color-error-container:       var(--color-red-80);
  --color-on-error-container:    var(--color-red-10);

  /* Warning */
  --color-warning:               var(--color-amber-40);
  --color-on-warning:            var(--color-amber-80);
  --color-warning-container:     var(--color-amber-80);
  --color-on-warning-container:  var(--color-amber-10);

  /* Success */
  --color-success:               var(--color-teal-40);
  --color-on-success:            var(--color-teal-90);
  --color-success-container:     var(--color-teal-80);
  --color-on-success-container:  var(--color-teal-10);

  /* Surface */
  --color-surface:               var(--color-neutral-blue-90);
  --color-surface-variant:       var(--color-neutral-blue-80);
  --color-surface-container-low:    var(--color-neutral-blue-80);
  --color-surface-container:        var(--color-neutral-blue-70);
  --color-surface-container-high:   var(--color-neutral-60);
  --color-surface-inverse:       var(--color-neutral-blue-5);

  /* On-surface */
  --color-on-surface:            var(--color-neutral-blue-5);
  --color-on-surface-variant:    var(--color-neutral-blue-20);
  --color-on-surface-inverse:    var(--color-neutral-blue-90);

  /* Outline */
  --color-outline:               var(--color-neutral-blue-70);
  --color-outline-variant:       var(--color-neutral-blue-80);

  /* Utility */
  --color-shadow:                var(--color-neutral-100);
  --color-scrim:                 rgba(0, 0, 0, 0.6);
}
```

---

## Typography

### Typeface

**Primary:** Inter (Google Fonts). Used for all UI text.
**Monospace:** JetBrains Mono. Used for code snippets, query editors, API keys, and numeric data in tables.
**Fallback stack:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Scale

Analytics UIs are space-constrained. The scale is compressed at the small end — we prefer 13px body text in dense contexts over 16px.

```
/* Display */
--type-display-size:        2.25rem;   /* 36px */
--type-display-weight:      700;
--type-display-line-height: 1.2;
--type-display-tracking:    -0.02em;

/* Headline */
--type-headline-size:       1.5rem;    /* 24px */
--type-headline-weight:     600;
--type-headline-line-height: 1.3;
--type-headline-tracking:   -0.01em;

/* Title */
--type-title-size:          1.125rem;  /* 18px */
--type-title-weight:        600;
--type-title-line-height:   1.4;
--type-title-tracking:      0;

/* Body large */
--type-body-large-size:     1rem;      /* 16px */
--type-body-large-weight:   400;
--type-body-large-line-height: 1.6;
--type-body-large-tracking: 0;

/* Body */
--type-body-size:           0.875rem;  /* 14px */
--type-body-weight:         400;
--type-body-line-height:    1.5;
--type-body-tracking:       0;

/* Body small — dense contexts */
--type-body-small-size:     0.8125rem; /* 13px */
--type-body-small-weight:   400;
--type-body-small-line-height: 1.4;
--type-body-small-tracking: 0;

/* Label */
--type-label-size:          0.75rem;   /* 12px */
--type-label-weight:        500;
--type-label-line-height:   1.3;
--type-label-tracking:      0.01em;

/* Label small */
--type-label-small-size:    0.6875rem; /* 11px */
--type-label-small-weight:  500;
--type-label-small-line-height: 1.3;
--type-label-small-tracking: 0.02em;
```

### Usage rules

- **Page titles:** Headline
- **Section headings:** Title
- **Table column headers:** Label (medium weight, uppercase, tracked)
- **Table cell content:** Body small
- **Form labels:** Label
- **Inline help text / descriptions:** Body small, `--color-on-surface-variant`
- **Code / IDs / numeric values:** JetBrains Mono, Body small

---

## Spacing

8px base grid. Components snap to multiples of 4px for internal padding.

```
--spacing-0:   0;
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
--spacing-20:  5rem;      /* 80px */
--spacing-24:  6rem;      /* 96px */
```

**Layout gutters:** 24px (desktop), 16px (tablet)
**Section padding:** 32px vertical, 24px horizontal
**Card internal padding:** 20px
**Form field internal padding:** 8px vertical, 12px horizontal

---

## Shape

Rounded but not playful. Larger surfaces use smaller radii than small interactive elements.

```
--shape-none:         0;
--shape-extra-small:  0.25rem;   /* 4px  — chips, badges, tags */
--shape-small:        0.375rem;  /* 6px  — inputs, dropdowns, small buttons */
--shape-medium:       0.5rem;    /* 8px  — cards, dialogs, larger buttons */
--shape-large:        0.75rem;   /* 12px — panels, drawers */
--shape-extra-large:  1rem;      /* 16px — modals, popovers */
--shape-full:         9999px;    /* pills */
```

**Component defaults:**
- Button (filled, outlined): `--shape-small`
- Input / select: `--shape-small`
- Card: `--shape-medium`
- Dialog: `--shape-extra-large`
- Drawer: `--shape-large` (top corners only)
- Badge / chip: `--shape-extra-small`
- Tooltip: `--shape-extra-small`

---

## Elevation

CSS box-shadow system. Three levels; dark theme uses slightly different shadows to avoid excessive halo.

```css
/* Light theme */
--elevation-0: none;
--elevation-1: 0 1px 2px 0 rgba(15, 23, 42, 0.08);
--elevation-2: 0 2px 8px -1px rgba(15, 23, 42, 0.12), 0 1px 3px -1px rgba(15, 23, 42, 0.08);
--elevation-3: 0 8px 24px -4px rgba(15, 23, 42, 0.16), 0 2px 8px -2px rgba(15, 23, 42, 0.10);

/* Dark theme */
--elevation-1: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
--elevation-2: 0 2px 8px -1px rgba(0, 0, 0, 0.5), 0 1px 3px -1px rgba(0, 0, 0, 0.3);
--elevation-3: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(0, 0, 0, 0.4);
```

**Usage:**
- Cards at rest: `--elevation-1`
- Cards on hover / active: `--elevation-2`
- Dropdowns, popovers, floating toolbars: `--elevation-2`
- Dialogs, drawers: `--elevation-3`

---

## Motion

Minimal. Most state transitions are 150ms or less — data-dense UIs need to feel instant. Animations are reserved for structural transitions (drawer open, dialog entrance).

```
--motion-duration-instant:  50ms;
--motion-duration-fast:     100ms;
--motion-duration-normal:   150ms;
--motion-duration-slow:     250ms;
--motion-duration-enter:    200ms;
--motion-duration-exit:     150ms;  /* exits always faster than enters */

--motion-easing-standard:   cubic-bezier(0.2, 0, 0, 1);
--motion-easing-decelerate: cubic-bezier(0, 0, 0, 1);
--motion-easing-accelerate: cubic-bezier(0.3, 0, 1, 1);
```

**Principles:**
- Hover/focus state changes: instant or `--motion-duration-instant`
- Expand/collapse (accordion, tree): `--motion-duration-normal`
- Drawer enter: `--motion-duration-enter`, `--motion-easing-decelerate`, slides from right
- Drawer exit: `--motion-duration-exit`, `--motion-easing-accelerate`
- Dialog enter: `--motion-duration-enter`, scale from 95% + fade
- Respect `prefers-reduced-motion`: collapse all durations to 0ms

---

## Interactive states

State layers use a semi-transparent overlay on the component's container or background — not a color change.

```
--state-hover-opacity:   0.06;
--state-focus-opacity:   0.12;
--state-pressed-opacity: 0.16;
--state-drag-opacity:    0.16;
--state-disabled-opacity: 0.38;
```

**Focus indicator:** 2px solid `--color-primary`, 2px offset. Visible on all keyboard-focusable elements. No custom outline suppression without replacement.

---

## Components

### Button

Three variants: **Filled**, **Outlined**, **Ghost** (text-only).

- Filled: `--color-primary` background, `--color-on-primary` text, `--shape-small`
- Outlined: transparent background, `--color-outline` border, `--color-primary` text
- Ghost: no background or border, `--color-primary` text
- Height: 36px (default), 32px (compact), 28px (dense)
- Label: `--type-label`, uppercase tracking
- Icon support: leading icon only; 16px icon, 6px gap
- Loading state: spinner replaces label; button disabled during load

### Input / Text field

Single-line and multiline (textarea). Outlined style only — no filled variant for this product.

- Border: `--color-outline`, `--shape-small`
- Focus border: `--color-primary`, 2px
- Error border: `--color-error`, 2px; error message below in `--color-error`
- Label: floats above on focus/filled; `--type-label`
- Helper text: below input, `--type-body-small`, `--color-on-surface-variant`
- Prefix/suffix icon support: 16px, `--color-on-surface-variant`

### Data table

Core surface. Dense by default.

- Row height: 40px (default), 32px (compact)
- Header: `--type-label`, uppercase, `--color-on-surface-variant`; sticky on scroll
- Cell: `--type-body-small`
- Row hover: state layer `--state-hover-opacity` over `--color-surface-container`
- Row selected: `--color-primary-container` background
- Borders: horizontal dividers only (`--color-outline-variant`); no vertical cell borders
- Sortable columns: chevron icon, 14px, appears on hover of header
- Checkbox column: 40px wide; indeterminate state required
- Empty state: centered, `--type-body`, `--color-on-surface-variant`

### Badge / Status indicator

Used extensively for record status, severity, category labels.

- Shape: `--shape-extra-small`
- Padding: 2px 6px
- Font: `--type-label-small`
- Variants: neutral (gray), info (blue), success (teal), warning (amber), error (red)
- Each variant uses the container/on-container token pair from its semantic family

### Navigation sidebar

- Width: 240px (expanded), 56px (collapsed icon-only)
- Background: `--color-surface-variant`
- Active item: `--color-primary-container` background, `--color-on-primary-container` text, left accent bar 3px `--color-primary`
- Hover item: state layer on `--color-surface-container`
- Section labels: `--type-label-small`, uppercase, `--color-on-surface-variant`

### Dialog / Modal

- Max width: 560px (default), 720px (large), full-screen on mobile
- Shape: `--shape-extra-large`
- Elevation: `--elevation-3`
- Scrim: `--color-scrim`
- Structure: header (title + close), body (scrollable), footer (actions, right-aligned)
- Destructive action button: Filled button using `--color-error` as background

---

## Data visualization

Colors for charts and graphs. Not semantic roles — these are categorical and sequential palettes.

```
/* Categorical — 8 colors for distinct series */
--chart-cat-1: var(--color-blue-60);
--chart-cat-2: var(--color-indigo-50);
--chart-cat-3: var(--color-teal-60);
--chart-cat-4: var(--color-amber-60);
--chart-cat-5: var(--color-red-60);
--chart-cat-6: var(--color-blue-30);
--chart-cat-7: var(--color-indigo-30);
--chart-cat-8: var(--color-teal-40);

/* Sequential — single-hue ramp for heatmaps / magnitude */
--chart-seq-1: var(--color-blue-5);
--chart-seq-2: var(--color-blue-10);
--chart-seq-3: var(--color-blue-20);
--chart-seq-4: var(--color-blue-40);
--chart-seq-5: var(--color-blue-60);
--chart-seq-6: var(--color-blue-80);
```

All chart colors must pass 3:1 contrast against the surface they appear on.
