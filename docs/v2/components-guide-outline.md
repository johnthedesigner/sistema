# V3.6 outline: components guide

**Status:** for owner review (2026-11-21).

**Scope (D19):** how to build components on the system. No spec for each component; `components.specify` writes those per project.

**Written to:** `docs/v2/content-principles.md`. Short, general, claims labelled by strength, Relay only in the worked example.

**Guide:** `guide.components.architecture`, titled "Components". Same structure as the other rewritten guides.

## Sections

1. **Where Sistema stands.**
   - Components sit on a foundation (a headless library or native elements).
   - They use role tokens only, cover every state, follow the keyboard pattern for their kind, and are documented.
   - The project's library choice is respected.

2. **Choosing a foundation.** Options and how to choose:

   | Kind | Examples | Suits |
   |---|---|---|
   | Styled components copied into the repo | shadcn/ui | React with Tailwind; teams that want to own the code |
   | Headless primitives | Radix Primitives, Base UI, React Aria, Ark UI | Full control over styling; accessible behavior provided |
   | Complete libraries | Material UI, Carbon, Fluent | Teams adopting a system's look and behavior together |
   | Native elements | `button`, `input`, `dialog`, `details` | Small sets; simple products |

3. **Anatomy.** Parts and slots, composition (compound components) instead of long prop lists, and where styling hooks live. Credit: Radix parts, and the anatomy sections in Material and Carbon.

4. **States and variants.**
   - The states every interactive component needs: rest, hover, focus-visible, pressed, selected, disabled, busy, invalid, read-only.
   - Variants as levels of emphasis (primary, secondary, quiet, destructive).
   - When a variant should become its own component instead.
   - Credit: button hierarchies in Material, Carbon, and Primer.

5. **Tokens in components.**
   - Roles first.
   - Component tokens only when a component must vary on its own (links the tokens guide).
   - States drawn from roles, not opacity.
   - Nested radius.

6. **Accessibility by component family.** One table, with each family's keyboard pattern, name and state, and focus handling:
   - buttons;
   - text inputs;
   - checkboxes, radios and switches;
   - menus, listboxes and comboboxes;
   - dialogs and other overlays;
   - tabs and disclosure;
   - tables;
   - messages and toasts;
   - tooltips.

   Sources: the WAI-ARIA Authoring Practices Guide, plus the rules registry for required values.

7. **API and naming.**
   - Consistent prop names across components (`variant`, `size`, `tone`).
   - Controlled and uncontrolled use.
   - Composition over configuration.
   - Passing through native props and refs.
   - Avoiding a pile of boolean props.

   Credit: Radix, Base UI, Primer, shadcn/ui.

8. **Documenting a component.**
   - What each component's page should hold: when to use it and when not, anatomy, variants, states, accessibility notes, content guidance.
   - Where documentation lives: the showcase, Storybook, or a page in the app.

   Credit: the documentation structure in Carbon, Material, and Primer.

9. **Rules.** `accessibility.*`, `components.*`, `tokens.usage.no-raw-values`, and the craft rules.

10. **Worked example: Relay.**
    - 12 components built on shadcn/ui with Base UI underneath.
    - Every change to the generated components recorded so it can be reapplied.
    - One component traced end to end (the button: anatomy, variants, states, tokens, keyboard, documentation).
    - The documented exception for the highlighted destructive menu item.

11. **Failure modes:**
    - **Tailwind 4 focus rings:** `outline-none` hides the ring unless `outline-solid` is added, and automated checks miss it.
    - **Busy controls:** disabling a focused control while it works drops focus.
    - **Toasts:** errors or timed-out actions in toasts.
    - **Conflicting utilities:** two utilities for the same property on one element.
    - **Overwritten edits:** re-adding a library component overwrites the project's changes.
    - **Opacity states:** states made from opacity.
    - **Invisible states:** states that vanish on some surfaces.
    - **Too many variants,** and components that need to know where they sit.

12. **Checking the work:**
    - the pairs to check, including states;
    - an accessibility scan with each overlay open;
    - a keyboard walk-through;
    - screenshots of focus rings;
    - light and dark side by side.

13. **Plays:** scaffold the core set, specify, implement, audit, page examples, publish the reference.

## Sources to bring in first

Bringing these in follows the standard intake process before drafting:

| Source | Why | Likely tier |
|---|---|---|
| WAI-ARIA Authoring Practices Guide (W3C) | Keyboard and ARIA patterns per component family | 1 (W3C Document License) |
| Base UI documentation | Headless foundation; anatomy and API conventions | 1 or 2 (check licence) |
| React Aria documentation | Headless foundation; accessibility behavior | 1 or 2 (check licence) |
| Radix Primitives documentation | Parts model and API conventions | 1 or 2 (check licence) |

Already on file: Material, Carbon, and Primer component pages (button, dialog, text field), and shadcn/ui.

## Also

- **Specimens:** none needed; components are shown through the worked example's screenshots, or not at all.
- **Plays:** the component plays get the same content pass, where the guide changes what they should cite.
