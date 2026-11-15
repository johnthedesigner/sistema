# Sistema v2: Execution Roadmap

**For:** the owner and every Claude Code session working on v2.
**Source plan:** `docs/v2/SISTEMA_PLAN.md`. This roadmap does not replace it. The plan says *what* and *why*. This file says *in what order*, *how work is tracked*, and *how each step is verified*.
**Created:** 2026-11-14 on branch `v2`.

---

## 1. How a session uses this file

At the start of every v2 session:

1. Read `SESSION_LOG.md` "Current State" to find the next task.
2. Read the current phase's task file in `tasks/v2/`.
3. Read the plan sections that task cites. Do not work from memory of the plan.
4. Do exactly one task (or one clearly bounded part of one). Stop at the task's acceptance criteria.
5. Update `SESSION_LOG.md` and tick the task's checkboxes before ending.

Rules that apply to every task:

- **Gates are hard stops.** A phase's last task is a gate check with the owner. The agent shows the evidence that each gate criterion is met, and the owner says go. This is a short conversation, not a code review or a merge. No task from the next phase starts until the owner's go is logged in `SESSION_LOG.md`.
- **Open decisions are never settled by the agent.** Present options and a recommendation, then wait. The decision schedule is in Section 5.
- **Outline before draft** for any new user-facing page, guide, or onboarding copy.
- **Code beats plan.** If the code contradicts the plan, stop and report. Record the correction in `docs/v2/PLAN_CORRECTIONS.md`. Do not quietly work around it.
- **Writing style** from plan Section 1 applies to all user-facing copy: no exclamation points, no em dashes, one idea per sentence, no overclaiming.

## 2. Branching and release model

Sistema has one user, the owner, so there is no live audience to protect. All v2 work stays on the `v2` branch and merges into `main` once, at the end. This replaces the plan's guidance about one pull request per phase.

- Commit directly to `v2`. No per-task branches or pull requests.
- Start every commit message with its task ID (for example `V0.3: single placeholder resolver`). Never mix phases in one commit. The final review can then read the history phase by phase with `git log --grep "^V1"`.
- `main` stays frozen at v1 until the final merge. If something has to change on `main` in the meantime, merge `main` into `v2` right away.
- Tag the current `main` as `v1-baseline` before v2 work begins. The Phase 5 harness runs setup A from this tag (plan 12.4).
- Anything that needs a public URL before the merge uses Vercel preview deploys of `v2`. That covers play testing, the MCP server in Claude.ai, and the harness. Confirm early that preview deployment protection doesn't block agents from fetching.
- After the V6 gate, a final task (VF) prepares the single review and merge. See Section 4.
- No compatibility work is needed. Old URLs, prompt formats, and file names can change freely, with no redirects or migration notes for outside users. The migration play for `LIVING_BRIEF.md` (plan 8.6) is still built, because Sistema's users will need it. Its only test case right now is the site itself.

## 3. Task numbering and file conventions

The repo already used phases 0 to 9 for v1. To avoid collisions, v2 work uses a `V` prefix.

| Item | Location | Example |
|---|---|---|
| Phase task files | `tasks/v2/phase-N.md` | `tasks/v2/phase-0.md` |
| Task IDs | `VN.M` | `V0.3` |
| Phase retros | `docs/v2/retro-phase-N.md` | |
| Archived session logs | `logs/v2-phase-N.md` | |
| Audit, research, decision records | `docs/v2/` | `docs/v2/audit.md`, `docs/v2/decisions.md` |

Each phase's task file is written at the end of the previous phase, during its housekeeping task. This keeps later phases grounded in what earlier phases actually found, instead of in guesses made today. Section 4 lists the expected tasks for each phase as an outline only.

v1's Phase 9 (`tasks/phase-9.md`) is closed out in V0.0. Its tasks map into v2 like this:

| v1 task | Disposition |
|---|---|
| 9.0 Play quality audit | Replaced by the V0 integrity check plus V5 behavior tests |
| 9.1 positioning-brief feed-forward | Replaced by play contracts (V1) with declared inputs and outputs |
| 9.2 scaffold-component-library play | Moved to `_meta/BACKLOG.md`. Revisit under the Patterns milestone in V3 |
| 9.3 Vercel deployment | Done. The site is live |
| 9.4 Housekeeping | Folded into V0.0 |

## 4. Phase sequence

The dependencies below set the order. Each arrow means "must be finished first."

