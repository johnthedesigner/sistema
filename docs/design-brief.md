# Sistema — UI Design Brief

A structured description of what this application does and where it is going, for use as a design handoff document.

---

## What Sistema is

Sistema is a tool for designers and developers who want to use AI coding agents to build design systems. The problem it solves: when you ask a coding agent to generate design system artifacts — color tokens, type scales, component specs — the output quality depends entirely on what the agent knows. Without grounded reference material, agents produce generic, often wrong results.

Sistema gives agents something real to work with: a knowledge base of how production design systems make their decisions, and a library of prompt starters (called **plays**) that embed those references directly. A play is a complete, ready-to-paste prompt. You copy it, paste it into Claude Code or Cursor, fill in a few context fields about your project, and the agent reads the relevant Sistema reference pages before generating. The result is structurally correct and grounded in documented production decisions.

**The primary value of the app is getting users to the right play, configured, and copied.** Everything else is supporting context.

---

## Brand identity

### Name
**Sistema** — capital S, all other letters lowercase.

### Logo symbol
Three geometric shapes, slightly overlapping: a circle, a square, and an equilateral triangle. Each shape is a brand color (yellow, blue, red — see below). Where the shapes overlap, the colors blend as if the shapes were translucent — blue + yellow = green, blue + red = purple, yellow + red = orange.

The shapes should feel like a diagram of design system building blocks — distinct primitives that combine into something new. The exact geometry (which shape gets which color) should be determined by what reads best at small sizes.

### Brand colors
- **Primary blue:** `#0070FF`
- **Secondary yellow:** `#FFCC33`
- **Brand red:** `#E60026`

These are the three colors used in the logo symbol. In the UI, blue is the dominant action color; yellow is the accent used sparingly to draw attention; red is reserved for brand expression (not error states — error uses a separate crimson).

### Typographic system
- **Sans:** Inter (400–800 weight range) — headings, UI labels, navigation
- **Serif:** Fraunces (variable, optical sizing enabled) — body text, editorial passages
- **Mono:** JetBrains Mono (400) — code blocks, prompt text, monospaced labels

---

## Navigation

Current top-level nav items: **Playbook**, **Campaigns**, **Knowledge Base**, **Tools**, **Guide**.

**Proposed change:** Merge Playbook and Campaigns into a single section. Campaigns are plays with more steps — they should not live in a separate section. The nav items become:

- **Plays** (encompasses single plays and multi-step campaigns)
- **Knowledge Base**
- **Tools**
- **Guide**

The Sistema logo/wordmark links to the home page.

---

## Page inventory

### Home page (`/`)

**Purpose:** Convert a first-time visitor into someone who copies a play within 60 seconds.

**Current state:** Text hero with two CTA buttons, a "how it works" numbered list, and two cards (KB + playbook counts). Functional but not compelling.

**New direction:**

**Hero:** A large, visually impactful headline that states the thesis directly. Something like: *"Your AI coding agent needs better context. Here it is."* or *"Production-quality design systems, prompt by prompt."* Below the headline: a secondary line explaining the mechanism in one sentence.

**Prompt showcase:** The hero's centrepiece is a prompt box rendered to look like an LLM prompt input — the same visual language as a chat interface's input area. It displays the text of the **positioning-brief** play (Step 1 of the Bootstrap a Design System campaign). By default, the box shows 4–5 lines of the prompt with a gradient fade at the bottom; a "Show full prompt" button expands it. A prominent **Copy** button sits at the top-right corner of the box. No "submit" button — this is a copy surface, not a form. This visual treatment establishes the product's core mechanic immediately.

**Quick-access row:** Below the prompt box, a compact horizontal row of small cards links to specific plays and campaigns. Layout and visual weight resemble the "suggested prompts" or "template" row below an LLM chat input — small, scannable, densely packed. Each card shows: a short title, a one-line description, and a badge indicating whether it is a single play or a campaign (and how many steps). Examples: "Bootstrap a Design System" (campaign, 6 steps), "Generate a Color Scheme" (play), "Audit Token Coverage" (play), "Scaffold a Component Library" (play).

**No full "how it works" section on the home page.** That content belongs in the Guide. The home page should be immediate.

---

### Plays (`/playbooks`)

**Purpose:** Let users find and use the right play quickly.

**What exists:**
- 18 plays organized into 6 stages:
  1. System definition (positioning-brief, generate-design-md)
  2. Primitive tokens (generate-color-scheme, generate-type-scale, generate-shape-tokens)
  3. Semantic layer (generate-color-roles, generate-dark-mode, generate-style-dictionary)
  4. Components (specify-component, implement-component, scaffold-component-library)
  5. Migration and adoption (migrate-tailwind-tokens, audit-component)
  6. Stewardship (session-start, add-component, audit-token-coverage, accessibility-audit, design-system-retrospective, plan-next-iteration)
