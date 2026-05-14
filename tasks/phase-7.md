# Phase 7 Task File

**Phase goal:** Implement the palette generation API and campaign app feature — the first interactive tools that make Sistema's synthesis layer actionable, not just readable.

**Context from Phase 6:**
- Synthesis layer complete: 11 documents across 7 concern areas in `kb/principles/`
- Playbook v3.0: all plays system-agnostic, living brief protocol throughout, Stage 6 stewardship plays
- Palette generation algorithm fully specified in `kb/principles/color/palette-generation@2026-05-13.md`
- Living brief spec and template in place (`_meta/LIVING_BRIEF_SPEC.md`, `_meta/templates/LIVING_BRIEF.md`)
- Build: 124 static pages, lint clean

---

## Task 7.0 — Palette generation API

**Status:** not started
**Phase:** 7
**Must complete before:** 7.1 (campaign feature may link to palette tool), 7.2 (pre-generated library)

### What this task implements

An API endpoint that accepts one or more hex colors and returns 19-stop shade palettes per the algorithm specified in `kb/principles/color/palette-generation@2026-05-13.md`. The palette output feeds directly into the token tier model.

**Algorithm:**
1. For each seed hex: convert to OKLCH
2. Generate a dense candidate set (~200 shades) stepping L from 0.98 to 0.05, with chroma scaled as `C × sin(π × L)` to prevent gamut clipping
3. For each of the 19 target contrast values (logarithmic distribution from 1.01 to 19.0), select the candidate shade with closest WCAG contrast against white
4. Record both `contrast_white` and `contrast_black` per stop (related by `≈ 21 / contrast_white`)
5. Return named JSON per the output schema

**Target contrast table** (19 stops, 50–950):
The formula is `target[i] = 1.01 × (19.0/1.01)^(i/18)` for i = 0..18.

**Output schema:**
```json
{
  "paletteName": {
    "seed": "#hex",
    "stops": {
      "50":  { "hex": "#hex", "contrast_white": 1.05, "contrast_black": 20.0 },
      "100": { "hex": "#hex", "contrast_white": 1.18, "contrast_black": 17.8 },
      ...
      "950": { "hex": "#hex", "contrast_white": 16.2, "contrast_black": 1.30 }
    }
  }
}
```

**Endpoint:**
- `POST /api/palette` — body: `{ colors: { [name: string]: string } }` where values are hex strings
- Returns: `{ palettes: { [name: string]: PaletteResult } }`
- Validation: hex format check; graceful error for out-of-gamut seeds

**Tooling:** Use `culori` npm package for OKLCH conversion and WCAG relative luminance. Pure TypeScript — no native dependencies.

### Files created or modified

- `src/app/api/palette/route.ts` — POST handler
- `src/lib/palette.ts` — algorithm implementation (importable separately for build-time use)
- Add `culori` to `package.json`

### Acceptance criteria

- [ ] POST `/api/palette` returns correct 19-stop palette for a given seed hex
- [ ] Dual contrast tracking: every stop includes `contrast_white` and `contrast_black`
- [ ] Named palettes: input `{ "primary": "#2563eb" }` returns `{ "palettes": { "primary": ... } }`
- [ ] Hex validation returns 400 with clear error on bad input
- [ ] Algorithm in `src/lib/palette.ts` is importable for build-time use (no Next.js dependencies)
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 7.1 — Pre-generated palette library

**Status:** not started
**Phase:** 7
**Requires:** 7.0 (`src/lib/palette.ts` importable algorithm)

### What this task implements

A curated library of 24 pre-generated palettes (8 hues × 3 saturation levels) built at build time using the same algorithm as the API. The library covers the most-needed starting points so users don't need to generate from scratch.

**Matrix:**
- Hues: red, orange, amber, green, teal, blue, violet, pink
- Saturations: muted (chroma ×0.5), balanced (chroma ×1.0), vivid (chroma ×1.5)
- Seed selection: one representative hex per hue per saturation level (hand-curated or generated algorithmically)

