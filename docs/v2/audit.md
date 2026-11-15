# v2 Repo Audit

**Task:** V0.1. **Date:** 2026-11-14. **Branch:** `v2` at `3465ab9`.
**Method:** I read the code, ran a production build, searched the built HTML, and sent requests to every tool API on a local dev server.
**Companion files:** `bug-inventory.md` (every bug instance with file and line) and `PLAN_CORRECTIONS.md` (where the plan and the code differ).

## Summary

1. **Framework:** Next.js 15.5 App Router, React 19, Tailwind 3.4, not a static export. The build passes with 197 pages. Plays and campaigns are parsed from three markdown files in `_meta/`.
2. **Content:** Five sources describe plays and campaigns, and they overlap. Most site bugs come from that duplication, as the plan suspected.
3. **Raw endpoint:** `/raw` and `/bundle` are dynamic route handlers that read KB files from disk on each request. They return file text unchanged.
4. **Templating:** `{{sistema_url}}` is filled in only by browser JavaScript, in 7 separate places. Server HTML still contains the placeholder on 35 pages and relative URLs on 11 campaign step pages. Agent fetch tools don't run JavaScript, so they get the broken text.
5. **Tools:** Contrast and palette accept POST only, take hex only, and are not described anywhere an agent would look. The type scale exists only as a browser calculator, and its defaults disagree with the play and the guide.
6. **Tests and CI:** none. The one validator in the repo (`tools/validate/lint-frontmatter.ts`) is run by hand and doesn't know the `principles` content types.
7. **Site design system:** a real token pipeline exists (DTCG JSON to Style Dictionary to CSS). Three older CSS token files are unused, and 16 components still hardcode hex values.

---

## 1. Framework and structure

| Item | Finding |
|---|---|
| Next.js | 15.5.18, App Router only (`src/app/`). No `pages/` directory. |
| React | 19.2 |
| Styling | Tailwind 3.4.19 plus CSS custom properties from `src/styles/tokens/generated.css` |
| Output | Server build, not `output: 'export'`. Route handlers run as functions on Vercel. |
| Node | 22.17 locally |
| Validation libraries | None. No Zod in the dependency tree, so the plan's Zod upgrade concern (12.3) doesn't apply. |
| Build | Passes, 197 pages. Warns about multiple lockfiles (see below). |

**Routes:**
- **Static or SSG:** home, `/playbooks`, `/playbooks/[slug]`, `/playbooks/stage/[stage]`, `/campaigns`, `/campaigns/[slug]`, `/campaigns/[slug]/[step]`, `/campaigns/[slug]/export`, `/kb/...` (4 levels), `/guide`, `/sources`, `/tools`, `/tools/{palette,contrast,type-scale}`, `/sitemap.xml`, `/robots.txt`, `/api/search-data`.
- **Dynamic:** `/api/contrast`, `/api/palette`, `/api/context` (analytics beacon), `/raw/[category]/[slug]/[...path]`, `/bundle/[category]/[slug]`.

**Workspace root problem.** A stray `package-lock.json` sits one folder above the repo at `/Users/johnlivornese/Repos/package-lock.json`. Next.js picks that folder as the workspace root. Locally, `next start` then served the Pages Router 404 page for every route, including the APIs. `next dev` works. Vercel builds from a clean checkout and isn't affected. Fix: set `outputFileTracingRoot` in `next.config.ts`, or delete the stray lockfile, which is outside this repo and is the owner's call. The integrity checks and the harness both need a working `next start`, so this should be fixed in V0.2.

## 2. Content sources

