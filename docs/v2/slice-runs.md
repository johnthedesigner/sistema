# V1.4 Slice Runs

**Preview:** https://sistema-git-v2-jtd-604ef502.vercel.app (branch `v2`, protection off). CI passed on `c2638c9`.
**Scratch projects** (outside the Sistema repo, each with its own local git repo so every change shows as a diff):

| Project | Path | What it tests |
|---|---|---|
| New project | `~/Repos/sistema-slice/new-project` | Next.js 15 and Tailwind 4 scaffold with no design system. The new-system path. The agent must ask about the product. |
| Existing colors | `~/Repos/sistema-slice/existing-colors` | "Ledgerline," a small invoicing dashboard. Partial brand ramps in a Tailwind 4 `@theme` block, two hardcoded hex values in components, and a README describing the product. The Adopt path: `project.assess` should route color to `color.map-existing`. |

## What is and isn't converted

The slice converts `project.assess`, `visual-language.direction`, `color.scheme`, `color.map-existing`, and `tokens.pipeline`. Five plays are placeholders that tell the agent to record them as skipped: `visual-language.design-md`, `content.voice-and-tone`, `typography.scale`, `shape.tokens`, and `spacing.tokens`. Expected results:
- DESIGN.md has only its Overview section, plus front matter from the color tokens.
- `token-check.html` shows only color tokens, and notes the missing categories.

The runs test the model (assessment, routing, gates, tool use, evidence, state, skip, and resume), not the quality of the unconverted plays. Those are converted in V1.10, after the fit review.

## How to run (owner)

For each project, open a **fresh** Claude Code session in that folder, with no other context, and paste:

```
Fetch https://sistema-git-v2-jtd-604ef502.vercel.app/raw/workflows/start and follow it.
```

Then act as the product owner:
- **New project:** invent a product, or use this one: "A scheduling tool for independent physical therapy clinics. Front-desk staff book and reschedule patients all day. Calm and trustworthy, not clinical." Pick an accessibility standard when asked.
- **Existing colors:** answer from the README. Keep the brand colors.
- At each gate, actually open `style-preview.html` or `token-check.html` and react honestly. Asking for at least one change at the direction gate is useful, because it tests revision.
- If the session runs out or you stop partway, start a new session with the same paste. That tests resume.

Things to notice as you go: anything confusing, anything the agent guessed instead of asking, tools it didn't call, and places it claimed more than it did.

When a run ends, tell me. I'll review the transcript (if you can share it or save it into the project), the diff (`git -C <project> diff --stat` and full diff), `sistema.json`, and DECISIONS.md, and fill in the findings below.

## What gets recorded per run

| Measure | New project | Existing colors |
|---|---|---|
| Plays completed, skipped, routed | 2 complete (assess, direction). After resume, none: the agent left the workflow (finding N1) | 4 complete, 5 placeholders skipped, color routed to map-existing |
| Resume tested (new session picked up correctly) | **Failed.** The owner typed "pick up where I left off" instead of re-pasting. The agent never fetched Sistema again | No. The whole run was one session |
| Palette tool calls (count; malformed?) | 2 in session 1 (direction). 0 after resume. Ramps were hand-built in Python | 1 call for all four hues (pine, ink, ember, red), as the play asks. Not malformed |
| Contrast tool calls (count; malformed?) | About 15 batched loops in session 1 (92 pairs). 0 after resume; a local contrast function was used instead | 4 shell loops of single-pair calls (3 in direction, 1 for 27 pairs in color), so roughly 50 HTTP calls. None malformed. Independent recheck: 21 pairs, 0 failures |
| Any values computed by hand instead of by tool | Yes, after resume: 7 ramp stops interpolated by hand, and all later contrast checks | **Yes, in the style preview.** 7 preview colors were hand-picked and later replaced by ramp stops (see finding 2) |
| Gates: stopped and waited? revision handled? | Direction: stopped and waited. Approved as-is, but `gates` is still `{}`. No Foundations gate, no `token-check.html` | Both gates held. The Foundations approval recorded the 7 changed roles |
| Evidence shown for each play | Yes, but under invented step IDs | Yes, one line per play in `sistema.json` |
| `sistema.json` valid against the schema | **No.** Milestone `components`; step IDs that don't exist (`tokens.semantic`, `components.core`, and others); extra project fields `theme_primary` and `platform` | **No** (see finding 1) |
| Routing set and followed (existing colors) | n/a | Yes |
| Brand colors preserved (existing colors) | | Values yes, exactly. One brand name was re-slotted without asking (finding 4) |
| Things the agent guessed or asked that it shouldn't have | Session 1: recorded its assumptions (one team, 20 to 60 components) in DECISIONS.md, which is good. After resume: guessed the whole rest of the process | Invented a milestone value, a step status, and a gate record shape (finding 1). Guessed the DESIGN.md front matter format (finding 6). Kept ink-200 at its name without asking (finding 4) |
| Claims that didn't match the files | None found. Its claims about tests and builds match the commits | None found. Contrast, role count, compile, and app build all verified |
| Approximate token use, if visible | Session 2 ran about 8 hours and compacted at least once | Not visible in the export |

