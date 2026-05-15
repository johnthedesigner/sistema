// Shared types and client-safe scoring function.
// Server-only index builder lives in search-builder.ts.

export type SearchEntryType = 'play' | 'featured' | 'kb' | 'tool'

export interface SearchEntry {
  type: SearchEntryType
  title: string
  slug: string
  href: string
  tags: string[]
  description: string
  meta: string
}

export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.toLowerCase().trim()
  if (!q) return 0

  const title = entry.title.toLowerCase()
  const slug = entry.slug.toLowerCase()
  const desc = entry.description.toLowerCase()
  const meta = entry.meta.toLowerCase()
  const tags = entry.tags.map(t => t.toLowerCase())
  const slugQuery = q.replace(/\s+/g, '-')

  if (title === q) return 100
  if (title.startsWith(q)) return 90
  if (title.includes(q)) return 70
  if (slug === slugQuery) return 65
  if (slug.startsWith(slugQuery)) return 60
  if (slug.includes(slugQuery)) return 55
  if (tags.some(t => t === q)) return 50
  if (tags.some(t => t.includes(q))) return 45
  if (meta.includes(q)) return 40
  if (desc.includes(q)) return 30
  return 0
}
