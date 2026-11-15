# v2 Bug Inventory

**Created:** V0.1, 2026-11-14. Every row was confirmed in code or in build output.
**Fix in column:** the task or phase that fixes it. Most content bugs move to V1, because V1 replaces that content (see `capability-model.md`). V0.2 adds a baseline count from the integrity check below the tables.

## Plan Section 14 bug types

| # | Bug type | Instance | Evidence | Fix in |
|---|---|---|---|---|
| 1 | Unfilled placeholders | Server HTML contains literal `{{sistema_url}}` on 35 pages | `PromptBox.tsx:29` and `CampaignPromptBox.tsx:39` start from the unresolved body. Found by grep over `.next/server/app/**/*.html` | V0.3 |
| 2 | Unfilled placeholders | 7 separate copies of the replacement code, with different base URL logic | `PromptBox`, `CampaignPromptBox`, `CampaignStep`, `CampaignExport`, `PlayDetail`, `PlayForm`, `CopyButton` | V0.3 |
| 3 | Relative URLs | 11 campaign step pages serve `/raw/principles/...` with no domain | `CampaignStep.tsx:62` (`origin = ''` during server render), `:94`, `:185` | V0.3 |
| 4 | Wrong fallback domain | `SITE_URL` falls back to `sistema-bay-seven.vercel.app` | `src/lib/site-url.ts:2` | V0.3 |
| 5 | Step count drift | Home quick card says Bootstrap has 10 steps. The data has 11. The hero computes 11 | `src/app/page.tsx:28` (hardcoded) vs `:174` (computed) | V1 |
| 6 | Step count drift | Home card says "in four structured phases." The campaign has phases, but the count is typed by hand | `src/app/page.tsx:32` | V1 |
| 7 | Step numbering drift | Step 9's substeps are labeled 10a to 10g, then 9h | `_meta/campaigns/bootstrap.md:597, 605, 613, 688, 701, 719, 727, 735` | V1 |
| 8 | Step numbering drift | Step 9's closing section is titled "Before proceeding to Step 11" | `_meta/campaigns/bootstrap.md:742` | V1 |
| 9 | Step referenced by number | Step 4 says CSS compiles "in Step 9." It's Step 8 | `_meta/campaigns/bootstrap.md:252` | V1 |
| 10 | Steps referenced by number | 108 "Step N" references in plays and many more in campaign files. Most are internal substeps. The check will list cross-step ones | `grep "Step [0-9]" _meta/TASK_PLAYBOOKS.md` | V1 |
| 11 | Hardcoded dates | `[2026-05-13]` in 6 log-entry templates | `_meta/TASK_PLAYBOOKS.md:279, 786, 833, 993, 1145, 1208` | V1 |
| 12 | Missing metadata | `generate-spacing-tokens` has no description, so the page shows its title instead | Missing from `PLAY_DESCRIPTIONS` (`src/lib/playbooks.ts`). Fallback at `playbooks/[slug]/page.tsx:18` and `playbooks/page.tsx:197` | V1 |
| 13 | Contradictory source of truth | `/guide` says plays read DESIGN.md first. Plays read `LIVING_BRIEF.md` (28 references in plays) | `src/app/guide/page.tsx:182`. The `session-start` description in `PLAY_DESCRIPTIONS` says "reads DESIGN.md," but the play body reads `LIVING_BRIEF.md` | V1 |
| 14 | Titles from file names | All 92 KB files have no `title` field. Titles come from slugs ("Llm Compatibility") | `kb/[category]/[slug]/[...path]/page.tsx:21`, `kb/[category]/[slug]/page.tsx:25`, `SourcesSidebar.tsx:19` | V1 |
| 15 | Universal thresholds | 44 by 44 pixel touch target required for every project | `_meta/TASK_PLAYBOOKS.md:773, 826, 895, 986, 1076, 1329`, `bootstrap.md:699`, `audit-and-refactor.md:155`. The accessibility floor guide also sets it (§4.2) | V1 |
| 16 | Tool and guide disagree | Type scale tool: 9px caption at defaults. Display line height 1.0 from the tool, 1.0 to 1.1 in the play, 1.05 to 1.1 in the guide | `TypeScaleCalculator.tsx:17, 35-41`, `TASK_PLAYBOOKS.md:450`, `kb/principles/typography/architecture@2026-05-13.md:151` | V2 (registry and tool) |
| 17 | Prompt skips a required tool | The Bootstrap full-campaign prompt's color step never calls the palette tool. The standalone play does | `_meta/campaigns/bootstrap.md:250-335` vs `TASK_PLAYBOOKS.md:334` | V1 |

