# v2 Phase 4 Retro

**Dates:** 2026-11-22 to 2026-11-23. **Tasks:** V4.0 to V4.5.

## What shipped

- **The MCP server** at `/mcp` (D32, D33): seven tools (`search`, `read`, `next_step`, `palette`, `contrast`, `type_scale`, `specimen`) and a prompt per workflow, stateless on one Next.js route. The calculation tools call the same handlers as the APIs, and a test checks they return identical results. Calls are counted as `mcp_call` events under the visit ID in the server URL.
- **The connect page** (`/connect`) with setup for Claude Code, Codex, Cursor, VS Code, Windsurf, and clients that need `mcp-remote`, and the prompt box's "Paste a prompt / Use the MCP server" switch, above the use cases.
- **Agent Skills** (D36): one per workflow, downloaded from `/skills/<name>.zip`, built from the same content.
- **One text, three channels** (D35): workflow and play text renders for paste-in, MCP, or a skill from the same files.
- **Agent pointers out of the page** (D37): the agent line at the top of every page became a corner button and a `rel="alternate"` link.
- **Client tests** (`docs/v2/mcp-client-tests.md`): Claude Code and Codex through the MCP server, and Claude Code with only the skill, each to the direction approval. 15 findings: 10 fixed, 5 logged.

## What went well

- **Running real clients found what the protocol tests couldn't.** Every unit test passed while the copied prompt asked for something no client lets the model do, `sistema.json` came out the wrong shape, and Codex mixed two products in one render. Each became a fix in the server or the content, so all three channels got it.
- **One renderer, three channels.** The fixes to the run loop landed once and reached paste-in, MCP, and skills. The skill run, last, was the cleanest.
- **The owner's review caught what the tests and the agent missed:** the missing page type picker, and agent text at the top of every page compromising the layout.

## What to watch

- **The gate names three clients, and two were tested.** Claude Code and Codex reached the approval; Cursor isn't installed here, Claude.ai needs the owner to add the connector, and the MCP Inspector run needs the owner's approval to download it.
- **Template and tool text fed agents bad defaults.** The template's sample data limited the page types to one; a summarizing fetch tool was used for JSON. Sample data and examples are instructions, as far as an agent is concerned.
- **Client differences are real.** Codex in non-interactive mode blocks MCP calls until approved; Claude Code's fetch tool summarizes; zsh treats `?` in an unquoted URL as a wildcard. The connect page has to be tested by pasting its commands, not by reading them.
- **One dropped connection** during nine parallel specimen calls on the preview. Watch for it under the Phase 5 harness.
- **Skill runs carry no visit ID.** They show up only as tool calls.

## Numbers

| | Start of V4 | End of V4 |
|---|---|---|
| Tests | 194 | 209 |
| Decisions | D31 | D37 |
| Ways to run Sistema | Paste-in | Paste-in, MCP server, Agent Skills |
| MCP tool list | | 7 tools, about 1,240 tokens per turn |
| Client runs to the direction approval | | 4 (Claude Code twice, Codex, Claude Code with a skill) |
