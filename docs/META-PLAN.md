# Meta-Plan — Orchestrating AI-Assisted Development

**For:** The human developer (you)
**Purpose:** How to set up, sequence, and manage the AI-assisted development of this project from scratch

This document is for you, not for Claude Code. It describes your role as orchestrator — what to do before the first session, how to run each session, and how to maintain quality and momentum across phases.

---

## Repository initialization (Claude Code scaffold session)

The scaffold is a Claude Code task. Run it as a dedicated session before any Phase 0 development begins. The only thing you need to do manually first is create the git repository and place the docs inside it — everything else the agent handles.

**Before running the scaffold session:**
1. `git init` your repository
2. Unzip the KB starter package into the repo root — this gives you `_meta/`, `material/`, `tools/` (empty), `docs/`, `tasks/TEMPLATE.md`, `AGENTS.md`, `SESSION_LOG.md`, and `.gitignore`
3. Place `docs/META-PLAN.md` (this file) in `docs/`
4. Generate `tasks/phase-0.md` in a Claude chat session before running the scaffold (see "Generating task files before each phase" below)

Then run this prompt in Claude Code:

```
Read AGENTS.md in full. Then read SESSION_LOG.md — start with the Current State block.
Then read only the entry for task 0.1 in tasks/phase-0.md (not the full file).

Your task is to scaffold the tools/ directory for this repository. Do not touch
any KB content files (_meta/, material/, or other system directories).

1. Initialize tools/package.json with the following dependencies:
   - @mendable/firecrawl-js (Firecrawl SDK)
   - playwright
   - gray-matter (frontmatter parsing and writing)
   - zod (schema validation)
   - prettier (for formatting output markdown)
   devDependencies: typescript, tsx, @types/node

2. Create tools/tsconfig.json extending the root tsconfig if present, targeting
   tools/src/. Strict mode, ESNext target.

3. Create tools/.env.example with: FIRECRAWL_API_KEY=

4. Create tools/scrape/firecrawl-guidance.ts — a working script that:
   - Accepts a target URL and system slug as CLI arguments
   - Uses the Firecrawl crawl API to fetch all pages under that URL
   - Writes raw output to raw-scrape/[slug]/[YYYY-MM-DD]/ (never to KB directories)
   - Logs a summary: pages fetched, total content size, any errors

5. Create tools/validate/lint-frontmatter.ts — a script that:
   - Reads all .md files under a given system directory
   - Validates frontmatter against the required fields in _meta/SCHEMA.md
   - Reports: missing required fields, invalid status values, versioned files
     missing a corresponding stub, stubs pointing to non-existent files

6. Run npm install in tools/. Verify it completes without errors.

7. Run the Firecrawl scraper against https://m3.material.io/styles with
   slug=material. Report: how many pages were fetched, what the top-level
   sections were, whether the content appears fully rendered (not empty JS shells).

8. Update SESSION_LOG.md with what was done, what the scrape result showed,
   and any decisions made that were not specified above.

Make a single commit: "Phase 0, Task 0.1 — tools scaffold and first scrape"

Report anything that did not work cleanly. Do not begin processing scraped
content into KB files — that is a separate task.
```

Review the agent's report before starting task 0.2. If anything didn't verify cleanly, fix it in a follow-up session rather than carrying broken tooling into the next task.

---

## Generating task files before each phase

Before starting development on any phase, generate its task file. Use this prompt in a separate Claude chat session (not Claude Code):

> "Read `AGENTS.md`, `_meta/SCHEMA.md`, and `_meta/MAINTENANCE.md`. Read `tasks/TEMPLATE.md`. Generate `tasks/phase-N.md` — a complete, sequenced task list for Phase N using the format in the template. Every task must have specific, verifiable acceptance criteria. Do not write any code."

Review the generated task file carefully before committing it. Ask yourself:
- Are tasks in the right order? Can each be completed without depending on something not yet built?
- Are acceptance criteria specific enough to verify without ambiguity?
- Does every task update `SESSION_LOG.md`?
- For scraping tasks: does every task have a criterion that validates the *content quality* of what was captured, not just that the scraper ran?

Commit the task file, then start the phase.

**Generate task files one phase ahead** — have Phase 1's task file ready before you finish Phase 0.

---

## Running a development session

Each session follows the same pattern.

**Starting the session** — give Claude Code this instruction:

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

**During the session:**
- Let the agent work. Intervene if it starts working outside task scope.
- If it gets stuck, ask it to describe the blocker — don't just ask it to try again.
- Scraping and processing tasks have a clear feedback loop: run scraper → inspect raw output → run processor → validate KB file → check frontmatter lint. This is the equivalent of write → test → see result in a code project.

