# Meta-Plan — Sistema

**For:** The human developer (you)
**Purpose:** How to understand the full project scope, sequence development across both layers, and manage AI-assisted sessions from first scaffold to public launch

This document is for you, not for Claude Code. It describes the project, the development phases, and your role as orchestrator across all of them.

---

## What we're building

Sistema is a two-layer product. Both layers live in this repository.

### Layer 1 — The Knowledge Base

A structured, versioned repository of design system documentation from major open-source systems (Material Design 3, Carbon, Atlassian, Primer, Radix, and others). Content is organized by design system, with each system's material split into three source types:

- **`guidance`** — Design rationale and usage documentation scraped from public doc sites
- **`implementation`** — Developer-facing technical docs sourced from GitHub repositories
- **`assets`** — Raw design token files (JSON) sourced from source repositories

Sitting above those source files is a fourth content type:

- **`design-md`** — Community-generated DESIGN.md files that encode each design system as a machine-readable context document conforming to the Google Labs DESIGN.md open spec. These are designed to be dropped directly into an AI coding agent's context (Claude Code, Cursor, Copilot).

The KB also contains **task playbooks** — structured prompt templates organized by task type (generate a color token set, compare systems, migrate tokens, etc.) — and **exemplars** — vetted example outputs that anchor quality for generative tasks and serve as preview content on the app.

The KB is the core value of the product. Everything else exists to make it discoverable and usable.

### Layer 2 — The App

A Next.js web application that is the public face of the project. It serves three purposes:

1. **Discovery** — Introduces Sistema, explains what it is and why it matters for developers building with AI coding agents
2. **Education** — Teaches users how to incorporate KB content and DESIGN.md files into their AI coding workflows
3. **Guidance delivery** — Hosts a playbook browser where users can explore task prompts by category, preview exemplar outputs, understand tier complexity, fill in interactive fields (accent color, typeface choices, etc.), and copy the final prompt for use in their agent session

The app also renders KB content as web pages with stable, predictable URLs. This is important: playbook prompts reference specific KB files by their deployed URL, so Claude Code and other tools can fetch and read them directly as part of executing a play.

**Example of how this works in practice:** A user opens the "Generate a Color Token Set" playbook on the app. They fill in their seed color and product type. The copy button produces a prompt like:

> "Read the Material Design 3 color system at https://sistema.design/material/guidance/foundations/color-system and the color token schema at https://sistema.design/material/implementation/tokens/token-schema. Then generate a color token set for my design system using #4A90D9 as the seed color for a consumer mobile app."

The KB files are both the data layer and the content that prompts reference. The stable URL structure (enforced by the stub system in `_meta/SCHEMA.md`) is what makes this work.

---

## Repository structure

The KB content stays at the root. The Next.js app source lives in `src/`. Tools stay in `tools/` with their own package.

```
sistema/
├── AGENTS.md                    — agent context and architectural rules
├── SESSION_LOG.md               — session history and current state
├── .gitignore
├── package.json                 — Next.js app dependencies (added in Phase 3)
├── next.config.ts               — (added in Phase 3)
├── tsconfig.json                — (added in Phase 3)
├── tailwind.config.ts           — (added in Phase 3)
│
├── src/                         — Next.js app source (added in Phase 3)
│   ├── app/                     — App Router pages and layouts
│   ├── components/              — React components
│   ├── lib/                     — KB reading utilities, prompt templating
│   └── styles/
│
├── public/                      — Static assets (added in Phase 3)
│
├── _meta/                       — KB schema, maintenance, usage guide, playbooks, index, changelog
│   └── exemplars/
│       ├── semantic-token-systems/
│       ├── design-md-files/
│       ├── token-migrations/
│       └── component-specs/
│
├── material/                    — Material Design 3 content
├── carbon/                      — Carbon (IBM) content (added in Phase 1)
├── atlassian/                   — Atlassian content (added in Phase 1)
├── [system]/                    — Additional systems added in Phase 2+
│
├── tools/                       — Scraping and validation scripts (own package.json)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── scrape/
│   └── validate/
│
├── docs/                        — Process documentation
├── tasks/                       — Phase task files
└── logs/                        — Archived session logs
```

