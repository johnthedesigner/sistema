---
id: project.assess
title: Assess the project
description: Read what already exists, ask only what is missing, record the project's rules, and decide which plays can be skipped or need a different starting point.
topic: project
kind: orient
milestone: direction
entry: true
requires: []
produces: [sistema.json, DECISIONS.md, AGENTS.md, "project:a11y-standard", "project:theme", "project:density", "project:stack"]
tools: []
knowledge: []
rules: [project.a11y.standard-chosen, project.read-before-asking, project.state.pointer, project.state.valid]
evidence: A findings table that classifies every Start output, the positioning statement with its inferred facts in DECISIONS.md, a valid sistema.json with the project rules filled in, and the Sistema section in the agent instructions file.
overrides: [project_context]
last_reviewed: 2026-11-15
---
Understand the project before deciding anything. Read first; ask only what the files don't answer.

If the project has `LIVING_BRIEF.md` (an older Sistema state file) and no `sistema.json`, run the play at `{{sistema_url}}/raw/plays/project.migrate-brief` first, then come back here. Its outputs answer most of the questions below.

1. **Read the project.** Look for each of these, and note what you find:
   - `sistema.json`, `DESIGN.md`, `DECISIONS.md`, and `LIVING_BRIEF.md` (an older Sistema state file)
   - `AGENTS.md` and `CLAUDE.md`
   - `package.json` and any framework config, for the stack and build tools
   - Token sources: `tokens/`, any `*.tokens.json`, a Tailwind config `theme` or `@theme` block, and CSS or SCSS files that define custom properties
   - Three to five component files, to see how values are used today
   - The `sistema-review/` folder, and older review pages at the root (`visual-direction.html`, `token-check.html`)

2. **Classify each Start output.** Make a table with one row per output and one of three statuses:

   | Output | Status | Where it is now |
   |---|---|---|
   | DESIGN.md Overview section | | |
   | sistema-review/visual-direction.html | | |
   | tokens/src/color.json | | |
   | tokens/src/typography.json | | |
   | tokens/src/shape.json | | |
   | tokens/src/spacing.json | | |
   | Token pipeline and compiled CSS | | |

   - **Conforms:** it exists where Sistema expects it, in the expected format (DTCG JSON for tokens).
   - **Differs:** the values exist, but somewhere else or in another format. Examples: colors only in a Tailwind config, CSS custom properties with no JSON source, SCSS variables.
   - **Missing:** nothing exists yet. Starter values from a framework template count as missing, for example the `--background` and `--foreground` colors create-next-app adds. Note them in DECISIONS.md so the token pipeline replaces them.

   Don't judge quality here; each later play checks its own outputs.

3. **Ask only what is missing.** Skip anything step 1 answered. If an answer is vague, ask one follow-up before moving on.
   - What is the product called, what is it, and who uses it to do what?
   - Is the interface dense (tables, dashboards, data-heavy forms), sparse (focused flows, simple tasks), or balanced?
   - Where does it sit between expressive (personality, distinctiveness) and utilitarian (clarity, efficiency)?
   - Is there an existing brand color or visual direction to honor? Any colors to avoid?
   - Light theme, dark theme, or both? If both, which is primary?
   - Web, mobile, or both? One team or several? Roughly how many components: under 20, 20 to 60, or more? (Platform goes in `sistema.json`; team size and component count go in the positioning statement.)
   - Which accessibility standard and level must it meet? Help the person choose for their use case. WCAG 2.2 AA fits most web products. Section 508 or EN 301 549 applies where the law requires it. Some audiences call for AAA criteria. Record the choice exactly, for example `wcag-2.2 AA`.
   - What stack is it built on? Sistema's default path is web with React and Tailwind; other stacks are supported more loosely.
   - Is a component library planned or in use (shadcn/ui, Radix Themes, Material UI, Carbon)? Record it as `project.component_library`; later plays follow its naming. "Not decided yet" is fine.

   **If the project already has colors,** tell the person nothing changes without their choice. The color play will show their colors beside a few options, and they decide per hue: keep them exactly, keep them and complete the ramps, or use them as seeds for new ramps. Don't ask them to choose now.

4. **Write `sistema.json`** at the project root, in the shape the workflow starter gives. If it exists, update it and keep what is already recorded. Set `continue` to the URL of the workflow you are running, including its `c` parameter if it has one, and record that `c` value as `telemetry.id`. Set `project.name` to the product's name. `theme` is one of `light`, `dark`, or `light-dark`, and `theme_primary` is set when it is `light-dark`. `density` is one of `dense`, `balanced`, or `sparse`. `platform` is one of `web`, `mobile`, or `web-mobile`.

5. **Record routing for outputs that differ.** When colors exist but differ, set `"routing": {"color.scheme": "color.map-existing"}`. The workflow then runs that play instead, which starts from the existing colors. For other outputs that differ, note them in DECISIONS.md. Their plays will handle them when reached.

6. **Add the Sistema section to the agent instructions file.** Use `AGENTS.md` if it exists, or `CLAUDE.md` if the project uses that instead. If neither exists, create `AGENTS.md`. Add this section once, at the end, and change nothing else in the file:

   ```
   <!-- sistema:start -->
   ## Design system (Sistema)
   This project's design system follows Sistema. Before any design system work
   (tokens, colors, type, components, DESIGN.md), read sistema.json and fetch
   the URL in its "continue" field, then follow it.
   <!-- sistema:end -->
   ```

   Tell the person you added it, so a new session finds its way back.

7. **Start DECISIONS.md** if it does not exist. Its first line is `This project follows Sistema. To continue, fetch the URL in sistema.json "continue".` Then a heading, and one line per decision.

8. **Write the positioning statement** as the first DECISIONS.md entry, 100 to 200 words: what the product is, who it serves, where it sits between expressive and utilitarian, its platform and scale. The direction play builds on it. Below it, under "Inferred, not asked", list each fact you took from files or assumed, so the person can correct it.

9. **Show the evidence:** the findings table, the positioning statement with its inferred facts, and the final `sistema.json`. Then show the workflow outline, as the starter describes.
