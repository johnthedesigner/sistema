import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listSystems, readSystemIndex, listStubsForSystem, findDesignMd, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { DesignMdPanel } from '@/components/kb/DesignMdPanel'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown'
  return match[1].replace(/ — System Index$/, '').trim()
}

function extractSection(body: string, heading: string): string {
  const regex = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n\\n---\\n|\\n## |$)`)
  const match = body.match(regex)
  return match ? match[1].trim() : ''
}

function formatTopicName(parts: string[]): string {
  const last = parts[parts.length - 1]
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

const TYPE_LABELS: Record<string, string> = {
  content: 'Content',
  guidance: 'Guidance',
  implementation: 'Implementation',
  assets: 'Assets',
  'design-md': 'DESIGN.md',
}

const CATEGORY_LABELS: Record<KBCategory, string> = {
  'design-systems': 'Design Systems',
  'standards': 'Standards',
  'foundations': 'Foundations',
  'principles': 'Principles',
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = []
  for (const category of KB_CATEGORIES) {
    for (const slug of listSystems(category)) {
      params.push({ category, slug })
    }
  }
  return params
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  if (!KB_CATEGORIES.includes(category as KBCategory)) notFound()

  const cat = category as KBCategory
  const systems = listSystems(cat)
  if (!systems.includes(slug)) notFound()

  const index = readSystemIndex(slug, cat)
  const stubs = listStubsForSystem(slug, cat)

  const systemName = extractSystemName(index.body)
  const overview = extractSection(index.body, 'Overview')
  const sourceMap = extractSection(index.body, 'Source Map')
  const categoryLabel = CATEGORY_LABELS[cat]
  const designMdPath = findDesignMd(slug, cat)

  const grouped = stubs.reduce<Record<string, string[][]>>((acc, parts) => {
    const type = parts.length === 1 ? 'content' : parts[0]
    if (!acc[type]) acc[type] = []
    acc[type].push(parts)
    return acc
  }, {})

  const typeOrder = ['content', 'guidance', 'implementation', 'assets', 'design-md']
  const sortedTypes = typeOrder.filter(t => grouped[t])

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-on-surface-muted mb-8">
        <Link href="/kb" className="hover:text-on-surface">Knowledge Base</Link>
        <span className="mx-2">/</span>
        <Link href={`/kb/${category}`} className="hover:text-on-surface">{categoryLabel}</Link>
        <span className="mx-2">/</span>
        <span className="text-on-surface">{systemName}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">{systemName}</h1>

      {designMdPath && (
        <DesignMdPanel rawPath={designMdPath} systemName={systemName} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {overview && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Overview</h2>
              <MarkdownBody>{overview}</MarkdownBody>
            </section>
          )}

          {sourceMap && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Sources</h2>
              <MarkdownBody>{sourceMap}</MarkdownBody>
            </section>
          )}
        </div>

        {/* Content browser sidebar */}
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Browse Content</h2>
          <div className="space-y-6">
            {sortedTypes.map(type => (
              <div key={type}>
                <h3 className="text-xs font-medium text-on-surface-muted uppercase tracking-wider mb-2">
                  {TYPE_LABELS[type] ?? type}
                </h3>
                <ul className="space-y-1">
                  {grouped[type].map(parts => (
                    <li key={parts.join('/')}>
                      <Link
                        href={`/kb/${category}/${slug}/${parts.join('/')}.md`}
                        className="text-sm text-primary hover:text-primary hover:underline"
                      >
                        {formatTopicName(parts)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
