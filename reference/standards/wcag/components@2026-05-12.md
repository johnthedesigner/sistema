---
system: wcag
category: components
topic: components
content_type: guidance
status: latest
version_label: "WCAG 2.2 (October 2023)"
retrieved: 2026-05-12
source_url: https://www.w3.org/TR/WCAG22/
tags: [wcag, accessibility, components, aria, touch, standards]
---

# Component Accessibility — WCAG 2.2

**Source:** `www.w3.org/TR/WCAG22/` §2.5.5, §2.5.8, §4.1.2

---

## Quick reference

| Criterion | Requirement | Value | Level |
|---|---|---|---|
| 2.5.5 | Touch/pointer target size (enhanced) | **44×44 CSS px** | AAA |
| 2.5.8 | Touch/pointer target size (minimum, **New in 2.2**) | **24×24 CSS px** | AA |
| 4.1.2 | Name and role programmatically determinable; states programmatically settable | — | A |

---

## 2.5.5 Target Size (Enhanced) — Level AAA

The size of the pointer target is at least **44×44 CSS pixels**, except when:
- An equivalent control on the same page meets the size requirement
- The target is inline within a sentence or block of text
- The size is determined by the user agent and not modified by the author
- A particular presentation is essential to the information conveyed

**Note:** AAA is aspirational. Most products target AA (2.5.8). The 44×44px threshold originates from Apple's Human Interface Guidelines and WCAG's research into minimum touch target sizes for motor-impaired users.

---

## 2.5.8 Target Size (Minimum) — Level AA (New in WCAG 2.2)

The size of the pointer target is at least **24×24 CSS pixels**, except when:

- **Spacing:** An undersized target (< 24×24px) is positioned so that a 24px-diameter circle centered on its bounding box does not intersect another target's circle — i.e., insufficient-sized targets are spaced far enough apart
- **Equivalent:** The function is available through another control on the same page that meets this criterion
- **Inline:** The target is in a sentence or its size is constrained by surrounding line height
- **User agent:** Size is browser-controlled and not modified by the author
- **Essential:** A specific presentation is required

**Implementation notes:**
- Minimum AA target: 24×24 CSS px on the *interactive area* (not just the visible icon)
- Best practice AA target: 44×44 CSS px (the AAA threshold is the industry-standard recommendation)
- Use padding to expand the interactive area without changing the visual size:
  ```css
  button {
    min-height: 44px;
    min-width: 44px;
    padding: 10px 16px;
  }
  ```
- Icon buttons (close, menu, expand): wrap in a minimum 44×44px clickable area even if the icon is 20×20px
- Inline links within body text are exempt (the spacing exception applies)
- Touch targets in dense data tables may use the spacing exception if rows are clearly separated

---

## 4.1.2 Name, Role, Value — Level A

For all user interface components, the **name** and **role** can be programmatically determined; **states**, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies.

**Three requirements in one criterion:**

1. **Name:** Every interactive element has an accessible name. Screen readers announce this name when the component receives focus.
2. **Role:** The component's function is exposed via semantics (HTML element role or ARIA `role` attribute).
3. **State/value:** Dynamic properties (checked, expanded, selected, disabled, required, invalid) are programmatically exposed and updated when they change.

---

### Accessible name sources (in precedence order)

| Source | Example | Notes |
|---|---|---|
| `aria-labelledby` | `<div aria-labelledby="label-id">` | Highest priority; references another element's text |
| `aria-label` | `<button aria-label="Close dialog">` | Use when no visible label exists |
| HTML `<label>` | `<label for="email">Email</label>` | Standard for form inputs |
| `title` attribute | `<input title="Search">` | Avoid — poor AT support, creates tooltip |
| Element content | `<button>Save</button>` | Implicit for buttons and links |
| `alt` attribute | `<img alt="Logo">` | For images that convey information |

**Rule:** Never rely solely on visual placement or color to convey a component's name. An icon-only button with no `aria-label` has no accessible name.

---

### Role assignment

Use semantic HTML elements first — they carry implicit roles:

| HTML element | Implicit ARIA role |
|---|---|
| `<button>` | `button` |
| `<a href>` | `link` |
| `<input type="checkbox">` | `checkbox` |
| `<input type="text">` | `textbox` |
| `<select>` | `listbox` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<header>` | `banner` |

When building custom components with non-semantic elements, assign the role explicitly:
```html
<div role="button" tabindex="0" aria-label="Open menu">...</div>
```

---

### State exposure

Dynamic state must be communicated through ARIA attributes — CSS class changes alone are not sufficient.

| State | ARIA attribute | Example |
|---|---|---|
| Expanded/collapsed | `aria-expanded` | Accordion, dropdown, disclosure |
| Selected | `aria-selected` | Tabs, listbox options |
| Checked | `aria-checked` | Custom checkbox, toggle |
| Pressed | `aria-pressed` | Toggle button |
| Disabled | `aria-disabled` or HTML `disabled` | Any interactive element |
| Required | `aria-required` or HTML `required` | Form fields |
| Invalid | `aria-invalid` | Form validation state |
| Live updates | `aria-live` + `aria-atomic` | Status messages, notifications |

**Update states in JavaScript when they change — not just on initial render:**
```js
// When accordion opens:
button.setAttribute('aria-expanded', 'true');

// When form field fails validation:
input.setAttribute('aria-invalid', 'true');
input.setAttribute('aria-describedby', 'error-message-id');
```

---

### Common violations

- **Icon buttons without labels:** `<button><svg>...</svg></button>` — add `aria-label`
- **Custom dropdowns with no ARIA:** Visual dropdown styled from `div` with no `role="combobox"` or `role="listbox"`
- **State not updated on change:** Toggle button that changes visually but `aria-pressed` is never set
- **Form fields with no label:** `<input placeholder="Email">` — placeholder is not a label; `<label>` is required
- **Modal without `role="dialog"`:** Custom modal overlay with no role, no `aria-labelledby`, no focus trap
