# Plan Corrections

Places where `SISTEMA_PLAN.md` differs from the code. The plan isn't edited. Later phases read it together with this file. Each correction lists what it changes.

| # | Plan section | Plan says | Code shows | What it changes |
|---|---|---|---|---|
| 1 | 10.2, 14 | Type scale suggests 0.969 line height for display | The tool outputs 1.0 for 48px and up. 0.969 doesn't appear anywhere. The 9px caption is correct. The real conflict is three-way: tool 1.0, play 1.0 to 1.1, guide 1.05 to 1.1 | The registry must settle one value. V2's consistency test covers all three. |
| 2 | 14, 10.1 | `{{sistema_url}}` is unfilled on four specific pages | It's unfilled on 35 pages, in server HTML only. Copied text was always correct. The cause is client-only resolution, not missing content | V0.3 is a code fix (server-side resolution), not a content fix. |
| 3 | 14 | Campaign step pages show relative `/raw/` URLs | True. The cause is `CampaignStep` rendering with an empty origin on the server | Same fix as #2. |
| 4 | 10.1 | "The Bootstrap campaign's color step never tells the agent to use the palette generator" | True only for the full-campaign prompt (`_meta/campaigns/bootstrap.md`). The step page (`/campaigns/bootstrap/4`) shows the play body, which does call the palette tool | Confirms the plan's content model direction. The root cause is two copies of each step. |
| 5 | 8.3 | "palette lightness curve and chroma envelope" | Stops are chosen by contrast against white on a log curve (1.01 to 19.0). There is no lightness curve. Chroma is gamut-relative with a sine taper | The registry's algorithm settings entry should name contrast targets, not lightness. |
| 6 | 12.3 | "If the site already uses Zod 3, check the upgrade" | No Zod dependency at all | V4 simply adds Zod 4. |
| 7 | 9.2 | Reference material sits behind plays that fetch it | Only one reference URL is fetched by plays (`/raw/standards/design-md/spec`, 2 places). But 20 guide files cite 43 reference paths in `sources`, and those render as links | The reference move needs a citation strategy (plain text credit or the Sources page), not just a replacement for the spec. |
| 8 | 8.1, 9.2 | Content is guides, plays, and reference | The KB also has a `skills` reference category (3 agent skill sources). `kb/principles/` (50 files) is the existing equivalent of `guide` | V1 schema work maps `principles` to `guide` and treats `skills` as reference. |
| 9 | 2 (item 3) | Raw versions of pages could be generated separately | `/raw` serves the same file the page renders. The drift is between the two campaign copies, not between a page and its raw version | The plan's 8.2 rule ("both generated from the same source") already holds for KB content. It needs extending to plays and campaigns. |
| 10 | 15 Phase 0 | Fix bugs; add an integrity check | `next start` doesn't work locally because of the workspace root inference | V0.2 has to fix this so the check can test built output. |
