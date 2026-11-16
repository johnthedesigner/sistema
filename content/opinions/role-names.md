---
id: opinion.role-names
title: "Tokens are named for their job"
group: structure
default: "Token names follow one consistent pattern that states the role, such as `bg-primary` rather than `bg-blue-600`."
description: "When to use: naming tokens, or deciding what to call a new one."
rules: ["tokens.naming.role", "visual-language.design-md.roles-not-values"]
guides: ["guide.tokens.architecture"]
last_reviewed: 2026-11-16
---

## Why

A name that states the role tells people and agents when to use the token. A name that states the value says nothing about intent, and it becomes a lie when the value changes.

## When you'd choose otherwise

Your existing token names are value-based and widely used.

## If you override it

Keep the old names as aliases of new role names, so existing code works while new code uses roles.
