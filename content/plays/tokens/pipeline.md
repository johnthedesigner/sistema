---
id: tokens.pipeline
title: Compile the tokens
description: Compile the DTCG token sources to CSS custom properties with Style Dictionary, regenerate DESIGN.md's front matter from them, and build a token check page for review.
topic: tokens
kind: create
milestone: foundations
entry: true
requires: [tokens/src/color.json, "project:stack"]
produces: [style-dictionary.config.mjs, sistema-review/token-check.html]
tools: []
knowledge:
  - guide.tokens.architecture#the-tier-model
  - guide.tokens.architecture#dark-mode-at-the-token-level
  - guide.tokens.architecture#common-failure-modes
rules: [tokens.source.dtcg, tokens.naming.role, tokens.naming.consistent, color.preview.ramp-strips, quality.review.outline]
evidence: The compile command's successful output, the list of compiled files, every file outside tokens/ that this play changed, a passing app build, and sistema-review/token-check.html showing every token. The person reviews token-check.html at the gate that follows.
overrides: []
last_reviewed: 2026-11-15
---
The JSON files in `tokens/src/` are the only place token values are written. Everything this play produces is generated from them.

1. **List the sources.** Note every JSON file in `tokens/src/`. Some may not exist yet if earlier plays were skipped. Compile what is there.

2. **Pick the output path** from the stack and folder layout. For Next.js with a `src/` folder, use `src/styles/tokens/`. Without one, use `styles/tokens/`. For other stacks, follow the project's layout. Ask one question only if it is unclear.

3. **Write `style-dictionary.config.mjs`** for Style Dictionary v5:
   - Source: every JSON file in `tokens/src/`.
   - Output: CSS custom properties named `--<category>-<name>`, for example `--color-primary`, `--radius-md`, `--space-4`.
   - Dark theme: if `color.dark.json` exists, output its values under `[data-theme="dark"]`, with a `@media (prefers-color-scheme: dark)` fallback.
   - Add `"tokens": "node style-dictionary.config.mjs"` to `package.json` scripts. Install `style-dictionary` as a dev dependency if it is missing. If the install is blocked, ask the person to approve it or run it, and continue once it is in place.

4. **Compile.** Run `npm run tokens`. If it fails, find the cause and fix it before going on. Do not skip a failed compile.

5. **Wire the CSS in.** Import the compiled CSS from the global stylesheet, and check the import path against the real folder layout.
   - **Tailwind 4:** generate a second file with an `@theme inline reference { ... }` block that maps each role token to its custom property, for example `--color-primary: var(--color-primary);`. Expose role tokens only, not primitive ramps. Map the other categories to Tailwind's namespaces: type roles to `--text-<role>` (with `--text-<role>--line-height`, `--text-<role>--font-weight`, and `--text-<role>--letter-spacing`), font families to `--font-<name>`, radii to `--radius-<level>`, spacing steps to `--spacing-<step>`, and shadows to `--shadow-<level>`. `reference` stops Tailwind from re-declaring the variables, which would make each one refer to itself. Also add `--color-*: initial;` in an `@theme` block, so Tailwind's default palette is removed and only the system's colors exist, unless the person wants to keep it.
   - **Tailwind 3:** extend `theme.colors` (and the other categories) in the Tailwind config with `var(--color-primary)` and so on. Role tokens only.
   - After building, search the compiled CSS for any custom property that refers to itself (`--x: var(--x)`) and fix the cause.

6. **Replace old sources.** If DECISIONS.md lists old sources to replace (for example, a Tailwind theme block or hard-coded values in components), point them at the role tokens now, so nothing still uses the old values. If the person chose to keep old names (for example, existing Tailwind utilities like `bg-brand-500`), define those names as aliases of the new tokens instead of rewriting their uses. Change only what that list names. Keep a list of every file outside `tokens/` you change. Then run the app's build. It must pass.

7. **Regenerate DESIGN.md front matter.** Write the token values from `tokens/src/` into DESIGN.md's YAML front matter, using the token schema in the DESIGN.md specification (section "Design tokens (YAML front matter)"): `{{sistema_url}}/raw/standards/design-md/spec`. In short:

   ```yaml
   name: <sistema.json project.name>
   colors:
     <role>: "#rrggbb"
   typography:
     <role>: { fontFamily: <name>, fontSize: <px>, fontWeight: <number>, lineHeight: <number> }
   rounded:
     <level>: <px>
   spacing:
     <level>: <px>
   ```

   Generate it from the same script, so it can't drift. Add a comment saying it is generated and must not be edited. Do not change the body sections.

8. **Build `sistema-review/token-check.html`.** It loads the compiled CSS by a relative path and shows:
   - the workflow outline strip at the top;
   - every color role as a labeled swatch with its value, and each primitive ramp as a continuous strip;
   - every type role as a live specimen, every radius as a box at that radius, and every spacing step as a bar of that width;
   - next to each color role, whether it matches the value shown in the approved style preview, and for each one that differs, why;
   - a section "Approved but not yet tokenized" listing direction values (from the DESIGN.md Overview) whose category has no tokens yet because its play was skipped;
   - at the end, the line naming the `continue` URL from `sistema.json`.

9. Show the evidence: the compile output, the compiled file paths, the files outside `tokens/` you changed, the build result, and a summary of what `token-check.html` shows.
