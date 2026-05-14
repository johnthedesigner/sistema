# LIVING_BRIEF_SPEC.md
# The Living Brief — Specification

**Version:** 1.0
**Created:** 2026-05-13

---

## What the living brief is

The living brief is a per-project state document that an AI coding agent reads at the start of each work session to resume design system context accurately. It records what decisions have been made, what has been implemented, what is still open, and why key choices were made.

It is the document that keeps a model current across sessions without requiring the user to re-explain the project each time.

---

## What the living brief is NOT

| It is NOT | Why the distinction matters |
|---|---|
| **DESIGN.md** | DESIGN.md is the outward-facing spec for consuming the finished system. The living brief is the inward-facing state document for building it. They serve different readers at different phases. |
| **A changelog** | A changelog records what changed. The living brief records the current state and the decisions that produced it. Historical entries in the decision log are a means to that end, not the primary content. |
| **A README** | A README describes the project for newcomers. The living brief is written for a model that already knows the project and needs to resume work from a known state. |
| **A design spec** | A design spec defines what the system should be. The living brief describes what it currently is — including gaps, stubs, and open questions. |
| **A task list** | Active tasks belong in a task file or session plan. The living brief records decisions and state; it does not direct the next action. |

---

## Required sections

Every living brief must contain exactly these five sections, in this order.

### 1. Project identity

One paragraph or structured list. Answers: what is being built, who it's for, what mode (light / dark / both), what density, and what the governing aesthetic stance is (expressive vs. utilitarian, brand-driven vs. neutral). This is the seed that informs every other decision.

```
**Product:** [name and one-line description]
**Audience:** [who uses it]
**Density:** [compact / balanced / spacious]
**Theme:** [light-only / dark-only / both]
**Stance:** [expressive / utilitarian / neutral]
```

---

### 2. Key decisions

One entry per concern area. Written as decisions, not descriptions. The value is in the specificity — "we use an 8px base unit" is useful; "the spacing system" is not.

Required concern areas:

| Area | What to record |
|---|---|
| **Color** | Architecture model (tonal / step scale / named / contextual), number of semantic roles, dark mode approach |
| **Typography** | Scale approach (modular ratio or hand-tuned), role taxonomy (named / numeric), base size, density target |
| **Spacing** | Base unit (4px or 8px), scale depth, density axis decision |
| **Shape** | Radius personality (sharp / moderate / rounded), scale approach, any system-wide overrides |
| **Motion** | Stance (functional-only / functional + expressive), prefers-reduced-motion baseline |
| **Tokens** | Tier model in use (2-tier / 3-tier), naming convention, dark mode token strategy |

Add additional areas as needed. Keep each entry to 1–2 sentences.

---

### 3. Current state

A compact inventory of what exists. Not prose — structured as lists.

```
**Token files:** [paths to existing token files]
**Components implemented:** [list]
**Components stubbed:** [list]
**Known gaps:** [list]
```

This section changes most frequently. Keep it accurate — a stale current-state section is worse than no current-state section.

---

### 4. Open questions

Decisions not yet made. Prevents a model from inventing answers to questions the user has not resolved.

Each entry: the question, and any constraints already known.

```
- [ ] [Question] — [any known constraints]
- [ ] [Question] — [any known constraints]
```

When a question is resolved, move it to the decision log and remove it from this list.

---

### 5. Decision log

Append-only. Each entry records a decision made during a session.

**Format:**
```
[YYYY-MM-DD] — [What was decided] — [Why: one sentence]
```

**Examples:**
```
2026-05-13 — Using 8px base unit, not 4px — product is content-dense; 4px produces too many intermediate values
2026-05-13 — Named roles over numeric steps for typography — team communicates in role names; numeric steps require translation
2026-05-13 — Light-only theme for v1; dark mode deferred — scope constraint; revisit in Phase 2
2026-05-13 — Tonal palette approach for color — single seed color, perceptually uniform steps, strong contrast guarantees
```

Do not edit past entries. If a decision changes, append a new entry explaining the reversal:
```
2026-05-20 — Reversed 2026-05-13 dark mode deferral — stakeholder feedback required dark mode at launch
```

---

## Format requirements

- **File format:** Markdown only. No YAML front matter.
- **Maximum length:** 150 lines. Beyond this, the file competes with task context for context window attention.
- **When the decision log grows past ~30 entries:** Archive the oldest entries to a `logs/living-brief-archive.md` file and retain the most recent 15 entries in the active brief. Add a note: `*Entries before [date] archived to logs/living-brief-archive.md.*`
- **File location:** Project root, named `LIVING_BRIEF.md`. It is a first-class project artifact alongside `DESIGN.md` and `AGENTS.md`.

---

## How plays interact with the living brief

Each play in the task playbook that modifies the design system follows this two-step protocol:

**At session start:** Read `LIVING_BRIEF.md`. Confirm scope. Identify open questions relevant to the task. If a question in the open questions list will be resolved during this session, note it before starting work.

**At session end:** Append one line to the decision log for each significant decision made during the session. If an open question was resolved, remove it from the list and record the decision. If the current state changed (new component, new token file), update Section 3.

Plays that do not modify the design system (research plays, audit plays that produce a report only) do not require a living brief update.

---

## Update cadence

| Change | Update living brief? |
|---|---|
| Token value changed | Yes — update Key Decisions if the decision itself changed; update Decision Log |
| New component implemented | Yes — update Current State |
| New semantic role added | Yes — update Key Decisions (color) + Current State |
| Open question resolved | Yes — move to Decision Log, remove from Open Questions |
| File renamed/moved | Only if it appears in Current State |
| Build tooling changed | No |
| Framework version bumped | No |
| DESIGN.md updated | No — the living brief and DESIGN.md are updated independently based on their own triggers |

---

## Relationship to DESIGN.md

The living brief and DESIGN.md are maintained in parallel but updated independently.

DESIGN.md is updated when the design changes enough to affect how a consuming agent generates UI — new token values, new component patterns, changed Do's and Don'ts.

The living brief is updated whenever any session makes a decision, changes state, or resolves an open question — regardless of whether DESIGN.md is affected.

A product in early development will have a living brief that changes every session and a DESIGN.md that changes less frequently. A mature product will have a stable living brief and a rarely-updated DESIGN.md.
