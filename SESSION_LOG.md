# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 0 (Audit and fixes). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-0.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V0.6 — Code-level checks blocking
**Next task:** V0.7 — Housekeeping and gate check
**Blockers:** none. The audit and capability model were approved 2026-11-14.
**Notes:** `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

*v1 Phase 0–7 session entries archived to `logs/phase-0.md` through `logs/phase-7.md`. Phase 8 entries are in `logs/phase-8.md`. v1 Phase 9 was never started and was closed out in V0.0.*

### 2026-11-14 — Task V0.6: Code-level checks blocking

**What was done:**
- Added `prebuild` (`check:content --strict`) and `postbuild` (`check:content --output-only --strict`). Every `npm run build`, including Vercel's, now fails on a code-level violation.
- Verified both directions with throwaway edits (then reverted). A bare `/raw/` URL added to a play fails at prebuild. A literal `{{sistema_url}}` in page code fails at postbuild. A clean tree builds with 0 code-level violations.
- Strict mode lists code-level violations and only counts content-level ones, which keeps build logs readable. CI now relies on the build hooks and prints the content report separately.
- Content baseline for V1: 62 (6 dates, 24 step numbers, 1 description, 21 titles, 10 thresholds).

### 2026-11-14 — Task V0.4: Broken guide stub

**What was done:**
- Added `kb/principles/color/primitive-ramp-scalability.md` (stub). `/raw` and `/bundle` now serve it with the placeholder resolved, and the V0.3 route tests pass.
- Made the bare `/api/contrast` in `_meta/campaigns/bootstrap.md:328` absolute.
- Withdrew bug #29. The Primer citation was valid (a `.json` stub), so the `ref.sources` rule was fixed to accept `.json`, with a test added.
- Updated `_meta/INDEX.md` and `_meta/CHANGELOG.md`. Code-level source violations are at 0, and 29 of 29 tests pass.

### 2026-11-14 — Task V0.3: Placeholder resolution

**What was done:**
- `src/lib/site-url.ts`: `resolveSiteUrl(env)` (explicit `NEXT_PUBLIC_SITE_URL`, then the Vercel preview branch URL, then `https://sistema.johnthedesigner.com`). `next.config.ts` inlines the result as `NEXT_PUBLIC_SITE_URL`, so server and client agree.
- `src/lib/placeholders.ts`: `resolveSistemaUrl` is now the only implementation. It also holds the shared `extractVariables` and `formatVariableLabel` helpers (previously 4 copies).
- Resolution happens in the server loaders (`playbooks.ts`, `campaigns.ts`, `exemplars.ts`, `kb.ts` `resolveStub` and `readRawContent`), so pages, `/raw`, and `/bundle` all get resolved text.
- Removed client-side resolution and `origin` state from `PromptBox`, `CampaignPromptBox`, `CampaignStep`, `CampaignExport`, `PlayDetail`, `PlayForm`, `CopyButton`, and `DesignMdPanel`. Tool pages and the contrast tool's Copy button now show absolute API URLs (fixes #31 and a new #33).
- Tests: `src/lib/placeholders.test.ts` (8) and `src/app/raw/raw-and-bundle.test.ts`, which runs the real `/raw` and `/bundle` handlers and replaces the `raw.placeholder` checker rule. The route test fails until V0.4 adds the missing stub, as intended.
- Built output (with `.env.local` moved aside to match production): `output.placeholder` went from 35 to 0, and `output.relative-url` from 16 to 2 (both from `bootstrap.md:328`, fixed in V0.4).

### 2026-11-14 — Task V0.2: Check infrastructure

**What was done:**
- `tools/validate/content/` holds the integrity checker. It has 12 source rules and 2 output rules (code or content level), is report-only by default, and supports `--strict` (code), `--strict-all`, `--output`/`--output-only`, and `--json`. It has 19 Vitest tests, with passing and failing cases for each rule.
- Added `vitest` and `tsx` as root dev dependencies, plus `npm test` and `npm run check:content`. The checker uses only root dependencies, so it runs on Vercel.
- Moved lint from `next lint` to the ESLint CLI (`eslint.config.mjs`, flat config extending `next/core-web-vitals`). Same result as before: 0 errors, 2 warnings.
- Set `outputFileTracingRoot` in `next.config.ts`. The workspace-root warning is gone, and `next start` now serves routes correctly.
- Allowed `content_type: synthesis` in `lint-frontmatter.ts`, and marked it as superseded by V1 schemas.
- Added `.github/workflows/ci.yml` (lint, test, source check, build, output check; report-only). Not yet run, because `v2` hasn't been pushed.
- Baseline: 119 violations (57 code, 62 content), recorded in `bug-inventory.md`. Found 4 new issues (#29 to #32), including `.env.local` baking an ngrok URL into local builds.

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
