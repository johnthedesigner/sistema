# Phase 1 Task File

**Phase goal:** Build the Next.js app and make it fully functional with the existing Material Design 3 content. By end of phase: a deployed app where you can browse the system, read KB content, and copy playbook prompts. Carbon and additional systems are added in Phase 2.

**Systems touched:** `material/` (read-only; no KB content changes)
**App:** `src/` created; root `package.json` added

---

## Task 1.1 — Next.js initialization

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Initializes the Next.js App Router application at the repository root. Adds root-level `package.json`, `next.config.ts`, `tsconfig.json`, and `tailwind.config.ts`. Creates the `src/app/` skeleton with a minimal root layout and placeholder home page. Verifies that `tools/` retains its own `package.json` and does not conflict. Ends with `next build` passing and a working Vercel preview deployment.

### Files created or modified

- `package.json` — root Next.js app package
- `next.config.ts` — Next.js config (App Router, TypeScript)
- `tsconfig.json` — root TypeScript config (separate from `tools/tsconfig.json`)
- `tailwind.config.ts` — Tailwind CSS configuration
- `postcss.config.js` — PostCSS for Tailwind
- `src/app/layout.tsx` — root layout (`<html>`, `<body>`, global styles)
- `src/app/page.tsx` — placeholder home page
- `src/styles/globals.css` — global CSS with Tailwind directives

### Acceptance criteria

