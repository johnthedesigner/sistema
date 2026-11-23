# v2 Decisions

A record of owner decisions for the v2 overhaul, with dates and reasons. Earlier decisions (single merge, capability model, gates, Start scope) are in `SESSION_LOG.md` and `logs/v2-phase-0.md`.

## 2026-11-14 — Phase 0 gate

Approved by the owner. Evidence: `logs/v2-phase-0.md` (V0.7) and `docs/v2/retro-phase-0.md`.

## 2026-11-14 — V1.0 decision session (`decision-brief-v1.md`)

The owner accepted every recommendation.

| # | Decision | Detail |
|---|---|---|
| D1 | Public names | Steps are **plays**. Ordered sequences are **workflows** (replacing "campaign"). |
| D2 | Milestones and practice | Milestones: **Direction, Foundations, Patterns**. One practice: **Maintain and grow**. Schema enum: `direction`, `foundations`, `patterns`, `maintain`. |
| D3 | Default stack | Web, React, Tailwind is the documented default. Foundations stays stack-neutral (DTCG to Style Dictionary to CSS custom properties). Only Patterns plays assume the stack. Other stacks are "loosely supported." |
| D4 | Content location | New top-level `content/`: `plays/<topic>/<name>.md`, `workflows/<id>.md`, `rules/<topic>.yaml`, `opinions/<id>.md`, and `guides/<topic>.md` (moved from `kb/principles/` in V1.12). Reference material moves to internal `reference/` in V1.16. Sistema-authored content drops the stub and versioning system, since git provides history. |
| D5 | Play format | Markdown with YAML frontmatter: contract in frontmatter, procedure in body. |
| D6a | DESIGN.md sections | Exactly the spec's 8 sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Outputs are named `design-md#<section>`. |
| D6b | DESIGN.md tokens | `tokens.pipeline` regenerates DESIGN.md front matter from the DTCG files on each compile. DTCG is the only place values are written. |
| D7 | `sistema.json` and the accessibility choice | Start from capability-model Section 5. `project.assess` asks for the accessibility standard and density. `visual-language.direction` reads them. |
| D8 | Rules schema | Plan 8.3, plus `parameters` (values keyed by standard and level) and `checked_by` (required for blocking rules). One YAML file per topic. IDs are `topic.name`. |
| D9 | Public URL for slice runs | Push `v2` when the slice is ready to run (V1.4), and use the Vercel preview branch URL with protection off or a bypass token. Until then, `v2` stays local. |
| D10 | Who runs the slice | The owner runs the Start starter in a fresh Claude Code session on each scratch project. Claude reviews outputs and may run extra passes. |

Also accepted, as listed under "Assumed unless you object":
- `kb/principles/` becomes the guide type.
- `kb/reference/skills/` is treated as reference material.
- The registry's first worked case is display line height, with the value decided in V2.
- Plays keep `overrides` for standalone use on the site.

## 2026-11-14 — Clarification during V1.1

- **Guide IDs** are `guide.<topic>.<name>#<anchor>`, because several topics have more than one guide (color has three). D4's `content/guides/<topic>.md` becomes `content/guides/<topic>/<name>.md`. Anchors are GitHub-style heading slugs.
- **Optional items:** a `?` suffix marks an optional output (in `produces`) or an optional play (in a workflow sequence). An optional play's outputs cannot satisfy a required play's `requires`.
- **Shared outputs:** a `change` play may write a file that a `create` play also produces (for example `color.map-existing` and `color.scheme`). Two `create` plays may not.

## 2026-11-17 — V2.0 tool API outline (`tool-apis.md`)

Approved by the owner, with:

| # | Decision | Detail |
|---|---|---|
| D11 | Contrast default | With no standard given, contrast checks against WCAG 2.2 AA and says so in the response (`"defaulted": true`). Plays always pass the project's standard. |
| D12 | Small type sizes | The type scale defaults to a major third ratio with two steps down (10px and 13px under a 16px base). Sizes under 12px get an advisory note. There is no minimum-size rule. |

## 2026-11-17 — Usage analytics (owner request)

| # | Decision | Detail |
|---|---|---|
| D13 | Usage analytics | Capture detailed usage that can be attributed to one person through an anonymous ID (a UUID, no personal data). Follow that person across the acquisition funnel on the site and into later use: copied prompts, agent fetches of plays and workflows, tool calls, and the MCP server. Built in V2 (site, prompts, tools), extended in V4 (MCP), with test traffic excluded in V5. The outline (`docs/v2/analytics.md`, task V2.7) settles the event list, how the ID travels, privacy, and opt-out. **No tracking across visits** (owner, 2026-11-18): nothing is stored on the visitor's device (no cookies or browser storage), so a site visit isn't linked to earlier or later visits. This is meant to avoid the EU consent banner obligation. Design approved 2026-11-18 (`docs/v2/analytics.md`): keep all location data, no opt-out for projects or browsers, and tool inputs (colors, roles) may be recorded. |

