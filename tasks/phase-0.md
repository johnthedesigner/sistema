# Phase 0 Task File

**Phase goal:** Scaffold the `tools/` directory with working scraping and validation scripts, then complete a full authoritative scrape and processing of Material Design 3 — replacing the current draft `material/` guidance content with content fetched directly from live sources. By end of phase, `material/` should contain only `status: latest` files, all stubs should be current, and frontmatter lint should pass with zero errors.

**Systems touched:** `material/`
**New directories:** `tools/`, `raw-scrape/` (gitignored)

---

## Task 0.1 — Tools scaffold

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

Initializes the `tools/` directory as a standalone Node/TypeScript package with two working scripts: a Firecrawl-based scraper that fetches documentation sites and writes raw output to a gitignored staging directory, and a frontmatter linter that validates all `.md` files in a system directory against the schema defined in `_meta/SCHEMA.md`. No KB content is touched in this task.

### Files created or modified

- `tools/package.json` — dependencies and scripts
- `tools/tsconfig.json` — TypeScript config for tools package
- `tools/.env.example` — environment variable template
- `tools/scrape/firecrawl-guidance.ts` — Firecrawl scraper script
- `tools/validate/lint-frontmatter.ts` — frontmatter validation script

### Acceptance criteria

- [ ] `tools/package.json` exists with the following as **dependencies**: `@mendable/firecrawl-js`, `playwright`, `gray-matter`, `zod`, `prettier`; and as **devDependencies**: `typescript`, `tsx`, `@types/node`
- [ ] `tools/tsconfig.json` exists with strict mode enabled and ESNext as target
- [ ] `tools/.env.example` exists and contains the line `FIRECRAWL_API_KEY=`
- [ ] `tools/scrape/firecrawl-guidance.ts` accepts `--url` and `--slug` as required CLI arguments
- [ ] `tools/scrape/firecrawl-guidance.ts` writes all raw output to `raw-scrape/[slug]/[YYYY-MM-DD]/` — never to any KB directory
- [ ] `tools/scrape/firecrawl-guidance.ts` logs a summary on completion: total pages fetched, total content size, list of any URLs that errored or returned empty content
- [ ] `tools/validate/lint-frontmatter.ts` accepts a system directory path as its argument (e.g. `material/`)
- [ ] `tools/validate/lint-frontmatter.ts` reports all of the following: missing required frontmatter fields (per `_meta/SCHEMA.md` Section 3.1), invalid `status` values, versioned files that have no corresponding redirect stub, stubs whose `points_to` target does not exist
- [ ] `npm install` run inside `tools/` completes without errors
- [ ] Running `npx tsx tools/validate/lint-frontmatter.ts material/` completes without crashing (lint errors from draft files are expected at this stage and do not fail this criterion)
- [ ] No hardcoded paths, URLs, or system slugs appear in either script — all are accepted as arguments or derived at runtime
- [ ] `SESSION_LOG.md` updated with a full task entry (what was built, any decisions made, any deviations from spec)
- [ ] Commit created: `"Phase 0, Task 0.1 — tools scaffold"`

---

## Task 0.2 — Material Design 3 scrape

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

Runs the Firecrawl scraper against the Material Design 3 documentation site across all relevant sections. The goal is to produce a complete raw output that captures fully rendered prose — not empty JavaScript shells. This task ends when raw output has been inspected and coverage has been documented. No KB files are created or modified. Raw output is staged in `raw-scrape/material/[date]/` for processing in Task 0.3.

### Files created or modified

- `raw-scrape/material/[YYYY-MM-DD]/` — raw scraped output (gitignored, not committed)
- `SESSION_LOG.md` — scrape summary and gap documentation

### Acceptance criteria

