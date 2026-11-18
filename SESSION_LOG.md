# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 2 (Tools and paste-in improvements). See `docs/v2/ROADMAP.md` and `tasks/v2/phase-2.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V2.2 — GET on every tool API
**Next task:** V2.3 — Palette documentation and tests
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
