# Sistema: Plan for the Next Version

*Design system foundations, in practice.*

This plan is for a Claude Code agent working in the Sistema repository. It describes what to change, why, in what order, and how to tell when each phase is done. It was written from a review of the live site (sistema.johnthedesigner.com) and a series of planning conversations with the owner. The agent has not seen the code yet. Section 2 tells the agent how to begin.

---

## 1. How to use this plan

- Read the whole plan before changing anything.
- Work one phase at a time, in order. Each phase ends with a gate. Do not start the next phase until the gate is met and the owner has approved it.
- Each phase should land as one or more focused pull requests. Do not mix phases in one pull request.
- Where this plan describes the current site, it is based on the live site, not the code. Confirm each claim in the code before acting on it. If the code disagrees with the plan, stop and report the difference.
- Items marked **Open decision** are not settled. Present options and a recommendation to the owner. Do not decide them alone.
- The owner prefers to see a high-level outline before any full draft of user-facing copy. Follow that for all new pages and guides.

### Writing style for all user-facing copy

- No exclamation points.
- No em dashes.
- Avoid words like "elevate," "unlock," and "seamless."
- One idea per sentence.
- Plain language. No internal shorthand.
- Be honest about tradeoffs. Do not overclaim. If a claim can't be backed by a test or a source, soften it or cut it.

---

## 2. Phase 0 starts with a repo audit

Before fixing anything, produce a short written audit of the repository and share it with the owner. Cover:

1. **Framework and structure:** Next.js version, routing approach, where pages live, how content is stored and rendered.
2. **Content sources:** where plays, campaigns, knowledge base entries, and tool pages come from. Note which are hand-written pages and which are generated from files.
3. **The raw endpoint:** how `/raw/...` is served, and how it relates to the rendered pages.
4. **Templating:** how `{{sistema_url}}` is meant to be filled in, and why it isn't filled in on some pages.
5. **Tools and APIs:** the code behind `/api/palette`, `/api/contrast`, and the type scale page. Note the algorithms and any constants.
6. **Tests and CI:** what exists today.
7. **The site's own design system:** whether the site has its own tokens, DESIGN.md, or living brief.

This audit grounds every later phase. Update this plan's assumptions if the audit contradicts them.

---

## 3. The narrative

Every part of Sistema should tell the same story: the home page, onboarding, guides, plays, tools, and the MCP server. This is the story.

**The shift.** AI tools now let designers, developers, PMs, and people who span roles build working prototypes quickly. That changes the shape of design deliverables. Teams can answer questions sooner and test with users earlier.

**The problem.** Without solid foundations, every screen an agent builds invents its own values. Output drifts. Design and code split apart. Agents also report large progress that later turns out to be partial or broken.

**The need.** Foundations that are decided, written down, measurable, and available to the agent at the moment it makes a choice, at low token cost.

**What Sistema provides.**
- A method: three milestones and two ongoing practices.
- Clear, published opinions: defaults with reasons.
- Guides: Sistema's own take on how foundations work in practice.
- Tools: exact calculations and measurements, so agents don't estimate.
- Agent integration: paste-in prompts and an MCP server, two ways to reach the same content.

**The payoff.** Foundations become the working bridge between design and development. Fast prototyping becomes trustworthy. That also makes the case for institutional support, which design systems have historically struggled to earn.

**What Sistema stays out of.** Taste, product direction, and technical choices beyond what the method needs. Sistema has strong opinions about process, structure, and the quality floor. It does not tell users what their product should look like.

---

## 4. The foundational principle: the repo is the source of truth

This is not one opinion among many. It is a prerequisite for using Sistema.

- Every foundation decision lives in files in the project's repository: tokens, rules, decisions, and agent instructions.
- Design tools receive exports from the repo. They are not the source.
- Teams that want a design tool to be the source of truth are not a fit for Sistema's method. The onboarding should say so plainly and kindly, near the top.

All formats Sistema produces must be portable (plain markdown, JSON, DTCG). That keeps future bridges to other tools a conversion job, not a redesign.

