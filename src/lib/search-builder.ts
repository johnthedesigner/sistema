import { catalog, fileHref, guideHref, MILESTONE_LABELS, opinionHref, playHref, ruleHref, sourceHref, TOPIC_LABELS, workflowHref } from './content/site'
import type { SearchEntry } from './search'

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
  for (const f of c.files) {
    entries.push({ type: 'file', title: f.title, slug: f.id, href: fileHref(f.id), tags: [], description: f.description, meta: 'file format' })
  }
  for (const s of c.sources) {
    entries.push({ type: 'source', title: s.name, slug: s.id, href: sourceHref(s.id), tags: [], description: s.publisher, meta: 'source' })
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
