<!-- This project follows Sistema. The "Start a design system" workflow is finished. For later design system work, fetch the URL in sistema.json "continue". -->
# Relay voice and tone

The writing reference for every string in Relay's interface. It builds on Sistema's cross-system baseline (plainspoken, genuine, helpful, direct; sentence case; verb-plus-noun buttons) and records only what is specific to Relay. Where this file is silent, the baseline applies.

## 1. Voice

**Label:** Energetic, positive, plainspoken.

**What makes it different from the baseline:** Relay talks like a sharp, upbeat dispatch partner who keeps the day moving: every message points at the next thing to do, and nothing slows a dispatcher down.

**How Relay reads the baseline traits:**
- **Plainspoken:** the words dispatchers already say on the phone: job, tech, window, en route, on site. Short words, short sentences, no software jargon ("sync conflict" becomes "Someone else changed this job").
- **Genuine:** say what happened and what it means for the day. No hollow praise ("Great job!"), no apologies for things that aren't Relay's fault, no corporate hedging.
- **Helpful:** every warning and error ends with the move to make. Dispatchers are mid-call; they need the fix, not an explanation of the system.
- **Direct:** lead with the job, the tech, or the time. Verbs first in buttons. Numbers and names over adjectives.

**Relay's own traits, with their limits:**
- **Energetic:** forward momentum. Active verbs, present tense, the next step named ("Reassign to K. Byrne", "Call customer"). *Limit:* energy comes from pace and verbs, never from exclamation marks, hype words ("Awesome", "Boom", "Let's go"), emoji, or urgency the situation doesn't have. A late job is stated, not dramatized.
- **Positive:** frame around what can be done and what is still on track ("2 techs free after 2 pm" rather than "No techs available until 2 pm" when both are true). *Limit:* never at the cost of honesty. Bad news is stated plainly first; positivity only shows up in the next step. No cheerfulness in errors, warnings, failed syncs, or cancellations.

**Relay never:**
- Sounds childish: no cutesy words, puns, playful mascots, "Oops!", "Uh-oh", or "Yay".
- Sounds patronizing: no "simply", "just", "easily", "don't worry", "remember to", or explaining things a dispatcher does fifty times a day. It never lectures, never praises routine work, and never second-guesses a dispatcher's choice in copy.
- Uses an exclamation mark in an error, warning, or failure message.

## 2. Tone by context

| Context | Dispatcher's likely state | Tone |
|---|---|---|
| Morning board load, normal job flow | Focused, scanning fast | Invisible. Labels and data only, no sentences where a word will do. |
| Assigning or reassigning a job | In control, often on the phone | Brisk confirmation naming who and when: "JOB-20417 assigned to D. Okafor, arriving 10:40 am". |
| Tech running late / job at risk | Alert, juggling | Calm and factual first, then the option: "D. Okafor is 25 min behind. Reassign or notify the customer." |
| Customer request waiting | Busy, possibly a backlog | Clear count and age: "3 requests waiting, oldest 18 min". No guilt. |
| Error or failed save/sync | Frustrated, worried about lost work | Direct and calm. What failed, whether work is safe, what to do. No energy, no exclamation marks. |
| Destructive action (cancel job, remove tech from schedule) | Cautious | Facts only: what happens, who is affected, whether it can be undone. |
| Empty board or empty filter | Mildly unsure | Short and positive: what will appear and the move to fill it. |
| End of day, all jobs closed | Satisfied, tired | One brief, upbeat line. This is the only place energy may show as celebration, and still without hype. |
| First run / setup | Curious, maybe skeptical | Encouraging and minimal; get them to their first assigned job fast. |

## 3. Writing mechanics

Relay follows the baseline mechanics (sentence case everywhere, no period on single-sentence labels, periods in multi-sentence text, Oxford comma, contractions, numerals, "you" not "the user", no "&"). Departures and Relay-specific choices:

- **Exclamation marks:** none in routine UI at all, not only in errors. *Departs from the baseline* ("use sparingly"); dispatchers see hundreds of confirmations a day and any exclamation mark turns into noise, and the person asked that Relay never sound childish. The one allowed use is the end-of-day "all jobs closed" message, at most one.
- **Times:** 12-hour with am/pm, a space, lowercase ("8:15 am"). Arrival windows use an en dash with no spaces and one am/pm when both ends share it ("8–10 am", "11:30 am–1 pm"). *Provisional:* the approved style preview showed 24-hour times; confirm which format Relay's dispatchers use before components are built.
- **Durations:** "min" and "hr" in tables and chips ("25 min late"), full words in sentences.
- **Names:** technicians by first initial and last name in dense views ("D. Okafor"), full name in detail views. Customers by full name.
- **IDs:** job numbers exactly as stored, uppercase prefix ("JOB-20417"). This is an established identifier, not all-caps emphasis.
- **Uppercase labels:** small group labels (the `overline` type role) are written in sentence case in the source and set in uppercase by style only. *Departs from the baseline* ("all-caps: never") for that one visual role, because the approved direction uses it for scannable field groups; screen readers still get sentence case.
- **Addressing the reader:** "you" for the dispatcher. Technicians and customers are named or called "the tech" / "the customer", never "they" when it could be ambiguous.
- **Please and thank you:** only when Relay is genuinely holding the dispatcher up ("Saving 40 jobs. Please wait.").

## 4. UI copy patterns

**Buttons.** Verb plus noun, sentence case, no period. Drop the noun only when the surrounding UI makes it obvious. Use the domain verb, not a generic one.
- Example: **Assign tech** (not "Submit" or "Confirm").

**Errors.** Say what failed in plain words, whether anything was lost, and the next step. Lead with the effect, never "Error" or "Oops". No apology unless Relay caused it; no exclamation marks.
- Example: **Couldn't save the reassignment. Your change is still here. Check your connection and try again.**

**Empty states.** What will appear here, why it's empty, and the move to fill it, in one or two short lines. Positive, never cute.
- Example: **No unassigned jobs. New requests will show up here as customers call in.**

**Confirmations (destructive).** The title states the action, not a question. The body states the consequence specifically, including who gets told. The primary button names the action exactly; the secondary keeps things as they are.
- Example: title **Cancel job JOB-20417**, body **The customer's 8–10 am visit will be removed from D. Okafor's route. This can't be undone.**, buttons **Cancel job** / **Keep job**.

**Success messages.** Name what happened and the next fact the dispatcher cares about. Brief and upbeat through pace, not punctuation.
- Example: **Assigned to K. Byrne, arriving in 12 min.**

## 5. Words to use and avoid

| Use | Not | Why |
|---|---|---|
| job | ticket, work order, task | The unit dispatchers plan and talk about. One word everywhere. |
| request | lead, inquiry, ticket | An incoming customer ask that isn't a scheduled job yet. |
| tech (dense views), technician (headings, settings) | worker, resource, agent, field user | What dispatchers call them; "resource" is dehumanizing. |
| customer | client, user, account | Who the job is for. "User" means a Relay user (a dispatcher). |
| dispatcher | admin, operator | The person using Relay. Use only when Relay needs to name the role (permissions, notifications). |
| assign, reassign | allocate, dispatch to, route | Plain verbs that match the main buttons. |
| window, arrival window | slot, ETA range | What's promised to the customer. "ETA" is the tech's live estimate, a different thing. |
| en route, on site, done | in transit, in progress, completed/closed | Status words dispatchers say on the radio; must match the status chips exactly. |
| late, at risk | delayed, SLA breach, overdue | Plain, calm, and specific. Add the amount: "25 min late". |
| parts hold | blocked, pending, on hold | Says why the job is stopped. Use the actual reason whenever there is one. |
| cancel | delete, void, remove | For jobs; say what happens to the customer's visit. Use "delete" only for things truly erased (a draft note). |
| couldn't, didn't | failed to, unable to, error | Plainer and shorter, and it reads as Relay owning the problem. |

## 6. The test

Would a sharp, upbeat dispatcher say this out loud to a colleague in the middle of a busy morning, without sounding like a cheerleader or a teacher?