- [ ] Scraper run against at minimum the following M3 URLs: `https://m3.material.io/styles`, `https://m3.material.io/foundations`, `https://m3.material.io/components` (top-level navigation pages and their children)
- [ ] Raw output directory exists at `raw-scrape/material/[date]/` and contains at minimum 15 files
- [ ] Spot-check: 3 randomly selected raw output files opened and confirmed to contain rendered prose documentation — not empty HTML, not JavaScript error messages, not navigation-only content
- [ ] The following topics are confirmed present in the raw output (or their absence is explicitly documented with an alternative source identified): color system and palette, color roles, typography scale, shape system, design tokens architecture
- [ ] Scrape summary logged to `SESSION_LOG.md`: total pages fetched, list of top-level M3 sections captured, list of any URLs that returned empty or error responses
- [ ] Any coverage gaps documented in `SESSION_LOG.md` with one of: (a) an alternative source URL that will be used in processing, (b) a note that the topic will be captured via manual fetch, or (c) confirmation that the topic is not covered by M3 and can be skipped
- [ ] No raw scrape output written to any KB directory (`material/`, `_meta/`, etc.)
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 0, Task 0.2 — Material Design 3 scrape"`

---

## Task 0.3 — Material guidance processing

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

Converts the raw scrape output from Task 0.2 into properly structured KB files for the Material guidance layer, following Procedure B in `_meta/MAINTENANCE.md`. For each guidance topic, a new versioned file is created with complete frontmatter; the existing draft file is marked `legacy`; and the redirect stub is updated to point to the new file. Content must be clean prose extracted from the scraped source — no navigation chrome, no sidebar content, no JavaScript artifacts.

The six required topics are: `colors`, `color-system`, `color-roles`, `design-tokens`, `typography`, `shape`. Additional topics may be added if the scrape produced coverage for them (e.g. motion, elevation).

### Files created or modified

- `material/guidance/foundations/colors@[date].md` — new versioned file
- `material/guidance/foundations/colors.md` — stub updated
- `material/guidance/foundations/color-system@[date].md` — new versioned file
- `material/guidance/foundations/color-system.md` — stub updated
- `material/guidance/foundations/color-roles@[date].md` — new versioned file
- `material/guidance/foundations/color-roles.md` — stub updated
- `material/guidance/foundations/design-tokens@[date].md` — new versioned file
- `material/guidance/foundations/design-tokens.md` — stub updated
- `material/guidance/foundations/typography@[date].md` — new versioned file
- `material/guidance/foundations/typography.md` — stub updated
- `material/guidance/foundations/shape@[date].md` — new versioned file
- `material/guidance/foundations/shape.md` — stub updated
- Previous draft files — `status` updated to `legacy`, `superseded_by` populated

### Acceptance criteria

- [ ] New versioned files exist for all six required topics with `retrieved` date matching the scrape date from Task 0.2
- [ ] All new files have complete frontmatter with all required fields: `system`, `category`, `topic`, `content_type`, `status`, `retrieved`, `source_url` (per `_meta/SCHEMA.md` Section 3.1)
- [ ] All new files have `status: latest`
- [ ] All previous draft files (`status: draft`) have been updated to `status: legacy` with `superseded_by` populated with the new file name
- [ ] All six redirect stubs updated: `points_to` references the new file, `updated` date is current
- [ ] Content quality check: open `colors@[date].md` and `typography@[date].md` and confirm each contains at minimum 400 words of substantive documentation prose (not stub text, not frontmatter, not navigation artifacts)
- [ ] Content quality check: specific values are preserved exactly — token names, contrast ratios, and type scale values are not paraphrased or rounded
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` reports zero errors on the `guidance/foundations/` directory
- [ ] No content from `raw-scrape/` was copied directly into KB files — all content was processed and reformatted to clean markdown
- [ ] `SESSION_LOG.md` updated with full task entry (topics processed, any content quality issues found, decisions made about ambiguous content)
- [ ] Commit created: `"Phase 0, Task 0.3 — Material guidance processing"`

---

## Task 0.4 — Material assets and implementation verification

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

Verifies that the existing Material asset token files (`colors.json`, `typography.json`, `shape.json`) and implementation files (`getting-started`, `token-schema`) are accurate against their live upstream sources. If any file is outdated, inaccurate, or incomplete, a new versioned file is created following Procedure B in `_meta/MAINTENANCE.md`. If files are current and accurate, no changes are needed — that outcome is explicitly acceptable and should be noted.

Asset source: `https://github.com/material-components/material-web/tree/main/tokens`
Implementation source: `https://material-web.dev`

