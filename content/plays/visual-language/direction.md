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
  - guide.visual-language.overview#emphasis
  - guide.visual-language.overview#failure-modes
  - guide.visual-language.style-tile-format#2-required-sections
  - guide.quality.visual-quality-signals#first-order-reflexes-category-obvious-choices
  - guide.quality.visual-quality-signals#plain-looking-traps
rules: [visual-language.style-tile.sections, visual-language.style-tile.self-contained, color.ramps.from-tool, color.preview.ramp-strips, quality.review.outline, quality.color.first-order-reflex, quality.color.bans, color.contrast.text, shape.radius.hierarchy, quality.craft.borders-have-a-job, quality.craft.emphasis-scarce]
evidence: sistema-review/style-preview.html with all seven sections, every taste question shown as rendered options, and every color from a palette tool ramp; the DESIGN.md Overview section with the direction values and the "What stands out" list; and the person's explicit approval, with their answer to each question.
overrides: []
last_reviewed: 2026-11-20
---
The person chooses the look by picking between options drawn on their own product. You propose an answer to each question and say why. No tokens are written here, but every color comes from the palette tool, so what the person approves is what the color play uses.

1. **Read the project:** `sistema.json` (theme, density, accessibility standard), the positioning statement in DECISIONS.md, and any brand material `project.assess` found. Existing brand colors and typefaces are fixed; ask only what they leave open.

2. **Write what the product needs:** three to five plain statements about what its screens must do (the visual-language guide, "What the product needs"). Translate style words into needs, not looks.

3. **Propose an answer to each taste question,** with the need it serves:
   - **How much color:** quiet, brand, or tinted. For the accent, use the brand color, or offer two or three palettes from `{{sistema_url}}/palettes/library.json`, taking each palette's bright middle stop (400 to 600) as the seed. Avoid the category's obvious color unless you can say why, and keep the accent apart from status colors.
   - **Warm or cool:** cool, warm, tinted toward the accent (`neutral=tinted`), or nearly neutral (`neutral=neutral`). If grays follow the accent, each accent option has its own grays; say so.
   - **How round:** a control radius (about 4, 8, or 12px), and scaled or fully round chips.
   - **How surfaces separate:** tone, line, or shadow.
   - **Typeface:** three suited to the product. A second face only with a reason.
   - **Density and theme:** only if `sistema.json` leaves them open.

4. **Render the options** with the specimen tool. For each question, change only that setting; keep the rest at your proposals. Use the layout closest to the product and pass its real content (navigation, a title, a featured item, a few rows, a few numbers). Then render all proposals together, in every theme. Use each response's `render` URL.

5. **Get the ramps and check contrast.** Send the seeds from the specimen response to the palette tool in one request; feedback ramps come from the library. Check every text pair the rendering uses with the contrast tool, batched, against the project's standard. If a pair fails, change the proposal and render again.

6. **Write what stands out:** for each kind of screen, what is featured, what is quiet, and whether there's a brand or inverse block. Keep strong emphasis rare; if several things compete, say which leads.

7. **Build `sistema-review/style-preview.html`** with the sections the style preview format requires.
   - Start with the workflow outline strip; end with the line naming the `continue` URL.
   - Describe every option in plain words. Never ask anyone to approve a style label or a number.
   - Show ramps as continuous strips, colors as hex and OKLCH, from the palette tool's response.
   - Load the typefaces from Google Fonts or a font CDN, or say which font is shown instead.
   - Before showing it, check against the plain-looking traps: name each border's job, and squint to see what leads.

8. **Write the DESIGN.md Overview.** If DESIGN.md exists (a redo, through `project.revise`), rewrite Overview and mark each later section "From the previous direction; rewritten by `visual-language.design-md`". Otherwise create DESIGN.md with the comment `<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->` and the headings Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Fill only Overview: the needs, a two-sentence summary, and:
   - **Direction values:** how much color; accent seed; gray seed and warmth; any second seed; control radius and chip shape; separation; typefaces; density; theme; the rendering's `render` URL; and each color role's ramp and stop, from the specimen's `token_roles`.
   - **What stands out:** from step 6.

   Later plays read these values, so state them exactly.

9. **Ask for approval.** Summarize in five bullets and name the three or four hardest calls. Ask the person to open the page and, for each question, pick an option or say "as proposed". If their answers differ from your proposals, render all the answers together again, and label each question's options as drawn with your proposals. If they're unsure until they see it, render both ways. Don't continue without explicit approval. Record each answer in the evidence. Tell them they can stop and resume in any new session.
