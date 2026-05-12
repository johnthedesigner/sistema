# Phase 1 Task File

**Phase goal:** Add Carbon (IBM) as the second KB system following Procedure A in `_meta/MAINTENANCE.md`, then build the Next.js app foundation. By end of phase: Carbon KB is captured and validated, the app builds and deploys cleanly, the landing page is live, and the KB data layer reads both Material and Carbon content.

**Systems touched:** `carbon/` (new), `material/` (index updates only)
**App:** Next.js App Router initialized at root; `src/` created

---

## Task 1.1 — Carbon KB capture

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Adds Carbon (IBM Design System) as the second KB system following Procedure A in `_meta/MAINTENANCE.md`. The agent runs all scrapes directly via Bash. Priority foundations: color, typography, spacing/layout, and the token architecture. Component coverage: Button, Form elements, and Navigation are the minimum. All scraping uses `--limit 25` with 60+ second gaps between passes; JS-rendered pages fall back to GitHub source files for token values.

**Sources:**
- Guidance: `https://carbondesignsystem.com` (foundations, components)
- Implementation: `https://github.com/carbon-design-system/carbon`
- Tokens: `https://github.com/carbon-design-system/carbon/tree/main/packages/themes/src` (colors), `https://github.com/carbon-design-system/carbon/tree/main/packages/layout/src` (spacing), `https://github.com/carbon-design-system/carbon/tree/main/packages/type/src` (typography)

### Files created or modified

- `carbon/_index.md` — system overview, source map, content inventory, version history
- `carbon/guidance/foundations/color@[date].md` — color token system, themes, roles
- `carbon/guidance/foundations/color.md` — stub
- `carbon/guidance/foundations/typography@[date].md` — type scale, typeface, usage
- `carbon/guidance/foundations/typography.md` — stub
- `carbon/guidance/foundations/spacing@[date].md` — spacing scale, grid, layout
- `carbon/guidance/foundations/spacing.md` — stub
- `carbon/guidance/foundations/design-tokens@[date].md` — Carbon token architecture (v11 structure)
- `carbon/guidance/foundations/design-tokens.md` — stub
- `carbon/implementation/getting-started@[date].md` — installation, package overview
- `carbon/implementation/getting-started.md` — stub
- `carbon/implementation/tokens/token-schema@[date].md` — CSS custom properties, Sass vars, JS tokens
- `carbon/implementation/tokens/token-schema.md` — stub
- `carbon/assets/tokens/colors@[date].json` — color tokens (white theme + g10 + g90 + g100)
- `carbon/assets/tokens/colors.json` — stub
- `carbon/assets/tokens/typography@[date].json` — type scale tokens
- `carbon/assets/tokens/typography.json` — stub
- `carbon/assets/tokens/spacing@[date].json` — spacing scale tokens
- `carbon/assets/tokens/spacing.json` — stub
- `_meta/INDEX.md` — Carbon added to all relevant sections; system count and file count updated

### Acceptance criteria

- [ ] `carbon/` directory structure created: `guidance/foundations/`, `guidance/components/`, `guidance/patterns/`, `implementation/`, `implementation/tokens/`, `assets/tokens/`
- [ ] `carbon/_index.md` written with: system overview, "when to reference" note, source map table, content inventory table (complete at task end), version history initial entry
- [ ] Scrape documented in `SESSION_LOG.md`: passes run, URLs targeted, file counts, quality spot-checks, any gaps
- [ ] All scrape passes use `--limit 25` or lower; no single call targets a root URL expected to have 100+ pages
- [ ] Guidance files exist for: `color`, `typography`, `spacing`, `design-tokens` — all with `status: latest`, `content_type: guidance`, complete frontmatter
- [ ] Spot-check: `color@[date].md` and `typography@[date].md` each contain at minimum 400 words of substantive prose (not stubs, not frontmatter, not navigation chrome)
- [ ] Specific values in guidance files preserved exactly: token names, spacing scale values, type size values are not rounded or paraphrased
- [ ] Implementation files exist: `getting-started@[date].md`, `token-schema@[date].md` — both with correct frontmatter
- [ ] Asset files exist: `colors@[date].json`, `typography@[date].json`, `spacing@[date].json` — all with `_meta` blocks per `_meta/SCHEMA.md` Section 3.3
- [ ] Asset file spot-check: at minimum 5 token values per file verified against live GitHub source; results logged in `SESSION_LOG.md`
- [ ] All versioned files have corresponding redirect stubs; all stubs have valid `points_to` targets
- [ ] `npx tsx tools/validate/lint-frontmatter.ts carbon/` reports **zero errors**
- [ ] `_meta/INDEX.md` updated: Carbon added to "By System" section, all files listed in appropriate "By Category" sections, system count updated to 2, file count updated
- [ ] `_meta/CHANGELOG.md` updated with Carbon capture session entry
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.1 — Carbon KB capture"`

