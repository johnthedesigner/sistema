# Sistema — Copy Audit and Proposed Updates

**Audited:** 2026-05-16
**Auditor context:** John Livornese is a product design leader and design systems specialist — Principal Product Designer at multiple companies, Founding Designer at ReflexAI and Luminoso, led design systems at Wayfair, shipped Paletteer (10,000+ Figma users), and has built design systems from scratch professionally multiple times. Sistema should read as the work of that person, writing for an audience of peers.

**Scope:** Navigation, primary headings and subheadings, section labels, calls to action, UI captions, and copy that explains the purpose of the product. Excludes content pulled from markdown documents (play bodies, KB articles).

**Evaluation criteria:**
- VOICE_AND_TONE.md (practitioner-grade, specific, editorially confident, direct)
- Naming consistency (same thing called the same thing everywhere)
- Accuracy (no hardcoded claims that go stale)
- Credibility signal (establishes domain authority, not generic SaaS positioning)

---

## Critical issues

These are problems significant enough to affect first impressions or cause real confusion.

---

### 1. Naming inconsistency: "Campaign" vs "Featured play" vs "Playbook"

The same content type is called three different things across the product.

| Location | Term used |
|---|---|
| Nav link | "Playbook" |
| URL | `/campaigns` |
| Data layer | "campaign" |
| Playbooks index section heading | "Featured plays" |
| Campaign card chip | "featured · {N} steps" |
| Campaign landing eyebrow | "Featured play · {N} steps" |
| Campaign step header | "Featured play" |
| Campaigns index eyebrow | "Featured plays · {N} available" |
| Home page PromptBox label | "campaign · Bootstrap a Design System" |
| Home page sidebar label | "This campaign" |

**Decision required:** Pick one term. "Campaign" is the most precise because it names a specific product object (a multi-step play sequence). "Featured play" is descriptive but vague. "Playbook" conflicts with the broader section name.

**Proposed: use "campaign" throughout.**

| Location | Current | Proposed |
|---|---|---|
| Nav | Playbook | Plays |
| Campaign index eyebrow | Featured plays · {N} available | Campaigns · {N} available |
| Playbooks section heading | Featured plays | Campaigns |
| Campaign card chip | featured · {N} steps | campaign · {N} steps |
| Campaign landing eyebrow | Featured play · {N} steps | Campaign · {N} steps |
| Campaign step header | Featured play | Campaign |
| Playbooks eyebrow | Plays · {N} single · {N} featured | {N} plays · {N} campaigns |

---

### 2. Nav CTA: "How does it work?" doesn't match the destination

The nav's primary CTA button leads to `/guide`, which is titled "How to use Sistema." A question-form button and a how-to-guide title don't connect. Per VOICE_AND_TONE, buttons should be verb + object, not questions.

| | Current | Proposed |
|---|---|---|
| Nav CTA button | How does it work? | Get started |
| Guide page H1 | How to use Sistema | How to use Sistema *(keep as-is)* |

---

### 3. No credibility signal anywhere on the site

The site gives no indication of who built it or why they are qualified. For a practitioner audience evaluating a design systems tool, this is a missed opportunity. You shipped Paletteer (10,000+ Figma users), built design systems professionally at Wayfair, ReflexAI, and Tableau/Salesforce. This is the context that makes "grounded in real systems" a claim rather than marketing copy.

**Proposed: add a one-line attribution in the footer or a brief callout on the home page.**

Options (pick one):

> "Built by John Livornese — product design lead and design systems practitioner."

> "From the designer who built Paletteer (10k+ Figma users) and has built design systems professionally at Wayfair, ReflexAI, and Salesforce."

> "Made by John Livornese. I've built design systems at companies like Wayfair and Salesforce. This is the tool I wished I'd had."

The third option is the most credible — it's specific and personal without being promotional. It converts a generic "grounded in real systems" claim into an authorial credential.

---

## Significant issues

These affect clarity, accuracy, or voice but aren't showstoppers.

---

### 4. Home page — announcement pill

| | Copy |
|---|---|
| Current | Context-supported prompts for design-system work |
| Issue | "Context-supported" is jargon that doesn't communicate what it means (KB references baked into prompts). "design-system" as compound adjective reads fussy in this register. |
| Proposed | Prompts grounded in real design system references |

---

### 5. Home page — subhead verb "packages"

