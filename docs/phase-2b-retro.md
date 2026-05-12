# Phase 2b Retrospective

**Date:** 2026-05-12
**Tasks:** 2b.1–2b.5
**Build at end:** 49 pages

---

## What Phase 2b accomplished

Phase 2b restructured the KB from a flat repo-root layout into a proper typed hierarchy (`kb/design-systems/`, `kb/standards/`, `kb/foundations/`), and built out the three-layer access model that makes the KB useful for agents: human-readable pages at `/kb/`, raw text at `/raw/`, and multi-file concatenation at `/bundle/`.

The four concrete deliverables:
- **Directory restructure (2b.1):** Content moved, routing overhauled, backward-compat redirects from `/systems/` in place. The `.md`-in-URL convention was the key design decision here — it makes raw vs. rendered access visually obvious and enables clean `/raw/` mirroring.
- **Raw endpoint (2b.2):** Every KB file is now fetchable as `text/plain` at a predictable URL. All 30 play URL references updated to point at `/raw/`.
- **DESIGN.md panel (2b.3):** System overview pages surface DESIGN.md as the primary agent action — copy content, copy URL, copy a ready-to-paste Claude Code instruction. No JS bundle needed; three independent copy-state machines with `useEffect` for origin hydration.
- **Bundle endpoint (2b.4):** Agents can fetch an entire system's context in one HTTP call instead of several. The `?topics=` param gives plays precise control; the default makes full-context plays trivial to write.

---

## What worked well

**`.md` in the URL** eliminated the routing ambiguity that would have made the `/raw/` mirroring awkward. The `[...path]` catch-all naturally captures the extension; stripping it for stub lookup is a one-liner. This design was user-proposed and was clearly right.

**`{{sistema_url}}` + bundle URLs** together solve the multi-file play problem cleanly. One URL, one fetch, full context — agents don't need to decide what to read.

**`readRawContent(stubPath)`** as a shared utility used by both `/raw/` and `/bundle/` kept the endpoints thin. Both handlers are ~25 lines.

---

## What was harder than expected

**Bundle default ordering:** The filesystem walker returns `design-md` before `guidance` alphabetically (`d` < `g`). The first implementation produced DESIGN.md before all the guidance files — wrong reading order for an agent. Fixed by splitting into two separate filter steps and concatenating guidance first.

**`TASK_PLAYBOOKS.md` edit conflict:** The Python URL substitution in task 2b.4 modified the file before the subsequent AGENTS.md-based edit could run cleanly. The file had to be re-read before the edit was applied. Not a blocking issue but added an extra step.

---

## Decisions made

- **KB categories are `design-systems`, `standards`, `foundations`** — typed and validated via `KB_CATEGORIES` const; routes 404 on unknown categories rather than showing empty states.
- **Standards and foundations are structural now, content later** — `_index.md` placeholders establish the categories so routing works without waiting for real content.
- **Bundle always returns guidance before DESIGN.md** — guidance informs the DESIGN.md; agents should read it in that order.
- **`findDesignMd` returns a `/raw/` path, not a boolean** — slightly more work in `kb.ts` but saves the page component from constructing the URL itself.

---

## Carry-forward to Phase 3

- **`tasks/phase-3.md` had stale paths** — all `material/`, `carbon/`, `atlassian/`, and `/systems/primer` references updated to `kb/design-systems/` equivalents during 2b.5 housekeeping.
- **Task 3.4 (Primer KB capture)** will be the first content task using the new structure — good integration test for the full pipeline.
- **Task 3.1 (Interactive playbook fields)** can now use `{{variable_name}}` directly in play bodies without worrying about URL template conflicts — the `{{sistema_url}}` pattern is already established.