---

## Task 1.2 — Carbon DESIGN.md generation

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Generates a community DESIGN.md for Carbon, following Procedure A Step 7 in `_meta/MAINTENANCE.md`. All token values in the YAML front matter are drawn directly from the asset files captured in Task 1.1. All prose sections are derived from the guidance files, not generated cold. The generated file must follow the same spec as `material/design-md/DESIGN@2026-05-11.md`.

### Files created or modified

- `carbon/design-md/DESIGN@[date].md` — community DESIGN.md derived from Task 1.1 files
- `carbon/design-md/DESIGN.md` — redirect stub
- `carbon/_index.md` — Content Inventory updated with DESIGN.md row

### Acceptance criteria

- [ ] `carbon/design-md/DESIGN@[date].md` exists with `content_type: design-md`, `unofficial: true`, `design_md_spec_version` present in frontmatter
- [ ] `derived_from` frontmatter field lists every source file used — at minimum: color, typography, spacing guidance + color, typography, spacing asset files
- [ ] YAML front matter token values (color scheme, type scale, spacing scale) sourced directly from Task 1.1 asset files — no invented or estimated values
- [ ] Mandatory disclaimer present in document body: *"This is a community-generated DESIGN.md derived from Carbon's public documentation. It is not an official document published by the Carbon Design System team."*
- [ ] Prose sections (color rationale, typography rationale, spacing rationale) use language and specifics from the Task 1.1 guidance files, not generic descriptions
- [ ] `carbon/design-md/DESIGN.md` stub exists with correct `points_to` target
- [ ] `carbon/_index.md` Content Inventory includes DESIGN.md row
- [ ] `npx tsx tools/validate/lint-frontmatter.ts carbon/` reports **zero errors**
- [ ] `_meta/CHANGELOG.md` updated
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.2 — Carbon DESIGN.md generation"`

---

## Task 1.3 — Next.js initialization

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Initializes the Next.js App Router application at the repository root. Adds root-level `package.json`, `next.config.ts`, `tsconfig.json`, and `tailwind.config.ts`. Creates the `src/app/` directory skeleton with a minimal root layout and placeholder home page. Verifies that `tools/` retains its own `package.json` and does not conflict with the root package. Ends with `next build` passing and a working Vercel preview deployment.

**Important:** The root `package.json` must not interfere with `tools/package.json`. The tools package is a separate Node package and runs independently. Confirm that running `npm install` at the root does not affect `tools/node_modules` and that the linter still runs correctly from the repo root after this task.

### Files created or modified

- `package.json` — root Next.js app package (Next.js, React, TypeScript, Tailwind, ESLint)
- `next.config.ts` — Next.js config (TypeScript, App Router)
- `tsconfig.json` — root TypeScript config (separate from `tools/tsconfig.json`)
- `tailwind.config.ts` — Tailwind CSS configuration
- `postcss.config.js` — PostCSS config for Tailwind
- `.eslintrc.json` (or `eslint.config.mjs`) — ESLint config
- `src/app/layout.tsx` — root layout with `<html>` and `<body>`
- `src/app/page.tsx` — placeholder home page (text-only; no content or design yet)
- `src/styles/globals.css` — global CSS with Tailwind directives

### Acceptance criteria

