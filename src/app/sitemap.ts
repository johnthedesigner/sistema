import type { MetadataRoute } from 'next'
import { listSystems, type KBCategory } from '@/lib/kb'
import { catalog, playHref, workflowHref } from '@/lib/content/site'
import { SITE_URL } from '@/lib/site-url'

const REFERENCE_CATEGORIES: KBCategory[] = ['design-systems', 'standards', 'foundations', 'skills']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const c = catalog()
  const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly') => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  })

  return [
    entry('', 1.0, 'weekly'),
    entry('/how-it-works', 0.9),
    entry('/workflows', 0.8),
    entry('/plays', 0.8, 'weekly'),
    entry('/guides', 0.8),
    entry('/reference', 0.7),
    entry('/reference/opinions', 0.7),
    entry('/reference/rules', 0.6),
    entry('/reference/tools', 0.6),
    entry('/agents', 0.6),
    entry('/tools', 0.6),
    entry('/sources', 0.5),
    ...c.workflows.map(w => entry(workflowHref(w.id), 0.8)),
    ...c.plays.map(p => entry(playHref(p.id), 0.7)),
    ...c.guides.map(g => entry(`/guides/${g.topic}/${g.id.split('.')[2]}`, 0.7)),
    // Reference material stays public until V1.16 makes it internal.
    ...REFERENCE_CATEGORIES.flatMap(cat => listSystems(cat).map(slug => entry(`/kb/${cat}/${slug}`, 0.4))),
  ]
}
