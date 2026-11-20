---
id: opinion.radius-by-size
title: "Radius scales with the element"
group: craft
default: "Small elements get a smaller radius, containers a larger one, and floating layers the largest; a nested radius equals the outer radius minus the padding."
description: "When to use: setting the radius of controls, containers, and floating layers."
rules: ["shape.radius.hierarchy", "quality.craft.nested-radius"]
guides: ["guide.visual-language.overview#the-craft-baseline", "guide.shape.architecture#component-consistency"]
last_reviewed: 2026-11-20
---

## Why

The same radius on a checkbox and a dialog makes the small things look blobby or the large things look sharp. Scaling radius by size keeps corners looking consistent to the eye. Geist ties radius to its elevation roles, and Radix scales one radius setting differently per component. Inner corners that follow the outer corner minus the padding keep nested shapes parallel.

## When you'd choose otherwise

A deliberately uniform shape language is part of the brand, for example all-square or all-pill.

## If you override it

Record the uniform radius in DECISIONS.md. The hierarchy rule still requires the full radius to be limited to the families the direction names.
