# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 1 (Content model and narrative). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-1.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V1.13 — Site reads the new model
**Next task:** V1.14 — Remove legacy content and make content rules blocking
**Blockers:** none
**Notes:** `v2` is pushed. Preview: https://sistema-git-v2-jtd-604ef502.vercel.app. CI is green. `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

*v1 Phase 0–7 entries: `logs/phase-0.md` to `logs/phase-7.md`. Phase 8: `logs/phase-8.md`. v2 Phase 0: `logs/v2-phase-0.md`.*

### 2026-11-14 — Phase 0 gate and Task V1.0: Decision session

**What was done:**
- The owner approved the Phase 0 gate.
- The owner accepted all D1 to D10 recommendations. Recorded in `docs/v2/decisions.md`.
- Applied the decisions: `capability-model.md` (milestone enum `maintain`, decided items marked) and `VOICE_AND_TONE.md` ("campaign" becomes "workflow"; "play" defined as one task with a contract).

### 2026-11-14 — Task V1.1: Schemas and contract checks

**What was done:**
- `src/lib/content/schema.ts` (Zod 4): `PlayFrontmatter`, `WorkflowFrontmatter` (sequence or routes, gates with prompts), `Rule` (D8, with `parameters` and `checked_by` required for blocking rules), `SistemaState`, plus the topic, kind, milestone, tool, and DESIGN.md section enums. State tokens cover paths, `design-md#section`, `gate:`, and `project:`, with a `?` suffix for optional items.
- `src/lib/content/parse.ts`: pure parsers shared by the app and the checker; heading anchors; the play path convention; guide file lookup (`content/guides` first, then `kb/principles` until V1.12).
- `tools/validate/content/model-rules.ts`: 9 code-level contract checks (`model.schema`, `id-path`, `workflow-refs`, `requires`, `milestone-order`, `produces-conflict`, `knowledge`, `rule-refs`, `tools-named`), wired into `check:content`. 16 new tests: a valid mini-catalog plus a failing case per check. 45 tests total.
- Added `zod` 4 and `js-yaml` as dependencies. Clarifications (guide IDs, optional items, shared outputs) recorded in `docs/v2/decisions.md`.

### 2026-11-14 — Task V1.2: Loaders and channel generators

**What was done:**
- `src/lib/content/load.ts`: `loadCatalog(root)` loads plays, workflows, and rules from `content/`, resolves `{{sistema_url}}`, and throws with file and field on invalid content.
- `src/lib/content/render.ts`: `renderPlay` produces a self-contained agent document (preconditions with the plays that produce them, procedure, tool usage with absolute URLs and request shapes, rules inlined with standard parameters, guide links with sections, outputs, done-when, and record-keeping with no literal dates). Also `workflowSteps` (derived numbering, gates attached to the preceding play), `renderWorkflowStarter` (about 35 lines: run loop, play URLs, gates, tools, continuation, full-version link), and `renderWorkflowFull`.
- Static routes (no runtime file reads): `/raw/plays/[id]`, `/raw/workflows/[id]`, and `/raw/workflows/[id]/full`.
- Fixed a parser bug: malformed frontmatter YAML now produces a `model.schema` violation instead of crashing the checker.
- 58 tests pass. Build passes.

### 2026-11-14 — Task V1.3: Convert the slice content

**What was done:**
- `content/workflows/start.md`: 9 plays, with gates `direction-approved` and `foundations-approved`, and `content.voice-and-tone` optional.
- Converted `project.assess`, `visual-language.direction`, `color.scheme`, `color.map-existing` (added because the Adopt run routes to it), and `tokens.pipeline`. Five slice placeholders tell agents to record themselves as skipped.
- `content/rules/`: 14 rules across color, quality, tokens, visual-language, and project. Contrast rules are parameterized by standard (WCAG 2.2, WCAG 2.1, Section 508, EN 301 549).
- Renderer: the starter now follows `sistema.json` routing, records declined optional plays as skipped, and groups guide sections per guide. The DECISIONS.md line format no longer uses em dashes.
- Checker: text rules now also scan `content/`, `model.knowledge` checks rule `sources`, and output checks scan prerendered `/raw` `.body` responses. A mutation test (broken anchor, missing tool) confirmed the contract checks fire.
- `docs/v2/migration-notes.md`: where every legacy instruction went, across 5 plays (including both Bootstrap copies). Reading the legacy plays caught gaps in my first drafts: the platform and scale question, the positioning statement, and map-existing's ramp completeness step. All fixed.
- New bug #34: the quality guide's chroma budgets use an unstated scale.
- 72 tests pass. The build passes with all 10 plays and both workflow routes prerendered, and output checks show 0.

### 2026-11-14 — Task V1.4 setup

**What was done:**
- Pushed `v2` (owner approved). The first CI run passed. The Vercel preview built, and agent-facing URLs resolve to the branch URL (confirms `resolveSiteUrl` on a real preview).
- Created scratch projects in `~/Repos/sistema-slice/` (new folder, no existing repos touched): `new-project` (bare Next.js 15 and Tailwind 4) and `existing-colors` ("Ledgerline," with partial brand ramps in `@theme` and hardcoded hex in components). Each has its own local git repo and initial commit, and both build.
- Wrote `docs/v2/slice-runs.md`: how to run, the owner persona, and what is recorded per run.

