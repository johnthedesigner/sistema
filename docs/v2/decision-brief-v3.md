# V3 Decision Brief

**Task:** V3.0. **Date:** 2026-11-18. **Status:** decided by the owner 2026-11-18: every recommendation accepted except D17, where the owner chose B (Claude runs it, owner approves at gates). Recorded in `decisions.md`.

Six decisions shape Phase 3. Each has options, a recommendation, and what it changes. The first four are about the reference project, which the guides' worked examples, the behavior tests (V5), and the site's explanation of the method all build on. Plan 9.4 says to keep it small on purpose.

---

## D14. What the reference project is

| Option | Exercises | Doesn't exercise |
|---|---|---|
| **A. A B2B operations dashboard** (recommended) | Dense data: tables, filters, forms, status colors, charts. Light and dark themes, density modes (V3.1), many components | Long-form reading and expressive marketing type |
| **B. A consumer mobile-first app** | Touch targets, expressive brand, motion | Dense tables; less like what most users build |
| **C. A documentation or content site** | Long-form type, measure, prose styling | Forms, states, data, most components |

**Recommendation: A.** Most people building with AI agents build internal tools and dashboards, and plan 9.4 recommends it. It exercises the most plays and rules, including density, the main gap in V3.1. A one-line brief so the run has something to work from: *"Relay: a dispatch dashboard for a small field-service company. Dispatchers assign jobs to technicians, track status through the day, and handle customer requests. Used all day on desktop by 5 to 20 people; dense; WCAG 2.2 AA."* The name and domain are placeholders you can change. What matters is a dense B2B product with a clear daily task.

## D15. Where it lives

| Option | For | Against |
|---|---|---|
| **A. A folder in this repo, `examples/relay/`** (recommended) | Content changes and the example change in the same commit. Guides can cite its files by path. One place to look | It must be kept out of the site's build, lint, type check, tests, and content checker. Its own `package.json` and lockfile sit in a subfolder |
| **B. A separate repository** | Fully independent, and closer to a real user's setup | Content and example drift apart. Guides cite another repository. Two places to keep in step |

**Recommendation: A**, as plan 9.4 suggests, with `examples/` excluded from the site's `tsconfig`, ESLint, Vitest, Next.js file tracing, and the content checker. The reference *run* still happens like a real user's: in a fresh session, from the paste-in prompt. Only the result is committed here.

## D16. Its stack

**Recommendation: Sistema's default stack:** Next.js with React, Tailwind CSS v4, and shadcn/ui as the component foundation, chosen during `project.assess` so the type, spacing, and radius plays follow its conventions (V1.17). This tests the default path end to end, and it's what the guides' examples will show. Another stack would test the "loosely supported" path, which matters less right now.

## D17. Who runs it

| Option | For | Against |
|---|---|---|
| **A. You run the starter in a fresh Claude Code session; I review and fix plays** (recommended) | It's a real user's experience: you see every prompt, review page, and approval. It matches how the slice runs worked (D10) | It takes your time at two approvals per workflow, plus whatever questions the plays ask |
| **B. I run it in a subagent, and you only approve at the gates** | Faster, and less of your time | The agent running it knows the plays from the inside, so it hides the gaps a real run would show |

**Recommendation: A**, with the run's ID marked `internal-` so it stays out of the usage data.

## D18. The guide template

Plan 9.1 proposed six parts: principle, rules, procedure, worked example, failure modes, verification. Two things have changed since:
- **Procedures live in plays now.** A "Procedure" section in a guide would restate a play, which fit review 2 checks against.
- **The current guides' strongest part isn't in the template.** Each one centers on a decision framework: the options and how to choose (the color models, scale construction, naming type).

**Recommendation:** six parts, adjusted:

| Section | What it holds | Where it comes from |
|---|---|---|
| **Sistema's position** | One paragraph: the principle, stated plainly | Plan 9.1 "Principle" |
| **The options and how to choose** | The approaches, which systems use each, and how to pick for a product | The current guides' decision frameworks |
| **Rules** | The registry rules for this topic, rendered from the registry, never restated | Plan 9.1 "Rules" |
| **Worked example** | The reference project's real values and choices, with the reasons from its DECISIONS.md | Plan 9.1 "Worked example" |
| **Failure modes** | What usually goes wrong and how to spot it | Plan 9.1 |
| **Checking the work** | Which tool or check proves it, and what the result looks like | Plan 9.1 "Verification" |

The guide ends with links to the plays that do the work, replacing plan 9.1's "Procedure". Human pages lead with the position and show live specimens (real ramps, rendered type scales); agents get the same sections in plain text. The four guides in V3.4 adopt it first. The rest move to it as they're reviewed.

## D19. The components guide's scope

| Option | Covers |
|---|---|
| **A. How to build components on the system** (recommended) | Choosing a component foundation (headless libraries and when native elements are enough), component anatomy, states and variants, how components consume tokens (role tokens or component tokens, and when), the accessibility baseline per component family, API and naming conventions, and documenting a component |
| **B. A and a spec for each core component** | A, plus guidance for each of the 8 to 12 core components (button, text field, select, and so on) |

**Recommendation: A.** Per-component specs are what `components.specify` produces for each project. Writing them in a guide would restate a play's output and grow without limit. The slice-run lessons (focus rings in Tailwind 4, disabled-while-loading, toasts) become failure modes and rules in A.

---

## Questions

1. **D14:** A B2B dashboard ("Relay", or another name and domain you prefer)?
2. **D15:** A folder in this repo, `examples/relay/`, kept out of the site's build and checks?
3. **D16:** The default stack: Next.js, Tailwind v4, and shadcn/ui?
4. **D17:** You run the starter in a fresh session while I review?
5. **D18:** The adjusted template, with "options and how to choose" in place of a procedure?
6. **D19:** Components guide scope A?