---

## Development phases overview

| Phase | Layer | Goal |
|---|---|---|
| 0 | KB | Tools scaffold; Material Design 3 re-scrape and processing |
| 1 | KB | Carbon and Atlassian capture; exemplars for top plays |
| 2 | KB | Additional systems (Primer, Radix); component documentation |
| 3 | App | Next.js foundation; KB data layer; landing page |
| 4 | App | System browser; KB content pages; playbook browser with copy button |
| 5 | App + KB | Interactive playbook fields; polish; search; SEO |
| 6 | Launch | Vercel deployment; custom domain; analytics; launch checklist |

KB and app phases are intentionally sequential so the KB has enough content to make the app worth building before the app work begins. Once Phase 3 starts, some KB and app work may run in parallel where they don't interfere.

---

## KB phases

### Phase 0 — Tools scaffold and Material Design 3 foundation

**Goal:** Build the scraping and validation tooling. Replace the draft Material Design 3 guidance content with a full authoritative scrape.

**Before running any Phase 0 session:** Generate `tasks/phase-0.md` in a regular Claude chat session (not Claude Code) using this prompt:

> "Read `docs/META-PLAN.md` — specifically the project overview and Phase 0 goal. Read `tasks/TEMPLATE.md` and `AGENTS.md`. Generate `tasks/phase-0.md`: a complete, sequenced task list for Phase 0. Phase 0 goal: scaffold the `tools/` directory and complete a full, authoritative scrape of Material Design 3, replacing the current draft `material/` guidance content. Every task must have specific, verifiable acceptance criteria. Do not write any code."

Review and commit the task file before running any Claude Code sessions.

**Key tasks in this phase:**

- **0.1 — Tools scaffold:** Initialize `tools/package.json` with Firecrawl SDK, Playwright, gray-matter, zod, prettier, TypeScript. Create `tools/tsconfig.json`, `tools/.env.example`. Create `tools/scrape/firecrawl-guidance.ts` (accepts URL + system slug, writes raw output to `raw-scrape/[slug]/[date]/`, never to KB directories). Create `tools/validate/lint-frontmatter.ts` (validates frontmatter on all `.md` files in a system directory against `_meta/SCHEMA.md`). Run npm install. Verify clean.

- **0.2 — Material Design 3 scrape:** Run the Firecrawl scraper against `https://m3.material.io/styles` (and other M3 sections as needed). Inspect raw output — confirm pages are fully rendered prose, not empty JS shells. Document coverage gaps.

- **0.3 — Material guidance processing:** Process raw scrape output into KB files following Procedure B in `_meta/MAINTENANCE.md`. New versioned files for each topic. Existing draft files marked `legacy`. Stubs updated. Run frontmatter lint. Verify all acceptance criteria.

- **0.4 — Phase 0 housekeeping:** Archive session log entries, compress task file, update `AGENTS.md` patterns, preview Phase 1 task file for issues.

### Phase 1 — KB expansion: Carbon and Atlassian

**Goal:** Add two high-priority systems (Carbon IBM and Atlassian Design System), making the KB cross-system and dramatically more useful. Create exemplars for the most important generative plays.

**Generate `tasks/phase-1.md` before starting** (same process as Phase 0).

**Key tasks in this phase:**

- **1.1 — Carbon capture:** Full Procedure A from `_meta/MAINTENANCE.md` for Carbon. Priority: foundations (color, typography, spacing), getting-started, token assets. Frontmatter lint must pass.

- **1.2 — Atlassian capture:** Full Procedure A for Atlassian. Priority: same foundations set.

- **1.3 — DESIGN.md generation:** Generate DESIGN.md files for Carbon and Atlassian, derived from their newly captured guidance and asset files. Follow Procedure A Step 7.

- **1.4 — Exemplars:** Create at least two vetted exemplars: one for play 1.2 (Generate a Color Token Set) and one for play 6.1 (Generate a DESIGN.md). These are the plays most likely to be featured prominently on the app. Exemplars must include the worked example output plus annotations per `_meta/SCHEMA.md` Section 5.2.