**Build process:**
- A script in `tools/` runs the palette algorithm against the seed matrix and writes JSON to `public/palettes/library.json`
- The script is run as a pre-build step (not at runtime)
- The library JSON is served as a static file

**App integration:**
- New page at `/tools/palette` (or similar) — browsable palette library with copy-to-clipboard for individual stop values
- Option to run the API against a custom seed from the same UI

### Files created or modified

- `tools/generate-palette-library.ts` — build-time generation script
- `public/palettes/library.json` — generated output (committed, regenerated on demand)
- `src/app/tools/palette/page.tsx` — palette browser UI
- `src/components/palette/` — PaletteGrid, PaletteStop, SeedInput components
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] Library covers all 24 palettes (8 hues × 3 saturations)
- [ ] Generation script runs cleanly: `npx tsx tools/generate-palette-library.ts`
- [ ] Palette browser page renders all 24 palettes in a scannable grid
- [ ] Each stop shows hex value and both contrast ratios on hover/focus
- [ ] Custom seed input field runs the API and shows results inline
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 7.2 — Campaign app feature

**Status:** not started
**Phase:** 7

### What this task implements

The campaign UI — a multi-step flow that guides a user through the positioning → DESIGN.md → color → type → component bootstrap sequence. This is distinct from single plays: it maintains state across steps, shows progress, and produces a downloadable campaign file at the end.

**Scope:**
- Campaign index page at `/campaigns` — lists available campaigns with descriptions
- Campaign flow page at `/campaigns/[slug]/[step]` — one step at a time with next/back navigation
- Step state: form fields persisted in URL params or session storage (no backend required for v1)
- Progress indicator: shows which step user is on, how many remain
- Campaign file generator: at the end of the flow, produce a Markdown file the user can copy/download — all step outputs assembled into one document
- First campaign: "Bootstrap a design system" — 6 steps (positioning-brief → generate-design-md → generate-color-scheme → generate-type-scale → generate-shape-tokens → generate-style-dictionary)

**App structure:**
```
src/app/campaigns/
  page.tsx                    — campaign index
  [slug]/
    [step]/
      page.tsx                — step render
src/components/campaigns/
  CampaignProgress.tsx        — step indicator
  CampaignStep.tsx            — step content + form
  CampaignExport.tsx          — final assembly + download
src/lib/campaigns.ts          — campaign definitions, step loading
_meta/CAMPAIGNS.md            — campaign definitions (slug, steps, step play slugs)
```

**Campaign definition format** (in `_meta/CAMPAIGNS.md`):
```
## bootstrap — Bootstrap a design system

**Steps:** positioning-brief, generate-design-md, generate-color-scheme, generate-type-scale, generate-shape-tokens, generate-style-dictionary

**Description:** Take a new design system from blank canvas to styled component library in 6 structured steps.
```

### Files created or modified

- `_meta/CAMPAIGNS.md` — campaign definitions
- `src/lib/campaigns.ts` — loader
- `src/app/campaigns/page.tsx` and `[slug]/[step]/page.tsx`
- `src/components/campaigns/` — 3 components
- `_meta/CHANGELOG.md` — updated

### Acceptance criteria

- [ ] `/campaigns` page lists available campaigns
- [ ] `/campaigns/bootstrap/1` renders step 1 with correct play content
- [ ] Step navigation (next/back) works without losing filled form fields
- [ ] Progress indicator accurately reflects current step
- [ ] Final step shows assembled campaign document with copy/download option
- [ ] Campaign pages are statically generated (`generateStaticParams`)
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 7.3 — Light/dark/both selector

**Status:** not started
**Phase:** 7

### What this task implements

A persistent theme selector in the app UI that lets users choose light-only, dark-only, or both-mode output for the `generate-color-scheme` play. The selection is stored and drives the play's prompt substitution at copy time.