| | Copy |
|---|---|
| Current | Sistema packages production design-system references and ready-to-paste prompts… |
| Issue | "Packages" implies bundling/shipping, which isn't accurate. Sistema surfaces and structures them. "production design-system references" is also odd — "references from production design systems" is what's meant. |
| Proposed | Sistema pairs design system references with ready-to-paste prompts — *plays* — so Claude Code and Cursor generate tokens, components, and audits grounded in real systems instead of guessing. |

---

### 6. Home page — "Jump to a play" / "most-used this week"

| | Copy |
|---|---|
| Current | "Jump to a play" + "most-used this week" |
| Issue | "Jump to" is casual and vague. "most-used this week" is hardcoded — it isn't tracking actual usage, so it's inaccurate by definition. |
| Proposed section label | Frequently used |
| Proposed: remove | "most-used this week" — remove entirely |

---

### 7. Home page — hardcoded play count

| | Copy |
|---|---|
| Current | Browse all 18 plays |
| Issue | Hardcoded count will become stale whenever a play is added or removed. |
| Proposed | Browse all plays |

---

### 8. Playbooks index — H1 repeats the home page subhead

| | Copy |
|---|---|
| Current | Ready-to-paste prompts, grounded in real systems. |
| Issue | This exact phrase ("grounded in real systems") ends the home page subhead. The playbooks index is a navigation page — it should orient, not re-explain. |
| Proposed | Plays for every stage of design system work. |

---

### 9. Playbooks index — "single" in eyebrow

| | Copy |
|---|---|
| Current | Plays · {N} single · {N} featured |
| Issue | "Single" is ambiguous — single what? It means standalone/individual plays (vs. campaigns). |
| Proposed | {N} plays · {N} campaigns |

---

### 10. Playbooks index — "Featured plays" section description

| | Copy |
|---|---|
| Current | multi-step plays that cover a complete arc. |
| Issue | Starts lowercase (heading-level text should be sentence case). "complete arc" is vague — arc toward what? |
| Proposed | Multi-step plays that cover a complete design system workflow. |

---

### 11. Playbooks index — "Plays (by design system stage)"

| | Copy |
|---|---|
| Current | Plays (by design system stage) |
| Issue | Parenthetical does awkward grammatical work as a heading. |
| Proposed | Plays by stage |

---

### 12. Playbooks index — time estimate formula

| | Copy |
|---|---|
| Current | ~{campaign.steps.length * 4} min |
| Issue | `steps × 4 minutes` is a made-up formula. Presenting it as a time estimate is inaccurate without measurement. |
| Proposed | Remove the time estimate, or replace with "{N} steps" if step count is already in the chip. |

---

### 13. Campaign index — "prompt ready" badge

| | Copy |
|---|---|
| Current | prompt ready (badge on campaigns that have a prompt) |
| Issue | Implies some campaigns are "prompt not ready" — a status distinction that reads as an incomplete feature, not a feature. |
| Proposed | Remove the badge. If all campaigns eventually will have prompts, it's noise. If some permanently won't, reconsider the architecture before surfacing it. |

---

### 14. KB landing — H1

| | Copy |
|---|---|
| Current | Reference material plays read so your agent doesn't guess. |
| Issue | Garden path sentence. "Reference material plays read" — the reader initially parses "plays" as a verb (reference material plays [the field]). The intended parse is "reference material [that] plays read." Even with the correct parse, it's awkward. |
| Proposed | The reference your plays use, so your agent doesn't guess. |

---

### 15. KB landing — subhead frames the KB negatively

| | Copy |
|---|---|
| Current | The KB is for agents, not for human reading. Browse it to understand what is grounded, then go back to a play — that's where it gets pulled in automatically. |
| Issue | "Not for human reading" discourages browsing by the actual humans using this page. "What is grounded" is also vague. The KB is public and useful for humans to browse — the point is that plays pull from it automatically. Lead with that. |
| Proposed | Every play pulls from this KB at runtime. Browse by category to see what's covered, or search for a specific document. |

---

### 16. KB landing — capitalization inconsistency

| | Copy |
|---|---|
| Current | "Knowledge Base" (eyebrow, heading level) vs. "Knowledge base" (sources callout title: "Knowledge base sources") |
| Issue | Inconsistent capitalization of a proper noun. |
| Proposed | "Knowledge Base" everywhere — it is the product's named section. |

---

### 17. KB landing — search strip copy

| | Copy |
|---|---|
| Current | "Looking for a specific document, not a category?" (question form) + "Search the Knowledge Base" (button) |
| Issue | Questions as interface labels violate the VOICE_AND_TONE rule. "Search the Knowledge Base" is long for a button. |
| Proposed label | Find a specific document |
| Proposed button | Search KB |

