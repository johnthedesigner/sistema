# Phase 6 Task File

**Phase goal:** Build the synthesis layer (`kb/principles/`) and redesign the playbook to be system-independent.

*All tasks complete. Full session entries archived in `logs/phase-6.md`. Full retro in `docs/phase-6-retro.md`.*

---

## Task 6.0 — KB restructure ✓

Moved `kb/design-systems/`, `kb/standards/`, `kb/foundations/` → `kb/reference/` using `git mv`. Updated `src/lib/kb.ts` with `getCategoryDir()` and `resolveKBPath()` to map reference categories to `kb/reference/[category]/` while keeping all existing URLs (`/kb/design-systems/`, `/kb/standards/`, `/kb/foundations/`) unchanged — no redirects needed. Added `'principles'` to `KB_CATEGORIES` and created `kb/principles/`. Updated four app files, `_meta/INDEX.md` (v2.4 → v2.5), and `_meta/CHANGELOG.md`. Build: passing.

---

## Task 6.1 — Synthesis: Token architecture ✓

Wrote `kb/principles/tokens/architecture@2026-05-13.md` — tier model (primitive → semantic → component) with rationale; naming principles (role vs. value, consistent structure); dark mode CSS approaches (attribute overrides, `prefers-color-scheme`, separate files) with concrete tradeoffs; required vs. optional token categories; seven common failure modes; decision framework. System-agnostic throughout. Build: passing (98 static pages).

---

## Task 6.2 — Synthesis: Color architecture ✓

Wrote `kb/principles/color/architecture@2026-05-13.md` — four architectural models (tonal palettes, step scales, named palettes, contextual tokens) with use-when framing; three-question decision framework; non-negotiable floor (WCAG AA, defined foreground pairs, never-hardcode); dark mode tonal shift logic with tone-pair table and why naive inversion fails; neutral palette chroma decisions. Sourced from all four design system color KB files + foundations. Build: passing (101 static pages).

---

## Task 6.3 — Synthesis: Typography architecture ✓

Wrote `kb/principles/typography/architecture@2026-05-13.md` — density axis as the first decision; modular vs. hand-tuned scale construction with ratio table (1.125–1.618); named roles vs. numeric steps with decision framework and mixed approach; non-negotiable legibility constraints (line height, measure, x-height, letter-spacing); variable fonts (axes, when worth it); typography-spacing interaction. Build: passing (103 static pages).

---

## Task 6.4 — Synthesis: Spacing, shape, depth, motion ✓

Four documents: `spacing/layout` (4px vs. 8px, three-level scale, density axis, responsive clamp()), `shape/architecture` (personality spectrum, naming approaches, family consistency), `depth/architecture` (shadow vs. tonal models, layering rules, z-index scale), `motion/architecture` (easing semantics, duration guidelines, functional vs. expressive, prefers-reduced-motion as non-negotiable). Created stubs and `_index.md` for each. Build: passing (111 static pages).

---

## Task 6.5 — Synthesis: Accessibility floor ✓

Wrote `kb/principles/accessibility/floor@2026-05-13.md` — constraint checklist (not guidance) covering all 7 areas: color contrast (WCAG AA + APCA supplemental), keyboard navigation (all elements, no traps, tab order), focus visibility (`:focus-visible`, 3:1 ring contrast), touch targets (24×24 absolute min, 44×44 industry standard), semantic HTML and ARIA patterns, motion (cross-reference), text readability (16px, 90-char, 1.5 line height). Every requirement has a verification method. Build: passing (113 static pages).

---

## Task 6.6 — Synthesis: AI concerns ✓

Two documents: `ai/ui-patterns` (chat interfaces, streaming states, confidence signals, prompt input UX, AI-specific errors, feedback mechanisms) and `ai/llm-compatibility` (token naming for LLM comprehension, file structure for context windows, DESIGN.md as AI brief, living brief pattern, component doc structure). Both system-agnostic; no framework-specific code. Build: passing.

---

## Task 6.7 — Living brief spec and template ✓

Wrote `_meta/LIVING_BRIEF_SPEC.md` — formal spec defining what the living brief is and is NOT (vs. DESIGN.md, changelog, README, design spec, task list); five required sections; 150-line max constraint; root-level placement in projects; how plays interact (read at start, append at end); update cadence table. Wrote `_meta/templates/LIVING_BRIEF.md` — 40-line blank template suitable for project bootstrap. Build: passing.

---

## Task 6.8 — Campaign redesign ✓

Revised all 12 existing plays to reference `kb/principles/` synthesis URLs — zero M3/Material references remain (verified with grep). Added `positioning-brief` play (Stage 1) — 8-question structured intake that seeds the living brief. Added living brief read/append 4-step protocol to all campaign plays. Added light/dark/both theme selector to `generate-color-scheme`. Revised role names to system-agnostic equivalents throughout. Playbook v3.0. Build: passing.

---

## Task 6.9 — Maintenance plays (Stage 6) ✓

Added Stage 6 "Stewardship" to `src/lib/types.ts` (stage union), `src/lib/playbooks.ts` (STAGE_LABELS, STAGE_DESCRIPTIONS). Added 6 plays: `session-start`, `add-component`, `audit-token-coverage`, `accessibility-audit`, `design-system-retrospective`, `plan-next-iteration`. All reference `kb/principles/` synthesis URLs and living brief. Stage 6 renders correctly in the UI. Build: 116 → 123 static pages.

---

## Task 6.10 — License compliance audit ✓

Evaluated three Tier 3 sources: bottosson (code MIT + public domain, mathematical content cleared), spencermortensen (ratios not copyrightable, acceptable), practicaltypography (fair use — principles are established canon in WCAG + Bringhurst). No blocking violations. Created `_meta/LICENSE_AUDIT.md` as formal record. Two non-blocking plans: modularscale.com supplement, webtypography.net + Google Fonts Knowledge (in PENDING_SOURCES.md). Updated Source Maps in relevant `_index.md` files. Build: unchanged at 123 static pages.

---

## Task 6.11 — Color palette generation ✓

Wrote `kb/principles/color/palette-generation@2026-05-13.md` following extended algorithm design discussion with user. Key decisions: OKLCH over HSL for candidate generation; logarithmic target contrast distribution (midpoint 4.38:1 vs. ~10:1 for ease-in-out; better coverage of 3–7:1 working range); dual white+black contrast tracking; sine-curve chroma scaling for gamut safety (`C × sin(π × L)`). Document includes full pseudocode, 19-stop logarithmic target table, WCAG formulas inline, output JSON schema, 8×3 pre-generated library matrix. Phase 7 scope: API endpoint + library build. Build: passing (124 static pages).

---

## Task 6.12 — Phase 6 housekeeping ✓

Session entries archived to `logs/phase-6.md`. This file compressed to summaries. `AGENTS.md` updated with 5 Phase 6 patterns. Retro written to `docs/phase-6-retro.md`. `tasks/phase-7.md` generated with 6 tasks: palette API (7.0), pre-generated library (7.1), campaign app feature (7.2), light/dark/both selector (7.3), pending source crawls (7.4), housekeeping (7.5). Commit created.
