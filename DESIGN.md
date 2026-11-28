---
# Generated from tokens/src by `npm run tokens`. Do not edit.
name: "Sistema"
colors:
  surface: "#FBFBFC"
  surface-raised: "#FFFFFF"
  surface-overlay: "#FFFFFF"
  surface-subtle: "#FBFBFC"
  surface-featured: "#FFFFFF"
  surface-hover: "#F2F3F5"
  surface-selected: "#E6E8EB"
  surface-highlight: "#F2F3F5"
  surface-inverse: "#202329"
  on-surface-inverse: "#FBFBFC"
  surface-brand: "#0654BE"
  on-surface-brand: "#FFFFFF"
  on-surface: "#202329"
  on-surface-muted: "#555A61"
  on-surface-faint: "#646971"
  on-surface-disabled: "#979CA4"
  border: "#DADCE1"
  border-strong: "#747981"
  border-focus: "#2073F0"
  primary: "#1163D8"
  primary-hover: "#0047A7"
  on-primary: "#FFFFFF"
  primary-container: "#DBE9FF"
  on-primary-container: "#00317B"
  link: "#0654BE"
  secondary: "#31363D"
  secondary-hover: "#202329"
  on-secondary: "#FFFFFF"
  secondary-container: "#E6E8EB"
  on-secondary-container: "#31363D"
  error: "#b01c1c"
  error-hover: "#85080d"
  on-error: "#FFFFFF"
  error-container: "#ffe2dd"
  on-error-container: "#710408"
  warning: "#763e02"
  on-warning: "#FFFFFF"
  warning-container: "#ffe3d0"
  on-warning-container: "#562a00"
  success: "#08682c"
  on-success: "#FFFFFF"
  success-container: "#ccf2d1"
  on-success-container: "#003f17"
  info: "#164fcd"
  on-info: "#FFFFFF"
  info-container: "#dde9ff"
  on-info-container: "#002991"
  brand-yellow: "#FFCC33"
  brand-red: "#E60026"
  brand-blue: "#0070FF"
  brand-yellow-subtle: "#fff3d3"
  footer-blue: "#1163D8"
  footer-red: "#CA232C"
  footer-yellow: "#FFE6A8"
  on-footer: "#FFFFFF"
  on-footer-yellow: "#171B20"
typography:
  display: { fontFamily: "Fraunces", fontSize: 61, fontWeight: 600, lineHeight: 1.05 }
  heading-xl: { fontFamily: "Fraunces", fontSize: 39, fontWeight: 600, lineHeight: 1.15 }
  heading-lg: { fontFamily: "Fraunces", fontSize: 31, fontWeight: 600, lineHeight: 1.2 }
  heading-md: { fontFamily: "Fraunces", fontSize: 25, fontWeight: 600, lineHeight: 1.3 }
  heading-sm: { fontFamily: "Inter", fontSize: 20, fontWeight: 600, lineHeight: 1.35 }
  body-lg: { fontFamily: "Inter", fontSize: 20, fontWeight: 400, lineHeight: 1.6 }
  body: { fontFamily: "Inter", fontSize: 16, fontWeight: 400, lineHeight: 1.6 }
  body-sm: { fontFamily: "Inter", fontSize: 13, fontWeight: 400, lineHeight: 1.5 }
  label: { fontFamily: "Inter", fontSize: 13, fontWeight: 500, lineHeight: 1.35 }
  caption: { fontFamily: "Inter", fontSize: 12, fontWeight: 400, lineHeight: 1.4 }
  code: { fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: 400, lineHeight: 1.6 }
rounded:
  none: 0
  sm: 6
  md: 8
  lg: 12
  xl: 16
  full: 9999
spacing:
  0: 0
  1: 4
  2: 8
  3: 12
  4: 16
  5: 20
  6: 24
  8: 32
  10: 40
  12: 48
  16: 64
  20: 80
  24: 96
---

<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->

## Overview

Sistema's site explains a method for building design systems with an AI agent, for designers and engineers. It should feel calm and editorial, with a recognizable brand, and show the craft it teaches.

**What the site needs:**
- Long guides are comfortable to read, with clear headings and tables.
- The one action that matters, copying a prompt, is never in doubt.
- Reference (plays, rules, opinions) is easy to scan and link to.
- The brand is recognizable without competing with the content.
- It works as well in dark as in light.

