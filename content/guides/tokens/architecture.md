---
title: "Token architecture"
description: "Token tiers, naming, dark mode and other modes at the token level, common failure modes, and how to decide the structure."
topic: tokens
sources:
  - { source: material, url: "https://m3.material.io/foundations/design-tokens" }
  - { source: atlassian, url: "https://atlassian.design/tokens/design-tokens" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/overview" }
  - { source: ant-design, url: "https://ant.design/docs/react/customize-theme" }
  - { source: atlassian, url: "https://atlassian.design/get-started" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/spacing" }
  - { source: tailwind, url: "https://tailwindcss.com/docs/theme" }
last_reviewed: 2026-05-13
---

# Token architecture

## Overview

A design token system is a contract. It gives you one place where design decisions live and a stable public API for consuming those decisions across components, themes, and platforms. When the contract is well-designed, changing a primary color means editing one value; when it isn't, it means hunting through component files.

This document covers how to structure that contract so it stays useful as the system grows.

---

## The tier model

Almost every mature design system organizes tokens into tiers. The tier model exists because different types of values change at different rates and for different reasons.

### Tier 1 — Primitives (the palette)

Raw values with no semantic meaning. Every hex color the system will ever use. Every spacing value. These are named for what they are, not what they do.

Examples: `color-blue-500`, `space-4`, `radius-4`

**Why this tier exists:** You need a bounded palette before you can make semantic decisions. Primitives also give you a place to put values that serve multiple roles — the same blue might be used for primary actions in one context and informational text in another. Without a primitive tier, you'd have to duplicate the value or hardcode it.

**Who uses them:** Only the semantic layer uses primitives directly. Components never reference primitives.

### Tier 2 — Semantic tokens (the decisions)

Role-based names that map onto primitives. These encode the actual design decisions: what color is used for primary actions, what size is body text, what radius is an interactive element.

Examples: `color-action-primary`, `color-text-default`, `space-component-padding`, `radius-interactive`

**Why this tier exists:** Semantic tokens are the stable API. When a component says `background: var(--color-surface-raised)`, that component survives any palette change as long as the semantic assignment stays valid. Semantic names communicate intent — a developer reading `color-text-disabled` knows immediately what it does, whereas `color-gray-300` requires contextual knowledge.

**Who uses them:** Components consume semantic tokens exclusively. Never primitives.

### Tier 3 — Component tokens (scoped overrides)

Per-component aliases or overrides that let you adjust a single component's appearance without affecting anything else. They reference semantic tokens by default; you override only what deviates.

Examples: `button-background`, `card-border-radius`, `input-focus-ring-color`

**Why this tier exists:** Sometimes a component needs a value that is specific to it and shouldn't be a system-wide decision. A dialog's overlay opacity is a component-level concern. A card's internal padding isn't the same concept as the global spacing scale. Component tokens give you a named slot for these without adding noise to the semantic tier.

**When the overhead is NOT justified:** Most small-to-medium systems don't need component tokens at first. Add this tier only when you have multiple themes that need different appearances for specific components, or when you're building a library others will theme. If a component can be configured entirely through semantic tokens, skip the component tier.

---

## What every system needs

Before making architectural decisions, know the required categories. Every robust token system covers these four:

| Category | What it covers | Non-negotiable minimum |
|---|---|---|
| Color | Surfaces, text, borders, interactive states, feedback states | Semantic roles with accessible pairings; both light and dark values |
| Typography | Font families, sizes, weights, line heights | Role-based scale (not just sizes); line height as a token, not inline |
| Spacing | Component padding, layout gaps, inset values | A consistent base unit (4px or 8px); avoid arbitrary values outside the scale |
| Shape | Border radius | At least three roles: sharp, moderate, full-round |

Optional categories that mature systems add:

| Category | Add when… |
|---|---|
| Motion | You have enough animated components to warrant consistency |
| Elevation / depth | You have multiple surface layers (modals, drawers, tooltips) |
| Z-index | You have enough layering complexity to cause stacking conflicts |

Don't define optional categories as empty tokens. Add them when you have real decisions to encode.

---

## Naming principles

### Name for role, not value

`--color-text-secondary` is durable. `--color-gray-500` is not.

The first survives a rebrand; the second doesn't. More importantly, the first communicates intent — any developer reading it knows it's for secondary text. The second requires knowledge of where gray-500 is used in the system.

The failure mode is inconsistency: mixing `--color-primary` (semantic) with `--color-blue-500` (descriptive) in the same system. Choose one convention and apply it throughout.

### Use a consistent structure

Pick a naming structure and hold to it. Two approaches work well:

**Category-role-modifier:** `color-text-primary`, `color-text-secondary`, `color-text-disabled`
**Category-role-property-state:** `color-button-background-hover`, `color-button-background-disabled`

The second approach is better for component tokens; the first is better for semantic tokens. Don't mix structures within a tier.

### Communicate the pairing

Color tokens work in pairs — a surface color and the text/icon color that sits on it. Make this relationship visible in the name:

```
color-surface-brand      ← the surface
color-on-surface-brand   ← text/icons that sit on that surface
```

or

```
color-background-primary
color-foreground-primary
```

The exact convention doesn't matter. What matters is that a developer can look at a surface token and know its paired text token without having to look it up.

### Avoid encoding values in names

`--radius-4` tells you the value. `--radius-interactive` tells you the role. When you need to change the value, `--radius-4` has become a lie; `--radius-interactive` still means what it says.

---

## Dark mode at the token level

Dark mode is not a separate visual design — it is a different context for the same semantic decisions. The goal is to swap contexts without touching components.

Three approaches, each with real tradeoffs:

### Approach 1 — CSS variable overrides via attribute

```css
:root {
  --color-surface-default: #ffffff;
  --color-text-primary: #1a1a1a;
}

[data-theme="dark"] {
  --color-surface-default: #1a1a1a;
  --color-text-primary: #f0f0f0;
}
```

**Use when:** You need runtime theme switching without a page reload. The `data-theme` attribute toggles in JavaScript. This is the most common approach for web apps where users can choose their theme.

**Tradeoff:** All variables must be defined in both contexts. You accumulate technical debt if the dark values are poorly maintained alongside light values.

### Approach 2 — `prefers-color-scheme` media query

```css
:root {
  --color-surface-default: #ffffff;
  --color-text-primary: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface-default: #1a1a1a;
    --color-text-primary: #f0f0f0;
  }
}
```

**Use when:** You want OS-level automatic theming and don't need a runtime override. Simplest to implement.

**Tradeoff:** No JavaScript required, but no user override without additional logic. Combine with a class-based approach if you need both.

### Approach 3 — Separate theme files

Two complete CSS files (`light.css`, `dark.css`), each defining the full token set, loaded via a `<link>` swap.

**Use when:** You have a very large token set where a single file with both contexts becomes unwieldy; or you're building a design system package that other teams consume.

**Tradeoff:** File-load latency on theme switch. Requires infrastructure to swap the stylesheet link. Overkill for most products.

### What not to do

Do not create dark-mode-specific token names (`--color-surface-dark`). Dark mode is a context for existing tokens, not a parallel naming scheme. If you find yourself writing `color: var(--color-text-dark)`, you've given up the semantic contract — components now need to know what theme is active.

---

## Modes: theme, density, and motion

A *mode* is a set of token values that replaces some of the defaults while it's active, without changing components. Dark theme is the familiar one, but it isn't the only one. Design systems commonly treat three kinds separately:

| Kind | Typical modes | Changes | Examples |
|---|---|---|---|
| Theme | light, dark, sometimes high contrast | Color roles | Radix Themes' `appearance`, Atlassian's `colorMode`, Ant Design's dark algorithm |
| Density | comfortable, compact | Spacing inside components, control heights, sometimes type sizes | Radix Themes' `scaling`, Ant Design's compact algorithm |
| Motion | standard, reduced | Durations and easing | The operating system's reduced-motion setting, read through the `prefers-reduced-motion` media query |

### Keep the kinds independent

Each kind is switched separately, and they combine: a page can be dark, compact, and reduced-motion at once. Ant Design makes the same point by letting its dark and compact algorithms be applied together. Two practices keep combinations safe:
- **Each token belongs to one kind.** Color tokens change only with theme, spacing tokens only with density, and duration tokens only with motion. Then no two modes compete for the same value.
- **A mode only replaces tokens that already exist.** It never adds new ones. Components keep using the same role tokens in every mode, so adding a mode needs no component changes. A component that breaks in a mode was using a raw value.

### How modes are stored and switched

Store each mode's values as a file holding only what changes, beside the defaults, such as `color.dark.json`, `spacing.compact.json`, and `motion.reduced.json`. Compile each to a selector:

```css
[data-theme="dark"] { /* changed color roles */ }
[data-density="compact"] { /* changed spacing and control heights */ }
@media (prefers-reduced-motion: reduce) { :root { /* changed durations */ } }
```

Theme usually also follows the operating system setting (see the approaches above). Reduced motion should always follow it, with an optional in-app switch as well. Density is a product choice, and it can apply to part of a page: a compact table inside a comfortable layout.

### Density: remap or scale

There are two ways to make a compact mode, and both are common:
- **Remap chosen tokens:** compact sets new values for specific spacing steps and control heights. This gives the most control, and dense data tables usually need it.
- **Scale everything:** compact changes one base value, and everything derived from it shrinks together. Radix Themes does this with `scaling`. In Tailwind, it means changing `--spacing`. It's simpler but blunter.

Either way, compact controls must still meet the project's minimum target size, and body text keeps its required line height. The spacing guide's "Density axis" covers how much to tighten.

## Dark mode values: the tonal shift problem

Naive dark mode inverts lightness values and produces visual chaos. Dark mode requires intentionally designed values, not math.

Key insights:
- Dark surfaces are not black. True-black backgrounds create harsh contrast and make elevated surfaces invisible. Use deep neutrals (e.g. L\* 8–12) for the lowest surface tier.
- Dark mode contrast requirements differ from light mode. The same contrast ratio at dark means different absolute values — text that passed AA on white may not pass on a deep neutral.
- Color saturation needs reduction in dark mode. Fully saturated colors appear to glow on dark surfaces. Reduce chroma while preserving hue.
- Elevation is harder. In light mode, a slightly darker surface looks elevated. In dark mode, the pattern reverses — elevated surfaces are lighter than the base. Token values for surface layers must be designed for this explicitly.

---

## Common failure modes

**Too many tiers.** Three tiers (primitive → semantic → component) is sufficient for almost all systems. Adding a fourth for "sub-components" or "variants" creates maintenance overhead that grows faster than the value. Simplify.

**Over-scoped component tokens.** If every style property of every component has a token, you have a stylesheet disguised as a token system. Component tokens should cover values that meaningfully vary across themes or brands, not every `padding` and `margin`.

**Names that describe values, not roles.** `--color-blue`, `--space-16`, `--radius-4` — these are primitives masquerading as semantic tokens. Any component using these is coupled to the specific value. When the value changes (it will), the name becomes wrong.

**Missing pairings.** Defining background colors without their foreground counterparts forces developers to make accessibility judgments inline. Always define background and foreground as a pair.

**Skipping the semantic tier.** Small systems sometimes go directly from primitives to components. This works until you add dark mode, a second brand, or a dense layout option — at which point every component needs touching. The semantic tier is cheap to add early and expensive to retrofit later.

**Inconsistent namespaces.** Mixing `--color-*` with `--ds-color-*` and `--brand-*` in the same system creates confusion about authority. Pick a namespace prefix and own it.

---

## Decision framework

**Starting a new system:**
1. Define the semantic tier first. What roles does the product need? What surface + text pairs? What interactive state names?
2. Define primitives only as needed to back the semantic tier. Don't spec the full palette before you know what roles you need.
3. Skip component tokens until you have a working semantic tier and at least 5–6 components. The patterns you need will emerge.

**Adding dark mode:**
1. Use `[data-theme]` overrides if you need runtime switching; `prefers-color-scheme` if you don't.
2. Design dark values explicitly — don't derive them from light values.
3. Verify contrast separately for dark mode. Don't assume light-mode AA values pass in the dark context.

**Deciding whether to add component tokens:**
- Would a consumer of this system need to restyle this component independently of the semantic tier? → Add component tokens.
- Is this value already expressible through one or two semantic tokens? → Don't add component tokens.

**Naming a new token:**
1. What role does this value serve? Name it for the role.
2. Is there already a token that serves this role? Use it rather than creating a near-duplicate.
3. Does this token have a natural pair (surface ↔ foreground)? Define both.
