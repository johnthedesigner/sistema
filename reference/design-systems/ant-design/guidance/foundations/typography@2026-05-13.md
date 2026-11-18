---
system: ant-design
category: design-systems
topic: typography
content_type: guidance
status: latest
version_label: "Ant Design 5.x"
retrieved: 2026-05-13
source_url: https://ant.design/docs/spec/font
tags: [typography, tokens, font, ant-design]
---

# Typography

**Source:** `ant.design/docs/spec/font`

Ant Design's typographic system is designed for information-dense enterprise interfaces. The priority is legibility at common reading distances, not expressive scale or brand personality.

---

## Font family

System-native font stack — no custom typeface loading:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
```

**Why this stack:**
- `Noto Sans` is explicitly included for comprehensive CJK (Chinese, Japanese, Korean) glyph coverage — this is distinctive versus Western-first systems
- No custom typeface means no font loading latency, which matters in enterprise intranet environments
- System fonts are optimized by each OS for their native rendering environment

**Tabular numerics:** Apply `font-variant-numeric: tabular-nums` to any numeric display where vertical alignment matters (data tables, financial figures, metrics).

---

## Base font size

**14px** — increased from an earlier 12px default to optimize readability at standard enterprise monitor distances (approximately 50cm) and typical viewing angles.

---

## Font size scale

10-step scale inspired by pentatonic scales and natural logarithmic progression. The Ant Design documentation doesn't publish the full table of exact step values (they are generated from the token system), but establishes:

- Base: `14px` / `22px` line height (1.57 ratio)
- Heading tokens: `fontSizeHeading1` through `fontSizeHeading5`
- Extended: `fontSizeLG`, `fontSizeSM`

**Guidance on scale use:** "Limit font scale choices to 3 to 5 types within a single system, except for display contexts." — Ant Design typography spec. This reflects the enterprise context where visual noise from too many type sizes impedes information scanning.

---

## Font weights

| Weight | Value | Usage |
|---|---|---|
| Regular | 400 | Primary text, body, labels |
| Medium | 500 | Emphasis, secondary hierarchy |
| Semibold | 600 | Bold English text only — not Chinese |

**Why semibold is English-only:** CJK characters are structurally complex at small sizes. Increasing weight reduces legibility for Chinese characters at body text sizes. Ant Design explicitly scopes `600` weight to Latin/English contexts.

---

## Text color tokens

Text color is specified as alpha values to adapt correctly to light and dark surfaces:

| Role | Light mode | Dark mode | Token |
|---|---|---|---|
| Primary text (headings, body) | `#000000E0` | `#FFFFFFD9` | `colorText` |
| Secondary text | `#000000A6` | `#FFFFFFA6` | `colorTextSecondary` |
| Tertiary / placeholder | — | — | `colorTextTertiary` |
| Disabled | `#00000040` | `#FFFFFF40` | `colorTextDisabled` |

These values meet WCAG AAA (7:1 ratio) for heading and body text. Using alpha rather than fixed hex ensures correct appearance on non-white backgrounds.

---

## Design token access

```tsx
import { theme } from 'antd';

const { token } = theme.useToken();

// Font sizes
token.fontSize          // 14 — base
token.fontSizeLG        // 16
token.fontSizeSM        // 12
token.fontSizeHeading1  // ~38
token.fontSizeHeading2  // ~30
token.fontSizeHeading3  // ~24
token.fontSizeHeading4  // ~20
token.fontSizeHeading5  // ~16

// Line heights
token.lineHeight        // 1.5714... (22/14)
```

---

## Design principles

Three governing rules for Ant Design typography implementation:

1. **Systematic thinking:** Establish and maintain a clear hierarchy for all text roles (heading, body, caption, label) rather than making one-off size choices per component.
2. **Minimalism:** Resist adding new type styles. Proliferating font sizes and weights creates visual noise without adding information.
3. **Subtle rhythm:** "Create subtle rhythm through thoughtful scale selection" — use scale steps that produce visually harmonious size relationships, not arbitrary px values.
