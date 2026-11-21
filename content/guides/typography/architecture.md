---
title: "Typography"
description: "How Sistema builds type: one typeface set well, a scale from the type scale tool, role names the person chooses, legibility from the rules, and how type fits the spacing system."
topic: typography
sources:
  - { source: material, url: "https://m3.material.io/styles/typography" }
  - { source: carbon, url: "https://carbondesignsystem.com/elements/typography/overview/" }
  - { source: radix, url: "https://www.radix-ui.com/themes/docs/theme/typography" }
  - { source: atlassian, url: "https://atlassian.design/foundations/typography" }
  - { source: ant-design, url: "https://ant.design/docs/spec/font" }
  - { source: primer, url: "https://github.com/primer/design/blob/main/content/foundations/typography.mdx" }
  - { source: tailwind, url: "https://tailwindcss.com/docs/font-size" }
  - { source: tailwind, url: "https://tailwindcss.com/docs/theme" }
  - { source: shadcn, url: "https://ui.shadcn.com/docs/components/radix/typography" }
  - { source: shadcn, url: "https://ui.shadcn.com/docs/typeset" }
  - { source: typographic-scale, url: "https://spencermortensen.com/articles/typographic-scale/" }
  - { source: practical-typography, url: "https://practicaltypography.com/typography-in-ten-minutes.html" }
  - { source: practical-typography, url: "https://practicaltypography.com/body-text.html" }
  - { source: practical-typography, url: "https://practicaltypography.com/line-spacing.html" }
related:
  - guide.tokens.architecture
  - guide.spacing.layout
last_reviewed: 2026-11-20
---

# Typography

## Where Sistema stands

Type carries most of an interface's hierarchy, so it's set early and set carefully. Sistema's defaults:

- **One typeface, set well** (`opinion.one-typeface-set-well`): a good sans in two or three weights, medium for labels and emphasis, tighter tracking at large sizes, tabular figures for data. A second face only with a reason.
- **A scale from the type scale tool,** built from a base size and a ratio. Steps may be hand-tuned where the ratio lands badly, and each tuned step is recorded with its reason.
- **Roles on top of the scale.** Components use roles (`body`, `label`, `heading`), each with its own size, line height, weight, and tracking. How the roles are named is the person's choice.
- **Legibility from the rules.** Minimums that every project must meet come from its accessibility standard, through the rules registry. The ranges on this page are guidance.

Which typeface is a taste question, asked at the direction with the options set on the product's own screens.

```specimen
type-scale base=13 ratio=major-second down=2 up=5 roles=label:-1,body:0,heading:1,title:4,metric:5
Relay's scale: base 13px, ratio 1.125 (a major second), with its roles. Set here in this site's typeface; Relay uses Atkinson Hyperlegible Next. Relay's overline is hand-tuned to 11px, because the tool's step below the label is 10px.
```

---

## The density axis comes first

Before selecting a scale or ratio, identify where your product sits on the density axis. This single decision shapes more of your typography architecture than any aesthetic preference.

**Information-dense contexts** (data tables, dashboards, admin tools, code editors, developer interfaces):
- More text elements compete for vertical space
- Users scan rather than read — hierarchy needs to be legible at a glance
- Generous line heights waste space that could show more data
- Scale steps are closer together — fewer jumps between the smallest and largest sizes used in a single view

**Reading and editorial contexts** (marketing pages, documentation, blog content, onboarding flows):
- Text is read, not scanned
- Visual impact of large type is part of the communication
- Generous spacing aids comprehension
- Scale covers a wider range with more dramatic steps

**Mixed contexts** (most products):
- App shells and navigation are dense; content areas are editorial
- The same scale must serve both modes, either through separate sub-scales or through using different ranges of a single scale

Most design systems serving mixed contexts either split into two explicit type sets (dense-UI and editorial) or define a long scale with enough steps to cover both ranges without compromise. Neither approach is wrong; the mistake is designing a single short scale that tries to work in both contexts and does neither well.

---

## Scale construction: modular vs. hand-tuned

### Modular scales

A modular scale is a geometric sequence — each step is the previous step multiplied by a fixed ratio. The mathematical structure ensures that all size relationships are consistent. The visual result is a set of sizes where the perceived jump between any two adjacent steps feels equivalent throughout the scale.

