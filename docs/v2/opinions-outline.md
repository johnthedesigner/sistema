# Published Opinions: Outline

**Task:** V1.8, outline stage. **Status:** approved 2026-11-16. Drafted as 20 content items in `content/opinions/` (see Section 6 for the owner's answers).

**Sources:** plan Section 6 (the starting list), decision D3 (default stack), the rules registry (`content/rules/`), what the slice runs and R1 showed, and owner direction from 2026-11-16 (visual milestones, matters of taste are guidance, nothing existing changes without consent).

---

## 1. What an opinion is

An opinion is one default that Sistema holds about **process, structure, or the quality floor**, stated with its reason. It is never about how a product looks. That boundary (plan Section 3) is the test for every item below.

Each item has:
- **The default:** one sentence.
- **Why:** two or three sentences.
- **When you'd choose otherwise:** the honest cases where the default is wrong for you.
- **If you override it:** what changes in the method. Some opinions are load-bearing, and overriding them means Sistema can't do part of its job. The item says so plainly.
- **Related:** the rules that put it into practice, and the guide sections that explain it.

**Overrides are normal.** An override is just a kind of decision. It goes in DECISIONS.md like any other entry, with a date and a reason, and it also names the opinion it overrides (for example, "Overrides opinion.tokens-before-components"), so audits can find it. Agents read DECISIONS.md, so they follow the override from then on. *(Owner, 2026-11-16.)*

**Opinions aren't rules.** A rule is a checkable requirement inside a step (for example, `color.contrast.text`). An opinion is the stance behind one or more rules. Opinions link to rules. Steps cite rules, not opinions.

## 2. Content item shape

```yaml
---
id: opinion.tokens-before-components
title: Tokens come before components
group: process            # process | structure | quality-floor | boundary
default: Components are built only after the tokens they use exist and are checked.
rules: [tokens.usage.no-raw-values]
guides: [tokens#...]
description: When to use: deciding whether to start on components before the foundations are settled.
---
## Why
## When you'd choose otherwise
## If you override it
```

The schema goes into `src/lib/content/schema.ts` alongside plays and workflows. The content checker validates rule and guide references, as it does for plays.

## 3. The opinions

The plan's starting list, edited after the slice runs. **New** marks an item that came out of the runs or owner direction. **Changed** marks a reworded item.

### Process: how the work runs

1. **Direction comes before any values.** You agree on what the product is and how it should feel before any color or size exists. *Otherwise:* you're adopting an existing brand with fixed values; the assessment step records them as decided.
2. **You see every stage before you build on it.** *(New, owner direction.)* Each milestone ends on a page in your browser that shows the result rendered: ramps, specimens, components in every theme. Descriptions hide problems that a rendered page shows at once. *Otherwise:* rarely. Headless or CI-only runs can skip the page but must still produce the checks.
3. **A person approves direction and foundations.** *(Merges the plan's "A person approves direction before tokens are generated.")* The agent stops at each approval and waits. *Otherwise:* a solo developer can approve inline; the approval is still logged.
4. **Tokens come before components.** *Otherwise:* a throwaway prototype. Load-bearing: components built first will use raw values, and the coverage audit will flag them.
5. **Nothing counts as done without evidence.** A tool result, a passing build or check, or a rendered page. *Otherwise:* none. This one isn't really optional.
6. **Calculate, don't estimate.** *(New.)* Anything a tool can compute (palettes, contrast, type scales) comes from the tool, not the agent's judgment. Agents guess plausible numbers that turn out wrong.
7. **Read the project before asking.** *(New.)* The agent learns what it can from your repo and asks only what it can't find out. *Otherwise:* none worth naming.
8. **What exists stays until you choose to change it.** *(New, owner direction.)* Existing colors, names, and files are kept unless you pick another option on a comparison page. Suggestions are suggestions. *Otherwise:* you want a clean slate; say so once and it's logged.
9. **Decisions get logged with their reasons.** In DECISIONS.md, dated, including overrides of these opinions.
10. **Your repo holds the state, so you can stop anytime.** *(New.)* Progress lives in `sistema.json`, and a short note in AGENTS.md points the next session back. *Otherwise:* none. Load-bearing for resuming.

### Structure: how the system is built

11. **Tokens are authored as DTCG JSON and compiled.** Compiled output is never edited by hand. *Otherwise:* a team already using another token source format. Sistema's steps then map to it loosely.
12. **Two tiers: primitive and semantic.** A component tier is optional, and added when components need it. *Otherwise:* a very small project might use semantic tokens only.
13. **Tokens are named for their job.** One consistent pattern that states the role (`bg-primary`, not `bg-blue-600`). *(Merges the plan's naming item.)*
14. **Palettes are generated in OKLCH.** Equal lightness steps look equal, which makes contrast predictable across hues. *Otherwise:* fixed brand ramps you must keep; they're mapped, not regenerated.
15. **Output is CSS custom properties,** with framework mapping (such as Tailwind) on top. *Otherwise:* a native platform; loosely supported.
16. **The default path is web, React, and Tailwind.** *(Settled in D3.)* The foundations are stack-neutral. Only component steps assume the stack. Other stacks are supported more loosely, and the item says what that means.

### Quality floor: what every system meets

17. **Every project chooses its accessibility standard,** during Direction, to fit its use. Specific numbers come from that standard, not from Sistema.
18. **Go beyond the minimum when it's cheap.** Advisory, and depends on context.
19. **Quality signals are advisory, never blocking.** The "AI slop" checks raise a flag and suggest a fix. You decide.

### Boundary: what Sistema doesn't set

20. **Sistema doesn't set universal thresholds.** Target sizes and contrast ratios come from your chosen standard or your own decisions.
21. **Numbers in guides are guidance.** A typical line-height range comes with its context and reason. It isn't a rule for every project.
22. **Sistema doesn't decide what your product looks like.** *(New; the plan Section 3 line, stated as an item so the page ends on it.)* Taste, product direction, and brand stay with you. Where a step offers a taste-based approach, it's a starting point, not a default.

## 4. Where opinions appear

- **Opinions page** in Reference: grouped as above, each item collapsed to its default, expanding to why, otherwise, and override.
- **How Sistema works:** links to the opinions page and names the process opinions in a sentence.
- **Step pages:** the rules section links each rule's opinion, if it has one.
- **Agents:** `/raw/opinions` and an `llms.txt` line. Starters don't inline opinions, since steps already carry the rules.

## 5. Questions for the owner

1. **Cuts.** 22 is a lot for one page. Candidates to fold away: #7 (read before asking) into #3, #15 (CSS output) into #11, #18 into #17. That leaves 19. Fold them?
2. **Load-bearing items.** #4, #5, and #10 are hard to override without losing part of the method. Should the page mark these (for example, "Required for Sistema to work"), or leave every item equally optional in tone?
3. **The "otherwise" for #5 and #7 is "none."** Is an opinion with no real alternative still an opinion, or does it belong in "How Sistema works" instead?
4. **Override logging.** Should overrides use a fixed form in DECISIONS.md (for example, "Override: opinion.tokens-before-components") so audits can find them, or stay free text?

## 6. Owner answers (2026-11-16)

1. **Cuts:** keep all seven new opinions. Merge "Output is CSS custom properties" into the DTCG item, and "Go beyond the minimum" into the accessibility standard item. 22 becomes 20.
2. **and 3. Opinions you can't really override:** they're part of how Sistema works. They form a fifth group, `method`, which comes first on the page. Method items have "Why" and "What breaks without it" instead of the two override sections. The four are: tokens before components, evidence before done, your repo holds the state, and read before asking.
4. **Overrides:** an override is a decision like any other. It goes in DECISIONS.md and names the opinion it overrides.

The draft: `content/opinions/*.md`, schema `OpinionFrontmatter` in `src/lib/content/schema.ts`. The content checker validates each item's sections, file path, rules, and guide anchors. Pages and `/raw/opinions` come with the site build in V1.13.

