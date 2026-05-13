# Phase 5 Retrospective

**Date:** 2026-05-13
**Tasks completed:** 5.1, 5.2, 5.3, 5.4, 5.6 (5.5 dropped, 5.7 deferred)
**Build at close:** passing — ~95 static pages

---

## What went well

**Content velocity.** Four design systems / KB sections captured across a handful of sessions. The scraping + synthesis workflow is now well-established: Firecrawl or WebFetch → raw-scrape → KB files → stubs → index updates. Radix and Ant Design were each captured in single sessions with no significant blockers.

**Ant Design's design values document.** The only KB file in the repo documenting design values as a governance artifact (Natural/Certain/Meaningful/Growing). This is useful context that no other system had explicitly in the KB — it models what we eventually want in every system's coverage.

**Play testing in-session.** The play testing approach turned out to be executable directly within a Claude session rather than requiring a live Vercel deployment. Both tested plays produced exemplar-quality outputs that will serve as useful reference. The format for exemplar files is now well-established.

**Source licensing rule.** Step 1b established a clear, three-tier framework for source licensing that is firm without being overly restrictive. It doesn't block any reasonable source category but creates a paper trail for auditing.

---

## What was challenging

**Firecrawl rate limits.** Still a consistent friction point. The 3 req/min free tier limit required 70s gaps between sequential scrapes, adding elapsed time to every capture session. Workaround (WebFetch for server-rendered pages) is now a settled pattern.

**JS SPA sources.** Google Fonts Knowledge was unreachable via Firecrawl (JS shell). Fallback to practicaltypography.com and spencermortensen.com worked but introduced Tier 3 source licensing concerns that are now flagged for the audit task.

**M3 assumptions in plays.** The play testing revealed that even with "don't copy M3 values" language, plays heavily anchored to Material's conceptual model — tonal palettes, `on-*` taxonomy, `display/headline/title` roles. This limitation is what drove the product direction shift at the end of the phase.

---

## What changed: the Phase 5 pivot

The most significant outcome of Phase 5 was not any individual content task — it was the product direction shift established in the final session. The core realization: Sistema should not be a place where users copy existing design systems; it should be a synthesis engine for building original, professional-quality design systems informed by collective wisdom.

This produced several connected decisions:

**`kb/principles/`** — a new KB section for cross-system synthesis, replacing the idea of pointing plays at individual reference systems. Content in this section distills what good looks like across all systems, not what any one system does.

**`kb/reference/`** — the existing `design-systems/`, `standards/`, and `foundations/` directories will be nested under this parent in Phase 6, clarifying that they are raw material for synthesis rather than primary user-facing content.

**Campaigns.** The playbook's single-step plays are insufficient for the design system creation lifecycle. A new "campaign" format — multi-step, file-anchored, context-threaded — will handle the full bootstrap flow. Campaigns use synthesis KB URLs, not individual system URLs.

**The living brief.** Projects need a per-project state document (`CONTEXT.md` evolved to a full spec) that plays read at the start and update at the end. This is the "right context in window" mechanism for ongoing design system work.

**Stewardship stage.** Design systems don't end at bootstrap. A Stage 6 (maintenance/stewardship) in the playbook covers the ongoing planning → execution → retrospective → repeat lifecycle.

---

## What's next (Phase 6)

Phase 6 is almost entirely knowledge and content work — no major app changes. The goal is to build the synthesis layer and redesign the playbook to be system-independent:

1. KB restructure (Task 6.0) — migrate to `reference/` + create `principles/`
2. Synthesis KB documents (Tasks 6.1–6.6) — token architecture, color, typography, spacing/shape/depth/motion, accessibility floor, AI concerns
3. Living brief spec (Task 6.7)
4. Campaign redesign (Task 6.8) — strip M3 assumptions, add positioning play, wire synthesis refs
5. Maintenance plays (Task 6.9) — Stage 6 stewardship plays
6. License audit (Task 6.10) — carry-forward from 5.7
7. Housekeeping (Task 6.11)

Phase 7 (app engineering) follows: intake form, campaign file generator, flow UI, advanced options.
