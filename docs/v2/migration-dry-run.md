# LIVING_BRIEF Migration: Dry Run on Sistema

**Task:** V1.15. **Date:** 2026-11-17. **Play:** `project.migrate-brief`.

I followed the play by hand against Sistema's own root files (`LIVING_BRIEF.md`, `DESIGN.md`, `AGENTS.md`, the token sources). The output was written outside the repo and is not committed. V3 runs the play for real, with the owner settling the conflicts below.

## Result

| Check | Result |
|---|---|
| Every brief item placed or left out with a reason | 30 of 30 |
| Decision log entries carried into DECISIONS.md | 9 of 9, with original dates |
| `sistema.json` valid against the published schema | Yes |
| DESIGN.md has the specification's eight sections, in order | Yes, naming roles, not values |
| Conflicts listed for the owner, none settled by the agent | 4 |

## Where the brief went

| Brief section (items) | Destination |
|---|---|
| Project identity (5) | `sistema.json` `project` (name, density, theme, theme_primary); DESIGN.md Overview; the positioning statement in DECISIONS.md |
| Key decisions (6: color, typography, spacing, shape, motion, tokens) | DESIGN.md Colors, Typography, Layout, Shapes and Elevation & Depth, as roles; motion in Do's and Don'ts; token architecture in DECISIONS.md |
| Current state (5: token files, endpoints, components, pages, known gaps) | Left out, because the repo shows it and it is out of date: it lists components and pages removed in v2. The known gaps became conflicts 2 and 4 |
| Open questions (5, all resolved) | Already covered by key decisions and log entries, so they need no separate entries |
| Decision log (9) | DECISIONS.md, one line each, marked "(from LIVING_BRIEF.md)" |

The accessibility standard (WCAG 2.2 AA), the platform, and the stack were not in the identity section. They were inferred from the first log entry and `package.json`, and listed under "Inferred, not asked."

## Conflicts the play surfaced

1. **Canvas color.** The brief's key decisions and the code say `#FFFFFF`, as a deliberate flat-surface choice. The redesign log entry and AGENTS.md say `#EFEEEA`. The retrospective calls white a drift from the plan.
2. **Dark mode access.** The brief's theme line says dark mode follows the operating system setting, and the code does. The brief's known gaps say dark mode is developer-only.
3. **Small-text link color.** DESIGN.md says small links use `#005CE6`. That value exists as the `blue-link` primitive, but no semantic role uses it.
4. **Reduced motion.** The brief says no `prefers-reduced-motion` baseline exists. That needs a decision: add a rule, or record why the color and opacity transitions don't need one.

These are real questions for the owner, to settle when V3 applies Sistema to its own site.

## Other findings

- **Sistema's DESIGN.md has no body.** It is 201 lines of bare YAML with no `---` lines, so it's neither valid front matter nor the specification's format. The play now says to wrap bare values in `---` lines and write the body below them.
- **Superseded entries aren't conflicts.** An early entry sets radii at 4, 8 and 12px, and a later shape entry replaces them. The play now says to carry both over as history.
- **Token sources aren't DTCG.** They live in `tokens/primitive/` and `tokens/semantic/` and use `value` rather than `$value`. Spacing has no token file. The play records this for the token pipeline play rather than changing tokens itself.
- **AGENTS.md tells agents to use the living brief** (the "Living brief as first-class project artifact" section). The play offers replacement text instead of editing the file. For Sistema, V1.18 rewrites AGENTS.md anyway.

## Changes made in V1.15

- New play `content/plays/project/migrate-brief.md` and rule `project.migrate.every-line-placed`.
- `project.assess` and `project.orient` run the migration play first when `LIVING_BRIEF.md` exists and `sistema.json` doesn't. Assess no longer copies the brief's log on its own.
- The play is reached from those two plays rather than being a route, so it does not add an item to the routes row on the home page.
