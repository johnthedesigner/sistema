---
category: principles
topic: palette-generation
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [color, palette, generation, contrast, oklch, wcag, synthesis]
sources:
  - kb/reference/foundations/color/perceptual-models
  - kb/reference/foundations/color/contrast-and-accessibility
  - kb/reference/standards/wcag/color-contrast
  - kb/principles/color/architecture
---

# Color Palette Generation — Synthesis

## How to use this document

This document specifies a complete algorithm for generating bespoke color shade palettes from one or more seed hex colors. It is intended to be machine-executable: a developer or LLM with this document and a color math library can implement the algorithm without additional research.

The output is a set of shade arrays — 19 stops per color, indexed 50–950 — where each stop has a predictable contrast ratio against white and against black. This predictability is the primary design goal: it enables cross-hue interchangeability for accessible UI. If `blue-600` meets a contrast target, then so does `green-600`, because both stops were selected by the same contrast criterion.

For how to map these generated primitives to semantic roles (primary, surface, on-surface, etc.), see `kb/principles/color/architecture`.

---

## 1 — Core insight: contrast-targeting over perceptual stepping

Most palette generation algorithms work by stepping through a perceptual color space at equal intervals and producing shades at each step. The result is a palette where adjacent shades are perceptually equidistant.

This document describes a different approach: **contrast-targeting**. Instead of stepping through color space uniformly, we define a set of target contrast ratios against white, then select from a large pool of candidate shades the one that comes closest to each target.

The difference matters for design systems:

| Approach | What it guarantees | What it does not guarantee |
|---|---|---|
| Perceptual stepping | Equal perceived distance between adjacent stops | Predictable contrast at any given stop |
| Contrast targeting | Predictable contrast at each stop; cross-hue interchangeability | Equal perceived distance between stops |

For accessible UI, contrast targeting is more useful. A designer can say "the -600 stop is always usable for interactive element backgrounds against white text" — and that will be true for every color in the palette, regardless of hue.

---

## 2 — Algorithm overview

The algorithm has five steps:

1. Convert the seed hex color to OKLCH
2. Generate a dense candidate array by sweeping the lightness axis in OKLCH while holding hue and adjusting chroma for gamut safety
3. Convert each candidate to sRGB and filter out-of-gamut values
4. Compute WCAG contrast against white for each in-gamut candidate
5. For each of 19 target contrast values, select the candidate with minimum absolute difference from the target

The output is 19 hex values per seed color, together with their contrast ratios against white and black.

---

## 3 — Color space: OKLCH

Use **OKLCH** (the cylindrical form of OKLab) for the candidate generation step.

OKLCH has three channels:
- **L** — perceptual lightness, 0 (black) to 1 (white)
- **C** — chroma (colorfulness), 0 (neutral gray) to ~0.4+ depending on hue
- **H** — hue angle in degrees, 0–360

OKLCH's L channel is perceptually calibrated: equal steps in L produce shades that look equally spaced in lightness to human observers. This is not true of HSL, where yellows at `L:50` appear far brighter than blues at `L:50`.

For the contrast-targeting algorithm, OKLCH provides a higher-quality candidate pool: because shades are evenly distributed across perceived lightness, the algorithm has good coverage at every contrast level and is less likely to find large gaps in the candidate set.

**Library options:**
- JavaScript/Node: `culori` (MIT license) — `npm install culori`
- Python: `coloraide` — provides oklch conversion and gamut mapping
- Raw math: Convert hex → linear sRGB → XYZ D65 → OKLab → OKLCH. Full formulas at `bottosson.github.io/posts/oklab/`

---

## 4 — Generating the candidate array

```
function generateCandidates(seedHex):
  seed = hexToOKLCH(seedHex)
  candidates = []

  for L in range(0.02, 0.985, step=0.001):   // ~965 candidates
    C = seed.C * chromaScale(L)
    H = seed.H
    srgb = oklchToSRGB({ L, C, H })

    if isInGamut(srgb):                        // all channels 0–1
      candidates.push({
        oklch: { L, C, H },
        hex: srgbToHex(srgb),
        L_relative: wcagRelativeLuminance(srgb)
      })

  return candidates
```

**Chroma scaling at extremes:**

A seed color with high chroma (saturated hue) will produce out-of-gamut sRGB values at very low and very high lightness levels. The standard fix is to scale chroma toward zero as lightness approaches 0 or 1:

