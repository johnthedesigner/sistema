---
system: typography
category: foundations
topic: responsive-typography
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-14
source_url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
derived_from:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
  - https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
  - https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
  - https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing
  - https://drafts.csswg.org/css-fonts-4/
tags: [typography, variable-fonts, responsive-type, fluid-typography, optical-sizing, letter-spacing, foundations]
license: CC BY-SA 2.5
---

# Responsive Typography

**Sources:**
- MDN Web Docs: `developer.mozilla.org` (CC BY-SA 2.5) — CSS fonts, clamp(), font-optical-sizing, letter-spacing
- W3C CSS Fonts Module Level 4: `drafts.csswg.org/css-fonts-4/` (W3C Document License)

---

## What responsive typography means

Responsive typography adapts type along two axes: **across breakpoints** (fixed sizes that change at defined widths) and **fluidly** (sizes that scale continuously with the viewport). The choice between these approaches — and when to combine them — is a design system decision with performance and legibility implications.

A second dimension of responsiveness is **optical quality**: whether the type rendering is appropriate for the size at which it appears. Variable fonts with an optical size axis adjust their letterform geometry per size, producing better rendering quality across the full type scale without requiring multiple font files.

---

## Variable fonts

A variable font encodes a continuous range of weights, widths, and other stylistic properties in a single file, rather than requiring a separate file per style. A family with 3 weights × 2 widths × italic would traditionally need 12 files; a variable font replaces them with one.

### The five registered axes

Variable fonts define variation using named axes. Five axes are registered by the OpenType specification:

| Axis | CSS property | Tag | Typical range | Effect |
|---|---|---|---|---|
| Weight | `font-weight` | `wght` | 100–900 | Stroke thickness |
| Width | `font-stretch` | `wdth` | 75%–125% | Letterform width |
| Italic | `font-style` | `ital` | 0–1 | Italic substitution |
| Slant | `font-style: oblique` | `slnt` | −90 to 90° | Angle without substitution |
| Optical size | `font-optical-sizing` | `opsz` | Varies | Glyph geometry by size |

Custom axes (uppercase four-letter tags like `GRAD` for grade, `CASL` for casual) extend beyond the registered set — each typeface can define its own.

### CSS implementation

**Preferred approach — use the standard CSS properties:**

```css
@font-face {
  font-family: "Inter Variable";
  src: url("inter-variable.woff2") format("woff2-variations");
  font-weight: 100 900;   /* Declare the weight range */
  font-style: normal;
  font-display: swap;
}

/* Use standard properties — not font-variation-settings */
body  { font-weight: 400; }
strong { font-weight: 700; }
h1    { font-weight: 650; font-stretch: 90%; }
```

**Lower-level syntax — `font-variation-settings` — for custom axes or non-standard values:**

```css
/* Must redeclare ALL values when changing any one */
.display-heading {
  font-variation-settings:
    "wght" 650,
    "wdth" 90,
    "opsz" 48,
    "GRAD" 88;   /* custom Grade axis */
}
```

**The CSS custom property workaround** avoids the redeclaration problem:

```css
:root {
  --font-wght: 400;
  --font-opsz: 16;
}

body {
  font-variation-settings: "wght" var(--font-wght), "opsz" var(--font-opsz);
}

@media (prefers-color-scheme: dark) {
  :root { --font-wght: 350; } /* Lighter weight for dark backgrounds */
}
```

### Design system implications

**Performance:** Replace multiple static font files with one variable font file. A typical implementation with one variable font and one weight of an italic companion is typically smaller than four separate static font files.

**Non-integer weights:** Variable fonts allow `font-weight: 375` or `font-weight: 650` — intermediate values that static fonts cannot express. Use this for heading hierarchy where the jump between 400 and 700 is too coarse.

**Width axis for density:** The `wdth` axis (accessed via `font-stretch`) can compress type for data-dense contexts (narrow table cells, compact labels) without changing to a separate condensed face. Typical range: `90%` (compact) to `110%` (wide/display).

**Feature detection:**

```css
@supports (font-variation-settings: "wght" 400) {
  body { font-family: "Inter Variable", sans-serif; }
}
```

---

## Optical sizing

**Optical sizing** (`font-optical-sizing` / `opsz` axis) adjusts the geometric design of letterforms based on the size at which they render:

- **At small sizes:** strokes are thicker, serifs are larger, apertures are more open — compensating for optical compression and rendering limitations
- **At large sizes:** strokes are thinner, details are more refined, letterfit tightens — exploiting the available visual resolution

```css
/* Enabled by default — 'auto' tells the browser to adjust per size */
body { font-optical-sizing: auto; }

/* Disable when you want exactly the same letterform at all sizes */
.icon-label { font-optical-sizing: none; }
```

**Key points:**
- `font-optical-sizing: auto` is the default. It only has an effect if the font includes an `opsz` axis — otherwise it does nothing.
- When using `font-variation-settings: "opsz" <value>`, set the value to the rendered font size in points or pixels — `"opsz" 16` for body text at 16px, `"opsz" 48` for a 48px heading.
- Setting `font-optical-sizing: none` while using `font-variation-settings` with an `opsz` value produces inconsistent results. Use one or the other, not both.

**Design system application:** When a design system uses a variable font with an `opsz` axis across a type scale, optical sizing makes the same face look intentionally calibrated at every size — not like a scaled photocopy. Set `font-optical-sizing: auto` globally and override to `none` only for specific decorative or icon contexts where you want a fixed rendering.

---

## Fluid typography with `clamp()`

Fluid typography scales font size continuously between a minimum and maximum as the viewport width changes. CSS `clamp()` achieves this without media queries.

### Syntax

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