**Choosing a ratio:**

| Ratio | Character | Works well for |
|---|---|---|
| 1.125 (Major Second) | Small, tight steps | Dense UI scales; many usable intermediate sizes |
| 1.200 (Minor Third) | Moderate steps | Enterprise product UI; enough hierarchy without drama |
| 1.250 (Major Third) | Clear steps | General-purpose product scales; comfortable heading contrast |
| 1.333 (Perfect Fourth) | Pronounced | Scales covering a wide size range; strong heading contrast |
| 1.414 (Augmented Fourth) | Bold | Expressive layouts; display-heavy designs |
| 1.618 (Golden Ratio) | Very large | Marketing/poster work; typically too dramatic for multi-step UI scales |

The ratio is most consequential at the small end of the scale. A 1.333 ratio from a 14px base gives 19px, 25px, 33px for the next three steps — clean for headings. The same ratio from a 12px base gives 16px, 21px, 28px. The base and ratio together determine whether the scale steps fall on workable values.

Modular scales with ratios above 1.333 tend to produce too few usable intermediate steps for a product scale (which needs 7–12 named sizes from label to display). They work better as a 4–6 step display-only scale with a separate, tighter base scale for UI text.

### Hand-tuned scales

A hand-tuned scale starts from a list of desired sizes and works backward to verify the relationships are acceptable. The classical typographic scale (6–7–8–9–10–11–12–14–16–18–21–24–30–36–48–60–72pt) is hand-tuned from centuries of printing practice and approximates a geometric ratio of ~1.14 with some deliberate deviations.

**Use hand-tuning when:**
- You have specific pixel values that must land on clean numbers (a modular scale from 14px at 1.25× gives 17.5px — not ideal)
- The scale needs to cover an unusually wide range (11px to 60px) and no single ratio produces good steps throughout
- You are adapting an existing brand scale that doesn't follow a clean ratio

**Use a modular scale when:**
- You want the mathematical regularity to enforce consistency as the scale grows
- The design tool or framework will generate intermediate values (e.g. tokens computed from base + ratio)
- You want to be able to explain the scale's structure to others without enumerating every value

### The practical middle path

Most production design systems use a hybrid: a loosely modular structure as a guide, with deliberate deviations to land on clean values and preserve good line-height relationships. Define the scale by listing its values — don't describe it by ratio unless the ratio holds cleanly across the full range.

---

## Naming type

How a type system names its sizes shapes how people use it. A name can say what the text is for (`body`, `heading-lg`), how big it is (`text-sm`, size 3), or both. Design systems and libraries differ here more than almost anywhere else, and there is no single right answer. The best choice depends on what the project builds on and how complex it will get.

### Four approaches

| Approach | Example names | Used by |
|---|---|---|
| **Role families, each in sizes** | `display-lg`, `headline-md`, `title-sm`, `body-md`, `label-sm` | Material Design (display, headline, title, body, label, each large, medium, small) |
| **A heading ladder plus body** | `heading-xl` to `heading-xs`, `body`, `body-sm`, `code`; or numbered, `heading-01` to `heading-07` | Atlassian (named sizes); Carbon (numbered, with separate sets for product UI and expressive pages) |
| **Numbered steps** | sizes `1` to `9` | Radix Themes; Ant Design (`fontSize`, `fontSizeSM`, `fontSizeLG`, `fontSizeHeading1` to `5`) |
| **Magnitude sizes, roles in components** | `text-xs` to `text-9xl` | Tailwind; shadcn/ui, which ships no type tokens and styles each element by combining a size with weight, tracking, and color. Primer pairs a size scale (`xs` to `2xl`) with a few named roles |

**What each is good at:**
- **Role families** give the most guidance. Every name says what it's for, so teams drift less. The cost is a large set (often 15 roles) and names that can feel wrong when a size is right but the role isn't.
- **A heading ladder** is simpler: one family for hierarchy, a few body sizes, and specialist roles like `code` and `caption`. It fits most product interfaces.
- **Numbered steps** give the most freedom. Components choose a step, and the meaning lives in the component. They suit libraries that other teams compose with.
- **Magnitude sizes** match utility-first CSS. They make a size easy to apply anywhere, which is also their risk: without roles, the same element gets different sizes in different places.

