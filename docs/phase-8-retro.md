# Phase 8 Retrospective

**Date:** 2026-05-14
**Phase goal:** Deepen the tool suite — more campaigns, generative palette input, KB completion for typography.

---

## What was accomplished

Phase 8 completed the tool suite started in Phase 7 and added the first end-to-end dogfooding run.

**Responsive typography KB (8.0):** Google Fonts Knowledge confirmed CC BY 4.0. Synthesized `responsive-typography.md` — optical sizing, variable font axes, `clamp()`-based fluid type, tracking direction. Closes the last major gap in the foundations typography coverage.

**Source citations sidebar (unplanned):** Added a `SourcesSidebar` component that reads `source_url`, `derived_from`, and `sources` frontmatter fields and renders linked sources on every KB content page. Requires no changes to existing files; all synthesis docs already had the fields populated.

**Audit and Refactor campaign (8.1):** Second campaign using Stage 6 stewardship plays. No new app code needed — the campaign system generalized cleanly. Two campaigns now in the index. The pattern is established; additional campaigns are cheap to add.

**Custom palette seed input (8.2):** `/tools/palette` is now generative. Users can enter any hex and generate a 19-stop OKLCH palette inline. The palette API was already complete; this was purely a UI layer.

**Stage 6 exemplars (8.3):** All six stewardship plays have exemplar outputs. Used a fictional "Verdant" system as context. Exemplar quality is high enough to orient a new user.

**Palette algorithm fixes:** Five commits resolving washed-out greens and yellows — a perceptual failure that would have damaged trust in the tool. Root cause: chroma taper was calibrated for blues/reds and too aggressive for high-chroma hues. Fixed with gamut-relative scaling and lightness-normalized taper. Yellow reseeded to brand yellow (#FFCC33). The library is now visually credible.

**Dogfooding — bootstrap campaign on Sistema itself:** Ran all 6 bootstrap campaign steps against the Sistema app. Produced token files (colors, typography, shape), Style Dictionary v5 pipeline, Tailwind config wiring, next/font integration, and a full design pass across 24 files. First end-to-end proof that the campaign produces a working token layer.

---

## What changed unexpectedly

**Palette quality failure surfaced during dogfooding.** The washed-out hue problem wasn't caught during Phase 7 because the library was only used as a color reference, not as a design system primitive. Using it as a real seed for Sistema's palette exposed the problem immediately. Dogfooding pressure-tested the tool in a way that unit inspection didn't.

**Source citations sidebar was unplanned but high-value.** The frontmatter fields were already there; adding a component to surface them required a few hours but substantially improves the credibility of synthesis documents. This kind of low-lift, high-ROI work should be recognized as a pattern.

**Dogfooding exposed a gap in positioning-brief.** The positioning brief collects decisions but doesn't format them as feed-forward inputs to the next play. Users had to manually re-state their color and type decisions in `generate-color-scheme` and `generate-type-scale`. This friction is documented in `_meta/BACKLOG.md`.

**The bootstrap campaign ends before components.** After 6 steps, the token layer is in place but there are no components. The next logical step — wiring a headless library to the token layer — has no play. Also documented in BACKLOG.md.

---

## Decisions made

- **Gamut-relative chroma taper** — taper strength scaled to each seed's maximum in-gamut chroma, not an absolute value. Correct for all hues.
- **Yellow reseeded to #FFCC33** — Tailwind yellow-600 (#CA8A04) is too orange to read as yellow on white surfaces. Brand yellow (#FFCC33) produces the expected perceptual result.
- **Source citations sidebar as a sidebar, not inline** — inline source links in body text would appear as actionable hyperlinks to LLMs consuming the raw markdown, which distorts how the content is interpreted. Sidebar only.
- **Two campaigns as the phase-end target** — enough to establish that campaigns generalize; Phase 9 focuses on play quality rather than more campaigns.

---

## What didn't get done

**Play quality audit.** The dogfooding session confirmed the token layer generates correctly, but the plays themselves were not evaluated against the standard: do they produce effective, efficient, accessible, usable design system foundations? This is the critical gap identified at phase end and the primary focus of Phase 9.

**Vercel deployment.** Still on localhost. Plays reference `{{sistema_url}}` which resolves to localhost in dev — this means any link embedded in a copied prompt points to a non-public URL. Play testing requires a live deployment.

**APCA palette variant.** Deferred; not high enough priority given the play quality gap.

---

## What's next (Phase 9)

The dogfooding session produced a clear finding: the token pipeline works, but the plays that drive it have not been rigorously evaluated against their intended outcome. Phase 9 is a quality audit and improvement cycle focused on the plays themselves.

- **Play quality audit** — run every current play end-to-end; evaluate output against criteria (format, accessibility compliance, no reference-system fingerprints, no unresolved variables); document failures
- **Fix `positioning-brief` feed-forward** — BACKLOG item; produces formatted inputs for downstream play variables
- **`scaffold-component-library` play** — BACKLOG item; bridges token generation and component implementation via a headless library
- **Vercel deployment** — prerequisite for real-world play testing from shared URLs

Build at phase end: **142 static pages.** All lint checks passing. KB: responsive typography added; source citations sidebar added; palette algorithm corrected; design token pipeline wired end-to-end.
