---
id: opinion.two-tiers
title: "Two tiers: primitive and semantic"
group: structure
default: "Tokens have a primitive tier of raw values and a semantic tier of roles, with a component tier added only when components need it."
description: "When to use: deciding how to structure tokens."
rules: []
guides: ["guide.tokens.architecture"]
last_reviewed: 2026-11-16
---

## Why

Primitives hold the palette. Semantic tokens say what each value is for. Code uses the semantic tier, so changing a theme or a brand color doesn't touch components.

## When you'd choose otherwise

A very small project, with one theme and a handful of colors, can use semantic tokens only.

## If you override it

Adding themes later means splitting values out into a primitive tier then.