Long-form content (docs, articles, chat messages) is often styled differently from interface text: from a few controls, such as base size, line height, and the space between blocks, from which heading sizes and spacing are derived. shadcn/ui's Typeset works this way. It complements any of the four approaches rather than replacing them.

### Choosing an approach

1. **If DESIGN.md already names type roles, keep them.** Renaming costs more than it gains.
2. **If a component library is chosen, follow its convention,** so tokens map onto its components without translation:

   | Library | Follow |
   |---|---|
   | shadcn/ui, or plain Tailwind | Tailwind's magnitude sizes, plus role tokens for the roles the product uses (see below) |
   | Radix Themes | Its numbered steps (1 to 9) |
   | Material UI, or Material components | Material's role families |
   | Carbon | Carbon's type sets |

3. **Otherwise, size it to the product's expected complexity:**
   - **One product, one team, a modest number of screens:** a heading ladder with about six to eight roles.
   - **Several teams, many screens, or content-heavy products:** role families, because names that state purpose keep teams consistent.
   - **A component library for others to build with:** numbered steps underneath, with roles defined by the components.

   Propose one, say why, and let the person choose. It's a matter of judgment, not a rule.

## Choosing a typeface

The direction offers about three typefaces suited to the product, each set on the product's own screen. What to look for:

- **Figures.** For data, tabular figures (every digit the same width) so columns line up, and digits that are hard to confuse.
- **Distinct letter shapes.** `1`, `l`, and `I`, and `0` and `O`, should differ clearly where codes, IDs, or names are read quickly.
- **x-height.** A larger x-height reads bigger at small sizes, which matters in dense interfaces; it also changes how big a given size looks (see "X-height and apparent size").
- **Weights.** At least regular and medium (often semibold) that are clearly different at small sizes.
- **Availability.** Loadable from Google Fonts or a font CDN, or licensed for the project, with the weights it needs.

A second face needs a job the first can't do: a display face for a marketing site, a monospace for code. Tabular figures usually cover IDs and times in a product interface, so a monospace is often unnecessary.

### Two tiers, whatever the names

Sistema's token model has two tiers (opinion `two-tiers`), and that holds for type too. The convention decides how the size scale is named. On top of it, the product's roles (`body`, `label`, `heading-lg`, and so on) are semantic tokens that point at sizes and set weight, line height, and tracking. Rule `typography.roles.distinct` applies to those roles.

With Tailwind, role tokens can be theme variables too. Declaring `--text-body` (with its own line height, tracking, and weight) creates a `text-body` utility beside `text-sm`. Components then use the role, and the magnitude scale stays available for one-off cases.

---

## Legibility

These ranges come from reading research and typographic practice. They're guidance with reasons, and the right value depends on the typeface, size, and measure. The requirements that apply to every project come from its accessibility standard: rule `typography.text-spacing` (WCAG 1.4.12 at AA) and, for AAA projects, rule `typography.line-height.body` (WCAG 1.4.8).

### Line height

**Body text:** typical line height is about **1.3 to 1.6 times the font size**. Sources differ: print-oriented guides suggest 1.2 to 1.45, while interface systems usually set 14 to 18px body text at 1.4 to 1.6. Below 1.2, lines feel cramped. Above about 1.6, the space between lines starts to compete with the lines themselves.

**Per-size calibration:** The optimal line-height ratio is not constant across the scale. It decreases as font size increases:
- Display / hero (48px+): 1.05–1.1
- Large heading (28–36px): 1.1–1.2
- Small heading (18–24px): 1.2–1.35
- Body (14–18px): 1.4–1.6
- Small / label (11–13px): 1.3–1.5

This is why a correct type system specifies `line-height` per role, not once globally. A global `line-height: 1.5` is too generous at display sizes and may be too tight at the smallest sizes if the product uses 11px labels.

**Always use unitless values:** CSS `line-height` should be a bare number, not a `px` or `em` value. Unitless values are inherited as a multiplier and recalculate correctly when child elements have different font sizes. A `px` value is inherited as a computed value — child elements with different font sizes inherit the wrong line height.

### Line length (measure)

