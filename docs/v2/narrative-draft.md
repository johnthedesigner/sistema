# Narrative Draft

**Task:** V1.7, draft stage. **Status:** approved for this juncture 2026-11-16 (headline still open; final copy gets another pass when the site is built in V1.13 and V3). This follows the approved outline (`narrative-outline.md`) and the owner's answers on 2026-11-16:
- keep "Patterns";
- one practice, "Work on my system";
- speak to whoever is driving the agent;
- no time estimates yet;
- one "get started" path.

Placeholders like `[starter prompt]` mark where the site inserts live content. Bracketed notes are for the build, not the reader. The site build happens in V1.13 and V3.

---

## Home

Brevity matters most on this page. Headings state the point of their section, so the page reads by scanning headings alone.

### Hero

**Headline (working):** Firm foundations for AI-built apps. More room to design.

The headline is still open. See "Headline deliberation" at the end of this file.

**Subhead:**
Sistema guides your AI coding agent through building a design system in your repository. Once colors, type, and spacing are decided and checked, every new screen starts from solid ground, and your time goes to design choices instead of fixing drift.

**Primary action:** Start a design system

> Paste this into Claude Code, Cursor, or another coding agent, in your project folder.
> `[starter prompt]` [Copy]

[Later: a second tab, "Connect the MCP server."]

**Two other doors:**
- **I already have a design system.** Same prompt. It keeps what you have. [Link]
- **Work on my system.** Components, themes, audits, and what's next. [Link]

### See every stage before you build on it

Your agent builds the system in stages. After each one, you see the result in your browser. Nothing moves on until you approve.

1. **It learns your project.** It reads what's there and asks only what's missing.
2. **It proposes a direction.** Color, type, shape, and surfaces, together on one page.
3. **You decide.** Ask for changes, or approve.
4. **It builds the foundations.** Every value comes from Sistema's tools, compiled and wired into your app.
5. **You see the whole system.** Every color, type style, and spacing step, next to what you approved.

### Everything lands in your repo

- **Tokens.** Every color, type, shape, and spacing value, in one open format.
- **CSS, wired in.** Your app uses the system from the first commit.
- **DESIGN.md.** How the system looks and how to use it, for people and agents.
- **A decision log.** What was decided and why, so nobody has to guess later.
- **A note for your agent.** Every future session knows the system exists and follows it.

### Foundations that grow with you

- **One source of truth.** Tokens use the open DTCG format, so design tools can read them too. Figma variables export is planned.
- **Accessible color by design.** Every ramp is built on contrast targets, and every pairing is checked against your standard. New colors fit without breaking it.
- **Themes from day one.** Light and dark are two views of the same roles. Adding another theme is an addition, not a rewrite. Density and reduced-motion modes are planned.
- **Built for AI agents:**
  - Tokens are named for their job (`bg-primary`, not `bg-blue-600`), so agents pick the right one.
  - Tools calculate what agents would otherwise guess.
  - "Done" means shown and checked, not claimed.
  - Agents pick up where the last session left off.

[Build note: when `tokens.add-mode` ships (roadmap V3), drop "planned" and name density and reduced motion alongside light and dark. See N2.]

### Fast is good. Fast and consistent is better.

AI tools let anyone on a team build working screens quickly. Without decided foundations, each screen invents its own colors and spacing, and the product drifts.

Settled foundations don't narrow what you can design. They widen it. When every screen already gets color, type, spacing, and accessibility right, your time goes to trying ideas and testing them with users.

### Everything your agent needs to get it right

- **A method.** Direction, Foundations, and Patterns, then ongoing work. [Link]
- **Opinions with reasons.** Defaults you can override, with when you'd want to. [Link]
- **Guides.** How each foundation works in practice. [Link]
- **Tools.** Palette and contrast, calculated, never estimated. [Link]
- **Two ways in.** Paste a prompt, or connect the MCP server. [MCP: later]

### Proof, not promises

- Every step shows its evidence: a tool result, a passing build, or a page you can open.
- Nothing you already have is renamed or replaced without your choice.

### Sistema won't step on your toes

Sistema has opinions about process, structure, and the quality floor. What your product looks like, what it does, and how it's built beyond that are your calls. Sistema just writes them down.

---

## How Sistema works

### Your repo is the source of truth

Sistema keeps every foundation decision in your repository: tokens, rules, decisions, and the instructions your agent reads. Design tools can receive exports from the repository, but they aren't the source.

If your team needs a design tool such as Figma to be the source of truth, Sistema's method isn't a good fit. That's a reasonable choice, and many teams work that way.

Everything Sistema writes is plain markdown, JSON, and the DTCG token format, so you can take it anywhere.

### Milestones

**Direction.**
- **The goal:** agree on what the product is and how it should feel, before any values exist.
- **What you get:** a positioning statement, a visual direction shown on one page, and DESIGN.md.
- **Done when:** you approve the direction in your browser.

