# Proposed Site Structure

**Task:** V1.9 (plan 7.1). **Status:** approved 2026-11-16 (answers in section 7). The build happens in two steps: V1.13 points pages at the new content model, and V3 does the visual restructure. A visual version of this proposal, with a working prompt box, is in `site-structure.html` in this folder.

**Inputs:** plan Section 7, `ia-research.md` (sections 4 to 6), the approved narrative (`narrative-draft.md`), the opinions (`content/opinions/`), and the owner's prompt box idea (2026-11-16).

---

## 1. Navigation

Four places, plus a door for agents. Getting to work comes first (plan 7.1).

| Nav item | Mode (plan 7.1) | What's there |
|---|---|---|
| **Get started** | Start working | How Sistema works; Start a design system; Bring Sistema to an existing system; Work on my system; all plays |
| **Guides** | Guides | Sistema's take on each foundation, by topic |
| **Reference** | Reference | Opinions, rules, workflows in full, file formats, tool APIs, sources |
| **Tools** | Start working | Palette, contrast, and type scale, interactive |
| **For agents** (right side) | (all) | The agents page and `llms.txt` |

The logo goes home. GitHub sits at the far right.

**Topics connect the places.** A guide page ends with the plays and rules for its topic. A play page links to the guide sections it cites and the rules it applies. A rule links back to its opinion. So a reader can follow color from the guide to the plays to the rules without a separate topic hub.

**Option considered: topic hubs.** One page per topic (Color, Typography, and so on) holding its guide, plays, rules, and tool in tabs, as Nessie's component pages do. It reads well for a single topic. It mixes "learn", "do", and "look up" on one page, though, which is what plan 7.1 separates. It also makes "start a design system" one link among many. I recommend the four places above, with topics as the cross-links.

## 2. The prompt box

The owner's idea, refined. One component, used in three places.

**On the home page:**
- The box looks like a chat input and shows the real prompt.
- Three suggestions sit below it: **Start a design system** (selected by default), **I already have a design system**, and **Work on my system**.
- A second row always shows the routes: add a component, add a theme, bring in existing colors, audit a component, audit accessibility, audit token use, review the system, and plan the next round. The row is slightly dimmed until "Work on my system" is chosen. Choosing "Work on my system", or any route in the row, selects "Work on my system" and lifts the dimming. (Owner, 2026-11-16.)
- Choosing a suggestion swaps the prompt in the box.
- Route prompts end with a line you can fill in, such as "I want to add a component: [describe it]". The box is editable, so the copied prompt can say what you want.
- The action button reads **Copy prompt** and shows a copy icon. An arrow would suggest sending. After a click it says "Copied. Paste it into your agent."
- One line under the box: "Paste into Claude Code, Cursor, or another coding agent, in your project folder."
- Later (V4), a toggle above the box switches between **Prompt** and **MCP server**.

**On "Work on my system":** the same box, with only the route suggestions.

**On workflow and play pages:** the same box, showing that item's prompt, with no suggestions.

**What it needs from the content model:**
- Suggestion labels and one-line descriptions come from workflow and route data, not page copy. Route labels need a short human name in `session.md`. Today they're slugs.
- The session starter should accept a route named in the prompt. `project.orient` then confirms it instead of asking. This is a small change to the starter text.

**Accessibility:** the suggestions are a group of toggle buttons with `aria-pressed`. The box is a labeled textarea. The copy result is announced through a live region. Everything works by keyboard.

## 3. Pages and URLs

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Prompt box, then the narrative sections |
| How Sistema works | `/how-it-works` | Replaces `/guide` |
| Start a design system | `/start` | Entry page (narrative section 3) |
| Bring Sistema to an existing system | `/existing` | Entry page |
| Work on my system | `/work` | Entry page, with route suggestions |
| A workflow | `/workflows/[id]` | The outline the agent shows, with approvals marked; prompt box |
| All plays | `/plays` | Grouped by topic, filterable by milestone |
| A play | `/plays/[id]` | Template in section 4 |
| Guides | `/guides`, `/guides/[topic]/[name]` | Replaces `/kb/principles/...` |
| Reference home | `/reference` | |
| Opinions | `/reference/opinions` | Grouped, with each item expanding in place; `#id` anchors |
| Rules | `/reference/rules` | One table, filterable by topic; `#id` anchors |
| File formats | `/reference/files/[name]` | `sistema-json`, `design-md`, `decisions-md`, `tokens` |
| Tool APIs | `/reference/tools` | Request and response shapes |
| Sources | `/sources` | Credits and licensing (V1.16) |
| Tools | `/tools/[name]` | Interactive pages; each links to its API |
| For agents | `/agents`, `/llms.txt` | V1.13 |
| Plain-text twins | `/raw/...` | Every page above that has content |

**Removed, with no redirects:** `/kb/*` (reference material becomes internal in V1.16), `/playbooks/*`, `/campaigns/*`, `/guide`, and `/bundle/*`.

## 4. Page templates

**Play page** (the Carbon and Stripe shape from the IA research):
1. Title, description (what it does and when to use it), milestone, and last reviewed
2. Prompt box
3. What it needs and what it produces
4. What it shows as evidence
5. Rules it applies (linked), and guide sections it cites (linked)
6. Workflows that include it, with previous and next steps
7. "For agents" note and "Edit on GitHub"

**Workflow page:** the outline grouped by milestone, with approvals marked, as the agent shows it. Each step links to its play. The prompt box is at the top.

**Guide page:** an "On this page" list, the guide body, then "Plays for this topic" and "Rules for this topic", last reviewed, and "Edit on GitHub."

**Opinion item:** the default as the visible line. It expands to Why, When you'd choose otherwise, and If you override it (or What breaks without it for the method group), plus its rules.

**Every page:** the one-line "for agents" note at the top, in small type (V1.13).

## 5. Phasing

- **V1.13:** pages read the new model, using the new URLs, inside today's layout. The old routes are deleted. Adds `llms.txt`, `/agents`, and the per-page note. Doing the URL change now avoids building the old routes twice.
- **V3:** the visual restructure: navigation, the prompt box, page templates, and the home page from the narrative. It also applies Sistema to the site's own design system.

## 6. Questions for the owner

1. **Navigation:** the four places with topic cross-links (recommended), or topic hubs?
2. **Prompt box:** is the editable box with a fill-in line for routes the direction you want? Should the second row of route suggestions appear only after choosing "Work on my system", or always show?
3. **URL change in V1.13:** move to the new URLs while rewiring (recommended), or keep the old ones until V3?
4. **Search:** the site has a command palette (Cmd-K) today. Keep it and point it at the new content (recommended), or drop it until the site has more content?

## 7. Owner answers (2026-11-16)

1. **Navigation:** the four places, with topics as cross-links.
2. **Prompt box:** the routes row always shows, slightly dimmed. Choosing "Work on my system" or any route selects "Work on my system" and lifts the dimming. Section 2 and the visual page are updated.
3. **URLs:** change them in V1.13.
4. **Search:** keep the Cmd-K command palette and point it at the new content.

