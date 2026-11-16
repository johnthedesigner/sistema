---
id: opinion.tokens-before-components
title: "Tokens come before components"
group: method
default: "Components are built only after the tokens they use exist and pass their checks."
description: "When to use: deciding whether to start on components before colors, type, and spacing are settled."
rules: ["tokens.usage.no-raw-values"]
guides: ["guide.tokens.architecture"]
last_reviewed: 2026-11-16
---

## Why

A component is a set of decisions about color, type, spacing, and shape. If those decisions don't exist yet, the component makes them up. The made-up values then spread to every screen that uses it.

## What breaks without it

Components built first use raw values, such as `#3b82f6` or `16px`. The token coverage audit flags every one of them, so the audit stops being useful. Changing a theme later means editing each component by hand.
