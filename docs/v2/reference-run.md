# Reference Run: Relay

**Tasks:** V3.2 (Direction and Foundations), V3.3 (Patterns). **Run folder:** `/Users/johnlivornese/Repos/relay`, copied into `examples/relay/` at the end. **How it runs (D17):** a Claude subagent starts from the paste-in prompt against the Vercel preview. It doesn't read Sistema's source, it stops for the owner's answers and approvals, and it logs everything in the run folder's `RUN_LOG.md`.

Each finding is listed with what was done about it.

## Stage 1: up to the direction approval (2026-11-18)

**Plays completed:** `project.assess`; `visual-language.direction` (up to its gate). The brief answered every question. The owner approved the direction on 2026-11-18, with no changes:
- a petrol primary (seed `#00717F`);
- Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono;
- Level 1 restrained surfaces with a faint cool tint;
- 2, 4, and 6px radii.

| # | Finding | Done |
|---|---|---|
| 1 | The palette example URL in `visual-language.direction` had `c=` inserted inside the `oklch(...)` value. The cause was a bug in `withVisitId` (V2.8): parentheses ended the URL. | **Fixed** (`c2b12e6`). Parentheses stay inside URLs; only an unbalanced `)` and trailing punctuation are left to the sentence. Regression tests added. |
| 2 | The style tile guide said "no external dependencies", but the play loads fonts from Google Fonts. | **Fixed.** One font stylesheet is allowed. |
| 3 | The quality guide's Level 1 said "no chromatic variation in the neutral ramp", while its own bans forbid neutrals with no hue temperature. | **Fixed.** Level 1 neutrals may carry a faint temperature, at very low chroma, but no visible hue. |
| 4 | `library.json` had no OKLCH values, though the preview must show OKLCH. The agent converted the values itself, against "never compute tool results". | **Fixed.** `generatePalette` now outputs `oklch` for every stop, the library was regenerated (hex unchanged), and the API uses it. |
| 5 | The chroma budgets ("C < 15", "C 30–50") had no stated scale and didn't match the tool's 0 to 0.4 values. Their origin couldn't be traced to any source in `reference/`. | **Fixed.** They're restated in OKLCH chroma as the tool reports it, and labeled as Sistema's starting guidance, not sourced values. **Flag for the source-closeness audit:** the four-level framework itself needs a source or a clear statement that it's Sistema's own. |
| 6 | Two guides named the play by its v1 name, `establish-visual-language`. | **Fixed.** Now `visual-language.direction`. |
| 7 | A fresh create-next-app defines `--background` and `--foreground`. Read literally, the Assess play would classify color as "Differs" and route it to `color.map-existing`. | **Fixed.** Framework template values count as Missing and are noted for the pipeline to replace. |
| 8 | "One batch request" for contrast. The agent needed three requests: one batch, then rechecks after fixing two failing pairs. | **Reworded:** "batched (one POST takes up to 200 pairs)". Rechecking after a fix is expected. |
| 9 | The style tile asks for exact radius, elevation, and type values before the plays that set them have run. | **Fixed.** The guide says these are the direction's proposal, and the token check page lists changes. |
| 10 | The component-count question in `project.assess` has no field in `sistema.json`. | **Fixed.** The play says team size and component count go in the positioning statement. |
| 11 | The visual-language guide's brief has six sections, and the play asks five questions. | **Superseded** by the V3.4 rewrite: the direction play no longer asks brief questions; it proposes answers to the taste questions. |

**Worked well:**
- Every question was answered from the brief, so `project.assess` didn't re-ask.
- `sistema.json` validated against the published schema.
- The `AGENTS.md` pointer was created.
- The palette tool was used for ramps.
- Contrast failures were found by the tool and fixed by moving stops, not by guessing.

## Stage 2: DESIGN.md (2026-11-18)

**Plays completed:** `visual-language.direction` (the gate is recorded), `visual-language.design-md`. The run stopped before the optional `content.voice-and-tone` to ask whether the person wants it. The owner said yes, with the voice "energetic, positive, and plainspoken".

