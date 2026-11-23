# v2 Phase 5 Task File: Test harness and evaluations

**Phase goal:** Measure how well Sistema works, with evidence instead of single runs: behavior tests for the core workflow, the comparison between ways of running it, tool evaluations, and the variety test. Then make the site's claims match the results.
**Plan references:** plan 12.4, 10.5, 13 and 13.1, 15 Phase 5; ROADMAP V5; D13 (test traffic kept out of analytics), D25 (variety test).
**Starting point (end of V4):**
- Three ways to run Sistema from the same content: paste-in (`/raw`), the MCP server (`/mcp`, seven tools), and Agent Skills (`/skills/<name>.zip`).
- Four tools (palette, contrast, type scale, specimen), each through GET, POST, and MCP.
- Client runs to the direction approval in Claude Code and Codex, by hand (`docs/v2/mcp-client-tests.md`). 209 tests, 0 violations.
- The `v1-baseline` tag marks `main` before v2.

**Carried from V4:**
- **Phase 4 gate, clients:** the plan names Claude Code, Cursor, and Claude.ai, plus the MCP Inspector. See the gate record in `SESSION_LOG.md` for what the owner decided.
- **Logged findings** (`docs/v2/mcp-client-tests.md`): a dropped connection during nine parallel specimen calls; the outline not always shown after the first play; skill runs carry no visit ID.
- **Platform scope** (BACKLOG): the web-first statement, and whether a mobile brief joins the variety test.
- **Deferred site tweaks:** headline, content and layout passes, about 250 raw pixel values, the "worked example" framing (BACKLOG).
- **Guides due for review** (the content check lists nine), and the closeness audit for the guides V3.5 didn't cover.

## Task V5.0: Harness design and budget

**Status:** not started

Outline the harness before building it (plan 13.1): how it runs an agent against a fresh project copy, how it scores a run, how it keeps a spending cap per run and per batch, and how its traffic is marked internal (D13). The V4.3 manual runs are the starting design: `claude -p` and `codex exec` on a fresh copy, answers given as the person, outputs checked afterwards. Record which scoring is automatic (files exist, state shape, required tools called, contrast passes) and which needs the owner (does it look intended).

Needs from the owner: the API key (stored as `ANTHROPIC_API_KEY`, never committed or printed), and the budget.

- [ ] Owner approves the harness outline and budget

## Task V5.1: Build the harness

**Status:** not started

Build it to the approved outline, with its own tests. Every run records cost, turns, tool calls, and the outputs, and stops at the budget.

- [ ] A run of `workflow.start` to the direction approval is scored automatically, within budget

## Task V5.2: Behavior tests

**Status:** not started

`workflow.start` from beginning to end, for a new project and for one with existing colors (the Adopt path), with per-play tests second. Several runs per case; pass rates, not single verdicts.

- [ ] Pass rates recorded for both paths

## Task V5.3: Comparison of ways to run Sistema

**Status:** not started

Plan 12.4: paste-in as it was (setup A, from `v1-baseline`), paste-in now (B), and MCP (C), with skills as a fourth if the budget allows. Measure required tool calls, malformed calls, output correctness, tokens per completed task, completion, variation between runs, and manual steps.

- [ ] Results recorded, with what to tell people about each way

## Task V5.4: Tool evaluations

**Status:** not started

Plan 10.5, for the token validator and dark mode mapping. Set each threshold **before** the runs, run with and without the tool, and build only if the gap clears it. Keep the evaluation cases as tests.

- [ ] Each candidate decided from its evidence

## Task V5.5: Variety test

**Status:** not started

D25: three short briefs (a dense B2B tool, a consumer app, a content site) through `visual-language.direction`. The owner judges whether the results are distinct, each looks intended, and each would pass an experienced designer's review.

- [ ] Owner's judgment recorded

## Task V5.6: Site claims

**Status:** not started

Make what the site says about each way of running Sistema match the results.

- [ ] Claims checked against the results

## Task V5.7: Housekeeping and gate check

**Status:** not started

Retro, AGENTS.md updates, `tasks/v2/phase-6.md`, and the session log archive.

- [ ] Gate (plan 15, Phase 5): pass rates recorded, tool decisions made from the evidence, site claims match; owner approves
