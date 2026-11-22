/**
 * Content tools for the MCP server (capability model section 6): search, read,
 * and next_step. Pure functions over the catalog, rendering the same text the
 * /raw routes serve, so the MCP server and the paste-in prompts can't drift.
 */
import type { Catalog } from '@/lib/content/load'
import { buildContext } from '@/lib/content/context'
import { headingSlug } from '@/lib/content/parse'
import { renderPlay, renderWorkflowStarter, workflowSteps } from '@/lib/content/render'
import { renderFileRaw, renderGuideRaw, renderOpinion, renderRuleItem } from '@/lib/content/render-reference'

export const KINDS = ['play', 'workflow', 'guide', 'rule', 'opinion', 'file'] as const
export type Kind = (typeof KINDS)[number]

export interface Hit {
  id: string
  kind: Kind
  title: string
  description: string
  topic?: string
}

function items(c: Catalog): Array<Hit & { text: string }> {
  return [
    ...c.plays.map(p => ({ id: p.id, kind: 'play' as const, title: p.title, description: p.description, topic: p.topic, text: p.body })),
    ...c.workflows.map(w => ({ id: w.id, kind: 'workflow' as const, title: w.title, description: w.description, text: w.body ?? '' })),
    ...c.guides.map(g => ({ id: g.id, kind: 'guide' as const, title: g.title, description: g.description, topic: g.topic, text: g.body })),
    ...c.rules.map(r => ({ id: r.id, kind: 'rule' as const, title: r.id, description: r.statement, topic: r.id.split('.')[0], text: r.reason ?? '' })),
    ...c.opinions.map(o => ({ id: o.id, kind: 'opinion' as const, title: o.title, description: o.default, text: o.body })),
    ...c.files.map(f => ({ id: f.id, kind: 'file' as const, title: f.title, description: f.description, text: f.body })),
  ]
}

/** Rank items by how many query words they contain, weighting titles and IDs. */
export function search(c: Catalog, query: string, kind?: Kind, topic?: string, limit = 10): Hit[] {
  const words = query.toLowerCase().split(/[^a-z0-9.-]+/).filter(w => w.length > 1)
  if (!words.length) return []
  return items(c)
    .filter(i => (!kind || i.kind === kind) && (!topic || i.topic === topic))
    .map(i => {
      const head = `${i.id} ${i.title}`.toLowerCase()
      const desc = i.description.toLowerCase()
      const body = i.text.toLowerCase()
      const score = words.reduce((s, w) => s + (head.includes(w) ? 5 : 0) + (desc.includes(w) ? 2 : 0) + (body.includes(w) ? 1 : 0), 0)
      return { i, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ i: { text: _text, ...hit } }) => hit)
}

/** Only the part of a markdown document under one heading (by its anchor), down to the next heading of the same level or higher. */
export function sectionOf(markdown: string, anchor: string): string | null {
  const lines = markdown.split('\n')
  let start = -1
  let level = 0
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,4})\s+(.*)$/)
    if (!m) continue
    if (start < 0 && headingSlug(m[2]) === anchor) {
      start = i
      level = m[1].length
    } else if (start >= 0 && m[1].length <= level) {
      return lines.slice(start, i).join('\n').trim()
    }
  }
  return start >= 0 ? lines.slice(start).join('\n').trim() : null
}

/** One item's plain text, as /raw serves it, or one section of it. */
export function read(c: Catalog, id: string, section?: string): { ok: true; text: string } | { ok: false; error: string } {
  const [ref, hash] = id.split('#')
  const anchor = section ?? hash
  const ctx = buildContext(c)
  let text: string | undefined
  if (c.playById.has(ref)) text = renderPlay(c.playById.get(ref)!, ctx)
  else if (c.workflowById.has(ref)) text = renderWorkflowStarter(c.workflowById.get(ref)!, ctx, c.workflowById)
  else if (c.guideById.has(ref)) text = renderGuideRaw(c.guideById.get(ref)!, c.sourceById)
  else if (c.ruleById.has(ref)) text = renderRuleItem(c.ruleById.get(ref)!)
  else if (c.opinionById.has(ref)) text = renderOpinion(c.opinionById.get(ref)!)
  else if (c.fileById.has(ref)) text = renderFileRaw(c.fileById.get(ref)!, c.sourceById)
  if (text === undefined) return { ok: false, error: `No item "${ref}". Use search to find IDs, such as "color.scheme", "workflow.start", "guide.color.architecture", or "opinion.quiet-states".` }
  if (!anchor) return { ok: true, text }
  const part = sectionOf(text, anchor)
  return part ? { ok: true, text: part } : { ok: false, error: `"${ref}" has no section "${anchor}".` }
}

interface State {
  steps?: Record<string, { status?: string }>
  gates?: Record<string, { withdrawn?: unknown }>
  routing?: Record<string, string>
}

/**
 * The next thing to do in a workflow, given sistema.json: an approval still
 * waiting, or the next play's full text. A hosted server can't see the repo, so
 * it trusts the state it's given; evidence is the agent's to show.
 */
export function nextStep(c: Catalog, workflowId: string, state: State = {}): { ok: true; text: string; done?: boolean } | { ok: false; error: string } {
  const id = workflowId.startsWith('workflow.') ? workflowId : `workflow.${workflowId}`
  const workflow = c.workflowById.get(id)
  if (!workflow) return { ok: false, error: `No workflow "${workflowId}". Workflows: ${c.workflows.map(w => w.id).join(', ')}.` }
  const ctx = buildContext(c)
  if (!workflow.sequence) {
    const start = workflow.start_with ? c.playById.get(workflow.start_with) : undefined
    return start ? { ok: true, text: `This workflow starts with ${start.id}, then follows one route.\n\n${renderPlay(start, ctx)}` } : { ok: false, error: `${id} has no sequence.` }
  }
  const settled = (pid: string) => ['complete', 'skipped'].includes(state.steps?.[pid]?.status ?? '')
  const approved = (gate: string) => !!state.gates?.[gate] && !state.gates[gate].withdrawn
  const { steps } = workflowSteps(workflow, c.playById)
  for (const s of steps) {
    if (!settled(s.play.id)) {
      const pid = state.routing?.[s.play.id] ?? s.play.id
      const play = c.playById.get(pid) ?? s.play
      const optional = s.optional ? 'This step is optional: ask the person whether they want it now, and record it as skipped if not.\n\n' : ''
      return { ok: true, text: `Step ${s.number} of ${steps.length} in "${workflow.title}".\n\n${optional}${renderPlay(play, ctx)}` }
    }
    for (const g of s.gateAfter) {
      if (!approved(g.gate)) return { ok: true, text: `Waiting for the person's approval: ${g.gate}.\n\n${g.prompt}\n\nRecord it in sistema.json "gates" when they approve, then call next_step again.` }
    }
  }
  return { ok: true, done: true, text: `Every step of "${workflow.title}" is complete. Follow the workflow's "When this workflow is done" section:\n\n${renderWorkflowStarter(workflow, ctx, c.workflowById).split('## When this workflow is done')[1] ?? ''}` }
}
