---
play_slug: generate-color-scheme
stage: 2
created: 2026-05-12
title: "B2B SaaS (Blue)"
quality_notes: >
  Generated for a product with primary brand color #2563EB (blue), warm neutral
  preference, and a B2B SaaS context. Light and dark themes both provided.
  Dark mode follows M3 tonal logic: primary draws from blue-40 (lighter tone for
  contrast on dark surfaces), surfaces draw from the dark end of neutral-blue.
  Non-obvious decisions annotated inline. Warning and success roles added beyond
  M3 baseline — common requirement for SaaS products with status indicators.
  All semantic role names use --color-* prefix (custom, not --md-sys-color-*).
input:
  color_direction: "#2563EB — professional B2B SaaS, slightly warm neutrals, confident but not playful"
---

## Input

**Primary brand color:** `#2563EB`
**Direction:** professional B2B SaaS, slightly warm neutrals, confident but not playful

---

## Light theme

```css
:root {
  /* ── Primary (blue) ──────────────────────────────────────────────────────── */
  --color-primary:                #2563EB;  /* brand blue-60 */
  --color-on-primary:             #FFFFFF;
  --color-primary-container:      #DBEAFE;  /* blue-10 — tinted bg for chips, selected rows */
  --color-on-primary-container:   #1E3A8A;  /* blue-90 — text on that bg */
  --color-primary-hover:          #1D4ED8;  /* blue-70 — darken on hover */
  --color-inverse-primary:        #60A5FA;  /* blue-40 — use on dark inverse surfaces */

  /* ── Secondary (indigo) ──────────────────────────────────────────────────── */
  --color-secondary:              #4F46E5;  /* indigo-60 */
  --color-on-secondary:           #FFFFFF;
  --color-secondary-container:    #E0E7FF;  /* indigo-10 */
  --color-on-secondary-container: #312E81;  /* indigo-90 */

  /* ── Tertiary (teal) ─────────────────────────────────────────────────────── */
  /* Tertiary doubles as the success color — teal reads as positive/healthy */
  --color-tertiary:               #0D9488;  /* teal-60 */
  --color-on-tertiary:            #FFFFFF;
  --color-tertiary-container:     #CCFBF1;  /* teal-10 */
  --color-on-tertiary-container:  #134E4A;  /* teal-90 */

  /* ── Error ───────────────────────────────────────────────────────────────── */
  --color-error:                  #DC2626;  /* red-60 */
  --color-on-error:               #FFFFFF;
  --color-error-container:        #FEF2F2;  /* red-5 — very light; avoids alarm on passive errors */
  --color-on-error-container:     #7F1D1D;  /* red-90 */

  /* ── Warning (non-M3 addition) ───────────────────────────────────────────── */
  /* M3 doesn't define warning; added for SaaS status/alert patterns */
  --color-warning:                #D97706;  /* amber-60 */
  --color-on-warning:             #FFFFFF;
  --color-warning-container:      #FFFBEB;  /* amber-5 */
  --color-on-warning-container:   #92400E;  /* amber-80 */

  /* ── Success (non-M3 addition) ───────────────────────────────────────────── */
  /* Aliases tertiary for semantic clarity at the component level */
  --color-success:                #0D9488;  /* teal-60 */
  --color-on-success:             #FFFFFF;
  --color-success-container:      #F0FDFA;  /* teal-5 */
  --color-on-success-container:   #134E4A;  /* teal-90 */

  /* ── Surface ─────────────────────────────────────────────────────────────── */
  /*
   * Using neutral-blue (slightly chromatic) rather than pure neutral for
   * surfaces — gives the UI a subtle cool tint consistent with the blue primary.
   * Pure white (#FFFFFF) is used only for elevated card surfaces.
   */
  --color-surface:                    #F8FAFC;  /* neutral-blue-2 — page background */
  --color-surface-variant:            #F1F5F9;  /* neutral-blue-5 — sidebar, panel bg */
  --color-surface-container-lowest:   #FFFFFF;  /* pure white — card surfaces */
  --color-surface-container-low:      #F1F5F9;  /* neutral-blue-5 */
  --color-surface-container:          #E2E8F0;  /* neutral-blue-10 — table header, form bg */
  --color-surface-container-high:     #CBD5E1;  /* neutral-blue-20 — dividers used as bg */
  --color-surface-container-highest:  #94A3B8;  /* neutral-blue-30 — strong emphasis bg */
  --color-surface-dim:                #E2E8F0;  /* scrim'd content, disabled surfaces */
  --color-surface-bright:             #FFFFFF;
  --color-surface-inverse:            #1E293B;  /* neutral-blue-80 — dark tooltips/snackbars */

  /* ── On-surface ──────────────────────────────────────────────────────────── */
  --color-on-surface:                 #0F172A;  /* neutral-blue-90 — primary text */
  --color-on-surface-variant:         #334155;  /* neutral-blue-70 — secondary text, icons */
  --color-on-surface-inverse:         #F1F5F9;  /* text on inverse surfaces */

  /* ── Outline ─────────────────────────────────────────────────────────────── */
  --color-outline:         #CBD5E1;  /* neutral-blue-20 — input borders, card borders */
  --color-outline-variant: #E2E8F0;  /* neutral-blue-10 — table dividers, subtle separators */

  /* ── Utility ─────────────────────────────────────────────────────────────── */
  --color-shadow: #0F172A;
  --color-scrim:  rgba(15, 23, 42, 0.4);
}
```

