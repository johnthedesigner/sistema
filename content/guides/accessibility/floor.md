---
title: "Accessibility floor"
description: "The accessibility requirements every system is checked against, by area (contrast, keyboard, focus, targets, semantics, motion, and text), with the rule behind each and how to verify it."
topic: accessibility
sources:
  - kb/reference/standards/wcag/color-contrast
  - kb/reference/standards/wcag/keyboard-and-focus
  - kb/reference/standards/wcag/components
  - kb/reference/foundations/color/contrast-and-accessibility
last_reviewed: 2026-11-16
---

# Accessibility floor

## How to use this document

Each project chooses its accessibility standard during Direction, and the specific numbers come from that standard. The requirements themselves live in Sistema's rules registry, and each section below names the rule it explains. Where a section quotes a number, it names the standard the number comes from. WCAG 2.2 AA is the usual choice for regulated products.

Sections marked as guidance are recommendations with their context, not requirements. Each section includes a way to verify it.

---

## 1 — Color contrast

### 1.1 Text contrast (WCAG 1.4.3 — AA)

**Text must meet the text contrast ratio your project's standard sets** against its background (rule `color.contrast.text`). Under WCAG 2.2 AA, normal text (under 18pt, or under 14pt bold) needs at least 4.5:1.

Normal text in web contexts means: body text, labels, captions, placeholder text, button labels, link text — any text under 24px regular weight or under ~18.67px bold weight.

**Large text may use the standard's large-text ratio** (rule `color.contrast.large-text`). Under WCAG 2.2 AA, large text (18pt and up, or 14pt bold and up) needs at least 3:1.

Large text in web contexts: headings at 24px+ (regular), or ~19px+ (bold).

**Verify:** WebAIM Contrast Checker (webaim.org/resources/contrastchecker), browser DevTools color picker, or the Colour Contrast Analyser desktop app. Enter foreground hex + background hex; confirm the ratio meets your standard's threshold for the text size. Inside a Sistema workflow, use the contrast tool, which checks many pairs at once.

**Exemptions:** Disabled (inactive) text, decorative text that conveys no information, logotypes. Placeholder text is not exempt — it is text.

---

### 1.2 UI component contrast (WCAG 1.4.11 — AA)

**Visual boundaries that identify interactive components must meet your standard's non-text contrast ratio** against adjacent colors (rule `color.contrast.ui`). Under WCAG 2.2 AA, that's at least 3:1.

This applies to: input field borders, checkbox and radio outlines, toggle switch tracks, button outlines (on outlined/ghost variants), focus ring outlines when author-provided, chart lines and data markers when required for comprehension.

