# Phase 9 Task File

**Phase goal:** Play quality — audit every current play end-to-end, fix the gaps discovered during dogfooding, and ship two high-leverage improvements from the backlog.

**Context from Phase 8:**
- Bootstrap campaign completed end-to-end on Sistema itself; token pipeline is working
- Two BACKLOG items discovered: (1) `positioning-brief` doesn't feed-forward to downstream play variables; (2) no `scaffold-component-library` play to bridge tokens → components
- Plays have not been evaluated for output quality — only structural correctness
- Vercel deployment not yet live; `{{sistema_url}}` resolves to localhost in dev (blocks real-world play sharing)
- Source citations sidebar added to all KB content pages
- Build: 142 static pages, lint clean

---

## Task 9.0 — Play quality audit

**Status:** not started
**Phase:** 9

### What this task implements

A systematic end-to-end run of every current play, evaluated against four quality criteria:

1. **Format match** — output matches the expected format (CSS custom properties, JSON, markdown, etc.)
2. **Accessibility compliance** — output satisfies the non-negotiables in `kb/principles/accessibility/floor` (WCAG AA contrast, defined foreground/background pairs, touch target sizes where applicable)
3. **No reference-system fingerprints** — output contains no Material Design, Carbon, or Atlassian-specific terminology, token naming, or structural patterns
4. **No unresolved variables** — all `{{variable_name}}` placeholders are filled; no template artifacts in output

Each play is run by reading its prompt from `_meta/TASK_PLAYBOOKS.md`, substituting `{{sistema_url}}` with the localhost or current URL, executing it in a Claude session against a generic fictional product context, and evaluating the output. Failures are documented with specific remediation steps.

### Files created or modified

- `docs/play-quality-audit.md` — findings per play, pass/fail per criterion, remediation notes
- `_meta/TASK_PLAYBOOKS.md` — updated play bodies for any plays that fail
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] All 18 plays (Stages 1–6) evaluated against all 4 criteria
- [ ] Every failing criterion has a specific documented fix
- [ ] All fixable failures corrected in play body text
- [ ] `docs/play-quality-audit.md` written with findings
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 9.1 — Fix `positioning-brief` feed-forward

**Status:** not started
**Phase:** 9
**Backlog reference:** `_meta/BACKLOG.md` — "positioning-brief should produce feed-forward outputs for downstream plays"

### What this task implements

The positioning brief collects color direction, typography direction, density, and theme preferences — but its output is narrative prose. Downstream plays (`generate-color-scheme`, `generate-type-scale`, `generate-shape-tokens`) each ask for variables like `{{color_direction}}`, `{{type_direction}}` that the user has to manually re-state.

Fix: add an **Outputs** section at the end of the `positioning-brief` play body that formats the answers in the exact variable format required by each downstream play:

```
## Outputs for downstream plays

Copy these into the next play's input fields:

**For generate-color-scheme — Color Direction:**
[Summarize the primary color, palette model, and light/dark decision in 1–2 sentences]

**For generate-type-scale — Type Direction:**
[Summarize the density, typeface character, and key scale decision in 1–2 sentences]
```

This eliminates the re-statement friction without requiring any app changes.

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — update `positioning-brief` play body
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `positioning-brief` output includes an Outputs section with pre-formatted inputs for `generate-color-scheme` and `generate-type-scale`
- [ ] The formatted outputs match the exact `{{variable_name}}` input fields in the downstream plays
- [ ] Running `positioning-brief` end-to-end produces an Outputs section that can be copy-pasted without modification
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 9.2 — `scaffold-component-library` play

**Status:** not started
**Phase:** 9
**Backlog reference:** `_meta/BACKLOG.md` — "scaffold-component-library play for headless library integration"
**Memory:** `project_direction_phase9.md`

### What this task implements

A new Stage 4 play that bridges token generation and component implementation. The bootstrap campaign currently ends at Step 6 (Style Dictionary config) — users have tokens but no components. This play detects or recommends a headless component library based on the stack in the living brief, wires its token slots to the generated token file, and establishes the pattern for subsequent `add-component` calls.

**Play structure:**
1. Read the living brief to determine the stack (framework, CSS approach, existing dependencies)
2. Fetch `kb/principles/tokens/architecture` for token mapping guidance
3. Recommend and justify a headless library (shadcn/ui for Tailwind/Next.js, Base UI or Radix for custom CSS, Ark UI for other frameworks)
4. Generate: (a) the installation/setup command, (b) the token wiring layer (how to map `--color-primary` etc. to the library's CSS variable slots), (c) a template for `add-component` calls that reference the established wiring
5. Append scaffold decision to the living brief

**Variable:** `{{stack_description}}` — framework, CSS approach, and any existing dependencies from the project.

### Files created or modified

- `_meta/TASK_PLAYBOOKS.md` — add `scaffold-component-library` play (Stage 4)
- `src/lib/playbooks.ts` — no change needed if Stage 4 already exists
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Play appears at `/playbooks/scaffold-component-library`
- [ ] Play produces working setup instructions for at least shadcn/ui + Tailwind + Next.js stack
- [ ] Token wiring output correctly maps semantic token vars to the headless library's CSS variable slots
- [ ] Output makes a concrete library recommendation with justification, not an open-ended list
- [ ] Lint passes | Build passes | SESSION_LOG.md updated

---

## Task 9.3 — Vercel deployment

**Status:** not started
**Phase:** 9

### What this task implements

Deploy the Sistema app to Vercel. Set `NEXT_PUBLIC_SITE_URL` environment variable to the production URL so that `{{sistema_url}}` in play prompts resolves to a real, shareable URL. Verify all 142 static pages render correctly.

This unblocks: (1) play testing from a shared URL without running localhost, (2) sharing individual play pages with other users, (3) embedded play URLs in future documentation.

### Files created or modified

- `vercel.json` (if needed for routing config)
- `_meta/CHANGELOG.md` — updated with production URL

### Acceptance criteria

- [ ] App deployed and accessible at production URL
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel environment variables
- [ ] `{{sistema_url}}` in copied play prompts resolves to production URL (not localhost)
- [ ] All 142 pages load without error
- [ ] SESSION_LOG.md updated with production URL

---

## Task 9.4 — Phase 9 housekeeping

Standard end-of-phase: compress task file, archive session log, update AGENTS.md, write retro, generate `tasks/phase-10.md`.

Phase 10 scope (to be defined during this task): depends on Phase 9 findings. Likely candidates: additional KB systems (a non-English or non-web design system), APCA-based accessibility tooling, campaign flow improvements based on real user feedback, multi-user or export features.

### Acceptance criteria

- [ ] All Phase 9 session entries archived to `logs/phase-9.md`
- [ ] `tasks/phase-9.md` compressed to summaries
- [ ] `AGENTS.md` updated with Phase 9 patterns
- [ ] `docs/phase-9-retro.md` written
- [ ] `tasks/phase-10.md` generated
- [ ] Lint passes | Build passes | Commit created