---

## 5. Milestones, practices, and categories of work

### 5.1 Milestones (have a finish line)

Names are working names. **Open decision:** final naming, including whether "Patterns" becomes "Components & Patterns."

| Milestone | Purpose | Deliverables | Exit criteria (measured) | Enables |
|---|---|---|---|---|
| **Direction** | Agree on what the product is and how it should feel before any values exist. | DESIGN.md overview sections, approved style preview page, decision log entries. | Style preview exists with all required sections. Owner approval is logged. Project rules file has accessibility target and density set. | Team alignment before token work. |
| **Foundations** | Turn direction into a complete, verified token system the agent can use. | DTCG token source files, compiled CSS custom properties, token check page, agent instructions in the repo. | Token validator passes. Contrast matrix passes for every required pair in every theme. Compiled output matches source. | Prototyping that looks like one product. |
| **Patterns** | Build core components and page compositions on the tokens. | Core components, 1 to 2 example pages, a simple docs page. | Token coverage check passes on component files. Accessibility checks pass. Owner approval is logged. | User testing and team adoption. |

### 5.2 Practices (ongoing)

**Open decision:** whether these stay separate or merge into "Maintenance & Growth." Settle this during content model work in Phase 1.

- **Maintenance:** keeping what exists correct. Checks, audits, drift fixes, and the decision log.
- **Growth:** extending the system on purpose. New components, themes, brands, platforms, and more teams adopting it.

### 5.3 Categories of work

The playbook currently groups plays into six numbered stages ("System definition" through "Stewardship"). Replace these with the five names above: Direction, Foundations, Patterns, Maintenance, Growth. A play's category then tells the user where it fits in the story. The site should not carry a second taxonomy.

### 5.4 Existing systems

Users with an existing system don't start at Direction. An assessment play measures where the project stands and names its current milestone. This replaces the current "Audit and Refactor" framing.

---

## 6. Published opinions

Opinions become part of onboarding: the first explanation of what Sistema is and how it works. Each opinion has three parts: the default, the reason, and when you'd choose otherwise. Overrides are normal. A project logs them with a reason.

Opinions fall into three groups. This is a starting list for the owner to edit. Sistema already holds most of these. Today they are buried inside prompts.

**Process**
- Direction comes before any values.
- Tokens come before components.
- A person approves direction before tokens are generated.
- No step counts as done without evidence: a tool result, a passing check, or a rendered page.
- Decisions get logged with their reasons.

**Structure**
- Tokens are authored as DTCG JSON and compiled. The compiled output is never edited by hand.
- Two tiers: primitive and semantic. A component tier is optional.
- Palettes are generated in OKLCH.
- Output is CSS custom properties, plus framework mapping where needed.
- Token names follow one consistent pattern that states the role.
- The default path is web with React and Tailwind. Other stacks are supported more loosely. **Open decision:** confirm this default.

**Quality floor**
- Every project chooses an accessibility standard that fits its use case during Direction. Specific requirements come from that standard, not from Sistema. See Section 9.3.
- Sistema encourages going beyond the minimum that applies. That guidance depends on context and is advisory.
- Quality signals (the "AI slop" reflex checks) are advisory, never blocking.

**What Sistema does not set**
- Sistema does not set universal numeric thresholds for specific measures, such as touch target size or contrast ratios. Those come from the project's chosen standard or from the project's own decisions.
- Sistema's own defaults cover process and structure. Where a guide offers a number (for example, a typical line height range for display text), it is guidance with a stated context and reason, not a rule applied to every project.

---

## 7. The site

The custom Next.js site stays custom. The site is also a test case for Sistema: its own design system should be built and maintained with Sistema's method, milestones, and tools.

### 7.1 Three modes

1. **Start working.** This is what visitors see when they land. They pick their milestone, copy a prompt or connect the MCP server, and use the tools. The current interactive features (copy prompt, tool pages) grow here.
2. **Guides.** Learning and doing: Sistema's take on foundations in practice, anchored in the reference project.
3. **Reference.** Looking things up: rules, opinions, tool details, file formats.

