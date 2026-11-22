# BACKLOG.md
# Sistema — Deferred Improvements

Items discovered during development or piloting that are not urgent enough to fix immediately. Review at the start of each phase.

---

## Play design

- **`positioning-brief` should produce feed-forward outputs for downstream plays** — The positioning brief collects color, typography, density, and theme decisions but doesn't produce pre-formatted text for the input fields of subsequent plays (e.g. `{{color_direction}}` in `generate-color-scheme`, `{{type_direction}}` in `generate-type-scale`). Users currently have to manually re-state what was already established. Fix: add an "Outputs" section at the end of `positioning-brief` that formats each downstream play's input variable from the answers collected. *Discovered during bootstrap campaign pilot, 2026-05-14.* **Superseded 2026-11-14:** v2 play contracts (V1) declare each play's inputs and outputs.

## Knowledge base content depth

- **KB reference files are too sparse to serve as standalone context** — The current KB capture workflow produces brief summary-level reference files (e.g. Impeccable's `overview.md` condenses a multi-file skill with 7 domain references, 27 deterministic rules, and 23 commands into ~150 lines of high-level description). This creates two compounding problems:

  1. **Context loss in the synthesis chain.** When plays read principles, and principles were synthesized from sparse KB files, critical detail has been lost twice. Sparse KB → thin principles → plays that can't reason about edge cases. A play reading `kb/principles/visual-language/overview.md` should be able to answer nuanced questions about the Dieter Rams philosophy vs. the Swiss typographic philosophy, but it can't if the original distinction was collapsed at the KB capture stage.

  2. **The published KB is not a usable resource.** The KB is public — the stated purpose is that other people can use it to synthesize their own principles or plays without re-crawling original sources. A 150-line summary of Impeccable does not serve that purpose. The published KB file should contain enough detail that someone could form a new synthesis from it that we have not yet written.

  **Standard to apply going forward:** A KB reference file should capture the source at a level where you could reconstruct the source's main claims, distinctions, rules, and examples from the KB file alone — without access to the original. This does not mean full verbatim reproduction (that raises license questions). It means: all rules enumerated, all frameworks described with their parameters, all distinctions preserved, and worked examples included where the source includes them.

  **Backlog scope:** All KB reference files should be audited against this standard. Highest priority are the agent skills (Impeccable, Anthropic frontend-design, designer-skills) and the content design sources (MailChimp, Polaris, Carbon, Atlassian content sections) since these were the most recently added and are currently the sparsest relative to their source depth.

  *Identified 2026-05-16.*

## Copy and content quality

- **Site-wide audit for AI writing patterns** — The VOICE_AND_TONE.md now defines a set of structural patterns to avoid (the "not just X — it's Y" family, contrast-first framing, ends-on-a-negative constructions, and others). The KB landing page descriptions have been cleaned, but the rest of the site has not been audited against this standard. Pages to check: home page subhead and credibility callout, playbook index and individual play descriptions (`PLAY_DESCRIPTIONS` in `playbooks/[slug]/page.tsx`, `PLAY_OUTPUTS` in `playbooks/page.tsx`), campaign descriptions (sourced from campaign markdown files), guide page body copy, sources page item descriptions, and KB category page copy at the system and file level. *Rule codified 2026-05-17.*

## Framing and expectations in content

- **"Worked example" reads as jargon, and the sections don't set expectations** (owner, 2026-11-22). The term appears with little explanation, as if readers should already know it. What the sections actually mean: Sistema worked through a complete, hypothetical project (Relay) to show what using Sistema looks like and what it produces, and guides and the specimen tool use pieces of that project to make concepts concrete. None of that comes across. Fix:
  - Introduce the example project once, plainly, where readers first meet it (and link there from each guide), saying what it is, why it exists, and how to read it: one illustration, not a recommendation.
  - Rename the sections to say what they hold (for example "Example: Relay, a dispatch board" or "How this looks in a real project").
  - The deeper lesson for the content principles: every section's heading and first line should tell the reader what kind of content it is and how to use it (rule, option, example, reference), so they know how to interpret what follows. Don't rely on a label the reader has to decode.

## Originality and attribution

- **Audit the guides (and plays, opinions, rules) for how closely they follow their sources** — Most guide text was drafted by AI from the reference material, while the owner focused on the method. The owner doesn't know the original sources well enough to judge whether any passage would read as copied from them. The standard to hold:
  - The core of each guide is a synthesis across the breadth of the sources: its structure, framing and decision guidance are Sistema's own.
  - Close reference to one source is allowed, but it must be marked as such where it appears (for example "This follows the approach in [source]"), not only listed in the sources at the bottom.
  - No passage reproduces a source's wording, structure or examples so closely that a reader of the source would recognize it, unless it is quoted and credited.
  - The aim is transparency. Avoid the extractive pattern of AI content that repackages others' work as its own.

  **Suggested method:** for each guide, compare it with each source it lists. Flag (1) passages that are close paraphrase of one source, (2) sections whose structure or ordering mirrors one source, (3) examples, numbers or named concepts taken from one source without saying so, and (4) guides that depend mostly on a single source. For each flag, the fix is to rewrite it as synthesis, mark it as direct reference, or quote and credit it. Record the results per guide, alongside `_meta/LICENSE_AUDIT.md`. Run the same pass over plays, opinions and rules, which are shorter but also AI-drafted.

  **Timing:** this should happen before the public launch (task VF), not stay open indefinitely. It fits well after V1.16, when guide sources become credit lines and the public Sources page exists, because that is where marked direct references will link. It also limits the earlier "KB reference files are too sparse" item: once reference material is internal (V1.16), fuller reference files raise less concern, but anything published must pass this audit.

  **Progress (V3.5, 2026-11-20):** color, palette generation, tokens, typography, visual quality, and voice and tone audited and fixed; results in `_meta/LICENSE_AUDIT.md`. The other guides and the plays, opinions, and rules remain.

  **First examples (found in fit review 2, `docs/v2/fit-review-2.md` section 4):** the voice and tone guide, rule `content.voice.baseline`, and `content.voice-and-tone` present "plainspoken, genuine, helpful, direct" as a cross-system baseline, but "plainspoken" and "genuine" are Mailchimp's named voice traits. The typography guide's "5-role pattern (display / headline / title / body / label)" is Material Design's role set.

  **Note:** `reference/` stays visible in the public repository. That's fine; it's marked as internal working notes (`reference/README.md`) and isn't presented as Sistema content.

  *Owner request after reviewing the guides, 2026-11-17.*

## Orchestrated autonomous agents

- **Make Sistema work well with platforms that orchestrate many autonomous agents** — Sistema assumes one coding agent working with one person, who approves each stage. Enterprise engineering platforms instead run many autonomous agents in parallel under an orchestrator, often with no person in the loop for each task. The owner works on such a platform and wants to know what Sistema would need to work well there. The changes could be small (mentions on existing pages, a guide) or larger (different plays or use cases). Questions to explore:
  - **Approval without a live conversation.** The method depends on a person approving at gates (opinion `person-approves`, `see-every-stage`). With autonomous agents, approval could happen asynchronously: the gate's review page attached to a pull request, and the gate recorded when the PR is approved. Decide whether that is an override of the opinion or a second way to meet it.
  - **Parallel work on shared files.** `sistema.json`, DECISIONS.md, and the token sources assume one writer at a time. Many agents adding components at once would conflict. Options: one entry file per decision, or per component, merged later; plays that only read shared state and propose changes; a single agent that owns the token sources.
  - **Plays that fan out well.** Check plays (`components.audit`, `accessibility.audit`, `tokens.coverage-audit`) can run per component or per folder in parallel and be merged into one report. `components.implement` from an approved spec is also well suited. Direction and Foundations need taste and approval, so they suit a person more than a swarm.
  - **Machine-checkable evidence.** Orchestrators accept or reject work automatically. Rules with measures, tool-produced evidence (contrast batches, token validation), and `sistema.json` already help. A play's evidence could be required in a fixed, machine-readable form, and blocking rules could run as CI checks.
  - **Ways in besides a pasted prompt.** The MCP server (V4) and plain URLs per play already suit an orchestrator better than copying from the site. A guide for platform teams could explain how to hand Sistema plays to agents as tasks, for example one ticket per route.
  - **Design system work as a platform service.** A central design system team uses Sistema with people approving, and product teams' agents consume the result (DESIGN.md, tokens, rules) and run check plays. This may be the main use case to describe.

  Start by writing up these use cases and checking them against the capability model before changing any plays.

  *Owner note, 2026-11-17.*

## Sources for contemporary visual craft

Sistema's references are strong on structure (token architecture, color science, accessibility) and thin on current visual craft: how products that experienced designers admire today handle hierarchy, emphasis, surfaces, type, and detail. The Relay run came out correct but dated (`docs/v2/aesthetic-baseline.md`). Candidates to take through the intake process. Licence tiers are probable, not checked; any that turn out paywalled or no-reproduction are dropped.

| Candidate | What it would add | Probable tier |
|---|---|---|
| Linear's writing on its interface redesign (linear.app) | Reducing chrome, surface separation by tone, a restrained color system built in a perceptual space | 3 |
| Vercel Geist (vercel.com/geist) | A contemporary system's color scale, type, and materials, with documented surface and elevation roles | 2 |
| Radix Themes (radix-ui.com/themes) | Radius, scaling, and panel options as explicit, switchable theme settings: the closest existing model for "taste as parameters" | 1 (MIT), Radix is already a source |
| Adobe Spectrum 2 | A large system's recent move to rounder shapes, fewer borders, and warmer type, with its reasoning | 2 |
| Microsoft Fluent 2 | Layered materials, elevation, and emphasis surfaces in a current system | 2 or 1 (MIT repos) |
| Apple Human Interface Guidelines | Materials, hierarchy, and restraint; vibrancy and emphasis by role | 2 |
| Stripe's writing on its color system | Building a perceptually even palette for a product with dense data | 3 |
| Josh W. Comeau, "Designing Beautiful Shadows in CSS" | Layered, color-matched shadows and consistent light | 3 |
| Rauno Freiberg, "Invisible Details of Interaction Design" | Detail and feel in states and motion | 3 |
| Emil Kowalski's writing on animation in interfaces | Short, purposeful motion, easing, and when not to animate | 3 |
| Nielsen Norman Group on visual hierarchy and emphasis | Research on how emphasis, contrast, and scale direct attention | 3 |
| Polaris, Material 3, Atlassian (already sources) | Re-read for emphasis roles: brand and inverse surfaces, containers, bold backgrounds | Already in |

Excluded unless the owner decides otherwise: paid books and courses (Refactoring UI, for example), which the intake process doesn't permit.

**Intake done 2026-11-20 (V3.4):** all candidates taken in except Adobe Spectrum's background-layers and drop-shadow pages, which need a login (its public attention-hierarchy page was used). Reference notes are in `reference/design-systems/{geist,fluent,apple-hig,spectrum,linear,stripe}`, `reference/design-systems/radix` (theme settings), `reference/design-systems/polaris` (surface roles), and `reference/foundations/visual-craft/`. Ten new entries in `content/sources.yaml`. Tier 3 entries are flagged in `_meta/LICENSE_AUDIT.md`.

*Owner request, 2026-11-19.*

## Palette

- **Done (V3.4, D26): the eased contrast curve made the light and dark steps finer.** ~~No ramp stop between white and stop 50, or between 50 and 100.~~ Quiet surface separation (a page a shade off white) can only use white, 50, and 100, and 100 is already a visible gray (about 1.19:1 against white). The specimen tool works within this, but finer light stops (for example 25 and 75), or a light-end distribution that isn't purely logarithmic, would allow subtler page and zone tones. Same at the dark end for dark themes. Found building the specimen tool (V3.4). Changing the ramp changes `library.json` and the palette snapshot; decide with the owner.

## Review pages

- **Redesign the review pages that plays produce** (`style-preview.html`, `token-check.html`, comparison pages such as `tokens.add-mode.html`) — Seen in the Relay run, these pages are noisy and hard to read: too many labels, dense tables of hex values, and no visual hierarchy. They need the same design update the Sistema site gets in V3.6 and V3.7:
  - **Easier to read, less noisy:** lead with what the person is approving, and move values, ratios, and stop numbers to a quieter layer (hover, a details toggle, or a secondary table).
  - **Beautiful in a way that is both classic and current:** typography-led, generous whitespace, restrained chrome.
  - **On-brand for Sistema** in their frame (header, outline strip, footer), **while adapting to the project they're for.** The content area renders in the project's own tokens, so the person sees their system, not Sistema's.

  Likely shape: a shared page template (layout, type, frame) that plays fill with the project's data, defined in the style tile format guide and the token check spec, with a reference rendering from Relay. Do it alongside the site restructure (V3.6), so both use the same design work, and before the guides cite screenshots of these pages.

  *Owner request during the Relay run, 2026-11-18.*

- **Style preview: one question at a time.** Show each taste question on its own, with tabs or a side list (summary, each question, composition, color, type, emphasis map), and render only the open question's options. This answers three problems seen in the Relay re-run: the page loads about 40 live renderings at once, it's hard to compare options with six other questions around them, and answering question by question suits the workflow. A static file can do it with a few lines of script and lazy iframes (`loading="lazy"`, or setting `src` when a tab opens). Pair it with a cropped render mode in the specimen tool. Decide during the review page redesign above. As the person picks options, the page collects the answers (for example "1: A, 2: C, … plus notes") into a block with a copy button, so they can paste the whole set back into the agent session in one go. The button needs a fallback for pages opened from the file system, where clipboard access can be blocked.

  *Owner suggestion, Relay direction review, 2026-11-20.*

- **Fixes from the first one-question-at-a-time preview** (Sistema's own direction, 2026-11-21). The owner's notes:
  - **The first step isn't clear.** The intro page's most prominent element is "Copy answers", before anything is chosen, so it looks finished or broken. Lead with a clear "Start with question 1" and next and previous buttons between questions; keep "Copy answers" quiet until the questions have been visited.
  - **Thumbnails are too small to see differences.** Show options large: one at a time with a quick flip between them, or a crop of the part of the page the question changes.
  - **Later tabs don't follow the choices.** "All together", "Type", and "Color" show only the proposals. They should re-render from the selected options (render URLs built in the page, the chosen typefaces loaded, ramps for the chosen grays).
  - **The workflow callout is unclear and breaks the header** when expanded. Replace it with a plain progress line, or drop it from this page.

  Apply these in the shared review page template (V3.7).

  **Done (V3.7, 2026-11-22):** `public/templates/style-preview.html`, a data-driven template served at `/templates/style-preview.html`: a clear first step, one question per screen with large renderings and instant flips, "All together" built from the chosen options (renderings, ramps, roles, contrast, chosen fonts), and the answers copied at the end. The direction play and the style preview format use it. The token check page still comes from each project's compile script.

## Test coverage

- **Zero test coverage — full audit and baseline needed** — The codebase has no test files of any kind. The only runtime validation is TypeScript's type checker. Areas that warrant coverage: palette generation algorithm (`src/lib/palette.ts` — contrast-targeting math, gamut handling, stop selection); KB and playbook parsing (`src/lib/kb.ts`, `src/lib/playbooks.ts` — markdown parsing, slug extraction, variable detection); API routes (`/api/palette`, `/api/context` — request validation, error handling); sitemap and robots generation; and client-side prompt resolution (`resolveBody`, `extractVariables`, `emptyFallback` in `PlayDetail.tsx` — variable substitution, empty-field fallback text). Suggested stack: Vitest for unit/integration, Playwright for critical UI paths (copy prompt, examples modal, color mode selector persistence). *Identified 2026-05-17.* **In progress 2026-11-14:** v2 Task V0.2 adds the test runner and content checks. V2 adds tool tests.

## Component library

- **`scaffold-component-library` play for headless library integration** — The bootstrap campaign ends at token generation. The existing component plays write from scratch, which is slow and skips accessibility correctness that headless libraries provide. A new play should detect or recommend a headless library (shadcn/ui, Base UI, Radix, Ark UI) based on the stack in the living brief, wire its token slots to the generated token file, and establish a pattern for future `add-component` calls. *Planned as Phase 9. Deferred until bootstrap campaign pilot results reviewed. 2026-05-14.* **2026-11-14:** v1 Phase 9 closed. Revisit under the v2 Patterns milestone (V3).

## New foundation areas (v2)

- **Iconography as an optional foundation area** — Many app UIs need an icon library chosen early, with a constrained set of sizes, stroke weights, colors, and alignment rules tied to the type scale and color tokens. Possible shape in the v2 model: a new `iconography` topic with a guide, rules (size steps keyed to type roles, stroke weight, color roles icons may use, accessible labeling), and a play such as `iconography.system`. It would be offered as an optional continuation after Foundations, like Patterns. Needs reference material first (icon library docs, design system icon guidance), sourced through the KB intake process. Plan Section 9.2 already lists iconography as a likely gap. *Owner note during V1.4 slice runs, 2026-11-15.*

- **Data visualization as an optional foundation area** — B2B apps often need chart color palettes (categorical, sequential, diverging) that are accessible and work with the color tokens, plus chart library selection. Library choice is hard: most libraries cover a narrow set of chart types, so full coverage can take more than one library, and that choice should be recorded with its reason. Larger and more complex than iconography. It probably needs its own guide set (palette construction, chart type coverage, library comparison) and several plays rather than one. Possible tool candidate: a data-viz palette generator built on the existing palette algorithm, evaluated against the plan's tool test (Section 10.3) before building. Plan Section 9.2 lists data visualization as a likely gap. *Owner note during V1.4 slice runs, 2026-11-15.*

## Component lessons from the slice runs (v2)

- **Lessons for the Patterns milestone plays** — The new-project slice run built about 40 components outside the workflow and found problems the component plays should teach. Add them as rules or guide sections when components are converted (V1.10 to V1.13):
  - In Tailwind 4, `outline-none` sets the outline style to none, so `outline-2` draws nothing unless `outline-solid` is added. Axe does not catch it. Check that the focus ring actually renders.
  - Don't disable the focused control while its action runs, because focus drops to `<body>`. Ignore repeat presses instead.
  - Toasts carry confirmations and undo only. Errors the person must act on stay inline, where they can't time out. A toast with an action never times out. Hover and focus pause the timer independently.
  - Self-host fonts. `next/font/google` failed builds twice on a busy network.
  - Never put two utilities for the same property on one element. Tailwind orders the CSS rules, not the class order.
  - Run Playwright with a fixed, small number of workers on a loaded machine, so slow runs aren't mistaken for flaky tests.

  *From the V1.4 new-project run, 2026-11-15.* **Applied 2026-11-18 (V3.3):** the focus ring is in `accessibility.focus-visible`, fonts in `typography.fonts.self-hosted`, and busy controls, toasts, and conflicting utilities in the new `content/rules/components.yaml`. Playwright workers are in the component plays' test steps.
