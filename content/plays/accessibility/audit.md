---
id: accessibility.audit
title: Audit accessibility
description: Evaluate the implemented components against the project's chosen accessibility standard, with contrast from the tool and an automated scan, and report violations by severity.
topic: accessibility
kind: check
milestone: maintain
entry: true
requires: ["project:a11y-standard"]
produces: []
tools: [contrast]
knowledge:
  - guide.accessibility.floor#how-to-use-this-document
  - guide.accessibility.floor#1-color-contrast
  - guide.accessibility.floor#2-keyboard-navigation
  - guide.accessibility.floor#3-focus-visibility
  - guide.accessibility.floor#4-touch-and-pointer-targets
  - guide.accessibility.floor#5-semantic-structure-and-aria
  - guide.accessibility.floor#6-motion
rules: [color.contrast.text, color.contrast.large-text, color.contrast.ui, typography.text-spacing, accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, accessibility.reduced-motion, accessibility.focus-not-lost]
evidence: A report per component with pass, fail, or needs-checking for each criterion, every contrast ratio from the tool, the automated scan results in every theme, and a summary of blocking violations.
overrides: [scope]
last_reviewed: 2026-11-15
---
1. **Set the scope:** the components in `scope`, or ask. "All implemented components" is a valid answer. Read the standard and level from `sistema.json`. The rules below give the values for it.

2. **Run an automated scan** (for example axe) on the showcase or the pages that show these components, in every theme. Scans catch only part of the problems, so continue with the checks below.

3. **Check each component:**
   - **Contrast:** every text and UI pairing in every state and theme, in one batch request to the contrast tool. Report the exact ratios.
   - **Keyboard:** reachable, operable with the expected keys, no traps, focus returns after overlays close, and focus isn't dropped to the page body.
   - **Focus:** visible, actually rendered (take a screenshot), meets `color.contrast.ui` against its surroundings, and not hidden behind sticky content.
   - **Targets:** the clickable area meets the minimum for the standard.
   - **Semantics:** native elements where possible, an accessible name, and exposed states.
   - **Motion:** reduced motion is respected.

4. **Rate each issue:** blocking (fails the chosen standard), recommended (best practice), or minor.

5. Write the report to `docs/audits/accessibility.audit-<YYYY-MM-DD>.md`, with components that pass, components with blocking issues, and the fix order. Show the summary.