## Findings

### New project (reviewed 2026-11-15)

Sources: the owner's export, plus both session logs (`2f803d5f…` the first session, `033a8f86…` the resumed one), read directly. The owner described their own product: a dense data analysis and scenario planning tool, with Airtable-like color personality, both themes equal, light primary.

**Session 1 (on the workflow) went well.** Assess recorded the answers and wrote down its assumptions. The direction play used the palette and contrast tools, checked 92 pairs, built "Ink & Signal" (magenta primary, teal secondary, plum-tinted neutrals, 8 categorical hues, IBM Plex), stopped at the gate, and named its judgment calls clearly.

**Findings:**

N1. **Resume left the workflow, and nothing pulled it back. This is the most important finding of both runs.** The owner returned with "I was in the middle of something, let's pick up where I left off", which is what a person actually types. The agent rebuilt the state well from DECISIONS.md, DESIGN.md, `sistema.json`, and the preview, and correctly found the waiting gate. But nothing in those files said where the workflow lives, so it never fetched Sistema again. After approval it improvised. It recorded no gate, invented step IDs and a `components` milestone, wrote every DESIGN.md section from the preview, put tokens straight into `globals.css` (no DTCG, no Style Dictionary, no `token-check.html`, no Foundations gate), hand-built ramps, and then built about 40 components over 8 hours as the owner kept saying yes. The work is good, but it isn't Sistema's process, and the state file no longer describes reality. *Proposed fixes:*
   - `sistema.json` carries `"continue": "<site>/raw/workflows/start"`, and the starter says that any session that finds `sistema.json` fetches that URL before doing anything else.
   - Every file Sistema creates gets one line at the top: DECISIONS.md, the DESIGN.md comment, and the footer of each review page. The line says: "This project follows Sistema's Start workflow. To continue, fetch <url>."
   - At each gate, the agent's message ends with the exact text to paste in a new session.
   - Once Start ends, the agent says so plainly. It names the next workflow (or "none yet"), and says that further work is outside Sistema's process. This also gives proposal H's outline a clear end.
   - Later, MCP and Agent Skills make this native: a skill can trigger on `sistema.json`.

N2. **Off-workflow, the agent found things the plays should teach.** These are candidates for rules and guides:
   - In Tailwind 4, `outline-none` plus `outline-2` draws no focus ring unless `outline-solid` is added. Axe doesn't catch it. This is the second run to hit a Tailwind 4 trap (see existing-colors finding 7).
   - Turn off Tailwind's default palette (`--color-*: initial`), so only system colors exist.
   - Avoid self-referencing `@theme` variables (again).
   - Self-host fonts, because `next/font/google` failed builds twice.
   - Don't disable the focused button while its action runs.
   - Toasts have no error tone, and toasts with an action never time out.

   The pipeline items belong in `tokens.pipeline`. The component items wait for the components milestone (V1.10 and later).

N3. **Its hand-built ramps anchored the approved values on exact stops,** which is the same idea as proposal E. That's more evidence the palette tool should accept anchors.

