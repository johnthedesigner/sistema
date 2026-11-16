# Narrative Draft

**Task:** V1.7, draft stage. **Status:** waiting for owner review. This follows the approved outline (`narrative-outline.md`) and the owner's answers on 2026-11-16:
- keep "Patterns";
- one practice, "Work on my system";
- speak to whoever is driving the agent;
- no time estimates yet;
- one "get started" path.

Placeholders like `[starter prompt]` mark where the site inserts live content. Bracketed notes are for the build, not the reader. The site build happens in V1.13 and V3.

---

## Home

### Hero

**Headline.** The owner's direction (2026-11-16) is to pair AI-friendly foundations with the design freedom they give. Options, recommended first:
1. Firm foundations for AI-built apps. More room to design.
2. Give your agent firm foundations, and give your design more room.
3. Design foundations your AI agent follows, so your app has room to grow.
4. Decide the foundations once. Design freely from there.
5. Foundations built for AI agents. Freedom built for designers.

**Subhead:**
Sistema guides your AI coding agent through building a design system in your repository. Once colors, type, and spacing are decided and checked, every new screen starts from solid ground, and your time goes to design choices instead of fixing drift.

**Supporting line** (under the subhead, smaller): You approve each stage on a rendered page, and every value is calculated, not guessed.

**Primary action:** Start a design system

> Paste this into Claude Code, Cursor, or another coding agent, in your project folder.
> `[starter prompt]` [Copy]

[Later: a second tab, "Connect the MCP server."]

**Two other doors:**

- **I already have a design system.** Use the same prompt. The first step finds what you have and keeps it. Nothing is renamed or replaced without your choice. [Link: How Sistema handles an existing system]
- **Work on my system.** Add a component, add a theme, run an audit, or plan what's next. [Link: Work on my system]

### What happens when you paste it

Your agent works through four stages and stops for you twice.

1. **Understand the project.** It reads what's already there, then asks only what it can't find: what the product is, who uses it, how dense it is, and which accessibility standard it must meet.
2. **Set the direction.** It proposes a visual direction and builds a preview page with colors, type, shapes, and surfaces.
3. **You approve the direction.** Open the page, ask for changes, or approve.
4. **Build the foundations.** It generates color, type, shape, and spacing tokens with Sistema's tools, compiles them, and wires them into your app.
5. **You approve the foundations.** A token check page shows everything that was built, next to what you approved.

When it's done, your repository has:
- token source files;
- compiled CSS;
- DESIGN.md;
- a decision log;
- a small state file;
- a note in AGENTS.md, so every future session knows the system exists.

From there you can go on to components and pages.

### Why this matters

AI tools let anyone on a team build working screens quickly. Designers, developers, and product managers can test ideas with users sooner than before.

Speed has a cost when the foundations aren't decided. Each screen an agent builds invents its own colors, sizes, and spacing. The product drifts, design and code split apart, and agents report progress that later turns out to be partial.

What helps is foundations that are decided, written down, and checked. They also need to be in front of the agent at the moment it makes a choice.

Settled foundations don't narrow what you can design. They widen it. When every screen already gets color, type, spacing, and accessibility right, you can try more layouts and ideas, and test them with users sooner. Your time goes to the design itself.

### What Sistema provides

- **A method.** Three milestones (Direction, Foundations, and Patterns), then ongoing work on the system. [Link: How Sistema works]
- **Opinions with reasons.** Sistema's defaults, why it holds them, and when you'd choose otherwise. [Link: Opinions]
- **Guides.** Sistema's take on how each foundation works in practice. [Link: Guides]
- **Tools.** Palette generation and contrast checking, so your agent calculates instead of estimating. [Link: Tools]
- **Two ways in.** Paste a prompt, or connect the MCP server. Both reach the same content. [MCP: later]

### What you can trust, and why

- **You approve on rendered pages.** The agent builds a page you can open in your browser at each approval. When there's a real choice, it shows the options side by side.
- **Every step shows evidence.** That means tool results, a passing build, or a page you can check, not a description of what was done.
- **Nothing you already have changes without your choice.** Existing colors, names, and files are kept unless you decide otherwise.

### What Sistema stays out of

Sistema has opinions about process, structure, and the quality floor. It doesn't decide what your product looks like, what it should do, or which framework you use beyond what the method needs. Those decisions are yours, and Sistema records them.

---

## How Sistema works

### Is Sistema a fit for your team?

Sistema keeps every foundation decision in your repository: tokens, rules, decisions, and the instructions your agent reads. Design tools can receive exports from the repository, but they aren't the source.

If your team needs a design tool such as Figma to be the source of truth, Sistema's method isn't a good fit. That's a reasonable choice, and many teams work that way.

Everything Sistema writes is plain markdown, JSON, and the DTCG token format, so you can take it anywhere.

### Milestones

**Direction.**
- **The goal:** agree on what the product is and how it should feel, before any values exist.
- **What you get:** a positioning statement, a visual direction, a preview page, and DESIGN.md.
- **Done when:** you approve the preview page.

**Foundations.**
- **The goal:** turn the direction into a complete, checked set of tokens.
- **What you get:** color, type, shape, and spacing tokens, compiled CSS wired into your app, and a token check page.
- **Done when:** every required color pairing passes your accessibility standard in every theme, the build passes, and you approve the token check page.

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

### What your agent does at each step

- **It reads before it asks.** If your files answer a question, it doesn't ask you.
- **It uses tools for anything it can calculate.** Palette ramps and contrast ratios come from Sistema's tools, never from estimates.
- **It shows evidence before calling a step done.**
- **It records what it decided.** Decisions and their reasons go in DECISIONS.md, and progress goes in `sistema.json`.

### Review pages

At each approval, your agent builds a page in the `sistema-review/` folder. You open it in your browser and see the decision itself, such as:
- your colors as ramps;
- type at its real sizes;
- components in every state and theme.

When there's a choice to make, such as how to treat colors you already have, the page shows your current values next to each option before you're asked to choose.

### Picking up later

You can stop at any point. Sistema adds a short note to your project's AGENTS.md (or CLAUDE.md), which coding agents read at the start of every session. The next session finds its way back to where you left off, even if you only say "keep going."

### Your files afterward

| File | What it's for | Who edits it |
|---|---|---|
| `tokens/src/*.json` | Every token value, in DTCG format | You or your agent, through Sistema's plays |
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
