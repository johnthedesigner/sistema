# Phase 4 Task File

**Phase goal:** Expand the KB into standards and foundations with a few representative examples; refine the playbook's presentation and workflow UX before locking down content.

**Systems touched:** `kb/standards/` (new content), `kb/foundations/` (new content)
**App:** Playbook workflow refinements; improved play page layout; KB browse improvements

**Context from Phase 3:**
- 4 design systems: Material, Carbon, Atlassian, Primer — all at `kb/design-systems/`; 38 content files
- Component docs for Material + Carbon (button, text-field/input, dialog/modal, navigation)
- Interactive playbook fields (`{{variable_name}}` + `PlayForm`); exemplar previews on play pages
- Guide page at `/guide`; "Guide" in nav
- Build: ~63 static pages; Vercel deployed at https://sistema-bay-seven.vercel.app
- Phase 5 scope: remaining design systems (Radix, Ant Design), full component coverage, play finalization
- Phase 6 scope: dogfood — generate a design system for Sistema itself using the playbook

---

## Task 4.1 — Standards KB example: WCAG accessibility reference

**Status:** not started
**Phase:** 4

### What this task implements

Adds the first content to `kb/standards/` — a practical WCAG 2.2 reference structured for AI coding tools. Not a full WCAG transcription, but a structured reference covering the criteria most relevant to UI component implementation: color contrast (1.4.3, 1.4.6, 1.4.11), keyboard operability (2.1.1, 2.1.2), focus visibility (2.4.7, 2.4.11), touch targets (2.5.5, 2.5.8), and state/name/role (4.1.2). Format mirrors the design system guidance files: concise, decision-oriented, with concrete pass/fail values.

### Files created or modified

- `kb/standards/wcag/_index.md` — standards sub-directory index
- `kb/standards/wcag/color-contrast@2026-05-12.md` + stub — contrast ratios, formulas, tool references
- `kb/standards/wcag/keyboard-and-focus@2026-05-12.md` + stub — keyboard operability, focus requirements, focus ring implementation
- `kb/standards/wcag/components@2026-05-12.md` + stub — ARIA roles, state exposure, interactive component requirements
- `_meta/INDEX.md` — standards section added
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `kb/standards/wcag/` directory exists with `_index.md` and at least 2 content files + stubs
- [ ] Files contain concrete pass/fail values (e.g. 4.5:1, 3:1, 44×44px) — not just criterion numbers
- [ ] Lint passes on `kb/standards/`
- [ ] Standards routes render in the app (reachable at `/kb/standards/wcag/...`)
- [ ] `_meta/INDEX.md` updated with a standards section
- [ ] `npm run build` passes
- [ ] `SESSION_LOG.md` updated

---

## Task 4.2 — Foundations KB example: Color theory reference

**Status:** not started
**Phase:** 4

### What this task implements

Adds the first content to `kb/foundations/` — a color science reference that provides the reasoning layer behind design system color decisions. Content covers: perceptual color models (HSL, HCT/CAM16-UCS, OKLab), why tonal palettes work (lightness uniformity), how contrast is computed (WCAG vs. APCA), and practical implications for token architecture. This gives plays better grounding when generating color systems — the agent can reason from first principles rather than just pattern-matching on examples.

### Files created or modified

- `kb/foundations/color/_index.md` — foundations sub-directory index
- `kb/foundations/color/perceptual-models@2026-05-12.md` + stub — HSL, HCT, OKLab; what each model optimizes for; which design systems use each
- `kb/foundations/color/contrast-and-accessibility@2026-05-12.md` + stub — WCAG contrast algorithm, APCA, tonal palette design for accessibility
- `_meta/INDEX.md` — foundations section added
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `kb/foundations/color/` directory exists with `_index.md` and at least 2 content files + stubs
- [ ] Content explains *why* perceptual models exist, not just how they're calculated
- [ ] Lint passes on `kb/foundations/`
- [ ] Foundations routes render in the app
- [ ] `_meta/INDEX.md` updated with a foundations section
- [ ] `npm run build` passes
- [ ] `SESSION_LOG.md` updated

