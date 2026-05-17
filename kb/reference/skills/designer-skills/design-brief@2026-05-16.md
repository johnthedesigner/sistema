---
category: skills
topic: design-brief
content_type: reference
status: latest
retrieved: 2026-05-16
source_url: https://github.com/julianoczkowski/designer-skills/tree/main/design-brief
license: Apache 2.0
tags: [design-process, brief, planning, codebase-aware, ai-agents]
---

# designer-skills — /design-brief

## What it is

The `design-brief` skill creates a structured design brief through conversation, codebase exploration, and experience design decisions. Output is saved as a markdown file in the project at `.design/<feature-slug>/DESIGN_BRIEF.md`.

**Key distinction from a generic planning tool:** The skill includes a detailed codebase detection checklist to ensure the brief respects what already exists — preventing the AI from generating a new button when one exists, or inventing a color that clashes with the established palette.

---

## Process

1. **User description** — Ask for what they want to build, who it's for, and any constraints.
2. **Codebase exploration** — Detect and catalogue existing CSS variables/tokens, Tailwind config, UI framework themes, component directories, Storybook, design token files, font loading, and existing pages/layouts.
3. **Structured interview** — Walk through every design decision until shared understanding is reached, providing recommended answers for each question. Covers: primary user + JTBD, success definition, emotional tone, reference products, hard constraints, and content.
4. **Brief output** — Write the structured brief using the required template.

---

## Codebase detection checklist

The skill scans for:
- CSS variables / tokens: `tokens.css`, `variables.css`, `theme.css`, or `:root` declarations
- Tailwind config: `tailwind.config.js` / `.ts`, check `theme.extend` for custom values
- UI framework themes: Material UI `createTheme`, Chakra `extendTheme`, shadcn `globals.css`
- Component directories: `components/`, `ui/`, `shared/`
- Storybook: `.storybook/` directory or `*.stories.*` files
- Design token files: JSON token files (Style Dictionary, Figma token exports)
- Package.json UI dependencies
- Font loading: Google Fonts links, `@font-face` declarations
- Existing pages/layouts: route files, layout components, page templates

---

## Brief template sections

The required brief output includes: Problem, Solution, Experience Principles (max 3), Aesthetic Direction (philosophy + tone + references + anti-references), Existing Patterns, Component Inventory, Key Interactions, Responsive Behavior, Accessibility Requirements, and Out of Scope.

---

## File output

Saved to `.design/<feature-slug>/DESIGN_BRIEF.md`. All subsequent skills in the flow read from this same subfolder.
