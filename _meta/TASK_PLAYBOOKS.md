# TASK_PLAYBOOKS.md
# Design System Knowledge Base — Task Playbooks

**Version:** 1.0
**Created:** 2026-05-11
**Purpose:** This document provides task-specific instructions for an LLM operating with this knowledge base. Each playbook defines what files to retrieve, in what order, and how to reason over them to complete a particular type of task. These playbooks grow over time as new task types are identified.

Read `USAGE_GUIDE.md` before this document if you have not already.

---

## How to Use This Document

Find the playbook that matches your current task. If no exact match exists, identify the closest analogous playbook and adapt its retrieval strategy. If you complete a task type that is not covered here and warrants a new playbook, note it for a future maintenance session.

Playbooks are organized by task category. Each entry includes:
- **Trigger** — phrases or scenarios that indicate this playbook applies
- **Tier** — the generative complexity tier of this play (see below)
- **Content types needed** — which of `guidance`, `implementation`, `asset`, `design-md`, `exemplar` to retrieve
- **Retrieval sequence** — the order and logic of file retrieval
- **Reasoning strategy** — how to synthesize what you retrieve into a useful output
- **Output notes** — format, caveats, or quality standards specific to this task

---

## Generative Play Tiers

Plays are classified into three tiers based on their generative complexity. The tier determines how much of the work is retrieval-and-synthesis versus novel generation.

**Tier 1 — Reference-grounded generation.** The knowledge base provides the structural grammar; the user provides specific inputs (brand color, product type, etc.). Output is new content that follows patterns drawn directly from the knowledge base. These plays are reliable and produce consistently high quality when the relevant source files are loaded. *Examples: generate a token set for a new system, create a DESIGN.md from scratch.*

**Tier 2 — Analysis-then-generate.** The LLM must first analyze user-provided content (a codebase, an existing token file, a design spec), then apply knowledge base patterns to transform or extend it. Context comes from two sources: the user's material and the knowledge base. These plays require more care in prompting because the analysis step must precede and inform the generation step. *Examples: migrate a Tailwind color config to semantic tokens, audit a component against a system's guidance.*

**Tier 3 — Generative workflow.** Multi-step or open-ended generation tasks where the knowledge base informs approach and standards but the output is substantially novel. These plays shade into agentic territory — they may require multiple LLM calls, intermediate review steps, or tool use. On the playbook website, Tier 3 plays are presented as guided workflows rather than single copyable prompts. *Examples: design a complete token architecture from a brief, generate a full component specification suite.*

---

## Category 1: Color System Tasks

### 1.1 — Analyze or Describe a Design System's Color Model

**Trigger:** "How does [system] handle color?", "Explain [system]'s color system", "What color tokens does [system] use?"

**Content types needed:** `guidance` (primary), `asset` (supplementary)

**Retrieval sequence:**
1. Read the target system's `_index.md` to confirm color content is available
2. Retrieve `guidance/foundations/colors` stub → follow to latest file
3. Retrieve `assets/tokens/colors` stub → follow to latest file
4. If dark mode or theming is mentioned in guidance, retrieve theme asset files as well

**Reasoning strategy:**
- Lead with the conceptual model (how the system thinks about color: roles, tiers, semantic vs. primitive tokens)
- Follow with the structural overview (how many tiers, naming convention, key role names)
- Ground specifics in the asset file values — do not invent or estimate token values
- Note any notable characteristics (e.g. Carbon's use of themes vs. Material's dynamic color model)

**Output notes:** Always note the retrieval date of the files used. If the user is evaluating this system for adoption, note the system's `_index.md` "when to reference" guidance.

---

### 1.2 — Generate a Color Token Set for a New Design System

**Trigger:** "Create a color token structure for my design system", "Generate a color palette with tokens", "Help me define my color system"

**Content types needed:** `guidance` (for principles), `asset` (for structural templates)

