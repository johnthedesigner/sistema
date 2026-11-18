---
system: primer
category: foundations
topic: typography
content_type: guidance
status: latest
version_label: "current"
retrieved: 2026-05-12
source_url: https://github.com/primer/design/blob/main/content/foundations/typography.mdx
tags: [typography, type-scale, tokens, font-weight, font-family, system-fonts]
---

# Primer — Typography

## Overview

Primer's typography system uses `rem` units for accessibility — this allows browser zoom to scale text correctly. Line height values are unitless and aligned to a 4px grid. Each typographic style uses "shorthand" tokens that control size, family, weight, and line-height simultaneously via a single `font` CSS declaration.

**Note:** The typographic styles described here represent the functional token layer. The Storybook component previews on the primer.style doc site show rendered output — actual token values are sourced from `primer/primitives`.

---

## Font families

Primer uses system font stacks — no custom typeface is loaded. This prioritizes performance and ensures text renders with the OS-native font, which users are already accustomed to.

| Token | Stack | Use |
|---|---|---|
| `fontStack-system` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif` | All UI text |
| `fontStack-monospace` | `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace` | Code, terminal output, technical values |
| `fontStack-sansSerifDisplay` | System sans-serif optimized for large display sizes | Display headings (if distinct from system) |

---

## Type scale

Base sizes defined in the `base.text.size` token set (from `primer/primitives`):

| Token | rem | px | Description |
|---|---|---|---|
| `base.text.size.xs` | 0.75rem | 12px | Captions, compact UI labels |
| `base.text.size.sm` | 0.875rem | 14px | Default body text, most UI content |
| `base.text.size.md` | 1rem | 16px | Large body text, small titles |
| `base.text.size.lg` | 1.25rem | 20px | Medium titles, subtitles |
| `base.text.size.xl` | 2rem | 32px | Large page headings |
| `base.text.size.2xl` | 2.5rem | 40px | Display text, hero sections |

---

## Font weights

| Token | Value | Use |
|---|---|---|
| `base.text.weight.light` | 300 | Rarely used; very large display text only |
| `base.text.weight.normal` | 400 | Body text, default |
| `base.text.weight.medium` | 500 | Slightly emphasized labels and metadata |
| `base.text.weight.semibold` | 600 | Headings, strong emphasis |

Always use weight CSS variables (`var(--base-text-weight-semibold)`) rather than hardcoded numeric values.

---

## Functional typographic styles

Shorthand styles covering heading, body, and code categories. Each shorthand token sets size, weight, line-height, and font-family together.

### Headings

| Style | Size | Weight | Use |
|---|---|---|---|
| Display | 2.5rem (40px) | Semibold | Hero sections, large page titles |
| Title Large | 2rem (32px) | Semibold | Top-level page headings |
| Title Medium | 1.25rem (20px) | Semibold | Section headings |
| Title Small | 1rem (16px) | Semibold | Sub-section headings, card titles |
| Subtitle | 1rem (16px) | Medium | Supporting text below a title |

### Body

| Style | Size | Weight | Use |
|---|---|---|---|
| Body Large | 1rem (16px) | Normal | Introductory body text, descriptions |
| Body Medium | 0.875rem (14px) | Normal | Default UI body text |
| Body Small | 0.75rem (12px) | Normal | Compact contexts, helper text |
| Caption | 0.75rem (12px) | Normal | Labels below images, auxiliary context |

### Code

| Style | Use |
|---|---|
| Code Block | Multi-line code samples; monospace font stack, md size |
| Inline Code | Inline technical terms within prose; monospace, slightly smaller |

---

## Line heights

| Token | Value | Use |
|---|---|---|
| `base.text.lineHeight.tight` | 1.25 | Single-line labels, badges, buttons — not multi-line body text |
| `base.text.lineHeight.normal` | 1.5 | Standard body text |
| `base.text.lineHeight.relaxed` | 1.75 | Long-form content, documentation prose |

Line heights are unitless and vary per style, aligning to the 4px grid.

---

## Best practices

### Hierarchy
Use weight to establish content hierarchy. Avoid relying on color alone as the primary method of emphasis.

### Readability
- **Line length:** Aim for ~80 characters per line (W3C guideline). Adjust for context.
- **Alignment:** Default to left-aligned, ragged-right. Justify, center, or right-align only when intentional and appropriate.
- **Font weight:** Use weight CSS variables to set `font-weight` — do not use arbitrary numeric values.
- **Letter spacing:** Do not adjust letter-spacing. There are rare exceptions, but this is a strict default.
- **Heading order:** Do not adjust semantic heading tag order (h1–h6) purely for visual design. Use CSS classes to achieve the desired visual style while maintaining semantic hierarchy.

---

## Related components

- Heading
- PageHeader
- Text
