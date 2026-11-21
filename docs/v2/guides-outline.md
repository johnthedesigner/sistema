# V3.5 outlines: color, tokens, typography, quality signals

**Status:** for owner review (2026-11-20). Drafts follow approval.

Every guide follows the D18 template, as the visual-language guide already does:
1. Where Sistema stands.
2. The options and how to choose.
3. Rules, pulled from the registry, never restated.
4. A worked example from Relay.
5. Failure modes.
6. Checking the work.
7. Links to the plays.

Guides hold no procedure; the plays do. Each human page leads with a summary and live specimens. The full detail stays below and in `/raw`.

## Decisions to make first

1. **Color: three guides become two.** "Primitive ramp scalability" is thin (138 lines, no sources) and repeats the color guide. Fold its useful parts into the color guide ("why ramps", "how ramps feed the roles"), and remove it. Two plays link to its sections; they move to the new color sections.
2. **Palette generation stays a technical reference**, not a D18 guide. It's the specification the palette tool implements, and its readers are people checking the algorithm. It gets a short "Where Sistema stands" opening and a "Checking the work" section, and keeps its algorithm sections.
3. **Quality signals is reframed.** The current guide is built on one source's framing: impeccable's "AI slop" problem and test, plus four color commitment levels. Proposal:
   - Retitle it "Visual quality".
   - Organize it around Sistema's own structure: the craft baseline (already in the visual-language guide, linked), reflexes and traps, and token bans.
   - Credit impeccable where its ideas are used.
   - The four commitment levels duplicate the color presence question (quiet, brand, tinted). Move the chroma budget per level into the color guide, under presence. The quality guide then only says "check chroma against the presence the direction chose".
   - The rule `quality.color.commitment-level` stays, worded around presence.
4. **Live specimens.** Add a small specimen block that guide pages can embed, rendered from Sistema's own code at build time:
   - `ramp` (seed, from the palette tool);
   - `type-scale` (base, ratio, roles, from the type scale tool);
   - `radius` (control radius, with the scale beside it);
   - `elevation` (the four shadow roles on a panel);
   - `surfaces` (page, panel, featured, menu, in light and dark).

   In `/raw` each block becomes a one-line description with the tool URL, so agents get no images. This is new site code. It's small, and it reuses `palette.ts`, `type-scale.ts` and the specimen's radius and shadow logic.

## 1. Color (`guide.color.architecture`)

**Where Sistema stands:**
- Color is built from ramps the palette tool generates, assigned to roles, and checked by pairs in every theme.
- The look (how much color, which accent, warm or cool grays) is the person's choice, made at the direction.
- Sistema's position covers structure and checking.

**Sections:**
1. **Where Sistema stands.**
2. **Why ramps.** Interchangeable contrast and dark mode, from primitive ramp scalability.
3. **The roles every system has.** The required roles, the state surfaces (hover, selected), and the emphasis surfaces. This keeps the anchors `#what-every-color-system-requires` and `#emphasis-surfaces`.
4. **How much color.** Presence (quiet, brand, tinted), with the chroma budget for each, moved from quality signals. Picking an accent: the library's bright middle stops when there's no brand color (D27), the first-order reflex, and keeping clear of status hues. Specimen: three ramps from the library.
5. **Grays.** Cool, warm, tinted toward the accent, nearly neutral. Keeps `#neutral-palette-design`.
6. **Choosing a model.** Tonal palettes, step scales, named palettes, contextual tokens, cut to a comparison table and "how to choose". Keeps `#the-decision-framework`.
7. **Dark themes.** One decision for both themes (D30), mirrored stops for text and fills, surfaces by step (D29). Keeps `#dark-mode-the-tonal-shift` and `#stops-in-a-dark-theme`. Specimen: surfaces in light and dark.
8. **States and containers.** States visible on every surface; containers for small marks; status as detail.
9. **Pairs to check.** Keeps `#pairs-to-check`.
10. **Rules.** From the registry.
11. **Worked example: Relay.**
    - The direction: Quiet, violet 550, grays tinted toward violet.
    - The ramps, and the role table for light and dark.
    - The two changes from review: the selected row and messages went neutral, and dark surfaces moved to one stop.
    - The contrast evidence: 150 role pairs, all passing.
