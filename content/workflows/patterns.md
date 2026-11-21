---
id: workflow.patterns
title: Build the patterns
description: Build the first components and pages on an approved token system, so the product's main screens can be made from the system rather than around it.
entry: false
sequence:
  - components.scaffold-core
  - gate: components-approved
    prompt: Open the component showcase in the running app, in every theme, and approve the core components or say what to change.
  - components.page-examples?
  - components.docs-site?
continue_with: workflow.session
last_reviewed: 2026-11-15
---
This continues from Start. It needs the compiled tokens and the Foundations approval. Page examples and the system reference (in Storybook or as a page in the app) are optional: offer each one, and run it only if the person wants it.
