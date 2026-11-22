---
title: "The visual direction page"
description: "The page where the person sets the visual direction: built from Sistema's template, one question at a time, with the choices together, color, type, and what stands out, and the answers given back to the agent."
topic: visual-language
sources:
  - { source: designer-skills, url: "https://github.com/julianoczkowski/designer-skills/tree/main/design-brief" }
  - { source: anthropic-frontend-design, url: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md" }
  - { source: impeccable, url: "https://github.com/pbakaus/impeccable" }
  - { source: nngroup-hierarchy, url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/" }
note: "The visual direction page is where the person chooses the look, by seeing options on their own product, before any token values are written."
last_reviewed: 2026-11-22
---

# The visual direction page

## Purpose of this document

What `sistema-review/visual-direction.html` contains, how it's built, and what approving it means. The `visual-language.direction` play writes it.

## 1 What visual-direction.html is

One page where the person answers the taste questions by looking. Every rendering comes from the specimen tool, drawn on the product's own content, so options differ only in the decision.

**Build it from Sistema's template,** `{{sistema_url}}/templates/visual-direction.html`. Save it as `sistema-review/visual-direction.html` and replace only the JSON in `<script id="sistema-data">`. The template draws the renderings, ramps, roles, and contrast from Sistema's tools for whatever the person picks, so later sections always follow their choices.

## 2 Required sections

The template shows these in order. The data block supplies the content.

### Section 1: How this works

- How to answer, and a clear first step.
- Below it, quieter: what the agent knows about the product (`summary`) and what its screens need (`needs`).

### Section 2: The questions

One screen per taste question (`questions` in the data):

- The question in plain words, and what it changes.
- Two or three options, each the product's screen with only that setting changed, filling most of the window. The person flips between them and selects one.
- The recommended option, selected to start with, and the reason in terms of the product's needs.
- A choice of page type to preview on (`specimen.layouts`), with the product's content for each where the data gives it (`specimen.contents`).

### Section 3: All together

- The chosen options together, in every theme.
- The choices, with any that differ from the proposal marked.
- **Color:** the accent and gray ramps for the chosen options, every role with its stop in light and dark, and the contrast of the main pairs.
- **Type:** the chosen typefaces setting the product's name and text.
- **What stands out on each screen** (`stands`): what is featured, what is quiet, and any brand or inverse block. A first guess.
- **Notes** (`notes`): the hardest calls, anything assumed, and any contrast problem and what changed.

### Section 4: Give your answers

The person's answers as text, a box for anything else (with cycling examples, `examples`), and a button that copies both, to paste into the agent's session.

## 3 Technical requirements

- **One file,** opened from the file system. External resources: the specimen, palette, and contrast tools, and Google Fonts for the chosen typefaces. If a typeface isn't on Google Fonts, `fontNote` says which font is shown instead.
- **The data block only.** Don't edit the template's code or styles; improvements go into the template.
- **Options differ in one thing.** If one answer depends on another (grays tinted toward the accent), say so in the question's `help`.
- **Plain words.** No style labels or level numbers.
- **The `continue` URL** goes in the data for agents; the page doesn't show it.

## 4 What the review means

Approving the page confirms each answer, the combination, and what stands out. The foundation plays build from it, not from the brief.

If the direction changes after the foundations exist, the affected foundations are rebuilt and approved again (`visual-language.direction.changes-propagate`).

**Not ready if:**
- a question is described but not shown, or its options differ in more than one thing;
- the content is generic, not the product's own;
- squinting at "All together", nothing leads, or the lines read first.

**Ready when** the person can answer every question by choosing what they see.
