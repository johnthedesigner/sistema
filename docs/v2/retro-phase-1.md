# v2 Phase 1 Retro

**Dates:** 2026-11-14 to 2026-11-17. **Tasks:** V1.0 to V1.18.

## What shipped

- **The content model.** Plays, workflows, rules, opinions, guides, file format pages, and a source list, all in `content/`. Zod schemas validate them, and the contract checks run on every build: requires and produces, milestone order, guide anchors, rule references, tools named in the procedure, and credits.
- **The catalog.** 25 v1 plays became 23 plays (two merges, two retired into routes, one reframe, one new migration play). 2 campaigns became 3 workflows. There are 47 rules, 20 opinions, and 18 guides with addressable sections, plus one file format page.
- **Every channel from one source.** The web page, the `/raw` plain text, and the workflow starter (short and full) are generated from the same files, with `{{sistema_url}}` resolved on the server.
- **The state model.** `sistema.json` (with a published schema), DECISIONS.md, and DESIGN.md. A pointer in the agent instructions file and a `continue` URL let a new session resume. There's also a migration play from `LIVING_BRIEF.md`.
- **Owner-facing direction.** IA research, the narrative (headline still open), 20 published opinions, the site structure with the prompt box idea, and both fit reviews.
- **The site on the new model.** It uses the new URLs, with `llms.txt`, `/agents`, and a note for agents on every page. The legacy pages and files are gone, and reference material is internal. There's a public Sources page with licences, and credits on every guide.
- **Checks.** Every content rule now blocks the build. New checks: internal links in built pages, stale paths, restated rule values, and credits. There's a `review` level that reports items due for review without blocking. `npm run uses` lists what refers to any ID.

## What went well

- **The slice before the migration paid off.** Two real runs and a resume test found the continuity problem (people say "keep going", not "paste the starter again") before 20 more plays were converted. That fix is now built into every workflow.
- **Checks found what reading missed.** The internal link check found links to deleted pages after the V1.13 rewire. The restated-values check found thresholds in guides. Model checks caught a path conflict and missing guide links during migration.
- **Dry runs on Sistema's own files.** The migration dry run found that Sistema's DESIGN.md is bare YAML with no body, and that the brief contradicts itself about the canvas color. Neither was in any plan.
- **Owner questions improved the content.** "How did we land on this?" exposed that the default type roles were never chosen deliberately. The typography guide now treats naming as a decision, with every approach credited to the systems that use it.

## What to watch

- **Derivative content.** Most guide text was AI-drafted from reference notes. Fit review 2 found two frameworks from single sources presented as general practice. The source-closeness audit is in the backlog and should run before VF.
- **Content quality isn't verified, only structure.** The checks prove references resolve and rules aren't restated. They don't prove a guide is right or a play produces good work. The owner expects a full content review once everything planned is in place. V3's reference project and V5's harness are where quality gets tested.
- **13 guides are due for review.** They carry May dates. The four guide rewrites in V3 (color, tokens, typography, quality signals) cover some of them.
- **I missed a failing test once.** The V1.14 report said "98 pass" while one test file failed with an empty suite. Read the "Test Files" line, not just the "Tests" line.
- **Reference notes have gaps.** Licences are unrecorded for Mailchimp, Primer, and Modular Scale, and an author's name was wrong. The audit should check every Source Map, not only the guides.
- **Decisions flow in the wrong order in one place.** The component library was chosen after type naming depended on it. `project.assess` now asks early, but the general lesson stands: check the workflow order whenever one play's choice constrains another's.
- **`.env.local` still bakes an ngrok URL into local builds** (bug #32). Output checks pass, but local HTML isn't representative of production.

## Numbers

| | Start of V1 | End of V1 |
|---|---|---|
| Tests | 29 | 108 (8 files) |
| Content-level violations | 62 | 0, and blocking |
| Code-level violations | 0 | 0 |
| Plays and workflows (campaigns) | 25 and 2 | 23 and 3 |
| Rules in the registry | 0 | 47 |
| Published opinions | 0 | 20 |
| Sources with licences recorded | none in one place | 24 in `content/sources.yaml`, 3 marked unrecorded |
| Lint | 0 errors, 2 warnings | 0 errors, 2 warnings |
| CI | never run | passing on every push to `v2` |
| Commits | | 41 with a V1 task ID |