---

## Dark theme

```css
[data-theme="dark"] {
  /* ── Primary ─────────────────────────────────────────────────────────────── */
  /*
   * In dark mode, primary shifts to blue-40 (lighter tone) to maintain
   * contrast against dark surfaces — do not use blue-60 here.
   */
  --color-primary:                #60A5FA;  /* blue-40 */
  --color-on-primary:             #1E3A8A;  /* blue-90 */
  --color-primary-container:      #1E40AF;  /* blue-80 */
  --color-on-primary-container:   #DBEAFE;  /* blue-10 */
  --color-primary-hover:          #93C5FD;  /* blue-30 */
  --color-inverse-primary:        #2563EB;  /* blue-60 — use on light inverse surfaces */

  /* ── Secondary ───────────────────────────────────────────────────────────── */
  --color-secondary:              #818CF8;  /* indigo-40 */
  --color-on-secondary:           #312E81;  /* indigo-90 */
  --color-secondary-container:    #3730A3;  /* indigo-80 */
  --color-on-secondary-container: #E0E7FF;  /* indigo-10 */

  /* ── Tertiary ────────────────────────────────────────────────────────────── */
  --color-tertiary:               #2DD4BF;  /* teal-40 */
  --color-on-tertiary:            #134E4A;  /* teal-90 */
  --color-tertiary-container:     #115E59;  /* teal-80 */
  --color-on-tertiary-container:  #CCFBF1;  /* teal-10 */

  /* ── Error ───────────────────────────────────────────────────────────────── */
  --color-error:                  #F87171;  /* red-40 */
  --color-on-error:               #7F1D1D;  /* red-90 */
  --color-error-container:        #991B1B;  /* red-80 */
  --color-on-error-container:     #FEE2E2;  /* red-10 */

  /* ── Warning ─────────────────────────────────────────────────────────────── */
  --color-warning:                #FBBF24;  /* amber-40 */
  --color-on-warning:             #92400E;  /* amber-80 */
  --color-warning-container:      #92400E;  /* amber-80 */
  --color-on-warning-container:   #FEF3C7;  /* amber-10 */

  /* ── Success ─────────────────────────────────────────────────────────────── */
  --color-success:                #2DD4BF;  /* teal-40 */
  --color-on-success:             #134E4A;  /* teal-90 */
  --color-success-container:      #115E59;  /* teal-80 */
  --color-on-success-container:   #CCFBF1;  /* teal-10 */

  /* ── Surface ─────────────────────────────────────────────────────────────── */
  /*
   * Dark surfaces draw from the dark end of neutral-blue, not pure black.
   * The slight chromatic shift keeps the dark theme feeling warm and connected
   * to the blue primary rather than generic dark-gray.
   */
  --color-surface:                    #0F172A;  /* neutral-blue-90 — page background */
  --color-surface-variant:            #1E293B;  /* neutral-blue-80 — sidebar, panel bg */
  --color-surface-container-lowest:   #0A0F1E;  /* deeper than surface — rarely used */
  --color-surface-container-low:      #1E293B;  /* neutral-blue-80 */
  --color-surface-container:          #334155;  /* neutral-blue-70 — cards, table rows */
  --color-surface-container-high:     #475569;  /* neutral-blue-60 — elevated cards */
  --color-surface-container-highest:  #64748B;  /* neutral-blue-50 — highest elevation */
  --color-surface-dim:                #0F172A;
  --color-surface-bright:             #334155;
  --color-surface-inverse:            #F1F5F9;  /* light tooltip/snackbar on dark */

  /* ── On-surface ──────────────────────────────────────────────────────────── */
  --color-on-surface:                 #F1F5F9;  /* neutral-blue-5 — primary text */
  --color-on-surface-variant:         #CBD5E1;  /* neutral-blue-20 — secondary text */
  --color-on-surface-inverse:         #0F172A;  /* text on light inverse surfaces */

  /* ── Outline ─────────────────────────────────────────────────────────────── */
  --color-outline:         #334155;  /* neutral-blue-70 */
  --color-outline-variant: #1E293B;  /* neutral-blue-80 */

  /* ── Utility ─────────────────────────────────────────────────────────────── */
  --color-shadow: #000000;
  --color-scrim:  rgba(0, 0, 0, 0.6);
}
```

---

## Decisions worth reviewing

1. **Warning and Success are non-M3 additions.** M3 only defines error as a semantic status color. These are common enough in SaaS that they're worth including from the start rather than retrofitting.

2. **surface-container-lowest is pure white (#FFFFFF) in light mode.** This is intentional — card surfaces should float above the slightly-tinted page background. If your cards use `--color-surface` as background instead, revisit this.

3. **Outline in dark mode is neutral-blue-70 (#334155)**, not a lighter value. This is correct: dark mode outlines should be just visible enough against dark surfaces without glowing. If your input borders look invisible, check that your input background uses `--color-surface-container`.

4. **Primary in dark mode is blue-40, not blue-60.** Using the light-theme primary on a dark surface typically fails contrast (WCAG AA requires 4.5:1 for text, 3:1 for UI components). Blue-40 on neutral-blue-90 passes 3:1 for large text and interactive elements — verify with your specific values using a contrast checker.
