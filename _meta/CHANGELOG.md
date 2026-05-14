# CHANGELOG.md
# Design System Knowledge Base — Change History

**Purpose:** This file records all additions, updates, and structural changes to the knowledge base over time. It is a record-keeping document, not a navigation or instruction document. Load it only when you need to audit the history of the knowledge base, onboard a new contributor, or investigate a potentially stale reference.

For navigation, see `INDEX.md`. For maintenance procedures, see `MAINTENANCE.md`.

---

## Format

Each session entry follows this structure:

```
### [YYYY-MM-DD] — [brief session title]
**Operator:** [human username or "LLM-assisted"]
**Systems affected:** [comma-separated list, or "meta only"]
**Summary:** [1–3 sentences describing what was done]

| Action | File | Notes |
|---|---|---|
| created | _meta/EXAMPLE.md | Initial creation |
| updated | carbon/guidance/foundations/colors@2026-05-11.md | Refreshed from upstream v11 |
| deprecated | carbon/guidance/foundations/colors@2025-09-03.md | Superseded by above |
```

---

## Log

### 2026-05-13 — Task 6.12: Phase 6 housekeeping
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** End-of-phase housekeeping: archived Phase 6 session entries to `logs/phase-6.md`, compressed `tasks/phase-6.md` to one-paragraph summaries (all tasks marked complete), updated `AGENTS.md` with 5 Phase 6 patterns (transparent URL migration, living brief artifact, Stage 6 stewardship plays, license audit methodology, playbook v3.0 system-agnostic structure), wrote `docs/phase-6-retro.md`, and generated `tasks/phase-7.md` with 6 tasks covering the palette generation API, pre-generated library, campaign app feature, light/dark/both selector, pending source crawls, and housekeeping.

| Action | File | Notes |
|---|---|---|
| created | logs/phase-6.md | Phase 6 session log archive |
| updated | tasks/phase-6.md | Compressed to summaries; all tasks marked complete |
| updated | AGENTS.md | 5 new patterns added (Phase 6) |
| created | docs/phase-6-retro.md | Phase 6 retrospective |
| created | tasks/phase-7.md | Phase 7 task file |
| updated | SESSION_LOG.md | Phase 6 entries archived; current state updated to Phase 7 |

---

### 2026-05-13 — Task 6.11: Color palette generation — investigation and approach
**Operator:** LLM-assisted
**Systems affected:** kb/principles/color (new: palette-generation)
**Summary:** Settled on contrast-targeting algorithm over perceptual stepping (OKLCH candidate pool → WCAG contrast selection per target). Key decisions: OKLCH over HSL for dense candidate generation (perceptually uniform lightness axis, better candidate pool for vivid seeds); logarithmic distribution of 19 target contrast values from 1.01 to 19.0 (places midpoint at 4.38:1 vs. ~10:1 for ease-in-out, allocating more stops to the 3–7:1 working range where accessibility decisions cluster); dual contrast tracking — both white-contrast and black-contrast recorded per stop (enables dark mode interchangeability from the same palette); gamut handling via sine-curve chroma scaling (C × sin(π × L)) which preserves hue through the palette while preventing sRGB clipping at extremes; 50–950 scale in 50-unit increments (19 stops); JSON output schema with named color objects. Documented: easing approach retained for compatibility with existing palettes. Pre-generated library approach: same algorithm run at build time over an 8-hue × 3-saturation matrix = 24 palettes. Phase 7 scope: API endpoint implementation and pre-generated library build. User's Figma plugin approach (existing validated algorithm) is the basis; improvements are OKLCH candidate space and logarithmic target distribution.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/color/palette-generation@2026-05-13.md | Full algorithm specification |
| created | kb/principles/color/palette-generation.md | Stub |
| updated | kb/principles/color/_index.md | palette-generation entry added |
| updated | _meta/INDEX.md | v3.1 → v3.2; palette-generation added to Color section |

---

### 2026-05-13 — Task 6.10: License compliance audit
**Operator:** LLM-assisted
**Systems affected:** meta only; kb/reference/foundations (Source Map updates)
**Summary:** Audited all three Tier 3 sources identified in KB content. Fetched each source to determine license and copyright status. Bottosson OKLab: code is MIT/public domain, article prose has no copyright notice — cleared as Tier 3 synthesis. Spencer Mortensen typographic scale: "all rights reserved" but mathematical ratios are not copyrightable — acceptable as synthesis; plan to add modularscale.com as supplementary citation. Practical Typography: explicit "no reproduction without permission" but content is established typographic canon (line height 1.5×, 45–90 char measure, 16px minimum) documented in WCAG 1.4.8, Bringhurst, and wide literature — acceptable under fair use for educational synthesis; plan to supplement with webtypography.net and Google Fonts Knowledge (both in PENDING_SOURCES.md). No blocking violations. Source Maps added to both foundations _index.md files. Formal audit record at _meta/LICENSE_AUDIT.md.

| Action | File | Notes |
|---|---|---|
| updated | kb/reference/foundations/color/_index.md | Source Map section added — all four sources documented with tier and assessment |
| updated | kb/reference/foundations/typography/_index.md | Source Map section added — both Tier 3 sources documented with tier, assessment, and plan |
| created | _meta/LICENSE_AUDIT.md | Formal audit record with full findings and action items |

---

### 2026-05-13 — Task 6.9: Maintenance plays (Stage 6)
**Operator:** LLM-assisted
**Systems affected:** meta (TASK_PLAYBOOKS.md); app (src/lib/playbooks.ts, src/lib/types.ts)
**Summary:** Added Stage 6 (Stewardship) to the playbook with 6 maintenance plays. Updated Play type in types.ts and stage type casts/return types in playbooks.ts to include 6. Added STAGE_LABELS[6] ('Stewardship') and STAGE_DESCRIPTIONS[6]. Plays: session-start (orient at session start, confirm scope, load relevant synthesis docs, confirm readiness before beginning); add-component (read brief, spec the component, implement with token consumption and a11y requirements, update brief); audit-token-coverage (scan codebase for hardcoded values, report violations by severity with line refs and correct token names); accessibility-audit (evaluate implemented components against all 7 sections of the accessibility floor, report pass/fail per criterion with severity); design-system-retrospective (identify drift, undocumented additions, decisions to revisit, DESIGN.md update needs, update living brief); plan-next-iteration (maturity assessment across 5 dimensions, prioritized task list with relevant play for each, success criteria). Build: 116 → 123 static pages.

