---
id: tokens.coverage-audit
title: Audit token coverage
description: Find values in the codebase that should use design tokens, and report them by severity with the token each should use.
topic: tokens
kind: check
milestone: maintain
entry: true
requires: [tokens/src/color.json]
produces: []
tools: []
knowledge:
  - guide.tokens.architecture#the-tier-model
  - guide.tokens.architecture#common-failure-modes
rules: [tokens.usage.no-raw-values, spacing.never-arbitrary]
evidence: Violation counts by severity, and every violation with its file, line, value, and the token it should use, grouped into a fix order.
overrides: []
last_reviewed: 2026-11-15
---
Run this after a burst of feature work, before a release, or as part of a review.

1. **Read the tokens** in `tokens/src/` and the compiled names, so each finding can name the right token.

2. **Search the components and pages** for:
   - hex, `rgb(`, `rgba(`, `hsl(`, and `oklch(` color values
   - Tailwind arbitrary values such as `p-[13px]` or `bg-[#123456]`, and default palette classes such as `bg-blue-500` if the system removed the default palette
   - pixel values for spacing, radius, font size, font weight, and line height that a token covers
   - `box-shadow` values outside the shadow tokens

   Skip token definition and compiled files, third-party styles, and test fixtures.

3. **Rate each finding:** blocking for colors and anything in an interactive state (it breaks theming and can break contrast), recommended for spacing, radius, and type, and minor for one-off values with no effect elsewhere. A value with no matching token is a gap in the system, not a violation: list it separately.

4. Write the report to `docs/audits/tokens.coverage-audit-<YYYY-MM-DD>.md`, grouped by file for fixing, and show the summary.
