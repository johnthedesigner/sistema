---
title: "Palette generation"
description: "How Sistema's palette tool builds OKLCH ramps: stops on an eased contrast curve, the same colorfulness by lightness for every hue, yellows that warm as they darken, and the output format."
topic: color
sources:
  - { source: oklab, url: "https://bottosson.github.io/posts/oklab/" }
  - { source: material-color-science, url: "https://material.io/blog/science-of-color-design" }
  - { source: wcag, url: "https://www.w3.org/TR/WCAG22/" }
  - { source: apca, url: "https://git.apcacontrast.com/documentation/APCAeasyIntro" }
  - { source: stripe-color, url: "https://stripe.com/blog/accessible-color-systems" }
related:
  - guide.color.architecture
last_reviewed: 2026-11-20
---

# Palette generation

## Where Sistema stands

Every color in a Sistema project comes from a ramp the palette tool generates, and the tool follows three fixed rules, each set by one named constant:

1. **Stops are placed by contrast against white,** on an eased curve: finer steps near white and near black, where surfaces and borders live, and stop 500 in the middle of the working range.
2. **Every hue gets the same colorfulness at the same lightness,** scaled by how colorful the seed is, and kept under what a screen can show.
3. **Yellows turn toward orange as they darken,** because a dark yellow at a fixed hue reads as olive.

No stop is ever adjusted by hand. If a ramp looks wrong, the rule changes, and every ramp changes with it. This page is the specification the tool implements: a reference for checking the algorithm, not a procedure. The color guide covers how ramps become roles.

```specimen
ramp #2563eb #16a34a #FFCC33
Blue, green, and yellow from the palette library. Stops with the same number have nearly the same contrast in every hue, and the yellow ramp warms toward ochre in its dark stops.
```

## How to use this document

This is a full specification: with it and a color library, a developer can reimplement the tool. For how stops become roles, see the color guide.

---

## 1 — Core insight: contrast-targeting over perceptual stepping

Most palette generation algorithms work by stepping through a perceptual color space at equal intervals and producing shades at each step. The result is a palette where adjacent shades are perceptually equidistant.