**Optimal: 45–90 characters per line for body text.** Outside this range, readability degrades.

- Below 45 characters: excessive line breaks disrupt reading flow, especially for multi-clause sentences
- Above 90 characters: the eye loses its return position, making line-finding effortful for sustained reading

This translates to a content column width of roughly 480–720px at 16px body text (depending on typeface). Components that constrain content width (cards, panels, inline edits) implicitly control measure. When designing these components, verify that the text at the intended width stays within the optimal range.

Line length and line height interact: longer lines require more line height. When you have no choice but to use a wider column, compensate with more generous line spacing.

### Letter-spacing at scale

Letter-spacing should move in the same direction as reading demands:
- **Small sizes (≤ 12px):** slight positive tracking (+0.01–0.03em) opens the letterforms and aids legibility under compression
- **Body sizes (14–18px):** zero or minimal adjustment (0 to +0.005em); the font's default tracking is calibrated for this range
- **Display sizes (24px+):** negative tracking (–0.01em to –0.025em) compensates for optical spread — large letterforms appear loosely spaced at default tracking, and negative values restore apparent density

This is not an aesthetic preference. A 60px heading with default tracking will visually appear to have too much space between letters, even if the measurement is technically zero. Negative tracking at display sizes is the correct choice.

### X-height and apparent size

Two fonts at the same CSS font-size may appear visually different sizes. The cause is x-height: the ratio of lowercase letter height to the total em square. A high-x-height font at 14px looks larger than a low-x-height font at 14px.

**Implications:**
- When switching typefaces, the specified sizes may need adjustment. An 18px body in Roboto (high x-height) will look larger than 18px in a low-x-height typeface; you may need to step up to 19–20px to match the visual weight.
- This is why some systems expose a `font-size-adjust` token (or equivalent) that multiplies the step size for a specific typeface — not changing the scale, just correcting for x-height differences

---

## Variable fonts: when the complexity is worth it

Variable fonts encode a continuous range of variation axes in a single font file, rather than discrete font weights and styles. The browser can render any point along each axis.

**The common axes and when they matter:**

| Axis | Tag | Effect | Worth the complexity when… |
|---|---|---|---|
| Weight | `wght` | Continuous weight from thin to black | You use more than 2–3 weights, or need micro-weight adjustments for display text |
| Width | `wdth` | Compressed to expanded | You need condensed variants for data display (fixed-width columns at small sizes) |
| Optical size | `opsz` | Adjusts design for small vs. large rendering | You're using a typeface with an optical size axis and the system covers a wide size range |
| Italic/Slant | `ital`/`slnt` | True italic vs. slanted roman | You want true italics without loading a separate italic file |

**The real cost of variable fonts** is not file size (variable fonts are often smaller than multiple static files) but cognitive complexity in the token system. If you expose the weight axis as a continuous range, developers must decide what value to use rather than picking from a finite set of named weights. Most systems expose variable font axes through a fixed set of named tokens (`weight-regular: 400`, `weight-medium: 500`, `weight-bold: 700`) rather than exposing the axis directly.

**When variable fonts add clear value:**
- The system uses 4+ weight variants (the file size savings are real)
- You need optical-size adjustment across a wide scale (11px to 60px) and the typeface has an `opsz` axis
- The product has a true condensed-layout mode where `wdth` compression is genuinely needed

**When to skip them:**
- The product uses two weights (regular + bold). Load two static files; simpler.
- The chosen typeface doesn't have variable axes that map to your system's needs
- The team using the system isn't equipped to reason about axis values

---

## How typography interacts with the spacing system

Typography and spacing are not independent. Every decision in the type scale has a corresponding constraint in the spacing system.

**Line height and vertical rhythm:** The line height of body text typically becomes the base unit for vertical spacing within a text container. If body text has a 24px line height, vertical margins between paragraphs should be multiples or fractions of 24px — this creates visual rhythm. Systems with a strict 8px spacing grid work well with 16px/24px line heights (multiples of 8); they work poorly with 20px or 22px line heights.

