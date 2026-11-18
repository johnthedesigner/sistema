---
system: wcag
category: color
topic: color-contrast
content_type: guidance
status: latest
version_label: "WCAG 2.2 (October 2023)"
retrieved: 2026-05-12
source_url: https://www.w3.org/TR/WCAG22/
tags: [wcag, accessibility, color, contrast, standards]
---

# Color Contrast — WCAG 2.2

**Source:** `www.w3.org/TR/WCAG22/` §1.4.3, §1.4.6, §1.4.11

---

## Quick reference

| Criterion | What it covers | Minimum ratio | Level |
|---|---|---|---|
| 1.4.3 | Normal text (< 18pt / < 14pt bold) | **4.5:1** | AA |
| 1.4.3 | Large text (≥ 18pt or ≥ 14pt bold) | **3:1** | AA |
| 1.4.6 | Normal text (enhanced) | **7:1** | AAA |
| 1.4.6 | Large text (enhanced) | **4.5:1** | AAA |
| 1.4.11 | UI component borders and visual states | **3:1** | AA |
| 1.4.11 | Graphical objects required for understanding | **3:1** | AA |

---

## 1.4.3 Contrast (Minimum) — Level AA

The visual presentation of text and images of text has a contrast ratio of at least **4.5:1**, except:

- **Large text** — at least **3:1**. Large = 18pt (24px) regular or 14pt bold (~18.67px bold)
- **Incidental** — inactive UI components, pure decoration, not visible, or part of a complex image: no requirement
- **Logotypes** — text in a logo or brand name: no requirement

**Contrast ratio formula:** `(L1 + 0.05) / (L2 + 0.05)` where L1 is the lighter relative luminance and L2 is the darker. Relative luminance is computed from sRGB values per the WCAG algorithm.

**Implementation notes:**
- Body text at 16px is normal text — needs 4.5:1
- H1 at 24px+ (18pt+) qualifies as large text — 3:1 suffices
- Placeholder text in inputs is text — must meet contrast
- Disabled state text is exempt (inactive component)
- Use a checker: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

---

## 1.4.6 Contrast (Enhanced) — Level AAA

The visual presentation of text and images of text has a contrast ratio of at least **7:1** (normal text) or **4.5:1** (large text). Same exceptions as 1.4.3.

**Practical guidance:** AAA is aspirational for most products — it is not required for AA conformance. Target it for body copy on products where reading accessibility is critical (healthcare, legal, government). The most common AA-passing but AAA-failing pair is medium gray text on white (e.g. `#767676` on white = 4.54:1 — passes AA, fails AAA).

---

## 1.4.11 Non-text Contrast — Level AA

Visual information required to identify UI components and their states must have a contrast ratio of at least **3:1** against adjacent colors.

**Covers:**
- Input field borders (the line that defines where to click)
- Checkbox and radio button outlines
- Toggle/switch track and thumb indicators
- Focus ring outlines (when author-provided)
- Button outlines (for outlined/ghost button variants)
- Chart lines, data point markers, graph bars when required for understanding

**Exempts:**
- Inactive/disabled components — no contrast requirement
- Components whose appearance is entirely determined by the user agent and not modified by the author (e.g. unrestyled native checkboxes)

**Implementation notes:**
- The contrast is measured against the *adjacent* color — for an input on a white background, the border must be 3:1 against white
- A `#767676` border on white = 4.54:1 — passes. A `#ccc` border on white = 1.6:1 — fails.
- Filled button with sufficient background color: check text (1.4.3) AND button background against page background (1.4.11 only if the button outline is the identifier — filled buttons with distinct background typically satisfy this through the background color itself)
- Focus rings: a 3px solid focus ring at `#005fcc` on white = ~5.9:1 — passes both 1.4.11 and common focus ring guidance

---

## Contrast computation reference

The WCAG relative luminance formula:
```
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
```
where R, G, B are linearized sRGB channel values:
```
if channel <= 0.04045: channel / 12.92
else: ((channel + 0.055) / 1.055) ^ 2.4
```

**Common reference values:**
| Color | Hex | Luminance | Ratio vs white | Ratio vs black |
|---|---|---|---|---|
| White | #ffffff | 1.0 | 1:1 | 21:1 |
| Black | #000000 | 0.0 | 21:1 | 1:1 |
| Pure gray midpoint | #777777 | 0.216 | ~4.5:1 | ~4.7:1 |
| AA body text min (on white) | #767676 | ~0.215 | 4.54:1 | — |
| AA large text min (on white) | #949494 | ~0.330 | 3.0:1 | — |
