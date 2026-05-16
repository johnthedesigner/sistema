---
category: principles
topic: visual-quality-signals
content_type: synthesis
status: latest
retrieved: 2026-05-15
tags: [quality, visual-language, ai-output, oklch, color, anti-patterns, synthesis]
note: >
  These quality criteria are interpreted through the lens of design system building —
  token value decisions, component style defaults, and visual language establishment.
  They are NOT about individual UI implementation choices. Apply them when generating
  token values, writing component specs, or evaluating visual direction artifacts.
---

# Visual Quality Signals — Synthesis

## How to use this document

This document gives AI agents the vocabulary to evaluate whether design system decisions — token values, component defaults, visual direction — are specific and intentional versus generic defaults. It applies at the point where values are chosen, not after code is written.

Read this document before any step that generates token values or establishes visual language. The quality signals here describe failure modes that are invisible to functional correctness checks but immediately visible to a trained designer.

---

## 1 — The AI slop problem in design systems

AI agents generating design system tokens face a structural bias toward safe, category-obvious choices. The bias is not random — it clusters around specific defaults that appear frequently in training data:

- **Surface colors**: near-white with slight warm or cool tint (e.g., `#F8F9FA`, `#FAFAFA`)
- **Primary colors**: medium blue (`#3B82F6`, `#2563EB`, `#0070F3`)
- **Border radius**: 6–8px on all components uniformly
- **Typography**: Inter or Roboto, regular weight body, semi-bold headings
- **Shadows**: `0 1px 3px rgba(0,0,0,0.1)` on cards
- **Type hierarchy**: size-only differentiation, no weight or tracking variation

These defaults are not wrong in isolation. The problem is that they are the output of a system trained to minimize conflict, not to make specific aesthetic decisions. The result reads as "designed by AI" — not because the values are bad, but because they bear no relationship to the product's specific character.

**The test:** Could these token values have come from any SaaS product? If yes, the design system has no visual identity.

---

## 2 — The AI slop test

Apply this test to generated token values before accepting them.

### 2.1 — First-order reflexes (category-obvious choices)

These are the most common AI defaults — the first thing a model reaches for in each category:

| Category | First-order reflex | Signal |
|---|---|---|
| Primary color | Medium blue (hue 220–240°, medium saturation) | Acceptable for generic B2B; wrong for everything else |
| Surface color | `#FAFAFA` or `#F8F9FA` (warm near-white) | Signals "default React app" |
| Border radius | 6–8px applied uniformly to all components | No radius hierarchy = no shape language |
| Shadow | `0 1px 3px rgba(0,0,0,0.1)` | Zero elevation personality |
| Type weight | 400 body, 600 heading | No weight variation = flat hierarchy |
| Neutral | 9-stop gray ramp with no hue tinting | Zero brand reinforcement in neutral space |

**A token set containing more than two of these simultaneously fails the first-order reflex test.**

### 2.2 — Second-order traps (predictable aesthetic families)

These avoid first-order reflexes but land in a different predictable pocket — usually one that has been popularized by a specific tool or aesthetic trend:

| Trap | What it looks like |
|---|---|
| "Dark sophisticated" | Near-black surface (`#0F0F0F`), muted gold or amber accent, elevated shadows everywhere |
| "Startup clean" | Pure white surface, bright blue or violet primary, heavy use of `font-weight: 700` |
| "Editorial luxury" | Serif display font, black-and-white palette with one warm accent, excessive tracking on uppercase labels |
| "Brutalist minimal" | High-contrast black/white, monospace everywhere, border-only buttons, zero radius |
| "Friendly SaaS" | Rounded corners (12–16px), pastel primaries, generous padding, illustrated empty states |

**Second-order traps are not wrong as aesthetic directions. They are a problem when chosen without connecting to the specific product's context.** A product positioned as "precise and technical" that outputs "dark sophisticated" tokens has not been positioned — it has been aesthetically assigned.

---

## 3 — Absolute bans for design system token decisions

These patterns are banned regardless of the aesthetic direction. They indicate either a structural error in the token system or a reflexive default that survives review because it's hard to name.

### 3.1 — Token-level bans

- **Side-stripe accents as a design pattern** — applying `border-left: 4px solid [primary]` as a component style token. This is a 2012 UI pattern that signals no intentional surface depth approach.
- **Gradient text as a default** — `background-clip: text` gradient fills as the primary heading style. This is decoration substituting for typographic hierarchy.
- **Glassmorphism defaults** — `backdrop-filter: blur(20px)` with semi-transparent surfaces as the standard surface treatment. Not banned as a deliberate choice; banned as a reflex.
- **Identical card grids** — all card components sharing the same padding, radius, shadow, and border. Cards should have differentiated density levels for different content types.
- **Modal-first interactions** — defaulting all confirmations, secondary content, and contextual information to modal dialogs. Not a token decision per se, but a pattern that the component token system should not be architected to encourage.
- **Color-only state signaling** — using only color to communicate interactive state (hover, selected, error). Always pair color with at least one other signal (border, icon, label, shape).

