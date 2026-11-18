---
system: color
category: foundations
topic: contrast-and-accessibility
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://www.w3.org/TR/WCAG22/
derived_from:
  - https://www.w3.org/TR/WCAG22/
  - https://git.apcacontrast.com/documentation/APCAeasyIntro
  - https://material.io/blog/science-of-color-design
tags: [color, contrast, accessibility, wcag, apca, foundations]
---

# Contrast and Accessibility

**Sources:**
- WCAG 2.2: `www.w3.org/TR/WCAG22/` (W3C, October 2023)
- APCA Easy Intro: `git.apcacontrast.com/documentation/APCAeasyIntro` (Andrew Somers, Myndex Technologies)
- HCT / tonal palettes: `material.io/blog/science-of-color-design` (James O'Leary, Google, 2022)

---

## How contrast is measured

Visual contrast is not a simple difference between two colors. It is a perception — how the human visual system interprets the difference in lightness between a foreground and background element, modulated by the spatial characteristics of what is being read (size, weight, line thickness).

The core quantity underlying all contrast measurement is **relative luminance**: a measure of how much light a color emits relative to a white reference, accounting for the non-linear sensitivity of human vision. This is distinct from both RGB brightness and HSL lightness.

---

## WCAG 2.x contrast algorithm

WCAG 2.x defines relative luminance as:

```
L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
```

Where each channel is linearized first:

```
If C_sRGB <= 0.04045:  C_lin = C_sRGB / 12.92
Else:                   C_lin = ((C_sRGB + 0.055) / 1.055) ^ 2.4
```

The contrast ratio between foreground (Lf) and background (Lb) is:

```
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

The `+0.05` offset prevents division by zero when comparing pure black to itself, and models the ambient light reflected off a real display.

**What WCAG 2.x gets right:** The relative luminance formula is grounded in the CIE XYZ color space and approximates the Stevens Power Law for human brightness perception. The formula correctly weights green (~72%) much more heavily than blue (~7%), matching how human photoreceptors actually respond to wavelengths.

**What WCAG 2.x gets wrong:** The ratio formula is not perceptually uniform. At low luminance values (dark colors), WCAG 2.x dramatically overstates perceived contrast. A dark gray on black that passes 4.5:1 can be functionally unreadable. This deficiency makes WCAG 2.x particularly unreliable for dark mode design, where both foreground and background are near-black.

---

## WCAG 2.2 thresholds

| Criterion | Level | Ratio | Applies to |
|---|---|---|---|
| 1.4.3 | AA | 4.5:1 | Normal text (< 18pt / < 14pt bold) |
| 1.4.3 | AA | 3:1 | Large text (≥ 18pt / ≥ 14pt bold) |
| 1.4.6 | AAA | 7:1 | Normal text (enhanced) |
| 1.4.6 | AAA | 4.5:1 | Large text (enhanced) |
| 1.4.11 | AA | 3:1 | UI components and graphical objects |

See `kb/standards/wcag/color-contrast@2026-05-12.md` for exemptions, implementations, and reference hex values.

---

## The limits of WCAG 2.x contrast

WCAG 2.x uses a single ratio as a pass/fail threshold regardless of font size, weight, spatial context, or whether the interface is light or dark mode. This produces predictable failure modes:

**Dark mode**: WCAG 2.x overstates contrast for dark color pairs. A color pair with a computed ratio of 4.5:1 between two near-black values may be visually unreadable — the formula treats all regions of the luminance scale as equivalent, but human perception does not.

**Large text threshold**: The 3:1 cutoff for "large text" uses a fixed pt size threshold (18pt or 14pt bold). This does not account for font weight, aspect ratio, or x-height — all of which affect the spatial frequency that drives contrast sensitivity.

**Body text vs. non-text**: A single ratio applies to both flowing paragraph text (high contrast need — read over sustained periods) and a decorative label (low contrast need). WCAG 2.x cannot distinguish these cases.

**86% failure rate**: Approximately 86% of websites fail WCAG 2 contrast checks. Research has shown that some of these failures are not cases of poor accessibility — they are artifacts of incorrect math flagging readable combinations. Conversely, some WCAG-passing combinations are genuinely unreadable.

---

## APCA — the perceptually uniform alternative

**APCA (Accessible Perceptual Contrast Algorithm)** is a new contrast model developed by Andrew Somers (Myndex Technologies, W3C Invited Expert) that addresses the non-uniformity in WCAG 2.x. It is the leading candidate for WCAG 3.0.

### Lightness contrast (Lc)

APCA outputs a value called **Lc (lightness contrast)**, ranging from 0 to ±106. Lc is perceptually uniform: a given Lc value represents the same perceived contrast regardless of whether the colors are light or dark. Lc 60 is visually consistent across the full luminance range — WCAG 2.x's 4.5:1 is not.

Sign indicates polarity: positive Lc means text is darker than background (light mode); negative Lc means text is lighter than background (dark mode). A dark mode target of Lc -90 is equivalent to a light mode target of Lc 90.

### Spatial sensitivity

APCA accounts for the spatial characteristics of what is being displayed. Smaller, thinner fonts have higher spatial frequency, which reduces perceived contrast sensitivity. Larger, heavier fonts require less Lc to appear equally readable. This means:
- A 12px/400-weight body text block requires more Lc than a 36px/700 headline
- The 3:1 / 4.5:1 WCAG threshold is not a meaningful single number — the actual requirement depends on font size and weight

### Polarity sensitivity

Dark-on-light (positive polarity) and light-on-dark (negative polarity) do not produce identical perception even at the same absolute Lc value. APCA applies a mild contrast boost for very dark colors to offset typical ambient lighting effects on self-illuminated displays.

---

## APCA Lc use-case ranges

These levels apply to the reference font (Helvetica/Arial). For AAA conformance, increase each value by Lc 15.

| Lc value | Use case | Minimum font |
|---|---|---|
| **Lc 90** | Preferred for body text, columns, flowing text | 14px/400 |
| **Lc 75** | Minimum for body text where readability is important | 18px/400 |
| **Lc 60** | Content text (not body columns) — informational text you want people to read | 24px/400 or 16px/700 |
| **Lc 45** | Large headings, pictograms with fine details | 36px/400 or 24px/700 |
| **Lc 30** | Placeholder text, disabled element text; large/solid semantic non-text elements | — |
| **Lc 15** | Non-text that must be discernible; minimum for thin lines and borders (≥ 5px dimension) | — |

Below Lc 15 is effectively invisible for many users. Avoid below Lc 30 for anything relevant to understanding or interacting with the page.

### APCA vs. WCAG 2.x: the dark mode problem

WCAG 2.x overstates contrast for near-black color pairs. A foreground/background pair near the bottom of the luminance scale can pass WCAG 4.5:1 while being functionally unreadable. APCA's perceptual uniformity corrects this — Lc 75 for dark text on a dark background is just as visible as Lc 75 for dark text on a white background.

---

## Tonal palette design for accessibility

Perceptual color models make it possible to build palettes where contrast is predictable from the tone value, without measuring each pair individually.

### HCT tone and WCAG contrast

In Material Design 3's HCT color space, **Tone** (T) equals L\* from CIELAB — the same lightness measure that underlies the WCAG relative luminance formula. This creates a direct mapping between HCT tone differences and WCAG contrast compliance:

| Tone difference | WCAG outcome |
|---|---|
| ≥ 50 | Passes AA for small text (4.5:1 equivalent) |
| ≥ 40 | Passes AA for large text and UI components (3:1 equivalent) |

From the Material HCT article: *"To meet WCAG contrast requirements, smaller elements require a tone difference of 50 with their background, larger elements require a tone difference of 40."* This principle holds for any hue pair within the HCT model.

**Practical application:** If a design token assigns `primary` = Tone 40 (in light mode, on a white surface at Tone 100), the tone difference is 60 — guaranteed AA for small text. In dark mode, `primary` = Tone 80 on a near-black surface at Tone 10 gives a tone difference of 70 — also AA-compliant. This is how Material Design's dark theme achieves accessibility automatically from palette structure rather than per-pair checking.

### OKLab and contrast prediction

OKLab does not have the same direct WCAG mapping as HCT, because OKLab's L (lightness) is not numerically identical to CIELAB L\*. However, OKLab lightness differences are more perceptually uniform than CIELAB, making visual inspection of palette steps more reliable. For OKLab-based palettes, contrast against a target background must still be verified using the WCAG relative luminance formula — but the palette steps themselves will be perceptually even, so failures are predictable and localized rather than scattered.

---

## Practical guidance for token architecture

**For systematic palette generation:**
- Use HCT if you want tone differences to directly predict WCAG compliance (Material-compatible systems)
- Use OKLab/OKLCh if you want perceptually even palette steps in a CSS-native workflow
- Never use HSL — its lightness is not perceptual, so contrast compliance is unpredictable across the scale

**For dark mode:**
- Mirror tone values, do not invert. A Tone 40 token in light mode becomes Tone 80 in dark mode (not 60). Both are equidistant from the lightness midpoint, maintaining equivalent contrast against their respective backgrounds.
- WCAG 2.x contrast ratios should be verified in dark mode separately — the ratio formula does not automatically transfer

**For contrast verification during implementation:**
- WCAG AA: check computed contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text/UI
- APCA (where adopting): target Lc ≥ 75 for body text, Lc ≥ 60 for informational text, Lc ≥ 45 for headings
- HCT-based palettes: verify tone difference ≥ 50 for small text, ≥ 40 for large text

**WCAG 3.0 and APCA:** APCA is under active standardization. It is not yet normative — WCAG 2.2 remains the legally enforceable standard. Use APCA to inform design decisions and catch WCAG 2.x false negatives (dark mode especially), but verify WCAG 2.2 compliance for any regulated product.

**See also:** `kb/standards/wcag/color-contrast@2026-05-12.md` for the normative WCAG criterion text and exemptions.