## 2026-11-18 — V3.0 decision brief (`decision-brief-v3.md`)

| # | Decision | Detail |
|---|---|---|
| D14 | Reference project | A B2B operations dashboard: "Relay", a dispatch dashboard for a small field-service company (5 to 20 desktop users, all day, dense, WCAG 2.2 AA). |
| D15 | Where it lives | `examples/relay/` in this repo, kept out of the site's build, type check, lint, tests, file tracing, and content checker. |
| D16 | Its stack | Sistema's default: Next.js with React, Tailwind CSS v4, and shadcn/ui as the component foundation. |
| D17 | Who runs it | Claude runs it through a subagent; the owner approves at each gate. To keep the run honest, the subagent starts with only the paste-in prompt, works in a directory outside this repo, and is told not to read the Sistema source. Every question it asks, and every place it hesitates or works around a play, is logged. The result is copied into `examples/relay/`. |
| D18 | Guide template | Sistema's position; the options and how to choose; rules (from the registry); worked example (reference project); failure modes; checking the work. Guides end with links to their plays and contain no procedure. |
| D19 | Components guide scope | How to build components on the system: foundation choice, anatomy, states and variants, token use, the accessibility baseline per component family, naming and API conventions, and documentation. No per-component specs. |

## 2026-11-18 — V3.1 `tokens.add-mode` outline (`add-mode-outline.md`)

| # | Decision | Detail |
|---|---|---|
| D20 | Modes model | Three independent kinds of mode (theme, density, motion). Each mode is a file of only the changed tokens, compiled to `[data-theme]` (with the OS fallback), `[data-density]`, and the `prefers-reduced-motion` media query plus `[data-motion]`. Precedent: Radix Themes (`appearance` apart from `scaling`), Ant Design (dark and compact algorithms combine), Atlassian (`colorMode`). |
| D21 | Plays and state | `color.add-theme` retires into `tokens.add-mode`, and the session route becomes "Add a mode". `sistema.json` keeps `project.theme` and `theme_primary` and adds `project.modes` for density and motion. When a project has no motion tokens, the play creates the motion guide's minimal set before adding reduced motion. |
| D22 | Ending a workflow | Modes aren't offered inside Start. At the end of a workflow, the agent lands the finish first: what the project now has and where to see it, with every step done. `continue` moves to "Work on the system", and follow-ups (the next workflow, the session routes) are mentioned briefly as options for any time, not as next steps. The agent doesn't ask whether to start one. |

## 2026-11-20 — Aesthetic baseline (`aesthetic-baseline.md`)

| # | Decision | Detail |
|---|---|---|
| D23 | Craft and taste | Visual decisions split into **craft**, a contemporary baseline Sistema sets by default as overridable opinions with advisory review rules, and **taste** (color presence, warmth, roundness, type voice, density, how quiet levels separate), which the direction play asks the person about with two or three options rendered on the product's own content, described in plain words. "Functional" means no purely decorative styling, not bare-bones. Design traditions explain options; they are never what the person approves. `opinion.look-is-yours` is rewritten to match. |
| D24 | Emphasis and separation | Every foundation includes emphasis surfaces (subtle, featured, inverse, brand, with their text roles) and a set of separation and lift treatments (space, tone, hairline, shadow, inset, color block; quiet and strong). They are opinionated parts of the foundation, not questions for the person. Pages choose a treatment by the role of the content. The direction play records an emphasis map, and review pages show a small composition. |
| D25 | Specimen tool and order | A fourth tool renders a fixed specimen and composition from a few parameters, for review pages and comparisons. This work becomes V3.4, before the guide rewrites: source intake (every BACKLOG candidate that meets the criteria), the tool, the content, a Relay re-run from Direction as the test, and a variety test added to V5. The current Relay revision is not approved; the re-run replaces it. |

## 2026-11-20 — Palette rules (`palette-next.md`)

| # | Decision | Detail |
|---|---|---|
| D26 | Three fixed palette rules | The palette tool places stops on an eased contrast curve (finer steps near white and black, stop 500 unchanged), gives every hue the same chroma at the same lightness (the seed sets the strength; a soft limit keeps chroma under the on-screen maximum), and turns yellows toward orange as they darken. Each rule is one named constant; no stop is adjusted on its own. Stop meanings shift: tints and containers move from 100 to 150, and darker roles move one stop lighter. Approved by the owner as proposed. |

## 2026-11-20 — Relay direction review

