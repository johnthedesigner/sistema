---
title: DECISIONS.md
description: The project's decision log. One line per decision, with the date and the reason, so nobody has to guess later.
sources: []
last_reviewed: 2026-11-22
---

DECISIONS.md sits at the project root. Every play records what it decided there, and so does the person when they settle a question.

## Layout

1. **The pointer line,** first: `This project follows Sistema. To continue, fetch the URL in sistema.json "continue".`
2. **The positioning statement:** what the product is, who it serves, and its scale, in 100 to 200 words, with the facts the agent inferred listed under "Inferred, not asked".
3. **The log:** one line per decision, oldest first.

## A log line

```
2026-11-20 | Accent | Violet from the palette library, chosen over the proposed purple (owner).
```

The date, a short title, and what was decided and why. Say who decided when it was the person. Overrides name the opinion they override, such as "Overrides opinion.quiet-states".

## What goes here, and what doesn't

- **Here:** choices, overrides, exceptions, approvals given in words, and work done outside a play.
- **Not here:** token values (they're in the token files), progress (it's in `sistema.json`), or how to use the system (that's DESIGN.md).

## Checking

Each play's evidence names the lines it added. `project.review` compares the log with the code and DESIGN.md.