- [ ] `package.json` exists at repo root with Next.js 15+, React 19+, TypeScript, Tailwind CSS, ESLint as dependencies
- [ ] `next.config.ts` is TypeScript and enables App Router (no `pages/` directory)
- [ ] `tsconfig.json` at root does not reference or include `tools/` — the tools package remains independent
- [ ] `src/app/layout.tsx` exists with valid root layout (html + body wrappers, Tailwind base applied)
- [ ] `src/app/page.tsx` exists and renders without errors (placeholder content acceptable)
- [ ] Running `npm install` at repo root completes without errors
- [ ] Running `npm run build` (i.e. `next build`) at repo root completes with **zero errors**
- [ ] Running `npx tsx tools/validate/lint-frontmatter.ts material/` still passes from repo root after root `package.json` is added (tools package unaffected)
- [ ] `npm run dev` starts the development server; home page renders in a browser at `localhost:3000` (or default port)
- [ ] App deployed to Vercel as a preview; preview URL accessible and home page renders correctly
- [ ] No hardcoded `localhost` URLs anywhere in source files
- [ ] `SESSION_LOG.md` updated with full task entry (including Vercel preview URL)
- [ ] Commit created: `"Phase 1, Task 1.3 — Next.js initialization"`

---

## Task 1.4 — KB data layer

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds `src/lib/kb.ts` — the build-time utilities for reading KB content from the filesystem. All reads happen at build time (in `generateStaticParams` or `getStaticProps` contexts); no runtime filesystem access. Functions must follow the stub system: when reading a topic, they follow `points_to` to the current versioned file rather than requiring callers to know versioned filenames. Returns parsed frontmatter and body separately.

### Files created or modified

- `src/lib/kb.ts` — KB reading utilities
- `src/lib/types.ts` — TypeScript types for KB content, frontmatter, system index

### Acceptance criteria

- [ ] `src/lib/kb.ts` exports the following functions (names may vary but functionality required):
  - `listSystems()` — returns array of system slug strings (e.g. `['material', 'carbon']`) by reading top-level directories that contain `_index.md`
  - `readSystemIndex(slug)` — reads and returns parsed `[slug]/_index.md` content (frontmatter + body)
  - `readStub(stubPath)` — reads a stub file and returns its `points_to` target path
  - `readContent(versionedPath)` — reads a versioned content file, returns `{ frontmatter, body }` with frontmatter parsed as a typed object
  - `resolveStub(stubPath)` — follows a stub to its versioned file and returns the parsed content (combines `readStub` + `readContent`)
- [ ] All file reads use Node `fs` (synchronous or via `fs/promises` with async/await) — no `fetch`, no `require`
- [ ] `src/lib/types.ts` defines TypeScript interfaces for: `ContentFrontmatter` (all standard frontmatter fields), `SystemIndex` (parsed `_index.md`), `ContentFile` (frontmatter + body)
- [ ] `listSystems()` returns both `material` and `carbon` when called (confirming Tasks 1.1 is visible at build time)
- [ ] `resolveStub('material/guidance/foundations/color-system')` (or equivalent path) returns parsed content from `color-system@2026-05-11.md` (follows stub chain correctly)
- [ ] `npm run build` passes after this file is added
- [ ] A minimal test or build-time usage is present — e.g. `generateStaticParams` in a placeholder route that calls `listSystems()` — confirming the functions work in the Next.js build pipeline
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.4 — KB data layer"`

---

## Task 1.5 — Core routing and landing page

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Defines the URL scheme and builds the landing page plus skeleton routing. The landing page introduces Sistema: what it is, why it exists, and how to use KB content in an AI coding session. The skeleton routes define the URL structure that Phase 2 will fill in with full content. All routes must render without errors in both dev and production builds.

**URL scheme:**
- `/` — landing page
- `/systems` — system browser index (Phase 2 content; placeholder in this task)
- `/systems/[slug]` — per-system page (Phase 2 content; placeholder in this task)
- `/playbooks` — playbook browser (Phase 2 content; placeholder in this task)

### Files created or modified

- `src/app/page.tsx` — landing page (replaces placeholder from Task 1.3)
- `src/app/systems/page.tsx` — systems index (skeleton: renders system names only)
- `src/app/systems/[slug]/page.tsx` — per-system page (skeleton: renders slug and system index frontmatter)
- `src/app/playbooks/page.tsx` — playbooks index (skeleton: placeholder heading)
- `src/components/` — shared layout components as needed (navigation, footer)

