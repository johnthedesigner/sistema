# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 0 (Audit and fixes). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-0.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V0.1 — Repo audit
**Next task:** V0.2 — Check infrastructure (report-only).
**Blockers:** owner review of `docs/v2/capability-model.md` (the audit review is folded into this one)
**Notes:** `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

*v1 Phase 0–7 session entries archived to `logs/phase-0.md` through `logs/phase-7.md`. Phase 8 entries are in `logs/phase-8.md`. v1 Phase 9 was never started and was closed out in V0.0.*

### 2026-11-14 — Design change: capability model

**What was done:**
- The owner decided to rethink how plays are organized, so the IA works for MCP and skills as well as the web library. Bootstrap, the most-used play, becomes the center of the model.
- Wrote `docs/v2/capability-model.md`: units (guide, rule, opinion, tool, step, workflow), topics as the main axis, step contracts, workflows with gates and skip/resume driven by `sistema.json`, channel rendering, a fixed 6-tool MCP surface, and a fit test mapping all 25 plays and 2 campaigns (resulting in 23 steps and 3 workflows).
- The fit test found: a `migrate-tailwind-tokens` output path conflict, a spacing step that doesn't cite its guide, no steps for motion or depth, no components guide, DESIGN.md written by several steps (needs section-level outputs), and that Adopt depends on detecting non-conforming outputs.
- Updated ROADMAP: V1 is now decisions, then a vertical slice (workflow.start plus 4 steps run on two scratch projects), then a fit review, then full migration with a second fit review. V0.4 shrinks to one stub fix. V0.5 is dropped, because nothing merges before V1 replaces that content.

**Owner decisions:** separate units; topic axis with derived milestones; designed for Agent Skills; workflows as entry points; gates at Direction approval and end of Foundations; Start covers Direction and Foundations, with Patterns as a continuation; steps grouped under topics on the site.

### 2026-11-14 — Task V0.1: Repo audit

**What was done:**
- Wrote `docs/v2/audit.md` (all seven plan Section 2 items), `docs/v2/bug-inventory.md` (28 bugs: 17 from plan Section 14, 11 new), and `docs/v2/PLAN_CORRECTIONS.md` (10 corrections).
- Baseline `npm run build`: passes, 197 pages.
- Searched built HTML: 35 pages contain literal `{{sistema_url}}`, and 11 campaign step pages contain relative `/raw/` URLs. The cause is client-only placeholder resolution.
- Probed the tool APIs on `next dev`. `next start` serves 404 everywhere because a stray `../package-lock.json` makes Next.js pick the wrong workspace root.
- Updated `tasks/v2/phase-0.md` V0.2 to V0.4 with the new findings.

**Key findings:** two hand-written copies of every campaign step (root cause of the tool skip and numbering drift); a broken `/raw` reference used by two plays; the type scale disagreement is three-way and doesn't involve 0.969.

### 2026-11-14 — Task V0.0: Baseline and housekeeping

**What was done:**
- Committed the 2026-05-27 retrospective updates to root `DESIGN.md` and `LIVING_BRIEF.md` (owner approved). Fixed two factual errors: the Tailwind version (3.4, not v4) and the stale "time-based" dark mode note in the brief.
- Added the owner's plan (`docs/v2/SISTEMA_PLAN.md`), the execution roadmap (`docs/v2/ROADMAP.md`), and the Phase 0 task file (`tasks/v2/phase-0.md`).
- Tagged `main` (`0a94ac4`) as `v1-baseline` and pushed the tag.
- Closed out `tasks/phase-9.md` with a disposition for each task. Annotated three `_meta/BACKLOG.md` items that v2 now covers.
- Archived the Task 7.5 entry to `logs/phase-7.md`. Reset Current State to v2.
- Added a v2 pointer at the top of `AGENTS.md`.

**Owner decisions logged:**
- A single merge of `v2` into `main` at the end. No per-phase PRs or merges.
- No compatibility work. Sistema has no outside users yet.
- Production domain is `sistema.johnthedesigner.com`.
