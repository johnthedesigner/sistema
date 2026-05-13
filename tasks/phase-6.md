# Phase 6 Task File

**Phase goal:** Build the synthesis layer (`kb/principles/`) and redesign the playbook to be system-independent. This phase is almost entirely knowledge and content work — the app changes required by the new KB structure are included in Task 6.0, but the campaign app feature (intake form, file generator, flow UI) is deferred to Phase 7.

**Core product shift this phase enables:** Plays and campaigns stop referencing individual design systems and start referencing synthesis documents that distill collective wisdom. An agent using the playbook will produce original, professional-quality design systems — not remixed versions of Material, Carbon, or Radix.

**Context from Phase 5:**
- 7 design systems documented: Material, Carbon, Atlassian, Primer, Radix, Ant Design + DESIGN.md spec
- Standards: WCAG 2.2 (3 files); Foundations: color science (2 files), typography science (2 files)
- Playbook: 12 plays across 5 stages; play testing validated end-to-end in-session
- Build: ~95 static pages; deployed on Vercel

---

## Task 6.0 — KB restructure

**Status:** not started
**Phase:** 6
**Must complete before:** all other tasks (establishes directory structure everything else writes into)

### What this task implements

Reorganizes the KB filesystem and updates the app to match. Three existing categories move under a `reference/` parent; a new `principles/` directory is created.

**Filesystem changes:**
- `kb/design-systems/` → `kb/reference/design-systems/`
- `kb/standards/` → `kb/reference/standards/`
- `kb/foundations/` → `kb/reference/foundations/`
- Create `kb/principles/` (empty, ready for Task 6.1+)

**App changes:**
URLs remain unchanged (transparent migration — `/kb/design-systems/material/...` still works). The app's `src/lib/kb.ts` is updated to look for `reference` categories under `kb/reference/[category]/` and for `principles` under `kb/principles/`. The `listSystems(category)` function and all route handlers must be updated to resolve the new filesystem paths without changing the URL structure.

**URL decision:** `reference` does NOT appear in URLs. Existing URLs (`/kb/design-systems/`, `/kb/standards/`, `/kb/foundations/`) remain valid. `principles` is a new URL-level category at `/kb/principles/`. This avoids breaking all existing URLs referenced in play prompts, AGENTS.md, and external links.

### Files created or modified

- `kb/reference/` — new parent directory (all existing content moved here)
- `kb/principles/` — new empty directory
- `src/lib/kb.ts` — updated category resolution
- All route files that reference category names in filesystem paths
- `_meta/INDEX.md` — updated to reflect new paths
- `AGENTS.md` — structure section updated (already done in Task 5.6)
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] All existing KB content accessible at unchanged URLs (no 404s)
- [ ] `/kb/principles/` route resolves without error (empty state handled gracefully)
- [ ] `/raw/` and `/bundle/` routes work with existing URLs
- [ ] `_meta/INDEX.md` updated with new paths
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.1 — Synthesis: Token architecture

**Status:** not started
**Phase:** 6

### What this task implements

The meta-level synthesis document: how to structure a design token system, independent of any one system's approach. This is what an agent reads before making any token architecture decisions — not "how Material does it" but "what makes a token system durable and why."

**Content to cover:**
- The tier model (primitive → semantic → component) and why each tier exists
- Naming convention principles: what makes names durable vs. brittle; semantic vs. descriptive naming
- Dark mode at the token level: the three approaches (separate CSS files, `[data-theme]` overrides, `prefers-color-scheme`), tradeoffs of each
- Component tokens: when the overhead is justified, when it isn't
- Token categories: which categories every system needs (color, type, spacing, shape) vs. optional (motion, elevation, z-index)
- Common failure modes: too many tiers, over-scoped component tokens, names that describe values rather than roles

**Sources:** `kb/reference/design-systems/material/guidance/foundations/design-tokens`, `kb/reference/design-systems/radix/guidance/foundations/design-tokens`, `kb/reference/design-systems/ant-design/guidance/foundations/design-tokens`, `kb/reference/design-systems/carbon/` token architecture docs

### Files created or modified

