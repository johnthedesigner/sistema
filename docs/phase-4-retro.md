# Phase 4 Retrospective

**Date:** 2026-05-12
**Tasks:** 4.1–4.6
**Build at end:** 79 static pages

---

## What Phase 4 accomplished

Phase 4 expanded the KB into two new categories, corrected a critical process failure on sourcing, established durable category definitions, and substantially improved the app's navigability on both the playbook and KB sides.

The six concrete deliverables:

- **DESIGN.md spec capture (4.1):** Official two-layer format scraped from stitch.withgoogle.com — YAML front matter (machine-readable tokens) + markdown body (8 `##` sections). Critically: the initial capture used an unofficial community reconstruction (awesome-design-md README). Firecrawl was the correct tool, caught the error, and produced the accurate spec. Process rules updated in AGENTS.md to prevent recurrence.
- **WCAG 2.2 reference (4.2):** Full 4511-line spec scraped from W3C and synthesized into 3 decision-oriented files: color contrast (1.4.3, 1.4.6, 1.4.11), keyboard and focus (2.1.1, 2.1.2, 2.4.7, 2.4.11), components (2.5.5, 2.5.8, 4.1.2). First content in `kb/standards/`.
- **Color science foundations (4.3):** Two files covering perceptual color models (HSL → OKLab) and contrast algorithms (WCAG formula, APCA Lc values, HCT tone differences). First content in `kb/foundations/`. Sources: Ottosson OKLab post, Material HCT article, APCA Easy Intro.
- **Playbook layout (4.4):** Index restructured from long-scroll to a stage card grid; stage listing pages at `/playbooks/stage/[n]`; two-column play layout when exemplar present; contextual placeholder text in PlayForm.
- **KB browse improvements (4.5):** Content pages gained in-system navigation sidebar (current page highlighted) and cross-system "See also" links matched on last path segment. Fixed count bug on KB landing page and sidebar gap for flat-structure stubs (foundations/standards).
- **Category definitions and process rules (4.1 correction):** Formal definitions for all three KB categories documented in `_meta/SCHEMA.md` Section 0, `AGENTS.md`, and the app UI. Mandatory intake process (Firecrawl first; GitHub raw/CDN fallback; STOP if all fail) recorded permanently.

---

## What worked well

**KB category framework** became a genuine architectural decision rather than a naming convention. The three-way split (design-systems = imitation, standards = conformance, foundations = first-principles) resolved the ambiguity of where DESIGN.md belonged and gave a clear decision rule for future content.

**Foundations files as agent reasoning material** — the color science files are structured to explain *why* design systems work the way they do, not just what they do. The APCA Lc table, HCT tone-difference-to-WCAG mapping, and OKLab performance table give agents something to reason from rather than pattern-match on.

**Stage card grid** was a user-directed improvement over the planned jump-nav and was demonstrably better. The cards carry richer context (description, play count) and a more obvious entry point for new users.

**Cross-system See Also** links came cheaply from matching on last path segment — no config, no registry, no manual tagging. Sufficient for the current design systems' naming consistency (all have `color-system`, `typography`, `button`, etc.).

---

## What was harder than expected

**Flat stub structure broke the sidebar.** Foundations and standards stubs sit at the root of their category directory (no `guidance/`, `implementation/` subdirectory). The sidebar grouping logic used `parts[0]` as the type key, which matched known type names for design systems but produced arbitrary keys for flat stubs — dropping them from the sorted type list entirely. Fix: detect `parts.length === 1` and bucket under `'content'`.

**KB landing page count was hardcoded.** The count used `listSystems('design-systems').length` for all categories, so Standards and Foundations always showed "Coming soon" even after content was added. Simple fix but easy to miss — the hardcoding was non-obvious.

---

## Decisions made

- **DESIGN.md belongs in `kb/standards/`, not `kb/foundations/`** — it is a format specification you conform to (like WCAG), not design theory you reason from. The category label is defined by the *relationship* to the material, not the subject matter.
- **Flat directory structure for foundations/standards stubs** — foundations and standards entries don't have meaningful type subdirectories (no guidance/implementation/assets split). Stubs live at the root. The app handles this via the `'content'` bucket.
- **Playbook navigation via stage cards** — richer than jump-links; scales to more stages without list overflow.

---

## Carry-forward to Phase 5

- **Remaining design systems**: Radix/Radix Themes, Ant Design (both deferred from Phase 3 and 4).
- **Primer coverage gaps**: implementation docs and compiled token hex values not captured.
- **More foundations content**: typography science (optical size, x-height, line-height math), spacing theory (4/8px grid, optical margins) would round out the foundations section.
- **Component coverage**: current coverage is Material + Carbon only for buttons, forms, navigation, dialogs. Phase 5 can extend this to Atlassian and Primer, or add new component categories (data display, badges, tags).
- **Play quality**: plays have not been tested end-to-end against a live coding agent since Phase 2. A round of live testing and prompt iteration is overdue.
