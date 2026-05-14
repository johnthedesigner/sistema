import Link from 'next/link'
import { loadPlaybooks, loadStages, STAGE_DESCRIPTIONS } from '@/lib/playbooks'

export default function PlaybooksPage() {
  const plays = loadPlaybooks()
  const stages = loadStages()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">Playbook</h1>
      <p className="text-on-surface-muted mb-10 max-w-2xl">
        Prompt starters for agentic design system work. Plays are grouped by stage — build in order so each play has what it needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map(({ stage, label }) => {
          const count = plays.filter(p => p.stage === stage).length
          const description = STAGE_DESCRIPTIONS[stage] ?? ''
          return (
            <Link
              key={stage}
              href={`/playbooks/stage/${stage}`}
              className="block border border-border rounded-radius-lg p-6 hover:border-on-surface-muted hover:shadow-sm transition-all"
            >
              <p className="text-xs font-mono text-on-surface-muted mb-1">Stage {stage}</p>
              <h2 className="text-base font-semibold text-on-surface mb-2">{label}</h2>
              <p className="text-sm text-on-surface-muted leading-relaxed mb-4">{description}</p>
              <p className="text-xs text-on-surface-muted">{count} {count === 1 ? 'play' : 'plays'}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
