# shadcn/ui — System Index

**Slug:** `shadcn`
**Version captured:** shadcn/ui docs (v4 app), as of 2026-11-17
**Maintained by:** shadcn
**Status:** Active — open-code component collection for React, copied into the project

---

## Overview

shadcn/ui is a collection of React components copied into the project rather than installed as a dependency, built on Tailwind and on Radix, Base UI, or React Aria primitives. It is the first suggestion in Sistema's `components.scaffold-core` for React with Tailwind. Its conventions matter to Sistema's token naming: semantic color tokens as surface/foreground pairs, a radius scale derived from one base, and no type tokens (Tailwind's sizes, with roles in component classes).

**When to reference:** naming color roles and radius for projects that will use shadcn/ui; deciding how type is named when shadcn/ui is the component library; styling long-form content (Typeset).

---

## Source Map

| Content | Source | URL | License |
|---|---|---|---|
| Theming | ui.shadcn.com/docs + shadcn-ui/ui repository | https://ui.shadcn.com/docs/theming | MIT (tier 1). The repository, including `apps/v4/content/docs`, is MIT licensed |
| Typography examples | shadcn-ui/ui repository | https://ui.shadcn.com/docs/components/radix/typography | MIT |
| Typeset | shadcn-ui/ui repository | https://ui.shadcn.com/docs/typeset | MIT |

**Scrape notes:** Firecrawl captured the theming page text but not its code blocks (rendered client-side), and returned no pages for the typography component page. Code and the typography and Typeset pages were taken from the MDX and example sources on GitHub (`raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/...`).

---

## Content Inventory

| Stub path | Topic | Type | Status |
|---|---|---|---|
| `shadcn/guidance/foundations/theming` | CSS variable theming, surface/foreground token pairs, radius derived from one base | guidance | latest |
| `shadcn/guidance/foundations/typography` | No type tokens; Tailwind sizes per element; Typeset's three controls | guidance | latest |

---

## Version History

| Date | Action |
|---|---|
| 2026-11-17 | Initial capture (V1.17), for the typography naming decision |