| Action | File | Notes |
|---|---|---|
| updated | _meta/TASK_PLAYBOOKS.md | 6 Stage 6 plays appended |
| updated | src/lib/playbooks.ts | STAGE_LABELS[6], STAGE_DESCRIPTIONS[6]; stage type updated to include 6 |
| updated | src/lib/types.ts | Play.stage type updated to include 6 |

---

### 2026-05-13 — Task 6.8: Campaign redesign
**Operator:** LLM-assisted
**Systems affected:** meta only (TASK_PLAYBOOKS.md)
**Summary:** Full revision of TASK_PLAYBOOKS.md from v2.0 to v3.0. Added `positioning-brief` play (Stage 1) — structured intake questions producing a positioning brief + living brief seed. Revised all five campaign plays to strip every M3/Material reference and replace with synthesis KB URLs (principles/tokens/architecture, principles/color/architecture, principles/typography/architecture, principles/shape/architecture, principles/accessibility/floor). Added living brief read/append protocol to every campaign play (generate-design-md, generate-color-scheme, generate-type-scale, generate-shape-tokens, specify-component, implement-component). Added light/dark/both theme selector to generate-color-scheme with correct branching output (`:root` only vs. `:root` + `[data-theme="dark"]`). Revised supporting plays (generate-color-roles, generate-dark-mode, generate-style-dictionary, migrate-tailwind-tokens, audit-component) to use synthesis KB URLs in place of M3 URLs. Zero M3/Material references remain in the playbook.

| Action | File | Notes |
|---|---|---|
| updated | _meta/TASK_PLAYBOOKS.md | v2.0 → v3.0; positioning-brief added; all M3 refs removed; synthesis URLs wired; living brief protocol added to all campaign plays |

---

### 2026-05-13 — Task 6.7: Living brief spec and template
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** Defined the living brief as a first-class project artifact. Spec covers: what it is vs. what it is not (contrasted with DESIGN.md, changelog, README, design spec, task list); five required sections (project identity, key decisions by concern area, current state inventory, open questions, decision log); format requirements (markdown only, 150-line maximum, archiving rule at 30 entries, root-level placement); how plays interact with it (read at start, append at end, update state section); update cadence table (what triggers an update vs. what doesn't); relationship to DESIGN.md (parallel but independent update triggers). Template is a blank fill-in version at 40 lines with all five sections stubbed.

| Action | File | Notes |
|---|---|---|
| created | _meta/LIVING_BRIEF_SPEC.md | Full specification |
| created | _meta/templates/LIVING_BRIEF.md | Blank template for user projects |

---

### 2026-05-13 — Task 6.6: Synthesis — AI concerns
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new: ai/)
**Summary:** Created two synthesis documents under kb/principles/ai/. UI patterns: covers chat interface design (message differentiation, status states, markdown rendering), streaming and generative states (typing indicator, progressive text, layout shift prevention, end-of-generation transition), confidence and uncertainty signals (when to signal, visual language, draft/verified distinction), prompt and input UX (expandable textarea, stop generation, slash commands), AI-specific error taxonomy with retry patterns, and per-response feedback mechanisms (thumbs, copy, regenerate). LLM compatibility: covers token naming for LLM comprehension (semantic over abbreviations, consistent patterns, ordinal-only naming rules, coverage density), file structure for context window efficiency (independent files, 300-line target, front-loading), DESIGN.md as the primary AI brief (what to include/exclude, context window cost targets, when to update), the living brief pattern (structure, 150-line constraint, integration with plays), and component documentation structure (token consumption over hardcoded values, avoiding cross-file dependencies).

| Action | File | Notes |
|---|---|---|
| created | kb/principles/ai/ui-patterns@2026-05-13.md | AI UI patterns synthesis |
| created | kb/principles/ai/ui-patterns.md | Stub |
| created | kb/principles/ai/llm-compatibility@2026-05-13.md | LLM compatibility synthesis |
| created | kb/principles/ai/llm-compatibility.md | Stub |
| created | kb/principles/ai/_index.md | Section index with source map |
| updated | _meta/INDEX.md | Added AI section to Section 1d; v3.0 → v3.1 |

---

### 2026-05-13 — Task 6.5: Synthesis — Accessibility floor
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new: accessibility/)
**Summary:** Created accessibility floor synthesis document. Structured as a constraint checklist with verification methods for every requirement. Sections: color contrast (1.4.3 normal text 4.5:1 / large 3:1; 1.4.11 UI components 3:1; dark mode as separate verification pass + APCA supplemental; no raw color values in components); keyboard navigation (2.1.1 all interactive elements reachable; 2.1.2 no keyboard traps; tab order matches visual order); focus visibility (2.4.7 always visible with `:focus-visible` pattern; 3:1 ring contrast; 2.4.11 focused element not entirely hidden with scroll-padding-top fix); touch targets (2.5.8 24×24 CSS px AA minimum; 2.5.5 44×44 industry standard with padding implementation); semantic HTML and ARIA (semantic elements first table; accessible name sources in priority order; dynamic state ARIA attributes table); motion (prefers-reduced-motion with CSS pattern; cross-reference to motion synthesis); text readability (16px body minimum; 90-char maximum line length; 1.5 line height minimum). Sources: all three WCAG KB files + foundations color/contrast-and-accessibility.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/accessibility/floor@2026-05-13.md | Accessibility floor synthesis |
| created | kb/principles/accessibility/floor.md | Stub |
| created | kb/principles/accessibility/_index.md | Section index with source map |
| updated | _meta/INDEX.md | Added accessibility floor to Section 1d; v2.9 → v3.0 |

---

