---
id: components.specify
title: Specify a component
description: Write a component specification (variants, sizes, states, token map, accessibility, and behavior) that is consistent with the system's existing components and can be implemented without guessing.
topic: components
kind: create
milestone: patterns
entry: true
requires: [tokens/src/color.json, "project:a11y-standard"]
produces: []
tools: []
knowledge:
  - guide.tokens.architecture#naming-principles
  - guide.accessibility.floor#2-keyboard-navigation
  - guide.accessibility.floor#5-semantic-structure-and-aria
rules: [accessibility.target-size, accessibility.focus-visible, accessibility.keyboard, accessibility.name-and-state, tokens.usage.no-raw-values, content.errors.no-exclamation, ai.ui.sources-distinct, ai.ui.generated-content-marked, ai.ui.stop-generation, ai.ui.retry]
evidence: The specification file, and a list of any new tokens or rules the component needs that the system doesn't have yet.
overrides: [component]
last_reviewed: 2026-11-15
---
1. **Read the system:** DESIGN.md (especially Components and Do's and Don'ts), the token files in `tokens/src/`, DECISIONS.md, and the existing component files. Ask which component to specify if `component` isn't given. Find any existing component that is similar: the new one should share its sizes, states, and API conventions.

2. **Write `docs/components/<name>.md`** with these sections:
   - **Purpose:** what it is for, and what to use instead in nearby cases.
   - **Variants:** name, description, and when to use each.
   - **Sizes:** each size with height, padding, and type role, or "one size".
   - **States:** default, hover, focus, active, disabled, plus any the component needs (loading, invalid, selected, expanded), each with the token it changes.
   - **Token map:** every token it consumes, grouped by container, text, border, shape, type, and spacing. Role names only.
   - **Accessibility:** the native element or ARIA pattern, keyboard behavior, accessible name, exposed states, target size, and focus indicator, following the rules below for the standard in `sistema.json`.
   - **Behavior:** motion, loading, icons, overflow, and edge cases such as long text or an empty value.
   - **Copy:** labels and messages, following VOICE_AND_TONE.md if it exists.

3. **Check consistency** with similar components. If the spec needs a token or pattern the system doesn't have, list it rather than inventing a value.

4. Show the evidence: the file and the list of gaps.
