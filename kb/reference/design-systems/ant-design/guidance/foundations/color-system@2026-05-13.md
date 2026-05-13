---
system: ant-design
category: design-systems
topic: color-system
content_type: guidance
status: latest
version_label: "Ant Design 5.x"
retrieved: 2026-05-13
source_url: https://ant.design/docs/spec/colors
tags: [color, tokens, palette, ant-design]
---

# Color System

**Source:** `ant.design/docs/spec/colors`

Ant Design structures color at two levels: a **system-level** foundational palette and a **product-level** semantic layer. The design philosophy is explicitly restrained — color is a tool for information delivery, not visual decoration.

---

## Color model

Ant Design uses the **HSB color model** (Hue, Saturation, Brightness) for all color work. This model maps more intuitively to how humans perceive color relationships and facilitates communication between designers and between design and engineering.

---

## System-level: Base color palettes

The palette contains **120 colors** across 12 named hues, each with a 10-step derivative scale (steps 1–10, where step 6 is the primary tone).

### The 12 named palettes

| Name | Character |
|---|---|
| Dust Red | Fighting Spirit, Unrestrained |
| Volcano | Eye-catching, Surging |
| Sunset Orange | Warm, Cheerful |
| Lime | Natural, Vitality |
| Calendula Gold | Energetic, Positive |
| Sunrise Yellow | Birth, Sunshine |
| Polar Green | Healthy, Innovative |
| Cyan | Hope, Strong |
| Daybreak Blue | Inclusive, Technology, Universal |
| Geek Blue | Exploration, Research |
| Golden Purple | Elegant, Romantic |
| French Magenta | Bright, Emotional |

### 10-step scale

Each palette runs from step 1 (lightest, nearly white — for tinted backgrounds) to step 10 (darkest — for very high contrast contexts). **Step 6 is the primary tone** — the recommended anchor for brand and functional colors.

The step semantics map approximately to:

| Steps | Usage |
|---|---|
| 1 | Tinted background |
| 2–3 | Hover/active state backgrounds |
| 4–5 | Light tint fills |
| 6 | Primary solid color (brand anchor) |
| 7–8 | Hover/active states for solid fills |
| 9–10 | High-contrast text/icon on light backgrounds |

### Color generation algorithm

Ant Design provides an algorithmic palette generator — given a primary hex value, it generates all 10 steps following Ant Design's color generation rules. Available via the `@ant-design/colors` npm package:

```bash
npm install @ant-design/colors
```

```javascript
import { blue, generate } from '@ant-design/colors';

console.log(blue.primary);  // '#1677FF'
console.log(blue);          // Array of 10 step values

// Generate a custom palette from any hex:
const myPalette = generate('#3052f6');
```

---

## System-level: Neutral palette

A 10-step gray scale (`gray-1` through `gray-10`) provides neutrals for backgrounds, borders, text, and separators. No tint — pure achromatic gray.

---

## Product-level: Brand color

**Default brand color: `#1677ff`** (Daybreak Blue, step 6).

The brand color is applied to primary interactive elements: primary buttons, active links, selected states, progress indicators. All other semantic colors are derived or specified independently of the brand color.

---

## Product-level: Functional colors

Functional colors communicate status and carry fixed semantic meaning. They must remain consistent across a product to preserve user expectations:

| Role | Meaning | Typical color family |
|---|---|---|
| Success | Positive outcome, completion | Polar Green |
| Error / Failure | Problem, invalid state | Dust Red |
| Warning | Caution required | Calendula Gold |
| Info / Link | Neutral information, navigation | Daybreak Blue |

---

## Product-level: Neutral text and surface tokens

Ant Design defines neutral colors as alpha values — this allows them to work correctly on both white and near-white backgrounds, and to auto-adapt in dark mode.

| Element | Light mode | Dark mode |
|---|---|---|
| Heading / Body text | `#000000E0` (87.5% opacity) | `#FFFFFFD9` |
| Secondary text | `#000000A6` (65% opacity) | `#FFFFFFA6` |
| Disabled text | `#00000040` (25% opacity) | `#FFFFFF40` |
| Default border | `#D9D9D9` | `#424242` |
| Separator | `#0505050F` (6% opacity) | `#FDFDFD1F` |
| Layout background | `#F5F5F5` | `#000000` |

These values meet WCAG 2.0 contrast standards for their stated roles.

---

## Design token access

In the React implementation, color tokens are accessed via `theme.useToken()`:

```tsx
import { theme } from 'antd';

const { token } = theme.useToken();
// token.colorPrimary     → brand color
// token.colorSuccess     → success green
// token.colorError       → error red
// token.colorWarning     → warning gold
// token.colorText        → primary text
// token.colorTextSecondary
// token.colorBgContainer → default container background
// token.colorBgElevated  → elevated surface (dropdowns, tooltips)
// token.colorBorder      → default border
```

---

## Philosophy

> "In the design of background applications of Ant Financial, our attitude towards color is restrained."

Color in Ant Design serves communication, not identity. The priority order: information delivery → operational guidance → interactive feedback. In enterprise contexts with dense UIs, competing accent colors create visual noise. The system deliberately limits expressive color use to preserve the signal value of functional colors (success/error/warning).
