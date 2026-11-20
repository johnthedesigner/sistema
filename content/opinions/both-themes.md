---
id: opinion.both-themes
title: "One decision for both themes"
group: craft
default: "Each visual treatment is decided once and works in light and dark: what is neutral, what carries color, how strong a selection or message is. Dark values translate the decision; they don't change it."
description: "When to use: choosing any treatment in a system with light and dark themes, and reviewing components."
rules: ["quality.craft.both-themes", "color.dark.surface-steps"]
guides: ["guide.visual-language.overview#the-craft-baseline", "guide.color.architecture#stops-in-a-dark-theme"]
last_reviewed: 2026-11-20
---

## Why

A design system with two themes makes each decision twice unless it's careful. When a treatment is tuned in light and its dark value is filled in by mirroring stops, the two drift: a selection tint that is soft in light becomes a saturated band in dark, and a message fill becomes a heavy block. Deciding the treatment once ("selection is a neutral step with an accent edge") and translating it keeps both themes saying the same thing. Reviewing components in both themes side by side catches what translation misses.

## When you'd choose otherwise

A product with one theme. Or a deliberate difference, such as a brand block that is only shown in light.

## If you override it

Record the treatment that differs between themes, and why, in DECISIONS.md.
