---
category: principles
topic: content
content_type: synthesis
status: latest
retrieved: 2026-05-17
supersedes: writing-mechanics@2026-05-16.md
tags: [content-design, grammar, punctuation, capitalization, mechanics, synthesis]
sources:
  - kb/reference/design-systems/polaris/guidance/content/grammar-and-mechanics
  - kb/reference/design-systems/mailchimp/guidance/content/grammar-and-mechanics
  - kb/reference/design-systems/carbon/guidance/content/writing-style
  - kb/reference/design-systems/atlassian/guidance/content/language-and-grammar
  - kb/reference/design-systems/mailchimp/guidance/content/writing-for-accessibility
---

# Writing Mechanics — Synthesis

## How to use this document

Writing mechanics are the decisions that create surface-level consistency across a product: capitalization, punctuation, number format, and grammar conventions. These rules are cross-system defaults synthesized from MailChimp, Shopify Polaris, Carbon (IBM), and Atlassian. Apply them unless a product-specific style guide overrides them for documented reasons.

---

## 1 — Capitalization

### Sentence case everywhere in UI

All four sources agree: **sentence case is the default for all UI copy.** Only the first word and proper nouns are capitalized.

| Do | Don't |
|---|---|
| Add new product | Add New Product |
| Billing settings | Billing Settings |
| Export as CSV | Export As CSV |

This is not just an aesthetic preference. Carbon explains the rationale clearly: "Sentence-style capitalization makes it easy for readers to distinguish between common nouns and proper nouns." Title case makes that distinction harder because readers cannot tell which words are capitalized for meaning versus convention.

**Applies to:** buttons, labels, headings, navigation items, dialog titles, tab labels, tooltips, body text.

**Proper nouns and product names always capitalize:** "Connect to Google Analytics." "Jira," "Confluence," "IBM Watson Studio."

### Do not capitalize for emphasis or "specialness"

Carbon: "Carbon does not support a concept of 'important words' or 'specialness'. Determining whether something is important or special is highly subjective." If you want to emphasize a word, use italic or bold — not capitalization.

### All-caps: never

Carbon: "All caps has been shown to be slower to read as individual letter shapes are less distinguishable." Exception: established abbreviations (CSV, API, HTML, OK, GIF).

---

## 2 — Punctuation

### Periods

**Single-sentence UI labels: no period.** Buttons, form labels, navigation items, headings, dialog titles — one sentence, no period.

**Multi-sentence content: use periods.** Helper text, error body copy, descriptions — anything with two or more sentences uses normal punctuation.

This rule is stated explicitly by Polaris and Atlassian and implied by MailChimp and Carbon.

| No period | Use periods |
|---|---|
| Button: "Save changes" | Error body: "Payment failed. Update your card details." |
| Heading: "Order details" | Helper text: "This applies to all users. Changes take effect immediately." |

### Oxford (serial) comma

All four sources use the Oxford comma. Use it: "red, white, and blue" not "red, white and blue." MailChimp: "parents, Oprah, and Justin Timberlake." Atlassian: "Jira, Confluence, Loom, and Bitbucket."

The Oxford comma reduces ambiguity in lists and is the safest default for localization.

### Exclamation marks

**Use sparingly. Never in errors, warnings, or failure states.** This rule is universal across all four sources.

MailChimp: "They're like high-fives: well-timed ones are great, too many annoying." Carbon: "Use only for positive messages. Maximum one per context." Atlassian: "Avoid in UI copy. Maximum one per page."

Valid contexts: a genuinely exciting first milestone, a major user achievement. Not valid: routine confirmations, loading states, routine success messages.

### Contractions

Use them. All four sources explicitly recommend contractions for a natural, human tone. "Don't" not "do not." "It's" not "it is." "You're" not "you are."

MailChimp: "They give your writing an informal, friendly tone." Polaris: standard throughout. Atlassian: "Use contractions for conversational tone." Carbon: "Don't be afraid to use contractions when they fit the context."

Exception: legal text, formal documentation where conventions differ.

### Ampersands

Do not substitute "&" for "and" in UI copy. Atlassian: do not use "&" — it does not localize well. MailChimp: don't use unless it's part of a company name ("Ben & Jerry's").

### Hyphens and dashes

**Hyphen (-):** Compound modifiers before nouns ("high-risk order," "system-wide update"). No spaces. For prefixes where two vowels meet.

**Em dash (—):** Offsets asides. No spaces on either side in most systems (Atlassian recommends non-breaking spaces). Use sparingly — prefer rewriting the sentence in UI contexts.

Do not use "--" as an em dash substitute.

---

## 3 — Numbers

All four sources default to numerals over spelled-out numbers in UI copy.

- Numerals in all UI contexts: "3 items" not "three items"
- Commas for 4+ digits: 12,000; 1,500,000
- Ranges: use "to" not hyphens (Atlassian) or en dash without spaces (Polaris) — pick one and be consistent within a product
- Percentage: use the % symbol, not "percent"
- Time: numerals + am/pm with a space ("7 am," "7:30 pm")

---

## 4 — Grammar conventions

### Active voice

All four sources prefer active voice.

"Administrators control access" not "Access is controlled by administrators."

Carbon: passive is acceptable when the subject is a system and the human is secondary. When in doubt, use active.

### Address users as "you"

All four sources specify second person. "Your account," "Your orders," "You have 3 items."

Atlassian explicitly prohibits "my projects" in UI labels — use "your projects." The "my" convention sounds natural in isolation but creates ambiguity at scale ("whose 'my'?").

Never use "the user" or third-person framing in UI copy.

### Reading level

Target approximately 7th-grade reading level (Polaris explicitly). Carbon: "Use the simplest term that is appropriate for your audience." MailChimp: "Write at the level of your reader."

### Avoid jargon

Define technical terms on first use. Avoid internal team terminology in user-facing copy. MailChimp: write in plain English. Carbon: "Use everyday language, not jargon."

### Avoid: "simply," "easily," "just," "obviously"

These words invalidate users who find the task difficult. They add no information and can feel condescending or dismissive. None of the four sources use them in UI copy examples.

---

## 5 — Inclusive language and accessibility

### Directional language

Do not use instructions that assume screen layout: "the button on the left," "see above," "click the icon in the right sidebar." MailChimp: use directional language that is layout-agnostic — list the items, don't locate them spatially.

### Link text

Describe the destination or action. Never "click here" or "learn more" alone. MailChimp: link text must describe its destination for screen reader users who navigate by link text.

| Do | Don't |
|---|---|
| "Read the accessibility guide" | "Click here" |
| "View your orders" | "Learn more" |

### Alt text

**Functional images:** describe the content so a non-visual user gets equivalent information.

**Decorative images:** empty alt text (`alt=""`).

**Charts and graphs:** alt text should summarize the data, not describe the visual.

### Gender-neutral language

Use "they/them/their" for unknown or unspecified gender (MailChimp, Atlassian, Carbon all specify this). Avoid "he or she" constructions.

---

## 6 — The lean content rule

Every word must justify its place. Before publishing any UI copy:

1. Can this say the same thing in fewer words?
2. Is every word here necessary for the user to understand what to do?

**Common cuts:**
- "Please" before imperative verbs in UI labels
- "In order to" → "To"
- "At this time" → remove entirely
- "We wanted to let you know that…" → start with the information
- "You can" before action descriptions → just state the action

Carbon: "Omit wordy or redundant phrases." Polaris: "Skip the punctuation except for questions or text with 2+ sentences." Atlassian: "Tell people only what they need to know in the moment and nothing more."

Lean copy is not cold copy. Warmth and directness come from the right word at the right moment — not from filler.
