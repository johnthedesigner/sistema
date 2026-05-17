---
system: carbon
category: content
topic: writing-style
content_type: guidance
status: latest
retrieved: 2026-05-16
source_url: https://carbondesignsystem.com/guidelines/content/writing-style/
tags: [writing-style, capitalization, grammar, pronouns, inclusive-language, content-design]
---

# Carbon Design System — Writing Style

## Capitalization

### Sentence case everywhere

Use sentence-case capitalization for all UI text elements — predominantly lowercase. Capitalize only the first word and proper nouns.

Examples: form labels as "First name" and "Email address."

Carbon's rationale: "Sentence-style capitalization makes it easy for readers to distinguish between common nouns and proper nouns, and is generally considered the quickest form to read."

**Do not capitalize:**
- Names of UI features or components unless they are sold separately or trademarked
- Words to convey "specialness" or importance — this is subjective and creates inconsistencies
- Anything not in the approved capital-use list

**Do capitalize:**
- "Carbon" and "Carbon Design System"
- IBM and all company/organization names
- Official, trademarked products and services
- Initialisms (IBM, BBC, HTML) and acronyms (NASA, GIF)
- People's names, country/place names
- UI labels when referenced in body copy (match the label's capitalization)
- First word of a sentence or phrase

### Title case: never for UI

Title case (first letter of most words capitalized) is not used for UI copy. Carbon gives two reasons:
1. It requires complex grammatical judgment calls about which words to capitalize
2. It slows reading because readers cannot distinguish proper nouns from common nouns

### All caps: never

All-caps is slower to read because individual letter shapes are less distinguishable. It also makes proper noun distinction harder.

---

## Simple writing

- Use the simplest term appropriate for the audience: "large" not "voluminous," "small" not "diminutive"
- Keep sentences as short and simple as possible
- Omit wordy or redundant phrases
- Respect the user's time: trim to as few words as possible, but don't be terse
- Avoid "please" and "thank you" in UI — these terms are culturally inconsistent and can feel inappropriate
- Create a product-specific terminology list: preferred terms and terms not to use

### Present tense

Use simple present tense. Avoid verb tenses with "have," "has," "had," "been," "should," "would," and "will" unless necessary.

---

## Conversational style

Frame content as a conversation between the product and the user. The conversational level depends on where the user is in their journey.

**Contractions:** Use when they fit context and improve flow. "Don't" not "do not."

**Sentence openers:** Beginning with "and," "but," or "so" is acceptable when it allows shorter, more scannable sentences. Don't overuse.

**Exclamation marks:** Use only for positive messages. Never for negative messages or errors. Maximum one per context (per window or per page). Example of correct use: "Your IBM Cloud account is ready!" Example of incorrect use: "You have reached your usage limit!!"

**Terms of politeness ("please," "thank you"):** Use only when the user is being genuinely inconvenienced. Do not use superfluously.

| Correct use | Incorrect use |
|---|---|
| "Indexing might take a few minutes. Please wait." | "Please create a subscription account to get full access." |

### Can / may / might

- Use "can" to express ability ("You can use the command line interface")
- Use "may" to express permission or uncertainty — avoid when "can" is meant
- When "may" and "might" both work, use "might" to avoid confusion with "may" (permission)

---

## Inclusive language

IBM is committed to eliminating language that supports racial, cultural, or gender bias. All words in product offerings must be inclusive.

Carbon refers writers to the IBM Terminology database for guidance on specific terms and the IBM Inclusive IT Terminology resource for broader context.

---

## Pronouns

Use second person ("you," "your") as often as possible — it is friendlier and more engaging.

Use first person ("my," "my account") only for headings or labels that are specific to the user's personal data. In explanatory text for those labels, switch to second person.

Use first person plural ("we," "our") when referring to IBM, particularly in requests for user data — e.g., "Why do we need your email address?"

Avoid gender-specific third-person pronouns; use "they/them/their" for unknown or irrelevant gender.

---

## Active and passive voice

**Default to active voice.** The subject clearly acts on the verb.

| Active | Passive |
|---|---|
| "Next, the admin configures access privileges." | "Next, access privileges are configured by the admin." |

**Passive voice is acceptable** when the true subject is a system and the human is secondary, or when the passive is genuinely more natural.

| Acceptable passive | Why |
|---|---|
| "The database needs to be rebooted." | The actor (the system) is the natural subject, not a person |