### 2026-05-13 — Task 6.4: Synthesis — Spacing, shape, depth, motion
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new: spacing/, shape/, depth/, motion/)
**Summary:** Created four synthesis documents. Spacing/layout: base unit selection, unified scale across three levels, density axis, content-first breakpoints, responsive approaches, never-arbitrary rule. Shape: radius as personality signal, three scale approaches (named/numeric/global-factor), component consistency rules, pill usage. Depth: two elevation models (shadow vs. tonal), hybrid approach for dual-mode products, layering rules, z-index scale pattern. Motion: prefers-reduced-motion as non-negotiable, easing semantics (enter/exit/move), duration guidelines, functional vs. expressive stance, composite token structure.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/spacing/layout@2026-05-13.md | Spacing synthesis |
| created | kb/principles/spacing/layout.md | Stub |
| created | kb/principles/spacing/_index.md | Section index |
| created | kb/principles/shape/architecture@2026-05-13.md | Shape synthesis |
| created | kb/principles/shape/architecture.md | Stub |
| created | kb/principles/shape/_index.md | Section index |
| created | kb/principles/depth/architecture@2026-05-13.md | Depth synthesis |
| created | kb/principles/depth/architecture.md | Stub |
| created | kb/principles/depth/_index.md | Section index |
| created | kb/principles/motion/architecture@2026-05-13.md | Motion synthesis |
| created | kb/principles/motion/architecture.md | Stub |
| created | kb/principles/motion/_index.md | Section index |
| updated | _meta/INDEX.md | Added 4 new entries to Section 1d; v2.8 → v2.9 |

---

### 2026-05-13 — Task 6.3: Synthesis — Typography architecture
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new: typography/)
**Summary:** Created typography architecture synthesis document. Covers density axis (established before any scale decision), modular vs. hand-tuned scale construction with ratio selection guide, named roles vs. numeric steps decision framework, non-negotiable legibility constraints (line height per role, measure 45–90 chars, letter-spacing direction by size, x-height and apparent size), variable font decision framework, and how typography interacts with the spacing system. Sourced from all six design system typography KB files and both foundations typography files.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/typography/architecture@2026-05-13.md | Typography architecture synthesis |
| created | kb/principles/typography/architecture.md | Stub |
| created | kb/principles/typography/_index.md | Section index with source map |
| updated | _meta/INDEX.md | Added typography architecture to Section 1d; v2.7 → v2.8 |

---

### 2026-05-13 — Task 6.2: Synthesis — Color architecture
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new: color/)
**Summary:** Created color architecture synthesis document. Covers the four major architectural models (tonal palettes, step scales, named palettes, contextual/layered tokens) with "use when" framing for each; a three-question decision framework mapping product context to architecture; the non-negotiable floor (contrast minimums, defined foreground pairs, no raw values in components, reserved feedback colors); dark mode tonal shift logic (mirroring vs. inversion); and neutral palette chroma decisions. Sources: all five design system color KB files + both foundations color files + WCAG standards.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/color/architecture@2026-05-13.md | Color architecture synthesis |
| created | kb/principles/color/architecture.md | Stub |
| created | kb/principles/color/_index.md | Section index with source map |
| updated | _meta/INDEX.md | Added color architecture to Section 1d; v2.6 → v2.7 |

---

### 2026-05-13 — Task 6.1: Synthesis — Token architecture
**Operator:** LLM-assisted
**Systems affected:** kb/principles (new)
**Summary:** Created first synthesis document in `kb/principles/`. Token architecture synthesis covers the tier model (primitive → semantic → component) with rationale for each tier, naming principles (role vs. value), dark mode at the token level (three CSS approaches with tradeoffs), required vs. optional token categories, common failure modes, and a decision framework. Sourced from Material, Atlassian, Radix, and Ant Design token KB files.

| Action | File | Notes |
|---|---|---|
| created | kb/principles/tokens/architecture@2026-05-13.md | Token architecture synthesis |
| created | kb/principles/tokens/architecture.md | Stub |
| created | kb/principles/tokens/_index.md | Section index with source map |
| updated | _meta/INDEX.md | Added Section 1d (Principles), token architecture entry; v2.5 → v2.6 |

---

### 2026-05-13 — Task 6.0: KB restructure
**Operator:** LLM-assisted
**Systems affected:** meta only (filesystem + app)
**Summary:** Moved `kb/design-systems/`, `kb/standards/`, and `kb/foundations/` under `kb/reference/`. Added `principles` as a new KB category. App URLs unchanged — `reference/` is transparent to the router. Updated `src/lib/kb.ts` with `getCategoryDir` and `resolveKBPath` helpers. Added `principles` to all CATEGORY_LABELS and CATEGORY_META records. Updated INDEX.md paths.

| Action | File | Notes |
|---|---|---|
| moved | kb/design-systems/ → kb/reference/design-systems/ | git mv |
| moved | kb/standards/ → kb/reference/standards/ | git mv |
| moved | kb/foundations/ → kb/reference/foundations/ | git mv |
| updated | src/lib/kb.ts | Added getCategoryDir, resolveKBPath, principles category |
| updated | src/app/kb/page.tsx | Added principles to CATEGORY_META |
| updated | src/app/kb/[category]/page.tsx | Added principles to CATEGORY_LABELS |
| updated | src/app/kb/[category]/[slug]/page.tsx | Added principles to CATEGORY_LABELS |
| updated | src/app/kb/[category]/[slug]/[...path]/page.tsx | Added principles to CATEGORY_LABELS |
| updated | _meta/INDEX.md | Updated all file paths to reference/ prefix; v2.4 → v2.5 |

---

### 2026-05-13 — Task 5.4: End-to-end play testing
**Operator:** LLM-assisted
**Systems affected:** meta (exemplars only)
**Summary:** Tested two Stage 1–2 plays end-to-end. Play 1 (`generate-design-md`): generated a complete DESIGN.md for "Helix" telemedicine platform using forest-teal primary; passed all 4 evaluation criteria (format match, internal consistency, no M3-specific copy, no unresolved variables). Play 2 (`generate-color-scheme`): generated a full light + dark CSS token scheme for "Verdant" sustainability platform using forest-green primary, olive secondary, amber tertiary, and green-tinted neutral; passed all 4 criteria.

