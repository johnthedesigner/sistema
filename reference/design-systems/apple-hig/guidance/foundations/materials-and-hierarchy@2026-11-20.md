---
system: apple-hig
category: foundations
topic: materials-and-hierarchy
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://developer.apple.com/design/human-interface-guidelines/materials
license: "Apple developer documentation; no open licence; tier 2 (synthesis only)"
tags: [materials, hierarchy, layout, layering, vibrancy]
---

# Apple Human Interface Guidelines: materials and visual hierarchy

Sources: https://developer.apple.com/design/human-interface-guidelines/materials (change log to September 2025), https://developer.apple.com/design/human-interface-guidelines/layout

## Two layers: controls and content

- Apple separates a **functional layer** (controls and navigation, in Liquid Glass) that floats above a **content layer**. The distinction itself is the hierarchy: people can tell what they act with from what they read.
- Use the floating material sparingly, only for the most important functional elements; overuse distracts from content. Don't use it in the content layer.
- Within the content layer, "standard materials" of different thickness create distinction: thicker (more opaque) for legibility, thinner (more translucent) to keep context visible.
- **Choose a material by meaning and use, not by the color it happens to produce.**
- Labels have several vibrancy levels (default, secondary, tertiary, quaternary) named by how much contrast they have against the background; quaternary is too faint on thin materials. visionOS uses label, secondary label, and tertiary label (inactive, only where legibility isn't needed).

## Layout and hierarchy

- Order content by importance: most important near the top and leading side.
- Align to make scanning easy; indentation conveys subordination.
- Group related items using negative space, container shapes, **or** separator lines (named as alternatives).
- Progressive disclosure keeps layouts clean.
- Differentiate controls from content.

## Relevance to Sistema

- Text tones as a named ladder of contrast levels (craft baseline 3).
- Materials and surfaces chosen by role, not by appearance (D24).
- Space, containers, and lines as alternative grouping tools; the choice is per context.