| Content | Source file | Loader | Notes |
|---|---|---|---|
| Plays (25) | `_meta/TASK_PLAYBOOKS.md`, about 1,550 lines | `src/lib/playbooks.ts` regex split on `## slug — Title` | Stage defaults to 1 when missing. No validation. |
| Play descriptions | `PLAY_DESCRIPTIONS` map in `src/lib/playbooks.ts` | hardcoded | A second source for play metadata. A missing entry falls back to the title. |
| Stage labels and descriptions | `STAGE_LABELS`, `STAGE_DESCRIPTIONS` in `src/lib/playbooks.ts` | hardcoded | |
| Campaign step lists | `_meta/CAMPAIGNS.md` | `src/lib/campaigns.ts` | **Unknown play slugs are silently dropped** (`campaigns.ts:47`). |
| Full campaign prompts | `_meta/campaigns/bootstrap.md` (844 lines), `audit-and-refactor.md` | read as one string | **A separate, hand-written copy of every step.** See below. |
| Exemplars | `_meta/exemplars/**` | `src/lib/exemplars.ts`, matched by `play_slug` | |
| KB | `kb/principles/` (50 files), `kb/reference/{design-systems,standards,foundations,skills}/` (176 files) | `src/lib/kb.ts`, stub to versioned file | 94 stubs, all resolve. One versioned file has no stub. |
| Home quick cards | `QUICK_PLAYS` in `src/app/page.tsx` | hardcoded | Includes `steps: 10`. |
| Sources page | `DESIGN_SYSTEMS`, `SUPPORTING_SOURCES` in `src/app/sources/page.tsx` | hardcoded | |
| Tools index | `TOOLS` in `src/app/tools/page.tsx` | hardcoded | |
| Guide | `src/app/guide/page.tsx`, 268 lines of JSX | hand-written | Names plays and campaigns in prose. |

**The two copies of each campaign step.** Campaign step pages (`/campaigns/bootstrap/4`) show the play body from `TASK_PLAYBOOKS.md`. The "copy whole campaign" prompt and the export page show `_meta/campaigns/bootstrap.md`, which is written separately. Bootstrap Step 4 is 88 lines in the campaign file and 119 lines in the play. The play calls the palette tool, but the campaign version doesn't. This duplication explains several bugs the plan lists: the tool skip, the step number drift, and some of the placeholder spread. V1 Track B step 5 (campaigns as lists of play IDs) removes it.

**Hand-written lists of the same things.** Play metadata lives in three places: the play heading, `PLAY_DESCRIPTIONS`, and `QUICK_PLAYS`. Campaign metadata lives in four: `CAMPAIGNS.md`, the campaign file's own header, `QUICK_PLAYS`, and the guide. The content model needs one place for each.

**KB titles.** None of the 92 versioned KB files has a `title` field. Titles are built from the file name in three places (`kb/[category]/[slug]/[...path]/page.tsx:21`, `kb/[category]/[slug]/page.tsx:25`, `SourcesSidebar.tsx:19`). That's where "Llm Compatibility" comes from, and it affects every KB page.

**KB categories differ from the plan.** The KB has a fifth category, `skills` (Impeccable, Anthropic frontend-design, designer-skills), that the plan doesn't mention. `kb/principles/` is the closest existing match to the plan's `guide` type. Guides cite reference material through `sources` frontmatter: 20 principles files cite 43 distinct `kb/reference/` paths. Those citations render as sidebar links, so they become dead links once reference material stops being published (plan 9.2).

## 3. The raw endpoint

- `/raw/[category]/[slug]/[...path]` follows the stub, reads the versioned file from disk, and returns it as `text/plain`. A trailing `.md` is stripped. If `?play=&sid=` is present, it logs a `raw_fetch` line for analytics.
- `/bundle/[category]/[slug]?topics=a,b` joins several raw files into one response. Missing topics are listed in an HTML comment at the top.
- Both are dynamic. They read KB files on every request. That conflicts with AGENTS.md rule 7 ("no runtime filesystem access to KB files"). It works on Vercel because the files are traced into the function bundle. It's still a hidden dependency, and it's the reason these routes can't be prerendered.
- Neither route touches placeholders. Rendered pages and raw files share the same source file. The duplication is between the two campaign copies, not between the page and raw versions of one file.
- Copied prompts get `?play=<slug>&sid=<id>` added to every `/raw/` URL (`src/lib/analytics.ts:13`), so fetches can be traced back to plays.

