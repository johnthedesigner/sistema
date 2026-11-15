---
id: tokens.pipeline
title: Compile the tokens
description: Compile the DTCG token sources to CSS custom properties with Style Dictionary, regenerate DESIGN.md's front matter from them, and build a token check page for review.
topic: tokens
kind: create
milestone: foundations
entry: true
requires: [tokens/src/color.json, "project:stack"]
produces: [style-dictionary.config.mjs, token-check.html]
tools: []
knowledge:
  - guide.tokens.architecture#the-tier-model
  - guide.tokens.architecture#dark-mode-at-the-token-level
  - guide.tokens.architecture#common-failure-modes
rules: [tokens.source.dtcg, tokens.naming.role]
evidence: The compile command's successful output, the list of compiled files, and token-check.html showing every token. The person reviews token-check.html at the gate that follows.
overrides: []
last_reviewed: 2026-11-14
---
The JSON files in `tokens/src/` are the only place token values are written. Everything this play produces is generated from them.

1. **List the sources.** Note every JSON file in `tokens/src/`. Some may not exist yet if earlier plays were skipped. Compile what is there.

2. **Pick the output path** from the stack and folder layout. For Next.js with a `src/` folder, use `src/styles/tokens/`. Without one, use `styles/tokens/`. For other stacks, follow the project's layout. Ask one question only if it is unclear.

3. **Write `style-dictionary.config.mjs`** for Style Dictionary v5:
   - Source: every JSON file in `tokens/src/`.
   - Output: CSS custom properties named `--<category>-<name>`, for example `--color-primary`, `--radius-md`, `--space-4`.
   - Dark theme: if `color.dark.json` exists, output its values under `[data-theme="dark"]`, with a `@media (prefers-color-scheme: dark)` fallback.
   - Add `"tokens": "node style-dictionary.config.mjs"` to `package.json` scripts. Install `style-dictionary` as a dev dependency if it is missing.

4. **Compile.** Run `npm run tokens`. If it fails, find the cause and fix it before going on. Do not skip a failed compile.

5. **Wire the CSS in.** Import the compiled CSS from the global stylesheet, and check the import path against the real folder layout. If DECISIONS.md lists old color sources to replace (for example, a Tailwind theme), point them at the compiled custom properties now.

6. **Regenerate DESIGN.md front matter.** Write the token values from `tokens/src/` into DESIGN.md's YAML front matter, in the DESIGN.md format's token structure. Do not hand-edit values there. Do not change the body sections.

7. **Build `token-check.html`** at the project root. It loads the compiled CSS and shows every color token as a labeled swatch with its value, every type role as a live specimen, every radius as a box at that radius, and every spacing step as a bar of that width. Skip categories that do not exist yet, and say so on the page.

8. Show the evidence: the compile output, the compiled file paths, and a summary of what `token-check.html` shows.
