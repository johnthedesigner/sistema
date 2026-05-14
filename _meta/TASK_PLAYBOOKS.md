# TASK_PLAYBOOKS.md
# Design System Knowledge Base — Task Playbooks

**Version:** 3.0
**Updated:** 2026-05-13
**Purpose:** Copyable prompt starters for agentic design system work. Each play is a complete prompt you can paste into a coding agent. Plays are ordered by the stage of design system building they belong to — earlier plays produce the foundations that later plays build on.

Plays reference content from the Sistema knowledge base using `{{sistema_url}}` — this is substituted with the live app URL when you copy. Synthesis documents (under `kb/principles/`) are the primary references for campaign plays; individual design system KB files are supplementary research, not templates to copy from.

---

## Stages

1. **System definition** — Establish positioning, structure, and principles before any values exist
2. **Primitive tokens** — Generate raw color, type, shape, and spacing values
3. **Semantic layer** — Map primitives to roles; generate theme variants; set up build tooling
4. **Components** — Specify and implement components that consume the token system
5. **Migration and adoption** — Transform existing codebases to work with a design system

---

## positioning-brief — Establish a Positioning Brief

**Stage:** 1
**Tags:** planning, positioning, foundations, living-brief

You are helping me establish the positioning brief for a new design system before any values are chosen. This brief drives every downstream decision — color model, type scale, density, brand personality — so it must be specific.

Work through the following questions with me. For each one, ask for clarification if my answer is too vague to be actionable. When you have answers to all questions, produce the two outputs at the end.

**Questions:**

1. **Product type and context:** What kind of product is this? (e.g. SaaS dashboard, consumer mobile app, e-commerce, developer tool, internal tool, marketing site) Who are the primary users and what are they trying to accomplish?

2. **Information density:** Is the UI primarily content-dense (many data points visible at once — tables, dashboards, data-heavy forms) or content-sparse (focused flows, marketing, onboarding, simple consumer tasks)? Or does it need to serve both modes?

3. **Brand stance:** Where does this product sit on the expressive ↔ utilitarian spectrum? Expressive products have personality, delight, and visual distinctiveness. Utilitarian products prioritize clarity, efficiency, and cognitive load reduction. Most products are somewhere between — where is this one?

4. **Color constraints:** Does the product have an existing brand color (hex value or description)? Are there colors that must be avoided or reserved (e.g. competitor brand colors, colors with negative cultural associations for the target audience)?

5. **Theme requirements:** Light mode only, dark mode only, or both? If both — is one the primary experience, or are they equivalent?

6. **Platform and scale:** Web only, mobile only, or cross-platform? Will this system be used by one team or multiple teams? Is component count likely to be small (<20), medium (20–60), or large (60+)?

7. **Accessibility requirements:** Standard WCAG 2.2 AA (the legal baseline for most regulated products)? Or is there a stronger requirement — AAA, internal policy, specific user population with accessibility needs?

8. **Timeline and constraints:** Is there an existing codebase this system needs to work with? Any technology constraints (framework, CSS approach, design tool)?

---

**Outputs:**

**Output 1 — Positioning brief** (prose, 150–250 words):

A narrative description of the product's design stance. Should answer: what this product looks like and feels like, what it does not look like, and what principles guide every visual decision. Write it as a brief an engineer or designer can hand to an AI agent to get consistent output.

**Output 2 — Living brief seed** (structured, for `LIVING_BRIEF.md`):

Populate the Project Identity and Key Decisions sections of the living brief using the answers above. Leave Key Decisions entries as `[to be determined — {reason}]` for anything not yet resolvable. Format as a ready-to-commit `LIVING_BRIEF.md` using the template from `_meta/templates/LIVING_BRIEF.md`.

---

## generate-design-md — Generate a DESIGN.md

**Stage:** 1
**Tags:** design-md, foundations, planning

