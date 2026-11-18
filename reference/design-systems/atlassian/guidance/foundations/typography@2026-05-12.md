---
system: atlassian
category: foundations
topic: typography
content_type: guidance
status: latest
version_label: "v1 (current)"
retrieved: 2026-05-12
source_url: https://atlassian.design/foundations/typography
tags: [typography, atlassian-sans, atlassian-mono, charlie, tokens, rem, heading, body]
---

# Atlassian Design System — Typography

## Overview

Typography is the system of fonts and text styles for Atlassian product interfaces. It enhances communication, reinforces brand, and guides users' emotions. Atlassian has moved its app suite to a refreshed typography system based on the Atlassian Sans and Atlassian Mono typefaces.

---

## Typefaces

Atlassian uses different typefaces for different contexts:

### App fonts (in-product use)

| Font | Use |
|---|---|
| **Atlassian Sans** | All in-app UI text — headings, body, labels, UI chrome |
| **Atlassian Mono** | Code, inline code, terminal output |

App fonts are optimized for product interfaces and ensure consistency across all browsers and Atlassian apps.

Font family stacks:
- Heading/Body: `"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, system-ui, sans-serif`
- Code: `"Atlassian Mono", ui-monospace, Menlo, 'Segoe UI Mono', Ubuntu Mono, monospace`

### Brand fonts (marketing only)

| Font | Use |
|---|---|
| **Charlie Display** | Brand headings in marketing, editorial |
| **Charlie Text** | Brand body text in marketing, editorial |

Brand fonts are not used in product interfaces. They are available to authenticated users via Atlassian Brandfolder.

---

## Typographic Principles

1. **Optimize for readability** — Enhance communication regardless of user ability
2. **Create visual harmony** — Consistent and cohesive; use hierarchy and space to simplify complex information
3. **Contextualize for different users** — Tailor for different preferences, OS, and applications

---

## Token System

Typography is expressed through `font.*` tokens. Unlike CSS properties, the token encodes the full set of typographic values (size, weight, line-height) in a single shorthand.

### Token naming structure

```
font.<category>.<scale>
```

### Heading tokens

| Token | Size | Line-height | Weight |
|---|---|---|---|
| `font.heading.xxlarge` | 2rem (32px) | 2.25rem | 653 (bold) |
| `font.heading.xlarge` | 1.75rem (28px) | 2rem | 653 |
| `font.heading.large` | 1.5rem (24px) | 1.75rem | 653 |
| `font.heading.medium` | 1.25rem (20px) | 1.5rem | 653 |
| `font.heading.small` | 1rem (16px) | 1.25rem | 653 |
| `font.heading.xsmall` | 0.875rem (14px) | 1.25rem | 653 |
| `font.heading.xxsmall` | 0.75rem (12px) | 1rem | 653 |

### Body tokens

| Token | Size | Line-height | Weight |
|---|---|---|---|
| `font.body.large` | 1rem (16px) | 1.5rem | 400 |
| `font.body` | 0.875rem (14px) | 1.25rem | 400 |
| `font.body.small` | 0.75rem (12px) | 1rem | 400 |

### Code token

| Token | Size | Line-height |
|---|---|---|
| `font.code` | 0.875em | 1 |

### Font weights

| Token | Value |
|---|---|
| `font.weight.regular` | 400 |
| `font.weight.medium` | 500 |
| `font.weight.semibold` | 600 |
| `font.weight.bold` | 653 |

Note: Weight 653 is Atlassian's custom bold — a non-standard value tuned for Atlassian Sans rendering.

---

## Rem Units

Typography tokens use **rem** units rather than px for font-size and line-height. At the browser default of 16px:
- `1rem = 16px`
- `0.875rem = 14px`
- `0.75rem = 12px`

Rem units scale with the user's browser font size preference, improving accessibility and responsiveness.

---

## Heading Usage

- Use headings to introduce sections of content, not for visual emphasis alone
- Headings must follow a descending hierarchy (`h1` → `h2` → `h3`) without skipping levels
- Only one `h1` per page (typically the page title)
- Use heading components from `@atlaskit/heading` rather than raw HTML elements, to ensure correct token application

---

## Component Implementation

Typography tokens are applied automatically when using Atlassian's Heading and Text components:

```bash
yarn add @atlaskit/heading
yarn add @atlaskit/primitives
```

For custom implementations, apply `font.*` tokens via CSS custom properties (prefixed `--ds-font-*`) from the `@atlaskit/tokens` package.