**Direction values** (the owner's answers, waiting for approval):
- How much color: brand.
- Accent seed: #0070FF (fixed, the brand blue). Brand marks: yellow #FFCC33 and red #E60026, for the logo and brand moments only.
- Grays: tinted toward the blue, seed #6D727A (proposed: warm).
- Control radius 8px; chips fully round.
- Panels separate by tone.
- Typefaces: Inter for text and interface; Fraunces for headings.
- Density: comfortable. Theme: light first, with dark.
- Rendering: https://sistema-git-v2-jtd-604ef502.vercel.app/api/specimen?accent=%230070FF&neutral=tinted&presence=brand&radius=8&chips=pill&separation=tone&density=comfortable&font=Inter&display_font=Fraunces&theme=light&layout=article&format=html
- Role stops: surface gray 50; surface-raised white; surface-hover gray 100; surface-selected gray 150; surface-inverse gray 850; surface-brand blue 600; on-surface gray 850; on-surface-muted gray 600; border gray 200; border-strong gray 450; border-focus blue 500; primary blue 550; primary-hover blue 650; primary-container blue 150; link blue 600.

**What stands out:**

| Screen | Featured | Quiet | Brand or inverse block |
|---|---|---|---|
| Home | The prompt box | Navigation, narrative sections | One brand band near the end |
| Guide | Nothing; the text leads | "On this page", related plays | None |
| Play or workflow | The prompt box | Contract details, rules | None |
| Reference lists | Nothing | Filters | None |
| Tools | The tool's result | Controls | None |

## Colors

- **Surfaces:** the page (`surface`), panels and cards (`surface-raised`), menus and dialogs (`surface-overlay`), quiet zones such as the guide sidebar (`surface-subtle`), and the emphasis surfaces `surface-featured`, `surface-inverse`, and `surface-brand`, each with its `on-*` text role.
- **Text:** `on-surface`, `on-surface-muted` for secondary text, `on-surface-faint` for captions and metadata.
- **Accent:** the brand blue as `primary` (buttons, focus, current section) and `link`, which is dark enough for small text. `primary-container` fills small marks such as chips.
- **Brand marks:** yellow and red appear in the logo and deliberate brand moments only, never as status. Red never means an error.
- **Grays** lean toward the blue, so the chrome and the accent feel of a piece.
- **Feedback:** error, warning, success, and info from their own ramps, as small marks and in message icons and titles.
- **States:** `surface-hover` and `surface-selected` are gray steps; selection adds a blue detail.
- What stands out on each screen is in the Overview.

## Typography

- **Inter** for text and interface; **Fraunces** for headings; **JetBrains Mono** for code, because the site shows prompts, token names, and code throughout.
- Roles: `display`, `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `code`. Sizes come from the type scale tool.
- Hierarchy by size and the serif for headings; weight for labels and emphasis. Tabular figures in tables.
- Reading text keeps a comfortable line length; guides cap their column width.

## Layout

- A 4px spacing scale. Comfortable density.
- Spacing grows from inside components (4 to 12px) to between groups (16 to 32px) to between page sections (48 to 96px).
- Pages sit in a centered container with a side gutter; guides add a reading column and an "On this page" rail on wide screens.

## Elevation & Depth

- Panels and cards separate from the page by tone, without outlines or shadows.
- Menus, popovers, dialogs, and toasts float on the overlay shadow; the featured item, such as the prompt box, lifts on the featured shadow.
- In dark, surfaces step one stop at a time, and shadows are stronger.
- Borders have a job: form fields, secondary buttons, table rows, and code blocks.

## Shapes

- Controls at 8px. Small parts (checkboxes, tags) below that; panels and cards above; the featured item and floating layers the roundest.
- Chips and badges are fully round.

## Components

- Navigation with the current section marked in blue.
- The prompt box, featured on the home, workflow, and play pages.
- Guide pages: reading column, "On this page", plays and rules for the topic.
- Reference lists: filters and tables.
- Tool pages: controls and a featured result.
- The command palette, footer with the theme switch.

## Do's and Don'ts

- Use roles in components, never raw values.
- Keep blue for action, focus, links, and where you are.
- Never use brand red or yellow as a status color.
- Separate panels by tone; add a border only where it has a job.
- Set headings in Fraunces and everything else in Inter; code in JetBrains Mono.
- Keep one featured thing per screen where you can, as the Overview lists.
- Support reduced motion; keep transitions short.
- Write interface copy by VOICE_AND_TONE.md.
