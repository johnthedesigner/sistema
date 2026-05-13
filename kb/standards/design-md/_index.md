---
type: index
category: standards
slug: design-md
updated: 2026-05-12
---

# DESIGN.md — Format Specification

**Category:** `standards`
**Status:** Active — format introduced by Google Stitch (2025)
**Official docs:** https://stitch.withgoogle.com/docs/design-md/overview
**Specification:** https://stitch.withgoogle.com/docs/design-md/specification

---

## Overview

DESIGN.md is a format specification maintained by Google Stitch for encoding a product's visual design language in a way that AI coding tools can read and act on. It defines a two-layer file format: YAML front matter for machine-readable design tokens (exact hex values, font properties, spacing scales) and a markdown body for human-readable design rationale.

This is a **standards** entry because DESIGN.md is an authoritative format specification with defined conformance behavior — not a design system, and not design theory. It belongs here alongside WCAG and ARIA APG.

Sistema uses this format for all `design-md/` files in the knowledge base.

---

## Content Inventory

| File | Topic | Status | Retrieved |
|---|---|---|---|
| overview@2026-05-12.md | What is DESIGN.md — philosophy, two-layer structure, creation paths, minimal example | latest | 2026-05-12 |
| spec@2026-05-12.md | Formal specification — YAML token schema, 8 sections, type system, token references, consumer behavior | latest | 2026-05-12 |

**Total files:** 2 versioned content files + 2 redirect stubs

---

## Version History

| Date | Action |
|---|---|
| 2026-05-12 | Initial capture — scraped from stitch.withgoogle.com via Firecrawl; placed in `standards/` |
