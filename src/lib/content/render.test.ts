import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { loadCatalog } from './load'
import { parsePlay, parseWorkflow, type Play, type Workflow } from './parse'
import { describeToken, renderPlay, renderWorkflowFull, renderWorkflowStarter, workflowSteps, type RenderContext } from './render'
import type { Rule } from './schema'

const BASE = 'https://sistema.example'

function playText(id: string, fm: string, body = '1. Do the work.') {
  const [topic] = id.split('.')
  const defaults: Record<string, string> = {
    id,
    title: `Title ${id}`,
    description: `Description for ${id}, long enough.`,
    topic,
    kind: 'create',
    milestone: topic === 'color' ? 'foundations' : 'direction',
    evidence: `Evidence for ${id}.`,
    last_reviewed: '2026-11-14',
  }
  // Lines in `fm` override defaults with the same key.
  const overridden = new Set(fm.split('\n').map(l => l.split(':')[0].trim()).filter(Boolean))
  const base = Object.entries(defaults).filter(([k]) => !overridden.has(k)).map(([k, v]) => `${k}: ${v}`)
  return `---\n${[...base, fm].filter(Boolean).join('\n')}\n---\n${body}\n`
}

function mustPlay(id: string, fm: string, body?: string): Play {
  const r = parsePlay(`content/plays/${id.replace('.', '/')}.md`, playText(id, fm, body))
  if (!r.ok) throw new Error(JSON.stringify(r.issues))
  return r.value
}

const assess = mustPlay('project.assess', 'kind: orient\nproduces: [sistema.json, "project:a11y-standard"]')
const direction = mustPlay('visual-language.direction', 'requires: ["project:a11y-standard"]\nproduces: ["design-md#overview", style-preview.html]')
const voice = mustPlay('content.voice-and-tone', 'produces: [VOICE_AND_TONE.md]')
const scheme = mustPlay(
  'color.scheme',
  [
    'requires: ["design-md#overview", "gate:direction-approved", "project:a11y-standard"]',
    'produces: [tokens/src/color.json, "tokens/src/color.dark.json?"]',
    'tools: [palette, contrast]',
    'knowledge: ["guide.color.architecture#dark-mode"]',
    'rules: [color.contrast.text]',
  ].join('\n'),
  'Call the palette tool, then the contrast tool.',
)

const rule: Rule = {
  id: 'color.contrast.text',
  statement: 'Body text meets the contrast requirement of the chosen standard.',
  reason: 'Low-vision readers need it.',
  layer: 'standard',
  severity: 'blocking',
  parameters: { 'wcag-2.2': { AA: 4.5, AAA: 7 } },
  applies_to: 'on-* roles',
  checked_by: ['tool.contrast'],
  sources: [],
}

function mustWorkflow(text: string): Workflow {
  const r = parseWorkflow('content/workflows/start.md', text)
  if (!r.ok) throw new Error(JSON.stringify(r.issues))
  return r.value
}

const start = mustWorkflow(`---
id: workflow.start
title: Start a design system
description: Take a project from nothing to a verified token system.
sequence:
  - project.assess
  - visual-language.direction
  - gate: direction-approved
    prompt: Review style-preview.html and approve the visual direction.
  - content.voice-and-tone?
  - color.scheme
continue_with: workflow.patterns
last_reviewed: 2026-11-14
---
`)
const patterns = mustWorkflow(`---
id: workflow.patterns
title: Build patterns
description: Core components and page examples on top of the tokens.
sequence:
  - color.scheme
last_reviewed: 2026-11-14
---
`)

const ctx: RenderContext = {
  base: BASE,
  plays: new Map([assess, direction, voice, scheme].map(p => [p.id, p])),
  rules: new Map([[rule.id, rule]]),
}
const workflows = new Map([start, patterns].map(w => [w.id, w]))

const LITERAL_DATE = /\b20\d{2}-\d{2}-\d{2}\b/
const RELATIVE_URL = /(?<![\w/.:-])\/(?:raw|api|bundle)\//

describe('describeToken', () => {
  it('explains each token kind', () => {
    expect(describeToken('gate:direction-approved')).toMatch(/approval is recorded/)
    expect(describeToken('project:a11y-standard')).toContain('project.a11y_standard')
    expect(describeToken('design-md#dos-donts')).toContain("Do's and Don'ts")
    expect(describeToken('tokens/src/color.dark.json?')).toContain('(when it applies)')
  })
})

