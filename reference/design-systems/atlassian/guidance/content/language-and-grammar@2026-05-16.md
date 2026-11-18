---
system: atlassian
category: content
topic: language-and-grammar
content_type: guidance
status: latest
retrieved: 2026-05-16
source_url: https://atlassian.design/foundations/content/language-and-grammar
tags: [grammar, capitalization, punctuation, inclusive-language, localization, content-design]
---

# Atlassian Design — Language and Grammar

## Capitalization

**Sentence case for all UI:** Titles, headings, menu items, labels, buttons — all sentence case.

"Create work item" not "Create Work Item."

**Capitalize:**
- Proper nouns: people, companies, apps ("Jira," "Confluence")

**Lowercase:**
- Generic features or actions not tied to a proper name

**Headings:** No bold, no italics, no periods. Minimize question marks. Use action verbs; avoid gerunds (-ing forms).

---

## Articles in UI labels

Omit "a," "an," and "the" in buttons, labels, and action-based headings.

"Create password" not "Create a password."

---

## Abbreviations

- Use full app and feature names in customer-facing copy
- Do not use 'e.g.', 'i.e.', 'etc.', or '&' — these do not localize well
- No apostrophes in plural abbreviations: "1990s" not "1990's"

---

## Bold and italic

**Bold:** Use sparingly to emphasize key phrases or reference static UI elements (menus, buttons, headings). Avoid over-bolding.

**Italic:** Use sparingly (difficult to read). For variable field names, user input, or emphasis when bold is unavailable. Never italicize hyperlinks.

---

## Contractions

Use contractions for conversational tone. "We can't load this page" is preferred over "We cannot load this page." Use curly apostrophes in UI copy.

---

## Gender pronouns

Use provided pronouns when known. Default to "they/their" for unknown or unspecified gender. Avoid gendered pronouns in generic instructions.

"Ask your admin to add you" — not "Ask him to add you."

---

## Lists

- Limit to 6 items where possible
- **Bulleted (fragmented sentences):** Lowercase items, no periods, introduce with a colon
- **Bulleted (complete sentences):** Capitalized first word, periods at end, no lead-in colon
- **Numbered lists:** Capitalized first word, period at end; use for sequential tasks only
- Use parallel phrasing within any list

---

## Numbers

- Use digits in most cases
- **Spell out:** Numbers that start a sentence, in common expressions, and zero/one (to avoid L/I/O confusion)
- **Ranges:** Use "to" not hyphens — "View rows 1 to 4" not "View rows 1-4"
- **Ratios:** Use "of" not "/" — "Step 1 of 2" not "Step 1/2"
- **Thousands:** Use commas — "4,500" not "4500"

---

## Spelling

US English per Merriam-Webster. "Color" not "colour," "organization" not "organisation."

---

## Tense

**Present tense** for UI instructions and messages: "We can't load work item DSP-32113."

**Past tense** for completed actions: "Upload failed," "File created."

---

## Pronouns in UI copy

Minimize overall pronoun use. When using pronouns:
- Second person ("you/your") for advising users or indicating ownership
- "Get access to your work items here" — not "the work items"
- Use "your projects" not "my projects" (never use "my" as a UI label for user-owned content)

---

## Active voice

Default to active voice. "Administrators control access" not "Access is controlled by administrators."

---

## Punctuation

### Apostrophes

Show possession normally: "James's work items" for singular proper nouns ending in 's'. Plurals: after 's'. Use curly apostrophes.

### Colons

Introduce bulleted lists or step sequences. Do not use at the end of headings.

### Commas (Oxford comma)

Use the Oxford comma for all lists of three or more: "Jira, Confluence, Loom, and Bitbucket."

### Dashes and hyphens

**Em dashes:** Use sparingly in UI; prefer rewriting the sentence. Use non-breaking spaces around em dashes.

**Hyphens:** For compound adjectives before nouns ("system-wide update"). Do not hyphenate after "very" or -ly adverbs. Use to prevent misreading: "re-sign" vs. "resign."

**Ranges:** Use "to" not hyphens or dashes.

### Ellipses

Use the proper ellipsis character (…) without spaces before it: "Work in pro…"

For quotations with omitted material: spaces around the ellipsis — "From medicine … our products help."

### Exclamation marks

Avoid in UI copy. Maximum one per page. Avoid in marketing copy as well.

### Periods

Use in complete sentences, helper text, messages, and notifications.

Omit from: headers, titles, tooltips, field descriptions, menu names.

One space after a period. If a link ends the sentence, place the period outside the hyperlink.

### Quotation marks

In UI: single curly quotes.
In body/long-form copy: double quotes for direct speech, single for word definitions.
Do not use quotation marks for emphasis — use bold instead.

---

## UI element references in copy

- Use sentence case in copy even if the UI itself uses title case
- Bold element names when referenced in instructions
- Use "then" instead of ">" for navigation sequences: "Go to **More**, then **Link work item**"

---

## Localization considerations

Atlassian's language rules are specifically designed to support localization:
- Omit articles (a/an/the) in UI labels
- Avoid idioms and colloquialisms
- Avoid abbreviations that do not translate
- Use "to" for ranges (word order-safe across languages)
- Use Oxford comma (reduces ambiguity in translation)
