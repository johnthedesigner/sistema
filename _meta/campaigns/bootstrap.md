You are running the **Bootstrap a Design System** campaign. This is a self-driving multi-phase process. You will complete each step sequentially, ask the user for input when you need it, and pause for confirmation before advancing. Do not begin a step until the previous one is complete.

**If any prompt in this campaign references `{{sistema_url}}/raw/...`, fetch those URLs to load the reference material before proceeding with that step.**

---

## Standing quality directive

Your primary success criterion throughout this campaign is production quality — decisions that are specific, intentional, and defensible. Functional correctness is the floor, not the ceiling.

Before marking any step complete, hold the output to this test: would a senior product designer recognize this as production-ready work, or does it read as a safe first draft? Specific patterns that signal low quality: generic medium-blue primary color with no justification, near-white surfaces with no intentional hue temperature, the same border-radius applied uniformly to every component, type scale roles differentiated only by size, spacing that follows no discernible system.

When a decision is underspecified, make the specific choice and explain your reasoning. Do not silently apply a safe default. If a decision requires information you don't have — a brand color, a product name, an aesthetic direction — ask the user before proceeding. Do not assume or invent.

---

## Campaign map

**Phase 1 — Foundation**
1. **establish-context** — Scan the project, fill gaps with targeted questions, produce LIVING_BRIEF.md
2. **positioning-brief** — Establish the product's design stance (may be folded into Step 1 if starting fresh)

**Phase 2 — Visual Language**
3. **establish-visual-language** — Translate positioning to specific visual direction; generate style-preview.html for human review
4. **generate-design-md** — Generate the full DESIGN.md scaffold from the approved visual direction

**Phase 3 — Token System**
5. **generate-color-scheme** — Generate semantic color role tokens as CSS custom properties
6. **generate-type-scale** — Generate a modular type scale with leading and tracking
7. **generate-shape-tokens** — Generate shape tokens: radius, elevation, border width
8. **generate-style-dictionary** — Export the token set as Style Dictionary v5 source JSON

**Phase 4 — Component Build-out** *(runs after Phase 3 is approved)*
9. **scaffold-core-components** — Implement a core component set using the token system
10. **generate-page-examples** — Generate 1–2 full-page HTML examples demonstrating the system in use
11. **setup-documentation-site** — Set up a lightweight documentation site

Begin Step 1 now.

---

## Step 1 — establish-context

You are establishing the full context for this design system project before any decisions are made. Your job is to build a complete picture by reading what exists first, then asking only for what is missing.

**Step 1a — Scan the project:**

Before asking anything, check for these files if they exist:
- `LIVING_BRIEF.md` — existing positioning decisions and system state
- `DESIGN.md` — existing token and visual language decisions
- Any `package.json` or framework config — technology constraints
- Any existing CSS or token files — what token naming and values are already in use

Summarize what you found. State explicitly: which of the intake questions below are already answered by reading the project.

**Step 1b — Ask only what is missing:**

Work through the following questions. Skip any already answered from the scan. For any vague answer, ask for a specific clarification before moving on.

1. **Product type and context:** What kind of product is this? Who are the primary users and what are they trying to accomplish?
2. **Information density:** Content-dense (tables, dashboards) or content-sparse (focused flows, marketing)? Or both?
3. **Brand stance:** Where on the expressive ↔ utilitarian spectrum? (Expressive = personality, visual distinctiveness. Utilitarian = clarity, cognitive load reduction.)
4. **Existing visual character:** Is there an existing brand guide, style tile, or reference design to honor? Or blank canvas?
5. **Color constraints:** Existing brand color (hex preferred)? Colors to avoid?
6. **Theme:** Light only, dark only, or both? If both — which is primary?
7. **Platform and scale:** Web, mobile, or cross-platform? One team or multiple? Component count: small (<20), medium (20–60), large (60+)?
8. **Accessibility:** WCAG 2.2 AA, or a stronger requirement?
9. **Technology:** Framework, CSS approach, design tool, component library? Any constraints on token format or build tooling?

**Step 1c — Write LIVING_BRIEF.md:**

Populate all sections. Leave Key Decisions entries as `[to be determined — {reason}]` for anything not yet resolvable.

