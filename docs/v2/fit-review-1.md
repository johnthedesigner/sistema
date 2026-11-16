# Fit Review 1: Revision Plan

**Task:** V1.5. **Inputs:** both slice runs and the owner's feedback, in `slice-runs.md`. **Status:** approved by the owner on 2026-11-15, with 2.3 replaced by the instructions-file pointer (2.1). All four ⚑ items follow the recommendation. 6.2 (batch contrast) is approved for V1.5. **Applied 2026-11-15**, except 6.1 (V2) and section 8 (V1.7, V3). Rule names as built: `quality.review.compare-visually` and `quality.review.outline` (rule IDs need a topic), plus `project.state.valid` for 3.4.

How to review: mark each item **accept**, **change** (with a note), or **drop**. Items marked ⚑ need a decision, not just a yes. When the plan is approved, I apply it, rerun the resume test (R1), and then start the full migration (V1.10).

---

## 1. The model questions (capability model, Section 11)

| Question | Answer from the runs |
|---|---|
| Did skip work? | Yes. Both runs recorded the placeholders as skipped and moved on. Finished plays weren't redone. |
| Did resume work? | **No.** Resume only works if the person pastes the starter again. When the new-project owner wrote "pick up where I left off," the agent rebuilt the state well but never returned to Sistema, then improvised for 8 hours. This is the main fix (section 2). |
| Did the step sizes feel right? | Mostly. Assess, direction, and pipeline were the right size. Color adoption needs one more decision point (choosing options, 4.2). The pipeline quietly includes component edits (4.4). |
| Did the gates land in the right places? | Yes, both held. But what's approved at the direction gate isn't what ships, because the preview colors were hand-picked (4.1). And the final gate can't check decisions that nothing compiled (5.3). |
| Did the agent call the tools? | Yes, while on the workflow: palette 1 to 2 calls per run, contrast many. Contrast takes one pair per call, which led to roughly 50 calls (6.2). After drifting off the workflow, the agent computed everything by hand. |
| Was anything missing from the contract? | State shapes (3.1), the DESIGN.md front matter format (5.1), Tailwind 4 wiring (5.2), and where to continue from (2.1). |

**Verdict:** the model holds: topics, plays, workflows, contracts, gates, rules, and tools. Nothing here calls for restructuring. The fixes are about **continuity** (state that leads back to Sistema), **legibility** (outline, progress, comparison pages), and **precision** (exact shapes and formats).

---

## 2. Continuity and resume (highest priority)

**2.1 A pointer in the agent instructions file (primary mechanism).** `project.assess` adds a short, clearly marked section to the project's `AGENTS.md`, or to `CLAUDE.md` if that is what the project uses. It creates `AGENTS.md` if neither exists, and tells the person what it added. Coding agents load these files at the start of every session, so a new session knows about Sistema before the person types anything. The section reads:

```
<!-- sistema:start -->
## Design system (Sistema)
This project's design system follows Sistema. Before any design system work
(tokens, colors, type, components, DESIGN.md), read sistema.json and fetch
the URL in its "continue" field, then follow it.
<!-- sistema:end -->
```

The markers let later plays update or remove the section. The `continue` field in `sistema.json` holds the current workflow URL (2.4 changes it when a workflow ends). Rule `project.state.pointer` is blocking: the section exists, and `continue` is set while a workflow is running. The starter repeats it as its first instruction: if `sistema.json` exists, resume from it, even when the person only says "continue."

**2.2 Backup pointers in Sistema's own files.** DECISIONS.md, DESIGN.md (as an HTML comment), and the review pages each carry one line naming the `continue` URL. These are for tools that don't load an instructions file, and for people reading the files.

**2.3 ~~Gate messages end with text to paste.~~ Dropped** (owner: copying text between sessions is not a good approach). 2.1 makes it unnecessary. Gate messages say only that the person can stop here and pick up later in any session.

**2.4 The workflow has a clear end.** When the last gate passes, the agent says Start is complete and names the next workflow, or says there isn't one yet. It also says that further work is outside Sistema's process, so the person can decide. For `continue` in `sistema.json` this means: the next workflow's URL, or removed.

**2.5 Later channels.** Note for V2 and V4: a Sistema Agent Skill can trigger on `sistema.json` being present, and the MCP `next_step` tool makes resume a tool call. Nothing to build now.

---

## 3. State and schema

**3.1 The starter states the exact shapes.** It gives an example `sistema.json`, the allowed milestone values, who advances `milestone` (the workflow, at each gate), the step record, and the gate record.

**3.2 Schema changes:**
- Step `status` adds `in-progress`. Both runs used it, and it helps resume.
- Gate records add an optional `note`, for what changed at approval.
- `project` adds `theme_primary` (`light` or `dark`, needed when the theme is `light-dark`) and `platform`.
- Add `continue` (2.1).

**3.3 Publish the schema** at `<site>/raw/schema/sistema.json` (JSON Schema generated from the Zod schema), and link it from the starter.

**3.4 The agent validates before ending a session.** The starter's last step: check `sistema.json` against the published schema, and fix it if it doesn't match.

⚑ **3.5 Steps run outside a workflow.** The new-project run invented step IDs for work Sistema has no play for (`components.core` and others). Options:
- (a) Only play IDs are allowed in `steps`. Other work goes in DECISIONS.md.
- (b) Allow an `extra` record for work done outside Sistema.

I recommend (a). It keeps the state honest, and DECISIONS.md already holds the history.

---

## 4. Plays

**4.1 Direction uses real ramp stops.** `visual-language.direction` calls the palette tool for its seeds and shows real stops in the preview, so what's approved is what ships. *(Existing colors, finding 2.)*

