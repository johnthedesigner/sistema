# v2 Phase 5 Task File: Launch readiness, at no cost

**Phase goal:** Ready v2 for launch without tests that cost money to run (D38). The test harness is planned and ready to run, the site says no more than the evidence shows, and the deferred site and content work is done.
**Plan references:** plan 12.4, 10.5, 13 and 13.1, 15 Phase 5 (gate revised by D38); ROADMAP V5; D13 (test traffic kept out of analytics), D25 (variety test).
**Starting point (end of V4):**
- Three ways to run Sistema from the same content: paste-in (`/raw`), the MCP server (`/mcp`, seven tools), and Agent Skills (`/skills/<name>.zip`).
- Four tools (palette, contrast, type scale, specimen), each through GET, POST, and MCP.
- Client runs by hand: Claude Code and Codex to the direction approval, Claude Code with a skill, Claude.ai through a connector, Cursor with Grok 4.7 through the first play, and the MCP Inspector (`docs/v2/mcp-client-tests.md`). 210 tests, 0 violations.
- The `v1-baseline` tag marks `main` before v2.

**Not in this phase (D38):** behavior-test runs, the three-way comparison, and tool evaluations by agent runs. The variety test (D25) needs agent runs too; the owner may run it in their own client, but it isn't part of the gate. Cursor's run past the first play waits for the harness.

## Task V5.0: Harness plan, ready to run

**Status:** written (2026-11-23); waiting for the owner's approval.

A written design, `docs/v2/harness-plan.md`, built from the V4.3 manual runs: how it runs an agent on a fresh project copy (`claude -p`, `codex exec`, and the API), how it answers as the person, how it scores a run (automatic checks: files exist, state shape, required tools called, contrast passes; owner checks: does it look intended), spending caps per run and per batch, how its traffic is marked internal (D13), the cases (plan 12.4 setups A to C plus skills, plan 10.5 candidates, the D25 variety briefs), and a cost estimate per batch. Not built, not run.

- [ ] Owner approves the plan

## Task V5.1: Site claims check

**Status:** done (2026-11-23). The site makes no claims about pass rates or about one way of running Sistema being better. Three lines promised what the agent always does, which the client runs showed it doesn't: how-it-works' "Your agent shows its work" list (now "What the plays ask of your agent", with a note that the approvals are where you catch a miss), the home page's "Every future session finds the system and follows it", and the connect page's "any client that supports MCP". The home page's "Every new screen starts from solid ground" goes to the headline work in V5.4.

Read every page and agent-facing text for claims about results: pass rates, reliability, one way of running Sistema being better than another. Keep only what the tool tests and the client runs show, and say plainly what hasn't been measured.

- [x] No claim on the site goes past the evidence

## Task V5.2: Tool candidates

**Status:** not started

The token validator and dark mode mapping (plan 10.5) were to be decided by evaluation runs, which D38 sets aside. Recommendation: build neither before launch; revisit with the harness. Owner decides.

- [ ] Decision recorded

## Task V5.3: Platform scope

**Status:** not started

Decide the web-first statement (BACKLOG "Platform scope"), so the launch copy says who Sistema is for, and place it on the site.

- [ ] Owner approves the statement and where it appears

## Task V5.4: Deferred site work

**Status:** not started

From the BACKLOG: the home page headline, the content and layout passes, the roughly 250 raw pixel values in older pages (move to type and spacing roles), and the "worked example" framing. Show consequential visual changes in the browser before committing to them.

- [ ] Owner approves the headline and the passes; no raw pixel values left outside documented exceptions

## Task V5.5: Content upkeep

**Status:** not started

Review the guides the content check lists as due, and run the source-closeness check on the guides V3.5 didn't cover (backlog "Originality and attribution").

- [ ] No guides due for review; closeness findings fixed or recorded

## Task V5.6: Housekeeping and gate check

**Status:** not started

Retro, AGENTS.md updates, `tasks/v2/phase-6.md`, and the session log archive.

- [ ] Gate (revised by D38): the harness plan approved, site claims match the evidence, the deferred site work done; owner approves
