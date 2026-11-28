---
id: project.review
title: Review the system
description: Compare what the code does with what DESIGN.md and DECISIONS.md say, find drift and undocumented additions, and update the records.
topic: project
kind: check
milestone: maintain
entry: true
requires: [DECISIONS.md]
produces: []
tools: [validate]
knowledge:
  - guide.tokens.architecture#common-failure-modes
rules: [project.state.valid, visual-language.design-md.roles-not-values, visual-language.direction.changes-propagate, quality.consistency.system-first]
evidence: A report with four sections (drift, undocumented additions, decisions to revisit, and DESIGN.md changes needed), and the records updated to match.
overrides: []
last_reviewed: 2026-11-15
---
Run this at the end of a cycle of work or before a release.

1. **Read the records:** DESIGN.md, DECISIONS.md, `sistema.json`, and any reports in `docs/audits/`.

2. **Read the system:** the token files, the component folder, and the showcase or reference route. Send every file in `tokens/src/` to the token validator with the project's standard, and include its failures in the report.

3. **Answer four questions:**
   - **Drift:** where does the code differ from what the records say? Give each with the record and the code location.
   - **Undocumented additions:** which components, tokens, or patterns exist that the records don't mention?
   - **Decisions to revisit:** which early decisions no longer fit how the product is used? Say why.
   - **DESIGN.md:** what has to change for it to describe the system as it is?

4. **Agree on the fixes with the person:** which records to update, and which code to change back. Then update DESIGN.md and add a DECISIONS.md entry for each changed decision. Code changes become tasks for `project.plan` or a session route.

5. Write the report to `docs/audits/project.review-<YYYY-MM-DD>.md` and show it.
