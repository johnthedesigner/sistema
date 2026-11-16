---
id: opinion.oklch-palettes
title: "Palettes are generated in OKLCH"
group: structure
default: "Color ramps are generated in the OKLCH color space."
description: "When to use: deciding how color ramps are built."
rules: ["color.ramps.from-tool"]
guides: ["guide.color.palette-generation"]
last_reviewed: 2026-11-16
---

## Why

In OKLCH, equal steps in lightness look equal to the eye. That makes contrast predictable across hues, so a step that works for blue works for green.

## When you'd choose otherwise

You have fixed brand ramps that must stay exactly as they are.

## If you override it

Your ramps are mapped into the system as they are, and contrast is checked pair by pair.