## Found in the audit (not in the plan)

| # | Bug | Evidence | Fix in |
|---|---|---|---|
| 18 | Broken reference: two plays fetch `/raw/principles/color/primitive-ramp-scalability`, which returns 404. The versioned file has no stub | `TASK_PLAYBOOKS.md:299, 600`. Only `kb/principles/color/primitive-ramp-scalability@2026-05-17.md` exists | V0.4 |
| 19 | Placeholder inside KB content | `{{sistema_url}}` in a KB file, which `/raw` would serve unresolved once #18 is fixed | `primitive-ramp-scalability@2026-05-17.md:75` | V0.3 |
| 20 | Agent sent to a browser-only page | A play tells agents to open `/tools/type-scale`, which has no API | `TASK_PLAYBOOKS.md:423` | V1 (reword), V2 (API) |
| 21 | Silent data loss: a campaign step with an unknown play slug is dropped with no error | `src/lib/campaigns.ts:47` | V0.2 (check) |
| 22 | Two copies of every campaign step that drift apart | `_meta/campaigns/*.md` vs `TASK_PLAYBOOKS.md` play bodies | V1 |
| 23 | Contrast rounds before threshold checks, so 4.495 passes AA | `src/app/api/contrast/route.ts:37-46` | V2 |
| 24 | Palette rejects 3-digit hex. Contrast accepts it | `src/app/api/palette/route.ts:34` vs `contrast/route.ts:4` | V2 |
| 25 | `next start` fails locally because of the inferred workspace root (stray lockfile in the parent folder) | Build warning. Every route returned 404 under `next start` | V0.2 |
| 26 | Frontmatter linter rejects `content_type: synthesis` and isn't wired to anything | `tools/validate/lint-frontmatter.ts:16` | V0.2 |
| 27 | Unused token CSS files, one of which the brief still names | `src/styles/tokens/{colors,shape,typography}.css` | V3 |
| 28 | AGENTS.md describes an old palette taper formula | AGENTS.md "OKLCH palette chroma taper" vs `src/lib/palette.ts:73-95` | V0.7 |

| 29 | Broken source citation: Primer's DESIGN.md cites `kb/design-systems/primer/assets/tokens/colors`, which doesn't exist | `kb/reference/design-systems/primer/design-md/DESIGN@2026-05-12.md:13` (found by `ref.sources`) | V0.4 |
| 30 | Bare relative URL in a campaign prompt: "verified via `/api/contrast`" | `_meta/campaigns/bootstrap.md:328` (found by `ref.relative-url`) | V0.4 |
| 31 | Tool pages show relative API paths (`POST /api/palette`) to agents reading the page | `src/app/tools/{palette,contrast}/page.tsx`, `src/app/tools/page.tsx` (found by `output.relative-url`) | V0.3 |
| 33 | The contrast tool's Copy button put a literal `{{sistema_url}}` on the clipboard | `src/components/contrast/ContrastChecker.tsx:243` | V0.3 (fixed) |
| 32 | Local builds bake `NEXT_PUBLIC_SITE_URL` from `.env.local` (an old ngrok tunnel) into 383 pages. Production is unaffected because Vercel has its own env | `.env.local` line 1. Owner's file, not edited | Owner |

## Integrity check baseline

First run 2026-11-14 (V0.2), `npm run check:content -- --output` after `npm run build` on `v2`.

| Rule | Level | Count |
|---|---|---|
| `ref.raw-url` | code | 2 |
| `ref.relative-url` | code | 1 |
| `ref.campaign-step` | code | 0 |
| `ref.stub-target` | code | 0 |
| `ref.orphan-version` | code | 1 |
| `ref.sources` | code | 1 |
| `raw.placeholder` | code | 1 |
| `output.placeholder` | code | 35 |
| `output.relative-url` | code | 16 |
| `content.literal-date` | content | 6 |
| `content.step-number` | content | 24 |
| `content.missing-description` | content | 1 |
| `content.missing-title` | content | 21 |
| `content.universal-threshold` | content | 10 |
| **Total** | | **119** (57 code, 62 content) |

V0.3 and V0.4 should bring the code-level count to 0. Content counts are the V1 baseline.
