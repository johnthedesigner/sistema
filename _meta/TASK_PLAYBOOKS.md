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
- DESIGN.md format reference: {{sistema_url}}/systems/material/design-md/DESIGN

That page shows the full DESIGN.md format used by a production design system. Read it carefully — pay attention to which sections are present, how specific the values are, and how it describes token usage for components.

Now generate a `DESIGN.md` for my design system using the same format. Here is my project context:

[Describe your product, brand, and any existing design decisions — colors, typefaces, component preferences, etc.]

The output should be a complete, ready-to-commit `DESIGN.md` file. Do not leave placeholder sections — if I have not specified something, make a reasonable default decision and note it as a default so I can review it.

---

## plan-token-architecture — Plan a Token Architecture

**Stage:** 1
**Tags:** tokens, architecture, foundations, planning

You are helping me plan the token architecture for a new design system before writing any actual token values.

Before proposing anything, read the following references from the Sistema knowledge base:
- Token design principles: {{sistema_url}}/systems/material/guidance/foundations/design-tokens
- Color system structure: {{sistema_url}}/systems/material/guidance/foundations/color-system
- Token schema implementation: {{sistema_url}}/systems/material/implementation/tokens/token-schema

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

## generate-primitive-colors — Generate a Primitive Color Palette

**Stage:** 2
**Tags:** tokens, color, primitives

You are helping me generate a primitive color palette — the raw color values that form the foundation of my design system's token architecture.

Before generating anything, read the following references from the Sistema knowledge base:
- Color system overview: {{sistema_url}}/systems/material/guidance/foundations/color-system
- Material's primitive color token values: {{sistema_url}}/systems/material/assets/tokens/colors

Read both before responding. Pay attention to: how many steps the palette has per hue, how neutrals and neutral-variants are structured, and how the JSON is named and organized.

Now generate a primitive color palette for my design system following the same structural approach.

My color direction:
[Provide your primary brand color (hex), any secondary colors, and any preferences — e.g. "warm neutrals", "high contrast", "pastel range".]

Output the palette as JSON in the same format as the Material reference. Include at minimum: primary, secondary, neutral, neutral-variant, error, and their full step range. Do not invent steps — use the same scale density as the reference.

---

## generate-type-scale — Generate a Primitive Type Scale

**Stage:** 2
**Tags:** tokens, typography, primitives

You are helping me generate a typography token set for my design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Typography guidance: {{sistema_url}}/systems/material/guidance/foundations/typography
- Material's typography token values: {{sistema_url}}/systems/material/assets/tokens/typography

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
- Shape guidance: {{sistema_url}}/systems/material/guidance/foundations/shape
- Material's shape token values: {{sistema_url}}/systems/material/assets/tokens/shape

Read both before responding. Pay attention to: the shape scale categories (none, extra-small, small, medium, large, extra-large, full), the values at each step, how components map to shape roles, and the rationale for using a role-based shape system rather than raw values.

Now generate a shape token set for my design system.

My shape direction:
[Describe the visual feel you are going for — e.g. "sharp and minimal", "friendly and rounded", "pill-shaped CTAs but square cards". If you have existing border-radius values in use, list them.]

Output the token set in the same format as the Material reference. Map your values to the standard shape roles so components can consume them by role name, not raw value.

---

## generate-color-roles — Generate Semantic Color Roles

**Stage:** 3
**Tags:** tokens, color, semantic

You are helping me map my primitive color palette to semantic color roles — the named values that components and surfaces will actually consume.

Before generating anything, read the following references from the Sistema knowledge base:
- Color roles guidance: {{sistema_url}}/systems/material/guidance/foundations/color-roles
- Color system overview: {{sistema_url}}/systems/material/guidance/foundations/color-system
- Material's color token values (structural reference): {{sistema_url}}/systems/material/assets/tokens/colors

Read all three before responding. Pay attention to: which semantic roles are defined (primary, on-primary, primary-container, surface, on-surface, etc.), how "on-" roles work, how surface roles are structured, and how light and dark mode variants relate to the same palette.

Now generate a semantic color role mapping for my design system using my primitive palette.

My primitive palette:
[Paste your primitive color token JSON here, or describe your palette — primary hue, secondary hue, neutral tone, and approximate step values.]

Output a complete semantic color role map for light mode. Include the standard surface, primary, secondary, tertiary, error, and neutral roles. Use the same naming conventions as the Material reference so components built against either system share a compatible vocabulary.

---

## generate-dark-mode — Generate Dark Mode Token Values

**Stage:** 3
**Tags:** tokens, color, semantic, dark-mode

You are helping me generate dark mode color token values for my design system.

Before generating anything, read the following references from the Sistema knowledge base:
- Color roles guidance (covers both light and dark mode): {{sistema_url}}/systems/material/guidance/foundations/color-roles
- Color system overview: {{sistema_url}}/systems/material/guidance/foundations/color-system

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
- Token schema implementation: {{sistema_url}}/systems/material/implementation/tokens/token-schema

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
- Color roles (for interactive state colors): {{sistema_url}}/systems/material/guidance/foundations/color-roles
- Shape tokens (for component shape): {{sistema_url}}/systems/material/guidance/foundations/shape
- Typography roles (for text within components): {{sistema_url}}/systems/material/guidance/foundations/typography

Read all three before responding. These define the token vocabulary your spec should reference — do not hardcode values, reference role names.

Now write a component specification for the following component:

Component: [e.g. Button, Text Input, Card, Modal, Chip, Badge]

My design system context:
[List the semantic token names available in your system — color roles, shape roles, typography roles — or paste your token files. The spec should reference these by name.]

The specification should cover:
- Visual variants (e.g. filled, outlined, ghost/text)
- Size variants if applicable
- Interactive states: default, hover, focus, active, disabled
- Token usage for each state (which color role, shape role, type role)
- Accessibility requirements: ARIA role, keyboard interaction, focus indicator
- Any behavior notes: animation, loading state, icon support

Output as a structured markdown document suitable for committing to the repository alongside the component.

---

## implement-component — Implement a Component

**Stage:** 4
**Tags:** components, code, implementation

You are helping me implement a UI component that consumes my design system's token system.

Before generating anything, read the following references from the Sistema knowledge base:
- Implementation overview: {{sistema_url}}/systems/material/implementation/getting-started
- Color token values (for understanding token structure): {{sistema_url}}/systems/material/assets/tokens/colors
- Shape token values: {{sistema_url}}/systems/material/assets/tokens/shape
- Typography token values: {{sistema_url}}/systems/material/assets/tokens/typography

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
- Color system overview: {{sistema_url}}/systems/material/guidance/foundations/color-system
- Color roles guidance: {{sistema_url}}/systems/material/guidance/foundations/color-roles
- Token schema implementation: {{sistema_url}}/systems/material/implementation/tokens/token-schema

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
- Color roles (correct state color usage): {{sistema_url}}/systems/material/guidance/foundations/color-roles
- Shape tokens: {{sistema_url}}/systems/material/guidance/foundations/shape
- Typography roles: {{sistema_url}}/systems/material/guidance/foundations/typography
- Implementation overview: {{sistema_url}}/systems/material/implementation/getting-started

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
