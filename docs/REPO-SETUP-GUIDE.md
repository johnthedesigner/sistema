# Repo Setup Guide — Design System Knowledge Base

**Purpose:** Exact instructions for initializing the repository and placing all files generated in this chat session. Follow this before running any Claude Code sessions.

---

## Step 1 — Initialize the repository

```bash
mkdir design-system-kb
cd design-system-kb
git init
```

---

## Step 2 — Create the directory structure

```bash
mkdir -p \
  _meta/exemplars/semantic-token-systems \
  _meta/exemplars/design-md-files \
  _meta/exemplars/token-migrations \
  _meta/exemplars/component-specs \
  material/guidance/foundations \
  material/guidance/components \
  material/guidance/patterns \
  material/implementation/tokens \
  material/implementation/components \
  material/assets/tokens \
  material/assets/themes \
  material/design-md \
  tools/scrape \
  tools/validate \
  tasks \
  logs \
  docs
```

---

## Step 3 — Place the KB files from this session

Download each file from this chat and place it at the exact path shown.

### `_meta/` — 6 files

| File | Destination |
|---|---|
| `SCHEMA.md` | `_meta/SCHEMA.md` |
| `MAINTENANCE.md` | `_meta/MAINTENANCE.md` |
| `USAGE_GUIDE.md` | `_meta/USAGE_GUIDE.md` |
| `TASK_PLAYBOOKS.md` | `_meta/TASK_PLAYBOOKS.md` |
| `INDEX.md` | `_meta/INDEX.md` |
| `CHANGELOG.md` | `_meta/CHANGELOG.md` |

### `material/` — system index

| File | Destination |
|---|---|
| `_index.md` (the material one) | `material/_index.md` |

### `material/guidance/foundations/` — 14 files (7 versioned + 7 stubs)

| File | Destination |
|---|---|
| `colors@2026-05-11.md` | `material/guidance/foundations/colors@2026-05-11.md` |
| `colors.md` | `material/guidance/foundations/colors.md` |
| `color-system@2026-05-11.md` | `material/guidance/foundations/color-system@2026-05-11.md` |
| `color-system.md` | `material/guidance/foundations/color-system.md` |
| `color-roles@2026-05-11.md` | `material/guidance/foundations/color-roles@2026-05-11.md` |
| `color-roles.md` | `material/guidance/foundations/color-roles.md` |
| `design-tokens@2026-05-11.md` | `material/guidance/foundations/design-tokens@2026-05-11.md` |
| `design-tokens.md` | `material/guidance/foundations/design-tokens.md` |
| `typography@2026-05-11.md` | `material/guidance/foundations/typography@2026-05-11.md` |
| `typography.md` | `material/guidance/foundations/typography.md` |
| `shape@2026-05-11.md` | `material/guidance/foundations/shape@2026-05-11.md` |
| `shape.md` | `material/guidance/foundations/shape.md` |

### `material/implementation/` — 4 files (2 versioned + 2 stubs)

| File | Destination |
|---|---|
| `getting-started@2026-05-11.md` | `material/implementation/getting-started@2026-05-11.md` |
| `getting-started.md` | `material/implementation/getting-started.md` |
| `token-schema@2026-05-11.md` | `material/implementation/tokens/token-schema@2026-05-11.md` |
| `token-schema.md` | `material/implementation/tokens/token-schema.md` |

### `material/assets/tokens/` — 6 files (3 versioned + 3 stubs)

| File | Destination |
|---|---|
| `colors@2026-05-11.json` | `material/assets/tokens/colors@2026-05-11.json` |
| `colors.json` | `material/assets/tokens/colors.json` |
| `typography@2026-05-11.json` | `material/assets/tokens/typography@2026-05-11.json` |
| `typography.json` | `material/assets/tokens/typography.json` |
| `shape@2026-05-11.json` | `material/assets/tokens/shape@2026-05-11.json` |
| `shape.json` | `material/assets/tokens/shape.json` |

### `material/design-md/` — 2 files (1 versioned + 1 stub)

| File | Destination |
|---|---|
| `DESIGN@2026-05-11.md` | `material/design-md/DESIGN@2026-05-11.md` |
| `DESIGN.md` | `material/design-md/DESIGN.md` |

---

## Step 4 — Place the process reference document

| Your uploaded file | Destination |
|---|---|
| `META-PLAN.md` | `docs/META-PLAN.md` |

This is the only uploaded file that belongs in this repo. It describes the
development process (phases, task files, SESSION_LOG, AGENTS.md, opening/closing
prompts) that governs all Claude Code sessions here.

---

## Step 5 — Create root control files manually

These four files must exist at the root before any Claude Code session.

### `AGENTS.md`

```markdown
# AGENTS.md — Design System Knowledge Base

## What this repository is

A structured knowledge base of design system documentation from major open-source
design systems, with tooling to collect and maintain it, and a set of AI playbooks
for design system tasks. Read _meta/USAGE_GUIDE.md for how the KB is organized and
used. Read docs/META-PLAN.md for the development process governing this repo.

## Repository structure

_meta/          — Schema, maintenance procedures, usage guide, playbooks, index, changelog
[system]/       — One directory per design system (material/, carbon/, etc.)
  guidance/     — Human-facing design documentation (sourced from doc sites)
  implementation/ — Developer-facing technical docs (sourced from GitHub)
  assets/       — Raw token files (JSON, SCSS, CSS)
  design-md/    — Community-generated DESIGN.md files
tools/          — Scripts for scraping, processing, and validating KB content
  scrape/       — Firecrawl and Playwright scrapers
  validate/     — Frontmatter linting and stub verification
docs/           — Process documentation
tasks/          — Phase task files
logs/           — Archived session logs

## Architectural rules

1. Never overwrite existing content files. Always create a new versioned file.
2. Every versioned file must have a corresponding redirect stub at the unversioned path.
3. Every content file must have complete frontmatter per _meta/SCHEMA.md.
4. _meta/INDEX.md and _meta/CHANGELOG.md must be updated in every session that
   adds or modifies content.
5. Scraped content lands in raw-scrape/ (gitignored). It is processed into KB
   files as a separate step — never copy raw scrape output directly into the KB.
6. Tools live in tools/. KB content lives in system directories. Never mix them.

## Patterns established

(populated as sessions proceed)
```