- [ ] `package.json` at repo root includes Next.js 15+, React 19+, TypeScript, Tailwind CSS
- [ ] `next.config.ts` is TypeScript; App Router used (no `pages/` directory)
- [ ] `tsconfig.json` at root does not reference or include `tools/`
- [ ] `npm run build` at repo root completes with **zero errors**
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` still passes after root `package.json` is added — tools package unaffected
- [ ] `npm run dev` starts the dev server; home page renders at `localhost:3000` (placeholder text acceptable)
- [ ] App deployed to Vercel; preview URL accessible; placeholder page renders
- [ ] No hardcoded `localhost` URLs in any source files
- [ ] `SESSION_LOG.md` updated with full task entry (Vercel preview URL recorded)
- [ ] Commit created: `"Phase 1, Task 1.1 — Next.js initialization"`

---

## Task 1.2 — KB data layer

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds `src/lib/kb.ts` — build-time utilities for reading KB content from the filesystem. All reads happen at build time (in `generateStaticParams` or page-level data functions); no runtime filesystem access. Functions follow the stub system: callers pass a stub path, the function follows `points_to` to the versioned file and returns parsed frontmatter and body. Also builds a utility that parses `_meta/TASK_PLAYBOOKS.md` into a structured list of plays for the playbook browser.

### Files created or modified

- `src/lib/kb.ts` — KB filesystem utilities
- `src/lib/playbooks.ts` — parses `_meta/TASK_PLAYBOOKS.md` into structured play objects
- `src/lib/types.ts` — TypeScript types for all KB and playbook data

### Acceptance criteria

- [ ] `src/lib/kb.ts` exports:
  - `listSystems()` → string[] of system slugs (reads directories containing `_index.md`)
  - `readSystemIndex(slug)` → parsed `[slug]/_index.md` (frontmatter + body)
  - `resolveStub(stubPath)` → reads stub, follows `points_to`, returns `{ frontmatter, body }` of versioned file
  - `listStubsForSystem(slug)` → all stub paths for a given system (for generating static params)
- [ ] `src/lib/playbooks.ts` exports:
  - `loadPlaybooks()` → array of play objects, each with: `id` (e.g. `1.1`), `title`, `category`, `tier`, `triggerPhrases`, `prompt` (the full play content as a string)
- [ ] All filesystem reads use Node `fs` — no `fetch`, no dynamic `require`
- [ ] `listSystems()` returns `['material']` when called in the current repo state
- [ ] `resolveStub('material/guidance/foundations/color-system')` returns parsed content of `color-system@2026-05-11.md` (stub chain followed correctly)
- [ ] `loadPlaybooks()` returns at least 5 play objects parsed from `_meta/TASK_PLAYBOOKS.md`
- [ ] `src/lib/types.ts` defines: `ContentFrontmatter`, `SystemIndex`, `ContentFile`, `Play`
- [ ] `npm run build` passes after this task
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created: `"Phase 1, Task 1.2 — KB data layer"`

---

## Task 1.3 — System browser

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds the system browser: a `/systems` index page listing all available design systems, and a `/systems/[slug]` per-system page that shows the system overview, source map, and content inventory. All data comes from `_index.md` via the KB data layer. Design is functional but not polished — that happens in Phase 4.

### Files created or modified

- `src/app/systems/page.tsx` — system index (list of available systems)
- `src/app/systems/[slug]/page.tsx` — per-system overview page
- `src/app/systems/[slug]/generateStaticParams` (inside above) — generates `material` slug
- `src/components/layout/Navigation.tsx` — top-level navigation component (if not already present)

### Acceptance criteria

- [ ] `/systems` renders a list of all systems from `listSystems()` — Material Design 3 appears by name with a link to `/systems/material`
- [ ] `/systems/material` renders: system name, overview text, "when to reference" guidance, source map table, and a browsable list of content topics linked to their content pages
- [ ] System overview text and source map data come from `_index.md` — no hardcoded strings
- [ ] Content topic links on `/systems/material` point to correct content page paths (Task 1.4 will build those pages, but the links should already be correct)
- [ ] `generateStaticParams` generates routes for all systems returned by `listSystems()`
- [ ] `/systems/nonexistent` returns a Next.js 404 (not a blank page or error)
- [ ] `npm run build` passes; both `/systems` and `/systems/material` appear in build output as static pages
- [ ] Both pages tested in browser: content renders, links are correct, no console errors
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created: `"Phase 1, Task 1.3 — System browser"`

---

## Task 1.4 — KB content pages

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds per-topic content pages at `/systems/[slug]/[...path]`. The catch-all path corresponds to a stub file path in the KB: e.g. `/systems/material/guidance/foundations/color-system` maps to the stub at `material/guidance/foundations/color-system.md`, which the data layer follows to the versioned file. Renders the file's frontmatter metadata (retrieved date, source URL, status) and its markdown body as styled HTML.

### Files created or modified

- `src/app/systems/[slug]/[...path]/page.tsx` — content page (stub-following, markdown render)
- `src/components/kb/ContentMeta.tsx` — frontmatter metadata display (retrieved date, source URL, version label)
- `src/components/kb/MarkdownBody.tsx` — markdown-to-HTML renderer

### Acceptance criteria

- [ ] `/systems/material/guidance/foundations/color-system` renders the content of `color-system@2026-05-11.md` — not the stub file itself
- [ ] All 12 Material KB stub paths resolve and render without errors:
  - `guidance/foundations/colors`
  - `guidance/foundations/color-system`
  - `guidance/foundations/color-roles`
  - `guidance/foundations/design-tokens`
  - `guidance/foundations/typography`
  - `guidance/foundations/shape`
  - `implementation/getting-started`
  - `implementation/tokens/token-schema`
  - `assets/tokens/colors` (JSON asset rendered as fenced code block or structured view)
  - `assets/tokens/typography`
  - `assets/tokens/shape`
  - `design-md/DESIGN`
- [ ] Each content page displays: retrieved date, source URL (as a link), version label, content type, and status from frontmatter
- [ ] Markdown body renders correctly: headings, paragraphs, lists, tables, fenced code blocks all styled
- [ ] A path with no corresponding stub (e.g. `/systems/material/guidance/foundations/nonexistent`) returns a 404
- [ ] `generateStaticParams` generates all 12 Material content routes
- [ ] `npm run build` passes; all 12 content pages appear in build output
- [ ] All 12 pages tested in browser by navigating from the system browser: content is readable, tables render, code blocks are formatted
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created: `"Phase 1, Task 1.4 — KB content pages"`

---

## Task 1.5 — Playbook browser

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds the playbook browser at `/playbooks`. The index lists all plays from `_meta/TASK_PLAYBOOKS.md` organized by category, with tier badges. Each play has its own page at `/playbooks/[play-id]` that renders the full play content and a **copy prompt button** that copies the play's prompt text to the clipboard. No interactive variable substitution yet (Phase 3) — the prompt is copied as-is.

### Files created or modified

- `src/app/playbooks/page.tsx` — playbook index grouped by category
- `src/app/playbooks/[id]/page.tsx` — individual play page with copy button
- `src/components/playbooks/TierBadge.tsx` — tier 1/2/3 badge component
- `src/components/playbooks/CopyButton.tsx` — clipboard copy button (client component)

### Acceptance criteria

- [ ] `/playbooks` lists all plays from `loadPlaybooks()`, grouped by category (Category 1: Color System Tasks, etc.)
- [ ] Each play entry on the index shows: play ID, title, tier badge, and a link to the play's detail page
- [ ] `/playbooks/1.1` (and equivalents for all plays) renders: title, tier, trigger phrases, and the full play prompt text
- [ ] Copy button on each play page copies the full prompt text to the clipboard
- [ ] Copy button tested in browser: clicking it copies the text; pasting elsewhere confirms the correct content was copied
- [ ] Tier badge visually distinguishes Tier 1, 2, and 3 (different color or label is sufficient)
- [ ] `/playbooks/nonexistent` returns a 404
- [ ] `generateStaticParams` generates routes for all plays
- [ ] `npm run build` passes; playbook pages appear in build output
- [ ] All playbook index and at least 3 detail pages tested in browser: content renders, copy button works
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created: `"Phase 1, Task 1.5 — Playbook browser"`

---

## Task 1.6 — Landing page

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

Builds the real landing page at `/`, replacing the Task 1.1 placeholder. The landing page introduces Sistema: what it is, what the KB contains, and how to use KB content in an AI coding session. It links into the working system browser and playbook browser. Design is functional; visual polish is Phase 4.

### Files created or modified

- `src/app/page.tsx` — full landing page (replaces placeholder)

### Acceptance criteria

- [ ] Landing page has at minimum three sections with real copy (no Lorem Ipsum):
  1. **Hero / what it is** — introduces Sistema and the KB concept
  2. **How to use it** — explains how to incorporate a DESIGN.md or KB file into an AI coding session (concrete example)
  3. **What's available** — links into the system browser and playbook browser
- [ ] Links to `/systems` and `/playbooks` are present and navigate correctly
- [ ] Page renders correctly on mobile (375px viewport) and desktop (1280px) — no layout breakage
- [ ] `npm run build` passes
- [ ] Page reviewed in browser: copy reads well, links work, no console errors
- [ ] Vercel preview updated; landing page accessible at preview URL
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created: `"Phase 1, Task 1.6 — Landing page"`

---

## Task 1.7 — Phase 1 housekeeping

**Status:** not started
**Phase:** 1
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping. Compresses completed task entries in this file, archives Phase 1 session log entries, updates `AGENTS.md` to reflect the app layer, writes the Phase 1 retrospective, and generates and reviews `tasks/phase-2.md`.

### Files created or modified

- `tasks/phase-1.md` — all task entries compressed to summary form
- `tasks/phase-2.md` — generated and reviewed
- `SESSION_LOG.md` — Phase 1 entries removed; pointer to archive; Current State updated
- `logs/phase-1.md` — Phase 1 session entries archived here
- `AGENTS.md` — Patterns section and repo structure updated for app layer
- `docs/phase-1-retro.md` — brief retrospective

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-1.md` compressed: status, one-sentence output, key decisions, session log pointer
- [ ] All Phase 1 session entries moved from `SESSION_LOG.md` to `logs/phase-1.md`
- [ ] `SESSION_LOG.md` contains pointer to `logs/phase-1.md` and Current State showing Phase 2 pending
- [ ] `AGENTS.md` repository structure block reflects `src/` as built; any app patterns from Phase 1 added to Patterns section
- [ ] `docs/phase-1-retro.md` written: what went smoothly, what was harder than expected, decisions not documented elsewhere, what to do differently in Phase 2
- [ ] `tasks/phase-2.md` generated; any issues flagged in `SESSION_LOG.md`
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/` reports **zero errors**
- [ ] `npm run build` passes before housekeeping commit
- [ ] Commit created: `"Phase 1, Task 1.7 — housekeeping and phase close"`