---

### 18. Campaign landing — empty state

| | Copy |
|---|---|
| Current | Prompt not yet available. |
| Issue | Fine for honesty, but gives no guidance. What should the user do? |
| Proposed | Prompt not yet available. Check back soon or browse the individual plays in the steps list. |

---

### 19. Guide page — section heading inconsistency

The guide page section headings use "playbook" (singular, as noun): "Running a playbook end-to-end." Per the naming decision in issue #1, the canonical term is "play" or "plays" — "playbook" refers to the section, not an individual item.

| | Current | Proposed |
|---|---|---|
| Section heading | Running a playbook end-to-end | Running plays end-to-end |
| Subhead | A practical walkthrough — from setting up your project to running plays end-to-end. | A practical walkthrough — from a blank project to a running design system. |

---

## Minor issues

These are small polish items.

---

### 20. Campaign landing — "Prompt" label context

| | Copy |
|---|---|
| Current | "Prompt" (section label) + "paste once — the agent drives the rest" |
| Issue | Good, but "paste once" slightly understates — you paste it, then the agent runs. "Copy and paste this into Claude Code or Cursor" would be more instructive for a first-time user. |
| Proposed label | Campaign prompt |
| Proposed caption | Copy and paste into Claude Code or Cursor — the agent handles the rest. |

---

### 21. KB category — "Skills" description

| | Copy |
|---|---|
| Current | Open-source design skills for AI coding agents. Reviewed for license and synthesized into principles. |
| Issue | Good but "synthesized into principles" implies readers shouldn't bother reading skills directly. They may want to. |
| Proposed | Open-source design skills for AI coding agents — reviewed for license compatibility and synthesized into Sistema's principles. |

---

### 22. Sources callout body — "and others"

| | Copy |
|---|---|
| Current | This KB is built from publicly available documentation across Material Design, Carbon, Atlassian, Ant Design, Radix, Primer, W3C, and others. |
| Issue | "And others" is vague when Sources page has the full list one click away. The CTA handles this — the sentence can be more specific or just cut "and others." |
| Proposed | This KB is built from publicly available documentation: Material Design, Carbon, Atlassian, Ant Design, Radix, Primer, W3C, Shopify Polaris, MailChimp, and more. |

---

## Complete proposed copy — ready to implement

### Navigation

| Element | Current | Proposed |
|---|---|---|
| Nav link 1 | Playbook | Plays |
| Nav link 2 | Knowledge Base | Knowledge Base *(keep)* |
| Nav link 3 | Tools | Tools *(keep)* |
| Nav link 4 | Guide | Guide *(keep)* |
| Nav CTA button | How does it work? | Get started |
| Search placeholder | Search plays, KB, tools… | Search plays, KB, tools… *(keep)* |

---

### Home page