- **1.5 — Phase 1 housekeeping**

### Phase 2 — KB expansion: Additional systems and component documentation

**Goal:** Expand coverage to Primer and Radix. Add component-level documentation for Material and Carbon. The KB should be substantive enough across multiple systems that the app has real depth to surface.

**Generate `tasks/phase-2.md` before starting.**

**Key tasks in this phase:**

- **2.1 — Primer (GitHub) capture:** Procedure A. Priority: color system (Primer has a notably clean semantic token model), typography, component docs for Button and Form elements.

- **2.2 — Radix capture:** Procedure A. Priority: design philosophy, component guidance for the most commonly used primitives.

- **2.3 — Material component documentation:** Add component-level guidance for Material (Button, Form elements, Navigation, Dialog). Update `_meta/INDEX.md`.

- **2.4 — Carbon component documentation:** Same set for Carbon.

- **2.5 — Additional exemplars:** Exemplars for plays 3.1 (Compare component across systems) and 4.2 (Generate a multi-tier token architecture). Both are prominently featured plays.

- **2.6 — Phase 2 housekeeping**

---

## App phases

### Phase 3 — App foundation

**Goal:** Add Next.js to the repository. Build the data layer that reads KB content at build time. Create the landing page and core routing structure.

**This is the first phase that modifies the repository structure significantly.** Before running any Phase 3 session, review the repo structure section above and confirm you understand how Next.js and KB content will coexist.

**Generate `tasks/phase-3.md` before starting.** Note: the task generation prompt for app phases should reference this document's app section rather than the KB procedures.

**Key tasks in this phase:**

- **3.1 — Next.js initialization:** Add Next.js App Router with TypeScript and Tailwind to the root `package.json`. Configure `tsconfig.json` and `tailwind.config.ts`. Confirm `tools/` remains its own separate package and does not conflict. Commit a working "Hello World" build that deploys cleanly.

- **3.2 — KB data layer:** Build `src/lib/kb.ts` — utilities for reading KB content files at build time using Node `fs`. Functions needed: list available systems (from `_meta/INDEX.md`), list files for a system, read a content file (parse frontmatter + body), follow a stub to its current versioned file. All reads happen at build time; no runtime filesystem access.

- **3.3 — Core routing structure:** Define the URL scheme for all content types. Recommended structure:
  - `/` — landing page
  - `/systems` — all available design systems
  - `/systems/[slug]` — per-system overview
  - `/systems/[slug]/[category]/[topic]` — individual KB content file
  - `/playbooks` — playbook browser index
  - `/playbooks/[category]/[play-id]` — individual playbook page

- **3.4 — Landing page:** Build the landing page. It should clearly explain what Sistema is (a structured KB of design system documentation for AI coding agents), why it exists, and how to use it. Include entry points to the system browser and playbook browser. No filler — every sentence earns its place.

- **3.5 — AGENTS.md update:** Add the app's architectural rules and directory structure to `AGENTS.md` so all future sessions understand both layers.

### Phase 4 — Core app features

**Goal:** Build the system browser, KB content pages, and the playbook browser with copy functionality. This is the first phase where the app is genuinely usable.

**Key tasks in this phase:**

- **4.1 — System browser:** `/systems` index page listing all available systems with their status, last updated date, and content coverage summary (pulled from `_meta/INDEX.md`). Per-system page at `/systems/[slug]` showing the system overview, source map, and a navigable content inventory.

- **4.2 — KB content pages:** Pages at `/systems/[slug]/[category]/[topic]` that render individual KB markdown files as styled HTML. Must handle stubs (follow `points_to` and render the target), display frontmatter metadata (system, content type, status, retrieved date, source URL), and render the markdown body. Include a link back to the system index and a "View source" link to the raw file on GitHub.

- **4.3 — Playbook browser index:** `/playbooks` page listing all plays from `_meta/TASK_PLAYBOOKS.md`, organized by category, with tier classification (Tier 1/2/3) and a brief description of each. This requires parsing the TASK_PLAYBOOKS.md document into structured data — build a parser or define a structured intermediate format in `src/lib/`.