**Foundations.**
- **The goal:** turn the direction into a complete, checked set of tokens.
- **What you get:** color, type, shape, and spacing tokens, and compiled CSS wired into your app.
- **Done when:** every required color pairing passes your accessibility standard in every theme, the build passes, and you approve the whole system, shown in your browser next to what you approved before.

**Patterns.**
- **The goal:** build the first components and pages on the tokens.
- **What you get:** a core set of components, a page showing each one in every state and theme, and optionally example pages and a reference page.
- **Done when:** the components pass an accessibility scan and you approve them.

### Work on my system

After the milestones, design system work becomes routine. Each session starts by reading the system's current state and confirming what you want to do, then follows a short route:
- add a component;
- add a theme;
- bring in existing colors;
- audit a component, accessibility, or token use;
- review the system against its records;
- plan the next round of work.

### Workflows and plays

A workflow is a whole run, such as Start or Work on my system. A play is one step inside it, such as generating the color scheme. You'll mostly use workflows. Each play also has its own page and prompt, for when you need one step on its own.

### Your agent shows its work

- **It reads before it asks.** If your files answer a question, it doesn't ask you.
- **It uses tools for anything it can calculate.** Palette ramps and contrast ratios come from Sistema's tools, never from estimates.
- **It shows evidence before calling a step done.**
- **It records what it decided.** Decisions and their reasons go in DECISIONS.md, and progress goes in `sistema.json`.

### You see it before you approve it

At each approval, your agent builds a page in the `sistema-review/` folder. You open it in your browser and see the decision itself, such as:
- your colors as ramps;
- type at its real sizes;
- components in every state and theme.

When there's a choice to make, such as how to treat colors you already have, the page shows your current values next to each option before you're asked to choose.

### Stop anytime, pick up anytime

You can stop at any point. Sistema adds a short note to your project's AGENTS.md (or CLAUDE.md), which coding agents read at the start of every session. The next session finds its way back to where you left off, even if you only say "keep going."

### What's in your repo afterward

| File | What it's for | Who edits it |
|---|---|---|
| `tokens/src/*.json` | Every token value, in DTCG format | You or your agent, through Sistema |
| Compiled CSS | What your app uses | Generated. Don't edit it |
| `DESIGN.md` | How the system looks and how to use it, for people and agents | Your agent writes it. Its front matter is generated |
| `DECISIONS.md` | Every decision and why | Your agent adds entries, and you can too |
| `sistema.json` | Where the project is in the workflow | Your agent |
| `AGENTS.md` note | Points new sessions to the workflow | Your agent adds it once |
| `sistema-review/` | Pages for each approval | Your agent |

---

## Start a design system

**What happens.** Your agent reads your project, asks what it needs, proposes a direction, and builds the foundations, stopping twice for your approval. [Outline of the Start workflow, rendered from the workflow definition.]

**What you'll be asked:**
- What the product is, and who uses it to do what.
- Whether the interface is dense, balanced, or sparse.
- Where it sits between expressive and plainly functional.
- Light theme, dark theme, or both.
- Web, mobile, or both, and roughly how large the system will be.
- Which accessibility standard it must meet. The agent helps you choose. WCAG 2.2 AA fits most web products.

**What you get:** the Direction and Foundations outputs listed in How Sistema works. Then the agent offers to continue to Patterns.

**The prompt:** `[starter prompt]` [Copy]

**If something goes wrong:**
- If the session ends, start a new one in the same folder. The agent picks up from `sistema.json`.
- If the agent seems to have lost track of Sistema, paste the prompt again.
- If a step asks for something you don't know yet, say so. The agent can mark it as open and continue.

---

## Bring Sistema to an existing system

Use the same prompt as Start a design system. Here's what's different.

**It starts by finding what you have.** The first step looks for a Tailwind theme, CSS variables, SCSS, token files, and the components that use them. It sorts each piece into one of three groups:
- already in Sistema's format;
- present but in another format;
- missing.

Work that's already done is skipped.

**Your existing colors.** Before mapping anything, the agent builds a page that shows your current colors as ramps, flags anything that will look uneven, and shows a few options for each color:
- **Keep exactly.** Only your colors. Gaps and contrast problems are listed for you to decide one by one.
- **Keep and complete.** Your colors stay where they fit, and the rest of each ramp is generated around them.
- **Regenerate.** Your colors become starting points for new, even ramps.

You can choose differently for each color. "Keep and complete" is the usual suggestion for a project with established colors, but it's your call.

**The ground rule.** Nothing you already have is renamed, moved, or replaced without your choice.

**The prompt:** `[starter prompt]` [Copy]

---

## Work on my system

For ongoing work once the system exists. Each session starts by reading the current state and confirming what you want to do. Then the agent follows one of these routes:

