import { describe, expect, it } from 'vitest'
import { MODEL_RULES } from './model-rules'
import { runRules, type Corpus, type SourceFile } from './rules'
import { SistemaState } from '../../../src/lib/content/schema'
import { headingSlug, parsePlay } from '../../../src/lib/content/parse'

// ─── fixture builders ───────────────────────────────────────────────────────

interface PlayOpts {
  id: string
  kind?: string
  milestone?: string
  requires?: string[]
  produces?: string[]
  tools?: string[]
  knowledge?: string[]
  rules?: string[]
  body?: string
  path?: string
  extra?: string
}

function play(o: PlayOpts): SourceFile {
  const [topic, name] = o.id.split('.')
  const list = (xs: string[] = []) => `[${xs.map(x => JSON.stringify(x)).join(', ')}]`
  return {
    path: o.path ?? `content/plays/${topic}/${name}.md`,
    text: `---
id: ${o.id}
title: Title for ${o.id}
description: A description long enough to pass the schema.
topic: ${topic}
kind: ${o.kind ?? 'create'}
milestone: ${o.milestone ?? 'foundations'}
requires: ${list(o.requires)}
produces: ${list(o.produces)}
tools: ${list(o.tools)}
knowledge: ${list(o.knowledge)}
rules: ${list(o.rules)}
evidence: Evidence shown before completion.
last_reviewed: 2026-11-14
${o.extra ?? ''}---
${o.body ?? '1. Do the work.'}
`,
  }
}

function workflow(id: string, sequence: unknown[], extra = ''): SourceFile {
  const seq = sequence.map(s => (typeof s === 'string' ? `  - ${s}` : `  - gate: ${(s as { gate: string }).gate}\n    prompt: Review and approve this before continuing.`)).join('\n')
  return {
    path: `content/workflows/${id.replace('workflow.', '')}.md`,
    text: `---\nid: ${id}\ntitle: Start\ndescription: A workflow description long enough to pass.\nsequence:\n${seq}\n${extra}last_reviewed: 2026-11-14\n---\nStarter text.\n`,
  }
}

const rulesFile: SourceFile = {
  path: 'content/rules/color.yaml',
  text: `- id: color.contrast.text
  statement: Body text meets the project's contrast requirement.
  reason: Text must be readable by people with low vision.
  layer: standard
  severity: blocking
  parameters:
    wcag-2.2: { AA: 4.5, AAA: 7 }
  applies_to: every on-* role paired with its surface
  checked_by: [tool.contrast]
`,
}

const guide: SourceFile = {
  path: 'content/guides/color/architecture.md',
  text: '---\ntitle: Color architecture\ndescription: A guide description long enough to pass.\ntopic: color\nlast_reviewed: 2026-11-16\n---\n# Color architecture\n\n## Dark mode: tonal shift\n\ntext',
}

function corpus(contentFiles: SourceFile[]): Corpus {
  return { referenceFiles: [], builtHtml: [], contentFiles: [guide, ...contentFiles] }
}

function violations(c: Corpus, rule?: string) {
  return runRules(MODEL_RULES, c).filter(v => !rule || v.rule === rule)
}

const assess = play({ id: 'project.assess', kind: 'orient', milestone: 'direction', produces: ['sistema.json', 'project:a11y-standard'] })
const direction = play({ id: 'visual-language.direction', milestone: 'direction', requires: ['project:a11y-standard'], produces: ['design-md#overview', 'style-preview.html'] })
const scheme = play({
  id: 'color.scheme',
  requires: ['design-md#overview', 'gate:direction-approved', 'project:a11y-standard'],
  produces: ['tokens/src/color.json', 'tokens/src/color.dark.json?'],
  tools: ['palette', 'contrast'],
  knowledge: ['guide.color.architecture#dark-mode-tonal-shift'],
  rules: ['color.contrast.text'],
  body: '1. Call the palette tool. 2. Call the contrast tool for every pair.',
})
const start = workflow('workflow.start', ['project.assess', 'visual-language.direction', { gate: 'direction-approved' }, 'color.scheme'])

// ─── tests ──────────────────────────────────────────────────────────────────

describe('a valid catalog', () => {
  it('passes every model rule', () => {
    expect(violations(corpus([assess, direction, scheme, start, rulesFile]))).toEqual([])
  })
})

