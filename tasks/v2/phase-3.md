# v2 Phase 3 Task File: Reference project, guides, and site

**Phase goal:** a reference project built with Sistema through Direction, Foundations, and Patterns. The first four guides rewritten in the new structure, with worked examples from that project. The site restructured into the approved IA. And Sistema applied to the site's own design system.
**Plan references:** plan 9.1 (guide structure), 9.4 (reference project), 9.5 (the site as a test case), 7.1 and 7.2, plan 15 Phase 3; `docs/v2/site-structure.md`, `docs/v2/narrative-draft.md`, `docs/v2/migration-dry-run.md`; ROADMAP V3.
**Starting point (end of V2):**
- Three tool APIs with GET, tested against the registry, and indexed at `/api`.
- The type scale tool supports naming conventions.
- Usage analytics is built, but delivery to PostHog is unconfirmed (see "Carried").
- 162 tests, 0 violations.

**Carried from V2:**
- **Analytics delivery.** Add the PostHog variables to Vercel's Preview environment, redeploy, rerun the tagged check, and confirm the events in PostHog. Do this before V3.6, which instruments the new pages.
- **Source-closeness audit** (BACKLOG, "Originality and attribution"). Run it as part of the guide rewrites (V3.4), which touch the same text. It must be done before VF either way.
- **13 guides due for review.** V3.4 covers four. Schedule the rest as reviews after V3.4.
- **The headline is still open.** Settle it with the home page (V3.6).
- **Conflicts to settle** when Sistema is applied to its own site (V3.7): canvas color, dark mode access, the small-text link role, and reduced motion (`docs/v2/migration-dry-run.md`).

**Order:**
1. V3.0 settles the open decisions.
2. V3.1 is `tokens.add-mode` (owner decision).
3. V3.2 and V3.3 build the reference project.
4. V3.4 rewrites the guides from it.
5. V3.5 writes the components guide.
6. V3.6 restructures the site.
7. V3.7 applies Sistema to the site.
8. V3.8 closes the phase.

---

## Task V3.0: Decisions for V3

**Status:** done (2026-11-18). D14 to D19 in `docs/v2/decisions.md`: Relay (a B2B dispatch dashboard) in `examples/relay/`, on Next.js, Tailwind v4, and shadcn/ui, run by a Claude subagent with the owner approving at gates. The adjusted guide template. Components guide scope A.

A short decision brief (`docs/v2/decision-brief-v3.md`), with options and a recommendation for each:
- **The reference project:** what product (plan recommendation: a fictional B2B dashboard) and where it lives (recommendation: a folder in this repo).
- **The components guide:** its scope.
- **The guide template:** plan 9.1's structure of principle, rules, procedure, worked example, failure modes, and verification, checked against the current guides.

Owner review.

- [x] Owner decides the reference project's product and location, and approves the guide template

## Task V3.1: `tokens.add-mode`

**Status:** done (2026-11-18). D20 to D22.

Generalize `color.add-theme` into a play that adds a mode to an existing token system: color themes, density (compact and comfortable spacing and type), and reduced motion. Outline the contract and procedure first, including how modes compile (CSS custom properties per mode selector) and how the token check page shows them. Owner review, then build. Add rules where a mode needs a checkable requirement. Retire or keep `color.add-theme` as a route into the new play, and update the session routes.

- [x] Owner approves the outline; the play, rules, and route are in the model and pass the checks

## Task V3.2: Reference project, Direction and Foundations

**Status:** not started

Run `workflow.start` on Relay (D14) from the paste-in starter, against the Vercel preview. The run uses a Claude subagent (D17): it starts with only the paste-in prompt, works in a directory outside this repo, and is told not to read the Sistema source. Its visit ID starts with `internal-`. At each gate, the review page goes to the owner, who approves or asks for changes. First set up `examples/` so it's excluded from the site's tsconfig, ESLint, Vitest, file tracing, and content checker (D15). Record every place a play was unclear, wrong, or skipped in `docs/v2/reference-run.md`, and fix the plays. Both approval gates use the owner's approval. Commit the project's `sistema.json`, DESIGN.md, DECISIONS.md, tokens, and review pages.

- [ ] The project reaches Foundations approved, every check passes, and the run findings are fixed or logged

## Task V3.3: Reference project, Patterns

**Status:** not started

Run `workflow.patterns` on the reference project: the core components, page examples, and the docs site if chosen. Apply the component lessons in BACKLOG ("Component lessons from the slice runs") as rules or play steps where they apply. Record findings as in V3.2.

- [ ] The project reaches Patterns approved, every check passes, and findings are fixed or logged

## Task V3.4: Guide rewrites (color, tokens, typography, quality signals)

**Status:** not started

Outline each guide in the plan 9.1 structure first, for owner review. Then draft, with worked examples taken from the reference project. Run the source-closeness audit on these four as part of the rewrite: mark close references where they appear, and rewrite or credit the two passages found in fit review 2. Add live specimens to the human pages: real ramps, rendered type scales, and radius and elevation side by side.

- [ ] Owner approves the four outlines, then the four drafts; the audit findings for these guides are resolved

## Task V3.5: Components guide

**Status:** not started

Write the components guide the capability model calls for before Patterns is considered complete. Use the scope from V3.0, examples from V3.3, and the component lessons from the slice runs. Outline first, owner review.

- [ ] Owner approves the outline and draft; component plays cite its sections

## Task V3.6: Site restructure

**Status:** not started

Build the approved IA (`docs/v2/site-structure.md`):
- the navigation
- the prompt box with suggestions and the dimmed routes row
- the entry pages `/start`, `/existing`, and `/work`
- the play, workflow, and guide page templates
- `/reference/files/*` for each file format
- the narrative home page, with the headline settled

Instrument the new pages with the V2 analytics events (`prompt_selected`). Show the main pages to the owner at each step, as visual milestones.

- [ ] Owner approves the site structure in the browser; every page passes the checks at desktop and phone width

## Task V3.7: Sistema on its own site

**Status:** not started

Run Sistema on the site: `project.migrate-brief` on the root `LIVING_BRIEF.md` (dry run in V1.15), with the owner settling the four conflicts, then the plays that move the site's tokens into the method's layout (DTCG under `tokens/src/`, spacing tokens, generated DESIGN.md front matter). Record the run as material for explaining the method.

- [ ] The site has a valid `sistema.json`, DECISIONS.md, and DESIGN.md with eight sections; its tokens pass the checks

## Task V3.8: Housekeeping and gate check

**Status:** not started

Retro (`docs/v2/retro-phase-3.md`), AGENTS.md updates, `tasks/v2/phase-4.md` (the MCP server: verify `mcp-handler`, SDK, and Zod versions first), and archive the session log to `logs/v2-phase-3.md`.

- [ ] Gate (plan 15, Phase 3): the owner approves the guides and the site structure, and the reference project passes all checks at each milestone. Owner approves.
