# `tokens.add-mode`: Outline

**Task:** V3.1 (owner decision N2, 2026-11-16). **Date:** 2026-11-18. **Status:** approved by the owner 2026-11-18 (D20 to D22), and built. In the build, the rule `tokens.modes.one-axis` is named `tokens.modes.one-kind`, and mode knowledge moved into the tokens guide ("Modes: theme, density, and motion") so the play cites it rather than explaining it.

**What it does:** adds a *mode* to a project's token system. A mode is a named set of token values that replaces some of the defaults when it's active, without touching components. There are three kinds of mode, called *axes*:

| Axis | Modes | Changes | Turned on by |
|---|---|---|---|
| **Theme** | `light`, `dark` (later perhaps `high-contrast`) | Color roles | `data-theme="dark"`, falling back to the operating system setting |
| **Density** | `comfortable` (the default), `compact` | Spacing steps used inside components, control heights, and some type sizes and line heights | `data-density="compact"` on the page or on any part of it, such as one table |
| **Motion** | `standard` (the default), `reduced` | Durations and easing; movement becomes a fade or nothing | The operating system's reduced-motion setting, plus `data-motion="reduced"` for an in-app switch |

The axes are independent. A page can be dark, compact, and reduced-motion at once. Each token belongs to at most one axis, so modes never fight over a value.

---

## 1. How modes are stored and compiled

**Source files** follow the pattern `color.dark.json` already uses: a mode file holds only the tokens that change, under the same names as the defaults.

```
tokens/src/
  color.json            color.dark.json
  spacing.json          spacing.compact.json
  typography.json       typography.compact.json
  motion.json           motion.reduced.json
```

**Compiled CSS** (from `tokens.pipeline`):

```css
:root { --space-3: 12px; --control-height: 40px; --duration-medium: 200ms; }

[data-theme="dark"] { --color-surface: #16191D; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --color-surface: #16191D; } }

[data-density="compact"] { --space-3: 8px; --control-height: 32px; }

@media (prefers-reduced-motion: reduce) { :root { --duration-medium: 0ms; } }
[data-motion="reduced"] { --duration-medium: 0ms; }
```

Components use role tokens, as they already must, so every mode works without changing a component. With Tailwind 4, the role tokens are already custom properties, so utilities follow the mode too.