The site should not become only a documentation site. Getting to work comes first.

### 7.2 IA and layout research (do this before redesigning)

Review 6 to 8 sites and write down layout, navigation, and IA patterns worth borrowing. Share the findings with the owner before proposing a structure.

- **Design system sites:** GOV.UK Design System, Carbon, Shopify Polaris, Primer, Material 3, Atlassian, Adobe Spectrum.
- **Docs sites:** Stripe, Tailwind, MDN.

Patterns to look for: navigation grouped by foundations and components, "when to use and when not to use" sections, live specimens, searchable token tables, clear start paths, on-page tables of contents, previous and next links, last-updated dates, copy buttons.

### 7.3 Features needed for the MCP server

- A connect page with per-client setup, a config snippet to copy, and a way to confirm the connection works.
- Play pages that offer both options: copy the prompt, or run it through the server.
- A prompt builder that fills in project details before copying.

### 7.4 Upkeep note

A custom site means search, navigation, and tables of contents are built by hand. Use small libraries where they fit (for example, Pagefind for search, MDX for content). Record this as ongoing upkeep.

---

## 8. Content model

This is the core structural change. The past bugs (broken links, unfilled placeholders, step numbers that drifted) came from content being copied and edited in many places. The fix is a content system with one source for everything.

### 8.1 Content types

Every piece of content is a typed file with required fields, validated at build time.

| Type | Purpose | Public |
|---|---|---|
| `guide` | Sistema's synthesized take on a topic. | Yes |
| `play` | A structured prompt for one task. | Yes |
| `campaign` | An ordered list of play IDs. Never a copy of play text. | Yes |
| `rule` | One measurable rule. See 8.3. | Yes |
| `opinion` | One published default with reason and alternatives. | Yes |
| `tool` | One tool: inputs, outputs, limits, and the rules it applies. | Yes |
| `reference` | Collected source material from other systems and standards. | **No** |

### 8.2 Build rules

- Links point to content IDs, not URLs. The build resolves them.
- Campaigns are assembled from plays at build time.
- Step numbers, counts, and indexes are generated. Nobody types them by hand.
- The human page and the raw agent version are both generated from the same source.
- Steps refer to other steps by name, never by number.
- Templates never contain literal dates. Prompts use a placeholder the agent fills with today's date.
- The build fails on: a broken reference, an unfilled placeholder, a missing required field, a relative URL in agent-facing text, or a rule restated in prose instead of referenced.
- Each item shows a "last reviewed" date. The build flags items past a review threshold.
- A "what uses this" lookup lists every item that references a given ID. Run it before editing anything structural.

### 8.3 Rules registry

Rules are separated from every place they're used or shown. Guides, plays, tool defaults, checks, and site displays all read from the registry. No one restates a rule in their own words.

Example entry (illustrative; finalize the schema in Phase 1):

```yaml
id: type.line-height.display
statement: Display text uses a line height between 1.0 and 1.1.
reason: Large text needs tighter leading to read as a single unit.
layer: sistema-default        # standard | sistema-default | project
severity: advisory            # blocking | advisory
measure:
  kind: range
  min: 1.0
  max: 1.1
applies_to: type roles tagged "display"
applies_when: Latin scripts; can be overridden by the project's type decisions
implemented_by: [tool.type-scale, check.type-scale]
sources: [ref.butterick.line-spacing]
```

Fixed algorithm settings (for example, the palette lightness curve and chroma envelope) live in the same canonical place, so tools and guides can't disagree about them.

### 8.4 Three layers of rules

1. **Standards:** published requirements, applied according to what each project selects. The accessibility standard is chosen per project (Section 9.3). Valid token structure (DTCG) applies to every project.
2. **Sistema defaults:** process, structure, naming, tiers, and quality signals. Overridable with a logged reason. Sistema defaults do not set universal numeric thresholds for specific measures.
3. **Project rules:** set by the user. The chosen accessibility standard, brand constraints, density, and any thresholds stricter than the standard. Agreed during Direction and Foundations.

