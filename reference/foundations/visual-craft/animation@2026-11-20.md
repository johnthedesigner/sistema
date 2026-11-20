---
system: emilkowalski
category: foundations
topic: animation
content_type: essay
status: latest
retrieved: 2026-11-20
source_url: https://emilkowal.ski/ui/great-animations
license: "Personal site, no open licence; tier 3 (synthesis with attribution)"
tags: [motion, easing, duration, performance, accessibility]
---

# Great animations (Emil Kowalski)

Source: Emil Kowalski, "Great Animations". https://emilkowal.ski/ui/great-animations

- Animations should feel **natural** (springs suit many interface movements), be **fast**, have a **purpose**, be **performant**, be **interruptible**, and be **accessible**.
- Fast: ease-out (starts fast, settles), and usually under 300ms; slow motion makes the interface feel slow.
- Purpose: pace animation through the experience; use it for state changes and to explain; consider how often it will be seen. Never animate keyboard-initiated actions that repeat many times a day.
- Performance: animate `transform` and `opacity`; prefer CSS or the Web Animations API, which stay smooth when the main thread is busy.
- Interruptible: CSS transitions can be interrupted mid-way, keyframe animations can't.
- Accessible: with reduced motion, keep opacity changes and drop movement.

## Relevance to Sistema

Grounds the craft baseline's motion item (short, ease-out, only on state changes and floating layers) and the reduced-motion mode's "movement becomes opacity".
