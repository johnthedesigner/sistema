---
play_slug: plan-next-iteration
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" after the sprint retrospective. Demonstrates iteration
  planning that flows directly from the retrospective output: the maturity
  assessment surfaces three "partial" dimensions that drive the task list.
  Non-obvious detail: the plan deliberately does not add new components to this
  iteration — it routes to stewardship plays (audit, accessibility-audit) before
  coverage plays (add-component) because the retrospective showed the existing
  foundation has drift that would compound if new components were added first.
  This ordering logic is the primary value the play adds over a simple backlog.
input:
  scope: Planning the iteration following the post-sprint retrospective
---

## Step 1 — Living brief read

**Post-retrospective state of open questions:**
- [x] Select multi-value for Phase 1 → Resolved: single-value only; multi-value deferred to Phase 2
- [ ] DatePicker: inline vs popover → Still open; mobile behavior unclear
- [ ] Shape scale: three values sufficient? → Flagged in retrospective; pending Phase 2 decision
- [ ] Tooltip: not yet audited for tokens or accessibility
- [ ] Motion: tokenization decision not recorded

**Current state:**
- Implemented (with known drift): Button, Input, Badge, DataTable, Card, Modal, Toast
- Implemented (unaudited): Tooltip
- Stubbed: Select, DatePicker, TagInput

**Most recent retrospective entry:**
> [2026-05-14] — Sprint retrospective — Rapid sprint introduced token drift in DataTable, Toast, Badge, Card. Tooltip added without living brief entry. Motion not tokenized (decision pending). Shape scale gaps identified. Select multi-value resolved.

---

## Step 2 — Maturity assessment

| Dimension | Status | Notes |
|---|---|---|
| Token foundation (primitive + semantic) | **Partial** | Color, spacing, shape, type tokens complete. Motion not tokenized — decision pending. |
| Component coverage | **Partial** | 7 implemented + 1 unaudited (Tooltip). Select, DatePicker, TagInput stubbed. |
| Accessibility compliance | **Partial** | Accessibility audit identified 4 blocking violations; none fixed yet. |
| Dark mode | **Partial** | Token selectors exist; 2 components use hardcoded values that bypass dark mode. |
| Documentation | **Partial** | Living brief updated post-retrospective. Tooltip not documented. Motion decision not recorded. DESIGN.md not yet updated. |

---

## Step 3 — Highest-priority work

**Prioritization reasoning:**

The retrospective revealed four blocking accessibility violations and a layer of token drift across four components. The Tooltip was added without audit. Select is the highest-priority new component (stubbed, Phase 1 scope). DatePicker remains blocked by an open architecture question.

Adding new components on top of existing drift will compound the problem — the token and accessibility violations in current components would spread through any new component that references them as patterns. Fix the foundation before extending coverage.

**Top 5 items for this iteration:**

1. **Fix blocking accessibility violations** — DataTable (aria-sort), Toast (contrast), Badge (aria-live) — these are blocking for ship
2. **Fix token drift in DataTable, Toast, Badge, Card** — prerequisite for dark mode working correctly in these components
3. **Audit and document Tooltip** — it exists in the codebase but has no living brief entry, no token verification, no a11y spec
4. **Implement Select (single-value with search)** — Phase 1 scope; architecture question resolved in retrospective; ready to implement
5. **Record motion tokenization decision** — either create `tokens/motion.css` or explicitly document non-tokenization in living brief

DatePicker is deliberately excluded: the inline vs. popover question is still open and mobile behavior is unresolved. Adding it before resolving these would produce a component that needs immediate rework.

---

## Step 4 — Iteration plan

### Iteration goal

Stabilize the existing component foundation (fix all blocking violations, eliminate token drift) and add Select as the first new component of Phase 2 preparation.

### Tasks (prioritized)

1. **Fix 4 blocking accessibility violations** — blocking for ship; DataTable, Toast, Badge need fixes before any component is released — use `accessibility-audit` play for verification after fixing
2. **Fix token drift in DataTable, Toast, Badge, Card** — required for dark mode to work correctly; also fixes the Toast contrast violation (combined with item 1) — use `audit-token-coverage` play for scan and verification
3. **Audit Tooltip** — component exists in code but not in the design system record; must verify token coverage and accessibility before it can be referenced as a pattern — use `audit-token-coverage` then `accessibility-audit`
4. **Implement Select** — Phase 1 scope, architecture resolved; single-value with search — use `add-component` play; session-start first to confirm no remaining open questions
5. **Record motion decision** — either create `tokens/motion.css` with `--motion-enter`/`--motion-exit` or explicitly document non-tokenization in living brief — no dedicated play; update DESIGN.md directly

### Open questions to resolve this iteration

- **Motion tokenization** — Does the team want motion tokens or prose-only? Approach: review the three components that use motion values; if they've diverged from the prose values, tokenize. If they match, document as intentional and add a lint rule.
- **Shape scale gap** — Can Tooltip use `--shape-radius-sm` (4px), or does it need a new step? Approach: inspect Tooltip design; if 4px is visually wrong, add `--shape-radius-xs: 2px` to the shape scale before implementing DatePicker.

### Success criteria

- All 4 blocking accessibility violations resolved and re-verified with screen reader
- Token drift eliminated in DataTable, Toast, Badge, Card (no hardcoded hex or raw px for tokenized values)
- Dark mode visually verified in DataTable and Toast after token fix
- Tooltip documented in living brief with token audit and a11y audit complete
- Select component implemented, in living brief, token-clean, accessibility-verified
- Motion decision recorded in living brief (either token file created or non-tokenization explicitly noted)

---

## Step 5 — Living brief update

Decision log entry appended:

```
[2026-05-14] — Iteration planned — Stabilize existing components (fix accessibility violations + token drift) and implement Select. Tooltip to be audited and documented. Motion tokenization decision deferred to this iteration. DatePicker excluded until open architecture questions resolved.
```
