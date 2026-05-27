# TASK_PLAYBOOKS.md
# Design System Knowledge Base — Task Playbooks

**Version:** 3.0
**Updated:** 2026-05-13
**Purpose:** Copyable prompt starters for agentic design system work. Each play is a complete prompt you can paste into a coding agent. Plays are ordered by the stage of design system building they belong to — earlier plays produce the foundations that later plays build on.

Plays reference content from the Sistema knowledge base using `{{sistema_url}}` — this is substituted with the live app URL when you copy. Synthesis documents (under `kb/principles/`) are the primary references for campaign plays; individual design system KB files are supplementary research, not templates to copy from.

---

## Stages

1. **System definition** — Establish positioning, structure, and principles before any values exist
2. **Primitive tokens** — Generate raw color, type, shape, and spacing values
3. **Semantic layer** — Map primitives to roles; generate theme variants; set up build tooling
4. **Components** — Specify and implement components that consume the token system
5. **Migration and adoption** — Transform existing codebases to work with a design system

---

## establish-context — Establish Design System Context

**Stage:** 1
**Tags:** planning, positioning, foundations, living-brief, intake

You are establishing the full context for design system work on this project. Your job is to build a complete picture of what exists and what is needed before any decisions are made. Do not ask questions that can be answered by reading existing files.

**Step 1 — Scan the project:**

Before asking anything, read these files if they exist:
- `LIVING_BRIEF.md` — existing positioning decisions and system state
- `DESIGN.md` — existing token and visual language decisions
- Any `package.json` or framework config — technology constraints
- Any existing CSS or token files — what token naming and values are already in use
- Any existing component files (spot-check 3–5) — current implementation patterns

Summarize what you found. State explicitly: which of the questions below are already answered by reading the project.

**Step 2 — Ask only what is missing:**

Work through the following questions. Skip any already answered from Step 1. For any vague answer, ask for a specific clarification before moving on.

1. **Product type and context:** What kind of product is this? Who are the primary users and what are they trying to accomplish?

2. **Information density:** Is the UI primarily content-dense (tables, dashboards, data-heavy forms) or content-sparse (focused flows, marketing, simple consumer tasks)? Or does it need to serve both?

3. **Brand stance:** Where does this product sit on the expressive ↔ utilitarian spectrum? Expressive = personality, delight, visual distinctiveness. Utilitarian = clarity, efficiency, cognitive load reduction.

4. **Existing visual character (if any):** Is there an existing visual direction — a brand guide, a style tile, a reference design — that should be honored? Or is this a blank canvas?

5. **Color constraints:** An existing brand color (hex preferred)? Any colors that must be avoided?

6. **Theme requirements:** Light only, dark only, or both? If both — primary?

7. **Platform and scale:** Web, mobile, or cross-platform? One team or multiple? Estimated component count: small (<20), medium (20–60), large (60+)?

8. **Accessibility requirements:** Standard WCAG 2.2 AA, or a stronger requirement?

9. **Technology constraints:** Existing framework, CSS approach, design tool, or component library? Any constraints on token format or build tooling?

**Step 3 — Produce the context document:**

Write or update `LIVING_BRIEF.md` at the project root with this structure:

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

**Token files:** [list or "none yet"]
**Components implemented:** [list or "none yet"]
**Components stubbed:** [list or "none yet"]
**Known gaps:** [what is missing]

---

## 4. Open Questions

- [ ] [Any unresolved questions from Step 2]

---

## 5. Decision Log

