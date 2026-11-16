/**
 * Build-time loaders for content/ (server only). Parse errors throw, so a bad
 * file fails the build; `npm run check:content` reports the same errors with
 * file and field first, in prebuild.
 */
import fs from 'fs'
import path from 'path'
import { resolveSistemaUrl } from '../placeholders'
import { parseOpinion, parsePlay, parseRuleFile, parseWorkflow, type Opinion, type Play, type Workflow } from './parse'
import type { Rule } from './schema'

export interface Catalog {
  plays: Play[]
  workflows: Workflow[]
  rules: Rule[]
  opinions: Opinion[]
  playById: Map<string, Play>
  workflowById: Map<string, Workflow>
  ruleById: Map<string, Rule>
  opinionById: Map<string, Opinion>
}

function walk(dir: string, filter: (f: string) => boolean): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const abs = path.join(dir, e.name)
    return e.isDirectory() ? walk(abs, filter) : filter(abs) ? [abs] : []
  })
}

function fail(file: string, issues: Array<{ path: string; message: string }>): never {
  throw new Error(`Invalid content file ${file}:\n${issues.map(i => `  ${i.path}: ${i.message}`).join('\n')}`)
}

const cache = new Map<string, Catalog>()

/** Load every play, workflow, rule, and opinion under <root>/content. Cached per root. */
export function loadCatalog(root: string = process.cwd()): Catalog {
  const hit = cache.get(root)
  if (hit) return hit

  const rel = (abs: string) => path.relative(root, abs).split(path.sep).join('/')
  const read = (abs: string) => resolveSistemaUrl(fs.readFileSync(abs, 'utf-8'))
  const contentDir = path.join(root, 'content')

  const plays = walk(path.join(contentDir, 'plays'), f => f.endsWith('.md')).map(abs => {
    const r = parsePlay(rel(abs), read(abs))
    return r.ok ? r.value : fail(rel(abs), r.issues)
  })
  const workflows = walk(path.join(contentDir, 'workflows'), f => f.endsWith('.md')).map(abs => {
    const r = parseWorkflow(rel(abs), read(abs))
    return r.ok ? r.value : fail(rel(abs), r.issues)
  })
  const rules = walk(path.join(contentDir, 'rules'), f => /\.ya?ml$/.test(f)).flatMap(abs => {
    const r = parseRuleFile(read(abs))
    return r.ok ? r.value : fail(rel(abs), r.issues)
  })

  const opinions = walk(path.join(contentDir, 'opinions'), f => f.endsWith('.md')).map(abs => {
    const r = parseOpinion(rel(abs), read(abs))
    return r.ok ? r.value : fail(rel(abs), r.issues)
  })

  const catalog: Catalog = {
    plays: plays.sort((a, b) => a.id.localeCompare(b.id)),
    workflows: workflows.sort((a, b) => a.id.localeCompare(b.id)),
    rules,
    opinions: opinions.sort((a, b) => a.id.localeCompare(b.id)),
    playById: new Map(plays.map(p => [p.id, p])),
    workflowById: new Map(workflows.map(w => [w.id, w])),
    ruleById: new Map(rules.map(r => [r.id, r])),
    opinionById: new Map(opinions.map(o => [o.id, o])),
  }
  cache.set(root, catalog)
  return catalog
}
