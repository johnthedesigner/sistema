You are running the **Audit and Refactor a Design System** campaign. This is a self-driving 5-step process. You will complete each step sequentially, ask the user for input when you need it, and pause for confirmation before advancing. Do not begin a step until the previous one is complete.

**If any prompt in this campaign references `https://sistema.design/raw/...`, fetch those URLs to load the reference material before proceeding with that step.**

---

## Standing quality directive

Your primary success criterion throughout this campaign is production quality — findings that are specific, actionable, and prioritized. A report that lists "colors may not be accessible" is not acceptable. A report that lists "Button secondary variant: `#6B7280` text on `#FFFFFF` surface — 3.95:1 contrast, fails WCAG 4.5:1 for normal text at 14px" is.

Before marking any step complete, hold the output to this test: could an engineer pick up this report and fix every issue without asking a follow-up question? If not, add specificity.

When a violation is ambiguous, investigate further rather than hedging. When a decision is clearly correct in the code but undocumented in the living brief, record it. Do not silently skip findings because they require judgment.

---

## Campaign map

1. **session-start** — Orient to the current system state before any changes are made
2. **audit-token-coverage** — Surface hardcoded values that should be consuming design tokens
3. **accessibility-audit** — Evaluate components against WCAG 2.2 AA requirements
4. **design-system-retrospective** — Identify drift, undocumented decisions, and decisions to revisit
5. **plan-next-iteration** — Produce a prioritized task list for the next work cycle

Begin Step 1 now.

---

## Step 1 — session-start

You are orienting to the current state of this design system before any audit work begins. The goal is to prevent acting on stale context or missing prior decisions.

**Step 1a — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Summarize:
- The product identity (one sentence)
- The key decisions already recorded, by area
- The current state: what components exist, what is stubbed, what is missing
- Any open questions

**Step 1b — Confirm scope for this session:**

The scope for this session is: run a structured health check on the design system — audit token coverage, evaluate accessibility compliance, identify drift between code and documentation, and produce a prioritized plan for the next iteration.

State this scope explicitly, then check: does it conflict with any existing decision in the living brief? If yes, flag the conflict before proceeding.

**Step 1c — Identify relevant synthesis documents:**

This audit session will need the following references:
- Token architecture: `https://sistema.design/raw/principles/tokens/architecture`
- Accessibility floor: `https://sistema.design/raw/principles/accessibility/floor`

Fetch and read both now. You will need them in subsequent steps.

**Step 1d — Confirm readiness:**

State: "Ready to begin. Current system state: [one-sentence summary]. Session goal: structured audit across token coverage, accessibility, and documentation drift. Relevant documents loaded: token architecture, accessibility floor."

Do not advance to Step 2 until this confirmation is produced.

### Before proceeding to Step 2

- [ ] `LIVING_BRIEF.md` has been read and summarized
- [ ] Session scope has been stated explicitly and checked for conflicts
- [ ] Both reference documents are loaded
- [ ] Readiness statement is produced

**Pause here.** Summarize what was found in the current system state in 2–3 sentences, then ask: *"Step 1 complete. Ready to proceed to Step 2 — auditing token coverage?"*

---

## Step 2 — audit-token-coverage

You are finding hardcoded values in the codebase that should be consuming design tokens.

**Step 2a — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention and the list of implemented components. This defines what the correct token names are and what scope the audit should cover.

**Step 2b — Read the token architecture reference:**

You already loaded `https://sistema.design/raw/principles/tokens/architecture` in Step 1. If not yet read, fetch it now. Pay attention to the "no raw values in components" rule and coverage requirements.

**Step 2c — Scan for drift:**

Search the codebase for hardcoded values that should be tokens. Look for:
- Hex color values (`#`) in component files
- `rgb(`, `rgba(`, `hsl(` in component styles
- Raw pixel values for spacing that should use spacing tokens
- Raw pixel values for border-radius that should use shape tokens
- Font size or weight values that should use type tokens
- Box-shadow values that should use elevation tokens

Exclude:
- Token definition files (the values legitimately appear there)
- Third-party library styles
- Test fixtures