N4. **The review page can't show the chosen typeface.** It must be self-contained, so IBM Plex rendered only if it was installed locally. The agent said so honestly. *Proposed fix:* allow font links from Google Fonts or a font CDN in review pages (only the font, nothing else), or require a note when the font can't be shown.

N5. **`project.assess` collects things the schema has no field for:** the primary theme when both are used, and the platform. The agent added `theme_primary` and `platform`. *Proposed fix:* add both to the schema and the starter's shapes (with existing-colors finding 1).

N6. **Approvals were bare "yes" and "proceed" for 8 hours.** Each one carried the agent further from Sistema with no outline to measure against. Proposal H (an outline and progress) would have made the drift visible. After the first resume, the outline would have shown the token, color, and pipeline steps as still pending.

### Existing colors (reviewed 2026-11-15)

**Verified independently:**
- Every role pairing passes: 21 pairs computed with culori, 0 failures, lowest `border-focus` on `surface` at 3.79 against a minimum of 3.
- All 21 required roles are present, plus 11 extras with clear jobs (`primary-hover`, `surface-sunken`, `border-control`, error, success, and warning containers and borders).
- All 8 brand values and the 3 Alert reds are kept exactly, placed into palette-tool ramps, and every primitive's `$description` records its origin.
- DESIGN.md has the spec's 8 sections in order, a filled Overview, and front matter generated from DTCG and marked "Do not edit" (D6b works).
- `npm run tokens` and the app's `next build` both pass. The Tailwind 4 integration (`@theme inline reference`, exposing role tokens only) is well judged.
- DECISIONS.md has the positioning statement and one entry per play, with real dates.
- The agent caught real problems on its own: white on pine-500 at 3.97 (Button hover), and ember as text at 3.00 (StatCard). It fixed both with new roles.

**Findings for the fit review:**

1. **`sistema.json` fails the schema.** `milestone` is `"foundations-complete"`, which is not a valid value. Gate records use `{status, date, note}` instead of `{date, by}`. Cause: no play or starter text gives the exact gate record shape, the allowed milestone values, or who advances the milestone. The agent invented reasonable shapes. *Proposed fix:* the starter states the exact shapes and when to advance `milestone`. Add an optional `note` to gate records, because the agent's note (what changed at approval) is useful. Publish the schema at a URL so plays can point to it.
2. **The approved preview and the final tokens differ.** The direction play says not to build ramps, so the style preview used hand-picked colors. The color play then replaced 7 of them with ramp stops, so the person approved colors that did not ship. *Proposed fix:* the direction play calls the palette tool for its seeds and shows real ramp stops in the preview. Then what is approved at the first gate is what the color play uses.
3. **The pipeline edited components.** It replaced old Tailwind color utilities and hex values in `Button`, `Alert`, `StatCard`, and `page.tsx` with role utilities. This followed the instructions: `color.map-existing` listed those as old sources, and `tokens.pipeline` step 5 says to replace them. It was also necessary, because removing the old `@theme` colors would otherwise break the build. The result is good, but it is component work inside Foundations, and the play doesn't name it. *Proposed fix:* make it explicit. The pipeline lists every file it changes in its evidence, and the app build must pass. Alternatively, split usage migration into its own change play.
4. **A brand name was re-slotted without asking.** Brand `ember-500` became ramp stop `ember.400`, so the ramp stays monotonic, and the old utility names (`pine-700` and the rest) are gone. The play says to ask before changing a brand *value*, but not a *name*. *Proposed fix:* ask before renaming or re-slotting any existing named value, and list renamed names in the evidence.
5. **From the transcript (owner export, 2026-11-15):**
   - **Intake worked well.** The agent read the README and code first, then asked only four questions (standard, theme, density, stance), each with a recommendation drawn from the files. Team size and component count were inferred from the README rather than asked. That is acceptable, but the positioning statement should say which facts were inferred.
   - **`sistema.json` also used `"status": "in-progress"`** for the direction step while waiting at the gate. The schema allows only pending, complete, and skipped. The agent's value is useful for resume. *Proposed fix:* add `in-progress` to the schema (and to the starter's shapes from finding 1).
   - **The contrast tool takes one pair per call,** so the agent wrote shell loops (about 50 calls). *Proposed fix:* accept a list of pairs in one request, and say so in the Tools section. This is cheap and also helps MCP.
