# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 1 (Content model and narrative). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-1.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V1.2 — Loaders and channel generators
**Next task:** V1.3 — Convert the slice content
**Blockers:** none
**Notes:** `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

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
