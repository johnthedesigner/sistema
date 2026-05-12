---
system: material
category: guidance
topic: components/text-field
content_type: guidance
status: latest
version_label: "M3"
retrieved: 2026-05-12
source_url: https://m3.material.io/components/text-fields
derived_from:
  - kb/design-systems/material/guidance/foundations/color-roles
  - kb/design-systems/material/guidance/foundations/typography
tags: [component, text-field, input, form, material]
---

# Material Design 3 — Text Fields

## Overview

Text fields let users enter free-form text. Use when someone needs to type into a UI — contact forms, payment information, search, filters.

Two variants: **filled** and **outlined**. Both provide the same functionality; the choice is purely stylistic. Do not mix variants within the same form or immediately adjacent to each other — only separate by region (dialogs vs. the main form below).

---

## Variants

### Filled text field
- Higher visual emphasis
- Container uses `surface-variant` fill
- Active indicator line replaces a border (bottom edge only)
- Best for: dialogs and short forms where attention should be drawn to the field

### Outlined text field
- Lower visual emphasis
- No fill; container defined by a 1dp border
- Best for: long forms with many fields where visual density benefits from de-emphasis

---

## Anatomy

### Filled
1. Container (`surface-variant` fill, rounded top corners)
2. Leading icon (optional)
3. Label text — floats up when populated or focused
4. Trailing icon (optional)
5. Active indicator (bottom line: `on-surface-variant` at rest, `primary` on focus)
6. Caret
7. Input text
8. Supporting text (optional; below container)

### Outlined
1. Container outline (1dp, `outline` color at rest; `primary` on focus)
2. Leading icon (optional)
3. Label text — floats into the outline notch when populated or focused
4. Trailing icon (optional)
5. Caret
6. Input text
7. Supporting text (optional; below container)

---

## States

| State | Container (filled) | Outline (outlined) | Label | Supporting text |
|---|---|---|---|---|
| Enabled (empty) | `surface-variant` | `outline` | `on-surface-variant` | `on-surface-variant` |
| Focused | `surface-variant` | `primary` (2dp) | `primary` (floated) | `on-surface-variant` |
| Populated | `surface-variant` | `outline` | `on-surface-variant` (floated) | `on-surface-variant` |
| Error | `surface-variant` | `error` (2dp on focus) | `error` | `error` |
| Disabled | `on-surface` 4% opacity | `on-surface` 12% | `on-surface` 38% | `on-surface` 38% |
| Read-only | `surface-variant` | `outline` | same as populated | — |

---

## Supporting and error text

Supporting text sits below the container and provides hints, character counts, or requirements.

**Error state:** Replace supporting text with error text — don't add error text in addition to supporting text (the layout would shift). Error text should:
- Describe how to avoid the error (not just "required field")
- If multiple errors are possible, describe the most likely one

```css
/* Error colors */
--md-sys-color-error           /* error text and icons */
--md-sys-color-on-error        /* text on error containers */
--md-sys-color-error-container /* error container background */
```

---

## Icons

- **Leading icon:** 20dp; clarifies field purpose (e.g., search, email, phone)
- **Trailing icon:** 20dp; typically an action (clear, visibility toggle, calendar open)
- Both icons use `on-surface-variant` color at rest; `on-surface` when active

---

## Label behavior

The label text serves as both placeholder (when empty) and floating label (when populated/focused). It animates between two positions:
- **Rest (empty):** Full size, vertically centered — acts as placeholder
- **Populated/focused:** Scaled to 75%, positioned at top of container — acts as label

Do not use a separate `placeholder` attribute for text fields when a label is present — the animated label is the placeholder.

---

## Accessibility

- Always include a label — do not rely on placeholder text alone
- Associate helper text with the input using `aria-describedby`
- Error state: use `aria-invalid="true"` and associate error text with `aria-describedby`
- Minimum touch target for icons: 48×48dp
- Avoid hiding labels on small screens — they lose their persistent value