```
function chromaScale(L):
  // Scales from 1.0 at the seed's lightness to 0 near extremes
  // sin curve: peaks at L=0.5, approaches 0 at L=0 and L=1
  return Math.sin(Math.PI * L)
```

This preserves hue throughout the palette while preventing gamut violations. At very light and very dark stops, the shade becomes nearly achromatic — which is correct behavior; near-white and near-black shades should be desaturated.

**Gamut filtering:**

After conversion to sRGB, discard any candidate where any channel (R, G, B) falls outside [0, 1] after the chroma scaling. With the sine curve applied, out-of-gamut results should be rare; filtering handles any numerical edge cases.

---

## 5 — Target contrast values

The 19 target contrast ratios for stops 50–950 use a **logarithmic distribution** from 1.01 to 19.0.

Formula: `target[i] = 1.01 × (19.0 / 1.01) ^ (i / 18)` for i = 0..18

This allocates more stops to the 1:1–7:1 range where most accessibility decisions occur (primary colors, text, interactive elements) and fewer to the very dark end (>10:1) where stops are approaching black and differentiation matters less.

| Stop | Index (i) | Target contrast (white) | Notable threshold |
|---|---|---|---|
| 50 | 0 | 1.01 | Nearly white |
| 100 | 1 | 1.19 | |
| 150 | 2 | 1.40 | |
| 200 | 3 | 1.65 | |
| 250 | 4 | 1.94 | |
| 300 | 5 | 2.28 | |
| 350 | 6 | 2.69 | |
| 400 | 7 | 3.16 | WCAG UI components (AA): 3:1 |
| 450 | 8 | 3.72 | |
| 500 | 9 | 4.38 | |
| 550 | 10 | 5.16 | WCAG normal text (AA): 4.5:1 |
| 600 | 11 | 6.07 | |
| 650 | 12 | 7.14 | WCAG normal text (AAA): 7:1 |
| 700 | 13 | 8.41 | |
| 750 | 14 | 9.90 | |
| 800 | 15 | 11.65 | |
| 850 | 16 | 13.71 | |
| 900 | 17 | 16.14 | |
| 950 | 18 | 19.00 | Nearly black |

**Why logarithmic over ease-in-out:**

A standard ease-in-out distribution over the same 1.01–19 range places the midpoint stop (stop 500) at approximately 10:1, putting roughly half the stops above the WCAG AAA threshold where the palette approaches pure black. The logarithmic distribution places stop 500 at 4.38:1 — squarely in the working range of the palette — and allocates 9 of 19 stops below 4.5:1, where design decisions about text and interactive color are most common.

**Easing approach (for compatibility):**

If generating palettes that must match an existing ease-in-out baseline, the formula is:

```
target[i] = easeInOut((i + 1) / steps) × (highContrast - lowContrast) + lowContrast
```

Where `easeInOut` is any S-curve mapping [0,1] → [0,1]. Use this only for compatibility with existing palettes. New palettes should use the logarithmic distribution.

---

## 6 — Selecting stops from candidates

For each target contrast value, find the candidate with the smallest absolute difference:

```
function selectStop(candidates, targetContrast):
  best = null
  bestDiff = Infinity

  for candidate in candidates:
    actualContrast = wcagContrast(candidate.L_relative, 1.0)  // against white
    diff = Math.abs(actualContrast - targetContrast)
    if diff < bestDiff:
      best = candidate
      bestDiff = diff

  return best
```

**WCAG contrast formula:**

```
// relativeLuminance: linearize each sRGB channel
function linearize(c):
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4

function wcagRelativeLuminance(r, g, b):   // r, g, b in [0, 1]
  R = linearize(r)
  G = linearize(g)
  B = linearize(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B

function wcagContrast(L1, L2):             // L1, L2 are relative luminances
  lighter = Math.max(L1, L2)
  darker  = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
```

Contrast against white: `wcagContrast(L_candidate, 1.0)`
Contrast against black: `wcagContrast(L_candidate, 0.0)` = `(L_candidate + 0.05) / 0.05`

---

## 7 — Dual contrast tracking

Record both white-contrast and black-contrast for every stop. This requires no additional generation work — both are computed from the same relative luminance value.

**Why both matter:**

White-contrast drives light mode palette design. Black-contrast drives dark mode palette design. With both values recorded per stop, a dark mode token system can select stops by black-contrast target using the same interchangeability guarantee — `blue-400` and `green-400` will both meet the same contrast against a dark surface, just as `blue-600` and `green-600` meet the same contrast against white.