describe('renderPlay', () => {
  const out = renderPlay(scheme, ctx)

  it('lists preconditions with the plays that produce them', () => {
    expect(out).toContain('## Before you start')
    expect(out).toContain('(from `visual-language.direction`)')
    expect(out).toContain('(from `project.assess`)')
  })
  it('documents tools with absolute URLs and request shapes', () => {
    expect(out).toContain(`POST ${BASE}/api/palette`)
    expect(out).toContain(`POST ${BASE}/api/contrast`)
    expect(out).toMatch(/Never compute or estimate/)
  })
  it('inlines rules with standard parameters', () => {
    expect(out).toContain('**color.contrast.text** (Required)')
    expect(out).toContain('wcag-2.2 AA 4.5, AAA 7')
  })
  it('links guides absolutely with their section', () => {
    expect(out).toContain(`${BASE}/raw/principles/color/architecture (section: dark-mode)`)
  })
  it('ends with evidence and record-keeping, with no literal dates or relative URLs', () => {
    expect(out).toContain('## Done when\n\nEvidence for color.scheme.')
    expect(out).toContain('steps["color.scheme"]')
    expect(out).not.toMatch(LITERAL_DATE)
    expect(out).not.toMatch(RELATIVE_URL)
    expect(out).not.toContain('{{')
  })
})

describe('workflow rendering', () => {
  it('numbers plays and attaches gates to the play before them', () => {
    const { steps } = workflowSteps(start, ctx.plays)
    expect(steps.map(s => [s.number, s.play.id, s.optional])).toEqual([
      [1, 'project.assess', false],
      [2, 'visual-language.direction', false],
      [3, 'content.voice-and-tone', true],
      [4, 'color.scheme', false],
    ])
    expect(steps[1].gateAfter[0].gate).toBe('direction-approved')
  })

  it('renders a short starter with URLs, the gate, tools, continuation, and the full-version link', () => {
    const out = renderWorkflowStarter(start, ctx, workflows)
    expect(out).toContain(`2. Title visual-language.direction: ${BASE}/raw/plays/visual-language.direction`)
    expect(out).toContain('   GATE (direction-approved): Review style-preview.html')
    expect(out).toContain('3. Title content.voice-and-tone (optional')
    expect(out).toContain(`POST ${BASE}/api/palette`)
    expect(out).toContain(`continue with Build patterns: ${BASE}/raw/workflows/patterns`)
    expect(out).toContain(`${BASE}/raw/workflows/start/full`)
    expect(out).not.toMatch(LITERAL_DATE)
    expect(out).not.toMatch(RELATIVE_URL)
    expect(out.split('\n').length).toBeLessThan(60)
  })

  it('renders a full version with every play inline and no fetch instructions', () => {
    const out = renderWorkflowFull(start, ctx, workflows)
    expect(out).toContain('## Play 1: Title project.assess')
    expect(out).toContain('## Play 4: Title color.scheme')
    expect(out).toContain('### Procedure')
    expect(out).toContain('included below')
    expect(out).not.toContain('If you cannot fetch URLs')
  })

  it('throws on an unknown play', () => {
    const broken = mustWorkflow(`---\nid: workflow.x\ntitle: Broken\ndescription: A broken workflow for testing only.\nsequence:\n  - color.nope\nlast_reviewed: 2026-11-14\n---\n`)
    expect(() => workflowSteps(broken, ctx.plays)).toThrow(/unknown play color.nope/)
  })
})

describe('loadCatalog', () => {
  function tmpRoot(files: Record<string, string>): string {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-content-'))
    for (const [rel, text] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true })
      fs.writeFileSync(path.join(root, rel), text)
    }
    return root
  }

  it('loads plays, workflows, and rules, and resolves {{sistema_url}}', () => {
    const root = tmpRoot({
      'content/plays/project/assess.md': playText('project.assess', 'kind: orient', 'See {{sistema_url}}/raw/plays/x.'),
      'content/workflows/start.md': `---\nid: workflow.start\ntitle: Start\ndescription: A workflow description long enough.\nsequence:\n  - project.assess\nlast_reviewed: 2026-11-14\n---\n`,
      'content/rules/color.yaml': `- id: color.x\n  statement: A statement long enough.\n  reason: A reason long enough.\n  layer: sistema-default\n  severity: advisory\n  applies_to: everything\n`,
    })
    const c = loadCatalog(root)
    expect(c.plays.map(p => p.id)).toEqual(['project.assess'])
    expect(c.playById.get('project.assess')!.body).not.toContain('{{sistema_url}}')
    expect(c.workflowById.has('workflow.start')).toBe(true)
    expect(c.ruleById.get('color.x')!.severity).toBe('advisory')
  })

  it('throws with the file and field on invalid content', () => {
    const root = tmpRoot({ 'content/plays/color/bad.md': playText('color.bad', 'milestone: later') })
    expect(() => loadCatalog(root)).toThrow(/content\/plays\/color\/bad\.md[\s\S]*milestone/)
  })
})