**Verify:** Measure the border or boundary element against the surface it sits on (not the element's content). A `#cccccc` border on white background = 1.6:1 — fails. A `#767676` border on white = 4.54:1 — passes.

**Exemptions:** Filled buttons where the background color itself identifies the button (the background must still meet the non-text ratio against the page background). Disabled components.

---

### 1.3 Dark mode contrast is a separate verification

**Contrast must be verified independently in dark mode.** WCAG 2.x contrast ratios do not automatically transfer between modes.

The WCAG formula overstates perceived contrast for near-dark color pairs. A token pair that passes the WCAG ratio in light mode may pass the formula in dark mode while being functionally harder to read, because the formula is not perceptually uniform at the low-luminance end.

**Verify:** Run contrast checks against your dark mode token values explicitly. If your design system uses tonal palettes (HCT/OKLab), verify tone differences are ≥ 50 for normal text, ≥ 40 for large text and UI, in addition to running the WCAG formula.

**APCA as a supplemental check:** APCA (Lc values) is perceptually uniform and more reliable for dark mode. Target Lc ≥ 75 for body text, Lc ≥ 60 for informational text, Lc ≥ 45 for headings. APCA is not yet normative (WCAG 2.x remains the legal standard), but use it to catch dark-mode false positives — pairs that pass WCAG 2.x but are visually unreadable.

---

### 1.4 No raw color values in components

**Components must consume color tokens.** No hardcoded hex values, HSL declarations, or inline `rgba()` in component styles.

**Verify:** Search the component codebase for `#`, `rgb(`, `hsl(`, and `rgba(` in style rules. Each match is a violation unless it is in the token definition itself.

---

## 2 — Keyboard navigation

### 2.1 All interactive elements must be keyboard-reachable (WCAG 2.1.1 — A)

**Every interactive element must be reachable and operable by keyboard alone.** No functionality may be available only via mouse, touch, or pointer.

Required keyboard behaviors:
- Button: `Enter` or `Space` to activate
- Link: `Enter` to activate
- Checkbox: `Space` to toggle; arrow keys to move between grouped options
- Radio group: arrow keys to navigate between options
- Modal: `Tab`/`Shift+Tab` within modal; `Escape` to close
- Dropdown menu: arrow keys to navigate; `Enter` or `Space` to select; `Escape` to close
- Tab panel: arrow keys between tabs; `Tab` moves into panel content

**Verify:** Unplug the mouse. Tab through every interactive element in the component. Confirm every element is reachable and can be activated. Any element that cannot be reached or operated is a violation.

Custom components built on non-semantic elements (`div`, `span`) must add `tabindex="0"` and keyboard event handlers. Any drag-and-drop pattern must have a keyboard alternative.

---

### 2.2 No keyboard traps (WCAG 2.1.2 — A)

**Focus must never become permanently stuck in a component.** If keyboard focus can enter a component, it must be able to exit.

Note: trapping focus *within* a modal dialog is correct and required behavior. What is forbidden is making it impossible to dismiss the modal and release focus.

**Verify:** Tab into every interactive component. Confirm you can always tab out, close, or otherwise move focus away using only the keyboard.

---

### 2.3 Tab order must follow visual order

**The tab order must match the visual reading order.** Users should not find focus jumping unexpectedly across the layout.

**Verify:** Tab through a page from top to bottom. Confirm focus moves in the same order a sighted user would visually scan the content. If focus jumps, check for positive `tabindex` values (tabindex > 0) — these override natural DOM order and are almost always incorrect. Remove them.

---

## 3 — Focus visibility

### 3.1 Focus indicator must be visible (WCAG 2.4.7 — AA)

**Keyboard focus must always be visible.** The focused element must be distinguishable from its unfocused state.

`outline: none` or `outline: 0` without a replacement focus style is a WCAG violation.

**Minimum focus style:**
```css
:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}
```

The `:focus-visible` pseudo-class is correct for implementations that show focus only during keyboard navigation. `:focus` alone shows the ring on mouse-click as well — both approaches are compliant; `:focus-visible` is the modern preference.

**Verify:** Tab through the page. Confirm every focused element has a visible, distinguishable indicator. If you can't immediately see which element has focus, the indicator is insufficient.

---

### 3.2 Focus indicator contrast (WCAG 1.4.11 applied to focus rings)

**The focus ring must meet your standard's non-text contrast ratio** against the adjacent background color (rules `accessibility.focus-visible` and `color.contrast.ui`). Under WCAG 2.2 AA, that's at least 3:1.

A 2px solid `#005fcc` ring on white background = ~5.9:1 — passes. A light gray ring on a white background will fail.

**Verify:** Measure the focus ring color against every surface it appears on, in every theme. Meet your standard's ratio, and aim higher where it's cheap.

---

### 3.3 Focused element must not be entirely hidden (WCAG 2.4.11 — AA)

**When an element receives focus, it must not be completely covered** by sticky headers, cookie banners, fixed navigation, or other author-created overlays.

Partial obscuration is permitted at AA. Complete concealment is not.

**Fix pattern:**
```css
html {
  scroll-padding-top: [sticky-header-height + 8px];
}
```

**Verify:** Tab through a page with a sticky header. Confirm no focused element is fully hidden behind the header when scrolled into view.

---

## 4 — Touch and pointer targets

### 4.1 Interactive targets must be at minimum 24×24 CSS px (WCAG 2.5.8 — AA)

**Every pointer target must meet your standard's minimum size** in its interactive area (rule `accessibility.target-size`). Under WCAG 2.2 AA (2.5.8), that's 24×24 CSS pixels, or enough spacing that no other target falls within a 24px-diameter circle centered on it.

**Verify:** Inspect the interactive area (not the visual icon) of every small control — icon buttons, close buttons, checkbox hit areas, inline links. Measure in DevTools. Any target below your standard's minimum that isn't spaced away from other targets fails.

---

### 4.2 Larger targets for touch-first products (guidance)

Projects that chose WCAG AAA must meet 2.5.5, which sets 44×44 CSS px. For everyone else, larger targets are guidance. They help most on touch-first products, for controls used often, and for people with limited dexterity. Platform guidelines are a useful reference here: Apple's Human Interface Guidelines recommend 44pt, and Material Design recommends 48dp.

**Implementation:** record the project's minimum as a token, then apply it.
```css
button, [role="button"], a {
  min-height: var(--size-target-min);
  min-width: var(--size-target-min);
}
```

Use padding to expand the interactive area without changing visual size. For example, an icon button with a 20px icon needs 12px of padding on each side to reach the WCAG 2.5.5 (AAA) size.

**Verify:** Inspect the `height` and `width` of every button, link, and interactive control in DevTools. Confirm the interactive area (including padding) meets the target.

---

## 5 — Semantic structure and ARIA

### 5.1 Semantic HTML first (WCAG 4.1.2 — A)

**Use semantic HTML elements for all interactive components before reaching for ARIA.** Native elements carry implicit roles, keyboard behavior, and accessibility semantics that custom elements must re-implement manually.

| Use this | Not this |
|---|---|
| `<button>` | `<div role="button" tabindex="0">` |
| `<a href>` | `<span role="link" tabindex="0">` |
| `<input type="checkbox">` | `<div role="checkbox" tabindex="0">` |
| `<select>` | Custom dropdown from scratch |
| `<nav>`, `<main>`, `<header>` | `<div id="nav">`, `<div id="content">` |

ARIA is for patterns that have no semantic HTML equivalent: tabs, accordions, comboboxes, tree views, data grids, custom modals.

**Verify:** Inspect the DOM of every interactive component. Every `div` or `span` with a click handler must have either a semantic equivalent or a full ARIA implementation (role + name + state + keyboard behavior).

---

### 5.2 Every interactive element must have an accessible name (WCAG 4.1.2 — A)

**Screen readers announce the accessible name when an element receives focus.** An element with no accessible name is announced as its role only (e.g. "button") — no indication of what it does.

**Accessible name sources in priority order:**
1. `aria-labelledby` — references another element's text
2. `aria-label` — direct string label
3. `<label for>` — paired label element (forms)
4. Element text content — for buttons and links

**Common violations:**
- Icon-only button: `<button><svg>...</svg></button>` — add `aria-label="Close"` or a visually hidden text span
- Form input with placeholder only: `<input placeholder="Email">` — placeholder is not a label; add `<label for>`
- Image that conveys information: `<img src="chart.png">` with no `alt` attribute

**Verify:** Use a screen reader (VoiceOver, NVDA, or JAWS) and tab to every interactive element. Confirm the announcement includes a meaningful name that describes the element's purpose.

---

### 5.3 Dynamic state must be programmatically exposed (WCAG 4.1.2 — A)

**When a component's state changes, the change must be communicated to assistive technologies** via ARIA attributes — not CSS class changes alone.

Required state attributes:

| State | ARIA attribute |
|---|---|
| Expanded / collapsed | `aria-expanded="true/false"` |
| Selected | `aria-selected="true/false"` |
| Checked | `aria-checked="true/false/mixed"` |
| Pressed (toggle) | `aria-pressed="true/false"` |
| Disabled | `aria-disabled="true"` or HTML `disabled` |
| Invalid (form) | `aria-invalid="true"` |
| Required (form) | `aria-required="true"` or HTML `required` |

**Verify:** Open DevTools Accessibility panel. Interact with every stateful component (open an accordion, check a checkbox, submit an invalid form). Confirm the ARIA state attribute updates to reflect the new state.

---

## 6 — Motion

### 6.1 Respect `prefers-reduced-motion` (non-negotiable)

**All animated content must be disabled or substantially reduced when `prefers-reduced-motion: reduce` is set.** This is a medical accommodation for users with vestibular disorders, photosensitive conditions, and motion sickness.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

See the Motion architecture guide for the full motion system specification.

**Verify:** Enable "Reduce Motion" in OS accessibility settings (macOS: System Settings → Accessibility → Display; iOS: Settings → Accessibility → Motion). Reload the product. Confirm all non-essential animations stop. Functional transitions (state changes, overlay appearances) may remain brief; decorative animations must stop entirely.

---

## 7 — Text readability

### 7.1 Body text size (guidance, not WCAG)

Text meant for sustained reading is usually set at 16px or larger on the web. This isn't a WCAG criterion. It's a common recommendation from usability research, and dense products often go smaller for secondary text. Text below about 14px needs more contrast to stay legible. The typography guide covers how density shapes the scale.

**Verify:** Inspect the computed font size of body text, descriptions, and form field content, and compare it with the size the project decided on.

---

### 7.2 Line length (guidance)

Long lines make it hard to find the start of the next line. Body text columns usually stay under about 75 to 90 characters per line (roughly 680px at 16px in a regular-width sans-serif). The typography guide's section on measure covers the range and its reasons.

**Verify:** Count characters per line in the widest body text column at the product's maximum content width. If lines run long, add a `max-width` in `ch`.

---

### 7.3 Line height and text spacing (WCAG 1.4.12 at AA, 1.4.8 at AAA)

**At AA, text must keep working when people change its spacing** (rule `typography.text-spacing`). WCAG 1.4.12 requires that nothing is cut off or overlaps when a user sets line height to 1.5 times the font size, paragraph spacing to 2 times, letter spacing to 0.12 times, and word spacing to 0.16 times.

**At AAA, body line height has a minimum** (rule `typography.line-height.body`). WCAG 1.4.8 sets it at 1.5 times the font size for paragraph text.

Below AAA, the right line height depends on the typeface, size, and measure. The typography guide covers typical ranges by role.

**Verify:** Apply a text spacing bookmarklet or user stylesheet with the WCAG 1.4.12 values and check that no text is clipped or overlapping. For AAA projects, also inspect the computed `line-height` of body text.
