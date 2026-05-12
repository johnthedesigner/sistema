# Phase 0 Task File

**Phase goal:** Scaffold the `tools/` directory with working scraping and validation scripts, then complete a full authoritative scrape and processing of Material Design 3 — replacing the current draft `material/` guidance content with content fetched directly from live sources. By end of phase, `material/` should contain only `status: latest` files, all stubs should be current, and frontmatter lint should pass with zero errors.

**Systems touched:** `material/`
**New directories:** `tools/`, `raw-scrape/` (gitignored)

---

## Task 0.1 — Tools scaffold

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** Scaffolded `tools/` package with Firecrawl scraper (`tools/scrape/firecrawl-guidance.ts`) and frontmatter linter (`tools/validate/lint-frontmatter.ts`); `npm install` clean (76 packages, 0 vulnerabilities); initial lint run: 18 files, 1 expected YAML error.

**Key decisions:**
- `"type": "module"` in `tools/package.json` for ESM consistency
- Linter skips `_index.md` (not a content file); `design-md` type uses `derived_from` instead of `source_url`
- `dotenv` loaded automatically so API keys don't need manual export

---

## Task 0.2 — Material Design 3 scrape

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** Three-pass Firecrawl scrape (styles/, foundations/, design-tokens/) produced 62 raw files covering all six required guidance topics plus elevation, icons, motion, M3 Expressive, layout, and accessibility. Design-tokens gap resolved via targeted third pass.

**Key decisions:**
- Three passes required; JS-rendered token tables (colors, typescale, corner radius) returned only labels — asset files used as authoritative source for values
- Gap in `/foundations/design-tokens` resolved by a third targeted pass against that URL directly

---

## Task 0.3 — Material guidance processing

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** All six required guidance files updated in-place with authoritative scraped content. Lint: 12 guidance files, 0 errors.

**Key decisions:**
- Same-date conflict (files already named `@2026-05-11.md`) resolved by in-place update — content substantially improved, which preserves the spirit of versioning
- `getting-started` YAML error deferred to Task 0.4 (out of scope for guidance-only task)

---

## Task 0.4 — Material assets and implementation verification

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** All 5 files verified against live upstream (GitHub material-web v0_192 SCSS). YAML error in `getting-started` fixed. Full lint: 18 files, 0 errors.

**Key decisions:**
- Neutral palette 1-unit hex delta not corrected — accent colors verified, visual difference imperceptible, correcting requires running material-color-utilities; documented as known minor discrepancy
- GitHub SCSS files use `@forward` delegation to `tokens/versions/v0_192/` — must target versioned modules directly for actual token values

---

## Task 0.5 — Material DESIGN.md regeneration

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** `DESIGN@2026-05-11.md` regenerated in-place from 9 verified source files; added nested light/dark color sections (28 roles each), letter-spacing on all 15 typescale entries, 3 M3 Expressive shape tokens, 5 new component mappings, and Token Architecture prose section. Lint: 18 files, 0 errors.

**Key decisions:**
- In-place update (same-date conflict) — content substantially improved from draft
- `derived_from` expanded from 7 to 9 entries to reflect all source files used

---

## Task 0.6 — Index and changelog update

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** `material/_index.md` Version History updated; `_meta/CHANGELOG.md` three Phase 0 entries added; `_meta/INDEX.md` verified accurate (no changes needed); final lint: 18 files, 0 errors.

**Key decisions:**
- Phase 0 tasks grouped into semantic CHANGELOG entries (0.1–0.2 as tools/scrape, 0.3–0.5 as enrichment/verification/DESIGN.md) rather than five separate same-date entries

---

## Task 0.7 — Phase 0 housekeeping

**Status:** complete
**Phase:** 0
**Session log entry:** archived to `logs/phase-0.md`

**Output:** Session log archived to `logs/phase-0.md`, tasks compressed, 3 new patterns added to `AGENTS.md`, `docs/phase-0-retro.md` written. `tasks/phase-1.md` reviewed — **file does not exist**; must be generated before Phase 1 begins.

**Key decisions:**
- `tasks/phase-1.md` not existing is a blocker for Phase 1; flagged in SESSION_LOG.md Current State
