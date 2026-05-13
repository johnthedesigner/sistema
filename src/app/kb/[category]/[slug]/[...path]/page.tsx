import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { listSystems, listStubsForSystem, resolveStub, readSystemIndex, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { ContentMeta } from '@/components/kb/ContentMeta'
import { CopyRawButton } from '@/components/kb/CopyRawButton'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown'
  return match[1].replace(/ — System Index$/, '').trim()
}

function formatSegment(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatTopicName(parts: string[]): string {
  return formatSegment(parts[parts.length - 1])
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
  const params: { category: string; slug: string; path: string[] }[] = []
  for (const category of KB_CATEGORIES) {
    for (const slug of listSystems(category)) {
      for (const pathParts of listStubsForSystem(slug, category)) {
        const urlPath = [...pathParts.slice(0, -1), pathParts[pathParts.length - 1] + '.md']
        params.push({ category, slug, path: urlPath })
      }
    }
  }
  return params
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ category: string; slug: string; path: string[] }>
}) {
  const { category, slug, path } = await params

  if (!KB_CATEGORIES.includes(category as KBCategory)) notFound()
  const cat = category as KBCategory

  const lastSegment = path[path.length - 1]
  if (!lastSegment.endsWith('.md')) {
    redirect(`/kb/${category}/${slug}/${path.join('/')}.md`)
  }

  const cleanPath = [...path.slice(0, -1), lastSegment.replace(/\.md$/, '')]
  const stubPath = `kb/${category}/${slug}/${cleanPath.join('/')}`

  let file
  try {
    file = resolveStub(stubPath)
  } catch {
    notFound()
  }

  const index = readSystemIndex(slug, cat)
  const systemName = extractSystemName(index.body)
  const topicName = formatTopicName(cleanPath)
  const categoryLabel = CATEGORY_LABELS[cat]
  const rawUrl = `/raw/${category}/${slug}/${cleanPath.join('/')}.md`

  // In-system navigation
  const allStubs = listStubsForSystem(slug, cat)
  const currentKey = cleanPath.join('/')
  const grouped = allStubs.reduce<Record<string, string[][]>>((acc, parts) => {
    const type = parts.length === 1 ? 'content' : parts[0]
    if (!acc[type]) acc[type] = []
    acc[type].push(parts)
    return acc
  }, {})
  const typeOrder = ['content', 'guidance', 'implementation', 'assets', 'design-md']
  const sortedTypes = typeOrder.filter(t => grouped[t])

  // Cross-system "See also" — match on last path segment across other systems
  const currentTopic = cleanPath[cleanPath.length - 1]
  const seeAlso: { systemName: string; slug: string; category: KBCategory; parts: string[] }[] = []
  for (const otherCat of KB_CATEGORIES) {
    for (const otherSlug of listSystems(otherCat)) {
      if (otherSlug === slug && otherCat === cat) continue
      try {
        const otherStubs = listStubsForSystem(otherSlug, otherCat)
        const match = otherStubs.find(p => p[p.length - 1] === currentTopic)
        if (match) {
          const otherIndex = readSystemIndex(otherSlug, otherCat)
          seeAlso.push({
            systemName: extractSystemName(otherIndex.body),
            slug: otherSlug,
            category: otherCat,
            parts: match,
          })
        }
      } catch {
        // skip systems that can't be read
      }
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href="/kb" className="hover:text-gray-900">Knowledge Base</Link>
        <span>/</span>
        <Link href={`/kb/${category}`} className="hover:text-gray-900">{categoryLabel}</Link>
        <span>/</span>
        <Link href={`/kb/${category}/${slug}`} className="hover:text-gray-900">{systemName}</Link>
        {cleanPath.slice(0, -1).map(segment => (
          <span key={segment} className="flex items-center gap-1.5">
            <span>/</span>
            <span>{formatSegment(segment)}</span>
          </span>
        ))}
        <span>/</span>
        <span className="text-gray-900">{topicName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{topicName}</h1>
            <div className="flex items-center gap-2 flex-shrink-0 mt-1.5">
              <CopyRawButton rawUrl={rawUrl} />
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors font-mono"
              >
                Raw
              </a>
            </div>
          </div>

          <ContentMeta frontmatter={file.frontmatter} />

          {file.isJson ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">Token values as CSS custom properties.</p>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{file.body}</code>
              </pre>
            </div>
          ) : (
            <MarkdownBody>{file.body}</MarkdownBody>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              In this section
            </h2>
            <div className="space-y-5">
              {sortedTypes.map(type => (
                <div key={type}>
                  {sortedTypes.length > 1 && (
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                      {TYPE_LABELS[type] ?? type}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {grouped[type].map(parts => {
                      const key = parts.join('/')
                      const isCurrent = key === currentKey
                      return (
                        <li key={key}>
                          {isCurrent ? (
                            <span className="text-sm font-medium text-gray-900">
                              {formatTopicName(parts)}
                            </span>
                          ) : (
                            <Link
                              href={`/kb/${category}/${slug}/${parts.join('/')}.md`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {formatTopicName(parts)}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {seeAlso.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                See also
              </h2>
              <ul className="space-y-1">
                {seeAlso.map(({ systemName: name, slug: otherSlug, category: otherCat, parts }) => (
                  <li key={`${otherCat}/${otherSlug}`}>
                    <Link
                      href={`/kb/${otherCat}/${otherSlug}/${parts.join('/')}.md`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
