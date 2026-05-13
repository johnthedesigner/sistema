---
category: principles
topic: color-architecture
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [color, tokens, dark-mode, accessibility, tonal-palettes, step-scales, named-palettes, synthesis]
sources:
  - kb/reference/design-systems/material/guidance/foundations/color-system
  - kb/reference/design-systems/material/guidance/foundations/color-roles
  - kb/reference/design-systems/radix/guidance/foundations/color-system
  - kb/reference/design-systems/carbon/guidance/foundations/color-system
  - kb/reference/design-systems/ant-design/guidance/foundations/color-system
  - kb/reference/foundations/color/perceptual-models
  - kb/reference/foundations/color/contrast-and-accessibility
  - kb/reference/standards/wcag/color-contrast
---

# Color Architecture — Synthesis

## Overview

Every design system color architecture solves the same core problem: how to give any surface a foreground color it can safely and consistently read. The specific approach — how many tones, how the palette is generated, what the roles are named — is secondary. The non-negotiables are the floor; everything else is a set of tradeoffs that map to your product's actual context.

This document covers what a color system must do, the four major approaches mature systems have converged on, how to choose between them, and how dark mode changes the picture.

---

## What every color system requires

Regardless of architecture, a complete color system must address all four of these:

**1. Semantic roles with accessible pairings**
Every surface in the UI needs a foreground color pre-assigned at the token level. A button background token and its text token are a pair — they should be defined and verified together. This is not an optional design choice; it is what makes accessibility auditable. When components hardcode colors rather than consuming role pairs, accessibility becomes per-component guesswork.

**2. Accessible contrast for all pairings**
The WCAG AA minimum is 4.5:1 for normal text, 3:1 for large text and UI components (WCAG 1.4.3, 1.4.11). This is the legal standard for most regulated products. APCA (the candidate for WCAG 3.0) provides a more perceptually accurate model and is especially important for dark mode where WCAG 2.x overstates contrast for near-black pairs. Use WCAG 2.x for compliance; use APCA to catch false positives (passing combinations that are visually unreadable).

**3. Light and dark variants designed separately**
Dark mode is not an inversion of light mode. Naive lightness inversion produces harsh contrast, ungradable surfaces, and saturated colors that glow. Every semantic role needs an explicitly designed dark value. The tonal shift approach (see below) produces the most structurally sound dark mode, but any approach that treats dark mode as a first-class design problem is better than inversion.

**4. The never-hardcode principle**
No component should reference a raw color value. This is what makes theming, dark mode, and accessibility audits tractable. Any hex value in a component style is technical debt. The color system is only as useful as its adoption in the component layer.

---

## The four architectural models

### Model 1 — Tonal palettes

**How it works:** A small number of key colors (brand primary, secondary, accent, neutral) are used to generate a full set of tones from 0 (black) to 100 (white), using a perceptually uniform color space (typically HCT or OKLab). Semantic roles are assigned specific tones. Dark mode flips the tone assignment: a role that uses tone 40 in light mode uses tone 80 in dark mode.

**Key property:** Tone differences directly predict contrast. In the HCT color space (which uses L\* as its tone dimension, the same measure WCAG uses), a tone difference of 50 guarantees WCAG AA for small text; a difference of 40 guarantees AA for large text and UI components. This means a well-structured tonal palette is self-certifying — you don't need to verify every pair individually if the tone assignments are correct.

**What it enables:**
- Algorithmic theme generation from a single brand hex value
- Personalized color schemes (dark/light/high-contrast) with no additional design work
- New colors added to the system automatically inherit the accessibility guarantee
- Runtime dynamic color (different users, different colors, still accessible)

**What it costs:**
- Requires a perceptual color space library for palette generation (material-color-utilities for HCT; CSS oklch natively, or a small library)
- The tone vocabulary is unfamiliar to designers accustomed to HSL or hex — requires a shift in workflow
- Palette generation is algorithmic; brand colors with extreme hue/chroma may produce system colors that feel unexpected

**Use when:** You want algorithmic accessibility guarantees. You're building a product that needs strong personalization or multiple brand color themes. You're targeting a platform where material-color-utilities is available. You care more about the system being correctly structured than about designer control over specific steps.

---

### Model 2 — Step scales

**How it works:** Each color in the palette is a fixed number of steps (typically 12), from near-white to near-black, designed for perceptual evenness within each scale. Steps have defined semantic ranges: steps 1–2 are backgrounds, 3–5 are component interactive backgrounds, 6–8 are borders, 9–10 are solid fills, 11–12 are accessible text.

**Key property:** Developers can predict what a step does without memorizing role names. Step 9 of any color is always the solid fill; step 11–12 is always readable text. This makes the system learnable by pattern rather than by memorization.

