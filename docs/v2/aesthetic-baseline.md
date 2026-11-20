# Aesthetic baseline and visual direction questions: Proposal

**Task:** new, proposed as V3.4 (the current V3.4 to V3.8 move down one). **Date:** 2026-11-19. **Status:** proposal, for owner review.

**Prompted by:** the owner's review of Relay's components (2026-11-19). The foundations are technically sound, and the run revised them quickly and well. But the result looks dated and noisy, "more MS Office than Linear", and the review pages look worse. The owner wants Sistema's default first take to be both functional and contemporary: tasteful, minimal, the standard an experienced designer would set for a new product today, with room to vary color, personality, typography, and density. Decisions should be shown, not hidden behind codewords.

---

## 1. Why Relay came out this way

The run did what the content told it to. The cause is in Sistema, not the agent.

| Where | What it says | What Relay got |
|---|---|---|
| Visual-language guide 3.1 | "Utilitarian" leads to Level 1, Restrained | Near-gray everything |
| Guide 2.1, "Functionalist / Rams" | "Minimal radius (2 to 4px) or none" | 2, 3, 4, 6, 8px |
| Guide 3.3 | "Sharp corners signal precision" | "Precise" shape personality |
| Guide 3.4, data-heavy tool | "Borders at low contrast" | Outlines on panels, chips, tooltips, menus, dividers |
| Depth guide | Shadows or borders for dense apps | Borders |
| Direction play, step 2 | The agent answers the taste questions itself, in the guide's vocabulary | "Functionalist primary, Swiss secondary, commitment level 1" |
| Quality guide, trap list | Names the blue SaaS template and the dark console, not "outlined everything" or "sharp means serious" | Avoided the named traps, fell into the unnamed ones |

So "utilitarian" was treated as a style rather than a goal. A utilitarian product needs status to stand out, rows to be easy to follow, and controls to be obvious. None of that requires sharp corners or outlines on every surface; Linear, Vercel, and Stripe's dashboard are all utilitarian and none look like that. And the person approved the direction from a page that showed a name for the style, not the style applied to their product.

### What "functional" means here

The owner's definition, which the guides adopt: **no styling that is purely decorative, but not bare-bones.** A style earns its place by doing something for the person: showing what's important, what can be clicked, what belongs together, what the product is (brand), or how a moment should feel. Color, depth, a distinctive typeface, and a bold block of brand color can all be functional. The guide currently reads "functional" as "remove everything removable" (its Rams entry: "if it can be removed without loss of information or usability, remove it"), which is where the bare look comes from. Emphasis, character, and recognition are not losses the guide may ignore.

### Contrast is flat across levels

A second pattern in what Sistema produces: the contrast between each level and the next (page, zone, panel, item) is about the same everywhere. Relay's page, panels, and menus are three even steps of the same gray. The required roles encourage it: `surface`, `surface-raised`, and `surface-overlay` are an evenly spaced elevation ladder, with no role for an area that should stand out.

In well-designed products, those contrasts carry meaning. Most structural zones separate from the page only slightly, so the page reads as one calm field. One element, such as a featured card or the current job, stands out much more through lift, tone, or color. A footer or a key band can be a saturated block against an otherwise gray, low-contrast layout. The variation is deliberate and follows the role the content plays and how it should be read.

Review pages can't fully show this without real content. But the system has to be able to express it once the content model is defined. Section 3a adds that.

## 2. The proposal in one paragraph

Split visual decisions into two kinds. **Craft** is what experienced product designers broadly agree on today (hierarchy from type and space before lines, borders that earn their place, radius scaled to size, quiet elevation, one accent used sparingly). Sistema holds it as a published baseline that every project starts from and can override. **Taste** is where products should differ (color presence, warmth, roundness, type voice, density, how surfaces separate). Sistema asks about it, in plain visual language, by rendering two or three options on the product's own components so the person picks what they see. A new specimen tool does the rendering, so the quality of what the person compares doesn't depend on the agent's page-building.

## 3. The craft baseline

