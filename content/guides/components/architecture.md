---
title: "Components"
description: "How to build components on a design system: choosing a foundation, anatomy, states and variants, tokens, accessibility by component family, API and naming, and documentation."
topic: components
sources:
  - { source: wai-aria-apg, url: "https://www.w3.org/WAI/ARIA/apg/patterns/" }
  - { source: base-ui, url: "https://base-ui.com/react/handbook/composition" }
  - { source: radix-primitives, url: "https://www.radix-ui.com/primitives/docs/guides/composition" }
  - { source: react-aria, url: "https://react-spectrum.adobe.com/react-aria/quality.html" }
  - { source: shadcn, url: "https://ui.shadcn.com/docs" }
  - { source: material, url: "https://m3.material.io/components/buttons" }
  - { source: carbon, url: "https://carbondesignsystem.com/components/button/usage/" }
  - { source: primer, url: "https://github.com/primer/design/blob/main/content/components/button.mdx" }
  - { source: wcag, url: "https://www.w3.org/TR/WCAG22/" }
related:
  - guide.tokens.architecture
  - guide.accessibility.floor
  - guide.color.architecture
last_reviewed: 2026-11-21
---

# Components

## Where Sistema stands

- **Build on a foundation,** not from scratch: a component library or the browser's own elements. Accessible behavior is hard to get right, and good libraries already have it.
- **Role tokens only.** No raw values in components (`tokens.usage.no-raw-values`).
- **Every state, every theme.** Each interactive component handles all its states, in light and dark.
- **The keyboard pattern for its kind.** Each component behaves the way people expect that kind of control to behave.
- **Documented.** Each component says when to use it and when not.

Sistema doesn't specify each component. The specify play writes a spec per component, for each project.

## Choosing a foundation

| Kind | Examples | Gives you | Suits |
|---|---|---|---|
| Styled, copied into the repo | shadcn/ui | Working components you own and edit | React with Tailwind; teams that want control of the code |
| Headless | Radix Primitives, Base UI, React Aria, Ark UI | Behavior and accessibility; you add all styling | Custom look, accessible behavior provided |
| Complete libraries | Material UI, Carbon, Fluent | Look and behavior together | Teams adopting that system's look |
| Native elements | `button`, `input`, `select`, `dialog`, `details` | The browser's own behavior | Small sets and simple products |

How to choose:

- **Use what the project already uses,** unless it's failing.
- **Want your own look?** Headless, or styled components you can edit.
- **Want a finished look?** A complete library, accepting its style.
- **Few components?** Native elements go further than people expect. A real `button` is better than any rebuilt one.

Headless libraries differ in how parts take your elements: Radix uses an `asChild` prop ([Radix](https://www.radix-ui.com/primitives/docs/guides/composition)), Base UI a `render` prop ([Base UI](https://base-ui.com/react/handbook/composition)). shadcn/ui ships on either.

## Anatomy

Name a component's parts, so its spec, code, and docs talk about the same things. A text field has a label, an input, a hint, and an error message. A menu has a trigger, a list, items, groups, and separators.

- **Compose parts** rather than pile up props. `<Menu.Trigger>`, `<Menu.Item>` scale better than `<Menu items={…} showIcons hasDividers>`. Radix, Base UI, and React Aria all build this way.
- **Give each part a styling hook,** such as a class or a data attribute, so the project can style it without reaching into internals.
- **Keep layout outside the component.** A button shouldn't set its own outer margin.

Material and Carbon both document anatomy with labelled diagrams; it's a good habit for any spec.

## States and variants

### States

Every interactive component needs a decision for each state it can be in:

| State | Shown by |
|---|---|
| Rest | The default |
| Hover | A small tone change |
| Focus-visible | A clear ring, the same everywhere |
| Pressed | A little more than hover |
| Selected or checked | A fill, a mark, or both |
| Disabled | Reduced contrast; not focusable unless it must explain itself |
| Busy | A spinner or progress, with focus kept |
| Invalid | An error color plus a message |
| Read-only | Looks like content, still focusable |

Draw each state from role tokens (`surface-hover`, `primary-hover`), not from opacity. Check each one is visible on every surface it appears on (`color.states.visible`). React Aria and Base UI expose states as data attributes (`data-hovered`, `data-focus-visible`), which keeps state styling in CSS.

### Variants

Variants are levels of emphasis. Most systems settle on four or five:

| Level | Common names |
|---|---|
| Highest | Primary, filled |
| Medium | Secondary, tonal, outlined |
| Low | Ghost, quiet, text, invisible |
| Destructive | Danger, destructive |

Material, Carbon, and Primer all keep one primary action per area. Primer makes the secondary button its default.

If a variant needs different parts or different behavior, it's a different component. A split button is not a button variant.

## Tokens in components

- **Roles first.** A button reads `primary` and `on-primary`, never a ramp stop.
- **Component tokens only when a component must vary on its own,** such as across brands (see the tokens guide).
- **Radius follows size.** A component's corners come from the radius scale, and nested corners follow their container.
- **One utility per property.** Two utilities for the same property on one element (`p-2 p-3`) resolve by CSS order, not class order (`components.css.one-utility-per-property`).

## Accessibility by component family

The keyboard and screen reader behavior for each family follows the WAI-ARIA Authoring Practices Guide ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/)). Headless libraries implement most of it; check it anyway. Required values, such as target size and contrast, come from the rules.