```
V0 Audit + fixes + integrity check
 └─► V1 Narrative, decisions, content model, registry, migration
      ├─► V2 Tools + paste-in improvements  (needs registry + contracts)
      │    └─► V3 Reference project, guides, site restructure  (needs tools + registry)
      │         └─► V4 MCP server  (needs content model + final IA for connect page)
      │              └─► V5 Harness + evaluations  (needs reference project, baseline tag, MCP)
      │                   └─► V6 Figma export
      │                        └─► VF Final review and single merge to main
      └─► V7 Contingent items (only on real demand, after the merge)
```

### V0: Audit and fixes

Goal: an honest picture of the code, content free of the known bug instances, and a build check that stops those bug types from coming back. Clean content matters here because V1 migrates it. Bugs carried into the migration are harder to find afterward.

Order matters inside this phase. The integrity check is written **before** the fixes, in report-only mode. Its output becomes the measured bug list. The fixes then work through that list, and the check switches to blocking at the end. This way the fixes are verified by the same check that guards them later.

| Task | Summary |
|---|---|
| V0.0 | Baseline: settle uncommitted files, tag `v1-baseline`, close out v1 Phase 9, refresh `SESSION_LOG.md`, add plan to repo |
| V0.1 | Repo audit (plan Section 2) written to `docs/v2/audit.md`. **Owner review checkpoint.** |
| V0.2 | Test and check infrastructure: test runner, `check:content` script in report-only mode, minimal CI |
| V0.3 | Placeholder resolution: one shared resolver; server-side resolution for raw and bundle output |
| V0.4 | Campaign and play content fixes (numbering, step refs, counts, dates, palette tool, thresholds) |
| V0.5 | Metadata and site fixes (titles, descriptions, guide contradiction, hardcoded counts, site URL) |
| V0.6 | Switch the integrity check to blocking. Full build passes |
| V0.7 | Housekeeping, retro, decision prep for V1, write `tasks/v2/phase-1.md`. **Gate check.** |

**Gate:** `npm run build` passes with the integrity check blocking. No placeholders and no relative URLs in any published agent text, including `/raw` and `/bundle` output. The owner approves.

### V1: Narrative and content model

This is the largest phase, and other phases build on its output. It splits into two tracks that run in order. Track A produces owner decisions. Track B builds on them.

**Track A: decisions and narrative (owner-facing)**
1. Decision session for the blocking open decisions (Section 5, "V1 start").
2. IA and layout research (plan 7.2). Write up findings. Owner review.
3. Narrative outline for home and onboarding. Owner review. Then draft.
4. Published opinions outline. Owner review. Then draft.
5. Proposed site structure (three modes). Owner review.

**Track B: content model (engineering)**
1. Content type schemas (plan 8.1) and the validation layer. This extends the V0 integrity check. It does not replace it.
2. Split `_meta/TASK_PLAYBOOKS.md` (about 1,500 lines, one file) into one file per play, with no change to the text. Verify that the rendered output is unchanged before and after.
3. Rules registry schema, then seed it with every rule currently embedded in plays and guides. Replace each restated rule with a registry reference.
4. Play contracts (plan 8.5) on every play.
5. Campaigns rebuilt as lists of play IDs. No copied play text. Step numbers and counts are generated.
6. Category taxonomy: replace the six stages with the five categories.
7. Project state model (plan 8.6) and a migration play for `LIVING_BRIEF.md` users.
8. Reference material moves to an internal folder. Sources page added. **Order constraint:** before unpublishing any `/kb/reference/...` URL, every play that fetches it must have a published replacement. The integrity check's broken-reference rule enforces this. No redirects are needed.
9. "What uses this" lookup and the last-reviewed check (plan 8.2).

**Gate:** every play and campaign renders from the content model. No rule is restated in prose. The owner has approved the narrative, IA, opinions, and state model.

### V2: Tools and paste-in improvements

Expected tasks: contrast batch mode and `oklch()` and `rgb()` input; GET support for every tool API; palette input documentation; type scale API and fixed page defaults that read from the registry; a plain machine-readable index (`/api` or `/index.txt`); shorter prompts that point to guide sections; tool tests and consistency tests (plan 13, layers 2 and 3); every play names its required tools.

**Gate:** plan 15, Phase 2 gate.

### V3: Reference project, guides, and site

