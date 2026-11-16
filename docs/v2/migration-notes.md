# Migration Notes

**V1.5 revision (2026-11-15):** after the slice runs, the converted plays changed as listed in `fit-review-1.md` sections 2 to 7. Summary:
- `project.assess` adds the agent instructions pointer, `continue`, `theme_primary`, `platform`, an "Inferred, not asked" line, and explains how existing colors will be handled without asking for a strategy.
- `visual-language.direction` takes every preview color from the palette tool, writes to `sistema-review/`, and may link web fonts.
- `color.scheme` reuses the stops the approved preview used, and lists any change.
- `color.map-existing` diagnoses existing values, builds a comparison page with three options per hue, and asks before changing anything (`color.existing.consent`).
- `tokens.pipeline` states the Tailwind 3 and 4 wiring, lists every file it changes outside `tokens/`, requires a passing app build, links the DESIGN.md front matter spec, and adds "approved but not yet tokenized" to the token check page.
- The tables below describe the first conversion (V1.1).

For each converted play: where every instruction from the legacy play (and its Bootstrap campaign copy) went. Each instruction is either **kept** (in the new procedure), **moved** (to a rule, a guide section, the contract, or the renderer), or **dropped** (with a reason).

The renderer (`src/lib/content/render.ts`) now produces sections that every legacy play wrote by hand: references, tool usage, "update the living brief," and the decision log line. Those are marked **renderer** below.

---

## project.assess (from establish-context, positioning-brief, and Bootstrap Step 1)

| Legacy instruction | Where it went |
|---|---|
| Scan the project before asking (living brief, DESIGN.md, package.json, token files, 3–5 components) | Kept, step 1. Adds `sistema.json`, DECISIONS.md, Tailwind theme, `style-preview.html`, `token-check.html` |
| State which questions are already answered | Kept, as the findings table (step 2) and "skip anything step 1 answered" (step 3) |
| — | **New:** classify each Start output as conforms, differs, or missing (step 2), and record routing (step 5). This is what makes Start serve existing projects |
| Questions 1–9 (product, density, stance, visual character, color constraints, theme, platform and scale, accessibility, technology) | Kept, step 3. The accessibility question now helps the person *choose* a standard for their use case, instead of defaulting to WCAG 2.2 AA (plan 9.3). Rule `project.a11y.standard-chosen` |
| Ask for clarification on vague answers | Kept, step 3 |
| positioning-brief Output 1: a 150–250 word positioning brief | Kept, as a 100–200 word positioning statement, the first DECISIONS.md entry (step 7) |
| positioning-brief Output 2 and establish-context Step 3: write LIVING_BRIEF.md with Identity, Key Decisions, Current State, Open Questions, and Decision Log | **Moved.** Identity becomes the positioning statement plus `sistema.json` `project`. Key Decisions and the Decision Log go to DECISIONS.md. Current State becomes `sistema.json` `steps` plus the findings table. Open Questions are dropped as a section: unresolved items become questions in the play that needs them |
| Confirm readiness and name the next play | Kept, step 8 (summary). The next play comes from the workflow, not from this play |
| Rule: don't ask what files answer | Moved to rule `project.read-before-asking` |

## visual-language.direction (from establish-visual-language and Bootstrap Step 2)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief | Kept, step 1 (`sistema.json` and the positioning statement) |
| Fetch three guides up front | **Renderer**, "Read when you need it," with specific sections, fetched on demand |
| Visual direction brief, 5 questions | Kept, step 2 |
| AI slop first-order reflex check | Kept, step 3. Rule `quality.color.first-order-reflex` |
| style-preview.html with 7 sections | Kept, step 5. Section list moved to rule `visual-language.style-tile.sections` and the guide |
| Self-contained, hex and OKLCH, annotate every decision | Moved to rule `visual-language.style-tile.self-contained`. Hex and OKLCH also kept in step 5 |
| Quality checks: commitment consistency, bans, reflex, flag contrast | Kept. Bans and reflex are rules. Contrast is now *checked with the contrast tool* (step 5) instead of only flagged |
| Request review with key decisions; don't proceed without approval | Kept, step 7. The workflow gate `direction-approved` enforces it |
| After approval, record commitment level, primary seed, neutral seed, and secondary seeds in the living brief | **Moved** to the DESIGN.md Overview "Direction values" list (step 6), where the color play reads them |
| Choose seeds | Kept, step 4. Ramps explicitly deferred to the color play |
| Decision log line with literal format | **Renderer** ("Record it"), with no literal date |

