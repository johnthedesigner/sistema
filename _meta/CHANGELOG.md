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

### 2026-05-12 — Task 4.3: Color science foundations
**Operator:** LLM-assisted
**Systems affected:** foundations; meta
**Summary:** Added first foundations KB content: color science. Two content files covering perceptual color models (HSL, CIELAB, CAM16-UCS, HCT, OKLab) and contrast algorithms (WCAG 2.x relative luminance formula, APCA Lc values and use-case ranges, tonal palette design for accessibility). Sources: Björn Ottosson's OKLab post (bottosson.github.io/posts/oklab/), Material HCT color science article (material.io/blog/science-of-color-design), APCA Easy Intro (git.apcacontrast.com), WCAG 2.2 spec (already scraped for Task 4.2). `_meta/INDEX.md` updated to v2.0 (46 content files); foundations section filled in.

| Action | File | Notes |
|---|---|---|
| created | kb/foundations/color/_index.md | Sub-directory index |
| created | kb/foundations/color/perceptual-models@2026-05-12.md | HSL/CIELAB/CAM16-UCS/HCT/OKLab — why perceptual uniformity matters, model comparison, practical implications |
| created | kb/foundations/color/perceptual-models.md | Stub |
| created | kb/foundations/color/contrast-and-accessibility@2026-05-12.md | WCAG luminance formula, APCA Lc ranges, HCT tone differences for AA compliance |
| created | kb/foundations/color/contrast-and-accessibility.md | Stub |
| updated | _meta/INDEX.md | v1.9 → v2.0; 44 → 46 content files; foundations section populated |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 4.2: WCAG 2.2 accessibility reference
**Operator:** LLM-assisted
**Systems affected:** standards; meta
**Summary:** Added WCAG 2.2 accessibility reference as the first standards content for `kb/standards/wcag/`. Full spec scraped from www.w3.org/TR/WCAG22/ via Firecrawl (4511-line document). Extracted 9 success criteria covering the most relevant requirements for UI component implementation: color contrast (1.4.3, 1.4.6, 1.4.11), keyboard operability (2.1.1, 2.1.2), focus visibility (2.4.7, 2.4.11), touch targets (2.5.5, 2.5.8), and name/role/value (4.1.2). Structured as three decision-oriented files with concrete pass/fail values and implementation notes rather than verbatim spec transcription. `_meta/INDEX.md` updated to v1.9 (44 content files).

| Action | File | Notes |
|---|---|---|
| created | kb/standards/wcag/_index.md | Sub-directory index with conformance level overview |
| created | kb/standards/wcag/color-contrast@2026-05-12.md | 1.4.3 (4.5:1/3:1), 1.4.6 (7:1), 1.4.11 (3:1 UI), luminance formula, reference values |
| created | kb/standards/wcag/color-contrast.md | Stub |
| created | kb/standards/wcag/keyboard-and-focus@2026-05-12.md | 2.1.1, 2.1.2, 2.4.7, 2.4.11 with implementation patterns and CSS |
| created | kb/standards/wcag/keyboard-and-focus.md | Stub |
| created | kb/standards/wcag/components@2026-05-12.md | 2.5.5 (44px), 2.5.8 (24px), 4.1.2 (accessible name, roles, state table) |
| created | kb/standards/wcag/components.md | Stub |
| updated | _meta/INDEX.md | v1.8 → v1.9; 41 → 44 content files; WCAG section added to Standards |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — KB structure: category definitions + DESIGN.md reclassified to standards
**Operator:** LLM-assisted
**Systems affected:** standards; foundations; meta; app
**Summary:** Established formal definitions for all three KB categories (design-systems, standards, foundations) in `_meta/SCHEMA.md` Section 0 and `AGENTS.md`. DESIGN.md spec content moved from `kb/foundations/design-md/` to `kb/standards/design-md/` — it is a format specification, not design theory. The `examples@` file (sourced from community awesome-design-md) removed entirely; no unofficial sources without explicit user approval. App KB index page descriptions updated. `foundations/` is now empty pending Task 4.3 (color science).

