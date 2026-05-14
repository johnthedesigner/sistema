# SCHEMA.md
# Design System Knowledge Base — File & Structure Conventions

**Version:** 1.2
**Created:** 2026-05-11
**Last Updated:** 2026-05-12
**Purpose:** This document defines the canonical structure, naming conventions, frontmatter schema, and content classification rules for all files in this knowledge base. All contributors and LLM-assisted maintenance sessions must follow these conventions to ensure consistency.

---

## 0. Knowledge Base Category Definitions

The KB is divided into three top-level categories under `kb/`. Every piece of content belongs in exactly one. When adding new content, identify the correct category before creating any files.

### `kb/design-systems/` — Design Systems

**What belongs here:** Documentation sets for specific named design systems. Each entry covers one system's guidance (color, typography, spacing, components), implementation details (getting-started, token schemas), and raw token assets.

**How to identify it:** The content is about a specific named system — Material, Carbon, Atlassian, Primer, Radix, etc. The primary source is that system's own documentation site and official repositories.

**Examples:** Material Design 3 color guidance, Carbon button component docs, Atlassian token schema.

**Does not include:** General theory about why color works (→ foundations), normative standards the system follows (→ standards).

---

### `kb/standards/` — Standards

**What belongs here:** Authoritative format specifications and normative standards maintained by their creators. These define rules, criteria, or conformance behavior that other work must satisfy or conform to.

**How to identify it:** The content defines *what conformance looks like* — pass/fail criteria, required fields, specified behaviors. It is maintained by a single authoritative body and has a canonical URL. You cite it; you don't interpret it.

**Examples:** WCAG 2.2 (accessibility criteria), ARIA Authoring Practices Guide (interaction patterns), DESIGN.md spec (format for encoding design systems for AI agents), APCA (contrast algorithm).

**Does not include:** One design system's implementation of a standard (→ design-systems), theory explaining why the standard works the way it does (→ foundations).

---

### `kb/foundations/` — Foundations

**What belongs here:** Scientific and theoretical underpinnings of design — the *why* behind design decisions. Content that helps an agent reason from first principles rather than pattern-match from examples.

**How to identify it:** The content explains mechanisms, models, or principles that apply across many design systems — not rules for any specific system or format. It would be true regardless of which design system you're using.

**Examples:** Perceptual color models (HCT, OKLab, HSL) and why they produce visually uniform palettes, typography science (optical sizing, x-height relationships), spacing theory (why 8px grids work), contrast algorithms and how they map to human perception.

**Does not include:** Any specific design system's color palette (→ design-systems), the WCAG contrast threshold values themselves (→ standards).

---

## 1. Top-Level Directory Structure

```
design-system-kb/
  _meta/
    SCHEMA.md               ← this file
    MAINTENANCE.md          ← procedures for adding and updating content
    USAGE_GUIDE.md          ← how an LLM should navigate and use this dataset
    TASK_PLAYBOOKS.md       ← task-specific retrieval and reasoning strategies
    INDEX.md                ← master index, cross-referenced by system and category
    CHANGELOG.md            ← full history of additions and updates
    exemplars/              ← annotated worked examples for generative plays (see Section 5)
      semantic-token-systems/
      design-md-files/
      token-migrations/
  [system-slug]/            ← one directory per design system (e.g. carbon/, material/)
    _index.md               ← system overview, sources, version map, status summary
    guidance/               ← human-facing design documentation (see Section 4)
      foundations/
      components/
      patterns/
    implementation/         ← developer-facing technical documentation (see Section 4)
      getting-started.md
      components/
      tokens/
    assets/                 ← raw structured data: token files, theme files, config
      tokens/
      themes/
    design-md/              ← DESIGN.md files for this system (see Section 8)
      DESIGN.md             ← stub → latest
      DESIGN@[date].md      ← versioned DESIGN.md derived from guidance and asset layers
```

All directory names use lowercase kebab-case. No spaces. No special characters other than hyphens.

---

## 2. File Naming Convention and Versioning

