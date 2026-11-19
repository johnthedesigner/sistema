# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 3 (Reference project, guides, and site). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-3.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V3.1 — `tokens.add-mode`
**Next task:** V3.2 — Reference project (Relay), Direction and Foundations
**Blockers:** none. Open item: PostHog key missing from the Vercel Preview environment (owner, later; needed before V3.6)
**Notes:** `v2` is pushed. Preview: https://sistema-git-v2-jtd-604ef502.vercel.app. CI is green. `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

*v1 Phase 0–7 entries: `logs/phase-0.md` to `logs/phase-7.md`. Phase 8: `logs/phase-8.md`. v2 Phase 0: `logs/v2-phase-0.md`. v2 Phase 1: `logs/v2-phase-1.md`. v2 Phase 2: `logs/v2-phase-2.md`.*

### 2026-11-18 — Task V2.9: Housekeeping and gate check

**What was done:**
- `docs/v2/retro-phase-2.md`.
- AGENTS.md: tool API patterns and usage analytics (including the bundling trap and the PostHog bot filter).
- `tasks/v2/phase-3.md` (V3.0 to V3.8). It opens with a decision brief (reference project product and location, components guide scope, guide template), then `tokens.add-mode`.
- Phase 2 entries archived to `logs/v2-phase-2.md`.
- **Gate evidence** (plan 15, Phase 2):
  - All tool tests pass (162 tests, 17 files).
  - Tool defaults pass the registry (`consistency.test.ts`).
  - Every play contract's required tools appear in its text (`model.tools-named`: 0).
  - Every tool works through GET (contrast, palette, type scale, and `/api`, checked on the preview).
  - Analytics links one ID from site to agent to tools with nothing stored on the device (Playwright and local capture checks).
  - **Open:** delivery to PostHog is unconfirmed, because the Vercel Preview environment has no PostHog key. The owner will fix it later, and it's carried into V3.
- **The owner approved the Phase 2 gate** (2026-11-18), with the PostHog delivery check carried into Phase 3.

### 2026-11-18 — Task V3.0: Decisions for V3

**What was done:**
- `docs/v2/decision-brief-v3.md`, restated in more detail at the owner's request.
- Owner decisions (D14 to D19 in `docs/v2/decisions.md`):
  - Relay, a B2B dispatch dashboard, in `examples/relay/`, on the default stack (Next.js, Tailwind v4, shadcn/ui).
  - Run by a Claude subagent, with the owner approving at gates (D17, option B). Safeguards: only the paste-in prompt, a directory outside the repo, no reading the Sistema source, and every question and workaround logged.
  - The adjusted guide template, with "options and how to choose" in place of a procedure.
  - Components guide scope A.

### 2026-11-18 — Task V3.1: `tokens.add-mode`

**What was done:**
- `docs/v2/add-mode-outline.md` approved, with the owner's questions answered (D20 to D22). Precedent for keeping theme separate from the other kinds of mode was checked in the reference notes: Radix `appearance` and `scaling`, Ant's combinable dark and compact algorithms, and Atlassian's `colorMode`.
- **Tokens guide:** new section "Modes: theme, density, and motion": three independent kinds, one kind per token, override-only files, selectors, and density by remap or by scaling. New credits: Atlassian get-started, Radix spacing, Tailwind theme. A Tailwind `motion-reduce:` claim was dropped because the reference notes don't cover it.
- **New play `tokens.add-mode`:** theme, compact density, and reduced motion, each with its checks. It creates the minimal motion tokens when a project has none. Comparison page and `project.modes`.
- **Rules:** `tokens.modes.overrides-only`, `tokens.modes.one-kind`, `tokens.modes.no-component-changes`.
- **Retired:** `color.add-theme`. The session route is now "Add a mode".
- **Schema:** `project.modes` (density and motion).
- **`tokens.pipeline`:** compiles every mode file to its selector, fails on unknown names or overlapping kinds, and the check page gets a switch per kind of mode.
- **Workflow ending (D22):** "Land it" first, then `continue` moves to the session workflow, then follow-ups as two short bullets for any time, without asking to start one.
  - The first edit duplicated a function, because a marker string appeared earlier in the file. The file was restored and the edit redone.
  - The tests caught a list-joining bug for a single route.
  - `project.orient` routes to the Patterns workflow when the goal is first components and Patterns hasn't run.
- `capability-model.md` updated. 163 tests. Build passes, 0 violations.

### 2026-11-18 — Task V3.2: Relay, Direction and Foundations (in progress)

**What was done so far:**
- `examples/` is excluded from the site's tsconfig and ESLint, and from deploys through `.vercelignore`. Vitest and the content checker already only read `src/`, `tools/validate/`, `content/`, and `reference/`. `examples/README.md` added.
- The Relay run folder is `/Users/johnlivornese/Repos/relay`: a fresh Next.js 15.5 and Tailwind v4 app (create-next-app, `src/`, TypeScript, ESLint), outside this repo.
- The run started with a subagent (D17):
  - Its only input is the paste-in prompt against the preview, with visit ID `internal-1882ecfe-477f-46e6-92ce-5f1c6ec43eab`, plus the person's brief (product, users, density, stance, no brand, light-dark, web, WCAG 2.2 AA, Next.js, Tailwind v4, shadcn planned, no typeface preference).
  - It's told not to read Sistema's source. It stops for any question the brief doesn't cover, and at every approval.
  - It logs everything in the run folder's `RUN_LOG.md`.
