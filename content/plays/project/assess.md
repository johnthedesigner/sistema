---
id: project.assess
title: Assess the project
description: Read what already exists, ask only what is missing, record the project's rules, and decide which plays can be skipped or need a different starting point.
topic: project
kind: orient
milestone: direction
entry: true
requires: []
produces: [sistema.json, DECISIONS.md, "project:a11y-standard", "project:theme", "project:density", "project:stack"]
tools: []
knowledge: []
rules: [project.a11y.standard-chosen, project.read-before-asking]
evidence: A findings table that classifies every Start output, the positioning statement in DECISIONS.md, and a valid sistema.json with the project rules filled in.
overrides: [project_context]
last_reviewed: 2026-11-14
---
Your job is to understand this project before anything is decided. Read first. Ask only what the files do not answer.

1. **Read the project.** Look for each of these, and note what you find:
   - `sistema.json`, `DESIGN.md`, `DECISIONS.md`, and `LIVING_BRIEF.md` (an older Sistema state file)
   - `package.json` and any framework config, for the stack and build tools
   - Token sources: `tokens/`, any `*.tokens.json`, a Tailwind config `theme`, and CSS or SCSS files that define custom properties
   - Three to five component files, to see how values are used today
   - `style-preview.html` and `token-check.html`

2. **Classify each Start output.** Make a table with one row per output and one of three statuses:

   | Output | Status | Where it is now |
   |---|---|---|
   | DESIGN.md Overview section | | |
   | style-preview.html | | |
   | tokens/src/color.json | | |
   | tokens/src/typography.json | | |
   | tokens/src/shape.json | | |
   | tokens/src/spacing.json | | |
   | Token pipeline and compiled CSS | | |

   - **Conforms:** it exists where Sistema expects it, in the expected format (DTCG JSON for tokens).
   - **Differs:** the values exist, but somewhere else or in another format. Examples: colors only in a Tailwind config, CSS custom properties with no JSON source, SCSS variables.
   - **Missing:** nothing exists yet.

   Do not judge quality here. Each later play checks its own outputs before skipping.

3. **Ask only what is missing.** Skip anything step 1 answered. If an answer is vague, ask one follow-up before moving on.
   - What is the product, and who uses it to do what?
   - Is the interface dense (tables, dashboards, data-heavy forms), sparse (focused flows, simple tasks), or balanced?
   - Where does it sit between expressive (personality, distinctiveness) and utilitarian (clarity, efficiency)?
   - Is there an existing brand color or visual direction to honor? Any colors to avoid?
   - Light theme, dark theme, or both? If both, which is primary?
   - Web, mobile, or both? One team or several? Roughly how many components: under 20, 20 to 60, or more?
   - Which accessibility standard and level must it meet? Help the person choose for their use case. WCAG 2.2 AA fits most web products. Section 508 or EN 301 549 applies where the law requires it. Some audiences call for AAA criteria. Record the choice exactly, for example `wcag-2.2 AA`.
   - What stack is it built on? Sistema's default path is web with React and Tailwind. Other stacks are supported more loosely.

4. **Write `sistema.json`** at the project root. If it exists, update it and keep what is already recorded.

   ```json
   {
     "sistema": "2",
     "workflow": "start",
     "milestone": "direction",
     "project": {
       "a11y_standard": "wcag-2.2 AA",
       "theme": "light-dark",
       "density": "balanced",
       "stack": "react-tailwind"
     },
     "steps": {},
     "gates": {},
     "routing": {}
   }
   ```

   `theme` is one of `light`, `dark`, or `light-dark`. `density` is one of `dense`, `balanced`, or `sparse`.

5. **Record routing for outputs that differ.** When colors exist but differ, set `"routing": {"color.scheme": "color.map-existing"}`. The workflow then runs that play instead, which keeps the existing colors and brings them into Sistema's format. For other outputs that differ, note them in DECISIONS.md. Their plays will handle them when reached.

6. **Start DECISIONS.md** if it does not exist, with a heading and one line per decision. If `LIVING_BRIEF.md` exists, copy its decision log entries into DECISIONS.md and keep the file. Do not delete it.

7. **Write the positioning statement** as the first DECISIONS.md entry, in 100 to 200 words. Say what the product is, who it serves, where it sits between expressive and utilitarian, and its platform and scale. Write it so a designer or another agent could act on it. The direction play builds on it.

8. **Show the evidence:** the findings table, the positioning statement, and the final `sistema.json`. Then summarize, in two or three sentences, what the next play will do.
