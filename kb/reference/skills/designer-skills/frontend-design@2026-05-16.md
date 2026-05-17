---
category: skills
topic: frontend-design
content_type: reference
status: latest
retrieved: 2026-05-16
source_url: https://github.com/julianoczkowski/designer-skills/tree/main/frontend-design
license: Apache 2.0
tags: [design-quality, frontend, aesthetic-philosophies, mobile-first, dark-mode, ai-agents]
---

# designer-skills — /frontend-design

## What it is

The `frontend-design` skill builds distinctive, production-grade frontend interfaces guided by named aesthetic philosophies. It mandates codebase exploration before writing any code and commits to a named aesthetic direction before implementation begins.

---

## 8 aesthetic philosophies

Each philosophy defines concrete implementation parameters for typography, color, layout, spacing, motion, and detail treatment:

### Dieter Rams (Functionalist)
Less but better. Nothing decorative without function.
- **Typography**: Clean sans-serif (Helvetica Neue, Suisse Intl, Akkurat). Tight letterspacing on headings, generous line height on body.
- **Color**: Restrained. Monochromatic with a single functional accent. Color is information, not decoration.
- **Layout**: Strict grid. Clear functional hierarchy.
- **Motion**: Minimal. Purposeful transitions only (state changes, reveals). No decorative animation.
- **Details**: Subtle borders over shadows. Rounded corners used sparingly.

### Swiss / International Typographic
Objectivity through structure. The grid is sacred.
- **Typography**: Strong sans-serifs (Neue Haas Grotesk, Univers). Dramatic scale contrast. All-caps subheadings with generous letterspacing.
- **Color**: High contrast. Black, white, and one primary color. Bold color blocks as compositional elements.
- **Layout**: Rigid multi-column grid. Asymmetric balance. Alignment across elements is non-negotiable.
- **Details**: Rules (horizontal lines) as structural elements. No gradients. No shadows. Flatness is the point.

### Japanese Minimalism (Ma)
Negative space is content. Quiet over loud.
- **Typography**: Thin-weight sans-serifs or elegant serifs (Cormorant). Line height 1.8–2.0.
- **Color**: Muted naturals (warm greys, stone, sage). Near-monochrome.
- **Layout**: Asymmetric but balanced. Large empty areas are intentional. Content floats in space.
- **Motion**: Slow, gentle fades (400–600ms). No bounce. Opacity transitions over position shifts.
- **Details**: Hairline borders. Subtle texture (paper grain, linen). No sharp shadows.

### Brutalist / Raw
Structure is visible. Anti-aesthetic is the aesthetic.
- **Typography**: System fonts, monospace (JetBrains Mono, IBM Plex Mono), or aggressive display faces.
- **Color**: Black and white primary. If color, raw and clashing (construction yellow, hazard orange). No gradients.
- **Layout**: Visible borders. Box model exposed. Deliberate roughness. Content first, beauty never.
- **Motion**: None, or jarring (instant state changes, hard cuts). No easing.

### Scandinavian
Warmth plus restraint. Functional beauty. Accessible by default.
- **Typography**: Rounded, friendly sans-serifs (Nunito, Poppins, Circular). Medium weights.
- **Color**: Warm whites, soft blues, muted greens, clay. Pastel accents. No pure black (use charcoal).
- **Layout**: Clean and open. Card-based. Rounded corners (8–12px).
- **Motion**: Gentle, natural easing. Subtle hover lifts.

### Art Deco / Geometric
Bold symmetry. Decorative precision. Statement and luxury.
- **Typography**: Geometric display faces (Futura, Poiret One). All-caps headlines with extreme letterspacing. Serif body for contrast.
- **Color**: Rich and deep — gold, emerald, navy, burgundy. Metallic accents.
- **Layout**: Symmetrical and centered. Decorative frames and borders. Layered depth.
- **Motion**: Elegant reveals. Staggered entrance animations.
- **Details**: Geometric patterns (chevrons, sunbursts). Ornamental borders. Marble/brushed metal texture.

### Neo-Memphis
Playful chaos. Anti-corporate. Shapes as characters.
- **Typography**: Mix of weights and styles intentionally. Clashing fonts. Text at angles.
- **Color**: Bold primaries and neons. Clashing combinations (pink + yellow, blue + orange). Flat color, no gradients.
- **Layout**: Broken grid. Overlapping elements. Geometric shapes as compositional elements. Asymmetric on purpose.
- **Motion**: Bouncy, playful. Exaggerated hover effects. Elements that wiggle or rotate.
- **Details**: Thick borders. Geometric shapes as decoration. Patterns (dots, dashes, zigzags). Hard-edge drop shadows in bright colors.

### Editorial / Magazine
Content-led design. Typography does the heavy lifting. Every page is a spread.
- **Typography**: Display serif for headlines (Playfair Display, Fraunces). Clean sans for body (DM Sans). Dramatic scale (72–120px hero headlines). Pull quotes. Drop caps.
- **Color**: Minimal. Black and white with one accent. Color used editorially, not decoratively.
- **Layout**: Strong column grid (3–5 columns). Full-bleed images. Mixed column widths. Vertical rhythm.
- **Motion**: Scroll-triggered reveals. Parallax on images.

---

## Non-negotiable rules

**Mobile-first (non-negotiable):** Build mobile layout at 375px, then scale up with `min-width` media queries. Touch targets must be at least 44×44px. Body text at least 16px on mobile (prevents iOS zoom). Navigation must have a mobile-specific pattern.

**Dark mode:** Use CSS custom properties for theme switching. Support both `prefers-color-scheme` and manual `[data-theme="dark"]` toggle. Do not simply invert colors — dark backgrounds should be warm or cool to match the philosophy. Reduce pure white text to off-white to reduce eye strain. Include `prefers-reduced-motion` media query.

**Banned outputs:** Never produce generic AI aesthetics: purple gradients on white, Inter font, predictable card grids, cookie-cutter component layouts. Every output should feel designed for its specific context.