```
# LIVING_BRIEF.md

*Per-project state document. Read at session start; append to at session end.*

---

## 1. Project Identity

**Product:** [name and one-sentence description]
**Audience:** [who uses it and what they are trying to do]
**Density:** [content-dense / content-sparse / balanced]
**Theme:** [light only / dark only / both — primary: light/dark]
**Stance:** [expressive ↔ utilitarian placement and brief rationale]
**Technology:** [framework, CSS approach, design tool]

---

## 2. Key Decisions

**Color:** [existing brand color or TBD]
**Typography:** [existing typeface decisions or TBD]
**Spacing:** [to be determined]
**Shape:** [to be determined]
**Motion:** [to be determined]
**Tokens:** [format and build tooling or TBD]

---

## 3. Current State

**Token files:** none yet
**Components implemented:** none yet
**Components stubbed:** none yet
**Known gaps:** Token architecture not yet established.

---

## 4. Open Questions

- [ ] Dark mode trigger mechanism (if applicable)
- [ ] Component count estimate

---

## 5. Decision Log

*[today's date] — Context established — [one-line summary of key findings and stance decisions]*
```

### Before proceeding to Step 2

- [ ] `LIVING_BRIEF.md` exists with all sections populated
- [ ] Density, theme, and brand stance are resolved
- [ ] Technology constraints are recorded

**Pause here.** Summarize what was established in 2–3 sentences, then ask: *"Step 1 complete. Ready to proceed to Step 2 — establishing the visual language?"*

---

## Step 2 — establish-visual-language

You are translating the positioning brief into a specific visual direction before any token values are generated. The output is `style-preview.html` — a static, self-contained HTML file that demonstrates the proposed color, typography, shape, and surface treatment for human review. **No token generation begins until this artifact is approved.**

**Step 2a — Read the living brief and references:**

Read `LIVING_BRIEF.md`. Confirm: product identity, density, theme scope, brand stance, and any existing visual decisions.

