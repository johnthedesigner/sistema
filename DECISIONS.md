This project follows Sistema. "Start a design system" is finished. For later design system work, fetch the URL in sistema.json "continue".

# Decisions

## Positioning

Sistema is a method and a website. The method guides an AI coding agent through building a design system in a person's own repository, with the person approving each stage. The website explains the method to designers and engineers, gives them a prompt to paste into their agent, and serves the same material as plain text for agents, along with tools for palettes, contrast, and type scales. Readers are experienced designers and engineers, from solo builders to design system teams; they come to understand the method, copy a prompt, look up a guide or rule, or use a tool. Pages mix reading (guides, how it works) with reference and short task flows. The site should feel calm, editorial, and trustworthy, with a recognizable brand, and it should demonstrate the craft it teaches. Web only, light first with a dark theme, built by one person.

Inferred, not asked: the accessibility standard (WCAG 2.2 AA, from the first log entry); the stack (from package.json); the audience wording (from the brief and the content).

## Log

2026-11-21 | Page background | Left to the new direction's warm or cool question (owner).
2026-11-21 | Dark mode access | Follows the system setting, with a theme switch in the footer's bottom row (owner).
2026-11-28 | Footer | The header's Sistema by JTD lockup, about twice the earlier size, above the columns on a solid background: logo blue by default, red or yellow while that shape is hovered; the green and purple overlaps count as blue (owner). Blue steps one stop darker than the logo (palette.logo.blue-550) so white text passes (5.53; the logo blue itself is 4.41). Red steps lighter (red-450) and yellow darker (yellow-300), both with dark text (4.99 and 9.34), so each logo shape still shows against its own background. The divider is one stop darker than each background. Roles footer-*, on-footer*, footer-*-line; the names are kept despite tokens.naming.role, since each is a fixed brand color.
2026-11-28 | Eyebrows | Sentence case, label size, no capitals (owner).
2026-11-21 | Small-text links | The color step sets a link color that passes contrast at small sizes (owner).
2026-11-21 | Reduced motion | Supported, as the accessibility rule requires (owner).
2026-11-21 | Direction scope | The logo colors stay, and blue #0070FF stays the interface accent; the direction asks the other questions (owner).
2026-11-21 | Foundations approved | Tokens in tokens/src, compiled by npm run tokens; pages move to the roles in the site restructure (owner).
2026-11-21 | Direction answers | Brand color, grays tinted toward blue (proposed warm), 8px with round chips, tone separation, Inter with Fraunces headings (owner).
2026-11-21 | Moved from LIVING_BRIEF.md | The brief's content now lives in DESIGN.md, DECISIONS.md, and sistema.json. Four conflicts were listed for the owner.
2026-05-14 | Positioning brief (from LIVING_BRIEF.md) | Brand palette locked: blue #0070FF, yellow #FFCC33, red #E60026; light primary, dark on the system setting; WCAG 2.2 AA; Next.js and Tailwind.
2026-05-14 | First DESIGN.md (from LIVING_BRIEF.md) | Inter and JetBrains Mono; 4px spacing base; radii 4, 8, 12, full; #0070FF fails small text on white, so body links need a darker blue; red never for errors.
2026-05-14 | Color scheme (from LIVING_BRIEF.md) | Named palette model; light and dark through [data-theme]; 15 roles; feedback colors distinct from the brand palette.
2026-05-14 | Type scale (from LIVING_BRIEF.md) | Hand-tuned scale of 10 roles; Inter for headings and UI, Fraunces for body, JetBrains Mono for code.
2026-05-14 | Shape tokens (from LIVING_BRIEF.md) | Named scale; 8px interactive, 12px containers; pills for badges and chips. Replaced later by sm 6, md 10, lg 16, xl 22.
2026-05-14 | Style Dictionary (from LIVING_BRIEF.md) | Two-tier JSON source, Style Dictionary v5, CSS custom properties and an ESM module; dark through [data-theme="dark"].
2026-05-14 | Redesign (from LIVING_BRIEF.md) | Warm canvas #EFEEEA planned, new radii, logo, prompt box, new navigation and page designs.
2026-05-16 | Voice and tone (from LIVING_BRIEF.md) | VOICE_AND_TONE.md: practitioner-grade, specific, direct; sentence case; contractions.
2026-05-27 | Retrospective (from LIVING_BRIEF.md) | DESIGN.md out of date; canvas shipped as #FFFFFF, not the planned warm canvas; spacing de facto Tailwind's default.
