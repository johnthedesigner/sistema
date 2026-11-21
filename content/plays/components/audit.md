---
id: components.audit
title: Audit a component
description: Check one existing component against the system's token, state, accessibility, and API conventions, and report what to fix before it is reused as a pattern.
topic: components
kind: check
milestone: maintain
entry: true
requires: [tokens/src/color.json]
produces: []
tools: [contrast]
knowledge:
  - guide.components.architecture#accessibility-by-component-family
  - guide.components.architecture#failure-modes
  - guide.tokens.architecture#the-tier-model
  - guide.accessibility.floor#how-to-use-this-document
rules: [tokens.usage.no-raw-values, accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, accessibility.focus-not-lost]
evidence: A report with a verdict (ready to reuse, needs work, or significant gaps) and each issue with its file and line, the rule it breaks, and a severity, plus contrast results from the tool for every color pairing checked.
overrides: [component]
last_reviewed: 2026-11-15
---
1. **Read the component** named in `component`, or ask which one. Read its spec in `docs/components/` if there is one, DESIGN.md, and two or three similar components for the system's conventions.

2. **Check each area:**
   - **Tokens:** every value a token covers uses a role token. List each raw value with its file, line, and the token it should use.
   - **States:** hover, focus, active, and disabled, plus the states its pattern needs, each changing the right token.
   - **Accessibility:** the rules below, for the standard in `sistema.json`. Check color pairings with the contrast tool, batched (one POST takes up to 200 pairs). Don't estimate ratios. For a full accessibility pass across components, use `accessibility.audit`.
   - **API:** prop names and defaults consistent with similar components, and no props that only one caller uses.

3. **Rate each issue:** blocking (breaks a blocking rule), recommended, or minor. Give the verdict, and the changes in the order to make them.

4. Write the report to `docs/audits/components.audit-<name>-<YYYY-MM-DD>.md` and show it.