You are helping me create a `DESIGN.md` file — a concise specification document that describes a design system's visual language for use with AI coding tools.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Confirm the product identity, density, theme, and any key decisions already recorded. If the file does not exist, ask the user to run the `positioning-brief` play first.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- DESIGN.md format specification: `{{sistema_url}}/raw/standards/design-md/spec`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

The spec file defines the exact format, YAML schema, section order, and token types. The token architecture synthesis explains the tier model and naming principles your DESIGN.md should follow.

**Step 3 — Generate the DESIGN.md:**

My project context (supplement to the living brief):

{{project_context}}

Rules:
- Follow the DESIGN.md format spec exactly — YAML front matter first, then markdown sections in the order defined in the spec
- Token names in the YAML must follow the naming principles from the token architecture synthesis: semantic, role-based, consistent pattern across categories
- The Overview section must reflect the positioning brief (from the living brief or from context above) — not generic placeholder prose
- Mark any value you are deciding without explicit guidance as `[default — review]`
- Do not reference any specific design system's approach or terminology
- Output raw markdown only — no surrounding explanation or code fences wrapping the whole document

**Step 4 — Update the living brief:**

Append to the decision log in `LIVING_BRIEF.md`:
```
[2026-05-13] — Generated initial DESIGN.md — [note any key decisions made]
```

---

## generate-color-scheme — Generate a Color Scheme

**Stage:** 2
**Tags:** tokens, color, semantic

You are helping me generate a complete color scheme for my design system — semantic color role tokens, as CSS custom properties ready to ship.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the theme setting (light-only / dark-only / both), any existing color decisions, and the product's density and brand stance.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

The color architecture synthesis explains the four major architectural models, the non-negotiable floor (contrast requirements, foreground pairings, never-hardcode), and dark mode tonal shift logic. Use it to select the appropriate model for this product and to structure the output.

**Step 3 — Clarify scope:**

Theme mode (read from living brief — confirm before proceeding):
- **Light only:** generate `:root { }` with light mode values only
- **Dark only:** generate `:root { }` with dark mode values only
- **Both:** generate `:root { }` with light mode values, then `[data-theme="dark"] { }` with dark mode values

**Step 4 — Generate the color scheme:**

My color direction:
{{color_direction}}

Generate the following semantic roles as CSS custom properties. Use the naming pattern `--color-[role]`:

**Required roles:**
- `--color-primary` and `--color-on-primary` — primary action and its text
- `--color-primary-container` and `--color-on-primary-container` — contained variant and its text
- `--color-secondary` and `--color-on-secondary` — secondary action and its text
- `--color-secondary-container` and `--color-on-secondary-container`
- `--color-surface` — default background
- `--color-surface-raised` — elevated surface (cards, sheets)
- `--color-surface-overlay` — modal / dialog overlay surface
- `--color-on-surface` — primary text on surface
- `--color-on-surface-muted` — secondary / muted text on surface
- `--color-border` — default border
- `--color-border-focus` — focus ring color (must meet 3:1 against surface)
- `--color-error` and `--color-on-error` — error states
- `--color-success` and `--color-on-success` — success / confirmation states
- `--color-warning` and `--color-on-warning` — warning states

**For dark mode (if theme is "both"):**
Do not invert light mode values. Use tonal shift logic: surface values draw from the dark end of the neutral palette; primary/secondary role colors draw from the lighter portion of each hue (higher lightness) to maintain contrast. Every `on-*` role must meet WCAG 4.5:1 against its paired surface.

Flag any role where the contrast should be manually verified.

**Step 5 — Update the living brief:**

Update the Color entry in Key Decisions and append to the decision log:
```
[2026-05-13] — Color scheme generated — [note architecture model chosen, theme scope]
```

---

## generate-type-scale — Generate a Type Scale

**Stage:** 2
**Tags:** tokens, typography, primitives

You are helping me generate a typography token set for my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the density target, any typeface decisions already made, and the product's expressive vs. utilitarian stance.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Typography architecture synthesis: `{{sistema_url}}/raw/principles/typography/architecture`

