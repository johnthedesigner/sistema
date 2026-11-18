---
system: color
category: foundations
topic: perceptual-models
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://bottosson.github.io/posts/oklab/
derived_from:
  - https://material.io/blog/science-of-color-design
tags: [color, perceptual-models, oklab, hct, hsl, foundations]
---

# Perceptual Color Models

**Sources:**
- OKLab: `bottosson.github.io/posts/oklab/` (Björn Ottosson, 2020/2025)
- HCT: `material.io/blog/science-of-color-design` (James O'Leary, Google, 2022)

---

## Why perceptual models exist

The colors a design system specifies (hex values, RGB, HSL) are instructions to hardware. They describe what light to emit. They say nothing about what a human will *perceive*.

The gap between emitted light and perceived color is the entire problem perceptual color models solve. A color space is **perceptually uniform** if equal distances in the space correspond to equal perceived differences by humans. Most spaces used in everyday design — hex, RGB, HSL — are not perceptually uniform at all. They were designed for hardware efficiency, not human vision.

**Why this matters for design systems:**
- Generating a tonal palette (10 shades of one hue) requires consistent perceived lightness across shades. HSL fails at this — yellow at HSL lightness 50 appears much brighter than blue at the same value.
- Ensuring contrast between text and background requires accurate lightness measurement. A ratio derived from non-perceptual space will under- or over-estimate legibility.
- Interpolating between colors (for gradients, transitions, theme generation) produces unexpected hue shifts in non-perceptual spaces.

---

## Model comparison

| Model | Year | Lightness | Hue accuracy | Blending | Used by |
|---|---|---|---|---|---|
| HSL/HSV | 1978 | Non-perceptual | Poor | Hue shifts | CSS, most design tools (legacy) |
| CIELAB (L\*a\*b\*) | 1976 | Perceptual (L\*) | Moderate | Decent | Photoshop, print |
| CAM16-UCS | 2016 | Good | Good | Poor blending | Research baseline |
| HCT | 2022 | L\* (perceptual) | CAM16 (excellent) | Good | Material Design 3 |
| OKLab | 2020 | Good | Excellent | Excellent | CSS Color 4/5, Photoshop gradients |

---

## HSL — The legacy model

**HSL (Hue, Saturation, Lightness)** was designed in 1978 to make color computationally fast on limited hardware. Its "lightness" is a simple average of the RGB max and min channel values — not a perceptual measurement.

**The core problem:** At HSL lightness = 50, the actual perceived lightness ranges from ~33 (blue) to ~96 (yellow). Colors that look visually identical in HSL "value" can appear drastically different in brightness.

From the Material HCT article: *"At HSL 'lightness' 50, accurately measured lightness ranges from 33 to 96."*

**Consequence for design systems:** Any palette built by stepping HSL lightness (e.g. 10, 20, 30... 90) will produce visually uneven steps. Users often compensate by eye, but the resulting palettes fail automated accessibility checks inconsistently — some shades pass, others fail — because the real lightness is unpredictable.

HSL is still widely used because it is what CSS natively supports and what most design tools expose as the primary interface. It is not suitable for generating systematic palettes or ensuring consistent contrast.

---

## CIELAB — The first perceptual standard

**CIELAB (L\*a\*b\*)** was standardized by the CIE in 1976. It defines three coordinates:
- **L\*** — perceived lightness (0 = black, 100 = white reference white)
- **a\*** — green-red axis
- **b\*** — blue-yellow axis

L\* is derived from the CIE XYZ color space using a cube-root non-linearity that approximates the Stevens Power Law of human brightness perception. Equal L\* differences correspond to approximately equal perceived lightness differences.

**What it gets right:** Lightness. Two colors with the same L\* value genuinely appear similarly bright.

**What it gets wrong:** Hue and chroma predictions are inconsistent, particularly for blues. Colors with the same CIELAB chroma value do not appear equally colorful across hues. Blending two CIELAB colors can produce unexpected hue shifts.

**CIELAB in design systems:** WCAG's contrast algorithm uses relative luminance (derived from XYZ, which L\* is based on). The 4.5:1 ratio threshold was calibrated against L\*-based measurements. L\* is also the "tone" value used in Material Design 3's tonal palettes.

---

## CAM16-UCS — The research benchmark

**CAM16-UCS** (2016) is a Color Appearance Model — it accounts for viewing conditions, chromatic adaptation, and the full complexity of how the human visual system responds to color. It produces the most perceptually accurate lightness, chroma, and hue predictions of any widely validated model.

**Why it's not used directly in production:**
- Numerical instability: certain inputs produce undefined or negative values
- Not scale-invariant: results depend on knowing the absolute luminance of the display and the viewing environment
- Chroma compression: it compresses high-chroma colors, which improves some metrics but makes color blending non-intuitive (two vibrant colors blended produce a less-vibrant intermediate)

From the OKLab derivation: *"CAM16-UCS does a good job at being perceptually uniform overall, but doesn't meet other requirements: Bad numerical behavior, it is not scale invariant and blending does not behave well because of its compression of chroma."*

CAM16 is used as the **ground truth** for evaluating other models. Material Design 3 uses CAM16's hue and chroma measures, combined with CIELAB's lightness, to create HCT.

---

## HCT — Material Design 3's model

**HCT (Hue, Chroma, Tone)** was developed by James O'Leary at Google and introduced in 2022 for Material Design 3. It is a hybrid:

- **Tone** = L\* from CIELAB — perceptually accurate lightness; directly maps to WCAG contrast ratios
- **Hue and Chroma** = from CAM16 — more consistent hue perception than CIELAB, especially for blues and purples

**Why the hybrid:** Using L\* for tone means HCT tone differences directly predict WCAG contrast compliance without additional conversion. From the Material article: *"To meet WCAG contrast requirements, smaller elements require a tone difference of 50 with their background, larger elements require a tone difference of 40."* This principle works for any hue pair.

**How tonal palettes work in HCT:** A tonal palette is defined by a single hue and chroma. The 13 shades in a Material palette are generated by varying the tone from 0 to 100 while holding hue and chroma fixed. Because tone = L\*, every shade at the same tone value has the same perceived lightness regardless of hue — something HSL cannot achieve.

**Dynamic Color:** HCT enables Material You's dynamic color system. A source color (extracted from a wallpaper) provides the hue and chroma; the design system generates five tonal palettes (primary, secondary, tertiary, neutral, neutral-variant) by varying tone. Color role assignments (e.g. `primary` = tone 40 in light mode, tone 80 in dark mode) guarantee contrast while allowing unlimited color variety.

**Used by:** Material Design 3, Android 12+, Google products. The open-source `material-color-utilities` library (Dart, Java, TypeScript) implements HCT.

---

## OKLab — The CSS and image processing standard

**OKLab** was developed by Björn Ottosson and published in December 2020. It has the same three-coordinate Lab structure as CIELAB but was derived using a data-driven optimization process to produce better perceptual uniformity.

From Ottosson: *"I have designed a new perceptual color space, designed to be simple to use, while doing a good job at predicting perceived lightness, chroma and hue. It is called the Oklab color space, because it is an OK Lab color space."*

**How it was derived:** Oklab was built on the IPT color space structure (which has good hue uniformity) and optimized using three datasets: color pairs matched for equal lightness, equal chroma, and equal hue — with CAM16 as the ground truth. The matrix coefficients were found by minimizing perceptual error across all three datasets simultaneously.

**What it gets right that CIELAB misses:**
- Hue uniformity: blues stay blue during lightness/chroma adjustments; CIELAB shifts toward purple
- Smooth blending: interpolating between two OKLab colors produces visually even transitions without hue drift
- Numerical stability: simple matrix operations with cube-root non-linearity; no viewing-condition dependencies

**Performance vs other models (RMS error on perceptual uniformity datasets):**

| | OKLab | CIELAB | HSV | CAM16 |
|---|---|---|---|---|
| Lightness error | **0.20** | 1.70 | 11.59 | 0.00 |
| Chroma error | **0.81** | 1.84 | 3.38 | 0.00 |
| Hue error | 0.49 | 0.69 | 1.10 | 0.59 |

*(CAM16 = 0.00 because it was used to generate the test data. OKLab outperforms CIELAB on lightness and chroma by 8× and 2× respectively.)*

**Industry adoption (as of 2025):**
- CSS Color Level 4 and 5 — `oklab()` and `oklch()` natively supported in all major browsers
- Photoshop — default interpolation method for gradients
- Unity — gradients; Godot — color picker
- Design tool integrations via CSS support

**OKLCh:** The polar form of OKLab, using Lightness, Chroma, and Hue. Directly usable in CSS: `oklch(0.7 0.15 220)`. Preferred for design token work because hue is intuitive (0–360°) while maintaining perceptual uniformity.

---

## Practical implications for token architecture

**For tonal palette generation:**
- Use HCT (via material-color-utilities) if building a Material-compatible system or targeting Android/Flutter
- Use OKLab/OKLCh if working in CSS natively or building a web-first tool
- Do not use HSL for generating systematic palettes — the perceptual unevenness will cause accessibility failures at unpredictable points in the scale

**For color interpolation (gradients, transitions):**
- OKLab produces the most visually even results with least hue drift
- CSS `color-mix(in oklch, ...)` or gradient `in oklch` is the modern standard

**For dark mode token design:**
- Lightness (tone in HCT, L in OKLab) should be mirrored, not inverted. A color at tone 40 in light mode becomes tone 80 in dark mode — not tone 60 (100 - 40). Mirroring maintains the same perceived lightness contrast against the background.
- This is why Material Design's dark theme uses `primary-80` where light theme uses `primary-40`.

**For contrast verification:**
- WCAG contrast is computed from relative luminance (XYZ/CIELAB-derived), not HSL
- HCT tone differences are the most designer-friendly proxy for WCAG AA compliance
- See `contrast-and-accessibility@2026-05-12.md` for the contrast algorithm details