12. **Failure modes:**
    - picking the category's obvious accent;
    - mirrored dark surfaces;
    - accent fills on selection;
    - state colors invisible on panels;
    - opacity-derived colors;
    - checking only the role table.
13. **Checking the work:** the contrast tool with `purpose`, the visibility rule, and squinting in both themes.
14. **Plays:** color scheme, map existing colors, direction.

**Cut:**
- the long per-model prose (each model becomes a table row with one example system);
- "The non-negotiable floor", which restates the rules.

**Sources:** Material, Radix, Carbon, Ant, Polaris, Primer, OKLab, Stripe.
- Each model names the systems that use it; nothing is presented as one system's framework.
- Material's tonal-shift table is marked as Material's ("Material pairs tone 40 with 80 …") or replaced with Sistema's own stop mirroring.

## 2. Palette generation (`guide.color.palette-generation`)

A technical reference, per decision 2:
- **Where Sistema stands:** the three fixed rules (D26).
- **The algorithm sections** as they are.
- **Checking the work:** library snapshot, consistency tests.
- **A specimen of a full ramp,** with contrast labels.

**Sources and closeness:** the core idea is Stripe's. Selecting by contrast, consistent visual weight and the yellow turn are already credited; the rewrite marks the core idea as Stripe's where it first appears, not only in the list.

## 3. Tokens (`guide.tokens.architecture`)

**Where Sistema stands:**
- Two tiers by default: primitives and roles.
- A third tier only for component overrides.
- Role names, never values.
- DTCG source compiled to CSS.
- Modes (theme, density, motion) are independent kinds.

**Sections:**
1. **Where Sistema stands.**
2. **The tiers.** Keeps `#the-tier-model`, `#tier-3-component-tokens-scoped-overrides`.
3. **Naming.** Role, not value; structure; pairing (`on-*`); no values in names. Keeps `#naming-principles`, `#name-for-role-not-value`.
4. **Modes.** Theme, density, motion; keeping them independent; storing and switching; density by remap or scale. Keeps `#modes-theme-density-and-motion`, `#keep-the-kinds-independent`, `#how-modes-are-stored-and-switched`, `#density-remap-or-scale`.
5. **Switching themes in CSS.** The three approaches cut to one recommendation (an attribute plus the system setting) and when to use the others. Keeps `#dark-mode-at-the-token-level`.
6. **Component library mapping.** For example, shadcn's variables onto roles. New: today this lives only in the components play.
7. **Rules.**
8. **Worked example: Relay.**
    - `tokens/src/` layout;
    - one role traced from palette to `color.json` to CSS to a component;
    - the dark override file;
    - shadcn mapping;
    - what the token check page shows.
9. **Failure modes.** Keeps `#common-failure-modes`.
10. **Checking the work:** the build, the token check page, coverage audit.
11. **Plays:** pipeline, add mode, coverage audit, the foundation plays.

**Cut:** "Dark mode values: the tonal shift problem" duplicates the color guide; it gets a link instead.

**Sources:** Material, Atlassian, Radix, Ant, Tailwind, DTCG. The tier model is common to Atlassian, Material and others; say so.

## 4. Typography (`guide.typography.architecture`)

**Where Sistema stands:**
- One typeface set well.
- A scale from the type scale tool: modular, with hand-tuned steps allowed and recorded.
- Role names chosen by the person.
- Legibility minimums from the rules.

