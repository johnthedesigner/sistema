# MAINTENANCE.md
# Design System Knowledge Base — Maintenance Procedures

**Version:** 1.1
**Created:** 2026-05-11
**Last Updated:** 2026-05-11
**Purpose:** This document defines the exact procedures for adding new design systems, updating existing content, and keeping index and meta files current. All maintenance sessions — whether human-led or LLM-assisted — must follow these procedures to ensure consistency with the conventions defined in `SCHEMA.md`.

Read `SCHEMA.md` before this document if you have not already. All terminology used here is defined there.

---

## General Principles

1. **Never overwrite existing content files.** Always create a new versioned file. Mark the previous version as `legacy`.
2. **Always update index files** when content is added or changed. A content file without a corresponding index entry is invisible to LLMs and users navigating the dataset.
3. **Stub files are the stable interface.** Prompts, playbooks, and app references should point to stub paths. Stubs should always be kept current.
4. **One system, one session.** When adding or updating a system, complete all steps in the procedure before moving on. Partial updates leave the index in an inconsistent state.
5. **Document your sources.** Every file must record where its content came from. If a source URL changes or goes offline, the provenance record is the only way to find an equivalent source.

---

## Procedure A: Adding a New Design System

Use this procedure when adding a system that has no existing directory in the knowledge base.

### Step 1 — Preparation

Before collecting any content, gather the following information:

- [ ] Confirm the system's canonical name and choose a slug (lowercase, kebab-case, e.g. `ant-design`)
- [ ] Identify the primary guidance documentation URL (the public doc site)
- [ ] Identify the primary GitHub repository URL
- [ ] Identify the tokens/assets source within the repository (often `/packages/tokens`, `/src/tokens`, or similar)
- [ ] Note the current version of the system (check GitHub releases or the doc site footer)
- [ ] Confirm the system is actively maintained (check last commit date, release recency)

Record all of this in a scratch note before proceeding.

### Step 2 — Create the Directory Structure

Create the following directories and placeholder files:

```
[system-slug]/
  _index.md               ← create now (see Step 3)
  guidance/
    foundations/
    components/
    patterns/
  implementation/
    components/
    tokens/
  assets/
    tokens/
    themes/
```

### Step 3 — Write the System `_index.md`

Populate `_index.md` with:

- System overview and design philosophy (2–4 sentences)
- A "when to reference this system" note covering ideal use cases
- The Source Map table (URLs for guidance, implementation, assets)
- An empty Content Inventory table (headers only — rows added in Steps 5–6)
- An empty Version History section with the first entry: `[date] — Initial capture`

### Step 4 — Collect Guidance Content

For each topic area (foundations, components, patterns), fetch content from the public documentation site. Priority topics for initial capture:

**Foundations (always capture first):**
- Color system (palette, tokens, theming, dark mode)
- Typography (scale, typefaces, usage rules)
- Spacing and layout (grid, spacing scale)
- Elevation / depth (shadows, z-index)
- Motion / animation principles (if documented)
- Iconography (if the system includes icons)

**Components (capture the most commonly used):**
- Focus on Button, Form elements, Navigation, Modal/Dialog, Data display (tables, lists)
- Capture usage guidance including when-to-use, variants, accessibility notes

**Patterns (capture if available):**
- Page layout patterns
- Navigation patterns
- Form patterns
- Empty states, loading states, error states

For each topic:
1. Create a versioned file: `guidance/[category]/[topic]@[YYYY-MM-DD].md`
2. Populate with frontmatter (see `SCHEMA.md` Section 3)
3. Write or paste content — reformatted into clean markdown if sourced from HTML
4. Create or update the redirect stub: `guidance/[category]/[topic].md`

### Step 5 — Collect Implementation Content

From the GitHub repository, collect:

- Getting started / installation guide → `implementation/getting-started@[date].md`
- Key component API docs (prop tables, import paths) → `implementation/components/[component]@[date].md`
- Token schema documentation (how tokens are structured and named) → `implementation/tokens/token-schema@[date].md`

Create stubs for each file as in Step 4.

### Step 6 — Collect Asset Files

From the GitHub repository, collect the raw token and theme files:

- Color tokens → `assets/tokens/colors@[date].json`
- Spacing tokens → `assets/tokens/spacing@[date].json`
- Typography tokens → `assets/tokens/typography@[date].json`
- Any theme files (light/dark/high-contrast) → `assets/themes/[theme-name]@[date].json`

Add the `_meta` block to each file (see `SCHEMA.md` Section 3.3). Create stubs for each.

### Step 7 — Generate the System DESIGN.md

Once `guidance/foundations/` and `assets/tokens/` files are in place, generate a DESIGN.md for the system. This must be derived from the source files captured in earlier steps — do not generate it cold.

1. Read the system's color, typography, spacing, and component guidance files
2. Read the corresponding token asset files
3. Generate `design-md/DESIGN@[date].md` following the DESIGN.md spec (see `SCHEMA.md` Section 4.4)
4. Populate the YAML front matter with token values drawn directly from asset files
5. Write the prose sections using language and rationale drawn from guidance files
6. Include the mandatory disclaimer in the document body: *"This is a community-generated DESIGN.md derived from [System Name]'s public documentation. It is not an official document published by the [System Name] team."*
7. Populate the `derived_from` frontmatter field with the complete list of source files used
8. Create the redirect stub: `design-md/DESIGN.md`

### Step 8 — Update the System `_index.md`

Fill in the Content Inventory table with one row per file created — including the DESIGN.md. Columns:

| File Path | Topic | Content Type | Status | Retrieved |
|---|---|---|---|---|

Add a Version History entry: `[date] — Initial capture: [N] files added across guidance, implementation, assets, and design-md.`

### Step 9 — Update the Master `_meta/INDEX.md`

- Add the new system to the "By System" section
- Add all new files to the relevant "By Category" sections (color, typography, etc.)
- Add the DESIGN.md to a "DESIGN.md Files" category section
- Update the system count and file count totals in the index header

### Step 10 — Update `_meta/TASK_PLAYBOOKS.md` if Needed

Review existing playbooks. If any reference "all systems" or include lists of available systems, update those lists to include the new system.

### Checklist Summary — New System

- [ ] Directory structure created (including `design-md/`)
- [ ] `_index.md` written with overview, source map, inventory table, version history
- [ ] Guidance files created (versioned + stubs)
- [ ] Implementation files created (versioned + stubs)
- [ ] Asset files created (versioned + stubs)
- [ ] All frontmatter complete on all content files
- [ ] DESIGN.md generated from source files (versioned + stub), disclaimer present, `derived_from` populated
- [ ] System `_index.md` Content Inventory table complete
- [ ] Master `INDEX.md` updated
- [ ] `TASK_PLAYBOOKS.md` updated if applicable

---

## Procedure B: Updating Existing Content for a Known System

Use this procedure when refreshing or expanding content for a system that already has a directory.

### Step 1 — Identify What Needs Updating

Before making any changes, determine:

