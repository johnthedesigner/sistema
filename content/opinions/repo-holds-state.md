---
id: opinion.repo-holds-state
title: "Your repo holds the state, so you can stop anytime"
group: method
default: "Progress lives in `sistema.json`, and a short note in AGENTS.md points the next session back to it."
description: "When to use: understanding how Sistema resumes work across sessions, or why it writes to AGENTS.md."
rules: ["project.state.pointer", "project.state.valid"]
guides: []
last_reviewed: 2026-11-16
---

## Why

Building a design system takes more than one session. Agents forget everything between sessions. Your repo doesn't.

## What breaks without it

A new session can't tell what's finished, what's approved, or what comes next. It starts over, or guesses. Picking up with "keep going" depends on these files.
