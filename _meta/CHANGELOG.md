# CHANGELOG.md
# Design System Knowledge Base — Change History

**Purpose:** This file records all additions, updates, and structural changes to the knowledge base over time. It is a record-keeping document, not a navigation or instruction document. Load it only when you need to audit the history of the knowledge base, onboard a new contributor, or investigate a potentially stale reference.

For navigation, see `INDEX.md`. For maintenance procedures, see `MAINTENANCE.md`.

---

## Format

Each session entry follows this structure:

```
### [YYYY-MM-DD] — [brief session title]
**Operator:** [human username or "LLM-assisted"]
**Systems affected:** [comma-separated list, or "meta only"]
**Summary:** [1–3 sentences describing what was done]

| Action | File | Notes |
|---|---|---|
| created | _meta/EXAMPLE.md | Initial creation |
| updated | carbon/guidance/foundations/colors@2026-05-11.md | Refreshed from upstream v11 |
| deprecated | carbon/guidance/foundations/colors@2025-09-03.md | Superseded by above |
```

---

## Log

### 2026-05-11 — Material Design 3: initial capture
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** First design system populated. Foundations coverage (color system, color roles, typography, shape, design tokens), web implementation getting started and token schema, three asset files (color, typography, shape baseline tokens), and a community-generated DESIGN.md derived from all source files. All files versioned with stubs. Master INDEX.md updated.

| Action | File | Notes |
|---|---|---|
| created | material/_index.md | System overview, source map, content inventory |
| created | material/guidance/foundations/color-system@2026-05-11.md | Three-tier model, dynamic color, key colors |
| created | material/guidance/foundations/color-roles@2026-05-11.md | All role families, on-* pattern, container roles |
| created | material/guidance/foundations/typography@2026-05-11.md | Typeface model, typescale roles and values |
| created | material/guidance/foundations/shape@2026-05-11.md | Shape scale, component defaults, customization |
| created | material/guidance/foundations/design-tokens@2026-05-11.md | Three tiers, naming conventions, cross-platform |
| created | material/implementation/getting-started@2026-05-11.md | CDN, npm, component usage, theming |
| created | material/implementation/tokens/token-schema@2026-05-11.md | Full CSS custom property schema |
| created | material/assets/tokens/colors@2026-05-11.json | Baseline light + dark color scheme |
| created | material/assets/tokens/typography@2026-05-11.json | Full typescale token values |
| created | material/assets/tokens/shape@2026-05-11.json | Shape scale + component defaults |
| created | material/design-md/DESIGN@2026-05-11.md | Community-generated DESIGN.md (unofficial) |
| created | 11x stub files | All stubs pointing to versioned files above |
| updated | _meta/INDEX.md | Material added to all relevant sections |

---

### 2026-05-11 — Material Design 3 initial capture
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** First design system added to the knowledge base. 12 versioned content files created covering guidance (color system, color roles, design tokens, typography, shape, consolidated color overview), implementation (getting-started, token schema), assets (color, typography, shape tokens as CSS custom properties), and a community-generated DESIGN.md. All files have corresponding redirect stubs. System `_index.md` and master `INDEX.md` updated. Material moved from planned systems to indexed.

| Action | File | Notes |
|---|---|---|
| created | material/_index.md | System index with source map and content inventory |
| created | material/guidance/foundations/colors@2026-05-11.md | Consolidated color overview |
| created | material/guidance/foundations/color-system@2026-05-11.md | Color architecture and Dynamic Color |
| created | material/guidance/foundations/color-roles@2026-05-11.md | Full color role catalogue |
| created | material/guidance/foundations/design-tokens@2026-05-11.md | Three-tier token model |
| created | material/guidance/foundations/typography@2026-05-11.md | Type scale and typeface guidance |
| created | material/guidance/foundations/shape@2026-05-11.md | Shape / corner radius system |
| created | material/implementation/getting-started@2026-05-11.md | Web installation and setup |
| created | material/implementation/tokens/token-schema@2026-05-11.md | Token CSS custom property reference |
| created | material/assets/tokens/colors@2026-05-11.json | CSS color token values |
| created | material/assets/tokens/typography@2026-05-11.json | CSS typography token values |
| created | material/assets/tokens/shape@2026-05-11.json | CSS shape token values |
| created | material/design-md/DESIGN@2026-05-11.md | Community DESIGN.md (unofficial) |
| created | redirect stubs (×12) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Added Material; updated coverage matrix; removed from planned systems |

---

### 2026-05-11 — Structural additions: DESIGN.md layer, exemplars, generative play tiers
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** Added three new structural elements informed by the discovery of the Google Labs DESIGN.md format and the `awesome-design-md` community repository: a `design-md/` layer in each system directory for community-generated DESIGN.md files derived from source material; an `_meta/exemplars/` directory for annotated output quality anchors; and a generative play tier model in the task playbooks with three new play categories (DESIGN.md tasks, token migration tasks, and full system design tasks).

| Action | File | Notes |
|---|---|---|
| updated | _meta/SCHEMA.md | v1.0 → v1.1; added `design-md` content type (Section 4.4), exemplars section (Section 5), updated directory structure |
| updated | _meta/MAINTENANCE.md | v1.0 → v1.1; added Step 7 (generate DESIGN.md) to Procedure A; renumbered steps 7–10; added Procedure E (exemplars) |
| updated | _meta/TASK_PLAYBOOKS.md | Added generative tier model; added Categories 6 (DESIGN.md tasks, 3 plays), 7 (token migration, 2 plays), 8 (full system design, 1 play) |

---

### 2026-05-11 — Initial meta layer created
**Operator:** LLM-assisted
**Systems affected:** meta only
**Summary:** Knowledge base structure established. All five meta layer files created. No design system content yet captured.

| Action | File | Notes |
|---|---|---|
| created | _meta/SCHEMA.md | File naming, versioning, frontmatter spec, content type classification |
| created | _meta/MAINTENANCE.md | Procedures A–D for adding, updating, and deprecating content |
| created | _meta/USAGE_GUIDE.md | LLM navigation and usage instructions |
| created | _meta/TASK_PLAYBOOKS.md | Initial playbooks for color, typography, component, token, and research tasks |
| created | _meta/INDEX.md | Master index template; no systems populated yet |
| created | _meta/CHANGELOG.md | This file |
