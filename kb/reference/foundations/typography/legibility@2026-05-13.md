---
system: typography
category: foundations
topic: legibility
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-13
source_url: https://practicaltypography.com/body-text.html
derived_from:
  - https://practicaltypography.com/line-spacing.html
  - https://practicaltypography.com/body-text.html
  - https://practicaltypography.com/typography-in-ten-minutes.html
tags: [typography, legibility, line-height, x-height, measure, foundations]
---

# Legibility and Readability

**Sources:**
- Practical Typography: `practicaltypography.com` (Matthew Butterick)
- Web typography conventions: MDN, CSS specification

---

## Legibility vs. readability

These two terms are used interchangeably in casual conversation but refer to different properties:

- **Legibility** is the property of individual characters or words — whether letters can be distinguished from each other. A font is legible when its letterforms are distinct at the intended size and rendering environment.
- **Readability** is the property of text as a whole — how easily a reader can process a block of text over sustained reading. A font can be perfectly legible character-by-character but have poor readability due to line spacing, measure, or contrast.

Design systems primarily engineer for readability — the conditions that make long-form text or dense information comfortable to process. Individual font legibility is upstream of the system's control (it's a property of the typeface itself). Line height, font size, and line length are design system variables.

---

## X-height

**X-height** is the height of a font's lowercase letters, measured from the baseline to the top of the letter "x" (no ascenders or descenders). It is expressed as a ratio of the cap height or em square.

A font with a **high x-height** (lowercase letters that are tall relative to the cap height) is more legible at small sizes because:
- The optical mass of the lowercase text is larger
- The letters have more internal space (apertures, counters) to survive hinting and low-resolution rendering
- The ratio of uppercase to lowercase contrast is reduced, making mixed-case text more even

Design systems that target small UI sizes (12px labels, 11px captions) implicitly depend on high-x-height fonts. System font stacks (used by Ant Design and Radix) inherit the x-height of the OS default — typically San Francisco on macOS (high x-height), Segoe UI on Windows (high x-height), or Roboto on Android (high x-height). When specifying a custom typeface, x-height is a primary legibility criterion.

**At display sizes (36px+):** High x-height creates an even, text-block appearance but loses some of the elegance that comes from greater uppercase/lowercase contrast. Many display-weight type families reduce x-height slightly to improve visual interest at large sizes.

---

## Cap height and type metrics

The **cap height** is the height of a capital letter (typically "H") from the baseline. It is shorter than the ascender height — ascenders on letters like "d", "b", "h" typically rise above capitals.

The **UPM (Units Per Em)** is the internal coordinate system of a font file — typically 1000 or 2048 units. All font metrics (cap height, x-height, ascender, descender) are defined in UPM units. The browser or OS converts UPM coordinates to rendered pixels at a given font-size.

**Why UPM matters:**
- Two fonts at the same CSS `font-size` may appear visually different sizes if their UPM metrics differ. A font with a cap height of 700/1000 UPM will appear larger at `16px` than a font with cap height 600/1000 UPM — even though the specified size is identical.
- This is why the same `font-size: 14px` looks "bigger" in some typefaces and "smaller" in others — what you're actually seeing is a difference in cap-height-to-UPM ratio.
- Design systems that specify font size in pixels are implicitly also specifying visual size conditional on the typeface's internal metrics.

---

## Line height mathematics

### What line height is

**Line height** (CSS: `line-height`) is the vertical distance between the baselines of consecutive text lines. It is composed of the font's natural bounding box plus any additional space added by the layout engine.

The traditional printing term is **leading** (rhymes with "bedding"), named after the lead strips placed between rows of metal type. In digital typography, leading is the extra space above and beyond the font's natural line box.

### The optimal range

For comfortable reading, line height should be **120–145% of the font size** (Butterick, Practical Typography). This translates to unitless CSS values of `1.2–1.45`.

```css
/* Optimal for body text */
body {
  font-size: 16px;
  line-height: 1.5;   /* 150% — 24px; on the generous end */
}

/* Tight but acceptable for dense UI */
.label {
  font-size: 12px;
  line-height: 1.25;  /* 125% — 15px */
}

/* Headings: less line height needed (shorter lines, larger size) */
h1 {
  font-size: 36px;
  line-height: 1.1;   /* 110% — ~40px */
}
```

