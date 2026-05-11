# USAGE_GUIDE.md
# Design System Knowledge Base — LLM Usage Guide

**Version:** 1.0
**Created:** 2026-05-11
**Purpose:** This document tells you — an LLM operating in a session with access to this knowledge base — how to navigate, retrieve, interpret, and apply the content here. Read this file first in any session where you will be working with this dataset.

---

## What This Knowledge Base Is

This is a curated, structured repository of design system documentation, covering multiple major open-source design systems. It is optimized for use as LLM context in tasks related to design system creation, analysis, component specification, token generation, and design guidance.

It is a **living resource** — content is added and updated over time. Every content file carries metadata about when it was captured and what its current status is. You must use this metadata to reason correctly about the currency and relevance of what you read.

---

## How to Start Any Session

### Step 1: Read the Master Index

Begin every session by reading `_meta/INDEX.md`. This gives you a map of what systems and topics are available. Do not assume you know what is in the knowledge base — it grows over time and your training may not reflect its current state.

### Step 2: Read the Relevant Task Playbook

`_meta/TASK_PLAYBOOKS.md` contains task-specific instructions for common operations. Find the playbook entry that matches your current task and follow its retrieval strategy. If no exact match exists, use the closest analogous playbook as a starting point.

### Step 3: Retrieve Targeted Content

Use the index and playbook to identify which files are relevant to your task. **Do not read entire system directories speculatively.** Retrieve only the files you need. A well-formed query against the index should give you a short list of 2–6 files to retrieve for most tasks.

---

## Understanding the File Structure

### Stub Files

Many topics have an unversioned **stub file** at a stable canonical path (e.g. `carbon/guidance/foundations/colors.md`). These stubs contain only a `points_to` reference and do not contain content.

**When you encounter a stub file, you must follow the `points_to` reference** to retrieve the actual content. Do not treat the stub itself as content.

Example stub:
```markdown
---
type: stub
points_to: colors@2026-05-11.md
updated: 2026-05-11
---
This file is a redirect stub. Current version: colors@2026-05-11.md
```

Action: fetch `colors@2026-05-11.md` from the same directory.

### Versioned Files and Status

Every content file has a `status` field in its frontmatter:

- **`latest`** — This is the current canonical version. Use this for all tasks unless you have a specific reason to reference historical content.
- **`legacy`** — A previous version. Use only when explicitly asked to compare versions or when a specific historical state is needed.
- **`draft`** — Incomplete or unreviewed. Use with caution; note the draft status in any output.
- **`deprecated`** — The upstream system is no longer maintained. This content may still be valuable as reference but should be flagged as such in outputs.

**Never silently use a `legacy` or `deprecated` file as if it were current.** If you use non-latest content, say so.

### Content Types

Every file belongs to one of three content types. These are not interchangeable — they answer different questions.

| Content Type | Answers | Use for |
|---|---|---|
| `guidance` | Why and how | Design rationale, usage rules, accessibility, patterns, do/don't |
| `implementation` | What and where | API references, prop tables, install instructions, code examples |
| `asset` | Raw values | Token values, theme configurations, actual color hex codes, spacing scales |

**Match the content type to the question being asked.** If a user asks "should I use an outlined or filled button here?" — that is a `guidance` question. If they ask "what is the prop name for the button variant in Carbon React?" — that is an `implementation` question. If they ask "what is the hex value for Carbon's `$interactive-01` token?" — that is an `asset` question.

---

## Cross-System Reasoning

Many tasks require comparing or synthesizing across multiple design systems. Guidelines for doing this well:

### Choosing Which Systems to Reference

Each system has a "when to reference" note in its `_index.md`. Read this before selecting systems for a task. Consider:

- **Problem domain match:** An enterprise data application calls for different reference systems than a consumer mobile app
- **Completeness:** For token-related tasks, prefer systems with complete asset files over those with only guidance
- **Philosophy alignment:** Some systems are more prescriptive (Carbon, Lightning); others more flexible (Radix, Primer). Match to the user's apparent goals.

As a general starting point for cross-system tasks, 2–3 systems is usually sufficient. More than 4 risks diluting signal with noise.

### Noting Differences vs. Consensus

When synthesizing across systems, explicitly distinguish:
- **Consensus patterns** — things most or all systems do the same way (these are strong signals)
- **System-specific conventions** — things that vary by system (note the variation; don't flatten it)
- **Outliers** — approaches taken by only one system (may be innovative or may be idiosyncratic; note which)

### Avoid False Equivalence

Different systems use the same words to mean different things. "Primary color," "token," "variant," and "theme" all have system-specific meanings. When comparing across systems, always qualify which system a specific claim comes from.

---

## Working with Token and Asset Files

Asset files are structured JSON (or occasionally SCSS/CSS). When working with them:

- **Read the `_meta` block first** to confirm system, version, and retrieval date
- **Do not interpolate or estimate token values** — only report values that appear in the file
- **Note the naming convention** — Carbon uses `$variable-name` SCSS conventions; Material uses `md.sys.color.*` reference tokens; systems vary widely
- When generating token sets for a new design system, use asset files from reference systems as structural templates, not as values to copy verbatim

---

## What This Knowledge Base Is Not

- **It is not a real-time source.** All content was retrieved at a specific date, noted in frontmatter. Upstream systems may have changed since retrieval. If a user's question turns on very recent changes to a design system, note the retrieval date and suggest they verify against the current upstream source.
- **It is not exhaustive.** Not every component, pattern, or token from every system is captured. The Content Inventory in each system's `_index.md` shows exactly what is and is not present.
- **It is not a replacement for direct source access.** For high-stakes implementation decisions, always recommend the user verify against the live documentation or repository.

---

## Output Quality Standards

When producing outputs informed by this knowledge base:

1. **Cite your sources.** Reference the specific file(s) you drew from (e.g. "per Carbon's color guidance (`carbon/guidance/foundations/colors@2026-05-11.md`)..."). This allows the user to verify and locate the source.
2. **Note content type.** If you are drawing on `guidance` content to answer a question that might also have an `implementation` answer, say so and offer to look up the implementation detail.
3. **Flag gaps.** If a topic is not covered in the knowledge base for a given system, say so explicitly rather than extrapolating.
4. **Flag staleness.** If the most recent file for a topic has a retrieval date older than roughly 6 months, note this and recommend verification against the current upstream source.
5. **Preserve specificity.** Design systems are precise by design. Do not round, generalize, or paraphrase specific values (token names, spacing scales, type sizes, contrast ratios). Quote them exactly.

---

## Updating and Extending the Knowledge Base

If you are operating in a session that involves adding or updating content, follow the procedures in `_meta/MAINTENANCE.md`. Do not improvise file naming, frontmatter, or directory structure — the conventions in `SCHEMA.md` must be followed precisely to keep the knowledge base navigable and consistent.
