# Phase 1 Session Log

*Archived from SESSION_LOG.md at Phase 1 close.*

---

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

**Vercel deployment:** Not yet connected — requires pushing to a Vercel-linked repo or connecting via Vercel dashboard. Carried to Phase 2 Task 2.1.

---

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
- Playbook `body` field holds the full markdown entry — updated to agent-ready prompt text in Task 1.5 revision

---

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

---

### 2026-05-11 — Task 1.4: KB content pages

**What was done:**
- Created `src/app/systems/[slug]/[...path]/page.tsx` — catch-all content page with breadcrumb, `<ContentMeta>`, and `<MarkdownBody>` or JSON `<pre><code>` rendering; `notFound()` on missing stubs
- Created `src/components/kb/ContentMeta.tsx` — frontmatter metadata pills (content_type, status, version_label, retrieved date, source URL link, derived_from count)
- Updated `resolveStub` to detect `.json` versioned files by extension; parses `_meta` as frontmatter, serializes remainder as body; sets `isJson: true`
- Updated `listStubsForSystem` to include `.json` stub files (asset tokens); updated `readStubTarget` to try `.md` first, then `.json`
- Made `category` optional in `ContentFrontmatter` — JSON asset `_meta` blocks omit it
- Build produces 18 static pages: `/` + `/_not-found` + `/systems` + `/systems/material` + 12 content pages (6 guidance + 2 implementation + 3 assets + 1 design-md)

**Decisions made:**
- JSON asset files rendered as `<pre><code>` with a brief "Token values as CSS custom properties" label — no attempt to parse or format the JSON structure further
- Breadcrumb omits intermediate path segments as links (only system slug is linked); full segment chain shown
- `formatSegment` used for h1 title — slugified names capitalized word-by-word

---

### 2026-05-11 — Task 1.5: Playbook browser (revised after playbook rethink)

**What was done (initial build):**
- Created `/playbooks` index and `/playbooks/[id]` per-play pages with tier badges and copy button (16 plays, numeric IDs, category grouping)

**Revised (same session) after strategic discussion:**
- Rewrote `_meta/TASK_PLAYBOOKS.md` with 12 generative plays in new format (`## slug — Title / **Stage:** N / **Tags:** ...`)
- Dropped all pure-research plays; all plays are now generative or transformative
- Play bodies are complete agent-ready prompts with `{{sistema_url}}` placeholders substituted at copy time
- Updated `Play` type: `slug`, `stage`, `tags`; removed `id`, `categoryNumber`, `category`, `tier`
- Rewrote `playbooks.ts` parser; added `loadStages()` and `STAGE_LABELS` export
- Renamed `[id]` → `[slug]` route; playbook index groups by stage with stage number + label
- `CopyButton` resolves `{{sistema_url}}` with `window.location.origin` before clipboard write
- Removed `TierBadge` component

**Key strategic decisions:**
- Stage ordering (1=system definition, 2=primitive tokens, 3=semantic layer, 4=components, 5=migration) replaces category grouping — makes build order explicit
- Plays reference hosted Sistema URLs, not embedded KB content — portability over self-containment
- Prompt text refinement deferred to Phase 2 after live testing validates what actually produces good output
- Play testing approach: copy play, paste into coding agent against scratch repo, inspect quality of generated output

---

### 2026-05-11 — Task 1.6: Landing page

**What was done:**
- Replaced placeholder `src/app/page.tsx` with three-section landing page
- Hero: headline, two-paragraph value prop, "Open playbook" and "Browse systems" CTAs
- How to use it: three numbered steps with a concrete example callout (Generate a Primitive Color Palette flow)
- What's available: two linked cards (knowledge base + playbook) with live counts from `listSystems()`, `loadPlaybooks()`, `loadStages()`

**Decisions made:**
- System names in the knowledge base card pulled dynamically via `readSystemIndex()` — no hardcoded strings
- Stage list in the playbook card uses `loadStages()` so it stays in sync as plays are added
