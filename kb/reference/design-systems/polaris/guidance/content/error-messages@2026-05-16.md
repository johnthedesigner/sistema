---
system: polaris
category: content
topic: error-messages
content_type: guidance
status: latest
retrieved: 2026-05-16
source_url: https://polaris.shopify.com/content/error-messages
tags: [errors, validation, content-design, feedback, ui-copy]
---

# Shopify Polaris — Error Messages

## Requirements

Every error message must:

1. **Explain what went wrong** — specific, not generic
2. **Tell the merchant how to fix it** — actionable, not vague
3. **Use specificity** — numbers, dates, and user-provided data where relevant
4. **Avoid jargon** — words like "invalid" communicate nothing to a merchant
5. **Not over-apologize** — say what happened, not how sorry you are
6. **Prevent future mistakes** — where possible, explain what was expected before the error

---

## Anatomy of an error message

**Heading (optional):** States the effect in plain terms. Commands attention. Not "Error" or a status code.

**Body:** States the effect if no heading is used. Explains the fix. Links to documentation if relevant.

**CTA (optional):** Used when recovery requires an explicit action. Names the action directly.

---

## Tone in error states

Calm and direct. No cheerfulness, no exclamation marks, no excessive apology. The merchant does not need comfort — they need to know what happened and what to do next.

"Sorry, something went wrong" is worse than "Something went wrong." The apology adds nothing and delays the useful information. Remove it.

"We apologize for any inconvenience this may have caused" — never write this. It communicates nothing.

---

## Do / don't examples

### Generic vs. specific

| Do | Don't |
|---|---|
| "Your session expired. Sign in to continue." | "An error occurred. Please try again." |
| "Couldn't connect to Stripe. Check your API key in Payment settings." | "Payment connection failed." |
| "Participant email bounced. Check the address and resend." | "Invalid email." |

### Multiple errors

| Do | Don't |
|---|---|
| "To save this product, make 2 changes: [list]" | "There are 2 errors on this page." |
| "Fix these 3 issues before publishing: [list]" | "Please correct the errors above." |

### System failures

| Do | Don't |
|---|---|
| "Something went wrong. Refresh your browser to try again." | "Oops! Something went wrong 😅" |
| "We couldn't load your orders. Try again or contact support." | "An unexpected error occurred." |

### Destructive action warnings

| Do | Don't |
|---|---|
| "Changing your store currency will affect all past reports." | "Are you sure you want to do this?" |
| "This will permanently delete all 47 products. This can't be undone." | "Warning: This action cannot be reversed." |

---

## Placement and severity

Place errors adjacent to the content that caused them — in-line with the problematic field, not only at the top of the form.

**Red (critical):** Errors requiring immediate action before the merchant can proceed. Inline form validation errors, payment failures, permission blocks.

**Yellow (warning):** Errors that could escalate or affect data if ignored, but do not block current action. Low inventory warnings, expiring trial notices, sync conflicts.

---

## Recovery

Every error message should answer "what do I do now?" When recovery requires a specific step — re-entering a field, visiting a settings page, contacting support — name that step explicitly and link to it if possible.

"Try again" is acceptable only when the action itself is retryable without any change. If the merchant needs to change something before retrying, tell them what to change.
