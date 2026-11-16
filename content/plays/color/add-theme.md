---
id: color.add-theme
title: Add a theme
description: Add a dark theme to a light color system, or a light theme to a dark one, by tonal shift from the existing ramps, with every pairing verified and both themes shown side by side for approval.
topic: color
kind: change
milestone: maintain
entry: true
requires: [tokens/src/color.json, "project:a11y-standard", "project:theme"]
produces: [tokens/src/color.dark.json, sistema-review/color.add-theme.html]
tools: [contrast]
knowledge:
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.tokens.architecture#dark-mode-at-the-token-level
  - guide.tokens.architecture#dark-mode-values-the-tonal-shift-problem
  - guide.depth.architecture#model-2-tonal-surface-elevation
rules: [color.dark.tonal-shift, color.roles.required, color.contrast.text, color.contrast.large-text, color.contrast.ui, quality.review.compare-visually, quality.review.outline, tokens.source.dtcg]
evidence: A contrast table for every required pairing in the new theme, the comparison page showing both themes side by side, the person's approval, and the updated sistema.json theme.
overrides: []
last_reviewed: 2026-11-15
---
Use this play when a project's color system has one theme and needs the other. A project starting from scratch gets both themes from `color.scheme`.

1. **Read the existing system:** `tokens/src/color.json` and its primitive ramps, `sistema.json` for the theme and standard, and DESIGN.md for anything said about the new theme. Ask which theme will be primary, and record it as `project.theme_primary`.

2. **Map each role by tonal shift,** using stops from the same ramps:
   - Surfaces come from the far end of the neutral ramp. Raised and floating surfaces step toward the middle, because shadows barely read on dark backgrounds.
   - Accent roles move to the stops that keep their contrast against the new surfaces.
   - `on-*` roles are chosen against their new pair, not inverted from the old one.

   Do not invert values. If a ramp doesn't have a usable stop for a role, say so. Don't invent one.

3. **Verify with the contrast tool.** Send every on-* pairing and `border-focus`, for the new theme, in one batch request, against the standard in `sistema.json`. Move any failing role to another stop and check again.

4. **Write the new theme's file** with only the roles that change: `tokens/src/color.dark.json` when adding dark. When adding light to a dark-first system, move the current values to `color.dark.json`, write the light values in `color.json`, and tell the person about the move.

5. **Build `sistema-review/color.add-theme.html`.** Start with the outline strip if a workflow is running. Show the same small interface sample (a panel with a heading, body text, a primary and a secondary button, a text field, an alert, and a menu) in both themes, side by side, with each role's ratio on hover or in a list below. Ask the person to open it and approve or ask for changes.

6. **Update `sistema.json`** `project.theme` to `light-dark`. Run the token compile if a pipeline exists, so the new theme is live.

7. Show the contrast table and the approval.