This knowledge base is a **living, append-only resource**. Files are never overwritten. When content is updated, a new versioned file is created alongside the existing one. Status metadata and redirect stubs manage which version is considered current.

### 2.1 Versioned File Names

Every content file (other than stubs and meta files) is created with a version suffix. Two suffix formats are supported:

- **Date-stamped:** `colors@2026-05-11.md` — used when the retrieval or authoring date is the primary version signal
- **Version-stamped:** `colors@v11.md` — used when the upstream design system uses clear semver or major version numbering and that version is known at time of capture

When in doubt, prefer date-stamped. Version numbers can always be added to frontmatter even if not in the filename.

Examples:
```
foundations/
  colors@2026-05-11.md
  colors@2025-09-03.md
  colors@v10.md
```

### 2.2 Redirect Stubs

Every topic has a **redirect stub** — an unversioned file at the canonical path that always points to the current latest version. This ensures that any reference in a prompt, playbook, or app to a stable path (e.g. `carbon/guidance/foundations/colors.md`) never breaks, regardless of how many updates have occurred.

**Stub file format:**

```markdown
---
type: stub
points_to: colors@2026-05-11.md
updated: 2026-05-11
---

This file is a redirect stub. The current version of this content is:
[colors@2026-05-11.md](./colors@2026-05-11.md)
```

Stub files contain no substantive content. When an LLM encounters a stub, it must follow the `points_to` reference to retrieve actual content.

### 2.3 Status Values

Every non-stub content file must include a `status` field in its frontmatter (see Section 3). Valid values:

| Status | Meaning |
|---|---|
| `latest` | Current canonical version of this content |
| `legacy` | A previous version; superseded but retained for reference |
| `draft` | Incomplete or unreviewed content; not yet canonical |
| `deprecated` | Content for a design system or feature that is no longer maintained upstream |

Only one file per topic per system should carry `status: latest` at any time. When a new version is added, the previous `latest` file must be updated to `status: legacy` and its `superseded_by` field populated.

---

## 3. Frontmatter Schema

All content files (non-stubs, non-assets) must begin with a YAML frontmatter block. The following fields are defined.

### 3.1 Required Fields

```yaml
---
system: carbon                          # system slug matching the directory name
category: foundations                   # foundations | components | patterns | getting-started | tokens | other
topic: colors                           # the specific subject of this file
content_type: guidance                  # guidance | implementation | asset (see Section 4)
status: latest                          # latest | legacy | draft | deprecated
version_label: "v11"                    # upstream system version if known; omit if unknown
retrieved: 2026-05-11                   # date this content was sourced (YYYY-MM-DD)
source_url: https://carbondesignsystem.com/guidelines/color/overview/
---
```

### 3.2 Source citation fields

Source fields are required for all synthesis and reference documents. The app renders them as a linked "Sources" sidebar on every KB content page.

```yaml
# For reference documents (single primary URL):
source_url: https://carbondesignsystem.com/guidelines/color/overview/

# For synthesis documents with multiple sources — use `sources` (preferred for new docs):
sources:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
  - https://drafts.csswg.org/css-fonts-4/
  - kb/reference/foundations/typography/type-scales    # internal KB paths also accepted

# `derived_from` is the legacy equivalent of `sources` for external URLs:
derived_from:
  - https://practicaltypography.com/line-spacing.html
  - https://practicaltypography.com/body-text.html
```

**Rules:**
- `sources` accepts both external URLs (`https://...`) and internal KB paths (`kb/reference/...` or `kb/principles/...`). The app distinguishes them automatically.
- For new synthesis documents, prefer `sources` over the older `source_url` + `derived_from` pair.
- Existing documents using `source_url` / `derived_from` are still valid — the sidebar merges all three fields.
- Do not include Markdown hyperlinks `[text](url)` in the document body for source citations — the sidebar handles linking. Plain text domain names in the body are fine for in-prose attribution.
- For principles (synthesis) documents that synthesize across internal KB documents, list the KB paths in `sources`.

### 3.3 Optional metadata fields

