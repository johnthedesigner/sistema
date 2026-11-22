# SESSION_LOG.md

## Current State

**Phase:** v2 Phase 4 (MCP server), after the Phase 3 gate. See `docs/v2/ROADMAP.md` and `tasks/v2/phase-4.md`.
**Branch:** `v2`. All work commits here. Nothing merges to `main` until Task VF.
**Last completed task:** V3.9; Phase 3 gate approved 2026-11-22
**Next task:** V4.0 — MCP package versions and APIs.
**Blockers:** none. Open item: PostHog key missing from the Vercel Preview environment (owner, later; needed before V3.7)
**Notes:** `v2` is pushed. Preview: https://sistema-git-v2-jtd-604ef502.vercel.app. CI is green. `v1-baseline` tag marks `main` before v2 (setup A for the V5 comparison). Production domain: https://sistema.johnthedesigner.com. Commit messages start with the task ID (`V0.1: ...`).

---

## Session log

### 2026-11-22 — Analytics delivery check

- Preview build has the PostHog key (set as a public Config variable). Browser events reach PostHog (200) under one `internal-` ID; no storage written. Server events triggered with `internal-d75e8b05-3e0e-4555-936a-e768b7e4b463`; the owner confirms them in PostHog.

Phase 3 entries are archived in `logs/v2-phase-3.md`.