Fetch and read the following from the Sistema knowledge base:
- Visual language translation framework: `{{sistema_url}}/raw/principles/visual-language/overview`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`
- Style tile format specification: `{{sistema_url}}/raw/principles/visual-language/style-tile-format`

**Step 2b — Produce the visual direction brief:**

Before generating any HTML, state the visual direction brief (5 items):

1. Which 2–3 aesthetic frameworks does this product draw from? (Reference the translation framework.)
2. What is the OKLCH color commitment level and why?
3. What is the typographic character: weight range, size range, typeface approach?
4. Where on the sharp ↔ rounded spectrum does this product sit?
5. What does this system explicitly NOT look like? (2–3 specific exclusions.)

Run the AI slop first-order reflex check: are any of these preliminary choices category-obvious defaults? If so, justify them explicitly or adjust.

**Step 2c — Generate style-preview.html:**

Generate a `style-preview.html` file per the style tile format specification. All seven sections required:

1. Visual direction statement (the brief from Step 2b, rendered in the file)
2. Color palette (all proposed colors as swatches; hex and OKLCH values; contrast ratios)
3. Typography specimens (each role rendered with sample text; annotated with size/weight/line-height/tracking)
4. Shape and radius specimens (each radius token and shadow level)
5. Surface treatment (default/raised/overlay surfaces; composite card specimen)
6. Color in context (primary in interactive elements; semantic colors in state examples)
7. Reviewer notes (explicit checklist of decisions requiring human judgment)

Technical requirements: self-contained HTML, no external dependencies, all colors shown as hex and OKLCH.

Quality checks before writing the file:
- Commitment level is consistent across all surface and neutral token chroma values
- Primary color passes the first-order reflex test
- All proposed values checked against the absolute bans list
- On-* pairings flagged for any contrast that should be manually verified

Write the file to `style-preview.html` at the project root.

**Step 2d — Request review:**

Present the visual direction brief as a 5-bullet summary. Then say:

*"style-preview.html is ready for review. Open it in a browser and evaluate each section. Key decisions to focus on: [list 3–4 choices that required judgment]. When you are satisfied, tell me to proceed — or tell me what to change."*

**Do not proceed to Step 3 until the user approves the style tile.**

**Step 2e — Update the living brief after approval:**

Update Key Decisions with the approved visual direction. Append to the Decision Log:
```
[date] — Visual language established — [commitment level, primary color, typographic character, radius personality]
```

### Before proceeding to Step 3

- [ ] `style-preview.html` exists at the project root
- [ ] All seven sections are present per the format specification
- [ ] Visual direction brief is stated in the file
- [ ] User has explicitly approved the style tile
- [ ] LIVING_BRIEF.md updated with approved visual direction

**Pause here.** Ask: *"Step 2 complete. Visual language approved. Ready to proceed to Step 3 — generating DESIGN.md?"*

---

## Step 3 — generate-design-md

You are generating a `DESIGN.md` file — a concise specification document that describes the design system's visual language for use with AI coding tools.

**Step 3a — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. The approved visual direction from Step 2 is the primary source for visual values. Confirm the product identity, density, theme, and all visual direction decisions.

**Step 3b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- DESIGN.md format specification: `{{sistema_url}}/raw/standards/design-md/spec`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

The spec file defines the exact format, YAML schema, section order, and token types. The token architecture synthesis explains the tier model and naming principles.

**Step 3c — Generate the DESIGN.md:**

Generate a complete `DESIGN.md` file following the specification exactly. Every section defined in the spec must be present. Values should reflect the approved visual direction from `style-preview.html`. Where a value is genuinely undetermined, mark it `[TBD]` with a note.

Quality standard: every value in DESIGN.md should be defensible. If choosing a value that will be overridden by a later token-generation step, mark it provisional. If choosing a value that directly reflects the approved visual direction, reference it.

Write the file to `DESIGN.md` at the project root.

**Step 3d — Update the living brief:**

Append to the Decision Log:
```
[date] — DESIGN.md generated — [note key decisions made and any provisional values]
```

### Before proceeding to Step 4

- [ ] `DESIGN.md` exists at the project root
- [ ] All required sections from the spec are present
- [ ] No section is empty — provisional values are marked `[TBD: reason]`, not omitted
- [ ] Quality check: does DESIGN.md reflect the approved visual direction, or does it feel generic?

**Pause here.** Ask: *"Step 3 complete. DESIGN.md generated. Ready to proceed to Step 4 — generating the color palette?"*

---

## Step 4 — generate-color-scheme

You are generating a complete color scheme — semantic color role tokens as CSS custom properties, ready to ship.

**Step 4a — Confirm color input:**

Review the approved visual direction in LIVING_BRIEF.md. Confirm:
1. What is the primary brand color? (Should be recorded from Step 2.)
2. Theme scope: light only, dark only, or both?
3. What is the OKLCH commitment level? (Should be recorded from Step 2.)

If any of these are missing, ask before proceeding.

**Step 4b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

The color architecture synthesis explains the four major architectural models, contrast requirements, and dark mode tonal shift logic. The visual quality signals document defines the OKLCH commitment levels (§4) and absolute color bans (§3.2).

**Step 4c — Generate the color scheme:**

Generate the following semantic roles as CSS custom properties using the naming pattern `--color-[role]`:

**Required roles:**
- `--color-primary` and `--color-on-primary`
- `--color-primary-container` and `--color-on-primary-container`
- `--color-secondary` and `--color-on-secondary`
- `--color-secondary-container` and `--color-on-secondary-container`
- `--color-surface` — default background
- `--color-surface-raised` — elevated surface (cards, sheets)
- `--color-surface-overlay` — modal/dialog surface
- `--color-on-surface` — primary text on surface
- `--color-on-surface-muted` — secondary/muted text
- `--color-border` — default border
- `--color-border-focus` — focus ring (must meet 3:1 against surface)
- `--color-error` and `--color-on-error`
- `--color-success` and `--color-on-success`
- `--color-warning` and `--color-on-warning`

For dark mode (if required): use tonal shift logic — do not invert light mode values. Every `on-*` role must meet WCAG 4.5:1 against its paired surface. Flag any role where contrast should be manually verified.

Quality checks before finalizing:
- **First-order reflex check:** Primary color — is it medium-blue without justification?
- **Commitment level check:** Surface and neutral chroma values consistent with the approved commitment level?
- **Absolute bans check:** No opacity-derived containers; primary and secondary have distinct hues; no pure black/white surfaces; neutral ramp has hue temperature.

Write the output as a CSS file at the path specified in DESIGN.md, or as `src/styles/tokens/colors.css` if not specified.

**Step 4d — Update the living brief:**

Update the Color entry in Key Decisions. Append to the Decision Log:
```
[date] — Color scheme generated — [architecture model, theme scope, commitment level, primary color]
```

### Before proceeding to Step 5

- [ ] Color token file exists with all required roles
- [ ] Every `on-*` role has a verified contrast ratio listed
- [ ] Dark mode overrides exist if theme is "both"
- [ ] All quality checks passed
- [ ] Quality check: are surface colors genuinely specific, or generic near-white?

**Pause here.** Ask: *"Step 4 complete. Color scheme generated with [N] roles. Ready to proceed to Step 5 — generating the type scale?"*

---

## Step 5 — generate-type-scale

You are generating a typography token set for this design system.

**Step 5a — Confirm typography input:**

Review the approved visual direction in LIVING_BRIEF.md. Confirm:
1. Is there a preferred typeface or pairing already decided?
2. What is the typographic character from the visual direction? (Should be recorded from Step 2.)

If not recorded, ask before proceeding.

**Step 5b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Typography architecture synthesis: `{{sistema_url}}/raw/principles/typography/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

