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

const guideStub: SourceFile = { path: 'kb/principles/color/architecture.md', text: '---\ntype: stub\npoints_to: architecture@2026-05-13.md\n---\n' }
const guideBody: SourceFile = { path: 'kb/principles/color/architecture@2026-05-13.md', text: '---\ncategory: principles\n---\n# Color architecture\n\n## Dark mode: tonal shift\n\ntext' }

function corpus(contentFiles: SourceFile[]): Corpus {
  return { campaignPrompts: [], kbFiles: [guideStub, guideBody], builtHtml: [], contentFiles }
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
