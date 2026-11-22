# v2 Phase 3 Task File: Reference project, guides, and site

**Phase goal:** a reference project built with Sistema through Direction, Foundations, and Patterns. The first four guides rewritten in the new structure, with worked examples from that project. The site restructured into the approved IA. And Sistema applied to the site's own design system.
**Plan references:** plan 9.1 (guide structure), 9.4 (reference project), 9.5 (the site as a test case), 7.1 and 7.2, plan 15 Phase 3; `docs/v2/site-structure.md`, `docs/v2/narrative-draft.md`, `docs/v2/migration-dry-run.md`; ROADMAP V3.
**Starting point (end of V2):**
- Three tool APIs with GET, tested against the registry, and indexed at `/api`.
- The type scale tool supports naming conventions.
- Usage analytics is built, but delivery to PostHog is unconfirmed (see "Carried").
- 162 tests, 0 violations.

**Carried from V2:**
- **Analytics delivery.** Add the PostHog variables to Vercel's Preview environment, redeploy, rerun the tagged check, and confirm the events in PostHog. Do this before V3.7, which instruments the new pages.
- **Source-closeness audit** (BACKLOG, "Originality and attribution"). Run it as part of the guide rewrites (V3.5), which touch the same text. It must be done before VF either way.
- **13 guides due for review.** V3.5 covers four. Schedule the rest as reviews after V3.5.
- **The headline is still open.** Settle it with the home page (V3.7).
- **Conflicts to settle** when Sistema is applied to its own site (V3.8): canvas color, dark mode access, the small-text link role, and reduced motion (`docs/v2/migration-dry-run.md`).

**Order:**
1. V3.0 settles the open decisions.
2. V3.1 is `tokens.add-mode` (owner decision).
3. V3.2 and V3.3 build the reference project.
4. V3.4 sets the aesthetic baseline (owner decision D23 to D25) and re-runs the reference project from Direction.
5. V3.5 rewrites the guides from it.
6. V3.6 writes the components guide.
7. V3.7 restructures the site.
8. V3.8 applies Sistema to the site.
9. V3.9 closes the phase.

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

**Status:** done (2026-11-18). Both approvals given with no changes. 35 findings in `docs/v2/reference-run.md`, all fixed or logged.

Run `workflow.start` on Relay (D14) from the paste-in starter, against the Vercel preview. The run uses a Claude subagent (D17): it starts with only the paste-in prompt, works in a directory outside this repo, and is told not to read the Sistema source. Its visit ID starts with `internal-`. At each gate, the review page goes to the owner, who approves or asks for changes. First set up `examples/` so it's excluded from the site's tsconfig, ESLint, Vitest, file tracing, and content checker (D15). Record every place a play was unclear, wrong, or skipped in `docs/v2/reference-run.md`, and fix the plays. Both approval gates use the owner's approval. Commit the project's `sistema.json`, DESIGN.md, DECISIONS.md, tokens, and review pages.

- [x] The project reaches Foundations approved, every check passes, and the run findings are fixed or logged

## Task V3.3: Reference project, Patterns

**Status:** done (2026-11-20). Stopped at the components review on 2026-11-19; resumed inside V3.4 and finished with the owner's components approval. Page examples and the system reference were offered and not run.

Run `workflow.patterns` on the reference project: the core components, page examples, and the docs site if chosen. Apply the component lessons in BACKLOG ("Component lessons from the slice runs") as rules or play steps where they apply. Record findings as in V3.2.

- [x] The project reaches Patterns approved, every check passes, and findings are fixed or logged

## Task V3.4: Aesthetic baseline, emphasis, and the specimen tool

**Status:** done (2026-11-20). D23 to D30; `docs/v2/aesthetic-baseline.md`

The Relay run came out technically sound but dated and noisy, because the visual-language guide turned "utilitarian" into a style and the direction play answered taste questions in framework vocabulary. Steps:
1. **Done. Source intake:** every candidate in BACKLOG "Sources for contemporary visual craft" that meets the intake criteria, through the standard process, cited in the content it supports.
2. **Done (approved by the owner). The specimen tool:** a fourth tool that renders components and a small composition (page, zones, featured item, color block) from a few parameters. Show the owner its default rendering and variations as a visual milestone; that also tests the baseline.
3. **Done (2026-11-20), with the palette rules (D26). Content:**
   - the `craft` opinion group and its advisory review rules;
   - the new traps (outlined everything, sharp means serious, gray means professional);
   - the emphasis surfaces and separation treatments in the color roles and the depth, spacing, and color guides;
   - the visual-language guide rewritten in the D18 template;
   - the direction play rewritten around the visual taste questions and the emphasis map;
   - the shape, depth, and color plays checked against the baseline;
   - `opinion.look-is-yours` rewritten.