Standard-derived rules in the registry are parameterized by the standard and level. For example, the registry stores contrast and target size requirements for each supported standard and level. A project's checks apply only the ones its chosen standard requires, plus any stricter values the project sets.

### 8.5 Play contracts

Each play declares its intent so it can be tested.

```yaml
id: play.generate-color-scheme
category: foundations
milestone: foundations
inputs:
  - DESIGN.md (direction sections)
  - sistema.json (project rules)
outputs:
  - tokens/src/color.json
  - tokens/src/color.dark.json   # when theme includes dark
must_call: [tool.palette, tool.contrast]
must_not: [compute palette ramps by hand]
rules: [color.contrast.text-aa, color.contrast.ui-aa, color.roles.required]
evidence: contrast matrix result attached to the step summary
```

### 8.6 Project state files (in the user's repo)

The current split between LIVING_BRIEF.md and DESIGN.md confuses users and agents. The guide says plays read DESIGN.md first. Most plays actually read LIVING_BRIEF.md.

Recommended model. **Open decision:** confirm with the owner.

- **DESIGN.md:** the file agents read. It follows the Google Stitch format and holds identity and visual language.
- **DECISIONS.md:** a plain decision log with dates and reasons, including overrides of Sistema defaults.
- **sistema.json:** machine-readable state. Project rules, current milestone, and the last check results.

Provide a migration play for existing users who have LIVING_BRIEF.md.

---

## 9. Guides, reference material, and the reference project

### 9.1 Guide structure

The current guides often feel thin. They explain what to do and why, but rarely how, with what example, or how to verify. That is a likely cause of inconsistent results. Every guide follows the same structure:

1. **Principle:** Sistema's position, stated plainly.
2. **Rules:** pulled from the registry, not restated.
3. **Procedure:** step by step.
4. **Worked example:** real values from the reference project.
5. **Failure modes:** what usually goes wrong and how to spot it.
6. **Verification:** which tool or check proves the work is right.

The human page leads with the summary, the reasoning, and live specimens (real OKLCH ramps, rendered type scales, radius and elevation side by side). Agent material sits lower or only in the raw version.

Rewrite first: color, tokens, typography, and quality signals.

### 9.2 Internal reference material

- Move all collected source material (the design system crawls, standards copies, agent skill sources, and the named-system DESIGN.md files) out of the public site and into an internal folder in the repo. It is used for writing guides and is never routed or published.
- Keep a public Sources page for credit and attribution.
- Keep licensing notes with each source.
- Audit the material for staleness and refresh it where needed.
- Run a gap analysis against the guide topics. Likely gaps to confirm: theming and multiple brands, density, forms, iconography, and data visualization.
- Plays that currently fetch reference pages (for example, the DESIGN.md spec) need a published replacement: either a Sistema guide or a public reference page that Sistema owns.

### 9.3 Accessibility, chosen by use case

- During Direction, each project chooses the accessibility standard and level that fit its use case. Examples: WCAG 2.2 AA for most web products, a legal requirement such as Section 508 or EN 301 549 where it applies, AAA criteria for specific audiences, or platform guidelines for native apps.
- The choice is recorded in the project rules file. Checks and plays read requirements from it.
- An accessibility guide helps users choose. It explains the options, what each requires, and when each fits. It also suggests where exceeding the minimum is worth it for the use case, as advice.
- Automated checks catch only part of accessibility. The docs must list what still needs manual review, so a passing check is never read as "accessible."
- Remove hardcoded thresholds from current plays. For example, several plays require 44 by 44 pixel touch targets for every project. Replace these with references to the project's chosen standard.

### 9.4 The reference project

A sample product taken through all three milestones with Sistema. It is committed, not optional.

- Every guide's worked examples use this one product, so examples stay consistent across topics.
- The behavior tests run against it.
- It shows when content stops working in practice.
- Keep it small on purpose.

