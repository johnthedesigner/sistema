---
id: opinion.status-as-detail
title: "Status color as detail"
group: craft
default: "Inline messages, banners, and alerts sit on a neutral surface and show their status in the icon and the title. Tinted status fills are for small marks such as chips and badges."
description: "When to use: styling messages, notices, and anything that carries a status."
rules: ["quality.craft.status-as-detail"]
guides: ["guide.visual-language.overview#the-craft-baseline"]
last_reviewed: 2026-11-20
---

## Why

A colored icon and title on a neutral panel says "error" or "done" clearly, without turning every notice into an alarm. In a dark theme, large status fills become deep, saturated blocks; this keeps messages calm in both themes.

This is Sistema's default, not settled practice. Atlassian, Polaris, and Material use tinted message backgrounds, which work well, especially in light themes. Small marks like chips take a tinted fill either way.

## When you'd choose otherwise

You prefer tinted messages, as many systems do: check them in every theme. A blocking alert, such as data loss, can take a filled block, used rarely enough to keep its force.

## If you override it

Record which messages use a filled block, and why, in DECISIONS.md, and check them in both themes.
