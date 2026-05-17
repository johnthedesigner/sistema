---
category: principles
topic: content
content_type: synthesis
status: legacy
superseded_by: ui-copy-patterns@2026-05-17.md
retrieved: 2026-05-16
tags: [content-design, ui-copy, buttons, errors, empty-states, forms, patterns, synthesis]
sources:
  - kb/reference/design-systems/polaris/guidance/content/actionable-language
  - kb/reference/design-systems/polaris/guidance/content/error-messages
  - kb/reference/design-systems/mailchimp/guidance/content/voice-and-tone
---

# UI Copy Patterns — Synthesis

## How to use this document

UI copy is situational. The rules for a button label are not the same as the rules for an error message, which are not the same as the rules for a placeholder. This document covers the highest-value patterns — the ones that cause the most inconsistency and the most user confusion when applied inconsistently.

Reference this document when writing or auditing copy for any specific UI context. Each section gives the principle, the structure, and concrete do/don't examples.

---

## 1 — Buttons and primary actions

### The rule: verb + noun

Button labels should be verb-first and as short as possible while remaining specific. "Verb + noun" is the default pattern. The verb tells the user what will happen; the noun scopes it to this specific context.

| Do | Don't |
|---|---|
| Save changes | OK |
| Delete product | Submit |
| Add team member | Click here |
| Export report | Proceed |
| Connect store | Yes |

**When to drop the noun:** If the context makes the object completely unambiguous — the button is inside a confirmation dialog that already names the object — the noun can be dropped. "Delete" is acceptable in a "Delete this product?" confirmation. "Delete" alone in a product list is not acceptable.

**When "OK" is acceptable:** Almost never. "OK" commits the user to something without telling them what. If a dialog is presenting information only (no consequential action), use "Got it" or "Dismiss". If there is a consequence, name it.

### Avoid: nominalized verbs

"Make a selection" → "Select"  
"Perform a search" → "Search"  
"Submit a request" → "Request"  

Nominalizations add words without adding meaning.

### Destructive actions

Name the action explicitly. Do not soften it.

| Do | Don't |
|---|---|
| Delete account | Remove |
| Cancel subscription | Deactivate |
| Remove member | Update |

Users need to know when an action is destructive. Euphemisms feel like obfuscation.

---

## 2 — Navigation labels

Navigation labels should be nouns (places) or noun phrases, not verbs. Verbs are for actions; navigation is for destinations.

| Do | Don't |
|---|---|
| Settings | Manage settings |
| Orders | View orders |
| Team | Manage team |
| Reports | Run reports |

**Exception:** Top-level calls to action in nav (like "Get started" or "Sign up") are action-oriented because they are actions, not destinations.

Keep navigation labels to 1–2 words. If a label requires more than two words to be clear, the information architecture may need revision, not the copy.

---

## 3 — Form labels and helper text

### Labels

Form labels should be brief, specific nouns or noun phrases. They should not include verbs ("Enter your name" → "Full name"). Labels are identifiers, not instructions.

| Do | Don't |
|---|---|
| Full name | Enter your full name |
| Email address | Provide an email |
| Company (optional) | Company name (if applicable) |

### Helper text

Helper text appears below a field. Use it to clarify format, constraints, or consequences — not to repeat the label.

| Do | Don't |
|---|---|
| Must be at least 8 characters | Enter your password |
| You'll use this to sign in | Email address |
| Changes take effect on the next billing cycle | Subscription plan |

Helper text should answer "what do I need to know before filling this in?" If there's nothing the user needs to know, omit it.

### Placeholder text

Placeholder text disappears when the user types. Never put critical information in a placeholder — labels and helper text are the right locations for that.

Use placeholders for format examples only: `name@example.com`, `MM/DD/YYYY`.

Do not use placeholder text as a substitute for a label. Labels must always be visible.

---

## 4 — Error messages

Error messages are the most-read copy in a UI at the moment users are most stressed. They must:

1. Tell the user what went wrong (specific, not generic)
2. Tell the user how to fix it (actionable, not vague)
3. Not apologize excessively
4. Not use technical jargon

### Structure

**Heading (optional):** State the effect in plain terms. "Couldn't save product." Not "Error" or "500."

**Body:** What went wrong. What to do about it. In that order.

**CTA (optional):** If recovery requires an action, name it explicitly.

### Do/don't examples

| Do | Don't |
|---|---|
| "Your session expired. Sign in to continue." | "An error occurred. Please try again." |
| "That email is already in use. Sign in or use a different email." | "Invalid email address." |
| "To save this product, fix 2 issues: [list]" | "There are errors on this page." |
| "Something went wrong. Refresh to try again." | "Oops! Something went wrong 😅" |
| "Changing your store currency will affect all past reports." | "Are you sure you want to do this?" |

### Tone in errors

Calm and direct. No cheerfulness. No excessive apology. The user doesn't need comfort — they need information.

"Sorry, something went wrong" is worse than "Something went wrong." The apology is noise; remove it.

"We apologize for any inconvenience this may have caused" tells the user nothing. Never write this.

---

## 5 — Empty states

An empty state appears when a list, view, or section has no content yet. It is not just a blank space — it is an opportunity to explain what will go here and what the user should do.

A complete empty state has three parts:

1. **What it is:** Name the thing that will appear here ("Your orders will appear here.")
2. **Why it's empty:** Explain why there's nothing yet, if it's not obvious.
3. **How to fill it:** Link to or describe the action that creates the first item.

| Context | Good empty state |
|---|---|
| Order list, no orders | "No orders yet. Share your store link to start getting customers." |
| Report, no data | "No data for this period. Try selecting a broader date range." |
| Product list, new store | "Add your first product to start selling." [Add product] |
| Search, no results | "No results for 'widget'. Check the spelling or try a different search." |

**What to avoid:**
- "Nothing here yet" with no guidance
- "No data available" (meaningless)
- Illustrative characters performing vague gestures at the user (they're charming in screenshots; they provide no value to the user who needs help)

---

## 6 — Confirmation dialogs

Confirmation dialogs appear before consequential, hard-to-reverse actions. They must clearly communicate three things:

1. What will happen
2. Whether it is reversible
3. What the user should do

### Structure

**Title:** State the action, not a question. "Delete this product" not "Are you sure?"

**Body:** Explain the consequence. "This will permanently remove the product and all its variants. This can't be undone."

**Buttons:** Primary = the destructive action (named explicitly). Secondary = Cancel.

| Do | Don't |
|---|---|
| "Delete product" / "Cancel" | "Yes" / "No" |
| "Remove member" / "Keep member" | "OK" / "Cancel" |
| "Archive campaign" / "Keep active" | "Proceed" / "Go back" |

**On "Are you sure?":** Do not use this as the dialog title. It is a question, not information. The title should tell the user what they are confirming.

---

## 7 — Progressive disclosure

Not all information needs to be present at once. When a task has multiple steps or a concept requires explanation, surface only what the user needs at this moment.

**Apply when:**
- An action has consequences that only apply in some cases
- A form field requires explanation that most users don't need
- An onboarding flow has optional detail that advanced users might want

**The rule:** Show the minimum information needed to proceed. Make additional information available on demand — "Learn more", expandable sections, or step-specific help.

Do not use progressive disclosure to hide required information. If a user must know something before they act, tell them before they act — not after they click.
