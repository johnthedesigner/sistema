# v2 Phase 0 Task File: Audit and fixes

**Phase goal:** An honest written picture of the code, content free of the known bug instances, and a build-time integrity check that stops those bug types from returning. All work commits to `v2`. Nothing merges to `main` until the VF task (ROADMAP Section 2).
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

**Status:** not started
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

- [ ] `git tag` shows `v1-baseline` on `main` HEAD, and the tag is pushed
- [ ] `docs/v2/SISTEMA_PLAN.md` exists and matches the owner's file
- [ ] `tasks/phase-9.md` shows a disposition for every task
- [ ] `SESSION_LOG.md` Current State points to V0.1

---

## Task V0.1: Repo audit

**Status:** not started
**Phase:** V0

### What this task implements

The written audit from plan Section 2, covering all seven items. It builds on the pre-audit findings above and confirms or corrects each claim in plan Sections 10.2 and 14 against the code.

### Files created or modified

- `docs/v2/audit.md`: the audit, with a one-line summary per section first and details below
- `docs/v2/PLAN_CORRECTIONS.md`: every place the plan's description differs from the code
- `docs/v2/bug-inventory.md`: every instance of each Section 14 bug type, with file and line

### Acceptance criteria

- [ ] All seven audit items covered, each citing file paths
- [ ] Each Section 14 row is marked confirmed, not found, or different, with evidence
- [ ] Each Section 10.2 tool claim is confirmed by reading the route code or by a local request
- [ ] Type scale page defaults recorded (base, ratio, line heights, smallest size) with where they come from
- [ ] **Owner reviews the audit before V0.2 starts**

---

## Task V0.2: Check infrastructure (report-only)

**Status:** not started
**Phase:** V0

### What this task implements

The content integrity check (plan 13, layer 1), first in report-only mode, so its output becomes the measured fix list for V0.3 to V0.5.

The check covers:
- unfilled `{{...}}` placeholders in any agent-facing output, after resolution
- relative URLs (`/raw/...`, `/bundle/...`, `/api/...`) in agent-facing text
- literal dates in play and campaign templates
- broken internal references (play slugs in `CAMPAIGNS.md`, KB paths in `sources`, stub `points_to`)
- step references by number ("Step 9", "in Step N") and substep labels that don't match their parent step
- missing or placeholder metadata (a description equal to the title, a title derived from a file name)

### Files created or modified

- `tools/validate/check-content.ts` (alongside the existing `lint-frontmatter.ts`)
- `package.json`: `check:content` script, plus `--strict` flag support
- Test runner (recommendation: Vitest) with a first test file for the checker itself
- `.github/workflows/ci.yml`: lint, `check:content`, test, and build, on every push to `v2` and `main`

### Acceptance criteria

- [ ] `npm run check:content` prints every violation and exits 0
- [ ] `npm run check:content -- --strict` exits non-zero when any violation exists
- [ ] The checker has tests with one fixture per rule, and each fixture fails as expected
- [ ] CI runs on pushes to `v2`
- [ ] The report output is saved into `docs/v2/bug-inventory.md` as the baseline count

---

## Task V0.3: Placeholder resolution

**Status:** not started
**Phase:** V0

### What this task implements

One place resolves `{{sistema_url}}`. The fix covers every surface where an agent reads Sistema text, not just the copy buttons.

### Steps

1. Create a single resolver in `src/lib/` (for example `resolvePlaceholders(text, origin)`). Replace every component copy of the `replace()` call with it.
2. Resolve placeholders server-side in `/raw` and `/bundle` responses, using the request origin. An agent that fetches a raw page must never see `{{sistema_url}}`.
3. Change the `SITE_URL` fallback in `src/lib/site-url.ts` to `https://sistema.johnthedesigner.com` (confirmed by the owner).
4. Confirm the visible prompt text on play, campaign step, and tool pages shows resolved absolute URLs after mount.

### Acceptance criteria