**Scale steps and component height:** Interactive components (buttons, form fields, select controls) have a minimum height that should relate to the type scale. A button using `label-large` text at 14px/20px line height needs enough vertical padding to meet the project's minimum target size (rule `accessibility.target-size`). For example, reaching the WCAG 2.5.5 (AAA) size takes 14px + (2 × 15px padding) = 44px, where the 15px padding is a spacing system value. When the type scale changes, the component height tokens that reference it may also need adjustment.

**Spacing and type density:** A dense type scale (small steps, small base) wants proportionally tighter spacing. The spacing scale's base unit is 4px in every Sistema project (the spacing guide); type doesn't change the base, it changes which steps the components use. As a check, the gap between related blocks of text usually lands near half to three quarters of the body line height: with a 20px line height, 12 or 16px. If the common gaps are far outside that, the spacing steps chosen for text are too loose or too tight for the type.

**Type and layout columns:** Measure (line length) constrains column width. If optimal measure for your body text is 45–75 characters, and body text is 16px in a regular-width sans-serif, the optimal column width is roughly 520–680px. Layout columns should be defined to land content containers within this range. Design systems that define content column widths separately from the type system often produce column widths that are too wide (90+ characters per line) or too narrow (35 characters per line) for the specified body size.

---

## Decision summary

| Decision | Ask first | Then |
|---|---|---|
| Scale construction | Hand-tuned or modular? | Modular if consistency > specific values; hand-tuned if specific values > consistency |
| Ratio | Dense or editorial? | 1.125–1.200 for dense; 1.250–1.333 for mixed; 1.333+ for editorial-only |
| Naming type | Is a component library chosen? | Follow its convention. Otherwise size it to the product's complexity: a heading ladder for one team, role families for many, numbered steps for a library others build on |
| Line height | Specified per role? | Always. One global value is wrong for both ends of the scale |
| Variable fonts | 4+ weights needed? | Yes: consider variable font. 2–3 weights: load static files |
| Spacing relationship | 8px grid? | Verify body line height is a multiple of the grid base; adjust either if not |

## Rules

The typography rules are listed at the end of this page and at `{{sistema_url}}/raw/rules`. Minimum sizes and line heights depend on the project's accessibility standard and live only in the rules registry.

## Worked example: Relay

Relay is a dense dispatch board: job numbers, times, and technicians' initials are read at small sizes all day.

- **Typeface.** The direction offered Inter, IBM Plex Sans (proposed for its distinct figures and letter shapes), and Atkinson Hyperlegible Next. The person chose Atkinson, a face designed for legibility, at weights 400, 500, and 600. No second face: tabular figures cover job numbers and times.
- **Scale.** The type scale tool at base 13px and ratio 1.125: label 12, body and data 13, heading 15, title 21, metric 23. The overline is hand-tuned to 11px, because the tool's next step down is 10px, too small for anything people need to read; the tuning is recorded in the token's description.
- **Roles and names.** Relay uses shadcn/ui on Tailwind, so the size scale takes Tailwind's magnitude names (`size.sm`, `size.base`) and the roles are their own tokens (`type.body`, `type.label`, `type.overline`, `type.metric`), each with a line height, weight, and tracking. The compiled roles become utilities (`text-body`), and tabular figures are part of the `data` and `metric` roles.
- **Spacing.** Body text at 13px with a line height of about 1.5 sits on a 4px spacing scale; controls are 28px tall and table rows 36px.

## Failure modes

- **Too many sizes.** More than about eight sizes in a product interface, or one-off sizes in components, so hierarchy stops reading.
- **A display face in a dense tool,** or a second face with no job.
- **Weight as the only hierarchy,** with bold everywhere, so nothing stands out.
- **Steps too small at the bottom,** where a ratio produces a 9 or 10px size that ends up on real text.
- **One global line height,** too loose for headings and sometimes too tight for small labels.
- **Proportional figures in tables,** so numbers don't line up.

## Checking the work

- **The type scale tool** reports each step's size and suggested line height and flags sizes below the project's small-text note.
- **The type specimen** on the token check page shows every role in the real typeface, in every theme.
- **The text spacing check** (rule `typography.text-spacing`): text still fits when line height, paragraph, letter, and word spacing are increased as the standard describes.
- **Read a real screen** at the product's density, and check that hierarchy reads without color.

## Plays

- `typography.scale` builds the scale and the roles.
- `visual-language.direction` asks the type question and records the typeface.

