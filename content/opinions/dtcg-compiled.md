---
id: opinion.dtcg-compiled
title: "Tokens are written in DTCG and compiled"
group: structure
default: "Tokens are written as DTCG JSON and compiled to CSS custom properties, and the compiled output is never edited by hand."
description: "When to use: deciding where token values live and how they reach your code."
rules: ["tokens.source.dtcg"]
guides: ["guide.tokens.architecture"]
last_reviewed: 2026-11-16
---

## Why

DTCG is an open format that design tools and build tools can both read. Writing values in one place and compiling them keeps every output in sync. CSS custom properties work in any web stack and can switch themes at runtime.

## When you'd choose otherwise

Your team already has a token source in another format, or you're building for a native platform.

## If you override it

Sistema's steps map onto your format more loosely, and some checks may not run. Record the format in DECISIONS.md so the agent writes to it.
