---
title: "Color"
description: "How Sistema builds color: ramps from the palette tool, the roles every system needs, how much color and which accent, grays, dark themes, states, and the pairs to check."
topic: color
sources:
  - { source: material, url: "https://m3.material.io/styles/color/system/how-the-system-works" }
  - { source: material, url: "https://m3.material.io/styles/color/roles" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/color" }
  - { source: carbon, url: "https://carbondesignsystem.com/elements/color/overview/" }
  - { source: ant-design, url: "https://ant.design/docs/spec/colors" }
  - { source: polaris, url: "https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs" }
  - { source: fluent, url: "https://fluent2.microsoft.design/elevation" }
  - { source: stripe-color, url: "https://stripe.com/blog/accessible-color-systems" }
  - { source: oklab, url: "https://bottosson.github.io/posts/oklab/" }
  - { source: material-color-science, url: "https://material.io/blog/science-of-color-design" }
  - { source: wcag, url: "https://www.w3.org/TR/WCAG22/" }
  - { source: apca, url: "https://git.apcacontrast.com/documentation/APCAeasyIntro" }
related:
  - guide.color.palette-generation
  - guide.visual-language.overview
  - guide.tokens.architecture
last_reviewed: 2026-11-20
---

# Color

## Where Sistema stands

Color is built in three layers, and each is checked:

1. **Ramps.** Every color comes from a 19-stop ramp made by the palette tool (`color.ramps.from-tool`).
2. **Roles.** Components use roles such as `surface`, `on-surface`, and `primary`, never ramp stops. Each role points to a stop. Light and dark are two sets of pointers.
3. **Pairs.** Wherever one color sits on another and carries meaning, the pair is checked with the contrast tool, in every theme.

How much color and which hues are the person's choice.

```specimen
ramp #7B43E6 #72707A
An accent ramp and a gray ramp tinted toward it, from stop 50 to 950.
```

## Why ramps

Hand-picked colors run out. The first time the product needs a hover for a red button, a selected row, or a dark theme, someone picks one more, and the palette drifts. A full ramp already has the value.

Ramps from the palette tool also mean the same thing in every hue. Stops are placed by contrast against white, so stop 600 of blue and stop 600 of green have nearly the same contrast. A role that works in one hue works in another. This follows Stripe's approach to accessible color ([Stripe](https://stripe.com/blog/accessible-color-systems)).

### How ramps feed the semantic layer

Each role points to a stop. Typical light-theme starting points:

| Role | Stop |
|---|---|
| `primary` | accent, about 550 to 600 |
| `primary-container` | accent, about 150 |
| `surface` (the page) | gray 50 |
| `surface-raised` (panels) | white |
| `on-surface` | gray 850 |
| `on-surface-muted` | gray 550 to 600 |
| `border` | gray 200 to 250 |
| `border-strong` (control edges) | gray 450 to 500 |

The pairs to check decide the final stops.

## What every color system requires

- **A text color for every background,** defined and checked as a pair (the `on-*` roles).
- **The required roles** (`color.roles.required`): primary, secondary, the surfaces (page, raised, overlay), text in a few tones, borders, focus, feedback colors, hover and selected surfaces, a hover for every filled button, and the emphasis surfaces below.
- **Light and dark designed together** (`opinion.both-themes`).
- **No raw colors in components** (`tokens.usage.no-raw-values`).
- **Feedback colors kept for meaning.** Red, amber, green, and blue signal status; don't use them for decoration.

### Emphasis surfaces

Beside the ordinary surfaces, every system has four roles for emphasis:

| Role | Light, typically | Dark, typically |
|---|---|---|
| `surface-subtle` | The page tone, used inside a panel | The same |
| `surface-featured` | The panel color, with a stronger shadow | One step lighter than panels |
| `surface-inverse` | Near-black with light text | Near-white with dark text |
| `surface-brand` | A deep accent stop with light text | The same, or a step lighter |

- **Ordinary levels take small steps:** neighboring stops near white, or near black in dark themes.
- **Emphasis takes big steps,** so inverse and brand surfaces read as blocks.
- **States must be visible where they're used.** Hover and selected fills sit at least one full stop from every surface they appear on (`color.states.visible`). White counts as the step before 50.
- **Containers fill small marks** such as chips and badges.

Polaris and Material have similar brand, inverse, and container roles ([Polaris tokens](https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs), [Material](https://m3.material.io/styles/color/roles)).

## How much color

How far the accent reaches is a taste question (see the visual-language guide). Each answer sets how colorful surfaces and grays may be. Numbers are OKLCH chroma, as the palette tool reports it, and are starting guidance.

| Answer | Accent appears on | Surfaces and grays | Accent |
|---|---|---|---|
| Quiet | The main action, selection, focus, links | Up to about 0.015 | About 0.08 to 0.16 |
| Brand | Also where you are, such as the current page | About 0.01 to 0.03 | About 0.12 to 0.20 |
| Tinted | Large areas, such as the navigation or page | About 0.03 to 0.06 | About 0.15 to 0.25 |

Color as the dominant element, with saturated backgrounds, suits some brand and marketing pages. It needs every pair checked by hand.

### Choosing the accent

- Use the brand color if there is one.
- Otherwise, choose from Sistema's palette library, `{{sistema_url}}/palettes/library.json`. Its palettes are hand-picked hues chosen to look good. Show two or three.
- Avoid the category's obvious color (blue for finance, green for health) unless there's a reason.
- Keep the accent apart from status colors when status matters.

```specimen
ramp #DE3B35 #7B43E6 #255FE0
Three palettes from the library.
```

## Neutral palette design

The grays set every surface, border, and secondary text color.

- **Cool** grays read crisp; **warm** grays softer.
- **Tinted toward the accent** ties the interface together. Radix pairs each accent with a matching gray for this reason ([Radix](https://www.radix-ui.com/themes/docs/theme/color)).
- **Nearly neutral** is the quietest. Keep a trace of temperature; fully neutral gray reads clinical (`quality.color.bans`).

The page should be off-white or off-black. White panels on an off-white page are fine.

## The decision framework

Systems organize color in four ways, often combined:

| Model | How it works | Used by | Suits |
|---|---|---|---|
| Tonal palettes | Key colors generate tones; roles take tones | Material | Themes generated from one color |
| Step scales | Each color has fixed steps with set jobs | Radix | Libraries where users pick an accent |
| Named palettes | Named hues, each a scale, mapped to roles | Ant Design, Carbon, Tailwind | Explicit brand control, several brands |
| Layered tokens | Surfaces named by layer; components read their layer | Carbon | Many stacked panels |

Sistema's default is generated ramps under named roles. Add layer roles for heavily stacked interfaces. For several brands, keep the roles and swap the ramps.

## Dark mode: the tonal shift

Dark mode is not an inversion. Inverting gives harsh contrast and colors that glow. Material pairs each light tone with a mirrored dark tone ([Material](https://m3.material.io/styles/color/system/how-the-system-works)). Sistema does the same on its ramps, with one difference for surfaces.

Each treatment is decided once for both themes. Only the stops change (`opinion.both-themes`).

### Stops in a dark theme

- **Text and fills mirror.** Stop *n* on a light page has nearly the same contrast as stop 1000 − *n* on a dark page. Check every pair anyway.
- **Surfaces match the step, not the stop.** The light step from page (50) to panel (white) is smaller than any step between stops. Mirroring it (950 to 850) makes dark panels far louder than light ones. Step one stop at a time instead (`color.dark.surface-steps`):

| Role | Light | Dark |
|---|---|---|
| Page (`surface`) | 50 | 950 |
| Panel (`surface-raised`) | white | 900 |
| Quiet zone (`surface-subtle`) | 50 | 950 |
| Featured (`surface-featured`) | white, stronger shadow | 850 |
| Menus and dialogs (`surface-overlay`) | white, overlay shadow | 800 |
| Hover (`surface-hover`) | 100 | 850 on panels, 750 on menus |
| Selected (`surface-selected`) | 150 | 800 |

The order holds in both themes: panels lift least, then featured items, then floating layers.

```specimen
surfaces accent=#7B43E6 neutral=tinted separation=shadow
Surfaces in both themes. Each label names its stop.
```

## States and containers

- **Hover** is a small tone change; **focus** a clear ring (`opinion.quiet-states`).
- **Selection** is a gray step with an accent detail by default. An accent fill is a common alternative; check it in dark, where it can become a heavy band.
- **Every filled button has a hover** from its ramp, not from opacity.
- **Messages** put the status color in the icon and title by default (`opinion.status-as-detail`). Tinted backgrounds are a common alternative.

## Pairs to check

Contrast failures usually hide in states and components, not in the role table. Check these in every theme, with the contrast tool's `purpose` set for each:

| Where | Foreground | Background | Purpose |
|---|---|---|---|
| Every surface | Each text color on it, links, feedback text | The surface | text |
| Every surface | Control edges, the focus ring, meaningful icons | The surface | ui |
| Hover and selected fills | Text, links, control edges on them | The fill | text or ui |
| Menus | Each item on the highlight, including destructive ones | The highlight | text |
| Filled buttons and their hover | Label and icon | The fill | text |
| Chips and badges | The word; the dot beside it | The container | text; dot informational |
| Messages | Title and icon | The message surface | text |
| Checkboxes, switches, radios | Edge when off, fill when on | Every surface they sit on | ui |
| Dividers | The line | The surface | informational |

When a stop changes, re-check every pair that uses it.

WCAG 2.x measures luminance and can overstate contrast near black. APCA, a candidate for a future WCAG, models perception more closely ([APCA](https://git.apcacontrast.com/documentation/APCAeasyIntro)). Sistema checks against the project's chosen standard.

## Rules

Listed at the end of this page and at `{{sistema_url}}/raw/rules`. Contrast values come from the project's standard, through the rules registry.

## Worked example: Relay

Relay is a dispatch board for a field-service company. Status must be the strongest signal.

- **Answers:** quiet color; violet from the palette library (`#7B43E6`); grays tinted toward violet (`#72707A`).
- **Roles:**

| Role | Light | Dark |
|---|---|---|
| `surface` | gray 50 | gray 950 |
| `surface-raised` | white | gray 900 |
| `surface-featured` | white | gray 850 |
| `surface-overlay` | white | gray 800 |
| `surface-hover` | gray 100 | gray 850 |
| `surface-selected` | gray 150 | gray 800 |
| `on-surface` | gray 850 | gray 50 |
| `on-surface-muted` | gray 600 | gray 350 |
| `primary` | violet 550 | violet 450 |
| `primary-container` | violet 150 | violet 800 |
| `border-focus` | violet 500 | violet 400 |

- **Choices made in review:** selection is a gray step with a violet edge, and messages are gray with colored icons and titles, in both themes.
- **Evidence:** about 280 role and component pairs, all passing WCAG 2.2 AA.

## Failure modes

- **The category's obvious accent,** chosen out of habit.
- **Mirrored dark surfaces,** so dark panels compete with what should lead.
- **States invisible where they're used,** such as hover at 50 on white.
- **Opacity-derived colors,** which change with what's underneath and can't be checked.
- **Checking only the role table** and missing the pairs that states create.
- **Status colors used as decoration.**

## Checking the work

- The contrast tool, with every pair above, in every theme.
- State visibility against every surface (`color.states.visible`).
- Chroma against the answer on how much color (`quality.color.commitment-level`).
- Squint at a screen in each theme. What matters reads first; panels and chrome last.
- The token check page, which shows colors in use, not only swatches.

## Plays

- `color.scheme` builds ramps and roles and checks the pairs.
- `color.map-existing` brings existing colors in.
- `visual-language.direction` asks the color questions.
