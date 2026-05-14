---
play_slug: audit-token-coverage
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" post-sprint audit. Demonstrates realistic drift
  patterns: a rapid development sprint introduced hardcoded hex values in two
  component files and a raw pixel value in a third. The audit report uses the
  full severity taxonomy (blocking/recommended/minor) and groups violations by
  file for efficient fixing. Non-obvious detail: rgba() with inline hex is
  treated as blocking because it bypasses the color token system even though
  it's not a "pure" hardcode.
input:
  scope: Full codebase audit — all component files
---

## Step 1 — Living brief context

Token naming convention: `--color-*` prefix for all color tokens, `--space-*` for spacing, `--shape-radius-*` for radii, `--font-size-*` for type, `--shadow-*` for elevation.

Implemented components: Button, Input, Badge, DataTable, Card, Modal, Toast.

---

## Step 2 — Reference loaded

Token architecture synthesis loaded. Key rule confirmed: **no raw hex, rgb, rgba, hsl values in component files**. Raw values are permitted only in token definition files (`tokens/color.css`, `tokens/typography.css`, etc.).

---

## Step 3 — Scan results

Searched for: `#[0-9a-fA-F]`, `rgb(`, `rgba(`, raw `px` values in non-token spacing/radius contexts, `font-size:`, `font-weight:` raw values.

Excluded: `tokens/`, `__tests__/`, `node_modules/`, third-party vendor files.

---

## Step 4 — Audit report

### Summary

| Severity | Count |
|---|---|
| Blocking | 3 |
| Recommended | 2 |
| Minor | 1 |
| **Total** | **6** |

---

### Blocking violations

**1. `src/components/DataTable/DataTable.tsx` — line 47**

```tsx
// VIOLATION
<th style={{ color: '#1A6B3A' }} onClick={handleSort}>
```

- Hardcoded value: `#1A6B3A` (primary green)
- Correct token: `var(--color-primary)`
- Why blocking: color in an interactive element — any primary color update requires a manual find-replace rather than being handled by the token

---

**2. `src/components/DataTable/DataTable.tsx` — line 89**

```tsx
// VIOLATION
<tr style={{ background: 'rgba(26, 107, 58, 0.08)' }} className={isHovered ? 'hovered' : ''}>
```

- Hardcoded value: `rgba(26, 107, 58, 0.08)` — inline derivation from primary hex
- Correct token: `var(--color-primary-container)` (which is already defined for this exact use case)
- Why blocking: `rgba()` with inline hex values bypass the token system even when they're approximating a token value. Dark mode will not apply because the raw rgba doesn't respond to `[data-theme="dark"]`.

---

**3. `src/components/Toast/Toast.tsx` — line 112**

```tsx
// VIOLATION
const errorBackground = '#D62B2B'
```

- Hardcoded value: `#D62B2B` (error red)
- Correct token: `var(--color-error)`
- Why blocking: error color is a semantic decision — if the error palette is adjusted (e.g. for accessible contrast in dark mode), this hardcode will not update.

---

### Recommended violations

**4. `src/components/Badge/Badge.tsx` — line 23**

```tsx
// VIOLATION
borderRadius: '4px'
```

- Hardcoded value: `4px`
- Correct token: `var(--shape-radius-sm)`
- Why recommended: consistent shape application matters for theme-ability; 4px matches `--shape-radius-sm` today but would diverge if the shape scale is adjusted.

---

**5. `src/components/Card/Card.tsx` — line 18**

```tsx
// VIOLATION
padding: '16px 24px'
```

- Hardcoded value: `16px 24px`
- Correct tokens: `var(--space-4) var(--space-6)` (4px × 4 = 16px; 4px × 6 = 24px)
- Why recommended: spacing tokens ensure Card padding stays aligned with the grid if the base unit changes.

---

### Minor violations

**6. `src/components/Input/Input.tsx` — line 67**

```css
/* VIOLATION — in inline style object */
letterSpacing: '-0.01em'
```

- Hardcoded value: `-0.01em`
- Correct approach: This value is correct per the typography scale but is not referenced from a token. Minor because letter-spacing is not a first-class token category in the current system.
- Action: Either add `--font-tracking-body: -0.01em` to the type token file, or leave with a comment marking it as intentional. If the typography scale changes, update this manually.

---

### Recommended fix order

**Sprint 1 (this week — blocking):**
1. `DataTable.tsx` lines 47 + 89 — both in the same file; fix together
2. `Toast.tsx` line 112 — quick swap

**Sprint 2 (next sprint — recommended):**
3. `Badge.tsx` line 23
4. `Card.tsx` line 18

**Defer:**
5. `Input.tsx` line 67 — resolve when/if letter-spacing is promoted to a token category
