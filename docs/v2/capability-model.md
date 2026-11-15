# Capability Model and IA Proposal

**Status:** approved by the owner 2026-11-14. V1.0 decisions applied 2026-11-14 (see `docs/v2/decisions.md`): steps are publicly called **plays**, sequences are **workflows**, and content lives in `content/`. **Created:** 2026-11-14.
**Supersedes:** plan Sections 5.3 (stages to categories), 8.1 (`campaign` type), and 8.5 (play contracts, extended here). Everything else in the plan still applies.
**Owner decisions already made (2026-11-14):**
- Knowledge, calculations, and procedures are separate units.
- Topic is the primary organizing axis. Milestones are derived from step contracts.
- Steps are designed so they can also compile to Agent Skills.
- Phase 0 content fixes shrink, since V1 rewrites that content.
- Workflows are the main entry points, and steps are the building blocks.
- Two gates by default: Direction approval and end of Foundations.
- Start covers Direction and Foundations. Patterns is offered as a continuation.
- Steps stay publicly reachable, but grouped by topic rather than shown as a top-level list.

---

## 1. The units

| Unit | What it is | Changes when | Example |
|---|---|---|---|
| **Guide** | Sistema's view of a topic, with addressable sections | The craft understanding changes | `guide.color`, section `dark-mode` |
| **Rule** | One measurable requirement or default (plan 8.3) | A standard or default changes | `color.contrast.text` |
| **Opinion** | A published default, with its reason and when you'd choose otherwise (plan 6) | Sistema's stance changes | `opinion.tokens-before-components` |
| **Tool** | A calculation with one right answer | The algorithm changes | `tool.palette` |
| **Step** | A short procedure with a contract | How a task is done changes | `color.scheme` |
| **Workflow** | An ordered set of steps, with gates, skip conditions, and resume behavior | The path through the work changes | `workflow.start` |

A step does not restate guide content or rules. It refers to them by ID. This is what keeps steps short, and it's what lets each channel decide how much to load.

## 2. Topics

Every guide, rule, tool, and step belongs to one topic. Topics form the shared namespace for IDs, search, site navigation, and MCP results.

| Topic | Guides today (`kb/principles/`) | Steps | Notes |
|---|---|---|---|
| `project` | none (living brief spec) | assess, orient, review, plan | Process and state. Replaces "stewardship." |
| `visual-language` | overview, style-tile-format | direction, design-md | Kept as its own topic so it isn't confused with the Direction milestone |
| `content` | voice-and-tone, writing-mechanics, ui-copy-patterns | voice-and-tone | |
| `color` | architecture, palette-generation, primitive-ramp-scalability | scheme, map-existing, add-theme | |
| `typography` | architecture | scale | |
| `shape` | architecture | tokens | |
| `depth` | architecture | none | The shape step covers elevation. **Gap**, see Section 8. |
| `spacing` | layout | tokens | The step doesn't reference its own guide today. |
| `motion` | architecture | none | **Gap**, see Section 8. |
| `tokens` | architecture | pipeline, migrate-tailwind, coverage-audit | |
| `components` | none | scaffold-core, specify, implement, audit, page-examples, docs-site | **Gap:** no components guide |
| `accessibility` | floor | audit | Cross-cutting. Many steps cite its rules. |
| `quality` | visual-quality-signals | none | Cross-cutting. Provides advisory rules. |
| `ai` | llm-compatibility, ui-patterns | none | Guides only |

Milestones (Direction, Foundations, Patterns) and the Maintain and grow practice are not folders. Each play declares one (`direction`, `foundations`, `patterns`, `maintain`). The build checks that its `requires` and `produces` agree with that milestone.

## 3. The step contract

```yaml
id: color.scheme
title: Generate the color scheme
topic: color
kind: create              # create | change | check | orient
milestone: foundations
entry: false              # true = offered as a direct starting point on the site
requires:                 # state that must exist before this step runs
  - design-md#direction
  - gate:direction-approved
  - project:a11y-standard
produces:                 # what this step writes; used for skip checks and ordering
  - tokens/src/color.json
  - tokens/src/color.dark.json?   # "?" = only when the theme includes dark
tools: [palette, contrast]
knowledge: [guide.color#models, guide.color#dark-mode, guide.quality#commitment-levels]
rules: [color.contrast.text, color.contrast.ui, color.roles.required, quality.color.bans]
evidence: contrast matrix (every on-* pair, every theme) from tool.contrast batch
overrides: [color_direction, color_mode]   # optional inputs when the step is run on its own
steps: |
  ...
```

