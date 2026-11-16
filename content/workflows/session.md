---
id: workflow.session
title: Work on the system
description: Day-to-day work on an established design system, from adding a component to auditing and planning, each run as a short route that starts by checking the system's current state.
entry: true
start_with: project.orient
routes:
  add-component: [components.specify, components.implement]
  audit-component: [components.audit]
  audit-accessibility: [accessibility.audit]
  audit-token-coverage: [tokens.coverage-audit]
  add-theme: [color.add-theme, tokens.pipeline]
  bring-in-existing-colors: [color.map-existing, tokens.pipeline]
  review-the-system: [project.review]
  plan-next-iteration: [project.plan]
last_reviewed: 2026-11-15
---
Use this after Start (and Patterns, if it ran) for ongoing work. Each session begins by orienting, then follows one route. `bring-in-existing-colors` also covers moving a Tailwind color config into the system.
