---
title: "Visual quality"
description: "How Sistema checks that a system looks deliberate and current: the craft baseline, reflexes and predictable families, plain-looking traps, token bans, and review in both themes."
topic: quality
sources:
  - { source: impeccable, url: "https://github.com/pbakaus/impeccable" }
  - { source: anthropic-frontend-design, url: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md" }
  - { source: nngroup-hierarchy, url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/" }
related:
  - guide.visual-language.overview
  - guide.color.architecture
last_reviewed: 2026-11-20
---

# Visual quality

## Where Sistema stands

A system can pass every functional check and still look generic, dated, or noisy. Sistema guards against that with:

- **The craft baseline** (see the visual-language guide).
- **The checks on this page:** reflexes, predictable families, plain-looking traps, and a few bans.

The checks are advisory (`opinion.quality-signals-advisory`). They flag a likely problem; they don't decide taste. A deliberate choice, recorded in DECISIONS.md with its reason, wins.

## Reflexes

Picking values in a hurry means reaching for the obvious. Each obvious choice is fine alone. Together they make a system that could belong to any product. The idea of first-order reflexes and second-order families comes from impeccable, an agent skill for frontend design quality ([impeccable](https://github.com/pbakaus/impeccable)).

### First-order reflexes (category-obvious choices)

| Category | The reflex | Why it's a problem |
|---|---|---|
| Accent | Medium blue for any product, or the category's color (green for health, violet for developer tools) | Chosen because it's familiar, not because it serves this product |
| Page | A default near-white, unrelated to the grays | The surface has no relationship to the rest of the palette |
| Radius | One radius on everything | No sense of which things are small, large, or floating |
| Shadow | One small shadow on every card | Elevation that says nothing about what floats or leads |
| Type | One weight for body and one for headings, hierarchy by size alone | Flat hierarchy, especially in dense views |
| Grays | A gray ramp with no temperature | Nothing ties the chrome to the accent |

More than two of these together is a strong sign the values were defaulted, not chosen (`quality.color.first-order-reflex` covers the accent).

### Predictable families

Avoiding the obvious often lands in a second predictable place: a whole look made popular by a tool or trend.

| Family | What it looks like |
|---|---|
| Dark and moody | Near-black surfaces, a muted gold or amber accent, shadows everywhere |
| Startup bright | Pure white, bright blue or violet, heavy bold weights |
| Editorial luxury | A serif display face, black and white with one warm accent, widely tracked capitals |
| Brutalist | High-contrast black and white, monospace everywhere, outlined buttons, no radius |
| Friendly app | Large radii, pastel accents, generous padding, illustrated empty states |

None is wrong as a direction. They're a problem when they arrive without a reason in the product's needs.

## Plain-looking traps

The opposite problem: a system that avoids every flashy choice and still looks dated, because "serious" was read as a style.

| Trap | What it looks like | Instead |
|---|---|---|
| Outlined everything | A border on every panel, card, chip, tooltip, and menu, and dividers inside containers | Separate by tone, space, or shadow; keep borders where the edge is the affordance or helps follow rows |
| Sharp means serious | Radius of 0 to 3px everywhere because the product is professional or technical | A middle radius scaled by element; most current professional tools are not sharp |
| Gray means professional | Gray with no tint, and the accent removed from everything but one button | A slightly tinted neutral, and the accent where it marks action, selection, and the brand |
| Even steps everywhere | Page, panel, and menu as equal steps of gray, nothing allowed to lead | Quiet levels plus a featured item or a block of color, by the role of the content |

To check a review page for these, name the job of every border and divider, and squint at it. If nothing leads, or the lines are what you see first, a trap has caught it.

## Token bans

A few patterns are ruled out whatever the direction. Several match impeccable's automated checks.

- **A thick colored side stripe as decoration or as the main status signal.** A thin edge that is one of several cues for a state is fine.
- **Gradient text as the default heading style.** Decoration standing in for typographic hierarchy.
- **Glass surfaces as the default** (blur with translucent panels). Allowed as a deliberate choice; ruled out as a reflex.
- **One card style for every kind of content,** with the same padding, radius, and shadow regardless of density or importance.
- **Color as the only signal of a state** (hover, selected, error). Pair it with a shape, icon, label, or edge.

### Color token bans

- **No opacity-derived colors** (`primary/10` as a container). Every color is a token pointing at a ramp stop, so it can be checked and themed.
- **Primary and secondary with distinct hues.** Two roles that differ only in lightness read as one.
- **No pure black or pure white page.** The page (`surface`) is an off-white or off-black; white panels on an off-white page are fine.
- **Grays with some temperature.** Cool, warm, or tinted toward the accent; a gray with none reads clinical.

The checkable parts are in `quality.color.bans` and `quality.shape.bans`.

## Color amount

How colorful surfaces and grays may be depends on how much color the direction chose (quiet, brand, or tinted). The color guide's "How much color" gives the range for each, and `quality.color.commitment-level` checks the tokens against it.

## Review in both themes

- **Squint at a real screen.** What needs action reads first, content next, chrome last ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). If panels or lines read first, a step is too strong.
- **Compare light and dark side by side.** A treatment tuned in light can turn loud in dark. Change the treatment, not only the dark value (`opinion.both-themes`).
- **Ask whether the screen could belong to any product.** If so, go back to the needs.

## Rules

The quality rules are listed at the end of this page and at `{{sistema_url}}/raw/rules`. All are advisory.

## Worked example: Relay

Relay is a dispatch board. An early version passed every functional check but showed all four plain-looking traps: an outline on every panel, chip, and menu; small radii everywhere; near-gray with the accent only on buttons; and equal steps of gray.

The current version separates panels by shadow, keeps borders on fields and table rows where they help, uses an 8px control radius scaled up for larger elements, tints the grays toward a violet accent, and lets the job that needs a technician lead. In both themes, selection and messages are gray with color as a detail.

## Failure modes

- **Treating the checks as taste rules,** and rejecting a deliberate, recorded choice because it matches a family.
- **Checking values in isolation.** Each value passes; together they're a reflex or a trap.
- **Reviewing only in light,** or only the swatches, not a screen.
- **Fixing a trap by swapping in a family:** removing every outline and adding glass and gradients instead.

## Checking the work

- **The reflex count** on the proposed tokens, and the accent against the category default.
- **The trap check** on every review page: the job of each border, and the squint test.
- **The bans** against the token files.
- **Light and dark side by side** on the showcase and the page examples.

## Plays

- `visual-language.direction` runs the reflex and trap checks on the proposal.
- `color.scheme`, `typography.scale`, and `shape.tokens` check their tokens against the bans.
- `components.scaffold-core` and `components.page-examples` review in both themes.