describe('model.schema', () => {
  it('reports missing fields, bad enums, bad state tokens, and empty procedures', () => {
    const bad = play({ id: 'color.bad', milestone: 'someday', produces: ['design-md#sidebar'], body: ' ' })
    const msgs = violations(corpus([bad]), 'model.schema').map(v => v.message)
    expect(msgs.some(m => m.startsWith('milestone'))).toBe(true)
    expect(msgs.some(m => m.includes('design-md section'))).toBe(true)
  })
  it('rejects a blocking rule without checked_by, and invalid YAML', () => {
    const noCheck = { path: 'content/rules/x.yaml', text: rulesFile.text.replace('  checked_by: [tool.contrast]\n', '') }
    const broken = { path: 'content/rules/y.yaml', text: '- id: [unclosed' }
    const msgs = violations(corpus([noCheck, broken]), 'model.schema').map(v => v.message)
    expect(msgs.some(m => m.includes('checked_by'))).toBe(true)
    expect(msgs.some(m => m.includes('invalid YAML'))).toBe(true)
  })
  it('reports malformed frontmatter YAML instead of throwing', () => {
    const broken = { path: 'content/plays/color/broken.md', text: '---\nid: color.broken\nkind: create\nkind: change\n---\nbody' }
    expect(violations(corpus([broken]), 'model.schema')[0].message).toMatch(/invalid YAML/)
  })
  it('rejects a workflow with both sequence and routes', () => {
    const w = workflow('workflow.start', ['project.assess'], 'routes:\n  add: [project.assess]\n')
    expect(violations(corpus([assess, w]), 'model.schema')).toHaveLength(1)
  })
  it('rejects unknown fields', () => {
    const p = play({ id: 'color.extra', extra: 'stage: 2\n' })
    expect(violations(corpus([p]), 'model.schema')[0].message).toMatch(/stage|unrecognized/i)
  })
})

describe('model.id-path', () => {
  it('flags a play stored at the wrong path and duplicate IDs', () => {
    const misplaced = play({ id: 'color.scheme', path: 'content/plays/color/colour.md' })
    const v = violations(corpus([scheme, misplaced]), 'model.id-path')
    expect(v.map(x => x.message).join(' ')).toMatch(/should live at/)
    expect(v.map(x => x.message).join(' ')).toMatch(/duplicate play id/)
  })
})

describe('model.workflow-refs', () => {
  it('flags unknown plays and unknown continuation workflows', () => {
    const w = workflow('workflow.start', ['project.assess', 'color.nope'], 'continue_with: workflow.missing\n')
    expect(violations(corpus([assess, w]), 'model.workflow-refs')).toHaveLength(2)
  })
})

describe('model.requires', () => {
  it('flags a requirement nothing earlier produces, and a gate placed too late', () => {
    const w = workflow('workflow.start', ['project.assess', 'color.scheme', 'visual-language.direction', { gate: 'direction-approved' }])
    const msgs = violations(corpus([assess, direction, scheme, w, rulesFile]), 'model.requires').map(v => v.message)
    expect(msgs).toContain('color.scheme requires design-md#overview, but nothing earlier produces it')
    expect(msgs).toContain('color.scheme requires gate:direction-approved, but nothing earlier produces it')
  })
  it('does not let an optional play satisfy a required one', () => {
    const w = workflow('workflow.start', ['project.assess', 'visual-language.direction?', { gate: 'direction-approved' }, 'color.scheme'])
    const msgs = violations(corpus([assess, direction, scheme, w, rulesFile]), 'model.requires').map(v => v.message)
    expect(msgs).toContain('color.scheme requires design-md#overview, but only an optional play produces it')
  })
  it('lets a workflow use what the workflows continuing into it produced', () => {
    const first = workflow('workflow.start', ['project.assess', 'visual-language.direction', { gate: 'direction-approved' }], 'continue_with: workflow.next\n')
    const next = workflow('workflow.next', ['color.scheme'])
    expect(violations(corpus([assess, direction, scheme, first, next, rulesFile]), 'model.requires')).toHaveLength(0)
    // Without the link, the same sequence fails.
    const unlinked = workflow('workflow.start', ['project.assess', 'visual-language.direction', { gate: 'direction-approved' }])
    expect(violations(corpus([assess, direction, scheme, unlinked, next, rulesFile]), 'model.requires').length).toBeGreaterThan(0)
  })
})

describe('model.milestone-order', () => {
  it('flags a direction play after a foundations play', () => {
    const late = play({ id: 'visual-language.design-md', milestone: 'direction' })
    const w = workflow('workflow.start', ['project.assess', 'visual-language.direction', { gate: 'direction-approved' }, 'color.scheme', 'visual-language.design-md'])
    const v = violations(corpus([assess, direction, scheme, late, w, rulesFile]), 'model.milestone-order')
    expect(v).toHaveLength(1)
  })
})

