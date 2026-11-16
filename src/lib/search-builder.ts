import fs from 'fs'
import path from 'path'
import { listSystems, type KBCategory } from './kb'
import { catalog, guideHref, MILESTONE_LABELS, opinionHref, playHref, ruleHref, TOPIC_LABELS, workflowHref } from './content/site'
import type { SearchEntry } from './search'

const KB_BASE = path.join(process.cwd(), 'kb', 'reference')

// Reference material stays searchable until V1.16 makes it internal.
const REFERENCE: Array<{ category: KBCategory; meta: string }> = [
  { category: 'design-systems', meta: 'design systems' },
  { category: 'standards', meta: 'standards' },
  { category: 'foundations', meta: 'foundations' },
  { category: 'skills', meta: 'agent skills' },
]

function readKBTitle(category: KBCategory, slug: string): string {
  const indexPath = path.join(KB_BASE, category, slug, '_index.md')
  if (!fs.existsSync(indexPath)) return slug.replace(/-/g, ' ')
  const match = fs.readFileSync(indexPath, 'utf-8').match(/^# (.+)$/m)
  return match ? match[1].replace(/ — .*$/, '').trim() : slug.replace(/-/g, ' ')
}

export function buildSearchIndex(): SearchEntry[] {
  const c = catalog()
  const entries: SearchEntry[] = []

  for (const w of c.workflows) {
    entries.push({ type: 'workflow', title: w.title, slug: w.id, href: workflowHref(w.id), tags: [], description: w.description, meta: 'workflow' })
  }
  for (const p of c.plays) {
    entries.push({
      type: 'play',
      title: p.title,
      slug: p.id,
      href: playHref(p.id),
      tags: [p.topic, p.kind],
      description: p.description,
      meta: `${TOPIC_LABELS[p.topic]} · ${MILESTONE_LABELS[p.milestone]}`,
    })
  }
  for (const g of c.guides) {
    entries.push({ type: 'guide', title: g.title, slug: g.id, href: guideHref(g.id), tags: [g.topic], description: g.description, meta: TOPIC_LABELS[g.topic] })
  }
  for (const o of c.opinions) {
    entries.push({ type: 'opinion', title: o.title, slug: o.id, href: opinionHref(o.id), tags: [o.group], description: o.default, meta: 'opinion' })
  }
  for (const r of c.rules) {
    entries.push({ type: 'rule', title: r.id, slug: r.id, href: ruleHref(r.id), tags: [], description: r.statement, meta: r.severity === 'blocking' ? 'required' : 'advisory' })
  }
  for (const { category, meta } of REFERENCE) {
    for (const slug of listSystems(category)) {
      entries.push({ type: 'kb', title: readKBTitle(category, slug), slug, href: `/kb/${category}/${slug}`, tags: [], description: '', meta })
    }
  }
  for (const [slug, title, desc] of [
    ['palette', 'Palette tool', 'OKLCH palettes generated from seed colors'],
    ['contrast', 'Contrast checker', 'Check contrast between two colors against WCAG'],
    ['type-scale', 'Type scale calculator', 'Build a modular type scale'],
  ]) {
    entries.push({ type: 'tool', title, slug, href: `/tools/${slug}`, tags: ['tool'], description: desc, meta: 'tool' })
  }
  return entries
}