- **4.4 — Individual playbook pages:** `/playbooks/[category]/[play-id]` page showing the full play: trigger phrases, required content types, retrieval sequence, reasoning strategy, and the prompt text. Include a **copy prompt button** that copies the prompt text (with any KB URLs filled in based on currently available systems) to the clipboard. Show a link to the exemplar if one exists.

### Phase 5 — Interactive playbooks, polish, and SEO

**Goal:** Add interactive fields to complex playbooks. Polish the app to a shippable standard. Prepare for search indexing.

**Key tasks in this phase:**

- **5.1 — Interactive playbook fields:** For Tier 2 and Tier 3 plays, define a template variable syntax in the playbook data (e.g. `{{accent_color}}`, `{{product_type}}`). Build a form UI that renders input fields for each variable. The copy button generates the completed prompt with all variables substituted. Start with the two or three plays most likely to be used interactively (color token generation, DESIGN.md generation, token migration).

- **5.2 — Exemplar previews:** On individual playbook pages, render the associated exemplar inline (collapsible) so users can see what a good output looks like before running the play. Pull exemplar content from `_meta/exemplars/`.

- **5.3 — Search:** Add search across systems, topics, and playbooks. Start with a simple client-side search index built at build time from all KB content summaries and playbook descriptions. Upgrade to a proper search service (Algolia, Orama) if needed.

- **5.4 — "How to use this" documentation:** A short guide explaining how to use Sistema in a Claude Code or Cursor session: where to put the DESIGN.md file, how to reference KB URLs in prompts, how to use playbooks effectively. This is educational content, not marketing copy.

- **5.5 — SEO and metadata:** Add `<title>`, `<meta description>`, and OpenGraph tags to every page. Generate OpenGraph images for key pages. Submit sitemap. Ensure KB content pages are fully indexable.

- **5.6 — Accessibility and performance audit:** Run Lighthouse on key pages. Fix any critical issues. Ensure the playbook copy button is keyboard accessible.

### Phase 6 — Launch

**Goal:** Deploy to production with a custom domain. Set up analytics. Confirm everything works end to end. Ship it.

**Key tasks in this phase:**

- **6.1 — Vercel deployment setup:** Connect the repository to Vercel. Configure build settings. Confirm the build completes cleanly and KB content is rendered correctly. Set up preview deployments for future PRs.

- **6.2 — Custom domain:** Attach the production domain. Configure DNS. Confirm HTTPS. Update any hardcoded URLs in the codebase (KB prompt templates, etc.) to use the production domain.

- **6.3 — Analytics:** Add Vercel Analytics (already included with Vercel). Confirm events are flowing. Set up a baseline for launch traffic.

- **6.4 — Final content review:** Read every page of the app. Check every playbook. Confirm all exemplars are present and render correctly. Spot-check five KB content pages for accuracy and rendering quality. Fix anything broken.

- **6.5 — Launch checklist sign-off:**
  - [ ] All Phase 0–5 phase transition checklists complete
  - [ ] Vercel deployment live on production domain
  - [ ] All KB systems have `status: latest` files with passing frontmatter lint
  - [ ] All stubs point to existing files
  - [ ] Playbook browser renders all plays from `TASK_PLAYBOOKS.md`
  - [ ] Copy button works on at least the top 5 plays
  - [ ] Interactive fields work on at least the top 2 Tier 2 plays
  - [ ] Landing page, system browser, playbook browser all render correctly on mobile
  - [ ] No broken links (run a link checker)
  - [ ] Analytics confirming data
  - [ ] `robots.txt` and sitemap live

---

## Generating task files before each phase

Before starting development on any phase, generate its task file. Use this prompt in a separate Claude chat session (not Claude Code):

> "Read `AGENTS.md`, `_meta/SCHEMA.md`, `_meta/MAINTENANCE.md`, and `docs/META-PLAN.md` (focus on the phase you're generating for). Read `tasks/TEMPLATE.md`. Generate `tasks/phase-N.md` — a complete, sequenced task list for Phase N using the format in the template. Every task must have specific, verifiable acceptance criteria. Do not write any code."