**Retrieval sequence:**
1. Read `_meta/INDEX.md` → identify 2–3 systems with complete color asset files
2. Retrieve `guidance/foundations/colors` (latest) for 2–3 reference systems
3. Retrieve `assets/tokens/colors` (latest) for the same systems
4. If the user has specified a design direction (enterprise, consumer, etc.), select reference systems accordingly using `_index.md` "when to reference" notes

**Reasoning strategy:**
- Survey the structural approaches across reference systems: how many tiers (primitive → semantic → component)? What naming conventions? What roles are defined?
- Identify consensus patterns (most systems separate primitive palette from semantic roles; most define interactive, destructive, and neutral as role categories)
- Propose a token structure that reflects consensus patterns; note where the user might deviate based on their specific context
- Generate a draft token schema as structured JSON or markdown table — do not present it as final; frame as a starting point for review

**Output notes:** Make explicit which reference systems influenced which decisions. The user should be able to trace every structural choice to a rationale.

---

## Category 2: Typography Tasks

### 2.1 — Analyze a Design System's Typography Scale

**Trigger:** "How does [system] handle type?", "What's [system]'s type scale?", "Explain the typography system in [system]"

**Content types needed:** `guidance` (primary), `asset` (supplementary)

**Retrieval sequence:**
1. Retrieve `guidance/foundations/typography` stub → follow to latest
2. Retrieve `assets/tokens/typography` if available
3. If the system uses fluid/responsive type, check for any patterns documentation referencing layout and type together

**Reasoning strategy:**
- Lead with the type scale model (fixed scale? modular scale? fluid/clamp?)
- Cover typeface choices and the rationale given (if documented)
- Describe usage roles (display, heading, body, caption, code) and the values assigned to each
- Note any responsive behavior

---

### 2.2 — Generate a Typography Scale for a New Design System

**Trigger:** "Create a type scale", "Define typography tokens", "Help me set up typography for my design system"

**Content types needed:** `guidance`, `asset`

