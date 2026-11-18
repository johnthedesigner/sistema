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

## Originality and attribution

- **Audit the guides (and plays, opinions, rules) for how closely they follow their sources** — Most guide text was drafted by AI from the reference material, while the owner focused on the method. The owner doesn't know the original sources well enough to judge whether any passage would read as copied from them. The standard to hold:
  - The core of each guide is a synthesis across the breadth of the sources: its structure, framing and decision guidance are Sistema's own.
  - Close reference to one source is allowed, but it must be marked as such where it appears (for example "This follows the approach in [source]"), not only listed in the sources at the bottom.
  - No passage reproduces a source's wording, structure or examples so closely that a reader of the source would recognize it, unless it is quoted and credited.
  - The aim is transparency. Avoid the extractive pattern of AI content that repackages others' work as its own.

  **Suggested method:** for each guide, compare it with each source it lists. Flag (1) passages that are close paraphrase of one source, (2) sections whose structure or ordering mirrors one source, (3) examples, numbers or named concepts taken from one source without saying so, and (4) guides that depend mostly on a single source. For each flag, the fix is to rewrite it as synthesis, mark it as direct reference, or quote and credit it. Record the results per guide, alongside `_meta/LICENSE_AUDIT.md`. Run the same pass over plays, opinions and rules, which are shorter but also AI-drafted.

  **Timing:** this should happen before the public launch (task VF), not stay open indefinitely. It fits well after V1.16, when guide sources become credit lines and the public Sources page exists, because that is where marked direct references will link. It also limits the earlier "KB reference files are too sparse" item: once reference material is internal (V1.16), fuller reference files raise less concern, but anything published must pass this audit.

  *Owner request after reviewing the guides, 2026-11-17.*

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

  *From the V1.4 new-project run, 2026-11-15.*
