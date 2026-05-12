# SESSION_LOG.md

## Current State

**Phase:** 1
**Last completed task:** 1.3 — System browser
**Next task:** 1.4 — KB content pages
**Blockers:** None
**Notes:** `/systems` and `/systems/material` statically generated. `/systems/nonexistent` → 404. Nav present on all pages.

---

## Session log

*Phase 0 session entries archived to `logs/phase-0.md`.*

### 2026-05-11 — Task 1.1: Next.js initialization

**What was done:**
- Added root `package.json` with Next.js 15.5.18, React 19.1.0, TypeScript, Tailwind CSS 3.4.17, ESLint
- Added `next.config.ts`, `tsconfig.json` (excludes `tools/`), `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`
- Created `src/app/layout.tsx` (root layout with metadata), `src/app/page.tsx` (placeholder), `src/styles/globals.css` (Tailwind directives)
- Added `.next/` to `.gitignore`
- `npm install` clean; `npm run build` passes (4 static pages generated)
- `npx tsx tools/validate/lint-frontmatter.ts material/` still passes — tools package unaffected

**Decisions made:**
- Tailwind CSS v3 (not v4) — v3 uses `tailwind.config.ts` + `postcss.config.js` as specified in the task; v4 would require a different config approach
- `tsconfig.json` explicitly excludes `tools/` so the two TypeScript configs remain independent
- Next.js auto-added `"target": "ES2017"` to tsconfig during build — left in place

**Vercel deployment:** Not yet connected — requires pushing to a Vercel-linked repo or connecting via Vercel dashboard.

### 2026-05-11 — Task 1.3: System browser

**What was done:**
- Installed `react-markdown`, `remark-gfm`, `@tailwindcss/typography`
- Created `src/components/kb/MarkdownBody.tsx` — prose-styled markdown renderer using react-markdown + remark-gfm
- Created `src/components/layout/Nav.tsx` — top nav with Sistema logo, Systems and Playbooks links
- Updated `src/app/layout.tsx` to include Nav in root layout
- Created `src/app/systems/page.tsx` — lists all systems from `listSystems()`, extracts name and description from `_index.md`
- Created `src/app/systems/[slug]/page.tsx` — renders system name, Overview section, Source Map, and Browse Content sidebar from `listStubsForSystem()`; `notFound()` for unknown slugs; `generateStaticParams` covers all systems
- Verified: `/systems` → "Material Design 3" card renders; `/systems/material` → all sections render; `/systems/nonexistent` → 404

**Decisions made:**
- System name extracted from `_index.md` H1, stripping " — System Index" suffix
- Overview and Source Map sections extracted by regex from the markdown body — no separate frontmatter needed in `_index.md`
- Content links use `listStubsForSystem()` (stub filenames, not `_index.md` Content Inventory rows) to ensure URLs match the actual stub paths
- Sidebar layout: content browser on the right at `lg:` breakpoint, stacked on mobile

### 2026-05-11 — Task 1.2: KB data layer

**What was done:**
- Added `gray-matter` to root `package.json` for frontmatter parsing
- Created `src/lib/types.ts`: `ContentFrontmatter`, `StubFrontmatter`, `ContentFile`, `SystemIndex`, `Play` interfaces
- Created `src/lib/kb.ts`: `listSystems()`, `readSystemIndex()`, `resolveStub()`, `listStubsForSystem()`
- Created `src/lib/playbooks.ts`: `loadPlaybooks()`, `loadCategories()`
- Wired `listSystems()` and `loadPlaybooks()` into `src/app/page.tsx` to exercise at build time
- `npm run build` passes; verified: `listSystems()` → `['material']`, `resolveStub('material/guidance/foundations/color-system')` → correct versioned file, `loadPlaybooks()` → 16 plays

**Decisions made:**
- `listStubsForSystem` identifies stubs by filename convention (no `@` in name, not `_index.md`) rather than reading every file's frontmatter — faster and correct given the naming contract
- `resolveStub` takes a path without `.md` extension and without leading slash, matching what URL paths will look like in the catch-all route
- Playbook `body` field holds the full markdown entry — the copy button in Task 1.5 will copy this as-is; variable substitution is Phase 3
