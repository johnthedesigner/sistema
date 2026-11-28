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

- **One typeface, set well** (`opinion.one-typeface-set-well`): a few weights, medium for labels, tighter tracking at large sizes, tabular figures for data. A second face needs a reason.
- **A scale from the type scale tool,** from a base size and a ratio. Steps can be tuned by hand where the ratio lands badly; record why.
- **Roles on top of the scale.** Components use roles such as `body` and `label`, each with its own size, line height, weight, and tracking. The person chooses how roles are named.
- **Minimums from the rules.** Required values come from the project's accessibility standard. The ranges on this page are guidance.

Which typeface is a taste question, answered by seeing options on a screen like the product's.

```specimen
type-scale base=13 ratio=major-second down=2 up=5 roles=label:-1,body:0,heading:1,title:4,metric:5
A compact scale: base 13px, ratio 1.125. Shown in this site's typeface.
```

## The density axis comes first

How much fits on a screen shapes the scale more than any style does.

- **Dense** (dashboards, admin tools, editors): people scan. Use a small base, small steps, and tighter line heights.
- **Reading** (articles, docs, marketing): people read. Use a larger base, bigger steps, and generous spacing.
- **Mixed** (most products): dense chrome around readable content. Use one long scale, or two sets: one for interface text, one for content.

A single short scale that tries to serve both usually serves neither.

## Scale construction: modular vs. hand-tuned

**Modular:** each step is the previous one times a ratio.

| Ratio | Steps | Suits |
|---|---|---|
| 1.125 | Small | Dense interfaces |
| 1.2 | Moderate | Most product interfaces |
| 1.25 | Clear | General products |
| 1.333 | Large | Wide ranges, strong headings |
| 1.414 and up | Very large | Display and marketing only |

The ratio matters most at the small end. Above about 1.333, a product scale runs out of useful middle steps.

**Hand-tuned:** pick the sizes, then check the jumps feel even. Use it to land on whole pixels, to cover a very wide range, or to keep an existing brand scale.

**In practice,** most systems use a ratio as a guide and tune a few steps. List the final sizes; don't describe the scale by a ratio it no longer follows.

## Naming type

Names can say what text is for (`body`), how big it is (`text-sm`), or both. Systems differ widely here.

| Approach | Example names | Used by |
|---|---|---|
| Role families in sizes | `display-lg`, `title-sm`, `body-md`, `label-sm` | Material |
| A heading ladder plus body | `heading-xl` to `heading-xs`, `body`, `code` | Atlassian, Carbon (numbered) |
| Numbered steps | `1` to `9` | Radix, Ant Design |
| Size names, roles in components | `text-xs` to `text-9xl` | Tailwind, shadcn/ui, Primer (with a few roles) |

- **Role families** guide most, at the cost of many names.
- **A heading ladder** is simpler and fits most products.
- **Numbered steps** give freedom; the meaning lives in components.
- **Size names** fit utility CSS, but the same element can drift between sizes.

Long-form content is often styled from a few settings (base size, line height, block spacing) rather than per element. shadcn/ui's Typeset works this way.

### Choosing an approach

1. **Keep names DESIGN.md already uses.**
2. **Follow the component library's convention:** Tailwind sizes plus role tokens for shadcn/ui; numbered steps for Radix Themes; role families for Material; Carbon's sets for Carbon.
3. **Otherwise, match the product's size:** a heading ladder for one team; role families for many teams; numbered steps for a library others build on.

Propose one and let the person choose.

## Choosing a typeface

- **Figures:** tabular figures for data, and digits that are hard to confuse.
- **Distinct letters:** `1`, `l`, `I` and `0`, `O` differ clearly where codes and names are read quickly.
- **x-height:** a larger x-height reads bigger at small sizes.
- **Weights:** regular and medium, clearly different at small sizes.
- **Availability:** from Google Fonts, a font CDN, or a license the project holds.

Add a second face only for a job the first can't do, such as display type for marketing or monospace for code. Tabular figures often cover IDs and times.

### Two tiers, whatever the names

The size scale is the primitive tier. Roles (`body`, `label`, `heading`) point to sizes and set weight, line height, and tracking (`opinion.two-tiers`, rule `typography.roles.distinct`). In Tailwind, a role can be a theme variable: `--text-body` creates a `text-body` utility.

## Legibility

Guidance from typographic practice. Required minimums come from the project's standard: rule `typography.text-spacing`, and for AAA projects, rule `typography.line-height.body`.

### Line height

Line height shrinks as size grows:

| Text | Typical line height |
|---|---|
| Display, 48px and up | 1.05 to 1.1 |
| Large headings | 1.1 to 1.2 |
| Small headings | 1.2 to 1.35 |
| Body | 1.4 to 1.6 |
| Small labels | 1.3 to 1.5 |

Set line height per role, not once globally. Use unitless values, so they scale with the font size.

### Line length

Aim for about 45 to 90 characters per line for body text. Longer lines need more line height.

### Letter-spacing

Slightly open at small sizes, unchanged at body sizes, slightly tight at display sizes. Large type looks loosely spaced at its default tracking.

### X-height and apparent size

Two typefaces at the same size can look different sizes. When switching typefaces, check sizes again.

## Variable fonts

Worth it when the system uses four or more weights, or needs optical sizing across a wide range. Expose a few named weights, not the raw axis. With two or three weights, static files are simpler.

## How typography interacts with the spacing system

- **Spacing base.** Sistema's default spacing unit is 4px. Type changes which spacing steps text uses, not the unit.
- **A useful check:** the gap between related text blocks is usually about half to three quarters of the body line height.
- **Control height** combines the label's line height and padding, and must meet the project's minimum target size (rule `accessibility.target-size`).
- **Columns** should keep body text within a comfortable line length.

## Rules

Listed at the end of this page and at `{{sistema_url}}/raw/rules`. Minimum sizes and line heights come from the project's standard, through the rules registry.

## Worked example: Relay

Relay is a dense dispatch board. Job numbers, times, and names are read at small sizes all day.

- **Typeface:** Atkinson Hyperlegible Next, at 400, 500, and 600, chosen from three options. Tabular figures cover job numbers and times, so there's no second face.
- **Scale:** base 13px, ratio 1.125. Label 12, body 13, heading 15, title 21, metric 23. The overline is tuned up to 11px, because the next step down is 10px.
- **Names:** Relay uses shadcn/ui, so sizes take Tailwind names, and roles (`type.body`, `type.label`, `type.metric`) are separate tokens.
- **Spacing:** a 4px unit; controls 28px, table rows 36px.

## Failure modes

- **Too many sizes,** or one-off sizes in components.
- **A display face in a dense tool,** or a second face with no job.
- **Bold as the only hierarchy.**
- **Tiny bottom steps** from a ratio, used for real text.
- **One global line height.**
- **Proportional figures in tables.**

## Checking the work

- The type scale tool's checks on each step.
- The type specimen on the token check page, in the real typeface.
- Text still fits with increased spacing (rule `typography.text-spacing`).
- Hierarchy reads on a real screen without color.

## Plays

- `typography.scale` builds the scale and roles.
- `visual-language.direction` asks the typeface question.