**4.2 Color adoption shows options, then asks.** *(Proposals A, B, C, and E's interim step.)*
- `project.assess` explains briefly that existing colors will be examined and options shown. It doesn't ask for a strategy.
- `color.map-existing` writes `sistema-review/color.map-existing.html` before mapping anything. For each hue it shows:
  - the existing strip with diagnosis flags (misaligned index, chroma outlier, duplicate step, contrast failure);
  - one strip per option (keep exactly, keep and complete, regenerate), with changed values marked;
  - a small UI sample for each option.
- The person chooses per hue, and the choice goes in DECISIONS.md.
- The play's guidance names "keep and complete" as the usual suggestion when a project already has established tokens. It is not a default.
- Rule `color.existing.consent` (blocking): nothing existing is replaced, renamed, re-slotted, or heavily augmented without an explicit choice. This covers the ember and ink re-slotting.

**4.3 Ramp strips everywhere.** Rule `color.preview.ramp-strips`: one row per ramp, edge to edge, labels underneath, and existing values marked. Applies to `style-preview.html`, `token-check.html`, and comparison pages. *(Proposal D.)*

**4.4 The pipeline names its component edits.** `tokens.pipeline` lists every file outside `tokens/` that it changes, in its evidence. The app build must pass. *(Existing colors, finding 3.)*

⚑ Alternative: split usage migration into its own change play. I recommend keeping it in the pipeline for Start, because removing old theme values otherwise breaks the build, and listing the files is enough.

**4.5 Assess records what it inferred.** The positioning statement, or a line after it, lists facts taken from files or assumed rather than asked. Both runs did this informally.

**4.6 The review page font.** Rule `visual-language.style-tile.self-contained` allows one stylesheet link to Google Fonts or a font CDN, for the chosen typefaces only. Otherwise the page must state which font is substituted. *(New project, N4.)*

---

## 5. Specs and stack details

**5.1 DESIGN.md front matter format.** `tokens.pipeline` links the spec's front matter section. If the spec has no section the agent can read, render the expected shape directly in the play. *(Existing colors, finding 6.)*

**5.2 Tailwind wiring in the pipeline play.** React and Tailwind are the default stack, so the play states:
- Tailwind 4: `@theme inline reference` for role tokens, so Tailwind doesn't re-declare them; `--color-*: initial` to remove the default palette (⚑ I recommend it as standard, with the person able to opt out); and a check that the compiled CSS has no self-referencing variables.
- Tailwind 3: the `theme.extend` equivalent.

*(Existing colors, finding 7; new project, N2.)*

**5.3 The final gate lists approved values with no compiled tokens.** `token-check.html` has a section "Approved but not yet tokenized" when a category's play was skipped. The gate prompt mentions it.

**5.4 Collect the component lessons for later.** These are lessons from the new-project run's component work:
- In Tailwind 4, the focus ring needs `outline-solid`.
- Don't disable a focused control while its action runs.
- Toasts: no error tone, and action toasts don't time out.
- Self-host fonts.

They go into `_meta/BACKLOG.md` under the components milestone, for V1.10 to V1.13. They don't affect Start.

---

## 6. Tools

**6.1 Anchored palette ramps** (proposal E). The palette tool accepts existing colors as anchors. It returns every option's ramp plus the diagnosis. Planned for V2. Until then, 4.2 runs on one palette call plus the existing values.

**6.2 Batch contrast.** `/api/contrast` accepts `{"pairs": [...]}` and returns one result per pair. The single-pair form keeps working. It's cheap and helps MCP. Proposed for V1.5, since it is code and not content.

---

## 7. Legibility (owner principles)

**7.1 Outline and progress** (proposal H).
- The renderer produces the outline from the workflow.
- It's shown once after assess, with skipped and routed steps marked.
- After each play: one progress line.
- At gates and on resume: the full outline with status.
- The outline appears as a strip at the top of the review pages.

**7.2 Visual comparison for consequential choices** (proposal G). Rule `review.compare-visually`, and the `sistema-review/` folder. Color adoption is the first use (4.2). Typography, shape, spacing, and dark mode adopt it in V1.10.

⚑ **7.3** Should the gate pages move into `sistema-review/` as well? I recommend yes. It keeps all review pages in one place and leaves the project root clean. The cost is that `project.assess` has to look in two places on older projects.

**7.4 Closing question.** After the final gate, the agent asks the person: "Anything in this process that was unclear or that you'd change?" It notes any answer in DECISIONS.md. During development the slice runs also ask the agent for prompt gaps. That's a protocol step in `slice-runs.md`, not part of the play.

---

## 8. Site and narrative (no change to the slice)

- **F:** the color guide and onboarding explain the adoption options. *(V1.7 and V3.)*
- **D (site):** the `/tools/palette` page shows ramp strips. *(V3.)*

---

## 9. After approval

1. Apply sections 2 to 7 (except 6.1), with tests: schema, renderer outline, the pointer rule, and batch contrast.
2. Update `capability-model.md`. It gains continuity (the `continue` pointer and the workflow end) and review pages (G and H) as part of the model. Update `migration-notes.md` for the changed plays.
3. **R1, the resume rerun.** Make a fresh copy of the new-project scaffold in `~/Repos/sistema-slice/new-project-2`. The owner runs the starter, stops after the direction gate, and comes back with an informal message ("let's keep going"). Pass means the agent fetches Sistema from the pointer, records the gate, and runs the color play with the palette tool.
4. If R1 passes, log owner approval of V1.5 and start V1.10.
