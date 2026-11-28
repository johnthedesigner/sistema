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

**Status:** done (2026-11-23). Approved by the owner (D39).

A written design, `docs/v2/harness-plan.md`, built from the V4.3 manual runs: how it runs an agent on a fresh project copy (`claude -p`, `codex exec`, and the API), how it answers as the person, how it scores a run (automatic checks: files exist, state shape, required tools called, contrast passes; owner checks: does it look intended), spending caps per run and per batch, how its traffic is marked internal (D13), the cases (plan 12.4 setups A to C plus skills, plan 10.5 candidates, the D25 variety briefs), and a cost estimate per batch. Not built, not run.

- [x] Owner approves the plan

## Task V5.1: Site claims check

**Status:** done (2026-11-23). The site makes no claims about pass rates or about one way of running Sistema being better. Three lines promised what the agent always does, which the client runs showed it doesn't: how-it-works' "Your agent shows its work" list (now "What the plays ask of your agent", with a note that the approvals are where you catch a miss), the home page's "Every future session finds the system and follows it", and the connect page's "any client that supports MCP". The home page's "Every new screen starts from solid ground" goes to the headline work in V5.4.

Read every page and agent-facing text for claims about results: pass rates, reliability, one way of running Sistema being better than another. Keep only what the tool tests and the client runs show, and say plainly what hasn't been measured.

- [x] No claim on the site goes past the evidence

## Task V5.2: Tool candidates

**Status:** built (2026-11-23); pages waiting for the owner's approval. Owner chose to build both (D40). APIs, MCP tools (nine now, about 1,650 tokens per turn), pages at `/tools/validate` and `/tools/dark-mode`, tests, and the color, add-mode, pipeline, and review plays. On the site's own tokens, the validator finds no blocking failures; dark mapping suggests the stops the site chose by hand.

The token validator and dark mode mapping (plan 10.5) were to be decided by evaluation runs, which D38 sets aside. Recommendation was to build neither; the owner chose both (D40). Each gets an API (GET and POST), an MCP tool, a page, tests, and a place in the plays that need it.

- [x] Decision recorded
- [ ] Both tools built, tested, and named in their plays; pages approved by the owner

## Task V5.3: Platform scope

**Status:** done (2026-11-23). D41: on how-it-works ("Who it's for") and in `project.assess`.

Decide the web-first statement (BACKLOG "Platform scope"), so the launch copy says who Sistema is for, and place it on the site.

- [x] Owner approves the statement and where it appears

## Task V5.4: Messaging fixes

**Status:** done (2026-11-28). "Drawn on your own product" reworded on the home page, `/start`, the direction play, the visual language guides, and `opinion.look-is-yours`; the direction play now tells the agent the specimen is a stand-in when the product has a UI. The validator and dark mode pages and tool docs say what they read. The connect page says skills are a snapshot.

From the critical review (section 4): "drawn on your own product" becomes what the specimen does; the validator and dark mode pages and API docs state what they assume; the connect page says skills are a snapshot.

- [x] No claim on the site or in plays goes past what the tool does

## Task V5.5: Audit workflow and the home page's choices

**Status:** built (2026-11-28); waiting for the owner's approval. `workflow.audit` (`project.assess`, the new `project.audit`, and an approval) continues to `workflow.start`. New session routes: document the system (the default), build a page or screen (new play `components.build-page`), and not sure yet. Home page: start, audit, update as cards, with update's routes as a radio group joined to it; the hero centered; the prompt box's spacing fixed. `/existing` is now `/audit` and `/work` is `/update`; Plays moved to the top navigation.

D42 and D43: a new `workflow.audit` (read and report, then offer to adopt or fix); the home page's choices become start, audit, update, with update's routes as a nested radio group (new routes: not sure yet, build a page or screen, document the system, which is the default). Draft the button copy for the owner.

- [ ] Audit workflow written and checked; home page choices approved by the owner

## Task V5.6: Site design

**Status:** done (2026-11-28). Approved by the owner. Home headline and lead, How Sistema works as a landing page, entry pages, Plays top-level, tools index, home cards, Reference on two patterns with nested contents rails, footer, eyebrows, approval cards. Drift audit (`docs/v2/audit-site-2026-11-28.md`): fixes, the pixel pass on non-tool pages, opacity on role colors repaired, new patterns recorded in DESIGN.md, and rule `quality.consistency.system-first`. Tool pages' raw values move to V5.7.

From the owner's notes (review section 7), with comparison pages for consequential choices: the prompt box's spacing; the home page (centered, refined cards with icons, the headline); Plays top-level with a workflows callout (D45); eyebrows in sentence case; play pages (no alternating backgrounds, balanced space); the footer (large interactive logo, colored background); How Sistema works as a landing page; Reference on two page patterns with alphabetical, grouped lists; the tools index cards; the remaining raw pixel values.

- [x] Each part approved by the owner in the browser, at desktop and phone width

## Task V5.7: Tool pages

**Status:** in progress.

D46 on all six tools: the shared layout, the standard picker with a line per standard, swatch-led color inputs, how Sistema uses each tool first, and limits stated.

- [ ] All six pages on the principles; approved by the owner

## Task V5.8: Tool capabilities

**Status:** not started

D44: shape detection, object colors, and missing stops in the validator and dark mode; the specimen's phone layout; previews in the person's own app in the direction and existing-colors plays; palette anchoring; translucent colors in contrast. Each with tests and its page and docs updated.

- [ ] Each capability built, tested, and documented

## Task V5.9: Content upkeep

**Status:** not started

Review the guides the content check lists as due, and run the source-closeness check on the guides V3.5 didn't cover (backlog "Originality and attribution").

- [ ] No guides due for review; closeness findings fixed or recorded

## Task V5.10: Housekeeping and gate check

**Status:** not started

Retro, AGENTS.md updates, `tasks/v2/phase-6.md`, and the session log archive.

- [ ] Gate (revised by D38): the harness plan approved, site claims match the evidence, the review's launch work (V5.4 to V5.8) done; owner approves