| Action | File | Notes |
|---|---|---|
| created | _meta/exemplars/design-md-files/generate-design-md-helix.md | Play 1 output — Helix telemedicine DESIGN.md |
| created | _meta/exemplars/semantic-token-systems/generate-color-scheme-verdant.md | Play 2 output — Verdant green color scheme |

---

### 2026-05-13 — Task 5.3: Foundations KB — Typography science
**Operator:** LLM-assisted
**Systems affected:** foundations (typography); meta
**Summary:** Added typography science to `kb/foundations/`. Two content files: type-scales (modular scale mathematics, musical interval basis, classical scale from Bringhurst, 13-ratio comparison table, optical scaling, productive/expressive split, design system scale comparison across 5 systems) and legibility (legibility vs. readability distinction, x-height and UPM mechanics, line height mathematics including 120–145% rule and why unitless CSS values are correct, optimal measure, the four body-text variables). Sources: spencermortensen.com/articles/typographic-scale/, practicaltypography.com. `_meta/INDEX.md` updated to v2.4.

| Action | File | Notes |
|---|---|---|
| created | kb/foundations/typography/_index.md | Section index |
| created | kb/foundations/typography/type-scales@2026-05-13.md | Scale ratio math, musical interval table, classical scale, optical scaling, productive/expressive split, design system comparison |
| created | kb/foundations/typography/type-scales.md | Stub |
| created | kb/foundations/typography/legibility@2026-05-13.md | x-height, cap-height, UPM, line height math (120–145% rule, unitless CSS), measure, four body-text variables |
| created | kb/foundations/typography/legibility.md | Stub |
| updated | _meta/INDEX.md | v2.3 → v2.4; Typography Science added to Section 1c Foundations; Section 2.21 added |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-13 — Task 5.2: Ant Design capture
**Operator:** LLM-assisted
**Systems affected:** design-systems (ant-design); meta
**Summary:** Added Ant Design 5.x as the seventh design system. Scraped 4 pages from ant.design via WebFetch (design values, color system, typography, token customization). Wrote 4 guidance KB files covering: design values (Natural/Certain/Meaningful/Growing philosophy and enterprise context), color system (HSB model, 12-color × 10-step palette, functional and neutral tokens, alpha-based neutral strategy), typography (system font stack with Noto Sans for CJK, 14px base, weight guidance for Chinese text), and design token architecture (3-layer Seed→Map→Alias, ConfigProvider, preset algorithms, full token vocabulary). Community DESIGN.md generated. `_meta/INDEX.md` updated to v2.3 (7 systems).

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/ant-design/_index.md | System index |
| created | kb/design-systems/ant-design/guidance/foundations/design-values@2026-05-13.md | Natural/Certain/Meaningful/Growing; enterprise context; contrast with other systems |
| created | kb/design-systems/ant-design/guidance/foundations/design-values.md | Stub |
| created | kb/design-systems/ant-design/guidance/foundations/color-system@2026-05-13.md | HSB model, 12-palette × 10-step, brand #1677ff, functional colors, alpha neutral tokens |
| created | kb/design-systems/ant-design/guidance/foundations/color-system.md | Stub |
| created | kb/design-systems/ant-design/guidance/foundations/typography@2026-05-13.md | System font stack + Noto Sans, 14px base, weight table, CJK weight guidance, alpha text tokens |
| created | kb/design-systems/ant-design/guidance/foundations/typography.md | Stub |
| created | kb/design-systems/ant-design/guidance/foundations/design-tokens@2026-05-13.md | 3-layer architecture, ConfigProvider, algorithms, full token vocabulary tables |
| created | kb/design-systems/ant-design/guidance/foundations/design-tokens.md | Stub |
| created | kb/design-systems/ant-design/design-md/DESIGN@2026-05-13.md | Community DESIGN.md — all 8 sections including design values context |
| created | kb/design-systems/ant-design/design-md/DESIGN.md | Stub |
| updated | _meta/INDEX.md | v2.2 → v2.3; 7 systems; Ant Design added to Section 1, Quick Reference, coverage matrix, Section 2 cross-refs |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-13 — Task 5.1 continued: Radix spacing + radius capture
**Operator:** LLM-assisted
**Systems affected:** design-systems (radix); meta
**Summary:** Completed Radix Themes capture with spacing and radius pages that couldn't be scraped in the previous session due to rate limits. Scraped radix-ui.com/themes/docs/theme/spacing and /radius via WebFetch; wrote two new guidance KB files; regenerated DESIGN.md (v2) incorporating all six topic areas (color, typography, design tokens, spacing, radius, getting started). `_meta/INDEX.md` updated to reflect full Radix coverage.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/radix/guidance/foundations/spacing@2026-05-13.md | 9-step 4px-grid scale, CSS variable tokens, layout props, responsive breakpoints, global scaling |
| created | kb/design-systems/radix/guidance/foundations/spacing.md | Stub |
| created | kb/design-systems/radix/guidance/foundations/radius@2026-05-13.md | Global radius prop, CSS variable tokens (--radius-1 to --radius-6), component-level overrides |
| created | kb/design-systems/radix/guidance/foundations/radius.md | Stub |
| created | kb/design-systems/radix/design-md/DESIGN@2026-05-13.md | Updated DESIGN.md v2 — adds spacing scale, radius tokens, expanded Do's/Don'ts |
| updated | kb/design-systems/radix/design-md/DESIGN.md | Stub updated: points to DESIGN@2026-05-13.md |
| updated | kb/design-systems/radix/_index.md | Added spacing + radius to Content Inventory and Source Map; version history updated |
| updated | _meta/INDEX.md | Radix section updated to 2026-05-13; Radix coverage matrix filled in; 2.3 Spacing section populated |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 5.1: Radix / Radix Themes design system capture
**Operator:** LLM-assisted
**Systems affected:** design-systems (radix); meta
**Summary:** Added Radix Themes 3.x as the sixth design system. Scraped four pages from radix-ui.com/themes/docs via Firecrawl (free tier — 3 req/min limit). Wrote four guidance/implementation files covering the two-axis color model (accent × gray), 12-step semantic scales, config-first `<Theme>` component props, cross-component variant vocabulary (classic/solid/soft/surface/outline/ghost), 9-step typography scale, and installation/setup. Community-generated DESIGN.md file generated from KB content. `_meta/INDEX.md` updated to v2.2 (60 content files; 6 systems); Primer and Radix sections added to Section 1.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/radix/_index.md | System index with Source Map and Content Inventory |
| created | kb/design-systems/radix/guidance/foundations/color-system@2026-05-12.md | 12-step scales, two-axis model, CSS variable tokens, alpha variants, customization |
| created | kb/design-systems/radix/guidance/foundations/color-system.md | Stub |
| created | kb/design-systems/radix/guidance/foundations/typography@2026-05-12.md | 9-step scale (12px–60px), font weights, system font stack, next/font integration |
| created | kb/design-systems/radix/guidance/foundations/typography.md | Stub |
| created | kb/design-systems/radix/guidance/foundations/design-tokens@2026-05-12.md | Theme props, variant system, dark mode, CSS variable categories |
| created | kb/design-systems/radix/guidance/foundations/design-tokens.md | Stub |
| created | kb/design-systems/radix/implementation/getting-started@2026-05-12.md | Installation, setup, Theme props table, Primitives vs Themes comparison |
| created | kb/design-systems/radix/implementation/getting-started.md | Stub |
| created | kb/design-systems/radix/design-md/DESIGN@2026-05-12.md | Community-generated DESIGN.md — KB frontmatter + disclaimer + YAML spec + 8 sections |
| created | kb/design-systems/radix/design-md/DESIGN.md | Stub pointing to DESIGN@2026-05-12.md |
| updated | _meta/INDEX.md | v2.1 → v2.2; 51 → 60 content files; Primer + Radix sections added to Section 1 |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 4.3: Color science foundations
**Operator:** LLM-assisted
**Systems affected:** foundations; meta
**Summary:** Added first foundations KB content: color science. Two content files covering perceptual color models (HSL, CIELAB, CAM16-UCS, HCT, OKLab) and contrast algorithms (WCAG 2.x relative luminance formula, APCA Lc values and use-case ranges, tonal palette design for accessibility). Sources: Björn Ottosson's OKLab post (bottosson.github.io/posts/oklab/), Material HCT color science article (material.io/blog/science-of-color-design), APCA Easy Intro (git.apcacontrast.com), WCAG 2.2 spec (already scraped for Task 4.2). `_meta/INDEX.md` updated to v2.0 (46 content files); foundations section filled in.

