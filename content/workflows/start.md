---
id: workflow.start
title: Start a design system
description: Take a project from no design system, or an existing one, to a verified token system that every agent in the repo can build on.
entry: true
sequence:
  - project.assess
  - visual-language.direction
  - gate: direction-approved
    prompt: Open sistema-review/style-preview.html and approve the visual direction, or say what to change.
  - visual-language.design-md
  - content.voice-and-tone?
  - color.scheme
  - typography.scale
  - shape.tokens
  - spacing.tokens
  - tokens.pipeline
  - gate: foundations-approved
    prompt: Open sistema-review/token-check.html and confirm the compiled tokens match what was approved. Note anything listed as approved but not yet tokenized.
continue_with: workflow.patterns
last_reviewed: 2026-11-15
---
This works for a new project and for one that already has some of these pieces. The first play checks what exists, and finished work is skipped.
