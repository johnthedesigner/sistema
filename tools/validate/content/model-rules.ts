/**
 * Contract checks for the v2 content model (content/). All code-level: they
 * guard the new model from the start. Legacy files are not touched.
 */
import { MILESTONES } from '../../../src/lib/content/schema'
import {
  guideFiles,
  headingAnchors,
  parsePlay,
  parseRuleFile,
  parseWorkflow,
  playPath,
  type ParseIssue,
  type Play,
  type Workflow,
} from '../../../src/lib/content/parse'
import type { Rule as ContentRule } from '../../../src/lib/content/schema'
import type { Corpus, Rule, SourceFile, Violation } from './rules'

type Out = Omit<Violation, 'rule' | 'level'>

interface Model {
  plays: Play[]
  workflows: Workflow[]
  rules: Array<ContentRule & { file: string }>
  errors: Array<{ file: string; issue: ParseIssue }>
}

const cache = new WeakMap<Corpus, Model>()

export function loadModel(corpus: Corpus): Model {
  const hit = cache.get(corpus)
  if (hit) return hit
  const model: Model = { plays: [], workflows: [], rules: [], errors: [] }
  for (const f of corpus.contentFiles ?? []) {
    if (/^content\/plays\/.+\.md$/.test(f.path)) {
      const r = parsePlay(f.path, f.text)
      if (r.ok) model.plays.push(r.value)
      else r.issues.forEach(issue => model.errors.push({ file: f.path, issue }))
    } else if (/^content\/workflows\/[^/]+\.md$/.test(f.path)) {
      const r = parseWorkflow(f.path, f.text)
      if (r.ok) model.workflows.push(r.value)
      else r.issues.forEach(issue => model.errors.push({ file: f.path, issue }))
    } else if (/^content\/rules\/[^/]+\.ya?ml$/.test(f.path)) {
      const r = parseRuleFile(f.text)
      if (r.ok) model.rules.push(...r.value.map(rule => ({ ...rule, file: f.path })))
      else r.issues.forEach(issue => model.errors.push({ file: f.path, issue }))
    }
  }
  cache.set(corpus, model)
  return model
}

function seqId(item: string): { id: string; optional: boolean } {
  return { id: item.replace(/\?$/, ''), optional: item.endsWith('?') }
}
const strip = (t: string) => t.replace(/\?$/, '')

/** Read a guide's markdown, following a kb stub to its versioned file if needed. */
function guideText(corpus: Corpus, ref: string): string | null {
  const byPath = new Map<string, SourceFile>()
  for (const f of [...(corpus.contentFiles ?? []), ...corpus.kbFiles]) byPath.set(f.path, f)
  for (const candidate of guideFiles(ref)) {
    const f = byPath.get(candidate)
    if (!f) continue
    const target = f.text.match(/^points_to:\s*(\S+)/m)?.[1]
    if (target) {
      const versioned = byPath.get(`${candidate.slice(0, candidate.lastIndexOf('/'))}/${target}`)
      return versioned ? versioned.text : null
    }
    return f.text
  }
  return null
}

const TOOL_WORDS: Record<string, RegExp> = {
  palette: /\bpalette\b/i,
  contrast: /\bcontrast\b/i,
  type_scale: /\btype[ _-]?scale\b/i,
}

// ─── rules ──────────────────────────────────────────────────────────────────

const parses: Rule = {
  id: 'model.schema',
  level: 'code',
  description: 'Every play, workflow, and rule file in content/ matches its schema.',
  check: c => loadModel(c).errors.map(e => ({ file: e.file, line: 1, message: `${e.issue.path}: ${e.issue.message}` })),
}

const idMatchesPath: Rule = {
  id: 'model.id-path',
  level: 'code',
  description: 'A play with id <topic>.<name> lives at content/plays/<topic>/<name>.md; IDs are unique.',
  check(c) {
    const out: Out[] = []
    const seen = new Map<string, string>()
    for (const p of loadModel(c).plays) {
      if (playPath(p.id) !== p.file) out.push({ file: p.file, line: 1, message: `id ${p.id} should live at ${playPath(p.id)}` })
      if (seen.has(p.id)) out.push({ file: p.file, line: 1, message: `duplicate play id ${p.id} (also ${seen.get(p.id)})` })
      seen.set(p.id, p.file)
    }
    const ruleSeen = new Map<string, string>()
    for (const r of loadModel(c).rules) {
      if (ruleSeen.has(r.id)) out.push({ file: r.file, line: 1, message: `duplicate rule id ${r.id} (also ${ruleSeen.get(r.id)})` })
      ruleSeen.set(r.id, r.file)
    }
    return out
  },
}

