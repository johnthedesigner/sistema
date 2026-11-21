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
  - guide.tokens.architecture#how-modes-are-stored-and-switched
rules: [tokens.source.dtcg, tokens.naming.role, tokens.naming.consistent, tokens.modes.overrides-only, tokens.modes.one-kind, color.preview.ramp-strips, quality.review.outline]
evidence: The compile command's successful output, the list of compiled files, every file outside tokens/ that this play changed, a passing app build, and sistema-review/token-check.html showing every token. The person reviews token-check.html at the gate that follows.
overrides: []
last_reviewed: 2026-11-15
---
The JSON files in `tokens/src/` are the only place token values are written. Everything this play produces is generated from them.

1. **List the sources.** Note every JSON file in `tokens/src/`. Some may not exist yet if earlier plays were skipped. Compile what is there.

2. **Pick the output path** from the stack and folder layout. For Next.js with a `src/` folder, use `src/styles/tokens/`. Without one, use `styles/tokens/`. For other stacks, follow the project's layout. Ask one question only if it is unclear.

3. **Write `style-dictionary.config.mjs`** for Style Dictionary v5:
   - Source: every JSON file in `tokens/src/`. Files named `<category>.<mode>.json` are modes, not defaults. `palette.json` is the primitive tier: role tokens refer to it, but it isn't output as custom properties or Tailwind utilities, so code can only use roles.
   - Output: CSS custom properties named `--<category>-<name>`, for example `--color-primary`, `--radius-md`, `--space-4`.
   - Modes: output each mode file's values under its selector.
     - `color.dark.json` goes under `[data-theme="dark"]`, with a `@media (prefers-color-scheme: dark)` fallback.
     - `*.compact.json` goes under `[data-density="compact"]`.
     - `motion.reduced.json` goes under `@media (prefers-reduced-motion: reduce)` and under `[data-motion="reduced"]`.

     Fail the compile if a mode file names a token the defaults don't have, or if two kinds of mode change the same token.
   - Add `"tokens": "node style-dictionary.config.mjs"` to `package.json` scripts. Install `style-dictionary` as a dev dependency if it is missing. If the install is blocked, ask the person to approve it or run it, and continue once it is in place.

4. **Compile.** Run `npm run tokens`. If it fails, find the cause and fix it before going on. Do not skip a failed compile.

5. **Wire the CSS in.** Import the compiled CSS from the global stylesheet, and check the import path against the real folder layout.
   - **Tailwind 4:** generate a second file with an `@theme inline reference { ... }` block that maps each role token to its custom property, for example `--color-primary: var(--color-primary);`. Expose role tokens only, not primitive ramps. Map the other categories to Tailwind's namespaces: type roles to `--text-<role>` (with `--text-<role>--line-height`, `--text-<role>--font-weight`, and `--text-<role>--letter-spacing`), font families to `--font-<name>`, radii to `--radius-<level>`, spacing steps to `--spacing-<step>`, and shadows to `--shadow-<level>`. `reference` stops Tailwind from re-declaring the variables, which would make each one refer to itself. Also add `--color-*: initial;` in an `@theme` block, so Tailwind's default palette is removed and only the system's colors exist, unless the person wants to keep it.
   - **Tailwind 3:** extend `theme.colors` (and the other categories) in the Tailwind config with `var(--color-primary)` and so on. Role tokens only.
   - A type role that also needs a font family or a text transform (a mono data style, an uppercase overline) can't be expressed by a `--text-<role>` variable alone. Generate a utility for it with `@utility` (for example `text-overline`) that sets every property the role needs.
   - After building, search the compiled CSS for any custom property that refers to itself (`--x: var(--x)`) and fix the cause.

6. **Replace old sources.** If DECISIONS.md lists old sources to replace (for example, a Tailwind theme block or hard-coded values in components), point them at the role tokens now, so nothing still uses the old values. If the person chose to keep old names (for example, existing Tailwind utilities like `bg-brand-500`), define those names as aliases of the new tokens instead of rewriting their uses. Change only what that list names. Keep a list of every file outside `tokens/` you change. Then run the app's build. It must pass.

7. **Regenerate DESIGN.md front matter.** Write the token values from `tokens/src/` into DESIGN.md's YAML front matter, using the keys and value types in `{{sistema_url}}/raw/files/design-md#front-matter`. In short:

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

8. **Build `sistema-review/token-check.html`** from the same compile script, so `npm run tokens` regenerates it whenever tokens change. It loads the compiled CSS by a relative path and shows:
   - the workflow outline strip at the top;
   - every color role as a labeled swatch with its value and the primitive it refers to, and each ramp in `palette.json` as a continuous strip;
   - **the colors in use,** before the swatches: a few small compositions built only from the role tokens, so the person judges treatments rather than chips of color. At least a table row at rest, hovered, and selected next to status chips; an inline message for each status; a menu with a highlighted and a destructive item; the primary button and its hover; and text on the inverse and brand surfaces. Shown in each theme by the same switch;
   - every type role as a live specimen, every radius as a box at that radius, and every spacing step as a bar of that width;
   - next to each color role, whether it matches the value shown in the approved style preview, and for each one that differs, why;
   - a section "Approved but not yet tokenized" listing direction values (from the DESIGN.md Overview) whose category has no tokens yet because its play was skipped;
   - a switch for each kind of mode the system has (theme, density, motion), so the person can see every token in each mode;
   - any variables a component library maps onto the roles (for example shadcn's), once the components play adds its mapping file; the generator reads that file when it exists;
   - at the end, the line naming the `continue` URL from `sistema.json`.

9. Show the evidence: the compile output, the compiled file paths, the files outside `tokens/` you changed, the build result, and a summary of what `token-check.html` shows.
