---
play_slug: define-voice-and-tone
stage: 1
created: 2026-05-16
title: "Fieldwork (UX Research Platform)"
quality_notes: >
  Generated for "Fieldwork" — a fictional qualitative research platform for product teams.
  Shows how voice traits extend the cross-system baseline with product-specific character
  without losing clarity. The tone table includes research-specific contexts (synthesis,
  recruiting, analysis) that require different register than generic SaaS flows. The words
  table reflects real domain vocabulary choices that shape how the tool frames its work.
input:
  project_context: "Fieldwork — a qualitative research platform for product teams. Helps teams recruit participants, conduct interviews, synthesize findings, and share insights with stakeholders. Users are UX researchers and product managers. Data-dense at analysis time, focused and minimal during participant-facing flows. The brand is thoughtful and rigorous — takes research seriously without being academic."
---

# VOICE_AND_TONE.md

*Voice and writing standards for Fieldwork. Read at session start; reference when writing or reviewing any UI copy.*

---

## 1. Voice

**Thoughtful practitioner:** Fieldwork writes the way a senior researcher talks to a colleague — knowledgeable, direct, and genuinely invested in the work. Not academic. Not startup-casual. The voice assumes the reader knows what research is and treats them accordingly.

Core traits:

- **Plainspoken:** Use research vocabulary when it belongs ("synthesis," "affinity diagram," "participant") and plain language everywhere else. Never use jargon to sound credible — use it when it names something precisely.
- **Genuine:** Say what's true. When a recruit fails, don't soften it with "almost there!" When synthesis produces no clear pattern, say so. The product's job is to surface reality, and the copy should do the same.
- **Rigorous:** Fieldwork copy is precise. Numbers are specific. Instructions are complete. Error messages say what went wrong, not approximately what might have gone wrong.
- **Warm without being cheerful:** The product deals with human research — participants, interviews, people. The copy should reflect that these interactions matter, without being performatively enthusiastic about them.

Voice limits: Fieldwork is not casual, ironic, or playful. It does not use startup-speak ("crushing it," "super easy," "magical"). It does not over-celebrate routine tasks.

---

## 2. Tone adjustments

| Context | Reader state | Our tone |
|---|---|---|
| Recruiting participants | Focused, methodical | Clear and procedural — give them exactly what they need to configure the recruit |
| During interviews (participant-facing) | Uncertain, trusting | Warm and minimal — don't distract from the conversation |
| Synthesis and tagging | Deep in analysis, time-pressured | Invisible — copy should not interrupt the flow; labels are the only voice |
| Sharing insights with stakeholders | Confident, presenting | Affirming without overpromising — "here's what we found," not "look how great this is" |
| Error (failed recruit, broken recording) | Frustrated, under pressure | Direct and immediate — what happened, what to do now, nothing else |
| Empty state (no participants, no sessions) | Uncertain about value | Informative and grounding — explain what goes here and why it matters |
| Onboarding | Curious, evaluating | Honest about the workflow — show what it is, not what it could theoretically become |

---

## 3. Writing mechanics

**Capitalization:** Sentence case everywhere. "Add participant" not "Add Participant." Proper nouns capitalized (Zoom, Calendly, Slack).

**Periods:** Omit in single-sentence labels, buttons, and headings. Use in multi-sentence helper text, error bodies, and descriptions.

**Contractions:** Use. "You don't have any sessions yet" not "You do not have any sessions yet."

**Numbers:** Numerals in UI. "3 participants" not "three participants."

**Oxford comma:** Use. "Participants, sessions, and insights."

**Exclamation marks:** Avoid. The exception: first successful interview completion ("Your first interview is complete — here's how to tag it."). That's it.

**Address users as:** You. Never "the researcher" or "the user." "Your participants," "Your sessions."

---

## 4. UI copy patterns

### Buttons

Verb + noun. The noun scopes the action to the research context.

| Use | Avoid |
|---|---|
| Add participant | Submit |
| Start session | Begin |
| Export findings | Download |
| Archive study | Remove |
| Invite collaborator | Share |

Destructive actions: name them. "Delete study" not "Remove." "Archive participant" not "Update status."

### Errors

State what failed, then state what to do. No apology.

- Recruit failure: "Participant email bounced. Check the address and try again."
- Recording failure: "Recording didn't save. Check your connection and start a new session."
- Integration failure: "Couldn't connect to Calendly. Check that your API key is still active."

Never: "Something went wrong." Always specify what something was.

### Empty states

Every empty state has three parts: what goes here, why it's empty now, what to do first.

- No participants: "No participants yet. Add participants to start recruiting for this study."
- No sessions: "No sessions scheduled. Once you add participants, schedule your first session."
- No insights: "Insights appear here after you tag your sessions. Start by opening a session and adding tags."

### Confirmations

Title states the action directly. Body explains what is lost or changed. Buttons name the action.

- Title: "Delete study" / Body: "Deleting this study will remove all sessions, participants, and findings. This can't be undone." / Buttons: "Delete study" + "Keep study"
- Title: "Archive participant" / Body: "Archived participants won't appear in recruiting flows but their sessions are preserved." / Buttons: "Archive" + "Cancel"

---

## 5. Words to use / avoid

| Use | Avoid | Reason |
|---|---|---|
| Participant | User, subject, respondent | "Participant" is the research-standard term; the others carry wrong connotations |
| Session | Interview, call, meeting | "Session" is product-neutral and covers both in-person and remote |
| Insight | Finding, result, output | "Insight" reflects the interpretive work; "finding" implies raw data only |
| Synthesis | Analysis, processing | "Synthesis" names the specific qualitative practice; "analysis" is too broad |
| Tag | Label, code, mark | "Tag" is the established term in qualitative research tooling |
| Study | Project, research, initiative | "Study" is the primary object in Fieldwork; consistent naming matters |
| Collaborator | Teammate, viewer, member | "Collaborator" signals an active role without prescribing access level |
| Archive | Delete (when reversible) | Archiving is reversible; "delete" implies permanent loss |

---

## 6. The test

Before publishing any copy: read it aloud. Does it sound like something a senior researcher at Fieldwork would actually say to a colleague using the product?

If yes: ship it. If not: rewrite it.

Watch for: hollow enthusiasm, over-softened errors, labels that need explaining, instructions that announce themselves before giving information.