**Step 5c — Generate the type scale:**

For each type role, output a token block:
```css
/* [Role name] — [one-line usage description] */
--type-[role]-size: [value];
--type-[role]-weight: [value];
--type-[role]-line-height: [value]; /* unitless */
--type-[role]-letter-spacing: [value]; /* em */
```

Define roles appropriate for this product's density and stance. At minimum: display (if applicable), heading-lg, heading-sm, body-lg, body-sm, label, caption, code.

Non-negotiable legibility constraints:
- Body roles: line height ≥ 1.5
- Heading roles: line height 1.1–1.3
- Display roles: line height 1.0–1.1
- Letter spacing: negative on large sizes, positive on small sizes (label/caption) when legibility requires it

Quality check: weight, size, and tracking must vary meaningfully across roles — not size alone. Every role exists for a specific reason; name it in the comment.

Write the output as a CSS file and note the path.

**Step 5d — Update the living brief:**

Update the Typography entry in Key Decisions. Append to the Decision Log:
```
[date] — Type scale generated — [scale approach, typeface decisions, number of roles]
```

### Before proceeding to Step 6

- [ ] Type scale CSS file exists with all roles
- [ ] Each role has all four token properties
- [ ] Legibility constraints are met for all roles
- [ ] Quality check: hierarchy is clear and each role has a distinct visual identity

**Pause here.** Ask: *"Step 5 complete. Type scale generated with [N] roles. Ready to proceed to Step 6 — generating shape tokens?"*

---

## Step 6 — generate-shape-tokens

You are generating shape tokens — border-radius, elevation (shadow), and border width — for this design system.

**Step 6a — Confirm shape direction:**

Review the approved visual direction in LIVING_BRIEF.md. Confirm:
1. Where does this product sit on the sharp ↔ rounded spectrum? (Should be recorded from Step 2.)

If not recorded, ask before proceeding.

