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
kb/             — All knowledge base content
  design-systems/ — One directory per design system (material/, carbon/, atlassian/, etc.)
    [system]/     — System directory; each contains:
      guidance/       — Human-facing design documentation (sourced from doc sites)
      implementation/ — Developer-facing technical docs (sourced from GitHub)
      assets/         — Raw token files (JSON, SCSS, CSS)
      design-md/      — Community-generated DESIGN.md files
  standards/    — Normative standards (WCAG, ARIA APG, APCA) — planned
  foundations/  — Color science, typography, spacing theory — planned
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

### Same-date versioning conflict: update in place
When a new versioned file would have the same filename as an existing file (because the retrieval date matches the existing file's date), update the existing file's content in place rather than creating a naming conflict. This is acceptable when the content is substantively improved. Document the in-place update explicitly in the session log entry. Do not use this pattern to silently fix minor errors without logging the change.

### Navigation chrome stripping in Firecrawl output
Firecrawl output from documentation SPAs consistently contains navigation chrome before the first H1 (a list of navigation links, breadcrumbs, and icon labels) and a "Previous / Next" footer section at the end. When processing raw scrape output into KB files: strip all content before the first H1, and strip from the first `[arrow_left_alt Previous...]` or equivalent icon-text footer marker onward. Never include navigation link lists in KB files. A file under ~80 lines from a content-rich page is a likely JS-render shell — flag it rather than processing.

### Playbook play format
Plays in `_meta/TASK_PLAYBOOKS.md` follow this format:
```
## slug — Title

**Stage:** N
**Tags:** tag1, tag2

[body — the actual copyable prompt text]
```
Each play is separated by `---`. Slugs are kebab-case and stable (URL-safe). Stage (1–5) determines presentation order in the UI. Body text contains `{{sistema_url}}` wherever the deployed app URL is needed — the `CopyButton` client component substitutes `window.location.origin` at copy time, so no URL is ever hardcoded in play content.

### `{{sistema_url}}` template substitution
Play prompt bodies use `{{sistema_url}}` as a placeholder for the deployed app origin. `CopyButton` in `src/components/playbooks/CopyButton.tsx` calls `text.replace(/\{\{sistema_url\}\}/g, window.location.origin)` before writing to the clipboard. This means plays work correctly in any environment (local dev, Vercel preview, production) without any code change. Never hardcode a domain in play body text.

### Play testing approach
Validate play quality by running them end-to-end: copy the play from the deployed app (or local dev server), paste into a coding agent (Claude Code, Cursor, etc.) in a scratch repository, and inspect the quality of the generated output. This requires the app to be accessible at a live URL — play testing should happen after Vercel deployment, not before. Document findings in `SESSION_LOG.md` and update play body text based on observed output quality. Play testing is a Phase 2 activity.

### GitHub material-web SCSS token file delegation
The top-level SCSS files in material-web's `tokens/` directory (e.g. `_md-sys-color.scss`, `_md-sys-typescale.scss`) use `@forward` to delegate to versioned modules in `tokens/versions/[version]/`. Fetching the top-level file returns no actual token values. To read specific values: browse the `tokens/versions/` directory to identify the current version (e.g. `v0_192`), then fetch the specific file within that directory (e.g. `_md-ref-palette.scss` for reference colors, `_md-sys-typescale.scss` for typescale values). File names use underscore prefix — paths without underscore (e.g. `md-sys-color.scss`) will 404.

### JSON asset stub files require YAML frontmatter, not plain JSON
Asset token stubs (`.json` files in `assets/tokens/`) must use YAML frontmatter format — not plain JSON objects. `gray-matter` cannot parse plain JSON as frontmatter: it returns `data: {}`, which causes the `stub.type !== 'stub'` check in `resolveStub` to throw, resulting in a 404. Always write `.json` stub files with the standard YAML header:
```
---
type: stub
points_to: colors@2026-05-12.json
updated: 2026-05-12
---
This file is a redirect stub. The current version of this content is:
[colors@2026-05-12.json](./colors@2026-05-12.json)
```
This format is identical to `.md` stubs — the file extension does not change the frontmatter syntax.

### Atlassian token sourcing: Bitbucket and CDN, not GitHub
Atlassian's design system source is on Bitbucket (`bitbucket.org/atlassian/atlassian-frontend-mirror`), not GitHub. All GitHub URL attempts return 404. For published token values, use the jsDelivr CDN: `cdn.jsdelivr.net/npm/@atlaskit/tokens@<version>/dist/cjs/artifacts/token-default-values.js`. Check `cdn.jsdelivr.net/npm/@atlaskit/tokens/` first to identify the current package version and browse available files.

### Bundle URLs for multi-file play context
When a play needs an agent to read more than one KB file from the same system, use a single `/bundle/` URL rather than listing multiple `/raw/` URLs. One fetch call, not several — reduces the risk of an agent skipping reference material.

URL format: `{{sistema_url}}/bundle/[category]/[slug]?topics=[comma-separated-paths]`

Example for a play that needs color and typography context:
```
{{sistema_url}}/bundle/design-systems/material?topics=guidance/foundations/color-system,guidance/foundations/typography,design-md/DESIGN
```

Without `?topics=`, the bundle returns all guidance files + DESIGN.md for the system — useful for plays that need full system context (e.g. `generate-design-md`). Topic paths are the same path segments used in `/kb/` and `/raw/` URLs, without the `.md` extension. Missing topics are skipped with a comment at the top of the response; no 500 errors.

### Zero-page Firecrawl result: fall back to npm CDN
When Firecrawl returns 0 pages from a design system documentation page (fully JS-rendered SPA with no crawlable content), source token values directly from the npm CDN package. Use jsDelivr (`cdn.jsdelivr.net/npm/<package>@<version>/`) to browse available package files and fetch the relevant artifact. This is the standard fallback for any design system that publishes a `@<org>/tokens` package — the CDN exposes the compiled output regardless of whether the doc site renders server-side.
