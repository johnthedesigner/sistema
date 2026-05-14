---
category: principles
topic: llm-compatibility
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [ai, llm, design-tokens, design-md, living-brief, naming, synthesis]
sources:
  - kb/reference/standards/design-md/overview
  - kb/reference/standards/design-md/spec
  - kb/principles/tokens/architecture
---

# LLM Compatibility — Synthesis

## How to use this document

This document covers how a design system's structure, naming, and documentation affect the quality of output produced by AI coding tools. An LLM working from a well-structured design system produces consistent, token-consuming output. An LLM working from a poorly-structured one invents values, ignores tokens, and produces inconsistent output that drifts from the system with every generation.

Use this document when making structural decisions about token architecture, file organization, and documentation format.

---

## 1 — Token naming for LLM comprehension

### 1.1 Semantic names over abbreviations

**Token names must communicate intent in plain language.** An LLM reads token names as natural language, not as symbols to look up.

| Prefer | Avoid | Why |
|---|---|---|
| `--color-background-primary` | `--bg-p` | Unambiguous to both human and model |
| `--color-text-on-surface` | `--c-on-s` | "on-surface" is a recognized role pattern |
| `--spacing-component-gap` | `--sp-cg` | The role ("component gap") is recoverable from the name |
| `--radius-interactive` | `--r1` | Ordinal numbers carry no semantic meaning |

Names that look like jargon to a human look like noise to a model. A model that cannot infer a token's purpose from its name will either ignore it or guess incorrectly.

---

### 1.2 Consistent naming patterns across categories

**The same structural pattern must apply across all token categories.** Consistent patterns allow a model to predict token names it hasn't seen.

Recommended pattern: `--[category]-[role]-[variant]`

```
--color-background-surface
--color-background-surface-raised
--color-text-primary
--color-text-secondary
--color-border-default
--color-border-focus

--spacing-inset-sm
--spacing-inset-md
--spacing-stack-sm

--radius-sm
--radius-md
--radius-interactive
```

When the pattern is consistent, a model generating a new component can construct correct token names for cases not explicitly demonstrated in the context. When the pattern is inconsistent, the model falls back to hardcoded values.

---

### 1.3 Avoid ordinal-only naming at the semantic tier

**Ordinal names (`--color-1`, `--spacing-3`) belong in the primitive tier, not the semantic tier.** At the semantic tier, the name must communicate role.

The exception: step scales where the number encodes relative magnitude with a consistent meaning (e.g., `--spacing-4` in an 8px-grid scale where the number maps to a multiplier). This is acceptable only when the mapping is documented and consistent.

---

### 1.4 Token coverage density

**Every repeatable design decision should have a named token.** When a value exists in components that does not have a named token, an LLM will use either a hardcoded value or another system's naming convention.

Coverage checklist:
- All color roles that appear in interactive states (default, hover, active, disabled, focus)
- All spacing values used in component internal layout
- All border radii — including the full/pill variant
- Focus ring color and width
- All elevation levels that appear in the component set
- All type roles at all densities if density is a system feature

Gaps in token coverage are gaps in LLM control.

---

## 2 — File structure for context window efficiency

### 2.1 Each file must be independently useful

**Any single documentation file must provide enough context to be actionable on its own.** A model given only one file from the system should be able to work from it without needing to resolve cross-references.

This means:
- Token files should include semantic meaning inline, not by reference to a separate spec file
- Component docs should include the relevant token names directly, not "see the token file"
- Section indexes (`_index.md`) should be compact summaries that allow a model to determine whether to load the full file

---

### 2.2 File length targets

**Keep any single documentation file under 300 lines.** Beyond that, a model given the full file approaches the useful range of a single context load — other files get crowded out.

When a topic requires more than 300 lines:
- Split by sub-topic, not by alphabet or arbitrary pagination
- Ensure each split file is independently useful (see 2.1)
- The index (`_index.md`) for the section should explicitly list what is in each file so a model can select the relevant one

---

### 2.3 Front-load critical information

**The most important information in any file should appear before line 50.** Models attending to context weight early content more heavily. If the non-negotiable constraint or the key decision framework is buried at line 200, it will be underweighted.

Structure files as: constraint or decision first → rationale → detail → examples.

---

## 3 — DESIGN.md as the primary AI brief

### 3.1 What DESIGN.md is for

DESIGN.md is a single-file design system summary that AI coding agents read at the start of a session. It gives a model the visual language of a product — colors, typography, spacing, shape, component patterns — in a format that is both machine-parseable (YAML front matter) and human-readable (markdown body).

It is the highest-leverage single file in a design system for AI-assisted development. A model with a well-written DESIGN.md produces more consistent output than a model with access to the full token file but no DESIGN.md — because DESIGN.md provides role, rationale, and intent alongside values.

For the full format specification, see `kb/reference/standards/design-md/spec`.

---

### 3.2 What to include

**Include what a model needs to generate consistent new UI without asking follow-up questions.**