- `kb/principles/tokens/architecture@2026-xx-xx.md` + stub
- `kb/principles/tokens/_index.md`
- `_meta/INDEX.md` — updated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Document covers all three tiers with clear rationale for each
- [ ] Dark mode approaches section includes concrete tradeoffs, not just descriptions
- [ ] Document is system-agnostic — no "Material does X" framing
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.2 — Synthesis: Color architecture

**Status:** not started
**Phase:** 6

### What this task implements

The richest synthesis document — well-sourced from the existing KB. Covers what every color system needs and the major architectural approaches with their actual tradeoffs.

**Content to cover:**
- What every robust color system requires, regardless of approach: semantic roles, accessible pairings, light/dark variants, never-hardcode principle
- The four major architectural models and when each is appropriate:
  - Tonal palettes (M3): best for algorithmic generation from a single seed, dynamic color
  - Step scales (Radix): best for developer ergonomics, predictable stops, component-level composition
  - Named palettes (Ant Design, Carbon): best for explicit brand control, enterprise contexts
  - Contextual tokens (Carbon's extended model): best for data-dense UIs with many surface types
- The decision framework: mapping product context (brand control needed, audience, density, scale of customization) to appropriate approach
- The non-negotiable floor: WCAG contrast requirements, the `on-*` pairing pattern (regardless of what it's called), never-hardcode in components
- Dark mode: tonal shift logic, why naive inversion fails, what "dark-mode-first" means in practice
- Neutral palette design: why neutral chroma matters, warm vs. cool vs. true-neutral and what each communicates

**Sources:** All four design system color KB files + `kb/reference/foundations/color/perceptual-models`, `kb/reference/foundations/color/contrast-and-accessibility`, `kb/reference/standards/wcag/color-contrast`

### Files created or modified

- `kb/principles/color/architecture@2026-xx-xx.md` + stub
- `kb/principles/color/_index.md`
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Four architectural models covered with clear "use when" framing (not just description)
- [ ] Decision framework is actionable — given context X, points to approach Y
- [ ] Dark mode section explains tonal shift logic without referencing HCT/M3-specific mechanics
- [ ] Non-negotiable floor clearly distinguished from recommended practices
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.3 — Synthesis: Typography

**Status:** not started
**Phase:** 6

### What this task implements

Scale construction approaches, role taxonomy decisions, and legibility constraints — the foundation for making original typography decisions rather than copying a system's scale.

**Content to cover:**
- Scale construction: modular (geometric) vs. hand-tuned; when each is appropriate; the ratio selection question (minor third vs. perfect fourth vs. golden ratio — what each produces and why)
- The role taxonomy question: named roles (display/headline/title/body/label pattern) vs. numeric steps (1–9) — what drives the choice; named roles aid communication, steps aid composition
- Legibility constraints that are not design preferences: line height ranges (120–145%), optimal measure (45–90 chars), x-height and size perception, letter-spacing at display sizes
- Density axis: how information density should drive type scale decisions before aesthetic ones
- Variable fonts: when the complexity is worth it, what axes matter (weight, width, optical-size)
- How type decisions interact with the spacing system

**Sources:** All design system typography KB files + `kb/reference/foundations/typography/type-scales`, `kb/reference/foundations/typography/legibility`

### Files created or modified

- `kb/principles/typography/architecture@2026-xx-xx.md` + stub
- `kb/principles/typography/_index.md`
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Scale construction section covers modular vs. hand-tuned with concrete tradeoffs
- [ ] Role taxonomy section gives a genuine decision framework, not just a description
- [ ] Legibility constraints section clearly distinguishes non-negotiable from recommended
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.4 — Synthesis: Spacing, shape, depth, motion

**Status:** not started
**Phase:** 6

### What this task implements

Four shorter synthesis documents covering the environmental and dimensional properties of a design system.

**Spacing and layout:**
- Base unit selection: 4px vs. 8px and when the distinction matters for the product
- How a spacing scale connects layout, component padding, and stacking as a unified system
- The density axis: information-dense environments need tighter spacing throughout — not just smaller components
- Breakpoint philosophy: content-first vs. device-first; why the number of breakpoints should be minimized
- Responsive token approach: spacing tokens that scale vs. static tokens with responsive utilities

**Shape:**
- Border radius as a personality signal — sharp ↔ rounded on a dimension from formal/precise to friendly/approachable
- Scale approaches and the case for role-based naming over raw values
- Component consistency: why components in the same family should share a shape tier
- When to use full-radius (pill) sparingly vs. as a system-wide default

**Depth and elevation:**
- Two fundamentally different models: shadow-based (most systems) vs. tonal surface layering (M3)
- When each approach is appropriate: shadow for general-purpose, tonal for systems with a rich surface vocabulary
- The layering problem: how to communicate depth without visual noise
- Combining both: using subtle shadows for interactive feedback while using surface tones for structural depth

**Motion:**
- Easing curve semantics: ease-out for entrances, ease-in for exits, ease-in-out for movement between states
- Duration guidelines: 100–400ms range, what affects appropriate duration (distance, size, importance)
- Functional vs. expressive motion stance and how to serve both within a single system
- `prefers-reduced-motion` is non-negotiable — design motion as an enhancement, not a requirement

**Sources:** Radix spacing + radius KB files, Material elevation and motion docs, Carbon motion docs, `kb/reference/foundations/` as applicable

### Files created or modified

- `kb/principles/spacing/layout@2026-xx-xx.md` + stub
- `kb/principles/shape/architecture@2026-xx-xx.md` + stub
- `kb/principles/depth/architecture@2026-xx-xx.md` + stub
- `kb/principles/motion/architecture@2026-xx-xx.md` + stub
- `_index.md` for each subdirectory
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] All four documents cover their subject at synthesis level (not system documentation)
- [ ] Each document includes a decision framework section
- [ ] Motion document explicitly covers `prefers-reduced-motion`
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.5 — Synthesis: Accessibility floor

**Status:** not started
**Phase:** 6

### What this task implements

Accessibility requirements written as constraints, not guidance. Unlike the WCAG KB files (which describe the spec), this synthesizes into actionable minimums that every design system must satisfy. Designed to be referenced in every campaign step as a non-negotiable check.

**Content to cover:**
- Color contrast: WCAG AA minimums by text role (4.5:1 small, 3:1 large/UI), APCA as a better model and when to use it, dark mode contrast as a separate concern
- Keyboard navigation: every interactive element must be reachable via keyboard; tab order must match visual order; no keyboard traps
- Focus visibility: `:focus-visible` minimum styling, what constitutes a visible focus indicator, the 3:1 contrast requirement for focus rings (WCAG 2.4.11)
- Touch targets: 44×44px minimum (WCAG 2.5.5); 24×24px absolute minimum with adequate spacing (WCAG 2.5.8)
- ARIA patterns: semantic HTML first; ARIA only for patterns that have no semantic equivalent; role/name/state triad; common mistakes
- Motion: `prefers-reduced-motion` (also covered in motion synthesis — cross-referenced here)
- Text: minimum 16px for body text as a practical guideline (not WCAG); line length and line height for readability

**Sources:** `kb/reference/standards/wcag/`, `kb/reference/foundations/color/contrast-and-accessibility`

### Files created or modified

- `kb/principles/accessibility/floor@2026-xx-xx.md` + stub
- `kb/principles/accessibility/_index.md`
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Every requirement is stated as a constraint ("must"), not a recommendation ("should")
- [ ] Each constraint includes how to verify it (contrast checker, keyboard test, etc.)
- [ ] Document is structured to be scannable as a checklist, not read as prose
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.6 — Synthesis: AI concerns

**Status:** not started
**Phase:** 6

### What this task implements

Two documents covering the intersection of design systems and AI — one on AI as a product feature, one on AI as a collaborator in building and maintaining the system.

**AI-driven UI patterns:**
The industry is still working this out, which makes this synthesis especially valuable. Content:
- Chat interfaces: message bubbles (user vs. assistant visual differentiation), streaming text states, typing indicators, message status
- Streaming and loading states: skeleton patterns for generative content, progressive disclosure, avoiding layout shift during streaming
- Confidence and uncertainty signals: how to communicate AI output confidence without alarming users; visual language for "draft" vs. "verified"
- Making AI-generated content visually distinct from human-authored content (important for trust and transparency)
- Error states specific to AI: retry patterns, degraded-mode fallbacks, rate-limit UX, hallucination disclosure
- Prompt and input UX: multi-line text areas with send affordance, slash-command menus, file attachment patterns

**LLM compatibility (design systems and AI tools):**
- What makes a design system machine-readable: token naming that communicates intent, not just value; structured documentation that fits in context windows
- DESIGN.md as the primary AI brief: how to write it for both human and LLM readers; the trade-off between completeness and context window cost
- Token naming for LLM comprehension: `--color-primary` > `--c-p`; role-based names over arbitrary names; consistent patterns across categories
- Documentation density: per-file doc design that keeps any single file usable as context without needing the whole system
- The living brief pattern: maintaining a compact project-state document that an LLM can read at session start to resume context accurately
- Keeping an LLM current: update cadence for the living brief, what changes warrant updating it vs. what doesn't

### Files created or modified

- `kb/principles/ai/ui-patterns@2026-xx-xx.md` + stub
- `kb/principles/ai/llm-compatibility@2026-xx-xx.md` + stub
- `kb/principles/ai/_index.md`
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] AI-driven UI patterns document covers chat, streaming, confidence signals, and error states
- [ ] LLM compatibility document covers token naming, DESIGN.md, and living brief pattern
- [ ] Both documents are system-agnostic (no framework-specific code)
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.7 — Living brief spec and template

