import Link from 'next/link'
import { listSystems, readSystemIndex } from '@/lib/kb'
import { loadPlaybooks, loadStages } from '@/lib/playbooks'

function extractSystemName(body: string): string {
  const match = body.match(/^# (.+)$/m)
  if (!match) return 'Unknown System'
  return match[1].replace(/ — System Index$/, '').trim()
}

export default function Home() {
  const systemSlugs = listSystems()
  const plays = loadPlaybooks()
  const stages = loadStages()

  const systems = systemSlugs.map(slug => {
    const index = readSystemIndex(slug)
    return { slug, name: extractSystemName(index.body) }
  })

  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-5 max-w-2xl">
          Design system knowledge, structured for AI coding tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-4">
          Sistema is a versioned knowledge base of how production design systems handle color, typography, tokens, and components — plus a library of prompt starters that put that knowledge to work.
        </p>
        <p className="text-base text-gray-500 max-w-2xl mb-10">
          When you ask an AI coding agent to generate design system artifacts, the output is only as good as what it knows. Sistema gives it something real to reference.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/playbooks"
            className="inline-flex items-center px-5 py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Open playbook
          </Link>
          <Link
            href="/kb"
            className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Browse knowledge base
          </Link>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* How to use it */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">How to use it</h2>
        <p className="text-gray-500 mb-10 max-w-xl">
          Each play in the playbook is a complete prompt you paste into your coding agent. The agent fetches reference material from this knowledge base before generating — so the output is grounded in documented, production-tested decisions.
        </p>

        <ol className="space-y-8 max-w-2xl">
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-sm font-medium flex items-center justify-center mt-0.5">1</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Find the play that matches your task</p>
              <p className="text-gray-500 text-sm">Plays are ordered by build stage — foundations first, components last. If you are starting a new system, begin at Stage 1. If you have tokens already, jump to Stage 4.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-sm font-medium flex items-center justify-center mt-0.5">2</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Copy and paste into your coding agent</p>
              <p className="text-gray-500 text-sm">The play text is ready to paste. Fill in the bracketed context fields — your brand color, tech stack, or existing code — then send.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-sm font-medium flex items-center justify-center mt-0.5">3</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">The agent fetches reference material and generates</p>
              <p className="text-gray-500 text-sm">Each play tells the agent which Sistema pages to read first. It loads the relevant guidance and token values, then generates output that follows the same structural decisions as the reference system — not a generic approximation.</p>
            </div>
          </li>
        </ol>

        {/* Concrete example */}
        <div className="mt-12 border border-gray-100 rounded-lg overflow-hidden max-w-2xl">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Example</p>
          </div>
          <div className="px-5 py-4 text-sm text-gray-600 space-y-2">
            <p>Copy the <strong className="text-gray-800">Generate a Primitive Color Palette</strong> play. Paste it into Claude Code with your brand color.</p>
            <p>The agent reads Material Design 3&apos;s color system overview and token values from Sistema, then generates a primitive palette in the same format — the same step scale, the same neutral-variant structure, the same JSON shape — with your hues substituted in.</p>
            <p>The result is something you can commit and build on, not something you need to restructure first.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* What's available */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">What&apos;s available</h2>
        <p className="text-gray-500 mb-10">The knowledge base and playbook grow as new systems are documented and new plays are validated.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Systems card */}
          <Link
            href="/kb"
            className="group border border-gray-100 rounded-lg p-6 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Knowledge base</h3>
              <span className="text-sm text-gray-400">{systems.length} system{systems.length !== 1 ? 's' : ''}</span>
            </div>
            <ul className="space-y-1 mb-4">
              {systems.map(s => (
                <li key={s.slug} className="text-sm text-gray-600">{s.name}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
              Guidance, implementation docs, and token values — all versioned and browsable →
            </p>
          </Link>

          {/* Playbook card */}
          <Link
            href="/playbooks"
            className="group border border-gray-100 rounded-lg p-6 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Playbook</h3>
              <span className="text-sm text-gray-400">{plays.length} plays</span>
            </div>
            <ul className="space-y-1 mb-4">
              {stages.map(({ stage, label }) => (
                <li key={stage} className="text-sm text-gray-600">
                  <span className="text-gray-400 font-mono text-xs mr-2">{stage}</span>
                  {label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
              Prompt starters ordered by build stage — foundations to components →
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}
