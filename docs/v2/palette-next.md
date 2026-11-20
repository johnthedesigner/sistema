# Palette algorithm: proposed changes

**Task:** V3.4. **Date:** 2026-11-20. **Status:** proposal, for owner review. Comparison page: `docs/v2/comparisons/palette-next.html` (regenerate with `npx tsx compare-palettes.ts` from `tools/`). Prototype: `src/lib/palette-next.ts` (not used by the app).

## The problems

1. **No quiet tones at the ends.** Stops are spaced evenly on a log scale of contrast, so stop 100 is already 1.19:1 against white (Tailwind's gray-100 is 1.10, Radix's gray-3 is 1.14), and the darkest stops step about twice as far apart as Radix's. Page, panel, and hover tones can't be subtle.
2. **Unequal tints.** Each hue's chroma is a share of that hue's own on-screen maximum. Green and yellow can be far more colorful than red or blue at high lightness, so green's stop 100 is about four times as colorful as red's or blue's.
3. **Muddy dark yellows.** A hue keeps its angle from white to black. Dark yellow can't be shown on screens, so yellow, ochre, and lime ramps turn olive in their dark half (yellow keeps hue 86° to stop 950; Tailwind's turns from 92° to 58°).

## Three fixed rules

Each is set by one named constant, and none adjusts a single stop: every stop comes from the same smooth functions of lightness, so neighboring stops stay in step.

| Rule | What it says | Constant |
|---|---|---|
| 1. Eased contrast curve | Stops are still placed by contrast against white, from 1.01 to 19, and stop 500 is unchanged (4.38:1). The curve eases in and out: fine steps near white and black, wider through the mid-tones. | `EASE = 0.45` (0 is today's curve) |
| 2. Colorfulness by lightness, the same for every hue | The seed sets how colorful a ramp is. One shared curve sets colorfulness by lightness: it rises in proportion to distance from white, holds through the mid-tones (and up to the seed's own lightness for bright seeds such as yellow), and eases toward black, where darks keep some color. Where a hue can't reach the target on screen, chroma approaches the limit smoothly instead of stopping at it. | `CHROMA_PLATEAU`, `SOFT_LIMIT` |
| 3. Yellows lean warm as they darken | Hues within 38° of 92° turn toward orange in proportion to how dark the stop is, up to 34° at black, the way ochres and browns behave. Other hues don't turn. | `YELLOW` |

"Visual weight", in the owner's phrase, is rule 2: the target is the same chroma at the same lightness for every hue, with the seed setting the amplitude, rather than the same share of each hue's maximum.

## What changes if adopted

- `src/lib/palette.ts` takes the new rules; `public/palettes/library.json` is regenerated; the palette snapshot test is updated on purpose. The API's response shape doesn't change.
- **Stop names shift slightly in meaning.** With the eased curve, 100 is lighter (1.08:1) and 150 sits where 100 did. Guidance and plays that name stops for roles (container tints at 100, page at 50, hover at 100) need checking: tints move to 150, hover to 100 or 150. The specimen tool's role mapping changes the same way.
- Relay's approved colors were picked from the current ramps. Relay re-runs from Direction in V3.4 anyway, so it picks from the new ones.

## Open points

- The strength of the easing (0.45) and the plateau edges are tuned by eye on the comparison page. The owner's Paletteer plugin may use a different easing; matching it is a one-constant change.
- Yellow tints still look a little more saturated than other hues at the same chroma, a known perceptual effect (light, saturated yellows read brighter). If it bothers, rule 2 can scale down slightly in the yellow band, as a fourth constant.
