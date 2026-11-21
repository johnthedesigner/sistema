# Writing Sistema content

**Status:** adopted 2026-11-20 (owner). Applies to everything a Sistema user reads: guides, plays, opinions, rules, file format pages, tool docs, and the site.

Sistema is for almost any digital product and almost any designer or engineer. Write so an experienced person on a different kind of project finds it general, justified, and easy to disagree with for a reason.

## 1. Short and plain

- Hemingway: short sentences, common words, no throat-clearing.
- Lead with the point. Cut intros that restate the title.
- One idea per paragraph. Prefer a list or table to a long paragraph.
- No em dashes, no exclamation marks, no hype.

## 2. Pass the three-product test

Every claim and example must make sense for at least three kinds of product: a data-heavy tool, a consumer or mobile app, and a content or marketing site. If it fits only one, give examples from several, or say it's one case.

## 3. Say how strong each claim is

Never blur these:

| Strength | What it needs | How it reads |
|---|---|---|
| Required | A standard, through the rules registry | "Text meets the project's contrast rule." |
| Broad practice | Two or more independent systems, or research, named | "Material, Carbon, and Polaris all…" |
| Sistema's default | Its reason, when you'd choose otherwise, and how to override | "Sistema starts with… because…" |
| The project's choice | Options and how to choose | "Choose… if…" |

One project's review can suggest a default. It never establishes broad practice.

## 4. Give reasons an expert would accept

Perception, accessibility, consistency, maintenance, cost of change. Never "it looked wrong in a review". Where the honest reason is taste, say so.

## 5. Keep history internal

How Sistema reached a position (reviews, runs, rejected options, decision or finding numbers, the owner's reactions) stays in `docs/v2`. User-facing content states the position and its reason.

## 6. Examples illustrate; they don't rule

Worked examples use Relay for now. They show the inputs, the reasoning, and the result. They never present Relay's choices as right for other products, and no general rule exists only because of Relay.

## 7. No made-up jargon

Use the words practitioners already use. Coin a term only when nothing exists, and define it on first use. Never use terms invented during Sistema's own development, internal IDs, or names from working sessions.

## 8. No arguing with past mistakes

A pitfall goes in "Failure modes" only if it's common in the field. Don't write lines aimed at something Sistema once got wrong.

## 9. Values come from tools and rules

Specific numbers come from Sistema's tools or the rules registry, or appear as one example in context.

## Checking

Before content goes to the owner:
- Read it against this page.
- `npm run check:content` flags internal history: decision and finding numbers, "the owner", "reference run", and Relay outside a worked example.
