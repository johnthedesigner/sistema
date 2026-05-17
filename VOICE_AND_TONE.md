# Sistema — Voice and Tone Guide

**Generated:** 2026-05-16
**Inputs:** `kb/principles/content/voice-and-tone`, `kb/principles/content/ui-copy-patterns`, `kb/principles/content/writing-mechanics`, `LIVING_BRIEF.md`

---

## 1 — Voice

Sistema's voice starts from the cross-system content baseline — plainspoken, genuine, helpful, direct — and extends it with traits specific to a tool for practitioners who are building, auditing, and maintaining design systems.

The audience already knows what a design system is. They are not looking for a tutorial. They are looking for a knowledgeable collaborator who can tell them what to do next and why it matters. Sistema's voice earns credibility by being specific, not by being authoritative.

### Voice traits

**Practitioner-grade**
Assumes the reader knows the domain. Skips definitions of fundamentals (design tokens, component libraries, semantic naming). Goes straight to what is specific about this decision, this system, or this play. Talks to designers and developers the way a senior colleague does — not the way a textbook does.

> "Carbon uses a two-tier token architecture: a primitive palette in `@carbon/colors` maps into semantic role tokens in `@carbon/themes`. There is no component-level token tier."
> Not: "A two-tier token architecture is a design pattern in which…"

**Specific**
Names concrete things. Cites real values, real token names, real decisions. "This is a first-order reflex" is more useful than "this might be considered a common default." When the system makes a recommendation, it says what and why — not just that something is good practice.

> "Primary color medium-blue (hue 220–240°) is the first-order AI reflex. If you're using it, have a reason."
> Not: "Consider whether your primary color choice is intentional."

**Editorially confident**
Has opinions. Not aggressive — just willing to say "this is the right call" when it is. The Fraunces body type and the brand color choices signal a product with a point of view. The copy should match.

> "Don't use opacity-derived colors for containers. Use a specific token value."
> Not: "You may want to consider using specific token values rather than opacity-derived colors for container backgrounds."

**Direct without being terse**
Short sentences. Active verbs. No preamble. But not so compressed that the reasoning disappears. Give the answer and the one-sentence reason. Leave out everything else.

---

## 2 — Tone adjustments

Tone shifts by context. The voice stays the same.

| Context | Tone | What changes |
|---|---|---|
| Playbook step / instructional | Command-form. Numbered. Action-first. | "Run the positioning brief." "Generate tokens from the commitment level." Short sentences, no hedging. |
| KB reference content | Reference register. Dense and precise. | No hand-holding, no "you should." Just what the system says, what it does, and how it's structured. |
| Error state | Specific. Not apologetic. | Name what failed, name where to look, name what to do. Never "Oops" or "Something went wrong." |
| Empty state | Purposeful prompt. | States what's missing and why it matters, then what action solves it. Not a placeholder. |
| Onboarding / first-run | Slightly warmer, still direct. | More context, fewer assumptions. Does not over-explain things a practitioner already knows. |
| Success / confirmation | Understated. | Confirms the action completed. Not celebratory. A "Source added." beats "Great job! Your source was added successfully!" |

---

## 3 — Writing mechanics

### Capitalization
Sentence case everywhere — headings, labels, button text, nav items, error messages. Not title case.

> "Add source" not "Add Source"
> "Run play" not "Run Play"

**Exceptions:** Proper nouns (Carbon, Atlassian, OKLCH), code identifiers (token names, file paths), acronyms (KB, UI, WCAG).

### Punctuation
- **Periods:** In body prose, error messages, and helper text. Not in UI labels, button text, nav items, or standalone headings.
- **Oxford comma:** Always. "Color, typography, and spacing."
- **Exclamation marks:** Very rare. Reserve for genuine success moments (a campaign completed, a play generated for the first time). Never in errors or instructional copy. Never stacked.
- **Em dashes:** Use to set off a clause — no spaces on either side.
- **Ellipsis:** Only for genuine truncation. Not to suggest trailing off or imply hesitation.

### Contractions
Use them. "It's," "don't," "you're," "can't." Removes formality without removing credibility.

### Numbers
Digits for anything actionable or measurable: "3 sources," "12 tokens," "4px radius." Spell out when used narratively at the start of a sentence: "Three files were updated."

### Person and address
Always second person — "you," "your." Never "my" (as in "my tokens," "my playbooks"). The product belongs to the user. The UI does not.

### Voice
Active where possible. "Add a source" not "A source can be added." Passive voice is acceptable when the actor is genuinely unknown or irrelevant.

### Reading level
Write for smart practitioners, not for entry-level. Use domain vocabulary that any mid-career designer or developer would know. Don't explain it; use it.

---

## 4 — UI copy patterns

