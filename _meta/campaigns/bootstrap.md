You are running the **Bootstrap a Design System** campaign. This is a self-driving 6-step process. You will complete each step sequentially, ask the user for input when you need it, and pause for confirmation before advancing. Do not begin a step until the previous one is complete.

**If any prompt in this campaign references `https://sistema.design/raw/...`, fetch those URLs to load the reference material before proceeding with that step.**

---

## Standing quality directive

Your primary success criterion throughout this campaign is production quality — decisions that are specific, intentional, and defensible. Functional correctness is the floor, not the ceiling.

Before marking any step complete, hold the output to this test: would a senior product designer recognize this as production-ready work, or does it read as a safe first draft? Specific patterns that signal low quality: text colors chosen without a stated rationale, the same border-radius applied to every component, type scale roles with undifferentiated line-height values, spacing that follows no discernible system.

When a decision is underspecified, make the specific choice and explain your reasoning. Do not silently apply a safe default. If a decision requires information you don't have — a brand color, a product name, an aesthetic direction — ask the user before proceeding. Do not assume or invent.

---

## Campaign map

1. **positioning-brief** — Establish the product's design stance and seed LIVING_BRIEF.md
2. **generate-design-md** — Generate the full DESIGN.md scaffold
3. **generate-color-scheme** — Generate semantic color role tokens as CSS custom properties
4. **generate-type-scale** — Generate a modular type scale with leading and tracking
5. **generate-shape-tokens** — Generate shape tokens: radius, elevation, border width
6. **generate-style-dictionary** — Export the token set as Style Dictionary v5 source JSON

Begin Step 1 now.

---

## Step 1 — positioning-brief

You are helping establish the positioning brief for a new design system before any values are chosen. This brief drives every downstream decision — color model, type scale, density, brand personality — so it must be specific.

Work through the following questions with the user. For each one, ask for clarification if the answer is too vague to be actionable. When you have answers to all questions, produce the two outputs below.

**Questions:**

1. **Product type and context:** What kind of product is this? Who are the primary users and what are they trying to accomplish?

2. **Information density:** Is the UI primarily content-dense (tables, dashboards, data-heavy forms) or content-sparse (focused flows, marketing, simple consumer tasks)? Or does it serve both modes?

3. **Brand stance:** Where does this product sit on the expressive ↔ utilitarian spectrum? Expressive products have personality and visual distinctiveness. Utilitarian products prioritize clarity and cognitive load reduction. Most are somewhere between.

4. **Color constraints:** Does the product have an existing brand color? Any colors that must be avoided or reserved?

5. **Theme requirements:** Light mode only, dark mode only, or both? If both — is one primary?

6. **Platform and scale:** Web only, mobile only, or cross-platform? One team or multiple? Estimated component count: small (<20), medium (20–60), or large (60+)?

7. **Accessibility requirements:** Standard WCAG 2.2 AA, or a stronger requirement?

8. **Timeline and constraints:** Is there an existing codebase to work with? Any technology constraints (framework, CSS approach, design tool)?

**Output 1 — Positioning brief** (prose, 150–250 words):

A narrative description of the product's design stance. Should answer: what this product looks like and feels like, what it deliberately does not look like, and what principles guide every visual decision. Write it as a brief an engineer or designer can hand to an AI agent to get consistent output.

**Output 2 — Living brief seed:**

Populate the Project Identity and Key Decisions sections of LIVING_BRIEF.md. Leave Key Decisions entries as `[to be determined — {reason}]` for anything not yet resolvable. Write the file to `LIVING_BRIEF.md` at the project root. Use this structure:

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

---

## 2. Key Decisions

**Color:** [decisions recorded or TBD]
**Typography:** [decisions recorded or TBD]
**Spacing:** [to be determined — generate-shape-tokens play]
**Shape:** [to be determined — generate-shape-tokens play]
**Motion:** [to be determined]
**Tokens:** [to be determined — generate-style-dictionary play]

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

