import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listSystems, readSystemIndex, listStubsForSystem } from '@/lib/kb'
import { MarkdownBody } from '@/components/kb/MarkdownBody'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown System'
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
  guidance: 'Guidance',
  implementation: 'Implementation',
  assets: 'Assets',
  'design-md': 'DESIGN.md',
}

export async function generateStaticParams() {
  return listSystems().map(slug => ({ slug }))
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const systems = listSystems()
  if (!systems.includes(slug)) notFound()

  const index = readSystemIndex(slug)
  const stubs = listStubsForSystem(slug)

  const systemName = extractSystemName(index.body)
  const overview = extractSection(index.body, 'Overview')
  const sourceMap = extractSection(index.body, 'Source Map')

  const grouped = stubs.reduce<Record<string, string[][]>>((acc, parts) => {
    const type = parts[0]
    if (!acc[type]) acc[type] = []
    acc[type].push(parts)
    return acc
  }, {})

  const typeOrder = ['guidance', 'implementation', 'assets', 'design-md']
  const sortedTypes = typeOrder.filter(t => grouped[t])

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/systems" className="hover:text-gray-900">Systems</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{systemName}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-10">{systemName}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {overview && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Overview</h2>
              <MarkdownBody>{overview}</MarkdownBody>
            </section>
          )}

          {sourceMap && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Sources</h2>
              <MarkdownBody>{sourceMap}</MarkdownBody>
            </section>
          )}
        </div>

        {/* Content browser sidebar */}
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Browse Content</h2>
          <div className="space-y-6">
            {sortedTypes.map(type => (
              <div key={type}>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  {TYPE_LABELS[type] ?? type}
                </h3>
                <ul className="space-y-1">
                  {grouped[type].map(parts => (
                    <li key={parts.join('/')}>
                      <Link
                        href={`/systems/${slug}/${parts.join('/')}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
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
