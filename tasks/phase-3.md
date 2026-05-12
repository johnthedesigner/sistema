# Phase 3 Task File

**Phase goal:** Add interactive fields to the most-used playbooks, expand KB with Primer (GitHub), add component-level documentation, and ship exemplar previews on playbook pages.

**Systems touched:** `primer/` (new), `material/` + `carbon/` (component additions)
**App:** Interactive form fields in playbook UI; exemplar preview rendering; "How to use" guide page

**Context from Phase 2b:**
- 3 design systems: Material, Carbon, Atlassian — all at `kb/design-systems/`; routes at `/kb/design-systems/[slug]`
- 49 static pages; raw endpoint at `/raw/`; bundle endpoint at `/bundle/`; frontmatter lint passing
- Vercel deployed at https://sistema-bay-seven.vercel.app
- Exemplars not yet created (deferred from Phase 2 — must be created before 3.2 UI work)
- Playwright available in `tools/` but not yet used — preferred over CDN fallback for JS-heavy pages

---

## Task 3.1 — Interactive playbook fields

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Adds user-fillable template fields to the most-used playbook prompts. Currently all plays are static copyable text with only `{{sistema_url}}` substituted automatically. This task introduces a `{{variable_name}}` syntax for user-supplied values (e.g. `{{accent_color}}`, `{{product_type}}`, `{{system_name}}`), a form UI on each play page that renders labeled text inputs for each variable detected in the play body, and a copy button that substitutes all variables before clipboard write. Plays without user variables continue to work exactly as before.

Scope: implement for the top 3 most-used plays — `generate-color-scheme` (accent color, product type), `generate-design-md` (system name, primary accent color), and `token-migration` (source system, target system).

### Files created or modified

- `src/components/playbooks/PlayForm.tsx` — detects `{{variable_name}}` tokens in play body; renders labeled inputs; substitutes on copy
- `src/components/playbooks/CopyButton.tsx` — updated to accept variable values map alongside `{{sistema_url}}` substitution
- `src/app/playbooks/[slug]/page.tsx` — wire `PlayForm` into play page; replace static copy block
- `_meta/TASK_PLAYBOOKS.md` — add `{{accent_color}}`, `{{product_type}}`, etc. to applicable play bodies

### Acceptance criteria

- [ ] `{{variable_name}}` syntax detected from play body text — no manual variable registration needed
- [ ] Each variable renders as a labeled text input on the play page
- [ ] Copy button substitutes all variables (including `{{sistema_url}}`) before clipboard write
- [ ] If a user hasn't filled in a variable, the placeholder text `{{variable_name}}` is preserved in the copied text (not silently dropped)
- [ ] Plays with no user variables (`{{sistema_url}}` only) render as before — no input fields shown
- [ ] `generate-color-scheme`, `generate-design-md`, and `token-migration` plays each have at least one user variable
- [ ] All 3 plays tested end-to-end: fill in fields, copy, inspect copied text for correct substitution
- [ ] `npm run build` passes; no TypeScript errors
- [ ] Verified in browser (not just build output): form renders, copy works with and without filled inputs
- [ ] `SESSION_LOG.md` updated with full task entry

---

## Task 3.2 — Exemplar content creation

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Creates vetted exemplar outputs for the two most-used plays: `generate-color-scheme` (Stage 2) and `generate-design-md` (Stage 1). Exemplars are high-quality example outputs that demonstrate what a well-executed play produces — they serve as both quality anchors and preview content on the play page. Each exemplar is a real output from running the play, lightly reviewed and annotated, stored in `_meta/exemplars/`.

This task must come before Task 3.3 (exemplar preview UI), which depends on exemplar files existing.

### Files created or modified

- `_meta/exemplars/semantic-token-systems/generate-color-scheme-example.md` — exemplar output for generate-color-scheme play (a complete CSS custom property color scheme for a sample product)
- `_meta/exemplars/design-md-files/generate-design-md-example.md` — exemplar output for generate-design-md play (a complete DESIGN.md for a sample design system)
- Each exemplar file: frontmatter with `play_slug`, `stage`, `created`, `quality_notes`; body is the actual output with optional annotation callouts

### Acceptance criteria

- [ ] `_meta/exemplars/semantic-token-systems/generate-color-scheme-example.md` exists with real token output (CSS custom properties, light + dark, at least 12 semantic roles)
- [ ] `_meta/exemplars/design-md-files/generate-design-md-example.md` exists with a real DESIGN.md-format output (at least 200 lines; covers color, typography, spacing, components)
- [ ] Both exemplar files have valid frontmatter (`play_slug`, `stage`, `created`, `quality_notes`)
- [ ] Both outputs could plausibly be used by a developer starting a new design system (coherent, no obvious errors)
- [ ] `SESSION_LOG.md` updated with content quality notes and any gaps flagged

