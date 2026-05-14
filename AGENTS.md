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
  reference/    — Source documentation from external systems (Phase 6 restructure target)
    design-systems/ — One directory per design system (material/, carbon/, atlassian/, etc.)
      [system]/     — System directory; each contains:
        guidance/       — Human-facing design documentation (sourced from doc sites)
        implementation/ — Developer-facing technical docs (sourced from GitHub)
        assets/         — Raw token files (JSON, SCSS, CSS)
        design-md/      — Community-generated DESIGN.md files
    standards/    — Normative standards (WCAG, ARIA APG, APCA, DESIGN.md spec)
    foundations/  — Scientific underpinnings: perceptual color models, typography science
  principles/   — Cross-system synthesis: distilled wisdom for building new design systems (Phase 6+)
                  Organized by concern: color/, typography/, tokens/, accessibility/, spacing/, ai/
                  NOT "what system X does" — synthesis of what good looks like across all of them
tools/          — Scripts for scraping, processing, and validating KB content
  scrape/       — Firecrawl and Playwright scrapers
  validate/     — Frontmatter linting and stub verification
docs/           — Process documentation
tasks/          — Phase task files
logs/           — Archived session logs
```

**Current state vs. planned:** Until Phase 6 Task 6.0 completes the migration, `kb/design-systems/`, `kb/standards/`, and `kb/foundations/` remain at the top level. Do not create content under `kb/reference/` until that migration runs. New principles content goes in `kb/principles/` once Task 6.0 creates the directory.

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

## KB category definitions

The KB has three top-level categories. The full definitions are in `_meta/SCHEMA.md` Section 0 and must be consulted when placing new content.

- **`design-systems/`** — Documentation for specific named design systems (Material, Carbon, Atlassian, Primer, etc.). Source: each system's own documentation site and official repositories.
- **`standards/`** — Authoritative format specifications and normative standards: WCAG, ARIA APG, APCA, DESIGN.md spec. Content you conform to, not interpret. Source: the canonical documentation site for each standard.
- **`foundations/`** — Scientific and theoretical underpinnings: perceptual color models, typography science, spacing theory. The *why* behind design decisions, applicable across all systems.

**Before creating any KB file, identify which category it belongs in and confirm the primary source URL is from the canonical authority for that category.**

---

## KB content intake — mandatory process

**This section defines the required process for adding any content to the KB. Deviating from it without explicit user approval is not permitted.**

### Step 1: Identify the primary source

Every KB entry must trace to an official primary source — the design system's own documentation site, official GitHub repository, or official published package. The correct source URL must be confirmed before any content is written.

### Step 1b: Verify source licensing before writing any KB content

Before scraping or writing, confirm the source falls into one of the three permitted tiers. Document the tier in the system's `_index.md` Source Map.

**Tier 1 — Explicitly licensed (preferred):**
Creative Commons (CC-BY, CC-BY-SA, CC0), MIT, Apache 2.0, W3C Document License, or other OSI-approved open license. Use freely; record the license name in the Source Map.

**Tier 2 — Official public documentation, no explicit license:**
Documentation published openly by the design system's own maintainers (their official doc site or official GitHub repo), where the intent to inform developers and designers is clear, but no Creative Commons or open source license is stated. Permitted for synthesis (not verbatim reproduction); record as "public, no explicit license" in the Source Map. This covers most major design systems.

**Tier 3 — Public research or articles, no explicit license:**
Publicly accessible scientific articles, personal research posts, or blog content where the underlying research is sound and the synthesis adds distinct value. Permitted only for synthesis with full attribution. Record as "synthesized, no explicit license — pending license audit" in the Source Map. Flag the entry for the next license compliance audit task.

**Not permitted:**
- Paywalled content
- Content explicitly marked "no commercial use," "no reproduction," or similar restrictions
- Content from unofficial third-party aggregators — always prefer the canonical source

If a source's license status cannot be determined and it does not fit Tier 2, stop and report to the user before proceeding. Do not assume permissiveness.

### Step 2: Attempt Firecrawl first

Run `npm run scrape -- --url <url> --slug <slug>` from the `tools/` directory. Firecrawl handles JS-rendered SPAs. If Firecrawl returns a near-empty result (just a page title, under ~80 lines from a content-rich page), try with `--wait 2000` before declaring failure.

### Step 3: If Firecrawl fails, try GitHub raw or npm CDN

For design systems with GitHub-hosted MDX docs: fetch raw content via `raw.githubusercontent.com`. For token files: use the jsDelivr CDN (`cdn.jsdelivr.net/npm/<package>/`). Both are acceptable fallbacks to Firecrawl as long as they point to the official source repository or package.

### Step 4: If all prepared tools fail — STOP and report

If Firecrawl, GitHub raw, and npm CDN are all ineffective against the official primary source: **stop and report the failure to the user.** Do not proceed. You may additionally report the existence of secondary or community sources as options for the user to vet — but do not use them without explicit user approval. Never decide autonomously to fall back on unofficial, community-generated, or reconstructed content.

**The failure report must include:**
- What primary source was attempted
- What tools were tried and what each returned
- Any secondary sources found, with their nature clearly identified (community, unofficial, reconstructed, etc.)

---

## Patterns established

### Foundations and standards stubs use a flat directory structure
Unlike design-systems entries (which have `guidance/`, `implementation/`, `assets/` subdirectories), foundations and standards stubs live directly in the category subdirectory — e.g. `kb/foundations/color/perceptual-models.md`, not `kb/foundations/color/guidance/perceptual-models.md`. The app's stub listing logic detects single-segment paths (`parts.length === 1`) and groups them under a `'content'` key for sidebar display. When adding foundations or standards content, do not introduce type subdirectories unless there is a genuine content-type distinction to make.

### KB landing page counts all categories
`src/app/kb/page.tsx` uses `listSystems(category)` to count entries for all three categories. Any time a new category or sub-entry is added, verify that the page shows a non-zero count by running `npm run build` and checking the rendered output. The count drives whether the category card shows "X entries" vs "Coming soon".

### Cross-system See Also links use last-segment matching
The content page (`src/app/kb/[category]/[slug]/[...path]/page.tsx`) finds cross-system links by matching the last path segment of the current stub against all stubs in all other systems. This works well for consistently-named topics (`color-system`, `typography`, `button`) but produces no matches when naming differs across systems (`color` vs `colors`). No manual tagging or registry is needed — the match is purely structural.

### Playbook stage pages at `/playbooks/stage/[n]`
The playbook index (`/playbooks`) shows stage cards linking to `/playbooks/stage/[n]`, which lists all plays for that stage. Individual play pages are at `/playbooks/[slug]`. Stage descriptions are in `STAGE_DESCRIPTIONS` in `src/lib/playbooks.ts`. When adding a new stage, add its label to `STAGE_LABELS` and its description to `STAGE_DESCRIPTIONS`.

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

### culori v4 ESM interop in tsx generation scripts
culori v4 is ESM-only — it has no CommonJS bundle. tsx scripts in a standard (CJS) package cannot import culori via `import { oklch } from 'culori'`. The fix: use `createRequire(import.meta.url)` to load culori's CJS bundle directly from node_modules, then destructure from the result.

```typescript
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const culori = require('culori') as typeof import('culori')
const { oklch, formatHex, wcagContrast, toGamut } = culori
```

This applies to any ESM-only npm package used in a build-time script that runs under tsx. The `src/lib/palette.ts` file itself uses normal `import` (Next.js handles ESM correctly at build time) — this workaround is only needed in standalone `tools/` scripts.

### `toGamut` TypeScript signature requires two arguments
culori's `toGamut` function requires both a destination mode and an intermediate color space, even when the intermediate seems implied. TypeScript will reject a single argument. Always call it curried:

```typescript
const mapToGamut = toGamut('rgb', 'oklch')
// then: mapToGamut({ mode: 'oklch', l, c, h })
```

Using `toGamut('rgb', 'oklch')` (not just `'rgb'`) also triggers culori's gamut-finding logic, which binary-searches for the maximum in-gamut chroma. This correctly handles vivid seeds whose channels exceed sRGB at high lightness — manual `inGamut` checks would reject valid candidates.

### Campaign definition format in `_meta/CAMPAIGNS.md`
Campaigns are defined in `_meta/CAMPAIGNS.md` and parsed by `src/lib/campaigns.ts`. Format:

```markdown
## slug — Title

