# Phase 2b Task File

**Phase goal:** Restructure the KB into a typed directory hierarchy, expose raw markdown at predictable URLs, elevate the DESIGN.md workflow, and add a bundle endpoint for multi-file plays.

**Systems touched:** all existing KB content (moved, not rewritten)
**App:** significant routing changes; new endpoints; new pages

**Context from Phase 2:**
- KB content currently lives at repo root: `material/`, `carbon/`, `atlassian/`
- App routes: `/systems/[slug]` and `/systems/[slug]/[...path]`
- 46 static pages; Vercel deployed at https://sistema-bay-seven.vercel.app
- No raw markdown access; DESIGN.md reachable only through content browser

---

## Task 2b.1 — KB directory restructure

**Status:** not started
**Phase:** 2b
**Session log entry:** (link after completion)

### What this task implements

Moves all KB content from the repo root into a typed hierarchy under `kb/`. The three top-level categories are `design-systems/`, `standards/`, and `foundations/` — each with its own reading mode (imitation, compliance, first-principles reasoning). Existing design system directories move to `kb/design-systems/`. Placeholder `_index.md` files establish `kb/standards/` and `kb/foundations/` as valid KB categories even before content is added. The app's data layer and routing are updated to reflect the new structure: `/systems/[slug]` routes become `/kb/design-systems/[slug]`, a new `/kb` landing page describes the three categories, and the nav is updated. Redirects are added from old `/systems/` paths so any existing links or bookmarks continue to work.

### Files created or modified

**KB content (moves only — no content changes):**
- `material/` → `kb/design-systems/material/`
- `carbon/` → `kb/design-systems/carbon/`
- `atlassian/` → `kb/design-systems/atlassian/`
- `kb/standards/_index.md` — placeholder establishing the standards category
- `kb/foundations/_index.md` — placeholder establishing the foundations category

**Data layer:**
- `src/lib/kb.ts` — update all path resolution to read from `kb/[category]/` instead of repo root; add `listCategories()` returning the three known categories; update `listSystems()` to accept a `category` argument

**App routes (new structure):**
- `src/app/kb/page.tsx` — KB landing page describing all three categories with counts and entry points (replaces `/systems` as the KB entry point)
- `src/app/kb/[category]/[slug]/page.tsx` — system/standard/foundation overview (was `/systems/[slug]/page.tsx`)
- `src/app/kb/[category]/[slug]/[...path]/page.tsx` — content pages; last path segment must end in `.md`; strip `.md` before stub lookup; redirect to `.md`-suffixed URL if accessed without it (was `/systems/[slug]/[...path]/page.tsx`)

**Routing cleanup:**
- `src/app/systems/` — removed (routes move to `src/app/kb/`)
- `next.config.ts` — add `redirects()` from `/systems/:slug*` to `/kb/design-systems/:slug*` for backwards compatibility

**Navigation:**
- `src/components/layout/Nav.tsx` — "Systems" link updated to "Knowledge Base" pointing to `/kb`
- `src/app/page.tsx` — landing page CTAs updated to new KB URLs

**Meta:**
- `_meta/INDEX.md` — all file path references updated to `kb/design-systems/` prefix
- `_meta/CHANGELOG.md` — entry added for restructure
- `AGENTS.md` — KB path conventions updated to reflect new `kb/[category]/` structure

### Acceptance criteria

- [ ] `kb/design-systems/material/`, `kb/design-systems/carbon/`, `kb/design-systems/atlassian/` all exist with correct content; original root directories removed
- [ ] `kb/standards/_index.md` and `kb/foundations/_index.md` exist with stub content describing the category purpose
- [ ] `npx tsx tools/validate/lint-frontmatter.ts kb/design-systems/material/ kb/design-systems/carbon/ kb/design-systems/atlassian/` passes with zero errors
- [ ] `/kb` renders a landing page with three section cards (design systems, standards, foundations) and entry point links; each card uses the approved section framing from memory
- [ ] `/kb/design-systems/material` renders the Material system overview (same content as old `/systems/material`)
- [ ] `/kb/design-systems/material/guidance/foundations/color-system.md` renders the color system content page (`.md` in URL)
- [ ] `/kb/design-systems/material/guidance/foundations/color-system` (no `.md`) redirects to the `.md` URL
- [ ] `/systems/material` redirects to `/kb/design-systems/material` (backwards-compat redirect working)
- [ ] `/systems/material/guidance/foundations/color-system` redirects to `/kb/design-systems/material/guidance/foundations/color-system.md`
- [ ] Nav shows "Knowledge Base" linking to `/kb`; landing page CTAs link to new URLs
- [ ] `npm run build` passes; same page count as before (46) or higher if new pages added
- [ ] `SESSION_LOG.md` updated
- [ ] `_meta/INDEX.md` and `_meta/CHANGELOG.md` updated