| # | Finding | Done |
|---|---|---|
| 12 | `visual-language.design-md` tells the agent to use rule `color.roles.required`, but the rule wasn't in its contract, so its text wasn't in the play. Guessing a per-rule URL returned 404. | **Fixed.** The rule is added to the contract. New check `model.rules-mentioned` fails the build when a procedure mentions a rule its contract doesn't include. |
| 13 | `color.roles.required` didn't fit the direction's output: it requires secondary roles when there's no second hue, and has no info, link, strong border, hover, or feedback container roles. | **Fixed in the rule.** Secondary roles point to the neutral ramp when there's no second hue. Extra roles are allowed when DESIGN.md lists them. The core set is unchanged. |
| 14 | The starter didn't say to ask before an optional play, only what to record when declined. | **Fixed.** Before an optional play, say what it gives in one sentence, ask, and mention it can be added later. |
| 15 | Type role naming: `design-md` suggested `display`, `heading-lg`, and so on, while the preview used other names, and shadcn/ui has no type names. | **Fixed.** Use the preview's names. The type scale play may rename them to follow the project's naming convention. |
| 16 | Nothing said what to put in a gate's `by`. | **Fixed:** the approver's name, or "owner". |
| 17 | The pointer comment was "at the top" in the plays, but "right after the front matter" in the DESIGN.md format. | **Fixed:** right after the front matter. |
| 18 | Layout can't name a base unit before the spacing play runs. | No change. It's correctly marked provisional, which is what provisional items are for. |

## Stage 3: voice and tone (2026-11-18)

The run stopped inside `content.voice-and-tone` to ask the missing half of its question, "one way it must never sound". It also raised that "energetic, positive" pulls against the utilitarian brief and a product that mostly reports problems. The owner answered: never childish or patronizing.

| # | Finding | Done |
|---|---|---|
| 19 | The voice play had no rule for a partial answer. | **Fixed.** Ask one follow-up for the missing part. |
| 20 | The voice play never checked the chosen voice against the positioning or the approved direction. | **Fixed.** If they pull against each other, say so, ask how the voice behaves in those moments, and record the answer as a limit. |
| 21 | `in-progress` was only defined for a play waiting at an approval. | **Fixed.** It also covers a play waiting on an answer. |

## Stage 4: Foundations, up to the approval (2026-11-18)

**Plays completed:** `content.voice-and-tone`, `color.scheme`, `typography.scale`, `shape.tokens`, `spacing.tokens`, and `tokens.pipeline` (waiting at the Foundations approval). All 86 color pairings pass WCAG 2.2 AA; two dark feedback colors had to move a stop to pass. The compile rejects mode files that add or overlap tokens, which the run tested.

| # | Finding | Done |
|---|---|---|
| 22 | The type scale tool's example URL had `c=` inside the `<name or number>` placeholder, because the spaces ended the URL. | **Fixed.** Placeholders no longer contain spaces, and a test checks that every tool doc URL ends with `c`. |
| 23 | A required shape rule (floating layers get the largest radius) is checked only in `shape.tokens`, so the approved preview broke it, and an approved value changed afterwards. | **Fixed.** `visual-language.direction` applies `shape.radius.hierarchy` to its shape samples, so approved values hold. |
| 24 | The token check asks for primitive ramps, but `color.scheme` stores only role tokens, so there are no compiled ramps to show. | **Fixed, following opinion `two-tiers`.** `color.scheme` and `color.map-existing` write the ramps to `tokens/src/palette.json` as the primitive tier, and roles refer to them (`{palette.primary.600}`). The pipeline doesn't output primitives as custom properties or utilities, and the token check page draws ramps from `palette.json`. Relay predates this, so its V3.3 work should move to it. |
| 25 | The approved preview had a swatch that didn't match its labelled stop (dark primary-hover). The token check caught it. | **Fixed.** Direction builds every swatch from the tool's response, so each swatch is the stop its label names. |
| 26 | shadcn/ui isn't connected: nothing maps its variables (`background`, `foreground`, `ring`, `destructive`, `--radius`) to the role tokens, and the pipeline removes Tailwind's default palette. | **Fixed.** `components.scaffold-core` maps shadcn's theme variables to the role tokens in one file, sets each radius level directly, and records the mapping. |
| 27 | Guide conflicts: Do's and Don'ts limited to 6 to 10, but the voice play adds an 11th; all-caps banned by the writing guide but an approved overline is uppercase; "7 am" times by the writing guide while the preview used 24-hour; the typography guide's base spacing of 50 to 75% of line height against the spacing guide's 4px base; the shape guide names radii by role while the play's example names them by size. | **Fixed** (V3.5): the voice play's DESIGN.md line counts toward the six to ten; all-caps allowed for short overlines set by the type role; time format follows the locale; spacing keeps the 4px base, with the line-height ratio as a check; radius tiers may be named by role or by size. |
| 28 | `color.scheme` says to check every `on-*` role, which misses feedback colors used as text, where both dark failures were. | **Fixed.** `color.scheme` checks every color used as text, as an icon, or as an essential indicator: `on-*` roles, feedback colors used as text, links, and `border-focus`. |

