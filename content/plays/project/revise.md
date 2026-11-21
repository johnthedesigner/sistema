---
id: project.revise
title: Change an approved decision
description: Reopen an approved direction, foundation, or component treatment when the person wants it changed, rebuild what depends on it, and get it approved again.
topic: project
kind: change
milestone: maintain
entry: true
requires: [sistema.json, DECISIONS.md]
produces: [sistema.json, DECISIONS.md]
tools: []
knowledge:
  - guide.visual-language.style-tile-format#4-what-the-review-means
rules: [visual-language.direction.changes-propagate, project.state.valid, project.state.pointer]
evidence: The change in one line (what it was, what it becomes, who asked), the steps reopened and the gates withdrawn, each affected play re-run with its evidence, and each withdrawn gate approved again.
overrides: [change]
last_reviewed: 2026-11-20
---
Use this whenever the person wants to change something already approved: a taste answer from the direction ("a different accent", "rounder"), a foundation value ("fewer borders", "larger body text"), or how a component treats a state. It applies mid-review too: if the person asks for the change while looking at a later review page, run this play there and then return to that review.

1. **Name the change.** Use `change` if given. Restate it in one sentence: what it is now, what it becomes, and why, in the person's words. If it contradicts a recorded decision, say which one.

2. **Find what depends on it,** following the order of the Start and Patterns sequences:
   - A direction answer: the direction itself (re-render the affected question and the composition, then approve again), DESIGN.md, the foundation plays the answer touches (color for color presence, accent, or grays; shape for radius, chips, or separation; typography for the typeface; spacing for density), the token pipeline, and the components.
   - A foundation value: that foundation play, the token pipeline, and the components that use it.
   - A component treatment: the components and their showcase.

   Name each play and each gate that comes after the change.

3. **Show the person what will be redone** in a short list, and confirm before changing anything. A small change may touch one play; a new direction touches most of them.

4. **Reopen the steps.** In `sistema.json`:
   - set each affected play to `pending` (the first one to `in-progress`);
   - for each approval that comes after the change, add `withdrawn` with today's date and the reason, and keep the original approval as it was, so the history stays readable;
   - set `workflow` to the workflow that holds the first affected play (`start` or `patterns`), `continue` to that workflow's URL (keep its `c` parameter), and `milestone` to that play's milestone.

   Add a line to DECISIONS.md with the change, the person's words, and the steps reopened.

5. **Re-run each affected play in order,** fetching each one fresh. These plays were written for a first run, so on a redo:
   - update the existing files instead of creating them, and remove what the change replaces (old values, old wording on review pages and in DESIGN.md);
   - keep what the change doesn't touch, and say so in the evidence;
   - search DESIGN.md, DECISIONS.md, and the review pages for the old decision and its wording, so nothing still states it;
   - where DESIGN.md has sections from the previous decision that a later play will rewrite, mark them at the top as "From the previous direction; rewritten by `<play id>`", until that play runs.

6. **Approve again.** At each withdrawn gate, show the review page and ask the person to approve. When they do, replace that gate's entry with the new date and approval, and remove `withdrawn`.

7. When the last affected play is done, set `continue` back to what it was before the change (the workflow that was running, or the session workflow), and show the evidence.