---

## Task 2b.2 — Raw markdown endpoint

**Status:** not started
**Phase:** 2b
**Session log entry:** (link after completion)

### What this task implements

Adds a `/raw/[category]/[slug]/[...path]` route that returns the raw markdown content of any KB file as `text/plain`. The URL mirrors the `/kb/` path exactly — swap the prefix, keep everything else including the `.md` extension. Adds a "Raw" link and a copy-markdown button to every KB content page. Updates existing plays to include the `/raw/` URL as the LLM fetch target alongside the `/kb/` human-readable URL. This is the mechanism that makes KB content directly consumable by agents without HTML parsing.

### Files created or modified

- `src/app/raw/[category]/[slug]/[...path]/route.ts` — GET handler; strips `.md` from last segment; calls `resolveStub()` to get versioned file; returns content as `Content-Type: text/plain; charset=utf-8`; returns 404 if stub not found
- `src/components/kb/RawActions.tsx` — "Raw" link (opens raw URL in new tab) + "Copy markdown" button (copies raw content to clipboard) + "Download" link; appears on every content page
- `src/app/kb/[category]/[slug]/[...path]/page.tsx` — mount `RawActions` in the content page layout, passing the constructed raw URL
- `_meta/TASK_PLAYBOOKS.md` — update any plays that reference KB URLs to include the `/raw/` equivalent as the LLM fetch target

### Acceptance criteria

- [ ] `GET /raw/design-systems/material/guidance/foundations/color-system.md` returns `200` with `Content-Type: text/plain` and the raw markdown content (no HTML, no frontmatter YAML stripped — full file content)
- [ ] `GET /raw/design-systems/material/guidance/foundations/nonexistent.md` returns `404`
- [ ] `GET /raw/design-systems/carbon/assets/tokens/colors.md` returns the JSON token file content as `text/plain` (asset files work too)
- [ ] Every KB content page shows a "Raw" link that opens the `/raw/` URL in a new tab
- [ ] "Copy markdown" button on content pages copies the raw markdown to the clipboard (not the rendered HTML)
- [ ] At least two plays in `TASK_PLAYBOOKS.md` updated to include `/raw/` fetch URLs in the prompt body
- [ ] `npm run build` passes
- [ ] Verified in browser: Raw link opens correct content; copy button copies markdown text
- [ ] `SESSION_LOG.md` updated

---

## Task 2b.3 — DESIGN.md prominence and quick start

**Status:** not started
**Phase:** 2b
**Session log entry:** (link after completion)

### What this task implements

Surfaces DESIGN.md as a primary action on every system overview page, and adds a "Quick start" block that generates a ready-to-paste Claude Code instruction. Currently DESIGN.md is buried in the content browser list. After this task, every `/kb/design-systems/[slug]` page has a dedicated "Add to your project" section with: a one-click "Copy DESIGN.md" button that copies the raw markdown directly to the clipboard, a "Copy raw URL" button for the `/raw/` URL, and a pre-built quick-start instruction block reading *"Fetch [URL] and use it as the design foundation for this project."* — ready to paste into a Claude Code session. The quick-start block uses `window.location.origin` substitution (same pattern as play copy buttons) so it works correctly in any environment.

### Files created or modified

- `src/components/kb/DesignMdPanel.tsx` — panel component: fetches DESIGN.md raw content at render time for the copy-markdown action; shows "Copy DESIGN.md", "Copy raw URL", and "Copy quick-start prompt" buttons; shows a short description of what DESIGN.md is and how to use it
- `src/app/kb/[category]/[slug]/page.tsx` — mount `DesignMdPanel` on system overview pages when a DESIGN.md stub is present for the system; position above the content browser
- `src/lib/kb.ts` — add `findDesignMd(category, slug)` helper that checks whether a `design-md/DESIGN.md` stub exists for a system and returns its resolved path

### Acceptance criteria

