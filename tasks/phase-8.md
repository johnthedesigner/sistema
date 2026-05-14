# Phase 8 Task File

**Phase goal:** Deepen the tool suite — more campaigns, a generative palette input, and KB completion for typography. Phase 7 built the product skeleton; Phase 8 fills it out.

**Context from Phase 7:**
- Palette generation API live at `POST /api/palette`; 22-palette pre-generated library at `/tools/palette`; CSS/Tailwind/Figma export formats
- Campaign app live at `/campaigns`; one campaign ("Bootstrap a Design System", 6 steps); sessionStorage state, export page
- `ColorModeSelector` pattern: localStorage-backed pre-fill for `{{color_mode}}` in `generate-color-scheme`
- Typography KB: legibility, type-scales, typographic-rhythm — three documents. Google Fonts Knowledge pending manual license verification.
- Build: 135 static pages, lint clean

---

## Task 8.0 — Google Fonts Knowledge synthesis

**Status:** not started
**Phase:** 8
**Requires:** Manual license verification (check `fonts.google.com/knowledge` page footer in a browser for CC BY 4.0 notice)

### What this task implements

If Google Fonts Knowledge is confirmed CC BY 4.0: synthesize a new KB document covering the topics not in the current typography foundations — optical sizing, variable fonts, responsive type scaling, and tracking/letter-spacing at scale. These fill the gap left when webtypography.net (CC BY-NC) was synthesized; GFK covers more modern web typography concerns.

If license cannot be confirmed or is more restrictive than expected: document the outcome in PENDING_SOURCES.md and close the item.

### Files potentially created or modified

- `kb/reference/foundations/typography/responsive-typography@2026-05-13.md` — new synthesis doc
- `kb/reference/foundations/typography/responsive-typography.md` — stub
- `kb/reference/foundations/typography/_index.md` — Source Map update
- `_meta/PENDING_SOURCES.md` — mark resolved

### Acceptance criteria

- [ ] License status confirmed (CC BY 4.0 or not) and documented
- [ ] If cleared: new doc covers optical sizing, variable font axes (wght/wdth/opsz), responsive type (clamp(), fluid type), and tracking direction by size
- [ ] `_meta/PENDING_SOURCES.md` updated to reflect final status
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 8.1 — Second campaign: Audit and Refactor

**Status:** not started
**Phase:** 8

### What this task implements

A second campaign that uses the Stage 6 stewardship plays to audit an existing design system and plan a refactor. This establishes campaigns as a pattern (not a one-off bootstrap flow) and makes the stewardship plays more discoverable.

**Proposed campaign:** "audit-and-refactor" — 5 steps:
1. `session-start` — orient in the existing system's living brief
2. `audit-token-coverage` — scan for hardcoded values; severity report
3. `accessibility-audit` — evaluate component accessibility compliance
4. `design-system-retrospective` — document drift and open decisions
5. `plan-next-iteration` — prioritize the refactor work

**Campaign definition** goes in `_meta/CAMPAIGNS.md` in the established format. No new app code needed — the campaign system already handles multi-step flows.

### Files created or modified

- `_meta/CAMPAIGNS.md` — add audit-and-refactor campaign definition
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `/campaigns/audit-and-refactor/1` through `/campaigns/audit-and-refactor/5` render correctly
- [ ] Campaign index page shows both campaigns
- [ ] Build: new step + export pages generate statically
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 8.2 — Custom palette seed input

**Status:** not started
**Phase:** 8

### What this task implements

A user-facing seed input on `/tools/palette` that calls `POST /api/palette` with a custom hex color and renders the resulting 19-stop palette inline alongside the pre-generated library. Makes the palette tool generative, not just a library browser.

**UI:**
- Hex input field + "Generate" button above or below the pre-generated grid
- On submit: POST to `/api/palette`, render result as a new palette row/section
- Show palette name as "Custom (your-hex-here)"
- Apply the same `PaletteControls` copy/export to the custom palette
- Error state for invalid hex or API failure

**State:** Custom palette in React state (not persisted); cleared on page reload.

### Files created or modified

- `src/components/palette/CustomSeedInput.tsx` — new client component
- `src/app/tools/palette/page.tsx` — integrate custom seed input section

### Acceptance criteria

- [ ] Hex input validates format client-side before submitting
- [ ] Valid hex generates and renders a 19-stop palette
- [ ] Custom palette can be copied/exported in all three formats (CSS, Tailwind, Figma)
- [ ] Invalid hex shows clear error
- [ ] API error (500) shows user-facing fallback message
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 8.3 — Stage 6 play exemplars

**Status:** not started
**Phase:** 8

### What this task implements

Generate exemplar output files for the six Stage 6 stewardship plays (session-start, add-component, audit-token-coverage, accessibility-audit, design-system-retrospective, plan-next-iteration). Exemplars provide users with concrete examples of each play's expected output — the same pattern used for generate-color-scheme and generate-design-md.

**Process for each play:**
1. Run the play against a representative design system context (can use the "Verdant" fictional system established in existing exemplars, or create a new context)
2. Review output for quality and completeness
3. Commit as `_meta/exemplars/[topic]/[slug]-example.md`

Each exemplar should demonstrate the full play output — not an abbreviated version.

### Files created or modified

- `_meta/exemplars/stewardship/session-start-example.md`
- `_meta/exemplars/stewardship/add-component-example.md`
- `_meta/exemplars/stewardship/audit-token-coverage-example.md`
- `_meta/exemplars/stewardship/accessibility-audit-example.md`
- `_meta/exemplars/stewardship/design-system-retrospective-example.md`
- `_meta/exemplars/stewardship/plan-next-iteration-example.md`
- `src/lib/exemplars.ts` — add stewardship exemplar loading if needed

### Acceptance criteria

- [ ] All 6 stewardship plays have exemplar files
- [ ] Each exemplar is substantive (reflects a realistic play output, not a stub)
- [ ] Exemplars link to the correct play slug so they render in the UI
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 8.4 — Phase 8 housekeeping

Standard end-of-phase: compress task file, archive session log, update AGENTS.md, write retro, generate `tasks/phase-9.md`.

Phase 9 scope (to be defined during this task): depends on Phase 8 findings. Likely candidates: Vercel deployment and production URL wiring (enables play testing), KB expansion for additional design systems (Primer, Shoelace, or a non-English system), campaign refinement from user feedback, APCA palette variant (dark-mode-first).

### Acceptance criteria

- [ ] All Phase 8 session entries archived to `logs/phase-8.md`
- [ ] `tasks/phase-8.md` compressed to summaries
- [ ] `AGENTS.md` updated with Phase 8 patterns
- [ ] `docs/phase-8-retro.md` written
- [ ] `tasks/phase-9.md` generated
- [ ] Lint passes | Build passes | Commit created