### Why CSS `line-height` should be unitless

The CSS `line-height` property should almost always be specified without units (as a multiplier, not `px` or `em`). Unitless values are inherited as a ratio and recalculate relative to the element's own font-size. Pixel or em values are inherited as computed values — descendants with different font-sizes inherit the wrong line-height.

```css
/* ✓ Correct — scales with font-size in descendants */
p { line-height: 1.5; }

/* ✗ Wrong — descendants inherit 24px regardless of their font-size */
p { line-height: 24px; }
```

### Line height by text role

| Text role | Size (typical) | Line height | Ratio |
|---|---|---|---|
| Display / hero | 48–60px | 52–66px | 1.05–1.1 |
| Large heading | 28–36px | 32–42px | 1.1–1.2 |
| Small heading | 18–24px | 24–32px | 1.2–1.35 |
| Body text | 14–18px | 20–28px | 1.4–1.6 |
| Small / secondary | 11–13px | 16–20px | 1.3–1.5 |
| Data / label | 11–12px | 16px | 1.3–1.45 |

The general pattern: line height ratio decreases as font size increases. Larger type lines are visually longer, requiring less inter-line space for the eye to track comfortably.

### Why design systems define line heights per step

This is why Material Design 3, Carbon, and Radix all define a specific line height for every size step in their type scale — not a single global line-height. The `displayLarge` step (57px) uses a 64px line height (1.12 ratio), while `bodySmall` (11px) uses a 16px line height (1.45 ratio). Each ratio is calibrated for its size context.

---

## Line length (measure)

The **measure** is the horizontal width of a text column — the number of characters per line.

**Optimal range: 45–90 characters per line** for body text. A practical test: type the lowercase alphabet twice (`abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz`). That 52-character string should approximately span the column width.

| Characters per line | Reading experience |
|---|---|
| < 45 | Too short — excessive line breaks disrupt reading flow |
| 45–90 | Optimal — eye tracks comfortably, natural pausing at line ends |
| > 90 | Too long — eye loses its place when returning to the next line |

The relationship between measure and line height is interactive: longer lines require more line height. When a text column is wide, more inter-line space is needed because the eye must travel further horizontally before returning to the next line. This is why newspaper columns (narrow measure) can use tighter line spacing than book typesetting (wider measure).

**In design systems:** Components like cards, panels, and content sections that constrain column width are implicitly controlling the measure. A card limited to `640px` with `16px` body text and standard padding lands near the 70–80 character range — within the optimal window.

---

## The four variables of body text

Matthew Butterick's four decisions that determine how body text looks (and their interactions):

| Variable | Practical Typography range | Interaction |
|---|---|---|
| **Font size** | 15–25px (screen), 10–12pt (print) | Drives the base for all other calculations |
| **Line height** | 120–145% of font size | Must increase when line length increases |
| **Line length** | 45–90 characters | Drives required line height; constrained by layout |
| **Font choice** | — | Affects apparent size (x-height), required line height, and legibility at set size |

These four variables are not independent — changing one typically requires adjusting the others. A design system that specifies all four per type role (as Material 3 does) is encoding the full set of typographic relationships, not just a size scale.

---

## Design system applications

Understanding these principles explains specific design system decisions:

**Why Radix Themes uses `letter-spacing: -0.025em` at size 9 (60px):**
At large display sizes, optical spread makes letters appear loosely spaced even at normal tracking. Negative letter-spacing compensates — the larger the type, the more negative tracking is needed to maintain apparent density.

**Why Ant Design specifies `font-variant-numeric: tabular-nums` for data:**
Proportional numerals (where "1" is narrower than "0") cause columns of numbers to misalign. Tabular numerals have uniform width, maintaining vertical alignment in data tables. This is a legibility specification, not a stylistic one.

**Why Carbon has two type scales (productive vs. expressive):**
The optimal line height ratios, measures, and size relationships differ between information-dense UI (dense, tight, many elements) and editorial/marketing contexts (generous, expressive, fewer elements). One scale optimized for both simultaneously compromises both.

**Why design systems include `line-height` per size step, not a single global value:**
Because the optimal line-height ratio varies inversely with font size, a global `line-height: 1.5` is wrong at both ends of the scale — too loose at display sizes, too tight at caption sizes. Each step needs its own calibrated value.
