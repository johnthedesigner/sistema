# AGENTS.md — Design System Knowledge Base

## What this repository is

A structured knowledge base of design system documentation from major open-source
design systems, with tooling to collect and maintain it, and a set of AI playbooks
for design system tasks. Read `_meta/USAGE_GUIDE.md` for how the KB is organized
and used. Read `docs/META-PLAN.md` for the development process governing this repo.

## Repository structure

```
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
```

## Architectural rules

1. Never overwrite existing content files. Always create a new versioned file.
2. Every versioned file must have a corresponding redirect stub at the unversioned path.
3. Every content file must have complete frontmatter per `_meta/SCHEMA.md`.
4. `_meta/INDEX.md` and `_meta/CHANGELOG.md` must be updated in every session that
   adds or modifies content.
5. Scraped content lands in `raw-scrape/` (gitignored). It is processed into KB
   files as a separate step — never copy raw scrape output directly into the KB.
6. Tools live in `tools/`. KB content lives in system directories. Never mix them.

## Patterns established

(populated as sessions proceed)
