import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listSystems, readSystemIndex, KB_CATEGORIES, type KBCategory } from '@/lib/kb'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown'
  return match[1].replace(/ — System Index$/, '').trim()
}

function extractFirstParagraph(body: string): string {
  const sectionMatch = body.match(/^##[^\n]*\n\n([\s\S]+?)(?=\n\n---|\n\n##)/m)
  if (!sectionMatch) return ''
  const first = sectionMatch[1].split('\n\n')[0]
  return first.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim()
}

const CATEGORY_LABELS: Record<KBCategory, string> = {
  'design-systems': 'Design Systems',
  'standards': 'Standards',
  'foundations': 'Foundations',
  'skills': 'Agent Skills',
  'principles': 'Principles',
}

export async function generateStaticParams() {
  return KB_CATEGORIES.map(category => ({ category }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!KB_CATEGORIES.includes(category as KBCategory)) notFound()

  const cat = category as KBCategory
  const label = CATEGORY_LABELS[cat]
  const slugs = listSystems(cat)

  if (slugs.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <nav className="text-sm text-on-surface-muted mb-8">
          <Link href="/kb" className="hover:text-on-surface">Knowledge Base</Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface">{label}</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4">{label}</h1>
        <p className="text-on-surface-muted">No content captured yet. Check back in a future phase.</p>
      </main>
    )
  }

  const entries = slugs.map(slug => {
    const index = readSystemIndex(slug, cat)
    return {
      slug,
      name: extractSystemName(index.body),
      description: extractFirstParagraph(index.body),
    }
  })

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-on-surface-muted mb-8">
        <Link href="/kb" className="hover:text-on-surface">Knowledge Base</Link>
        <span className="mx-2">/</span>
        <span className="text-on-surface">{label}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{label}</h1>
      <p className="text-on-surface-muted mb-10">
        Browse the knowledge base by {label.toLowerCase().replace(/s$/, '')}.
      </p>

      <div className="space-y-4">
        {entries.map(entry => (
          <Link
            key={entry.slug}
            href={`/kb/${category}/${entry.slug}`}
            className="block border border-border rounded-radius-lg p-6 hover:border-on-surface-muted hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold mb-2">{entry.name}</h2>
            {entry.description && (
              <p className="text-on-surface-muted text-sm leading-relaxed line-clamp-3">
                {entry.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
