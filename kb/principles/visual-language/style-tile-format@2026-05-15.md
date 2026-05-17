---
category: principles
topic: style-tile-format
content_type: synthesis
status: latest
retrieved: 2026-05-15
tags: [visual-language, style-tile, preview, artifact, review, synthesis]
sources:
  - kb/reference/skills/designer-skills/design-brief
  - kb/reference/skills/designer-skills/frontend-design
  - kb/reference/skills/anthropic-frontend-design/skill
  - kb/reference/skills/impeccable/overview
note: >
  Interpreted through the lens of design system building. The style-preview.html
  artifact described here is a human review checkpoint before token generation —
  not a prototype or a UI mockup. Its purpose is to establish and confirm a
  specific visual direction before any token values are committed.
---

# Style Tile Format — Specification

## Purpose of this document

This document specifies exactly what `style-preview.html` must contain and how it is evaluated. It is a machine-executable spec: an agent given this document can generate a conforming artifact without additional research.

`style-preview.html` is the visual direction artifact produced by the `establish-visual-language` play. It is a static HTML file that demonstrates the design system's visual language before any tokens are generated. Its purpose is human review and approval, not browser rendering of a UI.

---

## 1 — What style-preview.html is

A single self-contained HTML file that renders all visual language decisions — color, typography, shape, and surface treatment — in a reviewable form. It contains no JavaScript application logic. All CSS is inline or in a `<style>` block. No external dependencies.

**What it is not:**
- A prototype of a specific screen
- A component library demo
- A Storybook or documentation site
- A placeholder with lorem ipsum everywhere

**The key constraint:** Every visual decision visible in the file must be connected to a specific statement in the visual direction brief. The reviewer should be able to look at any element and ask "why did this choice get made?" and find an answer in the brief.

---

## 2 — Required sections

The file must contain all seven sections in this order. Each section has a required heading, content elements, and a specific purpose.

### Section 1: Visual direction statement

**What it contains:**
- The visual direction brief, condensed to 3–5 bullet points
- Aesthetic reference points named explicitly
- OKLCH commitment level stated
- 2–3 "does not look like" exclusions listed

**Purpose:** Anchors everything that follows. The reviewer reads this first and evaluates all subsequent sections against it.

**Required format:**
```html
<section class="vd-statement">
  <h2>Visual Direction</h2>
  <ul>
    <li><strong>Aesthetic reference:</strong> [named frameworks]</li>
    <li><strong>Color commitment:</strong> Level N — [name] ([one-sentence rationale])</li>
    <li><strong>Typographic character:</strong> [2–3 sentences]</li>
    <li><strong>Shape personality:</strong> [one sentence, with numeric range]</li>
    <li><strong>What this is not:</strong> [2–3 specific exclusions]</li>
  </ul>
</section>
```

---

### Section 2: Color palette

**What it contains:**
- All proposed color values as swatches
- Organized by role: primary, secondary, surfaces, semantic (error/success/warning), neutrals
- Each swatch labeled with: role name, hex value, OKLCH values, and contrast ratio against white and black
- Commitment level annotation for the surface group

**Purpose:** The reviewer sees all colors simultaneously before they become tokens. Evaluates: Is the commitment level consistent? Do the surface colors have character? Is the primary color specific?

**Required format:**
```html
<section class="color-palette">
  <h2>Color Palette</h2>
  <div class="swatch-group">
    <h3>Primary</h3>
    <!-- Swatches: each is a colored rectangle with label below -->
  </div>
  <div class="swatch-group">
    <h3>Surfaces <small>[Commitment level N — Name]</small></h3>
    <!-- Surface color swatches -->
  </div>
  <div class="swatch-group">
    <h3>Semantic</h3>
    <!-- Error, success, warning swatches -->
  </div>
  <div class="swatch-group">
    <h3>Neutrals</h3>
    <!-- Neutral ramp, at least 5 stops -->
  </div>
</section>
```

**Evaluation criteria:**
- Surfaces: Do they have intentional hue temperature, or do they read as "gray"?
- Primary: Does it pass the first-order reflex test? (Is it medium-blue without a stated reason?)
- Neutrals: Do they carry hue affinity from the primary?
- Range: Is the full tonal range represented (from near-white to near-black)?

---

### Section 3: Typography specimens

**What it contains:**
- Each proposed type role rendered with sample text
- Role name, size, weight, line height, and letter spacing labeled for each
- Display role: rendered at full size with a representative heading
- Body roles: rendered at 2–3 lines of actual prose, not "lorem ipsum"
- Label role: rendered as UI label examples (e.g., "Status", "Updated 3 days ago", "12 items")
- Code role (if applicable): rendered with a code sample

**Purpose:** The reviewer evaluates typographic character and hierarchy as experienced, not as a spec table.

**Required format:**
```html
<section class="typography">
  <h2>Typography</h2>
  <div class="type-specimen" data-role="display">
    <p class="type-label">display · 60px · weight 300 · lh 1.0 · ls -0.03em</p>
    <p class="type-sample" style="font-size:60px; ...">Design systems that think</p>
  </div>
  <!-- Additional roles follow same pattern -->
</section>
```

**Evaluation criteria:**
- Hierarchy: Can you distinguish roles visually at a glance?
- Character: Does the typographic treatment match the visual direction brief?
- Weight range: Is there meaningful contrast between the lightest and heaviest weights in use?
- Label legibility: Are small labels readable at the specified size?

---

### Section 4: Shape and radius specimens

**What it contains:**
- Each proposed radius token rendered as a filled rectangle
- Token name and pixel value labeled
- A component mapping demonstration: button, input, card, chip — each using its designated radius
- Shadow specimens: each elevation level rendered as a raised white card on a neutral background

