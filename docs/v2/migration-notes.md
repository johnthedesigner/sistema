# Migration Notes

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

## Placeholders (not converted)

`visual-language.design-md`, `content.voice-and-tone`, `typography.scale`, `shape.tokens`, and `spacing.tokens` are slice placeholders. Each tells the agent to record it as skipped. They are converted in V1.10.
