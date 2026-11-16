# IA and Layout Research

**Task:** V1.6 (plan 7.2). **Date:** 2026-11-16. **Status:** waiting for owner review. The proposed site structure comes later, in V1.9, and builds on this.

**Method:** real pages were fetched and read. Nothing is filled in from memory. Eight sites were readable: GOV.UK, Carbon, Primer, Atlassian, Spectrum (partly), Stripe, Tailwind, and MDN. Two sites could not be evaluated:
- **Material 3** renders only with JavaScript and returned page titles only.
- **Polaris** now redirects every old URL to Shopify's API hub.

Three agent capability libraries were also read: GitHub's MCP server, Anthropic's Agent Skills, and shadcn/ui's MCP server and registry.

---

## 1. What each site does well

| Site | Worth borrowing | Seen at |
|---|---|---|
| **GOV.UK** | One "Get started" button on the home page, then "browse styles, components, patterns." Each component page has "When to use this component", "How it works", "Research on this component", and a "Recent changes" table tied to releases. Each example has a standalone URL. An edit link points to the page's source file. | design-system.service.gov.uk, /components/button/ |
| **Carbon** | Two start cards, "Start designing" and "Start developing." Each component has four tabs, each with its own URL: Guidelines, Specifications, Code, Accessibility. Guidelines opens with a live demo, then "When to use" and "When not to use." Token tables use the columns Token, Role, and Value, where Role states usage in plain words. Pages show "Last updated." Carbon MCP is a section under Getting started. | carbondesignsystem.com, /components/button/usage/, /elements/color/tokens/ |
| **Primer** | "Get started" leads to a sidebar grouped as Getting started, Primitives, UI patterns, Scenario patterns, and Components. Each component page has a jump block (Overview, Guidelines, Accessibility), live examples with Copy, Reset, and "Show full code," and an "On this page" list. Token tables use the columns Sample, CSS variable, and Output value, with a copy button on every row. An MCP server page sits under Getting started. | primer.style, /product/components/button/, /product/primitives/color/ |
| **Atlassian** | A token-name anatomy explained once (foundation, property, modifier), then a searchable token explorer with filters, an exact-search toggle, light and dark values, and "Introduced in" per token. Component tabs: Examples, Code, Usage, Changelog. A "Was this page helpful?" widget. A "Design for AI" section. | atlassian.design, /components/tokens/all-tokens |
| **Spectrum** | The token page explains how to read a token name with one worked example. "First stop, foundations" is the start path. Component pages are an index of named sections (Anatomy, Options, States, Behaviors, Usage guidelines). The token data lives in a public repo. | spectrum.adobe.com/page/design-tokens/ |
| **Stripe** | The docs home starts with "Start here: integrate using skills and plugins," then browses by product. Quickstarts are one long numbered procedure ending in "Try it out" and "Next steps." Reference pages show the request and response before the parameter list. **For agents:** `llms.txt` (markdown index of every page, each with a one-line description), a `.md` twin of every page, an "Agent skills" page, and a section of instructions for LLM agents. | docs.stripe.com, /llms.txt, /api/…/create.md |
| **Tailwind** | Sidebar: Getting started, then Core concepts, then reference grouped by CSS topic. Reference pages run: quick-reference table first (class, then the CSS it produces), then examples, then customizing. Also: an "On this page" list, previous and next links at the foot, and search on ⌘K. The theme page maps each variable namespace to the utilities it creates. | tailwindcss.com/docs/padding, /docs/theme |
| **MDN** | Learn and Reference are separate areas. Learn routes by level ("Never coded before?", "Beyond the basics?"). Reference pages run: summary with a support badge, "Try it" live example, syntax, values, formal definition, examples, specifications, compatibility, see also. Pages show "Last modified" with a link to report a problem. | developer.mozilla.org |

## 2. How the agent libraries organize capabilities

| Library | Unit | How an agent finds the right one | Human setup docs |
|---|---|---|---|
| **GitHub MCP server** | Tools grouped in about 21 toolsets, with a small default set. Toolsets also carry prompts and resources. | Scoping, not search: enable only the toolsets you need, plus a read-only switch. The README says this "can help the LLM with tool choice and reduce the context size." | Per-client install guides, copyable JSON config, and one-click install per toolset |
| **Anthropic Agent Skills** | A folder with `SKILL.md` (name and description in front matter), plus optional scripts, references, and assets | Three levels of disclosure: about 100 tokens of metadata always loaded, the body (under 5k tokens) when the skill is triggered, and files as needed. The description is what the request is matched against, so it must say what the skill does and when to use it. Guidance: keep `SKILL.md` under 500 lines, and give long reference files a table of contents. | A two-line install from the plugin marketplace; personal and project install folders |
| **shadcn/ui MCP and registry** | Registry items (components, blocks, templates) under namespaced registries | The server reads each registry's index file. Agents ask in plain language ("show me all available components"). | Tabs per client, a one-command setup, and a verification step ("run `/mcp`… if you see `Connected`, you're good to go") |