This synthesis covers scale construction (modular vs. hand-tuned, ratio selection by context), role taxonomy decisions (named roles vs. numeric steps), and non-negotiable legibility constraints (line height per role, measure, letter-spacing direction by size). Use it as the decision framework — do not copy any specific design system's scale.

**Step 3 — Generate the type scale:**

My typography direction:
{{typography_direction}}

For each type role, output a token block with this structure:
```css
/* [Role name] — [one-line usage description] */
--type-[role]-size: [value];
--type-[role]-weight: [value];
--type-[role]-line-height: [value];   /* unitless, e.g. 1.4 */
--type-[role]-letter-spacing: [value]; /* em, e.g. -0.01em */
```

Define roles appropriate for this product's density and stance. At minimum:
- A display role (large hero text, if applicable)
- Heading roles (at least large and small)
- Body roles (at least regular and small)
- A label role (UI labels, captions, metadata)

Apply non-negotiable legibility constraints from the synthesis:
- Body roles: line height ≥ 1.5 (unitless)
- Heading roles: line height 1.1–1.3
- Display roles: line height 1.0–1.1
- Letter spacing: negative on large sizes (display/heading), positive on small sizes (label/caption) when legibility requires it

Note any decision that required a judgment call.

**Step 4 — Update the living brief:**

Update the Typography entry in Key Decisions and append to the decision log:
```
[2026-05-13] — Type scale generated — [note scale approach and role taxonomy]
```

---

## generate-shape-tokens — Generate Shape Tokens

**Stage:** 2
**Tags:** tokens, shape, primitives

You are helping me generate shape (border-radius) tokens for my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the brand stance (expressive vs. utilitarian) — this directly drives radius personality.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Shape architecture synthesis: `{{sistema_url}}/raw/principles/shape/architecture`

This synthesis covers the radius-as-personality spectrum, scale approach options (named semantic / numeric / global-factor), component family consistency rules, and pill shape guidance. Use it to select an approach appropriate for this product.

**Step 3 — Generate the shape tokens:**

My shape direction:
{{shape_direction}}

Output shape tokens as CSS custom properties:
```css
--radius-none: 0px;
--radius-sm: [value];
--radius-md: [value];
--radius-lg: [value];
--radius-xl: [value];
--radius-full: 9999px;
```

Include a component mapping table — which radius token each major component type should use:
| Component type | Radius token | Notes |
|---|---|---|
| Buttons | | |
| Inputs / form fields | | |
| Cards | | |
| Modals / dialogs | | |
| Chips / badges | | |
| Tooltips | | |

Explain the personality choice: where this system sits on the sharp ↔ rounded spectrum and why.

**Step 4 — Update the living brief:**

Update the Shape entry in Key Decisions and append to the decision log:
```
[2026-05-13] — Shape tokens generated — [note personality stance and scale approach]
```

---

## generate-color-roles — Map an Existing Palette to Semantic Roles

**Stage:** 3
**Tags:** tokens, color, semantic

Use this play when you already have a set of color values — from a brand palette, a Figma file, or an existing design system — and you want to map them to semantic roles that components can consume.

If you are starting from a single seed color with no existing palette, use `generate-color-scheme` instead.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`

Pay attention to the non-negotiable floor section: required semantic roles, the on-* pairing pattern, contrast requirements, and the never-hardcode rule.

My existing palette:
[Paste your color values here — hex values, a Figma swatch export, a Tailwind color config, or whatever format you have. Include neutrals and grays.]

Map the palette to semantic roles following the role structure from the color architecture synthesis. For each role:
- Note which palette value you assigned
- Verify the contrast ratio for every `on-*` pairing (target ≥ 4.5:1 for text, ≥ 3:1 for UI components)
- Flag gaps where the palette does not have a suitable value for a required role

Output as CSS custom properties. Token naming pattern: `--color-[role]`.

Custom prefix (optional): [leave blank to use `--color-`, or specify e.g. `--brand-`]

---

## generate-dark-mode — Generate Dark Mode Token Values

**Stage:** 3
**Tags:** tokens, color, semantic, dark-mode

You are helping me generate dark mode color token values for my design system.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`

