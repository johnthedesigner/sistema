# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 2 (Tools and paste-in improvements). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-2.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V2.7 — Usage analytics outline (approved)
**Next task:** V2.8 — Usage analytics build
**Blockers:** none
**Notes:** `v2` is pushed. Preview: https://sistema-git-v2-jtd-604ef502.vercel.app. CI is green. `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

*v1 Phase 0–7 entries: `logs/phase-0.md` to `logs/phase-7.md`. Phase 8: `logs/phase-8.md`. v2 Phase 0: `logs/v2-phase-0.md`. v2 Phase 1: `logs/v2-phase-1.md`.*

### 2026-11-17 — Task V1.18: Housekeeping and gate check

**What was done:**
- `docs/v2/retro-phase-1.md`.
- AGENTS.md rewritten for v2: the content model, rules for content and the app, the source intake process for `reference/` and `content/sources.yaml`, and the patterns that still apply. Removed the v1 patterns for playbooks, campaigns, stages, the living brief, bundles, and exemplars.
- `tasks/v2/phase-2.md` (V2.0 to V2.7), starting with an outline of the tool APIs for owner review.
- Phase 1 entries archived to `logs/v2-phase-1.md`.
- Corrected the V1.16 source count in `tasks/v2/phase-1.md` (22, not 23).
- Updated the agent's memory: the source intake note now describes the v2 layout. The notes on `/guide` maintenance and campaign sync are marked obsolete, since the permission check blocked deleting them.
- Gate evidence: all 23 plays and 3 workflows render as a web page and as `/raw` plain text, and each workflow also has a `/full` starter. No `/raw` output has an unresolved placeholder. 0 content violations with every rule blocking. CI passes on v2.
- **The owner approved the Phase 1 gate** (2026-11-17).

### 2026-11-17 — Task V2.0: Tool API outline

**What was done:**
- Logged the owner's approval of the Phase 1 gate.
- `docs/v2/tool-apis.md`:
  - GET for every tool, with POST for batches, and the same response either way.
  - Colors in hex, `rgb()`, or `oklch()`. Errors carry a working example URL. An index at `/api`.
  - Contrast checks come from the rules registry for the requested standard and level, replacing the hardcoded WCAG 2.x thresholds.
  - Palette takes named seeds as query parameters and adds OKLCH to each stop.
  - A new type scale API with a choice of naming convention and optional role placement. Guide ranges come back as notes.
- Owner decisions (in `docs/v2/decisions.md`):
  - D11: contrast defaults to WCAG 2.2 AA when no standard is given, and says so.
  - D12: the type scale defaults to a major third with two steps down; sizes under 12px get advisory notes.
  - D13: usage analytics, attributable to one person through an anonymous ID, from first visit through prompts, agent fetches, tools, and MCP.
- Plan changes for D13:
  - Phase 2 gains V2.7 (analytics outline, including the consent decision) and V2.8 (build). Housekeeping becomes V2.9, and the gate adds analytics.
  - Every tool accepts an optional anonymous ID `c`.
  - ROADMAP: V3 instruments the new pages and adds a privacy note, V4's MCP route records the same events, and V5's harness traffic is marked internal. The consent decision is in the schedule.
- The V2.7 outline doesn't depend on V2.1 to V2.6. It can be brought forward if the owner wants to settle consent sooner.
- Owner, 2026-11-18: no tracking across visits. Nothing is stored on the visitor's device, so no consent banner is planned (added to D13, V2.7, V2.8, and the ROADMAP decision schedule).

### 2026-11-18 — Task V2.1: Shared color parsing

**What was done:**
- `src/lib/color.ts` `parseColor` accepts:
  - hex (3 or 6 digits, with or without `#`)
  - `rgb()` in modern, legacy, and percentage syntax (`rgba` only when fully opaque)
  - `oklch()`

  It returns uppercase hex, `oklch(L C H)`, and a `mapped` flag when out-of-gamut OKLCH was mapped into sRGB. It rejects named colors, `hsl()`, transparency, and malformed input with a message that names the accepted formats.
- Contrast and palette use it. The palette now has route tests: hex, `rgb()`, and bare hex give identical stops; OKLCH seeds work, including out of gamut; and invalid seeds get a message naming the formats. Tool docs in plays mention the new formats.
- The response reshaping in the outline (registry-based checks, OKLCH echo, `results` for single pairs) is left for V2.2, so the APIs are rebuilt once alongside GET.
- 118 tests pass. Build passes, 0 violations.

### 2026-11-18 — Task V2.2: GET on every tool API