| # | Decision | Detail |
|---|---|---|
| D27 | Accent seeds from the library | When a project has no brand color, the direction play proposes the accent from Sistema's palette library: a colorful palette at one of its bright middle stops (400 to 600), with two or three such stops as the options. A brand color the project already has is still a fixed point. Owner's call after rejecting petrol in the Relay re-run. |
| D28 | No count on featured items | `quality.craft.emphasis-scarce` keeps strong emphasis rarer than the quiet levels and follows the emphasis map, but sets no number of featured items per screen. "One featured item" stays only in the specimen tool's example compositions. |
| D29 | Dark surfaces step one stop | In a dark theme, text and fills start at the mirrored stop (1000 − n), which gives near-equal contrast on Sistema's ramps, and surfaces are chosen by step size: page 950, panels 900, featured 850, menus and dialogs 800, hover one stop lighter (`color.dark.surface-steps`). Mirrored surface stops (950 to 850) made the dark quiet step about seven times the light one. The owner chose one stop (option B in `comparisons/dark-steps.html`) over a new dark end value or mixed values, keeping the palette unchanged. |
| D30 | One decision for both themes | Each visual treatment is decided once and translated to dark, not tuned per theme (`opinion.both-themes`, `quality.craft.both-themes`); components are reviewed in light and dark side by side. Selection is a neutral step past hover with an accent detail, not an accent fill (`quality.craft.quiet-states`). Messages and banners sit on a neutral surface with status color in the icon, title, or edge (`opinion.status-as-detail`). From the owner's review of Relay's foundations, where the accent selected row and the status-filled messages were fine in light and far too heavy in dark. |
| D31 | The system reference is the person's choice | `components.docs-site` presents Storybook and a page in the app with what each gives and costs, recommends one for the project, and lets the person choose; it no longer says "not Storybook". Both read token values from the compiled CSS and import the real components. Relay uses Storybook, as the example that shows what Sistema produces. Owner's call. |

## 2026-11-22 — MCP server (V4.0)

| # | Decision | Detail |
|---|---|---|
| D32 | MCP packages | `mcp-handler` 2.x with `@modelcontextprotocol/server` 2.x (the MCP TypeScript SDK v2, which replaces `@modelcontextprotocol/sdk`) and `zod` 4, on Node 20 or later. It serves the 2026-07-28 MCP spec natively and falls back to stateless Streamable HTTP for older clients, from one Next.js route; no sessions, no Redis. Tools are registered with `registerTool` and full Zod schemas; prompts with `registerPrompt`. OpenTelemetry peers are optional and left out for now. The plan's `@modelcontextprotocol/sdk` 1.x line is not used. |
| D33 | Specimen joins the MCP tools | The fixed tool surface (capability model section 6) gains `specimen`, since the direction play depends on it: `search`, `read`, `next_step`, `palette`, `contrast`, `type_scale`, `specimen`. |


## 2026-11-22 — MCP clients and Agent Skills (V4.2 to V4.4)

| # | Decision | Detail |
|---|---|---|
| D34 | The copied MCP prompt calls a tool | Clients don't let the model call an MCP prompt (in Claude Code the person types `/mcp__sistema__start`), so the prompt box's MCP option says "call next_step for the "start" workflow". The server's prompts stay, for clients that list them. `next_step` leads a first call with how the workflow runs. From the V4.3 client tests. |
| D35 | One text, three channels | Workflow and play text renders for the channel it's delivered through (`RenderContext.channel`): paste-in names URLs to fetch, MCP names `next_step` and `read`, and a skill names its own `references/` files. The content files stay the same. |
| D36 | Agent Skills | One skill per workflow, `sistema-<workflow>`, built at build time and downloaded from `/skills/<name>.zip`. `SKILL.md` holds the run loop; the workflow's plays, and any play they name, are reference files; tools and guides stay hosted. Front matter uses only `name` and `description`, the fields every client reads. A downloaded skill carries no visit ID, so skill runs are counted only by their tool calls. |
| D37 | Agent pointers out of the page | The agent line at the top of every page is replaced by a "For agents" corner button whose panel stays in the HTML (fetch tools read it), and a `<link rel="alternate" type="text/markdown">` to the page's plain text. "For agents" leaves the main navigation. Owner's call. |

## 2026-11-23 — No paid test runs before launch

| # | Decision | Detail |
|---|---|---|
| D38 | Plan the harness, don't run it | Owner: Sistema is a side project, and the spend isn't worth the risk yet. v2 goes to launch without tests that cost money to run (behavior tests, the three-way comparison, tool evaluations by agent runs). Phase 5 leaves the harness designed and ready to run, and revisits it if Sistema draws enough attention or usage. The plan's Phase 5 gate (pass rates recorded, tool decisions from evidence) changes accordingly; the revised gate is in `tasks/v2/phase-5.md`. |
