---
play_slug: generate-color-scheme
stage: 2
created: 2026-05-13
quality_notes: >
  Generated for "Verdant" — an environmental data and sustainability reporting
  platform. Primary: forest green (#1A6B3A). Secondary: muted olive/sage.
  Tertiary: warm amber (earthy contrast against green primaries).
  Neutral: green-tinted (very slight chroma — keeps surfaces feeling organic
  rather than cold gray). Dark mode follows M3 tonal logic: primary shifts to
  tone-80 (#72C68C), surfaces draw from the dark end of the green-neutral
  palette. Non-obvious decisions annotated inline. Custom prefix --color-*
  used (not --md-sys-color-*).
input:
  color_direction: >
    Forest green primary — an environmental data / sustainability reporting
    platform. Earthy, grounded, trustworthy. Avoid clinical greens (mint,
    hospital green) and neon greens. Warm secondary accent, not cool.
    Target audience: enterprise sustainability teams and ESG analysts.
---

## Input

**Primary direction:** Forest green — earthy, trustworthy, environmental
**Platform:** Verdant — sustainability reporting and carbon accounting (B2B, enterprise)
**Neutral preference:** Slightly green-tinted (organic feel, not cold gray)

---

## Light theme

```css
:root {
  /* ── Primary (forest green) ──────────────────────────────────────────────── */
  /*
   * #1A6B3A is tone-40 of the primary palette — saturated enough to read as
   * bold green on white, dark enough for 7:1+ contrast against #FFFFFF.
   * Avoids mint (too clinical) and lime (too playful for enterprise B2B).
   */
  --color-primary:                #1A6B3A;  /* green-40 */
  --color-on-primary:             #FFFFFF;
  --color-primary-container:      #C8EFD4;  /* green-90 — light mint, used for chips/selected states */
  --color-on-primary-container:   #002112;  /* green-10 — nearly black-green, high contrast */
  --color-inverse-primary:        #72C68C;  /* green-80 — use on dark snackbar/tooltip surfaces */

  /* ── Secondary (olive/sage) ──────────────────────────────────────────────── */
  /*
   * Muted olive keeps the secondary in the same warm-earth family without
   * competing with the primary. Suitable for filter chips, table row
   * selection states, secondary navigation indicators.
   */
  --color-secondary:              #526345;  /* olive-40 — desaturated, earthy */
  --color-on-secondary:           #FFFFFF;
  --color-secondary-container:    #D5E8C8;  /* olive-90 — light sage */
  --color-on-secondary-container: #111F08;  /* olive-10 */

  /* ── Tertiary (warm amber) ───────────────────────────────────────────────── */
  /*
   * Amber provides a warm, contrasting accent against the cool-green primary.
   * Used for highlights, badges, data callouts (e.g. a KPI card that needs
   * visual differentiation from the main action color). In the sustainability
   * context, amber also reads as "caution" for moderate-risk metrics.
   */
  --color-tertiary:               #7A5800;  /* amber-40 */
  --color-on-tertiary:            #FFFFFF;
  --color-tertiary-container:     #FFDEA5;  /* amber-90 — warm golden */
  --color-on-tertiary-container:  #261A00;  /* amber-10 */

  /* ── Error ───────────────────────────────────────────────────────────────── */
  --color-error:                  #BA1A1A;
  --color-on-error:               #FFFFFF;
  --color-error-container:        #FFDAD6;
  --color-on-error-container:     #410002;

  /* ── Surface ─────────────────────────────────────────────────────────────── */
  /*
   * Neutral palette has a very slight green chroma (~4–5 in HCT chroma units).
   * This makes white surfaces feel warm and organic rather than neutral-gray.
   * The tint is subtle — on miscalibrated monitors it may read as pure white.
   * Use #F8FBF7 (not pure #FFFFFF) as the page-level background; pure white
   * reserved for the highest-elevation cards.
   */
  --color-surface:                    #F8FBF7;  /* neutral-green-99 — page background */
  --color-on-surface:                 #191D1A;  /* neutral-green-10 — primary text */
  --color-surface-variant:            #DCE5DC;  /* neutral-green-90 — alt surface (sidebar, panel bg) */
  --color-on-surface-variant:         #404943;  /* neutral-green-40 — secondary text, icons, borders */
  --color-surface-dim:                #D8DBD8;  /* dimmed surface — scrim'd content, disabled areas */
  --color-surface-bright:             #F8FBF7;  /* same as surface — brightest point in light theme */
  --color-surface-container-lowest:   #FFFFFF;  /* pure white — highest-elevation card surfaces */
  --color-surface-container-low:      #F2F5F1;  /* neutral-green-95 */
  --color-surface-container:          #ECF0EB;  /* neutral-green-92 — default card bg, dialog bg */
  --color-surface-container-high:     #E6EAE6;  /* neutral-green-90 — table header, selected row */
  --color-surface-container-highest:  #E1E4E0;  /* neutral-green-87 — filled input backgrounds */
  --color-inverse-surface:            #2D3130;  /* neutral-green-20 — dark tooltips, snackbars */
  --color-inverse-on-surface:         #EFF2EE;  /* neutral-green-93 — text on inverse surfaces */
  --color-background:                 #F8FBF7;
  --color-on-background:              #191D1A;

  /* ── Outline ─────────────────────────────────────────────────────────────── */
  --color-outline:         #70796F;  /* neutral-green-50 — input borders, card borders */
  --color-outline-variant: #BFC9C1;  /* neutral-green-80 — table dividers, decorative separators */

  /* ── Utility ─────────────────────────────────────────────────────────────── */
  --color-shadow: #191D1A;
  --color-scrim:  rgba(25, 29, 26, 0.4);
}
```

---

## Dark theme

```css
[data-theme="dark"] {
  /* ── Primary ─────────────────────────────────────────────────────────────── */
  /*
   * Primary shifts to green-80 (#72C68C) in dark mode — a lighter tone that
   * maintains adequate contrast against dark surfaces. The light-theme value
   * (#1A6B3A) on a dark background fails WCAG AA — it reads as a very dark
   * green that nearly disappears.
   */
  --color-primary:                #72C68C;  /* green-80 */
  --color-on-primary:             #003920;  /* green-20 */
  --color-primary-container:      #005231;  /* green-30 — tinted container on dark */
  --color-on-primary-container:   #C8EFD4;  /* green-90 — text on that container */
  --color-inverse-primary:        #1A6B3A;  /* green-40 — use on light inverse surfaces */

  /* ── Secondary ───────────────────────────────────────────────────────────── */
  --color-secondary:              #B9CBAC;  /* olive-80 */
  --color-on-secondary:           #253318;  /* olive-20 */
  --color-secondary-container:    #3B4C2E;  /* olive-30 */
  --color-on-secondary-container: #D5E8C8;  /* olive-90 */

  /* ── Tertiary ────────────────────────────────────────────────────────────── */
  /*
   * Amber-40 equivalent (#EDB84A) gives warm contrast on dark surfaces while
   * staying within a tone range that clears WCAG AA for UI components.
   * Avoid using it for small body text — verify at ≥24px or bold weight.
   */
  --color-tertiary:               #EDB84A;  /* amber-80 */
  --color-on-tertiary:            #3F2D00;  /* amber-20 */
  --color-tertiary-container:     #593F00;  /* amber-30 */
  --color-on-tertiary-container:  #FFDEA5;  /* amber-90 */

  /* ── Error ───────────────────────────────────────────────────────────────── */
  --color-error:                  #FFB4AB;  /* red-80 */
  --color-on-error:               #690005;  /* red-20 */
  --color-error-container:        #93000A;  /* red-30 */
  --color-on-error-container:     #FFDAD6;  /* red-90 */

  /* ── Surface ─────────────────────────────────────────────────────────────── */
  /*
   * Dark surfaces draw from the dark end of the green-neutral palette —
   * never pure black (#000000), which feels harsh and disconnects from the
   * organic brand palette. The very slight green chroma is still present
   * in dark mode, giving the UI a cohesive green-earth identity even at night.
   */
  --color-surface:                    #101410;  /* neutral-green-6 — page background */
  --color-on-surface:                 #E1E4E0;  /* neutral-green-87 — primary text */
  --color-surface-variant:            #404943;  /* neutral-green-40 — sidebar, panel bg */
  --color-on-surface-variant:         #BFC9C1;  /* neutral-green-80 — secondary text, icons */
  --color-surface-dim:                #0F1310;  /* darker than surface — rarely shown directly */
  --color-surface-bright:             #354038;  /* neutral-green-22 — elevated panels */
  --color-surface-container-lowest:   #0B0F0C;  /* neutral-green-4 — deepest recesses */
  --color-surface-container-low:      #191D1A;  /* neutral-green-10 */
  --color-surface-container:          #1D2120;  /* neutral-green-12 — cards, dialogs */
  --color-surface-container-high:     #272C29;  /* neutral-green-16 — elevated cards */
  --color-surface-container-highest:  #323633;  /* neutral-green-20 — filled inputs, highest modals */
  --color-inverse-surface:            #E1E4E0;  /* neutral-green-87 — light tooltips/snackbars */
  --color-inverse-on-surface:         #2D3130;  /* neutral-green-20 — text on light inverse surfaces */
  --color-background:                 #101410;
  --color-on-background:              #E1E4E0;

  /* ── Outline ─────────────────────────────────────────────────────────────── */
  /*
   * In dark mode, outlines use a mid-tone green-neutral so they're visible
   * against dark surface containers without glowing or feeling harsh.
   */
  --color-outline:         #8A9389;  /* neutral-green-60 */
  --color-outline-variant: #404943;  /* neutral-green-40 — decorative dividers */

  /* ── Utility ─────────────────────────────────────────────────────────────── */
  --color-shadow: #000000;
  --color-scrim:  rgba(0, 0, 0, 0.6);
}
```

---

## Decisions worth reviewing

1. **Neutral palette uses a slight green chroma, not pure gray.** `--color-surface` is `#F8FBF7`, not `#F9F9F9`. This is intentional — the tint reads as organic/natural and connects surfaces to the primary palette. On poorly calibrated or warm-shifted displays, the tint may be imperceptible. If your design team uses uncalibrated hardware, test on multiple monitors before committing.

2. **Tertiary is amber, not a cool accent.** The M3 guidance suggests tertiary should create visual differentiation from primary and secondary. Amber is warm and earthy — it differentiates without breaking the sustainability aesthetic. In the Verdant context it can double as a "moderate risk" or "caution" indicator color for ESG metric dashboards, but this semantic overloading should be explicit in your component documentation. Do not use amber for actual error states.

3. **Dark mode primary is green-80 (#72C68C), not the light-mode value.** Using `#1A6B3A` (green-40) on dark backgrounds would produce a contrast ratio of roughly 1.8:1 — it reads as a dark shadow, not a brand color. Green-80 on the darkest surface container (`#0B0F0C`) yields approximately 8:1 — verify against your actual surface values with a contrast checker.

4. **Pure white (#FFFFFF) is only `surface-container-lowest`, not the page background.** This reverses the instinct to use white as the neutral baseline. The page background (`--color-surface`) is `#F8FBF7` — cards floating on top of it use pure white, creating a visible lift without drop shadows. If your card components currently use `background: white`, change them to `background: var(--color-surface-container-lowest)` to preserve the depth relationship.

5. **`on-surface-variant` in dark mode is `#BFC9C1` (green-neutral-80).** This is lighter than you might expect for secondary text — but secondary text on dark surfaces genuinely needs to be lighter to pass WCAG AA at standard font weights. If it reads as too-light (insufficient visual distinction from primary text), increase primary-text contrast by darkening `--color-on-surface` rather than lightening `--color-on-surface-variant`.
