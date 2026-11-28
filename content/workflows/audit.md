---
id: workflow.audit
title: Audit an existing system
description: Take stock of an established UI or design system, see what's consistent, what fails, and what's missing, and decide what to do about it, before anything changes.
entry: true
sequence:
  - project.assess
  - project.audit
  - gate: audit-reviewed
    prompt: Open sistema-review/project.audit.html and the report in docs/audits/, then choose to bring the system into Sistema, fix specific findings, or stop here.
continue_with: workflow.start
last_reviewed: 2026-11-28
---
For a product that already has a look, a theme file, or a design system. Nothing in the code changes during the audit. If the person chooses to bring the system into Sistema, the start workflow continues from here and keeps what's consistent.
