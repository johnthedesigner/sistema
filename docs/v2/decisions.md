# v2 Decisions

A record of owner decisions for the v2 overhaul, with dates and reasons. Earlier decisions (single merge, capability model, gates, Start scope) are in `SESSION_LOG.md` and `logs/v2-phase-0.md`.

## 2026-11-14 — Phase 0 gate

Approved by the owner. Evidence: `logs/v2-phase-0.md` (V0.7) and `docs/v2/retro-phase-0.md`.

## 2026-11-14 — V1.0 decision session (`decision-brief-v1.md`)

The owner accepted every recommendation.

| # | Decision | Detail |
|---|---|---|
| D1 | Public names | Steps are **plays**. Ordered sequences are **workflows** (replacing "campaign"). |
| D2 | Milestones and practice | Milestones: **Direction, Foundations, Patterns**. One practice: **Maintain and grow**. Schema enum: `direction`, `foundations`, `patterns`, `maintain`. |
| D3 | Default stack | Web, React, Tailwind is the documented default. Foundations stays stack-neutral (DTCG to Style Dictionary to CSS custom properties). Only Patterns plays assume the stack. Other stacks are "loosely supported." |
| D4 | Content location | New top-level `content/`: `plays/<topic>/<name>.md`, `workflows/<id>.md`, `rules/<topic>.yaml`, `opinions/<id>.md`, and `guides/<topic>.md` (moved from `kb/principles/` in V1.12). Reference material moves to internal `reference/` in V1.16. Sistema-authored content drops the stub and versioning system, since git provides history. |
| D5 | Play format | Markdown with YAML frontmatter: contract in frontmatter, procedure in body. |
| D6a | DESIGN.md sections | Exactly the spec's 8 sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Outputs are named `design-md#<section>`. |
| D6b | DESIGN.md tokens | `tokens.pipeline` regenerates DESIGN.md front matter from the DTCG files on each compile. DTCG is the only place values are written. |
| D7 | `sistema.json` and the accessibility choice | Start from capability-model Section 5. `project.assess` asks for the accessibility standard and density. `visual-language.direction` reads them. |
| D8 | Rules schema | Plan 8.3, plus `parameters` (values keyed by standard and level) and `checked_by` (required for blocking rules). One YAML file per topic. IDs are `topic.name`. |
| D9 | Public URL for slice runs | Push `v2` when the slice is ready to run (V1.4), and use the Vercel preview branch URL with protection off or a bypass token. Until then, `v2` stays local. |
| D10 | Who runs the slice | The owner runs the Start starter in a fresh Claude Code session on each scratch project. Claude reviews outputs and may run extra passes. |

Also accepted, as listed under "Assumed unless you object":
- `kb/principles/` becomes the guide type.
- `kb/reference/skills/` is treated as reference material.
- The registry's first worked case is display line height, with the value decided in V2.
- Plays keep `overrides` for standalone use on the site.

## 2026-11-14 — Clarification during V1.1

- **Guide IDs** are `guide.<topic>.<name>#<anchor>`, because several topics have more than one guide (color has three). D4's `content/guides/<topic>.md` becomes `content/guides/<topic>/<name>.md`. Anchors are GitHub-style heading slugs.
- **Optional items:** a `?` suffix marks an optional output (in `produces`) or an optional play (in a workflow sequence). An optional play's outputs cannot satisfy a required play's `requires`.
- **Shared outputs:** a `change` play may write a file that a `create` play also produces (for example `color.map-existing` and `color.scheme`). Two `create` plays may not.
