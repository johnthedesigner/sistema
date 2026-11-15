---
id: visual-language.direction
title: Set the visual direction
description: Turn the project's positioning into a specific visual direction and a style preview page that a person approves before any token values are generated.
topic: visual-language
kind: create
milestone: direction
entry: false
requires: ["project:a11y-standard", "project:theme", "project:density"]
produces: ["design-md#overview", style-preview.html]
tools: [contrast]
knowledge:
  - guide.visual-language.overview#3-translating-positioning-to-visual-direction
  - guide.visual-language.overview#4-the-visual-direction-brief
  - guide.visual-language.overview#5-common-translation-errors
  - guide.visual-language.style-tile-format#2-required-sections
  - guide.quality.visual-quality-signals#2-the-ai-slop-test
  - guide.quality.visual-quality-signals#4-oklch-color-commitment-levels
rules: [visual-language.style-tile.sections, visual-language.style-tile.self-contained, quality.color.first-order-reflex, quality.color.bans, color.contrast.text]
evidence: style-preview.html with all seven sections, the DESIGN.md Overview section, and the person's explicit approval.
overrides: []
last_reviewed: 2026-11-14
---
No token values are generated in this play. The output is a direction and a page that shows it, for a person to approve.

1. Read `sistema.json` for the theme, density, and accessibility standard. Read the positioning statement in DECISIONS.md, and any existing brand material that `project.assess` found.

2. **Write the visual direction brief.** Answer each of these in one or two sentences. Use the translation guidance in the visual language guide.
   - Which two or three aesthetic reference points does this product draw from?
   - What color commitment level fits, and why?
   - What is the typographic character: weight range, size range, one typeface or a pairing?
   - Where does it sit between sharp and rounded? Give a preliminary radius.
   - What does this system explicitly not look like? Name two or three exclusions.

3. **Check the brief for reflexes.** Run the first-order reflex check from the quality guide on each choice. If a choice is the category default, either justify it in writing or change it.

4. **Choose seeds.** Pick a primary seed hex, a neutral seed hex with hue temperature, and any secondary seed. Do not build ramps here. The color play does that with the palette tool.

5. **Build `style-preview.html`** at the project root, with the seven sections the style tile format requires. Show every color as hex and OKLCH. Use the contrast tool to check each text pairing you show, and label the ratio. Flag any pairing that does not meet the standard in `sistema.json`.

6. **Write the DESIGN.md Overview section.** Create DESIGN.md if it does not exist, using the section headings in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Fill only Overview for now. It holds the brief, plus a short list headed "Direction values": commitment level, primary seed, neutral seed, any secondary seed, typographic character, and radius personality. Later plays read these values, so state them exactly.

7. **Ask for approval.** Summarize the brief in five bullets. Name the three or four choices that took the most judgment. Ask the person to open `style-preview.html` and approve it or ask for changes. Revise until they approve. Do not continue without an explicit approval.