## Stage 5: the end of Start (2026-11-18)

The owner approved the token check with no changes. The run recorded the approval and closed the workflow as instructed:
- It landed the finish first: what Relay now has, where to see it, and the full outline marked done.
- It offered the Patterns workflow and the session routes as options for any time.
- It asked for feedback and didn't start anything.

`continue` moved to the session workflow, keeping `c`. All nine steps are complete, both approvals are recorded, and the app builds. The result is copied into `examples/relay/` (without `node_modules`, `.next`, or git history).

| # | Finding | Done |
|---|---|---|
| 29 | The type scale example URL was still wrong in the run's copy. | Already fixed (#22). The run had fetched the play before the deploy, and the preview now serves the right URL. |
| 30 | After the last play, `milestone` had no defined value, and `workflow` was unclear. | **Fixed.** The end sets `workflow` to `session` and `milestone` to `maintain`. |
| 31 | No exact wording was given for the "finished" pointer line, so agents would each write their own. | **Fixed.** The exact sentence is given. |
| 32 | Nothing regenerates `token-check.html` when tokens change. | **Fixed.** The pipeline generates it from the compile script. |
| 33 | Tailwind `--text-<role>` can't carry a font family or text transform (the mono data and uppercase overline roles). | **Fixed.** The pipeline generates an `@utility` for such roles. |
| 34 | DESIGN.md front matter has no place for dark values. | **Documented.** The format page says front matter holds the default theme only, the Colors section says how dark differs by role, and the token files hold every mode. |
| 35 | The workflow ends on a feedback question whose answer belongs in DECISIONS.md. | Working as designed. The owner can answer it. |

