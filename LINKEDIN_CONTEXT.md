# Sistema — Context for LinkedIn Post Writing

This document is background material for writing LinkedIn posts announcing the launch of Sistema and inviting early testers.

---

## What Sistema is

**Sistema** is a publicly accessible knowledge base and AI playbook tool for designers and developers building design systems. It gives you structured, grounded prompts for Claude Code or Cursor — the kind of prompts that reference real design system documentation instead of asking the AI to guess.

The site is live at: `https://sistema-bay-seven.vercel.app` (custom domain TBD)

The tagline: **"Prompts grounded in real design system references."**

The one-liner: You paste a prompt from Sistema into Claude Code or Cursor, and the agent works through a structured design system task — generating a color scheme, writing a component spec, auditing accessibility, running a design retrospective — using Material Design 3, Carbon, Atlassian, Primer, WCAG, and other real references as its context.

---

## The problem it solves

When you ask an AI to help with a design system task without any reference material, it defaults to pattern-matching from training data. You get medium-blue primary colors. You get generic Tailwind-ish spacing scales. You get accessible-on-paper color pairings that don't reflect any intentional design language.

Sistema solves this by:
1. Maintaining a structured **Knowledge Base** — crawled, synthesized, and indexed docs from Material Design 3, Carbon (IBM), Atlassian, Primer (GitHub), Ant Design, W3C/WCAG, and original design theory sources
2. Writing **plays** — structured prompts that tell the agent exactly which KB references to fetch at runtime before it starts generating
3. Organizing plays into **campaigns** — self-driving multi-step sequences that take a project from blank repo to a complete, token-based color and type system in a single copy-paste

The KB is publicly accessible via stable URLs. Plays embed fetch instructions directly in the prompt. When an agent runs a play, it reads real source documentation first, then generates — not the other way around.

---

## Who built it

