# Phase 2 Retrospective

**Date:** 2026-05-12
**Phase goal:** Deploy the app, validate plays through live testing, add Carbon and Atlassian as KB systems.
**Outcome:** Complete. 3 design systems indexed, 46 static pages, all routes functional, Vercel deployed, 4 plays tested and refined.

---

## What went smoothly

**The KB data layer required zero changes across two system additions.** Adding Carbon and Atlassian involved only KB file creation — `listSystems()`, `listStubsForSystem()`, and `resolveStub()` picked up both systems automatically. The stub pattern held: add a valid directory with `_index.md` and the correct stub files, and the app gains new routes without touching `src/`.

**Play testing caught a real mismatch before it went live.** The `generate-primitive-colors` play referenced a KB asset URL that shows semantic tokens (CSS custom properties), not a primitive palette. Running the play rather than just reading it caught the disconnect immediately. The rename and rewrite to `generate-color-scheme` produced something much more directly useful. This is the value of test-before-refine.

**CDN fallback worked cleanly.** When Atlassian's token documentation page returned 0 Firecrawl results, the CDN package (`@atlaskit/tokens` via jsDelivr) provided complete, structured token values. This is a viable and reliable fallback for any JS-heavy token documentation page.

**Three systems are meaningfully differentiated.** The three DESIGN.md files capture genuinely distinct architectural approaches: Material's three-tier dynamic color, Carbon's neutral-first flat palette with four themes, and Atlassian's all-semantic architecture with no consumer-visible primitives. The KB is not redundant.

---

## What was harder than expected

**Atlassian's Bitbucket location.** The assumption that all major design systems host on GitHub was wrong. Atlassian's entire design system codebase is on Bitbucket — GitHub returns 404 for every Atlassian package. The CDN fallback solved the token sourcing problem, but future Atlassian KB updates will require Bitbucket-aware tooling, not GitHub fetches.

**Carbon token file naming.** The IBM color palette file is `packages/colors/src/colors.ts` (TypeScript), not `index.js`. Browsing the `src/` directory tree was needed to confirm the correct filename before fetching. This is a one-time discovery but worth documenting for future Carbon updates.

**The JSON stub format bug.** Carbon `.json` asset stubs were initially written as plain JSON objects — visually reasonable but wrong. `gray-matter` requires YAML frontmatter syntax even inside `.json` files. The 404 error was not immediately obvious because stub-following is silent at the data-layer level; the failure only surfaced as a 404 in the browser. The fix is documented in AGENTS.md.

---

## Decisions not elsewhere documented

**Dark theme token values not captured for Atlassian.** The CDN fetch retrieved light-theme values only (`token-default-values.js`). A dark-theme file exists in the package but was not fetched. The `atlassian/_index.md` Source Map notes this. Dark theme capture would require a second CDN fetch (`token-default-dark-values.js` or equivalent) and a new asset file.

**Carbon typography token file not captured.** The task acceptance criteria listed `carbon/assets/tokens/typography.json` as optional ("if extractable"). The Carbon typography tokens are embedded in the SCSS theme files rather than a standalone JSON file — extraction would require parsing Sass variables, which is non-trivial. Filed as a known gap in `carbon/_index.md`.

**Atlassian design-tokens guidance written from CDN package, not Firecrawl.** Because the tokens documentation page returned 0 pages, the design-tokens guidance file was synthesized from the CDN `token-default-values.js` package structure rather than from scraped prose. The content is accurate to the package but lacks any narrative from the official docs site. A future scrape with a JS-capable tool (Playwright) could fill this in.

---

## What to do differently in Phase 3

**Check source repository location before attempting GitHub fetches.** Not all design systems are on GitHub. Before any KB capture task, look up whether the source is on GitHub, Bitbucket, GitLab, or private — then choose the right fetch approach.

**Use Playwright for JS-heavy token pages.** The `tools/` directory already has Playwright as a dependency. For pages that return 0 Firecrawl results, Playwright headless rendering should be the first fallback (not CDN) — it captures the actual rendered content, not just the package artifact.

**Exemplars are still missing.** Task 2.5 in META-PLAN.md described exemplar creation for the top plays. This was not included in the Phase 2 task file and did not happen. Phase 3 task 3.2 (exemplar previews) depends on having exemplar content — generate the exemplars first, before building the preview UI.
