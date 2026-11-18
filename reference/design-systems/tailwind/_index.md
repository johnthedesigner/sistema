# Tailwind CSS — System Index

**Slug:** `tailwind`
**Version captured:** Tailwind CSS v4, as of 2026-11-17
**Maintained by:** Tailwind Labs
**Status:** Active — utility-first CSS framework

---

## Overview

Tailwind is a utility-first CSS framework, not a design system. It matters to Sistema because it is the default styling layer on Sistema's default stack, and because shadcn/ui and many component libraries build on it. Its theme variables (`@theme`) are where a Tailwind project's tokens live, and its naming conventions (T-shirt sizes for type and radius, base-unit multiples for spacing) are what utility classes expect.

**When to reference:** naming tokens so they map onto Tailwind utilities; wiring compiled tokens into a Tailwind v4 theme; understanding what a Tailwind project's defaults are before changing them.

---

## Source Map

| Content | Source | URL | License |
|---|---|---|---|
| Theme variables | tailwindcss.com/docs | https://tailwindcss.com/docs/theme | Public documentation, no explicit license (tier 2). The docs repository (tailwindlabs/tailwindcss.com) has no license; the framework repository is MIT |
| Font size | tailwindcss.com/docs | https://tailwindcss.com/docs/font-size | Same |
| Border radius | tailwindcss.com/docs | https://tailwindcss.com/docs/border-radius | Same |
| Spacing (padding) | tailwindcss.com/docs | https://tailwindcss.com/docs/padding | Same |

**Use:** synthesis only, no verbatim reproduction. Token values and utility names are facts.

**Scrape notes:** Firecrawl, one page per call with `--wait 2000`, 60 seconds apart. All four pages rendered fully.

---

## Content Inventory

| Stub path | Topic | Type | Status |
|---|---|---|---|
| `tailwind/guidance/foundations/theme-variables` | `@theme`, namespaces, defaults, customization, default weights, line heights, tracking | guidance | latest |
| `tailwind/guidance/foundations/typography` | Font size utilities and paired line heights | guidance | latest |
| `tailwind/guidance/foundations/radius` | Radius scale | guidance | latest |
| `tailwind/guidance/foundations/spacing` | The single spacing base and its multiples | guidance | latest |

---

## Version History

| Date | Action |
|---|---|
| 2026-11-17 | Initial capture (V1.17), for the typography naming decision |
