# AGENTS.md — Sistema

> **v2 overhaul in progress (branch `v2`).** Start every session with `SESSION_LOG.md` "Current State", then `docs/v2/ROADMAP.md` and the current `tasks/v2/phase-N.md`. The plan is `docs/v2/SISTEMA_PLAN.md`, amended by `docs/v2/capability-model.md` and `docs/v2/PLAN_CORRECTIONS.md`. This file is updated at the end of each v2 phase (last: V4.5).

## What this repository is

Sistema guides an AI coding agent through building a design system in a person's own repository, with the person's approval at each stage. It has two parts:

- **Content** (`content/`): plays, workflows, rules, opinions, guides, file format pages, and the source list. These are Sistema's own material.
- **The site** (`src/`): a Next.js app that renders the content for people and, for agents, in three ways: as plain text under `/raw` (paste-in prompts), through the MCP server at `/mcp`, and as Agent Skills at `/skills/<name>.zip`. It also hosts the palette, contrast, type scale, specimen, token validator, and dark mode tools and their APIs.

Behind both sits **internal reference material** (`reference/`): working notes on the design systems, standards, research, and agent skills Sistema learned from. It is used to write guides. It is never routed or presented as Sistema content.

## Repository structure

```
content/              Sistema's content (the source of truth for the site and agents)
  plays/<topic>/      One play per file. id is <topic>.<name>
  workflows/          start, patterns, session
  rules/<topic>.yaml  The rules registry
  opinions/           Published defaults, grouped (method, process, structure, quality-floor, boundary)
  guides/<topic>/     Guides with addressable sections; id is guide.<topic>.<name>
  files/              Pages on file formats Sistema reads and writes (DESIGN.md); id is file.<name>
  sources.yaml        Every source Sistema draws on, with tier and licence
reference/            Internal reference notes (never routed). See reference/README.md
  design-systems/ standards/ foundations/ skills/
src/
  lib/content/        Schemas (schema.ts), parsers (parse.ts), loader (load.ts), renderers (render*.ts), site helpers (site.ts)
  app/                Pages and /raw routes; tools and /api; the MCP server (mcp/) and skill downloads (skills/)
  lib/mcp/            The MCP server's content tools (search, read, next_step)
  components/site/    Shared page components (ui.tsx, Markdown.tsx, Credits.tsx)
tools/                Scripts with their own package.json
  scrape/             Firecrawl scraper (output to raw-scrape/, gitignored)
  validate/content/   Content checker (rules.ts, model-rules.ts, cli.ts) and the uses lookup (uses.ts)
docs/v2/              Plan, roadmap, decisions, reviews, retros
tasks/v2/             Phase task files
_meta/                BACKLOG.md, LICENSE_AUDIT.md, PENDING_SOURCES.md (older v1 files remain for history)
logs/                 Archived session logs
```

The site follows Sistema itself: `sistema.json`, DECISIONS.md, and DESIGN.md at the root describe its design system (V3.8). `LIVING_BRIEF.md` is kept for reference only.

## The content model