### Files created or modified

- `material/assets/tokens/colors@[date].json` — new file if update needed; otherwise unchanged
- `material/assets/tokens/colors.json` — stub updated if new file created
- `material/assets/tokens/typography@[date].json` — new file if update needed
- `material/assets/tokens/typography.json` — stub updated if new file created
- `material/assets/tokens/shape@[date].json` — new file if update needed
- `material/assets/tokens/shape.json` — stub updated if new file created
- `material/implementation/getting-started@[date].md` — new file if update needed
- `material/implementation/getting-started.md` — stub updated if new file created
- `material/implementation/tokens/token-schema@[date].md` — new file if update needed
- `material/implementation/tokens/token-schema.md` — stub updated if new file created

### Acceptance criteria

- [ ] Each of the three asset files spot-checked: at minimum 5 token values per file verified against the live GitHub source URL recorded in the file's `_meta` block; result (matches / outdated) documented in `SESSION_LOG.md`
- [ ] Each of the two implementation files reviewed against the live documentation source; result (current / outdated) documented in `SESSION_LOG.md`
- [ ] For any file that was updated: new versioned file created with correct frontmatter, previous file marked `status: legacy` with `superseded_by` populated, stub updated
- [ ] For any file that was not updated: `SESSION_LOG.md` explicitly notes "verified current as of [date]" for that file
- [ ] All asset files have valid `_meta` blocks per `_meta/SCHEMA.md` Section 3.3 (system, topic, content_type, status, retrieved, source_url)
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` reports zero errors across the full `material/` directory
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 0, Task 0.4 — Material assets and implementation verification"`

---

## Task 0.5 — Material DESIGN.md regeneration

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

The existing `material/design-md/DESIGN@2026-05-11.md` was generated from draft guidance content that could not be fully scraped. Now that authoritative guidance and asset files exist (from Tasks 0.3 and 0.4), a new DESIGN.md is generated from those sources. The new file must derive all token values directly from the asset files and all prose rationale from the guidance files — not generated cold. This follows Procedure A Step 7 in `_meta/MAINTENANCE.md`.

### Files created or modified

- `material/design-md/DESIGN@[date].md` — new authoritative DESIGN.md
- `material/design-md/DESIGN.md` — stub updated to point to new file
- `material/design-md/DESIGN@2026-05-11.md` — marked `status: legacy`

### Acceptance criteria