## color.scheme (from generate-color-scheme and Bootstrap Step 4)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief (theme, existing decisions, density, stance, commitment level) | Kept, step 1 (DESIGN.md Overview and `sistema.json`) |
| Read 4 guides up front, with paragraph summaries of each | **Renderer**, with specific sections. Summaries dropped, since the guides speak for themselves |
| Theme mode variable and light, dark, or both instructions | `color_mode` kept as an override. Theme comes from `sistema.json`. Output structure kept, steps 4–5 |
| Determine seeds from color direction (hex, name, or none, then ask) | Seeds now come from the approved direction (step 1). `color_direction` remains an override for standalone runs. "Avoid medium blue" moved to rule `quality.color.first-order-reflex` |
| Primary, tinted neutral, and feedback ramps | Kept, steps 3. "Neutral must not be pure gray" moved to rule `quality.color.bans` |
| POST /api/palette with the body shape and response shape | Kept, step 3. Request and response shapes moved to the **renderer** Tools section |
| Pre-built library for feedback hues (named list of 22 ramps) | Kept, step 3. The named list is dropped, since agents read library.json |
| Required roles list (21 roles) | Moved to rule `color.roles.required` |
| DTCG format example | Kept, step 4 (compact) |
| Dark mode: tonal shift, no inversion, separate file with overrides only | Kept, step 5. Rule `color.dark.tonal-shift` |
| Contrast verification with fixed thresholds (4.5, 3) | Kept, step 6. **Thresholds moved** to rules `color.contrast.text` and `color.contrast.ui`, parameterized by standard (plan 9.3) |
| Don't write a failing pair | Kept, step 6 |
| Quality checks: reflex, commitment level with chroma ranges, bans | Kept, step 7. Commitment level moved to rule `quality.color.commitment-level`. **The chroma numbers are dropped from the play** because their scale is unclear (bug inventory #34) |
| Write to tokens/src; JSON is the source, CSS is compiled | Kept, steps 4–5. Rule `tokens.source.dtcg` (on the pipeline play) |
| Update living brief and decision log | **Renderer** ("Record it") |
| Bootstrap only: "compiled in Step 9" | Dropped. It was wrong (Step 8), and steps no longer refer to each other by number |
| Bootstrap only: no palette tool call | **Fixed.** The campaign copy had dropped the palette tool. The single source now requires it (contract `tools`, rule `color.ramps.from-tool`) |

## color.map-existing (from generate-color-roles)

| Legacy instruction | Where it went |
|---|---|
| Use when you already have color values; otherwise use generate-color-scheme | Kept, intro. Routing is now automatic through `project.assess` |
| Read 2 guides up front | **Renderer** |
| Ramp completeness check: expand fewer than 10 stops to 19 via the palette tool; library for feedback hues; fixed specs proceed as-is with gaps flagged | Kept, step 3 |
| Paste your palette | Dropped as a form field. The play reads existing values from the repo (step 1), which `project.assess` located |
| Map to roles, noting each assignment | Kept, steps 2 and 5 (`$description` notes the source) |
| Contrast verification with fixed thresholds | Kept, step 4. Thresholds moved to rules |
| Flag gaps | Kept, step 3 |
| Output as CSS custom properties with an optional custom prefix | **Changed** to DTCG JSON in `tokens/src/`, since the pipeline compiles CSS. The prefix option is dropped: naming is set by the pipeline (`--color-*`) and rule `tokens.naming.role` |
| — | **New:** keep brand values and ask before changing one (step 4); leave old sources for the pipeline to replace (step 6) |

## tokens.pipeline (from generate-style-dictionary and Bootstrap Step 8)

| Legacy instruction | Where it went |
|---|---|
| Read the token guide | **Renderer** |
| List source files and describe project structure (form fields) | Kept, step 1, read from the repo. The form fields are dropped |
| Output path by framework; ask if unclear | Kept, step 2 |
| Config: sources, naming, dark selector with media fallback, npm script | Kept, step 3. Adds installing Style Dictionary if missing |
| Run compile; fix failures | Kept, step 4 |
| token-check.html with swatches, specimens, radii, spacing | Kept, step 7. Adds "skip categories that don't exist yet" |
| Wire the CSS import, with path examples | Kept, step 5, plus replacing old sources noted by `color.map-existing` |
| — | **New:** regenerate DESIGN.md front matter from DTCG (decision D6b, step 6) |
| Update living brief and decision log | **Renderer** |
| Bootstrap only: "Before proceeding to Phase 4" checklist and pause | **Moved** to the workflow gate `foundations-approved` |

## visual-language.design-md (from generate-design-md and Bootstrap Step 3)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief | Kept, step 1 (DESIGN.md Overview, the style preview, DECISIONS.md, `sistema.json`) |
| Read the spec, token architecture, and visual language guides | The spec is linked in step 2. Guides go to the **renderer** with sections |
| Generate the whole file, YAML front matter first | **Changed.** This play writes the body only. Front matter is generated from `tokens/src/` by `tokens.pipeline` (decision D6b), so values aren't written twice |
| Every section present; mark undecided values `[default — review]` or `[TBD]` | Kept, steps 3 and 4, as `Provisional: … Set by <play id>`, which names who settles it |
| Token names follow naming principles | Kept. Rule `tokens.naming.role`. **New:** the body names roles, not values (rule `visual-language.design-md.roles-not-values`), and later token plays use these names |
| Don't reference any specific design system | Dropped as a play line. It's a property of the guides |
| Output raw markdown only | Dropped (written to a file) |
| Update living brief | **Renderer** |
| — | **New:** the pointer line (rule `project.state.pointer`) |

## content.voice-and-tone (from define-voice-and-tone)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief (product, audience, stance, density) | Kept, step 1, from DECISIONS.md and `sistema.json`. **Adds** reading existing copy in the repo |
| Read three content guides, with a paragraph summary | **Renderer**, with sections. Summary dropped |
| `project_context` variable | Kept as an override |
| VOICE_AND_TONE.md with six sections and a template | Kept, step 3, as a section list rather than a fill-in template |
| — | **New:** one question when the voice isn't clear (step 2); five annotated sample strings as evidence; a line in DESIGN.md pointing to the file (step 4) |
| Baseline is the foundation; extend, don't replace | Moved to rule `content.voice.baseline` |

## typography.scale (from generate-type-scale and Bootstrap Step 5)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief; confirm typeface and character, or ask | Kept, step 1, from the Direction values and the preview |
| Read typography and quality guides | **Renderer**, with sections |
| Explore ratios in the type scale tool page (optional) | Kept as "use the type scale tool if available" (step 2). The API arrives in V2 |
| `typography_direction` variable | Kept as an override |
| DTCG format example | Kept, step 4. **Adds** `font` family tokens and a `family` reference per role |
| Minimum role list | Kept, step 3. DESIGN.md's role names take precedence |
| Line height ranges and letter spacing direction | Moved to rule `typography.line-height.by-role` (blocking) |
| Weight, size, and tracking vary across roles | Moved to rule `typography.roles.distinct` |
| JSON is the source, CSS is compiled | Rule `tokens.source.dtcg` |
| Update living brief | **Renderer** |
| — | **New:** start from the approved preview and list changes; load the fonts in the app, self-hosted where possible (rule `typography.fonts.self-hosted`, from the new-project run) |

## shape.tokens (from generate-shape-tokens and Bootstrap Step 6)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief for stance | Kept, step 1, from Direction values and the preview |
| Read shape and quality guides | **Renderer**. **Adds** the depth guide, since elevation lives here (capability model, Section 8) |
| `shape_direction` variable | Kept as an override |
| DTCG radius and shadow example with component mapping in `$description` | Kept, step 4 |
| Radius must not be uniform; there must be a hierarchy | Moved to rule `shape.radius.hierarchy` (blocking) |
| Side-stripe ban | Moved to rule `quality.shape.bans` |
| Explain the personality choice | Kept, steps 2 and 3, with the evidence |
| Update living brief | **Renderer** |
| — | **New:** the depth model per theme, with dark overrides in `shape.dark.json`; start from the preview |

## spacing.tokens (from generate-spacing-tokens and Bootstrap Step 7)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief for density | Kept, step 1. **Adds** the type scale, the DESIGN.md Layout section, and the preview |
| Read the token architecture guide | **Fixed.** It now cites the spacing guide (bug inventory: the missing spacing guide link) and the type-spacing section of the typography guide |
| Three scale tiers on a 4px base | Kept, step 2. The base unit is now a choice (4px or 8px), per the spacing guide |
| "Name tokens by their pixel value" | **Fixed.** The legacy text contradicted its own example (`space.4` = 16px). Steps are named by multiple of the base unit, matching Tailwind (step 3, rule `spacing.scale.base-unit`) |
| Three semantic layout aliases | Kept, step 4 |
| State the rationale | Kept, in the evidence |
| Update living brief | **Renderer** |

## color.add-theme (from generate-dark-mode)

| Legacy instruction | Where it went |
|---|---|
| Read the color guide's dark mode section | **Renderer**, with sections, plus the token-level dark mode and tonal elevation sections |
| Paste your palette and light mapping | Dropped as a form field. The play reads `tokens/src/color.json` (step 1) |
| Tonal shift, no inversion; surfaces from the dark end; accents from lighter stops | Kept, step 2. Rule `color.dark.tonal-shift` |
| Every on-* role meets 4.5:1 | **Moved** to rules `color.contrast.text` and `color.contrast.ui`, parameterized by standard |
| Verify with the contrast tool | Kept, step 3, as one batch request |
| Output `[data-theme="dark"]` CSS | **Changed** to `tokens/src/color.dark.json`, compiled by the pipeline (the session route runs it next) |
| — | **New:** adding light to a dark-first system; asking which theme is primary; a side-by-side comparison page and approval (rule `quality.review.compare-visually`); updating `sistema.json` theme |

## tokens.migrate-tailwind (from migrate-tailwind-tokens): retired into a route

The capability model's fit test kept this as a play. After V1.5, `color.map-existing` and `tokens.pipeline` cover everything it did: reading a Tailwind color config, keeping values exactly, two-tier tokens, and wiring Tailwind 3 or 4 to the compiled properties. Keeping it would duplicate both plays and reintroduce its path conflict (`tokens/primitive/` and `tokens/semantic/` instead of `tokens/src/`). It is now the `workflow.session` route `bring-in-existing-colors` (map-existing, then pipeline).

| Legacy instruction | Where it went |
|---|---|
| Extract primitives without changing values | `color.map-existing` steps 1 and 6, under rule `color.existing.consent` |
| Define semantic roles | `color.map-existing` step 6 |
| Write `tokens/primitive/colors.json` and `tokens/semantic/colors.json` | **Dropped.** Every play writes `tokens/src/*.json` (the path conflict the fit test flagged) |
| Tailwind `theme.extend` reading custom properties so existing utilities keep working | `tokens.pipeline` step 5 (Tailwind 3 and 4 wiring) and step 6 (old names kept as aliases when the person chooses) |

## components.specify (from specify-component)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and two guides | Step 1 (DESIGN.md, tokens, DECISIONS.md, existing components). Guides go to the **renderer** |
| Component name and token context form fields | `component` override. Token names are read from `tokens/src/` |
| Spec structure: variants, sizes, states, token map, accessibility, behavior | Kept, step 2. **Adds** purpose, copy, and consistency with similar components |
| 44×44 target, 3:1 focus, keyboard, accessible name | **Moved** to `accessibility.*` rules. The target size is now **parameterized by standard** (24px at WCAG 2.2 AA, 44px at AAA). 44px was a universal threshold, which plan 9.3 removes |
| No hardcoded values | Rule `tokens.usage.no-raw-values` |
| Output only the spec document | Written to `docs/components/<name>.md` |
| Update living brief | **Renderer** |

## components.implement (from implement-component)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and two guides | Step 1 reads the spec. Guides go to the **renderer** |
| Framework, styling, spec, and token form fields | Read from `sistema.json` (`stack`, `component_library`) and the spec. **Changed:** follow the existing components' conventions (step 2) |
| Semantic tokens; ARIA and keyboard; visible focus at 3:1; 44×44 | **Moved** to rules (as in `components.specify`) |
| Prop types and a usage example | Replaced by the showcase entry (step 4), which is the working example |
| — | **New:** verification with the contrast tool, an automated scan in every theme, a keyboard walkthrough, a screenshot of the focus ring (the Tailwind 4 trap from the new-project run), and the build |

## components.scaffold-core (from scaffold-core-components and Bootstrap Steps 9)

The longest legacy play (139 lines). It shrinks because the token wiring now lives in `tokens.pipeline`.

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and two guides | Step 1. Guides go to the **renderer** |
| Ask about shadcn/ui or alternatives; adapt to non-Tailwind stacks | Kept, step 2. **Adds** React Aria and native elements. The choice is recorded as `project.component_library` |
| Generate `tailwind.config.ts` mapping every token (60-line example) | **Moved** to `tokens.pipeline` step 5, for Tailwind 3 and 4. Removed from this play |
| Check the global CSS import path | Already in `tokens.pipeline` step 5 |
| Load fonts with `next/font` | **Moved** to `typography.scale` step 5 |
| File structure by functional group with a barrel export | Kept, step 4. **Adds** a shared focus ring style |
| Install shadcn and generate at least 10 components | Kept, step 3, as an agreed list based on the product's first screens |
| Per-component checks (tokens, states, focus, 44×44) | **Moved** to rules, with verification in step 7 |
| Customize to the visual direction | Implicit. The tokens already are the direction. The play doesn't change token values |
| Self-contained `component-preview.html` | **Changed** to a showcase route in the app, because real components can't render in a static file. The person opens it at the gate `components-approved` |
| Update living brief | **Renderer**, plus DESIGN.md Components (step 8) |

## components.page-examples (from generate-page-examples and Bootstrap Step 10)

| Legacy instruction | Where it went |
|---|---|
| Suggest two page types from the product; confirm | Kept, step 1 |
| Self-contained static HTML with token CSS | **Changed** to app routes built from the real components, so the pages test the system rather than a copy of it |
| Realistic copy, no lorem ipsum | Kept, step 3, using VOICE_AND_TONE.md if present |
| 1200px+ and 768px | Kept, step 4, with screenshots in every theme |
| Pause for review | Optional play in `workflow.patterns` |

## components.docs-site (from setup-documentation-site and Bootstrap Step 11)

| Legacy instruction | Where it went |
|---|---|
| Recommend a single `docs/index.html`; confirm | **Changed** to a route in the app (step 1), reading tokens at runtime and importing real components, so it can't drift |
| Token reference, gallery, usage notes, page links, direction summary | Kept, step 1 |
| Update living brief | **Renderer** |

## components.audit (from audit-component)

| Legacy instruction | Where it went |
|---|---|
| Paste component code | Read from the repo (`component` override) |
| Token usage, states, accessibility, API design | Kept, step 2. The accessibility part cites the shared `accessibility.*` rules and points to `accessibility.audit` for a full pass (the overlap the fit test flagged) |
| Verdict, issues with line and severity, prioritized changes | Kept, step 3. Written to `docs/audits/` |

## accessibility.audit (from accessibility-audit)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and the floor | Step 1 reads the standard from `sistema.json`. Floor sections go to the **renderer** |
| Scope form field | `scope` override |
| Seven criteria per component | Kept, step 3. **Adds** reduced motion, focus loss, and checking the focus ring actually renders |
| Contrast from the tool, exact ratios | Kept, as one batch request |
| Fixed 4.5, 3, and 44 thresholds | **Moved** to rules parameterized by standard (plan 9.3) |
| — | **New:** an automated scan in every theme first (step 2) |
| Report by severity | Kept, step 5, in `docs/audits/` |

## tokens.coverage-audit (from audit-token-coverage)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and the token guide | Step 1 reads the tokens. Guides go to the **renderer** |
| Search for hex, rgb, hsl, raw px, font values, and shadows; exclusions | Kept, step 2. **Adds** `oklch(`, Tailwind arbitrary values, and default palette classes |
| Severity: blocking, recommended, minor | Kept, step 3. **Adds** separating "no matching token" gaps from violations |
| Summary, prioritized list, fix order | Kept, step 4, in `docs/audits/` |

## project.orient (from session-start)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief; summarize identity, decisions, state, open questions | Kept, steps 1 and 2, from `sistema.json`, DESIGN.md, and DECISIONS.md. Falls back to LIVING_BRIEF.md |
| State the session goal; flag conflicts with decisions | Kept, steps 3 and 4 |
| List of synthesis documents to load | Dropped. Each route's plays cite their own guide sections |
| Confirm readiness | Replaced by choosing a route (step 5). It is the `start_with` play of `workflow.session` |

## add-component: retired into a route

`workflow.session` route `add-component` = `components.specify`, then `components.implement`. Its spec and implementation steps are those two plays. Its "update the living brief" step is the renderer's record section.

## project.review (from design-system-retrospective)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief and the code | Steps 1 and 2, from DESIGN.md, DECISIONS.md, `sistema.json`, audits, tokens, and components |
| Four questions and the report structure | Kept, step 3 |
| Update the living brief | **Changed:** agree fixes with the person, then update DESIGN.md and DECISIONS.md (step 4) |

## project.plan (from plan-next-iteration)

| Legacy instruction | Where it went |
|---|---|
| Read the living brief | Step 1, from the v2 records and audits |
| Maturity table | Kept, step 2, with tokens by category |
| Priority order | Kept, step 3 |
| Plan structure | Kept, step 4. Each task names its route or play. Written to `docs/plans/` |
| Update the living brief | DECISIONS.md entry (step 5) |

## Campaigns

- **bootstrap:** split into `workflow.start` and `workflow.patterns`, linked by `continue_with`. Its standing quality directive is covered by the quality rules (`quality.*`) and by each play's evidence. Its 844-line copy of the plays is deleted in V1.14.
- **audit-and-refactor:** retired. Assessment is `project.assess` in Start, and its audits are `workflow.session` routes.
