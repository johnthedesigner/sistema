---
id: workflow.session
title: Update the system
description: Day-to-day work on an established design system, from adding a component to auditing and planning, each run as a short route that starts by checking the system's current state.
entry: true
start_with: project.orient
routes:
  add-component: { title: Add a component, plays: [components.specify, components.implement] }
  add-mode: { title: "Add a mode (dark theme, compact density, or reduced motion)", plays: [tokens.add-mode, tokens.pipeline] }
  bring-in-existing-colors: { title: Bring in existing colors, plays: [color.map-existing, tokens.pipeline] }
  audit-component: { title: Audit a component, plays: [components.audit] }
  audit-accessibility: { title: Audit accessibility, plays: [accessibility.audit] }
  audit-token-coverage: { title: Audit token use, plays: [tokens.coverage-audit] }
  change-a-decision: { title: Change an approved direction or foundation, plays: [project.revise] }
  review-the-system: { title: Review the system, plays: [project.review] }
  plan-next-iteration: { title: Plan the next round, plays: [project.plan] }
  document-the-system: { title: Document the system, plays: [components.docs-site] }
  build-a-page: { title: Build a page or screen, plays: [components.build-page] }
  not-sure: { title: "Not sure yet: suggest what to do next", plays: [project.plan] }
last_reviewed: 2026-11-28
---
Use this after Start (and Patterns, if it ran) for ongoing work. Each session begins by orienting, then follows one route. `bring-in-existing-colors` also covers moving a Tailwind color config into the system. `not-sure` is for when the person doesn't know where to start: orient, then plan.
