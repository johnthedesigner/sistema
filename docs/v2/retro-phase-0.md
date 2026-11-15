# v2 Phase 0 Retro

**Dates:** 2026-11-14. **Tasks:** V0.0 to V0.7 (V0.5 dropped).

## What shipped

- A repo audit, a bug inventory (33 entries, 1 withdrawn), and plan corrections.
- The capability model, which changed the direction of V1. Workflows and plays are organized by topic, with milestones derived from contracts. The MCP tool surface is fixed in size.
- Server-side `{{sistema_url}}` resolution in one function. Placeholders in built pages went from 35 to 0, and relative agent URLs from 16 to 0.
- A content integrity checker with 13 rules. Code-level rules now block the build (prebuild and postbuild). The content-level baseline for V1 is 62.
- Vitest (29 tests, including route tests for `/raw` and `/bundle`), the ESLint CLI, a CI workflow (not yet run), and the workspace-root fix.

## What went well

- **Checking built output, not just source, was the right call.** It showed that placeholder bugs were a rendering problem, not a content problem. That turned an edit-25-plays task into a code fix in one place.
- **Writing the checker before the fixes produced a measured list,** and it also found things the audit missed: a bare URL, unresolved tool page paths, and the contrast tool's Copy button.
- **Pausing to rethink the model before V1 saved real work.** The V0 content fixes would have been thrown away. Recognizing the single-merge model made that clear.

## What to watch

- **Checker rules can be wrong.** Bug #29 was a false positive. Every new rule needs a fixture for its known-valid edge cases, not just its failures.
- **`.env.local` affects local builds.** It bakes an ngrok URL into local builds. Output checks still pass, because the URL is absolute, but local HTML is not representative of production. Builds meant to mirror production should run without it.
- **CI has never run.** The workflow is untested until `v2` is pushed (decision brief D9).
- **V1 is large.** The slice and fit review exist to catch model problems early. Don't skip them under time pressure.

## Numbers

| | Start of V0 | End of V0 |
|---|---|---|
| Tests | 0 | 29 |
| Code-level violations (source and output) | 57 | 0 |
| Content-level violations | 62 | 62 (V1 baseline) |
| Build pages | 197 | 197 |
| Lint | 0 errors, 2 warnings | 0 errors, 2 warnings |