- [ ] Which specific files are being updated (use the system `_index.md` Content Inventory as reference)
- [ ] What has changed upstream (check the system's changelog or GitHub releases)
- [ ] Whether this is a **minor content refresh** (same topic, new retrieval) or a **structural change** (the upstream system has reorganized or significantly changed its content model)

For structural changes, consider whether new topic files are needed in addition to updates to existing ones.

### Step 2 — For Each File Being Updated

1. **Create the new versioned file** with today's date (or current upstream version): `[topic]@[YYYY-MM-DD].md`
2. **Populate with full frontmatter**, including `supersedes: [previous-file-name]`
3. **Update the previous version's frontmatter**: change `status` from `latest` to `legacy`, add `superseded_by: [new-file-name]`
4. **Update the redirect stub** (`[topic].md`): change `points_to` to the new file name and update the `updated` date

### Step 3 — Update the System `_index.md`

- In the Content Inventory table: update the row for the affected topic to reflect the new file, status, and retrieval date
- Add a Version History entry: `[date] — Updated [topic]: [brief description of what changed]`

### Step 4 — Update the Master `_meta/INDEX.md`

- Update any entries that reference the old file to reference the new file (or its stub)
- Update "last updated" metadata in the index header

### Checklist Summary — Content Update

- [ ] New versioned file created with correct frontmatter including `supersedes`
- [ ] Previous file's `status` updated to `legacy` and `superseded_by` populated
- [ ] Redirect stub updated to point to new file
- [ ] System `_index.md` Content Inventory updated
- [ ] System `_index.md` Version History updated
- [ ] Master `INDEX.md` updated

---

## Procedure C: Adding a New Topic to an Existing System

Use this when adding a content file for a topic that has no prior entry for a given system (e.g. adding motion documentation for a system that previously had none).

This follows the same steps as creating a file in Procedure A (Steps 4–6), but scoped to a single topic. Key difference: there is no previous file to mark `legacy`, so the `supersedes` field is omitted.

After creating the file and stub, follow Steps 7–9 of Procedure A to update indexes.

---

## Procedure D: Deprecating a System

Use this when an upstream design system is no longer actively maintained and the knowledge base content should be flagged accordingly.

1. Update the `status` field in every content file in the system directory to `deprecated`
2. Update the system `_index.md` header with a deprecation notice and date
3. Update the master `INDEX.md` to flag the system as deprecated
4. Do not delete any files

---

## Procedure E: Creating and Updating Exemplars

Use this procedure when adding a new exemplar to `_meta/exemplars/` or updating an existing one.

Exemplars are worked-example outputs that anchor the quality of generative playbook tasks. They are not design system content — they live in `_meta/` and are maintained separately from system directories.

### When to Create a New Exemplar

- A new generative play is added to `TASK_PLAYBOOKS.md` that doesn't yet have an exemplar
- An existing play produces notably poor or inconsistent output, suggesting the LLM lacks a quality anchor
- A play is being featured on the public playbook website and needs preview content

### Steps

1. Identify the play this exemplar supports — note its `play_id` from `TASK_PLAYBOOKS.md`
2. Determine the appropriate `_meta/exemplars/` subdirectory (see `SCHEMA.md` Section 5.1); create a new category directory if needed
3. Produce the worked example — either by running the play with high-quality inputs and reviewing/refining the output, or by crafting it manually
4. Write the exemplar file following the format in `SCHEMA.md` Section 5.2: title, description, the full example, and annotations
5. Create a versioned file: `[descriptive-slug]@[YYYY-MM-DD].md`
6. Create a redirect stub: `[descriptive-slug].md`
7. Update `TASK_PLAYBOOKS.md` to reference the new exemplar in the relevant play entry
8. Append to `CHANGELOG.md`

### When to Update an Existing Exemplar

- The corresponding play has been meaningfully revised
- The exemplar is based on outdated knowledge base content (e.g. token structures that have since been refreshed)
- A better or more illustrative example has been identified

Updating follows the same append-only pattern as other content: create a new versioned file, mark the old one `legacy`, update the stub.

---

## Source Collection Guidelines

### Fetching from Documentation Websites

- Fetch the rendered documentation pages, not just the raw source, to capture content that may be generated or assembled at build time
- Strip navigation chrome, headers/footers, and sidebar content — retain only the main content body
- Reformat HTML content as clean markdown: headings, paragraphs, lists, tables, and code blocks
- Do not retain inline images; describe visual examples in bracketed notes: `[Figure: Example showing primary vs secondary button placement]`
- Preserve do/don't guidance, accessibility callouts, and usage notes — these are high-value for LLM tasks

### Fetching from GitHub

- Prefer raw file URLs for markdown files: `https://raw.githubusercontent.com/...`
- For token JSON files, fetch the source file directly — do not reconstruct from documentation
- Check the repository's release tags to confirm the version you are capturing
- Note if the repository is a monorepo and specify which package the content was sourced from

### Content Fidelity

- Preserve the meaning and specificity of the original documentation
- You may reformat for clarity (e.g. converting HTML tables to markdown tables) but do not paraphrase or summarize guidance content — LLMs benefit from the original language and specificity
- If content is very long (e.g. a full component library), it is acceptable to capture the most important components first and note which components were deferred

---

## Maintenance Session Log

After completing any maintenance session, append a brief entry to `CHANGELOG.md` using the format defined there. Do not record session history in this file.
