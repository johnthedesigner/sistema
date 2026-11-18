---
system: material
category: tokens
topic: token-schema
content_type: implementation
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://material-web.dev/theming/material-theming/
tags: [tokens, naming-convention, css-custom-properties, schema, tiers]
---

# Material Design 3 — Token Schema (Web)

## Token Tier Summary

| Tier | CSS Prefix | Scope | Customized by |
|---|---|---|---|
| Reference | `--md-ref-*` | Global palette | Theme generators |
| System | `--md-sys-*` | Semantic roles | Product themers |
| Component | `--md-<component>-*` | Single component type | Per-component customizers |

---

## Reference Tokens

### Palette (`--md-ref-palette-*`)

Currently not fully exposed as CSS custom properties in Material Web (partial support). Generated values are consumed internally.

Format: `--md-ref-palette-<color><tone>`
Tones available: 0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100

```css
--md-ref-palette-primary0:   #000000
--md-ref-palette-primary10:  #21005D
--md-ref-palette-primary20:  #381E72
--md-ref-palette-primary30:  #4F378B
--md-ref-palette-primary40:  #6750A4  /* baseline primary light */
--md-ref-palette-primary80:  #D0BCFF  /* baseline primary dark */
--md-ref-palette-primary90:  #EADDFF
--md-ref-palette-primary100: #FFFFFF
```

Colors in the default baseline: `primary`, `secondary`, `tertiary`, `error`, `neutral`, `neutral-variant`

### Typeface (`--md-ref-typeface-*`)

```css
--md-ref-typeface-brand:       'Roboto'    /* display, headline, title */
--md-ref-typeface-plain:       'Roboto'    /* body, label */
--md-ref-typeface-weight-bold: 700
--md-ref-typeface-weight-medium: 500
--md-ref-typeface-weight-regular: 400
```

---

## System Color Tokens (`--md-sys-color-*`)

Complete set of semantic color roles. All take hex color values.

### Primary group
```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container
--md-sys-color-inverse-primary
```

### Secondary group
```css
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container
```

### Tertiary group
```css
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-tertiary-container
--md-sys-color-on-tertiary-container
```

### Error group
```css
--md-sys-color-error
--md-sys-color-on-error
--md-sys-color-error-container
--md-sys-color-on-error-container
```

### Surface group
```css
--md-sys-color-background
--md-sys-color-on-background
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-variant
--md-sys-color-on-surface-variant
--md-sys-color-surface-dim
--md-sys-color-surface-bright
--md-sys-color-surface-container-lowest
--md-sys-color-surface-container-low
--md-sys-color-surface-container
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest
--md-sys-color-inverse-surface
--md-sys-color-inverse-on-surface
```

### Utility group
```css
--md-sys-color-outline
--md-sys-color-outline-variant
--md-sys-color-shadow
--md-sys-color-scrim
```

---

## System Typescale Tokens (`--md-sys-typescale-*`)

Pattern: `--md-sys-typescale-<role>-<size>-<property>`

Properties: `font` (family), `size`, `line-height`, `weight`
Roles: `display`, `headline`, `title`, `body`, `label`
Sizes: `large`, `medium`, `small`

Full set:
```css
/* Display */
--md-sys-typescale-display-large-font
--md-sys-typescale-display-large-size          /* 57px */
--md-sys-typescale-display-large-line-height   /* 64px */
--md-sys-typescale-display-large-weight        /* 400 */
--md-sys-typescale-display-medium-font
--md-sys-typescale-display-medium-size         /* 45px */
--md-sys-typescale-display-medium-line-height  /* 52px */
--md-sys-typescale-display-medium-weight       /* 400 */
--md-sys-typescale-display-small-font
--md-sys-typescale-display-small-size          /* 36px */
--md-sys-typescale-display-small-line-height   /* 44px */
--md-sys-typescale-display-small-weight        /* 400 */

/* Headline */
--md-sys-typescale-headline-large-font
--md-sys-typescale-headline-large-size         /* 32px */
--md-sys-typescale-headline-large-line-height  /* 40px */
--md-sys-typescale-headline-large-weight       /* 400 */
--md-sys-typescale-headline-medium-font
--md-sys-typescale-headline-medium-size        /* 28px */
--md-sys-typescale-headline-medium-line-height /* 36px */
--md-sys-typescale-headline-medium-weight      /* 400 */
--md-sys-typescale-headline-small-font
--md-sys-typescale-headline-small-size         /* 24px */
--md-sys-typescale-headline-small-line-height  /* 32px */
--md-sys-typescale-headline-small-weight       /* 400 */

/* Title */
--md-sys-typescale-title-large-font
--md-sys-typescale-title-large-size            /* 22px */
--md-sys-typescale-title-large-line-height     /* 28px */
--md-sys-typescale-title-large-weight          /* 400 */
--md-sys-typescale-title-medium-font
--md-sys-typescale-title-medium-size           /* 16px */
--md-sys-typescale-title-medium-line-height    /* 24px */
--md-sys-typescale-title-medium-weight         /* 500 */
--md-sys-typescale-title-small-font
--md-sys-typescale-title-small-size            /* 14px */
--md-sys-typescale-title-small-line-height     /* 20px */
--md-sys-typescale-title-small-weight          /* 500 */

/* Body */
--md-sys-typescale-body-large-font
--md-sys-typescale-body-large-size             /* 16px */
--md-sys-typescale-body-large-line-height      /* 24px */
--md-sys-typescale-body-large-weight           /* 400 */
--md-sys-typescale-body-medium-font
--md-sys-typescale-body-medium-size            /* 14px */
--md-sys-typescale-body-medium-line-height     /* 20px */
--md-sys-typescale-body-medium-weight          /* 400 */
--md-sys-typescale-body-small-font
--md-sys-typescale-body-small-size             /* 12px */
--md-sys-typescale-body-small-line-height      /* 16px */
--md-sys-typescale-body-small-weight           /* 400 */

/* Label */
--md-sys-typescale-label-large-font
--md-sys-typescale-label-large-size            /* 14px */
--md-sys-typescale-label-large-line-height     /* 20px */
--md-sys-typescale-label-large-weight          /* 500 */
--md-sys-typescale-label-medium-font
--md-sys-typescale-label-medium-size           /* 12px */
--md-sys-typescale-label-medium-line-height    /* 16px */
--md-sys-typescale-label-medium-weight         /* 500 */
--md-sys-typescale-label-small-font
--md-sys-typescale-label-small-size            /* 11px */
--md-sys-typescale-label-small-line-height     /* 16px */
--md-sys-typescale-label-small-weight          /* 500 */
```

---

## System Shape Tokens (`--md-sys-shape-*`)

```css
--md-sys-shape-corner-none:        0px
--md-sys-shape-corner-extra-small: 4px
--md-sys-shape-corner-small:       8px
--md-sys-shape-corner-medium:      12px
--md-sys-shape-corner-large:       16px
--md-sys-shape-corner-extra-large: 28px
--md-sys-shape-corner-full:        9999px
```

---

## Sources

- Theming Overview: https://material-web.dev/theming/material-theming/
- Color Tokens: https://material-web.dev/theming/color/
- Typography Tokens: https://material-web.dev/theming/typography/
- Source SCSS (color): https://github.com/material-components/material-web/blob/main/tokens/_md-sys-color.scss
- Source SCSS (typescale): https://github.com/material-components/material-web/blob/main/tokens/_md-sys-typescale.scss
