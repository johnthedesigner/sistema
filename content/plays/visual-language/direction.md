---
id: visual-language.direction
title: Set the visual direction
description: Turn the project's positioning into a specific visual direction and a style preview page that a person approves before any token values are generated.
topic: visual-language
kind: create
milestone: direction
entry: false
requires: ["project:a11y-standard", "project:theme", "project:density"]
produces: ["design-md#overview", sistema-review/style-preview.html]
tools: [palette, contrast]
knowledge:
  - guide.visual-language.overview#3-translating-positioning-to-visual-direction
  - guide.visual-language.overview#4-the-visual-direction-brief
  - guide.visual-language.overview#5-common-translation-errors
  - guide.visual-language.style-tile-format#2-required-sections
  - guide.quality.visual-quality-signals#2-the-ai-slop-test
  - guide.quality.visual-quality-signals#4-oklch-color-commitment-levels
rules: [visual-language.style-tile.sections, visual-language.style-tile.self-contained, color.ramps.from-tool, color.preview.ramp-strips, quality.review.outline, quality.color.first-order-reflex, quality.color.bans, color.contrast.text]
evidence: sistema-review/style-preview.html with all seven sections and every color taken from a palette tool ramp, the DESIGN.md Overview section, and the person's explicit approval.
overrides: []
last_reviewed: 2026-11-15
---
The output is a direction and a page that shows it, for a person to approve. No token files are written here, but every color on the page comes from the palette tool, so what the person approves is what the color play uses.

1. Read `sistema.json` for the theme, density, and accessibility standard. Read the positioning statement in DECISIONS.md, and any existing brand material that `project.assess` found.

2. **Write the visual direction brief.** Answer each of these in one or two sentences. Use the translation guidance in the visual language guide.
   - Which two or three aesthetic reference points does this product draw from?
   - What color commitment level fits, and why?
   - What is the typographic character: weight range, size range, one typeface or a pairing?
   - Where does it sit between sharp and rounded? Give a preliminary radius.
   - What does this system explicitly not look like? Name two or three exclusions.

3. **Check the brief for reflexes.** Run the first-order reflex check from the quality guide on each choice. If a choice is the category default, either justify it in writing or change it.

4. **Choose seeds and get their ramps.** Pick a primary seed hex, a neutral seed hex with hue temperature, and any secondary seed. If the project already has colors, use them as the seeds. Send all seeds to the palette tool in one request. Every color the preview shows, including hover, container, border, and feedback colors, is a stop from one of the returned ramps, or from the pre-built library for feedback hues at `{{sistema_url}}/palettes/library.json`. Note the ramp and stop for each.

5. **Build `sistema-review/style-preview.html`**, with the seven sections the style tile format requires:
   - Start the page with the workflow outline strip, and end it with the line naming the `continue` URL from `sistema.json`.
   - Show each ramp as a continuous strip, with every color as hex and OKLCH.
   - Load the chosen typefaces from Google Fonts or a font CDN if they are available there. Otherwise, say on the page which font is shown instead.
   - Check every text pairing you show with the contrast tool, in one batch request, and label the ratio. Flag any pairing that does not meet the standard in `sistema.json`.

6. **Write the DESIGN.md Overview section.** Create DESIGN.md if it does not exist, starting with the comment `<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->`, then using the section headings in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Fill only Overview for now. It holds the brief, plus a short list headed "Direction values": commitment level, primary seed, neutral seed, any secondary seed, the ramp stops the preview used for each color role, typographic character, and radius personality. Later plays read these values, so state them exactly.

7. **Ask for approval.** Summarize the brief in five bullets. Name the three or four choices that took the most judgment. Ask the person to open `sistema-review/style-preview.html` and approve it or ask for changes. Revise until they approve. Do not continue without an explicit approval. Tell them they can stop here and pick up later in any new session.
