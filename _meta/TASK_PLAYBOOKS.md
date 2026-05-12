# TASK_PLAYBOOKS.md
# Design System Knowledge Base — Task Playbooks

**Version:** 2.0
**Updated:** 2026-05-11
**Purpose:** Copyable prompt starters for agentic design system work. Each play is a complete prompt you can paste into a coding agent. Plays are ordered by the stage of design system building they belong to — earlier plays produce the foundations that later plays build on.

Plays reference content from the Sistema knowledge base using `{{sistema_url}}` — this is substituted with the live app URL when you copy.

---

## Stages

1. **System definition** — Establish structure and principles before any values exist
2. **Primitive tokens** — Generate raw color, type, shape, and spacing values
3. **Semantic layer** — Map primitives to roles; generate theme variants; set up build tooling
4. **Components** — Specify and implement components that consume the token system
5. **Migration and adoption** — Transform existing codebases to work with a design system

---

## generate-design-md — Generate a DESIGN.md

**Stage:** 1
**Tags:** design-md, foundations, planning

You are helping me create a `DESIGN.md` file — a concise specification document that describes a design system's visual language for use with AI coding tools.

Before generating anything, read the following reference from the Sistema knowledge base:
- DESIGN.md format reference: {{sistema_url}}/raw/design-systems/material/design-md/DESIGN.md

That page shows the full DESIGN.md format used by a production design system. Read it carefully — note which sections are present, how specific the values are, and how it describes token usage for components.

Now generate a `DESIGN.md` for my design system. My project context:

