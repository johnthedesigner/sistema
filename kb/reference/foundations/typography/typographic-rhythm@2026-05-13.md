---
system: typography
category: foundations
topic: typographic-rhythm
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-13
source_url: https://webtypography.net/
derived_from:
  - https://webtypography.net/
  - https://practicaltypography.com/
tags: [typography, rhythm, rag, hyphenation, small-caps, word-spacing, vertical-rhythm, foundations]
license: CC BY-NC 4.0
---

# Typographic Rhythm

**Sources:**
- The Elements of Typographic Style Applied to the Web: `webtypography.net` (CC BY-NC 4.0) — Bringhurst's principles applied to CSS
- Practical Typography: `practicaltypography.com` (Matthew Butterick)

---

## What typographic rhythm is

Rhythm in typography is the visual regularity produced by consistent spacing relationships. Just as musical rhythm emerges from a repeating beat, typographic rhythm emerges from a base unit — the body text line height — from which all other vertical spacing is derived.

Rhythm applies in two axes:
- **Vertical rhythm**: consistent spacing between all page elements (paragraphs, headings, images, blockquotes) based on the body text line height
- **Horizontal rhythm**: regular, appropriate spacing within and between words along each line

Both axes contribute to a page feeling settled and well-composed, or restless and arbitrarily spaced.

---

## Rag and text alignment

**Rag** is the irregular right edge of left-aligned (ragged right) text. Controlled rag — where no single line is dramatically shorter or longer than its neighbors — is a mark of careful typesetting.

### Don't justify on the web

Justified text (straight margins on both sides) requires sophisticated automatic hyphenation and letter-spacing adjustment to avoid rivers — channels of white space that flow vertically through text. The typographic consensus is that justified text should not be used on the web without CSS hyphenation support, because browsers cannot reliably prevent rivers.

```css
/* Use left alignment (ragged right) for body text on the web */
p { text-align: left; }
```

**Specific guidance:**
- Narrow columns should always be set ragged — the short line lengths make justification gaps severe
- Sans-serif typefaces are typically better set ragged regardless of measure
- Monospaced fonts always require ragged setting — their fixed-width characters make even spacing impossible to justify

### Good rag vs. bad rag

Good rag has modest, random variation between line lengths. Bad rag has a short line followed by a long line followed by a short line — a staircase pattern — or a dramatically short line in the middle of a paragraph (a "widow" or "orphan" problem). CSS cannot fix bad rag automatically; it is a text authoring or font sizing concern.

---

## Vertical rhythm

The body text **line height** (in pixels) is the fundamental vertical unit. All other vertical spacing on the page should align to this unit or multiples of it.

**Example:** Body text at `16px` with `line-height: 1.5` produces an `24px` line height. All spacing should be multiples of 24px.

```css
body {
  font-size: 16px;
  line-height: 1.5;   /* 24px base unit */
}

p {
  margin-bottom: 1.5rem; /* 24px — one line height */
}

h2 {
  font-size: 24px;
  line-height: 1;        /* recalculate: 24px / 24px = 1 */
  margin-top: 3rem;      /* 48px — two line heights */
  margin-bottom: 1.5rem; /* 24px — one line height */
}
```

**When heading sizes change the rhythm:** A heading at a different font size needs its own `line-height` recalculated to remain on the grid. If body is `16px/1.5 = 24px` and a heading is `20px`, its line-height should be `24 ÷ 20 = 1.2` to maintain the 24px grid. Values that are not multiples of the base can be distributed asymmetrically in top and bottom margins so that the total is always a multiple of the base unit.

**Images in the rhythm:** Images should be sized in em units where possible, so they scale with text size and the rhythm holds when users change their browser font size.

### Practical compromise

Strict vertical grid alignment is often impractical in component-based UI systems — component boundaries, padding, and dynamic content make perfect adherence difficult. The useful version of this principle is: use the body text line height as the foundation for all spacing tokens, and prefer spacings that are multiples of that unit (or half-multiples for tighter contexts).

---

## Word spacing

The `word-spacing` property controls the space between words. It adds to or subtracts from the font's natural inter-word spacing rather than setting an absolute value.

```css
/* Add spacing — use ems so it scales with font-size */
p { word-spacing: 0.1em; }

/* Reduce spacing */
.tight { word-spacing: -0.05em; }
```

**Use ems, not pixels.** Word spacing specified in `em` units scales proportionally when users increase their browser font size. Pixel values do not — they produce the same absolute gap regardless of text size.

