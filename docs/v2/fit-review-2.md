# Fit Review 2: The Full Catalog

**Task:** V1.17. **Date:** 2026-11-17. **Status:** awaiting owner review.

This review checks the migrated catalog against the capability model: every v1 play has a place (Section 7), the findings in Section 8 are resolved or scheduled, and no play restates a guide (Section 11).

**Verdict:** the model holds. Every v1 play and campaign has a place, and all three workflows run on contracts the build checks. Four plays hold small pieces of knowledge that belong in guides; I recommend moving them now (section 3). One open decision from the capability model can close (section 2). Checking for restated guides also turned up two passages for the source-closeness audit (section 4).

---

## 1. Every v1 play has a place

| v1 play or campaign | v2 | Planned | Done |
|---|---|---|---|
| establish-context, positioning-brief | `project.assess` | Merge | Yes. It also classifies each output as conforming, different, or missing |
| establish-visual-language | `visual-language.direction` | Keep | Yes |
| generate-design-md | `visual-language.design-md` | Keep | Yes. Writes the body only; front matter is generated (D6b) |
| define-voice-and-tone | `content.voice-and-tone` | Keep, optional in Start | Yes |
| generate-color-scheme | `color.scheme` | Shrink from 118 lines to about 40 | Yes, 15 lines of procedure |
| generate-color-roles | `color.map-existing` | Keep | Yes, with a comparison page and choice for each hue |
| generate-dark-mode | `color.add-theme` | Reframe | Yes |
| generate-type-scale | `typography.scale` | Keep | Yes |
| generate-shape-tokens | `shape.tokens` | Keep, with elevation | Yes, titled "Generate shape and elevation tokens" |
| generate-spacing-tokens | `spacing.tokens` | Keep, add guide link | Yes |
| generate-style-dictionary | `tokens.pipeline` | Keep | Yes |
| migrate-tailwind-tokens | Route `bring-in-existing-colors` | Retire | Yes (V1.10) |
| scaffold-core-components | `components.scaffold-core` | Keep; maybe split | Kept. See section 2 |
| specify-component, implement-component | `components.specify`, `components.implement` | Keep | Yes |
| add-component | Route `add-component` | Retire as a play | Yes |
| generate-page-examples, setup-documentation-site | `components.page-examples`, `components.docs-site` | Keep | Yes, both optional in Patterns |
| audit-component, accessibility-audit, audit-token-coverage | `components.audit`, `accessibility.audit`, `tokens.coverage-audit` | Keep; share accessibility rules | Yes. Both audits cite the same rules; neither restates a threshold |
| session-start | `project.orient` | Router for Work on the system | Yes, and it accepts a goal stated in the prompt |
| design-system-retrospective, plan-next-iteration | `project.review`, `project.plan` | Keep | Yes |
| Campaign: bootstrap | `workflow.start` + `workflow.patterns` | Split at Foundations | Yes |
| Campaign: audit-and-refactor | `workflow.start` + `workflow.session` routes | Retire | Yes |
| (new in V1.15) | `project.migrate-brief` | | Reached from assess and orient |

**Result:** 25 v1 plays became 23 plays (22 planned, plus the migration play). 2 campaigns became 3 workflows. Every play has a contract, and every contract is checked on each build.

## 2. Capability model findings (Section 8) and open decisions (Section 10)

| Finding | Status |
|---|---|
| 1. Contracts expose problems | Resolved. The build checks requires, produces, milestones, guide anchors, rules, and tools |
| 2. Motion has no play; depth sits in shape | Depth: resolved. Motion: no play until a project asks for one. Density and motion modes are the first V3 task (`tokens.add-mode`) |
| 3. Components have no guide | **Still open.** Scheduled for V3, before Patterns is considered complete. `components.scaffold-core` carries a typical core set until then |
| 4. DESIGN.md is written by several plays | Resolved. Outputs are per section (`design-md#colors`), and the format page lists which play writes each section |
| 5. Adopt depends on detecting non-conforming outputs | Resolved in `project.assess` step 2, and tested in the slice runs |
| 6. Gates sit on existing outputs | Resolved |
| 7. Form variables go away inside workflows | Resolved. Seven `overrides` remain for plays run on their own. No `{{variable}}` is left in any play |
| 8. Patterns depends on the stack | Resolved by opinion `default-stack` |

**Open decision: split `components.scaffold-core`?** It was 139 lines in v1 and is 28 lines of procedure now, the same size as the foundation plays. **Recommendation: don't split it.** Close the decision.

## 3. Do plays restate guides?

**Method:** an automated check found no 7-word phrase in any play that also appears in any guide. I then read the longer plays for knowledge they hold that belongs in a guide: reasoning, defaults, or rules of thumb that aren't procedure.

Most plays state a choice in a line and cite the guide section for the reasoning, which is the intended pattern (for example, "Choose the radius approach from the shape guide"). Four places hold knowledge that has no home in a guide:

| Play | What it holds | Recommended fix |
|---|---|---|
| `spacing.tokens` step 2 | Example step sets for dense, balanced, and sparse products | Move the sets into the spacing guide's "Density axis" section; the play cites it |
| `spacing.tokens` step 3 | Naming steps by their multiple of the base unit, to match Tailwind | Move into the spacing guide as Sistema's naming convention; the play cites it |
| `shape.tokens` step 4 | Shadow colors come from the neutral ramp, tinted to the surface, not pure black | Add to the depth guide's shadow model; the play cites it |
| `typography.scale` step 3 | A default set of type roles (`display`, `heading-lg`, `heading-sm`, `body`, `body-sm`, `label`, `caption`, `code`) | The guide describes a different five-role set (display, headline, title, body, label). Make Sistema's default set part of the guide; the play cites it |

`components.scaffold-core` also lists a typical core set of components. That stays until the components guide exists (V3).

## 4. Found for the source-closeness audit

Two passages look like one source's framework presented as general practice. They're the first examples for the audit in the backlog ("Originality and attribution"):

- **Voice baseline.** The voice and tone guide, rule `content.voice.baseline`, and `content.voice-and-tone` call "plainspoken, genuine, helpful, direct" a cross-system baseline. "Plainspoken" and "genuine" are two of Mailchimp's four named voice traits.
- **Five type roles.** The typography guide's "5-role pattern (display / headline / title / body / label)" is Material Design's role set, described as having "emerged from mobile typography practice."

I haven't changed either. The audit decides between rewriting them as synthesis or crediting the source where they appear.

## 5. Coverage gaps (unchanged, already scheduled)

- Components guide: V3, before Patterns is complete.
- Density and motion modes: V3, `tokens.add-mode`.
- Iconography and data visualization: backlog, as optional foundation areas.

## 6. Questions for the owner

1. **Approve the catalog** as migrated (sections 1 and 2)?
2. **Close the scaffold-core decision** without splitting it?
3. **Move the four pieces of knowledge** in section 3 into their guides now, as part of V1.17?
4. **Type role names:** the guide fix in section 3 needs one default set. I recommend the play's names (`display`, `heading-lg`, `heading-sm`, `body`, `body-sm`, `label`, `caption`, `code`): they say what the text is for, and Sistema's own site already uses names close to them. Or keep the guide's five-role set?
