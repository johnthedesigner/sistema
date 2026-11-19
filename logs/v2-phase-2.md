# v2 Phase 2 session log (archived)

Archived in V2.9, 2026-11-18. Retro: `docs/v2/retro-phase-2.md`. Entries are oldest first.

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

### 2026-11-18 — Task V2.8: Usage analytics build

**What was done:**
- **Browser** (`src/lib/analytics/browser.ts`, `PostHogProvider`):
  - One visit ID in memory (`internal-` prefix with `?internal`). PostHog is started once, before child effects, with memory persistence, no person profiles, bootstrapped to the visit ID, and autocapture, replay, surveys, and flags off.
  - `$pageview` on each navigation. `prompt_copied`, with `c` added to the prompt's Sistema URLs. `tool_page_used` (debounced, skipping the first render) on the contrast and type scale pages. The palette page sends `c` with its API call.
- **Server:**
  - `src/middleware.ts` sends `agent_fetch` for `/raw` and `/llms.txt`, and rewrites `/raw/...?c=<id>` to `src/app/raw-with-id/[...path]`. That route reuses each `/raw` handler and adds `c` to every Sistema URL (`withVisitId`, which also covers template URLs like `/raw/plays/<id>`).
  - The tool routes send `tool_call` with inputs and status through `after()`. `/api` sends `api_index`.
  - Events (`src/lib/analytics/server.ts`) have no IP and no profile, use Vercel header location with `$geoip_disable`, include the agent family and user agent, and are tagged with `env` and `internal`. Nothing is sent from local development unless asked.
- **Content model:** `sistema.json` gains `telemetry: { id }`. The starters say what `c` is and to keep it on `continue`. `project.assess` records it. `/raw/agents` explains it.
- **Removed:** `instrumentRawUrls`, the per-copy `sid`, the "Sistema context" line, and `/api/context`.
- **Site:** `/privacy` page, a footer link, and a sitemap entry.
- **Tests (162):** URL injection and edge cases, agent families, path kinds, server payloads (no IP, Vercel location, internal flag), the `/raw-with-id` handler for every path kind, the middleware rewrite rules, and the `telemetry` schema.
- **Checked end to end:**
  - Playwright with requests to PostHog intercepted and decoded: no cookies or storage, one distinct ID across client navigation, the expected events, and no `$ip`.
  - Server events to a local capture endpoint: correct events and properties, and the IP from a forged `x-forwarded-for` absent from every payload.
  - Found: PostHog drops events from automated browsers, which is why the first runs saw none.
- **Owner actions:**
  - In PostHog, set IP data capture to discard (Settings > Project > General), and keep location lookup on.
  - Confirm events from the preview run arrive.
  - Build the dashboards in `docs/v2/analytics.md` section 8.
- **Preview check found a bug:** `/raw/...?c=` returned "Not found" on Vercel, because the `/raw-with-id` function had no content files (it worked locally). Fixed with `outputFileTracingIncludes` `'/raw-with-id/**': ['./content/**/*']`. The key must be a glob: `[...path]` matched nothing. Noted in AGENTS.md.
- **Preview run after the fix**, ID `test-3a943c8d-d4b8-431c-8a8d-bdf1c0a13ab1`: the starter, two plays, a guide, contrast, palette, type scale, and `/api` all returned 200. The starter's play links, its `continue` URL, and a play's tool URLs all carried the ID. The owner checks these events in PostHog: filter `c` = that ID, expecting `env: preview` and `internal: true`.
- **No events arrived in PostHog from the preview run.** The preview's browser bundles contain no PostHog key, so the Preview environment in Vercel most likely lacks `NEXT_PUBLIC_POSTHOG_KEY` (and the host). Without the key, `capture()` does nothing by design. The owner will fix this later: tick Preview for those variables in Vercel, then redeploy and rerun the tagged check. Open item for the V2.9 gate.

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
