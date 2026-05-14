# AI — Principles

## Overview

Two documents covering the intersection of design systems and AI: one on designing UI for products with AI features, one on structuring a design system so AI tools produce consistent output from it.

---

## What's in this section

- **ui-patterns** — UI patterns specific to AI-powered products: chat and conversation interfaces (message differentiation, status states, markdown rendering), streaming and generative states (typing indicator, progressive text rendering, layout shift prevention), confidence and uncertainty signals, prompt input UX (expandable textarea, stop generation, slash commands), AI-specific error states and retry patterns, and per-response feedback mechanisms.

- **llm-compatibility** — How a design system's structure affects LLM codegen quality: token naming for comprehension (semantic names, consistent patterns, coverage density), file structure for context window efficiency (independent files, length targets, front-loading), DESIGN.md as the primary AI brief (what to include, context window cost, keeping it current), the living brief pattern (structure, size constraint, integration with plays), and component documentation structure for LLM consumption (token consumption over values, avoiding cross-file dependencies).

---

## Source Map

| Source | URL | License tier |
|---|---|---|
| DESIGN.md Specification | `kb/reference/standards/design-md/spec` | Tier 2 (official public docs) |
| DESIGN.md Overview | `kb/reference/standards/design-md/overview` | Tier 2 (official public docs) |
| Token Architecture | `kb/principles/tokens/architecture` | Internal synthesis |