What the fields buy:
- **`requires`, `produces`:** these give the build an ordering it can check. They also tell the workflow what to skip, and they make the dependency graph explicit. Outputs can name a section of a file (`design-md#direction`), not just a whole file. DESIGN.md is written by one step and extended by others, so file-level checks alone would be wrong.
- **`gate:` and `project:` requirements:** these read from `sistema.json`. Human approvals and project rules then become state the agent can check.
- **`overrides`:** today's form fields (`{{color_direction}}` and so on) exist because plays couldn't read earlier decisions. Inside a workflow, a step reads them from DESIGN.md and `sistema.json`. The fields remain only for running a step on its own. This solves the "feed-forward" backlog item without extra work.
- **`evidence`:** what the agent must show before marking the step complete. Where possible, it's the output of a tool, not a description in prose.
- **Not an output:** every step appends to DECISIONS.md. That append doesn't count in the dependency graph.

## 4. Workflows

```yaml
id: workflow.start
title: Start a design system
entry: true
description: Take a project from no design system to a verified token system.
first: project.assess            # every run begins by checking what exists
sequence:
  - project.assess
  - visual-language.direction
  - gate: direction-approved      # person approves the style preview
  - visual-language.design-md
  - content.voice-and-tone?       # optional; offered, not required
  - color.scheme
  - typography.scale
  - shape.tokens
  - spacing.tokens
  - tokens.pipeline
  - gate: foundations-approved    # person reviews the token check page
continue_with: workflow.patterns  # offered at the end, not run automatically
```

**Run loop, the same in every channel:**
1. Read `sistema.json`. If it doesn't exist, the first step creates it.
2. Find the next step in the sequence that isn't complete.
3. If that step's outputs already exist and pass their checks, mark it complete and move on. This is how the same workflow serves new projects and existing ones.
4. If its outputs exist but don't conform (for example, color lives only in a Tailwind config), run the matching change step first (`tokens.migrate-tailwind`, `color.map-existing`). `project.assess` records this routing in `sistema.json`.
5. Load the step, do the work, show the evidence, record completion and evidence in `sistema.json`, and append to DECISIONS.md.
6. At a gate, stop and ask the person. Record the approval.
7. Repeat until done. A new session resumes from the same state.

**Workflow catalog:**

| Workflow | Entry point | Purpose |
|---|---|---|
| `workflow.start` | "Start a design system" and "Bring Sistema to an existing system" | The same workflow. The site gives it two doors with different explanations. |
| `workflow.patterns` | Offered at the end of Start | Core components, page examples, and a docs page |
| `workflow.session` | "Work on my system" | Orients the agent, takes the person's goal, and routes it to a step or short sequence (add a component, run an audit, add a theme, redo color) |

`workflow.session` is where most individual steps get used. The person states a goal. `project.orient` reads the state and picks the steps. Steps with `entry: true` can also be started directly from the site.

## 5. Project state: `sistema.json`

```json
{
  "sistema": "2",
  "workflow": "start",
  "milestone": "foundations",
  "project": {
    "a11y_standard": "WCAG 2.2 AA",
    "theme": "light-dark",
    "density": "balanced",
    "stack": "react-tailwind"
  },
  "steps": {
    "project.assess":            { "status": "complete", "date": "2026-11-20" },
    "visual-language.direction": { "status": "complete", "date": "2026-11-20" },
    "color.scheme":              { "status": "complete", "date": "2026-11-21",
                                   "evidence": "contrast: 28/28 pairs pass" },
    "typography.scale":          { "status": "pending" }
  },
  "gates": { "direction-approved": { "date": "2026-11-20", "by": "owner" } },
  "routing": { "color": "map-existing" }
}
```

Field names are illustrative. V1 settles the schema. DESIGN.md (identity and visual language) and DECISIONS.md (the decision log) sit beside this file, as in plan 8.6. The living brief's other jobs move into this file.

## 6. How each channel renders the same files

