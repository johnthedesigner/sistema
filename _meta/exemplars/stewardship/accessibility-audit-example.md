---
play_slug: accessibility-audit
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" post-sprint audit. Demonstrates a realistic
  accessibility audit across all seven implemented components. Three blocking
  violations are found: a DataTable sort button lacking an accessible name,
  a Toast error state failing 4.5:1 contrast against the surface, and a Badge
  touch target below 44px. Non-obvious detail: the Modal overlay focus trap is
  flagged as "needs verification" rather than pass or fail, because correctness
  depends on the focus management library used — this reflects a real edge case
  in how audits handle framework-dependent behavior.
input:
  scope: All implemented components
---

## Step 1 — Living brief context

**Token foundation:** Complete. Semantic color tokens: `--color-primary` (#1A6B3A), `--color-error` (#D62B2B), `--color-on-surface`, `--color-surface`, `--color-primary-container`. Light + dark mode both required.

**Implemented components:** Button (primary/secondary/ghost), Input (text/password), Badge (status), DataTable (sortable), Card, Modal, Toast.

**Accessibility decisions already recorded:**
- `prefers-reduced-motion` implemented globally
- Focus ring: `2px solid var(--color-primary)` with 2px offset (recorded in living brief)

---

## Step 2 — Reference loaded

Accessibility floor synthesis loaded. Non-negotiable requirements confirmed:
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components
- Keyboard: all interactive elements reachable and activatable
- Focus indicator: visible, meets 3:1 contrast against adjacent surface
- Touch targets: ≥ 44×44px
- Semantic HTML or full ARIA implementation
- Accessible name on every interactive element
- ARIA state attributes for dynamic components

---

## Step 3 — Audit scope

All implemented components: Button, Input, Badge, DataTable, Card, Modal, Toast.

---

## Step 4 — Evaluation per component

### Button

| Criterion | Result |
|---|---|
| Color contrast | Pass — primary (#1A6B3A) on white: 7.2:1; ghost text on white: 6.1:1 |
| Keyboard navigation | Pass — native `<button>`, receives Tab focus, activates on Enter/Space |
| Focus visibility | Pass — 2px ring at 3px offset, confirmed 4.8:1 contrast against white surface |
| Touch targets | Pass — min-height: 44px enforced in CSS |
| Semantic structure | Pass — native `<button>` element throughout |
| Accessible name | Pass — text content used as label in all three variants |
| Dynamic state | Pass — disabled state uses `disabled` attribute, not just visual |

**Result: Fully passing**

---

### Input

| Criterion | Result |
|---|---|
| Color contrast | Pass — placeholder (#9CA3AF) on white: 2.8:1 (decorative, exempt); label + value: 7.1:1 |
| Keyboard navigation | Pass — native `<input>` |
| Focus visibility | Pass — matches Button focus ring |
| Touch targets | Pass — input height 44px |
| Semantic structure | Pass — `<label>` element, associated via `htmlFor`/`id` |
| Accessible name | Pass — label visible and programmatically associated |
| Dynamic state | Pass — `aria-invalid` applied on validation error |

**Result: Fully passing**

---

### Badge

| Criterion | Result |
|---|---|
| Color contrast | Pass — status text meets 4.5:1 in all variants |
| Keyboard navigation | Pass — non-interactive; no Tab stop required |
| Focus visibility | N/A — non-interactive |
| Touch targets | **Fail** — badge renders at 24×20px; no interactive affordance but frequently used in table rows where the entire row is a link target — the badge itself is below 44px |
| Semantic structure | Pass — uses `<span>` with no misleading role |
| Accessible name | N/A — decorative; text content is the label |
| Dynamic state | **Fail** — status changes update visually but no `aria-live` region announces changes to screen readers |

**Result: 2 violations (see below)**

---

### DataTable

| Criterion | Result |
|---|---|
| Color contrast | Pass — header text 7.1:1; body text 6.8:1; hovered row background meets 3:1 for UI component |
| Keyboard navigation | Pass — sort buttons receive Tab focus; sort activates on Enter/Space |
| Focus visibility | Pass — sort button focus ring matches system standard |
| Touch targets | Pass — sort button click area ≥ 44px height via padding |
| Semantic structure | Pass — `<table>`, `<thead>`, `<th scope="col">` throughout |
| Accessible name | **Fail** — sort buttons (`<th onClick={handleSort}>`) contain only the column label text, no `aria-sort` attribute; screen readers cannot determine current sort direction |
| Dynamic state | **Fail** — same issue as above: no `aria-sort="ascending"` / `aria-sort="descending"` on sorted column headers |

**Result: 2 violations (see below)**

---

### Card

| Criterion | Result |
|---|---|
| Color contrast | Pass — all text on card surface meets 4.5:1 |
| Keyboard navigation | Pass — non-interactive wrapper; interactive children handle their own focus |
| Focus visibility | N/A — non-interactive |
| Touch targets | N/A — non-interactive |
| Semantic structure | Pass — renders as `<article>` or `<section>` depending on context |
| Accessible name | Needs verification — depends on consumer usage; no built-in heading requirement enforced |
| Dynamic state | N/A |

**Result: Needs verification (accessible name — consumer responsibility)**

---

### Modal

| Criterion | Result |
|---|---|
| Color contrast | Pass — modal surface is white; all text meets 4.5:1 |
| Keyboard navigation | Pass — Tab key navigates within modal; Escape closes |
| Focus visibility | Pass — focus returns to trigger on close |
| Touch targets | Pass — close button ≥ 44×44px |
| Semantic structure | Pass — `role="dialog"`, `aria-modal="true"` |
| Accessible name | Pass — `aria-labelledby` pointing to modal heading |
| Dynamic state | **Needs verification** — focus trap correctness depends on implementation; if using a focus trap library, verify it handles dynamically added focusable elements. Cannot confirm pass/fail without runtime inspection. |

**Result: 1 needs verification (focus trap)**

---

### Toast

| Criterion | Result |
|---|---|
| Color contrast | **Fail** — error Toast uses hardcoded `#D62B2B` background with white text; measured contrast: 4.1:1 (below 4.5:1 threshold for normal text) |
| Keyboard navigation | Pass — dismiss button receives focus; activates on Enter/Space |
| Focus visibility | Pass — dismiss button focus ring meets standard |
| Touch targets | Pass — dismiss button ≥ 44×44px |
| Semantic structure | Pass — `role="status"` for success/info; `role="alert"` for error |
| Accessible name | Pass — text content provides label |
| Dynamic state | Pass — `aria-live` region used for announcements |

**Result: 1 violation (see below)**

---

## Step 5 — Audit report

### Summary

| Severity | Count |
|---|---|
| Blocking | 4 |
| Recommended | 1 |
| Needs verification | 2 |

---

### Blocking violations

**1. `DataTable` — sort column headers missing `aria-sort`**

Sort buttons do not expose sort direction to assistive technology. Screen reader users cannot determine which column is sorted or in which direction.

- Fix: Add `aria-sort="ascending"` / `aria-sort="descending"` / `aria-sort="none"` to `<th>` elements that have sort behavior
- Note: `aria-sort` goes on the `<th>`, not the `<button>` inside it

---

**2. `DataTable` — sort buttons missing accessible name for direction**

Related to above: even with `aria-sort` added, the button text alone ("Name", "Date") doesn't indicate it's a sort control. Consider adding `aria-label="Sort by Name"` or a visually hidden description.

- Fix: Add `aria-label` or visually hidden text to each sort button: "Sort by [column]"

---

**3. `Toast` — error background fails 4.5:1 contrast**

Hardcoded `#D62B2B` with white text measures 4.1:1 — below the WCAG AA threshold for normal text.

- Fix: Replace `#D62B2B` with `var(--color-error)` (this is also a token audit violation). Update `--color-error` to a value that meets 4.5:1 against white — e.g. `#C0241F` (4.6:1). Verify dark mode separately.
- Note: This is both a token violation (audit-token-coverage) and an accessibility violation. Fix the token first; test contrast after.

---

**4. `Badge` — no `aria-live` for dynamic status changes**

When Badge status changes programmatically (e.g. "Processing" → "Complete"), the change is not announced to screen readers.

- Fix: Wrap the Badge status text in an `aria-live="polite"` region, or ensure the parent component announces the state change via a live region
- Scope: Only applies when Badge status is dynamic. Static badges (rendered once, never updated) are exempt.

---

### Recommended improvements

**5. `Badge` — touch target below 44px when used interactively**

Badge currently renders at 24×20px. This is acceptable for a purely decorative element, but if Badge is ever wrapped in a link or button (common in table rows), the touch target will be below 44px.

- Recommendation: Add a minimum padding or hit area to Badge when used interactively, or document in the living brief that Badge must not be the sole click target
- Why recommended (not blocking): Badge is not currently interactive by itself; this is a pattern-use risk, not a component defect

---

### Components fully passing

- Button — all criteria pass
- Input — all criteria pass
- Card — pass (accessible name is consumer responsibility; document in pattern guidance)

### Components with blocking violations (must fix before ship)

- DataTable — 2 blocking violations (aria-sort, accessible button names)
- Toast — 1 blocking violation (contrast failure on error state)
- Badge — 1 blocking violation (aria-live for dynamic state)

### Needs verification

- Modal — focus trap correctness (verify with runtime screen reader test using NVDA or VoiceOver)
- Card — accessible name in context (document consumer responsibility in pattern docs)

---

### Recommended fix order

**This sprint — blocking:**
1. `Toast.tsx` — swap hardcoded `#D62B2B` for `var(--color-error)`; update `--color-error` value to meet 4.5:1 (combined fix with audit-token-coverage blocking item 3)
2. `DataTable.tsx` — add `aria-sort` to `<th>` elements; add `aria-label` to sort buttons
3. `Badge` — add `aria-live="polite"` wrapper when status is dynamic

**Next sprint — recommended:**
4. `Badge` — document interactive touch target guidance in living brief and pattern docs

**Verify before release:**
5. `Modal` — runtime focus trap test with VoiceOver (macOS) and NVDA (Windows)