*[today's date] — Positioning brief completed — [one-line summary of key stance decisions]*
```

### Before proceeding to Step 2

- [ ] `LIVING_BRIEF.md` exists at the project root with all sections populated
- [ ] The positioning brief (Output 1) is specific — it names what this product looks and feels like and what it does not. Vague language ("modern," "clean," "professional") is not acceptable without qualification.
- [ ] At minimum: color stance, density target, and theme scope are resolved
- [ ] Quality check: read the positioning brief aloud. Does it describe a recognizable, specific aesthetic? Or could it describe any product?

**Pause here.** Summarize what was established in 2–3 sentences, then ask: *"Step 1 complete. Ready to proceed to Step 2 — generating DESIGN.md?"*

---

## Step 2 — generate-design-md

You are generating a `DESIGN.md` file — a concise specification document that describes the design system's visual language for use with AI coding tools.

**Step 2a — Read the living brief:**

Read `LIVING_BRIEF.md` from the project root. Confirm the product identity, density, theme, and any key decisions already recorded.

**Step 2b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- DESIGN.md format specification: `https://sistema.design/raw/standards/design-md/spec`
- Token architecture synthesis: `https://sistema.design/raw/principles/tokens/architecture`

The spec file defines the exact format, YAML schema, section order, and token types. The token architecture synthesis explains the tier model and naming principles your DESIGN.md should follow.

**Step 2c — Generate the DESIGN.md:**

Generate a complete `DESIGN.md` file following the specification exactly. Every section defined in the spec must be present. Where a value is genuinely undetermined, mark it `[TBD]` with a note — do not invent values that haven't been decided.

Quality standard for this step: every value in DESIGN.md should be defensible. If you are choosing a value that will later be overridden by a token-generation step, mark it as provisional. If you are choosing a value because it fits the positioning brief, say why in a comment.

Write the file to `DESIGN.md` at the project root.

**Step 2d — Update the living brief:**

Append to the Decision Log:
```
[date] — DESIGN.md generated — [note key decisions made and any provisional values]
```

### Before proceeding to Step 3

- [ ] `DESIGN.md` exists at the project root
- [ ] All required sections from the spec are present
- [ ] No section is left empty — provisional values are marked `[TBD: reason]`, not omitted
- [ ] Quality check: does DESIGN.md reflect the positioning brief's stance, or does it feel generic?

**Pause here.** Ask: *"Step 2 complete. DESIGN.md is generated with [N] sections. Ready to proceed to Step 3 — generating the color palette?"*

---

## Step 3 — generate-color-scheme

You are generating a complete color scheme — semantic color role tokens as CSS custom properties, ready to ship.

**Step 3a — Ask the user for color input:**

Before proceeding, ask:
1. What is the primary brand color? (hex value preferred; a description is acceptable)
2. Theme scope: light only, dark only, or both? (Confirm against LIVING_BRIEF.md — if already resolved, confirm rather than re-ask)

Wait for answers before continuing.

**Step 3b — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the theme setting, any existing color decisions, and the product's density and brand stance.

**Step 3c — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Color architecture synthesis: `https://sistema.design/raw/principles/color/architecture`
- Token architecture synthesis: `https://sistema.design/raw/principles/tokens/architecture`

The color architecture synthesis explains the four major architectural models, contrast requirements, foreground pairings, and dark mode tonal shift logic. Use it to select the appropriate model for this product.

**Step 3d — Generate the color scheme:**

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

For dark mode (if required): use tonal shift logic from the synthesis — do not invert light mode values. Every `on-*` role must meet WCAG 4.5:1 against its paired surface. Flag any role where contrast should be manually verified.

Write the output as a CSS file at the path specified in DESIGN.md, or as `src/styles/tokens/colors.css` if not yet specified.

Quality standard: every color value should be intentional. Surface colors are not "almost white" — they have specific hex values chosen for the product's character. Text colors are not "dark gray" — they are specific values with verified contrast ratios.

**Step 3e — Update the living brief:**

Update the Color entry in Key Decisions. Append to the Decision Log:
```
[date] — Color scheme generated — [architecture model, theme scope, primary color]
```

### Before proceeding to Step 4

- [ ] Color token file exists with all required roles
- [ ] Every `on-*` role has a verified contrast ratio against its paired surface (list them)
- [ ] Dark mode overrides exist if theme is "both"
- [ ] Quality check: do the surface colors have distinct characters, or are they all near-white with different opacity?

**Pause here.** Ask: *"Step 3 complete. Color scheme generated with [N] roles. Ready to proceed to Step 4 — generating the type scale?"*

---

## Step 4 — generate-type-scale

You are generating a typography token set for this design system.

**Step 4a — Ask the user for typography input:**

Before proceeding, ask:
1. Is there a preferred typeface or typeface pairing already decided? (Check LIVING_BRIEF.md first — if resolved, confirm.)
2. Any typography direction: a description of the desired typographic character (e.g., "editorial and authoritative," "compact and functional," "friendly and approachable")?

Wait for answers if not already resolved in LIVING_BRIEF.md.

**Step 4b — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the density target, any typeface decisions, and the product's expressive vs. utilitarian stance.

**Step 4c — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Typography architecture synthesis: `https://sistema.design/raw/principles/typography/architecture`

This synthesis covers scale construction (modular vs. hand-tuned, ratio selection), role taxonomy decisions (named roles vs. numeric steps), and non-negotiable legibility constraints (line height per role, measure, letter-spacing direction by size).

**Step 4d — Generate the type scale:**

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

Quality standard: type roles should be distinguishable from each other. If heading-lg and heading-sm have the same weight and nearly the same size, the hierarchy is not doing its job. Every role exists for a specific reason — name it in the comment.

Write the output as a CSS file and note the path.

**Step 4e — Update the living brief:**

Update the Typography entry in Key Decisions. Append to the Decision Log:
```
[date] — Type scale generated — [scale approach, typeface decisions, number of roles]
```

### Before proceeding to Step 5

- [ ] Type scale CSS file exists with all roles
- [ ] Each role has all four token properties
- [ ] Legibility constraints are met for all roles
- [ ] Quality check: read the role names and sizes aloud. Does the hierarchy feel clear and intentional? Are there any roles with indistinguishable visual weight?

**Pause here.** Ask: *"Step 4 complete. Type scale generated with [N] roles. Ready to proceed to Step 5 — generating shape tokens?"*

---

## Step 5 — generate-shape-tokens

You are generating shape tokens — border-radius, elevation (shadow), and border width — for this design system.

**Step 5a — Ask the user for shape direction:**

Before proceeding, ask:
1. Where does this product sit on the sharp ↔ rounded spectrum? (sharp = 0–4px radius personality; rounded = 8–16px; pill = heavy use of full radius)
2. Any existing shape decisions already in LIVING_BRIEF.md? (Check first.)

Wait for an answer if not resolved.

**Step 5b — Read the living brief:**

Read `LIVING_BRIEF.md`. Note the brand stance — expressive vs. utilitarian directly drives radius personality.

**Step 5c — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Shape architecture synthesis: `https://sistema.design/raw/principles/shape/architecture`

This synthesis covers the radius-as-personality spectrum, scale approach options, component family consistency rules, and shadow/elevation guidance.

**Step 5d — Generate the shape tokens:**

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

Also generate elevation tokens (shadows) for at least two levels:
```css
--shadow-sm: [value]; /* subtle lift — cards, dropdowns */
--shadow-md: [value]; /* clear elevation — modals, floating panels */
```

Explain the personality choice: where this system sits on the shape spectrum and why it fits the positioning brief.

Quality standard: the radius values should tell a coherent story. A product positioned as "precise and technical" should not have 16px border-radius on buttons. The shadow values should feel appropriate to the density — a dense data tool uses minimal elevation; a consumer app can use more expressive shadow.

**Step 5e — Update the living brief:**

Update the Shape entry in Key Decisions. Append to the Decision Log:
```
[date] — Shape tokens generated — [radius personality, scale range, shadow approach]
```

### Before proceeding to Step 6

- [ ] Shape token CSS file exists
- [ ] All radius stops are defined and the component mapping table is complete
- [ ] Elevation tokens are defined
- [ ] Quality check: do the radius values match the positioning brief's character?

**Pause here.** Ask: *"Step 5 complete. Shape tokens generated. Ready to proceed to Step 6 — generating the Style Dictionary configuration?"*

---

## Step 6 — generate-style-dictionary

You are setting up Style Dictionary to compile the design tokens generated in this campaign into CSS custom properties, JavaScript modules, and other platform outputs.

**Step 6a — Ask the user for repository context:**

Before proceeding, ask:
1. What is the repository structure? (Where are the source files, what framework is in use?)
2. What output formats are needed? (CSS vars, JS ESM, JSON, SCSS — pick the ones that apply)
3. Any existing file organization to work around?

**Step 6b — Read the references:**

Fetch and read the following from the Sistema knowledge base:
- Token architecture synthesis: `https://sistema.design/raw/principles/tokens/architecture`

Pay attention to the tier model and file structure recommendations — the Style Dictionary input files should mirror this structure.

**Step 6c — Generate the configuration:**

Produce:

1. A `style-dictionary.config.js` (or `.mjs`) file ready to run
2. The expected input file structure, organized by tier (primitive → semantic → component) per the token architecture synthesis
3. Example npm scripts: `"tokens": "node style-dictionary.config.mjs"`
4. Migration guidance: how to move the CSS custom property files generated in steps 3–5 into the token JSON source structure

The output should be complete enough to copy into the repository and run with `npx style-dictionary build`.

**Step 6d — Update the living brief:**

Update the Tokens entry in Key Decisions. Append to the Decision Log:
```
[date] — Style Dictionary configured — [output formats, file structure approach]
```

### Campaign complete

- [ ] Style Dictionary config exists and is runnable
- [ ] Token source file structure is defined
- [ ] All CSS files from steps 3–5 have a migration path into the token JSON structure
- [ ] LIVING_BRIEF.md Decision Log has an entry for each of the 6 steps

**Campaign complete.** Summarize:
1. What was produced (list the files)
2. The key decisions made (positioning, color model, type scale approach, shape personality)
3. The next recommended step (run `session-start` before beginning component work)
