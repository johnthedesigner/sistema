import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listSystems, listStubsForSystem, resolveStub, readSystemIndex } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { ContentMeta } from '@/components/kb/ContentMeta'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown System'
  return match[1].replace(/ — System Index$/, '').trim()
}

function formatSegment(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateStaticParams() {
  const params: { slug: string; path: string[] }[] = []
  for (const slug of listSystems()) {
    for (const pathParts of listStubsForSystem(slug)) {
      params.push({ slug, path: pathParts })
    }
  }
  return params
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>
}) {
  const { slug, path } = await params
  const stubPath = `${slug}/${path.join('/')}`

  let file
  try {
    file = resolveStub(stubPath)
  } catch {
    notFound()
  }

  const index = readSystemIndex(slug)
  const systemName = extractSystemName(index.body)
  const topicName = formatSegment(path[path.length - 1])

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href="/systems" className="hover:text-gray-900">Systems</Link>
        <span>/</span>
        <Link href={`/systems/${slug}`} className="hover:text-gray-900">{systemName}</Link>
        {path.slice(0, -1).map(segment => (
          <span key={segment} className="flex items-center gap-1.5">
            <span>/</span>
            <span>{formatSegment(segment)}</span>
          </span>
        ))}
        <span>/</span>
        <span className="text-gray-900">{topicName}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{topicName}</h1>

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