```yaml
supersedes: colors@2025-09-03.md       # the file this version replaces (omit for first capture)
superseded_by: colors@2026-11-01.md    # populated when this file's status changes to legacy
tags: [color-tokens, theming, dark-mode, accessibility]   # free-form descriptive tags
notes: >
  Captured from the v11 documentation site. The v10 color system used a different
  token naming convention; see colors@v10.md for the legacy structure.
```

### 3.4 Asset File Headers

Structured asset files (JSON, SCSS, CSS) do not use YAML frontmatter. Instead, they begin with a comment block:

```json
{
  "_meta": {
    "system": "carbon",
    "topic": "color-tokens",
    "content_type": "asset",
    "status": "latest",
    "version_label": "v11",
    "retrieved": "2026-05-11",
    "source_url": "https://github.com/carbon-design-system/carbon/blob/main/packages/themes/src/tokens/..."
  },
  ...
}
```

---

## 4. Content Type Classification

This is the most important structural distinction in the knowledge base. Every piece of content belongs to exactly one of four content types. Mixing types within a single file is not permitted.

### 4.1 `guidance` — Design Documentation

**What it is:** Human-facing documentation authored for designers and product teams. Explains the *why* and the *how*. Covers design rationale, usage rules, accessibility considerations, visual examples described in prose, do/don't guidance, interaction patterns, and design principles.

**Where it comes from:** Almost always the public-facing documentation website (e.g. `carbondesignsystem.com`, `m3.material.io`, `atlassian.design`). Rarely found verbatim in GitHub repositories — if it is, it's in `.mdx` or `.md` files under a `/docs` or `/site` directory.

**Lives in:** `[system]/guidance/`

**Characteristic content:**
- "Use primary buttons for the most important action on a screen"
- "Ensure a minimum contrast ratio of 4.5:1 for body text"
- "Avoid using more than two levels of type hierarchy in a single component"

### 4.2 `implementation` — Technical / Developer Documentation

**What it is:** Developer-facing documentation for engineers integrating or building with the system. Covers API references, component prop tables, installation and configuration, package structure, migration guides, and code examples.

**Where it comes from:** GitHub repositories (READMEs, contribution guides, changelog), documentation sites' developer sections, npm package pages.

**Lives in:** `[system]/implementation/`

**Characteristic content:**
- Component prop tables with types and defaults
- `npm install @carbon/react` installation instructions
- Import paths, tree-shaking guidance
- Framework-specific usage notes

### 4.3 `asset` — Raw Structured Data

**What it is:** Machine-readable source files. The ground truth for actual values. Not prose.

**Where it comes from:** GitHub repositories — typically published npm packages, `/tokens`, `/themes`, or `/packages` directories.

**Lives in:** `[system]/assets/`

**Characteristic content:**
- Design token JSON files
- CSS custom property files
- SCSS variable files
- Theme configuration objects

### 4.4 `design-md` — DESIGN.md System Representation

**What it is:** A DESIGN.md format file (Google Labs open spec, Apache 2.0) that encodes a design system as a persistent, agent-readable context document. Combines YAML front matter (machine-readable design tokens) with markdown prose (human-readable design rationale). Intended for direct use in AI coding agent sessions (Claude Code, Cursor, GitHub Copilot, Google Stitch).

**Where it comes from:** Derived from the system's `guidance/` and `asset/` layers within this knowledge base. **Not sourced directly from the upstream design system** — these files do not exist officially for most open-source design frameworks. All DESIGN.md files in this knowledge base are community-generated and must be marked accordingly.

**Lives in:** `[system]/design-md/`

**Required frontmatter additions for this content type:**
```yaml
content_type: design-md
unofficial: true                        # always true; these are not published by the upstream system
derived_from:                           # list the source files used to generate this
  - guidance/foundations/colors@2026-05-11.md
  - guidance/foundations/typography@2026-05-11.md
  - assets/tokens/colors@2026-05-11.md
design_md_spec_version: alpha           # the DESIGN.md spec version this file conforms to
```

**Generation rule:** DESIGN.md files must be derived from existing `guidance/` and `asset/` files in the same system directory — never generated cold without source material. This ensures the DESIGN.md reflects the system's actual documented intent rather than an LLM's interpretation of the brand. When source files are updated, the DESIGN.md should be flagged for regeneration.