Pay close attention to the dark mode section: tonal shift logic, why naive inversion fails, and the tone-pair table.

My existing tokens:
[Paste your primitive color palette and your light mode semantic role mapping here.]

Generate a complete dark mode role mapping. Do not invert light mode values — use tonal shift logic:
- Surface roles draw from the dark end of the neutral palette (low lightness)
- Primary/secondary role colors draw from the lighter portion of each hue to maintain contrast against dark surfaces
- Every `on-*` role must meet WCAG 4.5:1 against its paired surface

Output as `[data-theme="dark"] { }` CSS custom properties. Explain any roles that required a non-obvious decision, and flag any pairing where contrast should be manually verified.

---

## generate-style-dictionary — Generate a Style Dictionary Config

**Stage:** 3
**Tags:** tokens, tooling, build, style-dictionary

You are helping me set up Style Dictionary to compile my design tokens into CSS custom properties, JavaScript modules, and other platform outputs.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

Pay attention to the tier model and file structure recommendations — your Style Dictionary input files should mirror this structure.

My setup:
[Describe your repository structure, what output formats you need (CSS vars, JS ESM, JSON, SCSS?), and any existing file organization to work around.]

Output:
1. A `style-dictionary.config.js` file ready to run
2. The expected input file structure (where token JSON files should live), organized by tier (primitive, semantic, component) per the token architecture synthesis
3. Example npm scripts to run the build
4. A brief explanation of how to add a new token category without breaking existing outputs

The output should be complete enough to copy into a repository and run with `npx style-dictionary build`.

---

## specify-component — Write a Component Specification

**Stage:** 4
**Tags:** components, specification, design

You are helping me write a component specification — a complete design and behavior description that can be implemented consistently against my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, the shape scale, and any component decisions already recorded.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

The token architecture synthesis defines the naming convention your spec should use for token references. The accessibility floor defines the non-negotiable requirements for every interactive component.

**Step 3 — Write the specification:**

Component: [e.g. Button, Text Input, Card, Modal, Chip, Badge]

My token context:
[Describe your CSS custom property naming pattern (e.g. `--color-primary`, `--color-on-primary`, `--radius-md`) or paste the relevant token names your spec should reference.]

Use this exact document structure:

```
# [Component Name] Specification

## Variants
[Table: variant name | description | when to use]

## Sizes
[Table or "single size" if applicable]

## States
[Table: state | visual change | token consumed]
Include: default, hover, focus, active, disabled.

## Token Map
[List every token the component consumes: property → token name]
Group by: container, text/label, border, shape, typography.

## Accessibility
- ARIA role and required attributes
- Keyboard interaction (tab, space, enter, escape — per the accessibility floor spec)
- Focus indicator: color token, width, offset (must meet 3:1 contrast per accessibility floor §3.2)
- Minimum touch target: ≥ 44×44px interactive area (per accessibility floor §4.2)
- Accessible name requirement (per accessibility floor §5.2)

## Behavior
[Animation, loading states, icon support, edge cases]
```

Output only the specification document. Token references must use names from my token system — not hardcoded hex values or raw px values for anything covered by a token.

**Step 4 — Update the living brief:**

Append to the decision log:
```
[2026-05-13] — [Component name] spec written — [note any non-obvious decisions]
```

---

## implement-component — Implement a Component

**Stage:** 4
**Tags:** components, code, implementation

You are helping me implement a UI component that consumes my design system's token system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, framework, and any implementation patterns already established.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

The token architecture synthesis defines correct token consumption patterns. The accessibility floor defines the non-negotiable requirements that every component implementation must meet.

**Step 3 — Implement the component:**

Component: [e.g. Button, Text Input, Card]
Framework: [React / Vue / Svelte / Web Components]
Styling: [CSS custom properties / Tailwind / CSS Modules / styled-components]

Component specification or requirements:
[Paste your component spec here, or describe the variants, states, and behavior needed.]

