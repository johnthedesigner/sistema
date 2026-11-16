---
id: workflow.session
title: Work on the system
description: Day-to-day work on an established design system, from adding a component to auditing and planning, each run as a short route that starts by checking the system's current state.
entry: true
start_with: project.orient
routes:
  add-component: { title: Add a component, plays: [components.specify, components.implement] }
  add-theme: { title: Add a theme, plays: [color.add-theme, tokens.pipeline] }
  bring-in-existing-colors: { title: Bring in existing colors, plays: [color.map-existing, tokens.pipeline] }
  audit-component: { title: Audit a component, plays: [components.audit] }
  audit-accessibility: { title: Audit accessibility, plays: [accessibility.audit] }
  audit-token-coverage: { title: Audit token use, plays: [tokens.coverage-audit] }
  review-the-system: { title: Review the system, plays: [project.review] }
  plan-next-iteration: { title: Plan the next round, plays: [project.plan] }
last_reviewed: 2026-11-15
---
Use this after Start (and Patterns, if it ran) for ongoing work. Each session begins by orienting, then follows one route. `bring-in-existing-colors` also covers moving a Tailwind color config into the system.
