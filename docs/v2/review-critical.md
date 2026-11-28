# Critical review: tools, workflows, and site (2026-11-28)

The owner asked for a critical look at everything built so far: for each tool and workflow, the realistic situations it has to handle, how what we built holds up, and where it's too narrow, too opinionated, or not opinionated enough. This is that review, followed by principles for the tool pages and a plan that takes in the owner's design notes.

## 1. What the tools are for

The tools exist so agents calculate instead of guessing. Every one of them is called by plays, and most calls come from agents, not people. The pages are where a person sees what Sistema does and checks one value. That settles how they should be presented (section 6): each page leads with how Sistema uses the tool, and the controls are a demonstration that shows the expertise behind it.

It also settles how narrow a tool may be. A tool can assume Sistema's own file shapes, as long as it says so, and says clearly when it's given something else.

## 2. The tools, one by one

### Palette

**Situations:** a new product with a brand color; an existing product whose brand color must stay exact; a team with an existing ramp (Tailwind's, their own) that wants to keep it; neutrals tinted toward the brand.

**How it holds up:** stops are chosen by contrast against white, so ramps are even and predictable, and the same stop number means the same contrast across hues. That's a strong, defensible opinion.

**Gaps:**
- **The seed isn't kept.** The tool picks each stop by contrast, so the brand color itself usually lands between two stops and doesn't appear in the ramp. `color.map-existing` offers "keep and complete" ("your colors stay where they fit; the rest is generated around them"), but the tool can't do it: the agent has to splice the exact value into a generated ramp by hand, which can make the ramp uneven. *Fix:* an `anchor` option that keeps the seed exactly at its nearest stop and eases the neighbors around it, and every response says which stop the seed is nearest.
- **One ramp shape.** Nineteen stops, 50 to 950. Fine for Sistema's own systems; for a project on Tailwind's eleven stops, say so and map to the nearest names (the play does; the tool page doesn't say).
- **sRGB only.** Wide-gamut (P3) colors are mapped into sRGB. Say so.

### Contrast

**Situations:** checking every role pair in every theme; one designer checking one pair; text over a translucent overlay or an image; choosing between WCAG 2.x and APCA.

**How it holds up:** well. Values come from the rules registry for the project's standard, batches of 200, a purpose per pair.

**Gaps:**
- **Translucent colors are rejected.** Scrims, overlays, and disabled states often use alpha. *Fix:* accept a translucent foreground with the background it sits on, and check the composited color.
- **WCAG 2.x only.** The guide explains APCA; the tool doesn't offer it. Fine as an opinion (the project's chosen standard governs), but the page should say why.
- **The standard picker explains nothing.** The owner's point: each standard needs a line on when you'd choose it (section 6).

### Type scale

**Situations:** a modular scale for a new product; mapping an existing, non-modular scale (Tailwind's defaults) into roles; different sizes on phones and desktops; fluid type with `clamp()`.

**How it holds up:** good for a modular scale with roles and checked line heights.

**Gaps:**
- **Modular only.** An existing hand-tuned scale can't be checked, only replaced. *Fix:* accept a list of sizes as well as base and ratio, and run the same role placement and checks on it.
- **One scale for every screen.** No phone and desktop variants, no fluid sizes. Say so on the page and in the typography guide; add variants only if a play needs them.

### Specimen

**Situations:** a new product with no UI yet; an existing product whose look is being refined; a phone-first web app; a brand with a licensed typeface.

**How it holds up:** for a product with no UI, it's the right tool: six layouts, the product's own words, every option side by side.

**The owner's question: are we checking against the customer's own design, or saying so misleadingly?** Mostly the second. The home page, `/start`, the direction play, and three guides say options are "drawn on your own product". What the specimen draws is Sistema's layouts with the product's words. For a new product that's honest enough once worded plainly. For an existing product it isn't: the person is judging a stranger's screen.

**Gaps and fixes:**
- **Wording, now:** "on a screen like yours, with your words", everywhere it says "your own product". The specimen is a stand-in, not a preview of the real UI.
- **A preview in the person's own app, for projects that have one.** The agent can apply each candidate's values to the running app as CSS custom property overrides on a review route, so the person sees their real screens with each option. This fits the method (review pages live in the repo) and needs no new hosted tool. It belongs in `visual-language.direction` and `color.map-existing` when `project.assess` finds a running UI.
- **No phone layout.** Sistema's own test product, Tidy, is a phone-first web app, and its direction was judged on desktop screens. A phone-width layout is the most important missing layout, and it serves the web-first scope (D41).
- **Fixed font list.** A licensed brand face can't be shown. Say so, and let the review page note "your typeface, shown here as its closest match".

### Token validator

**Situations:** checking Sistema's own output before compiling; checking a project's existing tokens during an audit; tokens from Tokens Studio, Style Dictionary examples, or a Tailwind conversion; a tiny set; badly named or inaccessible tokens.

**How it holds up:** on Sistema-shaped files it's thorough, and it found real issues on the site's own tokens.

**Gaps:**
- **It assumes Sistema's shape** without saying so: flat `color.<role>` names from Sistema's vocabulary, modes as `<name>.<mode>.json` files, colors as strings. Given a typical outside file (`color.text.primary`, `semantic.bg.default`, modes in `$extensions` or in folders), it reports all thirty required roles missing and checks no pairs, which reads as "your tokens are broken" rather than "these aren't in the shape I read". *Fix:* detect the shape first, and when it isn't Sistema's, say so and run only the checks that don't depend on it (format, aliases, mode overrides).
- **The current DTCG format writes colors as objects** (`{"colorSpace": "srgb", "components": [...]}`) in its stable release; the validator reads only strings, so those files fail format and contrast. *Fix:* read both. (Verify the format details against the DTCG spec before building.)
- **Translucent colors** are skipped silently. Report them as not checked.
- **Line height and spacing checks are guesses by name** (`body`, `space`). Say which tokens each check looked at.

### Dark mode mapping

**Situations:** Sistema's own light roles; an outside system's roles; a tiny set; badly named roles; colors that fail contrast in light.

**How it holds up:** on Sistema-shaped roles it reproduces the guide exactly, and its suggestions matched the site's hand-chosen stops.

**What it assumes, which must be stated:**
- **Roles alias ramp stops on 50-step ramps (50 to 950).** On Tailwind's eleven stops, mirrored stops such as 250 and surface stops such as 850 don't exist: those roles get no color and no check.
- **Role names from Sistema's vocabulary.** The surface steps apply only to roles named `surface`, `surface-raised`, and so on. A role called `bg-card` is mirrored like text, which puts panels at the wrong step.
- **Raw hex roles** are kept as they are, so the "dark" file repeats the light value: technically correct, practically useless.
- **Inaccessible light pairs** mirror into inaccessible dark pairs; the suggestions catch them, which is good.

*Fix:* the same shape detection as the validator, a clear refusal with an explanation when most roles aren't on a ramp, a mapping table for unfamiliar role names (or a `surfaces` list the caller passes), nearest-existing-stop for ramps with missing stops, and a plain statement of all of this on the page and in the API docs. Its scope is "a light theme built on ramps", not "any color tokens".

### MCP server, skills, and review pages

- **MCP:** works in five clients. `search` is word matching; good enough for IDs, weak for questions. `next_step` trusts the state it's given, which is right for a server that can't see the repo.
- **Skills:** a snapshot. They don't update, carry no visit ID, and duplicate every play. Say "download again for updates" on the connect page.
- **Review pages depend on the live site.** The visual direction page calls Sistema's APIs every time it opens. A project's saved review pages break if the site moves or is offline. *Fix:* after approval, the play saves the chosen renders and data into the page, so the approved record stands alone.

## 3. Workflows and the home page's choices

### Three starting situations, not two

| Situation | What the person needs | What happens now |
|---|---|---|
| A new product, or a UI with nothing to keep | Start: choose a direction, build foundations | `workflow.start` |
| An established UI or an existing design system | First, an honest picture: what exists, what's consistent, what fails, what's missing. Then a choice: bring it into Sistema, or fix specific things | The same `workflow.start` prompt ("I already have a design system"), which goes straight to choosing a direction |
| A system already set up with Sistema | Change something specific | `workflow.session` and its routes |

The owner is right that "Start" and "I already have a design system" send the same prompt, so the choice is decoration. The better split is **start, audit, update**:

- **Audit** is a new workflow for an established UI or system: `project.assess`, then an inventory of existing tokens and components, `tokens.coverage-audit`, `accessibility.audit`, and `project.review`, ending in a report and a recommendation: adopt it into Sistema (continue to `workflow.start`, which keeps what exists through `color.map-existing`), or fix specific findings through session routes. It reads before it changes anything, which is what someone with an existing system wants first.
- **Start** stays as it is.
- **Update** is today's "Work on my system", with its routes as sub-options.

### The update routes

As a radio group under "Update", one route is always selected. Missing routes that real sessions need:

- **"Not sure yet" (the default):** describe what you want, or ask for a review and a suggestion. `project.orient` already confirms the goal; this makes it the default door instead of a hidden one.
- **Build a page or screen** with the system's components, the most common request after components exist.
- **Document the system** (`components.docs-site`, now reachable only through the patterns workflow).

### Other workflow gaps

- **Direction assumes taste is open.** For an existing product with an established look, "choose how much color" is the wrong question. The audit's report should feed direction with "keep what's working" as the proposed answer to each question.
- **Patterns assume React** with shadcn/ui or a headless library. Stated by D41; the play should say what an agent does on Vue or Svelte (follow the same contracts with the stack's equivalent, and say so).
- **Brand guidelines and mockups have no way in.** A brand book or screenshots are common inputs. `project.assess` should ask for them and record what they fix (colors, typefaces), so direction doesn't ask about decided things.

## 4. Messaging to fix now

| Where | Says | Should say |
|---|---|---|
| Home, `/start`, direction play, three guides | Options "drawn on your own product" | Options on a screen like yours, with your words (and, with an existing app, on your own screens once that step exists) |
| Tool pages | Lead with the controls | Lead with how Sistema uses the tool (section 6) |
| Validator and dark mode pages and API docs | Silent on what shape they read | What they assume, what they do with anything else |
| Connect page, skills | Silent on updates | Skills are a snapshot; download again for updates |

## 5. Not opinionated enough, too opinionated

- **Too opinionated:** the palette's single ramp shape and unkept seed, for teams with brand colors; the specimen's desktop-only layouts; a modular-only type scale. Each is fine as a default and wrong as the only path.
- **Not opinionated enough:** the tool pages, which present controls without the reasoning (which standard, why these stops, why mirrored stops in dark). The reasoning is the product; the pages should carry it.

## 6. Principles for the tool pages

1. **Say how Sistema uses it, first.** Each page opens with what the tool does in the method, which plays call it, and what agents send: the controls come after, framed as a demonstration.
2. **Show the reasoning in the controls.** Choices explain themselves: the standard picker shows each standard with a line on when to choose it; option labels carry a short why.
3. **Start from something good.** Inputs open on a useful example. Color inputs offer a handful of swatches from Sistema's palette library before the free picker.
4. **State the limits plainly.** What the tool assumes, what it does with anything else, and what it doesn't do, in one short section on the page and in the API docs.
5. **One layout for every tool:** the heading and lead full width; below, a sticky input column on the left and the output in the main column, together using the full content width. On phones, inputs first, then output.
6. **Results read like the rest of Sistema:** the same status dots, the same tables, the same language as the plays' evidence.
7. **The API is a detail, not a badge.** At the end of each page: the request agents send, with a link to the reference. No vague "API" links on cards.

## 7. The owner's design notes, as tasks

Grouped, with the decisions to confirm marked.

**Home page**
- Centered layout.
- The prompt options become start, audit, update, with update's routes nested under it as a radio group (section 3). Final copy to be drafted.
- The prompt box's spacing (below).
- The "Fast and consistent" cards: icons and more refined cards, since they lead to the main sections.

**The prompt box's spacing**, everywhere it appears. Text has built-in leading above and below its glyphs; buttons don't. So the visible gap between the text and the control row looks larger than its measured spacing, and the box's padding below the buttons looks larger than the padding above the text. The fix: equal padding on all four sides, measured to the visible edges (reduce the top padding by the text's half-leading), the gap between the text and the controls equal to that padding, and no empty status line reserving space below the buttons (show "Copied" in the button, as the review page does).

**Tool pages:** the principles in section 6, on all six tools, with the standard picker and the swatch-led color inputs.

**Tools index:** remove the play-ID boxes and the API links from the cards. Where a card names the plays that use a tool, use the same play chips as elsewhere, labeled "Used by".

**Navigation**
- **Plays** becomes a top-level page, out of "Get started". *(Confirm the nav order: Get started, Plays, Guides, Reference, Tools.)*
- The plays page gets a callout explaining workflows, linking to the workflows page and to the three workflows, in place of the unlabeled round buttons.

**Reference**
- Two patterns for every section: a **rich documentation page** with a sticky table of contents (like the DESIGN.md format page), and an **index of nested pages** (like Workflows).
- Lists sorted alphabetically by name, in a single column rather than a grid.
- Count labels get an icon for the kind of item.
- Inside a page: narrative order where there's a story, alphabetical where items are an undifferentiated list.
- **Categories:** use topic groups, with an icon per topic, wherever a list has more than about a dozen items and the topics mean something to the reader (guides, plays, rules); alphabetical within each group. Short lists stay flat. *(Confirm.)*

**Type:** eyebrows in sentence case, not capitals.

**How Sistema works:** a landing page that tells the whole story, not a documentation page.

**Play pages:** no alternating section backgrounds; balanced space around the hero (more above, much more below); sections separated by space and headings alone.

**Footer:** a row above the columns with a large logo, the wordmark in white. The footer background is solid blue by default; hovering the red or yellow shape changes it, with a transition, to a slightly lighter shade of that color, so the shape still shows; the columns and bottom row keep their content and are restyled for the colored background. *(Contrast for the column text on each of the three backgrounds is checked with the contrast tool; on yellow, the text turns dark.)*

## 8. Order of work

1. **Messaging fixes** (section 4): small, and they make the site honest today.
2. **Workflow changes:** the audit workflow, the update routes, and the home page's choices, since the home page depends on them.
3. **Site design:** the prompt box, the home page, navigation and the plays page, eyebrows, play pages, the footer, How Sistema works, then Reference. Consequential visual changes shown as comparison pages first.
4. **Tool pages:** the shared layout and controls, then each tool, with its limits stated.
5. **Tool capabilities:** palette anchoring, translucent colors in contrast, shape detection and object colors in the validator and dark mode, a list-of-sizes input for the type scale, a phone layout for the specimen, and a preview in the person's own app in the direction play. Each is a small decision; listed so none is lost.

Steps 1 to 4 are launch work. Step 5 can go to launch or the backlog item by item.