| Action | File | Notes |
|---|---|---|
| created | kb/foundations/color/_index.md | Sub-directory index |
| created | kb/foundations/color/perceptual-models@2026-05-12.md | HSL/CIELAB/CAM16-UCS/HCT/OKLab — why perceptual uniformity matters, model comparison, practical implications |
| created | kb/foundations/color/perceptual-models.md | Stub |
| created | kb/foundations/color/contrast-and-accessibility@2026-05-12.md | WCAG luminance formula, APCA Lc ranges, HCT tone differences for AA compliance |
| created | kb/foundations/color/contrast-and-accessibility.md | Stub |
| updated | _meta/INDEX.md | v1.9 → v2.0; 44 → 46 content files; foundations section populated |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 4.2: WCAG 2.2 accessibility reference
**Operator:** LLM-assisted
**Systems affected:** standards; meta
**Summary:** Added WCAG 2.2 accessibility reference as the first standards content for `kb/standards/wcag/`. Full spec scraped from www.w3.org/TR/WCAG22/ via Firecrawl (4511-line document). Extracted 9 success criteria covering the most relevant requirements for UI component implementation: color contrast (1.4.3, 1.4.6, 1.4.11), keyboard operability (2.1.1, 2.1.2), focus visibility (2.4.7, 2.4.11), touch targets (2.5.5, 2.5.8), and name/role/value (4.1.2). Structured as three decision-oriented files with concrete pass/fail values and implementation notes rather than verbatim spec transcription. `_meta/INDEX.md` updated to v1.9 (44 content files).

| Action | File | Notes |
|---|---|---|
| created | kb/standards/wcag/_index.md | Sub-directory index with conformance level overview |
| created | kb/standards/wcag/color-contrast@2026-05-12.md | 1.4.3 (4.5:1/3:1), 1.4.6 (7:1), 1.4.11 (3:1 UI), luminance formula, reference values |
| created | kb/standards/wcag/color-contrast.md | Stub |
| created | kb/standards/wcag/keyboard-and-focus@2026-05-12.md | 2.1.1, 2.1.2, 2.4.7, 2.4.11 with implementation patterns and CSS |
| created | kb/standards/wcag/keyboard-and-focus.md | Stub |
| created | kb/standards/wcag/components@2026-05-12.md | 2.5.5 (44px), 2.5.8 (24px), 4.1.2 (accessible name, roles, state table) |
| created | kb/standards/wcag/components.md | Stub |
| updated | _meta/INDEX.md | v1.8 → v1.9; 41 → 44 content files; WCAG section added to Standards |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — KB structure: category definitions + DESIGN.md reclassified to standards
**Operator:** LLM-assisted
**Systems affected:** standards; foundations; meta; app
**Summary:** Established formal definitions for all three KB categories (design-systems, standards, foundations) in `_meta/SCHEMA.md` Section 0 and `AGENTS.md`. DESIGN.md spec content moved from `kb/foundations/design-md/` to `kb/standards/design-md/` — it is a format specification, not design theory. The `examples@` file (sourced from community awesome-design-md) removed entirely; no unofficial sources without explicit user approval. App KB index page descriptions updated. `foundations/` is now empty pending Task 4.3 (color science).

