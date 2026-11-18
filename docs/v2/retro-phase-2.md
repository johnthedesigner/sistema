# v2 Phase 2 Retro

**Dates:** 2026-11-17 to 2026-11-18. **Tasks:** V2.0 to V2.9.

## What shipped

- **Tool APIs** settled in an outline first (`tool-apis.md`, decisions D11 and D12):
  - Every tool answers a GET, and every error carries a working example URL.
  - Colors can be hex, `rgb()`, or `oklch()`.
  - An `/api` index lists the tools.
- **Contrast** checks against the rules registry for the standard and level asked for, instead of hardcoded WCAG 2.x thresholds. Passing is judged on the exact ratio (a rounding bug is fixed). The contrast page uses the same values, with a standard picker.
- **Palette** output is tested against the published library and a snapshot. The library generator now shares the API's algorithm instead of a copy.
- **Type scale** is a new API, and the page uses the same calculation. Naming is a choice (numeric, Tailwind, or steps), roles are placed only where named, and line heights follow the guide's bands. The 9px caption is gone. `typography.scale` calls the tool.
- **Consistency tests** (plan 13, layer 2): contrast agrees with WCAG's formula, tools cite real rules, and tool defaults pass the registry.
- **Shorter, safer prompts:** a play that calls a rule's checking tool tells the agent to use the tool's result instead of listing every standard's values. Workflow starters name their tools instead of repeating each tool's full usage.
- **Usage analytics** (D13): one visit ID kept in memory, nothing stored on the device. The ID is carried by copied prompts, `/raw` output, `sistema.json`, and tool calls. Server events carry no IP, location comes from Vercel's headers, and there's a privacy page. The old tracking is removed.

## What went well

- **Outlining the APIs before building** settled the hard questions (defaults, naming, standards) in one review, so the build had no surprises in shape.
- **Testing in real environments found real bugs:**
  - Screenshots found layout faults on phones that had been there a while.
  - A decoded Playwright run found that PostHog drops events from automated browsers.
  - The preview run found that a route worked locally but had no content files on Vercel.
- **One calculation per tool,** shared by API, page, and tests, removed a whole class of disagreement: the type scale page, the contrast page, and the palette library had each drifted from what the tools did.
- **The owner's analytics constraint simplified the design.** "No tracking across visits" replaced a consent-banner discussion with one clear rule.

## What to watch

- **Analytics hasn't been seen arriving in PostHog.** Vercel's Preview environment lacks the PostHog key, so the preview sent nothing. Production has the key, but nothing has confirmed delivery from a deployed build. Fix the preview variables, rerun the tagged check, and confirm in PostHog before relying on the data.
- **The local build cache can go stale.** Twice, `next build` failed with `PageNotFoundError` after earlier builds. `rm -rf .next` fixes it. Vercel builds fresh.
- **Files read at request time must be bundled explicitly,** with glob keys in `outputFileTracingIncludes`. Tests and `next start` don't catch it; only a deployment does. Each new route that reads files needs an `nft.json` check.
- **Trimming prompts barely shortened them.** The plays are mostly procedure. If prompt length matters later (MCP, smaller models), the next lever is how rules render, not the play text.
- **Two warnings in lint** have been there since V0 and never addressed.

## Numbers

| | Start of V2 | End of V2 |
|---|---|---|
| Tests | 108 (8 files) | 162 (17 files) |
| Tool APIs with GET | 0 of 2 | 3 of 3, plus `/api` |
| Color formats accepted | hex | hex, `rgb()`, `oklch()` |
| Tool defaults checked against the registry | none | every build |
| Content and code violations | 0 | 0 |
| Commits | | 16 with a V2 task ID |