**Steps:** play-slug-1, play-slug-2, play-slug-3

**Description:** One-sentence campaign description.
```

`loadCampaign(slug)` resolves each step's play body from `loadPlaybooks()` at build time. Campaign pages are fully SSG — `generateStaticParams` generates all `{slug, step}` combinations. No backend needed.

### sessionStorage namespacing for campaign step state
Campaign step variable values are persisted to sessionStorage using the key pattern:
```
campaign:{campaignSlug}:step:{stepNumber}:{varName}
```
This allows multiple campaigns to run concurrently without key collisions. State is restored on component mount from sessionStorage; written on every input change. sessionStorage survives page navigation within a tab but is cleared when the tab closes — suitable for single-session workflows like campaign runs.

### localStorage-backed form pre-fill for contextual variables
When a play variable has a meaningful persistent default (e.g. `color_mode` for `generate-color-scheme`), store it in localStorage and pre-fill the form field on mount. Pattern:
1. Export a `STORAGE_KEY` constant from the selector component
2. In `PlayForm` (or `CampaignStep`), read from localStorage in `useEffect` and call `setValues`
3. When the user changes the selector, write back to localStorage immediately
This makes contextual state cross-session and cross-play without URL coupling.

### `mounted` state guard for sessionStorage/localStorage in client components
Next.js pre-renders `'use client'` components on the server during `next build`. `sessionStorage` and `localStorage` are undefined on the server — accessing them without a guard causes a `ReferenceError` that fails the build.

Pattern:
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
// Only access sessionStorage/localStorage when mounted === true
```