| Route | What it does |
|---|---|
| Add a component | Writes a specification, then builds it on your tokens and checks it |
| Add a theme | Adds dark to a light system (or the reverse), and shows both side by side for approval |
| Bring in existing colors | Moves colors from another format into the system, with the options page |
| Audit a component | Checks one component's token use, states, and accessibility |
| Audit accessibility | Checks components against your chosen standard |
| Audit token use | Finds values in your code that should be tokens |
| Review the system | Compares the code with DESIGN.md and the decision log |
| Plan the next round | Rates the system's maturity and lists what to do next |

After Start, the note in AGENTS.md already points your agent here. You can also paste the prompt: `[session starter prompt]` [Copy]

---

## For agents

[Page at `/agents`. Written for a model reading it.]

Sistema is a method and a set of tools for building a design system in a project's repository. Work is organized as workflows made of plays. Each play has a procedure, the rules it applies, and the evidence it must show.

**Start here:**
- New or existing project: `[site]/raw/workflows/start`
- Ongoing work: `[site]/raw/workflows/session`
- If `sistema.json` exists in the project root, read it and fetch the URL in its `continue` field before doing anything else.

**Tools.** Never estimate what these calculate:
- Palette: `POST [site]/api/palette` [request and response shapes]
- Contrast: `POST [site]/api/contrast` with `{"pairs": [...]}` [request and response shapes]

**State file schema:** `[site]/raw/schema/sistema.json`

**Everything else:** `[site]/llms.txt`

---

## llms.txt (opening)

```
# Sistema

> Sistema guides an AI coding agent through building a design system in a project's repository: direction, tokens, components, and ongoing maintenance, with human approval at each milestone.

## How agents should use Sistema

- To start or adopt a design system, fetch [site]/raw/workflows/start and follow it.
- For ongoing work, fetch [site]/raw/workflows/session.
- If sistema.json exists in the project root, read it first and resume from the URL in its "continue" field.
- Use the palette and contrast tools for any value they calculate. Never estimate.

## Workflows
[one line per workflow: title, description, URL]

## Plays
[one line per play: title, description, URL]

## Guides
[one line per guide: title, description, URL]
```

---

## Per-page agent note

[One line at the top of each human page, in small type.]

For agents: a plain-text version of this page is at `[raw URL]`. All pages: `[site]/llms.txt`.

---

## Notes for the owner

**N1. Visual milestones as a principle.** Owner direction (2026-11-16): every milestone is reviewed visually, so you understand how the system is coming together before moving on. This goes into V1.8 as a process opinion. The working wording is "You see every stage before you build on it."

**N2. Themeability beyond light and dark.** The owner suggested density and motion preference as theme examples. Today Sistema records density as a project setting, which shapes the type and spacing scales, and requires components to respect reduced motion. It doesn't yet produce switchable density or motion modes as token themes. The copy above says only what exists. A "density and motion modes" capability could go on the roadmap (`color.add-theme` would generalize to `tokens.add-mode`) if the owner wants to claim it.

**Resolved 2026-11-16:** the owner wants it. `tokens.add-mode` is on the roadmap (V3, before the reference project). Until it ships, the copy says "planned."

**N3. No invented jargon.** Owner direction: user-facing copy doesn't use Sistema's internal names ("token check page", "style preview", "review page", "play") where plain words work. Internal names stay in file names and agent-facing text.

**N4. Prompt box with suggestions (owner idea, 2026-11-16, needs refinement).** Style the entry points like a chat input. The suggestions below it are the workflows and routes (start, bring in an existing system, add a component, audit, add a theme, and so on). Clicking a suggestion swaps the prompt in the box. The action button copies the prompt instead of sending it. This goes into V1.9 as an input for the home page and the "Work on my system" page.

## Headline deliberation

The owner reviews this as it changes. Newest entries are last.

| Date | Candidate | Notes |
|---|---|---|
| 2026-11-16 | A design system your AI tools actually follow. | First draft's recommendation. Owner: missing the idea that sound foundations open up design options. |
| 2026-11-16 | "AI-friendly design foundations to open up the design latitude of your app" | Owner's sketch. Right balance of ideas, but clunky. |
| 2026-11-16 | **Firm foundations for AI-built apps. More room to design.** | Chosen for now. Owner: "I don't think we've nailed it yet." |
| 2026-11-16 | Give your agent firm foundations, and give your design more room. | Alternative |
| 2026-11-16 | Design foundations your AI agent follows, so your app has room to grow. | Alternative |
| 2026-11-16 | Decide the foundations once. Design freely from there. | Strongest on design freedom, but no AI |
| 2026-11-16 | Foundations built for AI agents. Freedom built for designers. | Slogan-like; narrows the audience to designers |

What the headline has to do: say that Sistema gives AI-built work solid foundations, and that those foundations give design more freedom, not less. It should be short enough to read at a glance, and speak to whoever drives the agent.
