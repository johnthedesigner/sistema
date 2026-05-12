import Link from 'next/link'
import { loadPlaybooks, loadStages } from '@/lib/playbooks'

export default function PlaybooksPage() {
  const plays = loadPlaybooks()
  const stages = loadStages()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Playbook</h1>
      <p className="text-gray-500 mb-2">
        Prompt starters for agentic design system work. Copy a play and paste it into your coding agent — each one fetches relevant reference material from this knowledge base before generating.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        Plays are ordered by stage: foundations first, components last. Building in order means each play has what it needs.
      </p>

      {stages.map(({ stage, label }) => {
        const stagePlays = plays.filter(p => p.stage === stage)
        return (
          <section key={stage} className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xs font-mono text-gray-400">Stage {stage}</span>
              <h2 className="text-base font-semibold text-gray-700">{label}</h2>
            </div>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {stagePlays.map(play => (
                <li key={play.slug}>
                  <Link
                    href={`/playbooks/${play.slug}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-black">
                      {play.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {play.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded hidden sm:inline"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-gray-300 text-sm">→</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