6. **The DESIGN.md front matter format is not linked.** `tokens.pipeline` step 6 says "the DESIGN.md format's token structure", but no URL is given. The agent tried guessed URLs, got 404s, and used a common `colors:` map. Another run could produce a different shape. *Proposed fix:* add the DESIGN.md spec's front matter section to the play's knowledge list, or render the expected shape in the play.
7. **Tailwind 4 wiring is not covered.** The obvious `@theme inline` setup makes Tailwind emit `--color-x: var(--color-x)`, which works only because of cascade order. The agent found this and used `@theme inline reference`. Since React and Tailwind are the default stack (D3), *proposed fix:* the pipeline play states the Tailwind 4 wiring (and the Tailwind 3 equivalent) and checks the compiled CSS for self-referencing variables.
8. **The final gate compares against decisions that nothing compiled.** The direction play shows a type scale and radii, but with the placeholders nothing compiles them, so the gate's "compiled tokens match what was approved" check couldn't cover them. Mostly a slice artifact, but the gate prompt should list approved values with no compiled counterpart rather than leave them silent. Covered by proposal H (outline with status) plus a line in the token check page.
9. **The agent saved a project memory** (`~/.claude/projects/-Users-johnlivornese-Repos-sistema-slice-existing-colors/memory/`) saying these are test runs and stubs are expected. It is scoped to that folder, so the new-project run is unaffected. A rerun of existing-colors would be biased by it, so remove it before any rerun.
10. **The agent's own gap report matched ours.** Asked by the owner, it named the hand-picked preview colors (finding 2), unmarked placeholders (proposal H), the front matter spec (finding 6), and the Tailwind wiring (finding 7). Asking the agent at the end for prompting gaps is cheap and useful. Make it a standard closing question in future runs.

### Owner feedback on color adoption (2026-11-15)

The owner liked the adoption result: identify existing colors, complete the ramps, and place the existing values into them. That is the owner's own taste, though, and it will vary a lot by project and person. **So it is recorded as guidance for the usual path when a project already has established tokens, not as a fixed default.** The play presents the options neutrally, and the person chooses.

**Second owner note: show decisions, don't just describe them.** The review gates already use HTML pages. The same approach should explain choices. Show the existing colors next to each proposed option, so the person can see what each choice does to the system. Text alone makes the consequences hard to judge. This changes proposals B and D below, and adds G.

**Measured in this run** (OKLCH from `tokens/src/color.json`):

| Ramp | Observation | Cause |
|---|---|---|
| pine 100 to 150 | Visible jump | Chroma: existing 100 is C 0.022, tool 150 is C 0.104 (about 5x). The contrast step is normal (1.20 to 1.40). |
| ink 200 | Ramp stalls, then jumps | Existing ink-200 has the same contrast as tool ink-150 (1.40 and 1.39). It is a 150 named 200. |
| ember 500 | Index misaligned | Existing ember-500 lands on Sistema's 400 by contrast (3.00 against white). |
| pine 500 and 700 | Mild drift | About half a step lighter than their names imply. |

**Proposed changes:**

