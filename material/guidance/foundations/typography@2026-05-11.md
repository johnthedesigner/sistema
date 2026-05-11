---
system: material
category: foundations
topic: typography
content_type: guidance
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://m3.material.io/styles/typography
tags: [typography, typescale, typeface, roles, roboto, display, headline, body, label]
---

# Material Design 3 — Typography

## Overview

M3's typography system is built around two concepts: the **typeface** (font family) and the **typescale** (a set of role-based text styles). These are represented as separate token layers, and the relationship between them is explicit: typeface tokens define the font families, and typescale tokens map each text role to specific family, size, weight, and line-height values.

---

## Typefaces

M3 distinguishes two typeface roles:

| Typeface Role | Token | Default | Purpose |
|---|---|---|---|
| **Brand** | `--md-ref-typeface-brand` | `Roboto` | Display, headline, title scales — expressive, prominent text |
| **Plain** | `--md-ref-typeface-plain` | `Roboto` | Body, label scales — readable, utilitarian text |

In the default system, both roles use Roboto. Customization typically involves replacing `brand` with a product's own display typeface while keeping a system/neutral font for `plain`.

Each typeface requires three weights to be loaded: **Regular (400)**, **Medium (500)**, and **Bold (700)**. These weights map to M3's `normal`, `medium`, and `bold` token values.

**Important:** If you do not customize the typeface, you must load Roboto explicitly (e.g. from Google Fonts). The system does not bundle the font.

```css
/* Load Roboto */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
```

Typeface customization via CSS:
```css
@import url('...your-font...');
:root {
  --md-ref-typeface-brand: 'Your Brand Font';
  --md-ref-typeface-plain: system-ui;
}
```

---

## Typescale

The typescale is M3's complete set of text styles, organized into five roles, each available in three sizes.

### The Five Typescale Roles

| Role | Purpose | When to Use |
|---|---|---|
| **Display** | Largest text. Short, important strings. | Hero headings, splashscreens, decorative moments |
| **Headline** | High-emphasis text, shorter than display | Page titles, section headers, dialog titles |
| **Title** | Medium emphasis. Longer than headlines. | List headings, card titles, app bar titles |
| **Body** | The workhorse. Long-form readable content | Article text, descriptions, form instructions |
| **Label** | Small, utilitarian. Button text, captions | Button labels, field labels, captions, chip labels |

### Sizes Within Each Role

Each role has three sizes: `large`, `medium`, `small`. Use larger sizes for more emphasis and visual prominence; smaller sizes for denser UIs or secondary information.

### Default Type Scale Values

| Role + Size | Font Family | Weight | Size | Line Height |
|---|---|---|---|---|
| Display Large | Brand | Regular (400) | 57sp | 64sp |
| Display Medium | Brand | Regular (400) | 45sp | 52sp |
| Display Small | Brand | Regular (400) | 36sp | 44sp |
| Headline Large | Brand | Regular (400) | 32sp | 40sp |
| Headline Medium | Brand | Regular (400) | 28sp | 36sp |
| Headline Small | Brand | Regular (400) | 24sp | 32sp |
| Title Large | Brand | Regular (400) | 22sp | 28sp |
| Title Medium | Brand | Medium (500) | 16sp | 24sp |
| Title Small | Brand | Medium (500) | 14sp | 20sp |
| Body Large | Plain | Regular (400) | 16sp | 24sp |
| Body Medium | Plain | Regular (400) | 14sp | 20sp |
| Body Small | Plain | Regular (400) | 12sp | 16sp |
| Label Large | Plain | Medium (500) | 14sp | 20sp |
| Label Medium | Plain | Medium (500) | 12sp | 16sp |
| Label Small | Plain | Medium (500) | 11sp | 16sp |

*sp = scalable pixels (equivalent to rem in web contexts)*

---

## Token Naming Convention

Web typescale tokens follow the pattern `--md-sys-typescale-<role>-<size>-<property>`:

```css
--md-sys-typescale-body-medium-font        /* font-family */
--md-sys-typescale-body-medium-size        /* font-size */
--md-sys-typescale-body-medium-line-height /* line-height */
--md-sys-typescale-body-medium-weight      /* font-weight */
```

Typeface reference tokens: `--md-ref-typeface-brand`, `--md-ref-typeface-plain`

**Shortcut:** Changing `--md-ref-typeface-brand` and `--md-ref-typeface-plain` cascades through all typescale roles that use those families, avoiding the need to update each role individually.

For per-role typeface overrides (e.g. a different font for headlines specifically):
```css
:root {
  --md-sys-typescale-headline-font: var(--my-display-font);
  --md-sys-typescale-title-font: var(--my-display-font);
}
```

---

## Applying Typography — Usage Guidelines

**Display:** Reserve for the single most important text on a screen. Typically one instance per view. Avoid using display sizes for interactive or functional text.

**Headline:** Used for section titles, dialog headers, and page-level labels. Should communicate clear hierarchy. One to two per screen is typical.

**Title:** For component-level headings — card titles, list item headers, app bar labels. Title Large is appropriate for prominent app bar text; Title Medium and Small for secondary component headings.

**Body:** The primary reading text. Body Large for long-form prose; Body Medium for standard UI descriptions; Body Small for supplementary or fine-print text.

**Label:** For all small utility text — button labels, form field labels, tab labels, chip text, captions. Label Large is the standard for button text; Label Small for captions and timestamps.

---

## Do's and Don'ts

**Do:**
- Use the typescale role that matches the *content's purpose*, not its desired visual size
- Load all three weights (400, 500, 700) for any font you configure
- Use `--md-ref-typeface-brand` and `--md-ref-typeface-plain` to change fonts globally rather than overriding individual tokens
- Maintain the line-height values — they are calibrated for readability

**Don't:**
- Use Display or Headline sizes for body text, even if you want large body text — adjust size via the appropriate body tokens
- Skip weight loading — missing weights cause browsers to synthesize them, producing poor results
- Mix M2 typography class names (`mdc-typography--headline1`) with M3 token names

---

## Sources

- Typography Overview: https://m3.material.io/styles/typography
- Applying Type: https://m3.material.io/styles/typography/applying-type
- Type Scale Tokens: https://m3.material.io/styles/typography/type-scale-tokens
- Material Web Typography: https://material-web.dev/theming/typography/