### `SESSION_LOG.md`

```markdown
# SESSION_LOG.md

## Current State

**Phase:** 0 — Pre-scaffold
**Last completed task:** None — repository just initialized
**Next task:** Scaffold session (see docs/META-PLAN.md for the prompt)
**Blockers:** None
**Notes:** Material Design 3 content is present but its guidance layer is
incomplete — m3.material.io is a JS SPA that could not be fully fetched during
the chat session that produced the initial files. Treat material/ guidance files
as draft status. The first scraping task should target Material as its re-scrape
subject.

---

## Session log

(entries added after each session; archived to logs/phase-N.md at phase boundaries)
```

### `tasks/TEMPLATE.md`

```markdown
# Task Template

## Task [N.N] — [Title]

**Status:** not started
**Phase:** N
**Session log entry:** (link after completion)

### What this task implements

(one paragraph)

### Files created or modified

- path/to/file — what it does

### Acceptance criteria

- [ ] criterion (specific and verifiable)
- [ ] SESSION_LOG.md updated with this task's entry
- [ ] CHANGELOG.md updated if any KB content was added or changed
```

### `.gitignore`

```
node_modules/
dist/
.env
.env.local
coverage/
playwright-report/
.DS_Store
*.log
raw-scrape/
```

`raw-scrape/` is where Firecrawl and Playwright outputs land before processing.
Never commit it.

---

## Step 6 — Generate the Phase 0 task file

Before running any Claude Code session, generate `tasks/phase-0.md` in a regular
Claude chat session using the task generation prompt from `docs/META-PLAN.md`,
adapted to this project's context:

> "Read `docs/META-PLAN.md` — the section on generating task files before each
> phase. Read `tasks/TEMPLATE.md`. Read `AGENTS.md`.
>
> Generate `tasks/phase-0.md` for this repository. Phase 0 goal: scaffold the
> tools/ directory and complete a full, authoritative scrape of Material Design 3
> using Firecrawl, replacing the current draft material/ guidance content with
> content fetched directly from m3.material.io. Every task must have specific,
> verifiable acceptance criteria. Do not write any code."

Review and commit the task file before starting any Phase 0 sessions.

---

## Step 7 — Run the scaffold Claude Code session

Use the standard session-opening prompt from `docs/META-PLAN.md`, referencing
task 0.1 and phase 0. The scaffold session should:

1. Initialize `tools/package.json` with TypeScript, tsx, Firecrawl SDK,
   Playwright, gray-matter, and zod
2. Create `tools/tsconfig.json`
3. Create `tools/.env.example` with `FIRECRAWL_API_KEY=`
4. Create `tools/scrape/firecrawl-guidance.ts` — accepts a URL and system slug,
   crawls via Firecrawl, writes raw output to `raw-scrape/[slug]/[date]/`
5. Create `tools/validate/lint-frontmatter.ts` — validates .md files in a system
   directory against the schema in `_meta/SCHEMA.md`
6. Run the scraper against `https://m3.material.io/styles` and report results
7. Update `SESSION_LOG.md`

---

## Final directory tree after setup

```
design-system-kb/
├── AGENTS.md
├── SESSION_LOG.md
├── .gitignore
├── _meta/
│   ├── SCHEMA.md
│   ├── MAINTENANCE.md
│   ├── USAGE_GUIDE.md
│   ├── TASK_PLAYBOOKS.md
│   ├── INDEX.md
│   ├── CHANGELOG.md
│   └── exemplars/
│       ├── semantic-token-systems/
│       ├── design-md-files/
│       ├── token-migrations/
│       └── component-specs/
├── material/
│   ├── _index.md
│   ├── guidance/foundations/    (14 files — 7 versioned + 7 stubs) [DRAFT]
│   ├── implementation/          (4 files — 2 versioned + 2 stubs)
│   ├── assets/tokens/           (6 files — 3 versioned + 3 stubs)
│   └── design-md/               (2 files — 1 versioned + 1 stub)
├── tools/                       (created in scaffold session)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── scrape/
│   │   └── firecrawl-guidance.ts
│   └── validate/
│       └── lint-frontmatter.ts
├── tasks/
│   ├── TEMPLATE.md
│   └── phase-0.md
├── logs/
└── docs/
    └── META-PLAN.md
```

---

## Note on material/ content status

The Material Design 3 files are structurally correct — proper frontmatter,
versioning, stubs, and index entries — but the guidance layer is incomplete
because m3.material.io renders via JavaScript and could not be fully fetched
in this chat session. The first scraping task will re-scrape it properly. When
that happens, follow Procedure B in `_meta/MAINTENANCE.md`: new versioned files,
existing files marked legacy, stubs updated. Nothing gets deleted.