**Status:** not started
**Phase:** 6

### What this task implements

Defines the living brief as a first-class project artifact with a formal spec. The living brief is the per-project state document that plays read at the start of each work session and append to at the end — it's what keeps an LLM current with design system decisions across sessions.

**Spec covers:**
- What the living brief is and what it is NOT (not DESIGN.md, not a changelog, not a README)
- Required sections: project identity, key decisions per concern area (color, type, spacing, shape, motion), current system state (what exists, what's stubbed, what's missing), open questions, decision log with dates
- How it differs from DESIGN.md: DESIGN.md is the outward-facing spec for consuming the system; the living brief is the inward-facing state document for building it
- How plays interact with it: each play prompt includes "read the living brief at the start; append a '[date] — [what you decided]' entry at the end"
- Update cadence: when a decision changes, update immediately; when scope changes, update immediately; after every retrospective play
- Format requirements: must fit in under ~150 lines to remain usable as context window content; structured for scanability not reading

**Template:** A blank living brief template in `_meta/templates/LIVING_BRIEF.md` that users commit at bootstrap.

### Files created or modified

- `_meta/LIVING_BRIEF_SPEC.md` — the specification
- `_meta/templates/LIVING_BRIEF.md` — blank template
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Spec clearly distinguishes living brief from DESIGN.md
- [ ] Template is under 100 lines with all required sections stubbed
- [ ] Spec includes concrete examples of a decision log entry
- [ ] `SESSION_LOG.md` updated

