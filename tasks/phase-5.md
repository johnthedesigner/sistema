# Phase 5 Task File

**Phase goal:** Expand design system coverage to remaining systems; broaden component documentation; run end-to-end play quality testing; and begin the Sistema dogfood exercise (generate a DESIGN.md for Sistema itself).

**Systems touched:** `kb/design-systems/` (new systems + more components), `kb/foundations/` (typography and spacing), play testing and revision
**App:** Minor improvements as needed during play testing

**Context from Phase 4:**
- 4 design systems: Material, Carbon, Atlassian, Primer — all at `kb/design-systems/`; 46 content files
- Standards: WCAG 2.2 (3 files), DESIGN.md spec (2 files) at `kb/standards/`
- Foundations: Color science (2 files) at `kb/foundations/`
- Playbook: stage card grid index, stage pages at `/playbooks/stage/[n]`, two-column play layout with inline exemplar
- KB content pages: in-system nav sidebar + cross-system See Also
- Build: 79 static pages; deployed on Vercel

---

## Task 5.1 — Radix / Radix Themes design system capture

**Status:** not started
**Phase:** 5

### What this task implements

Captures Radix Themes documentation for the KB. Radix takes a primitive-first, headless-friendly approach — documenting it alongside Material and Carbon gives agents a contrast between opinionated (Material) and compositional (Radix) design systems.

Content to capture: token architecture, color system (semantic scales vs. alias tokens), typography scale, component API conventions. Source: radix-ui.com/themes/docs.

### Files created or modified

- `kb/design-systems/radix/_index.md` — system index
- `kb/design-systems/radix/guidance/foundations/` — color, typography, design tokens
- `kb/design-systems/radix/design-md/DESIGN.md` — community-generated
- `_meta/INDEX.md` — updated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `kb/design-systems/radix/` exists with `_index.md` and at least 2 guidance files
- [ ] Content captures Radix's key distinguishing approach (primitives, CSS variables, semantic color scales)
- [ ] Lint passes
- [ ] Build passes
- [ ] `SESSION_LOG.md` updated

---

## Task 5.2 — Ant Design capture

**Status:** not started
**Phase:** 5

### What this task implements

Captures Ant Design documentation. Ant Design is the dominant enterprise design system in the Chinese tech ecosystem and has a substantially different design philosophy (more prescriptive components, design values, Chinese typography considerations). Documents the token architecture and color system.

Source: ant.design/docs/spec/ and ant.design/docs/react/. Token source: `@ant-design/tokens` npm package.

### Files created or modified

- `kb/design-systems/ant-design/_index.md`
- `kb/design-systems/ant-design/guidance/foundations/` — color, typography, design tokens
- `_meta/INDEX.md` — updated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `kb/design-systems/ant-design/` exists with `_index.md` and at least 2 guidance files
- [ ] Content notes Ant Design's Design Values (Nature, Certainty, Meaning, Growth) as context for its decisions
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 5.3 — Foundations KB: Typography science

**Status:** not started
**Phase:** 5

### What this task implements

Adds typography science to `kb/foundations/` — the scientific basis for type decisions in design systems. Content covers: modular type scales and why they work (musical intervals, optical scaling), x-height and cap-height as legibility drivers, line height mathematics (leading, UPM, line box), and the productive/expressive type split pattern. Sources: Google Fonts Knowledge (fonts.google.com/knowledge), Practical Typography (practicaltypography.com).

### Files created or modified

- `kb/foundations/typography/_index.md`
- `kb/foundations/typography/type-scales@2026-05-xx.md` + stub
- `kb/foundations/typography/legibility@2026-05-xx.md` + stub
- `_meta/INDEX.md` — foundations section expanded
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] 2 content files covering: why modular scales work, legibility factors (x-height, line height, measure)
- [ ] Content explains the *why* — not just how to use a type scale, but why the math produces harmonious steps
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 5.4 — End-to-end play testing

**Status:** not started
**Phase:** 5

### What this task implements

First dedicated play testing round. Each play is run end-to-end: copy from live app, paste into Claude Code in a scratch repo, evaluate output quality against stated acceptance criteria. Findings drive prompt revisions.

**Plays to test (priority order):**
1. `generate-design-md` — Stage 1 flagship; validates KB bundle URL and DESIGN.md format guidance
2. `generate-color-scheme` — Stage 2; validates color reference URLs and CSS token output
3. `plan-token-architecture` — Stage 1; validates reference bundling
4. `generate-typography-scale` — Stage 2; validates font reference handling

**Evaluation criteria per play:**
- Output format matches KB reference (DESIGN.md format, CSS variable naming, token naming conventions)
- Output is internally consistent (primitive palette ↔ semantic tokens ↔ component tokens)
- Output does not copy M3-specific values unless genuinely applicable
- Output handles the `{{variable}}` substitution correctly (values appear, not placeholders)

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — prompt revisions based on test findings
- `_meta/exemplars/` — replace or update existing exemplars with higher-quality outputs
- `SESSION_LOG.md` — test findings and per-play notes

### Acceptance criteria

- [ ] At minimum 2 plays tested end-to-end in a live Claude Code session
- [ ] Each tested play has a finding documented (pass / issues found / revisions made)
- [ ] At least 1 exemplar updated with output from a live test run
- [ ] `SESSION_LOG.md` updated with test notes

---

## Task 5.5 — Sistema dogfood: generate a DESIGN.md for Sistema

**Status:** not started
**Phase:** 5

### What this task implements

Runs the `generate-design-md` play against Sistema itself — using the playbook to generate the design specification for the app the playbook lives in. This validates the Stage 1 flow end-to-end and produces a real artifact that can be committed to the repo.

Input: a description of Sistema's visual character — clean, typographic, minimal; uses Tailwind gray scale; no brand color; optimized for reading dense reference material.

Expected output: a `DESIGN.md` file for Sistema committed at `kb/design-systems/sistema/design-md/DESIGN.md` or `public/DESIGN.md`.

### Files created or modified

- `DESIGN.md` (repo root) or `kb/design-systems/sistema/design-md/DESIGN.md` — generated artifact
- `SESSION_LOG.md` — generation notes and any prompt revisions needed

### Acceptance criteria

- [ ] A DESIGN.md for Sistema exists and follows the official format spec
- [ ] The file describes Sistema's actual visual language (not M3 values)
- [ ] The file is validated against `kb/standards/design-md/spec.md`
- [ ] Findings from the generation run are documented in SESSION_LOG

---

## Task 5.6 — Phase 5 housekeeping

**Status:** not started
**Phase:** 5

Standard end-of-phase housekeeping: compress task file, archive session log, update AGENTS.md, write retro, generate `tasks/phase-6.md`.

### Acceptance criteria

- [ ] All Phase 5 session entries archived to `logs/phase-5.md`
- [ ] `tasks/phase-5.md` compressed to summaries
- [ ] `AGENTS.md` updated with any new Phase 5 patterns
- [ ] `docs/phase-5-retro.md` written
- [ ] `tasks/phase-6.md` generated
- [ ] Lint passes on all KB directories | Build passes | Commit created
