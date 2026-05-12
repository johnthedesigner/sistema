# Phase 0 Retrospective

**Phase:** 0 — Tools scaffold and Material Design 3 foundation
**Completed:** 2026-05-11
**Tasks:** 0.1 (tools), 0.2 (scrape), 0.3 (guidance), 0.4 (verification), 0.5 (DESIGN.md), 0.6 (index), 0.7 (housekeeping)

---

## What went smoothly

**Firecrawl prose quality was excellent.** For all non-JS-rendered pages, the raw output was high-quality — 500–700+ lines of coherent documentation prose with minimal navigation noise. The content could be processed quickly without heroic cleanup.

**Tools scaffold was clean on the first try.** `npm install` ran without conflicts, the TypeScript config worked immediately, and the linter correctly identified the pre-existing YAML error on its first run.

**Three-pass scrape strategy worked well.** Starting with `m3.material.io/styles`, then `foundations/`, then a targeted third pass for `design-tokens` resolved all coverage gaps without needing manual fetches. The pattern of inspecting output after each pass and deciding autonomously whether to run another is efficient and should be standard practice.

**In-place updates were pragmatically correct.** The same-date versioning conflict (all existing files already named `@2026-05-11.md`) could have been handled by creating `@2026-05-11b.md` or similar, but updating in place was cleaner and preserved the intended KB structure. The content improvement was substantial enough to justify it.

**The linter caught real issues.** The YAML parse error in `getting-started` was identified by the linter immediately in Task 0.1, tracked through Tasks 0.3 and fixed in 0.4. This is exactly the role the linter is supposed to play.

---

## What was harder than expected

**JS-rendered token tables are a scraping blind spot.** Three pages — baseline colors, typescale tokens, corner radius scale — rendered entirely in JavaScript and returned only navigation labels, not values. This is a structural limitation of Firecrawl on JS SPAs. The workaround (using JSON asset files as authoritative source) is the right approach, but it added a dependency that future processing tasks should assume upfront rather than discover mid-task.

**GitHub SCSS token file delegation was non-obvious.** The top-level `_md-sys-color.scss` file uses `@forward` to delegate to versioned modules, so fetching it directly returned no hex values. Finding the actual values required browsing `tokens/versions/` to identify the active version (`v0_192`), then targeting specific files within that directory (`_md-ref-palette.scss`, `_md-sys-typescale.scss`). This took several tool calls to work out and is now documented as a pattern in AGENTS.md.

**The neutral palette discrepancy required a judgment call.** The 1-unit hex delta between the stored colors and the live v0_192 palette (neutral chroma update from 4→6, circa Feb 2023) is real but imperceptible. Deciding not to create a new file for it required understanding enough about the HCT color model to assess the visual impact. This kind of decision is appropriate to document and leave in the session log but not necessarily to block the phase on.

**Navigation chrome varies by page.** Firecrawl output consistently includes navigation chrome, but the exact pattern varies — some pages have icon labels, some have breadcrumbs, some have a footer "Previous / Next" section. A more robust stripping pass in the scraper (stripping before first H1) would reduce the manual cleanup required in processing.

---

## Decisions made that aren't captured elsewhere

**The neutral palette hex delta is accepted and documented.** The decision not to create a new `colors@2026-05-11b.json` to correct the 1-unit delta is recorded in `logs/phase-0.md` (Task 0.4) and in `_meta/CHANGELOG.md`. If this becomes an issue in Phase 2 when the colors asset is used in the app, the session log entry is the place to start.

**`tasks/phase-1.md` was not generated before Phase 0 closed.** Per META-PLAN.md, the task file for the next phase should be generated before finishing the current one. This was not done — Phase 0 ran long and the task file was not created. This is the primary action required before Phase 1 can start.

---

## What to do differently in Phase 1

**Generate `tasks/phase-1.md` first — before writing a single line.** Use the prompt in META-PLAN.md in a regular Claude chat session (not Claude Code). Review it carefully before committing. Do not start Task 1.1 without it.

**Add a scraper pre-check for JS-rendered content.** Before processing any scraped file into a KB file, check the line count. Files under ~80 lines on a documentation page that is known to be content-rich are probably JS-rendered shells. Flag them immediately rather than discovering it in the processing step.

**Plan Carbon scrape passes in advance.** Review carbon.ibm.com's navigation structure before running the scraper — identify which sections are likely to be JS-rendered and which have static prose. This avoids mid-task course corrections.

**Write acceptance criteria for content quality checks as explicit word counts.** Phase 0's Task 0.3 acceptance criteria said "at minimum 400 words of substantive prose" — this was a useful, unambiguous bar. Carry this forward to all KB processing tasks.
