---
system: radix
category: design-systems
topic: typography
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://www.radix-ui.com/themes/docs/theme/typography
tags: [typography, type-scale, tokens, radix]
---

# Typography

**Source:** `radix-ui.com/themes/docs/theme/typography`

Radix Themes uses a 9-step type scale where every step has coordinated font size, line height, and letter spacing values. Typography is exposed through typed React components (`Text`, `Heading`) and a set of CSS variable tokens scoped to `.radix-themes`.

---

## Type scale

| Step | Font size | Letter spacing | Line height |
|---|---|---|---|
| 1 | 12px | 0.0025em | 16px |
| 2 | 14px | 0em | 20px |
| 3 | 16px | 0em | 24px |
| 4 | 18px | -0.0025em | 26px |
| 5 | 20px | -0.005em | 28px |
| 6 | 24px | -0.00625em | 30px |
| 7 | 28px | -0.0075em | 36px |
| 8 | 35px | -0.01em | 40px |
| 9 | 60px | -0.025em | 60px |

Negative letter spacing at larger sizes compensates for the optical spread of large letterforms. Steps 1–3 use zero or positive tracking to maintain legibility at small sizes.

Usage:

```jsx
<Text size="3">Body copy</Text>
<Heading size="6">Section heading</Heading>
```

---

## Font weights

| Weight | CSS value |
|---|---|
| Light | 300 |
| Regular | 400 |
| Medium | 500 |
| Bold | 700 |

```jsx
<Text weight="medium">Emphasized text</Text>
```

---

## Default font families

| Role | Default stack |
|---|---|
| Text | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', system-ui, sans-serif` |
| Code | `'Menlo', 'Consolas', 'Bitstream Vera Sans Mono', monospace` |
| Emphasis (`<Em>`) | `'Times New Roman', 'Times', serif` |
| Quote (`<Quote>`) | `'Times New Roman', 'Times', serif` |

The default stack uses OS-native fonts, requiring no font loading and minimizing layout shift. Custom fonts are opt-in.

---

## Typography components

| Component | Purpose |
|---|---|
| `<Text>` | Body copy, labels, inline content. Accepts `size`, `weight`, `color`, `highContrast` |
| `<Heading>` | Titles and headings. Same props as `Text` |
| `<Em>` | Italic emphasis — uses the serif emphasis font |
| `<Strong>` | Bold importance |
| `<Code>` | Inline code — uses monospace stack |
| `<Blockquote>` | Pull quotes |
| `<Link>` | Hyperlinks with accent color and focus ring |
| `<Kbd>` | Keyboard shortcut labels |

---

## Customization via CSS variables

All typographic tokens are CSS variables on `.radix-themes`. Override them after the Radix stylesheet to take precedence.

### Custom font families

```css
.radix-themes {
  --default-font-family: /* body font */;
  --heading-font-family: /* heading font */;
  --code-font-family:    /* monospace font */;
  --strong-font-family:  /* bold text font */;
  --em-font-family:      /* emphasis font */;
  --quote-font-family:   /* blockquote font */;
}
```

### With next/font

```jsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```css
.radix-themes {
  --default-font-family: var(--font-inter);
}
```

### Custom font weights

```css
.radix-themes {
  --font-weight-light:   200;
  --font-weight-regular: 300;
  --font-weight-medium:  600;
  --font-weight-bold:    800;
}
```

### Advanced heading settings

```css
.radix-themes {
  --heading-font-family:        "Untitled Sans", sans-serif;
  --heading-font-size-adjust:   1.05;    /* scale headings relative to body */
  --heading-font-style:         normal;
  --heading-leading-trim-start: 0.42em;  /* optical cap-height trim */
  --heading-leading-trim-end:   0.38em;
  --heading-letter-spacing:     -0.01em;
}
```

`--heading-font-size-adjust` multiplies the heading's step size — useful when the heading typeface has a different x-height than the body font and needs optical correction.

`--heading-leading-trim-start/end` implement CSS `leading-trim` (trimming whitespace above cap-height and below baseline) via custom values matched to the specific typeface's metrics.

---

## Full token reference

Source: `github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/styles/tokens/typography.css`
