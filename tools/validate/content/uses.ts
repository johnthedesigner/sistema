/**
 * "What uses this" lookup (plan 8.2). Lists every item that references an ID:
 * a play, workflow, rule, opinion, guide (optionally #anchor), file format,
 * source, gate, or state token (for example design-md#colors or
 * tokens/src/color.json). Run it before changing anything structural.
 *
 *   npm run uses -- color.contrast.text
 *   npm run uses -- guide.color.architecture#dark-mode-the-tonal-shift
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadCatalog, type Catalog } from '../../../src/lib/content/load'

export interface Use {
  /** The item that holds the reference. */
  item: string
  file: string
  /** How it refers to the ID. */
  how: string
}

const strip = (t: string) => t.replace(/\?$/, '')

/** A ref matches the query exactly, or (for an anchorless guide query) any section of that guide. */
function refMatches(ref: string, query: string): boolean {
  if (ref === query) return true
  return !query.includes('#') && query.startsWith('guide.') && ref.split('#')[0] === query
}

/** URL forms an ID takes in agent-facing text. */
function urlForms(id: string, c: Catalog): string[] {
  const base = id.split('#')[0]
  if (c.playById.has(base)) return [`/raw/plays/${base}`]
  if (c.workflowById.has(base)) return [`/raw/workflows/${base.replace(/^workflow\./, '')}`]
  if (c.guideById.has(base)) {
    const [, topic, name] = base.split('.')
    return [`/raw/guides/${topic}/${name}`]
  }
  if (c.fileById.has(base)) return [`/raw/files/${base.replace(/^file\./, '')}`]
  return []
}

/** Structured references (frontmatter fields), then mentions in text. */
export function findUses(c: Catalog, texts: Array<{ path: string; text: string }>, query: string): Use[] {
  const out: Use[] = []
  const add = (item: string, file: string, how: string) => out.push({ item, file, how })

  for (const p of c.plays) {
    if (p.requires.some(r => strip(r) === query)) add(p.id, p.file, 'requires it')
    if (p.produces.some(r => strip(r) === query)) add(p.id, p.file, 'produces it')
    if (p.knowledge.some(k => refMatches(k, query))) add(p.id, p.file, 'cites it in knowledge')
    if (p.rules.includes(query)) add(p.id, p.file, 'applies it')
    if (p.tools.some(t => `tool.${t}` === query || t === query)) add(p.id, p.file, 'calls it')
  }
  for (const w of c.workflows) {
    w.sequence?.forEach((s, i) => {
      if (typeof s === 'string' ? strip(s) === query : `gate:${s.gate}` === query || s.gate === query) add(w.id, w.file, `sequence step ${i + 1}`)
    })
    if (w.start_with === query) add(w.id, w.file, 'starts with it')
    for (const [slug, r] of Object.entries(w.routes ?? {})) if (r.plays.includes(query)) add(w.id, w.file, `route ${slug}`)
  }
  for (const r of c.rules) {
    if (r.sources.some(s => refMatches(s, query))) add(r.id, `content/rules/${r.id.split('.')[0]}.yaml`, 'cites it as a source')
    if (r.checked_by?.some(x => x.includes(query))) add(r.id, `content/rules/${r.id.split('.')[0]}.yaml`, 'is checked by it')
  }
  for (const o of c.opinions) {
    if (o.rules.includes(query)) add(o.id, o.file, 'lists it as a rule')
    if (o.guides.some(g => refMatches(g, query))) add(o.id, o.file, 'cites it')
  }
  for (const g of c.guides) {
    if (g.related.some(r => refMatches(r, query))) add(g.id, g.file, 'builds on it')
    if (g.sources.some(s => s.source === query)) add(g.id, g.file, 'credits it')
  }
  for (const f of c.files) if (f.sources.some(s => s.source === query)) add(f.id, f.file, 'credits it')

  // Mentions in text: the ID itself, or its URL form, outside the item's own file.
  const own = new Set([c.playById, c.workflowById, c.guideById, c.fileById, c.opinionById].map(m => m.get(query.split('#')[0])?.file).filter(Boolean))
  const needles = [query, ...urlForms(query, c)]
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  for (const t of texts) {
    if (own.has(t.path)) continue
    const body = t.text.replace(/^---\n[\s\S]*?\n---\n/, '')
    const offset = t.text.indexOf(body)
    const lines = new Set<number>()
    for (const n of needles) {
      for (const m of body.matchAll(new RegExp(`(?<![\\w.-])${escape(n)}(?![\\w-])`, 'g'))) {
        const start = body.lastIndexOf('\n', m.index) + 1
        if (/^\s*-?\s*id:\s/.test(body.slice(start, m.index))) continue // the item's own definition
        lines.add(t.text.slice(0, offset + m.index).split('\n').length)
      }
    }
    if (lines.size) add(t.path, t.path, `mentions it in text (line ${[...lines].sort((a, b) => a - b).join(', ')})`)
  }
  return out
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : /\.(md|ya?ml)$/.test(p) ? [p] : []
  })
}

function main() {
  const query = process.argv[2]
  if (!query) {
    console.error('Usage: npm run uses -- <id>   (play, workflow, rule, opinion, guide[#anchor], file, source, gate, or state token)')
    process.exit(1)
  }
  const root = process.cwd()
  const c = loadCatalog(root)
  const texts = walk(path.join(root, 'content')).map(abs => ({ path: path.relative(root, abs).split(path.sep).join('/'), text: fs.readFileSync(abs, 'utf-8') }))
  const uses = findUses(c, texts, query)
  if (!uses.length) {
    console.log(`Nothing references ${query}.`)
    return
  }
  console.log(`${uses.length} reference(s) to ${query}:`)
  for (const u of uses) console.log(`  ${u.item === u.file ? u.file : `${u.item}  (${u.file})`}: ${u.how}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