**What the run shows overall:**
- The method works end to end on the default stack: two approvals, nine plays, all tool-checked, and the closing landed as the owner asked.
- 35 findings in all, most fixed between stages. The open ones are the guide conflicts (#11, #27), for V3.4.
- The largest kind of problem was content that disagrees with itself (guides against plays, rules applied late). The fixes are rules applied earlier, data-driven previews, and the new `model.rules-mentioned` check.

## Stage 6: Patterns, from a new session (2026-11-18)

A fresh subagent started with "Let's build Relay's first components." It found its way in with no help: `AGENTS.md`, then `sistema.json` `continue` (the session workflow), then `project.orient`, whose step 5 routed it to the Patterns workflow, then `components.scaffold-core`. It set up shadcn/ui with the variable mapping, then stopped to agree on the core component set and the job statuses. The owner answered: the 12 proposed components, no changes; the statuses from the style preview (Unassigned, Assigned, En route, On site, Parts hold, Running late, Done).

| # | Finding | Done |
|---|---|---|
| 36 | `shadcn init` changes more than the play said: it swaps the font (Geist), writes its own colors and `@theme` names that collide with role names, puts dark mode on a `.dark` class, and its `cn` helper drops custom `text-<role>` utilities. | **Fixed.** `components.scaffold-core` lists each one to check and undo after init, including registering type roles with tailwind-merge. |
| 37 | The style's components disagree with DESIGN.md (button radius, opacity-derived colors), while the play said not to edit component classes. | **Fixed.** Components are copied to be edited: change the component, not the system, and record each change in DECISIONS.md. The one-file rule now applies only to the color mapping. |
| 38 | The play didn't say who chooses the primitives library and style preset. | **Fixed.** Record them in DECISIONS.md. The CLI default is acceptable unless the person has a preference. |
| 39 | Reaching Patterns takes two hops through the session workflow and `project.orient`. | **Kept**, per D22 (Start's follow-ups are options). Orient's routing worked in this run. |
| 40 | Orient's "confirm the goal" didn't say whether to wait for a reply; Patterns treats its own first run as a resume; and the Patterns outline omits `project.orient`. | **Fixed** (fix pass): orient waits for the answer; a workflow is a resume only if `sistema.json` already holds its steps; orient routes to Patterns, so Patterns' outline doesn't repeat it. |

## Stage 7: core components, up to the patterns approval (2026-11-19)

The run built all 12 components on shadcn/ui (base-nova on Base UI), with a showcase route at `/sistema-review/components`, light and dark. It recorded 74 contrast pairs with 0 failures, and axe found 0 violations in all three themes with each overlay open (one documented exception, below). Keyboard focus rings are captured in screenshots, the busy button keeps focus, targets are 24px or larger, and build and lint pass. Every change to shadcn components is recorded in DECISIONS.md. A usage limit interrupted the session mid-build; it recovered from `git status` and a fresh fetch of the play.

| # | Finding | Done |
|---|---|---|
| 41 | Generated components import `cn` from the package directly, bypassing the project's fixed helper in `@/lib/utils`. | **Fixed** (fix pass): the components play checks that each component imports `cn` from the project helper. |
| 42 | A second `shadcn add` stops at an interactive overwrite prompt, which blocks an agent working alone. | **Fixed** (fix pass): run the CLI non-interactively, checking `--help` for the flags of the installed version, and reapply recorded changes after an overwrite. |
| 43 | Axe scans taken during an overlay's fade-in report false contrast failures. | **Fixed** (fix pass): scan after animations finish or with reduced motion on. |
| 44 | Base UI's combobox hides the rest of the page from screen readers while open, by design, and axe flags `aria-hidden-focus`. The play doesn't say whether a documented exception is allowed. | **Fixed** (fix pass): a documented exception is allowed for a library behavior that is correct on purpose, recorded in DECISIONS.md. |
| 45 | Menus show the focused item by a highlight color. In Relay's dark theme, `surface-hover` equals `surface-overlay`, so the highlight was invisible; the run added an inset ring. | **Fixed** (fix pass): `color.states.visible`, and the dark table gives the menu highlight its own stop. |
| 46 | The system has a hover color only for primary, so filled red and gray buttons had none, and "stop if the system lacks a value" was ambiguous. | **Fixed** (fix pass): `color.roles.required` asks for a hover value for every filled role used as a button fill. |
| 47 | "Check every new color pairing" gives no way to find the pairings. Easy to miss: text on a selected row, the focus ring on every surface, status dots on their chips. | **Fixed** (fix pass): the color guide's "Pairs to check", used by the color and components plays. |
| 48 | Agreeing the component list didn't settle the Assigned status color, which the preview never showed. The run chose neutral gray and flagged it at the approval. | Acceptable. Flagging taste choices at the approval is the right behavior. |

## Stage 8: revising approved foundations at component review (2026-11-19)

The owner asked for fewer borders (keep them where they show function: inputs, secondary buttons; remove them where stylistic: tooltips, panels, chips, dividers) and rounder shapes. The run changed the radius tokens (from 2, 3, 4, 6, 8px to 3, 4, 6, 10, 12px, hierarchy kept) and removed borders from panels, chips, inline messages, floating layers, and dividers. It kept edges on controls and the thin row lines in the table. It recompiled, updated DESIGN.md and DECISIONS.md, re-ran contrast and axe (0 failures), and built a before and after page. The owner's observation that Sistema tends toward the same lined, sharp look led to a proposal on variety (see the session log).

| # | Finding | Done |
|---|---|---|
| 49 | There's no path for changing an approved foundation during component review. `components.scaffold-core` "does not change token values", the session routes have no "change a token value", and `shape.tokens` is written for a first run. The run re-ran parts of `shape.tokens` and the pipeline, and noted the change on the Foundations gate. | **Fixed** (fix pass): `project.revise` and the session route "Change an approved direction or foundation"; the components play sends mid-review changes there. |
| 50 | DESIGN.md prose stated the border approach in six sections, and nothing generates or checks it, so a change is easy to leave half-done. | **Fixed** (fix pass): the DESIGN.md play states each decision once and refers to it elsewhere; `project.revise` searches the records for the old wording. |
| 51 | The person's taste conflicted with a guide's recommendation (the depth guide: shadows or borders for data-dense apps). | **Handled well:** the run followed the person, measured the result, and showed the trade-off. That should be written down as the expected behavior when taste and guidance differ. |
| 52 | The contrast tool reports pass or fail even for decorative boundaries no standard requires, so the run had to label "fail" lines as not required. | **Fixed** (fix pass): each pair may set `purpose`: `text`, `large_text`, or `ui` returns only that check; `informational` returns the ratio with no checks. |
| 53 | My own dev server on the run's folder came up unstyled after the run's production builds (shared `.next`). | Not a Sistema issue. When reviewing, use the run's screenshots or a fresh build. |


## Stage 9: owner review of the result's look (2026-11-19)

The owner judged the foundations and the revision process sound, but the look dated and noisy ("more MS Office than Linear"), and the review pages ugly. The run followed Sistema's content faithfully, so the cause is in the guides and the direction play.

| # | Finding | Done |
|---|---|---|
| 54 | The visual-language guide maps "utilitarian" and "data-heavy" to a style (sharp radius, outlines, near-gray), treating a goal as an aesthetic. The direction play has the agent answer taste questions itself, in framework vocabulary, and the person approves a named style rather than seeing options on their product. The trap list misses "outlined everything" and "sharp means serious". | **Fixed** in V3.4 (D23 to D25). |

## Stage 10: direction re-run with the taste questions (2026-11-20)

A fresh run redid Relay's direction with the rewritten play and the specimen tool: needs first, seven questions with options rendered on Relay's jobs board, the composition in both themes, ramps, contrast, and the emphasis map. The owner accepted the proposed option for every question except the accent: petrol was rejected as unattractive, which led to D27 (accent seeds from the palette library). The owner also questioned the one-featured-item limit, which led to D28.

| # | Finding | Done |
|---|---|---|
| 55 | No route for redoing an approved direction: how to reopen Start, set `continue`, mark later steps pending, and withdraw gates. The schema can't mark a gate withdrawn. The run worked it out alone. Same gap as #49, one step earlier. | **Fixed** (fix pass): `project.revise` reopens steps, sets `workflow` and `continue`, and withdraws gates; gates take `withdrawn` (date and reason) in the schema. |
| 56 | The direction play's DESIGN.md step assumes DESIGN.md doesn't exist yet. | **Fixed** (fix pass): on a redo, the direction play rewrites Overview and marks the later sections until the DESIGN.md play runs. |
| 57 | Specimen tool: `content` fields undocumented and unknown keys ignored; no option to tint the neutral toward the accent; nav objects render "[object Object]"; an invalid status kind renders an invisible chip; overlay radius below panel and featured radii (against `shape.radius.hierarchy`); POST ignores `format=html`; the `render` URL drops `c`. | **Fixed** (fix pass): `content` is checked against the layout (unknown fields, wrong shapes, and invalid status kinds are rejected with a message), the response lists `content_fields`; `neutral=tinted`; floating layers as round as featured; POST honors `format` and `c` from the query too; the render URL keeps `c`. A cropped render mode stays in the backlog with the one-question page. |
| 58 | Every specimen layout shows a featured card and a brand block side by side. | **Kept** (D28): example content; the featured card still leads in every layout. |
| 59 | The light selected-row tint is nearly invisible, and nothing checks faint non-text distinctions. | **Fixed** (fix pass): `color.states.visible`; selection is now a neutral step (D30). |
| 60 | The preview page is heavy (about 40 live renderings) and hard to take in at once. | **Open**, in the backlog: one question at a time, lazy renderings, copyable answers, and a cropped render mode. |
| 61 | The accent seed was chosen by name and eye, and the owner rejected it. | **Fixed** (D27): seeds come from the library's bright middle stops. |
| 62 | After mixed answers, only the composition shows the real combination; the question blocks keep the agent's proposals. The play doesn't say whether to re-render them. | **Fixed** (fix pass): re-render the composition with the person's answers and label the question blocks. |
| 63 | No guidance for a conditional answer ("I may not want it once I see it"). | **Fixed** (fix pass): render the composition both ways at the approval. |
| 64 | The specimen's plain gray (`neutral=neutral`) still carries a slight tint, and `quality.color.bans` asks for a neutral with temperature; the play doesn't connect them. | **Fixed** (fix pass): the play calls `neutral=neutral` "nearly neutral" and links the ban. |
| 65 | Unclear how Quiet color presence treats the brand block and the dark selected row. | **Fixed** (fix pass): color presence doesn't decide the emphasis surfaces; selection is neutral under every presence. |
| 66 | In dark mode, quiet panels stood out more than in light. Mirrored surface stops made the dark step about seven times the light one. | **Fixed** (D29): `color.dark.surface-steps`, the color guide's "Stops in a dark theme", the color scheme play, and the specimen tool. |

## Stage 11: foundations rebuilt from the approved direction (2026-11-20)

The run wrote DESIGN.md, rebuilt every foundation (violet accent, tinted neutral, Atkinson, 8px, shadow separation, compact), brought the components and showcase in line, and stopped at foundations-approved. Build, axe and 160 contrast pairs pass. The owner found the dark selected row and dark inline messages far too deeply colored, which led to D30.

| # | Finding | Done |
|---|---|---|
| 67 | Specimen role names (canvas, row-hover, text-tertiary, the dots) don't map onto `color.roles.required`, so "use the stop the composition used" needed a hand-made mapping. | **Fixed** (fix pass): the specimen response has `token_roles`, each required role with its stop and the specimen role behind it. |
| 68 | The color guide's emphasis table says dark `surface-subtle` is a step darker than the surface; "Stops in a dark theme" makes it the page. | **Fixed** (fix pass): both tables name the roles; `surface-subtle` is the page tone used inside a panel in both themes. |
| 69 | "Hover one stop darker than what it sits on" gives neutral 50 on white, which is nearly invisible. | **Fixed** (fix pass): hover is at least one full stop from every surface it meets, counting white as the step before 50 (so 100 on white). |
| 70 | The color play's pair list misses component pairs (a checkbox edge on a selected row), and nothing asks for component pairs to be rechecked when a stop changes. | **Fixed** (fix pass): "Pairs to check" includes component pairs, and says to re-check every pair that uses a changed stop. |
| 71 | No place for white in `palette.json`, and `quality.color.bans` doesn't say which surface "no pure white" means. | **Fixed** (fix pass): `palette.base.white` and `palette.base.black`; the ban applies to the page (`surface`), not white panels on an off-white page. |
| 72 | The token check page shows colors only as swatches, so selection and message treatments can't be judged there; the owner couldn't find them. | **Fixed** (fix pass): the token check page leads with the colors in use (rows, chips, messages, a menu, buttons, inverse and brand text) in each theme. |
| 73 | The accent selected row and status-filled messages were right in light and far too heavy in dark. | **Fixed** (D30): quiet states, status as detail, one decision for both themes; specimen selected row now neutral with an accent edge. |
| 74 | `/raw/opinions/<id>` and `/raw/rules/<id>` return 404; only the full lists exist, and plays name opinions and rules without links. | **Fixed** (fix pass): `/raw/opinions/<id>` and `/raw/rules/<id>`, named in the workflow starters and the agents page. |
| 75 | The color play still builds dark feedback containers by mirroring (150 to 850), which produced the deep blocks; it doesn't say containers are for small marks. | **Fixed** (fix pass): the color play and guide say containers are for small marks, and messages use a neutral surface. |
| 76 | "Selected is a neutral step past hover" has no required role; the run added `surface-selected`. | **Fixed** (fix pass): `surface-hover` and `surface-selected` are required roles. |
| 77 | Graying the selection lowered contrast under control edges; the pair list should include control edges on the selected surface. | **Fixed** (fix pass): in "Pairs to check". |
| 78 | "Or an edge" on messages conflicted with the ban on colored side stripes. | **Fixed:** status color is in the icon and the title only. |

## Stage 12: components approved, run complete (2026-11-20)

The run verified the components against the current play, removed leftover dividers in menus and lists, added shadcn's variables to the token check page, and fixed a dark contrast failure on the highlighted destructive menu item by giving it the error container. The owner approved that as a deliberate exception to status-as-detail, and approved the components. Every gate in the run is owner-approved. Page examples and the system reference were offered, not run.

| # | Finding | Done |
|---|---|---|
| 79 | Contrast failures keep appearing in state pairs (a highlighted destructive item, the focus ring on a highlight, a checkbox edge on a selected row), which no list names. | **Fixed** (fix pass): "Pairs to check" names the state pairs, and plays set `purpose` per pair. |
| 80 | The components play asks for shadcn's variables on the token check page, which the token pipeline play generates without mentioning them. | **Fixed** (fix pass): the pipeline play's token check page reads a component library mapping file when one exists; the components play extends the generator. |
| 81 | Closing Start and resuming Patterns in one session works, but `sistema.json` can't show both; the Start end section's pointer line doesn't fit an app route like the showcase. | **Fixed** (fix pass): the workflow end says the finished workflow stays recorded by its steps and a DECISIONS.md line, and the pointer line covers review routes in the app. |
| 82 | Once only optional plays remain, a workflow has no name for "last required gate passed, optional plays offered", so its closing steps wait. | **Fixed** (fix pass): a workflow stays open while optional plays are offered; the offer comes with the last approval and includes each play's first question. |
| 83 | The workflow's offer of an optional play asks only yes or no, and the play then asks its own first question (which pages), costing the person a round trip. | **Fixed** (fix pass): the offer fetches the play and asks its first question in the same message. |

## Stage 13: page examples and the system reference (2026-11-20)

The run built Today's board and Job detail from the real components and tokens, checked them in both themes at three widths (52 pairs, axe clean with every overlay open), and listed 12 gaps. The system reference play said "not Storybook"; the owner disagreed, which led to D31.

| # | Finding | Done |
|---|---|---|
| 84 | Plays say "run the build" without warning that a Next.js build breaks a running dev server (shared `.next`); it happened twice in this run. | **Fixed:** the components, implement, page examples, and reference plays say to build into a separate folder or stop the server first. |
| 85 | The reference play asked the person to confirm an approach right after they'd said yes to the play. | **Fixed:** the workflow's offer carries a play's first question (#83), and the play uses that answer. |
| 86 | The emphasis map needs a featured surface, but the core set had none, so "no new styles" couldn't be followed on the pages. | **Fixed:** the core set includes the panel variants the emphasis map uses; pages may build emphasis surfaces from their tokens and list them as gaps. |
| 87 | Page examples were checked at desktop and 768px only, which hid the missing phone navigation. | **Fixed:** desktop, 768px, and 390px, including how navigation works at each width. |
| 88 | The reference play said "It is not Storybook" with no reason given. | **Fixed** (D31): both options, the person chooses. |
| 89 | Storybook's preview body font and its white docs blocks made stories differ from the app; its docs pages stay light in dark mode. | **Fixed:** the reference play names both and says how to match the app. |
| 90 | "Read token values from the CSS" can't cover ramps, which the pipeline keeps out of CSS. | **Fixed:** read ramps from `palette.json`. |
| 91 | The Storybook CLI adds extras (addons, example stories, a config rewrite, a further setup command) the play didn't address. | **Fixed:** keep what serves the play, remove the rest, and list it. |

The run is complete: all three gates owner-approved, page examples built, Storybook reference published, Patterns closed (Relay commit ab6d479). `examples/relay/` holds this state.
