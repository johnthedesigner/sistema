import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listSystems, readSystemIndex, listStubsForSystem, findDesignMd, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { DesignMdPanel } from '@/components/kb/DesignMdPanel'
import { ArticleCopyButton } from '@/components/kb/ArticleCopyButton'

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

// For principles, strip "Architecture" from display name — it's always the
// category's main article and the category name alone is less redundant.
function formatArticleName(parts: string[], category: string, systemName: string): string {
  const last = parts[parts.length - 1]
  const base = last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  if (category === 'principles' && base === 'Architecture') return systemName
  return base
}

const CATEGORY_LABELS: Record<KBCategory, string> = {
  'design-systems': 'Design Systems',
  'standards': 'Standards',
  'foundations': 'Foundations',
  'skills': 'Agent Skills',
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

  // Articles: exclude design-md (handled by DesignMdPanel), sorted alphabetically by filename
  const articles = stubs
    .filter(parts => parts[0] !== 'design-md')
    .sort((a, b) => {
      const nameA = a[a.length - 1]
      const nameB = b[b.length - 1]
      return nameA.localeCompare(nameB)
    })

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

      <div className="space-y-10 mb-12">
        {overview && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Overview</h2>
            <MarkdownBody>{overview}</MarkdownBody>
          </section>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Articles</h2>
            <div className="border border-border rounded-radius-lg divide-y divide-border overflow-hidden">
              {articles.map(parts => {
                const href = `/kb/${category}/${slug}/${parts.join('/')}.md`
                const rawUrl = `/raw/${category}/${slug}/${parts.join('/')}`
                const displayName = formatArticleName(parts, category, systemName)
                return (
                  <div key={parts.join('/')} className="flex items-center justify-between px-4 py-3 hover:bg-surface-sunken transition-colors">
                    <Link
                      href={href}
                      className="text-[13.5px] text-on-surface hover:text-primary transition-colors no-underline font-medium"
                    >
                      {displayName}
                    </Link>
                    <ArticleCopyButton rawUrl={rawUrl} />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {sourceMap && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-4">Sources</h2>
            <MarkdownBody>{sourceMap}</MarkdownBody>
          </section>
        )}
      </div>
    </main>
  )
}