- `MIN`: the smallest the font will be (used on narrow viewports)
- `PREFERRED`: the viewport-relative value that drives scaling
- `MAX`: the largest the font will be (used on wide viewports)

### Practical example: a fluid type scale

```css
/* Body text: scales from 16px to 18px */
body {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
}

/* Heading: scales from 28px to 48px */
h1 {
  font-size: clamp(1.75rem, 1.25rem + 2.5vw, 3rem);
}

/* Display: scales from 36px to 72px */
.hero-heading {
  font-size: clamp(2.25rem, 1.5rem + 4vw, 4.5rem);
}
```

### How to construct a clamp value

The preferred value `0.9rem + 0.5vw` defines the slope of the scaling curve. To find the right values:
1. Decide the minimum font size (`f_min`) and the viewport width where it applies (`v_min`)
2. Decide the maximum font size (`f_max`) and the viewport width where it applies (`v_max`)
3. Slope: `(f_max − f_min) / (v_max − v_min)`
4. Intercept: `f_min − slope × v_min`
5. Result: `font-size: clamp(f_min, intercept + slope × 100vw, f_max)`

Tools like `clamp.font-size.app` do this calculation — provide the two size/viewport pairs and get the formula.

### Accessibility constraint

When using `font-size: clamp()` with a viewport-relative preferred value, ensure the minimum value is at least half the maximum value. WCAG 1.4.4 (Resize Text) requires that text be resizable to 200% without loss of content. If the min is too close to the max, users who zoom in can't get the full 2× scaling. Prefer rem-based mins and maxes; avoid vw-only values that defeat user zoom.

```css
/* ✓ min (1rem) leaves room for 2× zoom to reach max (2rem) */
font-size: clamp(1rem, 0.5rem + 2.5vw, 2rem);

/* ✗ max is not ≥ 2× min — zoom to 200% won't fully scale */
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
```

### Fluid vs. breakpoint-based type

| Approach | When to use | Trade-off |
|---|---|---|
| **Fluid (clamp)** | Marketing, editorial, hero sections where text and container relationship is fluid | Continuous scaling is smooth but harder to design for exactly |
| **Breakpoint steps** | Dense UI, data tables, components with fixed layouts | Predictable at any designed breakpoint; may step abruptly |
| **Combined** | Body type fluid, UI labels breakpoint-stepped | Most common in production systems; fluid body avoids jarring reflows |

Most design systems use breakpoint-based steps for UI components (where the layout itself is step-based) and fluid scaling for editorial or marketing content areas.

---

## Letter-spacing (tracking) by size

**Tracking** (CSS `letter-spacing`) adjusts the space between all characters uniformly. The direction and amount of tracking should correlate with font size:

| Size range | Tracking direction | Rationale |
|---|---|---|
| Display / hero (48px+) | Negative (`−0.025em` to `−0.05em`) | Large type spreads visually; tightening preserves density |
| Large heading (28–48px) | Slightly negative or neutral | Depends on typeface — some need tightening, others don't |
| Body text (14–24px) | Neutral to slightly positive | Factory setting is usually right; very small adjustments |
| Small / caption (11–13px) | Positive (`+0.01em` to `+0.04em`) | Small type benefits from slightly open spacing for legibility |
| All-caps text | Always positive | Capital letterforms need extra spacing at any size |

```css
/* Example: letter-spacing per type role */
.display   { font-size: 4rem;   letter-spacing: -0.03em; }
.h1        { font-size: 2.5rem; letter-spacing: -0.02em; }
.h2        { font-size: 1.75rem; letter-spacing: -0.01em; }
.body      { font-size: 1rem;   letter-spacing: 0; }
.caption   { font-size: 0.75rem; letter-spacing: 0.02em; }
.label-caps {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;    /* All-caps needs extra room */
}
```

**Always use `em` units for letter-spacing** — they scale with `font-size`, maintaining the same visual relationship at every size. Pixel values produce the wrong spacing when users change their font size or when the containing element's size changes responsively.

**Internationalization warning:** Never apply letter-spacing to languages with connected scripts (Arabic, Persian, Urdu, Devanagari, etc.). Tracking breaks visual ligature connections that are grammatically significant in these scripts. If a design system serves international audiences, either scope letter-spacing to specific classes or implement it per writing system.

---

## Weight adjustment for dark mode

Variable fonts enable a subtle but effective dark mode refinement: slightly reducing font weight for light-on-dark text. On dark backgrounds, letterforms appear slightly heavier due to the halation effect (light text on dark appears to bleed outward). Reducing weight by 25–50 units compensates:

```css
body { font-weight: 400; }

[data-theme="dark"] body {
  font-weight: 350; /* Compensate for halation on dark backgrounds */
}
```

This is only practical with variable fonts — static fonts have no intermediate weight between 300 and 400. For design systems with variable font support, it is a low-cost quality improvement that pairs well with the color token dark mode transition.

---

## Design system checklist: responsive typography

- [ ] Declare `font-optical-sizing: auto` globally when using a variable font with `opsz` axis
- [ ] Use `font-weight` and `font-stretch` (not `font-variation-settings`) for registered axes
- [ ] Apply `letter-spacing` in `em` units, not `px`; scope to specific type roles, not globally
- [ ] Use `clamp()` for fluid type in editorial/hero contexts; keep UI component sizes breakpoint-stepped
- [ ] Ensure `clamp()` min/max ratio allows 200% zoom (WCAG 1.4.4)
- [ ] Apply `font-synthesis: none` when using italic axis to prevent browser-synthesized italics
- [ ] Never apply letter-spacing to Arabic, Hebrew, or connected-script languages
- [ ] Consider weight adjustment (−25 to −50 units) for dark mode if variable font supports it