**Ending the session** — use this closing prompt:

```
Before we finish:
1. Run tools/validate/lint-frontmatter.ts on any system directories touched this
   session and report results
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
- Does `tools/validate/lint-frontmatter.ts` pass on all touched system directories?
- Are all new versioned files accompanied by a corresponding stub?
- Are `_meta/INDEX.md` and `_meta/CHANGELOG.md` updated?
- Is `SESSION_LOG.md` updated?

**For scraping tasks:**
- Is the scraped content actually rendered? Open a sample of the raw output files and confirm they contain the real documentation prose, not empty JavaScript shell pages.
- Is the coverage complete? Check the raw output against the site's navigation structure — are any major sections missing?
- Does the processed KB file read as coherent, useful documentation? Skim it. If it's garbled, truncated, or missing obvious content, the scrape quality is the bug.

**For processing tasks (raw scrape → KB files):**
- Does the frontmatter match the schema in `_meta/SCHEMA.md` exactly?
- Is the content type correctly identified — `guidance`, `implementation`, or `asset`?
- Is the content properly separated from navigation chrome, footers, and sidebar text?
- For `guidance` files: does the content preserve specific values (token names, contrast ratios, spacing scales)? These must not be rounded, paraphrased, or generalized.
- For `asset` files: are the token values accurate? Spot-check three or four values against the live source.

**For validation tooling tasks:**
- Does the linter catch a file with a missing required frontmatter field?
- Does the linter catch a stub pointing to a non-existent file?
- Does the linter catch a versioned file with no stub?

**For any task:**
- No hardcoded values in tool scripts that should be arguments or config
- No `console.log` left in production tool paths
- No `// TODO` or `// FIXME` in committed code (these belong in `SESSION_LOG.md`)

---

## Managing context loss between sessions

Each session starts fresh. `AGENTS.md` and `SESSION_LOG.md` are your primary tools.

**Keep tasks small and complete.** An 80%-done task is harder to resume than a 100%-done one.

**Name things consistently.** Use the exact file paths from `AGENTS.md` everywhere — in the session log, in task files, in commit messages.

**Commit after every task.** The git log should read like a table of contents: "Phase 0, Task 0.3 — Material color guidance processing."

**Don't skip `SESSION_LOG.md` updates.** When a session is going well it's tempting to skip the log and keep moving. Don't.

---

## Phase transition checklist

Before starting a new phase:

- [ ] All tasks in the phase file are marked complete
- [ ] `tools/validate/lint-frontmatter.ts` passes on all system directories touched this phase
- [ ] All new versioned files have corresponding stubs
- [ ] `_meta/INDEX.md` is current — all new files are listed
- [ ] `_meta/CHANGELOG.md` has entries for all sessions this phase
- [ ] `SESSION_LOG.md` has entries for all sessions in this phase
- [ ] Phase retrospective written to `docs/phase-N-retro.md`
- [ ] Next phase's task file generated and reviewed
- [ ] **Housekeeping session run** (see below)

Do not start a new phase with a failing frontmatter lint.

---

## When things go wrong

**Frontmatter lint fails after a session:**
Open a focused session: "Read `AGENTS.md` and `SESSION_LOG.md`. The following lint errors are present: [paste output]. Do not do anything else. Fix the failing files only."

**A scraped file has incomplete or garbled content:**
This is a scraping quality bug, not an acceptable state. Fix the scraper or the processing script before moving on. A KB file that contains empty shells or partial content is worse than no file — it will silently produce bad LLM output. Identify whether the problem is at the scrape step (Firecrawl not fully rendering the page) or the processing step (the processor stripping too much), and fix the right layer.

**An architectural rule was violated:**
Do not work around it. Revert and re-implement correctly. A violation that is "good enough for now" will cause a harder problem in a later phase.

**The schema and a processed file conflict or have a gap:**
Stop work on the affected task. Resolve the ambiguity in a Claude chat session (not Claude Code), update `_meta/SCHEMA.md` if needed, then resume.

---

## Phase-end housekeeping session

Run this at the end of every phase before starting the next one. Produces no code or KB content — only documentation maintenance.

**Prompt:**

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
1. Run tools/validate/lint-frontmatter.ts on any system directories touched
   this session and report results
2. Verify every acceptance criterion in the task is checked off
3. Update SESSION_LOG.md:
   a. Add a full session entry (what was done, decisions made, what was not done)
   b. Replace the Current State block with the updated state
4. Mark the task complete in the phase task file
5. If this task established a new pattern, add it to the Patterns section of AGENTS.md

Do not start the next task.
```
