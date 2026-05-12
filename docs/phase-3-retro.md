# Phase 3 Retrospective

**Date:** 2026-05-12
**Tasks:** 3.1–3.7
**Build at end:** ~63 pages (55 + 8 new component routes)

---

## What Phase 3 accomplished

Phase 3 made the playbook interactive, gave KB content a quality anchor system, added the fourth design system (Primer), expanded component coverage across Material and Carbon, and shipped an educational guide page.

The six concrete deliverables:

- **Interactive playbook fields (3.1):** `{{variable_name}}` syntax detected from play body text at render time. `PlayForm` client component renders labeled textareas and substitutes all values (including `{{sistema_url}}`) at copy time. Plays without variables continue to show the original `CopyButton`. Variable detection is automatic — no registration needed. Unfilled variables preserve the placeholder in copied text rather than silently dropping.
- **Exemplar content (3.2):** Two vetted example outputs created for the top plays — a 527-line "Meridian" DESIGN.md and a 189-line CSS color scheme. Both are internally consistent (primitive palette ↔ semantic tokens), annotated on non-obvious decisions, and serve as both quality anchors and preview content.
- **Exemplar previews (3.3):** Play pages that have a matching exemplar show a collapsible "Example output" section via `<details>`/`<summary>`. Pure HTML, no JavaScript. `loadExemplar()` matches by `play_slug` frontmatter field — scanning the exemplars directory, not a registry.
- **Primer KB capture (3.4):** GitHub Primer Design System documented. Source: MDX files from `primer/design` repo + JSON5 token files from `primer/primitives`. Primer's doc site (primer.style) is fully JS-rendered; GitHub raw URL approach is the definitive pattern for similar SPAs going forward.
- **Component documentation (3.5):** 4 components × 2 systems = 8 KB files. Material: button (5 variants + M3 Expressive), text-field, dialog, navigation-bar. Carbon: button (7 kinds), text-input, modal, ui-shell (Header + SideNav). All with variant tables, token names, states, and accessibility notes.
- **Guide page (3.6):** `/guide` — three-section walkthrough (DESIGN.md setup, KB URL referencing, end-to-end playbook run) plus a full stage × play quick reference table. "Guide" link added to nav.

---

## What worked well

**`{{variable_name}}` auto-detection** was the right design. No registration step, no config — the parser scans the body at render time. A play author just types `{{accent_color}}` and the form field appears. The pattern also composes cleanly with `{{sistema_url}}`: both are substituted at copy time, neither bleeds into the rendered display body.

**GitHub raw URL sourcing for Primer** was faster and cleaner than any scraping approach would have been. MDX source files from `primer/design` are well-structured and directly usable as KB content with minimal transformation. This is the right pattern for any design system whose doc site is a fully JS-rendered SPA but whose source is on GitHub.

**`<details>`/`<summary>` for exemplar previews** kept the implementation trivial and the page behavior correct. No hydration, no JS bundle impact, no state management. The pattern will hold for any future collapsible sections.

**NEXT_PUBLIC_SITE_URL in `.env.local`** with a static ngrok domain solved the localhost testing problem permanently. No more `{{sistema_url}}` showing as a literal in rendered play bodies.

---

## What was harder than expected

**`content_type: component` was not a valid linter value.** The linter accepts only `guidance`, `implementation`, `asset`, `design-md`. The component files were written with `content_type: component`, which failed lint. Fixed with a bulk `sed` replacement. The linter's valid type list should be referenced before writing new file types — it's defined in `tools/validate/lint-frontmatter.ts`.

**Carbon UIShell MDX** had almost no content — the file is a Storybook template shell that delegates to `ArgTypes` components rather than containing prose documentation. Had to rely on carbondesignsystem.com and training knowledge for the actual content. Same issue applies to any `*.mdx` file in Carbon's Storybook source.

**Parallel Firecrawl scrapes** caused a 429 rate limit error. Sequential scraping with natural wait time between calls is required. Already documented in AGENTS.md but bears repeating.

---

## Decisions made

- **Component `content_type` is `guidance`, not `component`** — the linter vocabulary covers file roles (guidance, implementation, asset, design-md), not component categories. Component files live in `guidance/components/` and have `content_type: guidance`.
- **Carbon UIShell captures Header + SideNav as a single file** — the UI Shell is one logical unit in Carbon even though it's multiple React components. Splitting by component would produce thin files with duplicated context.
- **Phase 4 defers remaining component docs and new design systems** — the higher-leverage Phase 4 work is standards/foundations KB examples and playbook workflow refinement. Full component coverage across all systems is Phase 5 scope.
- **DESIGN.md is the right first artifact in the dogfood plan** — generating a DESIGN.md for Sistema itself validates Stage 1 end-to-end and produces something immediately useful to subsequent sessions.

---

## Carry-forward to Phase 4

- **Remaining component docs** (badges, cards, tabs, data tables, etc.) and additional design systems (Radix, Ant Design) deferred to Phase 5.
- **Primer coverage gaps**: implementation docs (React API, CSS utilities) and actual token hex values (from `primer/primitives` compiled dist) not captured. Available via jsDelivr if needed in Phase 5.
- **Playbook workflow refinements** are Phase 4 scope: better stage navigation, two-column play layout, variable field UX improvements.
- **Standards and foundations KB examples** are Phase 4 scope: one WCAG reference, one design theory piece — enough to show the breadth of the KB without requiring full coverage.
