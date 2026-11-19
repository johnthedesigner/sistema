# Examples

Projects built with Sistema, kept here so content and examples change together.

- `relay/`: the reference project (decision D14). Relay is a dispatch dashboard for a small field-service company, built with Sistema's Start and Patterns workflows. The guides' worked examples come from it.

Each example is a standalone app with its own `package.json`. The Sistema site's type check, lint, tests, and content checks ignore this folder (decision D15). Vitest only collects tests under `src/` and `tools/validate/`.
