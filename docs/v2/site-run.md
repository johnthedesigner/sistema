# Sistema on its own site (V3.8)

**Date:** 2026-11-21 to 2026-11-22. **Status:** done, with one open item.

Sistema ran its own Start workflow on this repository, with the owner at each approval. This page records the run as material for explaining the method.

## What happened

| Step | Result |
|---|---|
| Bring the brief across (`project.migrate-brief`) | `LIVING_BRIEF.md` placed into `sistema.json`, DECISIONS.md, and DESIGN.md (30 items, 9 log entries). Four conflicts settled by the owner: page background left to the direction; dark mode follows the system with a footer switch; a link color that passes at small sizes; reduced motion supported. |
| Set the visual direction | Logo colors fixed, blue as the accent (owner's scope choice). Five questions rendered on Sistema's own guide page. The owner kept four proposals and chose grays tinted toward blue over the proposed warm grays. Approved 2026-11-21. |
| DESIGN.md | Eight sections, roles not values. |
| Voice and tone | Existing VOICE_AND_TONE.md kept. |
| Color, type, shape, spacing | Ramps from the palette tool; 50 roles in light and dark; 110 pairs checked with the contrast tool, all passing WCAG 2.2 AA after one fix (control edges one stop darker for selected rows) and one added role (a menu highlight visible on dark menus). Type from the type scale tool (base 16, major third, caption tuned up to 12px). Radius 6, 8, 12, 16; shadows by role, panels flat. 4px spacing. |
| Compile | A new Style Dictionary pipeline over DTCG sources: CSS with dark under `[data-theme]` and the system setting, a Tailwind theme, DESIGN.md front matter, and the token check page. Old token files removed. Approved 2026-11-21. |

Then the site restructure moved every page onto the new roles.

## What it showed about the method

- **The owner's choices changed the result in ways the proposals didn't predict.** Tinted grays instead of warm; on Relay earlier, four of seven answers. Showing options on the product, rather than describing them, is what made that possible.
- **Brand colors are fixed points, but accessible interface colors may differ.** White on the logo blue fails contrast for small text, so buttons and links use a slightly deeper stop of the same ramp, and the exact logo colors stay as brand roles.
- **The review page itself needed design work.** Two rounds of owner notes turned the style preview into the visual direction page template now used for every project.

## Open

- **Raw values in older pages.** About 250 hand-set pixel sizes (`text-[13px]` and similar) remain in the tool and reference pages. They should move to the type and spacing roles, through `tokens.coverage-audit`, in the deferred layout pass.