- 2 campaigns:
  - **Bootstrap a Design System** — 6 steps: positioning-brief → generate-design-md → generate-color-scheme → generate-type-scale → generate-shape-tokens → generate-style-dictionary
  - **Audit and Refactor** — 5 steps: session-start → audit-token-coverage → accessibility-audit → design-system-retrospective → plan-next-iteration

**New direction:**

The plays index should lead with campaigns. A campaign is the highest-value entry point — it gives users a complete arc, not just one step. Campaigns should be visually prominent and immediately distinguishable from single plays.

Below campaigns, single plays are organized by stage. Stage is shown as a visual grouping, not just a label. Stages could use the brand color system as a distinguishing signal — e.g. Stage 1–2 (foundations) get one treatment, Stage 3–4 (structure) get another, Stage 5–6 (maintenance) get a third.

Each play card shows:
- Play title
- One-line output description ("What this generates")
- Stage badge
- Tags as chips (e.g. "color", "tokens", "foundations")

**Campaigns are visually distinct from single plays** — not a separate section, but using a different card treatment. A campaign card could show the step sequence as a connected series of dots or a mini progress bar, emphasizing that it is a guided multi-step flow.

---

### Individual play page (`/playbooks/[slug]`)

**Purpose:** Display the play prompt and let the user copy it. This is the highest-traffic page type.

**What exists:** A breadcrumb, stage label, play title, optional tag chips, a Copy button (or inline form for plays with `{{variable}}` fields), and the full play text in a styled pre block. If the play has an exemplar (example output), it shows in a collapsible panel or sidebar column.

**New direction:**

The play prompt should use the same LLM-prompt-input visual treatment established on the home page. By default, the prompt box shows 4–5 lines with a gradient fade and a "Show full prompt" toggle. The Copy button is prominent and lives in the prompt box header, not below it.

Plays with user-fillable variables (`{{color_direction}}`, `{{project_context}}`, etc.) show a compact input area above the prompt box — fill in the fields, then copy. The filled values are substituted into the visible prompt text in real time so users can see what they will be copying.

The exemplar (example output) panel should be visually distinct from the prompt — labeled "Example output" with a clear visual separator.

---

### Individual campaign page (`/campaigns/[slug]/[step]`)

**Purpose:** Walk users through a multi-step play sequence, one step at a time.

**What exists:** A breadcrumb, step progress indicator, step title, variable input fields (if any), the prompt text in a pre block, and previous/next navigation. Session state persists each step's variable values. At the end, an export page assembles all filled prompts into a single markdown document.

**New direction:**

Campaign pages share the same prompt box visual treatment as plays. The progress indicator at the top should be visually prominent — the campaign's multi-step nature is its differentiating feature and should be immediately readable.

The prompt box in campaign context should always be visible and immediately copyable. The user's workflow is: read the prompt, copy it, run it in their agent, come back, advance to the next step. Every friction point in that cycle should be eliminated.

---

### Knowledge Base landing (`/kb`)

**Purpose:** Orient users to what kind of reference material exists and what it is for.

**Current state:** A plain list of four category cards with titles and text descriptions.

**New direction:**

The KB landing should be visually richer than it currently is — illustrated or icon-driven cards that communicate what kind of material each category contains, not just text labels. The four categories:

- **Design Systems** ("For imitation") — Reference documentation from named production systems: Material Design 3, Carbon (IBM), Atlassian Design System, Primer (GitHub), Ant Design, and more. Use these to understand how proven systems solve structural problems.
- **Standards** ("For conformance") — Normative specifications: WCAG 2.2, ARIA Authoring Practices, APCA, the DESIGN.md format spec. Use these when your output must satisfy a published standard.
- **Foundations** ("For first-principles reasoning") — Scientific and theoretical underpinnings: perceptual color models, typography science, spacing theory. Use these to understand *why* design systems are structured the way they are.
- **Principles** ("For building something new") — Cross-system synthesis documents that distill what good looks like across all reference systems. These are the primary references for plays — not templates to copy, but frameworks for original work.

**Key message to communicate on this page:** The KB exists to make plays work better. It is reference material for AI agents, not a tutorial for humans. Direct users toward plays whenever possible — the KB is supporting context, not the destination.

Each category card should link to its category page and include a secondary CTA that links to the plays most relevant to that category.

---

### KB category page (`/kb/[category]`)

**Purpose:** List the entries in a category so users can browse or search.

**What exists:** A heading, one-sentence description, and a list of entry cards (title + truncated first paragraph).

**New direction:** More scannable. Entry cards should use visual differentiation where possible — a system's primary hue, a recognizable logo or initial, a tag showing coverage level (guidance only vs. guidance + implementation + tokens). The goal is to communicate "what you will find here" before the user clicks.

---

### KB content page (`/kb/[category]/[slug]/[...path]`)

**Purpose:** Display a single KB document for reading or reference.

**What exists:** A breadcrumb, document title, content metadata (type, status, version, retrieval date), the document body rendered as markdown, a sidebar with in-section navigation and a "See also" section linking to the same topic in other systems, and a source citations panel.