- [ ] `material/design-md/DESIGN@[date].md` exists with a `retrieved` date matching Task 0.3 processing date
- [ ] YAML front matter token values (color, typography, shape) are sourced directly from the asset files produced in Task 0.4 — no values invented or estimated
- [ ] Prose sections (color rationale, typography rationale, usage guidance) are derived from the guidance files produced in Task 0.3 — not generated cold from model knowledge
- [ ] `derived_from` frontmatter field lists every source file used to generate this DESIGN.md
- [ ] `unofficial: true` present in frontmatter
- [ ] Mandatory disclaimer present in the document body: *"This is a community-generated DESIGN.md derived from Material Design 3's public documentation. It is not an official document published by the Material Design team."*
- [ ] `design_md_spec_version` field present in frontmatter
- [ ] Previous `DESIGN@2026-05-11.md` has been updated: `status: legacy`, `superseded_by: DESIGN@[date].md`
- [ ] `material/design-md/DESIGN.md` stub updated: `points_to: DESIGN@[date].md`, `updated` date current
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` reports zero errors
- [ ] `SESSION_LOG.md` updated with full task entry (source files used, any design decisions made in generation)
- [ ] Commit created: `"Phase 0, Task 0.5 — Material DESIGN.md regeneration"`

---

## Task 0.6 — Index and changelog update

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

Brings all index and changelog files current to reflect the complete set of changes made in Tasks 0.1–0.5. This is a documentation-only task — no KB content files are created or modified. Ends with a final lint pass confirming the full `material/` directory is clean.

### Files created or modified

- `material/_index.md` — Content Inventory and Version History updated
- `_meta/INDEX.md` — By System and By Category sections updated; header counts updated
- `_meta/CHANGELOG.md` — session entries appended for all Phase 0 work

### Acceptance criteria

- [ ] `material/_index.md` Content Inventory table is complete: one row per file in `material/` (including stubs), with accurate `topic`, `content_type`, `status`, and `retrieved` values
- [ ] `material/_index.md` Version History contains entries for the initial capture (2026-05-11) and for the Phase 0 update with a brief description of what changed
- [ ] `_meta/INDEX.md` header shows correct total for Systems Indexed and Total Content Files
- [ ] `_meta/INDEX.md` By System section for Material is fully updated: file paths, statuses, and dates reflect the current state after Phase 0
- [ ] `_meta/INDEX.md` By Category sections updated: any files that changed status or were added are reflected in the correct category rows
- [ ] `_meta/INDEX.md` Coverage Matrix updated to reflect Material's current coverage across all tracked topics
- [ ] `_meta/CHANGELOG.md` contains one entry per session in Phase 0, each with date, tasks completed, and files added or changed
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` reports **zero errors** — this is the final, definitive lint pass for Phase 0
- [ ] `SESSION_LOG.md` updated: full task entry added, **Current State block updated** to show Phase 0 complete and Phase 1 as next
- [ ] Commit created: `"Phase 0, Task 0.6 — index and changelog update"`

---

## Task 0.7 — Phase 0 housekeeping

**Status:** not started
**Phase:** 0
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping. Archives the session log, compresses completed task entries, updates patterns in `AGENTS.md`, writes a brief phase retrospective, and reviews the Phase 1 task file for any issues. Uses the housekeeping prompt from `docs/META-PLAN.md`. No code or KB content is written in this session.

### Files created or modified

- `tasks/phase-0.md` — all task entries compressed to summary form
- `SESSION_LOG.md` — Phase 0 session entries removed; pointer to archive added; Current State block updated
- `logs/phase-0.md` — Phase 0 session entries archived here
- `AGENTS.md` — Patterns established section updated
- `docs/phase-0-retro.md` — brief retrospective created

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-0.md` compressed: each entry reduced to status line, one-sentence output summary, key decisions made, and a pointer to the session log entry
- [ ] All Phase 0 session entries moved from `SESSION_LOG.md` to `logs/phase-0.md`
- [ ] `SESSION_LOG.md` contains a pointer to `logs/phase-0.md` and a Current State block showing: Phase 1 pending, last completed task is Phase 0 complete, next task is first task in phase-1.md
- [ ] `AGENTS.md` Patterns established section updated with any patterns identified during Phase 0 (e.g. how to handle JS SPA scraping, how to identify content vs navigation chrome in raw output)
- [ ] `docs/phase-0-retro.md` written with at minimum: what went smoothly, what was harder than expected, decisions made that are not documented elsewhere, anything to do differently in Phase 1
- [ ] `tasks/phase-1.md` reviewed; any tasks that look wrong, depend on unbuilt prerequisites, or have unclear acceptance criteria flagged in `SESSION_LOG.md` (file is not edited — only reviewed)
- [ ] Commit created: `"Phase 0, Task 0.7 — housekeeping and phase close"`
