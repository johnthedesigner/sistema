---
id: visual-language.direction
title: Set the visual direction
description: Turn the project's positioning into what the product needs, ask the person the taste questions with options rendered on their own product, and get a style preview page approved before any token values are generated.
topic: visual-language
kind: create
milestone: direction
entry: false
requires: ["project:a11y-standard", "project:theme", "project:density"]
produces: ["design-md#overview", sistema-review/style-preview.html]
tools: [specimen, palette, contrast]
knowledge:
  - guide.visual-language.overview#where-sistema-stands
  - guide.visual-language.overview#what-the-product-needs
  - guide.visual-language.overview#the-taste-questions
  - guide.visual-language.overview#emphasis-contrast-that-follows-importance
  - guide.visual-language.overview#failure-modes
  - guide.visual-language.style-tile-format#2-required-sections
  - guide.quality.visual-quality-signals#21-first-order-reflexes-category-obvious-choices
  - guide.quality.visual-quality-signals#23-plain-looking-traps
rules: [visual-language.style-tile.sections, visual-language.style-tile.self-contained, color.ramps.from-tool, color.preview.ramp-strips, quality.review.outline, quality.color.first-order-reflex, quality.color.bans, color.contrast.text, shape.radius.hierarchy, quality.craft.borders-have-a-job, quality.craft.emphasis-scarce]
evidence: sistema-review/style-preview.html with all seven sections, every taste question shown as rendered options, and every color from a palette tool ramp; the DESIGN.md Overview section with the direction values and the emphasis map; and the person's explicit approval, with their answer to each question.
overrides: []
last_reviewed: 2026-11-20
---
The person decides how the product looks by choosing between options they can see, rendered on their own product. You propose an answer to each question and say why; you don't answer for them. No token files are written here, but every color on the page comes from the palette tool, so what the person approves is what the color play uses.

1. Read `sistema.json` for the theme, density, and accessibility standard. Read the positioning statement in DECISIONS.md, and any existing brand material that `project.assess` found. Existing brand colors or typefaces are fixed points: use them, and ask only the questions they leave open.

2. **Write what the product needs:** three to five plain statements about what its screens must do, from the positioning (see "What the product needs" in the visual-language guide). Don't turn a style word into a style: "utilitarian" means status must stand out and rows must be easy to follow, not sharp corners and outlines.

3. **Propose an answer to each taste question,** with the need it serves:
   - **How much color:** quiet, brand, or tinted, and the accent seed. If the project has no brand color, take the seed from the palette library, `{{sistema_url}}/palettes/library.json`: a colorful palette at one of its bright middle stops (400 to 600), and offer two or three such stops as the options (see "How much color" in the visual-language guide). Run the first-order reflex check on the accent; if it's the category default, justify it in writing or change it. Keep it apart from the status hues when status matters.
   - **Warm or cool:** cool, neutral, or warm neutrals, or a neutral seed tinted toward the accent.
   - **How round:** a control radius (about 4, 8, or 12px), and scaled or pill chips.
   - **How surfaces separate:** tone, line, or shadow.
   - **Type voice:** three typefaces suited to the product, and a second face only with a reason.
   - **Density and theme:** only if `sistema.json` leaves them open.

4. **Render the options with the specimen tool.** For each question, render each option with that one setting changed and every other setting at your proposed answers. Use the layout closest to the product, and pass the product's own content (its navigation, a page title, a featured record, a few rows with real statuses, a few metrics) so the person sees their product, not placeholders. Then render the composition, all proposed answers together, in every theme in `sistema.json`. Use the `render` URL each response returns.

5. **Get the ramps and check contrast.** Send the accent and neutral seeds from the specimen response, and any secondary seed, to the palette tool in one request. Feedback ramps come from `{{sistema_url}}/palettes/library.json`. Check every text pairing the composition uses, including text on the brand and inverse surfaces, with the contrast tool, batched (one POST takes up to 200 pairs), against the standard in `sistema.json`. If a pairing fails, change the proposal and render again.

6. **Write the emphasis map:** for each kind of screen the product will have, which content is featured, which zones are subtle, and whether anything is a brand or inverse block. Keep strong emphasis scarce, so that what's featured still stands out; if several things on a screen would be featured, say which one leads.

7. **Build `sistema-review/style-preview.html`** with the seven sections the style preview format requires: the direction summary, the choices, the composition, color, type, the emphasis map, and reviewer notes.
   - Start the page with the workflow outline strip, and end it with the line naming the `continue` URL from `sistema.json`.
   - Describe every option in plain words. Never ask the person to approve a tradition name or a commitment level.
   - Show each ramp as a continuous strip, every color as hex and OKLCH, built from the palette tool's response, not typed.
   - Load the chosen typefaces from Google Fonts or a font CDN. If one isn't available there, say on the page which font is shown instead.
   - Before showing it, check the composition against the plain-looking traps: name the job of every border and divider, and squint at it to see what leads.

8. **Write the DESIGN.md Overview section.** Create DESIGN.md if it doesn't exist, starting with the comment `<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->`, then using the section headings in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Fill only Overview for now: the needs, a two-sentence summary, and two lists.
   - **Direction values:** color presence; commitment level (quiet is 1, brand is 2, tinted is 3, unless the person asked for more); accent seed; neutral seed and its warmth; any secondary seed; control radius and chip shape; how surfaces separate; typefaces; density; theme; the composition's specimen `render` URL; and the ramp and stop of each color role the composition used, from the specimen response.
   - **Emphasis map:** as in step 6.

   Later plays read these values, so state them exactly.

9. **Ask for approval.** Summarize the proposal in five bullets and name the three or four choices that took the most judgment. Ask the person to open `sistema-review/style-preview.html` and, for each question, pick an option or say "as proposed". Re-render and revise until they approve. Don't continue without an explicit approval. Record their answer to each question in the evidence. Tell them they can stop here and pick up later in any new session.