**Behavior:**
- Three-option selector: "Light", "Dark", "Both" — rendered as a button group or select
- Default: "Both"
- Selection persisted to `localStorage` under key `sistema-color-mode`
- The `generate-color-scheme` play template uses `{{color_mode}}` as a variable; the value is pre-filled from localStorage at render time
- No changes to the play body text — this is a UI-level pre-fill only

**Placement:** In the play page UI, adjacent to the existing form fields. Only shown on plays tagged with `color` or on the `generate-color-scheme` play specifically.

### Files created or modified

- `src/components/playbooks/ColorModeSelector.tsx` — selector component
- `src/components/playbooks/PlayForm.tsx` — integrate selector, pre-fill `color_mode` variable
- `_meta/TASK_PLAYBOOKS.md` — add `{{color_mode}}` variable to `generate-color-scheme` play if not already present

### Acceptance criteria

- [ ] Selector renders on `generate-color-scheme` play page
- [ ] Selection persists across page reloads (localStorage)
- [ ] `{{color_mode}}` pre-filled in form from stored selection
- [ ] Copied prompt includes correct value ("Light only", "Dark only", or "Light and dark")
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 7.4 — Pending source crawls

**Status:** not started
**Phase:** 7

### What this task implements

Crawl and evaluate the three pending sources from `_meta/PENDING_SOURCES.md`:

1. **webtypography.net** — Tier 3 candidate; typography legibility principles. Check license status; if acceptable, synthesize relevant content into `kb/reference/foundations/typography/`.
2. **Google Fonts Knowledge** — Tier 2 (official public docs). Crawl `fonts.google.com/knowledge`; synthesize into typography foundations. Strong candidate for supplementing or replacing Practical Typography as citation.
3. **Figma Resource Library typography** — Tier 3 candidate; evaluate whether it adds anything not already in KB.

For each source: (1) check license/copyright, (2) evaluate content quality and novelty vs. existing KB, (3) synthesize if acceptable, (4) update Source Maps in relevant `_index.md` files, (5) update `_meta/PENDING_SOURCES.md` to mark as evaluated.

**Non-blocking action item from 6.10 also addressed here:**
- Evaluate modularscale.com as supplementary citation for typographic scale ratios (supplement for spencermortensen.com)

### Files potentially created or modified

- `kb/reference/foundations/typography/` — new content files if sources add value
- `kb/reference/foundations/typography/_index.md` — Source Map updates
- `_meta/PENDING_SOURCES.md` — mark evaluated entries
- `_meta/LICENSE_AUDIT.md` — add any new Tier 3 evaluations
- `_meta/INDEX.md`, `_meta/CHANGELOG.md` — updated if new content added

### Acceptance criteria

- [ ] All three PENDING_SOURCES.md entries evaluated (license status + content quality)
- [ ] New content added where sources clear licensing and add value
- [ ] `_meta/PENDING_SOURCES.md` updated to reflect evaluated status
- [ ] Lint passes | Build passes | `SESSION_LOG.md` updated

---

## Task 7.5 — Phase 7 housekeeping

**Status:** not started
**Phase:** 7

Standard end-of-phase: compress task file, archive session log, update AGENTS.md, write retro, generate `tasks/phase-8.md`.

Phase 8 scope (to be defined during this task): depends on what Phase 7 surfaces. Likely candidates: advanced palette options (APCA-targeted, dark-mode-first), additional campaigns (audit-and-refactor, accessibility-remediation), play testing and exemplar generation for new plays, KB expansion (Carbon animation, Primer components).

### Acceptance criteria

- [ ] All Phase 7 session entries archived to `logs/phase-7.md`
- [ ] `tasks/phase-7.md` compressed to summaries
- [ ] `AGENTS.md` updated with Phase 7 patterns
- [ ] `docs/phase-7-retro.md` written
- [ ] `tasks/phase-8.md` generated
- [ ] Lint passes | Build passes | Commit created