**Open decision:** the product. Recommendation: a fictional B2B dashboard, since that matches what most users build.
**Open decision:** location. Recommendation: a folder in this repo, so changes to content and the example land together.

### 9.5 The site as a second test case

The site's own design system goes through the same milestones, with its own DESIGN.md, DECISIONS.md, and sistema.json. That's also good material for explaining the method.

---

## 10. Tools

### 10.1 Why agents skip tools today

Two causes were found on the live site:

- The Bootstrap campaign's color step (Step 4) never tells the agent to use the palette generator. It only mentions the contrast API.
- The standalone Generate a Color Scheme play does mention the palette API. It uses the unfilled `{{sistema_url}}` placeholder, so the fetch fails and the agent improvises.

Fixes:
- Play contracts name required tools (see 8.5).
- Prompts state the requirement directly: "Use the palette tool. Do not compute ramps yourself."
- Checks confirm that outputs match what the tool would produce.

### 10.2 Audit of current tools (from the live site; confirm in code)

**Contrast checker** (`POST /api/contrast`)
- Works. The output is clear and compact. Example: `#6B7280` on `#FFFFFF` returns 4.83 with pass and fail results per criterion.
- Accepts hex only. A non-hex color (`red`) returns a 400 error. Sistema promotes OKLCH, so it should also accept `oklch()` and `rgb()`.
- One pair per call. A full role matrix takes many calls.

**Palette generator** (`POST /api/palette`)
- Works with several named seeds at once. Body: `{ "colors": { "name": "#hex" } }`.
- Error messages are helpful.
- GET returns 405. The input format isn't documented where agents look.
- Confirm the play prompt uses the correct body shape.

**Type scale calculator** (`/tools/type-scale`)
- A page only. There's no API.
- Its default output disagrees with Sistema's own rules. At 16px and a 1.333 ratio, it suggests a 9px caption and a 0.969 line height for display text. The type play requires 1.0 to 1.1 for display.

**General**
- No index or machine-readable description of the APIs. `/api` returns 404.

### 10.3 The tool test

Something should be a tool only if all three are true:
1. It's a calculation or measurement with one right answer.
2. Models get it wrong or produce inconsistent results.
3. A person or a current play needs it today.

A future MCP server or pre-commit hook is not a reason to build a tool.

### 10.4 Candidates

| Candidate | Verdict | Notes |
|---|---|---|
| Batch contrast checking | Build | The color step needs every pair checked. Extend the existing API. |
| OKLCH and rgb input for contrast | Build | Part of the existing tool, not a new tool. |
| Type scale API | Build | Apply legibility and line-height rules from the registry. Fix the page defaults at the same time. |
| Token file validator | Likely | People could paste a file on the site, and plays could call it. Confirm with evaluation. |
| Dark mode mapping | Maybe | Only if the color guide settles on one fixed method. Confirm with evaluation. |
| Token coverage scanner | Contingent | Needs to read the user's repo. Only if a local runtime exists. |
| State snapshot and token lookup | Contingent | Low-token context for agents. Only useful with repo access, so it needs a local runtime. A hosted MCP server can't see the repo. |
| Spacing scale generator | No | Simple enough to live in a guide. |
| Style Dictionary config generator | No | A template, not a calculation. |
| OKLCH and hex conversion | No new tool | Build it into the existing tools. |

### 10.5 Decide with evidence

For each "Likely" or "Maybe" candidate, run an evaluation before building:

1. Write a small set of tasks the tool would handle (for example, check 20 color pairs, or build type scales for three densities).
2. Have an agent do them with and without the tool, several times each.
3. Measure error rate, variation between runs, and token cost.
4. Build only if the gap clears a threshold set in advance.

The same evaluation measures whether agents actually call a tool when it's available. Keep the results as tests, so a later prompt change that stops agents from using a tool shows up as a failure.

### 10.6 Hosted and local tools