**Ragged vs. justified text:** In ragged (left-aligned) text, word spacing should be constant. In justified text, word spacing must be elastic — browsers that support justification will automatically vary word spacing to fill lines. CSS `word-spacing` overrides this in justified contexts, which can make justification worse.

---

## Hyphenation

Hyphenation allows words to break across lines, reducing rag extremes and enabling tighter measures. CSS supports automatic hyphenation:

```css
p {
  hyphens: auto;
  hyphenate-limit-chars: 6 3 3; /* min total, min before break, min after break */
}
```

**The fundamental rule:** Leave at least two or three characters before the hyphen and carry at least three characters to the next line. "fi-nally" is correct; "final-ly" is borderline (too few after); "f-inally" is wrong.

**Additional constraints:**
- Never hyphenate headings or captions — the disruption is visible and the lines are too short to benefit
- Avoid more than two consecutive hyphens across adjacent lines
- Don't hyphenate compound words like "self-aware" — the hyphen already present disambiguates the break
- Two-letter geographical abbreviations (US, UK, EU) and personal-name acronyms (JFK, MLK) should not hyphenate

**CSS implementation:**

```css
/* Enable automatic hyphenation with language hint */
html { lang="en"; }

p {
  hyphens: auto;
}

/* Disable for headings */
h1, h2, h3 {
  hyphens: none;
}
```

Hyphenation requires `lang` to be set on the root element — browsers select the hyphenation dictionary by language. Without it, `hyphens: auto` has no effect in most browsers.

---

## Small caps

**Genuine small caps** are purpose-designed letterforms — not algorithmically shrunken capitals. Genuine small caps have the same stroke weight and proportions as lowercase letters at the same size. Browser-synthesized small caps (when the font doesn't include them) are lighter and appear tonally different from the surrounding text.

```css
/* Use genuine small caps for abbreviations and acronyms */
abbr {
  font-variant-caps: all-small-caps;
  /* all-small-caps converts both upper and lower to small cap forms */
  /* 'small-caps' only converts lowercase — leaves true capitals unchanged */
}
```

**When to use small caps:**
- Multi-letter acronyms and abbreviations within body text: `NATO`, `OAS`, `HTML`, `CSS`
- Time designations: `3:00 AM`, `CE`, `BC`, `AD`
- Avoid for two-letter geographical abbreviations (US, UK) and personal-name initials (JFK) — these read more naturally in full caps

**When not to use small caps:**
- For decorative purposes — they are a functional letterform, not a style choice
- When the font does not include genuine small cap outlines (`font-variant-caps` on a font without small cap support produces poor synthesis)

**Check font support:**

```css
@supports (font-variant-caps: small-caps) {
  abbr { font-variant-caps: all-small-caps; }
}
```

---

## Numerals and figure selection

Fonts offer different numeral styles through `font-variant-numeric`:

| Figure type | CSS value | Use |
|---|---|---|
| Lining (default) | `normal` | Numbers same height as capitals; works in headings |
| Old-style | `oldstyle-nums` | Numbers with ascenders/descenders; better in body text |
| Tabular | `tabular-nums` | Fixed-width for alignment in tables |
| Proportional | `proportional-nums` | Variable-width; natural in text, wrong in tables |

```css
/* Data table: fixed-width lining figures for column alignment */
.data-table td { font-variant-numeric: tabular-nums lining-nums; }

/* Body text: old-style figures sit better with lowercase */
article p { font-variant-numeric: oldstyle-nums proportional-nums; }
```

**Design system implications:** Many design systems apply `tabular-nums` globally to numeric cells in data components. This is correct for data alignment but should not bleed into prose contexts. The distinction is a functional one, not aesthetic.

---

## Design system applications

**Spacing tokens derived from line height:**
The correct source for base spacing tokens is the body text line height, not an arbitrary 4px or 8px grid. A body text at `16px/1.5 = 24px` suggests an 8px (half-unit) or 24px (full-unit) spacing base. Many systems use 4px (a quarter-unit) for fine-grained control and 8px as the practical minimum for most spacing — these work cleanly when the line height is 24px, 32px, or 40px.

**Justify avoidance:**
Components that render arbitrary text content (CMS content blocks, card descriptions, tooltips) should default to `text-align: left`. Justified text in variable-width containers with unpredictable content will produce severe rivers and is one of the most common typographic errors in production design systems.

**Abbreviation markup:**
Design systems that expose typography tokens should document that `<abbr>` elements with genuine small cap font support should receive `font-variant-caps: all-small-caps`. This is typically a global stylesheet concern, not a per-component decision.
