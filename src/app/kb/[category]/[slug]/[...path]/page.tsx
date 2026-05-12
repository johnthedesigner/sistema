import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { listSystems, listStubsForSystem, resolveStub, readSystemIndex, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { ContentMeta } from '@/components/kb/ContentMeta'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown'
  return match[1].replace(/ — System Index$/, '').trim()
}

function formatSegment(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const CATEGORY_LABELS: Record<KBCategory, string> = {
  'design-systems': 'Design Systems',
  'standards': 'Standards',
  'foundations': 'Foundations',
}

export async function generateStaticParams() {
  const params: { category: string; slug: string; path: string[] }[] = []
  for (const category of KB_CATEGORIES) {
    for (const slug of listSystems(category)) {
      for (const pathParts of listStubsForSystem(slug, category)) {
        // URL always has .md on the last segment
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

  // Enforce .md on last segment — redirect if missing
  const lastSegment = path[path.length - 1]
  if (!lastSegment.endsWith('.md')) {
    redirect(`/kb/${category}/${slug}/${path.join('/')}.md`)
  }

  // Strip .md to get the stub path
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
  const topicName = formatSegment(cleanPath[cleanPath.length - 1])
  const categoryLabel = CATEGORY_LABELS[cat]

  const rawUrl = `/raw/${category}/${slug}/${cleanPath.join('/')}.md`

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
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

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">{topicName}</h1>
        <a
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 mt-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors font-mono"
        >
          Raw
        </a>
      </div>

      <ContentMeta frontmatter={file.frontmatter} />

      {file.isJson ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Token values as CSS custom properties.
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{file.body}</code>
          </pre>
        </div>
      ) : (
        <MarkdownBody>{file.body}</MarkdownBody>
      )}
    </main>
  )
}
