# Phase 1 Task File — COMPLETE

**Phase goal:** Build the Next.js app and make it fully functional with the existing Material Design 3 content.
**Status:** All tasks complete. Session entries archived to `logs/phase-1.md`.

---

## Task 1.1 — Next.js initialization
**Status:** complete | **Log:** `logs/phase-1.md`
Initialized Next.js 15 App Router with React 19, TypeScript, Tailwind CSS v3, ESLint at repo root. `tools/` remains its own isolated package. Build passes; 4 static pages generated.
**Key decisions:** Tailwind v3 (not v4); `tsconfig.json` excludes `tools/`; Next.js auto-added `"target": "ES2017"` left in place.
**Note:** Vercel deployment deferred — carried to Phase 2 Task 2.1.

---

## Task 1.2 — KB data layer
**Status:** complete | **Log:** `logs/phase-1.md`
Built `src/lib/kb.ts` (listSystems, readSystemIndex, resolveStub, listStubsForSystem) and `src/lib/playbooks.ts` (loadPlaybooks, loadStages). All KB reads happen at build time via Node `fs`.
**Key decisions:** Stubs identified by filename convention (no `@`, not `_index.md`); `resolveStub` takes paths without extension; `.json` stub extension added mid-task when asset stubs discovered.

---

## Task 1.3 — System browser
**Status:** complete | **Log:** `logs/phase-1.md`
Built `/systems` index and `/systems/[slug]` per-system page. System name, overview, source map extracted from `_index.md` via regex. Content links from `listStubsForSystem()`. `/systems/nonexistent` → 404.
**Key decisions:** No frontmatter on `_index.md` — regex extraction from markdown body; sidebar layout at `lg:` breakpoint.

---

## Task 1.4 — KB content pages
**Status:** complete | **Log:** `logs/phase-1.md`
Built `/systems/[slug]/[...path]` catch-all route. Follows stub → versioned file; renders `ContentMeta` pills and `MarkdownBody` (or JSON `<pre><code>` for asset files). 18 static pages total including all 12 Material content routes.
**Key decisions:** JSON asset files detected by `.json` extension in `resolveStub`; `category` made optional in `ContentFrontmatter`; breadcrumb only links system slug.

---

## Task 1.5 — Playbook browser
**Status:** complete (revised mid-session) | **Log:** `logs/phase-1.md`
Built `/playbooks` index grouped by build stage and `/playbooks/[slug]` per-play pages with clipboard copy. After strategic rethink: replaced 16 numeric-ID research-and-generative plays with 12 slug-ID generative plays ordered by stage. `CopyButton` resolves `{{sistema_url}}` with `window.location.origin` at copy time.
**Key decisions:** Stage ordering (1–5: system definition → primitives → semantic → components → migration) replaces category grouping; plays are agent-ready prompts with hosted reference URLs, not instructions-to-reader; tier concept retired.

---

## Task 1.6 — Landing page
**Status:** complete | **Log:** `logs/phase-1.md`
Replaced placeholder with real landing page: hero with value prop, three-step how-to with concrete color palette example, dynamic knowledge base and playbook cards.
**Key decisions:** All counts pulled dynamically from `listSystems()`, `loadPlaybooks()`, `loadStages()`; no hardcoded system or play names.

---

## Task 1.7 — Phase 1 housekeeping
**Status:** complete | **Log:** `logs/phase-1.md`
Compressed task file, archived session log, updated AGENTS.md, wrote phase retro, generated `tasks/phase-2.md`.