| Family | Keyboard | Name and state | Focus |
|---|---|---|---|
| Button | Enter and Space activate | A text label, or an accessible name for icon buttons; `aria-pressed` for toggles | Moves into a dialog it opens; returns when it closes |
| Text field | Native typing | A visible label; hint and error linked to the input; invalid state set | Stays put; errors don't move it |
| Checkbox | Space toggles | Checked, unchecked, or mixed | |
| Radio group | Arrows move and select; Tab enters at the selected option | One group label | One tab stop for the group |
| Switch | Space toggles | On or off, with a label that doesn't change | |
| Menu button and menu | Enter, Space, or Down opens; arrows move; Escape closes; typing jumps | Expanded state on the button | Returns to the button on close |
| Listbox and select | Arrows, Home, End; typing jumps | Selected option | |
| Combobox | Typing filters; Down opens; arrows move through options; Enter picks; Escape closes | Expanded state; the active option announced | Stays in the input |
| Dialog | Tab cycles inside; Escape closes | A title as its name | Moves in on open; returns to the trigger on close; the page behind is inert |
| Tabs | Arrows move between tabs; Tab moves into the panel | Selected tab | One tab stop for the tab list |
| Disclosure | Enter or Space toggles | Expanded state | |
| Table | None; it's content | Real table markup, column headers | Use a grid with arrow keys only when cells are interactive |
| Messages and toasts | None | Announced politely without moving focus; urgent errors as alerts | Never stolen. Errors that need action stay inline |
| Tooltip | Shows on hover and focus; Escape hides | Describes its trigger | Never holds interactive content |

Two rules from real builds:

- **Keep focus on busy controls.** Disabling a focused button while its action runs drops focus to the page. Mark it busy and ignore repeat presses instead (`components.busy.keep-focus`).
- **Toasts carry confirmations and undo only** (`components.toast.scope`). A toast with an action doesn't time out.

## API and naming

- **The same names everywhere.** If buttons use `variant` and `size`, so do badges and inputs. Pick `tone` or `intent` for color meaning, and use it consistently.
- **Native props pass through.** A button accepts what a `button` accepts, including `type`, `disabled`, ARIA attributes, and a ref.
- **Controlled and uncontrolled.** Stateful components work with or without the parent owning the state (`open` and `defaultOpen`, `value` and `defaultValue`), as Radix, Base UI, and React Aria do.
- **Few booleans.** Five true-or-false props make 32 combinations, most never tested. Prefer one `variant` prop, or composition.
- **Name by job, not look.** `destructive`, not `red`.

## Documenting a component

Each component's page answers, in this order:

1. **When to use it, and when not** (and what to use instead).
2. **Anatomy:** its parts.
3. **Variants and sizes,** with when to use each.
4. **States,** shown.
5. **Accessibility:** keyboard, labelling, and anything the person using it must provide.
6. **Content:** how to write its labels and messages.

Carbon, Material, and Primer all document components in roughly this shape. Where it lives is the project's choice: Storybook, a page in the app, or the component showcase (`components.docs-site`). Record every change made to a copied library component, in the component's file and in DECISIONS.md, so it can be reapplied after an update.

## Rules

Listed at the end of this page and at `{{sistema_url}}/raw/rules`, including the accessibility, component, token, and craft rules.

## Worked example: Relay

Relay is a dispatch board built on shadcn/ui, with Base UI underneath. It has 12 core components, from button to table.

**The button, end to end:**

- **Anatomy:** the button, an optional icon, the label, and a spinner when busy.
- **Variants:** primary (filled accent), secondary (outlined), ghost (text-colored), and destructive (outlined in red, filling on hover).
- **Sizes:** 28px, the control height, and 24px, the smallest target the project allows.
- **States:** hover from role tokens, not opacity; the shared focus ring; busy keeps focus (`aria-busy`) instead of disabling.
- **Tokens:** `primary`, `primary-hover`, `on-primary`, `border-strong`, `surface-hover`, and the label type role.
- **Changes from the library:** corner radius, hover colors, type role, focus ring, and sizes. Each is listed at the top of `button.tsx` and in DECISIONS.md.
- **Docs:** a Storybook page with every variant and state, and when to use each.

**A recorded exception.** A highlighted destructive menu item fills with the error container color, where Relay's messages keep color to the icon and title. It's written down as a deliberate choice.

## Failure modes

- **Focus rings that don't render.** In Tailwind 4, `outline-none` removes the outline style, so `outline-2` draws nothing without `outline-solid`. Automated checks miss it; look at a screenshot.
- **Disabling a focused control** while it works.
- **Errors in toasts** that disappear before they're read.
- **Two utilities for one property** on the same element.
- **Re-adding a library component** and losing the project's changes.
- **States from opacity,** which change with what's underneath.
- **States that vanish** on some surfaces, such as a hover the same color as its menu.
- **Variant sprawl,** and components that need to know where they sit.
- **A clickable `div`** where a `button` belongs.

## Checking the work

- Contrast for every pair the components create, states included (the color guide's "Pairs to check").
- An accessibility scan (for example axe) in every theme, with each overlay open, after animations finish.
- A keyboard walk-through of each family against the table above.
- Screenshots of focus rings.
- Light and dark side by side.

## Plays

- `components.scaffold-core` builds the core set.
- `components.specify` and `components.implement` add a component.
- `components.audit` checks one.
- `components.page-examples` builds pages from them.
- `components.docs-site` publishes the reference.