**Step 2d — Produce the audit report:**

For each violation found:
- File path and line number
- The hardcoded value
- The correct token it should use
- Severity: **blocking** (color or interactive state — affects consistency and accessibility), **recommended** (spacing or shape — affects consistency), **minor** (one-off value with minimal systemic impact)

Output:
1. Summary: total violations by severity
2. Prioritized list of violations (blocking first)
3. Recommended fix order (group by component or file for efficiency)

Quality standard: every finding must include the specific file path and line number. "There are some hardcoded colors in the Button component" is not a finding.

**Step 2e — Update the living brief:**

Append to the Decision Log:
```
[date] — Token coverage audit — [N blocking, N recommended, N minor violations found]
```

### Before proceeding to Step 3

- [ ] All component files have been scanned
- [ ] Every finding has a file path, line number, hardcoded value, correct token, and severity
- [ ] Summary counts are accurate
- [ ] Fix order is provided

**Pause here.** Summarize the audit findings in 2–3 sentences, then ask: *"Step 2 complete. Token coverage audit found [N blocking / N recommended / N minor] violations. Ready to proceed to Step 3 — accessibility audit?"*

---

## Step 3 — accessibility-audit

You are evaluating the current state of the design system's components against WCAG 2.2 AA requirements.

**Step 3a — Ask the user for audit scope:**

Before proceeding, ask: which components should be included in this accessibility audit? Options:
1. All implemented components (listed in `LIVING_BRIEF.md` Current State)
2. A specific subset — if so, which ones?

Wait for the answer before continuing.

**Step 3b — Read the accessibility floor:**

You already loaded `https://sistema.design/raw/principles/accessibility/floor` in Step 1. If not yet read, fetch it now. Every item marked "must" in that document is a blocking violation if not met.

**Step 3c — Evaluate each component:**

For each component in scope, evaluate against each criterion:

1. **Color contrast** — Do all text/background pairings meet 4.5:1 (normal text) or 3:1 (large text / UI components)?
2. **Keyboard navigation** — Is every interactive element reachable by keyboard? Can it be activated with the correct key?
3. **Focus visibility** — Is the focus indicator visible? Does it meet 3:1 contrast against the adjacent surface?
4. **Touch targets** — Is the interactive area ≥ 44×44px?
5. **Semantic structure** — Does the component use semantic HTML or a full ARIA implementation?
6. **Accessible name** — Does every interactive element have an accessible name?
7. **Dynamic state** — Are state changes (expanded, selected, checked) exposed via ARIA attributes?

For color contrast findings: state the specific hex values, the computed contrast ratio, the required ratio, and the size of the text (normal or large).

**Step 3d — Produce the audit report:**

For each component:
- Pass / Fail / Needs verification per criterion
- Specific violations with severity: **blocking** (WCAG A/AA violation), **recommended** (best practice not met), **minor** (enhancement)

Summary:
- Components fully passing
- Components with blocking violations (must fix before ship)
- Components with recommended improvements

**Step 3e — Update the living brief:**

Append to the Decision Log:
```
[date] — Accessibility audit — [N components audited; N blocking violations; N components fully passing]
```

### Before proceeding to Step 4

- [ ] All in-scope components have been evaluated against all 7 criteria
- [ ] Every blocking violation has a specific hex value and computed contrast ratio
- [ ] Summary is accurate and actionable
- [ ] Living brief has been updated

**Pause here.** Summarize the accessibility findings in 2–3 sentences, then ask: *"Step 3 complete. Accessibility audit complete — [N components fully passing, N with blocking violations]. Ready to proceed to Step 4 — retrospective?"*

---

## Step 4 — design-system-retrospective

You are identifying drift, undocumented decisions, and decisions that need revisiting across the entire system.

**Step 4a — Read the living brief in full:**

Read `LIVING_BRIEF.md` in full. Note any open questions that have been de facto resolved by implementation but not recorded.

**Step 4b — Read the current system state:**

Read the token files and component files identified in the living brief's Current State section. You are looking for:
- Values or patterns that exist in code but are not reflected in the living brief's Key Decisions
- Components that have been added or changed without updating the Current State list
- Decisions that were made with `[to be determined]` markers but have since been implemented

