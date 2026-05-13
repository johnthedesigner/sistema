---
system: carbon
category: guidance
topic: components/text-input
content_type: guidance
status: latest
version_label: "Carbon v11"
retrieved: 2026-05-12
source_url: https://carbondesignsystem.com/components/text-input/usage/
derived_from:
  - kb/design-systems/carbon/guidance/foundations/color-system
  - kb/design-systems/carbon/guidance/foundations/typography
tags: [component, text-input, form, input, carbon, ibm]
---

# Carbon Design System — Text Input

## Overview

Text inputs enable users to enter free-form text. Use for short, single-line content entry — names, email addresses, search queries, configuration values. For multi-line content, use TextArea instead.

---

## Variants

### Default (TextInput)
Standard single-line text input. Sits on a layer background with a bottom border at rest.

### Fluid (TextInput)
Stretches to fill its container width. Used in full-width form layouts and in-context editing scenarios.

### PasswordInput
Dedicated component for masked text entry. Provides a toggle icon to show/hide the password.

**Note:** `TextInput.Password` is deprecated — use the standalone `PasswordInput` component.

---

## States

| State | Description |
|---|---|
| Default | `field-01` background; `border-strong-01` bottom border |
| Focus | `focus` border (2px, full perimeter) |
| Error | `support-error` border; error icon; error message below |
| Warning | `support-warning` border; warning icon; warning message |
| Disabled | 50% opacity; not interactive |
| Read-only | No background; no border; text is non-editable |
| Skeleton | Loading placeholder |

---

## Anatomy

```
[Label text]                          [Required indicator *]
[  Placeholder / input text         ][trailing icon optional]
[Helper text or error message]
```

1. **Label** — always visible; describes the field's purpose
2. **Required indicator** (`*`) — for required fields
3. **Input field** — `field-01` or `field-02` background (layer-dependent)
4. **Placeholder text** — disappears on input; use only for examples, not requirements
5. **Helper text** — persistent guidance below the field
6. **Error / warning message** — replaces or supplements helper text
7. **Trailing icon** (optional) — typically clear button or validation indicator

---

## Layer-aware backgrounds

Carbon's layering model determines input background:

| Layer context | Background token |
|---|---|
| On `$layer-01` | `$field-02` |
| On `$layer-02` | `$field-03` |
| On `$layer-03` | `$field-01` |

Always use the layer-appropriate field token so inputs visually lift off their container.

---

## Password input

```jsx
import { PasswordInput } from '@carbon/react'

<PasswordInput
  id="password"
  labelText="Password"
  helperText="Must be 8+ characters with a number and symbol"
  placeholder="Enter password"
/>
```

- Characters are masked by default
- Toggle icon (eye/eye-slash) reveals/hides text
- Helper text should describe format requirements in detail

---

## Usage patterns

### Inline validation
Validate on blur, not on every keystroke. Show the error state only after the user has left the field.

### Character count
For inputs with a max length, show `current / max` below the field:

```jsx
<TextInput maxCount={100} enableCounter />
```

### Inline labels vs. floating labels
Carbon uses static labels above the input — labels do not float. Always keep the label visible; do not use placeholder-as-label patterns.

---

## AI label variant

`TextInput` supports an `AILabel` slot for AI-assisted inputs. Displays a "generated" indicator when field content was populated by an AI model.

---

## Accessibility

- Labels must always be visible — never replaced by placeholder
- `labelText` prop is required; maps to `<label>` element linked via `for`/`id`
- Error messages: associate with `aria-describedby`; set `aria-invalid="true"` on input
- Helper text: associate with `aria-describedby` (can share with error, separated by space)
- PasswordInput toggle: `aria-label` updates to "Show password" / "Hide password"
- Read-only inputs: use `readOnly` prop, not `disabled` — they remain focusable and selectable
