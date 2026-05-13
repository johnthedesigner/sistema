---
system: wcag
category: keyboard
topic: keyboard-and-focus
content_type: guidance
status: latest
version_label: "WCAG 2.2 (October 2023)"
retrieved: 2026-05-12
source_url: https://www.w3.org/TR/WCAG22/
tags: [wcag, accessibility, keyboard, focus, standards]
---

# Keyboard Operability and Focus — WCAG 2.2

**Source:** `www.w3.org/TR/WCAG22/` §2.1.1, §2.1.2, §2.4.7, §2.4.11

---

## Quick reference

| Criterion | Requirement | Level |
|---|---|---|
| 2.1.1 | All functionality operable by keyboard | A |
| 2.1.2 | No keyboard trap — focus can always leave | A |
| 2.4.7 | Focus indicator is visible | AA |
| 2.4.11 | Focused component is not entirely hidden (**New in 2.2**) | AA |

---

## 2.1.1 Keyboard — Level A

All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.

**Exception:** Underlying functions that depend on the *path* of movement (not just endpoints), such as freehand drawing or signature capture.

**Implementation notes:**
- Every interactive element — buttons, links, form fields, custom controls — must be reachable and operable by keyboard
- Required keyboard patterns by role (from ARIA APG):
  - Button: `Enter` or `Space` to activate
  - Link: `Enter` to activate
  - Checkbox: `Space` to toggle
  - Radio group: arrow keys to move between options
  - Modal dialog: `Tab`/`Shift+Tab` within dialog; `Escape` to close
  - Menu: arrow keys to navigate; `Escape` to close; `Enter`/`Space` to select
  - Tab panel: arrow keys between tabs; `Tab` enters panel content
- Custom components built with `div` or `span` must add `tabindex="0"` and keyboard event handlers
- Drag-and-drop interactions must have a keyboard alternative

---

## 2.1.2 No Keyboard Trap — Level A

If keyboard focus can be moved to a component using a keyboard, then focus can be moved away using only the keyboard. If non-standard exit keys are required, the user must be informed of the method.

**Note:** This criterion applies to the entire page — any component that traps keyboard focus breaks the page for keyboard users, regardless of other conformance. It is listed as a non-interference requirement in WCAG conformance section 5.2.

**Implementation notes:**
- Modal dialogs: trap focus *within* the dialog (correct behavior), but must release on close. Trapping focus in a dialog is intentional and correct — what 2.1.2 forbids is making it impossible to close.
- Rich text editors, custom date pickers, embedded widgets: ensure `Escape` exits or provide clear instructions
- iframes: focus must not become permanently stuck — user must be able to tab out
- Test with keyboard only: Tab through the entire page and confirm you can reach and leave every interactive element

---

## 2.4.7 Focus Visible — Level AA

Any keyboard-operable user interface has a mode of operation where the keyboard focus indicator is visible.

**Implementation notes:**
- Never use `outline: none` or `outline: 0` on focused elements without providing an alternative visible focus style
- Browser default focus outlines satisfy this criterion — removing them without replacement is the most common violation
- Acceptable alternative focus styles: custom `outline`, `box-shadow` ring, `border` change, `background-color` change — anything that makes the focused state visually distinct
- The criterion requires *a mode where* focus is visible — most implementations satisfy this by making focus always visible. Some implementations show focus only for keyboard navigation (`:focus-visible` CSS pseudo-class) — this is acceptable.

**CSS pattern — custom focus ring:**
```css
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

**Do not:**
```css
/* Never do this without replacement */
* { outline: none; }
button:focus { outline: none; }
```

---

## 2.4.11 Focus Not Obscured (Minimum) — Level AA (New in WCAG 2.2)

When a UI component receives keyboard focus, the component is **not entirely hidden** due to author-created content.

**What this means:**
- Sticky headers, cookie banners, fixed navigation bars, and chat widgets must not completely obscure the focused element
- Partial obscuration is permitted at AA — the focused element just cannot be entirely covered
- Full non-obscuration (no part hidden) is required at AAA (2.4.12 — not covered here)

**Implementation notes:**
- Use `scroll-margin-top` or `scroll-padding-top` on the page or scroll container to account for sticky header height when focus causes scrolling
- Fixed banners at the bottom of the viewport: ensure elements near the bottom of the content area have enough scroll-margin-bottom
- `scroll-margin-top: 80px` (where 80px matches the sticky header height) is the standard fix
- Test by tabbing through a page with a sticky header and confirming no focused element is fully hidden

```css
/* Accommodate sticky header (80px tall) */
html {
  scroll-padding-top: 88px; /* header + 8px buffer */
}
```