### 3.2 — Color token bans

- **Hardcoded opacity-derived colors** — `rgba(primary, 0.1)` as a container color. Container colors must be specific token values, not calculated opacity reductions of the primary.
- **Same hue for primary and secondary** — primary and secondary role colors that differ only in lightness. They must carry distinct hues.
- **Pure black or pure white as a surface token** — `#000000` or `#FFFFFF` for default background surfaces. Production surfaces are off-black or off-white with intentional hue temperature.
- **Neutral ramp without hue temperature** — a gray ramp that contains no chromatic influence from the brand. Neutral palettes should have slight hue affinity with the primary color.

---

## 4 — OKLCH color commitment levels

This framework establishes how much chromatic presence a design system's color palette should have. The level is driven by the product's brand stance and is a deliberate decision, not a default.

Apply this framework when generating color tokens. The level must match the positioning brief.

### Level 1 — Restrained

**Chroma budget:** 0–15 for all surface and neutral tokens; 30–50 for primary action colors only.

**Character:** Color is functional, not expressive. Surfaces read as neutral. The primary color appears only at interactive elements. No chromatic variation in the neutral ramp.

**Appropriate for:** Dense data tools, medical/financial applications, enterprise admin interfaces, developer tools where color carries semantic meaning (error/success/warning) and must not be decorative.

**Token signal:** Surface backgrounds in OKLCH have C < 5. Border colors have C < 8. Only primary and semantic role colors exceed C 20.

### Level 2 — Committed

**Chroma budget:** 8–20 for surfaces; 40–70 for primary; moderate hue presence in neutral ramp.

**Character:** Color is clearly intentional but not dominant. Surfaces have warmth or coolness. The neutral ramp has a consistent hue temperature that reinforces the primary. Hovering over the page, you can name a color temperature.

**Appropriate for:** Most SaaS products, productivity tools with expressive branding, consumer-facing web applications with moderate personality.

**Token signal:** Surface backgrounds in OKLCH have C 8–15. Neutral ramp has consistent hue affinity with primary. Secondary colors are meaningfully distinct from primary.

### Level 3 — Full palette

**Chroma budget:** 15–30 for surfaces; 60–90 for primary; expressive secondary and accent colors.

**Character:** Color is a primary design element. Multiple distinct hues are in simultaneous use. Surface colors have clear personality. The system has a chromatic signature that persists even in muted contexts.

**Appropriate for:** Consumer apps with strong brand personality, marketing sites, creative tools, products where visual delight is a core value proposition.

**Token signal:** Surface backgrounds in OKLCH have C 15–25. Multiple chromatic roles (primary, secondary, accent) use distinct hues with intentional harmonic relationships. Container and surface-raised colors carry visible hue.

### Level 4 — Drenched

**Chroma budget:** 25+ for surfaces; maximum chroma for primaries; high-saturation treatment across the system.

**Character:** Color is a dominant, assertive presence. Backgrounds are saturated. Contrasts are high-chroma. The product makes a strong color statement that cannot be missed.

**Appropriate for:** Bold brand experiences, special-purpose marketing pages, products where visual intensity is part of the brand promise. Requires exceptional care with accessibility — WCAG must be verified for every surface pairing.

**Token signal:** Surface backgrounds in OKLCH have C 25+. Must verify every text/background pairing manually. Dark mode at this level typically cannot use standard tonal shift logic — requires complete re-specification.

---

## 5 — Applying these signals in plays

### When generating color tokens:
1. Identify the appropriate OKLCH commitment level from the positioning brief before choosing any value.
2. Run the first-order reflex check on the proposed primary color: is it medium-blue or near-white? If so, justify it explicitly or choose differently.
3. Verify that surface, neutral, and container colors are consistent with the commitment level.
4. Check against the color token bans list.

### When generating type scale tokens:
1. Check that weight, size, and tracking vary across roles — not just size alone.
2. Verify that the type choices don't fall into a second-order trap (e.g., "editorial luxury" serif + all-caps labels when the product is a dense data tool).

### When generating shape tokens:
1. Check that radius is not uniform across all components — there must be a hierarchy (inline elements use smaller radius than containers).
2. Verify the radius personality matches the positioning brief.
3. Check against the side-stripe ban — if the system defaults to border-left accents, reconsider the surface depth approach.

### When reviewing a style-preview.html artifact:
Ask: could these visual decisions have come from any product, or do they reflect specific choices made for this product? If the answer is "any product," return the artifact with specific questions about what should be different.
