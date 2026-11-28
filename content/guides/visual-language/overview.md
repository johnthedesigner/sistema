---
title: "Visual language"
description: "How Sistema sets a product's look: a baseline of good practice, questions about the look answered by seeing options on a screen like the product's, and emphasis that follows importance."
topic: visual-language
sources:
  - { source: linear, url: "https://linear.app/now/how-we-redesigned-the-linear-ui" }
  - { source: geist, url: "https://vercel.com/geist/materials" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/components/theme" }
  - { source: apple-hig, url: "https://developer.apple.com/design/human-interface-guidelines/materials" }
  - { source: spectrum, url: "https://spectrum.adobe.com/foundations/attention-hierarchy" }
  - { source: fluent, url: "https://fluent2.microsoft.design/elevation" }
  - { source: fluent, url: "https://fluent2.microsoft.design/layout" }
  - { source: polaris, url: "https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs" }
  - { source: material, url: "https://m3.material.io/styles/color/roles" }
  - { source: primer, url: "https://github.com/primer/design/blob/main/content/foundations/typography.mdx" }
  - { source: carbon, url: "https://carbondesignsystem.com/elements/typography/overview/" }
  - { source: atlassian, url: "https://atlassian.design/foundations/typography" }
  - { source: nngroup-hierarchy, url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/" }
  - { source: comeau-shadows, url: "https://www.joshwcomeau.com/css/designing-shadows/" }
  - { source: rauno-interaction, url: "https://rauno.me/craft/interaction-design" }
  - { source: kowalski-animation, url: "https://emilkowal.ski/ui/great-animations" }
  - { source: designer-skills, url: "https://github.com/julianoczkowski/designer-skills/tree/main/design-brief" }
  - { source: anthropic-frontend-design, url: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md" }
  - { source: impeccable, url: "https://github.com/pbakaus/impeccable" }
related:
  - guide.quality.visual-quality-signals
  - guide.visual-language.style-tile-format
  - guide.depth.architecture
  - guide.color.architecture
last_reviewed: 2026-11-20
---

# Visual language

## Where Sistema stands

A product's look comes from two kinds of decision:

- **Craft:** how well things are made. Sistema starts every project from a baseline, and the project can override any part of it.
- **Taste:** where products should differ, such as how much color, how round, which typeface. The person decides, by choosing between options shown on a screen like theirs.

"Functional" means nothing purely decorative. It doesn't mean bare. Color, depth, a distinctive typeface, or a block of brand color can all do a job.

## The craft baseline

### Broad practice

Several established systems and published research share these. Sistema applies them by default.

| Practice | In short | Seen in |
|---|---|---|
| Hierarchy before lines | Type, space, and tone carry hierarchy. Borders mark edges people interact with, or help the eye follow data. | Fluent, Linear, NN/g |
| Text in tones | Three or four text colors from the grays, not pure black. | Material, Primer, Radix |
| Radius by size | Small elements less round, containers more, floating layers most. A nested radius follows its container. | Apple, Geist, Radix |
| Elevation by role | Menus, dialogs, and other floating layers get shadows; ordinary panels sit flat. | Fluent, Geist, Material |
| One typeface, set well | One family, a few weights, tighter tracking at large sizes, tabular figures for data. | Carbon, Geist, Primer |
| Consistent rhythm | A small spacing unit, one control height per density, aligned edges. | Atlassian, Carbon, Material |
| One icon set | One set, its stroke matched to the text. | Carbon, Material, Primer |
| Short motion | Brief, eased transitions on state changes and floating layers. | Carbon, Material, Emil Kowalski |
| Contrast follows importance | Most things separate quietly; a few stand out strongly. | NN/g, Spectrum |

### Sistema's defaults

Good products also do these differently. They are where Sistema starts, with the reason, and the project can change them.

| Default | In short | Why |
|---|---|---|
| Neutral ground, one accent | Near-neutral surfaces; the accent on actions, selection, focus, and links. | Color reads as a signal when it's scarce. Products where the brand is the experience go further. |
| Quiet states | Hover a small tone change, selection a gray step with an accent detail, focus a clear ring. | States happen constantly. Accent-filled selection is common too, and suits products where selection should be prominent. |
| Status as detail | Messages on a neutral surface, with the status color in the icon and title. | Calmer, and it holds up in dark themes. Tinted message backgrounds are also common and fine. |
| One decision for both themes | Decide each treatment once; dark values translate it. | A treatment tuned only in light often turns loud in dark. |

Each item is an opinion with its reasons and how to override it, at `{{sistema_url}}/raw/opinions`.

## What the product needs

Start from what the screens must do, not from a style word. "Utilitarian" or "premium" describes a goal, not a look.

Write three to five plain needs. For example:

- A dashboard: the item that needs action is seen first; status is the strongest color.
- A shopping app: the product photo leads; the buy button is never in doubt.
- A publication: long text is comfortable to read; navigation stays out of the way.

Each taste question is then answered by the option that best serves these needs.

## The taste questions

Each question is shown, not described. The specimen tool draws the options on a layout like the product's, with the product's own words, so only the decision differs. It stands in for the product's screens; it doesn't render them. The agent proposes one option per question, with the need it serves. The person picks.

### How much color

| Option | What you see | Suits |
|---|---|---|
| Quiet | Mostly neutral; color on the main action, selection, and status | Tools where content or status should lead |
| Brand | The accent also marks where you are, such as the current page | Most products |
| Tinted | Large areas of brand color, such as the navigation or page background | Products where the brand is part of the experience |

**The accent.** Use the brand color if there is one. If not, choose from Sistema's palette library, `{{sistema_url}}/palettes/library.json`. Its palettes are hand-picked hues chosen to look good, so they make a safe start. Show two or three. Avoid the category's obvious color unless there's a reason, and keep the accent apart from status colors when status matters.

### Warm or cool

The grays set every surface and border. Cool grays read crisp, warm grays softer. Grays tinted toward the accent tie the interface together. Nearly neutral is the quietest.

### How round

Show a few control radii, such as 4, 8, and 12px, with everything else scaled from it. Show fully round chips as a separate option.

### How surfaces separate

How panels stand off the page:

| Option | What you see |
|---|---|
| Tone | No outlines; panels a shade different from the page |
| Line | Fine outlines |
| Shadow | A soft lift |

### Typeface

Show three typefaces suited to the product, each setting the same heading, data, and label. A dense tool needs clear figures and a compact width. A reading product needs comfortable text. Add a second face only with a reason.

### Density and theme

Usually set at the start. If density is open, show the same screen at a few spacings. With light and dark themes, show every choice in both.

## Emphasis

Contrast should follow importance. Most zones separate from the page only slightly. A few things stand out much more: the main action, a featured item, a promotion, a key number. If everything is emphasized, nothing is ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Spectrum suggests one high-attention element or group per page ([Spectrum](https://spectrum.adobe.com/foundations/attention-hierarchy)).

### Surfaces for emphasis

Every system Sistema builds has these color roles beside the ordinary surfaces (`color.roles.required`):

| Role | For |
|---|---|
| `surface-subtle` | A quiet zone: a sidebar, a toolbar, an inset area |
| `surface-featured` | The item that should lead, lifted further than a panel |
| `surface-inverse` | A dark block on a light page, or the reverse: a toast, a quote, a band |
| `surface-brand` | A block of brand color: a key number, a promotion, a footer |

Polaris and Material have similar roles ([Polaris tokens](https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs), [Material](https://m3.material.io/styles/color/roles)). A product that never needs one simply doesn't use it.

### Ways to separate

| Means | Quiet | Strong |
|---|---|---|
| Space | A larger gap | A section break |
| Tone | A subtle surface | An inset area or tinted container |
| Line | A hairline between rows | A control border |
| Shadow | A soft lift | The featured shadow |
| Color | A tinted container | A brand or inverse block |

Space comes first. Fluent makes the same point: spacing creates sections without lines ([Fluent](https://fluent2.microsoft.design/layout)).

### What stands out on each screen

DESIGN.md records, for each kind of screen, what is featured, what is quiet, and whether there's a brand or inverse block. Page and component work follows it. It's a first guess until real screens exist.

## Design traditions

Swiss typography, functionalism, editorial layout, or brutalism can explain why an option suits a product. They don't set values on their own, and they are never what the person approves. Take the specific principle that serves the product, and show it as an option.

## Rules

- `visual-language.style-tile.sections` and `visual-language.style-tile.self-contained`: what the direction page contains.
- `quality.color.first-order-reflex` and `quality.color.bans`: the accent and the grays.
- `shape.radius.hierarchy`: radius by size.
- `quality.craft.*`: the craft baseline, advisory.

## Worked example: Relay

Relay is a dispatch board for a field-service company, used all day on desktop.

**Needs.** The job that needs a technician is seen first. Status is the strongest color. Long lists stay easy to follow.

**Proposals and answers.** For each question the agent showed three options on Relay's own board and proposed one:

| Question | Proposed | Chosen |
|---|---|---|
| How much color | Brand | Quiet |
| Accent | Purple from the library | Violet from the library |
| Grays | Tinted toward the accent | Tinted toward the accent |
| How round | 8px, round chips | 8px, chips scaled from it |
| Separation | Tone | Shadow |
| Typeface | IBM Plex Sans | Atkinson Hyperlegible Next |

**What stands out.** On the board, the job that needs a technician is featured, the sidebar is quiet, and there's no brand block. Reports get a brand block for the day's key number.

## Failure modes

- **A style word instead of needs.** "Professional" turned straight into sharp corners, gray, and outlines.
- **Deciding for the person.** Every option picked and only the result shown.
- **Style labels instead of options.** Asking someone to approve "Swiss" rather than what they can see.
- **Even steps everywhere.** Page, panel, and menu as equal steps of gray, so nothing leads.
- **Everything emphasized.** Several featured items and brand blocks competing on one screen.
- **Options that differ in more than one thing.** The person can't tell what they're choosing.

## Checking the work

- Squint at the screen. The main action and the featured item read first, the chrome last.
- Every border has a job you can name.
- Each taste question was shown as options on a screen like the product's, and the person chose.
- Each proposal names the need it serves.

## Plays

- `visual-language.direction` asks the taste questions.
- `visual-language.design-md` writes DESIGN.md from the answers.
- `color.scheme`, `shape.tokens`, and `spacing.tokens` build on them.