| | Paste-in | MCP | Agent Skill |
|---|---|---|---|
| Workflow | Short starter prompt, about 30 lines: the run loop, the step list with their GET URLs, the gate rules | MCP prompt `start` plus `next_step` | `SKILL.md` holds the run loop. Steps are files in the skill folder. |
| Step | Fetched with GET from `{{sistema_url}}/raw/steps/<id>` when reached. A "full version" link expands everything into one prompt for clients that can't fetch. | Returned by `next_step` or `read` | A reference file loaded when the step is reached |
| Guide section | `/raw/...#section` link, fetched on demand | `read(id, section)` | Link to the hosted page, or bundled |
| Tool | GET URL with query parameters (plan Phase 2) | Typed tool call | Hosted GET URL. MCP tool if available. |
| State | Agent reads and writes `sistema.json` | Agent reads `sistema.json` and passes it to `next_step` | Same as paste-in |

**MCP tool surface (fixed size; doesn't grow with content):**

| Tool | Purpose |
|---|---|
| `search(query, kind?, topic?)` | Find guides, rules, steps, and workflows |
| `read(id, section?)` | Return one item, or one section of it |
| `next_step(workflow, state)` | Return the next step's procedure, requirements, tools, and expected evidence, given the state from `sistema.json` |
| `palette(colors)` | Same as the API |
| `contrast(pairs)` | Batch contrast check |
| `type_scale(base, ratio, roles)` | Type scale with registry rules applied |

That's six tools, with a seventh (`validate_tokens`) only if the V5 evaluation supports it. MCP prompts: one per workflow. MCP resources: guides, for clients that support resources.

**Limit to state plainly:** a hosted server can't see the repo, so it can't verify evidence. It can only return the procedure and the expected evidence. Evidence that comes from a tool (a contrast batch, token validation) is the main protection against overclaiming. That's another reason to prefer tool-produced evidence in every step.

## 7. Fit test: every current play and campaign in the new model

This maps all 25 plays and both campaigns, to check that the model holds up with real content.

| Current play | New step | Kind | Milestone | Disposition |
|---|---|---|---|---|
| establish-context | `project.assess` | orient | direction | **Merge** with positioning-brief. Add output classification (conforming, non-conforming, missing). |
| positioning-brief | `project.assess` | | | **Merge.** Bootstrap already replaced it with establish-context. |
| establish-visual-language | `visual-language.direction` | create | direction | Keep. Its output is the evidence for the Direction gate. |
| generate-design-md | `visual-language.design-md` | create | direction | Keep. |
| define-voice-and-tone | `content.voice-and-tone` | create | direction | Keep. Optional in Start. |
| generate-color-scheme | `color.scheme` | create | foundations | Keep. Shrinks from 118 lines to about 40 (Section 9). |
| generate-color-roles | `color.map-existing` | change | foundations | Keep. Used when color exists but doesn't conform. |
| generate-dark-mode | `color.add-theme` | change | maintain | **Reframe** as adding a theme to an existing scheme. A first-time dark theme is part of `color.scheme`. |
| generate-type-scale | `typography.scale` | create | foundations | Keep. Uses the type scale tool once V2 adds the API. |
| generate-shape-tokens | `shape.tokens` | create | foundations | Keep. Elevation stays here for now (see Section 8). |
| generate-spacing-tokens | `spacing.tokens` | create | foundations | Keep. Add a reference to the spacing guide. |
| generate-style-dictionary | `tokens.pipeline` | create | foundations | Keep. Its token check page is the evidence for the Foundations gate. |
| migrate-tailwind-tokens | `tokens.migrate-tailwind` | change | foundations | Keep. **Output paths conflict:** it writes `tokens/primitive/colors.json` and `tokens/semantic/colors.json`, while every other step writes `tokens/src/*.json`. Contracts make conflicts like this fail the build. |
| scaffold-core-components | `components.scaffold-core` | create | patterns | Keep. At 139 lines, it's the longest play and should probably split. |
| specify-component | `components.specify` | create | patterns | Keep. |
| implement-component | `components.implement` | create | patterns | Keep. |
| add-component | (sequence) | | | **Retire as a step.** It becomes the `workflow.session` route "add a component" = specify, then implement. |
| generate-page-examples | `components.page-examples` | create | patterns | Keep. |
| setup-documentation-site | `components.docs-site` | create | patterns | Keep. |
| audit-component | `components.audit` | check | maintain | Keep. **Overlaps** with accessibility-audit on accessibility. The shared part moves into rules both steps cite. |
| accessibility-audit | `accessibility.audit` | check | maintain | Keep. Reads the project's chosen standard instead of a fixed 44px threshold. |
| audit-token-coverage | `tokens.coverage-audit` | check | maintain | Keep. |
| session-start | `project.orient` | orient | maintain | Keep. Becomes the router at the start of `workflow.session`. |
| design-system-retrospective | `project.review` | check | maintain | Keep. |
| plan-next-iteration | `project.plan` | orient | maintain | Keep. |
| **Campaign: bootstrap** | `workflow.start` + `workflow.patterns` | | | **Split** at the Foundations gate. The 844-line duplicate is deleted. |
| **Campaign: audit-and-refactor** | `workflow.start` (Adopt door) + `workflow.session` | | | **Retire.** Assessment is now the first step of Start. Its audits become session routes. |

**Result:** 25 plays become 23 steps (two merges, one retirement into a route, one reframe). 2 campaigns become 3 workflows. Every play has a place.

## 8. What the fit test found

These were found while doing the mapping. Each needs a decision or a task before or during V1.

1. **Steps are fine, but the contracts have problems.** The current plays already have clear inputs and outputs. That's why mapping was easy. Writing them out exposed one path conflict (`migrate-tailwind-tokens`) and one missing guide link (`spacing.tokens`). There are probably more. V1 migration should add contracts first and fix whatever the build check reports.
2. **Topics with guides and no steps:**
   - **Motion** has a guide and no step.
   - **Depth** is folded into shape.

   **Recommendation:** Start includes motion only if a project asks for it. A `motion.tokens` step can be added under Growth later, built on demand rather than ahead of time. Depth stays in `shape.tokens`, which is renamed in its title to "Shape and elevation."
3. **Components have no guide.** Five steps work in this topic with nothing behind them except tokens and accessibility. This matches a gap the plan already suspected (9.2). It isn't a blocker for Start, because Patterns is a continuation. It needs filling before `workflow.patterns` is considered solid.
4. **DESIGN.md is written by several steps.** Section-level outputs (`design-md#direction`, `design-md#color`) are required, or skip checks will be wrong. That makes the DESIGN.md section list a schema decision for V1, tied to the Stitch format.
5. **Adopt depends on non-conforming detection.** Treating Start and Adopt as one workflow only works if `project.assess` can tell present-and-conforming from present-but-different. That's the hardest step to write well. It should be one of the first steps built and tested.
6. **The two gates sit on existing outputs.** Direction approval uses `style-preview.html`. Foundations approval uses `token-check.html`. No new artifacts are needed.
7. **Most form variables disappear inside workflows.** There are 6 distinct variables today. Four (`color_direction`, `color_mode`, `typography_direction`, `shape_direction`) become step `overrides` and are read from state inside a workflow. `{{project_context}}` (2 plays) becomes part of `project.assess`. `{{tailwind_colors}}` becomes something the agent reads from the repo.
8. **Patterns depends on the stack.** `components.scaffold-core` writes `tailwind.config.ts`. That ties Patterns to the default-stack decision (plan Section 6). Foundations stays stack-neutral apart from the Style Dictionary pipeline.

## 9. Worked examples

### 9.1 Step: `color.scheme` (from generate-color-scheme, 118 lines)

The procedure itself drops to about 30 lines. The knowledge it used to restate (the four color models, commitment level ranges, bans, required roles, contrast thresholds) moves to guide sections and rules, which the step cites by ID.

```markdown
---
id: color.scheme
title: Generate the color scheme
topic: color
kind: create
milestone: foundations
entry: false
requires: [design-md#direction, gate:direction-approved, project:a11y-standard, project:theme]
produces: [tokens/src/color.json, tokens/src/color.dark.json?]
tools: [palette, contrast]
knowledge: [guide.color#models, guide.color#roles, guide.color#dark-mode, guide.quality#commitment-levels]
rules: [color.roles.required, color.contrast.text, color.contrast.ui, quality.color.bans, quality.color.first-order-reflex]
evidence: Batch contrast result covering every on-* pair in every theme. All required pairs pass.
overrides: [color_direction, color_mode]
---

1. From DESIGN.md, take the color direction, brand seed, and commitment level. From sistema.json, take the theme and accessibility standard.
2. Pick the color model that fits (see guide.color#models). Record the choice.
3. Choose seeds: primary, a tinted neutral, and any secondary hue. Check them against quality.color.first-order-reflex.
4. Call the palette tool with all seeds in one request. Do not compute ramps yourself.
   Use the pre-built library ramps for error, success, and warning unless DESIGN.md names custom ones.
5. Assign every role in color.roles.required from the returned stops. Note the ramp and stop for each.
6. If the theme includes dark, assign dark values by tonal shift (guide.color#dark-mode). Write only the roles that change.
7. Call the contrast tool once with every on-* pair in every theme. Fix any failing pair by moving stops, then check again.
8. Write the files listed in `produces`. Include each pair's ratio in its $description.
9. Show the evidence. Append the decision (model, seeds, commitment level) to DECISIONS.md.
```

How each channel shows it:
- **Paste-in:** IDs become absolute links (`{{sistema_url}}/raw/principles/color/architecture#dark-mode`), and tools become GET examples with the exact request shape.
- **MCP:** `next_step` returns this text plus tool hints. The agent calls `read("guide.color", "dark-mode")` only when it reaches that point.

### 9.2 Workflow: `workflow.start`, paste-in starter prompt (generated)

```markdown
You are running Sistema's Start workflow. It takes this project from no design system
to a verified token system. Work through it step by step.

How to run it:
1. Read sistema.json in the project root. If it is missing, run the first step, which creates it.
2. Find the first step below that is not complete in sistema.json.
3. Fetch that step's instructions from its URL and follow them exactly.
4. When the step's evidence is shown, record the step as complete in sistema.json, then continue.
5. At a gate, stop and ask me to review. Continue only after I approve. Record the approval.
6. If a step's outputs already exist and pass its checks, mark it complete and move on.

Steps:
1. Assess the project: {{sistema_url}}/raw/steps/project.assess
2. Set the visual direction: {{sistema_url}}/raw/steps/visual-language.direction
   GATE: I approve style-preview.html
3. Write DESIGN.md: {{sistema_url}}/raw/steps/visual-language.design-md
...
9. Compile the tokens: {{sistema_url}}/raw/steps/tokens.pipeline
   GATE: I review token-check.html

Tools (use them; never estimate their results):
- Palette: {{sistema_url}}/api/palette?colors=primary:%23hex,neutral:%23hex
- Contrast: {{sistema_url}}/api/contrast?pairs=...
```

That's about 35 lines, compared with 844 for today's Bootstrap. The build fills in the step list, numbering, and URLs.

### 9.3 Step: `project.orient` (from session-start)

This barely changes. The difference is that it reads `sistema.json` and DECISIONS.md instead of the living brief. It turns the person's stated goal into a route: a step ID, or a short sequence such as specify then implement. Its list of seven hardcoded guide URLs is replaced by "load the `knowledge` of the steps you route to," so it never goes stale.

## 10. Decisions still open

| Decision | Recommendation | Settle in |
|---|---|---|
| Public names | **Decided (D1):** play and workflow | Done |
| `sistema.json` schema and DESIGN.md section list | **Decided (D6a, D7):** spec's 8 sections; schema finalized during the slice | V1 slice |
| Motion step | Don't build it now. Add it under Growth when a project asks for it. | Later |
| Components guide | Write it before `workflow.patterns` is considered complete | V3 |
| Split `components.scaffold-core` | Decide once its contract is written | V1 migration |

## 11. Validate with a thin vertical slice before migrating everything

Agreeing on the model now doesn't prove it works with real content. So V1 builds one thin vertical slice before migrating all 25 plays:

1. Build the schemas, the build checks, and the generators for paste-in and raw step output, for workflows and steps only.
2. Convert only `workflow.start` and four of its steps: `project.assess`, `visual-language.direction`, `color.scheme`, and `tokens.pipeline`. The others are stubbed.
3. Run the paste-in starter on two scratch projects: one empty, and one with existing Tailwind colors (the Adopt path). Use a Vercel preview URL.
4. **Model fit review with the owner.** Did skip and resume work? Did the step sizes feel right? Did the gates land in the right places? Did the agent call the tools? Was anything missing from the contract? Revise this document before migrating the rest.

Only after that review does the rest of the content move. A second fit review comes at the end of V1, once everything is migrated. It checks the full catalog against the criteria in Section 7, and checks that no step restates a guide.