- **Play:** one task with a contract in its front matter: `requires`, `produces`, `tools`, `knowledge` (guide section anchors), `rules`, `evidence`, `overrides`, `milestone`, `kind`. The body is the procedure. A play cites guides and rules. It never restates them.
- **Workflow:** an ordered `sequence` of plays and approval gates (`start`, `patterns`), or `routes` behind a starting play (`session`). Numbering and step lists are generated, so never type them by hand.
- **Rule:** one checkable requirement in `content/rules/`. Values that depend on the accessibility standard sit in `parameters`, keyed by standard and level. Prose cites the rule ID instead of repeating the value.
- **Opinion:** a default Sistema holds, with why, when you'd choose otherwise, and how to override. `method` opinions can't be overridden.
- **Guide:** Sistema's synthesis on a topic. `sources` are credits (`{ source: <id>, url: <original page> }`) and `related` lists other guides. Sections are addressed as `guide.<topic>.<name>#<heading-slug>`.
- **File format page:** how Sistema uses a file format, stating which parts follow an external format.
- **Project state** (in the user's repo): `sistema.json` (schema at `/raw/schema/sistema.json`), DECISIONS.md, DESIGN.md, and a marked Sistema section in the agent instructions file.

Sistema-authored content is not versioned (decision D4). Edit files in place and set `last_reviewed` when you've reviewed the whole item, not when you've changed one line.

## Rules for content

First, read `docs/v2/content-principles.md`: short and plain, the three-product test, how strong each claim is, no Sistema history or made-up jargon in user-facing content, and Relay only in worked examples. The content check flags the obvious slips (`content.internal-history`).

1. **Run `npm run uses -- <id>` before changing anything structural** (renaming an ID, removing a section heading, changing a contract). It lists every play, workflow, rule, opinion, guide, and text mention that refers to it.
2. **Never restate a rule value** (contrast ratios, target sizes, line-height or text-size minimums). Plays may not quote them at all. Guides may quote one only on a line that names its standard. The build enforces this.
3. **Agent-facing URLs** are written `{{sistema_url}}/raw/...`. Never write a bare `/raw/` or `/api/` path, and never hardcode a domain. Every `/raw` link must be a route the site serves.
4. **No literal dates in plays.** Plays tell the agent to use today's date.
5. **Credit sources by name and original page.** Never cite `kb/` or `reference/` paths in content. When a guide describes an approach, name the systems that use it, rather than presenting one system's framework as general practice. Mark close reference to a single source where it appears (backlog "Originality and attribution").
6. **Taste is a choice, not a default.** Where approaches differ by taste or product (type naming, how to treat existing colors), the guide describes the options and how to choose, and the play proposes one and lets the person choose.

## Rules for the app

7. The app reads content at build time through `loadCatalog()` (`src/lib/content/load.ts`). There's no runtime filesystem access.
8. `{{sistema_url}}` is resolved once, on the server, by `resolveSistemaUrl` (`src/lib/placeholders.ts`), called from the loaders. Pages and `/raw` output never contain it, and client components must not resolve it again. The origin comes from `resolveSiteUrl` (`src/lib/site-url.ts`): explicit `NEXT_PUBLIC_SITE_URL`, then the Vercel preview URL, then `https://sistema.johnthedesigner.com`.
9. `npm run build` must pass before any task is complete. It runs the content check with every rule blocking (prebuild) and the output checks (postbuild). While a dev server is running, use `npm run build:check` instead: it builds into `.next-check`, so it doesn't break the dev server's `.next`.

## Bringing in a new source (mandatory process)

Deviating from this process needs the owner's explicit approval.

**Step 1: Identify the primary source.** It must be the system's own documentation site, official repository, or official package.

**Step 2: Check the licence and assign a tier.** Record it in the system's `_index.md` Source Map and in `content/sources.yaml`.
- **Tier 1, explicitly licensed:** Creative Commons, MIT, Apache 2.0, W3C Document License, or another open licence.
- **Tier 2, official public documentation with no open licence:** permitted for synthesis, not verbatim reproduction.
- **Tier 3, public research or writing with no open licence:** synthesis with full attribution only. Flag it for the licence audit.
- **Not permitted:** paywalled content, content marked no-reproduction or no-commercial-use (for CC BY-NC, see below), and unofficial aggregators.

If the status can't be determined and the source doesn't fit tier 2, stop and report.

**Step 3: Fetch.** Run `npx tsx scrape/firecrawl-guidance.ts --url <url> --slug <slug> --limit 1 --wait 2000` from `tools/`, one page per call, at least 60 seconds apart. If Firecrawl returns nothing or loses code blocks, use GitHub raw (`raw.githubusercontent.com`) or the npm CDN (`cdn.jsdelivr.net/npm/<package>@<version>/`) from the official source.

**Step 4: If every tool fails, stop and report** what was tried, what each returned, and any secondary sources (identified as community or unofficial). Never use them without approval.

**Step 5: Write reference notes** in `reference/<category>/<system>/`: a versioned file `<topic>@<date>.md` with front matter (`system`, `category`, `topic`, `content_type`, `retrieved`, `source_url`, `license`), a redirect stub at `<topic>.md`, and the system's `_index.md`. Strip navigation chrome. Notes may be detailed, but they are notes, not Sistema content.

**Step 6: Add the source** to `content/sources.yaml`. Only then synthesize it into guides and credit it.

### Reference note conventions

- **Stubs**, including for `.json` assets, use YAML front matter (`type: stub`, `points_to`, `updated`), never plain JSON.
- **Same-date versions:** if a new version would have the same date as an existing one, update that file in place and log it in `SESSION_LOG.md`.
- **Categories:** `design-systems` (named systems, and libraries such as Tailwind and shadcn/ui), `standards` (WCAG, DESIGN.md format), `foundations` (color science, typography), `skills` (agent skills). Foundations and standards entries are flat: no `guidance/` subfolder.
- **CC BY-NC sources:** paraphrase only, attribute fully, and record the licence.
- **Tier 3 audits:** mathematical facts aren't copyrightable. Record decisions in `_meta/LICENSE_AUDIT.md`.

## Patterns established

### Content checker and tests
`tools/validate/content/` holds pure rules over a corpus: `rules.ts` covers source and output rules, `model-rules.ts` covers contract rules. Levels: `code` and `content` block the build (prebuild runs `--strict-all`); `review` reports only (for example `review.last-reviewed`, 180 days). Add a rule as a pure function with a passing and a failing test. `npm run check:content -- --output` after a build shows everything. `npm test` runs Vitest; route handlers can be tested by calling the exported `GET` (see `src/app/raw/raw.test.ts`). `npm run lint` is the ESLint CLI.

### Tool APIs
Shapes are in `docs/v2/tool-apis.md`. Every tool:
- answers GET and POST with the same response, and is listed in `GET /api` (`src/app/api/route.ts`);
- accepts colors through `parseColor` (`src/lib/color.ts`);
- returns errors through `badRequest`, with a working example URL, and records calls with `trackToolCall` (both in `src/lib/tools/http.ts`).

Limits live in `src/lib/tools/limits.ts` and the type scale's `LIMITS`.

Required values come from the rules registry, never from code. Server code reads them with `rulesFrom` and `ruleValue` (`src/lib/tools/standards.ts`). Pages get them as props built on the server, for example `contrastTable`, and use the browser-safe `valueAtLevel` (`src/lib/tools/levels.ts`).

A tool's calculation lives in one module that the API, the page, the MCP tool, and the tests share (`src/lib/palette.ts`, `src/lib/type-scale.ts`, `src/lib/tools/contrast.ts`, `src/lib/tools/validate.ts`, `src/lib/tools/dark-mode.ts`). The validator and dark mode tools read DTCG files through `src/lib/tools/tokens.ts` and derive contrast pairs from `src/lib/tools/pairs.ts` (the color guide's pairs table); `DARK_SURFACE_STEPS` and the required roles (`color.roles.required` `measure.values`) are tested against their rules' wording. `src/lib/tools/consistency.test.ts` checks tool output against WCAG and the registry.

