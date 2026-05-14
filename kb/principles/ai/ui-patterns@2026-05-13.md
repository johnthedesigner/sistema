---
category: principles
topic: ai-ui-patterns
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [ai, chat, streaming, loading-states, confidence, error-states, synthesis]
sources:
  - kb/reference/standards/design-md/overview
  - kb/reference/standards/design-md/spec
---

# AI-Driven UI Patterns — Synthesis

## How to use this document

This document covers UI patterns specific to products that incorporate AI-generated or AI-assisted content. These patterns are not yet standardized across design systems — the field is still converging. The guidance here is synthesis from production patterns, accessibility requirements, and usability research. Use it when designing chat interfaces, generative content flows, or any UI where content is produced by a model at runtime.

---

## 1 — Chat and conversation interfaces

### 1.1 Visual differentiation of message sources

**User and assistant messages must be visually distinct.** A user must be able to identify at a glance who sent each message.

The standard approach uses a combination of:
- **Alignment** — user messages aligned right (or left with a distinct background), assistant messages aligned left (full-width or contained)
- **Surface color** — different background tokens for each sender
- **Avatar or label** — an icon, initial, or explicit sender label when alignment alone is insufficient (especially in dense contexts or for accessibility)

Avoid distinguishing solely by color — that fails for colorblind users. Alignment + label is the minimum reliable pair.

**Consecutive messages from the same sender** should be visually grouped to reduce repetition. Suppress the avatar/label after the first message in a run; keep it only when the sender changes or when a significant timestamp gap occurs.

---

### 1.2 Message status states

Every message has a lifecycle. Each state must be visually distinguishable:

| State | What it means | Visual treatment |
|---|---|---|
| Sending | User message in transit | Reduced opacity or subtle spinner on the send indicator |
| Processing | Assistant is generating | Typing indicator (see §2.1) |
| Complete | Delivery confirmed, generation done | No indicator; default resting state |
| Failed | Delivery or generation failed | Error color + retry affordance (see §5.2) |

Do not show "delivered" or "read" receipts for assistant messages — they are not meaningful in an AI context.

---

### 1.3 Markdown rendering in assistant messages

**Design for rendered output, not raw text.** Assistant messages frequently contain markdown: code blocks, lists, bold text, inline code, tables. The message container must apply a prose renderer, not display raw characters.

Non-negotiables:
- Code blocks must use a monospace font and a visually distinct surface (not inline)
- Inline code must be visually distinct from surrounding prose
- Links in assistant output must be clearly actionable (styled as links, not plain text)
- Tables must not overflow their container — horizontal scroll is acceptable; truncation is not

**Do not render markdown in user messages.** User input is literal text.

---

## 2 — Streaming and generative states

### 2.1 The typing / generation indicator

**Indicate that the assistant is generating before any content appears.** The gap between user send and first token can feel like failure without a signal.

The standard pattern: a pulsing ellipsis or animated dot sequence in the assistant message position, appearing within 200–300ms of the user submitting. Do not wait for first token to show something.

Once content begins streaming, transition immediately from the indicator to the streaming text. The indicator and the first word should not coexist.

---

### 2.2 Streaming text rendering

**Text appears progressively as tokens arrive.** The component must handle partial strings correctly — do not buffer until a sentence is complete.

Design constraints:
- The cursor position (a blinking `|` or equivalent) should appear at the end of the last rendered character, not at the end of the placeholder area
- Do not show a skeleton for streaming content — skeletons imply known final dimensions; generated content has unknown length
- Apply markdown rendering incrementally — the renderer must handle partial markdown gracefully (unclosed code fences, incomplete tables) without throwing errors or producing broken output

---

### 2.3 Preventing layout shift

**Content growing in height during streaming must not cause the conversation history above it to scroll unexpectedly.**

Implementation options, in preference order:

1. **Anchor scroll to bottom** — when the user is already scrolled to the bottom, auto-scroll as content grows. If the user scrolls up during generation, stop auto-scrolling and show a "scroll to bottom" affordance.
2. **Reserve minimum height** — assign a minimum container height for the current generation; grow downward from there.
3. **Fixed viewport** — the conversation area has a fixed height and scrolls internally; only the input area is fixed relative to the viewport.

Never re-flow previously rendered messages during streaming. Messages above the current generation must remain visually stable.

---

### 2.4 End-of-generation transition

**The transition from "generating" to "done" must be clear but not distracting.**

Minimum: remove the cursor/streaming indicator. The message simply stops growing.

Optional but recommended: briefly fade in the action affordances (copy, feedback thumbs, regenerate) after generation completes. Do not show them during streaming — they are not actionable mid-stream.

---

## 3 — Confidence and uncertainty signals

### 3.1 When to signal uncertainty

**Not all AI output carries equal confidence.** Surface uncertainty only when it is meaningful to the user — surfacing it on every response teaches users to ignore it.

Situations that warrant a signal:
- Factual claims about recent or rapidly-changing information ("as of my last update...")
- Synthesis across multiple conflicting sources
- Explicit user requests for verification ("is this accurate?")