**Retrieval sequence:**
1. Retrieve typography guidance and asset files for 2–3 reference systems (prefer systems whose audience matches the user's context)
2. If the user has specified a typeface, note whether it appears in any reference system for context

**Reasoning strategy:**
- Compare scale structures: how many steps? What ratio? What base size?
- Identify consensus on role naming (most systems define some version of: display, headline, title, body, label, caption)
- Propose a scale and token schema, citing the reference structures it draws from
- Flag decisions that are context-dependent (e.g. a data-dense enterprise app may need more granularity at small sizes than a marketing site)

---

## Category 3: Component Tasks

### 3.1 — Research How Multiple Systems Handle a Component

**Trigger:** "How do different design systems implement [component]?", "Compare [component] across systems", "What are the standard patterns for [component]?"

**Content types needed:** `guidance` (primary), `implementation` (supplementary)

**Retrieval sequence:**
1. Check `_meta/INDEX.md` "By Category → Components" to identify which systems have documentation for this component
2. For each available system, retrieve `guidance/components/[component]` stub → follow to latest
3. If implementation details are requested, also retrieve `implementation/components/[component]` for relevant systems

**Reasoning strategy:**
- Identify consensus patterns: what variants do most systems define? What are the universal accessibility requirements? What usage rules are shared?
- Surface meaningful differences: where do systems diverge in naming, variants, or guidance?
- Note outliers with a brief rationale for why one system might take a different approach
- Do not flatten differences — they are often meaningful and worth surfacing

**Output notes:** Distinguish clearly between guidance-level observations ("most systems recommend...") and implementation-level specifics ("Carbon names this prop `kind`; Material uses `variant`").

---

### 3.2 — Specify a Component for a New Design System

**Trigger:** "Define a [component] for my design system", "Write a component spec for [component]", "What should I include in my [component] documentation?"

**Content types needed:** `guidance` (primary), `implementation` (secondary)

**Retrieval sequence:**
1. As in 3.1 — retrieve guidance for the component across 2–3 systems
2. Additionally retrieve implementation docs to understand how component APIs are typically structured
3. If the user has a stated design direction, weight the selection of reference systems accordingly

**Reasoning strategy:**
- Synthesize a component specification covering: purpose, variants, states, anatomy, usage guidance, accessibility requirements, and open questions
- Ground each section in what reference systems document; note consensus vs. system-specific choices
- Frame the output as a draft spec, not a final document — the user will need to adapt it to their context

---

## Category 4: Token and Theming Tasks

### 4.1 — Understand a System's Token Architecture

**Trigger:** "How are [system]'s tokens structured?", "Explain the token model in [system]", "What's the difference between primitive and semantic tokens in [system]?"

**Content types needed:** `implementation` (primary), `asset` (primary), `guidance` (supplementary)

**Retrieval sequence:**
1. Retrieve `implementation/tokens/token-schema` stub → follow to latest
2. Retrieve `assets/tokens/colors` and `assets/tokens/spacing` to ground the explanation in actual examples
3. Retrieve `guidance/foundations/colors` if the conceptual rationale is needed

---

### 4.2 — Generate a Multi-Tier Token Architecture

**Trigger:** "Design a token system", "Help me structure my design tokens", "Create a primitive/semantic/component token hierarchy"

**Content types needed:** `asset` (primary), `implementation` (secondary), `guidance` (secondary)

**Retrieval sequence:**
1. Retrieve token asset files and token schema documentation for 2–3 systems that exemplify different token models
2. Good choices for this task: Material (sophisticated multi-tier model), Carbon (well-documented SCSS token system), Primer (clean semantic model)

**Reasoning strategy:**
- Explain the multi-tier model using reference systems as examples
- Propose a structural template: primitive layer (raw values) → semantic layer (role assignments) → component layer (component-scoped aliases)
- Generate an example schema in JSON or SCSS as appropriate
- Make theming strategy explicit: how do tokens support light/dark or brand themes?

---

## Category 5: Research and Planning Tasks

### 5.1 — Evaluate Design Systems for Adoption

**Trigger:** "Which design system should I use?", "Compare [system A] and [system B] for my use case", "What are the strengths and weaknesses of [system]?"

**Content types needed:** `_index.md` files (primary), `guidance` (secondary)

**Retrieval sequence:**
1. Read `_meta/INDEX.md` to understand available systems
2. Read `_index.md` for each system under consideration — specifically the overview and "when to reference" sections
3. Retrieve 1–2 guidance files per system to get a feel for documentation quality and depth

**Reasoning strategy:**
- Frame the evaluation around the user's stated use case, not abstract quality metrics
- Use `_index.md` "when to reference" notes as the starting point for fit assessment
- Note documentation completeness and maintenance status
- Avoid declaring a single "winner" unless the user's constraints strongly point to one — present trade-offs instead

---

### 5.2 — Audit a Design System for Gaps or Opportunities

**Trigger:** "What's missing from this design system?", "How does [system] compare to best practices?", "Where could [system] be improved?"

**Content types needed:** `guidance` (primary), `asset` (secondary)

**Retrieval sequence:**
1. Read the target system's `_index.md` Content Inventory to understand what is and isn't documented
2. Retrieve guidance files for the areas being audited
3. Retrieve equivalent guidance from 1–2 comparison systems for benchmarking

**Reasoning strategy:**
- Distinguish between gaps in *the knowledge base* (content not yet captured) vs. gaps in *the upstream design system* (things the system genuinely doesn't address)
- Be specific: name the missing topic, the systems that do address it, and why it matters

---

## Category 6: DESIGN.md Tasks

### 6.1 — Generate a DESIGN.md for a New Design System

**Trigger:** "Create a DESIGN.md for my design system", "Generate a DESIGN.md with these brand values", "I need a DESIGN.md for a [descriptor] product"

**Tier:** 1

**Content types needed:** `exemplar` (primary), `guidance` (secondary), `asset` (secondary)

**Retrieval sequence:**
1. Retrieve `_meta/exemplars/design-md-files/` stub → follow to the latest well-formed exemplar
2. Based on the user's described product type and aesthetic direction, select 1–2 reference systems whose design philosophy is the closest match (use `_index.md` "when to reference" notes)
3. Retrieve `guidance/foundations/colors` and `guidance/foundations/typography` for the selected reference systems — for structural and rationale patterns, not values
4. Retrieve `assets/tokens/colors` for one reference system — as a structural template for the YAML front matter

**Reasoning strategy:**
- The exemplar defines quality and format; use it as the output template
- Reference system guidance informs the prose rationale sections — what kinds of things to say about color roles, type hierarchy, spacing intent
- Reference system assets inform token structure — how many tiers, what role names, how to handle neutrals and semantic aliases
- The user's stated inputs (brand accent color, aesthetic direction, product type) drive the actual values and prose tone
- Generate the full DESIGN.md in one pass: YAML front matter first (tokens), then each prose section in order per the spec

**Output notes:** Remind the user this file is ready to drop into a project root and reference from their CLAUDE.md, AGENTS.md, or equivalent. Suggest running `npx @google/design.md lint` to validate token references and contrast ratios.

---

### 6.2 — Generate a DESIGN.md for a Known Open-Source Design System

**Trigger:** "Create a DESIGN.md for Carbon / Material / Atlassian / [known system]", "I want to use Carbon's design language in my AI coding agent"

**Tier:** 1

**Content types needed:** `design-md` (primary — if already exists), `guidance` + `asset` (if generating fresh)

**Retrieval sequence:**
1. Check the target system's `design-md/DESIGN.md` stub — if it exists and is `latest`, retrieve it and present it directly (no generation needed)
2. If it does not exist or is `legacy`, retrieve the system's `guidance/foundations/` files and `assets/tokens/` files and generate following play 6.1's strategy
3. Always apply the `unofficial: true` disclaimer — these are community-generated representations, not files published by the system maintainers

**Output notes:** If presenting an existing DESIGN.md from the knowledge base, note the retrieval date and recommend verifying against the current upstream source if the token values are being used for production work.

---

### 6.3 — Adapt or Extend an Existing DESIGN.md

**Trigger:** "Take this DESIGN.md and add dark mode tokens", "Modify this DESIGN.md to use my brand color instead of the default", "Extend this DESIGN.md with component-level tokens"

**Tier:** 2

**Content types needed:** User-provided DESIGN.md (primary), `guidance` (secondary), `exemplar` (secondary)

**Retrieval sequence:**
1. Receive the user's DESIGN.md as input — parse its existing token structure and prose sections
2. Identify the gap or modification being requested
3. For dark mode: retrieve color guidance for 1–2 reference systems that document dark mode token strategies
4. For component tokens: retrieve implementation/tokens for a reference system with strong component token documentation (Material or Carbon)
5. Retrieve the exemplar if the modification type is covered

**Reasoning strategy:**
- Treat the user's existing file as the base; make surgical additions rather than regenerating
- Clearly mark any new tokens you add with comments indicating they were added in this session
- Validate that new token references are internally consistent (no broken references)

---

## Category 7: Token and Code Migration Tasks

### 7.1 — Migrate a Tailwind Color Config to a Semantic Token System

**Trigger:** "Replace my Tailwind colors with semantic tokens", "Refactor my color config to use design tokens", "Help me theme my app properly"

**Tier:** 2

**Content types needed:** User-provided code (primary), `asset` (secondary), `exemplar` (secondary)

**Retrieval sequence:**
1. Receive the user's Tailwind config or CSS as input — identify all color values currently defined
2. Retrieve `_meta/exemplars/token-migrations/tailwind-to-semantic` stub → follow to latest exemplar
3. Retrieve `assets/tokens/colors` for 1–2 reference systems (Primer and Material are strong choices for this task — both have clean semantic layering)
4. Retrieve `implementation/tokens/token-schema` for the same systems to understand how they name and structure semantic aliases

**Reasoning strategy:**
- Analysis step first: categorize the user's existing colors into primitives (raw values) and identify any implicit semantic roles already present (e.g. a `brand-primary` already exists vs. everything is a raw hex)
- Map the user's colors to a proposed semantic layer using reference systems' role naming as a guide
- Generate a two-layer output: a primitive token file (all raw values) and a semantic token file (role aliases pointing to primitives)
- Frame the output as CSS custom properties or a JSON token file based on the user's apparent stack
- Show a before/after diff of how one representative component would change

**Output notes:** Emphasize that this is a structural refactor proposal — the user should review role assignments (especially anything labeled `interactive`, `destructive`, or `disabled`) before committing. Flag any colors in the input that don't fit cleanly into standard semantic roles.

---

### 7.2 — Audit an Existing Token System for Gaps or Anti-Patterns

**Trigger:** "Review my token system", "What's wrong with this token structure?", "Is this a good token architecture?"

**Tier:** 2

**Content types needed:** User-provided tokens (primary), `asset` + `implementation/tokens` (secondary), `exemplar` (secondary)

**Retrieval sequence:**
1. Receive the user's token file(s) as input
2. Retrieve `implementation/tokens/token-schema` for 2 reference systems (Carbon and Material cover contrasting approaches well)
3. Retrieve `_meta/exemplars/semantic-token-systems/` stub → follow to latest exemplar for comparison

**Reasoning strategy:**
- Evaluate on four dimensions: *completeness* (are standard role categories present?), *layering* (are primitives and semantics properly separated?), *naming consistency* (are naming conventions followed throughout?), *extensibility* (can themes or modes be added without restructuring?)
- Be specific: name the exact tokens or patterns that are problematic and explain why
- Offer a prioritized list of improvements rather than a complete rewrite recommendation unless the structure is fundamentally broken

---

## Category 8: Full System Design Tasks

### 8.1 — Design a Complete Token Architecture from a Brief

**Trigger:** "Design a token system for my product", "Help me build a design system from scratch", "I'm starting a new design system — where do I begin with tokens?"

**Tier:** 3

**Content types needed:** `guidance` (foundations, across 2–3 systems), `asset` (across 2–3 systems), `exemplar`

**Retrieval sequence:**
1. Read the user's brief carefully — note product type, audience, aesthetic direction, tech stack, and any stated constraints
2. Select 2–3 reference systems based on fit (use `_index.md` "when to reference" notes)
3. Retrieve `guidance/foundations/` (colors, typography, spacing) for all selected systems
4. Retrieve `assets/tokens/` (colors, spacing, typography) for all selected systems
5. Retrieve `_meta/exemplars/semantic-token-systems/` stub → follow to latest exemplar

**Reasoning strategy:**
- This is a multi-step workflow. Structure the output in phases: (1) token layer architecture decision, (2) color system, (3) typography scale, (4) spacing scale, (5) semantic role definitions, (6) component-level token strategy
- At each phase, cite the reference system patterns you're drawing from and explain deviations
- Generate a complete proposed token schema in JSON or CSS custom properties
- Close with a `DESIGN.md` stub that references the generated token set — this becomes the agent-readable version of the system

**Output notes:** This play is best run as a multi-turn conversation rather than a single prompt. The first response should confirm the architecture decisions before generating values. If the user is on the playbook website, this play is presented as a guided workflow with checkpoints, not a single copyable prompt.

As the number of playbooks grows, this file may become long enough to impose an unnecessary token cost when only a single task category is needed. If this file exceeds roughly 10 task categories, consider splitting it into per-category files (e.g. `PLAYBOOKS_COLOR.md`, `PLAYBOOKS_COMPONENTS.md`) with a thin routing stub at the top of this file that lists categories and their file locations. The routing stub would be the only file loaded at session start; specific playbook files would be retrieved on demand. Until that threshold is reached, a single file is preferable for simplicity.

---

## Adding New Playbooks

When a new task type is encountered that warrants a playbook:

1. Complete the task first using best judgment and `USAGE_GUIDE.md` principles
2. Note the task type, the retrieval strategy used, and what worked well
3. Draft a new playbook entry following the structure above
4. Add it to the appropriate category, or create a new category if needed
5. Flag it in the maintenance session log in `MAINTENANCE.md`
