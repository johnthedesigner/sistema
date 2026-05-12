import Link from 'next/link'
import { loadPlaybooks, loadCategories } from '@/lib/playbooks'
import { TierBadge } from '@/components/playbooks/TierBadge'

export default function PlaybooksPage() {
  const plays = loadPlaybooks()
  const categories = loadCategories()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Task Playbooks</h1>
      <p className="text-gray-500 mb-10">
        Structured instructions for using the knowledge base to complete common design system tasks.
      </p>

      {categories.map(cat => {
        const catPlays = plays.filter(p => p.categoryNumber === cat.number)
        return (
          <section key={cat.number} className="mb-12">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Category {cat.number}: {cat.name}
            </h2>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {catPlays.map(play => (
                <li key={play.id}>
                  <Link
                    href={`/playbooks/${play.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{play.id}</span>
                      <span className="font-medium text-gray-900 group-hover:text-black truncate">
                        {play.title}
                      </span>
                    </div>
                    <TierBadge tier={play.tier} />
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
