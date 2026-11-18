---
system: tailwind
category: design-systems
topic: typography
content_type: guidance
status: latest
version_label: "Tailwind CSS v4"
retrieved: 2026-11-17
source_url: https://tailwindcss.com/docs/font-size
license: public documentation, no explicit license (framework code MIT)
tags: [tailwind, typography, font-size, type-scale]
---

# Font size utilities

**Source:** `tailwindcss.com/docs/font-size`

Tailwind names font sizes with T-shirt sizes, not roles. Each `--text-*` variable has a paired `--text-*--line-height`, so a size utility sets both.

| Utility | Size | Paired line height |
|---|---|---|
| `text-xs` | 0.75rem (12px) | 1rem (≈1.333) |
| `text-sm` | 0.875rem (14px) | 1.25rem (≈1.429) |
| `text-base` | 1rem (16px) | 1.5rem (1.5) |
| `text-lg` | 1.125rem (18px) | 1.75rem (≈1.556) |
| `text-xl` | 1.25rem (20px) | 1.75rem (1.4) |
| `text-2xl` | 1.5rem (24px) | 2rem (≈1.333) |
| `text-3xl` | 1.875rem (30px) | 2.25rem (1.2) |
| `text-4xl` | 2.25rem (36px) | 2.5rem (≈1.111) |
| `text-5xl` | 3rem (48px) | 1 |
| `text-6xl` | 3.75rem (60px) | 1 |
| `text-7xl` | 4.5rem (72px) | 1 |
| `text-8xl` | 6rem (96px) | 1 |
| `text-9xl` | 8rem (128px) | 1 |

Notes:
- The paired line height tightens as size grows, reaching 1 from `text-5xl` up.
- `text-sm/6` sets size and line height together (line height from the spacing scale, 6 × 4px = 24px).
- Arbitrary values: `text-[14px]`, or `text-(length:--my-size)` for a custom property.
- Responsive: `text-sm md:text-base`.
- Custom sizes: declare `--text-<name>` in `@theme` (for example `--text-tiny: 0.625rem` creates `text-tiny`). A size can declare its own `--text-<name>--line-height`, `--text-<name>--letter-spacing`, and `--text-<name>--font-weight`.

**Implication for naming:** sizes describe magnitude only. Purpose (heading, body, label) lives in the component classes that combine a size with weight, tracking, and color. A project can still define role-named sizes (for example `--text-body`, `--text-heading-lg`) and get `text-body` utilities.
