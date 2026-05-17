---
category: principles
topic: content
content_type: synthesis
status: legacy
superseded_by: writing-mechanics@2026-05-17.md
retrieved: 2026-05-16
tags: [content-design, grammar, punctuation, capitalization, mechanics, synthesis]
sources:
  - kb/reference/design-systems/polaris/guidance/content/grammar-and-mechanics
  - kb/reference/design-systems/mailchimp/guidance/content/grammar-and-mechanics
  - kb/reference/design-systems/mailchimp/guidance/content/writing-for-accessibility
---

# Writing Mechanics — Synthesis

## How to use this document

Writing mechanics are the decisions that create surface-level consistency across a product: capitalization, punctuation, number format, and grammar conventions. Small inconsistencies in these areas accumulate into a product that feels unpolished, even when the design is solid.

These rules are cross-system defaults. Apply them unless a product-specific style guide overrides them for documented reasons.

---

## 1 — Capitalization

### Sentence case everywhere in UI

Use sentence case for all UI text: only the first word and proper nouns are capitalized.

| Do | Don't |
|---|---|
| Add new product | Add New Product |
| Billing settings | Billing Settings |
| Export as CSV | Export As CSV |
| What's your store name? | What's Your Store Name? |

**Sentence case applies to:** buttons, labels, headings, navigation items, dialog titles, tab labels, tooltips, and body text.

**Exception — product names and proper nouns:** Always capitalize. "Connect to Google Analytics" not "Connect to google analytics."

### Title case: when it applies

Title case is not standard UI copy — it is for branded elements (product names, feature names that have been officially named), document titles in a document-heavy product, and app titles in nav/headers if the product's brand standards require it.

Do not use title case for generic UI actions, headings, or labels on the assumption that it looks more "formal" or "important." It produces inconsistency.

### All-caps

Never use all-caps for body copy or labels. It reads as shouting and reduces legibility for users with certain reading differences.

Exception: abbreviations that are conventionally all-caps (CSV, API, URL, HTML) and labeled status chips where all-caps is a deliberate design choice with semantic meaning.

---

## 2 — Punctuation

### Periods

**Single-sentence labels: no period.**  
Button labels, form labels, navigation items, error headings, dialog titles — if it is a single sentence, do not end it with a period.

**Multi-sentence content: use periods.**  
Helper text, error body copy, onboarding descriptions, and any content that is more than one sentence takes normal punctuation.

| Do | Don't |
|---|---|
| "Save changes" (button) | "Save changes." |
| "Your session expired. Sign in to continue." (error body) | "Your session expired" |
| "Add your first product to start selling." (description) | "Add your first product to start selling" |

### Commas

Use the Oxford (serial) comma: "red, white, and blue" not "red, white and blue."

The Oxford comma prevents ambiguous groupings in lists and is the production default in most major design system writing guides.

### Exclamation marks

Use sparingly — only when the moment genuinely calls for it and the enthusiasm is authentic. Onboarding success, a major milestone, first sale: these are legitimate contexts. Error recovery, helper text, navigation labels: never.

**The test:** Would a person actually say this with enthusiasm? "You made your first sale!" — yes. "Account saved!" — no.

One exclamation mark per flow, maximum. If every screen is exciting, none of them are.

### Question marks

Use question marks in dialog titles when the dialog asks a genuine question requiring a decision: "Remove this member?" is acceptable, though naming the action directly ("Remove member") is preferred.

Do not use rhetorical questions in headings or CTAs: "Want to get started?" should be "Get started."

### Apostrophes

Use contractions. "Don't" not "do not." "You're" not "you are." "It's" not "it is." Contractions sound human; avoiding them sounds corporate.

Exception: legal text, terms of service, and formal documentation where conventions differ.

---

## 3 — Numbers

- Use numerals (1, 2, 10) rather than spelled-out words in UI copy.
- In body copy (non-UI text), numbers under 10 are traditionally spelled out — but in a UI context where brevity matters, numerals are always acceptable.
- For quantities associated with units, always use numerals: 8px, 3 items, $12.99.

| Do | Don't |
|---|---|
| 3 errors found | Three errors found |
| 1 member added | One member added |
| Page 2 of 10 | Page two of ten |

---

## 4 — Voice and grammar conventions

### Active voice

Write in active voice. The subject acts; the object receives the action.

| Active | Passive |
|---|---|
| "Your file was deleted" → "We deleted your file" | — |
| "Your order has been placed" → "Your order is confirmed" | — |
| "The document was saved" → "Document saved" | — |

Even better: if the user took the action, frame it that way — "You deleted this file" or just "File deleted."

### Address users as "you"

Write in second person. "Your account," "Your orders," "You have 3 items." Do not use "the user" or third-person framing in UI copy.

Never use "me" or "my" in UI labels ("My account," "My settings"). This is the product speaking about itself, not addressing the user. It creates confusion at scale: is "My account" the user's account or the product's account?

### Reading level

Target approximately a 7th-grade reading level for all UI copy. This is not condescending — it is the level at which fluent adult readers process text most efficiently without cognitive overhead.

Use the Hemingway Editor or Flesch-Kincaid score as a quick check on longer onboarding or help text.

### Avoid: jargon and internal terms

Never use internal team terminology, code-level names, or product-internal naming conventions in UI copy. If developers call something an "entity model" internally, the user should never see those words.

Test copy against the question: "Would a new user understand this without onboarding?"

### Avoid: ableist and exclusionary language

- Do not use directional language that assumes screen vision ("see the error above," "click the icon on the left").
- Do not use "simply," "easily," "just," or "obviously" — these invalidate users who find the task difficult.
- Prefer "select" over "click" for pointer actions (touch devices exist).
- Write descriptive link text: "View your orders" not "click here" or "learn more."

---

## 5 — The lean content rule

Every word has to earn its place. Before publishing any UI copy, ask:

1. Can this say the same thing in fewer words?
2. Is every word here necessary for the user to understand what to do?
3. Am I adding words to sound thorough, or because the user needs them?

**Common cuts:**
- "Please" before imperative verbs in UI labels (adds no meaning)
- "In order to" → "To"
- "At this time" → remove entirely
- "We wanted to let you know that…" → start with the information
- "You can" before action descriptions → just state the action

Lean copy is not cold copy. Warmth comes from directness and tone, not from filler words.