**What it enables:**
- High composability — any component can apply any color to any role using the same step semantics
- Works well for themeable component libraries (a library consumer picks an accent color; all components automatically use the right steps)
- Per-component color context via inheritance (applying `color="red"` to a card automatically updates all child components within it)
- Natural fit for systems where users choose their own accent color at deploy time

**What it costs:**
- Step numbers don't communicate intent to non-developers. Semantic role names (`color-action-primary`) communicate meaning that `color-9` does not.
- Components that use a step scale must know their own context to pick the right step — this couples components to their background assumptions
- Cross-component consistency requires discipline: if one component uses step 9 for primary actions and another uses step 8, the system looks inconsistent

**Use when:** You're building a developer-oriented library where ergonomics and composability matter. You want consumers to choose their own accent color. You have a strong component model where each component fully owns its own color context.

---

### Model 3 — Named palettes

**How it works:** A curated set of named colors (12–24 named hues, each with a step scale) forms the primitive layer. Semantic tokens map named palette steps to roles: brand color, success, error, warning, neutral text, surface, etc. The palette is stable; only the semantic mapping changes between themes or brands.

**Key property:** Explicit brand control. Designers choose specific, named colors — not derived values. The palette communicates a brand in terms designers can reason about and stakeholders can review.

**What it enables:**
- Direct correspondence between brand color specifications and token values
- Multiple distinct brands within one system (each brand picks different semantic mappings over the same palette)
- Enterprise context: the restraint of a fixed palette creates visual hierarchy in data-dense UIs by limiting expressive color to functional roles
- Stable audit trail — you know exactly which palette step maps to each role