### Buttons
Verb + object. Command form. No articles when the context is clear.

> "Run play" / "Add source" / "View tokens" / "Generate brief"
> Not: "Click here to run the play" / "Add a new source" / "See your token values"

Destructive actions name the action explicitly: "Delete source" not "Delete" (too vague) or "Yes" (not a verb).

### Navigation labels
One or two words. Sentence case. Noun-first for sections, verb-first for actions.

> "Playbooks" / "Knowledge base" / "Sources" / "Campaigns"
> Actions: "New play" / "Add source"

### Errors
Structure: what failed + where to look or what caused it + what to do.

> "No KB files found in this category. Add at least one `.md` file to `kb/reference/[category]/` and reload."
> "Source could not be added. Check that the URL returns a 200 and try again."
> Not: "Oops! Something went wrong. Please try again later."

Always name the specific thing that failed. Never the generic container.

### Empty states
Three parts: what's missing + why it matters + what action fills it. In that order.

> "No plays yet. Plays turn KB content into step-by-step workflows. Add a play to get started."
> "No sources in this category. Sources are the raw material KB files are built from. Add a source to begin."

Empty states are not placeholder text. They communicate intent.

### Confirmations
The confirmation dialog button text mirrors the action taken. Match the verb the user chose.

> "Are you sure you want to delete this source?" → buttons: "Delete source" / "Cancel"
> Not: "Are you sure?" → buttons: "Yes" / "No"

Helper text in forms describes what goes in the field, not what the field is called.

> "The URL or file path this source was retrieved from"
> Not: "Enter your source URL here"

Placeholder text is an example, not a label. Never use placeholder text as a substitute for a label.

---

## 5 — Words to use / avoid

### Use

| Term | Notes |
|---|---|
| **play** | The unit of instructional content. Singular and plural: "this play," "three plays." Not "workflow," "recipe," "template," or "guide." |
| **KB** | Acceptable abbreviation in running text after first reference. Not "knowledge base" every time. |
| **brief** | The positioning or design brief artifact. Not "questionnaire," "form," or "survey." |
| **source** | External content that has been reviewed and indexed into the KB. |
| **principle** | A synthesized document in `kb/principles/`. |
| **token** | Sufficient in context; "design token" only when specifically distinguishing from other token types. |
| **commitment level** | The OKLCH chroma framework term. Not "saturation level" or "color intensity." |
| **first-order reflex** | The AI-slop anti-pattern framework term. Use as defined in Impeccable. |
| **scaffold** | For plays or operations that generate initial file or directory structure. |
| **campaign** | A goal-directed sequence of plays targeting a real-world outcome. |

### Avoid

| Term | Why |
|---|---|
| **leverage** | Use "use." |
| **utilize** | Use "use." |
| **robust** | Overused in design system marketing. Name the specific property that makes it robust. |
| **powerful** | Same problem. Specific beats superlative. |
| **seamlessly** | Adverb of unspecified smoothness. Cut it. |
| **best practices** | Too vague. Name the practice. |
| **world-class** | Not our register. |
| **comprehensive** | Let the content demonstrate it; don't announce it. |
| **cutting-edge** | Not our register. |
| **modern** | Meaningless without a referent. |
| **Playbook** (capitalized mid-sentence) | A section name in the nav. Not a proper noun in prose. |
| **just** (as softener) | "Just add a source" — minimizes the action. Cut it. |
| **simply** (as softener) | Same problem. Cut it. |
| **please** in errors | Implies the user owes something. Cut it. |

---

## 6 — The test

Read the copy aloud. Ask: does this sound like a senior designer or developer who has built and maintained design systems before, giving a direct and specific answer to a colleague?

If it sounds like:
- A tutorial for beginners → too soft, remove the hand-holding
- A marketing page → too promotional, remove the superlatives
- A legal disclaimer → too passive, use active voice and name the actor
- Generic SaaS ("powerful workflows," "seamless integration") → remove the category-obvious filler

If it passes: the reader knows exactly what to do next and why, without any word wasted.

---

## Decision log

| Decision | Rationale |
|---|---|
| Practitioner-grade voice, not tutorial | Audience are designers and developers who already know the domain. Explaining fundamentals is condescending and wastes space. |
| Editorially confident | The Fraunces body type and strong brand color choices signal a product with opinions. Copy that hedges contradicts the visual identity. |
| Contractions throughout | Removes formality without removing authority. Matches the direct-but-human tone of the brand. |
| No exclamation marks in instructional or error copy | They read as performative. Success states may use them sparingly. |
| "Play" not "workflow" or "template" | Domain vocabulary that's specific to this product. Distinguishes Sistema from generic no-code tools. |
| Active voice as default | Shorter, clearer, and matches the command-form instruction style of playbook content. |
