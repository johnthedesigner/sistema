---
title: "Style preview format"
description: "What the style preview page contains (the taste questions shown as rendered options, the composition, ramps, type, and the emphasis map), its technical requirements, and what approving it means."
topic: visual-language
sources:
  - { source: designer-skills, url: "https://github.com/julianoczkowski/designer-skills/tree/main/design-brief" }
  - { source: anthropic-frontend-design, url: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md" }
  - { source: impeccable, url: "https://github.com/pbakaus/impeccable" }
  - { source: nngroup-hierarchy, url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/" }
note: "The style preview is the review page for the visual direction. It is where the person answers the taste questions by looking at options rendered on their own product, and approves the direction before any token values are written."
last_reviewed: 2026-11-20
---

# Style preview format

## Purpose of this document

This document specifies what `sistema-review/style-preview.html` contains and how it's judged. The `visual-language.direction` play writes it. An agent with this document and the specimen tool can build a conforming page without further research.

---

## 1 — What style-preview.html is

One HTML file that shows the visual direction in a form a person can judge by looking: the taste questions with their options rendered on the product's own content, the chosen options together as a composition, the color ramps, the type, and the emphasis map. It is a decision page, not a prototype of a screen and not a component library.

Every rendering of components on the page comes from the specimen tool, so every option is drawn the same way and only the decision differs. The agent builds the frame around them: the summary, the labels, the ramps, the type specimens, and the notes.

**The key constraint:** every choice on the page is something the person can see and change, described in plain words. "Panels a shade lighter than the page, no outlines" is a choice; "Level 2, Swiss" is not.

---

## 2 — Required sections

The page contains these seven sections in this order.

### Section 1: Direction summary

- What the product needs, as three to five plain statements (from the visual-language guide's "What the product needs").
- The proposed answer to each taste question in one line, with the need it serves.
- Two or three things this system won't look like, in plain words.

### Section 2: The choices

One block per taste question (how much color, warm or cool, how round, how surfaces separate, type voice; density and theme only if they're still open):

- The question in plain words.
- Two or three options, each a specimen rendering of the product's own content, side by side, with a one-line description under each.
- The proposed option marked, with the reason.
- Options in a block differ only in that question; everything else uses the proposed answers.

Render the options at a size the person can read, or link each to its full-size rendering. The person answers by naming an option per question, or "as proposed".

### Section 3: The composition

The proposed answers together, rendered by the specimen tool in the layout closest to the product (operations list, dashboard, record, marketing page, article, or shop), with the product's own content, in every theme in `sistema.json`. It shows the page, its zones, one featured item, and a brand or inverse block, so the person sees the levels together. Say under it that the content is placeholder content arranged by role, and that real hierarchy is settled once there are real screens.

### Section 4: Color

- Each ramp (accent, neutral, any secondary, and the feedback ramps used) as a continuous strip (`color.preview.ramp-strips`), every swatch with hex and OKLCH.
- The roles the composition used, with the ramp and stop each came from (the specimen tool's response lists them), including the emphasis surfaces.
- The contrast of every text pairing shown, from the contrast tool.

### Section 5: Type

The chosen typeface (and any second face) setting the product's real text: a page title, a heading, a row of data with figures, labels, and two or three lines of body. Label each with size and weight. These are the direction's proposal; the type scale play settles the scale.

### Section 6: Emphasis map

Per kind of screen the product has, which content plays which role: featured, subtle, brand block, inverse block, or none. It's a first guess, and it says so.

### Section 7: Reviewer notes

- The three or four choices that took the most judgment.
- Anything assumed because the brief didn't say.
- Any pairing flagged by the contrast tool, and what changed.
- How to answer: per question, an option or "as proposed", plus anything else to change.

---

## 3 — Technical requirements

- **One file.** All styles in a `<style>` block. External resources: one font stylesheet for the chosen typefaces, and the specimen tool's renderings, embedded as iframes of its `render` URLs (or saved alongside and embedded from there). If a typeface can't be loaded, the page says which font is shown instead.
- **Opens from the file system.** No build step and no server of its own.
- **Colors as hex and OKLCH.**
- **The workflow outline strip** at the top (`quality.review.outline`), and the `continue` line at the end.
- **Readable at a glance.** Lead with what the person is choosing; keep values and stop numbers in a quieter layer under each block.

---

## 4 — What the review means

Approving `style-preview.html` confirms the direction: the answer to each taste question, the composition, and the emphasis map. The foundation plays (color, type, shape and elevation, spacing) build from it, not from the brief directly.

**If the direction changes after foundations have been built, the affected foundations are rebuilt from the revised direction and approved again** (`visual-language.direction.changes-propagate`).

**Signs the page needs another pass before it goes to the person:**

- A question is described but not shown, or its options differ in more than one thing.
- The composition could be any product: the content is generic, or nothing about it follows the needs in the summary.
- Squinting at the composition, nothing leads, or the lines are what you see first (the plain-looking traps in the quality guide).
- Codewords (traditions, commitment levels) appear where plain descriptions should.

**Signs it's ready:**

- The person can answer every question by pointing at an option.
- The summary describes the direction in two sentences that would exclude most other products.
- The composition's emphasis follows the emphasis map.