For `useEffect` calls that restore from storage, the guard is implicit — `useEffect` never runs on the server. For render-time access (e.g. in JSX), check `mounted` before calling.

### CC BY-NC synthesis: paraphrase only, attribute fully
Content under Creative Commons Attribution-NonCommercial (CC BY-NC) licenses may be synthesized for a knowledge base with attribution, but the NC clause means the content cannot be incorporated into a commercial product verbatim. Rules for CC BY-NC sources:
- Write all content in your own words — do not reproduce sentences verbatim
- Attribute the source by URL and license in the versioned file's `derived_from` field and in the Source Map
- Note the `license: CC BY-NC 4.0` in frontmatter
- Do not copy prose passages, only synthesize ideas and technical guidance

### Source citations are mandatory in all synthesis documents
Every KB content file must cite its sources in frontmatter so the app can render them as a linked sidebar. Use the `sources` field (preferred for new docs):

```yaml
# Synthesis doc with external + internal sources:
sources:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
  - kb/reference/foundations/typography/type-scales     # internal KB path

# Reference doc with a single primary URL (legacy pattern — still valid):
source_url: https://carbondesignsystem.com/guidelines/color/overview/
derived_from:
  - https://practicaltypography.com/line-spacing.html
```

Rules:
- `sources` accepts both external URLs and internal KB paths — the sidebar handles the difference
- Do NOT include Markdown hyperlinks `[text](url)` in the document body for citations — the sidebar handles linking; hyperlinks in the body would be actionable for LLMs consuming the raw file
- Plain text domain references in prose are fine: "source: practicaltypography.com"
- Principles (synthesis) documents must list the internal KB paths they synthesize across

### Static tool data in `public/` for build-time generation
For tools that need large pre-computed data (e.g. 22-palette × 19-stop library), generate the JSON at build time and commit it to `public/` as a static file. The generation script lives in `tools/` and runs via a npm script (`npm run palettes`). The file is served as a static asset — no API call needed at runtime. Re-run the script and commit the result whenever seeds or the algorithm change.

### GitHub raw URL sourcing for fully JS-rendered doc sites
When a design system's documentation site is a fully JS-rendered SPA (Firecrawl returns 0 pages), fetch MDX/markdown source files directly from the GitHub repository via raw.githubusercontent.com. This is the correct pattern for Primer (primer.style → `primer/design` MDX) and similar systems. The MDX sources are typically cleaner and more complete than any scraped output would be. No Playwright needed — the raw file content is immediately usable as KB guidance content with minimal transformation.

### `content_type` valid values
The frontmatter linter (`tools/validate/lint-frontmatter.ts`) accepts only four `content_type` values: `guidance`, `implementation`, `asset`, `design-md`. The value `component` is not valid even for component documentation files — those use `content_type: guidance` and live in `guidance/components/`. Always verify against this list before writing new KB files.

### `{{variable_name}}` interactive playbook fields
To add a user-fillable field to a play, include `{{variable_name}}` in the play body text. The `PlayForm` client component in `src/components/playbooks/PlayForm.tsx` detects all `{{...}}` tokens (excluding `{{sistema_url}}`), renders a labeled textarea per variable, and substitutes filled values at copy time. Unfilled variables are preserved as `{{variable_name}}` in the copied text — not silently dropped. Variable labels are auto-generated from the snake_case name (e.g. `{{accent_color}}` → "Accent Color"). No registration or config is needed — detection is fully automatic at render time.