**What was done:**
- **Contrast:**
  - GET with repeated `fg`, `bg`, and `label`, paired by position (up to 50). POST takes `pairs` (up to 200) or a single pair.
  - The response is always `{standard, level, defaulted?, results}`. Each result has the colors as hex and OKLCH, the ratio, and `checks` for text, large text, and UI, each naming its rule and required value.
  - Required values come from the rules registry (`src/lib/tools/contrast.ts`, reading `content/rules/color.yaml`, which `next.config.ts` bundles with the route). The standard can be given separately or combined, as `sistema.json` stores it (`wcag-2.2 AA`). Without one, it defaults to WCAG 2.2 AA and says so (D11).
  - A level the standard doesn't define falls back to the nearest lower level. A check the standard doesn't set (UI contrast under Section 508) is left out.
  - **Bug fixed:** passing is now judged on the unrounded ratio. Before, 4.495 would have rounded to 4.5 and passed.
- **Palette:** GET treats each query parameter as a named seed (up to 12). Names may use letters, digits, `-`, and `_`. `c`, `standard`, `level`, and `format` are reserved. Each stop gains `oklch`, and `seed_mapped` flags an out-of-gamut seed.
- **Every tool:** CORS open, a working example URL in every error, and the optional `c` ID accepted and ignored. Shared handling is in `src/lib/tools/http.ts`.
- Tool docs (plays, `/raw/agents`, `/reference/tools`) show the GET form first and tell agents to pass the project's standard. The contrast and palette pages and one guide line now show GET.
- Removed the `/systems` to `/kb` redirect from `next.config.ts` (`/kb` was removed in V1.16).
- 126 tests. Build passes, 0 violations. Checked on `next start` with real GET, error, and OPTIONS requests.
- Not yet changed: the contrast page still computes in the browser with fixed WCAG values. V2.5 brings tool page defaults in line with the registry.

### 2026-11-18 — Task V2.3: Palette documentation and tests

**What was done:**
- `src/lib/palette.test.ts`:
  - The committed `public/palettes/library.json` matches the algorithm for all 22 seeds.
  - Every stop is in sRGB, and stops get darker in order.
  - Each stop is within 5% of its contrast target against white (`1.01 × (19/1.01)^(i/18)`).
  - A snapshot of two fixed seeds fails on any unintended algorithm change.
- **Duplicate removed:** `tools/generate-palette-library.ts` had its own copy of the algorithm (a workaround for an old culori import issue). It now imports `generatePalette` from `src/lib/palette.ts`. Regenerating gave a byte-identical `library.json`, so the copies had not drifted. AGENTS.md is updated.
- **Input documented** where agents look: error messages and the tool docs in plays and `/raw/agents` (V2.2), and now the palette page, which links to Tool APIs.
- **Plays checked:** the three plays that use the palette (`color.scheme`, `color.map-existing`, `visual-language.direction`) have it in their contract, so their generated tool block shows the GET form. `color.add-theme` reuses existing ramps and needs only contrast.
- 130 tests (11 files). Build passes, 0 violations.

### 2026-11-18 — Task V2.4: Type scale API and page defaults

**What was done:**
- `src/lib/type-scale.ts` `computeTypeScale`: one calculation, safe to run in the browser, used by the API and the page.
  - Defaults (D12): base 16, major third, two steps down, six up, numbered names.
  - Names can be `numeric`, `tailwind`, or `steps`. Roles are placed on steps only where the caller names them, and several roles may share a step.
  - Line heights follow the guide's per-size bands. Body text (the `body` step, or the base step) gets the body range at any size.
  - Advisory notes cover sizes under 12px and ratios above 1.333 with many steps.
- `GET`/`POST /api/type-scale` (`src/app/api/type-scale/route.ts`). Checks: `typography.line-height.by-role` always, and `typography.line-height.body` when the standard sets a minimum (WCAG AAA). Standards come from the shared `src/lib/tools/standards.ts`; contrast now uses it too. `next.config.ts` bundles the typography rules with the route.
- **Type scale page:** uses the same calculation and defaults. The 9px caption is gone (smallest step is now 10px, with a note). The made-up role suggestions are replaced by notes, and a step-name picker and the API URL are added. On phones, notes sit under their row. The em dashes in the page intro and the tool page titles are removed.
- **`typography.scale` play:** calls the tool (a new step 4) and doesn't calculate sizes itself. Every check the tool reports must pass. The tool docs show the GET form with naming, roles, and standard.
- Workflow starters now name their tools in one paragraph instead of repeating each tool's full usage, which each play carries. Adding the type scale docs had put the Start starter at its 140-line limit. Also fixed "contrast, and palette" for two items.
- One build failed with a stale `.next` after an interrupted build. A clean rebuild passed.
- 136 tests (12 files). Build passes, 0 violations. Screenshots at 1280px and 390px, with no horizontal scroll.