**John the Designer** — a product designer with background at Wayfair, Salesforce, and ReflexAI. Site: [johnthedesigner.com](https://johnthedesigner.com). He has been working at the intersection of design systems and AI tooling and built Sistema to solve a problem he kept running into in his own work.

Sistema was built **using Claude Code** (Anthropic's AI coding agent) as the primary development tool throughout. The project is both a product for others and an ongoing demonstration of what AI-assisted design system work looks like in practice.

---

## The build story — 9 phases in about a week

The project was built in structured phases, each with a task spec and retrospective.

| Phase | Focus | Key output |
|---|---|---|
| 0 | Tools + Material Design 3 | KB foundation — 7 guidance files, 3 asset files, DESIGN.md |
| 1 | Next.js app | 31 static pages, KB browser, play listing |
| 2 | Deploy + play testing | Vercel live, Carbon + Atlassian added, 4 plays tested and refined |
| 2b | Radix, Primer, Ant Design | KB expanded to 6 systems |
| 3 | Content scaling | KB expanded; Impeccable, ARIA, Shopify Polaris, MailChimp added |
| 4 | Exemplars + UX | Play example outputs; per-play exemplar previews |
| 5 | Foundations + Standards | WCAG synthesis, typography theory, spacing/shape/motion principles |
| 6 | Synthesis layer (principles) | 11 original synthesis docs; living brief spec; campaign redesign |
| 7 | Palette API + campaigns | `/api/palette` (19-stop OKLCH); campaign flow UI; Figma Variables export |
| 8 | Tools + dogfooding | Palette tool generative; bootstrap campaign run on Sistema itself |
| 9 (active) | Play quality + polish | Voice and tone, copy audit, SEO, search, color ramp principles |

**Total build time:** approximately 7 days of intensive Claude Code sessions.

**Current state:** Public beta. 142+ static pages. Full design token pipeline (color, typography, shape). Search. Two campaigns. 18+ plays across 6 stages.

---

## Key features

### Knowledge Base (5 categories)
- **Design Systems** — Material Design 3, Carbon (IBM), Atlassian, Primer (GitHub), Ant Design, Radix — crawled and structured from official sources
- **Standards** — WCAG 2.2, ARIA APG, APCA, the DESIGN.md spec — normative references
- **Foundations** — Color perception, typographic rhythm, spacing theory, contrast science
- **Agent Skills** — Impeccable (Philip Bakaus), Anthropic frontend-design skill, designer-skills (Julian Oczkowski) — reviewed for license compatibility
- **Principles** — Sistema's own synthesized frameworks: OKLCH commitment levels, token architecture patterns, visual quality signals, content voice

All KB content is accessible at stable `/raw/` and `/bundle/` endpoints so agents can fetch it directly.

### Plays (18+ across 6 stages)
Stage 1: Foundation (DESIGN.md generation, token architecture planning)
Stage 2: Primitives (color scheme, type scale, shape tokens)
Stage 3: Semantic layer (color roles, dark mode, Style Dictionary config)
Stage 4: Components (spec writing, implementation)
Stage 5: Migration (Tailwind migration, component audit)
Stage 6: Stewardship (session start, add-component, accessibility audit, retrospective)

Plays are structured prompts with template variables. The user fills in project context; the agent fetches the KB refs and generates.

### Campaigns
Self-driving multi-step sequences. Paste one prompt into Claude Code; the agent runs every step in sequence. Current campaigns:
- **Bootstrap a Design System** — 6 steps, positioning brief through Style Dictionary
- **Audit and Refactor** — 4 steps, token audit through retrospective

### Palette tool (`/tools/palette`)
Generates 19-stop OKLCH color ramps from any seed hex. The algorithm uses contrast-targeting (not perceptual stepping): each of the 19 stops is selected by contrast ratio against white, using a logarithmic distribution that places the midpoint at 4.38:1 — directly in the WCAG working range. All 22 pre-built palettes follow the same algorithm. Cross-hue interchangeability: blue-600 and green-600 meet the same contrast target.

Output formats: CSS Variables, Tailwind config, Figma Variables (compatible with the "Variables Import & Export" community plugin).

---

## The dogfooding moment

In Phase 8, Sistema ran its own bootstrap campaign on itself. The agent:
1. Ran the positioning brief
2. Generated a DESIGN.md
3. Generated color token files (light + dark)
4. Generated typography tokens (Inter + Fraunces + JetBrains Mono)
5. Generated shape tokens
6. Set up a Style Dictionary v5 pipeline
7. Wired tokens to Tailwind
8. Applied a full design pass across 24 files

The result: Sistema's current visual design is built with Sistema's own outputs. The color system, typography system, and shape tokens in the app were all generated by the campaign. This was the first end-to-end proof that the campaign produces a working token layer.

---

## Voice and tone notes (for writing posts)

Sistema's voice is **practitioner-grade** — it talks to designers and developers the way a senior colleague does, not the way a tutorial does. The copy avoids:
- AI writing patterns ("not just X — it's Y", "unlike X, Y...", "at the heart of...")
- Superlatives without specifics ("powerful", "comprehensive", "seamless")
- Tutorial-register explanations of things the audience already knows

Posts should sound like something a senior design systems practitioner would actually say. Specific beats general. Show don't tell.

---

## What "public beta" means / what feedback would be useful

- The plays generate correct output but haven't been audited for every edge case
- The KB is deep in some areas and sparse in others (agent skills content is the current gap)
- The campaign flow works end-to-end but the UX is still early
- No auth — everything is open and free
- Biggest open question: do the plays actually produce better output than a well-written free-form prompt? Real user test results would answer this

Most valuable feedback: try a play on a real project and report back whether the output was useful, generic, or wrong in a specific way.

---

## Potential post angles

1. **The build story** — "I built a design system tool in a week using Claude Code" — the meta angle of AI-built AI tooling
2. **The knowledge base angle** — "I crawled and synthesized 6 major design systems so your AI agent doesn't have to guess"
3. **The palette algorithm** — the OKLCH contrast-targeting approach and why it matters for scalable color systems
4. **The dogfooding story** — running your own tool on itself as a validation milestone
5. **The beta invite** — "try a play, tell me if it's actually useful"
6. **The problem statement** — "AI-generated design systems are mostly AI slop — here's why and what fixes it"