Must include:
- All semantic color tokens (role-named, not just hex values)
- The full type scale with roles and key properties
- The spacing scale with enough resolution to understand relative magnitude
- The shape scale
- The 3–5 most common components with their token consumption

Should include:
- Do's and Don'ts — this section directly prevents the most common generation errors
- An overview section that communicates brand personality — models use this to fill gaps in the spec

Should not include:
- Every token in the system — DESIGN.md is a brief, not a full token export. Full token values belong in the token file.
- Implementation details (import paths, framework-specific syntax)
- Version history or changelogs

---

### 3.3 Context window cost

A DESIGN.md that grows past ~200 lines starts competing with other context for attention. The brief should be comprehensive enough that a model can generate confidently, but compact enough that it does not exhaust the context budget on its own.

**Target: 80–150 lines of YAML front matter + 80–150 lines of markdown body.** A model can load this in full alongside a component spec and still have context for the task.

When the system is large, prefer a DESIGN.md that covers the core system at the right abstraction level, with extended documentation in separate files that are loaded on demand.

---

### 3.4 Keeping DESIGN.md current

**A stale DESIGN.md produces consistent but incorrect output.** A model following an outdated brief will confidently generate UI that does not match the actual system.

Update DESIGN.md when:
- A token value changes (color, type size, radius)
- A new semantic color role is added
- A component pattern changes enough to affect the Do's and Don'ts
- The brand personality shifts

Do not update DESIGN.md for:
- Purely structural changes that don't affect visual output (file moves, naming refactors)
- Addition of new tokens that don't change the existing vocabulary
- Implementation changes (build tooling, framework version)

---

## 4 — The living brief pattern

### 4.1 What the living brief is

The living brief is a compact, per-project state document that describes the current state of a design system in progress — what decisions have been made, what has been implemented, what is still open. It is the document a model reads at the start of a work session to resume context accurately.

**DESIGN.md vs. living brief:**

| | DESIGN.md | Living brief |
|---|---|---|
| Audience | Consuming the finished system | Building the system |
| Content | Stable design spec | Evolving state + decisions |
| Updated when | The design changes | Any session that makes decisions |
| Format | YAML front matter + prose spec | Structured prose with decision log |
| Lifetime | Stable artifact | Active project document |

---

### 4.2 Required sections

A living brief must contain:

1. **Project identity** — name, product type, target density, theme (light/dark/both)
2. **Key decisions** — one summary per concern area (color, type, spacing, shape, motion), written as decisions not descriptions: "We use an 8px base unit with 4 layout-level stops" not "The spacing system"
3. **Current state** — what exists (token file path, component list), what is stubbed, what is missing
4. **Open questions** — decisions not yet made; prevents a model from inventing answers
5. **Decision log** — append-only; each entry: `[date] — [decision] — [brief rationale]`

---

### 4.3 Size constraint

**The living brief must fit in under 150 lines.** The intent is that a model can load the living brief at session start alongside the task context and immediately begin productive work. A living brief that requires summarizing before use is too long.

When a decision log grows past ~30 entries, archive the oldest entries to a separate log file and keep the most recent 10–15 in the active brief.

---

### 4.4 Integration with plays

Every play that modifies the design system should:

1. **Read the living brief at session start** — confirm scope, confirm existing decisions, identify open questions relevant to the task
2. **Append to the decision log at session end** — one line per significant decision made during the session

This makes the living brief a reliable source of truth across sessions rather than a document that drifts from actual project state.

---

## 5 — Structuring component documentation for LLM consumption

### 5.1 Per-component document structure

**Every component document should follow a consistent structure** so a model can locate the information it needs without reading the whole file.

Recommended order:
1. **Purpose and when to use** — one paragraph; prevents misapplication
2. **Variants** — list with brief description of each
3. **Token consumption** — which tokens the component reads (not the values — the token names)
4. **States** — default, hover, focus, active, disabled, error; which tokens change per state
5. **Accessibility** — keyboard behavior, ARIA requirements, accessible name requirement

A model given a component doc in this format can implement the component correctly without additional context.

---

### 5.2 Token consumption over token values

**Component docs should reference token names, not token values.** A doc that says `border: 1px solid #767676` teaches the model to hardcode. A doc that says `border: 1px solid var(--color-border-default)` teaches the model to consume tokens.

This is the single most impactful structural choice for LLM-assisted component development. When components demonstrate correct token consumption, a model generating a new component will follow the same pattern. When components demonstrate hardcoded values, a model will generalize from that pattern.

---

### 5.3 Avoiding cross-file dependencies

**A component doc should be usable without loading additional files.** If understanding a component requires reading the token file, the type scale doc, and the color architecture doc simultaneously, the model's context budget is exhausted before it writes a line.

Techniques:
- Inline the specific token names relevant to the component (not the full token file)
- When a concept requires more explanation than fits inline, include a one-sentence summary and a path reference — not a requirement to load the full file first
- Avoid "see also" chains longer than one hop
