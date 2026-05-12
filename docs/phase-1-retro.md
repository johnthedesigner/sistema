# Phase 1 Retrospective

**Date:** 2026-05-11
**Phase goal:** Build the complete Next.js app using the Material Design 3 KB.
**Outcome:** Complete. 31 static pages, all routes functional, build and lint passing.

---

## What went smoothly

**The data layer design held up.** `kb.ts` stub-following logic worked correctly for all content types from the start. The pattern of `resolveStub(stubPath) → versioned file → frontmatter + body` was clean and required no structural changes.

**Build-time-only reads.** Keeping all KB filesystem reads in `generateStaticParams` and page-level data functions (no runtime reads) worked cleanly with Next.js static generation. No hydration issues, no client-side filesystem access attempted.

**The stub URL structure as app routing.** The KB stub paths map directly to URL segments with no translation layer. This is elegant and means adding a new content file to the KB automatically creates a valid app URL without any route config changes.

**Playbook rethink produced better clarity.** Stopping mid-task to rethink the play format before investing in the wrong content was the right call. The strategic conversation clarified: plays should be agent-ready prompts, organized by build stage, linking to hosted content rather than assuming local KB access.

---

## What was harder than expected

**JSON asset stub discovery.** The `listStubsForSystem` function initially only looked for `.md` stubs, missing the three `.json` asset token stubs entirely. This caused a silent discrepancy (15 pages instead of the expected 18) that required investigating the KB file structure. The fix was straightforward but the discrepancy wasn't obvious until checking page counts.

**The stale dev server problem.** A dev server left running from an earlier verification caused 404s for JS/CSS chunks in the next browser session, because the browser reconnected to a dead server instance. Rule established: always kill the dev server after programmatic verification; don't leave it running.

---

## Decisions not elsewhere documented

**Play content is intentionally unrefined.** The 12 plays in `TASK_PLAYBOOKS.md` are structurally correct (format, stage ordering, hosted URL references) but the prompt text has not been validated against actual agent output. Refinement is explicitly deferred to Phase 2 after live testing. This was a deliberate scope decision — optimizing prompt text before seeing what it produces would be premature.

**Tier concept retired.** The Phase 0 playbook used a 3-tier classification (reference-grounded, analysis-then-generate, generative workflow) to communicate complexity to a human reader. This made sense when plays were documentation. Once plays became agent-ready prompts, tier added no user-facing value and was removed.

**Vercel deployment deferred.** Task 1.1 acceptance criteria included Vercel deployment. It was not completed — connecting to Vercel requires either a linked repository or Vercel dashboard access, neither of which was set up during the session. This is carried to Phase 2 Task 2.1 and is a blocker for play testing (plays need a live URL to substitute for `{{sistema_url}}`).

---

## What to do differently in Phase 2

**Deploy first.** Vercel deployment is the Phase 2 blocker. Do it as Task 2.1 before anything else — play testing, Carbon KB wiring, all of it depends on having a live URL.

**Test plays before refining them.** Don't edit play body text based on how it reads. Test by running it. Copy the play, paste into Claude Code against a scratch repo, look at what comes out. The output quality is the only relevant signal.

**Keep the KB data layer in sync with content.** As Carbon content is added in Phase 2, the `listStubsForSystem` and `resolveStub` functions should continue to work without modification — that's the whole point of the stub pattern. If a Phase 2 KB file requires a code change to display, that's a KB structure bug, not an app bug.
