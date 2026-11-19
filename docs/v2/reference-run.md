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
| 11 | The visual-language guide's brief has six sections, and the play asks five questions. | **Open**, for the guide rewrites (V3.4). |

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
| 27 | Guide conflicts: Do's and Don'ts limited to 6 to 10, but the voice play adds an 11th; all-caps banned by the writing guide but an approved overline is uppercase; "7 am" times by the writing guide while the preview used 24-hour; the typography guide's base spacing of 50 to 75% of line height against the spacing guide's 4px base; the shape guide names radii by role while the play's example names them by size. | **Open**, for the guide rewrites (V3.4) and the content guides' review. |
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

