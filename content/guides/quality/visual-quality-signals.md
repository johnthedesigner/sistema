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

A design system can pass every functional check and still look generic, dated, or noisy. Sistema guards against that in two ways:

- **A craft baseline it sets by default:** hierarchy before lines, neutral ground with one accent, text in tones, radius by size, elevation by role, quiet states, status as detail, one decision for both themes. These are opinions with reasons and advisory rules, described in the visual-language guide.
- **Checks for the choices that make a system look like every other one:** reflexes, predictable families, plain-looking traps, and a short list of token bans. They are on this page.

The checks are advisory (`opinion.quality-signals-advisory`). They name a likely problem; they don't decide taste. A deliberate choice can win, as long as it's made for a reason the product supports and recorded in DECISIONS.md.

## Reflexes

When an agent (or a person in a hurry) picks values, it reaches for what it has seen most: the category's obvious choices. Each is fine on its own. Together they produce a system that could belong to any product. The framing of first-order reflexes and second-order families follows impeccable, an agent skill for frontend design quality ([impeccable](https://github.com/pbakaus/impeccable)), adapted here to token decisions.

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

Avoiding the first reflexes often lands in a second, equally predictable pocket: a whole look popularized by a tool or a trend.

| Family | What it looks like |
|---|---|
| Dark and moody | Near-black surfaces, a muted gold or amber accent, shadows everywhere |
| Startup bright | Pure white, bright blue or violet, heavy bold weights |
| Editorial luxury | A serif display face, black and white with one warm accent, widely tracked capitals |
| Brutalist | High-contrast black and white, monospace everywhere, outlined buttons, no radius |
| Friendly app | Large radii, pastel accents, generous padding, illustrated empty states |

None of these is wrong as a direction. They are a problem when they arrive without a reason in the product's needs: a precise, technical product that comes out dark and moody has been assigned a look, not given one. The direction's taste questions exist so the person chooses with the options in front of them.

## Plain-looking traps

The opposite pocket: a system that avoids every flashy reflex and still looks dated, because "serious" or "functional" was read as a style. Each choice looks defensible alone, which is why they're easy to miss.

| Trap | What it looks like | Instead |
|---|---|---|
| Outlined everything | A border on every panel, card, chip, tooltip, and menu, and dividers inside containers | Separate by tone, space, or shadow; keep borders where the edge is the affordance or helps follow rows |
| Sharp means serious | Radius of 0 to 3px everywhere because the product is professional or technical | A middle radius scaled by element; most current professional tools are not sharp |
| Gray means professional | Gray with no tint, and the accent removed from everything but one button | A slightly tinted neutral, and the accent where it marks action, selection, and the brand |
| Even steps everywhere | Page, panel, and menu as equal steps of gray, nothing allowed to lead | Quiet levels plus a featured item or a block of color, by the role of the content |

To check a review page for these, name the job of every border and divider, and squint at it. If nothing leads, or the lines are what you see first, a trap has caught it.

## Token bans

A few patterns are ruled out whatever the direction, because they are structural errors or reflexes that survive review because they're hard to name. Several match impeccable's deterministic checks.

- **A thick colored side stripe as decoration or as the main status signal** (`border-left: 4px solid` on callouts and cards). A thin edge that marks a selected row, beside its fill and checkbox, is a state detail, not this pattern.
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

How colorful surfaces and grays may be depends on the color presence the direction chose (quiet, brand, or tinted). The color guide's "How much color" gives the range for each, and `quality.color.commitment-level` checks the tokens against it.

## Review in both themes

Most quality problems show at a glance, if you look in the right way:

- **Squint at a real screen,** or blur it. The thing that needs action and the primary button should read first, the content next, the chrome last ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). If a panel, a selection, or the lines read first, a step is too strong.
- **Look at light and dark side by side.** A treatment tuned in light can turn loud in dark: an accent selection becomes a saturated band, a status-filled message becomes a heavy block. Change the treatment, not only the dark value (`opinion.both-themes`).
- **Ask whether the screen could belong to any product.** If it could, go back to the needs and the taste questions.

## Rules

The quality rules are listed at the end of this page and at `{{sistema_url}}/raw/rules`. All are advisory.

## Worked example: Relay

Relay's first run was technically sound: every contrast pair passed and the accessibility checker found nothing. The owner judged the result "more MS Office than Linear". Every plain-looking trap was present: an outline on every panel, chip, tooltip, and divider; radii of 2 to 8px; near-gray with a dark teal accent only on buttons; and page, panel, and menu as even steps of gray. The cause was in Sistema: the visual-language guide had turned "utilitarian" into a style, and the agent answered the taste questions itself.

The re-run asked the person each question with options rendered on Relay's own board. The result separates panels by shadow with no outlines, keeps borders on fields and table rows where they have a job, uses an 8px control radius scaled up to 14px for floating layers, tints the grays toward a violet accent, and lets the job that needs a technician lead.

Review in both themes then found two treatments that only worked in light: an accent-filled selected row and status-filled messages. Both became neutral, with the color as a detail, in both themes.

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