The relationship: `contrast_white × contrast_black ≈ 21`. They are not independent — once white-contrast is fixed, black-contrast is determined. But recording both makes this explicit and eliminates the computation at consume time.

---

## 8 — Output format

```json
{
  "primary": {
    "seed": "#2563eb",
    "stops": {
      "50":  { "hex": "#f0f4ff", "contrast_white": 1.01, "contrast_black": 20.3 },
      "100": { "hex": "#dde8ff", "contrast_white": 1.19, "contrast_black": 17.2 },
      "150": { "hex": "#c4d6ff", "contrast_white": 1.40, "contrast_black": 14.6 },
      "200": { "hex": "#a9c2ff", "contrast_white": 1.65, "contrast_black": 12.4 },
      "250": { "hex": "#8caeff", "contrast_white": 1.94, "contrast_black": 10.5 },
      "300": { "hex": "#6d96ff", "contrast_white": 2.28, "contrast_black": 8.9  },
      "350": { "hex": "#5080f0", "contrast_white": 2.69, "contrast_black": 7.5  },
      "400": { "hex": "#3a6bdf", "contrast_white": 3.16, "contrast_black": 6.4  },
      "450": { "hex": "#2a5bcc", "contrast_white": 3.72, "contrast_black": 5.5  },
      "500": { "hex": "#1e4db8", "contrast_white": 4.38, "contrast_black": 4.7  },
      "550": { "hex": "#163ea1", "contrast_white": 5.16, "contrast_black": 4.0  },
      "600": { "hex": "#0f3188", "contrast_white": 6.07, "contrast_black": 3.4  },
      "650": { "hex": "#0a2571", "contrast_white": 7.14, "contrast_black": 2.9  },
      "700": { "hex": "#071c5a", "contrast_white": 8.41, "contrast_black": 2.5  },
      "750": { "hex": "#051446", "contrast_white": 9.90, "contrast_black": 2.1  },
      "800": { "hex": "#030d34", "contrast_white": 11.65, "contrast_black": 1.8 },
      "850": { "hex": "#020826", "contrast_white": 13.71, "contrast_black": 1.5 },
      "900": { "hex": "#01041a", "contrast_white": 16.14, "contrast_black": 1.3 },
      "950": { "hex": "#00020f", "contrast_white": 19.00, "contrast_black": 1.1 }
    }
  },
  "gray": {
    "seed": "#64748b",
    "stops": { ... }
  }
}
```

**Input contract:**
- `colors`: an object mapping color names to seed hex strings (e.g. `{ "primary": "#2563eb", "gray": "#64748b" }`)
- Each seed hex is a standard 6-digit sRGB hex with or without `#` prefix

**Output contract:**
- One top-level key per input color name
- Each color object contains `seed` (the original hex) and `stops` (19 entries keyed 50–950)
- Each stop contains `hex`, `contrast_white`, and `contrast_black` rounded to 2 decimal places

---

## 9 — Pre-generated palette library

A curated library of palettes can be built by running the same algorithm at build time across a predefined matrix of seed colors. This provides instant-start options for users without a specific brand color.

**Recommended matrix:**

Hues (8): red, orange, amber, green, teal, blue, violet, rose

Saturation levels (3) per hue: muted (low chroma seed), balanced (medium chroma), vivid (high chroma)

Total: 24 palettes + 2–3 neutral grays (warm, cool, pure) = 26–27 palettes, all generated by the same algorithm and sharing the same stop structure and contrast guarantees.

Store as static JSON at build time. The dynamic API endpoint and the pre-generated library should use identical code — the library is just the endpoint called with a predefined set of seeds.

---

## 10 — What this algorithm does not cover

**Semantic role mapping** — which stop becomes `--color-primary`, `--color-primary-container`, etc. — is a separate decision covered in `kb/principles/color/architecture`. This algorithm produces primitive palettes; semantic mapping is the next layer.

**Dark mode surface colors** — these require surface palettes (typically a desaturated seed or a neutral) with careful selection of the stop used for the main surface. The algorithm generates the palette; which stop to assign to `--color-surface` in dark mode is a token architecture decision.

**Perceived hue shifts** — in some hues (particularly blue-violet and yellow-green), the OKLCH hue may shift slightly at extreme lightness values even with chroma scaling. This is a property of the color gamut and human vision, not an algorithm error. Review the lightest and darkest stops visually for any unexpected hue shifts after generation.
