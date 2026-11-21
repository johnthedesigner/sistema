# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 3 (Reference project, guides, and site). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-3.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V3.4 — Aesthetic baseline, emphasis, and the specimen tool (with V3.3: Relay through Patterns, components approved)
**Next task:** V3.5 — Guide rewrites (finding #27 moves there). The reference-run fix pass is done; only #27 and #60 (backlog) remain open. Relay is complete through Patterns: page examples and a Storybook reference (D31); examples/relay/ updated.
**Blockers:** none. Open item: PostHog key missing from the Vercel Preview environment (owner, later; needed before V3.7)
**Notes:** `v2` is pushed. Preview: https://sistema-git-v2-jtd-604ef502.vercel.app. CI is green. `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

### 2026-11-20 — V3.4 fix pass on the reference-run findings

**What was done:**
- Contrast tool: per-pair `purpose` (one check, or informational).
- Color: `surface-hover`, `surface-selected`, and button hovers required; `color.states.visible`; the color guide's "Pairs to check"; white in `palette.base`; the white ban scoped to the page; the dark table names roles; the token check page shows colors in use.
- Components play: `cn` import, non-interactive `shadcn add`, axe timing, documented exceptions, pair checks with states.
- Specimen tool: content checked against the layout, `content_fields`, `token_roles`, `neutral=tinted`, floating layers as round as featured, `c` kept in render URLs.
- Workflows: `project.revise` and the session route "Change an approved direction or foundation"; gates can be `withdrawn`; workflows stay open while optional plays are offered, and the offer asks the play's first question; resume detection fixed; per-item `/raw/opinions/<id>` and `/raw/rules/<id>`.
- Findings now open: #27 (V3.5) and #60 (backlog).

### 2026-11-20 — V3.4: Relay re-run approved; D27 to D30

**What was done:**
- Relay re-ran from Direction with the rewritten play and the specimen tool. The owner chose Quiet, violet 550, accent-tinted grays, 8px, scaled chips, shadow separation, and Atkinson Hyperlegible Next, then approved the direction, the foundations, and the components (all 2026-11-20). `examples/relay/` replaced with the finished run (Relay commit 4b08f01).
- D27: accent seeds come from the palette library's bright middle stops when there's no brand color. D28: no count on featured items per screen.
- D29: dark surfaces step one stop at a time (`color.dark.surface-steps`, color guide "Stops in a dark theme"); text and fills mirror (1000 − n). Comparison: `docs/v2/comparisons/dark-steps.html`.
- D30: one decision for both themes (`opinion.both-themes`), status color as detail (`opinion.status-as-detail`), selection a neutral step with an accent detail. Specimen selected row updated.
- Backlog: one-question-at-a-time style preview with copyable answers.
- Findings #55 to #82 in `docs/v2/reference-run.md`.

### 2026-11-20 — V3.4: content (craft baseline, taste questions, emphasis)

**What was done:**
- New opinion group `craft` with eleven opinions (hierarchy before lines, neutral ground and one accent, text tones, radius by size, elevation by role, one typeface, rhythm, quiet states, one icon set, short motion, contrast follows importance), and eleven advisory `quality.craft.*` review rules.
- Visual-language guide rewritten (D18 shape): craft and taste, what the product needs, the taste questions shown as rendered options, emphasis surfaces, ways to separate and lift, the emphasis map, traditions as vocabulary only, Relay as the worked example. Style preview format rewritten around the choices, the composition, and the emphasis map.
- Direction play rewritten: needs first, the agent proposes and the person picks per question, options rendered with the specimen tool on the product's content, emphasis map in DESIGN.md Overview.
- `color.roles.required` gains the emphasis surfaces; color, depth, and spacing guides gain sections on them; shape, color, spacing, DESIGN.md, and component scaffold plays apply the baseline. Quality guide gains the plain-looking traps. `opinion.look-is-yours` rewritten.
- V5 variety test added to the roadmap.
- **Next:** Relay re-run from Direction with the owner at the gates.

### 2026-11-20 — V3.4: palette rules adopted (D26)

**What was done:**
- `src/lib/palette.ts` now follows three fixed rules: an eased contrast curve, the same chroma by lightness for every hue (with a soft limit), and yellows turning warm as they darken. `library.json` was regenerated and the palette snapshot updated on purpose.
- The specimen's roles were remapped to the stops nearest their old contrast: tints and containers moved to 150, and darker roles moved one stop lighter. AA still holds across every combination.
- The palette-generation and ramp guides and AGENTS.md describe the new rules. The prototype and its comparison script were removed; the comparison page stays as the record.

### 2026-11-19 to 2026-11-20 — V3.3 stopped; V3.4 approved

**What happened:**
- Relay built 12 components and revised them for the owner's border and radius feedback (stage 8, findings #49 to #53).
- The owner judged the result sound but dated and noisy, and the review pages ugly (finding #54).
- Proposal `docs/v2/aesthetic-baseline.md`, approved with changes (D23 to D25): a craft baseline and visual taste questions; emphasis surfaces and separation treatments as part of every foundation; a specimen tool; Relay re-run from Direction.
- New task V3.4 inserted; the old V3.4 to V3.8 are now V3.5 to V3.9.
- BACKLOG: sources for contemporary visual craft, all to be taken in where they meet the criteria.


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

### 2026-11-18 — Task V3.2: Relay, Direction and Foundations

**What was done so far:**
- `examples/` is excluded from the site's tsconfig and ESLint, and from deploys through `.vercelignore`. Vitest and the content checker already only read `src/`, `tools/validate/`, `content/`, and `reference/`. `examples/README.md` added.
- The Relay run folder is `/Users/johnlivornese/Repos/relay`: a fresh Next.js 15.5 and Tailwind v4 app (create-next-app, `src/`, TypeScript, ESLint), outside this repo.
- The run started with a subagent (D17):
  - Its only input is the paste-in prompt against the preview, with visit ID `internal-1882ecfe-477f-46e6-92ce-5f1c6ec43eab`, plus the person's brief (product, users, density, stance, no brand, light-dark, web, WCAG 2.2 AA, Next.js, Tailwind v4, shadcn planned, no typeface preference).
  - It's told not to read Sistema's source. It stops for any question the brief doesn't cover, and at every approval.
  - It logs everything in the run folder's `RUN_LOG.md`.
- **The run:** five subagent sessions. It stopped at the direction approval, the optional voice step, the voice follow-up, the Foundations approval, and the end of the workflow. The owner approved both gates with no changes, and gave the voice "energetic, positive, and plainspoken; never childish or patronizing".
- **Findings:** 35, recorded in `docs/v2/reference-run.md`. Fixed between stages:
  - The `withVisitId` parenthesis bug, and placeholder spaces in the type scale docs.
  - Guide contradictions. The chroma budgets are restated in tool units and labeled as Sistema's guidance; their origin isn't in any reference, so they're flagged for the audit.
  - OKLCH in `library.json`. Framework template colors count as missing.
  - The new check `model.rules-mentioned`. Flexibility in the role list. Asking before optional plays.
  - Voice follow-up and the positioning check. The `in-progress`, gate `by`, and pointer placement definitions.
  - The primitive tier in `palette.json`, following opinion two-tiers.
  - Direction swatches built from data, and the radius hierarchy applied early.
  - The shadcn variable mapping in `components.scaffold-core`. Contrast scope covering every color used as text or indicator.
  - The end-of-workflow state and exact pointer wording. `token-check.html` regenerated by the compile. `@utility` for type roles that need a family or transform. DESIGN.md front matter and modes.

  Open: the guide conflicts (#11, #27), for V3.4.
- Relay is copied into `examples/relay/`. The run folder stays at `/Users/johnlivornese/Repos/relay` for V3.3.
- 165 tests. Build passes, 0 violations.
