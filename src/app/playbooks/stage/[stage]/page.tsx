import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPlaybooks, loadStages, STAGE_LABELS, STAGE_DESCRIPTIONS } from '@/lib/playbooks'

export async function generateStaticParams() {
  const stages = loadStages()
  return stages.map(({ stage }) => ({ stage: String(stage) }))
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>
}) {
  const { stage: stageParam } = await params
  const stageNum = parseInt(stageParam, 10)
  if (isNaN(stageNum)) notFound()

  const label = STAGE_LABELS[stageNum]
  if (!label) notFound()

  const description = STAGE_DESCRIPTIONS[stageNum] ?? ''
  const plays = loadPlaybooks().filter(p => p.stage === stageNum)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-sm text-on-surface-muted mb-8 flex items-center gap-1.5">
        <Link href="/playbooks" className="hover:text-on-surface">Playbook</Link>
        <span>/</span>
        <span className="text-on-surface">Stage {stageNum}: {label}</span>
      </nav>

      <p className="text-xs font-mono text-on-surface-muted mb-1">Stage {stageNum}</p>
      <h1 className="text-3xl font-bold mb-3">{label}</h1>
      <p className="text-on-surface-muted mb-10 max-w-2xl">{description}</p>

      <ul className="divide-y divide-border border border-border rounded-radius-lg overflow-hidden">
        {plays.map(play => (
          <li key={play.slug}>
            <Link
              href={`/playbooks/${play.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface transition-colors group"
            >
              <span className="font-medium text-on-surface group-hover:text-on-surface">
                {play.title}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {play.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-on-surface-muted bg-surface px-2 py-0.5 rounded-radius-sm hidden sm:inline"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-on-surface-muted text-sm">→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