**What it costs:**
- Palette must be maintained as the brand evolves — adding or removing named colors requires coordinating the semantic layer
- No algorithmic accessibility guarantee; each semantic mapping must be verified independently
- A large named palette (Ant Design's 120 colors × 10 steps = 1,200 values) carries non-trivial maintenance overhead
- Less suited to runtime dynamic color or user-selectable themes

**Use when:** You're building for a context with strong explicit brand requirements (enterprise software, multi-brand platforms). The design team has specific, well-reasoned color choices they want preserved exactly. Expressive color should be deliberately limited to preserve the signal value of functional colors.

---

### Model 4 — Contextual / layered tokens

**How it works:** Tokens are defined relative to the surface layer they sit on, not as absolute color values. A `layer-01` token defines the first elevation above the page background; `layer-02` is the next elevation; components on `layer-01` use `layer-01-hover` for interactive states. The token vocabulary includes explicit layer slots so components automatically adapt their appearance when placed in different depth contexts.

**Key property:** Automatic surface adaptation. A card component placed on a page background looks different (and correct) when the same card is placed inside a modal — because the modal background is on a different layer, and the card reads from the layer tokens rather than absolute values.

**What it enables:**
- Dense UIs with multiple stacked surfaces (data tables, nested panels, side-by-side editors) maintain visual hierarchy automatically
- Components don't need to know what surface they're on — they just consume layer-relative tokens
- Works across both light and dark themes without per-mode component logic

**What it costs:**
- Component authors must reason about layer context rather than absolute roles — a higher cognitive model
- The layer count must be decided and held consistent (typically 3–4 layers; more becomes unmaintainable)
- Less suited to expressive/branded contexts where designers want full control over surface tones

**Use when:** You're building a data-dense application with many stacked surfaces (enterprise dashboards, admin tools, IDEs, code editors). Visual hierarchy from depth is more important than expressive color. You want components to compose correctly at any depth without per-context style overrides.

---

## The decision framework

Start here. These three questions map product context to architectural approach.

**Question 1: How much does algorithmic accessibility matter vs. brand control?**

| If you need… | Lean toward |
|---|---|
| Algorithmic AA guarantees, dynamic theming | Tonal palettes (Model 1) |
| Explicit brand-specified colors preserved exactly | Named palettes (Model 3) |
| Developer ergonomics, consumer-chosen accent | Step scales (Model 2) |

**Question 2: How many surface layers does the UI have?**

| If the product has… | Lean toward |
|---|---|
| Rich layering: modals, drawers, panels, nested tables | Contextual tokens (Model 4), possibly combined with another model |
| Standard layering: page, cards, dialogs | Any model; semantic surface roles are sufficient |
| Minimal layering: mostly flat, content-forward | Step scales or tonal palettes; layer tokens add complexity without value |

**Question 3: Will different users or brands have different color themes?**

| If the system needs… | Lean toward |
|---|---|
| Runtime user-selectable themes (like a wallpaper color picker) | Tonal palettes (Model 1 — only algorithmic approach supports this) |
| Multiple predefined brand themes | Named palettes (Model 3) or tonal palettes |
| Single brand, single theme | Any model |

**Models can be combined.** The most common combination is a step scale (Model 2) for accent colors with contextual/semantic tokens (Model 4) for surfaces. Tonal palettes work well as the generative layer underneath a named semantic role set (Model 3).

---

## The non-negotiable floor

These are constraints, not recommendations. Any color system that doesn't satisfy these is incomplete.

**Contrast minimums (WCAG AA):**
- Normal text on any background: ≥ 4.5:1
- Large text (≥ 18pt or ≥ 14pt bold) and UI components on any background: ≥ 3:1
- Verify these in both light and dark mode — the ratio calculation is luminance-based, not perceptual; dark mode needs separate verification

**Defined foreground for every background:**
- Every surface token must have a corresponding foreground token pair pre-verified for contrast
- No component should be designed without knowing its foreground color at the token level
- The `on-*` pattern (or `foreground`, or `contrast`) — naming the foreground counterpart to a surface — is the mechanism that makes this visible in the token names

**No raw values in components:**
- Components consume tokens. Not hex values, not HSL declarations, not inline `rgba()`.
- This is verifiable: search the component layer for any hardcoded color value; each one is a violation

**Feedback colors are reserved:**
- Success, error, warning, and info colors carry meaning. Using these hues for decorative or branding purposes erodes the signal. Reserve them.

---

## Dark mode: the tonal shift

The most reliable approach to dark mode — supported by the underlying science of how human vision perceives dark surfaces — is **tonal mirroring**, not inversion.

The logic: in HCT (and approximately in OKLab), a tone value represents perceived lightness from 0 (black) to 100 (white). The midpoint is 50. If a role uses tone 40 in light mode (which sits 60 units from the white background at tone 100), its dark-mode counterpart should sit approximately 60 units from the dark background (typically tone ~10). That produces tone ~70, not tone 60 (which would be the naive "100 - 40" inversion).

In practice: use the tone-pair structure of the reference systems as a guide.

| Light mode tone | Dark mode tone | Notes |
|---|---|---|
| 40 (interactive primary) | 80 | High contrast against near-black surface |
| 30 (container) | 90 | Tinted background, low-saturation |
| 10 (on-container) | 90 | Text on tinted container |
| 99 (surface) | 10 | Near-black surface |
| 10 (on-surface) | 90 | Primary text on surface |

These are starting points, not rigid rules. Verify contrast in dark mode explicitly — tonal relationships give you structural guidance, but luminance ratios must still be checked.

**Why naive inversion fails:**
- True black backgrounds (0, 0, 0) create maximum saturation contrast that strains peripheral vision
- Fully saturated colors appear to glow on dark backgrounds — saturation must be reduced as backgrounds darken
- Interactive state tokens (hover, focus, active) that work as "slightly lighter/darker" in light mode require redesign for dark mode, not just inversion

**Practical dark mode minimum:**
- Design at least three surface tiers: base surface (~tone 10–12), raised surface (~tone 14–16), elevated surface (~tone 18–20)
- Reduce chroma on colored backgrounds in dark mode — tinted surfaces at full chroma look oversaturated
- Verify focus ring visibility on dark surfaces — a blue focus ring at 3:1 against white may not clear 3:1 against a dark neutral

---

## Neutral palette design

The neutral palette (grays, background surfaces) is typically where dark mode and surface layering decisions are most visible. Several decisions have real consequences:

**Neutral chroma (tinted vs. pure gray):**
A pure achromatic neutral (zero chroma) reads as clinical and sterile. A slightly warm neutral reads as approachable; a slightly cool neutral reads as technical and precise. The neutral chroma in a design system communicates brand character even when no brand color is visible.

Systems with complementary grays (Radix's mauve, slate, sage, olive, sand) pair the neutral chroma with the accent hue, reinforcing visual harmony at the lowest-chroma layer of the system. This is subtle but cumulative — in dense UIs with a lot of neutral surface, the slight tint of the gray family becomes significant.

**Deciding:**
- Warm neutral (slight yellow/red chroma): approachable, physical, human contexts
- Cool neutral (slight blue/cyan chroma): technical, precision, data, infrastructure
- Pure neutral: universal, no personality — safest for multi-brand systems where neutrals must work with many possible accent colors

**Surface tier range:**
The lightest and darkest surfaces in your system define the usable contrast headroom. A white background at tone 100 and a black-tinted surface at tone 10 give maximum headroom. A light gray base at tone 97 and a dark surface at tone 16 give less — this compresses the available contrast range and makes accessible dark mode harder.

The practical implication: if your design calls for a warm off-white background (common in editorial/publishing contexts), account for the reduced headroom by choosing text tones with more margin than you'd need on pure white.
