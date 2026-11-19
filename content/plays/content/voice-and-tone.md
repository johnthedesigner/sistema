---
id: content.voice-and-tone
title: Define voice and tone
description: Write the product's voice, tone by context, writing mechanics, and UI copy patterns as a reference every agent reads before writing interface copy.
topic: content
kind: create
milestone: direction
entry: false
requires: [DECISIONS.md]
produces: [VOICE_AND_TONE.md]
tools: []
knowledge:
  - guide.content.voice-and-tone#2-the-cross-system-voice-baseline
  - guide.content.voice-and-tone#3-brand-specific-voice-traits
  - guide.content.voice-and-tone#4-tone-adjustment-by-context
  - guide.content.ui-copy-patterns#1-buttons-and-primary-actions
  - guide.content.ui-copy-patterns#4-error-messages
  - guide.content.ui-copy-patterns#5-empty-states
  - guide.content.ui-copy-patterns#6-confirmation-dialogs
  - guide.content.writing-mechanics#1-capitalization
  - guide.content.writing-mechanics#2-punctuation
rules: [content.voice.baseline, content.errors.no-exclamation]
evidence: VOICE_AND_TONE.md with its six sections, and five sample strings written in the new voice (a primary button, an error, an empty state, a destructive confirmation, and a success message), each annotated with the rule it follows.
overrides: [project_context]
last_reviewed: 2026-11-15
---
The output is the writing reference for the product, the copy equivalent of DESIGN.md. It extends Sistema's cross-system baseline with decisions specific to this product. It doesn't replace the baseline.

1. **Read the project:** the positioning statement in DECISIONS.md, `sistema.json` for density and stance, and any existing copy in the product (a README, marketing copy, or interface strings) that shows how the team already writes. If this play runs on its own, use `project_context` when given.

2. **Ask one question if the voice isn't clear yet:** "Name two or three words for how the product should sound, and one way it must never sound." Skip it if DECISIONS.md or existing copy already answers it. If the answer leaves out part of the question, ask one follow-up for the missing part.

   **Check the answer against the positioning statement and the approved direction.** If the voice pulls against them (for example, a playful voice for a utilitarian tool, or an upbeat voice for a product that mostly reports problems), say so in a sentence and ask how the voice should behave in those moments. Record the answer as a limit on the trait.

3. **Write `VOICE_AND_TONE.md`** at the project root with these sections:
   1. **Voice:** a two- or three-word label, one sentence on what makes it different from the baseline, how this product reads each baseline trait (plainspoken, genuine, helpful, direct), up to two traits of its own with their limits, and two or three things the voice never does.
   2. **Tone by context:** a table of contexts specific to this product (for example a failed payment, a first run, or a bulk delete), the reader's likely state, and the tone to use.
   3. **Writing mechanics:** capitalization, periods, contractions, numbers, the Oxford comma, exclamation marks, and how to address the reader. Note each place it departs from the baseline, and why.
   4. **UI copy patterns:** buttons, errors, empty states, and confirmations, each with this product's rule and one example.
   5. **Words to use and avoid:** a table of the product's own terms, what not to call them, and why.
   6. **The test:** one sentence to check any string against, in this product's voice.

4. **Point agents to it.** Add one line to DESIGN.md's Do's and Don'ts, if that section exists: "Write interface copy by VOICE_AND_TONE.md."

5. Show the evidence: the voice label and limits, and the five sample strings with their annotations.