describe('model.produces-conflict', () => {
  it('flags two create plays writing the same file, but allows a change play to', () => {
    const create2 = play({ id: 'color.other', produces: ['tokens/src/color.json'] })
    const change = play({ id: 'color.map-existing', kind: 'change', produces: ['tokens/src/color.json'] })
    expect(violations(corpus([scheme, create2, rulesFile]), 'model.produces-conflict')).toHaveLength(1)
    expect(violations(corpus([scheme, change, rulesFile]), 'model.produces-conflict')).toHaveLength(0)
  })
})

describe('model.knowledge', () => {
  it('flags missing guides and missing anchors', () => {
    const p = play({ id: 'color.x', knowledge: ['guide.color.nope', 'guide.color.architecture#no-such-heading'] })
    expect(violations(corpus([p]), 'model.knowledge')).toHaveLength(2)
  })
})

describe('model.rule-refs and model.tools-named', () => {
  it('flags unknown rules and contract tools the procedure never names', () => {
    const p = play({ id: 'color.x', rules: ['color.missing'], tools: ['palette', 'type_scale'], body: 'Use the palette tool.' })
    expect(violations(corpus([p]), 'model.rule-refs')).toHaveLength(1)
    expect(violations(corpus([p]), 'model.tools-named').map(v => v.message)).toEqual([
      'contract requires the type_scale tool but the procedure never names it',
    ])
  })
})

describe('parsers and sistema.json', () => {
  it('headingSlug matches GitHub-style anchors', () => {
    expect(headingSlug('Dark mode: tonal shift')).toBe('dark-mode-tonal-shift')
    expect(headingSlug('Do\'s and Don\'ts')).toBe('dos-and-donts')
  })
  it('parsePlay normalizes YAML dates to strings', () => {
    const r = parsePlay(scheme.path, scheme.text)
    expect(r.ok && r.value.last_reviewed).toBe('2026-11-14')
  })
  it('validates sistema.json', () => {
    const ok = SistemaState.safeParse({
      sistema: '2',
      workflow: 'start',
      project: { a11y_standard: 'WCAG 2.2 AA', theme: 'light-dark' },
      steps: { 'color.scheme': { status: 'complete', date: '2026-11-21', evidence: '28/28 pairs pass' } },
      gates: { 'direction-approved': { date: '2026-11-20', by: 'owner' } },
    })
    expect(ok.success).toBe(true)
    expect(SistemaState.safeParse({ sistema: '2', steps: { 'not a play': { status: 'complete' } } }).success).toBe(false)
    // V1.5 additions: continue, in-progress, gate note, theme_primary, platform.
    expect(
      SistemaState.safeParse({
        sistema: '2',
        continue: 'https://sistema.example/raw/workflows/start',
        project: { theme: 'light-dark', theme_primary: 'light', platform: 'web' },
        steps: { 'visual-language.direction': { status: 'in-progress' } },
        gates: { 'foundations-approved': { date: '2026-11-15', by: 'owner', note: '7 roles changed' } },
      }).success,
    ).toBe(true)
    // Shapes the slice runs invented are rejected.
    expect(SistemaState.safeParse({ sistema: '2', milestone: 'foundations-complete' }).success).toBe(false)
    expect(SistemaState.safeParse({ sistema: '2', gates: { 'direction-approved': { status: 'approved', date: '2026-11-15' } } }).success).toBe(false)
    expect(SistemaState.safeParse({ sistema: '2', steps: { 'components.core': { status: 'done' } } }).success).toBe(false)
  })
})

// ─── opinions (V1.8) ────────────────────────────────────────────────────────

function opinion(o: { slug: string; group?: string; rules?: string[]; guides?: string[]; body?: string; path?: string }): SourceFile {
  const group = o.group ?? 'process'
  const body =
    o.body ??
    (group === 'method'
      ? '## Why\n\nReason.\n\n## What breaks without it\n\nConsequence.\n'
      : "## Why\n\nReason.\n\n## When you'd choose otherwise\n\nCase.\n\n## If you override it\n\nEffect.\n")
  return {
    path: o.path ?? `content/opinions/${o.slug}.md`,
    text: `---
id: opinion.${o.slug}
title: An opinion
group: ${group}
default: A default stated in one sentence.
description: "When to use: a description long enough to pass."
rules: ${JSON.stringify(o.rules ?? [])}
guides: ${JSON.stringify(o.guides ?? [])}
last_reviewed: 2026-11-16
---
${body}`,
  }
}

