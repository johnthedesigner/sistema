---
system: polaris
category: content
topic: actionable-language
content_type: guidance
status: latest
retrieved: 2026-05-16
source_url: https://polaris.shopify.com/content/actionable-language
tags: [buttons, actions, navigation, labels, content-design, ui-copy]
---

# Shopify Polaris — Actionable Language

## Core rule: start with verbs

"Start sentences with verbs so they feel like actionable instructions." Verb-first copy makes UI more scannable and communicates immediately what an action will do.

Be direct: "Add apps" not "You can add apps."

---

## Buttons and primary actions

Use the shortest label that still communicates the action. "Let visuals and icons do the talking wherever you can." When context makes the action obvious, the label can be minimal.

The verb+noun pattern is the primary structure: verb describes the action, noun scopes it to the specific context.

| Do | Don't |
|---|---|
| Add product | Submit |
| Delete order | Remove |
| Export report | Go |
| Connect payment | Proceed |
| Archive campaign | Update |

**When to drop the noun:** When the surrounding UI already scopes the action unambiguously (inside a confirmation dialog that names the object), the noun can be omitted. "Delete" in a "Delete this product?" dialog is acceptable. "Delete" on a standalone button in a list is not.

**"+" vs "Add [noun]":** In contexts where the icon communicates clearly, "+" alone is sufficient. "Add" with a noun is required when the icon alone would be ambiguous.

---

## The minimal copy rule

"Find the shortest, clearest way to give merchants only the info they need." Apply progressive disclosure: surface only what is needed for the current step. If a task has multiple parts, break them into steps rather than presenting everything at once.

**Test:** Read the label and ask — does the merchant know what will happen if they click this? If yes, and nothing more is needed, the label is complete. If the merchant would need more context, add it in surrounding copy or a tooltip — not the button.

---

## Navigation labels

Navigation labels are destinations, not actions. Use nouns or noun phrases, not verbs.

| Do | Don't |
|---|---|
| Settings | Manage settings |
| Orders | View orders |
| Products | Browse products |
| Customers | See customers |

Keep navigation labels to 1–2 words. Longer labels signal an information architecture problem, not a copy problem.

---

## Progressive disclosure

Break multi-part tasks into digestible steps. "Focus on the one thing merchants need to know or do next." Complex actions with multiple consequences should be introduced progressively — confirm the primary action first, then reveal scope or options.

This applies to:
- Multi-step forms or wizards
- Actions with optional advanced settings
- Confirmations where some information only applies in certain scenarios
