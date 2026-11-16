# v2 Phase 1 Task File: Content model and narrative

**Phase goal:** Every play and workflow renders from the new content model (`docs/v2/capability-model.md`) in every channel. The model is proven on a thin vertical slice before full migration. The narrative, IA, and opinions are approved.
**Plan references:** `docs/v2/capability-model.md` (all), plan Sections 3, 6, 7.1, 7.2, 8, 9.2; ROADMAP V1.
**Starting point (end of V0):** server-side placeholder resolution; integrity checker with code-level rules blocking the build; 62 content-level violations as the baseline; 29 passing tests.

Decisions D1 to D10 are recorded in `docs/v2/decisions.md` (all recommendations accepted).

**Order:** V1.0, then the slice (V1.1 to V1.5), with Track A (V1.6 to V1.9) running alongside the slice. Full migration (V1.10 to V1.17) starts only after the V1.5 fit review. V1.18 closes the phase.

---

## Task V1.0: Decision session

**Status:** done (2026-11-14)

Walk the owner through `docs/v2/decision-brief-v1.md` (D1 to D10). Record each answer in `docs/v2/decisions.md` (date, decision, reason). Update `capability-model.md` and this file where an answer changes them.

- [x] D1 to D10 answered and recorded
- [x] This file and `capability-model.md` updated for any non-default answers

---

## Slice

### Task V1.1: Schemas and contract checks

**Status:** done (2026-11-14)

Schemas for plays, workflows, rules, and `sistema.json` (TypeScript types plus runtime validation). Add new rules to the existing checker (`tools/validate/content/`), not a parallel tool:
- required fields
- every `requires` is satisfied by an earlier `produces` in each workflow, or by a `gate:` or `project:` field
- `milestone` agrees with the dependency order
- no two plays produce the same path with different meanings
- `knowledge` and `rules` IDs resolve
- every tool in `tools` is named in the play body

- [x] Schemas with tests, including one failing fixture per check
- [x] New checks are code-level for content under `content/`, and don't touch legacy files

### Task V1.2: Loaders and channel generators

**Status:** done (2026-11-14). Renderers are tested on fixtures; route tests against real content land with V1.3.

Loaders for `content/`. Generators for:
- paste-in workflow starter (capability-model 9.2)
- `/raw/plays/<id>` (single play, IDs expanded to absolute links)
- the "full version" expansion
- step numbering, counts, and step lists, all derived from data

Placeholders are resolved through `src/lib/placeholders.ts`.

- [x] Starter, full version, and `/raw/plays/<id>` render (fixture-tested; real slice content in V1.3)
- [x] Output passes the existing code-level checks (no literal dates, relative URLs, or placeholders; asserted in tests)
- [x] Route tests (done in V1.3 against real content: `src/app/raw/content-routes.test.ts`) in the style of `src/app/raw/raw-and-bundle.test.ts`

### Task V1.3: Convert the slice content

**Status:** done (2026-11-14). Converted five plays, not four: `color.map-existing` was added because the Adopt run routes to it.

Convert `workflow.start`, `project.assess`, `visual-language.direction`, `color.scheme`, and `tokens.pipeline`. Stub the other Start plays. Seed the rules those plays cite (D8 schema). Add the guide section anchors they cite.

For each converted play, log in `docs/v2/migration-notes.md` where every instruction from the old play went: kept, moved to a guide or rule, or dropped with a reason.

- [x] Five items converted, contract checks pass
- [x] Migration notes complete for each
- [x] `project.assess` handles the Adopt classification (conforming, non-conforming, missing)

### Task V1.4: Slice runs

**Status:** in progress. The preview, scratch projects, and protocol are ready (`docs/v2/slice-runs.md`). Waiting on the owner's runs.

Per D9 and D10: run the Start starter on two scratch projects (empty, and existing Tailwind colors) against a public URL. Capture transcripts and outputs.

Record for each run:
- skip and resume behavior
- tool calls made and malformed
- gate stops
- evidence shown
- `sistema.json` correctness
- token cost, if available
- anything the agent had to guess

- [ ] Both runs done, findings written to `docs/v2/slice-runs.md`

### Task V1.5: Fit review 1 (owner)

**Status:** in progress. Plan approved 2026-11-15 (`docs/v2/fit-review-1.md`); applying it, then the R1 resume rerun

Review `slice-runs.md` with the owner against capability-model Section 11. Revise the model, schemas, and slice content. **Full migration does not start until the owner approves.**

- [ ] Owner approval logged; `capability-model.md` revised