| Action | File | Notes |
|---|---|---|
| created | _meta/SCHEMA.md Section 0 | Canonical definitions for all three KB categories |
| updated | AGENTS.md | Added KB category definitions section + mandatory intake process |
| moved | kb/foundations/design-md/ → kb/standards/design-md/ | DESIGN.md is a format spec, not design theory |
| deleted | kb/foundations/design-md/examples@2026-05-12.md | Community source; not appropriate without user vetting |
| updated | src/app/kb/page.tsx | Updated CATEGORY_META descriptions for standards and foundations |
| updated | _meta/INDEX.md | v1.7 → v1.8; Section 1b renamed Standards; Section 1c (Foundations, empty) added |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 4.1: DESIGN.md specification capture
**Operator:** LLM-assisted
**Systems affected:** foundations; meta
**Summary:** Added the DESIGN.md format specification as the first foundations KB entry. Overview and spec scraped from stitch.withgoogle.com via Firecrawl. Key format details: YAML front matter (machine-readable tokens) + markdown body (rationale); 8 canonical sections; explicit type system (Color, Dimension, Token Reference, Typography); token reference syntax `{path.to.token}`; component variants as separate keyed entries. Examples file sourced from awesome-design-md community collection — user-vetted secondary source. `_meta/INDEX.md` updated to v1.7 (41 content files); Section 1b (Foundations) added.

| Action | File | Notes |
|---|---|---|
| created | kb/foundations/design-md/_index.md | Sub-directory index |
| created | kb/foundations/design-md/overview@2026-05-12.md | From stitch.withgoogle.com/docs/design-md/overview |
| created | kb/foundations/design-md/overview.md | Stub |
| created | kb/foundations/design-md/spec@2026-05-12.md | From stitch.withgoogle.com/docs/design-md/specification |
| created | kb/foundations/design-md/spec.md | Stub |
| created | kb/foundations/design-md/examples@2026-05-12.md | awesome-design-md community collection — user-vetted secondary source |
| created | kb/foundations/design-md/examples.md | Stub |
| updated | _meta/INDEX.md | v1.5 → v1.7; 38 → 41 content files; Section 1b (Foundations) added |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 3.5: Component documentation — Material and Carbon
**Operator:** LLM-assisted
**Systems affected:** material; carbon; meta
**Summary:** Added component-level guidance for four components across Material Design 3 and Carbon. Material sources: m3.material.io scrape (buttons, text-fields, dialogs, navigation-bar). Carbon sources: GitHub MDX files for Button and Modal; carbondesignsystem.com for TextInput and UIShell. 8 versioned content files + 8 stubs created. Both system `_index.md` files updated. `_meta/INDEX.md` updated to v1.5 (38 content files); coverage matrix updated for Button, Form Elements, Navigation, Modals/Dialogs.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/material/guidance/components/button@2026-05-12.md | 5 variants, M3 Expressive sizes, token reference, states |
| created | kb/design-systems/material/guidance/components/button.md | Stub |
| created | kb/design-systems/material/guidance/components/text-field@2026-05-12.md | Filled/outlined variants, states table, anatomy, error rules |
| created | kb/design-systems/material/guidance/components/text-field.md | Stub |
| created | kb/design-systems/material/guidance/components/dialog@2026-05-12.md | Basic/full-screen, anatomy, action rules, focus behavior |
| created | kb/design-systems/material/guidance/components/dialog.md | Stub |
| created | kb/design-systems/material/guidance/components/navigation-bar@2026-05-12.md | Flexible/baseline variants, tokens, responsive pattern |
| created | kb/design-systems/material/guidance/components/navigation-bar.md | Stub |
| created | kb/design-systems/carbon/guidance/components/button@2026-05-12.md | 7 kinds, 6 sizes, icon usage, ButtonSet, accessibility |
| created | kb/design-systems/carbon/guidance/components/button.md | Stub |
| created | kb/design-systems/carbon/guidance/components/text-input@2026-05-12.md | Variants, states, layer-aware bg, password, accessibility |
| created | kb/design-systems/carbon/guidance/components/text-input.md | Stub |
| created | kb/design-systems/carbon/guidance/components/modal@2026-05-12.md | 4 variants, sizes, anatomy, focus management, floating menus |
| created | kb/design-systems/carbon/guidance/components/modal.md | Stub |
| created | kb/design-systems/carbon/guidance/components/ui-shell@2026-05-12.md | Header, SideNav (rail/full), responsive, theming, accessibility |
| created | kb/design-systems/carbon/guidance/components/ui-shell.md | Stub |
| updated | kb/design-systems/material/_index.md | 12 → 16 versioned files; component rows added |
| updated | kb/design-systems/carbon/_index.md | 7 → 11 versioned files; component rows added |
| updated | _meta/INDEX.md | v1.4 → v1.5; 30 → 38 content files; sections 2.7–2.10 populated; coverage matrix updated |

---

### 2026-05-12 — Task 2.5: Atlassian Design System initial capture
**Operator:** LLM-assisted
**Systems affected:** atlassian; meta
**Summary:** Atlassian Design System (Atlaskit) added as the third KB system. Three Firecrawl scrapes (color, typography; design-tokens page returned 0 pages — JS-rendered). Token values sourced from `@atlaskit/tokens@13.0.4` CDN package. 6 versioned content files created across guidance (3), implementation (1), assets (1), and design-md (1). `_meta/INDEX.md` updated to v1.3 (3 systems, 25 content files).

| Action | File | Notes |
|---|---|---|
| created | atlassian/_index.md | System overview, source map, content inventory |
| created | atlassian/guidance/foundations/color@2026-05-12.md | Color roles, emphasis levels, interaction states, accessibility |
| created | atlassian/guidance/foundations/typography@2026-05-12.md | Atlassian Sans/Mono, type scale tokens, rem system |
| created | atlassian/guidance/foundations/design-tokens@2026-05-12.md | Token categories, naming convention, spacing scale, elevation, border, radius |
| created | atlassian/implementation/getting-started@2026-05-12.md | @atlaskit/tokens + @atlaskit/primitives installation and usage |
| created | atlassian/assets/tokens/colors@2026-05-12.json | Light-theme color + elevation token values (text, icon, border, link, background, elevation, blanket, skeleton) |
| created | atlassian/design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Atlassian DS |
| created | redirect stubs (×6) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Atlassian added to all relevant sections; coverage matrix updated; version bumped to 1.3 |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 2.3: Carbon Design System initial capture
**Operator:** LLM-assisted
**Systems affected:** carbon; meta
**Summary:** Carbon v11 added as the second design system in the KB. Four Firecrawl scrapes (color, typography, themes, React getting-started), two GitHub token fetches (IBM color palette, White theme). 7 versioned content files created across guidance (3), implementation (1), assets (2), and design-md (1). All files have corresponding redirect stubs. `_meta/INDEX.md` updated to v1.2 (2 systems, 19 content files).