---

## Task 6.8 — Campaign redesign

**Status:** not started
**Phase:** 6

### What this task implements

Revises the 5-step bootstrap campaign to use synthesis KB URLs instead of Material references, adds a positioning play (Step 0), and wires the living brief throughout. This is content work — the app feature that generates the campaign file is Phase 7.

**Changes to campaign steps:**
- **Step 0 (new) — Positioning brief:** Product questions (density, audience, brand constraints, expressive vs. utilitarian) → positioning brief that seeds the living brief and informs every subsequent step
- **Step 1 (revised) — DESIGN.md:** Replace `{{sistema_url}}/bundle/design-systems/material` with DESIGN.md spec from `kb/reference/standards/design-md/` + the principles/tokens/architecture synthesis. Remove all M3-specific language.
- **Step 2 (revised) — Color tokens:** Replace Material color-system/color-roles references with `kb/principles/color/architecture`. Replace "M3 tonal logic" language with system-agnostic dark mode guidance.
- **Step 3 (revised) — Type, spacing, shape:** Replace Material typography/shape references with `kb/principles/typography/architecture` + `kb/principles/spacing/layout` + `kb/principles/shape/architecture`.
- **Step 4 (revised) — Components:** Replace Material implementation reference with `kb/principles/tokens/architecture` for token consumption pattern. Remove `--color-surface-container-highest` and other M3-specific token name references.
- **Step 5 — Documentation:** Light revision; already mostly system-agnostic.

**Living brief wiring:** Each step begins with "read the living brief from disk or session artifacts" and ends with "append your key decisions to the living brief."