- [ ] Exactly one implementation of placeholder resolution exists (`grep` shows no other `replace(/\{\{sistema_url` calls)
- [ ] `curl` of a `/raw` page and a `/bundle` page containing the placeholder returns absolute URLs
- [ ] The integrity check's placeholder count drops to zero for these surfaces
- [ ] Build passes

---

## Task V0.4: Play and campaign content fixes

**Status:** not started
**Phase:** V0

### What this task implements

Fixes every content instance from the bug inventory in `_meta/TASK_PLAYBOOKS.md` and `_meta/campaigns/*.md`. These files are edited in place here. V1 restructures them.

### Steps

1. **Bootstrap color step:** add the palette tool as a required step, with the correct request body shape (`{ "colors": { "name": "#hex" } }`). Add the sentence "Use the palette tool. Do not compute ramps yourself." Make the standalone Generate a Color Scheme play match.
2. **Step references:** replace every "Step N" cross-reference with the step's name. Fix the Step 9 substep labels.
3. **Literal dates:** replace each `[2026-05-13]` template entry with an instruction to write today's date.
4. **Touch targets:** replace each hardcoded 44 by 44 pixel requirement with wording that defers to the accessibility standard recorded in the living brief. This is an interim fix. See ROADMAP Section 6.
5. **Relative URLs:** make sure every agent-facing URL starts with `{{sistema_url}}`.
6. Log each change in `_meta/CHANGELOG.md`.

### Acceptance criteria

- [ ] The integrity check reports zero violations of these types in plays and campaigns
- [ ] Bootstrap's color step text names both the palette and contrast tools
- [ ] No "44" pixel requirement remains in any play or campaign
- [ ] Build passes

---

## Task V0.5: Metadata and site fixes

**Status:** not started
**Phase:** V0

### Steps

1. Replace the hardcoded `steps: 10` in `src/app/page.tsx` with a count derived from campaign data. Search for any other hardcoded counts.
2. Give every play and KB entry a human-written title and a real description. This covers "Llm Compatibility" and "Generate Spacing Tokens", plus any others the check finds.
3. Make `/guide` describe what plays actually read today. This is an interim fix. See ROADMAP Section 6.
4. Check every campaign's metadata (step counts, titles, descriptions) against `_meta/CAMPAIGNS.md`.

### Acceptance criteria

- [ ] No hardcoded campaign step counts remain in `src/`
- [ ] The integrity check reports zero metadata violations
- [ ] Home page hero and Frequently Used list show the same step count for Bootstrap
- [ ] Build passes

---

## Task V0.6: Make the check blocking

**Status:** not started
**Phase:** V0

### What this task implements

Wires `check:content --strict` into the build (a `prebuild` script, so Vercel runs it too) and into CI.

### Acceptance criteria

- [ ] `npm run build` fails when a placeholder or relative URL is added to a play (confirm with a throwaway test edit, then revert)
- [ ] `npm run build` passes on the clean tree
- [ ] Bug inventory updated with the final count: zero

---

## Task V0.7: Housekeeping and gate check

**Status:** not started
**Phase:** V0

### Steps

1. Write `docs/v2/retro-phase-0.md`.
2. Add new patterns to `AGENTS.md`: the shared resolver, the integrity check, and v2 task conventions.
3. Write `docs/v2/decision-brief-v1.md` for the "V1 start" decisions in ROADMAP Section 5. Give each one options, a recommendation, and downstream effects.
4. Write `tasks/v2/phase-1.md` from the ROADMAP V1 outline, adjusted for what V0 found.
5. Archive V0 session entries to `logs/v2-phase-0.md`.
6. Present the gate evidence to the owner. Do not merge to `main`.

### Acceptance criteria

- [ ] Gate criteria met: build passes with the strict check, and no placeholders or relative URLs appear in `/raw`, `/bundle`, play, or campaign output. Spot-check with `curl` against `next start` locally or against the `v2` Vercel preview
- [ ] Owner's go logged in `SESSION_LOG.md`
- [ ] `tasks/v2/phase-1.md` exists