## 4. Templating

How `{{sistema_url}}` is meant to work: content files hold the placeholder, and a client component swaps in `NEXT_PUBLIC_SITE_URL` or `window.location.origin` when the prompt is shown or copied.

How it actually behaves:
- The replacement is written out 7 times (`PromptBox`, `CampaignPromptBox`, `CampaignStep`, `CampaignExport`, `PlayDetail`, `PlayForm`, `CopyButton`). Some prefer `NEXT_PUBLIC_SITE_URL` and some use `origin` only.
- `PromptBox` and `CampaignPromptBox` start their state with the **unresolved** body (`useState(body)`) and fix it in `useEffect`. Server-rendered HTML therefore contains the literal placeholder.
- `CampaignStep` builds the prompt during render with `origin = ''` (`useState('')`). Server-rendered HTML therefore contains `/raw/principles/...` with no domain.
- In a browser, after JavaScript runs, all three show correct absolute URLs. **Copying with the button has always produced correct text.** The bugs show up when an agent fetches the page itself, or when someone reads the page before hydration finishes.
- Measured in the build output: 35 HTML files contain the literal `{{sistema_url}}` (every play page with a URL, both campaign overviews and exports, several campaign steps, and the home page). 11 campaign step pages contain relative `/raw/` URLs.
- `src/lib/site-url.ts` falls back to `https://sistema-bay-seven.vercel.app`. This doesn't matter in the browser but does matter for anything server-side. I couldn't see whether `NEXT_PUBLIC_SITE_URL` is set on Vercel. The owner can check this in the dashboard.
- Other variables (`{{color_mode}}` and so on) go through the same client-only path. An unfilled variable is kept as `{{name}}` in copied text, which is intended.

The fix for V0.3 is to resolve placeholders on the server, at build time for static pages and per request for `/raw` and `/bundle`, using one shared function. Client components then only fill in user variables.

## 5. Tools and APIs

Each tool was tested on a local dev server. The results are recorded in `bug-inventory.md`.

**Contrast (`POST /api/contrast`, `src/app/api/contrast/route.ts`)**
- Body: `{ foreground, background }`. Accepts 3- or 6-digit hex, with or without `#`.
- Algorithm: culori `wcagContrast` (WCAG 2.x relative luminance), rounded to 2 decimals. The thresholds are inline literals: AA text 4.5, AA large 3.0, AA UI 3.0, AAA text 7.0, AAA large 4.5.
- `#6B7280` on `#FFFFFF` gives 4.83, which matches the plan. `red` and `oklch(...)` return 400. GET returns 405. One pair per call.
- Rounding happens before the pass checks, so a true ratio of 4.495 rounds to 4.5 and passes AA. That's a small correctness bug to fix in V2.

**Palette (`POST /api/palette`, `src/lib/palette.ts`)**
- Body: `{ colors: { name: "#rrggbb" } }`. Only 6-digit hex. 3-digit hex is rejected, unlike in the contrast tool.
- Algorithm: the seed is converted to OKLCH. The code sweeps L from 0.02 to 0.985 in steps of 0.001. At each L, chroma is the maximum in-gamut chroma for that L and hue (found by binary search), times the seed's relative saturation, times a sine taper normalized to the seed's lightness. Each of the 19 stops (50 to 950) picks the candidate whose contrast against white is closest to a log target: `1.01 × (19.0/1.01)^(i/18)`. So stops are chosen by **contrast against white**, not by a lightness curve.
- Constants: `STOPS`, the target endpoints 1.01 and 19.0, the L sweep bounds and step, the 0.5 chroma search ceiling, and the taper `(1 + rawTaper)/2`.
- The AGENTS.md description of the taper (`C = seedChroma × sin(π × L) × taperStrength`, taper ≤ 0.5) no longer matches the code.
- `public/palettes/library.json` (22 ramps) is generated by `tools/generate-palette-library.ts` and committed.
- The color play's request body is correct.