4. **Done (2026-11-20). Re-run Relay from Direction** through Foundations and the components, with the owner at the gates, recording findings as in V3.2. This also exercises revising an approved foundation (finding #49). Then copy Relay into `examples/relay/`.
5. **Add a variety test to V5:** three different briefs through Direction, judged by the owner for distinctness. **Done:** added to the V5 section of `docs/v2/ROADMAP.md`.

- [x] Owner approves the specimen tool's rendering, then Relay's re-run direction, foundations, and components; every check passes

## Task V3.5: Guide rewrites (color, tokens, typography, quality signals)

**Status:** done (2026-11-21). Outlines and drafts approved by the owner; content principles adopted (`docs/v2/content-principles.md`).

Outline each guide in the plan 9.1 structure first, for owner review. Then draft, with worked examples taken from the reference project. Run the source-closeness audit on these four as part of the rewrite: mark close references where they appear, and rewrite or credit the two passages found in fit review 2. Add live specimens to the human pages: real ramps, rendered type scales, and radius and elevation side by side.

- [x] Owner approves the four outlines, then the four drafts; the audit findings for these guides are resolved

## Task V3.6: Components guide

**Status:** done (2026-11-21). Outline and draft approved by the owner; sources brought in (WAI-ARIA APG, Base UI, Radix Primitives, React Aria); component plays cite the guide.

Write the components guide the capability model calls for before Patterns is considered complete. Use the scope from V3.0, examples from V3.3, and the component lessons from the slice runs. Outline first, owner review.

- [x] Owner approves the outline and draft; component plays cite its sections

## Task V3.7: Site restructure

**Status:** done (2026-11-22). Built in the swapped order the owner chose: Sistema's own direction and foundations first (approved 2026-11-21), then the navigation, prompt box, footer theme switch (stored), home page, entry pages (/start, /existing, /work), every page on the role tokens, play, workflow, guide, and file format pages, and the shared visual direction page template. Content, layout, and headline tweaks are deferred to later passes, at the owner's request.

Build the approved IA (`docs/v2/site-structure.md`):
- the navigation
- the prompt box with suggestions and the dimmed routes row
- the entry pages `/start`, `/existing`, and `/work`
- the play, workflow, and guide page templates
- `/reference/files/*` for each file format
- the narrative home page, with the headline settled

Instrument the new pages with the V2 analytics events (`prompt_selected`). Also redesign the review pages plays produce (style preview, token check, comparison pages), per BACKLOG "Review pages": quieter and easier to read, Sistema's frame around the project's own tokens, from a shared template. Show the main pages to the owner at each step, as visual milestones.

- [x] Owner approves the site structure in the browser; every page passes the checks at desktop and phone width

## Task V3.8: Sistema on its own site

**Status:** done (2026-11-22). Run recorded in `docs/v2/site-run.md`. Open: about 250 raw pixel values in older pages, for the deferred layout pass.

Run Sistema on the site: `project.migrate-brief` on the root `LIVING_BRIEF.md` (dry run in V1.15), with the owner settling the four conflicts, then the plays that move the site's tokens into the method's layout (DTCG under `tokens/src/`, spacing tokens, generated DESIGN.md front matter). Record the run as material for explaining the method.

- [x] The site has a valid `sistema.json`, DECISIONS.md, and DESIGN.md with eight sections; its tokens pass the checks

## Task V3.9: Housekeeping and gate check

**Status:** done except the gate (2026-11-22): `docs/v2/retro-phase-3.md`, AGENTS.md, `tasks/v2/phase-4.md` (MCP package versions checked), session log archived to `logs/v2-phase-3.md`.

Retro (`docs/v2/retro-phase-3.md`), AGENTS.md updates, `tasks/v2/phase-4.md` (the MCP server: verify `mcp-handler`, SDK, and Zod versions first), and archive the session log to `logs/v2-phase-3.md`.

- [ ] Gate (plan 15, Phase 3): the owner approves the guides and the site structure, and the reference project passes all checks at each milestone. Owner approves.
