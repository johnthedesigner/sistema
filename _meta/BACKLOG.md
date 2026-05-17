# BACKLOG.md
# Sistema — Deferred Improvements

Items discovered during development or piloting that are not urgent enough to fix immediately. Review at the start of each phase.

---

## Play design

- **`positioning-brief` should produce feed-forward outputs for downstream plays** — The positioning brief collects color, typography, density, and theme decisions but doesn't produce pre-formatted text for the input fields of subsequent plays (e.g. `{{color_direction}}` in `generate-color-scheme`, `{{type_direction}}` in `generate-type-scale`). Users currently have to manually re-state what was already established. Fix: add an "Outputs" section at the end of `positioning-brief` that formats each downstream play's input variable from the answers collected. *Discovered during bootstrap campaign pilot, 2026-05-14.*

## Knowledge base content depth

- **KB reference files are too sparse to serve as standalone context** — The current KB capture workflow produces brief summary-level reference files (e.g. Impeccable's `overview.md` condenses a multi-file skill with 7 domain references, 27 deterministic rules, and 23 commands into ~150 lines of high-level description). This creates two compounding problems:

  1. **Context loss in the synthesis chain.** When plays read principles, and principles were synthesized from sparse KB files, critical detail has been lost twice. Sparse KB → thin principles → plays that can't reason about edge cases. A play reading `kb/principles/visual-language/overview.md` should be able to answer nuanced questions about the Dieter Rams philosophy vs. the Swiss typographic philosophy, but it can't if the original distinction was collapsed at the KB capture stage.

  2. **The published KB is not a usable resource.** The KB is public — the stated purpose is that other people can use it to synthesize their own principles or plays without re-crawling original sources. A 150-line summary of Impeccable does not serve that purpose. The published KB file should contain enough detail that someone could form a new synthesis from it that we have not yet written.

  **Standard to apply going forward:** A KB reference file should capture the source at a level where you could reconstruct the source's main claims, distinctions, rules, and examples from the KB file alone — without access to the original. This does not mean full verbatim reproduction (that raises license questions). It means: all rules enumerated, all frameworks described with their parameters, all distinctions preserved, and worked examples included where the source includes them.

  **Backlog scope:** All KB reference files should be audited against this standard. Highest priority are the agent skills (Impeccable, Anthropic frontend-design, designer-skills) and the content design sources (MailChimp, Polaris, Carbon, Atlassian content sections) since these were the most recently added and are currently the sparsest relative to their source depth.

  *Identified 2026-05-16.*

## Component library

- **`scaffold-component-library` play for headless library integration** — The bootstrap campaign ends at token generation. The existing component plays write from scratch, which is slow and skips accessibility correctness that headless libraries provide. A new play should detect or recommend a headless library (shadcn/ui, Base UI, Radix, Ark UI) based on the stack in the living brief, wire its token slots to the generated token file, and establish a pattern for future `add-component` calls. *Planned as Phase 9. Deferred until bootstrap campaign pilot results reviewed. 2026-05-14.*