### 2026-11-16 — Tasks V1.4 to V1.11 (summary)

**What was done:**
- **V1.4 and V1.5:** slice runs in both scratch projects, then the R1 resume run, which passed. Findings, owner feedback A to H, and fixes are in `docs/v2/slice-runs.md`. The state model is settled: `continue`, `in-progress`, gate notes, the AGENTS.md pointer, and the `/raw/schema/sistema.json` schema. Contrast accepts batches.
- **V1.10:** all 22 plays and 3 workflows (start, patterns, session) are in the new model. Fit review 1 is approved (`docs/v2/fit-review-1.md`).
- **V1.6 to V1.9 (Track A):** IA research, the narrative (`narrative-draft.md`, with the headline still open), 20 published opinions (`content/opinions/`, with schema and checks), and the site structure (`site-structure.md` with a visual version). Owner decisions are recorded in each document. Density and motion modes are on the roadmap as `tokens.add-mode` (V3). The prompt box and the new URLs go into V1.13.
- **V1.11:** `content.universal-threshold` now catches restated rule values (contrast ratios, target sizes, line-height and text-size minimums). Plays may not restate them. Guides may quote a value only on a line that names its standard. Edited the accessibility, color, and typography guides to cite rules. This was an in-place edit of the current versioned files, because D4 drops versioning for Sistema-authored content and V1.12 moves them. New rules: `color.contrast.large-text`, `typography.line-height.body` (AAA only), `typography.text-spacing` (WCAG 1.4.12), `tokens.naming.consistent`, `content.errors.no-exclamation`, `visual-language.direction.changes-propagate`, and four `ai.ui.*` rules. `typography.line-height.by-role` no longer sets universal ranges. Rules now render their `applies_when`.
- 100 tests pass. The build passes. The remaining 21 `content.universal-threshold` warnings are all in legacy `_meta/` files, which V1.14 deletes.

### 2026-11-16 — Task V1.12: Guides with addressable sections

**What was done:**
- Moved the current version of each of the 18 guides to `content/guides/<topic>/<name>.md`. Each now has a human title (also the H1), a description, its topic, its sources, and `last_reviewed`. The `note` field is kept where it existed. Deleted `kb/principles/` (stubs, older versions, and topic `_index.md` files).
- `GuideFrontmatter` and `parseGuide` check the schema, the path, and that the topic matches the folder. Guides are in the catalog (`loadCatalog().guides`) and in `model.schema`. `guideFiles` now looks only in `content/guides`.
- Legacy compatibility until V1.13: `kb.ts` maps the `principles` category to `content/guides` (no stubs), and generates topic index pages from guide titles and descriptions. The checker treats `kb/principles/...` paths as aliases, so legacy `/raw/principles` URLs and `sources` entries still resolve. `ContentMeta` shows "Last reviewed" for guides.
- Section anchors stay derived from headings. They're stable because `model.knowledge` fails the build when a cited heading changes.
- 101 tests pass. The build passes (227 pages).

### 2026-11-16 — Task V1.13: Site reads the new model

**What was done:**
- **New pages, in today's visual style:**
  - `/plays` (by topic) and `/plays/[id]`: prompt, what it needs and produces, evidence, rules, workflows with previous and next steps, cited guide sections, and an "Edit on GitHub" link.
  - `/workflows` and `/workflows/[id]`: prompt, an outline grouped by milestone with approvals, or the routes for the session workflow.
  - `/guides` and `/guides/[topic]/[name]`: body with heading ids that match the anchors plays cite, "On this page", plays and rules for the topic.
  - `/reference` with opinions (expandable, grouped), rules (by topic, with values by standard, the plays that use each rule, and its opinion), and tool APIs.
  - `/how-it-works` (the approved narrative copy) and `/agents`.
- **Plain text for agents:** `/llms.txt` (opening with how agents should use Sistema), plus `/raw/agents`, `/raw/opinions`, `/raw/rules`, and `/raw/guides/[topic]/[name]`. Plays now cite guides at `/raw/guides/...`.
- Every new page has the one-line note for agents at the top, with absolute URLs.
- **Rewired:** home (working headline, start prompt, workflows), nav (Plays, Guides, Reference, Tools, For agents; Get started goes to How Sistema works), footer, sitemap, and Cmd-K search (workflows, plays, guides, opinions, rules, sources, tools).
- **Removed:** `/playbooks`, `/campaigns`, `/guide`, `/bundle`, `/kb/principles`, `src/lib/{playbooks,campaigns,exemplars}.ts`, and the playbook and campaign components. `kb.ts` covers only reference categories.
- **Session routes are `{title, plays}`.** The session starter and `project.orient` accept a goal already stated in the prompt (needed by the V3 prompt box).
- Checked every route on a production server (old routes return 404), and took screenshots at desktop and phone width with no horizontal scroll. 100 tests pass, and the build passes (216 pages, output checks 0).
- **Deferred to V3:** entry pages `/start`, `/existing`, `/work`; `/reference/files/*`; the prompt box with suggestions; the narrative home page.