**Current state is largely appropriate** for a reference document. Key improvements: ensure the "Copy raw" and "Raw" buttons are discoverable; ensure cross-system "See also" links are visually prominent. Add a persistent "Go to a related play →" link in the sidebar that connects the KB content to the play that references it.

---

### Tools — Palette Library (`/tools/palette`)

**Purpose:** Generate and export color palettes using the Sistema OKLCH algorithm.

**What exists:** A header, a custom hex seed input that generates a 19-stop palette on demand, a pre-generated library of 22 palettes (all Tailwind v3 -600 hue seeds), format selector (CSS Variables / Tailwind Config / Figma Variables), and per-palette copy/export. Each palette swatch is clickable to copy the hex.

**Design notes:** This page is tool-dense. The visual treatment of the swatches is functional but could be more expressive. The format selector tab group should clearly indicate active state. The generate-from-seed section should feel like a tool, not a form — immediate, responsive, generative.

---

### Guide (`/guide`)

**Purpose:** Teach users how to use Sistema — how to reference KB content in their own prompts, how to use DESIGN.md, how to run a play end-to-end.

**Current state:** Long prose sections with code blocks. Correct content, but reads as documentation rather than a quick-start guide.

**Design notes:** This is the lowest-traffic page and the lowest priority for redesign. Readability and scannability are the main concerns — clear section headings, code blocks that are easy to copy, minimal visual noise.

---

## Visual design direction

### Color usage

The brand colors are not just decorative — they should carry semantic meaning in the UI:

- **Blue (`#0070FF`)** — primary actions, active states, links. The dominant interactive color.
- **Yellow (`#FFCC33`)** — accent and highlight. Use sparingly to draw attention to the most important element in a section. Not for large fills in light mode (insufficient contrast) but effective as borders, small fills, underlines, and decorative elements.
- **Red (`#E60026`)** — brand expression only. Reserved for logo and deliberate brand moments. Not for error states.
- **Error:** Crimson `#B91C1C` (light) / `#FCA5A5` (dark) — distinct from brand red.
- **Surfaces:** `#F8F9FA` (page), `#FFFFFF` (raised), with dark equivalents.

The brand's personality is **utilitarian with strong brand expression** — the layout should be minimal and efficient, but the color and type choices should feel deliberate and distinctive. Boring and safe is not acceptable.

### Typography

Fraunces (the serif) is loaded but underused in the current UI. It should appear in editorial passages, hero text, and any context where tone matters — not just in body copy. Large Fraunces at display sizes reads as authoritative and distinctive. Inter carries all labels, navigation, and functional UI.

### Prompt box treatment

The visual treatment for "this is a copyable prompt" should be consistent across the app. The core idea: it looks like an LLM chat input — a slightly differentiated surface (not a code block, not a card, but a text container) with a Copy button prominently positioned. By default it is compact (4–5 visible lines), with a toggle to expand. This treatment appears on:
- The home page hero (showing the positioning-brief play text)
- Individual play pages
- Campaign step pages

### Cards and chips

Wherever a list exists today, consider whether a card grid is more appropriate. Stage labels, play tags, and category types should appear as chips/badges — small, color-coded, and immediately scannable. The brand color system should inform badge color choices: e.g. Stage 1–2 badges in blue, Stage 6 stewardship badges in yellow.

---

## Current tech stack (for implementation reference)

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3 with CSS custom properties for all design tokens
- **Fonts:** next/font/google (Inter, Fraunces, JetBrains Mono)
- **Token system:** Style Dictionary v5 — source JSON in `tokens/semantic/`, output to `src/styles/tokens/generated.css` (CSS custom properties) and `src/styles/tokens/tokens.mjs` (ESM)
- **KB:** Markdown files read at build time via `src/lib/kb.ts`; no runtime filesystem access
- **Deployment target:** Vercel (static export, SSG)

### Token classes in use (Tailwind extensions)
```
bg-surface / bg-surface-raised / bg-surface-overlay
text-on-surface / text-on-surface-muted
border-border / border-focus
bg-primary / text-on-primary
bg-secondary / text-on-secondary
text-error / text-success / text-warning
rounded-radius-sm / rounded-radius-md / rounded-radius-lg / rounded-radius-xl / rounded-radius-full
font-sans / font-serif / font-mono
```

---

## What to design (scope)

Priority order:

1. **Logo symbol and wordmark** — the three overlapping shapes; wordmark treatment; how they combine at nav scale and display scale
2. **Home page** — hero with prompt box, headline, quick-access play row
3. **Plays index** — campaigns prominent, single plays by stage, visual card treatment, badges/chips
4. **Individual play page** — prompt box with copy button, variable input area, exemplar panel
5. **Campaign step page** — progress indicator, prompt box, prev/next navigation
6. **KB landing** — illustrated/icon cards, category descriptions, link to plays
7. **Navigation** — updated structure (Plays, Knowledge Base, Tools, Guide)
8. *(Lower priority)* KB content pages, palette tool, guide page
