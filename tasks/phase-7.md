# Phase 7 Task File — Compressed

*All tasks complete. Full task definitions were in this file prior to compression. Session entries archived to `logs/phase-7.md`. Retrospective in `docs/phase-7-retro.md`.*

---

**Task 7.0 — Palette generation API** ✓
`POST /api/palette` — accepts `{ colors: { [name]: "#hex" } }`, returns 19-stop OKLCH palettes per the algorithm in `kb/principles/color/palette-generation`. `src/lib/palette.ts` is importable for build-time use. culori v4 (MIT). Key fix: `toGamut('rgb', 'oklch')` (two arguments) correctly handles vivid seeds with channels above sRGB at high lightness.

**Task 7.1 — Pre-generated palette library** ✓
22 Tailwind v3 -600 stop seeds (not the planned 8×3 matrix). `tools/generate-palette-library.ts` writes `public/palettes/library.json` (22 × 19 stops × {hex, contrast_white, contrast_black}). Palette browser at `/tools/palette` with CSS Variables, Tailwind Config, and Figma Variables export formats. "Tools" added to main nav.

**Task 7.2 — Campaign app feature** ✓
Campaign flow at `/campaigns/[slug]/[step]` — SSG, sessionStorage state, progress indicator, downloadable markdown export. First campaign: "Bootstrap a Design System" (6 steps). `_meta/CAMPAIGNS.md` defines campaigns; `src/lib/campaigns.ts` parses and resolves play bodies. "Campaigns" added to main nav.

**Task 7.3 — Light/dark/both selector** ✓
`ColorModeSelector` component (localStorage key `sistema-color-mode`) pre-fills `{{color_mode}}` in `generate-color-scheme` play. Replaces textarea with three-button toggle. Applied in both `PlayForm` (standalone play) and `CampaignStep` (campaign context). `{{color_mode}}` added to play body in `_meta/TASK_PLAYBOOKS.md`.

**Task 7.4 — Pending source crawls** ✓
Three PENDING_SOURCES entries evaluated. webtypography.net (CC BY-NC 4.0): synthesized into `typographic-rhythm.md` (rag, vertical rhythm, word spacing, hyphenation, small caps, numeral figures). Figma Resource Library: skipped (no license, low novelty, conflicting values). Google Fonts Knowledge: pending manual license verification (JS-rendered). modularscale.com: added as citation in type-scales.md (ratio values are mathematical facts).

**Task 7.5 — Phase 7 housekeeping** ✓
Session entries archived to `logs/phase-7.md`. Retrospective at `docs/phase-7-retro.md`. AGENTS.md updated with 8 new patterns. `tasks/phase-8.md` generated (tasks 8.0–8.4). Build: 135 static pages.