### Acceptance criteria

- [ ] Landing page at `/` communicates: what Sistema is, what the KB contains, how to use a DESIGN.md file in an AI coding session; minimum 3 sections with real copy (not Lorem Ipsum)
- [ ] `/systems` renders a list of available systems read via `listSystems()` from Task 1.4 — both Material Design 3 and Carbon appear by name
- [ ] `/systems/material` and `/systems/carbon` both render without errors; each displays the system name and a brief description drawn from `_index.md`
- [ ] `/playbooks` renders without errors (placeholder heading acceptable — full content in Phase 2)
- [ ] All four routes generate static pages (`next build` produces HTML for each)
- [ ] No route renders a Next.js default 404 or error page
- [ ] Navigation links between `/`, `/systems`, and `/playbooks` are present and functional
- [ ] `npm run build` passes with **zero errors**
- [ ] All four routes tested in a browser (dev server): pages render, navigation works, no console errors
- [ ] No hardcoded design system names or file paths in page components — system data comes from KB data layer
- [ ] Vercel preview updated and accessible
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.5 — Core routing and landing page"`

---

## Task 1.6 — AGENTS.md update

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Updates `AGENTS.md` to reflect the app layer introduced in Phase 1. Adds the app's directory structure to the repository structure block and confirms that the existing architectural rules (Rules 7–10) accurately describe the app as built. Adds any new patterns established during Phase 1 app tasks. No code written in this task.

### Files created or modified

- `AGENTS.md` — repository structure updated; app patterns added if needed

### Acceptance criteria

- [ ] `AGENTS.md` repository structure block reflects the `src/` directory as introduced in Task 1.3 (app router, components, lib, styles)
- [ ] Architectural Rules 7–10 (app layer rules) verified to accurately describe the app as built in Tasks 1.3–1.5; any inaccuracies corrected
- [ ] Any patterns established during Phase 1 app tasks that are not yet in the Patterns section are added (e.g. how the KB data layer is structured, how routes use static generation)
- [ ] No architectural rules added without a concrete reason from Phase 1 work
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.6 — AGENTS.md update"`

---

## Task 1.7 — Phase 1 housekeeping

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping following the same pattern as Task 0.7. Compresses completed task entries in this file, archives Phase 1 session log entries, updates `AGENTS.md` patterns if any remain, writes the Phase 1 retrospective, and reviews the Phase 2 task file.

### Files created or modified

- `tasks/phase-1.md` — all task entries compressed to summary form
- `tasks/phase-2.md` — generated and reviewed (flagged if issues found)
- `SESSION_LOG.md` — Phase 1 entries removed; pointer to archive added; Current State updated
- `logs/phase-1.md` — Phase 1 session entries archived here
- `AGENTS.md` — Patterns section updated if any Phase 1 patterns are missing
- `docs/phase-1-retro.md` — brief retrospective written

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-1.md` compressed: status line, one-sentence output, key decisions, session log pointer
- [ ] All Phase 1 session entries moved from `SESSION_LOG.md` to `logs/phase-1.md`
- [ ] `SESSION_LOG.md` contains pointer to `logs/phase-1.md` and Current State block showing Phase 2 pending, first Phase 2 task identified
- [ ] `AGENTS.md` Patterns section updated with any Phase 1 patterns not yet recorded
- [ ] `docs/phase-1-retro.md` written with: what went smoothly, what was harder than expected, decisions not documented elsewhere, what to do differently in Phase 2
- [ ] `tasks/phase-2.md` generated and reviewed; any tasks that look wrong, depend on unbuilt prerequisites, or have unclear acceptance criteria flagged in `SESSION_LOG.md` (file not edited — only reviewed)
- [ ] `npx tsx tools/validate/lint-frontmatter.ts carbon/` and `npx tsx tools/validate/lint-frontmatter.ts material/` both report **zero errors**
- [ ] `npm run build` passes before housekeeping commit
- [ ] Commit created: `"Phase 1, Task 1.7 — housekeeping and phase close"`