**Light/dark/both selector:** Step 2 prompt branches based on theme selection — light-only produces only `:root {}`, both produces `:root {}` + `[data-theme="dark"] {}`.

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — add positioning play, revise 5 campaign steps
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] No step references any individual design system's KB URL
- [ ] Every step references one or more `kb/principles/` synthesis document URLs
- [ ] Positioning play (Step 0) produces a positioning brief that feeds the living brief
- [ ] Living brief read/append instructions present in all 5 steps
- [ ] M3-specific terminology removed from all step prompts
- [ ] `SESSION_LOG.md` updated

---

## Task 6.9 — Maintenance plays (Stage 6)

**Status:** not started
**Phase:** 6

### What this task implements

Six stewardship plays forming Stage 6 of the playbook. These enable the planning → execution → retrospective → repeat lifecycle for ongoing design system work.

**Plays:**

1. **session-start** — Read the living brief, confirm scope for this session, identify the relevant synthesis documents for the planned work, set context before beginning. Prevents an LLM from going in blind and making decisions that conflict with prior decisions.

2. **add-component** — Given a component name and description, read the living brief + relevant token files + component behavioral patterns synthesis, then implement the component consistently with existing system patterns. Includes token consumption check and accessibility requirements.

3. **audit-token-coverage** — Read the living brief and token files, then scan the codebase for hardcoded values (hex colors, raw px values) that should be consuming tokens. Produces a prioritized list of drift to fix.

4. **accessibility-audit** — Read the accessibility floor synthesis + the living brief, then evaluate current components against the non-negotiable requirements. Produces a structured audit report with severity levels.

5. **design-system-retrospective** — Read the living brief and the current state of token + component files, identify what has drifted from the spec, what was added without being documented, and what decisions need revisiting. Updates the living brief and flags any changes needed to DESIGN.md.

6. **plan-next-iteration** — Read the living brief retrospective entries and the current system state, then produce a prioritized task list for the next work cycle — the planning step in the planning → execution → retrospective loop.

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — 6 new plays added, Stage 6 section added
- `src/lib/playbooks.ts` — Stage 6 label and description added to `STAGE_LABELS` and `STAGE_DESCRIPTIONS`
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] All 6 plays written and added to `TASK_PLAYBOOKS.md`
- [ ] Stage 6 renders correctly in the playbook UI (stage card, listing page, individual play pages)
- [ ] Each play references synthesis KB URLs, not individual system KB URLs
- [ ] Each play that modifies state includes living brief update instructions
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 6.10 — License compliance audit

**Status:** deferred from Phase 5 (Task 5.7)
**Phase:** 6

Audit all existing KB content sources for compliance with the licensing rule added in AGENTS.md Step 1b. For each source, document the license tier in the relevant `_index.md` Source Map. Evaluate Tier 3 sources (public but no explicit license) individually: practicaltypography.com, spencermortensen.com, bottosson.github.io/posts/oklab/. Determine whether content is synthesis (acceptable with attribution) or substantial reproduction (requires replacement). Propose replacement sources where needed.

Full task spec is in `tasks/phase-5.md` (Task 5.7 entry).

### Acceptance criteria

- [ ] Every `_index.md` Source Map documents the license tier for each source URL
- [ ] All Tier 3 sources individually evaluated
- [ ] No non-compliant sources remain without a documented plan
- [ ] `SESSION_LOG.md` updated

---

## Task 6.11 — Phase 6 housekeeping

**Status:** not started
**Phase:** 6

Standard end-of-phase: compress task file, archive session log, update AGENTS.md, write retro, generate `tasks/phase-7.md`.

Phase 7 scope (to be written during this task): bootstrap campaign app feature — intake form, campaign file generator, flow UI (campaigns rendered differently from single plays), light/dark/both selector, advanced options checklist.

### Acceptance criteria

- [ ] All Phase 6 session entries archived to `logs/phase-6.md`
- [ ] `tasks/phase-6.md` compressed to summaries
- [ ] `AGENTS.md` updated with Phase 6 patterns
- [ ] `docs/phase-6-retro.md` written
- [ ] `tasks/phase-7.md` generated
- [ ] Lint passes | Build passes | Commit created
