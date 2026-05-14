---
play_slug: session-start
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" — a B2B sustainability reporting platform in active
  development. Demonstrates a session starting mid-project: the token foundation
  and core components are in place, two components are newly added but not yet in
  the living brief, and the session goal is to add the Select component. Note how
  Step 2 flags a potential conflict before work begins — this is the primary value
  of the play.
input:
  scope: Add the Select component (controlled, single-value, with search)
---

## Step 1 — Living brief summary

**Product:** Verdant — a B2B sustainability reporting and carbon accounting platform for enterprise ESG teams. Calm, grounded, trustworthy; data-dense but not clinical.

**Key decisions recorded (by area):**

| Area | Decision |
|---|---|
| Color | Forest green primary (`#1A6B3A`). Slightly green-tinted neutrals. Light + dark mode both required. All semantic tokens use `--color-*` prefix. |
| Typography | Inter variable font. 9-step scale (label-xs through display-lg). Line heights per step. Letter-spacing negative at heading sizes. |
| Spacing | 4px base unit. Named scale: `--space-1` (4px) through `--space-16` (64px). |
| Shape | Three radii: `--shape-radius-sm` (4px), `--shape-radius-md` (8px), `--shape-radius-lg` (16px). Cards use md; interactive elements use sm. |
| Motion | `prefers-reduced-motion` implemented globally. Enter: `ease-out 150ms`. Exit: `ease-in 100ms`. |

**Current state:**
- Implemented: Button (primary/secondary/ghost), Input (text/password), Badge (status), DataTable (sortable), Card, Modal, Toast
- Stubbed: Select, DatePicker, TagInput
- Missing: no chart components yet; no Combobox

**Open questions:**
- [ ] Does Select need a multi-value variant for Phase 1, or can we defer to TagInput?
- [ ] Should DatePicker open inline (calendar) or in a popover? Mobile behavior unclear.

---

## Step 2 — Scope confirmation and conflict check

**Session goal:** Add the Select component — controlled, single-value, with optional search/filter within the dropdown.

**Conflict check:** The open question in the living brief asks whether Select needs a multi-value variant for Phase 1. Before implementing a single-value only component, I need to resolve this — if multi-value is needed in Phase 1, the architecture must support it from the start (the DOM structure and keyboard behavior differ significantly between single and multi-select).

**Flagging conflict:** Do not proceed until this is resolved. If multi-value is deferred, mark it explicitly in the living brief before implementation begins so it isn't added mid-sprint.

*[Resolution from user: multi-value is deferred to Phase 2. Single-value with search only for Phase 1. TagInput will handle multi-value patterns. Proceed.]*

---

## Step 3 — Relevant synthesis documents

For adding the Select component:

- **Token architecture** — to confirm token consumption pattern for the new component
- **Accessibility floor** — Select has complex keyboard requirements (arrow navigation, escape to close, search focus management) that must be verified against the floor before spec is written

Loading: `{{sistema_url}}/raw/principles/tokens/architecture` and `{{sistema_url}}/raw/principles/accessibility/floor`

Typography and color architecture not needed this session — Select uses existing semantic tokens; no new token categories are introduced.

---

## Step 4 — Readiness confirmation

Ready to begin.

**Current system state:** Token foundation complete; 7 components implemented; 3 stubbed. Select is next.

**Session goal:** Implement Select component — single-value, with search, deferred multi-value.

**Relevant documents loaded:** Token architecture, Accessibility floor.

**Resolved before starting:** Multi-value deferred to Phase 2 per user decision. Living brief will be updated to record this resolution after implementation.
