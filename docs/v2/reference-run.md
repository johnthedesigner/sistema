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