For app phases (3–6), also reference `SESSION_LOG.md` current state so the task file reflects what KB content is actually available.

Review the generated task file before committing it:
- Are tasks in the right order? Can each be completed without depending on something not yet built?
- Are acceptance criteria specific enough to verify without ambiguity?
- Does every task update `SESSION_LOG.md`?
- For KB tasks: does every scraping task validate *content quality*, not just that the scraper ran?
- For app tasks: does every UI task include a criterion for testing the feature in a browser?

**Generate task files one phase ahead** — have the next phase's file ready before you finish the current phase.

---

## Running a development session

Each session follows the same pattern regardless of whether it is a KB session or an app session.

**Starting the session:**

```
Read AGENTS.md in full. Then read SESSION_LOG.md — start with the Current State block.
Then read only the entry for task [TASK_ID] in tasks/phase-[N].md (not the full file).

Before writing any code, summarize:
1. What this task implements
2. Which files you will create or modify
3. Any dependencies on prior tasks and whether they are complete per the Current State block
4. Any potential conflicts with the architectural rules in AGENTS.md

Wait for my confirmation before proceeding.
```

Wait for the summary before the agent writes anything. If the summary is wrong, correct it now.

**Ending the session:**

```
Before we finish:
1. [KB sessions only] Run tools/validate/lint-frontmatter.ts on any system directories
   touched this session and report results
2. Verify every acceptance criterion in the task is checked off
3. Update SESSION_LOG.md:
   a. Add a full session entry (what was done, decisions made, what was not done)
   b. Replace the Current State block with the updated state
4. Mark the task complete in the phase task file
5. If this task established a new pattern, add it to the Patterns established
   section of AGENTS.md

Do not start the next task.
```

---

## Reviewing agent output

You are the quality gate.

**Always:**
- Is `SESSION_LOG.md` updated?
- Are all acceptance criteria from the task checked off?
- No `// TODO` or `// FIXME` in committed code

**For KB scraping tasks:**
- Is the scraped content actually rendered? Open a sample of the raw output files and confirm they contain real documentation prose, not empty JavaScript shells.
- Is coverage complete? Check raw output against the site's navigation — are major sections missing?
- Does the processed KB file read as coherent, useful documentation? Skim it. Garbled or truncated content is a bug, not a draft.

**For KB processing tasks (raw scrape → KB files):**
- Does frontmatter match `_meta/SCHEMA.md` exactly?
- Is content type correctly identified?
- Is content properly separated from navigation chrome, footers, and sidebar text?
- For `guidance` files: are specific values (token names, contrast ratios, spacing scales) preserved exactly — not rounded, paraphrased, or generalized?
- For `asset` files: spot-check three or four token values against the live source.

**For KB validation tooling:**
- Does the linter catch a file with a missing required frontmatter field?
- Does the linter catch a stub pointing to a non-existent file?
- Does the linter catch a versioned file with no corresponding stub?

**For app tasks:**
- Does the build complete without errors (`next build`)?
- Does the feature work in a browser — not just that the code compiles?
- For playbook pages: does the copy button actually copy the correct text?
- For KB content pages: does the stub-following work correctly (does the page show the right versioned content)?
- For interactive fields: do all variables get substituted in the copied prompt?
- No hardcoded URLs pointing to localhost

---

## Managing context loss between sessions

Each session starts fresh. `AGENTS.md` and `SESSION_LOG.md` are your primary tools.

**Keep tasks small and complete.** An 80%-done task is harder to resume than a 100%-done one.

**Name things consistently.** Use exact file paths from `AGENTS.md` everywhere — in the session log, task files, and commit messages.

**Commit after every task.** The git log should read like a table of contents.

**Don't skip `SESSION_LOG.md` updates.** When a session is going well it is tempting to skip the log and keep moving. Don't.

---

## Phase transition checklist

Before starting a new phase:

**For KB phases:**
- [ ] All tasks in the phase file are marked complete
- [ ] `tools/validate/lint-frontmatter.ts` passes on all system directories touched this phase
- [ ] All new versioned files have corresponding stubs
- [ ] `_meta/INDEX.md` is current — all new files are listed
- [ ] `_meta/CHANGELOG.md` has entries for all sessions this phase
- [ ] `SESSION_LOG.md` has entries for all sessions in this phase
- [ ] Phase retrospective written to `docs/phase-N-retro.md`
- [ ] Next phase's task file generated and reviewed
- [ ] Housekeeping session run

**For app phases:**
- [ ] All tasks in the phase file are marked complete
- [ ] `next build` completes without errors
- [ ] All new pages and features verified in a browser
- [ ] No broken internal links on pages touched this phase
- [ ] `SESSION_LOG.md` and `AGENTS.md` updated to reflect app structure changes
- [ ] Next phase's task file generated and reviewed

Do not start a new phase with a failing build or failing frontmatter lint.

---

## Phase-end housekeeping session

Run this at the end of every phase before starting the next one.

```
This is a housekeeping session. Do not write any code or KB content files.

1. Compress any completed task entries in tasks/phase-[N].md that still have
   their full body. Each completed task: status line, one-sentence output
   summary, key decisions, session log pointer.

2. Move all session entries for Phase [N] from SESSION_LOG.md to
   logs/phase-[N].md. Keep the project status header and Current State block
   in SESSION_LOG.md. Add a one-line pointer:
   "Phase [N] session entries archived to logs/phase-[N].md"

3. Review AGENTS.md Patterns established section. Add any patterns from
   Phase [N] that are missing.

4. Read tasks/phase-[N+1].md. Flag any entries that look wrong or depend on
   something not yet built. Do not edit them — just report what you find.

5. Report what you did and what (if anything) needs human attention.
```

---

## When things go wrong

**Frontmatter lint fails after a KB session:**
Open a focused session: "Read `AGENTS.md` and `SESSION_LOG.md`. The following lint errors are present: [paste output]. Do not do anything else. Fix the failing files only."

**A scraped file has incomplete or garbled content:**
This is a scraping quality bug, not an acceptable state. Fix the scraper or processing script before moving on. A KB file with empty shells or partial content will silently produce bad LLM output. Determine whether the problem is at the scrape step (Firecrawl not fully rendering the page) or the processing step (the processor stripping too much content), and fix the right layer.

**An architectural rule was violated:**
Do not work around it. Revert and re-implement correctly.

**`next build` fails in an app session:**
Do not proceed. Fix the build before committing. A broken build in the session log is a sign that acceptance criteria were not properly verified.

**A playbook prompt URL references a KB page that does not exist:**
The stub system is what guarantees URL stability. If a stub is missing or pointing to a non-existent file, that is a KB integrity bug. Fix it before the URL appears in any playbook prompt.

**The schema and a processed file conflict or have a gap:**
Stop work on the affected task. Resolve the ambiguity in a Claude chat session (not Claude Code), update `_meta/SCHEMA.md` if needed, then resume.

---

## Quick reference — session opening prompt

```
Read AGENTS.md in full. Then read SESSION_LOG.md — start with the Current State block.
Then read only the entry for task [TASK_ID] in tasks/phase-[N].md (not the full file).

Before writing any code, summarize:
1. What this task implements
2. Which files you will create or modify
3. Any dependencies on prior tasks and whether they are complete per the Current State block
4. Any potential conflicts with the architectural rules in AGENTS.md

Wait for my confirmation before proceeding.
```

## Quick reference — session closing prompt

```
Before we finish:
1. [KB sessions only] Run tools/validate/lint-frontmatter.ts on any system
   directories touched this session and report results
2. Verify every acceptance criterion in the task is checked off
3. Update SESSION_LOG.md:
   a. Add a full session entry (what was done, decisions made, what was not done)
   b. Replace the Current State block with the updated state
4. Mark the task complete in the phase task file
5. If this task established a new pattern, add it to the Patterns section of AGENTS.md

Do not start the next task.
```
