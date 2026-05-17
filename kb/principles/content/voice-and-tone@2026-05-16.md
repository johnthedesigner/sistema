---
category: principles
topic: content
content_type: synthesis
status: legacy
superseded_by: voice-and-tone@2026-05-17.md
retrieved: 2026-05-16
tags: [content-design, voice, tone, copywriting, brand, synthesis]
sources:
  - kb/reference/design-systems/mailchimp/guidance/content/voice-and-tone
  - kb/reference/design-systems/polaris/guidance/content/voice-and-tone
---

# Voice and Tone — Synthesis

## How to use this document

Voice and tone are two separate things that are often confused. This document defines both precisely, explains how they relate, and gives the framework to apply them when writing new copy or auditing existing copy.

Read this before establishing a voice guide for a design system. Reference the tone adjustment table when writing copy for emotionally charged UI contexts (errors, destructive actions, empty states, onboarding).

---

## 1 — Voice vs. tone

**Voice** is the consistent character behind all your writing. It is brand-constant — it does not change based on context, platform, or reader emotion. Voice is about who you are.

**Tone** is how that character expresses itself in a specific moment. Tone is context-variable — it should shift based on what the user is doing, how they're feeling, and what they need to accomplish. Tone is how you are being right now.

The analogy that holds: a person has one voice. That voice is warm, direct, and a little dry. In a job interview, their tone is more formal. Consoling a friend, more gentle. Telling a joke at a party, more playful. The voice never changed — the tone did.

**The failure mode** is treating voice and tone as the same thing and applying a single register to all contexts. This produces copy that is chirpy during errors ("Oops! Something went wrong!") or overly formal during onboarding ("Please proceed to the next step").

---

## 2 — The four voice principles

These are synthesized from MailChimp and Shopify Polaris, which have the most developed and publicly documented voice frameworks in the industry.

### 2.1 — Plainspoken

Write at the level of your reader, not at the level of your expertise. Avoid jargon, technical terms, and marketing language. If a simpler word conveys the same meaning, use it.

The test: can a person encountering this product for the first time read this copy without googling anything?

What this is NOT: dumbing it down. Plainspoken means trusting the reader with information, not withholding it. The goal is clarity, not condescension.

**Applies to:** all UI copy, not just onboarding. Experienced users benefit from clear language too — it reduces cognitive load.

### 2.2 — Genuine

Write what you mean. Don't use filler phrases, corporate hedging, or enthusiasm you don't actually have. Users can detect the difference between a system that's genuinely trying to help them and one that's performing helpfulness.

This means:
- No hollow affirmations ("Great choice!", "You're doing amazing!")
- No over-apologizing ("We're so sorry for the inconvenience")
- No legal-speak softened with exclamation marks

It also means being direct about failure. When something went wrong, say what went wrong. Don't bury the bad news under reassuring language.

### 2.3 — Helpful, not entertaining

The job of UI copy is to help the user accomplish something. Humor, cleverness, and personality are welcome only when they don't get in the way of that goal.

MailChimp frames this precisely: "We're not trying to be the class clown, but we're not stiffs either." Dry humor and casual phrasing are appropriate when the moment is light. They are inappropriate when the user is confused, frustrated, or has just lost something.

**The rule:** clarity first, personality second. If a clever phrase is less clear than a boring one, use the boring one.

### 2.4 — Direct

Say the thing. Cut the preamble. Don't announce that you're about to tell them something — tell them. Don't explain the context before giving the information — give the information first.

This is especially important in action-triggering copy (buttons, CTAs, confirmations). "Click here to begin the process of deleting your account" can become "Delete account."

---

## 3 — Tone adjustments by context

Tone should shift predictably based on what the user is experiencing. The voice stays constant; the register changes.

| Context | Reader state | Tone direction |
|---|---|---|
| Onboarding, first-run | Curious, uncertain | Warm, encouraging, minimal — don't overwhelm |
| Normal task flow | Focused, in control | Neutral, efficient, invisible — don't interrupt |
| Success state | Satisfied, relieved | Briefly affirming — but don't go over the top |
| Error state | Frustrated, possibly anxious | Direct, calm, solution-focused — no cheerfulness |
| Destructive action | Cautious, second-guessing | Clear, specific, non-alarmist — they need facts |
| Empty state | Uncertain about the product | Informative, welcoming — explain the value |
| Loading / waiting | Impatient | Honest about what's happening — no fake progress |

**The most common tone mistake:** applying the brand's upbeat voice to error states. This reads as dismissive. Users who encountered an error do not want to be told "Oops!" They want to know what happened and how to fix it.

---

## 4 — The human test

Before publishing any copy, apply this test: read it aloud. Does it sound like something a person would actually say to another person?

If yes: ship it.

If it sounds stiff, corporate, or hollow — rewrite it.

This test catches:
- Passive constructions that no one uses in speech ("The document has been saved")
- Unnecessary nominalizations ("Make a selection" → "Select")
- Hollow affirmations that no human would say ("Great choice!")
- Jargon that reads fine in writing but sounds absurd spoken out loud

---

## 5 — Brand-specific voice vs. cross-system voice

These principles describe a cross-system baseline — the voice behavior that produces clear, trustworthy copy regardless of brand. A specific product's voice extends this baseline with additional characteristics: more playful, more formal, more technical, more warm.

When establishing a voice guide for a new design system:
1. Start with this baseline (plainspoken, genuine, helpful, direct)
2. Add 1–2 brand-specific traits that differentiate this voice from the generic baseline
3. Define explicit limits on each trait to prevent it from overriding clarity
4. Document tone adjustment rules for your specific UI contexts

**Do not** start from scratch. Products that invent entirely novel voice frameworks without grounding in these cross-system principles tend to produce copy that is memorable as a brand exercise and confusing as a UI tool.
