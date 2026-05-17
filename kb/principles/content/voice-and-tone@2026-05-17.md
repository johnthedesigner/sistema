---
category: principles
topic: content
content_type: synthesis
status: latest
retrieved: 2026-05-17
supersedes: voice-and-tone@2026-05-16.md
tags: [content-design, voice, tone, copywriting, brand, synthesis]
sources:
  - kb/reference/design-systems/mailchimp/guidance/content/voice-and-tone
  - kb/reference/design-systems/polaris/guidance/content/voice-and-tone
  - kb/reference/design-systems/carbon/guidance/content/voice-and-tone
  - kb/reference/design-systems/atlassian/guidance/content/voice-and-tone
---

# Voice and Tone — Synthesis

## How to use this document

Voice and tone are two separate things that are often confused. This document defines both precisely, synthesizes patterns across four production design systems, and gives the framework to apply them when writing new copy or auditing existing copy.

Read this before establishing a voice guide for a design system. Reference the tone table when writing copy for emotionally charged UI contexts.

---

## 1 — Voice vs. tone

**Voice** is the consistent character behind all your writing. Brand-constant — it does not change based on context or channel.

**Tone** is how that character expresses itself in a specific moment. Context-variable — it shifts based on what the user is doing, how they're feeling, and what they need to accomplish.

Every production system surveyed — MailChimp, Polaris, Carbon, Atlassian — makes this distinction explicitly and consistently. The failure mode is treating them as the same and applying a single register to all contexts: chirpy during errors, formal during onboarding, generic everywhere.

---

## 2 — The cross-system voice baseline

Four production systems define their voice differently, but the following traits appear across all of them. These are the minimum baseline — a product's voice must meet these before any brand-specific traits are layered on.

### 2.1 — Plainspoken

The clearest formulation comes from MailChimp: "We strip all that away and value clarity above all." Carbon puts it this way: "Use everyday language, not jargon. And choose short words to make the reading faster, rather than long, impressive-sounding words."

This means: write at the level of the reader, not the level of your expertise. Define technical terms on first use. Use the simplest word that conveys the meaning.

**What it is NOT:** condescension. Plainspoken means trusting the reader with information. It means removing friction, not removing content.

### 2.2 — Genuine

MailChimp: "We get small businesses because we were one not too long ago." Polaris: prioritize human-sounding language, read copy aloud to check. Carbon: "Keep the tone friendly, human, and inviting."

Genuine means writing what you mean. No hollow affirmations. No excessive apology. No corporate hedging. Users distinguish between a system trying to help them and one performing helpfulness.

### 2.3 — Helpful, not entertaining

MailChimp: "It's always more important to be clear than entertaining." Polaris: lean content — "find the shortest, clearest way to give merchants only the info they need." Atlassian: "Satisfy by meeting expectations — deliver practical answers without unnecessary flourish."

Humor and personality are welcome when the moment is light. They are wrong when the user is confused, frustrated, or has just lost something. Clarity comes first; personality second.

### 2.4 — Direct

Polaris: "Start sentences with verbs so they feel like actionable instructions." Carbon: "Be succinct, and keep sentences as short and simple as possible." Atlassian: "Practical with a wink — getting to the point and being direct and concise."

Say the thing. Cut the preamble. Verb-first. No announcements before information.

---

## 3 — Brand-specific voice traits

These traits differentiate one product's voice from the cross-system baseline. They are additive — they layer on top of the baseline, not replace it.

**MailChimp:** Dry humor ("straight-faced, subtle, and a touch eccentric"). Translators — makes B2B complexity legible without dumbing it down.

**Shopify Polaris:** Merchant-centered — uses vocabulary merchants actually use. 7th-grade reading level target.

**Carbon (IBM):** Thought-leadership voice — "intellectually ambitious, expressing a bigger idea." Persuasive, not poetic. Engages the thinker by speaking like the thinker.

**Atlassian:** Bold, optimistic, practical with a wink. Three independently scalable traits. Optimism is contextual — calibrated to the user's position in their journey, not applied uniformly.

The lesson from surveying these systems: brand-specific traits are 1–3 additional dimensions, not a wholesale replacement of the baseline. Every system that has a memorable, authentic voice holds the baseline first.

---

## 4 — Tone adjustment by context

All four sources agree on the fundamental tone adjustment principle: the same voice expresses differently depending on what the user is experiencing.

| Context | Reader state | Tone direction |
|---|---|---|
| Onboarding / first-run | Curious, uncertain | Warm, encouraging, minimal — don't overwhelm |
| Normal task flow | Focused, in control | Neutral, efficient, invisible — don't interrupt |
| Success / completion | Satisfied | Briefly affirming — don't overdo it |
| Error state | Frustrated, possibly anxious | Direct, calm, solution-focused — no cheerfulness |
| Destructive action | Cautious | Clear, specific, non-alarmist — give facts only |
| Empty state | Uncertain about the product | Informative, welcoming — explain the value |
| Major milestone | Joyful, relieved | This is when Atlassian's "wink" is appropriate |

**The most common tone mistake** across all systems surveyed: applying brand cheerfulness to error states. MailChimp, Polaris, Carbon, and Atlassian all explicitly prohibit exclamation marks in error and failure states. The user who encountered an error needs information, not sympathy.

---

## 5 — The human test

Read the copy aloud. Does it sound like something a real person at this company would say to a real user?

This test is stated explicitly in Polaris ("sounds like something a human would say") and is implicit in every other system's guidance. It catches passive constructions, nominalizations, hollow affirmations, and jargon that reads fine in writing but sounds absurd spoken.

If yes: ship it. If not: rewrite it.

---

## 6 — When establishing a voice guide

1. Start from the baseline (section 2). Every principle here applies.
2. Identify 1–3 brand-specific traits that differentiate this voice from the generic baseline. Name them precisely.
3. Define explicit limits on each trait — what this trait permits and what it does not.
4. Build a tone adjustment table for your specific product's contexts (errors, onboarding, success states, destructive actions).
5. Define a words list: domain vocabulary to use and to avoid, with reasons.

Do not start from scratch. Products that invent entirely novel voice frameworks without grounding in cross-system practice produce copy that is memorable as a brand exercise and confusing as a UI tool.