### Exemplar file format
Exemplar output files live in `_meta/exemplars/[category]/[filename].md`. Required frontmatter fields: `play_slug` (must exactly match the play's slug), `stage` (integer), `created` (ISO date), `quality_notes` (string). The body is the actual example output. `loadExemplar(playSlug)` in `src/lib/exemplars.ts` walks the directory and matches by `play_slug` — not by filename. A play page automatically renders a collapsible `<details>` exemplar section if `loadExemplar` returns a non-null result.

### Storybook MDX component files often lack prose content
Several `*.mdx` files in Carbon's React component source (`packages/react/src/components/*/`) are Storybook template shells — they delegate documentation to `<ArgTypes />` and external links rather than containing prose. Fetching these files returns little usable KB content. For Carbon component documentation, prefer carbondesignsystem.com (Firecrawl with `--wait 2000`) or usage.md files in the same directory, over the primary MDX file.

### Play testing can run in-session, not just against a live Vercel URL
Earlier guidance stated that play testing requires the app deployed to a live URL. In practice, plays can be tested end-to-end within a Claude session: the agent reads the play prompt from `_meta/TASK_PLAYBOOKS.md`, substitutes `{{sistema_url}}` with the actual running URL (localhost or Vercel preview), and executes the play. The output is evaluated against the same 4 criteria (format match, internal consistency, no reference-system-specific copy, no unresolved variables) and saved to `_meta/exemplars/`. This approach is valid and does not require a production deployment to be meaningful.

### `kb/principles/` content is synthesis, not documentation
Files in `kb/principles/` are not documentation of what any one design system does. They are original synthesis documents that distill collective wisdom from `kb/reference/` content (design systems, standards, foundations) into system-independent guidance for building new design systems. The key distinctions: (1) never attribute a pattern to a specific system ("Material does X") — state the principle directly; (2) document the *decision framework* (when approach A vs. B is appropriate), not just the approaches; (3) non-negotiable constraints (from WCAG, APCA, perceptual science) must be clearly distinguished from recommended practices. Plays reference `kb/principles/` for craft knowledge and a project's own living brief for project-state knowledge — never the reverse.

### Transparent URL migration via `getCategoryDir()`
When reorganizing the KB filesystem (e.g. moving `kb/design-systems/` to `kb/reference/design-systems/`), keep all existing URLs unchanged by adding a `getCategoryDir(category)` function to `src/lib/kb.ts` that maps logical category names to their filesystem subpath. `reference` categories (`design-systems`, `standards`, `foundations`) resolve to `kb/reference/[category]/`; `principles` stays flat at `kb/principles/`. URLs remain `/kb/[category]/[slug]/...` with no `reference` segment. Add `resolveKBPath(path)` alongside to handle stub `points_to` path translation (stubs written before the migration may not include `reference/` — resolve transparently). No redirects or URL changes needed; the migration is entirely in the filesystem resolution layer.

### Living brief as first-class project artifact
`_meta/LIVING_BRIEF_SPEC.md` defines the living brief: a per-project state document that plays read at session start and append to at session end. It is NOT DESIGN.md, not a changelog, not a README, not a design spec, not a task list. Required: 5 sections (project identity, key decisions by concern area, current state inventory, open questions, decision log), 150-line max, root-level placement in the project directory (not in `_meta/`). Template at `_meta/templates/LIVING_BRIEF.md`. When writing new campaign or stewardship plays that modify system state, include: "1. Read the living brief from disk. 2. [Do the work.] 3. Append '[date] — [what you decided]' to the Decision Log section." The living brief and DESIGN.md are parallel but independent: DESIGN.md is outward-facing spec for system consumers; living brief is inward-facing state document for system builders.

### Stage 6 — Stewardship plays
When adding plays for ongoing system maintenance (Stage 6), the six canonical plays forming the stewardship lifecycle are: `session-start` (orient in living brief before beginning work), `add-component` (spec → implement → update living brief), `audit-token-coverage` (scan for hardcoded values, report by severity), `accessibility-audit` (evaluate against `kb/principles/accessibility/floor`), `design-system-retrospective` (drift analysis, undocumented additions, DESIGN.md update check), `plan-next-iteration` (maturity assessment, prioritized task list). When adding Stage 6 to the app: update Play.stage union type in `src/lib/types.ts`; add label to `STAGE_LABELS` and description to `STAGE_DESCRIPTIONS` in `src/lib/playbooks.ts`.

### License audit methodology for Tier 3 sources
When a source is Tier 3 (public but no explicit license) and the content is mathematical or scientific: (1) mathematical ratios, formulas, and color space properties are not copyrightable — they are facts; (2) if the specific claims are also documented in normative sources (WCAG, Bringhurst, published research), any copyright risk is further reduced; (3) synthesis is acceptable if it describes mathematical structures and conclusions, not the source's prose or rhetorical framing. Record formal audit decisions in `_meta/LICENSE_AUDIT.md` with three fields per source: license status, content type, conclusion. Pending sources awaiting crawl and evaluation go in `_meta/PENDING_SOURCES.md`. Non-blocking concerns (supplement citations, evaluate alternatives) stay in those files — do not block KB content on them.

### Playbook v3.0 — system-agnostic play structure
All campaign and stewardship plays reference `kb/principles/` synthesis URLs exclusively — never individual design system KB URLs. The 4-step protocol that every campaign play follows: (1) read the living brief from disk or prior session artifacts; (2) fetch the relevant synthesis URLs listed in the play; (3) execute the task; (4) append key decisions to the living brief decision log. The `positioning-brief` play (Stage 1) runs first in any bootstrap campaign and seeds the living brief. Zero M3/Material/system-specific terminology appears in play body text. When revising plays, grep for design system names and URLs to confirm zero references remain.

### OKLCH palette chroma taper: gamut-relative, not absolute
The OKLCH palette generator in `src/lib/palette.ts` uses a sine-curve chroma scaling formula. A critical correctness property: the chroma taper at light and dark extremes must be scaled relative to the seed's maximum in-gamut chroma, not an absolute value. An absolute taper produces perceptually washed-out stops for high-chroma hues (greens, yellows) whose gamut-safe chroma ceiling is much higher than blues or reds. The taper formula: `C = seedChroma × sin(π × L) × taperStrength`, where `taperStrength ≤ 0.5` and `seedChroma` is the maximum chroma value achievable for the seed hue at L=0.5. When changing the algorithm, regenerate `public/palettes/library.json` with `npm run palettes` and visually inspect greens and yellows first — they are most sensitive to chroma miscalibration.

### `_meta/BACKLOG.md` for deferred play improvements
Items discovered during dogfooding or piloting that don't block the current phase but need revisiting go in `_meta/BACKLOG.md`. Format: category heading (e.g. "## Play design"), item description, discovery context, and date. Review at the start of each phase. Do not let BACKLOG grow into a second task file — it holds deferred improvements only, not features or structural work.

### Style Dictionary v5 token pipeline
The Sistema token pipeline is at `style-dictionary.config.mjs`. Architecture: `tokens/primitive/` (reference palette, not output) + `tokens/semantic/` (source, output as CSS + ESM). Custom formatters: `css/themed` (splits tokens into `:root {}` and `[data-theme="dark"] {}` based on `color-dark-*` naming) and `javascript/esm` (named camelCase exports). Custom transform group `css/no-rem` skips px→rem conversion. Dark token naming convention: `color.dark-surface` in JSON → `--color-surface` in `[data-theme="dark"]` block (the formatter strips the `dark-` prefix). Filter `token => token.path[0] !== 'palette'` prevents primitive palette tokens from appearing in output. Run `npm run tokens` to rebuild `src/styles/tokens/generated.css` and `src/styles/tokens/tokens.mjs`.

### `window.location.origin` hydration pattern
Accessing `window.location.origin` during render causes a hydration mismatch: the server returns `''`, the client returns the actual origin. Fix: never call it inline. Use `const [origin, setOrigin] = useState('')` and `setOrigin(window.location.origin)` inside a `useEffect`. Reference the state variable in render. This applies to any browser-only global — `window`, `document`, `navigator` — accessed in a client component that Next.js also pre-renders on the server.

### Dogfooding: running the bootstrap campaign against Sistema itself
The bootstrap campaign was run end-to-end against the Sistema application (2026-05-14). The token pipeline produces working CSS custom properties, Tailwind config extensions, and next/font integration. Key finding: play outputs are structurally correct but have not been evaluated against the quality criterion — do they produce effective, efficient, accessible, usable design system foundations? Structural correctness and output quality are separate concerns. Always test plays against both.