This document follows the approach Stripe described for its accessible color system ([Stripe](https://stripe.com/blog/accessible-color-systems)): **contrast-targeting**. Instead of stepping through color space uniformly, we define a set of target contrast ratios against white, then select from a large pool of candidate shades the one that comes closest to each target.

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
2. Generate a dense candidate array by sweeping the lightness axis in OKLCH. At each lightness, chroma comes from one shared curve and the hue turns warm if the seed is a yellow (section 4)
3. Convert each candidate to sRGB, keeping it in gamut
4. Compute WCAG contrast against white for each candidate
5. For each of 19 target contrast values on an eased curve (section 5), select the candidate with minimum absolute difference from the target

The output is 19 hex values per seed color, together with their contrast ratios against white and black.

Three fixed rules shape the result, each set by one named constant in the code (`src/lib/palette.ts`). No stop is ever adjusted on its own: every stop comes from the same curves.

| Rule | Constant | What it fixes |
|---|---|---|
| Eased contrast curve | `EASE` = 0.45 | Even steps left the lightest and darkest stops too far apart for surfaces, borders and hover states |
| Colorfulness by lightness, the same for every hue | `CHROMA_PLATEAU`, `SOFT_LIMIT` | Chroma relative to each hue's own maximum made green and yellow tints several times more colorful than blue ones |
| Yellows lean warm as they darken | `YELLOW` | Dark yellow doesn't exist on screens, so a yellow held at one hue turns olive and muddy |

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
  amplitude = seed.C / max(0.25, chromaShape(seed.L, seed.L))
  candidates = []

  for L in range(0.02, 0.99, step=0.001):      // ~970 candidates
    H = seed.H - yellowTurn(seed.H, L)
    limit = maxInGamutChroma(L, H) * 0.98
    C = softLimit(amplitude * chromaShape(L, seed.L), limit)
    srgb = gamutMap(oklchToSRGB({ L, C, H }))
    candidates.push({ hex: srgbToHex(srgb), contrastWhite: wcagContrast(srgb, white) })

  return candidates
```

### Colorfulness by lightness

The seed sets how colorful the ramp is (`amplitude`). One shared curve over lightness sets how that colorfulness is spread, and it is the same for every hue, so a blue ramp and a green ramp from equally colorful seeds have the same chroma at the same lightness:

```
function chromaShape(L, seedL):
  edge = max(0.8, min(0.92, seedL + 0.02))       // CHROMA_PLATEAU.light, raised for bright seeds
  fromWhite = clamp((0.995 - L) / (0.995 - edge), 0, 1)
  fromBlack = 0.35 + 0.65 * smoothstep(0.05, 0.32, L)   // CHROMA_PLATEAU.dark
  return min(fromWhite, fromBlack)
```

- **From white,** chroma rises in proportion to distance from white, so tints step evenly into color.
- **Through the mid-tones,** it holds at the seed's strength. For a seed lighter than usual (a bright yellow), the plateau reaches up to the seed's own lightness, so the seed's brightness survives in its ramp.
- **Toward black,** it eases down but keeps about a third, so dark stops still read as the hue rather than as gray.

Where a hue can't reach the target chroma on screen, chroma approaches that hue's limit smoothly instead of being clipped at it:

```
function softLimit(target, limit):              // SOFT_LIMIT = 6
  return target * limit / (target^6 + limit^6)^(1/6)
```

Clipping would put a kink in the ramp wherever the limit starts to bind. The soft limit keeps chroma a smooth curve from end to end.

The usual alternative, used by Sistema's earlier palette tool and by many generators, scales chroma as a share of each hue's own maximum at each lightness. That keeps every hue "equally saturated" relative to its gamut, but because yellows and greens can reach far higher chroma at high lightness, their tints come out much more colorful than blue or violet tints. Material's tonal palettes take the approach used here: chroma is held as an absolute value and reduced only where the gamut requires it ([Material color science](https://material.io/blog/science-of-color-design)). Stripe set the same goal when it rebuilt its palette: consistent visual weight, so no hue looks more important than another at the same level ([Stripe](https://stripe.com/blog/accessible-color-systems)).

### Yellows lean warm as they darken

Screens can't show a dark yellow ("really dark yellow isn't a thing", as Stripe's palette work put it): as yellow loses lightness at a fixed hue it becomes olive. Hues within 38° of 92° (yellows, ambers, limes) turn toward orange in proportion to how dark the stop is, up to 34° at black:

```
function yellowTurn(H, L):                      // YELLOW = { center: 92, halfWidth: 38, maxTurn: 34 }
  d = angularDistance(H, 92)
  if d >= 38: return 0
  inBand = cos(π/2 * d/38)^2                     // full turn at the center, none at the edge
  darkness = smoothstep(0.78, 0.22, L)           // none in the light stops, full in the darkest
  return 34 * inBand * darkness
```

Dark yellow ramps become ochre and brown instead of olive, which is how painters and most hand-tuned palettes treat them. Light yellow stops keep the seed's hue.

---

## 5 — Target contrast values

The 19 target contrast ratios for stops 50–950 run from 1.01 to 19.0 on a logarithmic curve that eases in and out:

```
eased(t) = t - EASE * sin(2πt) / (2π)            // EASE = 0.45
target[i] = 1.01 × (19.0 / 1.01) ^ eased(i / 18)    for i = 0..18
```

With `EASE` = 0 this is an even logarithmic curve. The easing makes the steps finer near white and near black, where surfaces, borders and hover states live and small differences matter, and wider through the mid-tones. Stop 500 stays at the midpoint.

| Stop | Index (i) | Target contrast (white) | Notable threshold |
|---|---|---|---|
| 50 | 0 | 1.01 | Nearly white |
| 100 | 1 | 1.11 | |
| 150 | 2 | 1.22 | |
| 200 | 3 | 1.37 | |
| 250 | 4 | 1.58 | |
| 300 | 5 | 1.86 | |
| 350 | 6 | 2.24 | |
| 400 | 7 | 2.76 | |
| 450 | 8 | 3.46 | WCAG UI components (AA): 3:1 |
| 500 | 9 | 4.38 | |
| 550 | 10 | 5.54 | WCAG normal text (AA): 4.5:1 |
| 600 | 11 | 6.95 | |
| 650 | 12 | 8.57 | WCAG normal text (AAA): 7:1 |
| 700 | 13 | 10.34 | |
| 750 | 14 | 12.17 | |
| 800 | 15 | 13.98 | |
| 850 | 16 | 15.70 | |
| 900 | 17 | 17.34 | |
| 950 | 18 | 19.00 | Nearly black |

**Why a logarithmic base:** a linear or plain ease-in-out distribution over the same 1.01–19 range places stop 500 at about 10:1, putting roughly half the stops near black. The logarithmic base keeps stop 500 at 4.38:1, in the working range of the palette. The easing is applied on top of it, so the midpoint doesn't move.

**Reading the extremes:** stops 50 to 200 are surface and tint steps (canvas, hover, selected, container); stops 800 to 950 are the dark-theme equivalents. Use neighboring stops for neighboring surfaces: the steps there are deliberately small. Even so, one dark stop is a bigger step than the light theme's page-to-white step, so dark surfaces step one stop at a time (the color guide's "Stops in a dark theme").

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
      "50":  { "hex": "#f9fbff", "contrast_white": 1.04, "contrast_black": 20.27 },
      "100": { "hex": "#edf4ff", "contrast_white": 1.11, "contrast_black": 18.99 },
      "150": { "hex": "#dde9ff", "contrast_white": 1.22, "contrast_black": 17.17 },
      "200": { "hex": "#caddff", "contrast_white": 1.37, "contrast_black": 15.3 },
      "250": { "hex": "#b5cfff", "contrast_white": 1.57, "contrast_black": 13.33 },
      "300": { "hex": "#9dbffe", "contrast_white": 1.86, "contrast_black": 11.32 },
      "350": { "hex": "#83adfe", "contrast_white": 2.24, "contrast_black": 9.37 },
      "400": { "hex": "#699afc", "contrast_white": 2.75, "contrast_black": 7.63 },
      "450": { "hex": "#4f86f7", "contrast_white": 3.45, "contrast_black": 6.09 },
      "500": { "hex": "#3872ed", "contrast_white": 4.38, "contrast_black": 4.8 },
      "550": { "hex": "#255fe0", "contrast_white": 5.54, "contrast_black": 3.79 },
      "600": { "hex": "#164fcd", "contrast_white": 6.92, "contrast_black": 3.03 },
      "650": { "hex": "#0a40b9", "contrast_white": 8.58, "contrast_black": 2.45 },
      "700": { "hex": "#0234a5", "contrast_white": 10.31, "contrast_black": 2.04 },
      "750": { "hex": "#002991", "contrast_white": 12.17, "contrast_black": 1.73 },
      "800": { "hex": "#001f7e", "contrast_white": 14.03, "contrast_black": 1.5 },
      "850": { "hex": "#00176b", "contrast_white": 15.73, "contrast_black": 1.33 },
      "900": { "hex": "#000f58", "contrast_white": 17.37, "contrast_black": 1.21 },
      "950": { "hex": "#000446", "contrast_white": 18.99, "contrast_black": 1.11 }
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

Sistema publishes 22 ramps generated by the same code as the tool, at `{{sistema_url}}/palettes/library.json`: five grays (slate, gray, zinc, neutral, stone) and seventeen hues (red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose). The seeds are familiar mid-tone colors, so each name means what a designer expects.

The library has two jobs:

- **Feedback ramps.** Red, amber, green, and blue are the default error, warning, success, and info ramps, unless DESIGN.md names others.
- **Accent seeds.** When a project has no brand color, the direction proposes its accent from a colorful library palette, at one of its bright middle stops (400 to 600).

The library is regenerated with `npm run palettes` whenever the algorithm changes, and a test fails if the committed file and the algorithm disagree.

---

## 10 — What this algorithm does not cover

**Semantic role mapping** — which stop becomes `--color-primary`, `--color-primary-container`, etc. — is a separate decision covered in the Color architecture guide. This algorithm produces primitive palettes; semantic mapping is the next layer.

**Dark mode surface colors** — which stops become the page, panels, and floating layers in a dark theme is a role decision, covered in the color guide's "Stops in a dark theme". In short: text and fills mirror (stop 1000 − *n*), and surfaces step one stop at a time from 950.

**Perceived hue shifts** — in some hues (particularly blue-violet), the OKLCH hue may shift slightly at extreme lightness values even with chroma scaling. This is a property of the color gamut and human vision, not an algorithm error. Review the lightest and darkest stops visually for any unexpected hue shifts after generation.

---

## 11 — Checking the work

- **The snapshot test** in the tool's test suite fixes the output for a set of seeds. A change to the algorithm that moves any stop fails it, and the snapshot is updated only when the change is intended.
- **The library test** fails if `library.json` and the algorithm disagree.
- **The consistency test** checks the tool's output against WCAG and the rules registry, so the contrast recorded for each stop is the contrast a checker would measure.
- **Look at greens and yellows first** after any change. They sit closest to the screen's limits and show problems before other hues do.

