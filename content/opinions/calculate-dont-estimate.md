---
id: opinion.calculate-dont-estimate
title: "Calculate, don't estimate"
group: process
default: "Anything a tool can compute, such as palettes, contrast, and type scales, comes from the tool rather than the agent's judgment."
description: "When to use: understanding why agents call Sistema's tools instead of picking values themselves."
rules: ["color.ramps.from-tool"]
guides: []
last_reviewed: 2026-11-16
---

## Why

Agents produce plausible numbers that turn out to be wrong. A contrast ratio that looks right isn't the same as one that was measured. Tools give the same answer every time, and their results can be checked.

## When you'd choose otherwise

You have fixed values from a brand guide. Those are recorded as decided. The tools still check them.

## If you override it

Values chosen by hand are allowed, but they still go through the contrast tool. The decision log records that they were chosen by hand.
