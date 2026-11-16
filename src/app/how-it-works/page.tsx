import type { Metadata } from 'next'
import { Markdown } from '@/components/site/Markdown'
import { AgentNote, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'How Sistema works',
  description: 'How Sistema builds a design system in your repository: milestones, approvals you can see, and work that picks up where it left off.',
}

const BODY = `## Your repo is the source of truth

Sistema keeps every foundation decision in your repository: tokens, rules, decisions, and the instructions your agent reads. Design tools can receive exports from the repository, but they aren't the source.

If your team needs a design tool such as Figma to be the source of truth, Sistema's method isn't a good fit. That's a reasonable choice, and many teams work that way.

Everything Sistema writes is plain markdown, JSON, and the DTCG token format, so you can take it anywhere.

## Milestones

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

## Work on my system

After the milestones, design system work becomes routine. Each session starts by reading the system's current state and confirming what you want to do, then follows a short route:
- add a component;
- add a theme;
- bring in existing colors;
- audit a component, accessibility, or token use;
- review the system against its records;
- plan the next round of work.

## Workflows and plays

A [workflow](/workflows) is a whole run, such as Start or Work on my system. A play is one step inside it, such as generating the color scheme. You'll mostly use workflows. Each [play](/plays) also has its own page and prompt, for when you need one step on its own.

## Your agent shows its work

- **It reads before it asks.** If your files answer a question, it doesn't ask you.
- **It uses tools for anything it can calculate.** Palette ramps and contrast ratios come from Sistema's tools, never from estimates.
- **It shows evidence before calling a step done.**
- **It records what it decided.** Decisions and their reasons go in DECISIONS.md, and progress goes in \`sistema.json\`.

## You see it before you approve it

At each approval, your agent builds a page in the \`sistema-review/\` folder. You open it in your browser and see the decision itself, such as:
- your colors as ramps;
- type at its real sizes;
- components in every state and theme.

When there's a choice to make, such as how to treat colors you already have, the page shows your current values next to each option before you're asked to choose.

## Stop anytime, pick up anytime

You can stop at any point. Sistema adds a short note to your project's AGENTS.md (or CLAUDE.md), which coding agents read at the start of every session. The next session finds its way back to where you left off, even if you only say "keep going."

## What's in your repo afterward

| File | What it's for | Who edits it |
|---|---|---|
| \`tokens/src/*.json\` | Every token value, in DTCG format | You or your agent, through Sistema |
| Compiled CSS | What your app uses | Generated. Don't edit it |
| \`DESIGN.md\` | How the system looks and how to use it, for people and agents | Your agent writes it. Its front matter is generated |
| \`DECISIONS.md\` | Every decision and why | Your agent adds entries, and you can too |
| \`sistema.json\` | Where the project is in the workflow | Your agent |
| \`AGENTS.md\` note | Points new sessions to the workflow | Your agent adds it once |
| \`sistema-review/\` | Pages for each approval | Your agent |

## Opinions with reasons

Sistema holds defaults about process, structure, and the quality floor, and publishes each one with its reason and when you'd choose otherwise. It doesn't decide what your product looks like. [Read the opinions](/reference/opinions).`

export default function HowItWorksPage() {
  return (
    <main>
      <Container>
        <AgentNote raw="/raw/agents" />
        <PageHeader
          eyebrow="Get started"
          title="How Sistema works"
          lead="Your agent builds the system in stages, in your repository. After each one, you see the result in your browser, and nothing moves on until you approve."
        />
        <div className="max-w-[760px]">
          <Markdown>{BODY}</Markdown>
        </div>
      </Container>
    </main>
  )
}
