---
title: sistema.json
description: The project's Sistema state, at the root of the repo. It records the project's settings, which steps are done, which approvals were given, and where to continue.
sources: []
last_reviewed: 2026-11-22
---

`sistema.json` sits at the project root. Agents read it first in every session, and write to it as work is done. The schema is at `{{sistema_url}}/raw/schema/sistema.json`.

## Fields

| Field | Holds |
|---|---|
| `sistema` | The format version, `"2"` |
| `workflow` | The workflow in progress: `start`, `patterns`, or `session` |
| `continue` | The URL an agent fetches to carry on. The agent instructions file points here |
| `milestone` | `direction`, `foundations`, `patterns`, or `maintain` |
| `project` | The project's settings: name, accessibility standard, theme, density, platform, stack, component library, and modes |
| `steps` | Each play run so far, by play ID, with its status (`pending`, `in-progress`, `complete`, `skipped`), date, and evidence |
| `gates` | Each approval given, by name, with the date, who approved, an optional note, and `withdrawn` if a later change reopened it |
| `routing` | Plays replaced by others for this project, such as `color.scheme` by `color.map-existing` |
| `telemetry` | The anonymous usage ID copied prompts carried, if any |

## Example

```json
{
  "sistema": "2",
  "workflow": "start",
  "continue": "{{sistema_url}}/raw/workflows/start",
  "milestone": "foundations",
  "project": { "name": "Harbor", "a11y_standard": "wcag-2.2 AA", "theme": "light-dark", "theme_primary": "light", "density": "dense", "platform": "web" },
  "steps": { "visual-language.direction": { "status": "complete", "date": "2026-11-20", "evidence": "Visual direction page approved." } },
  "gates": { "direction-approved": { "date": "2026-11-20", "by": "owner" } },
  "routing": {}
}
```

## Rules

- Only play IDs go in `steps`. Work done outside a play goes in DECISIONS.md.
- Dates are written as `YYYY-MM-DD`, from the day the work is done.
- Check the file against the schema before ending a session.

## Checking

The schema validates the file. `project.state.valid` and `project.state.pointer` are the rules that apply.
