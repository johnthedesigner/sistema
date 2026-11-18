---
system: radix
category: design-systems
topic: design-tokens
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://www.radix-ui.com/themes/docs/theme/overview
tags: [design-tokens, theme, variants, css-variables, radix]
---

# Design Tokens

**Source:** `radix-ui.com/themes/docs/theme/overview`

Radix Themes uses a **config-first** token model. The visual theme is not defined by manually specifying a token set — it is generated from a small set of high-level props on the `<Theme>` wrapper component. All generated values are CSS custom properties, accessible and overrideable.

---

## Theme component — the configuration surface

The `<Theme>` component is where all theming configuration is expressed. It wraps your application at the root level:

```jsx
<Theme
  accentColor="mint"
  grayColor="gray"
  panelBackground="solid"
  scaling="100%"
  radius="full"
>
  <MyApp />
</Theme>
```

### Theme props

| Prop | Values | Effect |
|---|---|---|
| `accentColor` | 27 color names (indigo, crimson, teal, etc.) | Primary interactive color — buttons, links, focus rings |
| `grayColor` | gray, mauve, slate, sage, olive, sand | Neutral color scale — auto-paired with accent by default |
| `radius` | none, small, medium, large, full | Border-radius scale for all components |
| `panelBackground` | solid, translucent | Whether panelled elements (cards, popovers) use solid or translucent backgrounds |
| `scaling` | 90%, 95%, 100%, 105%, 110% | Uniform scaling of component sizes |
| `appearance` | light, dark, inherit | Color scheme override |

Changing any prop automatically updates every component in the tree — no per-component overrides needed for consistent theming.

---

## How the token system works

When `<Theme>` renders, it applies a set of CSS custom properties to the `.radix-themes` class on the root element. These properties define the full visual vocabulary of the theme. All components consume these variables — they never use hardcoded values.

**Token categories and source files:**

| Category | Tokens | Source |
|---|---|---|
| Color | `--accent-*`, `--gray-*`, `--color-*` | `tokens/color.css` |
| Typography | `--default-font-family`, `--heading-*`, `--font-weight-*` | `tokens/typography.css` |
| Spacing | `--space-*` (1–9 scale) | `tokens/spacing.css` |
| Radius | `--radius-*` (1–6 scale) | `tokens/radius.css` |
| Shadows | `--shadow-*` | `tokens/shadows.css` |

Full token source: `github.com/radix-ui/themes/tree/main/packages/radix-ui-themes/src/styles/tokens`

---

## Variant system

All Radix Themes components share a consistent variant vocabulary. Not every component supports every variant, but where variants exist, they behave consistently across the library:

| Variant | Appearance |
|---|---|
| `classic` | Rendered with a skeuomorphic or elevated treatment — most visually prominent |
| `solid` | Solid accent-color fill — high emphasis |
| `soft` | Tinted, low-contrast background using accent-2/3 — subtle |
| `surface` | White/panel background with accent border — neutral emphasis |
| `outline` | Transparent background with accent border |
| `ghost` | No background or border — lowest emphasis |

Example — Button:

```jsx
<Button variant="solid">Save</Button>
<Button variant="soft">Cancel</Button>
<Button variant="outline">Learn more</Button>
<Button variant="ghost">Dismiss</Button>
```

This cross-component consistency means a designer can define a hierarchy once (e.g. "primary = solid, secondary = soft, tertiary = ghost") and apply it uniformly across all component types.

---

## Dark mode

Dark mode is enabled via the `appearance` prop on `<Theme>` or by adding the `dark` class to the root element:

```jsx
<Theme appearance="dark">
  <MyApp />
</Theme>
```

All Radix Colors scales include dark mode variants — no separate token set or theme file required. The token CSS automatically switches values when the `dark` class is present.

For runtime toggling, use the `class` strategy:

```js
document.documentElement.classList.toggle('dark')
```

---

## ThemePanel — live preview

`ThemePanel` is a drop-in component that renders a real-time theme editor panel in your app. Useful for exploring the effect of each `<Theme>` prop without editing code:

```jsx
import { Theme, ThemePanel } from "@radix-ui/themes";

<Theme>
  <MyApp />
  <ThemePanel />
</Theme>
```

---

## Nested themes

`<Theme>` components can be nested to apply a different accent or appearance to a subtree:

```jsx
<Theme accentColor="indigo">
  <MainApp />
  <Theme accentColor="crimson">
    <DangerZone />  {/* uses crimson accent */}
  </Theme>
</Theme>
```

Nested themes inherit all parent props except those explicitly overridden.

---

## Custom component theming

To apply theme tokens to custom components, use the CSS variables directly:

```css
.my-custom-button {
  background-color: var(--accent-9);
  color: var(--accent-contrast);
  border-radius: var(--radius-2);
  padding: var(--space-2) var(--space-4);
}

.my-custom-button:hover {
  background-color: var(--accent-10);
}
```

Custom CSS must be loaded after `@radix-ui/themes/styles.css` to take precedence.
