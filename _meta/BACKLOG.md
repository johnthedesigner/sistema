# BACKLOG.md
# Sistema — Deferred Improvements

Items discovered during development or piloting that are not urgent enough to fix immediately. Review at the start of each phase.

---

## Play design

- **`positioning-brief` should produce feed-forward outputs for downstream plays** — The positioning brief collects color, typography, density, and theme decisions but doesn't produce pre-formatted text for the input fields of subsequent plays (e.g. `{{color_direction}}` in `generate-color-scheme`, `{{type_direction}}` in `generate-type-scale`). Users currently have to manually re-state what was already established. Fix: add an "Outputs" section at the end of `positioning-brief` that formats each downstream play's input variable from the answers collected. *Discovered during bootstrap campaign pilot, 2026-05-14.*

## Component library

- **`scaffold-component-library` play for headless library integration** — The bootstrap campaign ends at token generation. The existing component plays write from scratch, which is slow and skips accessibility correctness that headless libraries provide. A new play should detect or recommend a headless library (shadcn/ui, Base UI, Radix, Ark UI) based on the stack in the living brief, wire its token slots to the generated token file, and establish a pattern for future `add-component` calls. *Planned as Phase 9. Deferred until bootstrap campaign pilot results reviewed. 2026-05-14.*
