# Phase 6 Retrospective

**Date:** 2026-05-13
**Phase goal:** Build the synthesis layer (`kb/principles/`) and redesign the playbook to be system-independent.

---

## What was accomplished

Phase 6 was the product pivot: from a design system documentation browser into a tool that produces original design systems. Every task this phase was in service of that shift.

**KB restructure (6.0):** Moved `kb/design-systems/`, `kb/standards/`, and `kb/foundations/` under `kb/reference/` while keeping all existing URLs unchanged. The transparent URL migration pattern (`getCategoryDir()`) means nothing in the app or in play prompts needed updating — only the filesystem changed. Created `kb/principles/` as a new first-class KB category.

**Synthesis layer — 11 documents across 7 concern areas (6.1–6.6, 6.11):**
- `kb/principles/tokens/architecture` — tier model, naming, dark mode at the token level, failure modes
- `kb/principles/color/architecture` — four architectural models, decision framework, dark mode tonal shift, neutral chroma
- `kb/principles/color/palette-generation` — contrast-targeting algorithm, OKLCH candidate generation, logarithmic target table, dual contrast tracking, output schema
- `kb/principles/typography/architecture` — density axis, scale construction, role taxonomy, legibility constraints
- `kb/principles/spacing/layout` — 4px vs. 8px, three-level scale, density, responsive tokens
- `kb/principles/shape/architecture` — personality spectrum, naming approaches, family consistency
- `kb/principles/depth/architecture` — shadow vs. tonal models, layering, z-index scale
- `kb/principles/motion/architecture` — easing semantics, duration, functional vs. expressive, reduced-motion
- `kb/principles/accessibility/floor` — constraint checklist with verification method for all 7 areas
- `kb/principles/ai/ui-patterns` — chat interfaces, streaming, confidence signals, AI-specific errors
- `kb/principles/ai/llm-compatibility` — token naming, file structure, DESIGN.md as AI brief, living brief pattern

**Living brief (6.7):** Defined as a first-class project artifact with a formal spec (`_meta/LIVING_BRIEF_SPEC.md`) and blank template (`_meta/templates/LIVING_BRIEF.md`). Parallel to DESIGN.md but inward-facing — the state document an LLM reads at session start to resume context accurately.

**Campaign redesign (6.8):** All 12 existing plays revised to reference `kb/principles/` synthesis URLs instead of individual design system URLs. Zero M3/Material references remain. Added `positioning-brief` play (Stage 1) — structured intake that seeds the living brief. Added living brief read/append protocol to every campaign play. Added light/dark/both theme selector to `generate-color-scheme`.

**Stage 6 Stewardship (6.9):** Six new plays for ongoing design system maintenance — session-start, add-component, audit-token-coverage, accessibility-audit, design-system-retrospective, plan-next-iteration. Stage 6 renders correctly in the UI (stage card, listing page, individual play pages). Build: 116 → 123 static pages.

**License audit (6.10):** Three Tier 3 sources evaluated; no blocking violations. Key insight: mathematical ratios are not copyrightable; legibility principles cited are established canon predating any one source. Formal audit record in `_meta/LICENSE_AUDIT.md`; pending sources tracked in `_meta/PENDING_SOURCES.md`.

---

## What changed unexpectedly

**Color palette generation became a significant task.** The initial plan was a brief options evaluation. User input (existing validated Figma plugin with 19-stop contrast-targeting approach) and the subsequent algorithm design discussion expanded this to a full synthesis document with specific pseudocode, formulas, and a pre-generated library matrix. The Phase 7 implementation scope (API endpoint + library build) is now well-specified.

**Playbook v3.0 required more revision than expected.** Every campaign play had M3 URLs and M3-specific terminology woven through the body text. The revision was thorough — not just URL replacement but rethinking role names, protocol structure, and variable names throughout.

**License audit resolved cleanly.** Anticipated this might surface blocking violations requiring source replacement. Mathematical nature of the content (ratios, color space properties, legibility measurements) and convergence with WCAG made all three sources acceptable.

---

## Decisions made

- **Logarithmic target distribution over ease-in-out** for palette generation — midpoint at 4.38:1 places more stops in the 3–7:1 working range where design decisions cluster.
- **Dual contrast tracking (white + black)** — enables dark mode palette interchangeability as a direct extension of the light mode algorithm; the relationship `contrast_white × contrast_black ≈ 21` makes this essentially free.
- **OKLCH over HSL** for candidate generation — perceptual uniformity of the L axis produces cleaner palettes at palette extremes.
- **Sine-curve chroma scaling** (`C × sin(π × L)`) to prevent sRGB gamut clipping without requiring per-stop gamut checks.
- **Living brief at root level** (not in `_meta/`) — plays need the agent to find and read it in the project directory, not navigate into a meta directory.

---

## What's next (Phase 7)

- **Palette generation API** (`src/app/api/palette/route.ts`) — takes hex color(s), returns 19-stop JSON per the algorithm spec
- **Pre-generated palette library** — 8 hues × 3 saturations = 24 palettes, built at build time from the same algorithm
- **Campaign app feature** — intake form, campaign file generator, flow UI (campaigns rendered differently from single plays)
- **Light/dark/both selector** — persistent theme selection in the app UI
- **Pending source crawls** — webtypography.net, Google Fonts Knowledge (from PENDING_SOURCES.md)

Build at phase end: **124 static pages.** All lint checks passing. KB: 86 content files, 7 concern areas in `kb/principles/`.