Expected order: the reference project goes through Direction, then Foundations, then Patterns. The four guide rewrites (color, tokens, typography, quality signals) follow the reference project, because the guides' worked examples come from it. Guides are outlined first, then drafted. The site restructure into three modes comes next. The site's own design system (DESIGN.md, DECISIONS.md, sistema.json) goes through the method last. That last task also resolves the root `DESIGN.md` and `LIVING_BRIEF.md` that exist today.

**Gate:** plan 15, Phase 3 gate.

### V4: MCP server

Expected first task: verify the current versions and APIs of `mcp-handler`, the MCP TypeScript SDK, and Zod before writing code. The plan names versions that may have changed. Then build the route, the connect page, and the copy-or-run option on play pages, and test in each client.

**Gate:** plan 15, Phase 4 gate.

### V5: Test harness and evaluations

Expected tasks: build the harness with a spending cap; write behavior tests for the core plays; run the three-way comparison (setup A runs from the `v1-baseline` tag); evaluate tool candidates with thresholds set **before** the runs; update site claims to match the results.

**Gate:** plan 15, Phase 5 gate.

### V6: Figma export

Run as described in plan 15.

### VF: Final review and merge

1. Write `docs/v2/REVIEW_GUIDE.md`. It summarizes each phase: what changed, where to look, the gate evidence, and the decisions made. It is a map for the owner's single review.
2. Run the full check suite (lint, content check, tests, build) on `v2`. Run the behavior tests one last time against the Vercel preview.
3. Bring `AGENTS.md`, `SESSION_LOG.md`, and `docs/META-PLAN.md` up to date for the v2 structure.
4. Owner reviews. Fixes from the review land on `v2` as `VF` commits.
5. Merge `v2` into `main`. Confirm the production deploy at sistema.johnthedesigner.com. Smoke-test `/raw`, `/bundle`, every tool API through GET, and the MCP endpoint against the production domain.

### V7: Contingent items

Only on real demand, after the merge. See plan 15.

## 5. Decision schedule

Open decisions are set to the latest point where they can be settled without blocking work. Settling them earlier is fine.

| Decision | Needed by | Blocks |
|---|---|---|
| Project state files (DESIGN.md, DECISIONS.md, sistema.json) | V1 start | Play contracts, migration play, every play's read/write steps |
| Milestone and practice names; merge Maintenance and Growth | V1 start | Category taxonomy, schemas, IA |
| Default stack path | V1 start | Opinions page, play wording |
| Rules registry schema | V1 Track B step 3 | Registry seeding |
| Narrative, opinions, IA approvals | V1 gate | V2 start |
| Reference project product and location | V3 start | Guide worked examples |
| Token validator and dark mode mapping as tools | V5 evaluation results | V5 gate |

V0.7 prepares a decision brief for the "V1 start" items. Each one gets options, a recommendation, and what changes downstream. That way V1 opens with a single decision session instead of stalling on each item in turn.

## 6. Known interim states

Some V0 fixes are stopgaps that V1 replaces properly. They are still worth doing, so the V1 migration starts from content that passes the integrity check. Keep them minimal and don't polish them.

- **Touch targets:** V0 replaces "44 by 44 pixels" with wording that defers to the accessibility standard recorded in the project's brief. The registry and `sistema.json` replace that wording in V1.
- **State file contradiction:** V0 makes `/guide` describe what plays actually do today (they read `LIVING_BRIEF.md`). V1 settles the long-term model.
- **Literal dates:** V0 replaces them with an instruction to use today's date. V1 makes this a build rule.
- **Monolithic `TASK_PLAYBOOKS.md`:** V0 edits it in place. V1 splits it.

## 7. Risks specific to execution order

- **V1 scope.** V1 is roughly as large as all the other phases combined. If it runs long, cut Track B step 9 and the reference-material move (step 8) into a V1b. Do not cut schemas, the registry, or the migration.
- **Migration regressions.** Splitting plays and rebuilding campaigns can silently change prompt text. Snapshot every rendered play and campaign step (raw text) before Track B starts, and diff against the snapshot after each step.
- **A long-lived branch makes the final review large.** Task-ID commit messages, the per-phase retros, and `REVIEW_GUIDE.md` exist to keep that one review manageable. Don't skip them.
- **AGENTS.md drift.** Much of `AGENTS.md` describes v1 structures (stages, `TASK_PLAYBOOKS.md`, living brief). Update it in each phase's housekeeping task, not at the end.
- **Session log staleness.** `SESSION_LOG.md` currently says Phase 8. Every task must update it, or later sessions will start from the wrong place.
