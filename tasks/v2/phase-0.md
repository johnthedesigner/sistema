# v2 Phase 0 Task File: Audit and fixes

**Phase goal:** An honest written picture of the code, server-side placeholder resolution, and a build-time integrity check, blocking for code-level rules and report-only for content until V1. Content bugs are inventoried here and fixed in V1 (see `docs/v2/capability-model.md`). All work commits to `v2`. Nothing merges to `main` until the VF task (ROADMAP Section 2).
**Plan references:** `docs/v2/SISTEMA_PLAN.md` Sections 2, 13 (layer 1), 14, 15 (Phase 0).
**Roadmap:** `docs/v2/ROADMAP.md`.

**Pre-audit findings (confirmed in code on 2026-11-14, before V0.1):**
- Next.js 15 App Router, not a static export. No test runner, no tests, no CI, no git tags.
- `{{sistema_url}}` is resolved only on the client, at copy or display time, by about 7 separate copies of the same `replace()` call in `src/components/`. `/raw` and `/bundle` serve file text unchanged. One KB file contains the placeholder: `kb/principles/color/primitive-ramp-scalability@2026-05-17.md`.
- `src/lib/site-url.ts` falls back to `https://sistema-bay-seven.vercel.app`, not the production domain. The owner confirmed production is `https://sistema.johnthedesigner.com`.
- Root `DESIGN.md` and `LIVING_BRIEF.md` had uncommitted changes from a 2026-05-27 retrospective run. The owner decides what to do with them in V0.0.
- `src/app/page.tsx:28` hardcodes `steps: 10`. Line 174 computes the count from data.
- Bootstrap Step 4 (`_meta/campaigns/bootstrap.md` around line 250) calls `/api/contrast` only and never the palette tool. It says CSS compiles "in Step 9". The Style Dictionary step is Step 8.
- 44 by 44 pixel touch targets appear in 6 places in `_meta/TASK_PLAYBOOKS.md` and once in each campaign file.
- Literal `[2026-05-13]` dates appear in 6 play templates.
- Campaigns are defined in `_meta/CAMPAIGNS.md` (step list) **and** written out in full in `_meta/campaigns/*.md`. That is the copy-in-two-places pattern behind the drift.

---

## Task V0.0: Baseline and housekeeping

**Status:** done (2026-11-14)
**Phase:** V0

### What this task implements

Creates a clean, recorded starting point before any v2 change ships.

### Steps

1. Apply the owner's decision on the uncommitted changes to root `DESIGN.md` and `LIVING_BRIEF.md`. Do not decide this alone.
2. Tag the current `main` HEAD as `v1-baseline` and push the tag. This is setup A for the Phase 5 comparison.
3. Add the owner's plan to the repo as `docs/v2/SISTEMA_PLAN.md`, unedited.
4. Close out `tasks/phase-9.md`. Mark each task with its disposition from ROADMAP Section 3. Move 9.2 to `_meta/BACKLOG.md`.
5. Update `SESSION_LOG.md` Current State to v2 Phase 0, next task V0.1. Archive the stale Phase 8 entries to `logs/phase-8.md`.

### Acceptance criteria

- [x] `git tag` shows `v1-baseline` on `main` HEAD, and the tag is pushed
- [x] `docs/v2/SISTEMA_PLAN.md` exists and matches the owner's file
- [x] `tasks/phase-9.md` shows a disposition for every task
- [x] `SESSION_LOG.md` Current State points to V0.1

---

## Task V0.1: Repo audit

**Status:** done (2026-11-14)
**Phase:** V0

### What this task implements

The written audit from plan Section 2, covering all seven items. It builds on the pre-audit findings above and confirms or corrects each claim in plan Sections 10.2 and 14 against the code.

### Files created or modified

- `docs/v2/audit.md`: the audit, with a one-line summary per section first and details below
- `docs/v2/PLAN_CORRECTIONS.md`: every place the plan's description differs from the code
- `docs/v2/bug-inventory.md`: every instance of each Section 14 bug type, with file and line