const workflowRefs: Rule = {
  id: 'model.workflow-refs',
  level: 'code',
  description: 'Workflow sequences and routes name plays that exist; continue_with names a workflow that exists.',
  check(c) {
    const m = loadModel(c)
    const plays = new Set(m.plays.map(p => p.id))
    const workflows = new Set(m.workflows.map(w => w.id))
    const out: Out[] = []
    for (const w of m.workflows) {
      const ids = [
        ...(w.sequence ?? []).filter((i): i is string => typeof i === 'string').map(i => seqId(i).id),
        ...Object.values(w.routes ?? {}).flat(),
      ]
      for (const id of ids) if (!plays.has(id)) out.push({ file: w.file, line: 1, message: `unknown play ${id}` })
      if (w.continue_with && !workflows.has(w.continue_with)) out.push({ file: w.file, line: 1, message: `unknown workflow ${w.continue_with}` })
    }
    return out
  },
}

const requiresSatisfied: Rule = {
  id: 'model.requires',
  level: 'code',
  description: 'In every workflow sequence, each play\'s requires are produced by an earlier required play or gate.',
  check(c) {
    const m = loadModel(c)
    const byId = new Map(m.plays.map(p => [p.id, p]))
    const out: Out[] = []
    for (const w of m.workflows) {
      if (!w.sequence) continue
      const available = new Set<string>()
      const optionalOnly = new Set<string>()
      for (const item of w.sequence) {
        if (typeof item !== 'string') {
          available.add(`gate:${item.gate}`)
          continue
        }
        const { id, optional } = seqId(item)
        const play = byId.get(id)
        if (!play) continue // reported by model.workflow-refs
        for (const req of play.requires.map(strip)) {
          if (available.has(req)) continue
          const why = optionalOnly.has(req) ? 'only an optional play produces it' : 'nothing earlier produces it'
          out.push({ file: w.file, line: 1, message: `${id} requires ${req}, but ${why}` })
        }
        for (const prod of play.produces.map(strip)) (optional ? optionalOnly : available).add(prod)
      }
    }
    return out
  },
}

const milestoneOrder: Rule = {
  id: 'model.milestone-order',
  level: 'code',
  description: 'Milestones never go backwards along a workflow sequence.',
  check(c) {
    const m = loadModel(c)
    const byId = new Map(m.plays.map(p => [p.id, p]))
    const out: Out[] = []
    for (const w of m.workflows) {
      let last = -1
      let lastId = ''
      for (const item of w.sequence ?? []) {
        if (typeof item !== 'string') continue
        const play = byId.get(seqId(item).id)
        if (!play) continue
        const idx = MILESTONES.indexOf(play.milestone)
        if (idx < last) out.push({ file: w.file, line: 1, message: `${play.id} (${play.milestone}) comes after ${lastId} (${MILESTONES[last]})` })
        if (idx >= last) {
          last = idx
          lastId = play.id
        }
      }
    }
    return out
  },
}

const producesConflict: Rule = {
  id: 'model.produces-conflict',
  level: 'code',
  description: 'No two create plays produce the same file. (A change play may rewrite what a create play produces.)',
  check(c) {
    const owners = new Map<string, string>()
    const out: Out[] = []
    for (const p of loadModel(c).plays) {
      if (p.kind !== 'create') continue
      for (const prod of p.produces.map(strip)) {
        if (prod.startsWith('gate:') || prod.startsWith('project:')) continue
        const prev = owners.get(prod)
        if (prev) out.push({ file: p.file, line: 1, message: `${p.id} and ${prev} both create ${prod}` })
        else owners.set(prod, p.id)
      }
    }
    return out
  },
}

const knowledgeResolves: Rule = {
  id: 'model.knowledge',
  level: 'code',
  description: 'Every knowledge ref names a guide that exists, and its #anchor is a heading in that guide.',
  check(c) {
    const out: Out[] = []
    for (const p of loadModel(c).plays) {
      for (const ref of p.knowledge) {
        const text = guideText(c, ref)
        if (text === null) {
          out.push({ file: p.file, line: 1, message: `guide for ${ref} not found (looked in ${guideFiles(ref).join(', ')})` })
          continue
        }
        const anchor = ref.split('#')[1]
        if (anchor && !headingAnchors(text).has(anchor)) out.push({ file: p.file, line: 1, message: `${ref}: no heading with anchor #${anchor}` })
      }
    }
    return out
  },
}

const rulesResolve: Rule = {
  id: 'model.rule-refs',
  level: 'code',
  description: 'Every rule a play cites exists in content/rules/.',
  check(c) {
    const m = loadModel(c)
    const ids = new Set(m.rules.map(r => r.id))
    return m.plays.flatMap(p => p.rules.filter(r => !ids.has(r)).map(r => ({ file: p.file, line: 1, message: `unknown rule ${r}` })))
  },
}

const toolsNamed: Rule = {
  id: 'model.tools-named',
  level: 'code',
  description: 'Every tool in a play\'s contract is named in its procedure, so agents are told to use it.',
  check(c) {
    return loadModel(c).plays.flatMap(p =>
      p.tools.filter(t => !TOOL_WORDS[t].test(p.body)).map(t => ({ file: p.file, line: 1, message: `contract requires the ${t} tool but the procedure never names it` })),
    )
  },
}

export const MODEL_RULES: Rule[] = [
  parses,
  idMatchesPath,
  workflowRefs,
  requiresSatisfied,
  milestoneOrder,
  producesConflict,
  knowledgeResolves,
  rulesResolve,
  toolsNamed,
]
