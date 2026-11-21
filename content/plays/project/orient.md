---
id: project.orient
title: Orient the session
description: Read the system's current state, confirm the goal of this session, flag conflicts with recorded decisions, and choose the route to follow.
topic: project
kind: orient
milestone: maintain
entry: true
requires: [sistema.json]
produces: []
tools: []
knowledge: []
rules: [project.read-before-asking, project.state.valid]
evidence: A short summary of the system's state, the session goal, any conflict with a recorded decision and how it was resolved, and the route chosen.
overrides: [goal]
last_reviewed: 2026-11-20
---
1. **Read the state:** `sistema.json`, DESIGN.md, the most recent entries in DECISIONS.md, the token files, and the component folder. If `LIVING_BRIEF.md` exists and `sistema.json` doesn't, the project uses an older Sistema state file. Run the play at `{{sistema_url}}/raw/plays/project.migrate-brief` first, then come back here.

2. **Summarize in four lines:** what the product is, what the system has (token categories, themes, component count), what is open (provisional items in DESIGN.md, gaps from recent audits), and the last decision recorded.

3. **Confirm the goal.** Use `goal` if given. If the person's message already says what they want (the site's prompt box adds a line such as "I want to add a component: a date picker"), restate that and confirm it. Otherwise ask: "What do you want to do in this session?" and wait for the answer. Restate it in one sentence.

4. **Check for conflicts.** If the goal contradicts a recorded decision (for example, a new accent color in a restrained system), say so, and ask whether to change the decision or the goal. Record a changed decision in DECISIONS.md.

5. **Choose the route** from the workflow's routes that fits the goal, and say which plays it runs. To change something already approved (the direction, a foundation value, a component treatment), the route is "Change an approved direction or foundation" (`project.revise`). If the goal is building the system's first components and `sistema.json` shows the Patterns workflow hasn't run, follow `{{sistema_url}}/raw/workflows/patterns` instead. If none fits, say so, and agree with the person how to proceed outside Sistema's plays.
