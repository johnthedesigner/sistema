---
id: tokens.add-mode
title: Add a mode
description: Add a dark or light theme, a compact density, or a reduced-motion mode to an existing token system, check it, and show it beside the default for approval.
topic: tokens
kind: change
milestone: maintain
entry: true
requires: [tokens/src/color.json, "project:a11y-standard", "project:theme"]
produces: ["tokens/src/color.dark.json?", "tokens/src/spacing.compact.json?", "tokens/src/typography.compact.json?", "tokens/src/motion.json?", "tokens/src/motion.reduced.json?", sistema-review/tokens.add-mode.html]
tools: [contrast, type_scale, dark_mode, validate]
knowledge:
  - guide.tokens.architecture#modes-theme-density-and-motion
  - guide.tokens.architecture#keep-the-kinds-independent
  - guide.tokens.architecture#how-modes-are-stored-and-switched
  - guide.tokens.architecture#density-remap-or-scale
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.depth.architecture#model-2-tonal-surface-elevation
  - guide.spacing.layout#density-axis
  - guide.motion.architecture#prefers-reduced-motion-is-non-negotiable
  - guide.motion.architecture#duration-and-easing-token-structure
rules: [tokens.modes.overrides-only, tokens.modes.one-kind, tokens.modes.no-component-changes, color.dark.tonal-shift, color.roles.required, color.contrast.text, color.contrast.large-text, color.contrast.ui, accessibility.target-size, typography.line-height.body, accessibility.reduced-motion, quality.review.compare-visually, quality.review.outline, tokens.source.dtcg]
evidence: "For a theme: a contrast table for every required pairing in the new theme. For compact density: the target sizes of interactive controls and the body line height in compact. For reduced motion: each transition and what it becomes. For every mode: the comparison page and the person's approval, and the updated sistema.json."
overrides: [mode]
last_reviewed: 2026-11-18
---
A mode replaces some token values while it's active, without changing components: a theme (dark or light), a density (compact), or reduced motion. This play adds one mode at a time. A project starting from scratch gets both themes from `color.scheme`.

1. **Read the system:** `sistema.json` (`project.theme`, `project.modes`, and the standard), the files in `tokens/src/`, DESIGN.md, and DECISIONS.md. If the person hasn't said which mode to add, list the ones the system doesn't have yet and ask. Each mode is a choice for the product, not a requirement.

2. **Theme (dark, or light for a dark-first system).**
   - Ask which theme will be primary, and record it as `project.theme_primary`.
   - Keep each treatment the same; change only the stops. Text and fills take the mirrored stop (1000 − n); surfaces step one stop at a time (the color guide's "Stops in a dark theme"). Don't invert values. If a ramp has no usable stop, say so.
   - Start from the dark mode tool: send `color.json` and `palette.json`, and apply its suggestion for each failing pair, or choose another stop.
   - Check the pairs in the color guide's "Pairs to check" in the new theme with the contrast tool, in one request. Move any failing role to another stop and check again.
   - Write only the changed roles to `tokens/src/color.dark.json`. When adding light to a dark-first system, move the current values to `color.dark.json`, write the light values in `color.json`, and tell the person about the move.
   - Set `project.theme` to `light-dark`.

3. **Compact density.**
   - Show the two approaches from the guide on the comparison page, remapping chosen tokens or scaling everything, and let the person choose. Record the choice in DECISIONS.md.
   - Tighten spacing inside components and control heights. Keep layout spacing as it is unless the person asks.
   - If type should get smaller too, get the compact sizes from the type scale tool, with the same naming and roles as the default scale.
   - Interactive controls must still meet the target size the project's standard requires, and body text keeps its required line height.
   - Write only the changed tokens to `tokens/src/spacing.compact.json`, and to `typography.compact.json` if type changes. Add `"density": ["comfortable", "compact"]` to `project.modes`.

4. **Reduced motion.**
   - If the project has no motion tokens, first create the minimal set the motion guide describes (a few durations and easings) in `tokens/src/motion.json`, and say so.
   - For reduced motion, movement (sliding, scaling, parallax) becomes an opacity change or nothing, and durations drop close to zero. A brief fade can stay where it helps show that something changed. Nothing essential may depend on motion.
   - Write only the changed tokens to `tokens/src/motion.reduced.json`, and add `"motion": ["standard", "reduced"]` to `project.modes`.

5. **Keep the modes independent.** A mode file holds only tokens that already exist in the defaults, under the same names, and each token belongs to one kind of mode. If a change would need a new token or a component edit, stop and say why. Send every file in `tokens/src/` to the token validator, and fix every blocking failure before compiling.

6. **Compile** with the token pipeline, so the mode is live: the theme under `[data-theme]` with the operating-system fallback, density under `[data-density]`, and reduced motion under the `prefers-reduced-motion` media query and `[data-motion]`.

7. **Build `sistema-review/tokens.add-mode.html`.** Start with the outline strip if a workflow is running. Show the same small interface sample (a panel with a heading and body text, a primary and a secondary button, a text field, a short table, an alert, and a menu) in the default and in the new mode, side by side. For reduced motion, add a button that plays the same transition in each. Ask the person to open it and approve or ask for changes.

8. **Update DESIGN.md:**
   - **Theme:** what changes in it, under Colors and Elevation & Depth.
   - **Density:** when to use compact and where, under Layout.
   - **Reduced motion:** a rule under Do's and Don'ts.

   Then show the evidence.
