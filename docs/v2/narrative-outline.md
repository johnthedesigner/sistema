# Narrative Outline

**Task:** V1.7, outline stage. **Status:** waiting for owner review. After approval I write the draft copy, following plan Section 1's writing style: no exclamation points, no em dashes, one idea per sentence, plain words, no overclaiming.

**Sources:** plan Sections 3 (the narrative), 4 (the repo is the source of truth), 5 (milestones and practices), and 6 (opinions, which get their own pages in V1.8); IA research (one first action with two other doors; agent notes and `llms.txt`); what the slice runs showed people need explained (review pages, color options, resume, evidence).

---

## 1. Home page

The home page leads with doing, not explaining. Readers who want the story scroll for it.

**1.1 Hero**
- **Headline**, one line about the outcome: a design system your AI tools actually follow. Drafts will offer three or four options.
- **Subhead**, two sentences: Sistema guides an AI coding agent through building your design system in your repo, step by step, with your approval at each stage. Every value is calculated and checked, not guessed.
- **Primary action:** "Start a design system." It shows the starter prompt with a copy button, and one line on where to paste it (Claude Code, Cursor, or any coding agent). Later, a second tab reads "Connect the MCP server."
- **Two other doors,** smaller, side by side:
  - "I already have a design system": the same starter. It detects what exists and keeps it, so this links to the Adopt explanation.
  - "Work on my system": the session workflow starter, for adding components, audits, and themes.

**1.2 What happens when you paste it.** A short horizontal outline of the Start workflow: Direction, then your approval, then Foundations, then your approval. Each step gets one line, and the outline is the same one the agent shows you. It ends with what is in your repo afterward: tokens, compiled CSS, DESIGN.md, DECISIONS.md, `sistema.json`, and a pointer in AGENTS.md.

**1.3 The shift and the problem.** Three short paragraphs:
- The shift: AI tools let anyone on a team build working screens quickly.
- The problem: without decided foundations, each screen invents its own values, output drifts, and agents report progress that turns out to be partial.
- The need: foundations that are decided, written down, checked, and in front of the agent when it makes a choice.

**1.4 What Sistema provides.** Five items, each one sentence with a link:
- The method: milestones and workflows.
- Opinions: defaults with reasons (V1.8).
- Guides: Sistema's take on each foundation.
- Tools: palette, contrast, and later type scale, so agents calculate instead of estimate.
- Two ways in: paste a prompt or connect the server.

**1.5 What you can trust, and how.** Three points, drawn from the runs:
- You approve direction and foundations on rendered pages, not descriptions.
- Every step shows evidence: tool results, a passing build, a page.
- Nothing existing in your project changes without your choice.

**1.6 What Sistema stays out of.** Taste, product direction, and technical choices beyond what the method needs. "Sistema has opinions about process, structure, and the quality floor. It doesn't decide what your product looks like."

**1.7 Footer links:** guides, reference, the agents page, GitHub.

## 2. How Sistema works (onboarding page)

The first explanation of the method, for someone deciding whether to use it. About one screen per section.

**2.1 Is it a fit?** This sits near the top, per plan Section 4, and is said plainly and kindly. Sistema keeps every foundation decision in your repository: tokens, rules, decisions, and agent instructions. Design tools receive exports from the repo, and they aren't the source. If your team needs Figma (or another design tool) to be the source of truth, Sistema's method isn't a fit, and that's a reasonable choice for many teams. Everything Sistema writes is plain markdown, JSON, and DTCG, so nothing locks you in.

**2.2 Milestones.** Direction, Foundations, and Patterns. Each gets what it is for, what you get, and how you know it's done (the measured exit criteria from plan 5.1, in plain words).

**2.3 Ongoing work.** One practice, "Work on my system": adding components and themes, audits, reviews, and planning. Each is a short route that starts by checking the system's current state.

**2.4 Workflows and plays.** A workflow is the whole run. A play is one step in it. You'll mostly use workflows, and plays are there when you need one step on its own.

**2.5 What the agent does at each step:**
- It reads your project before asking anything.
- It uses Sistema's tools for anything calculable.
- It shows evidence.
- It records decisions in DECISIONS.md and state in `sistema.json`.

**2.6 Review pages.** At each approval, the agent builds a page in `sistema-review/` that shows the decision rendered: your colors as ramps, type specimens, and components in every theme. When there's a real choice (for example, how to treat your existing colors), it shows the options side by side before asking.

**2.7 Picking up later.** Close the session whenever you like. Sistema adds a short note to your AGENTS.md (or CLAUDE.md), so the next session finds its way back, even if you just say "keep going."

**2.8 Your files afterward.** A short table of each file, what it is for, and who edits it (you, the agent, or generated).

## 3. Entry point pages

Each page has the same structure:
- what happens;
- what you'll be asked;
- what you get;
- roughly how long it takes;
- the prompt to copy;
- what to do if something goes wrong.

**3.1 Start a design system.**
- **Asked:** what the product is, density, how expressive, themes, platform, and which accessibility standard (with help choosing).
- **Get:** the full Start output, then an offer to continue to Patterns.

**3.2 Bring Sistema to an existing system** (the Adopt path). The same starter, so this page explains what differs:
- **What happens:** the first step finds what you have (Tailwind theme, CSS variables, SCSS, token files) and classifies each piece as conforming, differing, or missing. Finished work is skipped.
- **Your existing colors:** you see them next to a few options (keep exactly, keep and complete the ramps, or regenerate from them), per hue, on a comparison page. "Keep and complete" is the usual suggestion, but it's your call.
- **Ground rule:** nothing is renamed, moved, or replaced without your choice.

This page is proposal F from the slice runs.

**3.3 Work on my system.**
- **What happens:** the routes (add a component, audit, add a theme, bring in existing colors, review, plan), each in one line.
- **The prompt:** the session starter, which `AGENTS.md` already points to after Start.

## 4. For agents (new, from V1.6)

**4.1 Agents page** (`/agents`): what Sistema is, in three sentences for a model; the starter URLs; how to read `sistema.json`; the tools and their request shapes; the schema link; and the rule that a session finding `sistema.json` resumes from its `continue` URL.

**4.2 `llms.txt`:** opens with "how agents should use Sistema" (the paragraph above), then one line per workflow, play, and guide, each with its description and its `/raw/` URL.

**4.3 Per-page agent note:** one line at the top of each human page, in small type: "For agents: the plain-text version of this page is at … Index: llms.txt."

## 5. Questions for the owner

1. **Milestone names.** The model uses Direction, Foundations, Patterns, and Maintain (for the session workflow). Plan 5.1 asks whether "Patterns" should be "Components & Patterns." I'd keep **Patterns** and explain it as "components and the pages built from them."
2. **Practices.** Plan 5.2 asks whether Maintenance and Growth stay separate. The model already merged them into one session workflow. I'd present one practice, **"Work on my system"**, with "Maintain" as its internal milestone name.
3. **Headline direction.** Should the home page talk to whoever is driving the agent (designer, developer, or PM equally), or lead with designers?
4. **Time estimates on entry pages.** The runs took about 30 to 90 minutes of active time for Start. Should pages give a range, or leave time out until there's more data?
5. **Audience split.** The IA research saw "get started by role" (Nessie, Linear). Does Sistema need it, or is one path enough for now? I'd say one path is enough.