---

## Track A (alongside the slice)

### Task V1.6: IA and layout research

**Status:** not started

Plan 7.2's list of sites, plus 2 or 3 well-regarded MCP servers and skill libraries. The question for those: how they organize capabilities for an agent. Write findings to `docs/v2/ia-research.md`.

- [ ] Findings written; owner review

### Task V1.7: Narrative (outline first)

**Status:** not started

Home and onboarding narrative (plan Section 3), built around three entry points: start a system, bring Sistema to an existing system, work on my system. Include the repo-as-source-of-truth fit statement (plan 4). Outline, owner review, then draft. Plan Section 1 writing style applies.

- [ ] Outline approved; draft approved

### Task V1.8: Published opinions (outline first)

**Status:** not started

Plan Section 6 opinions as `content/opinions/` items: default, reason, when to choose otherwise. Outline, owner review, then draft.

- [ ] Outline approved; draft approved; opinions are content items, not page copy

### Task V1.9: Proposed site structure

**Status:** not started

Three modes (plan 7.1), with topic-organized reference and plays grouped under topics. This is a proposal only. The build happens in V3.

- [ ] Proposal approved

---

## Full migration (after V1.5)

### Task V1.10: Remaining plays and workflows

**Status:** not started

Convert the rest per capability-model Section 7: `workflow.patterns`, `workflow.session`, and all plays. Add contracts first, then fix what the checks report. Includes the `migrate-tailwind-tokens` path conflict and the spacing guide link. Migration notes for each.

- [ ] All 23 plays and 3 workflows converted; contract checks pass

### Task V1.11: Rules registry seeding

**Status:** not started

Every rule embedded in plays and guides goes into `content/rules/`, and every restatement is replaced with a reference. That includes the 44px threshold, which becomes a standard-parameterized rule. Add a checker rule that flags restated rules where it can detect them (known thresholds and ratios in prose).

- [ ] Registry seeded; `content.universal-threshold` at 0

### Task V1.12: Guides with addressable sections

**Status:** not started

Move `kb/principles/` to `content/guides/` (D4), give each guide a required title, and give each section a stable anchor that plays cite. This is a structural move, not the V3 rewrite.

- [ ] `content.missing-title` at 0; every `knowledge` reference resolves to an anchor

### Task V1.13: Site reads the new model

**Status:** not started

Point the existing pages (play pages, play index, campaign pages, home quick cards, `/guide` references) at the new loaders, with minimal UI change. The site restructure is V3. Remove stage constants and `PLAY_DESCRIPTIONS`.

- [ ] `npm run build` passes; every current route either renders from the new model or is removed on purpose

### Task V1.14: Remove legacy content and enable content rules

**Status:** not started

Delete `_meta/TASK_PLAYBOOKS.md`, `_meta/CAMPAIGNS.md`, and `_meta/campaigns/` once nothing reads them. Make content-level rules blocking (`--strict-all` in `prebuild`).

- [ ] Legacy files gone; content-level violations at 0; build blocks on any violation

### Task V1.15: LIVING_BRIEF migration play

**Status:** not started

A play that turns `LIVING_BRIEF.md` into DESIGN.md (D6 sections), DECISIONS.md, and `sistema.json`. Test it on Sistema's own root files, without committing the result. V3 applies it for real.

- [ ] Play converts Sistema's own brief correctly in a dry run

### Task V1.16: Reference material and Sources page

**Status:** not started

Move `kb/reference/` to internal `reference/` (D4), never routed. Replace the DESIGN.md spec fetch with a Sistema-owned page. Guide `sources` citations of reference material become plain credit lines. Add a public Sources page with licensing notes. No redirects.

- [ ] No route serves reference material; the Sources page credits every source; checks pass

### Task V1.17: "What uses this" lookup, last-reviewed check, fit review 2

**Status:** not started

Plan 8.2 lookup (`npm run uses -- <id>`) and the last-reviewed threshold check. Then fit review 2 with the owner: the full catalog against capability-model Section 7, and no play restates a guide.

- [ ] Lookup and review check work; owner approves fit review 2

### Task V1.18: Housekeeping and gate check

**Status:** not started

Retro (`docs/v2/retro-phase-1.md`), AGENTS.md (KB rules rewritten for the new layout), `tasks/v2/phase-2.md`, archive logs to `logs/v2-phase-1.md`, and gate evidence.

- [ ] Gate: every play and workflow renders from the model in each channel (web, raw, starter); no restated rules; owner approved narrative, IA, opinions, state model, and both fit reviews