| Action | File | Notes |
|---|---|---|
| created | carbon/_index.md | System overview, source map, content inventory |
| created | carbon/guidance/foundations/color-system@2026-05-12.md | Color system — themes, layering model, token groups, interaction states |
| created | carbon/guidance/foundations/typography@2026-05-12.md | IBM Plex typeface, productive/expressive type sets, token categories |
| created | carbon/guidance/foundations/themes@2026-05-12.md | 4 built-in themes, token categories, customization via Sass |
| created | carbon/implementation/getting-started@2026-05-12.md | React installation, components, styles, icons, theming |
| created | carbon/assets/tokens/colors@2026-05-12.json | IBM Design Language palette — all hues (10 colors) with 10 steps each |
| created | carbon/assets/tokens/white-theme@2026-05-12.json | White theme semantic token assignments (background, layer, field, border, text, link, icon, support, focus, misc, skeleton) |
| created | carbon/design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Carbon |
| created | redirect stubs (×7) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Carbon added to all relevant sections; coverage matrix updated; version bumped to 1.2 |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-11 — Phase 0, Tasks 0.1–0.2: Tools scaffold and Material Design 3 scrape
**Operator:** LLM-assisted
**Systems affected:** meta only (tools); material (raw data)
**Summary:** Created the `tools/` directory with Firecrawl scraper and frontmatter linter. Three-pass scrape of m3.material.io and material-web.dev captured 62 raw files covering all six required guidance topics plus bonus coverage (elevation, icons, motion, layout, M3 Expressive, design-tokens foundations).

| Action | File | Notes |
|---|---|---|
| created | tools/package.json | Dependencies: firecrawl-js, dotenv, gray-matter, playwright, prettier, zod |
| created | tools/tsconfig.json | Strict mode, ESNext, bundler module resolution |
| created | tools/.env.example | FIRECRAWL_API_KEY= placeholder |
| created | tools/scrape/firecrawl-guidance.ts | Firecrawl scraper; --url / --slug / --limit / --wait CLI args; writes to raw-scrape/ |
| created | tools/validate/lint-frontmatter.ts | Frontmatter linter; design-md special handling; skips _index.md |
| created | raw-scrape/material/2026-05-11/ | 62 raw markdown files from three-pass scrape |

---

### 2026-05-11 — Phase 0, Tasks 0.3–0.5: Guidance enrichment, verification, and DESIGN.md regeneration
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** All six guidance files updated in-place with authoritative scraped content. All three asset token files and both implementation files verified against live upstream sources (GitHub material-web v0_192 SCSS). YAML parse error in getting-started fixed. DESIGN.md regenerated from all nine verified sources. Full lint: 18 files, 0 errors.

| Action | File | Notes |
|---|---|---|
| updated | material/guidance/foundations/colors@2026-05-11.md | Removed stale notes: draft field from frontmatter |
| updated | material/guidance/foundations/color-system@2026-05-11.md | Added HCT color space section; added Contrast Levels section (standard/medium/high) |
| updated | material/guidance/foundations/color-roles@2026-05-11.md | Added Inverse Family table; Pairing and Layering Rules; Add-on Color Roles (fixed accent, bright/dim surface) |
| updated | material/guidance/foundations/design-tokens@2026-05-11.md | Added Contexts section (light/dark/form-factor context model) |
| updated | material/guidance/foundations/typography@2026-05-11.md | Added M3 Expressive Update section (30 styles, emphasized token naming, platform availability) |
| updated | material/guidance/foundations/shape@2026-05-11.md | Added M3 Expressive Update (35 shapes, 3 new corner tokens); added Shape Principles section |
| updated | material/implementation/getting-started@2026-05-11.md | Fixed YAML parse error: @material/web quoted in tags flow sequence |
| updated | material/design-md/DESIGN@2026-05-11.md | Full regeneration: nested light/dark color sections (28 roles each), letter-spacing on all 15 typescale entries, Expressive shape tokens, 5 new component mappings, Token Architecture prose |
| verified | material/assets/tokens/shape@2026-05-11.json | All 7 corner radius values match live v0_192 |
| verified | material/assets/tokens/typography@2026-05-11.json | All 15 typescale roles verified against live SCSS |
| verified | material/assets/tokens/colors@2026-05-11.json | Accent colors verified; neutral palette has documented 1-unit hex delta (imperceptible) |
| verified | material/implementation/tokens/token-schema@2026-05-11.md | Token naming and values verified against material-web.dev |

---

### 2026-05-11 — Phase 0, Task 0.6: Index and changelog update
**Operator:** LLM-assisted
**Systems affected:** material; meta only
**Summary:** Updated material/_index.md Version History with Phase 0 enrichment entry. Added Phase 0 task entries to this changelog. _meta/INDEX.md header counts and coverage matrix verified accurate (no changes required).

| Action | File | Notes |
|---|---|---|
| updated | material/_index.md | Added Phase 0 enrichment row to Version History |
| updated | _meta/CHANGELOG.md | Added Phase 0 Tasks 0.1–0.2, 0.3–0.5, and 0.6 entries |

---

### 2026-05-11 — Material Design 3: initial capture
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** First design system populated. Foundations coverage (color system, color roles, typography, shape, design tokens), web implementation getting started and token schema, three asset files (color, typography, shape baseline tokens), and a community-generated DESIGN.md derived from all source files. All files versioned with stubs. Master INDEX.md updated.