**Sections:**
1. **Where Sistema stands.**
2. **Density first.** Keeps `#the-density-axis-comes-first`.
3. **Building the scale.** Modular, hand-tuned, and the middle path. Keeps `#scale-construction-modular-vs-hand-tuned`. Specimen: Relay's scale rendered.
4. **Naming type.** Four approaches and how to choose; two tiers whatever the names. Keeps `#naming-type`, `#choosing-an-approach`, `#two-tiers-whatever-the-names`.
5. **Choosing a typeface.** New, from the direction's type voice question:
   - what to look for (figures, distinct letter shapes, x-height, weights);
   - a second face only with a reason.
6. **Legibility.** Line height, measure, tracking at size, x-height. Keeps `#legibility`, `#line-height`. Values are cited from the rules, never restated.
7. **Type and spacing.** Keeps `#how-typography-interacts-with-the-spacing-system`. This also resolves the finding #27 conflict: the 4px base wins, and the "50 to 75% of line height" guidance becomes a check, not a base.
8. **Variable fonts.** Shortened.
9. **Rules.**
10. **Worked example: Relay.**
    - Atkinson Hyperlegible Next, and why it was chosen over Plex;
    - base 13, major second;
    - the hand-tuned overline, and why;
    - tabular figures instead of a mono face.
11. **Failure modes:**
    - too many sizes;
    - a display face in a dense tool;
    - weights used as hierarchy everywhere;
    - steps too small at the bottom.
12. **Checking the work:** the type scale tool's checks, and the specimen.
13. **Plays:** type scale, direction.

**Sources:** Material, Carbon, Radix, Atlassian, Ant, Primer, Tailwind.
- Each naming approach names the systems that use it.
- The fit-review flag (Material's five roles as general practice) is already gone; the rewrite keeps it that way.

## 5. Visual quality (`guide.quality.visual-quality-signals`, retitled)

**Where Sistema stands:**
- Quality comes from the craft baseline plus avoiding reflexes.
- The signals are advisory review checks, not taste rules.
- A deliberate choice can win, if it's recorded.

**Sections:**
1. **Where Sistema stands.**
2. **Reflexes.** The category-obvious choice (first-order); predictable aesthetic families (second-order), credited to impeccable where its framing is used. Keeps `#21-first-order-reflexes-category-obvious-choices` and `#2-the-ai-slop-test`, the latter renamed. Anchors change, and the plays are updated.
3. **Plain-looking traps.** Keeps `#23-plain-looking-traps`.
4. **Token bans.** Keeps `#3-absolute-bans-for-design-system-token-decisions`, `#32-color-token-bans`, renamed where needed.
5. **Color amount.** One paragraph linking to the color guide's presence section; `#4-oklch-color-commitment-levels` moves there.
6. **The squint check and review in both themes.**
7. **Rules.**
8. **Worked example: Relay's first run against its re-run.**
    - What read as "MS Office": outlined everything, sharp corners, near-gray.
    - What changed.
    - The dark-mode treatments found in review.
9. **Failure modes.**
10. **Checking the work.**
11. **Plays.**

**Cut:** "Applying these signals in plays", which is procedure; the plays carry it.

**Sources:** impeccable, Anthropic's frontend-design skill, NN/g.
- The "AI slop" framing is impeccable's, and is credited where it appears.
- The commitment levels: the reference notes don't show where the names came from. If they're impeccable's, the move to presence removes them; otherwise they're Sistema's and stay as chroma budgets.

## Also in V3.5

- **Voice baseline (fit review 2).** "Plainspoken, genuine" are Mailchimp's voice traits. Either credit them where they appear (the guide, rule `content.voice.baseline`, the voice play), or rewrite the baseline as Sistema's own. Recommend crediting: the traits are good, and the honest fix is to say whose they are.
- **Finding #27** conflicts:
  - **Do's and Don'ts count:** the voice play's 11th item gets folded in.
  - **All-caps:** allowed for short overlines, with tracking, as an exception in the writing guide.
  - **Times:** the format follows the product's locale; the writing guide says so.
  - **Spacing base:** see typography section 7.
  - **Radius naming:** the shape play's example uses role names.
- **Source-closeness audit** for these four guides, recorded in `_meta/LICENSE_AUDIT.md`.
