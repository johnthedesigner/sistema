# Campaigns

Each campaign is a multi-step flow that sequences plays into a guided workflow. Campaigns are parsed by `src/lib/campaigns.ts`.

## Format

Each campaign follows this structure:

```
## slug — Title

**Steps:** play-slug-1, play-slug-2, ...

**Description:** One sentence describing the campaign's goal and outcome.
```

Steps are play slugs from `TASK_PLAYBOOKS.md`, in execution order.

---

## bootstrap — Bootstrap a Design System

**Steps:** establish-context, establish-visual-language, generate-design-md, generate-color-scheme, generate-type-scale, generate-shape-tokens, generate-style-dictionary, scaffold-core-components, generate-page-examples, setup-documentation-site

**Description:** Take a new design system from blank canvas through visual language establishment, a complete token system, core components, and a lightweight documentation site — in four structured phases.

---

## audit-and-refactor — Audit and Refactor a Design System

**Steps:** session-start, audit-token-coverage, accessibility-audit, design-system-retrospective, plan-next-iteration

**Description:** Run a structured health check on an existing design system — surface token drift, flag accessibility gaps, document what's changed, and plan the next iteration.
