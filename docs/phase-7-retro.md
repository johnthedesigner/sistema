# Phase 7 Retrospective

**Date:** 2026-05-13
**Phase goal:** Implement the palette generation API and campaign app feature — the first interactive tools that make Sistema's synthesis layer actionable.

---

## What was accomplished

Phase 7 converted the synthesis layer from readable content into working tools. Every task produced user-facing product, not just knowledge infrastructure.

**Palette generation API (7.0):** `POST /api/palette` returns 19-stop OKLCH palettes for any seed hex. The algorithm in `src/lib/palette.ts` is importable for build-time use. Key technical decision: `toGamut('rgb', 'oklch')` from culori handles gamut mapping correctly — manual channel clamping would have silently produced wrong palettes for vivid seeds.

**Pre-generated palette library (7.1):** 22 Tailwind v3 -600 stops as seeds, generated at build time into `public/palettes/library.json`. Palette browser at `/tools/palette` with three copy formats (CSS Variables, Tailwind Config, Figma Variables). The Figma Variables format is compatible with the "Variables Import & Export" community plugin — a direct workflow connection to design. Scope change from the task spec (8×3 matrix → 22 Tailwind seeds) produced better hue coverage with zero manual curation.

**Campaign app (7.2):** Multi-step flow at `/campaigns/[slug]/[step]` with sessionStorage state persistence, progress indicator, and a downloadable markdown export at the end. One campaign: "Bootstrap a Design System" (6 steps, positioning-brief through generate-style-dictionary). The campaign system is SSG — all step pages are pre-rendered.

**Color mode selector (7.3):** Persistent three-option toggle (Light only / Dark only / Both) for `generate-color-scheme`. Stored in `localStorage['sistema-color-mode']`; pre-fills `{{color_mode}}` in both the standalone play and the campaign step. Replaces a free-text textarea with a purpose-built UI control.

**Pending source crawls (7.4):** Three sources evaluated; one synthesized. Webtypography.net (CC BY-NC 4.0) contributed `typographic-rhythm.md` — rag, vertical rhythm, word spacing, hyphenation, small caps, numeral figures. Figma Resource Library skipped (no license, no novel content). Google Fonts Knowledge pending manual license verification (JS-rendered, couldn't fetch). Modularscale.com added as supplementary citation in type-scales.md.

---

## What changed unexpectedly

**Tailwind seed approach outperformed the spec.** The task called for an 8×3 saturation matrix (8 hues × 3 saturation levels = 24 palettes). Switching to Tailwind v3's 22 canonical -600 stops gave 22 palettes with better hue wheel coverage, immediately recognizable names for developers, and zero manual color curation — a better outcome with less work.

**ESM/CJS interop required a workaround in the build script.** culori v4 is ESM-only. tsx runs in CJS mode by default in a standard package. Importing `src/lib/palette.ts` from the generation script failed because culori's ESM exports are unavailable in CJS. Fixed by inlining the algorithm and using `createRequire(import.meta.url)` to require culori's CJS bundle directly. The workaround is local to the generation script — the library itself is correctly structured.

**Next.js SSR fires client components during build.** `CampaignExport` is `'use client'` but Next.js still pre-renders it on the server, where `sessionStorage` is undefined. The `mounted` state pattern (`useEffect(() => setMounted(true), [])`) resolved this. This is a recurring gotcha that should be documented.

---

## Decisions made

- **22 Tailwind -600 stops as palette seeds** — better than hand-curated 8×3 matrix; battle-tested hue selection, developer-recognizable names, complete hue wheel coverage.
- **sessionStorage for campaign step state** — persists across step navigation without URL pollution; namespaced by `campaign:{slug}:step:{n}:{varName}` to support multiple concurrent campaigns.
- **localStorage for color mode selector** — persistent across sessions (unlike sessionStorage); cross-page (standalone play + campaign step share the same key); pre-fills the variable on next visit.
- **Figma Variables JSON format** — specific structure compatible with the "Variables Import & Export" plugin chosen over simpler flat formats. The collections/modes/variables hierarchy matches Figma's API schema.
- **CC BY-NC synthesis approach** — webtypography.net synthesized in own words with attribution; no verbatim reproduction. The NC clause prohibits commercial reproduction, not educational synthesis. This distinction is now documented in the Source Map.

---

## What didn't get done

**Google Fonts Knowledge** — The page is JavaScript-rendered and couldn't be fetched for license verification. The content (optical sizing, variable fonts, responsive type) would be high-value; it just needs manual verification of the CC BY 4.0 license before synthesis can proceed. Carried to Phase 8.

**Additional campaigns** — One campaign works as a prototype; two or more would establish the pattern as a product feature. Left for Phase 8.

**Custom seed input on palette tool** — The palette browser shows pre-generated palettes only. A user-facing seed input that calls `POST /api/palette` would make it a generative tool, not just a library browser. Left for Phase 8.

---

## What's next (Phase 8)

- **Google Fonts Knowledge synthesis** — verify CC BY 4.0 manually, then write `responsive-typography.md` (optical sizing, variable fonts, responsive type scaling)
- **Second campaign** — "Audit and Refactor" using Stage 6 stewardship plays (audit-token-coverage, accessibility-audit, design-system-retrospective)
- **Custom palette seed input** — form on `/tools/palette` that calls `POST /api/palette` and renders results inline
- **Stage 6 play exemplars** — generate and commit exemplar outputs for the 6 stewardship plays
- **Phase 8 housekeeping**

Build at phase end: **135 static pages.** All lint checks passing. KB: typographic-rhythm added; 3 pending sources evaluated; 1 synthesized.