My token setup:
[Paste the relevant token names from your system — color roles, shape roles, typography roles — that the component should consume.]

Output production-ready component code. Requirements:
- Use semantic token names throughout via CSS custom properties — no hardcoded hex values or raw px values for anything covered by a token
- Implement all required ARIA attributes and keyboard behavior per the accessibility floor spec
- Implement a visible focus indicator that meets the 3:1 contrast requirement
- Ensure the interactive area meets 44×44px minimum
- Include prop types and a brief usage example

**Step 4 — Update the living brief:**

Update the Components implemented list in Current State and append to the decision log:
```
[2026-05-13] — [Component name] implemented — [note any non-obvious decisions]
```

---

## migrate-tailwind-tokens — Migrate a Tailwind Config to Semantic Tokens

**Stage:** 5
**Tags:** migration, tokens, color, tailwind

You are helping me migrate an existing Tailwind CSS color configuration to a structured two-tier token system (primitive + semantic).

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`

Pay attention to the distinction between primitive colors (raw values organized by hue and step) and semantic roles (how those values are used by components and surfaces). The token architecture synthesis defines the naming principles for each tier.

My existing Tailwind config — paste the `theme.colors` section:

{{tailwind_colors}}

Perform the migration in two steps:

**Step 1 — Extract primitives.** Reorganize the raw color values as primitive tokens using a consistent step scale (e.g. `primary-10` through `primary-99`). Do not change any values, only rename and restructure.

**Step 2 — Define semantic roles.** Map those primitives to semantic roles following the naming convention from the token architecture synthesis. Every component-facing role must have a name that communicates its purpose, not its value.

Output:
- A `tokens/primitive/colors.json` file with the restructured primitives
- A `tokens/semantic/colors.json` file with the role mapping
- A Tailwind `theme.extend` config that reads from CSS custom properties so existing Tailwind utility classes continue to work after migration

---

## audit-component — Audit a Component Against System Standards

**Stage:** 5
**Tags:** audit, components, code, tokens

You are helping me audit an existing UI component against my design system's standards and identify gaps before scaling the pattern.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

These define what correct token consumption and accessibility compliance look like — the audit measures the component against these standards.

Component to audit:

[Paste your component code here.]

Evaluate against these criteria:

1. **Token usage** — Does the component consume semantic token names (via CSS vars or a theme system), or are there hardcoded hex values, px sizes, or raw font names? Flag every instance.

2. **Interactive states** — Are hover, focus, active, and disabled states present? Does each state use the correct token for the visual change?

3. **Accessibility** — Correct ARIA role and attributes; keyboard interaction model per accessibility floor §2; visible focus indicator meeting 3:1 contrast per §3; touch target ≥ 44×44px per §4.2; accessible name present per §5.2?

4. **API design** — Are prop names predictable and consistent with the rest of the system? Is the API minimal without being inflexible?

Output a structured audit report:
- Summary verdict (ready to scale / needs work / significant gaps)
- Specific issues, each with a line reference and severity (blocking / recommended / minor)
- Prioritized list of changes to make before using this component as a pattern

---

## session-start — Start a Design System Work Session

**Stage:** 6
**Tags:** stewardship, living-brief, planning, session

Use this play at the start of any design system work session. It orients you in the current state of the system before any decisions are made, and prevents a model from acting on stale context or making decisions that conflict with prior choices.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Summarize:
- The product identity (one sentence)
- The key decisions already recorded, by area
- The current state: what components exist, what is stubbed, what is missing
- Any open questions

**Step 2 — Confirm scope for this session:**

What is the goal of this session? State it explicitly before beginning work. If the scope conflicts with an existing decision in the living brief, flag the conflict and resolve it before proceeding.

Planned scope for this session:
[Describe what you intend to work on — e.g. "implement the Button component", "generate dark mode tokens", "add the Modal component spec"]

**Step 3 — Identify relevant synthesis documents:**

Based on the planned scope, identify which synthesis documents are relevant. Load only what is needed for this session's work.

Relevant synthesis documents may include:
- Token architecture: `{{sistema_url}}/raw/principles/tokens/architecture`
- Color architecture: `{{sistema_url}}/raw/principles/color/architecture`
- Typography architecture: `{{sistema_url}}/raw/principles/typography/architecture`
- Spacing and layout: `{{sistema_url}}/raw/principles/spacing/layout`
- Shape architecture: `{{sistema_url}}/raw/principles/shape/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`
- Motion architecture: `{{sistema_url}}/raw/principles/motion/architecture`

**Step 4 — Confirm readiness:**

State: "Ready to begin. Current system state: [one-sentence summary]. Session goal: [goal]. Relevant documents loaded: [list]."

Do not begin work until this confirmation is produced.

---

## add-component — Add a Component to the Design System

**Stage:** 6
**Tags:** stewardship, components, implementation, living-brief

Use this play when adding a new component to an existing design system. It ensures the component is consistent with existing decisions, consumes the correct tokens, and meets accessibility requirements before it is treated as a pattern.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, the shape and spacing scale, and any component decisions already recorded. Identify whether any similar component already exists that should inform this one.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

**Step 3 — Specify the component:**

Component to add: [component name and one-line description]

Before implementing, write a brief spec covering:
- Variants (if any) with "when to use" for each
- States: default, hover, focus, active, disabled — and which token changes per state
- Token map: every CSS custom property the component will consume
- Accessibility: ARIA role, keyboard behavior, accessible name requirement, touch target size

Confirm the spec is consistent with existing components in the living brief's current state list before proceeding.

**Step 4 — Implement the component:**

Framework: [React / Vue / Svelte / Web Components]
Styling: [CSS custom properties / Tailwind / CSS Modules]

Implement the component from the spec. Requirements:
- No hardcoded hex values or raw px values for anything covered by a token
- Focus indicator meets 3:1 contrast against the surface it appears on
- Interactive area meets 44×44px minimum
- All ARIA attributes and keyboard behavior per the accessibility floor

**Step 5 — Update the living brief:**

Move the component from "stubbed" to "implemented" in Current State (if it was previously stubbed), or add it to the implemented list. Append to the decision log:
```
[2026-05-13] — [Component name] added — [note any non-obvious variant or token decisions]
```

---

## audit-token-coverage — Audit Token Coverage Across the Codebase

**Stage:** 6
**Tags:** stewardship, audit, tokens, drift

Use this play to find hardcoded values in the codebase that should be consuming design tokens. Run it periodically — especially after rapid development phases — to catch drift before it compounds.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention and the list of implemented components. This tells you what the correct token names are and what components should be covered.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

Pay attention to the "no raw values in components" rule and the coverage requirements.

**Step 3 — Scan for drift:**

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

**Step 4 — Produce the audit report:**

For each violation found:
- File path and line number
- The hardcoded value
- The correct token it should use
- Severity: **blocking** (color or interactive state — affects consistency and accessibility), **recommended** (spacing or shape — affects consistency), **minor** (one-off value with minimal systemic impact)

Output:
1. Summary: total violations by severity
2. Prioritized list of violations (blocking first)
3. Recommended fix order (group by component or file for efficiency)

---

## accessibility-audit — Audit Components Against the Accessibility Floor

**Stage:** 6
**Tags:** stewardship, audit, accessibility, wcag

Use this play to evaluate the current state of the design system's components against the non-negotiable accessibility requirements. Produces a structured report with severity levels.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note which components are implemented and any accessibility decisions already recorded.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

This is the normative checklist. Every item marked "must" in that document is a blocking violation if not met.

**Step 3 — Define the audit scope:**

Components to audit:
[List the components you want to audit, or write "all implemented components" to audit everything in the living brief's current state list.]

**Step 4 — Evaluate each component:**

For each component, evaluate against each section of the accessibility floor:

1. **Color contrast** — Do all text/background pairings meet 4.5:1 (normal text) or 3:1 (large text / UI components)?
2. **Keyboard navigation** — Is every interactive element reachable by keyboard? Can it be activated with the correct key?
3. **Focus visibility** — Is the focus indicator visible? Does it meet 3:1 contrast against the adjacent surface?
4. **Touch targets** — Is the interactive area ≥ 44×44px?
5. **Semantic structure** — Does the component use semantic HTML or a full ARIA implementation?
6. **Accessible name** — Does every interactive element have an accessible name?
7. **Dynamic state** — Are state changes (expanded, selected, checked) exposed via ARIA attributes?

**Step 5 — Produce the audit report:**

For each component:
- Pass / Fail / Needs verification per criterion
- Specific violations with severity: **blocking** (WCAG A/AA violation), **recommended** (best practice not met), **minor** (enhancement)

Summary:
- Components fully passing
- Components with blocking violations (must fix before ship)
- Components with recommended improvements

---

## design-system-retrospective — Run a Design System Retrospective

**Stage:** 6
**Tags:** stewardship, retrospective, living-brief, maintenance

Use this play at regular intervals (end of a sprint, end of a phase, before a major release) to identify drift, undocumented decisions, and decisions that need revisiting. Updates the living brief.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` in full. Note any open questions that have been de facto resolved by implementation but not recorded.

