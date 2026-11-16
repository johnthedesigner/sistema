---
id: project.plan
title: Plan the next iteration
description: Assess the system's maturity, choose the highest-value work for the next cycle, and turn it into a prioritized list of tasks, each with the Sistema route or play that does it.
topic: project
kind: orient
milestone: maintain
entry: true
requires: [DECISIONS.md]
produces: []
tools: []
knowledge: []
rules: []
evidence: The maturity table, the iteration goal, three to five prioritized tasks each naming its route or play and why it is in that position, and how completion will be judged.
overrides: []
last_reviewed: 2026-11-15
---
1. **Read the state:** `sistema.json`, DESIGN.md (especially provisional items), DECISIONS.md, and the latest reports in `docs/audits/`.

2. **Rate maturity** as not started, partial, or complete for: tokens (each category), themes, component coverage for the product's main screens, accessibility (from the latest audit), and documentation (DESIGN.md and the reference route).

3. **Choose three to five tasks,** in this order of priority:
   1. Missing foundations that block other work.
   2. Blocking accessibility issues.
   3. Components the product needs that don't exist yet.
   4. Provisional decisions that now have enough information to settle.
   5. Improvements to things that work.

4. **Write the plan:** a one-sentence goal, the tasks in order (each with why it is there and the route or play that does it), open questions with how to answer them, and how you'll know the iteration is done. Put it in `docs/plans/<YYYY-MM-DD>.md`.

5. Add a DECISIONS.md entry with the goal, and show the plan.
