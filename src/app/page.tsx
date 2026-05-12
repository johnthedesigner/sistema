import { listSystems } from '@/lib/kb'
import { loadPlaybooks } from '@/lib/playbooks'

export default function Home() {
  const systems = listSystems()
  const plays = loadPlaybooks()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Sistema</h1>
      <p className="mt-2 text-gray-600">Design system knowledge base — coming soon.</p>
      <p className="mt-4 text-sm text-gray-400">
        {systems.length} system{systems.length !== 1 ? 's' : ''} · {plays.length} playbook{plays.length !== 1 ? 's' : ''}
      </p>
    </main>
  )
}
