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
| Plays completed, skipped, routed | | |
| Resume tested (new session picked up correctly) | | |
| Palette tool calls (count; malformed?) | | |
| Contrast tool calls (count; malformed?) | | |
| Any values computed by hand instead of by tool | | |
| Gates: stopped and waited? revision handled? | | |
| Evidence shown for each play | | |
| `sistema.json` valid against the schema | | |
| Routing set and followed (existing colors) | | |
| Brand colors preserved (existing colors) | | |
| Things the agent guessed or asked that it shouldn't have | | |
| Claims that didn't match the files | | |
| Approximate token use, if visible | | |

## Findings

(Filled in after the runs.)