**Step 2 — Read the current system state:**

Read the token files and component files identified in the living brief's Current State section. You are looking for:
- Values or patterns that exist in code but are not reflected in the living brief's Key Decisions
- Components that have been added or changed without updating the Current State list
- Decisions that were made with `[to be determined]` markers but have since been implemented

**Step 3 — Evaluate alignment:**

Answer these questions:
1. What has drifted from the recorded decisions? (Code says one thing; brief says another)
2. What has been added without documentation? (New components, new tokens, new patterns)
3. What decisions made early should be revisited? (Early constraints that no longer apply, or that have proven wrong in practice)
4. Does DESIGN.md need to be updated? (If any token values, component patterns, or Do's and Don'ts have changed)

**Step 4 — Produce the retrospective report:**

Output a structured report:
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

**Step 5 — Update the living brief:**

Based on the retrospective:
- Update Key Decisions for any that have changed
- Update Current State to reflect actual implemented state
- Move any de-facto-resolved open questions to the decision log
- Add a retrospective entry to the decision log:
```
[2026-05-13] — Retrospective — [one-sentence summary of most significant finding]
```

---

## plan-next-iteration — Plan the Next Design System Iteration

**Stage:** 6
**Tags:** stewardship, planning, living-brief, iteration

Use this play at the start of a new work cycle — after a retrospective, after a phase completes, or when planning what to build next. Produces a prioritized task list for the next iteration.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` in full. Pay particular attention to:
- Open questions (unresolved decisions)
- Current state gaps (stubbed components, missing token categories)
- The most recent retrospective entry in the decision log

**Step 2 — Assess the system's current maturity:**

Classify the system's current state across five dimensions:

| Dimension | Not started | Partial | Complete |
|---|---|---|---|
| Token foundation (primitive + semantic) | | | |
| Component coverage (key components implemented) | | | |
| Accessibility compliance | | | |
| Dark mode (if required) | | | |
| Documentation (DESIGN.md current, living brief current) | | | |

**Step 3 — Identify the highest-priority work:**

Based on the maturity assessment and the living brief's open questions, identify the top 3–5 items for the next iteration. Prioritize using these rules:
1. **Blocking gaps** — missing foundations that block other work (no token file = can't implement components)
2. **Accessibility violations** — any blocking issues from the accessibility audit
3. **Coverage gaps** — components that are stubbed but needed for the product
4. **Open questions** — decisions that have been deferred but now have enough information to resolve
5. **Improvements** — enhancements to things that exist but aren't complete

**Step 4 — Produce the iteration plan:**

Output a structured plan:
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

**Step 5 — Update the living brief:**

Append to the decision log:
```
[2026-05-13] — Iteration planned — [iteration goal in one sentence]
```
