# Phase 2 Task File

**Phase goal:** Deploy the app, validate plays through live testing, and add Carbon as the second KB system — giving the app genuine multi-system value.

**Systems touched:** `carbon/` (new), `material/` (read-only reference)
**App:** Extending existing `src/` — no structural changes expected

**Context from Phase 1:**
- 31 static pages; all Material content routes functional; frontmatter lint passing
- Plays reference `{{sistema_url}}` substituted at copy time — live deployment required before play testing
- Carbon and Atlassian KB capture deferred from Phase 1

---

## Task 2.1 — Vercel deployment

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

Connects the repository to Vercel and produces a stable preview deployment URL. This is a prerequisite for play testing — plays reference `{{sistema_url}}` which must resolve to a real origin when an agent fetches the linked pages.

### Files created or modified

- No source files modified
- Vercel project config created via Vercel dashboard or CLI
- `SESSION_LOG.md` updated with preview URL

### Acceptance criteria

- [ ] Repository connected to Vercel (via dashboard or `vercel link`)
- [ ] `vercel build` completes without errors
- [ ] Preview deployment accessible at a `vercel.app` URL
- [ ] `/`, `/systems`, `/systems/material`, `/playbooks`, `/playbooks/generate-design-md` all render correctly at the preview URL
- [ ] No hardcoded `localhost` URLs on any rendered page
- [ ] Preview URL recorded in `SESSION_LOG.md`
- [ ] `SESSION_LOG.md` updated with full task entry
- [ ] Commit created if any config files were added

---

## Task 2.2 — Play testing

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

Validates play quality by running plays end-to-end against a scratch repository. Copy each tested play from the deployed app, paste into a coding agent, inspect the generated output for correctness, structure, and usefulness. Update play body text based on observed results.

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — play body text updated based on test findings
- `SESSION_LOG.md` — detailed findings per play tested

### Acceptance criteria

- [ ] At minimum these 4 plays tested end-to-end (paste into Claude Code, inspect output):
  - `generate-design-md` (Stage 1)
  - `generate-primitive-colors` (Stage 2)
  - `generate-color-roles` (Stage 3)
  - `specify-component` (Stage 4)
- [ ] For each tested play: output quality assessed (structure correct? values sensible? actionable without rework?)
- [ ] Any play where output was poor or off-target: body text revised; re-tested
- [ ] Findings documented in `SESSION_LOG.md`: what worked, what didn't, what was changed
- [ ] `_meta/TASK_PLAYBOOKS.md` committed with any revisions
- [ ] `npm run build` passes after any play text changes

---

## Task 2.3 — Carbon KB capture

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

Full Procedure A from `_meta/MAINTENANCE.md` for IBM Carbon Design System. Scrapes Carbon's documentation site and GitHub repository, processes raw output into KB files, validates frontmatter. Priority topics match what Material has: color system, typography, design tokens, getting-started, and token asset files. Produces a `carbon/_index.md` and enough content files to make the system browser useful.

### Files created or modified

- `carbon/_index.md` — system index with name, overview, source map, content inventory
- `carbon/guidance/foundations/color.md` and versioned file — color system guidance
- `carbon/guidance/foundations/typography.md` and versioned file — typography guidance
- `carbon/guidance/foundations/design-tokens.md` and versioned file — token architecture
- `carbon/implementation/getting-started.md` and versioned file — developer setup
- `carbon/assets/tokens/colors.json` and versioned file — color token values
- `carbon/assets/tokens/typography.json` and versioned file (if extractable)
- `carbon/design-md/DESIGN.md` and versioned file — generated DESIGN.md for Carbon
- `_meta/INDEX.md` — updated with Carbon entries
- `_meta/CHANGELOG.md` — session entry added

### Acceptance criteria