### Acceptance criteria

- [x] All seven audit items covered, each citing file paths
- [x] Each Section 14 row is marked confirmed, not found, or different, with evidence
- [x] Each Section 10.2 tool claim is confirmed by reading the route code or by a local request
- [x] Type scale page defaults recorded (base, ratio, line heights, smallest size) with where they come from
- [x] **Owner reviews the audit before V0.2 starts** (approved 2026-11-14)

---

## Task V0.2: Check infrastructure (report-only)

**Status:** done (2026-11-14). CI verification waits for the first push of `v2`.
**Phase:** V0

### What this task implements

The content integrity check (plan 13, layer 1), first in report-only mode. Rules fall into two groups. **Code-level** rules (placeholders and relative URLs in built output, broken references, stub integrity) become blocking in V0.6. **Content-level** rules (literal dates, step references by number, missing metadata) stay report-only until V1 moves content into the new model. Write the checker so V1 can add schema and contract validation to it, rather than replacing it.

The check runs against **built output** (`.next` HTML and `/raw` responses from `next start`) as well as source files. Source content is supposed to contain placeholders. The output must not.

The check covers:
- unfilled `{{...}}` placeholders in any agent-facing output, after resolution
- relative URLs (`/raw/...`, `/bundle/...`, `/api/...`) in agent-facing text
- literal dates in play and campaign templates
- broken internal references (play slugs in `CAMPAIGNS.md`, KB paths in `sources`, stub `points_to`, `/raw/` URLs in plays that don't resolve, versioned files with no stub)
- step references by number ("Step 9", "in Step N") and substep labels that don't match their parent step
- missing or placeholder metadata (a description equal to the title, a title derived from a file name)

### Files created or modified

- `tools/validate/check-content.ts` (alongside the existing `lint-frontmatter.ts`)
- `package.json`: `check:content` script, plus `--strict` flag support
- Test runner (recommendation: Vitest) with a first test file for the checker itself
- `next.config.ts`: set `outputFileTracingRoot` so `next start` works locally (bug inventory #25)
- Move `npm run lint` from the deprecated `next lint` to the ESLint CLI
- Retire or fold in `tools/validate/lint-frontmatter.ts` (it rejects `content_type: synthesis`)
- `.github/workflows/ci.yml`: lint, `check:content`, test, and build, on every push to `v2` and `main`

### Acceptance criteria

- [x] `npm run check:content` prints every violation and exits 0
- [x] `npm run check:content -- --strict` exits non-zero when any violation exists
- [x] The checker has tests with one fixture per rule, and each fixture fails as expected
- [ ] CI runs on pushes to `v2` (workflow written; runs once `v2` is pushed)
- [x] The report output is saved into `docs/v2/bug-inventory.md` as the baseline count

---

## Task V0.3: Placeholder resolution

**Status:** done (2026-11-14). The route test goes green once V0.4 adds the missing stub.
**Phase:** V0

### What this task implements

One place resolves `{{sistema_url}}`. The fix covers every surface where an agent reads Sistema text, not just the copy buttons.

### Steps

1. Create a single resolver in `src/lib/` (for example `resolvePlaceholders(text, origin)`). Replace every component copy of the `replace()` call with it.
2. Resolve placeholders server-side in `/raw` and `/bundle` responses, using the request origin. An agent that fetches a raw page must never see `{{sistema_url}}`.
3. Change the `SITE_URL` fallback in `src/lib/site-url.ts` to `https://sistema.johnthedesigner.com` (confirmed by the owner).
4. Resolve the placeholder in `kb/principles/color/primitive-ramp-scalability@2026-05-17.md` through the same path, so `/raw` serves it resolved. Replace the `raw.placeholder` rule with a route test that calls the `/raw` handler and asserts no placeholder.
5. Render tool pages' API examples as absolute URLs (bug inventory #31).
6. Confirm the visible prompt text on play, campaign step, and tool pages shows resolved absolute URLs after mount.

### Acceptance criteria

- [x] Exactly one implementation of placeholder resolution exists (`grep` shows no other `replace(/\{\{sistema_url` calls)
- [x] `curl` of a `/raw` page and a `/bundle` page containing the placeholder returns absolute URLs
- [x] The integrity check's placeholder count drops to zero for these surfaces
- [x] Build passes

---

## Task V0.4: Fix the broken guide stub

**Status:** done (2026-11-14)
**Phase:** V0

### What this task implements

Fix the code-level content violations so V0.6 can block on them:
1. Add the missing stub for `kb/principles/color/primitive-ramp-scalability` (bug inventory #18), so `/raw/principles/color/primitive-ramp-scalability` resolves. Guides carry forward into the new content model.
2. ~~Fix the broken Primer source citation (#29).~~ Withdrawn: a checker false positive. The rule now accepts `.json` stubs.
3. Make the one bare `/api/contrast` in `_meta/campaigns/bootstrap.md:328` absolute (#30). This is a one-line fix, needed only so code-level checks pass until V1 deletes the file.

All other content bugs in the inventory (step numbering, literal dates, touch targets, the bootstrap tool skip, metadata, titles, the guide contradiction, hardcoded counts) are **not fixed in V0**. Nothing merges to `main` before V1 replaces that content, so fixing it now would be thrown away. V1 resolves each one through the content model, and the integrity check confirms it. Each is marked "V1" in `bug-inventory.md`.

### Acceptance criteria

- [x] `/raw/principles/color/primitive-ramp-scalability` returns 200 with the placeholder resolved
- [x] `ref.*` rules report 0 violations
- [x] `_meta/CHANGELOG.md` and `_meta/INDEX.md` updated

---

## Task V0.5: Dropped

Folded into V1 on 2026-11-14 (see `docs/v2/capability-model.md`). The ID is kept so later task numbers don't shift.

---

## Task V0.6: Make code-level checks blocking

**Status:** done (2026-11-14)
**Phase:** V0

### What this task implements

Wires `check:content --strict` into the build (a `prebuild` script, so Vercel runs it too) and into CI, **for code-level rules only**: placeholders and relative URLs in built output, broken `/raw` references, and stub integrity. Content-level rules (dates, step references, metadata, restated rules) stay report-only. V1 makes them blocking as content moves into the new model.

### Acceptance criteria

- [x] `npm run build` fails when a raw placeholder or relative URL reaches built output (confirm with a throwaway edit, then revert)
- [x] `npm run build` passes on the clean tree
- [x] Content-level violation counts recorded in `bug-inventory.md` as the V1 baseline

---

## Task V0.7: Housekeeping and gate check

**Status:** done, awaiting the owner gate check (2026-11-14)
**Phase:** V0

### Steps

1. Write `docs/v2/retro-phase-0.md`.
2. Add new patterns to `AGENTS.md`: the shared resolver, the integrity check, and v2 task conventions.
3. Write `docs/v2/decision-brief-v1.md` for the "V1 start" decisions in ROADMAP Section 5 and capability-model Section 10. Give each one options, a recommendation, and downstream effects.
4. Write `tasks/v2/phase-1.md` from the ROADMAP V1 outline, adjusted for what V0 found.
5. Archive V0 session entries to `logs/v2-phase-0.md`.
6. Present the gate evidence to the owner. Do not merge to `main`.

### Acceptance criteria

- [x] Gate criteria met: build passes with code-level checks blocking, and no placeholders or relative URLs appear in `/raw`, `/bundle`, play, or campaign output. Spot-check with `curl` against `next start` locally or against the `v2` Vercel preview
- [ ] Owner's go logged in `SESSION_LOG.md`
- [x] `tasks/v2/phase-1.md` exists
