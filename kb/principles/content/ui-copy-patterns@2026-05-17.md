---
category: principles
topic: content
content_type: synthesis
status: latest
retrieved: 2026-05-17
supersedes: ui-copy-patterns@2026-05-16.md
tags: [content-design, ui-copy, buttons, errors, empty-states, forms, patterns, synthesis]
sources:
  - kb/reference/design-systems/polaris/guidance/content/actionable-language
  - kb/reference/design-systems/polaris/guidance/content/error-messages
  - kb/reference/design-systems/carbon/guidance/content/writing-style
  - kb/reference/design-systems/atlassian/guidance/content/language-and-grammar
  - kb/reference/design-systems/mailchimp/guidance/content/voice-and-tone
---

# UI Copy Patterns — Synthesis

## How to use this document

UI copy is situational. The rules for a button label differ from those for an error message, which differ from those for a placeholder. This document covers the highest-value patterns — the ones that cause the most inconsistency and user confusion when applied without clear rules.

Reference this document when writing or auditing copy for any specific UI context. Each section gives the principle, the structure, and concrete examples drawn from production systems.

---

## 1 — Buttons and primary actions

### The rule: verb + noun

Button labels should be verb-first and as short as possible while remaining specific. Polaris: "Start sentences with verbs so they feel like actionable instructions." Atlassian: "Use action verbs; avoid gerunds (-ing forms)."

| Do | Don't |
|---|---|
| Save changes | OK |
| Delete product | Submit |
| Add team member | Proceed |
| Export report | Go |
| Connect store | Click here |

**When to drop the noun:** If the surrounding UI already scopes the action unambiguously, the noun can be dropped. "Delete" in a "Delete this product?" dialog is acceptable. "Delete" alone in a product list is not.

**Avoid nominalized verbs:** "Make a selection" → "Select." "Submit a request" → "Request." Atlassian: "Create password" not "Create a password" (omit articles in UI labels).

### Destructive actions

Name them explicitly. Do not use euphemisms.

| Do | Don't |
|---|---|
| Delete account | Remove |
| Cancel subscription | Deactivate |
| Remove member | Update |

Carbon: "Determining whether something is important or special is highly subjective." If the action is destructive, say so clearly — do not soften it to "update" or "remove."

---

## 2 — Navigation labels

Navigation labels are destinations (nouns), not actions (verbs). Polaris makes this explicit: use nouns for destinations, verbs for buttons.

| Do | Don't |
|---|---|
| Settings | Manage settings |
| Orders | View orders |
| Team | Manage team |

Keep to 1–2 words. Atlassian: "Minimize question marks. Use action verbs [only for actions]; avoid gerunds."

---

## 3 — Form labels and helper text

### Labels

Brief nouns or noun phrases. No verbs. Atlassian: "Create password" not "Create a password." No articles ("a," "an," "the") in UI labels.

| Do | Don't |
|---|---|
| Full name | Enter your full name |
| Email address | Provide an email |
| Company (optional) | Company name (if applicable) |

### Helper text

Answers "what do I need to know before filling this in?" If nothing — omit it. Do not repeat the label.

| Do | Don't |
|---|---|
| Must be at least 8 characters | Enter your password |
| Changes take effect on the next billing cycle | Subscription plan |

### Placeholder text

Format examples only. Never put critical information in a placeholder — it disappears when the user types. Never use as a substitute for a label.

---

## 4 — Error messages

### Requirements (across all four sources)

Every error message must:
1. State specifically what went wrong (not generic)
2. Tell the user how to fix it (actionable)
3. Not over-apologize (MailChimp, Polaris, Atlassian all prohibit excessive apology)
4. Avoid jargon ("invalid" communicates nothing — Polaris)
5. Be specific: use numbers, dates, and user-provided data where relevant

### Structure

**Heading (optional):** States the effect plainly. Not "Error" or a status code. Not "Oops!"

**Body:** What went wrong. What to do. In that order. Link to documentation if relevant.

**CTA (optional):** When recovery requires an explicit action, name it.

### Tone in errors

Calm, direct, no cheerfulness. MailChimp and Atlassian both prohibit exclamation marks in errors. Carbon: "An economy of words is desirable [in error messages]."

"Sorry, something went wrong" is worse than "Something went wrong." The apology adds noise without adding information.

### Do / don't examples

| Do | Don't |
|---|---|
| "Your session expired. Sign in to continue." | "An error occurred. Please try again." |
| "That email is already in use." | "Invalid email." |
| "To save this product, fix 2 issues: [list]" | "There are 2 errors on this page." |
| "Something went wrong. Refresh to try again." | "Oops! Something went wrong 😅" |

---

## 5 — Empty states

An empty state should tell the user three things, in order:
1. What will appear here
2. Why it is empty now
3. What to do to fill it

| Context | Good empty state |
|---|---|
| No orders | "No orders yet. Share your store link to start getting customers." |
| No data for period | "No data for this range. Try selecting a broader date range." |
| New product list | "Add your first product to start selling." [Add product] |
| No search results | "No results for 'widget'. Check the spelling or try a different search." |

Avoid: "Nothing here yet" with no guidance. "No data available" (meaningless).

---

## 6 — Confirmation dialogs

Confirmation dialogs appear before consequential actions. They must communicate:
1. What will happen
2. Whether it is reversible
3. What to do

**Title:** State the action, not a question. "Delete this product" not "Are you sure?"

**Body:** State the consequence specifically. "This will permanently remove the product and all its variants. This can't be undone."

**Buttons:** Primary = the destructive action (named exactly). Secondary = Cancel or "Keep [object]."

| Do | Don't |
|---|---|
| "Delete product" / "Cancel" | "Yes" / "No" |
| "Archive campaign" / "Keep active" | "Proceed" / "Go back" |

Polaris on destructive action warnings: describe the consequence, not just the question. "Changing your store currency will affect all past reports" not "Are you sure you want to do this?"

---

## 7 — Terms of politeness

Carbon specifically addresses this: "avoid 'please' and 'thank you' in a UI — they can be inappropriate or offensive in some cultural contexts." Use these terms only when the user is being genuinely inconvenienced, not as default filler.

| Appropriate | Inappropriate |
|---|---|
| "Indexing might take a few minutes. Please wait." | "Please create a subscription account to get full access." |

---

## 8 — Progressive disclosure

Show only what the user needs at the current step. Polaris: "Focus on the one thing merchants need to know or do next. Break multi-part tasks into digestible steps."

**Apply when:**
- An action has consequences that only apply in some cases
- A form has optional advanced settings most users don't need
- An onboarding flow has detail relevant only to experienced users

**The rule:** Show the minimum needed to proceed. Make additional information available on demand. Do not use progressive disclosure to hide information the user must have before acting.