describe('opinions', () => {
  it('a valid opinion passes, including rule and guide refs', () => {
    const ok = opinion({ slug: 'calculate', rules: ['color.contrast.text'], guides: ['guide.color.architecture#dark-mode-tonal-shift'] })
    const method = opinion({ slug: 'evidence', group: 'method' })
    expect(violations(corpus([rulesFile, ok, method]))).toEqual([])
  })
  it('requires the sections for its group', () => {
    const missing = opinion({ slug: 'evidence', group: 'method', body: "## Why\n\nReason.\n\n## If you override it\n\nx\n" })
    const msgs = violations(corpus([missing]), 'model.schema').map(v => v.message)
    expect(msgs).toEqual(['body: missing section "## What breaks without it"'])
  })
  it('reports a misplaced file, an unknown rule, and a missing guide anchor', () => {
    const misplaced = opinion({ slug: 'a', path: 'content/opinions/b.md' })
    const badRefs = opinion({ slug: 'c', rules: ['color.nope'], guides: ['guide.color.architecture#nope'] })
    const c = corpus([rulesFile, misplaced, badRefs])
    expect(violations(c, 'model.id-path').map(v => v.message)).toEqual(['id opinion.a should live at content/opinions/a.md'])
    expect(violations(c, 'model.rule-refs').map(v => v.message)).toEqual(['unknown rule color.nope'])
    expect(violations(c, 'model.knowledge').map(v => v.message)).toEqual(['guide.color.architecture#nope: no heading with anchor #nope'])
  })
})

describe('guides (V1.12)', () => {
  it('rejects a guide without a title, in the wrong folder, or with a mismatched topic', () => {
    const noTitle = { path: 'content/guides/color/x.md', text: '---\ndescription: A guide description long enough to pass.\ntopic: color\nlast_reviewed: 2026-11-16\n---\n# X\n' }
    const wrongTopic = { path: 'content/guides/shape/y.md', text: '---\ntitle: Y guide\ndescription: A guide description long enough to pass.\ntopic: color\nlast_reviewed: 2026-11-16\n---\n# Y\n' }
    const msgs = violations(corpus([noTitle, wrongTopic]), 'model.schema').map(v => `${v.file} ${v.message}`)
    expect(msgs.some(m => m.startsWith('content/guides/color/x.md title'))).toBe(true)
    expect(msgs.some(m => m.includes("topic color doesn't match folder shape"))).toBe(true)
  })
})


describe('model.sources (V1.16)', () => {
  const sources: SourceFile = {
    path: 'content/sources.yaml',
    text: '- id: wcag\n  name: WCAG 2.2\n  publisher: W3C\n  url: https://www.w3.org/TR/WCAG22/\n  kind: standard\n  tier: 1\n  license: W3C Document License\n',
  }
  const credited = (source: string): SourceFile => ({
    path: 'content/guides/accessibility/floor.md',
    text: `---\ntitle: Accessibility floor\ndescription: A guide description long enough to pass.\ntopic: accessibility\nsources:\n  - { source: ${source}, url: "https://www.w3.org/TR/WCAG22/" }\nlast_reviewed: 2026-11-17\n---\nbody`,
  })
  it('passes when every credit names a registered source', () => {
    expect(violations(corpus([sources, credited('wcag')]), 'model.sources')).toEqual([])
  })
  it('fails for an unregistered source, and for a credit in a file format page', () => {
    const file: SourceFile = {
      path: 'content/files/design-md.md',
      text: '---\ntitle: DESIGN.md\ndescription: A file format description long enough.\nsources:\n  - { source: stitch, url: "https://stitch.withgoogle.com/" }\nlast_reviewed: 2026-11-17\n---\nbody',
    }
    expect(violations(corpus([sources, credited('w3c'), file]), 'model.sources')).toHaveLength(2)
  })
  it('rejects a duplicate source id and a guide credit given as a bare path', () => {
    const dup: SourceFile = { path: 'content/sources.yaml', text: sources.text + sources.text }
    const bare: SourceFile = { ...credited('wcag'), text: credited('wcag').text.replace(/  - \{.*\}/, '  - kb/reference/standards/wcag/color-contrast') }
    const msgs = violations(corpus([dup, bare]), 'model.schema').map(v => v.message)
    expect(msgs.some(m => m.includes('duplicate source id'))).toBe(true)
    expect(msgs.some(m => m.startsWith('sources'))).toBe(true)
  })
})

describe('model.rules-mentioned', () => {
  it('flags a rule named in the procedure but missing from the contract', () => {
    const p = play({ id: 'color.mentions', rules: [], body: 'Assign the roles in `color.contrast.text` and check them.' })
    expect(violations(corpus([p, rulesFile]), 'model.rules-mentioned')).toHaveLength(1)
    const ok = play({ id: 'color.mentions', rules: ['color.contrast.text'], body: 'Assign the roles in `color.contrast.text` and check them.' })
    expect(violations(corpus([ok, rulesFile]), 'model.rules-mentioned')).toHaveLength(0)
  })
})
