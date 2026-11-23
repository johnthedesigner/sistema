# MCP client tests (V4.3)

`workflow.start` run through the MCP server to the direction approval, compared with the paste-in run. Test project: Tidy, a made-up household chore tracker (Vite, React, TypeScript, colors typed into the CSS), copied fresh for each run. The tester answered as the person.

## Runs

| Client | Server | Result |
|---|---|---|
| Claude Code 2.1.156, run 1 | local build | Reached the approval, with the wrong state shape and a hand-built review page (findings 1 to 3) |
| Claude Code 2.1.156, run 2 | preview, after the fixes | Reached the approval. State in the right shape, the review page working, every rendering loading |
| Codex CLI 0.171, after the fixes | preview | Reached the approval. State in the right shape with the visit ID, the template downloaded and only its data replaced, the outline shown. One problem with the renders (finding 8) |

Claude Code run 2: 46 turns over two sessions, about $2.15. 19 specimen renders, palette, contrast, and two guide sections through `read`.

Codex: two sessions, 2.6 million input tokens (most cached). About 35 specimen renders, many of them repeats, and nine guide sections through `read`.

## Findings

1. **The copied MCP prompt asked for the server's `start` prompt, which the model can't call.** In Claude Code, MCP prompts are commands the person types (`/mcp__sistema__start`). The agent found `next_step` on its own, but skipped the workflow's opening text. *Fixed:* the copied prompt says "call next_step for the "start" workflow", and the connect page says the same.
2. **Without the opening text, `sistema.json` had the wrong shape** (no `sistema` or `workflow`, a page URL in `continue`), and the outline was never shown. `next_step` returned only the play. *Fixed:* a first call (no record of the workflow in the state) leads with the opening text, and every play ends with the reminder to record the state in the workflow's shape and call `next_step` again.
3. **The opening text said "fetch the play's instructions from its URL"** and offered the full version for agents that can't fetch. *Fixed:* through the server, workflow text names `next_step` and `read`, plays name the server's tools, and the URL-only lines are left out.
4. **The review page template was hard to save.** WebFetch returns a summary, so the agent rebuilt the page from pieces of `curl` output (run 2) or wrote its own (run 1, where the site URL didn't resolve). *Fixed:* `visual-language.direction` says to download the file unchanged, with a `curl -o` example.
5. **The visit ID never reached `sistema.json`.** It's in the server URL, which the agent doesn't see. *Fixed:* `next_step` asks the agent to record it when the URL has one and the state doesn't.
6. **One "transport dropped" error** during a burst of nine parallel specimen calls on the preview. The agent retried and it succeeded. *Logged:* watch for it in Phase 5; if it recurs, check the function's concurrency and duration on Vercel.
7. **The outline wasn't shown after the first play,** only a progress line at the approval. *Logged:* same as the paste-in runs; it may need a stronger line in `project.assess`.

8. **Codex filled only some content fields, so its renders mixed Tidy's chores with the placeholder product's shipments.** Nothing told it which fields were left. *Fixed:* the specimen response lists `placeholder_fields` and adds a note naming them; the direction play says to fill every field until the list is empty.
9. **Codex guessed guide IDs** (`guide.visual-language#emphasis` for `guide.visual-language.overview`). It recovered through search. *Fixed:* a failed `read` suggests the IDs that start with what was asked for.
10. **Codex in non-interactive mode blocks every MCP call** until the server's tools are approved (`default_tools_approval_mode = "approve"` for the server). Interactive Codex asks the person. *Logged:* client behavior; nothing to change in Sistema.
11. **The connect page's Claude Code command failed in zsh,** because the unquoted `?` in the server URL is a wildcard there. *Fixed:* the URL is quoted, and Codex's command is added.
12. **Codex repeated a rejected font three times** (Nunito Sans, not in the list). The error lists the fonts it accepts. *Logged.*

## Compared with the paste-in run

- Same plays, same tool results, same approval. The agent called the tools directly instead of building URLs, with fewer formatting errors (one invalid font name, rejected with the allowed list).
- Permission prompts differ by client: MCP calls are approved once per server, where `curl` calls to the APIs need shell approval.
- The person can't see the server's tool output the way they can see fetched URLs; the review page is still where they look.