### 2026-11-18 — Task V2.5: Consistency tests

**What was done:**
- `src/lib/tools/consistency.test.ts` (plan 13, layer 2):
  - Contrast matches published values (21:1, 1:1, 4.54:1 for `#767676` on white). It also matches an independent implementation of the WCAG formula for 300 random pairs, and is symmetric.
  - Every check a tool reports names a rule that exists. The tools read the same rule values the content model loads, and the contrast page's table matches what the API requires.
  - The default type scale meets every body line-height minimum in the registry. Body text meets the strictest minimum at 6 base sizes × 3 ratios. Every default line height is unitless and in a sane range.
  - Contrast's default standard (D11) is defined for all three checks.
- Already covered by the content checker, so not duplicated: rule references (`model.rule-refs`) and tools named in play text (`model.tools-named`).
- **Contrast page:**
  - No more fixed WCAG 2.x values. The page's server side builds a table from the registry (`contrastTable`), and the component has Standard and Level pickers.
  - A level is offered only where the registry defines it (Section 508 and EN 301 549 offer AA only). A check the standard doesn't set says so.
  - Each check shows its rule, and the copied API URL includes the chosen standard.
  - Browser-safe helpers are in `src/lib/tools/levels.ts`.
- **Fixes found in screenshots:**
  - Color inputs were pushed right on phones.
  - The rating badge stretched full width on phones.
  - Em dashes in the sample text and in the tools index title, description, and intro (which also said only two tools had APIs).
  - The contrast intro repeated "the same".
- 146 tests (13 files). Build passes, 0 violations. Screenshots at 1280px (WCAG 2.2 and Section 508) and 390px, with no horizontal scroll.

### 2026-11-18 — Task V2.6: Tool index and shorter prompts

**What was done:**
- `GET /api`: a JSON index of the three tools. Each entry has what the tool does, its GET form, a working example, its POST form and body, limits, and docs, all as absolute URLs. Limits now live in one place (`src/lib/tools/limits.ts`, plus the type scale's own), which the routes and the index both read. `llms.txt` and `/raw/agents` link to the index, and `/raw/agents` now documents all three tools. A test calls every example URL in the index and expects 200.
- **Shorter prompts:**
  - A rule that a tool in the play's contract checks (`checked_by: [tool.<name>]`) no longer lists its values for every standard. The play says the tool checks it for the project's standard and to use its result. Plays without the tool still list the values.
  - `typography.line-height.body` is now also checked by `tool.type_scale`.
  - The gain in length is small (`color.map-existing` went from 1,618 to 1,595 words). The real gain is that an agent can't apply another standard's value by mistake.
  - The rest of each play is procedure. Fit review 2 already found that plays don't restate guides, so nothing else was trimmed.
- `/api/context` stays until V2.8 replaces it.
- **Known local issue:** twice, a build failed with `PageNotFoundError` for a page that exists, after earlier builds in the same `.next` folder. `rm -rf .next` fixes it. Vercel always builds fresh.
- 149 tests (14 files). Build passes, 0 violations.

### 2026-11-18 — Task V2.7: Usage analytics outline

**What was done:**
- Checked PostHog's docs:
  - `persistence: 'memory'` stores nothing on the device.
  - `person_profiles: 'never'` builds no person profiles.
  - `ip: false` is deprecated and does nothing. IP discarding is a project setting.
  - Cookieless mode needs a project setting and links visits on PostHog's servers.
  - Server capture: `POST https://us.i.posthog.com/i/v0/e/` with `$process_person_profile: false`.
- `docs/v2/analytics.md`:
  - The ID lives in memory for one visit. It's carried in copied prompts as `c`, injected into `/raw` output by middleware plus a dynamic handler, and stored in `sistema.json` `telemetry.id`. Tool URLs and MCP carry it too.
  - Events: `$pageview`, `prompt_copied`, `prompt_selected`, `tool_page_used`, `agent_fetch`, `tool_call`, `api_index`, and `mcp_*`. Funnel and dashboards are defined. Test traffic is excluded through `env: preview` and the `test-` and `internal-` ID prefixes.
- Owner approved, with changes: keep all location data, no opt-out of any kind, and tool inputs (colors, roles) may be recorded. D13 and the V2.8 task are updated.