A new opinion group, `craft`, overridable like the others. Each becomes an opinion with its why, and the checkable parts become `review`-level rules (advisory, so taste can win, per finding #51). Draft list:

1. **Hierarchy from type, space, and tone first; lines last.** A border is used where the edge is the affordance (text fields, selects, checkboxes, secondary buttons) or where it helps the eye follow data (table rows, when needed). Panels, cards, chips, tooltips, and menus separate by surface tone, spacing, or shadow. Dividers inside a container are rare.
2. **Neutral ground, one accent, color for meaning.** Surfaces and chrome are near-neutral with a slight tint. The accent appears on the primary action, selection, focus, and links. Status colors are the only other chroma. This is a starting point the color question can move a long way.
3. **Text in three or four tones, never pure black.** Primary, secondary, tertiary (and disabled), from the neutral ramp, with the required contrast. Secondary text carries a lot of the hierarchy.
4. **Radius scaled to the element, softened by default.** Small elements smaller, containers larger, floating layers largest, and a nested radius equals the outer radius minus the padding. The default sits in the middle (roughly 6 to 8px on controls); the roundness question moves it.
5. **Elevation only for what floats.** Menus, popovers, dialogs, and toasts get a soft, layered, low-opacity shadow. Panels sit on the page without one. In dark themes, raised surfaces get lighter instead.
6. **One contemporary typeface, set with care.** A well-made sans with a medium weight, used at a narrow size range, with 500 for labels and emphasis rather than 700, slightly tighter tracking at larger sizes, and tabular figures for data. A second face only with a reason.
7. **Consistent rhythm.** A 4px grid, one control height per density, aligned edges, and generous outer spacing even when the inside is dense.
8. **Quiet states.** Hover is a small tone change, pressed a little more; focus is a crisp ring with an offset; selected uses the accent at low strength.
9. **One icon set, stroke weight matched to the text.**
10. **Short, eased motion** (about 100 to 200ms, ease-out) on state changes and floating layers only.

11. **Contrast follows importance, not depth in the tree.** Most levels separate quietly; a few things are allowed to separate strongly, and which ones is decided by the content's role (section 3a).

## 3a. Emphasis in the system

So that a system can express hierarchy by role, not just by nesting:

- **Emphasis surfaces as roles,** alongside the elevation ladder. Draft set:
  - `surface-subtle`: a quiet zone, such as a sidebar or a toolbar band.
  - `surface-featured`: the one thing on the page that should lead, through more lift, tone, or a tinted fill.
  - `surface-inverse`: a dark block on a light page, or the reverse.
  - `surface-brand`: a saturated block in the brand color.

  Each gets `on-*` text roles and is checked like any other pairing. Material (inverse surface, containers), Polaris (brand and inverse surfaces), and Atlassian (bold backgrounds) already have versions of these; the guide credits them.
- **Not every project needs all of them.** Start asks which the product uses. A dense tool may need only `surface-featured`; a marketing site may use all four.
- **An emphasis map, not a value table.** The direction play records, per kind of screen, which content plays which role: "the job in progress is featured; the sidebar is subtle; nothing is inverse". DESIGN.md states it once (finding #50). Later page and component plays read it.
- **The specimen tool and review pages show a small composition** (page, zones, one featured item, one brand or inverse block) as well as single components, so the person sees the levels together. It uses placeholder content labeled by role, and says that real hierarchy is settled once there are real screens.
- **The depth and color guides** gain a section on this: how many steps the quiet levels take, how much stronger the emphasis steps are, and how emphasis behaves in dark themes.

**Sources.** The owner's rule is that Sistema is grounded in real literature and expertise, and that guides name the systems that use an approach rather than present one as general practice. Candidates to bring in through the intake process: Linear's published writing on its interface redesign, Vercel's Geist, Radix Themes, Apple's Human Interface Guidelines, and Material 3 (already in) for the contrast. The baseline describes principles that several of these share, never "look like Linear". The originality audit covers it.

**What changes:** `opinion.look-is-yours` currently says Sistema doesn't decide what a product looks like. It becomes: Sistema sets a contemporary craft baseline, and taste choices (section 4) stay with the person.

## 4. Taste questions, asked visually

The direction play stops asking the agent to answer taste questions in framework vocabulary. It asks the person, and each question shows its options rendered on the product's own content (a row of Relay jobs, a status chip, a button pair, a field, a menu), described in plain words. The agent proposes one option and says why; the person picks.

| Question | Options shown (example wording) |
|---|---|
| **How much color?** | "Almost all neutral; color only on the main button and status" / "Brand color in the navigation and selected items too" / "A tinted page, with color carrying the brand" |
| **Warm or cool?** | The same screen with cool gray, neutral gray, and warm gray surfaces |
| **How round?** | Buttons, fields, and a panel at about 4px, 8px, and 12px, with pills shown as an option for chips |
| **How surfaces separate** | "No outlines; panels a shade lighter than the page" / "Fine outlines on panels" / "Panels lifted with a soft shadow" |
| **Type voice** | Three typefaces chosen for the product, each setting the same heading, row, and label |
| **Density** | The same table at comfortable, compact, and spacious row heights |
| **Theme** | Light first, dark first, or both from the start |

Aesthetic traditions (Swiss, Rams, and the rest) stay in the guide as vocabulary for explaining *why* an option suits a product, never as the thing the person approves. The stance-to-style tables in guide section 3 are replaced by "what the product needs" (status must stand out, rows must be followable) and which options serve it.

New traps for the quality guide: **outlined everything**, **sharp means serious**, and **gray means professional**, with a check that each border and each divider on a review page has a stated function.

## 5. The specimen tool

A fourth tool beside palette, contrast, and type scale. Given a small set of parameters, it renders a fixed, well-designed specimen: a button pair, a field, a select, status chips, a panel with a few table rows, a menu, and a toast.

- **Inputs:** accent and neutral seeds (through the palette algorithm), radius scale, surface separation (tone, outline, shadow), density, typeface, theme.
- **Output:** an HTML page at a URL, so a review page can embed two or three side by side, and the agent can screenshot it. Later, the same parameters could come from a project's compiled tokens.
- **Why a tool:** Sistema controls the quality of what the person compares, every option is rendered the same way so only the decision differs, and agents stop hand-building comparison pages. It also gives the review-page redesign (V3.6) its building block.

It follows the tool API pattern (GET and POST, `/api` index, errors with an example, limits, `trackToolCall`), and the page lives under the tools section of the site.

## 6. Plan

1. **Approve this proposal** (owner).
2. **Intake** the sources in section 3.
3. **Build the specimen tool**, and show the owner its default rendering plus a few variations as a visual milestone. This is also the first test of the baseline: if the default specimen doesn't look right, the baseline isn't right.
4. **Write the content:** the `craft` opinions and review rules, the new traps, the visual-language guide rewritten in the D18 template (its stance tables replaced), the direction play rewritten around section 4's questions, and the shape, depth, and color plays checked against the baseline. Add the emphasis roles (3a) to `color.roles` as optional roles chosen in Start, the emphasis map to the direction play and DESIGN.md, and an emphasis section to the depth and color guides.
5. **Re-run Relay** from Direction with the new play, through Foundations and the components, as the test. Hold the current revision unapproved until then. The re-run also exercises the foundation-revision path (finding #49).
6. **Add a variety test to V5:** three short briefs (a dense B2B tool, a consumer app, a content site) run through Direction, with the owner judging whether the results are distinct and look intended.

Then the current V3.4 (guide rewrites) continues, with the visual-language guide already done in this format.

## 7. Questions for the owner

1. **The split:** a craft baseline Sistema sets by default, and taste questions the person answers visually. Right model? (Updated 2026-11-19 with the owner's definition of "functional" and the critique of flat contrast, sections 1 and 3a.)
2. **The baseline list** in section 3, and the emphasis roles in 3a: anything to add, drop, or soften?
3. **The specimen tool:** build it as a fourth tool (recommended), or have the direction play build comparison pages by hand from a template?
4. **Order:** do this before the guide rewrites, with Relay re-run as the test (recommended)?