| Action | File | Notes |
|---|---|---|
| created | _meta/SCHEMA.md Section 0 | Canonical definitions for all three KB categories |
| updated | AGENTS.md | Added KB category definitions section + mandatory intake process |
| moved | kb/foundations/design-md/ → kb/standards/design-md/ | DESIGN.md is a format spec, not design theory |
| deleted | kb/foundations/design-md/examples@2026-05-12.md | Community source; not appropriate without user vetting |
| updated | src/app/kb/page.tsx | Updated CATEGORY_META descriptions for standards and foundations |
| updated | _meta/INDEX.md | v1.7 → v1.8; Section 1b renamed Standards; Section 1c (Foundations, empty) added |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 4.1: DESIGN.md specification capture
**Operator:** LLM-assisted
**Systems affected:** foundations; meta
**Summary:** Added the DESIGN.md format specification as the first foundations KB entry. Overview and spec scraped from stitch.withgoogle.com via Firecrawl. Key format details: YAML front matter (machine-readable tokens) + markdown body (rationale); 8 canonical sections; explicit type system (Color, Dimension, Token Reference, Typography); token reference syntax `{path.to.token}`; component variants as separate keyed entries. Examples file sourced from awesome-design-md community collection — user-vetted secondary source. `_meta/INDEX.md` updated to v1.7 (41 content files); Section 1b (Foundations) added.

| Action | File | Notes |
|---|---|---|
| created | kb/foundations/design-md/_index.md | Sub-directory index |
| created | kb/foundations/design-md/overview@2026-05-12.md | From stitch.withgoogle.com/docs/design-md/overview |
| created | kb/foundations/design-md/overview.md | Stub |
| created | kb/foundations/design-md/spec@2026-05-12.md | From stitch.withgoogle.com/docs/design-md/specification |
| created | kb/foundations/design-md/spec.md | Stub |
| created | kb/foundations/design-md/examples@2026-05-12.md | awesome-design-md community collection — user-vetted secondary source |
| created | kb/foundations/design-md/examples.md | Stub |
| updated | _meta/INDEX.md | v1.5 → v1.7; 38 → 41 content files; Section 1b (Foundations) added |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 3.5: Component documentation — Material and Carbon
**Operator:** LLM-assisted
**Systems affected:** material; carbon; meta
**Summary:** Added component-level guidance for four components across Material Design 3 and Carbon. Material sources: m3.material.io scrape (buttons, text-fields, dialogs, navigation-bar). Carbon sources: GitHub MDX files for Button and Modal; carbondesignsystem.com for TextInput and UIShell. 8 versioned content files + 8 stubs created. Both system `_index.md` files updated. `_meta/INDEX.md` updated to v1.5 (38 content files); coverage matrix updated for Button, Form Elements, Navigation, Modals/Dialogs.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/material/guidance/components/button@2026-05-12.md | 5 variants, M3 Expressive sizes, token reference, states |
| created | kb/design-systems/material/guidance/components/button.md | Stub |
| created | kb/design-systems/material/guidance/components/text-field@2026-05-12.md | Filled/outlined variants, states table, anatomy, error rules |
| created | kb/design-systems/material/guidance/components/text-field.md | Stub |
| created | kb/design-systems/material/guidance/components/dialog@2026-05-12.md | Basic/full-screen, anatomy, action rules, focus behavior |
| created | kb/design-systems/material/guidance/components/dialog.md | Stub |
| created | kb/design-systems/material/guidance/components/navigation-bar@2026-05-12.md | Flexible/baseline variants, tokens, responsive pattern |
| created | kb/design-systems/material/guidance/components/navigation-bar.md | Stub |
| created | kb/design-systems/carbon/guidance/components/button@2026-05-12.md | 7 kinds, 6 sizes, icon usage, ButtonSet, accessibility |
| created | kb/design-systems/carbon/guidance/components/button.md | Stub |
| created | kb/design-systems/carbon/guidance/components/text-input@2026-05-12.md | Variants, states, layer-aware bg, password, accessibility |
| created | kb/design-systems/carbon/guidance/components/text-input.md | Stub |
| created | kb/design-systems/carbon/guidance/components/modal@2026-05-12.md | 4 variants, sizes, anatomy, focus management, floating menus |
| created | kb/design-systems/carbon/guidance/components/modal.md | Stub |
| created | kb/design-systems/carbon/guidance/components/ui-shell@2026-05-12.md | Header, SideNav (rail/full), responsive, theming, accessibility |
| created | kb/design-systems/carbon/guidance/components/ui-shell.md | Stub |
| updated | kb/design-systems/material/_index.md | 12 → 16 versioned files; component rows added |
| updated | kb/design-systems/carbon/_index.md | 7 → 11 versioned files; component rows added |
| updated | _meta/INDEX.md | v1.4 → v1.5; 30 → 38 content files; sections 2.7–2.10 populated; coverage matrix updated |

---

