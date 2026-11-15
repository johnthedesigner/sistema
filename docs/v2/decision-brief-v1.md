# V1 Decision Brief

**For:** the owner, at the V1 start decision session. **Prepared:** V0.7, 2026-11-14.
**What this covers:** decisions that block the V1 vertical slice. Each one has options, a recommendation, and what changes downstream. Answer them in any order. A one-word "recommended" is enough for any item.

Decisions already settled in `capability-model.md` are not repeated here.

---

## D1. Public names for steps and workflows

`VOICE_AND_TONE.md` currently fixes "play" and "campaign" as product terms.

| Option | Steps | Workflows |
|---|---|---|
| **A (recommended)** | play | workflow |
| B | play | campaign |
| C | step | workflow |

**Why A:** "play" is established and distinct, and works as a unit people pick up and run. "Campaign" suggested a fixed script, and the new model has skip, resume, and gates.
**Changes:** schema field names, site copy, `VOICE_AND_TONE.md` locked terms, MCP prompt names.

## D2. Milestone and practice names

| Option | Milestones | Practice |
|---|---|---|
| **A (recommended)** | Direction, Foundations, Patterns | one practice: "Maintain and grow" |
| B | Direction, Foundations, Components & Patterns | two practices: Maintenance, Growth |

**Why A:** short names that are explained in context. Steps already carry a `kind` (create, change, check, orient), so a separate Maintenance/Growth split adds a second label without adding information.
**Changes:** the `milestone` enum in step contracts, site navigation, narrative copy.

## D3. Default stack path

| Option | Meaning |
|---|---|
| **A (recommended)** | Web, React, Tailwind is the documented default. Foundations stays stack-neutral (DTCG to Style Dictionary to CSS custom properties). Only Patterns steps assume the stack. |
| B | No default. Every step branches on stack. |
| C | CSS custom properties only. Framework wiring is left to the user. |

**Why A:** it matches what most users build and what Sistema already produces, and it limits stack-specific content to the Patterns milestone. Other stacks get "loosely supported" wording on the opinions page.
**Changes:** `sistema.json` `project.stack` values, the Patterns steps, the opinions page.

## D4. Where content lives in the repo

| Option | Layout |
|---|---|
| **A (recommended)** | New top-level `content/`: `content/plays/<topic>/<name>.md`, `content/workflows/<id>.md`, `content/rules/<topic>.yaml`, `content/opinions/<id>.md`. Guides move from `kb/principles/` to `content/guides/<topic>.md` during full migration. Reference material moves to `reference/` (internal, never routed). |
| B | Keep everything under `kb/` and `_meta/` with new subfolders |

**Why A:** one obvious home for the published product, separate from internal research. It also retires the stub and versioning system for Sistema-authored content, which git already handles. Reference material can keep its stubs or not; that's for the move task to decide.
**Changes:** loaders, the checker's corpus, AGENTS.md KB rules (which then apply only to `reference/`).

## D5. Play file format

| Option | Format |
|---|---|
| **A (recommended)** | Markdown with YAML frontmatter (contract in frontmatter, procedure in body), as in capability-model Section 9.1 |
| B | Pure YAML with the procedure as a block string |

**Why A:** easy to read and edit by hand. The body renders directly on the web and compiles directly to a skill file.

## D6. DESIGN.md: section list and token duplication

The DESIGN.md spec defines YAML front matter tokens plus 8 body sections in order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.

**D6a. Section list.** Recommendation: adopt the spec's 8 sections exactly, with no Sistema-specific sections. Sistema's own state lives in `sistema.json` and DECISIONS.md. Plays then declare outputs like `design-md#colors`.

**D6b. Token duplication.** DESIGN.md front matter holds token values, and the DTCG files are also the source of truth. Two copies will drift.

| Option | Meaning |
|---|---|
| **A (recommended)** | `tokens.pipeline` regenerates DESIGN.md's front matter from the DTCG files on every compile. Body sections stay hand-written. |
| B | DESIGN.md holds no token values, only prose and references to token names |
| C | Accept both and add a drift check |

**Why A:** DESIGN.md stays spec-compliant for tools that read it, and DTCG remains the only place values are written.

## D7. `sistema.json` and where the accessibility standard is chosen

Recommendation:
- Start from capability-model Section 5. Finalize the field list while building the slice.
- `project.assess` asks for the accessibility standard and density, because they are project rules, not visual direction.
- `visual-language.direction` then reads them.

The plan put the accessibility choice in Direction. This keeps it in the Direction milestone, but in its first play.

## D8. Rules registry schema

Recommendation: start from plan 8.3, with two additions:
- **`parameters`:** for standard-derived rules, values keyed by standard and level. For example, a contrast rule holds text and UI ratios for WCAG 2.2 AA and AAA.
- **`checked_by`:** the tool or check that verifies the rule. It's required for blocking rules.

One YAML file per topic. Rules are referenced as `topic.name`.

## D9. A public URL for the slice runs

The slice runs paste-in starters against a live URL, so agents can fetch plays.

| Option | Meaning |
|---|---|
| **A (recommended)** | Push `v2` when the slice is ready to run. Use the Vercel preview branch URL. Turn off deployment protection for previews, or use a bypass token. |
| B | Keep `v2` local and use `npm run dev:tunnel` (ngrok). No push needed, but the URL changes each run. |

**Why A:** a stable URL, CI starts running, and preview builds become routine for V3 and V4. B works if you'd rather not push yet.

## D10. Who runs the slice

| Option | Meaning |
|---|---|
| **A (recommended)** | You run the Start starter in a fresh Claude Code session on each scratch project, and I review the outputs and transcripts. I can also run extra passes in scratch directories. |
| B | I run all passes myself |

**Why A:** your run is the realistic test, a cold session with only the starter prompt. My runs have the context of having built it, which hides gaps.

---

## Assumed unless you object

- `kb/principles/` becomes the `guide` type, and `kb/reference/skills/` is treated as reference material (capability-model Section 8).
- The registry's first worked case is display line height, settling the tool/play/guide disagreement (bug inventory #16). The value is decided in V2 when the type scale tool is fixed.
- Steps keep their `overrides` (form fields) for standalone use on the site.
