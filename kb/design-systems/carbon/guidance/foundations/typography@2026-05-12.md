---
system: carbon
category: foundations
topic: typography
content_type: guidance
status: latest
version_label: "v11"
retrieved: 2026-05-12
source_url: https://carbondesignsystem.com/elements/typography/overview/
tags: [typography, ibm-plex, type-tokens, type-scale, productive, expressive]
---

# Carbon Design System — Typography

## Overview

Carbon's typographic system is built on **IBM Plex**, IBM's open-source typeface family. It uses a structured token system to manage typography through two type sets — *productive* and *expressive* — calibrated for their respective usage contexts.

---

## Typeface: IBM Plex

Carbon uses IBM Plex exclusively. The family includes three main styles for use in product:

| Style | Font Stack |
|---|---|
| IBM Plex Sans | `'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif` |
| IBM Plex Serif | `'IBM Plex Serif', 'Georgia', Times, serif` |
| IBM Plex Mono | `'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace` |

IBM Plex is available at [github.com/ibm/plex](https://github.com/ibm/plex).

---

## Type Sets: Productive vs. Expressive

Carbon manages typography through two parallel type sets:

**Productive** — used in product interfaces where users benefit from condensed, focused content that supports task completion. Productive type styles use a fixed (non-responsive) size approach.

**Expressive** — used in editorial, marketing, and long-form reading contexts where dramatic, graphic use of type is appropriate. Expressive heading styles are responsive and change size at different breakpoints.

Within **Body** and **Utility** styles, both sets share the same styles. Productive styles carry a `-01` suffix and expressive styles use `-02`.

---

## Type Token Categories

Carbon defines type styles across six categories:

| Category | Purpose | Examples |
|---|---|---|
| **Display** | Largest display type; editorial/hero contexts | `display-01` through `display-04` |
| **Expressive Headings** | Responsive headings for editorial content | `expressive-heading-01` through `expressive-heading-06` |
| **Productive Headings** | Fixed-size headings for product UI | `productive-heading-01` through `productive-heading-07` |
| **Body** | Running text and content | `body-short-01/02`, `body-long-01/02` |
| **Label / Helper / Caption** | Supporting text, form helpers, captions | `label-01/02`, `helper-text-01/02`, `caption-01/02` |
| **Code** | Monospaced code content | `code-01`, `code-02` |

---

## Token Properties

Each type token defines the following typographic properties:
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `font-family`

These are implemented via the `@carbon/type` package and exposed as Sass mixins and JavaScript exports.

---

## Usage Context Guidelines

**Use productive styles for:**
- Navigation, labels, and UI chrome
- Data tables and dense information displays
- Form elements and controls
- Any context where compactness helps users stay focused on tasks

**Use expressive styles for:**
- Marketing pages and landing pages
- Longform editorial content
- Hero sections and feature callouts
- Any context where visual impact and readability at scale matter more than density

---

## Implementation

Type tokens are accessed from the `@carbon/type` package and re-exported from `@carbon/react`:

```scss
// Include all type styles in your stylesheet
@use '@carbon/react/scss/type';

// Use a specific type style mixin
@include type.type-style('body-long-01');
```

For full token values (font-size, weight, line-height, letter-spacing per style), see the typography asset file in this system.