A rule whose `checked_by` names a tool in a play's contract renders in that play without its values by standard.

### Usage analytics
Design: `docs/v2/analytics.md` (decision D13). Analytics stores nothing on the visitor's device and visits are never linked (the only stored item is the footer's theme choice, `sistema-theme`). One visit ID lives in memory (`src/lib/analytics/browser.ts`), PostHog is started with it (`persistence: 'memory'`, `person_profiles: 'never'`), and copied prompts carry it as `c`. `src/middleware.ts` sends `agent_fetch` for `/raw` and `/llms.txt`, and rewrites `/raw/...?c=` to `/raw-with-id`, which adds `c` to every Sistema URL. Tool routes send `tool_call` through `trackToolCall` (`src/lib/tools/http.ts`), after the response. The MCP route sends `mcp_call` with the visit ID from its own URL (`/mcp?c=`), which the connect page adds. Server events (`src/lib/analytics/server.ts`) carry no IP; location comes from Vercel headers with `$geoip_disable`. Local builds send nothing unless `ANALYTICS_SEND_IN_DEV=1` (server) or `NEXT_PUBLIC_ANALYTICS_SEND_IN_DEV=1` (browser, at build time). `NEXT_PUBLIC_ANALYTICS_DEBUG=1` turns on PostHog's console logging. PostHog drops browser events from automated browsers (`navigator.webdriver`, or HeadlessChrome in `userAgentData`), so a Playwright check must hide both. Any new agent-facing URL is covered by `withVisitId` only if it starts with the site origin and `/raw` or `/api`. Routes that read files at request time (`/raw-with-id`, the tool APIs) list them in `outputFileTracingIncludes` in `next.config.ts`, with glob keys (`/raw-with-id/**`, not `[...path]`). Without it they work locally and fail on Vercel. Check `.next/server/app/<route>/route.js.nft.json` after a build.

### Work conventions
All v2 work commits directly to `v2`, with messages starting with the task ID (`V2.3: ...`). Nothing merges to `main` until VF. There are no outside users, so no redirects or compatibility work. Show consequential visual choices as comparison pages, and check every new page in the browser at desktop and phone width before moving on.

### Firecrawl
Keep `--limit` at 25 or lower (1 for single pages), scrape subsections separately, and wait 60 seconds between calls. JS-heavy pages need `--wait 2000`. A result under about 80 lines from a content-rich page is a render shell; flag it. Strip everything before the first H1 and the previous and next footer.

### Source-specific fetching
- **JS-rendered token tables** (Material) need values from the asset files on GitHub; never infer them.
- **material-web SCSS tokens** delegate through `@forward` to `tokens/versions/<version>/`. Fetch the underscore-prefixed files there.
- **Atlassian** source is on Bitbucket. Get token values from `cdn.jsdelivr.net/npm/@atlaskit/tokens@<version>/`.
- **Primer** docs come from the `primer/design` MDX on GitHub.
- **Carbon** Storybook MDX files are often empty shells. Prefer the doc site or `usage.md` files.
- **shadcn/ui** docs and examples are in `shadcn-ui/ui` under `apps/v4/content/docs` and `apps/v4/examples`.

