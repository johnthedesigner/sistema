---
system: radix
category: design-systems
topic: color-system
content_type: guidance
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://www.radix-ui.com/themes/docs/theme/color
tags: [color, tokens, css-variables, radix]
---

# Color System

**Source:** `radix-ui.com/themes/docs/theme/color`

Radix Themes uses a two-axis color model: every theme has an **accent color** (primary interactive color) and a **gray color** (neutral). Both are drawn from the Radix Colors palette — a set of perceptually designed, WCAG-accessible 12-step scales.

---

## Accent color

The accent color is used for primary buttons, links, and interactive elements. It is set on the `<Theme>` component:

```jsx
<Theme accentColor="indigo">
  <MyApp />
</Theme>
```

**Available accent colors (27 options):**
Gray, Gold, Bronze, Brown, Yellow, Amber, Orange, Tomato, Red, Ruby, Crimson, Pink, Plum, Purple, Violet, Iris, Indigo, Blue, Cyan, Teal, Jade, Green, Grass, Lime, Mint, Sky

Each accent color has a light mode, dark mode, and alpha variant set built in — no additional configuration required.

### Accent scale anatomy

Each color is a 12-step scale. Step ranges have defined semantic roles:

| Steps | Semantic usage |
|---|---|
| 1–2 | Backgrounds |
| 3–5 | Interactive component backgrounds (hover, active states) |
| 6–8 | Borders and separators |
| 9–10 | Solid fill colors (buttons, badges, indicators) |
| 11–12 | Accessible text on backgrounds |

### Accent CSS variable tokens

```css
/* Backgrounds */
var(--accent-1);
var(--accent-2);

/* Interactive components */
var(--accent-3);
var(--accent-4);
var(--accent-5);

/* Borders and separators */
var(--accent-6);
var(--accent-7);
var(--accent-8);

/* Solid colors */
var(--accent-9);
var(--accent-10);

/* Accessible text */
var(--accent-11);
var(--accent-12);

/* Functional tokens */
var(--accent-surface);    /* translucent panel surface in accent color */
var(--accent-indicator);  /* progress/slider fill */
var(--accent-track);      /* progress/slider track */
var(--accent-contrast);   /* foreground on solid accent-9 backgrounds */
```

---

## Gray color

A complementary gray scale is automatically paired with your accent color. You can also specify it directly:

```jsx
<Theme grayColor="mauve">
  <MyApp />
</Theme>
```

**Available gray colors (6 options):**

| Gray | Best paired with |
|---|---|
| Gray | Pure neutral — any accent |
| Mauve | Purple, violet, pink hues |
| Slate | Blue, indigo, iris hues |
| Sage | Teal, cyan, green hues |
| Olive | Grass, lime, green hues |
| Sand | Yellow, amber, orange hues |

The subtle tint in mauve/slate/sage/olive/sand grays harmonizes with their corresponding accent hues. The difference is most visible in dense UIs with a lot of text.

### Gray CSS variable tokens

```css
var(--gray-1) through var(--gray-12);  /* same step semantics as accent */
var(--gray-surface);
var(--gray-indicator);
var(--gray-track);
var(--gray-contrast);
```

---

## Color overrides and inheritance

The `color` prop on most components overrides the theme accent for that component. Nested components inherit the new accent automatically:

```jsx
<Callout.Root color="red">
  {/* button inside inherits red accent */}
  <Button>Dismiss</Button>
</Callout.Root>
```

### `highContrast` prop

Components with a `color` prop typically also accept `highContrast`, which produces a darker, higher-contrast appearance suitable for standing out against page backgrounds:

```jsx
<Button color="gray" highContrast>Edit profile</Button>
```

---

## Alpha colors

Every color step has an alpha (transparent) variant, designed to look visually identical to the solid variant when placed over the standard page background. Alpha colors enable natural-looking overlays on any surface:

```css
var(--red-1)   → var(--red-a1)   /* solid → alpha */
var(--red-12)  → var(--red-a12)
```

Alpha colors are used internally by Radix Themes components for surface backgrounds and overlay effects — no configuration needed.

---

## Background and surface tokens

These semantic tokens define the visual hierarchy of layered surfaces:

```css
var(--color-background);          /* page background */
var(--color-panel-solid);         /* cards, tables, popovers, dropdowns */
var(--color-panel-translucent);   /* same, but translucent — default for panels */
var(--color-surface);             /* form inputs, checkboxes, selects */
var(--color-overlay);             /* dialog/modal overlays */
```

The `panelBackground` prop on `<Theme>` controls whether panels use the solid or translucent variant:

```jsx
<Theme panelBackground="solid">      {/* unobstructed, opaque panels */}
<Theme panelBackground="translucent"> {/* subtle overlay effect, default */}
```

---

## Focus and selection colors

Focus ring and text selection colors are automatically adjusted to match the accent color of the nearest component — no manual token management needed. The focus scale tokens (`--focus-1` through `--focus-12`) follow the same step semantics as accent/gray. Most components use `--focus-8` for the focus outline.

---

## Customization

### Override a specific scale step (brand color)

To map a brand color to a scale, override step 9 (the solid color anchor):

```css
.radix-themes {
  --my-brand-color: #3052f6;
  --indigo-9: var(--my-brand-color);
  --indigo-a9: var(--my-brand-color);
}
```

### Color aliasing

Remap scale names to use generic color names:

```css
.radix-themes {
  --red-1: var(--ruby-1);
  /* ...through --red-12, --red-a1 through --red-a12 */
  --red-surface: var(--ruby-surface);
  --red-indicator: var(--ruby-indicator);
  --red-track: var(--ruby-track);
  --red-contrast: var(--ruby-contrast);
}
```

### Custom palette generation

The Radix Colors custom palette tool (`radix-ui.com/colors/custom`) generates a full 12-step scale from a pair of reference colors. The generated CSS can be dropped in as a color override.

### Individual color CSS file imports

To reduce CSS bundle size, import only the colors you use:

```ts
import "@radix-ui/themes/tokens/base.css";
import "@radix-ui/themes/tokens/colors/ruby.css";
import "@radix-ui/themes/tokens/colors/teal.css";
import "@radix-ui/themes/tokens/colors/slate.css";
import "@radix-ui/themes/components.css";
import "@radix-ui/themes/utilities.css";
```