**Step 4c — Evaluate alignment:**

Answer these questions:
1. What has drifted from the recorded decisions? (Code says one thing; brief says another)
2. What has been added without documentation? (New components, new tokens, new patterns)
3. What decisions made early should be revisited? (Early constraints that no longer apply, or that have proven wrong in practice)
4. Does `DESIGN.md` need to be updated? (If any token values, component patterns, or Do's and Don'ts have changed)

**Step 4d — Produce the retrospective report:**

```
## Drift found
[List each discrepancy: what the brief says vs. what the code does]

## Undocumented additions
[Components, tokens, or patterns that exist but aren't in the brief]

## Decisions to revisit
[Early decisions that may need to change, with rationale]

## DESIGN.md update needed?
[Yes / No — and if yes, what specifically needs to change]
```

**Step 4e — Update the living brief:**

Based on the retrospective:
- Update Key Decisions for any that have changed
- Update Current State to reflect actual implemented state
- Move any de-facto-resolved open questions to the decision log
- Append to the Decision Log:
```
[date] — Retrospective — [one-sentence summary of most significant finding]
```

### Before proceeding to Step 5

- [ ] All four retrospective questions have been answered
- [ ] Drift findings are specific (not "some values may have changed")
- [ ] `LIVING_BRIEF.md` has been updated to reflect actual state
- [ ] Decision log entry added

**Pause here.** Summarize the most significant retrospective findings in 2–3 sentences, then ask: *"Step 4 complete. Retrospective complete. Ready to proceed to Step 5 — planning the next iteration?"*

---

## Step 5 — plan-next-iteration

You are producing a prioritized task list for the next design system work cycle, informed by the full audit.

**Step 5a — Read the living brief:**

Read `LIVING_BRIEF.md` in full. Pay particular attention to:
- Open questions (unresolved decisions)
- Current state gaps (stubbed components, missing token categories)
- All audit findings from this campaign (token coverage violations, accessibility failures, retrospective drift)

**Step 5b — Assess the system's current maturity:**

Classify the system's current state across five dimensions:

| Dimension | Not started | Partial | Complete |
|---|---|---|---|
| Token foundation (primitive + semantic) | | | |
| Component coverage (key components implemented) | | | |
| Accessibility compliance | | | |
| Dark mode (if required) | | | |
| Documentation (DESIGN.md current, living brief current) | | | |

**Step 5c — Identify the highest-priority work:**

Based on the maturity assessment, this campaign's audit findings, and the living brief's open questions, identify the top 3–5 items for the next iteration. Prioritize using these rules:
1. **Blocking gaps** — missing foundations that block other work
2. **Accessibility violations** — any blocking issues from the accessibility audit (Step 3)
3. **Token drift** — blocking violations from the token coverage audit (Step 2)
4. **Coverage gaps** — components that are stubbed but needed
5. **Open questions** — decisions that have been deferred but now have enough information to resolve

**Step 5d — Produce the iteration plan:**

```
## Iteration goal
[One sentence describing the primary outcome of this iteration]

## Tasks (prioritized)
1. [Task] — [why it's first] — [relevant play to use]
2. [Task] — [why it's here] — [relevant play to use]
...

## Open questions to resolve this iteration
- [Question] — [approach to resolving it]

## Success criteria
[How you will know this iteration is complete]
```

**Step 5e — Update the living brief:**

Append to the Decision Log:
```
[date] — Iteration planned — [iteration goal in one sentence]
```

### Campaign complete

- [ ] Maturity assessment is complete across all five dimensions
- [ ] Top priorities are derived from actual audit findings, not generic advice
- [ ] Iteration plan tasks each reference a specific play
- [ ] `LIVING_BRIEF.md` Decision Log has entries for all 5 steps of this campaign

**Campaign complete.** Summarize:
1. What was audited (components, token files, documentation)
2. The most significant findings (highest-severity violations and drift)
3. The iteration plan's top priority and why it was ranked first
4. Next recommended step: run the relevant play for the highest-priority task