Situations that do not warrant a routine signal:
- Formatting and transformation tasks (summarizing, rewriting, translating)
- Clearly bounded instruction-following tasks (code generation, list generation)

---

### 3.2 Visual language for uncertainty

**Prefer text over iconography for uncertainty signals.** Icons for "uncertain" do not have established conventions and require learned literacy.

Effective approaches:
- **Inline hedging text** in the assistant response ("I'm not certain, but...", "You may want to verify...")
- **Source citation** — linking to the source is stronger than an abstract confidence indicator
- **Soft visual treatment** — a slightly reduced opacity or italic style for flagged claims; use sparingly and only when combined with a text explanation

What to avoid:
- Warning icons or error-state colors on normal uncertainty — these alarm users disproportionately
- Percentage confidence values — they imply false precision and are not calibrated for user decision-making
- Uncertainty signals on every message — this trains users to disregard them

---

### 3.3 Distinguishing AI-generated from human-authored content

**When both AI-generated and human-authored content appear in the same interface, they must be visually distinguishable.** This is a trust and transparency requirement, not a style decision.

Minimum treatment: a label ("Generated", "AI-assisted", "Draft") in the message header or footer.

Where AI output is a first draft that a human will review and edit, consider a visual state that changes when the human has approved or modified it — moving from a "draft" to a "published" state.

Do not rely on color alone to make this distinction.

---

## 4 — Prompt and input UX

### 4.1 The input area

**The input area is the most important component in a chat interface.** It must be immediately obvious and continuously accessible.

Required properties:
- **Expandable textarea** — starts at 1–2 rows, grows to a maximum (4–6 rows is typical) before scrolling internally. Do not use a single-line input.
- **Clear send affordance** — a visible send button. Do not rely on Enter alone; keyboard-only users may need Enter for line breaks.
- **Keyboard shortcut** — `Enter` to send is the convention; `Shift+Enter` for line break within the message. Document it if non-standard.
- **Disabled state while generating** — the input should be disabled (or clearly indicate it) while the assistant is responding. Allow re-enabling on "stop generation."

---

### 4.2 Stop generation

**Always provide a way to stop generation mid-stream.** This is a usability and trust requirement — users need to feel in control.

The stop affordance must be:
- Visible immediately when generation begins
- Positioned near the input area (not in a menu or settings)
- Labeled clearly ("Stop", "Cancel generation") — do not use an ambiguous icon alone

After stopping, the partial response should remain visible. Do not clear it.

---

### 4.3 Contextual affordances

For products where context management matters (file attachments, selected text, conversation history):
- **File attachment** — use a clip icon or explicit "Attach" button; show attached files as chips in the input area before send
- **Context indicator** — when the model has a limited context window, a subtle indicator showing how much context is in use prevents user surprise when history is truncated
- **Slash commands** — if supported, trigger the command menu on `/` with a popover listing available commands; support keyboard navigation within the popover

---

## 5 — Error states

### 5.1 Error taxonomy

AI-specific errors are different from standard application errors. Treat them differently.

| Error type | Cause | User-facing framing |
|---|---|---|
| No response / timeout | Model unavailable, network failure | "Something went wrong. Try again." + retry |
| Rate limit | Too many requests | "You've reached the limit. Try again in [time]." |
| Content policy | Model refused the request | "I can't help with that." — no technical details |
| Degraded mode | AI feature unavailable; fallback active | "AI features are temporarily unavailable." |
| Partial failure | Generation stopped mid-response | Show partial content + "Generation stopped" label |

---

### 5.2 Retry patterns

**Every transient error must have a retry affordance in the message.** Requiring a user to re-type their message after a failure is a significant friction point.

Retry behavior:
- One-click retry: re-submits the same message without user re-entry
- Position the retry affordance on or immediately below the failed message, not in a global toast
- After retry, show the same generating state as an initial send
- After two consecutive failures, offer an alternative path ("Try a different question" or a support link)

---

## 6 — Feedback mechanisms

### 6.1 Per-response feedback

**Thumbs up / thumbs down (or equivalent) on each assistant message is the minimum feedback pattern.** It provides signal without requiring the user to articulate their feedback in text.

Implementation notes:
- Show feedback affordances after generation completes, not during
- Feedback is a one-time action per message — do not allow reversal in the same session unless the product requires it
- A selected state (thumbs filled, color change) confirms the action was registered
- Optional: on thumbs-down, offer a simple follow-up ("What went wrong?" with 3–4 options) — but make it skippable

---

### 6.2 Copy and regenerate

**"Copy response" and "Regenerate" are standard assistant message actions.** Include them in the action row that appears after generation completes.

- **Copy** — copies the full message text (markdown source, not rendered HTML) to the clipboard; show a brief "Copied" confirmation
- **Regenerate** — re-runs the same prompt; clears the current response and begins a new generation; use only for the most recent message (not historical)

Do not include regenerate on past messages — it creates confusion about which version is canonical.
