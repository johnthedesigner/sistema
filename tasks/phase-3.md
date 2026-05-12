# Phase 3 Task File — Compressed

**Phase goal:** Add interactive fields to the most-used playbooks, expand KB with Primer (GitHub), add component-level documentation, and ship exemplar previews on playbook pages.

**Completed:** 2026-05-12 | **Retro:** `docs/phase-3-retro.md` | **Log:** `logs/phase-3.md`

---

## Task 3.1 — Interactive playbook fields ✓
Added `{{variable_name}}` auto-detection to play bodies. `PlayForm` client component renders labeled textareas and substitutes all values at copy time. `NEXT_PUBLIC_SITE_URL` env var set via `.env.local` (static ngrok domain); also fixes `{{sistema_url}}` display in rendered body. Files: `src/components/playbooks/PlayForm.tsx`, `src/components/playbooks/CopyButton.tsx` (updated), `src/app/playbooks/[slug]/page.tsx` (updated), `_meta/TASK_PLAYBOOKS.md` (3 plays updated with `{{variable_name}}` tokens).

## Task 3.2 — Exemplar content creation ✓
Two vetted example outputs: `_meta/exemplars/design-md-files/generate-design-md-example.md` (527 lines; "Meridian" SaaS DESIGN.md) and `_meta/exemplars/semantic-token-systems/generate-color-scheme-example.md` (189 lines; CSS color scheme). Both internally consistent; dark mode follows M3 tonal logic; non-obvious decisions annotated.

## Task 3.3 — Exemplar previews on play pages ✓
`loadExemplar(playSlug)` scans `_meta/exemplars/**/*.md` matching `play_slug` frontmatter. `ExemplarPreview` renders a `<details>`/`<summary>` collapsible section below the play body. Files: `src/lib/exemplars.ts`, `src/components/playbooks/ExemplarPreview.tsx`, `src/app/playbooks/[slug]/page.tsx` (updated).

## Task 3.4 — Primer (GitHub) KB capture ✓
primer.style is fully JS-rendered (Firecrawl: 0 pages); all content sourced from GitHub raw URLs (`primer/design` MDX + `primer/primitives` JSON5). 5 content files + 5 stubs + `_index.md`. Coverage: color-system, typography, button, functional color tokens, DESIGN.md. INDEX.md updated to v1.4 (4 systems, 30 files). Coverage gaps: implementation docs and compiled token hex values.

## Task 3.5 — Component documentation: Material and Carbon ✓
8 component files (4 Material: button, text-field, dialog, navigation-bar; 4 Carbon: button, text-input, modal, ui-shell) + 8 stubs. Sources: m3.material.io scrape + GitHub MDX. INDEX.md updated to v1.5 (38 files); sections 2.7–2.10 populated. Fix: `content_type: component` is invalid — must be `guidance`.

## Task 3.6 — Guide page ✓
Static page at `/guide` with three sections (DESIGN.md setup, KB URL referencing, end-to-end play walkthrough) and a stage × play quick reference table. "Guide" nav link added. Files: `src/app/guide/page.tsx`, `src/components/layout/Nav.tsx` (updated).

## Task 3.7 — Phase 3 housekeeping ✓
Compressed this task file. Archived session entries to `logs/phase-3.md`. Wrote `docs/phase-3-retro.md`. Updated `AGENTS.md` with Phase 3 patterns. Generated `tasks/phase-4.md`. Lint and build passing.