*[today's date] — Context established — [one-line summary of key findings]*
```

**Step 4 — Confirm readiness:**

State: "Context established. Here is what I found / here is what you told me. The next step is [positioning-brief / establish-visual-language] depending on whether a visual direction already exists."

---

## positioning-brief — Establish a Positioning Brief

**Stage:** 1
**Tags:** planning, positioning, foundations, living-brief

You are helping me establish the positioning brief for a new design system before any values are chosen. This brief drives every downstream decision — color model, type scale, density, brand personality — so it must be specific.

Work through the following questions with me. For each one, ask for clarification if my answer is too vague to be actionable. When you have answers to all questions, produce the two outputs at the end.

**Questions:**

1. **Product type and context:** What kind of product is this? (e.g. SaaS dashboard, consumer mobile app, e-commerce, developer tool, internal tool, marketing site) Who are the primary users and what are they trying to accomplish?

2. **Information density:** Is the UI primarily content-dense (many data points visible at once — tables, dashboards, data-heavy forms) or content-sparse (focused flows, marketing, onboarding, simple consumer tasks)? Or does it need to serve both modes?

3. **Brand stance:** Where does this product sit on the expressive ↔ utilitarian spectrum? Expressive products have personality, delight, and visual distinctiveness. Utilitarian products prioritize clarity, efficiency, and cognitive load reduction. Most products are somewhere between — where is this one?

4. **Color constraints:** Does the product have an existing brand color (hex value or description)? Are there colors that must be avoided or reserved (e.g. competitor brand colors, colors with negative cultural associations for the target audience)?

5. **Theme requirements:** Light mode only, dark mode only, or both? If both — is one the primary experience, or are they equivalent?

6. **Platform and scale:** Web only, mobile only, or cross-platform? Will this system be used by one team or multiple teams? Is component count likely to be small (<20), medium (20–60), or large (60+)?

7. **Accessibility requirements:** Standard WCAG 2.2 AA (the legal baseline for most regulated products)? Or is there a stronger requirement — AAA, internal policy, specific user population with accessibility needs?

8. **Timeline and constraints:** Is there an existing codebase this system needs to work with? Any technology constraints (framework, CSS approach, design tool)?

---

**Outputs:**

**Output 1 — Positioning brief** (prose, 150–250 words):

A narrative description of the product's design stance. Should answer: what this product looks like and feels like, what it does not look like, and what principles guide every visual decision. Write it as a brief an engineer or designer can hand to an AI agent to get consistent output.

**Output 2 — Living brief seed** (structured, for `LIVING_BRIEF.md`):

Populate the Project Identity and Key Decisions sections of the living brief using the answers above. Leave Key Decisions entries as `[to be determined — {reason}]` for anything not yet resolvable. Format as a ready-to-commit `LIVING_BRIEF.md` using the template from `_meta/templates/LIVING_BRIEF.md`.

---

## establish-visual-language — Establish Visual Language

**Stage:** 1
**Tags:** planning, visual-language, style-tile, foundations

You are establishing the visual language for this design system — translating the positioning brief into specific visual directions before any token values are generated. The output is `style-preview.html`: a self-contained static HTML file that demonstrates color, typography, shape, and surface treatment in a reviewable form. Human review and approval of this artifact is required before token generation begins.

**Step 1 — Read the living brief and references:**

Read `LIVING_BRIEF.md` from the project root. Confirm: product identity, density, theme scope, brand stance, and any existing color or visual decisions.

Fetch and read the following from the Sistema knowledge base:
- Visual language translation framework: `{{sistema_url}}/raw/principles/visual-language/overview`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`
- Style tile format specification: `{{sistema_url}}/raw/principles/visual-language/style-tile-format`

The visual language framework provides aesthetic reference vocabulary and structured translation from positioning to visual direction. The quality signals document defines the AI slop test, absolute bans, and OKLCH commitment levels. The style tile format specifies exactly what `style-preview.html` must contain.

**Step 2 — Produce the visual direction brief:**

Before generating any HTML, produce a short visual direction brief (3–5 sentences). This brief is the contract between the positioning brief and the style tile. It must answer:

1. Which 2–3 aesthetic frameworks does this product draw from? (Reference the visual language translation framework.)
2. What is the OKLCH color commitment level and why? (Reference the quality signals document.)
3. What is the typographic character: weight range, size range, whether mixed typefaces are in use?
4. Where on the sharp ↔ rounded spectrum does this product sit, and what is the preliminary radius estimate?
5. What does this system explicitly NOT look like? (Name 2–3 specific exclusions.)

Run the AI slop first-order reflex check on the proposed visual direction: are any of the preliminary choices category-obvious defaults? If so, justify them explicitly or adjust.

**Step 3 — Generate style-preview.html:**

Generate a `style-preview.html` file containing all seven required sections from the style tile format specification:

1. Visual direction statement — the brief from Step 2, rendered in the file
2. Color palette — all proposed colors as swatches, labeled with hex, OKLCH values, and contrast ratios
3. Typography specimens — each type role rendered with sample text, labeled with role, size, weight, line height, tracking
4. Shape and radius specimens — each radius token and shadow level rendered
5. Surface treatment — default, raised, and overlay surfaces; composite card specimen
6. Color in context — primary in interactive elements, semantic colors in state examples
7. Reviewer notes — explicit checklist of decisions requiring human judgment

Requirements per the format specification:
- Self-contained HTML — no external dependencies
- All color values shown as both hex and OKLCH
- Every visual decision annotated with role name and value
- Reviewer notes section must list each decision that requires human confirmation

Quality constraints from the quality signals document:
- Verify the color commitment level is consistent across all surface and neutral tokens
- Check all proposed values against the absolute bans list
- Run the first-order reflex test on the primary color
- Flag any on-* pairing where contrast should be manually verified

Write the file to `style-preview.html` at the project root.

**Step 4 — Request review:**

Pause and present the visual direction brief (from Step 2) as a summary. Then say:

*"style-preview.html is ready for review. Open it in a browser and evaluate the seven sections against the reviewer checklist in Section 7 of the file. Specific decisions to focus on: [list 3–4 key choices that required judgment]. When you are satisfied, tell me to proceed — or tell me what to change."*

Do not proceed to token generation until the user approves the style tile.

**Step 5 — Update the living brief:**

After approval, update the Key Decisions section of `LIVING_BRIEF.md` with the visual direction decisions. Include the following specific values so they are available for downstream plays:
- OKLCH commitment level
- Primary seed hex (the exact hex value to feed into the palette tool)
- Neutral seed hex (warm or cool tinted gray seed)
- Any secondary or feedback hue seeds if established

Append to the Decision Log:
```
[date] — Visual language established — [commitment level, primary seed hex, typographic character, radius personality]
```

---

## generate-design-md — Generate a DESIGN.md

**Stage:** 1
**Tags:** design-md, foundations, planning

You are helping me create a `DESIGN.md` file — a concise specification document that describes a design system's visual language for use with AI coding tools.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Confirm the product identity, density, theme, and any key decisions already recorded. If the file does not exist, ask the user to run the `positioning-brief` play first.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- DESIGN.md format specification: `{{sistema_url}}/raw/standards/design-md/spec`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Visual language overview: `{{sistema_url}}/raw/principles/visual-language/overview`

The spec file defines the exact format, YAML schema, section order, and token types. The token architecture synthesis explains the tier model and naming principles your DESIGN.md should follow. The visual language overview provides the translation framework from positioning to preliminary token directions — if `establish-visual-language` has been run, use the approved style tile as the primary source for visual direction values; otherwise use the visual language framework to derive directions from the positioning brief.

**Step 3 — Generate the DESIGN.md:**

My project context (supplement to the living brief):

{{project_context}}

Rules:
- Follow the DESIGN.md format spec exactly — YAML front matter first, then markdown sections in the order defined in the spec
- Token names in the YAML must follow the naming principles from the token architecture synthesis: semantic, role-based, consistent pattern across categories
- The Overview section must reflect the positioning brief (from the living brief or from context above) — not generic placeholder prose
- Mark any value you are deciding without explicit guidance as `[default — review]`
- Do not reference any specific design system's approach or terminology
- Output raw markdown only — no surrounding explanation or code fences wrapping the whole document

**Step 4 — Update the living brief:**

Append to the decision log in `LIVING_BRIEF.md`:
```
[2026-05-13] — Generated initial DESIGN.md — [note any key decisions made]
```

---

## generate-color-scheme — Generate a Color Scheme

**Stage:** 2
**Tags:** tokens, color, semantic

You are helping me generate a complete color scheme for my design system — semantic color role tokens, as CSS custom properties ready to ship.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the theme setting (light-only / dark-only / both), any existing color decisions, and the product's density and brand stance. If the living brief includes a visual direction from `establish-visual-language`, note the OKLCH commitment level — this drives how much chromatic presence the surface and neutral tokens should have.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`
- Primitive ramp scalability: `{{sistema_url}}/raw/principles/color/primitive-ramp-scalability`
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

The color architecture synthesis explains the four major architectural models, the non-negotiable floor (contrast requirements, foreground pairings, never-hardcode), and dark mode tonal shift logic. Use it to select the appropriate model for this product and to structure the output. The primitive ramp scalability document explains the default preference for full 19-stop primitive ramps before semantic mapping and how they feed the semantic layer. The visual quality signals document defines the OKLCH commitment levels (§4) and absolute color bans (§3.2) — apply both when selecting values.

**Step 3 — Clarify scope:**

Theme mode: {{color_mode}}

- **Light only:** generate `:root { }` with light mode values only
- **Dark only:** generate `:root { }` with dark mode values only
- **Both:** generate `:root { }` with light mode values, then `[data-theme="dark"] { }` with dark mode values

**Step 3.5 — Resolve seed colors and generate primitive ramps:**

The default approach is to generate a full 19-stop OKLCH primitive ramp for each key hue before mapping semantic roles. This makes semantic role mapping deterministic and keeps the primitive layer extensible as the system grows.

**Determine seed colors from the color direction:**

My color direction:
{{color_direction}}

Read the color direction above and determine the seed hex(es) to use:
- If a specific hex is given, use it directly.
- If a color name or description is given (e.g. "royal blue", "warm amber"), select an appropriate seed hex that matches the intent. Prefer hues that are not the AI-default medium blue (220–240°) unless explicitly requested — run the first-order reflex check from the quality signals document.
- If no color direction is given at all, check the LIVING_BRIEF for a primary seed hex from `establish-visual-language`. If none exists, ask the user for a primary brand color before proceeding.

Generate ramps for at minimum:
- **Primary hue** — the brand or action color seed
- **Neutral/gray** — pick a seed with slight chroma that matches the product's temperature (warm: slight yellow/red shift; cool: slight blue/cyan shift). Do not use a pure achromatic gray.
- **Feedback hues** — use the pre-built ramps from the Sistema palette library for error, success, and warning unless the brief specifies custom feedback colors.

**API call — generate custom ramps:**

POST `{{sistema_url}}/api/palette` with the body:
```json
{ "colors": { "primary": "#[seed]", "neutral": "#[seed]" } }
```
The response is `{ "palettes": { "[name]": { "seed": "...", "stops": { "50": { "hex": "...", "contrast_white": ..., "contrast_black": ... }, ... "950": {...} } } } }`.

Call this endpoint with your determined seed hex(es). Use the returned stop values for all semantic role assignments in Step 4.

**Pre-built ramps for feedback and neutral hues:**

If the brief does not specify custom feedback colors, fetch the pre-built library at `{{sistema_url}}/palettes/library.json`. Available named ramps: slate, gray, zinc, neutral, stone (neutral grays); red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose (chromatic). Select the neutral ramp that best matches the product temperature and use red/amber/green for error/warning/success feedback roles.

**Step 4 — Map semantic roles:**

Using the generated ramp stops from Step 3.5, assign the following semantic roles as DTCG JSON. For each role, note which ramp name and stop number you selected. For each `on-*` role, include a `$description` with the contrast ratio against its paired surface.

```json
{
  "color": {
    "primary":    { "$type": "color", "$value": "#...", "$description": "" },
    "on-primary": { "$type": "color", "$value": "#...", "$description": "X.X:1 against primary" }
  }
}
```

**Required roles:**
- `color.primary` and `color.on-primary` — primary action and its text
- `color.primary-container` and `color.on-primary-container` — contained variant and its text
- `color.secondary` and `color.on-secondary` — secondary action and its text
- `color.secondary-container` and `color.on-secondary-container`
- `color.surface` — default background
- `color.surface-raised` — elevated surface (cards, sheets)
- `color.surface-overlay` — modal / dialog overlay surface
- `color.on-surface` — primary text on surface
- `color.on-surface-muted` — secondary / muted text on surface
- `color.border` — default border
- `color.border-focus` — focus ring color (must meet 3:1 against surface)
- `color.error` and `color.on-error` — error states
- `color.success` and `color.on-success` — success / confirmation states
- `color.warning` and `color.on-warning` — warning states

**For dark mode (if theme is "both"):**
Do not invert light mode values. Use tonal shift logic: surface values draw from the dark end of the neutral palette; primary/secondary role colors draw from the lighter portion of each hue to maintain contrast against dark surfaces. Every `on-*` role must meet WCAG 4.5:1 against its paired surface. Write overrides as a separate `color.dark.json` containing only the roles that change.

**Contrast verification:**
Before finalizing any role assignment, verify each `on-*` pairing using the Sistema contrast API:
```
POST {{sistema_url}}/api/contrast
{ "foreground": "#hex-of-on-role", "background": "#hex-of-surface-role" }
```
The response returns the exact WCAG ratio and pass/fail for each criterion. All normal text `on-*` roles must return `aa_text: true` (≥ 4.5:1). `color.border-focus` must return `aa_ui: true` (≥ 3:1). Adjust stop selection for any pair that fails — do not proceed to the file write with a failing pair.

Before finalizing, run these checks from the visual quality signals document:
- **First-order reflex check:** Is the primary color medium-blue without explicit justification? Are surfaces generic near-white? If so, reconsider or justify.
- **Commitment level check:** Do surface and neutral token chroma values match the OKLCH commitment level from the visual direction? (Restrained: C < 15; Committed: C 8–20; Full palette: C 15–30; Drenched: C 25+.)
- **Absolute bans check:** No opacity-derived container colors; primary and secondary must have distinct hues; no pure `#000000` or `#FFFFFF` surfaces; neutral ramp must have hue temperature.

Write to `tokens/src/color.json` (and `tokens/src/color.dark.json` if dark mode is required). These JSON files are the authoritative source — CSS is compiled from them by Style Dictionary, not authored separately.

**Step 5 — Update the living brief:**

Update the Color entry in Key Decisions and append to the decision log:
```
[date] — Color scheme generated — [architecture model, theme scope, commitment level, primary color]
```

---

## generate-type-scale — Generate a Type Scale

**Stage:** 2
**Tags:** tokens, typography, primitives

You are helping me generate a typography token set for my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the density target, any typeface decisions already made, and the product's expressive vs. utilitarian stance.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Typography architecture synthesis: `{{sistema_url}}/raw/principles/typography/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

This synthesis covers scale construction (modular vs. hand-tuned, ratio selection by context), role taxonomy decisions (named roles vs. numeric steps), and non-negotiable legibility constraints (line height per role, measure, letter-spacing direction by size). Use it as the decision framework — do not copy any specific design system's scale. The visual quality signals document (§2) defines type-specific quality checks: ensure weight, size, and tracking vary meaningfully across roles, and that the typographic character matches the visual direction brief.

**Step 3 — Explore the scale (optional):**

If you haven't settled on a ratio yet, open `{{sistema_url}}/tools/type-scale` in a browser. Enter your base size and try ratios — Perfect Fourth (1.333) is a good starting point for most UI products; Major Third (1.250) for denser, more utilitarian interfaces; Perfect Fifth (1.500) or Golden Ratio (1.618) for editorial or expressive work. The calculator shows how each ratio distributes sizes from caption through display.

**Step 4 — Generate the type scale:**

My typography direction:
{{typography_direction}}

For each type role, output a token group in DTCG format:
```json
{
  "type": {
    "body-lg": {
      "$description": "Default body text — prose, descriptions, form labels",
      "size":           { "$type": "dimension",  "$value": "16px" },
      "weight":         { "$type": "fontWeight", "$value": 400 },
      "line-height":    { "$type": "number",     "$value": 1.6 },
      "letter-spacing": { "$type": "dimension",  "$value": "0em" }
    }
  }
}
```

Define roles appropriate for this product's density and stance. At minimum: display (if applicable), heading-lg, heading-sm, body-lg, body-sm, label, caption, code. Every role must have a `$description` naming its purpose.

Apply non-negotiable legibility constraints from the synthesis:
- Body roles: line height ≥ 1.5 (unitless)
- Heading roles: line height 1.1–1.3
- Display roles: line height 1.0–1.1
- Letter spacing: negative on large sizes (display/heading), positive on small sizes (label/caption) when legibility requires it

Quality check: weight, size, and tracking must vary meaningfully across roles — not size alone. Note any judgment call.

Write to `tokens/src/typography.json`. This file is the authoritative source — CSS is compiled from it by Style Dictionary, not authored separately.

**Step 5 — Update the living brief:**

Update the Typography entry in Key Decisions and append to the decision log:
```
[date] — Type scale generated — [scale approach, typeface decisions, number of roles]
```

---

## generate-shape-tokens — Generate Shape Tokens

**Stage:** 2
**Tags:** tokens, shape, primitives

You are helping me generate shape (border-radius) tokens for my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the brand stance (expressive vs. utilitarian) — this directly drives radius personality.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Shape architecture synthesis: `{{sistema_url}}/raw/principles/shape/architecture`
- Visual quality signals: `{{sistema_url}}/raw/principles/quality/visual-quality-signals`

This synthesis covers the radius-as-personality spectrum, scale approach options (named semantic / numeric / global-factor), component family consistency rules, and pill shape guidance. Use it to select an approach appropriate for this product. The visual quality signals document (§3.1) defines shape-related bans — specifically the uniform-radius default and the side-stripe accent pattern.

**Step 3 — Generate the shape tokens:**

My shape direction:
{{shape_direction}}

Output shape tokens in DTCG format. Include radius, elevation shadows, and a component mapping table as `$description` on each radius stop:

```json
{
  "radius": {
    "none": { "$type": "dimension", "$value": "0px",    "$description": "Tooltips, chips in dense contexts" },
    "sm":   { "$type": "dimension", "$value": "...",    "$description": "Inputs, select fields" },
    "md":   { "$type": "dimension", "$value": "...",    "$description": "Buttons, badges" },
    "lg":   { "$type": "dimension", "$value": "...",    "$description": "Cards, panels" },
    "xl":   { "$type": "dimension", "$value": "...",    "$description": "Modals, dialogs, sheets" },
    "full": { "$type": "dimension", "$value": "9999px", "$description": "Pills, avatars, toggle tracks" }
  },
  "shadow": {
    "sm": { "$type": "shadow", "$value": { "offsetX": "0px", "offsetY": "1px", "blur": "3px",  "spread": "0px", "color": "..." } },
    "md": { "$type": "shadow", "$value": { "offsetX": "0px", "offsetY": "4px", "blur": "12px", "spread": "0px", "color": "..." } }
  }
}
```

Radius must not be uniform across all components — there must be a hierarchy. Values must match the shape personality from the visual direction. Check against the side-stripe ban.

Explain the personality choice: where this system sits on the sharp ↔ rounded spectrum and why.

Write to `tokens/src/shape.json`. This file is the authoritative source — CSS is compiled from it by Style Dictionary, not authored separately.

**Step 4 — Update the living brief:**

Update the Shape entry in Key Decisions and append to the decision log:
```
[date] — Shape tokens generated — [radius personality, scale range, shadow approach]
```

---

## generate-spacing-tokens — Generate Spacing Tokens

**Stage:** 2
**Tags:** tokens, spacing, layout, primitives

You are generating a spacing token set as DTCG JSON source files. Spacing decisions constrain every component's padding and every layout's rhythm — they must be defined before any component code is written, so that padding and gap values are documented decisions rather than ad hoc utilities that drift over time.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Confirm the product's density target: content-dense, balanced, or content-sparse. (If no living brief exists, ask the user before proceeding.)

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

**Step 3 — Generate the spacing token source file:**

Select the scale tier that matches the density target. All scales use a 4px base unit:

- **Content-dense:** tighter stops — 2, 4, 6, 8, 12, 16, 20, 24, 32, 48px
- **Balanced:** standard stops — 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- **Content-sparse:** generous stops — 4, 8, 16, 24, 32, 48, 64, 80, 96, 128px

If the product has mixed density (e.g., dense tables within a balanced layout), note this and adjust — tighter stops for component-internal spacing, larger stops for layout-level gaps.

Name tokens by their pixel value, not an abstract ordinal — `space.4` means 4px everywhere it appears. Also define semantic aliases for the three most critical layout decisions:

```json
{
  "space": {
    "1":  { "$type": "dimension", "$value": "4px" },
    "2":  { "$type": "dimension", "$value": "8px" },
    "3":  { "$type": "dimension", "$value": "12px" },
    "4":  { "$type": "dimension", "$value": "16px" },
    "5":  { "$type": "dimension", "$value": "20px" },
    "6":  { "$type": "dimension", "$value": "24px" },
    "8":  { "$type": "dimension", "$value": "32px" },
    "10": { "$type": "dimension", "$value": "40px" },
    "12": { "$type": "dimension", "$value": "48px" },
    "16": { "$type": "dimension", "$value": "64px" }
  },
  "layout": {
    "page-gutter":   { "$type": "dimension", "$value": "{space.6}",  "$description": "Horizontal padding on page-level containers" },
    "section-gap":   { "$type": "dimension", "$value": "{space.12}", "$description": "Vertical gap between major page sections" },
    "component-gap": { "$type": "dimension", "$value": "{space.4}",  "$description": "Gap between adjacent components in a list or row" }
  }
}
```

State the rationale: which tier, any stop adjustments, and why the three semantic aliases map to those values.

Write to `tokens/src/spacing.json`. This file is the authoritative source — CSS is compiled from it by Style Dictionary, not authored separately.

**Step 4 — Update the living brief:**

Update the Spacing entry in Key Decisions and append to the decision log:
```
[date] — Spacing tokens generated — [base unit, scale tier, semantic alias decisions]
```

---

## generate-color-roles — Map an Existing Palette to Semantic Roles

**Stage:** 3
**Tags:** tokens, color, semantic

Use this play when you already have a set of color values — from a brand palette, a Figma file, or an existing design system — and you want to map them to semantic roles that components can consume.

If you are starting from a single seed color with no existing palette, use `generate-color-scheme` instead — it generates primitive ramps via the Sistema palette API and then maps them to semantic roles.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`
- Primitive ramp scalability: `{{sistema_url}}/raw/principles/color/primitive-ramp-scalability`

Pay attention to the non-negotiable floor section: required semantic roles, the on-* pairing pattern, contrast requirements, and the never-hardcode rule.

**Ramp completeness check:** If the palette provided has fewer than 10 stops per hue, expand it to a full 19-stop ramp before mapping roles. POST the seed hex(es) to `{{sistema_url}}/api/palette` with body `{ "colors": { "[name]": "#[seed]" } }` and use the returned stops. For feedback hues not present in the existing palette, fetch the pre-built library at `{{sistema_url}}/palettes/library.json` and select from the named ramps. If the palette is a fixed brand specification with specific values that cannot be expanded (e.g. an existing Figma swatch export), proceed as-is and flag any semantic role where the palette has no suitable stop.

My existing palette:
[Paste your color values here — hex values, a Figma swatch export, a Tailwind color config, or whatever format you have. Include neutrals and grays.]

Map the palette to semantic roles following the role structure from the color architecture synthesis. For each role:
- Note which palette value you assigned
- Verify the exact contrast ratio for every `on-*` pairing using `POST {{sistema_url}}/api/contrast` — all normal text roles must return `aa_text: true` (≥ 4.5:1), UI component roles must return `aa_ui: true` (≥ 3:1)
- Flag gaps where the palette does not have a suitable value for a required role

Output as CSS custom properties. Token naming pattern: `--color-[role]`.

Custom prefix (optional): [leave blank to use `--color-`, or specify e.g. `--brand-`]

---

## generate-dark-mode — Generate Dark Mode Token Values

**Stage:** 3
**Tags:** tokens, color, semantic, dark-mode

You are helping me generate dark mode color token values for my design system.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`

Pay close attention to the dark mode section: tonal shift logic, why naive inversion fails, and the tone-pair table.

My existing tokens:
[Paste your primitive color palette and your light mode semantic role mapping here.]

Generate a complete dark mode role mapping. Do not invert light mode values — use tonal shift logic:
- Surface roles draw from the dark end of the neutral palette (low lightness)
- Primary/secondary role colors draw from the lighter portion of each hue to maintain contrast against dark surfaces
- Every `on-*` role must meet WCAG 4.5:1 against its paired surface

Output as `[data-theme="dark"] { }` CSS custom properties. Explain any roles that required a non-obvious decision.

**Contrast verification:**
Verify every `on-*` pairing using `POST {{sistema_url}}/api/contrast`. All normal text roles must return `aa_text: true` (≥ 4.5:1). Adjust any stop that fails before finalizing.

---

## generate-style-dictionary — Generate a Style Dictionary Config

**Stage:** 3
**Tags:** tokens, tooling, build, style-dictionary

You are setting up Style Dictionary v5 to compile DTCG JSON token source files into CSS custom properties. The JSON files are the authoritative source — the compiled CSS is a build artifact, never edited directly.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

**Step 2 — Confirm setup:**

My token source files:
[List which token files exist in `tokens/src/` — e.g. `color.json`, `color.dark.json`, `typography.json`, `shape.json`, `spacing.json`]

My project structure:
[Describe the framework and directory layout, so the CSS output path can be correctly set — e.g. "Next.js with `src/` directory", "Vite with `public/`", etc.]

**Step 3 — Determine output path:**

Based on the framework and project structure:
- Next.js with `src/` directory → `src/styles/tokens/`
- Next.js without `src/` → `styles/tokens/`
- Vite / other → derive from the project structure

If ambiguous, ask one brief question to confirm. Otherwise proceed.

**Step 4 — Generate the Style Dictionary configuration:**

Produce `style-dictionary.config.mjs`, ready to run with `node style-dictionary.config.mjs`:

1. Source: all files in `tokens/src/` — include every JSON file present
2. Output: CSS custom properties compiled to the path from Step 3, using the naming convention `--[category]-[token-name]` (e.g. `--color-primary`, `--type-body-lg-size`, `--radius-md`, `--space-4`)
3. Dark mode: if `color.dark.json` exists, output its values under a `[data-theme="dark"]` selector with a `@media (prefers-color-scheme: dark)` fallback
4. Add an npm script to `package.json`: `"tokens": "node style-dictionary.config.mjs"`

**Step 5 — Run compilation:**

Run `npm run tokens`. If it fails, diagnose and fix before proceeding — do not skip past a failed compilation.

**Step 6 — Generate token-check.html:**

After successful compilation, generate `token-check.html` at the project root. Its purpose is to confirm that compiled token values match intent before any component code is written.

The file must load the compiled CSS and render:
- Every color token as a labeled swatch showing the token name and computed hex value
- Every type role as a live text specimen rendered in that role's size, weight, and spacing
- Every radius stop as a box with a visible border at that corner radius
- Every spacing stop as a horizontal bar of that exact width, labeled with its pixel value

Open `token-check.html` and verify all values match what was specified. Catch mismatches here, not in component code.

**Step 7 — Wire tokens into the project:**

Import the compiled token CSS in the project's global stylesheet. Verify the import path against the actual directory structure — the path differs based on whether a `src/` directory is present:

```css
/* Next.js with src/ — in src/app/globals.css */
@import '../../styles/tokens/colors.css';

/* Next.js without src/ — in app/globals.css */
@import '../styles/tokens/colors.css';
```

**Step 8 — Update the living brief:**

Update the Tokens entry in Key Decisions and append to the decision log:
```
[date] — Style Dictionary configured and compiled — [token count, output paths, any issues resolved]
```

---

## specify-component — Write a Component Specification

**Stage:** 4
**Tags:** components, specification, design

You are helping me write a component specification — a complete design and behavior description that can be implemented consistently against my design system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, the shape scale, and any component decisions already recorded.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

The token architecture synthesis defines the naming convention your spec should use for token references. The accessibility floor defines the non-negotiable requirements for every interactive component.

**Step 3 — Write the specification:**

Component: [e.g. Button, Text Input, Card, Modal, Chip, Badge]

My token context:
[Describe your CSS custom property naming pattern (e.g. `--color-primary`, `--color-on-primary`, `--radius-md`) or paste the relevant token names your spec should reference.]

Use this exact document structure:

```
# [Component Name] Specification

## Variants
[Table: variant name | description | when to use]

## Sizes
[Table or "single size" if applicable]

## States
[Table: state | visual change | token consumed]
Include: default, hover, focus, active, disabled.

## Token Map
[List every token the component consumes: property → token name]
Group by: container, text/label, border, shape, typography.

## Accessibility
- ARIA role and required attributes
- Keyboard interaction (tab, space, enter, escape — per the accessibility floor spec)
- Focus indicator: color token, width, offset (must meet 3:1 contrast per accessibility floor §3.2)
- Minimum touch target: ≥ 44×44px interactive area (per accessibility floor §4.2)
- Accessible name requirement (per accessibility floor §5.2)

## Behavior
[Animation, loading states, icon support, edge cases]
```

Output only the specification document. Token references must use names from my token system — not hardcoded hex values or raw px values for anything covered by a token.

**Step 4 — Update the living brief:**

Append to the decision log:
```
[2026-05-13] — [Component name] spec written — [note any non-obvious decisions]
```

---

## implement-component — Implement a Component

**Stage:** 4
**Tags:** components, code, implementation

You are helping me implement a UI component that consumes my design system's token system.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, framework, and any implementation patterns already established.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

The token architecture synthesis defines correct token consumption patterns. The accessibility floor defines the non-negotiable requirements that every component implementation must meet.

**Step 3 — Implement the component:**

Component: [e.g. Button, Text Input, Card]
Framework: [React / Vue / Svelte / Web Components]
Styling: [CSS custom properties / Tailwind / CSS Modules / styled-components]

Component specification or requirements:
[Paste your component spec here, or describe the variants, states, and behavior needed.]

My token setup:
[Paste the relevant token names from your system — color roles, shape roles, typography roles — that the component should consume.]

Output production-ready component code. Requirements:
- Use semantic token names throughout via CSS custom properties — no hardcoded hex values or raw px values for anything covered by a token
- Implement all required ARIA attributes and keyboard behavior per the accessibility floor spec
- Implement a visible focus indicator that meets the 3:1 contrast requirement
- Ensure the interactive area meets 44×44px minimum
- Include prop types and a brief usage example

**Step 4 — Update the living brief:**

Update the Components implemented list in Current State and append to the decision log:
```
[2026-05-13] — [Component name] implemented — [note any non-obvious decisions]
```

---

## migrate-tailwind-tokens — Migrate a Tailwind Config to Semantic Tokens

**Stage:** 5
**Tags:** migration, tokens, color, tailwind

You are helping me migrate an existing Tailwind CSS color configuration to a structured two-tier token system (primitive + semantic).

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Color architecture synthesis: `{{sistema_url}}/raw/principles/color/architecture`

Pay attention to the distinction between primitive colors (raw values organized by hue and step) and semantic roles (how those values are used by components and surfaces). The token architecture synthesis defines the naming principles for each tier.

My existing Tailwind config — paste the `theme.colors` section:

{{tailwind_colors}}

Perform the migration in two steps:

**Step 1 — Extract primitives.** Reorganize the raw color values as primitive tokens using a consistent step scale (e.g. `primary-10` through `primary-99`). Do not change any values, only rename and restructure.

**Step 2 — Define semantic roles.** Map those primitives to semantic roles following the naming convention from the token architecture synthesis. Every component-facing role must have a name that communicates its purpose, not its value.

Output:
- A `tokens/primitive/colors.json` file with the restructured primitives
- A `tokens/semantic/colors.json` file with the role mapping
- A Tailwind `theme.extend` config that reads from CSS custom properties so existing Tailwind utility classes continue to work after migration

---

## audit-component — Audit a Component Against System Standards

**Stage:** 5
**Tags:** audit, components, code, tokens

You are helping me audit an existing UI component against my design system's standards and identify gaps before scaling the pattern.

**Step 1 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

These define what correct token consumption and accessibility compliance look like — the audit measures the component against these standards.

Component to audit:

[Paste your component code here.]

Evaluate against these criteria:

1. **Token usage** — Does the component consume semantic token names (via CSS vars or a theme system), or are there hardcoded hex values, px sizes, or raw font names? Flag every instance.

2. **Interactive states** — Are hover, focus, active, and disabled states present? Does each state use the correct token for the visual change?

3. **Accessibility** — Correct ARIA role and attributes; keyboard interaction model per accessibility floor §2; visible focus indicator meeting 3:1 contrast per §3; touch target ≥ 44×44px per §4.2; accessible name present per §5.2?

4. **API design** — Are prop names predictable and consistent with the rest of the system? Is the API minimal without being inflexible?

Output a structured audit report:
- Summary verdict (ready to scale / needs work / significant gaps)
- Specific issues, each with a line reference and severity (blocking / recommended / minor)
- Prioritized list of changes to make before using this component as a pattern

---

## session-start — Start a Design System Work Session

**Stage:** 6
**Tags:** stewardship, living-brief, planning, session

Use this play at the start of any design system work session. It orients you in the current state of the system before any decisions are made, and prevents a model from acting on stale context or making decisions that conflict with prior choices.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Summarize:
- The product identity (one sentence)
- The key decisions already recorded, by area
- The current state: what components exist, what is stubbed, what is missing
- Any open questions

**Step 2 — Confirm scope for this session:**

What is the goal of this session? State it explicitly before beginning work. If the scope conflicts with an existing decision in the living brief, flag the conflict and resolve it before proceeding.

Planned scope for this session:
[Describe what you intend to work on — e.g. "implement the Button component", "generate dark mode tokens", "add the Modal component spec"]

**Step 3 — Identify relevant synthesis documents:**

Based on the planned scope, identify which synthesis documents are relevant. Load only what is needed for this session's work.

Relevant synthesis documents may include:
- Token architecture: `{{sistema_url}}/raw/principles/tokens/architecture`
- Color architecture: `{{sistema_url}}/raw/principles/color/architecture`
- Typography architecture: `{{sistema_url}}/raw/principles/typography/architecture`
- Spacing and layout: `{{sistema_url}}/raw/principles/spacing/layout`
- Shape architecture: `{{sistema_url}}/raw/principles/shape/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`
- Motion architecture: `{{sistema_url}}/raw/principles/motion/architecture`

**Step 4 — Confirm readiness:**

State: "Ready to begin. Current system state: [one-sentence summary]. Session goal: [goal]. Relevant documents loaded: [list]."

Do not begin work until this confirmation is produced.

---

## add-component — Add a Component to the Design System

**Stage:** 6
**Tags:** stewardship, components, implementation, living-brief

Use this play when adding a new component to an existing design system. It ensures the component is consistent with existing decisions, consumes the correct tokens, and meets accessibility requirements before it is treated as a pattern.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention, the shape and spacing scale, and any component decisions already recorded. Identify whether any similar component already exists that should inform this one.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

**Step 3 — Specify the component:**

Component to add: [component name and one-line description]

Before implementing, write a brief spec covering:
- Variants (if any) with "when to use" for each
- States: default, hover, focus, active, disabled — and which token changes per state
- Token map: every CSS custom property the component will consume
- Accessibility: ARIA role, keyboard behavior, accessible name requirement, touch target size

Confirm the spec is consistent with existing components in the living brief's current state list before proceeding.

**Step 4 — Implement the component:**

Framework: [React / Vue / Svelte / Web Components]
Styling: [CSS custom properties / Tailwind / CSS Modules]

Implement the component from the spec. Requirements:
- No hardcoded hex values or raw px values for anything covered by a token
- Focus indicator meets 3:1 contrast against the surface it appears on
- Interactive area meets 44×44px minimum
- All ARIA attributes and keyboard behavior per the accessibility floor

**Step 5 — Update the living brief:**

Move the component from "stubbed" to "implemented" in Current State (if it was previously stubbed), or add it to the implemented list. Append to the decision log:
```
[2026-05-13] — [Component name] added — [note any non-obvious variant or token decisions]
```

---

## audit-token-coverage — Audit Token Coverage Across the Codebase

**Stage:** 6
**Tags:** stewardship, audit, tokens, drift

Use this play to find hardcoded values in the codebase that should be consuming design tokens. Run it periodically — especially after rapid development phases — to catch drift before it compounds.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the token naming convention and the list of implemented components. This tells you what the correct token names are and what components should be covered.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`

Pay attention to the "no raw values in components" rule and the coverage requirements.

**Step 3 — Scan for drift:**

Search the codebase for hardcoded values that should be tokens. Look for:
- Hex color values (`#`) in component files
- `rgb(`, `rgba(`, `hsl(` in component styles
- Raw pixel values for spacing that should use spacing tokens
- Raw pixel values for border-radius that should use shape tokens
- Font size or weight values that should use type tokens
- Box-shadow values that should use elevation tokens

Exclude:
- Token definition files (the values legitimately appear there)
- Third-party library styles
- Test fixtures

**Step 4 — Produce the audit report:**

For each violation found:
- File path and line number
- The hardcoded value
- The correct token it should use
- Severity: **blocking** (color or interactive state — affects consistency and accessibility), **recommended** (spacing or shape — affects consistency), **minor** (one-off value with minimal systemic impact)

Output:
1. Summary: total violations by severity
2. Prioritized list of violations (blocking first)
3. Recommended fix order (group by component or file for efficiency)

---

## accessibility-audit — Audit Components Against the Accessibility Floor

**Stage:** 6
**Tags:** stewardship, audit, accessibility, wcag

Use this play to evaluate the current state of the design system's components against the non-negotiable accessibility requirements. Produces a structured report with severity levels.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note which components are implemented and any accessibility decisions already recorded.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

This is the normative checklist. Every item marked "must" in that document is a blocking violation if not met.

**Step 3 — Define the audit scope:**

Components to audit:
[List the components you want to audit, or write "all implemented components" to audit everything in the living brief's current state list.]

**Step 4 — Evaluate each component:**

For each component, evaluate against each section of the accessibility floor:

1. **Color contrast** — For each text/background pairing, POST the hex values to `{{sistema_url}}/api/contrast` and use the returned ratio and pass/fail verdict. Report the exact ratio — do not estimate. All normal text must return `aa_text: true` (≥ 4.5:1); large text and UI components must return `aa_ui: true` (≥ 3:1).
2. **Keyboard navigation** — Is every interactive element reachable by keyboard? Can it be activated with the correct key?
3. **Focus visibility** — Is the focus indicator visible? Does it meet 3:1 contrast against the adjacent surface?
4. **Touch targets** — Is the interactive area ≥ 44×44px?
5. **Semantic structure** — Does the component use semantic HTML or a full ARIA implementation?
6. **Accessible name** — Does every interactive element have an accessible name?
7. **Dynamic state** — Are state changes (expanded, selected, checked) exposed via ARIA attributes?

**Step 5 — Produce the audit report:**

For each component:
- Pass / Fail / Needs verification per criterion
- Specific violations with severity: **blocking** (WCAG A/AA violation), **recommended** (best practice not met), **minor** (enhancement)

Summary:
- Components fully passing
- Components with blocking violations (must fix before ship)
- Components with recommended improvements

---

## design-system-retrospective — Run a Design System Retrospective

**Stage:** 6
**Tags:** stewardship, retrospective, living-brief, maintenance

Use this play at regular intervals (end of a sprint, end of a phase, before a major release) to identify drift, undocumented decisions, and decisions that need revisiting. Updates the living brief.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` in full. Note any open questions that have been de facto resolved by implementation but not recorded.

**Step 2 — Read the current system state:**

Read the token files and component files identified in the living brief's Current State section. You are looking for:
- Values or patterns that exist in code but are not reflected in the living brief's Key Decisions
- Components that have been added or changed without updating the Current State list
- Decisions that were made with `[to be determined]` markers but have since been implemented

**Step 3 — Evaluate alignment:**

Answer these questions:
1. What has drifted from the recorded decisions? (Code says one thing; brief says another)
2. What has been added without documentation? (New components, new tokens, new patterns)
3. What decisions made early should be revisited? (Early constraints that no longer apply, or that have proven wrong in practice)
4. Does DESIGN.md need to be updated? (If any token values, component patterns, or Do's and Don'ts have changed)

**Step 4 — Produce the retrospective report:**

Output a structured report:
```
## Drift found
[List each discrepancy: what the brief says vs. what the code does]

## Undocumented additions
[Components, tokens, or patterns that exist but aren't in the brief]

## Decisions to revisit
[Early decisions that may need to change, with rationale]

## DESIGN.md update needed?
[Yes / No — and if yes, what specifically needs to change]
```

**Step 5 — Update the living brief:**

Based on the retrospective:
- Update Key Decisions for any that have changed
- Update Current State to reflect actual implemented state
- Move any de-facto-resolved open questions to the decision log
- Add a retrospective entry to the decision log:
```
[2026-05-13] — Retrospective — [one-sentence summary of most significant finding]
```

---

## plan-next-iteration — Plan the Next Design System Iteration

**Stage:** 6
**Tags:** stewardship, planning, living-brief, iteration

Use this play at the start of a new work cycle — after a retrospective, after a phase completes, or when planning what to build next. Produces a prioritized task list for the next iteration.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` in full. Pay particular attention to:
- Open questions (unresolved decisions)
- Current state gaps (stubbed components, missing token categories)
- The most recent retrospective entry in the decision log

**Step 2 — Assess the system's current maturity:**

Classify the system's current state across five dimensions:

| Dimension | Not started | Partial | Complete |
|---|---|---|---|
| Token foundation (primitive + semantic) | | | |
| Component coverage (key components implemented) | | | |
| Accessibility compliance | | | |
| Dark mode (if required) | | | |
| Documentation (DESIGN.md current, living brief current) | | | |

**Step 3 — Identify the highest-priority work:**

Based on the maturity assessment and the living brief's open questions, identify the top 3–5 items for the next iteration. Prioritize using these rules:
1. **Blocking gaps** — missing foundations that block other work (no token file = can't implement components)
2. **Accessibility violations** — any blocking issues from the accessibility audit
3. **Coverage gaps** — components that are stubbed but needed for the product
4. **Open questions** — decisions that have been deferred but now have enough information to resolve
5. **Improvements** — enhancements to things that exist but aren't complete

**Step 4 — Produce the iteration plan:**

Output a structured plan:
```
## Iteration goal
[One sentence describing the primary outcome of this iteration]

## Tasks (prioritized)
1. [Task] — [why it's first] — [relevant play to use]
2. [Task] — [why it's here] — [relevant play to use]
...

## Open questions to resolve this iteration
- [Question] — [approach to resolving it]

## Success criteria
[How you will know this iteration is complete]
```

**Step 5 — Update the living brief:**

Append to the decision log:
```
[2026-05-13] — Iteration planned — [iteration goal in one sentence]
```

---

## scaffold-core-components — Scaffold a Core Component Set

**Stage:** 4
**Tags:** components, shadcn, implementation, build-out

You are implementing the core component set for this design system, consuming the token system you have generated. The token system (color, type, shape, spacing) must be compiled before this play begins.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Confirm the technology stack, token naming convention, shape scale, and approved visual direction.

Fetch and read the following from the Sistema knowledge base:
- Token architecture synthesis: `{{sistema_url}}/raw/principles/tokens/architecture`
- Accessibility floor: `{{sistema_url}}/raw/principles/accessibility/floor`

**Step 2 — Confirm component library:**

Ask the user:
1. Do you want to use shadcn/ui as the component base? (Recommended for Tailwind-based projects — Radix UI primitives with Tailwind, highly customizable, widely adopted. Components are copied into your project and owned by you.)
2. Alternatives: Base UI (unstyled Radix-compatible primitives), Radix UI directly, or no library (build from scratch).

If the stack doesn't use Tailwind, adapt the approach to the actual styling layer — don't force Tailwind-specific integration on a non-Tailwind project.

**Step 3 — Wire the token system into the framework:**

Before installing any components, establish the token integration layer. Without it, component code that references token-named utilities won't resolve.

**For Tailwind-based projects:**

Generate `tailwind.config.ts` extending the theme with every token from the token system. Every compiled CSS custom property must have a corresponding Tailwind utility class:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './app/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:             'var(--color-primary)',
        'on-primary':        'var(--color-on-primary)',
        'primary-container': 'var(--color-primary-container)',
        secondary:           'var(--color-secondary)',
        'on-secondary':      'var(--color-on-secondary)',
        surface:             'var(--color-surface)',
        'surface-raised':    'var(--color-surface-raised)',
        'surface-overlay':   'var(--color-surface-overlay)',
        'on-surface':        'var(--color-on-surface)',
        'on-surface-muted':  'var(--color-on-surface-muted)',
        border:              'var(--color-border)',
        'border-focus':      'var(--color-border-focus)',
        error:               'var(--color-error)',
        'on-error':          'var(--color-on-error)',
        success:             'var(--color-success)',
        warning:             'var(--color-warning)',
        // add any additional roles from the color token file
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      spacing: {
        // Add all stops from tokens/src/spacing.json
        1:  'var(--space-1)',
        2:  'var(--space-2)',
        3:  'var(--space-3)',
        4:  'var(--space-4)',
        5:  'var(--space-5)',
        6:  'var(--space-6)',
        8:  'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
      },
    }
  }
}
export default config
```

Verify the import path for compiled token CSS in the global stylesheet against the actual project directory structure — the path differs based on whether a `src/` directory is present.

If using **Next.js**, load fonts via `next/font` — not a CDN `@import` in the global stylesheet. `next/font` self-hosts the font, eliminates render-blocking requests, and prevents layout shift. If the stack uses a different framework, use its idiomatic font loading approach.

**For non-Tailwind projects:** establish the token integration layer appropriate to the CSS approach in use — CSS modules, vanilla CSS with custom properties, or the framework's theming API.

**Step 4 — Define the component file structure:**

Before writing any component code, establish the file organization. Organize by functional group — not a catch-all file:

```
components/ui/
  button.tsx      — Button, IconButton
  input.tsx       — Input, Textarea
  select.tsx      — Select, Combobox
  form.tsx        — Checkbox, Radio, Switch, FormField
  feedback.tsx    — Badge, Toast, Alert
  overlay.tsx     — Dialog, Popover, Tooltip, Drawer
  surface.tsx     — Card, Separator, Divider
  index.ts        — barrel export: re-exports every public component
```

Adjust groupings to match the actual component set. The `index.ts` barrel must re-export every public component so consumers always import from `@/components/ui`, never from individual files.

**Step 5 — Install and scaffold components:**

If shadcn/ui: initialize with `npx shadcn@latest init`, then generate at minimum: Button, Input, Select, Checkbox, Badge, Card, Dialog, Popover, Separator, Tooltip.

For each component, verify:
- Token consumption: no hardcoded hex values or raw px for anything covered by a token
- All interactive states present (hover, focus, active, disabled)
- Focus indicator meets 3:1 contrast per the accessibility floor
- Touch target ≥ 44×44px for interactive elements

**Step 6 — Customize to the visual direction:**

Apply the approved visual direction from `style-preview.html`:
- Radius values match the shape token scale
- Color variable mappings use semantic role tokens
- Typography references the type scale tokens
- Composite card specimen from `style-preview.html` serves as the visual target

**Step 7 — Generate component-preview.html:**

Generate a self-contained `component-preview.html` showing all core components in default, hover, and focus states. Pause for user review before proceeding.

**Step 8 — Update the living brief:**

Update the Components implemented list. Append to the Decision Log:
```
[date] — Core component set scaffolded — [library used, components generated, any notable customizations]
```

---

## generate-page-examples — Generate Full-Page Examples

**Stage:** 4
**Tags:** components, examples, build-out, visual-language

You are generating 1–2 full-page HTML demonstrations of the design system in use at the page level. These are not prototypes — they are static HTML/CSS files showing the visual language applied to realistic page compositions.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the product type — page types should be appropriate for the product context.

**Step 2 — Confirm page types:**

Suggest 2 page types based on the product type recorded in LIVING_BRIEF.md. Common options:
- Dashboard with sidebar navigation, data table, stat cards
- Settings page with form controls and section headers
- Marketing landing page with hero, feature grid, CTA
- Detail view with header, content area, sidebar

Ask the user to confirm or redirect before proceeding.

**Step 3 — Generate the pages:**

For each page:
- Self-contained HTML file, all styles in a `<style>` block
- Uses CSS custom property tokens from the token system
- Uses component patterns from `scaffold-core-components`
- Realistic content — write copy appropriate to the product type (not lorem ipsum)
- Full-width at desktop (1200px+), responsive to at least 768px

Quality standard: pages should feel like production UI. Typography hierarchy clear. Density appropriate. Color usage consistent with the commitment level. No decorative elements beyond the token system.

Write files as: `page-example-1.html`, `page-example-2.html`.

Pause for user review before proceeding.

---

## setup-documentation-site — Set Up a Documentation Site

**Stage:** 4
**Tags:** components, documentation, build-out, stewardship

You are setting up a lightweight component gallery and token reference that the team can maintain. This is not Storybook — it is a simple, maintainable solution.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the framework and technology stack.

**Step 2 — Confirm approach:**

Recommend a single `docs/index.html` — a self-contained HTML file that renders all components, tokens, and usage examples with no build step required. Ask the user to confirm or redirect.

**Step 3 — Generate docs/index.html:**

The file must contain:

1. **Token reference** — all color tokens as swatches with values; all type roles rendered; all radius and shadow tokens shown
2. **Component gallery** — each core component in its variants and states; organized by name
3. **Usage notes** — brief "when to use" for each component (design intent, not API reference)
4. **Page example links** — links to the page example files
5. **Visual direction summary** — the visual direction brief from `establish-visual-language`, condensed for the team

Technical requirements: self-contained HTML, reads from the same CSS custom property values used in the product, openable directly from the filesystem.

**Step 4 — Update the living brief:**

Append to the Decision Log:
```
[date] — Documentation site generated — [approach, sections included]
```

---

## define-voice-and-tone — Define Voice and Tone

**Stage:** 1
**Tags:** content, voice, tone, copywriting, foundations, living-brief

You are establishing the voice, tone, and writing standards for a design system. Your output is a `VOICE_AND_TONE.md` document that becomes the persistent writing reference for the project — the equivalent of a content design system's `DESIGN.md`.

**Step 1 — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Note:
- Product type and audience
- Brand stance (expressive ↔ utilitarian)
- Density (content-dense / content-sparse / balanced)
- Any existing voice or brand personality notes

If no living brief exists, ask the user to run `establish-context` first, or provide the project context below.

**Step 2 — Read the references:**

Read the following from the Sistema knowledge base:
- Voice and tone synthesis: `{{sistema_url}}/raw/principles/content/voice-and-tone`
- UI copy patterns: `{{sistema_url}}/raw/principles/content/ui-copy-patterns`
- Writing mechanics: `{{sistema_url}}/raw/principles/content/writing-mechanics`

These three documents synthesize content design guidance from MailChimp, Shopify Polaris, Carbon (IBM), and Atlassian. The voice-and-tone synthesis defines the cross-system baseline (plainspoken, genuine, helpful, direct), the brand-specific trait model, and the tone-adjustment framework by emotional context. The UI copy patterns document covers buttons, navigation, form labels, error messages, empty states, and confirmation dialogs — each with production-grounded do/don't examples. The writing mechanics document covers capitalization (sentence case everywhere), punctuation (periods, Oxford comma, exclamation marks), numbers, active voice, second-person address, reading level, and the lean content rule. Treat all three as the foundation — your output extends them with product-specific decisions, not replaces them.

**Step 3 — Generate VOICE_AND_TONE.md:**

My project context (supplement to the living brief):

{{project_context}}

Write `VOICE_AND_TONE.md` at the project root with this structure:

```
# VOICE_AND_TONE.md

*Voice and writing standards for [Product Name]. Read at session start; reference when writing or reviewing any UI copy.*

---

## 1. Voice

**[2–3 word voice label]:** [One-sentence description of the voice character that distinguishes it from the generic baseline.]

Core traits (extend the cross-system baseline):
- **Plainspoken:** [How this product specifically interprets plainspoken]
- **Genuine:** [Any brand-specific authenticity notes]
- **[Brand-specific trait 1]:** [Description and limits]
- **[Brand-specific trait 2 if applicable]:** [Description and limits]

Voice limits: [What this voice is not. 2–3 explicit prohibitions.]

---

## 2. Tone adjustments

| Context | Reader state | Our tone |
|---|---|---|
| [context specific to this product] | [state] | [direction] |
...

---

## 3. Writing mechanics

Capitalization: [sentence case / any exceptions]
Periods: [single-sentence labels: omit / multi-sentence: use]
Contractions: [use / avoid — with rationale]
Numbers: [numerals in UI / spell out in body if applicable]
Oxford comma: [use / omit]
Exclamation marks: [use sparingly / specific contexts]
Address users as: [you / they / other — with rationale]

---

## 4. UI copy patterns

### Buttons
[Verb+noun rule for this product. Any exceptions or brand-specific patterns.]

### Errors
[Error message structure for this product. Tone guidance specific to the product's emotional register.]

### Empty states
[Empty state structure. Whether this product uses personality/illustration or direct instruction.]

### Confirmations
[Confirmation dialog standard for this product.]

---

## 5. Words to use / avoid

| Use | Avoid | Reason |
|---|---|---|
| [term the product uses] | [term to avoid] | [brief reason] |
...

---

## 6. The test

Before publishing any copy: read it aloud. Does it sound like something a person at [Company/Product] would actually say to a user?

If yes: ship it. If not: rewrite it.
```

Rules:
- Draw specific character traits from the project context and living brief — do not use generic placeholder values
- The voice label should be memorable and specific, not "friendly and professional"
- The tone adjustment table must include 4–6 rows with contexts specific to this product's UI flows
- The words table must include at least 5 rows drawn from the product's domain vocabulary
- Use the cross-system mechanics defaults unless the project context gives a clear reason to deviate
- Output raw markdown only — no surrounding explanation

**Step 4 — Update the living brief:**

Append to the Decision Log in `LIVING_BRIEF.md`:
```
[date] — Voice and tone guide generated — VOICE_AND_TONE.md created. Key voice traits: [list].
```