## 3. Patterns across the sites

**Start paths.** Every strong site gives one obvious first action:
- GOV.UK: one button.
- Carbon: two cards, by role.
- Stripe: "Start here," aimed at people working with agents.
- MDN: routes by experience.

None makes a new visitor choose from a full menu first.

**Separate doing from looking up.** Every site keeps two kinds of page apart:
- **Getting-started and how-to content:** Stripe's quickstarts, Tailwind's Getting started, MDN's Learn.
- **Reference:** Stripe's API, Tailwind's utility pages, MDN's Reference.

This matches plan 7.1's three modes: Start working, Guides, and Reference.

**Grouping by concern.** Design system navigation groups by kind of thing:
- foundations or styles;
- components;
- patterns, which GOV.UK and Primer treat as task-level and separate from components.

Primer and Carbon also put an MCP or agents page under Getting started.

**Usage guidance.**
- Carbon has explicit "When to use" and "When not to use" sections. GOV.UK has "When to use," with the negatives written inline.
- Variants are shown as a table of each variant and its purpose (Carbon).

**Token reference.**
- The best token tables say what each token is *for* (Carbon's Role column).
- They let you copy the name (Primer) and search or filter (Atlassian).
- They explain name anatomy once, with a worked example (Atlassian, Spectrum).

**Page furniture.** These appear on most of the strong pages:
- an "On this page" list (Carbon, Primer, Tailwind, MDN);
- last-updated dates (Carbon, MDN);
- change history (GOV.UK, Atlassian);
- previous and next links (Tailwind);
- feedback or edit links (GOV.UK, Atlassian, MDN, Carbon).

**Serving agents.** Only Stripe does this fully:
- `llms.txt`;
- a markdown twin of every page;
- an agent setup page;
- agent instructions.

Carbon and Primer have MCP pages, and Atlassian has a "Design for AI" section. Tailwind and MDN showed nothing for agents on the pages read.

**Agent libraries agree on three things:**
1. **Progressive disclosure:** a small index first, then the item, then its detail.
2. **The description is the matching surface,** so it must say when to use the item.
3. **Keep the default surface small,** and let the user scope it.

## 4. What this suggests for Sistema

These are inputs for V1.9, not decisions.

1. **One first action.** "Start a design system" (copy the starter, or connect the MCP server), with "I already have a system" and "Work on my system" as the two other doors. This matches plan Section 3's three entry points, and the `start`, `start` (Adopt path), and `session` workflows already built.
2. **Guides and Reference are separate places.** Guides are organized by topic (color, typography, and so on). Reference holds the rules registry, the published opinions, tool details, and file formats (`sistema.json` schema, DESIGN.md, DTCG).
3. **Play pages follow the Carbon and Stripe shape:**
   - what it does and when to use it, including when not to;
   - what it needs and what it produces (the contract);
   - the prompt, with a copy button;
   - the rules it applies and the guide sections it cites;
   - the evidence it shows;
   - last reviewed.

   These are the fields plays already have.
4. **Rules get a Carbon-style table:** Rule, why, and the values for each standard, with a copy button for the ID.
5. **Every page has a markdown twin, and the site publishes `llms.txt`.** Sistema's `/raw/` routes are already twins for plays, workflows, and guides. An `llms.txt` index with one line per workflow, play, and guide would give agents the Stripe-style entry point at almost no cost. It also fits the Skills pattern: a short index whose descriptions say when to use each item.
6. **A Connect page** for the MCP server (V4): per-client tabs, a config snippet to copy, and a "check it's connected" step, as shadcn does.
7. **Page furniture to adopt:** an "On this page" list, previous and next links inside a workflow, last reviewed (`last_reviewed` already exists), and an "edit on GitHub" link.
8. **Skip for now:**
   - Live component demos and a searchable token explorer. Sistema has no component library of its own; the reference project in V3 may change that.
   - Change history per page. Git history covers it until there are outside users.

## 5. Questions for the owner

1. Does "one first action, two other doors" match how you want the home page to work, or should the three entry points have equal weight?
2. Should `llms.txt` and an agents page come early (V1.13, cheap) or wait for the V3 site work?
3. Are there sites you admire that this list missed? Linear's docs, Vercel's docs, and the Radix docs are candidates if you want a second pass.
