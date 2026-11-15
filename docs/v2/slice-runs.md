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
| Plays completed, skipped, routed | | 4 complete, 5 placeholders skipped, color routed to map-existing |
| Resume tested (new session picked up correctly) | | Not known yet (ask owner) |
| Palette tool calls (count; malformed?) | | Used (ramp provenance in every `$description`). Count needs the transcript |
| Contrast tool calls (count; malformed?) | | Used. Independent recheck: 21 pairs, 0 failures. Count needs the transcript |
| Any values computed by hand instead of by tool | | **Yes, in the style preview.** 7 preview colors were hand-picked and later replaced by ramp stops (see finding 2) |
| Gates: stopped and waited? revision handled? | | Both gates held. The Foundations approval recorded the 7 changed roles |
| Evidence shown for each play | | Yes, one line per play in `sistema.json` |
| `sistema.json` valid against the schema | | **No** (see finding 1) |
| Routing set and followed (existing colors) | | Yes |
| Brand colors preserved (existing colors) | | Values yes, exactly. One brand name was re-slotted without asking (finding 4) |
| Things the agent guessed or asked that it shouldn't have | | Invented a milestone value and a gate record shape (finding 1) |
| Claims that didn't match the files | | None found. Contrast, role count, compile, and app build all verified |
| Approximate token use, if visible | | |

## Findings

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
5. **Not yet measured:** tool call counts, malformed calls, and resume. These need the transcript or the owner's notes.

