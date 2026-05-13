import Link from 'next/link'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'

function countEntries(category: KBCategory): number {
  return listSystems(category).length
}

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
    description: 'For conformance.',
    purpose: 'Authoritative format specifications and normative standards you conform to: WCAG 2.2, ARIA Authoring Practices, APCA, DESIGN.md. Use these when your output needs to satisfy a published specification or format.',
    href: '/kb/standards',
  },
  'foundations': {
    title: 'Foundations',
    description: 'For first-principles reasoning.',
    purpose: 'Scientific and theoretical underpinnings of design: perceptual color models, typography science, spacing theory. Use these when you need to reason from first principles about why design systems are structured the way they are.',
    href: '/kb/foundations',
  },
  'principles': {
    title: 'Principles',
    description: 'For building something new.',
    purpose: 'Cross-system synthesis documents that distill what good looks like across all reference systems. Use these as the foundation for building original, professional-quality design systems — not as templates to copy.',
    href: '/kb/principles',
  },
}

export default function KBLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">Knowledge Base</h1>
      <p className="text-gray-500 mb-12 max-w-2xl">
        Structured reference material for building design systems with AI coding tools.
        Four sections — each with a different relationship to the material.
      </p>

      <div className="space-y-4">
        {KB_CATEGORIES.map(category => {
          const meta = CATEGORY_META[category]
          const count = countEntries(category)
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