[Describe your product, brand, and any existing design decisions — colors, typefaces, shape preferences, what kinds of components you'll build, etc. The more specific you are, the better the output.]

Rules for generating:
- Use the Material reference as a format template only — do not copy M3-specific values or technology choices (HCT color space, Roboto, etc.) unless they actually apply to my system
- Adapt every section to reflect my system's actual decisions, not M3's
- Omit sections that genuinely don't apply to my system rather than leaving them vague
- If I haven't specified something and it matters, make a concrete decision and mark it `[default — review]`
- Output raw markdown only — no prose explanation around the file, no code fences wrapping the whole document

---

## plan-token-architecture — Plan a Token Architecture

**Stage:** 1
**Tags:** tokens, architecture, foundations, planning

You are helping me plan the token architecture for a new design system before writing any actual token values.

Before proposing anything, read the following references from the Sistema knowledge base:
- Token design principles: {{sistema_url}}/raw/design-systems/material/guidance/foundations/design-tokens.md
- Color system structure: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-system.md
- Token schema implementation: {{sistema_url}}/raw/design-systems/material/implementation/tokens/token-schema.md

Read all three before responding. Pay attention to: how many tiers the token system uses, how naming conventions differ between tiers, what categories of tokens are defined, and how the system is organized for compilation.

Based on these references, propose a token architecture for my design system. The architecture should define:

1. How many tiers the token system will have (e.g. primitive → semantic → component)
2. What naming conventions to use at each tier
3. Which token categories to define (color, typography, spacing, shape, elevation, motion?)
4. What file structure to use in the repository

My project context:
[Describe your tech stack (React, Vue, etc.), styling approach (CSS vars, Tailwind, CSS-in-JS), and any constraints or conventions already in place.]

Output a structured proposal — not actual token values, just the architecture. Include a sample naming pattern for each tier and a proposed file tree.

---

## generate-color-scheme — Generate a Color Scheme

**Stage:** 2
**Tags:** tokens, color, semantic

You are helping me generate a complete color scheme for my design system — semantic color role tokens for both light and dark themes, as CSS custom properties ready to ship.

Before generating anything, read the following references from the Sistema knowledge base:
- Color system overview (explains the tonal model and role structure): {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-system.md
- Color roles (explains what each role is for): {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Material's color token values (use this as your output format reference): {{sistema_url}}/raw/design-systems/material/assets/tokens/colors.md

Read all three before responding. The asset file shows the exact CSS custom property format and the full list of roles to define — match that structure.

Now generate a color scheme for my design system.

My color direction:
[Provide your primary brand color (hex), any secondary colors, and any preferences — e.g. "warm neutrals", "high contrast", "muted palette". If you only have a primary brand color, that's enough to start.]

Generate both a light theme and a dark theme. For each theme, produce the full set of semantic role tokens in the same CSS custom property format as the Material reference:
- Primary family (primary, on-primary, primary-container, on-primary-container, inverse-primary)
- Secondary family
- Tertiary family
- Error family
- Surface family (surface, on-surface, surface-variant, on-surface-variant, surface-dim, surface-bright, surface-container-lowest through highest, inverse-surface, inverse-on-surface)
- Outline family (outline, outline-variant)
- Utility (shadow, scrim)

Use the M3 tonal logic for dark mode: do not simply invert light values. Surface roles in dark mode draw from the dark end of the neutral palette; accent roles draw from the 70–80 tone range of their hue for adequate contrast.

Note any roles where you made a non-obvious decision so I can review them.

---

## generate-type-scale — Generate a Primitive Type Scale

**Stage:** 2
**Tags:** tokens, typography, primitives

You are helping me generate a typography token set for my design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Typography guidance: {{sistema_url}}/raw/design-systems/material/guidance/foundations/typography.md
- Material's typography token values: {{sistema_url}}/raw/design-systems/material/assets/tokens/typography.md

Read both before responding. Pay attention to: the role names (display, headline, title, body, label), which properties are defined per role (font, size, weight, line-height, letter-spacing), and how roles map to usage contexts (when to use display vs. headline, etc.).

Now generate a typography token set for my design system.

My typography direction:
[Provide your typeface choices if known, any size or contrast preferences, and your target platform — web, mobile, or both.]

Output the token set in the same format as the Material reference. Define the same role categories and adjust values to suit your typeface and scale preferences. Include a brief rationale for any non-obvious decisions.

---

## generate-shape-tokens — Generate Shape Tokens

**Stage:** 2
**Tags:** tokens, shape, primitives

You are helping me generate shape (border-radius) tokens for my design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Shape guidance: {{sistema_url}}/raw/design-systems/material/guidance/foundations/shape.md
- Material's shape token values: {{sistema_url}}/raw/design-systems/material/assets/tokens/shape.md

Read both before responding. Pay attention to: the shape scale categories (none, extra-small, small, medium, large, extra-large, full), the values at each step, how components map to shape roles, and the rationale for using a role-based shape system rather than raw values.

Now generate a shape token set for my design system.

My shape direction:
[Describe the visual feel you are going for — e.g. "sharp and minimal", "friendly and rounded", "pill-shaped CTAs but square cards". If you have existing border-radius values in use, list them.]

Output the token set in the same format as the Material reference. Map your values to the standard shape roles so components can consume them by role name, not raw value.

---

## generate-color-roles — Map an Existing Palette to Semantic Roles

**Stage:** 3
**Tags:** tokens, color, semantic

Use this play when you already have a set of color values — from a brand palette, a Figma file, or an existing design system — and you want to map them to semantic roles that components can consume.

If you are starting from a single seed color with no existing palette, use `generate-color-scheme` instead — it handles the full generation in one step.

Before generating anything, read the following references from the Sistema knowledge base:
- Color roles guidance: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Color system overview: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-system.md

Read both before responding. Pay attention to: which semantic roles exist, what each role is for (the "on-" pattern, container vs. non-container, the surface tonal family), and how light and dark theme variants differ.

My existing palette:
[Paste your color values here — hex values, a Figma swatch export, a Tailwind color config, or whatever format you have. Include any neutrals and grays.]

Map my palette to the full set of M3-compatible semantic roles. For each role, note which palette value you assigned and why — especially for non-obvious choices. Flag any gaps where my palette doesn't have a good value for a required role.

Output as CSS custom properties for light mode first, then dark mode. Use the standard M3 role names (--md-sys-color-* prefix, or a custom prefix I specify below).

Custom prefix (optional): [e.g. --my-app-color-*, or leave blank to use --md-sys-color-*]

---

## generate-dark-mode — Generate Dark Mode Token Values

**Stage:** 3
**Tags:** tokens, color, semantic, dark-mode

You are helping me generate dark mode color token values for my design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Color roles guidance (covers both light and dark mode): {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Color system overview: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-system.md

Read both before responding. Pay close attention to how Material handles dark mode — it is not a simple inversion. Dark mode remaps roles to different points on the same palette, typically pulling surface values from the very dark end of the neutral scale and role colors from the 60–80 range of each hue.

Now generate dark mode color values for my design system.

My existing tokens:
[Paste your primitive color palette and your light mode semantic role mapping here. If you only have a light mode role map, include that.]

Output a complete dark mode role mapping that follows the same structural logic as Material's — surface values drawn from dark steps of the neutral scale, role colors drawn from the lighter portion of each hue to maintain contrast. Explain any decisions that differ from a naive inversion, and flag any roles where contrast may need manual review.

---

## generate-style-dictionary — Generate a Style Dictionary Config

**Stage:** 3
**Tags:** tokens, tooling, build, style-dictionary

You are helping me set up Style Dictionary to compile my design tokens into CSS custom properties, JavaScript modules, and other platform outputs.

Before generating anything, read the following reference from the Sistema knowledge base:
- Token schema implementation: {{sistema_url}}/raw/design-systems/material/implementation/tokens/token-schema.md

Read this before responding. Pay attention to how the token files are structured as input, what the naming hierarchy looks like in JSON, and how the system is organized for multi-platform output.

Now generate a Style Dictionary v3 configuration for my design system.

My setup:
[Describe your repository structure, what output formats you need (CSS vars, JS ESM, JSON, SCSS?), and any existing file organization I should work around.]

Output:
1. A `style-dictionary.config.js` file ready to run
2. The expected input file structure (where token JSON files should live)
3. Example npm scripts to run the build
4. A brief explanation of how to add a new token category without breaking existing outputs

The output should be complete enough to copy into a repository and run with `npx style-dictionary build`.

---

## specify-component — Write a Component Specification

**Stage:** 4
**Tags:** components, specification, design

You are helping me write a component specification — a complete design and behavior description that my team can implement consistently against our design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Color roles (for interactive state colors): {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Shape tokens (for component shape): {{sistema_url}}/raw/design-systems/material/guidance/foundations/shape.md
- Typography roles (for text within components): {{sistema_url}}/raw/design-systems/material/guidance/foundations/typography.md

Read all three before responding. These define the token vocabulary your spec should reference — do not hardcode values, reference role names.

Now write a component specification for the following component:

Component: [e.g. Button, Text Input, Card, Modal, Chip, Badge]

My token context:
[If you are using M3 tokens directly, write "using standard M3 tokens" and the agent will reference them by name. If you have a custom token system, paste the relevant token names — color roles, shape roles, typography roles — that the spec should reference.]

Use this exact document structure for the specification:

```
# [Component Name] Specification

## Variants
[Table: variant name | description | when to use]

## Sizes
[Table or "single size" if applicable]

## States
[Table: state | visual change | token used]
Include: default, hover, focus, active, disabled. Note state layer opacity if applicable.

## Token Map
[List every token the component consumes: property → token name]
Group by: container, text/label, border, shape, typography.

## Accessibility
- ARIA role and attributes
- Keyboard interaction (tab, space, enter, escape)
- Focus indicator: color, width, offset
- Minimum touch target
- Any screen reader considerations

## Behavior
[Animation, loading states, icon support, edge cases]
```

Output only the specification document — no prose explanation around it. Token references must use names from my token system, not hardcoded hex values.

---

## implement-component — Implement a Component

**Stage:** 4
**Tags:** components, code, implementation

You are helping me implement a UI component that consumes my design system's token system.

Before generating anything, read the following references from the Sistema knowledge base:
- Implementation overview: {{sistema_url}}/raw/design-systems/material/implementation/getting-started.md
- Color token values (for understanding token structure): {{sistema_url}}/raw/design-systems/material/assets/tokens/colors.md
- Shape token values: {{sistema_url}}/raw/design-systems/material/assets/tokens/shape.md
- Typography token values: {{sistema_url}}/raw/design-systems/material/assets/tokens/typography.md

Read all four before responding. Pay attention to the naming conventions used in the token files — your implementation should reference tokens by these names via CSS custom properties.

Now implement the following component:

Component: [e.g. Button, Text Input, Card]
Framework: [React / Vue / Svelte / Web Components]
Styling: [CSS custom properties / Tailwind / CSS Modules / styled-components]

My token setup:
[Describe your CSS custom property naming (e.g. `--color-primary`, `--color-on-primary`, `--shape-small`) or paste the relevant token names. If using Tailwind, paste your theme config.]

Component requirements:
[Describe the variants, states, and any behavior from your component spec. If you have a spec document, paste it here.]

Output production-ready component code. Use semantic token names throughout — no hardcoded hex values or raw px values for anything that belongs in the token system. Include prop types, ARIA attributes, and a brief usage example.

---

## migrate-tailwind-tokens — Migrate a Tailwind Config to Semantic Tokens

**Stage:** 5
**Tags:** migration, tokens, color, tailwind

You are helping me migrate an existing Tailwind CSS color configuration to a structured two-tier token system (primitive + semantic).

Before generating anything, read the following references from the Sistema knowledge base:
- Color system overview: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-system.md
- Color roles guidance: {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Token schema implementation: {{sistema_url}}/raw/design-systems/material/implementation/tokens/token-schema.md

Read all three before responding. Pay attention to the distinction between primitive colors (raw values organized by hue and step) and semantic roles (how those values are used by components and surfaces).

My existing Tailwind config — paste the `theme.colors` section:

[Paste your tailwind.config.js colors object here.]

Perform the migration in two steps:

**Step 1 — Extract primitives.** Reorganize the raw color values from the Tailwind config as primitive tokens using a consistent step scale (e.g. `primary-10` through `primary-99`). Do not change any values, only rename and restructure.

**Step 2 — Define semantic roles.** Map those primitives to semantic roles (primary, on-primary, surface, on-surface, etc.) following the role model from the color-roles reference.

Output:
- A `tokens/primitive/colors.json` file with the extracted and restructured primitives
- A `tokens/semantic/colors.json` file with the role mapping
- A Tailwind `theme.extend` config that reads from CSS custom properties so existing Tailwind utility classes continue to work after migration

---

## audit-component — Audit a Component Against System Standards

**Stage:** 5
**Tags:** audit, components, code, tokens

You are helping me audit an existing UI component against my design system's standards and identify gaps before we scale the pattern.

Before auditing anything, read the following references from the Sistema knowledge base:
- Color roles (correct state color usage): {{sistema_url}}/raw/design-systems/material/guidance/foundations/color-roles.md
- Shape tokens: {{sistema_url}}/raw/design-systems/material/guidance/foundations/shape.md
- Typography roles: {{sistema_url}}/raw/design-systems/material/guidance/foundations/typography.md
- Implementation overview: {{sistema_url}}/raw/design-systems/material/implementation/getting-started.md

Read all four before responding. These define what correct token usage looks like — the audit measures the component against this standard.

Component to audit:

[Paste your component code here.]

Evaluate against these criteria:

1. **Token usage** — Does the component use semantic token names (via CSS vars or a theme system), or are there hardcoded hex values, px sizes, or raw font names?
2. **Interactive states** — Are hover, focus, active, and disabled states present? Do they use the correct color roles for each state?
3. **Accessibility** — Correct ARIA role, keyboard interaction model, visible focus indicator, sufficient color contrast?
4. **API design** — Are prop names predictable? Is the component API minimal without being inflexible?

Output a structured audit report:
- Summary verdict (ready to scale / needs work / significant gaps)
- Specific issues, each with a line reference and severity (blocking / recommended / minor)
- Prioritized list of changes to make before using this component as a pattern
