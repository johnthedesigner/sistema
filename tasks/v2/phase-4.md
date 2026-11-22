# v2 Phase 4 Task File: MCP server

**Phase goal:** Sistema reachable as an MCP server, with the same content and tools as the paste-in prompts, a connect page, and the same anonymous usage events.
**Plan references:** plan 7.3 and 15 Phase 4; capability-model section 6 (the fixed tool surface); `docs/v2/analytics.md` (D13); ROADMAP V4.
**Starting point (end of V3):**
- Content, `/raw`, and four tool APIs (palette, contrast, type scale, specimen), all GET and POST.
- The site restructured on Sistema's own tokens, with the prompt box and the visual direction page template.
- 194 tests, 0 violations.

**Carried from V3:**
- **Analytics delivery** (checked 2026-11-22): the Preview build now has the PostHog key. A real-browser run on the preview sent `$pageview`, `prompt_copied`, and navigation events under one `internal-` visit ID, and PostHog answered 200; nothing was written to storage. Server-side events were triggered with ID `internal-d75e8b05-3e0e-4555-936a-e768b7e4b463` (`/raw` with the ID carried into every link, `/llms.txt`, contrast, palette). The owner confirmed the server events in PostHog (2026-11-22). Done.
- **Platform scope** (BACKLOG): decide the web-first statement before the connect page and launch copy describe who Sistema is for.
- **Deferred site tweaks:** headline, content and layout passes, about 250 raw pixel values in older pages, and the "worked example" framing (BACKLOG).
- **Guides due for review** (the content check lists nine), and the source-closeness audit for the guides V3.5 didn't cover.

## Task V4.0: Versions and API check

**Status:** done (2026-11-22). D32 and D33.

Verify the current packages and their APIs before writing code. Checked 2026-11-22:

| Package | Latest | Note |
|---|---|---|
| `mcp-handler` | 2.4.0 | Peers on `@modelcontextprotocol/server` ^2.0.0, `next` >=13, `@vercel/otel` ^2, `@opentelemetry/api` ^1.9 |
| `@modelcontextprotocol/server` | 2.4.0 | The server package `mcp-handler` 2.x uses, split from the SDK; the plan names `@modelcontextprotocol/sdk` |
| `@modelcontextprotocol/sdk` | 1.32.2 | The 1.x SDK the plan assumed |
| `zod` | 4.6.7 | Already in the project |

Read each package's current docs and a minimal working example, and record which to use and why in `docs/v2/decisions.md`.

- [x] Versions and APIs confirmed; the decision recorded

## Task V4.1: The MCP route

**Status:** done (2026-11-22).

Build the route with the fixed tool surface (capability-model section 6): `search`, `read`, `next_step`, `palette`, `contrast`, `type_scale`, and `specimen` (D33), plus one MCP prompt per workflow. Tools call the same modules the APIs use. Record `tool_call` and fetch events through the visit ID in the server URL (D13).

- [x] Every tool works through an MCP client and matches its API's output; tests cover each

## Task V4.2: Connect page and the prompt box toggle

**Status:** done (2026-11-22). Owner approved the connect page, the prompt box switch, and the For agents corner button.

A connect page with setup for each client, and the "Prompt or MCP server" toggle above the prompt box (site-structure.md section 2). Show the page to the owner in the browser.

- [x] Owner approves the connect page; it passes the checks at desktop and phone width

## Task V4.3: Client tests

**Status:** in progress.

Run `workflow.start` through the MCP server in at least two clients, to the direction approval, and record what differs from the paste-in run.

- [ ] Two clients reach the direction approval; findings fixed or logged

## Task V4.4: Agent Skills (small follow-on)

**Status:** not started

Generate Agent Skills from the same content files, as the content model already supports.

- [ ] Skills generated and checked in one client

## Task V4.5: Housekeeping and gate check

**Status:** not started

Retro, AGENTS.md updates, `tasks/v2/phase-5.md`, and the session log archive.

- [ ] Gate (plan 15, Phase 4): owner approves