---

## Task 3.3 — Exemplar previews on play pages

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Renders an exemplar output inline on its associated play page — collapsible so it doesn't dominate the UI. Each play page checks whether a matching exemplar exists for the play's slug; if one does, shows an "Example output" section below the play body. The exemplar is rendered as `MarkdownBody` content inside a `<details>` element (expand/collapse without JavaScript).

### Files created or modified

- `src/lib/exemplars.ts` — `loadExemplar(playSlug: string): ExemplarFile | null` — reads `_meta/exemplars/**/*` for a file with matching `play_slug` frontmatter
- `src/components/playbooks/ExemplarPreview.tsx` — collapsible `<details>` section rendering exemplar frontmatter + markdown body
- `src/app/playbooks/[slug]/page.tsx` — call `loadExemplar()` and conditionally render `<ExemplarPreview>`

### Acceptance criteria

- [ ] `loadExemplar('generate-color-scheme')` returns the exemplar file; `loadExemplar('nonexistent')` returns null
- [ ] Play pages for `generate-color-scheme` and `generate-design-md` show "Example output" section
- [ ] Section is collapsed by default; expands on click (pure HTML `<details>`/`<summary>`, no JS required)
- [ ] Exemplar body rendered as markdown (same `MarkdownBody` component as KB content pages)
- [ ] Play pages for plays without exemplars show no "Example output" section (no empty section visible)
- [ ] `npm run build` passes; exemplar pages appear in static output
- [ ] Verified in browser: expand/collapse works; content renders correctly
- [ ] `SESSION_LOG.md` updated

---

## Task 3.4 — Primer (GitHub) KB capture

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Full Procedure A from `_meta/MAINTENANCE.md` for GitHub Primer Design System. Primer has a notably clean semantic color token model and a strong set of component documentation, making it a useful contrast to Atlassian (enterprise all-semantic) and Material (three-tier dynamic color). Priority: color system guidance, typography, component foundations (Button, FormControl). Token assets from the `@primer/primitives` GitHub package.

Use Playwright instead of Firecrawl for any pages that may be JS-rendered. The `tools/` directory has Playwright as a dependency — use it if Firecrawl returns fewer than 10 pages on a subsection with known content.

### Files created or modified

- `kb/design-systems/primer/_index.md` — system index
- `kb/design-systems/primer/guidance/foundations/color-system@2026-05-12.md` + stub — color roles, semantic naming, functional colors
- `kb/design-systems/primer/guidance/foundations/typography@2026-05-12.md` + stub — typeface, typescale tokens
- `kb/design-systems/primer/guidance/components/button@2026-05-12.md` + stub — button variants, sizes, states, tokens
- `kb/design-systems/primer/assets/tokens/colors@2026-05-12.json` + stub — semantic color token values (light theme)
- `kb/design-systems/primer/design-md/DESIGN@2026-05-12.md` + stub — DESIGN.md for Primer
- `_meta/INDEX.md` — updated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `kb/design-systems/primer/_index.md` exists with complete Overview, Source Map, and Content Inventory sections
- [ ] At minimum 3 content files present (color guidance, typography, and one component)
- [ ] `kb/design-systems/primer/assets/tokens/colors.json` contains real token values (not empty; at least 20 semantic color roles)
- [ ] `kb/design-systems/primer/design-md/DESIGN.md` stub exists pointing to generated DESIGN.md
- [ ] `npx tsx tools/validate/lint-frontmatter.ts kb/design-systems/primer/` reports zero errors
- [ ] `/kb/design-systems/primer` renders in the app; content pages reachable
- [ ] `npm run build` passes; Primer routes appear in build output
- [ ] `_meta/INDEX.md` and `_meta/CHANGELOG.md` updated
- [ ] `SESSION_LOG.md` updated with scrape passes, coverage gaps, content decisions

---

## Task 3.5 — Component documentation: Material and Carbon

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Adds component-level guidance for four components across Material and Carbon: Button, Form elements (Input/TextField), Navigation, and Dialog/Modal. These are the highest-priority component categories in the coverage matrix. Component documentation captures: variants, sizes, states, token mapping, accessibility notes. Sourced from the official documentation sites and GitHub (component source files for token usage).

### Files created or modified

