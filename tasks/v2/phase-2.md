# v2 Phase 2 Task File: Tools and paste-in improvements

**Phase goal:** every tool an agent needs works through a plain GET, accepts the color formats Sistema promotes, and has tests with known answers. The tools' default output passes the rules registry, and agents can find every tool from one index. Usage can be followed from a first visit to an agent's later use of plays and tools, through one anonymous ID (decision D13).
**Plan references:** plan Sections 10 (tools) and 13 (testing, layers 2 and 3), plan 15 Phase 2; ROADMAP V2; capability-model Section 6 (the tool surface the MCP server will expose in V4).
**Starting point (end of V1):**
- Contrast (`POST /api/contrast`) accepts single pairs and batches of pairs, hex only. It has route tests.
- Palette (`POST /api/palette`) takes `{ colors: { name: "#hex" } }`. It has no route tests. GET returns 405.
- Type scale exists only as a page (`/tools/type-scale`). Its defaults predate the registry.
- Tool request shapes are documented in `/raw/agents` and `/reference/tools`. There's no machine-readable index under `/api`.
- `model.tools-named` already checks that every play names the tools in its contract.
- 108 tests, 0 content violations, CI green.

**Carried from V1 (not tasks here, but don't lose them):**
- The headline is still open (narrative draft); it's settled in V3 with the home page.
- 13 guides are flagged by `review.last-reviewed`; V3's guide rewrites cover the main ones.
- The source-closeness audit (BACKLOG, "Originality and attribution") must run before VF. Schedule it when V3's guide rewrites are planned, since they overlap.
- Typography naming is now a project decision (fit review 2). The type scale API must not assume one set of role names.

---

## Task V2.0: Tool API outline

**Status:** done (2026-11-17). Approved with decisions D11 (contrast defaults to WCAG 2.2 AA, stated in the response) and D12 (advisory notes for small type sizes, no minimum rule). `docs/v2/tool-apis.md`.

Before building, outline the public shape of every tool API in one document (`docs/v2/tool-apis.md`). These shapes become the MCP tools in V4, so changing them later is expensive. For each tool, cover:
- the GET form and the POST form
- accepted color formats and units
- the response shape
- error messages
- batch limits

For the type scale, propose how naming conventions are handled (roles, steps, or magnitude sizes; see the typography guide's "Naming type") and which registry rules it applies. Owner review.

- [x] Owner approves the API outline

## Task V2.1: Shared color parsing

**Status:** done (2026-11-18)

One parser used by every tool. It accepts hex, `rgb()`, and `oklch()`, and returns a clear error naming the accepted formats. Use culori, which the palette code already uses. Contrast and palette both switch to it. Tests cover each format, edge cases (3-digit hex, percentages, out-of-gamut OKLCH mapped to sRGB), and invalid input.

- [x] Contrast and palette accept hex, `rgb()`, and `oklch()`; tests pass

## Task V2.2: GET on every tool API

**Status:** done (2026-11-18)

Add GET with query parameters to contrast and palette, as approved in V2.0 (for example `/api/contrast?fg=...&bg=...`). Keep POST for batches. Route tests call each GET the way an agent with a GET-only fetch tool would. Update the tool documentation renderer (`renderTools`), `/reference/tools`, and `/raw/agents`.

- [x] Every tool answers a GET; documentation shows the GET form first (type scale gets its API in V2.4)

## Task V2.3: Palette documentation and tests

**Status:** done (2026-11-18)

- Document the palette input where agents look: the error messages, `/raw/agents`, and the tool page.
- Confirm every play that calls the palette tool uses the documented shape.
- Add tool tests: fixed seeds produce stable stops (a snapshot that fails on unintended change), every stop is in sRGB, and the stops' contrast against white follows the documented curve.

- [x] Palette route and algorithm tests pass; play prompts match the documented shape

## Task V2.4: Type scale API and page defaults

**Status:** done (2026-11-18)

Build the type scale API to the V2.0 outline. It applies the registry rules that can be checked by calculation: line height per role, unitless, and roles that differ by more than size where roles are named. It flags guide ranges as advice, not failures. Fix the page so its defaults come from the same code and pass the registry; today it suggests a 9px caption and a display line height below 1. The type scale play then calls the API.

- [x] API and page share one implementation; defaults pass the registry; `typography.scale` names the tool and its contract includes it

## Task V2.5: Consistency tests

**Status:** not started

Plan 13, layer 2: every tool's default output passes the registry rules it's subject to, in tests that run on every build. Contrast results must match published WCAG examples. The contrast page (`ContrastChecker.tsx`) still calculates in the browser with fixed WCAG 2.x values. Have it use the same registry-based checks as the API, with a standard picker. Review what the content checker already covers (rule references, tools named in plays) and add only what's missing.

- [ ] Tool defaults are tested against the registry on every build

## Task V2.6: Tool index and shorter prompts

**Status:** not started

- Publish a machine-readable index of the tool APIs at `GET /api`: each tool, its GET and POST forms, and a link to its documentation. Link it from `llms.txt` and `/raw/agents`.
- Review play bodies for prompt length. Where a play explains something a guide section covers, cite the section instead. Fit review 2 found little of this, so expect small edits.
- Decide whether to keep `/api/context`, a v1 analytics endpoint for prompt runs: keep and document it, or remove it.

- [ ] `GET /api` lists every tool; plays cite sections rather than explaining them; `/api/context` decided

## Task V2.7: Usage analytics outline

**Status:** not started

Owner request, decision D13: detailed usage data, attributable to one person through an anonymous ID, from first visit through later use of the site, prompts, tools, and (in V4) the MCP server. Today:
- PostHog runs in the browser with its own anonymous ID.
- Copying a prompt adds a per-copy `sid`, which isn't linked to that ID, and a "Sistema context" line.
- `/raw` pages are static, so agent fetches aren't recorded.
- The tool APIs record nothing.

Write `docs/v2/analytics.md` for owner review. It covers:

- **The funnel and the events.** For example: landing, pages viewed, workflow or play or route chosen in the prompt box, prompt copied, first agent fetch with that ID (activation), each play fetched (progress), approvals recorded, workflow finished, a return session through `continue`, tool calls (tool, batch size, error or success), and later, MCP connect and tool use. List each event's name and properties.
- **How the ID travels.**
  1. The browser's PostHog ID becomes the person's ID for that visit only (see the constraint below).
  2. Copied prompts carry it in the starter URL.
  3. The starter and every `/raw` page fetched with it emit Sistema URLs that carry it.
  4. `project.assess` records it in `sistema.json` (a new optional field), so resumed sessions and later workflows keep it.
  5. Tool calls pass it as `c`.

  Compare the ways to make static `/raw` output carry the ID: render on request with caching, rewrite at the edge, or ask the agent to append it. Recommend one.
- **Server-side capture** for `/raw`, `/api`, and later the MCP route, probably in Next.js middleware with a non-blocking send to PostHog. Record the agent family from the user agent, never the IP address.
- **Privacy and opt-out:** anonymous IDs only, no personal data, IP addresses not kept, and a plain-language note on the site. Projects opt out with a `sistema.json` setting, and the browser honors Global Privacy Control.
  **Constraint (owner, 2026-11-18): no tracking across visits.** Nothing is stored on the visitor's device, so there are no cookies, localStorage, or other browser storage, and no persistent fingerprint. A site visit is never linked to earlier or later visits. Check PostHog's cookieless or memory-only settings and confirm nothing is written to the device. The aim is to avoid the EU consent banner obligation, so no banner is planned.
- **Removing what's there:** the per-copy `sid`, the "Sistema context" line, and `/api/context`, which the new design replaces.
- **Excluding test traffic** from the owner, slice runs, and the V5 harness (an internal flag or ID list).
- **Dashboards:** the funnel and retention views to set up in PostHog.

- [ ] Owner approves the analytics outline

## Task V2.8: Usage analytics build (site, prompts, tools)

**Status:** not started

Build to the V2.7 outline: one ID across browser and server, the ID carried by copied prompts, `/raw` output, and `sistema.json`, server-side events for `/raw` and `/api`, the opt-out, the privacy note, and test-traffic exclusion. Tests: the ID survives from a copied prompt through a `/raw` fetch to a tool call, opted-out requests send nothing, no event contains an IP address or personal data, and the site writes nothing to browser storage. Check events arriving in PostHog from a real run against the preview.

- [ ] A single anonymous ID links a site visit, a copied prompt, agent fetches, and tool calls in PostHog; opt-out works; tests pass

## Task V2.9: Housekeeping and gate check

**Status:** not started

Retro (`docs/v2/retro-phase-2.md`), AGENTS.md updates, `tasks/v2/phase-3.md` (which starts with `tokens.add-mode`), and archive the session log to `logs/v2-phase-2.md`.

- [ ] Gate (plan 15, Phase 2): all tool tests pass; all tool defaults pass the registry; every play contract's required tools appear in its text; every tool works through GET. Usage analytics links one anonymous ID from site to agent to tools, with opt-out. Owner approves.
