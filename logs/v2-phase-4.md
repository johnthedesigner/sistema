# v2 Phase 4 session log (archived)

Phase 4: MCP server. Retro: `docs/v2/retro-phase-4.md`. Client tests: `docs/v2/mcp-client-tests.md`.

### 2026-11-22 — Analytics delivery check (carried from Phase 3)

- Preview build has the PostHog key (set as a public Config variable). Browser events reach PostHog (200) under one `internal-` ID; no storage written. Server events triggered with `internal-d75e8b05-3e0e-4555-936a-e768b7e4b463`; the owner confirmed them in PostHog. Phase 3 gate approved.

### 2026-11-22 — V4.0 and V4.1: MCP server

- Packages checked: `mcp-handler` 2.4.0 with `@modelcontextprotocol/server` 2.x and zod 4 (D32); `specimen` joins the tool surface (D33).
- `/mcp` built: seven tools, a prompt per workflow, `mcp_call` events with the visit ID. Verified over raw JSON-RPC locally and on the preview.

### 2026-11-22 — V4.2: Connect page and prompt box switch

- `/connect` with setup per client; "Paste a prompt / Use the MCP server" switch above the use cases, with "Connect the MCP server" as a secondary button (owner's changes).
- The agent line at the top of every page replaced by a "For agents" corner button and a `rel="alternate"` link; "For agents" left the nav; the line under workflow prompts keeps only the keep-going advice (owner's calls, D37). Owner approved V4.2.

### 2026-11-22 — V4.3: Client tests

- Claude Code run 1 (local) found the copied prompt asking for an MCP prompt the model can't call, `sistema.json` in the wrong shape, and a hand-built review page. Fixed: channel-aware workflow text, `next_step` leads with the run loop, the copied prompt calls `next_step` (D34, D35).
- Claude Code run 2 (preview) reached the direction approval cleanly. The visit ID now reaches `sistema.json`; the direction play says to download the template unchanged.
- Codex's sign-in had expired; the owner signed back in. Codex 0.171 needed `default_tools_approval_mode = "approve"` in non-interactive mode, then reached the approval. Fixed from its run: `placeholder_fields` in the specimen response, close-ID suggestions on a failed `read`, the connect page's commands quoted for zsh, Codex added.
- Owner spotted Codex's review page had no page type picker: the template's sample data set one layout. Fixed in the template and the play.

### 2026-11-22 — V4.4: Agent Skills

- One skill per workflow at `/skills/<name>.zip` (D36), on the connect page and in the agents text. fflate 0.8.2 added. The link check now covers built downloads.
- `sistema-start` in Claude Code, with no MCP server, reached the direction approval: the cleanest run. Fixed from it: the tools section says to call tools with something that returns the response unchanged.

### 2026-11-23 — V4.5: Housekeeping and gate check

- Test added: each calculation tool returns exactly what its API returns. Tool list measured at about 1,240 tokens per turn.
- The MCP Inspector run against the preview was blocked by a permission check (downloading and running the package); left for the owner.
- Retro, AGENTS.md, decisions D34 to D37, `tasks/v2/phase-5.md`, and this archive written.
