# Harness plan (V5.0)

A design for testing how agents run Sistema, ready to build when it's worth the spend. Not built and not run (D38). It follows plan 13 and 13.1, and grows out of the manual client runs in V4.3 (`docs/v2/mcp-client-tests.md`).

## What it answers

1. **Does the workflow work?** Behavior tests: `workflow.start` from a fresh project, for a new product and for one with existing colors (the Adopt path), several times each.
2. **Which way of running Sistema works best, for what?** The comparison in plan 12.4: paste-in as it was (A, from the `v1-baseline` tag), paste-in now (B), the MCP server (C), and Agent Skills (D).
3. **Is a tool worth building?** Plan 10.5, for the token validator and dark mode mapping: the same tasks with and without the tool.
4. **Does the direction play produce distinct, intended results?** The variety test (D25): three briefs, judged by the owner.

## How a run works

The V4.3 runs are the template. One run is one agent, one fresh project copy, one case.

1. **Copy the case's project** into a new folder under `harness/runs/<batch>/<run>/` (gitignored), with `git init` and one commit, so the run's changes are a diff.
2. **Set up the channel:**
   - Paste-in: nothing to install. The prompt is the one the site copies.
   - MCP: a config pointing at the preview's `/mcp?c=test-<uuid>`. Claude Code: `--mcp-config <file> --strict-mcp-config`. Codex: `-c 'mcp_servers.sistema.url="…"'` and `-c 'mcp_servers.sistema.default_tools_approval_mode="approve"'` (it blocks MCP calls otherwise).
   - Skills: unzip the skill from the preview into `.claude/skills/`.
3. **Run the agent non-interactively:** `claude -p … --output-format stream-json --verbose --permission-mode acceptEdits --allowedTools …` or `codex exec --json --sandbox workspace-write -c sandbox_workspace_write.network_access=true`. The allowed tools are fixed per case and recorded.
4. **Answer as the person.** Each case has a script: the answers to the project questions, then the approvals ("approved as proposed", or a scripted change to test `project.revise`). The harness resumes the session with the next answer each time the agent stops (`--resume <session>`, `codex exec resume <thread>`). If the agent asks something the script doesn't cover, the run is marked "unscripted question" and stops; that's a finding, not a failure.
5. **Stop** at the case's end point (an approval, or the end of the workflow), at the turn limit, or at the cost cap, whichever comes first.

Runs against the Vercel preview, so every link the agent sees resolves. The local dev build points links at whatever `NEXT_PUBLIC_SITE_URL` says, which broke the first V4.3 run.

## Scoring

**Automatic checks**, from the files and the event stream:

| Check | How |
|---|---|
| Outputs exist | Each play's contract `produces` list, against the run's diff |
| State shape | `sistema.json` against `/raw/schema/sistema.json`; `steps`, `gates`, `routing`, `telemetry.id` (MCP) |
| Required tools called | Each play's contract `tools`, against the calls in the stream (MCP tool calls, or API URLs in shell and fetch calls) |
| Tool calls well formed | Calls that returned an error, and repeats of a rejected call |
| Values from tools | Contrast pairs in the tokens re-checked with the contrast tool; palette stops matched to the palette tool's output for the recorded seeds |
| Review page | The template's code unchanged outside the data block; every specimen render loads; `placeholder_fields` empty |
| Stopped at approvals | No token values written before `direction-approved` |
| Cost | Turns, input and output tokens, dollars, wall time |

**Owner checks**, on a review page the harness builds per batch: does the direction look intended, is it distinct from the other briefs (variety test), would an experienced designer pass it.

Pass rates, not single results: each case runs at least three times, and a check's result is its pass rate over the runs (plan 13.1).

## Cases

| Case | Project | Channel | End point |
|---|---|---|---|
| start-new | Tidy, no colors | B, C, D | `direction-approved`, then the full workflow |
| start-adopt | Tidy, colors in CSS (as in V4.3) | B, C, D | `foundations-approved` |
| baseline | Tidy | A (`v1-baseline`) | Its equivalent stage |
| variety | Three briefs: dense B2B tool, consumer app, content site | C | `direction-approved` |
| tool-validator, tool-dark-mapping | Fixed task sets (plan 10.5) | With and without the tool | Task done |

Thresholds for the tool candidates are written down before their runs.

## Traffic and secrets

- Every run uses a visit ID starting with `test-`, which dashboards already exclude (`isInternalId`, `docs/v2/analytics.md`).
- API runs read `ANTHROPIC_API_KEY` from the environment. It is never committed, logged, or printed. Subscription clients (Claude Code, Codex) use their own sign-in.

## Spending caps

- **Per run:** stop at a dollar cap (Claude Code reports `total_cost_usd`; API runs count tokens), and at a turn limit.
- **Per batch:** a total cap, checked before each run starts. The batch stops when the next run could exceed it.
- Caps are set by the owner when the harness is built.

## Cost estimate

From the V4.3 runs: one run to the direction approval cost about $1.05 (skill), $2.15 (MCP), and up to $2.50 (paste-in era). A full `workflow.start` run is unmeasured; expect several times that.

| Batch | Runs | Estimate |
|---|---|---|
| Direction only, B/C/D, 3 runs each | 9 | $10 to $25 |
| Full start, B/C/D, 3 runs each | 9 | $50 to $150 (unmeasured) |
| Variety, 3 briefs, 2 runs each | 6 | $6 to $15 |
| Baseline A, 3 runs | 3 | $5 to $10 |

## Building it

A `tools/harness/` package (its own `package.json`, like `tools/scrape/`): a case file format, the runner, the scorer, and the batch report. The scorer's checks are pure functions over a run folder and its event stream, with their own tests against recorded runs, which cost nothing to re-score. The V4.3 runs were in a temporary folder and weren't kept; the first harness runs become the recorded set.