- **Hosted:** math and knowledge. Served by the website and the MCP server.
- **Local:** anything that reads the user's repo. Only exists if a local package is built, which is contingent.

---

## 11. Connecting design and development tools

Committed:
1. **Portable source in the repo.** DTCG tokens and plain-file rules and decisions. Mostly in place already.
2. **One-way export to design tools.** Convert the full token set into a format Figma can import as variables. The palette tool already exports Figma variables for one palette, so extend that. Confirm Figma's current import formats before building, since they change often.

Guidance only:
3. **Agents reading from design tools.** Guides can explain how to use Figma's MCP server alongside Sistema. Sistema builds nothing for this.

Out of scope:
4. **Two-way sync.** Existing tools such as Tokens Studio already do this. It also conflicts with the repo-as-source-of-truth principle.

---

## 12. MCP server (committed)

Sistema will offer two ways to reach the same plays, guides, and tools: paste-in prompts and a hosted MCP server. Both stay supported. Both are generated from the content model, so neither is a hand-maintained copy.

### 12.1 Why both

The knowledge is the same either way. What differs is how the agent reaches it.

- **Calling tools.** Paste-in prompts make the agent build HTTP requests from text. Sistema's APIs need POST with a JSON body. Many agents' built-in fetch tools only send GET requests (Claude Code's web fetch is one). They fall back to shell commands that often need permission. Claude.ai can't POST at all. MCP exposes tools as named, typed functions the agent calls directly.
- **Context cost.** A paste-in campaign loads about 4,200 tokens up front, and each reference fetch loads a whole page. MCP can return only the next step or the needed section. The catch: every MCP tool's description sits in context on every turn, so the tool list must stay short.
- **Being present.** Paste-in only exists in a session if someone pastes it. MCP is available in every session. Agents still under-use available tools unless prompted, so plays must still name required tools.
- **Staying current.** Pasted prompts are snapshots. MCP always serves the current version, which means it needs versioning so behavior doesn't change under users without notice.

What MCP does not fix: thin content, agent judgment, or anything that needs to read the user's repo. A hosted server can't see the repo.

Paste-in remains the right choice for people who prefer it, for quick one-off tasks, and for clients without MCP support. It also gets better in Phase 2 (GET support for tools, absolute URLs, shorter prompts, a plain index).

### 12.2 What the server offers

- **Tools:** knowledge base search, fetch a guide or a section of one, palette, contrast (including batch), type scale, and the validator if the evaluation supports it.
- **Prompts:** plays as named prompts. Client support for MCP prompts varies, so tools matter more than prompts.
- Keep the tool list short. Every tool description costs context on every turn.

### 12.3 Stack and hosting

No change to the stack or to Vercel hosting. Confirm these in the repo:
- The server is one Next.js App Router route handler (for example `app/api/mcp/route.ts`) using Vercel's `mcp-handler` package (v2), the MCP server SDK (v2), and Zod (v4).
- Node.js 20 or later.
- The site is not a static export (`output: 'export'`). The existing APIs suggest it isn't.
- If the site already uses Zod 3, check the upgrade.
- Use stateless Streamable HTTP. The server is read-only, so it needs no Redis, no sessions, and no authentication.
- Add basic rate limiting if usage grows.
- Test locally with the MCP Inspector, then in Claude Code, Cursor, and Claude.ai.

### 12.4 Measuring the difference

The harness (Section 13) compares three setups on the same tasks against the reference project:
- **A:** paste-in as it works today. Tag the current prompt and API versions in git before Phase 0 changes ship, so this baseline can be run later.
- **B:** improved paste-in, after Phase 2.
- **C:** MCP.

Metrics: how often required tools get called, how often calls are malformed, output correctness (for example contrast pass rates, palettes that match the algorithm), tokens used per completed task, task completion, variation between runs, and manual steps the user takes.

These results guide where to invest and what to tell users about each path. They are not a gate on building the server.

### 12.5 Related contingent items, not planned
- A setup command (for example `npx sistema init`) that creates starting files and configures the agent.
- A Claude Code plugin with plays as skills.
- A local package for repo-reading checks.
- CI or pre-commit integration for users.

---

## 13. Testing Sistema itself

Four layers, cheapest first.

1. **Content integrity** (every build): required fields, links, placeholders, counts, and step numbers. See 8.2.
2. **Consistency** (every build): every rule a guide or play cites exists. Every tool's default output passes the registry. Every play's text includes the instructions its contract requires.
3. **Tool tests** (every build): fixed inputs with known outputs. Contrast ratios match published WCAG examples. Palette stops stay stable between releases unless the change is intended. Type scale output passes the registry rules.
4. **Behavior tests** (on demand, and when plays change): an agent runs plays against the reference project in a sandbox. Tests check that the contract outputs exist, required tools were called, and checks pass.

### 13.1 Harness notes

- The behavior tests and the tool evaluations (10.5) share one harness that runs agents and scores their output.
- The owner will provide a Claude API key. Store it as an environment variable or CI secret (for example `ANTHROPIC_API_KEY`). Never commit it, log it, or print it.
- Agent runs vary. Run each case several times, track pass rates over time, and treat a single run as a signal, not a verdict.
- Set a spending budget per run and stop when it's reached.

---

## 14. Bug types to prevent

These came from reviewing the live site. Fix the specific instances in Phase 0. The content model and tests prevent the types from coming back.

| Bug type | Example found | Prevented by |
|---|---|---|
| Unfilled placeholders | `{{sistema_url}}` in the Audit campaign, session-start, add-component, and Generate a Color Scheme | Build fails on unfilled placeholders |
| Relative URLs agents can't fetch | Campaign step pages show `/raw/principles/...` with no domain | Build fails on relative URLs in agent text |
| Step count drift | Home page says Bootstrap has 10 steps. The campaign says 11. | Counts generated from data |
| Step numbering drift | Step 9's substeps are labeled 10a to 10g, then 9h | Numbers generated from data |
| Steps referenced by number | Step 4 says CSS compiles "in Step 9." It's Step 8. | Reference by name, checked at build |
| Hardcoded dates | add-component writes `[2026-05-13]` to the log | No literal dates in templates |
| Missing metadata | Generate Spacing Tokens description repeats its title | Required fields validated |
| Contradictory source of truth | Guide says plays read DESIGN.md first. Plays read LIVING_BRIEF.md. | One state model (8.6) |
| Titles from file names | "Llm Compatibility" | Required human title field |
| Universal thresholds hardcoded in prompts | Plays require 44 by 44 pixel touch targets for every project | Requirements read from the project's chosen standard |
| Tool and guide disagree | Type scale tool suggests 0.969 display line height and a 9px caption | Rules registry and consistency tests |
| Prompt skips a required tool | Bootstrap color step never calls the palette tool | Play contracts and behavior tests |

On the home page, the hero card labels Bootstrap "11 steps" and the Frequently Used list labels it "10 steps." Confirm all campaign metadata during Phase 0.

---

## 15. Phases

Each phase lists what it adds to ongoing upkeep. A phase starts only when the one before it is stable and approved.

### Phase 0: Audit and fixes
- Repo audit (Section 2).
- Fix every bug instance in Section 14.
- Add a content integrity check to the build (Section 13, layer 1).
- **Gate:** the build passes with the integrity check on. No placeholders or relative URLs in published agent text.
- **Adds to upkeep:** one build check.

### Phase 1: Narrative and content model
- Write the narrative for the home page and onboarding (outline first).
- IA research (7.2) and a proposed site structure.
- Define content type schemas, the rules registry, and play contracts.
- Seed the registry with rules currently embedded in plays and guides.
- Draft the published opinions page (outline first).
- Settle milestone and practice names, and the Maintenance and Growth question.
- Settle the project state model (8.6).
- Move reference material to the internal folder. Add the Sources page.
- Rebuild campaigns as assembled lists of plays.
- **Gate:** every existing play and campaign renders from the content model. No rule is restated in prose. The owner approves the narrative, IA, and opinions.
- **Adds to upkeep:** schemas and the registry. This replaces scattered upkeep, so the net cost should drop.

### Phase 2: Tools and paste-in improvements
- Contrast: batch mode, OKLCH and rgb input.
- Palette: document the input format where agents look. Confirm play prompts use it correctly.
- Type scale: add an API, apply the registry rules, fix the page defaults.
- Accept GET requests with query parameters on every tool API (for example `/api/contrast?fg=...&bg=...`), so agents with GET-only fetch tools can call them. Keep POST for batch input.
- Shorten prompts. Point them to sections of guides instead of whole pages.
- Publish a plain index of plays, guides, and tools that an agent can fetch.
- Add tool tests and consistency tests (layers 2 and 3).
- Update every play that needs a tool to name it as required.
- **Gate:** all tool tests pass. All tool defaults pass the registry. Every play contract's required tools appear in its text. Every tool works through GET.
- **Adds to upkeep:** one new API and its tests.

### Phase 3: Reference project, guides, and site
- Build the reference project through all three milestones.
- Rewrite the first four guides in the new structure (outline first).
- Restructure the site into the three modes.
- Apply Sistema to the site's own design system.
- **Gate:** the owner approves the guides and site structure. The reference project passes all checks at each milestone.
- **Adds to upkeep:** the reference project. Expected and accepted.

### Phase 4: MCP server
- Build the server as a route in the existing site (Section 12.3), generated from the content model.
- Add the connect page and the copy-or-run option on play pages (7.3).
- Test in the MCP Inspector, Claude Code, Cursor, and Claude.ai.
- **Gate:** the server passes the same tool tests as the APIs. It works in all three clients. Its tool list is reviewed for context cost.
- **Adds to upkeep:** one route, client testing, and versioning notes.

### Phase 5: Test harness and evaluations
- Build the harness (13.1).
- Behavior tests for the core plays against the reference project.
- Run the three-way comparison of paste-in today, improved paste-in, and MCP (12.4).
- Run tool evaluations for "Likely" and "Maybe" candidates (10.5).
- **Gate:** pass rates are recorded. Tool decisions are made from the evidence. The site's claims about each path match the results.
- **Adds to upkeep:** API spend and occasional test maintenance.

### Phase 6: Figma export
- Build the one-way Figma variables export (Section 11).
- **Gate:** owner approval.

### Phase 7: Contingent items (only on real demand)
- Setup command, Claude Code plugin, local package and repo-reading checks, CI integration for users.

---

## 16. Open decisions

| Decision | Recommendation | Settle in |
|---|---|---|
| Milestone and practice names, including "Components & Patterns" | Keep short names. Explain them in context. | Phase 1 |
| Merge Maintenance and Growth | Decide while building the content model | Phase 1 |
| Project state files | DESIGN.md, DECISIONS.md, sistema.json | Phase 1 |
| Default stack path | Web with React and Tailwind | Phase 1 |
| Rules registry schema | Start from the example in 8.3 | Phase 1 |
| Reference project product | A fictional B2B dashboard | Phase 3 |
| Reference project location | A folder in this repo | Phase 3 |
| Token validator and dark mode mapping as tools | Decide from evaluations | Phase 5 |

---

## 17. Risks

- **Upkeep load.** Every new surface multiplies what can break. The Phase 0 bugs are an early warning. Gates exist to slow growth until the base is stable.
- **Stack lock-in.** Each check and template narrows who Sistema fits. Keep the default path clear and the others honest about their support.
- **Opinion creep.** Process defaults can turn into taste rules over time. Review the opinions page against the line in Section 3.
- **Overclaiming.** Claims like "grounded in evidence" need tests behind them. Until the harness exists, phrase them carefully.
- **Two audiences.** The human pages could drift back into a showcase for agents. Review new guides with a person reading them, not an agent.
- **Evaluation cost and noise.** Agent tests cost money and vary. Keep them small and track trends.
