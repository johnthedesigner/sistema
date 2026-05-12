import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPlaybooks, STAGE_LABELS } from '@/lib/playbooks'
import { loadExemplar } from '@/lib/exemplars'
import { CopyButton } from '@/components/playbooks/CopyButton'
import { PlayForm } from '@/components/playbooks/PlayForm'
import { ExemplarPreview } from '@/components/playbooks/ExemplarPreview'
import { MarkdownBody } from '@/components/kb/MarkdownBody'

export async function generateStaticParams() {
  const plays = loadPlaybooks()
  return plays.map(p => ({ slug: p.slug }))
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const plays = loadPlaybooks()
  const play = plays.find(p => p.slug === slug)

  if (!play) notFound()

  const stageLabel = STAGE_LABELS[play.stage]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const displayBody = siteUrl
    ? play.body.replace(/\{\{sistema_url\}\}/g, siteUrl)
    : play.body
  const hasVariables = /\{\{(?!sistema_url\}\})[^}]+\}\}/.test(play.body)
  const exemplar = loadExemplar(slug)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5">
        <Link href="/playbooks" className="hover:text-gray-900">Playbook</Link>
        <span>/</span>
        <span className="text-gray-400">Stage {play.stage}: {stageLabel}</span>
        <span>/</span>
        <span className="text-gray-900">{play.title}</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          Stage {play.stage} — {stageLabel}
        </p>
        <h1 className="text-3xl font-bold mb-4">{play.title}</h1>
        {play.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {play.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {hasVariables ? (
        <PlayForm body={play.body} />
      ) : (
        <div className="mb-6">
          <CopyButton text={play.body} />
        </div>
      )}

      <div className="border border-gray-100 rounded-lg p-6 bg-gray-50">
        <MarkdownBody>{displayBody}</MarkdownBody>
      </div>

      {exemplar && <ExemplarPreview exemplar={exemplar} />}
    </main>
  )
}
