---
title: Token files
description: The token sources in tokens/src, in the Design Tokens Community Group (DTCG) format, and what the token pipeline makes from them.
sources: []
last_reviewed: 2026-11-22
---

Token values are written in one place: JSON files in `tokens/src/`, in the DTCG format. Everything else (CSS, the Tailwind theme, DESIGN.md's front matter, the token check page) is generated from them by `npm run tokens`.

## Files

| File | Holds |
|---|---|
| `palette.json` | The primitive ramps from the palette tool, plus any exact values kept as `palette.base.*`. Never output as CSS |
| `color.json` | The color roles, each pointing at a palette stop |
| `color.dark.json` | Only the roles that change in the dark theme |
| `typography.json` | Font families, the size scale, and the type roles |
| `shape.json`, `shape.dark.json` | Radii and shadows by role |
| `spacing.json` | The spacing scale and layout values such as control height |
| `<category>.<mode>.json` | Other modes, such as `spacing.compact.json` or `motion.reduced.json` |

## A token

```json
{
  "color": {
    "primary": { "$type": "color", "$value": "{palette.accent.550}", "$description": "Main actions. On white text: 5.5:1." }
  }
}
```

Each token has a `$type` and a `$value`, and roles refer to primitives with `{group.name}`. The `$description` says what the role is for.

## Rules

- Roles refer to primitives; components use roles.
- A mode file only replaces tokens the defaults have, and each token belongs to one kind of mode.
- Nobody edits the generated files.

## Checking

`npm run tokens` fails on a mode token with no default and on a variable that refers to itself. The token check page shows every role in every mode.
