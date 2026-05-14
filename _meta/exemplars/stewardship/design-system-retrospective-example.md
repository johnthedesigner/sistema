---
play_slug: design-system-retrospective
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" end-of-sprint retrospective after a rapid development
  phase. Demonstrates the three types of retrospective findings: drift (code
  diverged from recorded decisions), undocumented additions (new components not
  in living brief), and decisions that should be revisited (early constraints
  that no longer apply). Non-obvious detail: the "decisions to revisit" section
  surfaces a shape scale decision that was defensible early but has created
  friction as the component library grew — this is the most valuable output of
  a retrospective and the hardest to generate without concrete code evidence.
input:
  scope: Post-sprint retrospective — full system
---

## Step 1 — Living brief read

**Key decisions on record:**

| Area | Recorded decision |
|---|---|
| Color | `--color-primary: #1A6B3A`. Slightly green-tinted neutrals. Light + dark mode required. |
| Shape | Three radii: `--shape-radius-sm` (4px), `--shape-radius-md` (8px), `--shape-radius-lg` (16px). Cards use md; interactive elements use sm. |
| Spacing | 4px base unit. `--space-1` (4px) through `--space-16` (64px). |
| Typography | Inter variable. 9-step scale. Letter-spacing negative at heading sizes. |
| Motion | `prefers-reduced-motion` global. Enter: `ease-out 150ms`. Exit: `ease-in 100ms`. |

**Current state (in living brief):**
- Implemented: Button, Input, Badge, DataTable, Card, Modal, Toast
- Stubbed: Select, DatePicker, TagInput

**Open questions (in living brief):**
- [ ] Does Select need a multi-value variant for Phase 1?
- [ ] Should DatePicker open inline or in a popover?

---

## Step 2 — Current system state read

Read token files and component files. Findings below.

---

## Step 3 — Alignment evaluation

### 1. What has drifted from recorded decisions?

**Finding A — Shape scale violated in Badge and Card**

Living brief records: "interactive elements use `--shape-radius-sm`." Code evidence:

- `Badge.tsx` line 23: `borderRadius: '4px'` (hardcoded, not `var(--shape-radius-sm)`)
- `Card.tsx` line 18: `padding: '16px 24px'` (hardcoded, not `var(--space-4) var(--space-6)`)

The shape and spacing decisions are recorded correctly, but were not followed during the sprint. These are also token audit violations — they will appear in the audit-token-coverage play. Noting here because they represent a pattern: the sprint moved fast and skipped the token verification step.

**Finding B — Color token decisions bypassed in DataTable and Toast**

Living brief records: all semantic color decisions as token references. Code evidence:

- `DataTable.tsx`: `#1A6B3A` and `rgba(26, 107, 58, 0.08)` (hardcoded)
- `Toast.tsx`: `#D62B2B` (hardcoded)

Same pattern as Finding A — rapid sprint, token step skipped.

**Finding C — Dark mode partially implemented**

Living brief records: "Light + dark mode both required." Current state: `[data-theme="dark"]` selectors exist in token files but have not been verified in component files. DataTable and Toast use hardcoded values that will not respond to the theme selector regardless of dark mode implementation.

---

### 2. What has been added without documentation?

**Finding D — Tooltip component not in living brief**

A `Tooltip.tsx` component was added to `src/components/Tooltip/` during the sprint. It does not appear in the living brief's implemented list or stubbed list. It has no living brief entry, no accessibility specification, and no token verification.

Action required: Add Tooltip to the living brief's implemented list. Run audit-token-coverage and accessibility-audit against it before treating it as a stable pattern.

**Finding E — Motion tokens not documented**

The living brief records motion decisions in prose ("Enter: ease-out 150ms"), but no motion token file exists. Three components (Modal, Toast, DataTable) implement animations independently using the prose values — there is no source of truth token. If the motion scale changes, all three must be updated manually.

Action required: Either create a `tokens/motion.css` file with `--motion-enter` and `--motion-exit` custom properties, or explicitly record in the living brief that motion is handled in prose only and updated manually. The decision to not tokenize motion should be recorded, not left implicit.

---

### 3. What decisions should be revisited?

**Finding F — Shape scale: three radii may be insufficient**

The living brief records three shape values: sm (4px), md (8px), lg (16px). When the system had 7 components, this was adequate. Tooltip introduces a case (tooltip bubble) that is conventionally 6px — neither sm nor md. DatePicker popovers typically use lg (16px), but the current lg is large enough to feel inconsistent when a popover sits near a field with sm treatment.

Recommendation: Revisit the shape scale. Consider adding a value between sm and md, or documenting explicit exceptions for Tooltip and DatePicker. Early in the project the three-value constraint reduced decisions; now that more components exist, the gaps are producing inconsistency.

**Finding G — Select open question is now implicitly resolved**

The living brief asks: "Does Select needs a multi-value variant for Phase 1?" The product roadmap (confirmed separately) deferred multi-value to Phase 2 and named TagInput as the multi-value pattern. This decision was made in conversation but not recorded in the living brief — the open question remains open in text even though it has been resolved in practice.

Action required: Close this open question in the living brief. Record: "Multi-value deferred to Phase 2. TagInput will handle multi-value patterns. Select is single-value only for Phase 1."

---

### 4. Does DESIGN.md need to be updated?

Yes — two items:

1. **Tooltip** must be added to the component inventory
2. **Motion tokens** decision must be recorded (either as a token file reference or as a documented non-tokenization decision)

The shape scale section should be marked with a "revisit" flag pending the Phase 2 decision.

---

## Step 4 — Retrospective report

### Drift found

| What the brief says | What the code does | Severity |
|---|---|---|
| Shape tokens for interactive elements | Hardcoded `4px` in Badge, `16px 24px` in Card | Token violation |
| Color tokens for all semantic colors | Hardcoded hex in DataTable, Toast | Token + accessibility violation |
| Light + dark mode both implemented | Dark mode selectors exist but hardcoded values in 2 components bypass them | Dark mode gap |

### Undocumented additions

| What was added | Status in living brief |
|---|---|
| Tooltip component | Not listed (neither implemented nor stubbed) |
| Motion: prose values in 3 components, no token file | Decision not explicitly recorded |

### Decisions to revisit

| Decision | Why revisit | Recommendation |
|---|---|---|
| Shape scale: 3 values (sm/md/lg) | Tooltip and DatePicker expose gaps | Add an xs (2px) or add a 6px value; document exceptions |
| Select open question (multi-value) | Implicitly resolved in roadmap conversation | Close the question; record resolution in living brief |

### Living brief updates to make after this retrospective

1. Add Tooltip to implemented list (with note: token audit and a11y audit pending)
2. Close Select open question with resolution
3. Add motion token decision (either create `tokens/motion.css` or record as intentional non-tokenization)
4. Flag shape scale as under review for Phase 2

### Decision log entry

```
[2026-05-14] — Sprint retrospective — Rapid sprint introduced token drift in DataTable, Toast, Badge, Card. Tooltip added without living brief entry. Motion not tokenized (decision pending). Shape scale gaps identified as system grows. Select multi-value question implicitly resolved — recording now.
```