**Purpose:** The reviewer evaluates radius personality and consistency as a system, not as isolated values.

**Required format:**
```html
<section class="shape">
  <h2>Shape & Radius</h2>
  <div class="radius-row">
    <!-- One specimen per radius token -->
    <div class="radius-specimen" style="border-radius:4px">
      <span>radius-sm · 4px</span>
    </div>
    <!-- ... -->
  </div>
  <div class="component-mapping">
    <h3>Component mapping</h3>
    <!-- Button, input, card, chip specimens -->
  </div>
  <div class="shadow-row">
    <h3>Elevation</h3>
    <!-- Shadow specimens on neutral ground -->
  </div>
</section>
```

**Evaluation criteria:**
- Personality match: Does the radius range match the brief's shape personality?
- Hierarchy: Is there meaningful difference between the smallest and largest stops?
- Component consistency: Do related components (button + input) use harmonious radius values?

---

### Section 5: Surface treatment

**What it contains:**
- Default surface background rendered at full width
- Raised surface (card/panel) on the default surface — demonstrates differentiation
- Overlay surface (modal) on the default surface
- Border specimens: default border color, strong border, focus ring
- A composite specimen: a representative card with heading, body text, badge, and action button — all using the proposed surface, type, shape, and color values together

**Purpose:** This is the most important section for evaluating visual coherence. It shows whether the individual decisions in sections 2–4 work together.

**Required format:**
```html
<section class="surface-treatment">
  <h2>Surface Treatment</h2>
  <div class="surface-stack">
    <!-- Nested: default > raised > overlay -->
  </div>
  <div class="border-specimens">
    <!-- Border color swatches -->
  </div>
  <div class="composite-specimen">
    <h3>Composite — Card specimen</h3>
    <!-- One card rendered using all proposed values -->
  </div>
</section>
```

**Evaluation criteria:**
- Differentiation: Can you tell the surface levels apart without labels?
- Coherence: Does the composite card feel like a unified design, or like five separate decisions placed in proximity?
- Character: Does the overall surface treatment match the visual direction brief?

---

### Section 6: Color in context

**What it contains:**
- Primary color applied in context: a filled button, a link, a focus ring
- Semantic colors in context: an error state input, a success message, a warning banner
- Both light and dark mode surface stacks, if dark mode is in scope

**Purpose:** Validates that color values work at the component level, where the commitment level, contrast, and semantic signals are all in play simultaneously.

**Required format:**
```html
<section class="color-in-context">
  <h2>Color in Context</h2>
  <div class="interactive-states">
    <!-- Button (rest, hover label), link, focus ring specimen -->
  </div>
  <div class="semantic-states">
    <!-- Error input, success message, warning banner -->
  </div>
  <!-- Dark mode stack if applicable -->
</section>
```

**Evaluation criteria:**
- Contrast: Does `on-primary` text read clearly on the primary background?
- Semantic clarity: Are error, success, and warning visually distinct from each other?
- Focus ring: Is it visible against both light and dark surfaces?

---

### Section 7: Reviewer notes

**What it contains:**
- A checklist of the specific decisions made in this artifact that require human judgment
- Any color choices flagged for contrast verification
- Any decisions where the positioning brief was underspecified and a default was applied
- An explicit invitation: "These are the decisions to change before token generation begins."

**Purpose:** The reviewer knows exactly what to evaluate and what is open for adjustment.

**Required format:**
```html
<section class="reviewer-notes">
  <h2>Review Checklist</h2>
  <p>Before approving this visual direction, review these specific decisions:</p>
  <ul>
    <li>[ ] Primary color: [value] — [rationale for this specific choice]</li>
    <li>[ ] Surface commitment level: [level] — [does this match the brief's intent?]</li>
    <li>[ ] Radius personality: [range] — [does this match "X" from the brief?]</li>
    <li>[ ] [Any flagged contrast pairs]</li>
  </ul>
  <p>Decisions applied from defaults (brief was underspecified):</p>
  <ul>
    <li>[ ] [List any defaults applied]</li>
  </ul>
</section>
```

---

## 3 — Technical requirements

- **Self-contained:** No external CSS or JavaScript. All styles inline or in a `<style>` block.
- **File size:** Under 150KB. No base64-encoded images unless essential.
- **Rendering:** Must be readable when opened directly in a browser from the filesystem (no server required).
- **Color values:** All color values shown as both hex and OKLCH. OKLCH values allow easy evaluation against the commitment level framework.
- **Annotations:** Every significant visual decision has an annotation label visible on the page — role name, value, and brief rationale.

---

## 4 — What the review means

Approving `style-preview.html` means: the visual direction is confirmed. Token generation (color scheme, type scale, shape tokens) will use this direction as its source, not the positioning brief directly.

**If the reviewer changes anything after token generation has begun, those tokens must be regenerated from the revised direction.** The style-preview.html is a contract between the positioning brief and the token system.

**Signs a style tile needs revision before approval:**
- Any section reads as generic — the description "could be any product"
- The composite card specimen feels like assembled pieces rather than a unified design
- The color commitment level visually contradicts the brand stance (e.g., Level 4 drenched for a dense medical tool)
- The reviewer cannot identify what is specific about this design system compared to a default one

**Signs a style tile is ready for approval:**
- You can describe the visual direction in 2 sentences and the description is specific enough to exclude most other products
- The composite card specimen feels coherent — the colors, type, and shape choices reinforce each other
- The "What this is not" exclusions are visibly honored throughout
