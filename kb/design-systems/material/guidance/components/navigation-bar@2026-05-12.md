---
system: material
category: guidance
topic: components/navigation-bar
content_type: guidance
status: latest
version_label: "M3 (Expressive update May 2025)"
retrieved: 2026-05-12
source_url: https://m3.material.io/components/navigation-bar
derived_from:
  - kb/design-systems/material/guidance/foundations/color-roles
  - kb/design-systems/material/guidance/foundations/typography
tags: [component, navigation, nav-bar, bottom-nav, material]
---

# Material Design 3 — Navigation Bar

## Overview

Navigation bars let people switch between top-level UI views on smaller devices. Each destination is equal in importance. Use in **compact** (< 600dp) and **medium** (600–839dp) window sizes.

- 3–5 destinations only
- Destinations are persistent — they don't change between screens
- Not for hierarchical or sequential navigation

For larger windows (expanded, ≥ 840dp), use a **navigation drawer** or **navigation rail** instead.

---

## Variants (M3 Expressive, May 2025)

### Flexible navigation bar (recommended)
- Shorter height than baseline
- Supports horizontal navigation items in medium windows
- Active label color: `secondary`
- Active indicator: pill shape

### Baseline navigation bar (no longer recommended)
- Taller height
- Vertical layout only
- Replaced by flexible in M3 Expressive

---

## Anatomy

1. **Container** — full-width bar; `surface-container` background; no shadow (elevation handled by color alone)
2. **Navigation item** — icon + label per destination (2–5 items)
   - Active indicator: pill/capsule shape behind icon in `secondary-container`
   - Active icon: `on-secondary-container`; filled version
   - Inactive icon: `on-surface-variant`; outlined version
   - Label: `label-medium` type; `on-surface-variant` at rest; `secondary` when active
3. **Badge** (optional) — dot or count indicator on icon

---

## Color tokens

```css
/* Container */
--md-sys-color-surface-container   /* nav bar background */

/* Active destination */
--md-sys-color-secondary-container  /* active indicator pill */
--md-sys-color-on-secondary-container /* active icon color */
--md-sys-color-secondary             /* active label text */

/* Inactive destinations */
--md-sys-color-on-surface-variant   /* inactive icon and label */
```

---

## Behavior

- Tapping a destination navigates to its top-level view and resets its content to initial state
- Tapping the **current** active destination scrolls the current view to the top
- Navigation state persists across the session — returning to a destination remembers scroll position

---

## Destination guidelines

- 3–5 items; 3 is preferred for simplicity
- All items should be accessible from every screen
- Do not include transient or contextual destinations (e.g., "Edit mode", "Search results")
- Icons should be recognizable without labels — labels reinforce, not replace
- Use filled icon for active state; outlined equivalent for inactive

### Good destinations
- Home, Explore, Library, Profile
- Dashboard, Reports, Settings

### Poor destinations
- Back, Help, Share (these are actions, not destinations)

---

## Responsive pattern

| Window size | Navigation component |
|---|---|
| Compact (< 600dp) | Navigation bar |
| Medium (600–839dp) | Navigation bar (flexible, horizontal items) |
| Expanded (≥ 840dp) | Navigation drawer or navigation rail |

On layout change from compact to expanded, the navigation bar is typically replaced by a navigation rail or drawer. Destinations and state carry over.

---

## Accessibility

- `role="navigation"` on the container
- Each item: `aria-label` for icon-only labels; `aria-current="page"` on active item
- Touch target: minimum 48×48dp per item
- Labels must always be visible — never hide nav bar labels on mobile