- [ ] `/kb/design-systems/material`, `/kb/design-systems/carbon`, `/kb/design-systems/atlassian` each show the "Add to your project" panel
- [ ] "Copy DESIGN.md" copies the full raw markdown of the DESIGN.md file to the clipboard
- [ ] "Copy raw URL" copies the `/raw/design-systems/[slug]/design-md/DESIGN.md` URL to the clipboard
- [ ] "Copy quick-start prompt" copies a complete Claude Code instruction including the raw URL (substituted with `window.location.origin`, not hardcoded)
- [ ] Panel is not shown on system pages that have no DESIGN.md stub (does not render an empty or broken state)
- [ ] Panel appears above the content browser, not below it
- [ ] `npm run build` passes; no client-side fetch errors on page load
- [ ] Verified in browser: all three copy buttons work; copied text is correct; panel absent on `/kb/standards/` and `/kb/foundations/` pages (which have no DESIGN.md)
- [ ] `SESSION_LOG.md` updated

---

## Task 2b.4 — Bundle endpoint and process documentation

**Status:** not started
**Phase:** 2b
**Session log entry:** (link after completion)

### What this task implements

Adds a `/bundle/[category]/[slug]` route that concatenates multiple KB files for a given system into a single markdown response. An optional `?topics=` query param accepts a comma-separated list of stub path suffixes to include (e.g. `?topics=guidance/foundations/color-system,guidance/foundations/typography,design-md/DESIGN`); without it, a sensible default set is returned (all guidance files + the DESIGN.md). Each file in the response is separated by a markdown H2 header showing the file path. Returns `text/plain`. This is the mechanism that enables plays to reference a single URL and give an agent full system context in one fetch. Documents the bundle URL pattern in AGENTS.md as the preferred approach for multi-file plays.

### Files created or modified

- `src/app/bundle/[category]/[slug]/route.ts` — GET handler; reads `topics` query param (or defaults to all guidance + design-md stubs); resolves each stub to its versioned file; concatenates with `## [path]` separators; returns `text/plain`
- `AGENTS.md` — new pattern: "Bundle URLs for multi-file play context" — when a play needs an agent to read more than one KB file, prefer a `/bundle/` URL over listing multiple `/raw/` URLs; documents the `?topics=` param syntax and default behavior

### Acceptance criteria

- [ ] `GET /bundle/design-systems/material` returns `200 text/plain` containing at least 3 KB files concatenated with `## ` section headers
- [ ] `GET /bundle/design-systems/material?topics=guidance/foundations/color-system,design-md/DESIGN` returns exactly those two files concatenated
- [ ] `GET /bundle/design-systems/material?topics=guidance/foundations/color-system,nonexistent` returns the valid file and skips the missing one (no 500 error); includes a comment at the top noting any skipped topics
- [ ] `GET /bundle/design-systems/nonexistent` returns `404`
- [ ] AGENTS.md has a new "Bundle URLs for multi-file play context" pattern with example URL and `?topics=` syntax
- [ ] At least one play in `TASK_PLAYBOOKS.md` updated to use a bundle URL (good candidate: `generate-design-md`, which benefits from referencing color + typography + shape together)
- [ ] `npm run build` passes (route handler does not break static generation)
- [ ] `SESSION_LOG.md` updated

---

## Task 2b.5 — Phase 2b housekeeping

**Status:** not started
**Phase:** 2b
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping for Phase 2b. Compresses task entries, archives session log, updates AGENTS.md with any remaining patterns discovered during 2b, writes the Phase 2b retrospective, and reviews `tasks/phase-3.md` for any task entries that were affected by the Phase 2b changes (particularly 3.1 interactive fields and 3.3 Primer KB capture, which now reference the new URL structure).

### Files created or modified

- `tasks/phase-2b.md` — all task entries compressed
- `SESSION_LOG.md` — Phase 2b entries removed; pointer to archive; Current State updated to Phase 3
- `logs/phase-2b.md` — Phase 2b session entries archived
- `AGENTS.md` — any remaining Phase 2b patterns added
- `docs/phase-2b-retro.md` — brief retrospective
- `tasks/phase-3.md` — reviewed and updated to reflect new URL structure (no structural changes expected; just URL references)

### Acceptance criteria

- [ ] All completed Phase 2b task entries compressed to summary form
- [ ] All Phase 2b session entries moved to `logs/phase-2b.md`
- [ ] `SESSION_LOG.md` Current State shows Phase 3 pending
- [ ] `docs/phase-2b-retro.md` written
- [ ] `tasks/phase-3.md` reviewed — any stale URL references updated, any ordering issues flagged
- [ ] `npx tsx tools/validate/lint-frontmatter.ts kb/design-systems/material/ kb/design-systems/carbon/ kb/design-systems/atlassian/` passes
- [ ] `npm run build` passes
- [ ] Commit created
