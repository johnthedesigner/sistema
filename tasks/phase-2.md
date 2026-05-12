# Phase 2 Task File — COMPLETE

**Phase goal:** Deploy the app, validate plays through live testing, and add Carbon and Atlassian as KB systems — giving the app genuine multi-system value.
**Status:** All tasks complete. Session entries archived to `logs/phase-2.md`.

---

## Task 2.1 — Vercel deployment
**Status:** complete | **Log:** `logs/phase-2.md`
Connected repository to Vercel dashboard; deployed at https://sistema-bay-seven.vercel.app; all major routes confirmed rendering.
**Key decisions:** No hardcoded domain in any play or KB file; `{{sistema_url}}` resolved at copy time via `window.location.origin`.

---

## Task 2.2 — Play testing
**Status:** complete | **Log:** `logs/phase-2.md`
Tested 4 plays end-to-end; critical fix: `generate-primitive-colors` renamed to `generate-color-scheme` and rewritten to produce CSS custom-property semantic tokens from a seed color (the referenced asset URL showed semantic tokens, not a primitive palette). `specify-component` gained a mandatory spec template skeleton to standardize output structure.
**Key decisions:** Plays validated by running them (not by reading them); output quality is the only signal; `generate-color-roles` reframed as the "have palette, map to roles" play — distinct from `generate-color-scheme`.

---

## Task 2.3 — Carbon KB capture
**Status:** complete | **Log:** `logs/phase-2.md`
Full Procedure A for Carbon v11 — 4 Firecrawl scrapes + 2 GitHub token fetches; 7 versioned content files + 7 stubs + `carbon/_index.md`; lint: 10 files, 0 errors; build: 39 pages.
**Key decisions:** Color + themes scrapes filed as separate guidance files; DESIGN.md requires `derived_from` frontmatter listing all source files; White theme token file organized by group; token source is `packages/colors/src/colors.ts` (TypeScript, not `index.js`).

---

## Task 2.4 — Wire Carbon into app
**Status:** complete | **Log:** `logs/phase-2.md`
Carbon routes appeared automatically — no `src/` code changes required. One bug fixed: Carbon `.json` asset stubs were plain JSON objects; `gray-matter` requires YAML frontmatter format even inside `.json` stub files.
**Key decisions:** Stub file format (`---\ntype: stub\n---`) is the invariant that controls routing; all three KB data-layer functions required zero changes.

---

## Task 2.5 — Atlassian KB capture
**Status:** complete | **Log:** `logs/phase-2.md`
Full Procedure A for Atlassian Design System — 2 Firecrawl scrapes (color, typography; design-tokens page returned 0 pages — fully JS-rendered); token values from `@atlaskit/tokens@13.0.4` jsDelivr CDN; 6 versioned content files + 6 stubs + `atlassian/_index.md`; lint: 10 files, 0 errors; build: 46 pages.
**Key decisions:** Atlassian repository is on Bitbucket, not GitHub; token values sourced from CDN package (`dist/cjs/artifacts/token-default-values.js`); design-tokens guidance written from CDN token package contents.

---

## Task 2.6 — Phase 2 housekeeping
**Status:** complete | **Log:** `logs/phase-2.md`
Compressed task file, created `logs/phase-2.md` archive, updated `AGENTS.md` with 3 new patterns, wrote `docs/phase-2-retro.md`, generated `tasks/phase-3.md`. Lint and build verified passing.