| Action | File | Notes |
|---|---|---|
| created | material/_index.md | System overview, source map, content inventory |
| created | material/guidance/foundations/color-system@2026-05-11.md | Three-tier model, dynamic color, key colors |
| created | material/guidance/foundations/color-roles@2026-05-11.md | All role families, on-* pattern, container roles |
| created | material/guidance/foundations/typography@2026-05-11.md | Typeface model, typescale roles and values |
| created | material/guidance/foundations/shape@2026-05-11.md | Shape scale, component defaults, customization |
| created | material/guidance/foundations/design-tokens@2026-05-11.md | Three tiers, naming conventions, cross-platform |
| created | material/implementation/getting-started@2026-05-11.md | CDN, npm, component usage, theming |
| created | material/implementation/tokens/token-schema@2026-05-11.md | Full CSS custom property schema |
| created | material/assets/tokens/colors@2026-05-11.json | Baseline light + dark color scheme |
| created | material/assets/tokens/typography@2026-05-11.json | Full typescale token values |
| created | material/assets/tokens/shape@2026-05-11.json | Shape scale + component defaults |
| created | material/design-md/DESIGN@2026-05-11.md | Community-generated DESIGN.md (unofficial) |
| created | 11x stub files | All stubs pointing to versioned files above |
| updated | _meta/INDEX.md | Material added to all relevant sections |

---

### 2026-05-11 — Material Design 3 initial capture
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** First design system added to the knowledge base. 12 versioned content files created covering guidance (color system, color roles, design tokens, typography, shape, consolidated color overview), implementation (getting-started, token schema), assets (color, typography, shape tokens as CSS custom properties), and a community-generated DESIGN.md. All files have corresponding redirect stubs. System `_index.md` and master `INDEX.md` updated. Material moved from planned systems to indexed.

| Action | File | Notes |
|---|---|---|
| created | material/_index.md | System index with source map and content inventory |
| created | material/guidance/foundations/colors@2026-05-11.md | Consolidated color overview |
| created | material/guidance/foundations/color-system@2026-05-11.md | Color architecture and Dynamic Color |
| created | material/guidance/foundations/color-roles@2026-05-11.md | Full color role catalogue |
| created | material/guidance/foundations/design-tokens@2026-05-11.md | Three-tier token model |
| created | material/guidance/foundations/typography@2026-05-11.md | Type scale and typeface guidance |
| created | material/guidance/foundations/shape@2026-05-11.md | Shape / corner radius system |
| created | material/implementation/getting-started@2026-05-11.md | Web installation and setup |
| created | material/implementation/tokens/token-schema@2026-05-11.md | Token CSS custom property reference |
| created | material/assets/tokens/colors@2026-05-11.json | CSS color token values |
| created | material/assets/tokens/typography@2026-05-11.json | CSS typography token values |
| created | material/assets/tokens/shape@2026-05-11.json | CSS shape token values |
| created | material/design-md/DESIGN@2026-05-11.md | Community DESIGN.md (unofficial) |
| created | redirect stubs (×12) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Added Material; updated coverage matrix; removed from planned systems |

---

### 2026-05-11 — Structural additions: DESIGN.md layer, exemplars, generative play tiers
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** Added three new structural elements informed by the discovery of the Google Labs DESIGN.md format and the `awesome-design-md` community repository: a `design-md/` layer in each system directory for community-generated DESIGN.md files derived from source material; an `_meta/exemplars/` directory for annotated output quality anchors; and a generative play tier model in the task playbooks with three new play categories (DESIGN.md tasks, token migration tasks, and full system design tasks).

| Action | File | Notes |
|---|---|---|
| updated | _meta/SCHEMA.md | v1.0 → v1.1; added `design-md` content type (Section 4.4), exemplars section (Section 5), updated directory structure |
| updated | _meta/MAINTENANCE.md | v1.0 → v1.1; added Step 7 (generate DESIGN.md) to Procedure A; renumbered steps 7–10; added Procedure E (exemplars) |
| updated | _meta/TASK_PLAYBOOKS.md | Added generative tier model; added Categories 6 (DESIGN.md tasks, 3 plays), 7 (token migration, 2 plays), 8 (full system design, 1 play) |

---

### 2026-05-12 — Primer (GitHub) initial capture
**Operator:** LLM-assisted
**Systems affected:** primer
**Summary:** Full initial capture of Primer Design System. Source: primer/design GitHub repo (MDX) and primer/primitives token JSON5 files. The primer.style doc site is fully JS-rendered (Firecrawl returned 0 pages); all content sourced directly from GitHub raw URLs.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/primer/_index.md | System index with overview, source map, content inventory |
| created | kb/design-systems/primer/guidance/foundations/color-system@2026-05-12.md | Three-tier token model, neutral tokens, semantic roles, base scales |
| created | kb/design-systems/primer/guidance/foundations/color-system.md | Stub |
| created | kb/design-systems/primer/guidance/foundations/typography@2026-05-12.md | Type scale, weights, font stacks, best practices |
| created | kb/design-systems/primer/guidance/foundations/typography.md | Stub |
| created | kb/design-systems/primer/guidance/components/button@2026-05-12.md | Variants, sizing, anatomy, states, accessibility |
| created | kb/design-systems/primer/guidance/components/button.md | Stub |
| created | kb/design-systems/primer/assets/tokens/colors@2026-05-12.json | Functional color token reference (fgColor, bgColor, borderColor, shadow) |
| created | kb/design-systems/primer/assets/tokens/colors.json | Stub |
| created | kb/design-systems/primer/design-md/DESIGN@2026-05-12.md | Visual language spec for AI coding tools |
| created | kb/design-systems/primer/design-md/DESIGN.md | Stub |
| updated | _meta/INDEX.md | Primer added to quick reference; planned systems list updated |

---

### 2026-05-11 — Initial meta layer created
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** Knowledge base structure established. All five meta layer files created. No design system content yet captured.

| Action | File | Notes |
|---|---|---|
| created | _meta/SCHEMA.md | File naming, versioning, frontmatter spec, content type classification |
| created | _meta/MAINTENANCE.md | Procedures A–D for adding, updating, and deprecating content |
| created | _meta/USAGE_GUIDE.md | LLM navigation and usage instructions |
| created | _meta/TASK_PLAYBOOKS.md | Initial playbooks for color, typography, component, token, and research tasks |
| created | _meta/INDEX.md | Master index template; no systems populated yet |
| created | _meta/CHANGELOG.md | This file |
