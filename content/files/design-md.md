---
title: DESIGN.md
description: The file every agent in the project reads for the visual language. Values sit in generated front matter; the body names roles and explains how to use them.
sources:
  - { source: design-md, url: "https://stitch.withgoogle.com/docs/design-md/specification" }
  - { source: design-md, url: "https://stitch.withgoogle.com/docs/design-md/overview" }
last_reviewed: 2026-11-17
---

DESIGN.md sits at the project root. Coding agents read it before they touch the interface, so it is where the system's visual language is written down for them.

**What comes from where.** Sistema uses the DESIGN.md format published by Google Stitch (alpha). The file layout, the front matter keys and value types, the eight section names and their order, and the rules for unknown content on this page follow that format. How Sistema fills the file, which play writes each part, and the extra conventions (the pointer line, roles instead of values, provisional items) are Sistema's own.

## File layout

The file has two parts:

1. **Front matter:** YAML between two lines that contain only `---`. It holds the token values. In a Sistema project it is generated from the DTCG token files, so values are written in one place only.
2. **Body:** Markdown with one `##` heading per section. It says what each role is for and how to use it. An optional `#` title may come first; it isn't a section.

Right after the front matter, a Sistema project has one comment line pointing back to the workflow:

```
<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->
```

## Front matter

The token pipeline play writes the front matter from `tokens/src/` on every compile and marks it as generated. Don't edit it by hand.

| Key | Holds |
|---|---|
| `version` | Optional. The format version, currently `alpha` |
| `name` | The product's name, from `sistema.json` `project.name` |
| `description` | Optional. One line about the product |
| `colors` | Color roles, each a hex value such as `"#1A1C1E"` |
| `typography` | Type roles, each an object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and optionally `letterSpacing`, `fontFeature`, `fontVariation` |
| `rounded` | Radius levels, for example `sm`, `md`, `lg`, `full` |
| `spacing` | Spacing levels, each a dimension or a number |
| `components` | Optional. Per-component values, which may reference other tokens |

**Themes and modes:** the front matter holds the default theme's values only; the format has no place for dark or other modes. The Colors section says how the dark theme differs, by role, and the token files hold every mode's values.

**Value types:** colors are sRGB hex. Dimensions are a number with `px`, `em`, or `rem`. Line height may be unitless, which is preferred. A reference to another token is its path in curly braces, for example `"{colors.primary}"`. Outside `components`, a reference must point at a single value, not a group.

A short example:

```yaml
---
name: Ledger
colors:
  primary: "#1F5FD1"
  on-primary: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#16191D"
typography:
  body:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
---
```

## Sections

The body has these eight sections, in this order, each as a `##` heading. Sistema writes all eight. If a decision isn't made yet, the section says so (see "Provisional items" below) rather than being left out.

| Section | What Sistema puts there | Written by |
|---|---|---|
| Overview | The product, what its screens need, the approved direction (its direction values), and the emphasis map | `visual-language.direction` |
| Colors | Each color role, what it's for, which pairs go together, and what color never signals on its own | `visual-language.design-md` |
| Typography | Type roles by name, the typefaces, and how hierarchy is built | `visual-language.design-md` |
| Layout | The base spacing unit, density, how spacing grows from inside components to between sections, and the grid or container rules | `visual-language.design-md` |
| Elevation & Depth | Which layers float, and whether depth comes from shadow, surface tone, or both, in each theme | `visual-language.design-md` |
| Shapes | The radius personality and which component families use which level | `visual-language.design-md` |
| Components | The component families the product needs first, and how each uses the roles above | `visual-language.design-md` |
| Do's and Don'ts | Six to ten specific rules, each checkable by reading code | `visual-language.design-md` |

The format also accepts some alternate names: "Brand & Style" for Overview, "Layout & Spacing" for Layout, and "Elevation" for Elevation & Depth. Sistema writes the names in the table.

## Sistema's conventions

**Roles, not values.** The body names roles (`primary`, `on-surface`, `body`, `radius-md`) and explains when to use them. It doesn't repeat hex codes or pixel values, which live in the front matter. That way the body stays true when values change. (Rule `visual-language.design-md.roles-not-values`.)

**Provisional items.** Where the direction left something open, the section says so in one line: `Provisional: <what is undecided>. Set by <play id>.` The play named there settles it later.

**The emphasis map.** Overview records, per kind of screen, which content is featured, which zones are subtle, and what, if anything, is a brand or inverse block. It's stated once there, and page and component work reads it.

**Decisions live elsewhere.** DESIGN.md says what the system is. Why each choice was made goes in DECISIONS.md, and workflow progress goes in `sistema.json`.

## Unknown and invalid content

Tools that read DESIGN.md keep what they don't recognize: an extra section such as `## Iconography`, a color or type role with a name they don't know, or a spacing value that isn't a dimension. An unknown component property is accepted with a warning. A section heading that appears twice makes the file invalid.

## Checking a DESIGN.md

- Front matter opens and closes with `---` lines and parses as YAML.
- Every color is a hex value and every reference points at a token that exists.
- The body has the eight sections in order, with no heading repeated.
- The body names roles, not values.
- The pointer comment is present while a Sistema workflow is running.