**Density, two ways** (the spacing guide's "Density axis" describes both; the play shows both and the person chooses):
- **Remap specific tokens:** compact changes chosen steps and control heights. It gives more control, and it's what a dense data table usually needs.
- **Scale everything:** compact changes one base value. In Tailwind, that's `--spacing`, so every `p-*` and `gap-*` shrinks together. It's simpler, but blunter.

## 2. The play

**Contract (draft):**

```yaml
id: tokens.add-mode
title: Add a mode
description: Add a dark theme, a compact density, or a reduced-motion mode to the token system, verify it, and show it next to the default for approval.
topic: tokens
kind: change
milestone: maintain
entry: true
requires: [tokens/src/color.json, "project:a11y-standard"]
produces: ["tokens/src/*.<mode>.json", sistema-review/tokens.add-mode.html]
tools: [contrast, type_scale]
knowledge:
  - guide.tokens.architecture#dark-mode-at-the-token-level
  - guide.color.architecture#dark-mode-the-tonal-shift
  - guide.spacing.layout#density-axis
  - guide.motion.architecture#prefers-reduced-motion-is-non-negotiable
rules: [tokens.modes.overrides-only, tokens.modes.one-axis, color.dark.tonal-shift, color.contrast.text, color.contrast.large-text, color.contrast.ui, accessibility.target-size, typography.line-height.body, accessibility.reduced-motion, quality.review.compare-visually]
overrides: [mode]
```

**Procedure (draft):**
1. **Read the system and choose the mode:** `sistema.json`, the token sources, DESIGN.md, and the modes that already exist. If the person hasn't said which mode, ask.
2. **Theme:** the current add-theme procedure. Map roles by tonal shift from the same ramps and check every pairing with the contrast tool.
3. **Density:** show both approaches (remap or scale) and let the person choose. For compact:
   - Tighten spacing inside components and control heights.
   - Get smaller type sizes from the type scale tool when type changes too.
   - Interactive targets must still meet the project's standard (`accessibility.target-size`). Body text keeps its required line height.
4. **Reduced motion:** movement (slides, scaling, parallax) becomes an opacity change or nothing. Durations drop to about zero, except brief fades that help show a change of state. Nothing essential depends on motion.
5. **Write only the changed tokens** to `tokens/src/<category>.<mode>.json`, and record the mode in `sistema.json`.
6. **Compile** with `tokens.pipeline`, which emits the mode selectors above.
7. **Build `sistema-review/tokens.add-mode.html`:** the same small interface sample (a panel, a heading, body text, buttons, a text field, a table, an alert, a menu) in the default mode and in the new one, side by side. For motion, add a button that plays the same transition in each. Ask for approval.
8. Update DESIGN.md (the Colors, Layout, or a motion note in Do's and Don'ts), and log the decision.

**Evidence:**
- **Theme:** the contrast table for every pairing in the new theme.
- **Density:** target sizes and body line height in compact.
- **Motion:** the list of transitions and what each becomes.
- **All modes:** the comparison page and the person's approval.

## 3. New rules

| Rule | Says | Checked by |
|---|---|---|
| `tokens.modes.overrides-only` | A mode file holds only tokens that change, under the same names as the defaults. It defines no new tokens. | Play evidence; the pipeline fails on an unknown name |
| `tokens.modes.one-axis` | Each token is changed by at most one axis, so modes combine without conflict. | Play evidence; the pipeline |
| `tokens.modes.no-component-changes` | Adding a mode changes no component code. If a component breaks in a mode, it was using a raw value, which the coverage audit reports. | Play evidence (advisory) |

The existing rules for contrast, target size, body line height, and reduced motion apply inside every mode.

## 4. Changes elsewhere

- **`color.add-theme` retires into this play:** its procedure becomes step 2. The session route "Add a theme" becomes **"Add a mode"** (`tokens.add-mode`, then `tokens.pipeline`). `color.scheme` still builds both themes for new projects.
- **`tokens.pipeline`** emits selectors for every mode file it finds. The token check page gets a switch for each axis.
- **`sistema.json`** records which modes exist and which is the default for each axis (section 5, question 3).
- **The coverage audit** reports components that break in a mode because they use raw values.
- **Relay** (the reference project) adds compact density and reduced motion during V3.3 through the session route. That tests the play for real and gives the guides their examples.

## 5. Questions for the owner

1. **Approve the model?** Three independent axes (theme, density, motion), mode files holding only changed tokens, and the selectors above.
2. **Retire `color.add-theme`** into this play, with one session route "Add a mode"? Recommended. The alternative is to keep add-theme and add separate plays for density and motion.
3. **How `sistema.json` records modes:**
   - **(a, recommended)** Keep `project.theme` and `theme_primary`, which most plays already read, and add `project.modes` for density and motion, for example `{ "density": ["comfortable", "compact"], "motion": ["standard", "reduced"] }`, with the first value as the default.
   - **(b)** Move all axes, theme included, into `project.modes`. That's more consistent, but it changes every play that reads `project.theme`.
4. **Reduced motion needs motion tokens,** and no play creates them yet (plan: "add a motion play when a project asks for one"). Options:
   - **(a, recommended)** When a project has no motion tokens, this play first creates the minimum, a few durations and easings from the motion guide, then adds the reduced mode.
   - **(b)** Build a `motion.tokens` play now, which Start offers as optional.
   - **(c)** Offer reduced motion only to projects that already have motion tokens.
5. **Offer modes in Start?** Recommended: no. Start already asks about theme. Density and motion modes are added afterwards through "Work on my system", which keeps Start shorter. The alternative is an optional step at the end of Foundations.