**Type scale (`/tools/type-scale`, `src/components/type-scale/TypeScaleCalculator.tsx`)**
- Browser only, with no API. Defaults: base 16px, ratio 1.333 (Perfect Fourth), 11 steps from -2 to +8.
- Line height is a step function: 48px and up gives 1.0, 32px gives 1.1, 24px gives 1.2, 18px gives 1.4, and smaller sizes get 1.6.
- At the defaults, the smallest step (`xs`, "caption / legal") is **9px**.
- Display line height is **1.0**, not the 0.969 the plan reports. The real conflict is three-way. The tool gives 1.0. The play (`TASK_PLAYBOOKS.md:450`) says 1.0 to 1.1. The typography guide (`kb/principles/typography/architecture@2026-05-13.md:151`) says 1.05 to 1.1 for 48px and up.
- One play sends agents to this page (`TASK_PLAYBOOKS.md:423`). An agent's fetch gets the default values from the server render and can't change inputs.

**Other endpoints:** `/api/context` is a PostHog beacon that returns 204. `/api/search-data` returns the static search index. `/api` returns 404. No machine-readable list of tools exists.

## 6. Tests and CI

- No test runner, no test files, no `.github/` directory, no CI, and no git hooks. `_meta/BACKLOG.md` already lists this.
- `tools/validate/lint-frontmatter.ts` takes one system directory as an argument and is run by hand. Its allowed `content_type` values are `guidance`, `implementation`, `asset`, and `design-md`. That list doesn't include `synthesis`, which `kb/principles/` uses. It isn't wired into the build.
- `npm run lint` (`next lint`) exists. `next lint` is deprecated in Next 15.5 and is removed in Next 16, so V0.2 should move to the ESLint CLI.
- The type checker during `next build` is the only automatic check.

## 7. The site's own design system

- **Pipeline:** `tokens/primitive/color.json` and `tokens/semantic/{color,color.dark,shape,typography}.json` go through `style-dictionary.config.mjs` (`npm run tokens`) to produce `src/styles/tokens/generated.css` and `tokens.mjs`. `globals.css` imports `generated.css`. Tailwind's config maps the variables.
- **Unused files:** `src/styles/tokens/colors.css`, `shape.css`, and `typography.css` are not imported anywhere. `LIVING_BRIEF.md` still names `typography.css` as the typography token file.
- **Hardcoded values:** 16 `.tsx` files contain 6-digit hex values. The most common is `#0070FF` (15 times). Some are logo artwork, which is fine. Others are UI: the campaign step header, the stage chip colors listed in AGENTS.md, and the tool pages.
- **State files:** root `DESIGN.md` (updated in V0.0, no longer standard frontmatter), `LIVING_BRIEF.md`, and `VOICE_AND_TONE.md`. There is no `DECISIONS.md` or `sistema.json`. V3 takes the site through the method properly.
- **Dark mode:** follows `prefers-color-scheme`, set by an inline script in `layout.tsx` before the page paints.

## What this means for later phases

- **V0.3** should fix placeholders by resolving them on the server, not by editing content. The content is mostly fine.
- **V0.2's check** has to look at the built HTML and the `/raw` responses, not just the source markdown. The source is supposed to contain placeholders.
- **V0.4** fixes the bootstrap campaign file by hand for now. V1 deletes the duplicate.
- **V1 needs a mapping decision** for `kb/principles/` (probably the `guide` type) and for the `skills` reference category.
- **V1's reference move** affects one URL used by plays (the DESIGN.md spec) and 43 citation paths in guide sources.
- **The rules registry has a ready first test case** in the display line height conflict between tool, play, and guide.
- **V2's contrast work** should also fix rounding before threshold checks, and should make the palette tool accept 3-digit hex.
