import type { MetadataRoute } from 'next'
import { catalog, fileHref, playHref, workflowHref } from '@/lib/content/site'
import { SITE_URL } from '@/lib/site-url'

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
    entry('/privacy', 0.3),
    ...c.workflows.map(w => entry(workflowHref(w.id), 0.8)),
    ...c.plays.map(p => entry(playHref(p.id), 0.7)),
    ...c.guides.map(g => entry(`/guides/${g.topic}/${g.id.split('.')[2]}`, 0.7)),
    ...c.files.map(f => entry(fileHref(f.id), 0.6)),
  ]
}