- [ ] `carbon/_index.md` exists with complete Overview, Source Map, and Content Inventory sections
- [ ] At minimum 4 guidance or implementation files present and lint-passing
- [ ] At minimum 1 asset token file (colors) present with real token values (not empty)
- [ ] `carbon/design-md/DESIGN.md` stub exists pointing to a generated DESIGN.md file
- [ ] `npx tsx tools/validate/lint-frontmatter.ts carbon/` reports **zero errors**
- [ ] All stub files point to existing versioned files (no dangling stubs)
- [ ] `_meta/INDEX.md` and `_meta/CHANGELOG.md` updated
- [ ] `SESSION_LOG.md` updated with full task entry (scrape passes, coverage gaps, decisions)
- [ ] Commit created

---

## Task 2.4 — Wire Carbon into app

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

Confirms the existing app code correctly surfaces the Carbon KB without any code changes. Because the app uses `listSystems()` and `listStubsForSystem()` dynamically, adding a valid Carbon directory should automatically produce new routes. This task verifies that, fixes anything that doesn't work, and confirms the multi-system state in the browser.

### Files created or modified

- `src/lib/kb.ts` — only if bugs are found (should require no changes)
- `src/app/systems/[slug]/page.tsx` — only if Carbon content structure exposes edge cases

### Acceptance criteria

- [ ] `/systems` lists both Material Design 3 and Carbon — no code change required
- [ ] `/systems/carbon` renders: system name, overview, source map, content links — all from `carbon/_index.md`
- [ ] At least 4 Carbon content pages render correctly at their stub paths
- [ ] Carbon DESIGN.md page renders at `/systems/carbon/design-md/DESIGN`
- [ ] `/systems/carbon/guidance/foundations/nonexistent` returns 404
- [ ] `npm run build` passes; Carbon routes appear in build output
- [ ] All Carbon pages tested in browser: content readable, no console errors
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created if any code changed; or a note confirming no changes were needed

---

## Task 2.5 — Atlassian KB capture

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

Full Procedure A for Atlassian Design System (Atlassian Design System / ADS). Priority: color system, typography, and design tokens. Atlassian has a well-documented semantic color model worth capturing for contrast with Material and Carbon. Scope is lighter than Carbon — enough for the system browser to be useful, not a full documentation scrape.

### Files created or modified

- `atlassian/_index.md` — system index
- `atlassian/guidance/foundations/color.md` and versioned file
- `atlassian/guidance/foundations/typography.md` and versioned file
- `atlassian/assets/tokens/colors.json` and versioned file (if extractable from source)
- `_meta/INDEX.md` — updated
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `atlassian/_index.md` exists with complete sections
- [ ] At minimum 2 guidance files present and lint-passing
- [ ] `npx tsx tools/validate/lint-frontmatter.ts atlassian/` reports zero errors
- [ ] `/systems/atlassian` renders in the app (follows automatically from Task 2.4's code)
- [ ] `npm run build` passes with Atlassian routes in output
- [ ] `SESSION_LOG.md` updated
- [ ] Commit created

---

## Task 2.6 — Phase 2 housekeeping

**Status:** not started
**Phase:** 2
**Session log entry:** (link after completion)

### What this task implements

End-of-phase housekeeping. Compresses task file, archives session log, updates AGENTS.md with any new patterns, writes the Phase 2 retrospective, and reviews `tasks/phase-3.md`.

### Files created or modified

- `tasks/phase-2.md` — all task entries compressed
- `tasks/phase-3.md` — generated and reviewed
- `SESSION_LOG.md` — Phase 2 entries removed; pointer to archive; Current State updated
- `logs/phase-2.md` — Phase 2 session entries archived
- `AGENTS.md` — any new patterns from Phase 2 added
- `docs/phase-2-retro.md` — brief retrospective

### Acceptance criteria

- [ ] All completed task entries in `tasks/phase-2.md` compressed to summary form
- [ ] All Phase 2 session entries moved from `SESSION_LOG.md` to `logs/phase-2.md`
- [ ] `SESSION_LOG.md` contains pointer to archive and Current State showing Phase 3 pending
- [ ] `AGENTS.md` updated with any Carbon-specific scraping patterns discovered
- [ ] `docs/phase-2-retro.md` written
- [ ] `tasks/phase-3.md` generated and any issues flagged
- [ ] `npx tsx tools/validate/lint-frontmatter.ts material/ carbon/ atlassian/` passes
- [ ] `npm run build` passes
- [ ] Commit created