**Characteristic content:**
- YAML front matter with color, typography, spacing, and component tokens drawn directly from `asset/` files
- Prose sections derived from `guidance/foundations/` rationale — the *why* behind the token values
- Explicit `## Do's and Don'ts` section synthesized from usage guidance
- Marked with a prominent disclaimer in the document body: *"This is a community-generated DESIGN.md, not an official document published by [System Name]."*

---

## 5. Exemplars

Exemplars are annotated, worked-example outputs that demonstrate what high-quality results look like for generative playbook tasks. They live in `_meta/exemplars/` and are organized by task type. They serve two purposes:

1. **LLM output quality anchors** — loaded as context during generative plays to ground the model's output in a concrete, vetted standard rather than its own unconstrained interpretation
2. **Website preview content** — the reference examples displayed on the playbook website so users can evaluate a play before running it

Exemplars are not design system documentation and do not belong in system directories. They are `_meta/`-layer resources because they describe output quality standards, not upstream system content.

### 5.1 Exemplar Directory Structure

```
_meta/exemplars/
  semantic-token-systems/       ← complete token architectures with annotations
  design-md-files/              ← well-formed DESIGN.md outputs with annotations
  token-migrations/             ← before/after examples of token refactoring tasks
  component-specs/              ← well-formed component specification documents
```

New exemplar categories are added as generative play types are developed.

### 5.2 Exemplar File Format

Exemplar files are markdown documents with a consistent structure:

```markdown
---
type: exemplar
task_category: [category matching a TASK_PLAYBOOKS.md entry]
play_id: [the specific playbook play this exemplar supports, e.g. "1.2"]
created: YYYY-MM-DD
quality_notes: >
  Brief note on what makes this a good example and any known limitations.
---

# [Descriptive Title]

> **What this exemplar is:** A brief 1–2 sentence description of the task this output
> demonstrates and what makes it a strong example.

---

[The full worked example output]

---

## Annotations

### Why this works
- [Specific observation about a good decision in the example]

### What to watch for
- [A nuance or edge case the example illustrates]
```

### 5.3 Exemplar Versioning

Exemplars follow the same versioning conventions as other content files: date-stamped filenames, status frontmatter, and redirect stubs. They are updated when the corresponding playbook play is significantly revised or when a better canonical example is identified.

---

## 6. System Index Files

Each design system directory contains an `_index.md` file. This is not versioned — it is updated in place as the system's content evolves. It serves as the entry point for any LLM or human navigating a specific system.

Required sections in every `_index.md`:

```markdown
# [System Name] — Index

## Overview
Brief description of the system: its origin, intended audience, design philosophy, and key characteristics.
Include a "when to reference this system" note: what kinds of tasks or design problems this system is a strong reference for.

## Source Map
Table of source URLs by content type:
| Content Type | Source | Notes |
|---|---|---|
| Guidance | https://... | Main documentation site |
| Implementation | https://github.com/... | Monorepo, packages/react |
| Assets / Tokens | https://github.com/... | packages/themes/src/tokens |

## Content Inventory
Table of all files in this system directory, with topic, content_type, status, and retrieved date.
This table is updated every time a file is added or refreshed.

## Version History
Chronological log of when content was added or updated, and what changed.
```

---

## 7. The Master INDEX.md

The master `_meta/INDEX.md` provides a cross-referenced view of the entire knowledge base. It is updated every time any system content is added or refreshed. It organizes content along two axes:

- **By system:** All content for each design system, with links
- **By category:** All content of a given type (e.g. all color documentation, all token assets) across all systems

The master index does not contain content — only navigation and metadata. See `INDEX.md` for the current state.

---

## 8. What This Schema Does Not Cover

- **How to collect and process source content** — see `MAINTENANCE.md`
- **How an LLM should navigate and use this data** — see `USAGE_GUIDE.md`
- **Task-specific retrieval strategies** — see `TASK_PLAYBOOKS.md`