### 2026-05-12 — Task 2.5: Atlassian Design System initial capture
**Operator:** LLM-assisted
**Systems affected:** atlassian; meta
**Summary:** Atlassian Design System (Atlaskit) added as the third KB system. Three Firecrawl scrapes (color, typography; design-tokens page returned 0 pages — JS-rendered). Token values sourced from `@atlaskit/tokens@13.0.4` CDN package. 6 versioned content files created across guidance (3), implementation (1), assets (1), and design-md (1). `_meta/INDEX.md` updated to v1.3 (3 systems, 25 content files).

| Action | File | Notes |
|---|---|---|
| created | atlassian/_index.md | System overview, source map, content inventory |
| created | atlassian/guidance/foundations/color@2026-05-12.md | Color roles, emphasis levels, interaction states, accessibility |
| created | atlassian/guidance/foundations/typography@2026-05-12.md | Atlassian Sans/Mono, type scale tokens, rem system |
| created | atlassian/guidance/foundations/design-tokens@2026-05-12.md | Token categories, naming convention, spacing scale, elevation, border, radius |
| created | atlassian/implementation/getting-started@2026-05-12.md | @atlaskit/tokens + @atlaskit/primitives installation and usage |
| created | atlassian/assets/tokens/colors@2026-05-12.json | Light-theme color + elevation token values (text, icon, border, link, background, elevation, blanket, skeleton) |
| created | atlassian/design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Atlassian DS |
| created | redirect stubs (×6) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Atlassian added to all relevant sections; coverage matrix updated; version bumped to 1.3 |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-12 — Task 2.3: Carbon Design System initial capture
**Operator:** LLM-assisted
**Systems affected:** carbon; meta
**Summary:** Carbon v11 added as the second design system in the KB. Four Firecrawl scrapes (color, typography, themes, React getting-started), two GitHub token fetches (IBM color palette, White theme). 7 versioned content files created across guidance (3), implementation (1), assets (2), and design-md (1). All files have corresponding redirect stubs. `_meta/INDEX.md` updated to v1.2 (2 systems, 19 content files).

| Action | File | Notes |
|---|---|---|
| created | carbon/_index.md | System overview, source map, content inventory |
| created | carbon/guidance/foundations/color-system@2026-05-12.md | Color system — themes, layering model, token groups, interaction states |
| created | carbon/guidance/foundations/typography@2026-05-12.md | IBM Plex typeface, productive/expressive type sets, token categories |
| created | carbon/guidance/foundations/themes@2026-05-12.md | 4 built-in themes, token categories, customization via Sass |
| created | carbon/implementation/getting-started@2026-05-12.md | React installation, components, styles, icons, theming |
| created | carbon/assets/tokens/colors@2026-05-12.json | IBM Design Language palette — all hues (10 colors) with 10 steps each |
| created | carbon/assets/tokens/white-theme@2026-05-12.json | White theme semantic token assignments (background, layer, field, border, text, link, icon, support, focus, misc, skeleton) |
| created | carbon/design-md/DESIGN@2026-05-12.md | DESIGN.md reference for Carbon |
| created | redirect stubs (×7) | Unversioned stub files for all content files above |
| updated | _meta/INDEX.md | Carbon added to all relevant sections; coverage matrix updated; version bumped to 1.2 |
| updated | _meta/CHANGELOG.md | This entry |

---

### 2026-05-11 — Phase 0, Tasks 0.1–0.2: Tools scaffold and Material Design 3 scrape
**Operator:** LLM-assisted
**Systems affected:** meta only (tools); material (raw data)
**Summary:** Created the `tools/` directory with Firecrawl scraper and frontmatter linter. Three-pass scrape of m3.material.io and material-web.dev captured 62 raw files covering all six required guidance topics plus bonus coverage (elevation, icons, motion, layout, M3 Expressive, design-tokens foundations).

| Action | File | Notes |
|---|---|---|
| created | tools/package.json | Dependencies: firecrawl-js, dotenv, gray-matter, playwright, prettier, zod |
| created | tools/tsconfig.json | Strict mode, ESNext, bundler module resolution |
| created | tools/.env.example | FIRECRAWL_API_KEY= placeholder |
| created | tools/scrape/firecrawl-guidance.ts | Firecrawl scraper; --url / --slug / --limit / --wait CLI args; writes to raw-scrape/ |
| created | tools/validate/lint-frontmatter.ts | Frontmatter linter; design-md special handling; skips _index.md |
| created | raw-scrape/material/2026-05-11/ | 62 raw markdown files from three-pass scrape |

---