### Palette generation
`src/lib/palette.ts` follows three fixed rules, each set by one named constant (`docs/v2/palette-next.md`, guide `guide.color.palette-generation`): stops are chosen by contrast against white on an eased log curve, `1.01 × (19/1.01)^eased(i/18)` with `eased(t) = t − EASE·sin(2πt)/(2π)`; chroma follows one shared curve over lightness for every hue (`chromaShape`), scaled by the seed and kept under each hue's on-screen limit by a soft limit; hues near yellow turn toward orange as they darken (`yellowTurn`). Never adjust a single stop. After changing it, run `npm run palettes`, commit `public/palettes/library.json`, update the snapshot in `src/lib/palette.test.ts` only if the change is intended, and check greens and yellows first. A test fails if the committed library and the algorithm disagree.

### culori and shared code in tsx scripts
`tools/` scripts run under tsx and can import `src/lib` modules directly. `tools/generate-palette-library.ts` imports `generatePalette`, so the library and the API share one algorithm. Don't copy algorithms into scripts. `toGamut` needs two arguments: `toGamut('rgb', 'oklch')`.

### Site token pipeline
The site follows Sistema (`sistema.json`, DECISIONS.md, DESIGN.md at the root). Token sources are DTCG JSON in `tokens/src/`; `npm run tokens` (`style-dictionary.config.mjs`) compiles them to `src/styles/tokens/generated.css` (dark under `[data-theme="dark"]` and the system setting), `src/styles/tokens/tailwind-theme.json` (read by `tailwind.config.ts`), DESIGN.md's front matter, and `sistema-review/token-check.html` (built by `tools/token-check.mjs`). `palette.json` is never output.

### Client components
Next.js pre-renders client components, so `window`, `document`, `localStorage`, and `sessionStorage` are undefined at build time. Read them in `useEffect` (or behind a `mounted` flag), never during render.

### Page layout
Pages use `Container` (`max-w-[1180px] mx-auto px-5 md:px-10`). The page background is `surface`; raised content (cards, panels) uses `surface-raised` and separates by tone, without outlines. Headings use Fraunces (`font-serif`), text uses Inter. Use the type roles (`text-body`, `text-label`, `text-heading-md`) and the shared components in `src/components/site/` rather than pixel values. Full-bleed sections break out at `<main>` level and re-contain inside. Pages must not scroll sideways at 390px.

### Review page templates
The visual direction page is one file, `public/templates/visual-direction.html`, served at `/templates/visual-direction.html`. Plays copy it and replace only its JSON data block; improvements go into the template. Sistema's own `sistema-review/visual-direction.html` is the reference rendering.

### Channels: paste-in, MCP, skills
The same content reaches agents three ways (D35). `RenderContext.channel` (`src/lib/content/render.ts`) changes only how the text points to things: paste-in names URLs to fetch, `'mcp'` names the server's `next_step` and `read` tools, and `'skill'` names the skill's `references/` files. Change the run loop once in `renderWorkflowStarter`; never fork it per channel.
- **MCP server** (`src/app/mcp/route.ts`, D32 to D34): `mcp-handler` 2 with `@modelcontextprotocol/server` 2 and zod 4, stateless. The calculation tools call the API route handlers (`viaApi`), and `route.test.ts` checks they return identical results. Keep the tool list short: nine tools cost about 1,650 tokens per turn. Tool inputs are strings or plain types (JSON as a string where needed), so every client's schema dialect accepts them. `next_step` leads a first call with the workflow's run loop, and hands over the visit ID from the server URL. The copied MCP prompt calls `next_step`, because clients don't let the model call MCP prompts.
- **Agent Skills** (`src/lib/content/render-skill.ts`, D36): one per workflow, zipped at build time with fflate; front matter is `name` and `description` only. A skill carries its workflow's plays and any play they name.
- **Test channels in real clients** (`docs/v2/mcp-client-tests.md`): Claude Code (`claude -p --mcp-config ... --strict-mcp-config`, resumed with `--resume`) and Codex (`codex exec -c 'mcp_servers.sistema.url=...' -c 'mcp_servers.sistema.default_tools_approval_mode="approve"'`), each on a fresh copy of a small made-up project, run against the preview so links resolve. Unit tests passed through every problem these runs found.
- **Sample data and examples are instructions to an agent.** The template's sample JSON and the tool docs' examples get copied as they are; keep them neutral (no single layout, no limits the person didn't choose).

### Logo
`src/components/Logo.tsx` exports `Logo` (symbol, aspect 172/192) and `Wordmark` (symbol plus "Sistema" in Fraunces).
