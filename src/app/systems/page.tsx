import Link from 'next/link'
import { listSystems, readSystemIndex } from '@/lib/kb'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown System'
  return match[1].replace(/ — System Index$/, '').trim()
}

function extractFirstParagraph(body: string): string {
  const overviewMatch = body.match(/## Overview\n\n([\s\S]+?)(?=\n\n---|\n\n##)/)
  if (!overviewMatch) return ''
  const first = overviewMatch[1].split('\n\n')[0]
  return first.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim()
}

export default function SystemsPage() {
  const slugs = listSystems()
  const systems = slugs.map(slug => {
    const index = readSystemIndex(slug)
    return {
      slug,
      name: extractSystemName(index.body),
      description: extractFirstParagraph(index.body),
    }
  })

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Design Systems</h1>
      <p className="text-gray-500 mb-10">
        Browse the knowledge base by design system.
      </p>
      <div className="space-y-4">
        {systems.map(system => (
          <Link
            key={system.slug}
            href={`/systems/${system.slug}`}
            className="block border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold mb-2">{system.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {system.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