### 2026-05-11 — Phase 0, Tasks 0.3–0.5: Guidance enrichment, verification, and DESIGN.md regeneration
**Operator:** LLM-assisted
**Systems affected:** material
**Summary:** All six guidance files updated in-place with authoritative scraped content. All three asset token files and both implementation files verified against live upstream sources (GitHub material-web v0_192 SCSS). YAML parse error in getting-started fixed. DESIGN.md regenerated from all nine verified sources. Full lint: 18 files, 0 errors.

| Action | File | Notes |
|---|---|---|
| updated | material/guidance/foundations/colors@2026-05-11.md | Removed stale notes: draft field from frontmatter |
| updated | material/guidance/foundations/color-system@2026-05-11.md | Added HCT color space section; added Contrast Levels section (standard/medium/high) |
| updated | material/guidance/foundations/color-roles@2026-05-11.md | Added Inverse Family table; Pairing and Layering Rules; Add-on Color Roles (fixed accent, bright/dim surface) |
| updated | material/guidance/foundations/design-tokens@2026-05-11.md | Added Contexts section (light/dark/form-factor context model) |
| updated | material/guidance/foundations/typography@2026-05-11.md | Added M3 Expressive Update section (30 styles, emphasized token naming, platform availability) |
| updated | material/guidance/foundations/shape@2026-05-11.md | Added M3 Expressive Update (35 shapes, 3 new corner tokens); added Shape Principles section |
| updated | material/implementation/getting-started@2026-05-11.md | Fixed YAML parse error: @material/web quoted in tags flow sequence |
| updated | material/design-md/DESIGN@2026-05-11.md | Full regeneration: nested light/dark color sections (28 roles each), letter-spacing on all 15 typescale entries, Expressive shape tokens, 5 new component mappings, Token Architecture prose |
| verified | material/assets/tokens/shape@2026-05-11.json | All 7 corner radius values match live v0_192 |
| verified | material/assets/tokens/typography@2026-05-11.json | All 15 typescale roles verified against live SCSS |
| verified | material/assets/tokens/colors@2026-05-11.json | Accent colors verified; neutral palette has documented 1-unit hex delta (imperceptible) |
| verified | material/implementation/tokens/token-schema@2026-05-11.md | Token naming and values verified against material-web.dev |

---

### 2026-05-11 — Phase 0, Task 0.6: Index and changelog update
**Operator:** LLM-assisted
**Systems affected:** material; meta only
**Summary:** Updated material/_index.md Version History with Phase 0 enrichment entry. Added Phase 0 task entries to this changelog. _meta/INDEX.md header counts and coverage matrix verified accurate (no changes required).

| Action | File | Notes |
|---|---|---|
| updated | material/_index.md | Added Phase 0 enrichment row to Version History |
| updated | _meta/CHANGELOG.md | Added Phase 0 Tasks 0.1–0.2, 0.3–0.5, and 0.6 entries |

---

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

### 2026-05-12 — Primer (GitHub) initial capture
**Operator:** LLM-assisted
**Systems affected:** primer
**Summary:** Full initial capture of Primer Design System. Source: primer/design GitHub repo (MDX) and primer/primitives token JSON5 files. The primer.style doc site is fully JS-rendered (Firecrawl returned 0 pages); all content sourced directly from GitHub raw URLs.

| Action | File | Notes |
|---|---|---|
| created | kb/design-systems/primer/_index.md | System index with overview, source map, content inventory |
| created | kb/design-systems/primer/guidance/foundations/color-system@2026-05-12.md | Three-tier token model, neutral tokens, semantic roles, base scales |
| created | kb/design-systems/primer/guidance/foundations/color-system.md | Stub |
| created | kb/design-systems/primer/guidance/foundations/typography@2026-05-12.md | Type scale, weights, font stacks, best practices |
| created | kb/design-systems/primer/guidance/foundations/typography.md | Stub |
| created | kb/design-systems/primer/guidance/components/button@2026-05-12.md | Variants, sizing, anatomy, states, accessibility |
| created | kb/design-systems/primer/guidance/components/button.md | Stub |
| created | kb/design-systems/primer/assets/tokens/colors@2026-05-12.json | Functional color token reference (fgColor, bgColor, borderColor, shadow) |
| created | kb/design-systems/primer/assets/tokens/colors.json | Stub |
| created | kb/design-systems/primer/design-md/DESIGN@2026-05-12.md | Visual language spec for AI coding tools |
| created | kb/design-systems/primer/design-md/DESIGN.md | Stub |
| updated | _meta/INDEX.md | Primer added to quick reference; planned systems list updated |

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