| Element | Current | Proposed |
|---|---|---|
| Announcement pill | Context-supported prompts for design-system work | Prompts grounded in real design system references |
| H1 | Your AI coding agent needs better context. Here it is. | Your AI coding agent needs better context. Here it is. *(keep — it's strong)* |
| Subhead | Sistema packages production design-system references and ready-to-paste prompts — *plays* — so Claude Code and Cursor generate tokens, components, and audits grounded in real systems instead of guessing. | Sistema pairs design system references with ready-to-paste prompts — *plays* — so Claude Code and Cursor generate tokens, components, and audits grounded in real systems instead of guessing. |
| PromptBox sidebar label | This campaign | About this campaign |
| Section label | Jump to a play | Frequently used |
| Section subtext | most-used this week | *(remove)* |
| Browse link | Browse all 18 plays | Browse all plays |
| Campaign chip | campaign · {N} steps | campaign · {N} steps *(keep)* |

---

### Playbooks index

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | Plays · {N} single · {N} featured | {N} plays · {N} campaigns |
| H1 | Ready-to-paste prompts, grounded in real systems. | Plays for every stage of design system work. |
| Campaigns section heading | Featured plays | Campaigns |
| Campaigns section description | multi-step plays that cover a complete arc. | Multi-step plays that cover a complete design system workflow. |
| Campaign card CTA | Open | Start |
| Time estimate | ~{N * 4} min | *(remove — use "{N} steps" only)* |
| Stage section heading | Plays (by design system stage) | Plays by stage |
| Stage section subtitle | by stage · foundations → stewardship | stage 1 (foundations) → stage 6 (stewardship) |

---

### Campaigns index

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | Featured plays · {N} available | Campaigns · {N} available |
| H1 | Self-driving workflows for design systems. | Self-driving campaigns for design systems. |
| Subhead | Copy one prompt and paste it into your AI tool. The agent works through every step in order, asks for input when needed, and pauses for your approval before advancing. | Paste one prompt into Claude Code or Cursor. The agent works through every step in order, asks for input when needed, and pauses before advancing. |
| Badge | prompt ready | *(remove)* |

---

### Campaign landing page

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | Featured play · {N} steps | Campaign · {N} steps |
| Prompt section label | Prompt | Campaign prompt |
| Prompt caption | paste once — the agent drives the rest | Copy and paste into Claude Code or Cursor — the agent handles the rest. |
| Empty state | Prompt not yet available. | Prompt not yet available. Browse the individual plays in the steps list. |
| Steps right rail label | Steps | Steps *(keep)* |
| Self-driving callout | Self-driving: paste the prompt once. The agent will work through all {N} steps, ask for input when needed, and pause for confirmation before advancing. | Self-driving: paste once. The agent works through all {N} steps, asks for input when needed, and pauses before advancing. |

---

### Campaign step page

| Element | Current | Proposed |
|---|---|---|
| Step header eyebrow | Featured play | Campaign |

---

### KB landing

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | Knowledge Base · {N} entries | Knowledge Base · {N} entries *(keep)* |
| H1 | Reference material plays read so your agent doesn't guess. | The reference your plays use, so your agent doesn't guess. |
| Subhead | The KB is for agents, not for human reading. Browse it to understand what is grounded, then go back to a play — that's where it gets pulled in automatically. | Every play pulls from this KB at runtime. Browse by category to see what's covered, or search for a specific document. |
| Principles badge | primary references | primary references *(keep)* |
| Reference Sources description | Named systems, specifications, and theoretical foundations. These are raw material — consulted for prior art and conformance, not synthesis. | Named systems, specifications, and theoretical foundations. These are raw material — consulted for prior art and conformance, not synthesis. *(keep — good)* |
| Sources callout title | Knowledge base sources | Knowledge Base sources |
| Sources callout body | This KB is built from publicly available documentation across Material Design, Carbon, Atlassian, Ant Design, Radix, Primer, W3C, and others. | This KB is built from publicly available documentation: Material Design, Carbon, Atlassian, Ant Design, Radix, Primer, W3C, Shopify Polaris, MailChimp, and more. |
| Strip label | Looking for a specific document, not a category? | Find a specific document |
| Strip button 1 | Search the Knowledge Base | Search KB |
| Strip button 2 | Browse plays | Browse plays *(keep)* |
| Skills category description | Open-source design skills for AI coding agents. Reviewed for license and synthesized into principles. | Open-source design skills for AI coding agents — reviewed for license compatibility and synthesized into Sistema's principles. |

---

### Guide page

| Element | Current | Proposed |
|---|---|---|
| H1 | How to use Sistema | How to use Sistema *(keep)* |
| Subhead | A practical walkthrough — from setting up your project to running plays end-to-end. | A practical walkthrough — from a blank project to a running design system. |
| Section 3 heading | Running a playbook end-to-end | Running plays end-to-end |

---

### Footer / credibility (new copy — not currently in the product)

Add to site footer or home page:

> "Built by John Livornese — product design lead and design systems practitioner. Previously at Wayfair, Salesforce/Tableau, and ReflexAI. Creator of [Paletteer](https://paletteer.app)."

This is the one piece of copy that transforms "grounded in real systems" from a claim into a credential. It's the difference between a generic tool and a practitioner's tool.

---

## Summary: highest-priority changes

In order of impact:

1. **Naming consistency** — Pick "campaign" throughout; change "Playbook" nav to "Plays" (issues 1, 9, 11)
2. **Credibility attribution** — Add practitioner byline (issue 3)
3. **Nav CTA** — "How does it work?" → "Get started" (issue 2)
4. **KB H1** — Fix the garden path sentence (issue 14)
5. **KB subhead** — Stop telling humans this isn't for them (issue 15)
6. **Home subhead verb** — "packages" → "pairs" (issue 5)
7. **Hardcoded count** — Remove "18" from "Browse all 18 plays" (issue 7)
8. **"most-used this week"** — Remove the inaccurate claim (issue 6)