| # | Change | Where | Phase |
|---|---|---|---|
| A | **Explain the approach at intake, and leave the choice open.** `project.assess` says, briefly, that Sistema will look at the existing colors and show options before anything changes. It does not ask for a strategy yet, because the person can't judge one before seeing it. The choice happens in `color.map-existing`, after the comparison page (B). Usual options: **keep exactly** (only existing values; gaps and contrast failures are shown and decided one by one), **keep and complete** (existing values pinned in full ramps tuned around them; the usual suggestion when a project has established tokens), and **regenerate** (existing colors as seeds for uniform ramps, with old names mapped to the nearest stops). These are options to present, not a schema enum. The person can mix them per hue. The choice is recorded in DECISIONS.md. | `project.assess`, `color.map-existing` | V1.5 revision |
| B | **Diagnose, then show the options on a page.** `color.map-existing` builds `color-options.html` before mapping anything. For each hue it shows the existing values as a ramp strip with diagnosis flags: misaligned index (lands one stop or more off its name), chroma outlier (will cause a visible jump), duplicate step, and failing contrast for a role. Under that, it shows one strip per option, with existing values marked, and the changed values called out. Then the same small UI sample (button, alert, text on surface) rendered with each option's roles, so the effect is visible on components, not just swatches. The agent asks the person to choose per hue, then maps. | `color.map-existing`, new rule (G) | V1.5 revision |
| C | **Consent for every change to existing colors.** Nothing existing is replaced, renamed, re-slotted, or heavily augmented without an explicit choice from the person. This is a blocking rule (`color.existing.consent`) and absorbs finding 4. | `content/rules/color.yaml`, both color plays | V1.5 revision |
| D | **Ramp strip previews.** Every ramp preview is one row of swatches, edge to edge with no gaps, so lightness and chroma steps are visible. Labels go below the strip, and existing values are marked. This applies to `style-preview.html`, `token-check.html`, and Sistema's own palette tool page. | rule `color.preview.ramp-strips`, the direction and pipeline plays, `/tools/palette` | V1.5 (plays), V3 (site) |
| E | **Anchored ramps in the palette tool.** The tool accepts existing values as anchors at their slots and tunes the neighboring stops so transitions are smooth: chroma and hue blend gradually between anchors, while lightness keeps the contrast targets. It also returns the diagnosis from B (nearest stop, index offset, chroma ratio), so the play doesn't estimate it. This passes the tool test (plan 10.3): it is a calculation, this run shows a model gets it wrong, and a current play needs it. Until it exists, the play shows the jumps honestly and asks. | `/api/palette`, `src/lib/palette.ts` | V2 |
| F | **Say it on the site.** The color guide and onboarding explain the approach and the usual options, as guidance rather than a prescribed default. | Narrative and color guide | V1.7, V3 |
| G | **Visual comparison for any consequential choice.** A general rule (`review.compare-visually`): when a play asks the person to choose between options that change how the system looks, or proposes changes to existing values, it first writes a self-contained HTML page showing the current state next to each option, with the differences marked, and asks the person to open it. This covers color adoption (B), and later typography scale options, radius and spacing density, and dark mode. Pages go in `sistema-review/`, named by play (for example `sistema-review/color.map-existing.html`), so they don't crowd the project root and later plays can link to them. The gate pages (`style-preview.html`, `token-check.html`) stay where they are. Open question for the fit review: should the gate pages move into `sistema-review/` too? | `content/rules/`, renderer, plays that offer choices | V1.5 (rule and color), V1.10 (other plays) |

**Tool dependency.** The comparison page needs real ramps for each option. Until E exists, the agent makes one palette tool call for the regenerated ramp and places existing values beside it. The "keep and complete" strip then shows where the jumps are, rather than smoothing them. After E, the tool returns all options, plus the diagnosis, in one call.


### Owner note: show the process outline and progress (2026-11-15)

In a GUI, the person sees an outline of the process up front, and progress is shown against that outline as they go. The workflow should do the same, as far as it can without slowing the run.

| # | Change | Where | Phase |
|---|---|---|---|
| H | **Outline at the start, progress against it throughout.** The renderer generates the outline from the workflow definition, so the agent doesn't write it: the milestones, the steps in each, the gates, and which steps are optional. Each step gets one plain sentence. The agent shows it once at the start (after `project.assess`, with routed and skipped steps already marked) and asks nothing about it. After each play, it shows a single progress line (for example `Foundations 3 of 6: color done, typography next`), not the whole outline. At each gate, and on resume, it shows the full outline with each step's status from `sistema.json`. The gate pages (`style-preview.html`, `token-check.html`) carry the same outline as a header strip, and link to any comparison pages in `sistema-review/`. **Cost limits:** no extra questions, no extra pages, and HTML is only touched when a gate page is built anyway. | `render.ts` (starter and full workflow), gate page rules, `start.md` | V1.5 revision |