**Material:**
- `kb/design-systems/material/guidance/components/button@2026-05-12.md` + stub
- `kb/design-systems/material/guidance/components/text-field@2026-05-12.md` + stub
- `kb/design-systems/material/guidance/components/navigation@2026-05-12.md` + stub
- `kb/design-systems/material/guidance/components/dialog@2026-05-12.md` + stub
- `kb/design-systems/material/_index.md` — Content Inventory updated

**Carbon:**
- `kb/design-systems/carbon/guidance/components/button@2026-05-12.md` + stub
- `kb/design-systems/carbon/guidance/components/text-input@2026-05-12.md` + stub
- `kb/design-systems/carbon/guidance/components/navigation@2026-05-12.md` + stub
- `kb/design-systems/carbon/guidance/components/modal@2026-05-12.md` + stub
- `kb/design-systems/carbon/_index.md` — Content Inventory updated

**Meta:**
- `_meta/INDEX.md` — Sections 2.7–2.10 (component categories) populated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] All 8 component files exist and have valid frontmatter (lint passing)
- [ ] Each file covers: variants, sizes or emphasis levels, interaction states, relevant tokens (by name, not value), and at minimum one accessibility note
- [ ] `npx tsx tools/validate/lint-frontmatter.ts kb/design-systems/material/ kb/design-systems/carbon/` reports zero errors
- [ ] Component content pages render in browser for both systems
- [ ] `_meta/INDEX.md` Sections 2.7–2.10 each have at least one row (no more `*(none yet)*` placeholders for Button, Form, Navigation, Dialog)
- [ ] `npm run build` passes
- [ ] `SESSION_LOG.md` updated

---

## Task 3.6 — "How to use this" guide page

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

Adds an educational guide page at `/guide` (or `/how-to`) that explains the Sistema workflow in concrete terms: how to use DESIGN.md files in a Claude Code session, how to reference KB URLs in prompts, and how to run playbooks step-by-step. This is educational content for new users who understand the landing page value prop but need a concrete walkthrough before they trust the product.

Content includes: where to put a DESIGN.md in a project, how to add KB content URLs to a Claude Code prompt, a worked example of the full Stage 1→2→3 flow for a hypothetical product, and a quick reference table (play → what it produces → when to use it).

### Files created or modified

- `src/app/guide/page.tsx` — static guide page with structured sections
- `src/components/layout/Nav.tsx` — "Guide" link added to nav
- Content is authored inline in the page component (not from KB files — this is app UI content)

### Acceptance criteria

- [ ] `/guide` renders with at minimum three sections: "Adding DESIGN.md to your project", "Referencing KB content in prompts", and "Running a playbook end-to-end"
- [ ] "Guide" appears in the top nav and links to `/guide`
- [ ] The worked example uses a real KB URL (from the deployed Vercel deployment, not localhost)
- [ ] The quick reference table covers all 5 stages and at least one play per stage
- [ ] Page is readable on mobile (no horizontal overflow)
- [ ] `npm run build` passes; `/guide` appears in build output
- [ ] Verified in browser (desktop and mobile viewport)
- [ ] `SESSION_LOG.md` updated

---

## Task 3.7 — Phase 3 housekeeping

**Status:** not started
**Phase:** 3
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping. Compresses task file, archives session log entries, updates AGENTS.md with any new Phase 3 patterns, writes the Phase 3 retrospective, and generates `tasks/phase-4.md` for review.

### Files created or modified

- `tasks/phase-3.md` — all task entries compressed
- `tasks/phase-4.md` — generated and reviewed
- `SESSION_LOG.md` — Phase 3 entries removed; pointer to archive; Current State updated
- `logs/phase-3.md` — Phase 3 session entries archived
- `AGENTS.md` — any new patterns from Phase 3 added
- `docs/phase-3-retro.md` — brief retrospective

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-3.md` compressed to summary form
- [ ] All Phase 3 session entries moved from `SESSION_LOG.md` to `logs/phase-3.md`
- [ ] `SESSION_LOG.md` contains pointer to archive and Current State showing Phase 4 pending
- [ ] `AGENTS.md` updated with any new patterns
- [ ] `docs/phase-3-retro.md` written
- [ ] `tasks/phase-4.md` generated and any issues flagged
- [ ] `npx tsx tools/validate/lint-frontmatter.ts kb/design-systems/material/ kb/design-systems/carbon/ kb/design-systems/atlassian/ kb/design-systems/primer/` passes
- [ ] `npm run build` passes
- [ ] Commit created
