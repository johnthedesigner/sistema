# AGENTS.md — Sistema

## What this repository is

Sistema is a two-layer product: a structured knowledge base (KB) of design system
documentation from major open-source design systems, and a Next.js web application
that makes that KB discoverable and usable. Read `docs/META-PLAN.md` for the full
project scope, development phases, and session management process.

## Repository structure

```
src/            — Next.js app source (App Router, components, lib utilities)
public/         — Static assets for the app
_meta/          — KB schema, maintenance procedures, usage guide, playbooks, index, changelog
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

## Architectural rules — Knowledge Base

1. Never overwrite existing content files. Always create a new versioned file.
2. Every versioned file must have a corresponding redirect stub at the unversioned path.
3. Every content file must have complete frontmatter per `_meta/SCHEMA.md`.
4. `_meta/INDEX.md` and `_meta/CHANGELOG.md` must be updated in every session that
   adds or modifies content.
5. Scraped content lands in `raw-scrape/` (gitignored). It is processed into KB
   files as a separate step — never copy raw scrape output directly into the KB.
6. Tools live in `tools/` with their own `package.json`. KB content lives in system
   directories. App source lives in `src/`. Never mix them.

## Architectural rules — App

7. The app reads KB content at build time via `src/lib/kb.ts`. No runtime filesystem
   access to KB files.
8. KB content pages use the stub system for URL routing — always follow `points_to`
   to the current versioned file; never hardcode versioned filenames in app routes.
9. Playbook prompt templates that reference KB URLs must use the production domain.
   Never hardcode localhost or preview URLs in prompt copy text.
10. `next build` must complete without errors before any app task is marked complete.

## Patterns established

### Scraping is agent-executable
The agent runs scrape commands directly via Bash — the human does not need to run them. When a scraping task begins, the agent: (1) identifies the target URLs, (2) runs `npx tsx tools/scrape/firecrawl-guidance.ts --url <url> --slug <slug>` from the repo root, (3) inspects raw output for content quality and coverage gaps, (4) decides autonomously whether additional targeted passes are needed and runs them without waiting for human direction. The agent documents all passes and findings in `SESSION_LOG.md`.

### Firecrawl concurrency: always use `--limit 25` or lower
Firecrawl's free/lower tiers have a browser concurrency limit. A single large crawl with `--limit 200` will trigger it. Rules:
- Default `--limit` is 25 — never exceed this without explicit reason
- Scrape subsections separately rather than one large root crawl (e.g. `m3.material.io/styles/color` and `m3.material.io/styles/typography` as separate calls, not `m3.material.io/styles` with a high limit)
- Wait at least 60 seconds between sequential scrape calls in the same session
- JS-heavy pages benefit from `--wait 2000` (2 second render wait); use for SPAs like m3.material.io

### JS-rendered tables require asset files
Several M3 documentation pages render their token tables entirely in JavaScript — Firecrawl captures the shape names or role names but not the actual values. For these pages, the actual token values must come from the JSON asset files sourced from GitHub. Do not attempt to infer or estimate values from page labels.