---

## Task 4.3 — Playbook layout refinement

**Status:** not started
**Phase:** 4

### What this task implements

Improves the playbook browse and play page experience based on what's been learned using the current implementation. Specific improvements:

**Playbook index:** Add stage filter tabs or jump navigation so users can go directly to a stage without scrolling past all prior stages. On mobile, the current long-scroll approach is workable but could be better.

**Play page:** Rethink the single-column layout. Consider a two-column arrangement at wider viewports — prompt on the left, exemplar preview on the right — so users can see both simultaneously. Currently the exemplar is buried below a long prompt body.

**Variable fields:** Improve the `PlayForm` UX — better field labels, placeholder text hinting at expected format (e.g. "e.g. #2563EB" for a color field), and a clearer visual relationship between the fields and the copy button.

### Files created or modified

- `src/app/playbooks/page.tsx` — stage navigation/filter
- `src/app/playbooks/[slug]/page.tsx` — layout improvements
- `src/components/playbooks/PlayForm.tsx` — UX improvements to variable fields
- Possibly: new layout components as needed

### Acceptance criteria

- [ ] Playbook index has per-stage navigation (tabs, anchors, or jump links) — user can reach Stage 3 without scrolling past Stages 1–2
- [ ] Play page exemplar is reachable without excessive scrolling on desktop
- [ ] Variable fields have placeholder text giving format hints
- [ ] All changes verified in browser at desktop (1280px+) and mobile (375px) viewports
- [ ] No regressions on existing play copy functionality
- [ ] `npm run build` passes
- [ ] `SESSION_LOG.md` updated

---

## Task 4.4 — KB browse improvements

**Status:** not started
**Phase:** 4

### What this task implements

Improves discoverability in the knowledge base. The current `/kb` index lists systems as cards, but once inside a system the navigation is minimal — breadcrumbs only, no sidebar, no quick way to jump between topics within a system. This task adds:

**System page:** A topic/category list on the system overview page so users can see all available content types at a glance and jump directly to a topic.

**Content page:** A simple "In this system" side panel or bottom nav showing other available topics in the same system, so users can navigate without returning to the root.

**Cross-system:** Consider a "See also" section on guidance pages that links to the equivalent topic in other systems (e.g. "Color system" in Material links to Carbon's color-system page).

### Files created or modified

- `src/app/kb/[category]/[slug]/page.tsx` — system overview improvements
- `src/app/kb/[category]/[slug]/[...path]/page.tsx` — in-system navigation
- Possibly: new navigation components

### Acceptance criteria

- [ ] System overview page lists all available content with working links
- [ ] Content pages show in-system navigation (topic list, or next/prev within category)
- [ ] Navigation works on mobile without horizontal overflow
- [ ] `npm run build` passes; no broken links
- [ ] `SESSION_LOG.md` updated

---

## Task 4.5 — Phase 4 housekeeping

**Status:** not started
**Phase:** 4

### What this task implements

End-of-phase housekeeping. Compresses task file, archives session log entries, updates AGENTS.md with any new Phase 4 patterns, writes the Phase 4 retrospective, and generates `tasks/phase-5.md` for review.

### Files created or modified

- `tasks/phase-4.md` — all task entries compressed
- `tasks/phase-5.md` — generated and reviewed
- `SESSION_LOG.md` — Phase 4 entries removed; pointer to archive; Current State updated to Phase 5 pending
- `logs/phase-4.md` — Phase 4 session entries archived
- `AGENTS.md` — any new patterns from Phase 4 added
- `docs/phase-4-retro.md` — brief retrospective

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-4.md` compressed to summary form
- [ ] All Phase 4 session entries moved from `SESSION_LOG.md` to `logs/phase-4.md`
- [ ] `SESSION_LOG.md` Current State shows Phase 5 pending
- [ ] `AGENTS.md` updated with any new patterns
- [ ] `docs/phase-4-retro.md` written
- [ ] `tasks/phase-5.md` generated and any issues flagged
- [ ] Lint passes on all KB directories
- [ ] `npm run build` passes
- [ ] Commit created
