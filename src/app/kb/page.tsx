import Link from 'next/link'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'

const CATEGORY_META: Record<KBCategory, {
  title: string
  description: string
  purpose: string
  href: string
}> = {
  'design-systems': {
    title: 'Design Systems',
    description: 'For imitation.',
    purpose: 'Reference major open-source systems — Material, Carbon, Atlassian, Primer, and more — to replicate proven patterns, token architectures, and component conventions in your own work.',
    href: '/kb/design-systems',
  },
  'standards': {
    title: 'Standards',
    description: 'For compliance.',
    purpose: 'Normative reference material you cite rather than interpret: WCAG 2.2, ARIA Authoring Practices, APCA. Use these when your output needs to satisfy a published specification.',
    href: '/kb/standards',
  },
  'foundations': {
    title: 'Foundations',
    description: 'For first-principles reasoning.',
    purpose: 'Conceptual and scientific background explaining why design tokens work the way they do — color science, typography fundamentals, spacing theory. Use these when you need to reason from first principles, not just copy a pattern.',
    href: '/kb/foundations',
  },
}

export default function KBLandingPage() {
  const designSystemCount = listSystems('design-systems').length

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">Knowledge Base</h1>
      <p className="text-gray-500 mb-12 max-w-2xl">
        Structured reference material for building design systems with AI coding tools.
        Three sections — each with a different relationship to the material.
      </p>

      <div className="space-y-4">
        {KB_CATEGORIES.map(category => {
          const meta = CATEGORY_META[category]
          const count = category === 'design-systems' ? designSystemCount : 0
          const isEmpty = count === 0

          return (
            <Link
              key={category}
              href={meta.href}
              className="block border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-lg font-semibold">{meta.title}</h2>
                <span className="text-sm text-gray-400">
                  {isEmpty ? 'Coming soon' : `${count} ${count === 1 ? 'entry' : 'entries'}`}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{meta.description}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{meta.purpose}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
