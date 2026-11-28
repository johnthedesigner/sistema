# Site drift audit (2026-11-28)

After the review's site work (V5.4 to V5.6), the owner caught an italic Fraunces "vs" label: a one-off no part of the system called for. This audit checks everything added or changed for drift from the site's own system (DESIGN.md, the role tokens, the shared components), fixes it, and records the new patterns.

## How it was checked

A scan of `src/**/*.tsx` for: Fraunces on non-heading roles, italics, raw hex colors in classes, `white` and `black`, Tailwind's default palette, raw text sizes and line heights, radii and shadows outside the tokens, and inline styles. Then a look at each changed page in the browser.

## Found and fixed

| Drift | Where | Fix |
|---|---|---|
| Italic Fraunces "vs" at label size | How Sistema works | Inter label role |
| Fraunces at label size | The "one system" mini screens, How Sistema works | Inter label role |
| Raw white with opacity | The terminal illustration, How Sistema works | `on-surface-inverse` with opacity |
| Raw white and black | The footer's theme switch | The footer's own tone tokens (`footer-*-line` for the track) |
| Tailwind's default `rounded`, `rounded-full` | How Sistema works, the command palette | `radius-*` tokens |
| Raw text sizes, line heights, inline font sizes | The play and workflow pages, privacy, the command palette, credits | Type roles (caption, body-sm, body-lg, heading-sm, heading-xl) |
| **Opacity modifiers on role colors generated nothing** (`bg-surface-raised/95` and every other `/NN` on a token color), so the nav bar, the palette's scrim, and several states had silently lost their translucency | Site-wide | Tailwind config: role colors defined with `color-mix()` and `<alpha-value>`, so opacity works and solid colors are unchanged |

## Deliberate exceptions

- **The drift illustration** on How Sistema works uses mismatched raw values on purpose; they are what it shows. Commented in the code.
- **Inline styles for data:** color swatches, the dark mode table, the prompt box notch position, and the logo artwork.

## Left for V5.7

The tool pages and their components (contrast, type scale, specimen, palette) hold most of the remaining raw sizes and the specimen viewer's raw white. They are rebuilt in V5.7 on the tool page principles (D46).

## Patterns recorded

The new patterns are now listed in DESIGN.md's Components and logged in DECISIONS.md: entry page sections, documentation pages with a nested contents rail, alphabetical index lists grouped by topic, one icon set with an icon per topic and kind, blue approval cards, status as a dot beside a plain label, the landing page timeline, alternating rows, framed screenshots and comparison panel, the joined choice-and-routes prompt box, and the footer.

## Keeping it honest

- **Sistema:** a new rule, `quality.consistency.system-first`, in the plays that build and review interfaces; the AGENTS.md section Sistema writes into projects now covers everyday interface work, not only design system work.
- **This repo:** AGENTS.md says the same for the site, with a drift check after each batch of visual changes; a feedback memory carries it across sessions.
