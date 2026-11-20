---
system: stripe
category: foundations
topic: accessible-color
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://stripe.com/blog/accessible-color-systems
license: "Company blog post, no open licence; tier 3 (synthesis with attribution)"
tags: [color, accessibility, perceptual, contrast, palette]
---

# Stripe: designing accessible color systems

Source: "Designing accessible color systems", Stripe blog. https://stripe.com/blog/accessible-color-systems

- Goal: hand-picked, vibrant brand colors that also meet contrast requirements. Two common approaches failed them: pick colors and check (too much trial and error), and tint or shade from base colors (muddy, hard to tell apart).
- Shifting text colors darker until they passed made hues dark, muddy, and hard to distinguish.
- Three goals for the rebuilt system: **predictable accessibility**, **clear, vibrant hues**, and **consistent visual weight** (no hue looks more important than another at the same level).
- HSL lightness is not perceptual: blues look darker and yellows and greens lighter at the same value. They worked in a perceptually uniform space (CIELAB) with a custom tool that showed which colors are actually possible ("really dark yellow isn't a thing").
- Result: every hue follows the same lightness curve, so contrast is predictable by level. Any two colors at least five levels apart pass for small text, four for icons and large text. Text colors also pass on the lightest tint of any hue, used for highlighted sections.
- Badge example: at the lightest backgrounds the hues were hard to tell apart, so both background and text moved one level, keeping contrast without per-color tuning.
- Lesson stated: accessible does not mean vibrant; contrast standards say nothing about how distinct hues look.

## Relevance to Sistema

- Status chips should have equal visual weight across hues (the specimen's chip fills currently vary in chroma between hues).
- Supports contrast-placed ramps (Sistema's palette already places stops by contrast) and level-distance rules for pairs.
