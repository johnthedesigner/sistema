---
title: "Visual language"
description: "How Sistema sets a product's look: a contemporary craft baseline every project starts from, the taste questions the person answers by seeing options on their own product, and emphasis that follows importance."
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

A product's look comes from two kinds of decision, and Sistema treats them differently.

- **Craft** is what experienced product designers broadly agree on today: hierarchy from type and space before lines, borders only where they do a job, radius that scales with the element, quiet elevation, one accent used for meaning. Sistema holds these as a baseline every project starts from (the `craft` opinions). A project can override any of them, and records why.
- **Taste** is where products should differ: how much color, warm or cool, how round, how surfaces separate, the voice of the type, density. Sistema asks the person about each one, and shows the options rendered on their own product, so they choose what they see rather than a name for a style.

"Functional" means no styling that is purely decorative. It does not mean bare. A style earns its place by doing something for the person using the product: showing what matters, what can be clicked, what belongs together, what the product is, or how a moment should feel. Color, depth, a distinctive typeface, and a bold block of brand color can all be functional. Removing everything removable leaves a word-processor document, not a calm interface.

The baseline is not "look like Linear". It's a set of principles several current systems share, each credited where it's described. Linear's redesign held most of its brand hue out of the chrome and pushed content contrast up ([Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)); Vercel's Geist ties radius and shadow to a small set of elevation roles ([Geist](https://vercel.com/geist/materials)); Radix Themes expresses taste as a few parameters that restyle every component ([Radix](https://www.radix-ui.com/themes/docs/components/theme)); Spectrum 2 keeps high-attention treatments to one element or group per page ([Spectrum](https://spectrum.adobe.com/foundations/attention-hierarchy)).

## The craft baseline

Each item is an opinion with its reasons, when you'd choose otherwise, and how to override it. The checkable parts are advisory review rules, so a deliberate choice can win.

| Item | In short | Opinion |
|---|---|---|
| Hierarchy before lines | Type, space, and tone carry hierarchy. A border is used where the edge is the affordance (fields, selects, checkboxes, secondary buttons) or helps the eye follow data. | `opinion.hierarchy-before-lines` |
| Neutral ground, one accent | Surfaces and chrome are near-neutral with a slight tint. The accent marks the primary action, selection, focus, and links. Status colors are the only other color. | `opinion.neutral-ground-one-accent` |
| Text in tones | Three or four text tones from the neutral ramp, never pure black. Secondary text carries much of the hierarchy. | `opinion.text-tones` |
| Radius by size | Small elements smaller, containers larger, floating layers largest; a nested radius is the outer radius minus the padding. | `opinion.radius-by-size` |
| Elevation for what floats and what leads | Menus, popovers, dialogs, toasts, and the featured item get soft, layered shadows. Ordinary panels sit on the page. | `opinion.elevation-by-role` |
| One typeface, set with care | A well-made sans, medium weight for labels and emphasis, tighter tracking at large sizes, tabular figures for data. | `opinion.one-typeface-set-well` |
| Consistent rhythm | A 4px grid, one control height per density, aligned edges, generous outer spacing even when the inside is dense. | `opinion.consistent-rhythm` |
| Quiet states | Hover is a small tone change, pressed a little more, focus a crisp ring with an offset, selected a neutral step stronger than hover with an accent detail. | `opinion.quiet-states` |
| Status as detail | Messages and banners sit on a neutral surface; the status color is in the icon, the title, or an edge. Tinted fills are for small marks such as chips. | `opinion.status-as-detail` |
| One decision for both themes | Each treatment (what is gray, what carries color, how strong a selection is) is decided once and works in light and dark. Dark values translate it; they don't change it. | `opinion.both-themes` |
| One icon set | One set, its stroke matched to the text weight. | `opinion.one-icon-set` |
| Short motion | Short, eased-out transitions on state changes and floating layers only. | `opinion.short-motion` |
| Contrast follows importance | Most levels separate quietly; a few separate strongly, chosen by the role of the content. | `opinion.contrast-follows-importance` |

Several of these are starting points that a taste answer moves. "Neutral ground, one accent" is where the color question starts; the person can take it a long way. The radius default sits in the middle and the roundness question moves it.

## What the product needs

Start from what the screens must do, not from a style word. A brief that says "utilitarian" describes a goal: status must stand out, rows must be easy to follow, controls must be obvious, nothing should compete with the work. None of that calls for sharp corners or an outline on every surface. Linear, Vercel's dashboard, and Stripe's dashboard are all utilitarian, and none look like that.

Write the needs as plain statements, for example:

- The thing that needs action now (the next job, the failed payment) must be the first thing seen.
- People scan long lists all day, so rows must be easy to follow without heavy lines.
- Status is the main signal, so status colors must be the strongest color on screen.
- The brand matters on the marketing pages, much less inside the tool.

Each taste question below is then answered by asking which option serves these needs, and the proposal says so in those words.

## The taste questions

Each question is shown, never only described. The options are rendered on the product's own content (its navigation, a row of its records, its status chips, a button pair, a field, a menu) with the specimen tool, so every option is rendered the same way and only the decision differs. The agent proposes one option per question and says why, in terms of what the product needs. The person picks.

### How much color

How far the accent reaches beyond actions and focus.

| Option | What the person sees | Suits |
|---|---|---|
| Quiet | Almost all neutral; color only on the main button, selection, and status | Dense tools where status must be the strongest signal |
| Brand | The accent also marks the navigation's current item and selected rows | Most products; recognizably theirs without competing with status |
| Tinted | A deep accent block carries the navigation, and the page takes a faint accent tint | Products where the brand is part of the experience, consumer apps, marketing |

The accent itself is a separate choice. If the project already has a brand color, use it. If not, propose one from Sistema's palette library (`{{sistema_url}}/palettes/library.json`): a colorful palette (not one of the grays), at one of its bright middle stops, 400 to 600, where the hue is at its most saturated. Those stops already sit on an even contrast curve and render well across the whole ramp, while a seed picked by eye or by name often turns muddy or dull. Show two or three of them as the options. Check the proposal against the category default (the first-order reflex in the quality guide), and keep it apart from the status hues if status matters.

### Warm or cool

The temperature of the neutral ramp, which sets every surface, border, and gray text. Show the same screen with cool, neutral, and warm grays. Cool reads technical and crisp; warm reads softer and more editorial; neutral is the quietest. The neutral can also be tinted toward the accent, which makes the whole interface feel of a piece.

### How round

The radius of controls, with every other radius scaled from it (chips smaller, panels larger, floating layers largest). Show about 4px, 8px, and 12px on buttons, fields, and a panel, and pills as a separate option for chips. Sharpness doesn't mean seriousness: most current professional tools sit in the middle.

### How surfaces separate

How quiet zones and panels separate from the page. This is the quiet level; strong emphasis is handled by the emphasis roles below.

| Option | What the person sees |
|---|---|
| Tone | No outlines; panels a shade lighter than the page |
| Line | Fine outlines on panels, on a white page |
| Shadow | Panels lifted with a soft shadow |

### Type voice

Show three typefaces chosen for the product, each setting the same heading, a row of data, and a label. Choose for the product's character and its text: a dense tool needs clear figures and a compact width; a reading product needs comfortable text and can take a more expressive display face. A second face (for display or for code) needs a reason.

### Density and theme

These usually come from Start (`sistema.json`). If the person is unsure about density, show the same table at compact, comfortable, and spacious row heights. If the theme is light and dark, show the chosen options in both.

## Emphasis: contrast that follows importance

In a well-designed product the contrast between levels is not uniform. Most structural zones separate from the page only slightly, so the page reads as one calm field. One thing, such as the job in progress or the plan to choose, stands out much more, through lift, tone, or color. A footer or a key band can be a saturated block of brand color. The variation follows the role the content plays.

A real product is less like an essay (title, heading, paragraph) and more like a large restaurant menu: whole pages, sections, promotions, mains against sides, food against drink. A single even ladder of levels can't guide attention through that on purpose; it reads as noise, or, stripped back, as a document. Research says the same: hierarchy comes from contrast between an element and its context, and if everything is contrasted, nothing stands out ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Spectrum 2 states it as a rule of thumb: one element or group with high attention per page ([Spectrum](https://spectrum.adobe.com/foundations/attention-hierarchy)).

### Emphasis surfaces

Every system Sistema builds has these color roles, alongside the ordinary surface ladder (`color.roles.required`):

| Role | What it's for |
|---|---|
| `surface-subtle` | A quiet zone: a sidebar, a toolbar band, an inset well |
| `surface-featured` | What should lead on the screen, lifted further than a panel |
| `surface-inverse` | A dark block on a light page (or the reverse): a quote, a newsletter band, a toast |
| `surface-brand` | A saturated block in the brand color: a key metric, a promotion, a footer band |

Each has its own text roles and is checked for contrast like any other pairing. Polaris names surfaces by prominence rather than depth and has brand and inverse families ([Polaris tokens](https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs)); Material has inverse surfaces and containers ([Material](https://m3.material.io/styles/color/roles)).

These roles are opinionated parts of the foundation, not questions. Asking a person to approve semantic roles one by one is the wrong level of detail. The color and depth plays choose their values from the direction, and the person sees the result on the composition in the review page. A product that never uses one simply doesn't apply it.

### Ways to separate and lift

The system offers a small set of treatments, each with its tokens, and each screen chooses one per context from the role of the content, not from how deeply it's nested:

| Treatment | Quiet | Strong |
|---|---|---|
| Space | A larger gap between groups | A section break with generous space above |
| Tone | `surface-subtle` against the surface | An inset well, or a tinted container |
| Hairline | A hairline rule between rows | A control border |
| Shadow | A soft lift (only when the project separates panels by shadow) | The featured shadow |
| Color block | An accent-tinted container | `surface-brand` or `surface-inverse` |

Space is the first tool; Fluent's layout guidance makes the same point: spacing creates sections "without having to use lines" ([Fluent](https://fluent2.microsoft.design/layout)). The depth guide covers shadow strength, light sources, and dark themes.

### The emphasis map

The direction records, per kind of screen, which content plays which role, for example: "the job in progress is featured; the sidebar is subtle; the daily total is a brand block; nothing is inverse." DESIGN.md states it once, in the Overview's direction values. Page and component work reads it instead of deciding emphasis screen by screen. Without real screens it's a first guess, and it's revised when they exist.

## Design traditions as vocabulary

Traditions such as Swiss typography, Dieter Rams' functionalism, Scandinavian design, editorial layout, or brutalism are useful words for explaining why an option suits a product ("a strict grid and type-led hierarchy, as in Swiss design"). They are never what the person approves, and they don't decide values on their own. The first Relay run showed why: "functionalist" was read as "minimal radius and outlines", and the result looked dated. If a tradition comes up, take the specific principle that serves the product's needs and show it as an option.

## Rules

The direction is checked against these rules:

- `visual-language.style-tile.sections` and `visual-language.style-tile.self-contained`: what the direction page contains.
- `quality.color.first-order-reflex` and `quality.color.bans`: the accent and neutral choices.
- `shape.radius.hierarchy`: radius scaled by element.
- The craft review rules, `quality.craft.*`, advisory: borders with a job, text tones, elevation by role, scarce emphasis, quiet states, weights, and motion.

## Worked example: Relay

Relay is a dispatch dashboard for a small field-service company: dispatchers use it all day on desktop to assign jobs, track status, and handle requests. Its brief said "utilitarian".

The first run translated that into a style: "Functionalist primary, Swiss secondary, commitment level 1", radius from 2 to 8px, and outlines on panels, chips, tooltips, menus, and dividers. Every value was defensible on its own, and the result looked dated and noisy. The owner's review: too many borders, outlines, and dividers.

With the questions, the same brief becomes needs first: the next unassigned job must be the first thing seen; status is the strongest signal; dispatchers follow long lists all day. Those point to quiet color (brand at most, so status stays strongest), separation by tone rather than lines, a middle radius, a compact sans with tabular figures, and an emphasis map in which the job in progress is featured. Each option is then shown on Relay's own jobs list before anyone approves it.

## Failure modes

- **A style word instead of needs.** "Precise", "professional", or "utilitarian" turned straight into sharp corners, gray, and outlines.
- **Answering the taste questions for the person.** The agent picks every option and shows only the result, so the person approves a page rather than choices.
- **Codewords on the review page.** "Level 2, Swiss" instead of the rendered options in plain words.
- **Even steps everywhere.** Page, panel, and menu as three equal steps of gray, and nothing allowed to lead.
- **Everything featured.** Several featured cards and brand blocks on one screen, so none leads.
- **Options that differ in more than one thing.** If the roundness options also change color, the person can't tell what they're choosing.

## Checking the work

- Squint at the composition (or blur it): the featured item and the primary action should be what reads first, then the content, with the chrome last ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)).
- Every border and divider on the page has a job you can name.
- Each taste question was shown with its options rendered on the product's content, and the person picked.
- The proposal for each question names the product need it serves.
- The emphasis map is in DESIGN.md, and the composition follows it.

## Plays

- `visual-language.direction` sets the direction and asks the taste questions.
- `visual-language.design-md` writes DESIGN.md from the approved direction.
- `color.scheme`, `shape.tokens`, and `spacing.tokens` build the foundations from it.
