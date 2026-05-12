import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPlaybooks } from '@/lib/playbooks'
import { TierBadge } from '@/components/playbooks/TierBadge'
import { CopyButton } from '@/components/playbooks/CopyButton'
import { MarkdownBody } from '@/components/kb/MarkdownBody'

export async function generateStaticParams() {
  const plays = loadPlaybooks()
  return plays.map(p => ({ id: p.id }))
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plays = loadPlaybooks()
  const play = plays.find(p => p.id === id)

  if (!play) notFound()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5">
        <Link href="/playbooks" className="hover:text-gray-900">Playbooks</Link>
        <span>/</span>
        <span className="text-gray-900">{play.id} — {play.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="text-xs text-gray-400 mb-1">{play.category}</p>
          <h1 className="text-3xl font-bold">{play.id} — {play.title}</h1>
        </div>
        <TierBadge tier={play.tier} />
      </div>

      <div className="mb-6">
        <CopyButton text={play.body} />
      </div>

      <div className="border border-gray-100 rounded-lg p-6 bg-gray-50">
        <MarkdownBody>{play.body}</MarkdownBody>
      </div>
    </main>
  )
}