**Step 6b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Shape architecture synthesis: `{{sistema_url}}/raw/principles/shape/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

**Step 6c — Generate the shape tokens:**

Output shape tokens as CSS custom properties:
```css
--radius-none: 0px;
--radius-sm: [value];
--radius-md: [value];
--radius-lg: [value];
--radius-xl: [value];
--radius-full: 9999px;
```

Include a component mapping table:
| Component type | Radius token | Notes |
|---|---|---|
| Buttons | | |
| Inputs / form fields | | |
| Cards | | |
| Modals / dialogs | | |
| Chips / badges | | |
| Tooltips | | |

Also generate elevation tokens:
```css
--shadow-sm: [value]; /* subtle lift — cards, dropdowns */
--shadow-md: [value]; /* clear elevation — modals, floating panels */
```

Quality check: radius must not be uniform across all components — there must be a hierarchy. The values must match the approved shape personality from Step 2. Check against the side-stripe ban.

**Step 6d — Update the living brief:**

Update the Shape entry in Key Decisions. Append to the Decision Log:
```
[date] — Shape tokens generated — [radius personality, scale range, shadow approach]
```

### Before proceeding to Step 7

- [ ] Shape token CSS file exists
- [ ] All radius stops defined and component mapping table complete
- [ ] Elevation tokens defined
- [ ] Quality check: radius values match the approved shape personality

**Pause here.** Ask: *"Step 6 complete. Shape tokens generated. Ready to proceed to Step 7 — generating the Style Dictionary configuration?"*

---

## Step 7 — generate-style-dictionary

You are setting up Style Dictionary to compile the design tokens generated in this campaign into CSS custom properties, JavaScript modules, and other platform outputs.

**Step 7a — Ask the user for repository context:**

Before proceeding, ask:
1. What is the repository structure? (Where are source files, what framework is in use?)
2. What output formats are needed? (CSS vars, JS ESM, JSON, SCSS)
3. Any existing file organization to work around?

**Step 7b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

**Step 7c — Generate the configuration:**

Produce:
1. A `style-dictionary.config.js` (or `.mjs`) file ready to run
2. The expected input file structure, organized by tier (primitive → semantic → component)
3. Example npm scripts: `"tokens": "node style-dictionary.config.mjs"`
4. Migration guidance: how to move the CSS custom property files from steps 4–6 into the token JSON source structure

**Step 7d — Update the living brief:**

Update the Tokens entry in Key Decisions. Append to the Decision Log:
```
[date] — Style Dictionary configured — [output formats, file structure approach]
```

### Before proceeding to Phase 4

- [ ] Style Dictionary config exists and is runnable
- [ ] Token source file structure is defined
- [ ] All CSS files from steps 4–6 have a migration path
- [ ] LIVING_BRIEF.md has an entry for each step

**Pause here.** Summarize Phase 3 outputs. Then ask: *"Phase 3 complete — token system established. Ready to proceed to Phase 4 — building core components?"*

---

## Step 8 — scaffold-core-components

You are implementing the core component set for this design system, consuming the token system established in Phase 3.

**Step 8a — Confirm component library preference:**

Ask the user:
1. Do you want to use shadcn/ui as the component base? (Recommended — Radix UI primitives with Tailwind, highly customizable, widely adopted.)
2. Alternative options: Base UI (Radix-compatible, no styles), Radix UI directly (unstyled primitives), or no component library (build from scratch).

If the user chooses shadcn/ui:
- The shadcn CLI generates component source files directly into the project (`components/ui/`) — components are owned by the project and customized freely.
- Token integration: update `globals.css` to use the color token CSS custom properties from Step 4. Update `tailwind.config.js` to reference them.
- shadcn uses HSL color variables by default; adapt them to the OKLCH-derived hex values from the color scheme.

If the user chooses a different library: proceed accordingly, adapting the following steps to that library's integration approach.

**Step 8b — Read the living brief and references:**

Read `LIVING_BRIEF.md`. Confirm the technology stack, token naming convention, and shape scale.

Fetch and read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

**Step 8c — Install and configure the component library:**

For shadcn/ui:
1. Initialize: `npx shadcn@latest init`
2. Configure the theme to use the token values from Steps 4–6
3. Generate the core component set (at minimum): Button, Input, Select, Checkbox, Badge, Card, Dialog, Popover, Separator, Tooltip

For each component, verify:
- Token consumption: are color and shape tokens referenced via CSS custom properties?
- Hover/focus/active/disabled states are all present
- Focus indicator meets 3:1 contrast per the accessibility floor
- Touch target ≥ 44×44px for interactive elements

**Step 8d — Customize to the visual direction:**

Apply the approved visual direction from `style-preview.html`:
- Update radius values to match the shape token scale
- Update color variable mappings to use the semantic color role tokens
- Update typography to reference the type scale tokens
- Verify the result visually against the approved composite card specimen from `style-preview.html`

**Step 8e — Review checkpoint:**

Generate a single `component-preview.html` file — a static HTML page showing all core components in their default states, hover states, and focus states. No JavaScript required; CSS-only if possible.

Pause and say: *"Component set is ready for review. Open component-preview.html to evaluate each component. Check: do they look like they belong to the same system? Do they match the approved visual direction? Tell me what to adjust, or approve to proceed."*

**Do not proceed to Step 9 until the user approves.**

**Step 8f — Update the living brief:**

Update the Components implemented list. Append to the Decision Log:
```
[date] — Core component set scaffolded — [library used, components generated, any notable customizations]
```

### Before proceeding to Step 9

- [ ] Component library installed and configured
- [ ] Core components generated and token-integrated
- [ ] `component-preview.html` exists and reviewed
- [ ] User has approved the component set
- [ ] LIVING_BRIEF.md updated

**Pause here.** Ask: *"Step 8 complete. Core components approved. Ready to proceed to Step 9 — generating page examples?"*

---

## Step 9 — generate-page-examples

You are generating 1–2 full-page HTML examples that demonstrate the design system in use at the page level. These are not prototypes — they are static HTML/CSS demonstrations of the visual language applied to realistic page compositions.

**Step 9a — Confirm page types:**

Ask the user: what type of page should the examples demonstrate? Suggest based on the product type recorded in LIVING_BRIEF.md. For example:
- A dashboard with a sidebar navigation, data table, and stat cards
- A settings page with form controls, section headers, and a save action
- A marketing landing page with hero, feature grid, and CTA section
- A detail view with a header, content area, and sidebar

Generate 2 page types unless the user specifies otherwise.

**Step 9b — Generate the page examples:**

For each page:
- Self-contained HTML file
- All styles in a `<style>` block — no external dependencies
- Uses the CSS custom property tokens from Steps 4–6
- Uses the component patterns from Step 8
- Realistic content (not lorem ipsum) — write copy appropriate for the product type
- Full-width layout at desktop (1200px+), responsive to at least 768px

Quality standard: the pages should feel like they could exist in a production product. Typography hierarchy should be clear. Information density appropriate to the product type. Color usage consistent with the commitment level. No decorative elements added that aren't in the token system.

Write each page as a separate file: `page-example-1.html`, `page-example-2.html`.

**Step 9c — Review checkpoint:**

Pause and say: *"Page examples are ready for review. Open page-example-1.html and page-example-2.html. Evaluate: does each page feel like a coherent product? Does the visual language hold up at the page level — not just the component level? Tell me what to adjust, or approve to proceed."*

**Do not proceed to Step 10 until the user approves.**

**Step 9d — Update the living brief:**

Append to the Decision Log:
```
[date] — Page examples generated — [page types, any notable layout or composition decisions]
```

---

## Step 10 — setup-documentation-site

You are setting up a lightweight documentation site — a browsable component gallery and token reference that the team can maintain. This is not Storybook; it should be a simple, maintainable solution appropriate to the team's tech stack.

**Step 10a — Confirm approach:**

Ask the user:
1. What is the primary framework in use? (From LIVING_BRIEF.md — confirm.)
2. How will the docs site be hosted? (Same repo as the product, or a separate `/docs` directory?)
3. Preferred approach: (a) a simple Next.js or Vite static site; (b) a markdown-based site (like Nextra or VitePress); (c) a single-page HTML gallery (no build step required).

Recommend option (c) for most cases — a single `docs/index.html` that renders all components, tokens, and usage examples, requiring no framework or build step. It can grow incrementally.

**Step 10b — Generate the documentation site:**

For the recommended single-page approach:

Generate `docs/index.html` containing:

1. **Token reference** — all color tokens displayed as swatches, all type roles rendered, all radius tokens shown, all shadow tokens shown. Values shown as CSS custom property names and their current values.

2. **Component gallery** — each core component from Step 8 shown in its variants and states. Organized by component name. Each component shown at normal zoom (not scaled).

3. **Usage notes** — for each component, a brief "When to use" description. Not an API reference — a design intent note.

4. **Page examples link** — links to the page example files from Step 9.

5. **Visual direction summary** — the visual direction brief from Step 2, condensed. Useful as a quick reference for the team.

Technical requirements: self-contained HTML. All tokens read from the same CSS custom property values used in the product. No framework dependency. Must be openable directly from the filesystem.

**Step 10c — Campaign complete:**

Summarize the full campaign output:
1. Files produced (list all files created across all steps)
2. Key decisions recorded in LIVING_BRIEF.md
3. The token system structure and Style Dictionary configuration
4. The component set and its token integration approach
5. Recommended next step: run `session-start` before beginning any further component work

Append the final entry to the Decision Log:
```
[date] — Bootstrap campaign complete — [Phase 1–4 summary]
```
