---
system: polaris
category: foundations
topic: surface-roles
content_type: guidance
status: latest
retrieved: 2026-11-20
source_url: https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/dist/esm/src/themes/base/color.mjs
license: "MIT with a Shopify-only use restriction (LICENSE.md in the package); not an open licence, so treated as tier 2: synthesis only"
tags: [color, surfaces, emphasis, prominence, inverse, brand]
---

# Polaris: surface and emphasis roles (tokens 9.4.2)

Notes on the role names and their published descriptions in `@shopify/polaris-tokens` (base theme). Values are not recorded; only the structure matters here.

## Surfaces named by prominence, not depth

- `color-bg`: the default background of the admin (the page).
- `color-bg-surface`: "elements with the highest level of prominence, like a card".
- `color-bg-surface-secondary`: a secondary level of prominence.
- `color-bg-surface-tertiary`: a third level of prominence.

Each has hover, active, and selected variants. The ordering is by how much attention the element should get, which is not the same as how deeply it is nested.

## Emphasis families

| Family | Described use |
|---|---|
| `surface-brand` / `fill-brand` | Apply the key (brand) color to elements; the fill version is for main actions such as primary buttons |
| `surface-emphasis` / `fill-emphasis` | Areas of focus in editors, such as the theme editor |
| `surface-magic` / `fill-magic` | Elements suggested by AI |
| `bg-inverse` / `surface-inverse` / `fill-inverse` | High-contrast page or component backgrounds, and elements placed on them |

## Surface versus fill

Polaris splits backgrounds into **surface** (large areas, like a card) and **fill** (contained elements with a smaller area, like a button or badge). Each emphasis family exists in both, so a strong color can be used at a large or small scale with roles tuned for each.

## Relevance to Sistema

Supports D24: emphasis roles beside the ordinary surface ladder, and prominence as the organizing idea. The surface and fill split is a useful distinction for how strong an emphasis color can be at different sizes.
