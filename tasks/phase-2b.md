# Phase 2b Task File

**Phase goal:** Restructure the KB into a typed directory hierarchy, expose raw markdown at predictable URLs, elevate the DESIGN.md workflow, and add a bundle endpoint for multi-file plays.

**Systems touched:** all existing KB content (moved, not rewritten)
**App:** significant routing changes; new endpoints; new pages

**Context from Phase 2:**
- KB content currently lived at repo root: `material/`, `carbon/`, `atlassian/`
- App routes: `/systems/[slug]` and `/systems/[slug]/[...path]`
- 46 static pages; Vercel deployed at https://sistema-bay-seven.vercel.app
- No raw markdown access; DESIGN.md reachable only through content browser

---

## Task 2b.1 — KB directory restructure ✓

Moved `material/`, `carbon/`, `atlassian/` → `kb/design-systems/`; created `kb/standards/_index.md` and `kb/foundations/_index.md`; rewrote `src/lib/kb.ts` to be category-aware (`KB_BASE`, `KB_CATEGORIES`, `KBCategory`); replaced `src/app/systems/` with `src/app/kb/` route tree (landing, category, system overview, content pages); content page URLs require `.md` on last segment with redirect enforcement; added `/systems/:path*` → `/kb/design-systems/:path*` redirect in `next.config.ts`; updated nav, landing page, `_meta/INDEX.md`, `AGENTS.md`. Build: 49 pages. See `logs/phase-2b.md`.

## Task 2b.2 — Raw markdown endpoint ✓

Created `src/app/raw/[category]/[slug]/[...path]/route.ts` returning `text/plain; charset=utf-8`; strips `.md` from last segment before stub lookup; 404 for missing stubs. Created `src/components/kb/CopyRawButton.tsx` (fetches raw URL, copies to clipboard). Updated content pages with CopyRawButton + Raw link. Updated all 30 `{{sistema_url}}` references in `TASK_PLAYBOOKS.md` from `/systems/material/PATH` to `/raw/design-systems/material/PATH.md`. Build: 49 pages. See `logs/phase-2b.md`.

## Task 2b.3 — DESIGN.md prominence and quick start ✓

Added `findDesignMd(slug, category)` to `src/lib/kb.ts`; created `src/components/kb/DesignMdPanel.tsx` (three copy actions: DESIGN.md content, raw URL, quick-start prompt; `useEffect` for origin hydration); mounted panel on system overview pages above content grid when DESIGN.md stub present. Panel renders for material, carbon, atlassian; absent on standards/foundations. Build: 49 pages. See `logs/phase-2b.md`.

## Task 2b.4 — Bundle endpoint ✓

Created `src/app/bundle/[category]/[slug]/route.ts` — concatenates multiple KB files as `text/plain`; default: all guidance stubs then design-md/DESIGN; `?topics=` selects specific files; missing topics skipped with HTML comment; 404 for unknown system. Updated `AGENTS.md` with bundle URL pattern. Updated `generate-design-md` (default bundle) and `plan-token-architecture` (`?topics=` bundle) plays. Build: 49 pages. See `logs/phase-2b.md`.

## Task 2b.5 — Phase 2b housekeeping ✓

Compressed task file; archived session log to `logs/phase-2b.md`; wrote `docs/phase-2b-retro.md`; updated `tasks/phase-3.md` for new URL structure; lint + build passing. See `logs/phase-2b.md`.
