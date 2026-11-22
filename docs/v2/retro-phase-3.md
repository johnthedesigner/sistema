# v2 Phase 3 Retro

**Dates:** 2026-11-18 to 2026-11-22. **Tasks:** V3.0 to V3.9.

## What shipped

- **A reference project, Relay,** built end to end with the owner at every approval: direction, foundations, components, page examples, and a Storybook reference. Copied into `examples/relay/`.
- **The aesthetic baseline** (D23 to D25): craft opinions and advisory rules, taste questions answered by choosing between options drawn on the product, emphasis surfaces, and the specimen tool.
- **Palette rules** (D26): an eased contrast curve, the same colorfulness by lightness for every hue, yellows warming as they darken.
- **Decisions from review** (D27 to D31): accent seeds from the palette library, no count on featured items, dark surfaces one stop at a time, one decision for both themes, and the system reference as Storybook or a page in the app, the person's choice.
- **A fix pass** over about 50 reference-run findings, including `project.revise` for changing an approved decision, per-pair contrast purposes, state visibility, and per-item `/raw` pages for opinions and rules.
- **Guide rewrites** (color, palette generation, tokens, typography, visual quality) with live specimens, and a **components guide**, with four new sources.
- **Content principles** (`docs/v2/content-principles.md`) and a check for internal history in user-facing content.
- **The site restructure** on Sistema's own design system, which went through the method first: new navigation, prompt box, entry pages, every page on the role tokens, file format pages, and the **visual direction page template** that replaced the style preview.

## What went well

- **Running the method on real projects found what reading couldn't.** Relay found dark surfaces mirrored too far, accent selections that turned into heavy bands in dark, and gaps in redoing an approved step. Sistema's own site found that interface blues can't always be the logo blue.
- **Showing options changed the answers.** On Relay, the owner changed four of seven proposals; on the site, one. Describing styles would have hidden those preferences.
- **Fixing the method, not just the project.** Each review note became a rule, a guide section, or a template change, so the next project gets it.

## What to watch

- **Content drifted toward our own sessions.** Guides filled with Relay specifics, coined terms, and history, until the owner caught it. The principles and the history check help; the rest needs a reviewer reading for it. "Worked example" is the next case (BACKLOG).
- **Builds broke the dev server three times.** `next build` and `next dev` share `.next`. `npm run build:check` now builds into `.next-check`; use it whenever a dev server runs.
- **The content catalog was cached in development,** so content edits didn't show. Fixed: no cache under `next dev`.
- **Older pages still carry raw values** (about 250 hand-set pixel sizes). They move to roles in the layout pass.
- **Analytics delivery is still unconfirmed** from a deployed build. It's now the first item for Phase 4.
- **Sistema is web-first in practice.** The method and tokens are platform-neutral, but the pipeline, components, checks, and specimen are web. Decide what to say about it, and whether to test a mobile project (BACKLOG, "Platform scope").

## Numbers

| | Start of V3 | End of V3 |
|---|---|---|
| Tests | 162 | 194 |
| Guides in the new structure | 0 | 7 |
| Decisions | D22 | D31 |
| Reference-run findings recorded | 39 | 91 |
