import Link from 'next/link'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { Logo } from '@/components/Logo'
import { SearchButton } from '@/components/search/SearchButton'

function countEntries(category: KBCategory): number {
  return listSystems(category).length
}

const CATEGORY_META: Record<KBCategory, {
  title: string
  description: string
  examples: string[]
  featured?: boolean
  href: string
}> = {
  'design-systems': {
    title: 'Design Systems',
    description: 'Reference docs from named production systems. Use these to understand how proven systems solve structural problems.',
    examples: ['Material Design 3', 'Carbon (IBM)', 'Atlassian', 'Primer (GitHub)', 'Ant Design'],
    href: '/kb/design-systems',
  },
  'standards': {
    title: 'Standards',
    description: 'Normative specifications. Use these when your output must satisfy a published standard.',
    examples: ['WCAG 2.2', 'ARIA APG', 'APCA', 'DESIGN.md spec'],
    href: '/kb/standards',
  },
  'foundations': {
    title: 'Foundations',
    description: 'Scientific and theoretical underpinnings. Use these to understand why design systems are structured the way they are.',
    examples: ['OKLCH perception', 'Type rhythm', 'Spacing theory'],
    href: '/kb/foundations',
  },
  'principles': {
    title: 'Principles',
    description: 'Cross-system synthesis. Frameworks for original work — primary references for plays.',
    examples: ['Positioning', 'Token architecture', 'Semantic layer design'],
    featured: true,
    href: '/kb/principles',
  },
}

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DesignSystemsIllustration() {
  return (
    <svg width="260" height="100" viewBox="0 0 260 100">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x={20 + i * 38} y={20 + (i % 2) * 8} width="32" height="60" rx="4" fill="white" stroke="#C9CFD6" />
      ))}
      <rect x="58" y="32" width="20" height="6" fill="#0070FF" />
      <rect x="58" y="44" width="16" height="4" fill="#E4E7EB" />
      <rect x="58" y="52" width="14" height="4" fill="#E4E7EB" />
      <rect x="134" y="36" width="20" height="6" fill="#FFCC33" />
      <rect x="134" y="48" width="16" height="4" fill="#E4E7EB" />
      <rect x="210" y="40" width="14" height="6" fill="#E60026" />
    </svg>
  )
}

function StandardsIllustration() {
  return (
    <svg width="260" height="100" viewBox="0 0 260 100">
      <rect x="60" y="14" width="140" height="72" rx="4" fill="white" stroke="#0E1116" />
      <rect x="76" y="28" width="60" height="4" fill="#0E1116" />
      <rect x="76" y="40" width="108" height="3" fill="#5B6470" />
      <rect x="76" y="48" width="92" height="3" fill="#5B6470" />
      <rect x="76" y="56" width="100" height="3" fill="#5B6470" />
      <rect x="76" y="64" width="40" height="3" fill="#5B6470" />
      <circle cx="186" cy="68" r="10" fill="#0E1116" />
      <path d="M181 68 l4 4 l7 -8" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function FoundationsIllustration() {
  return (
    <svg width="260" height="100" viewBox="0 0 260 100">
      <line x1="30" y1="80" x2="230" y2="80" stroke="#C9CFD6" />
      <line x1="30" y1="20" x2="30" y2="80" stroke="#C9CFD6" />
      <path d="M30 78 Q 80 70, 130 50 T 230 22" stroke="#FFCC33" strokeWidth="3" fill="none" />
      {[40, 70, 100, 130, 160, 190, 220].map((x, i) => (
        <circle key={i} cx={x} cy={78 - i * 8} r="3.5" fill="#0070FF" />
      ))}
      <text x="200" y="92" fontFamily="monospace" fontSize="9" fill="#5B6470">L*</text>
    </svg>
  )
}

function PrinciplesIllustration() {
  return (
    <svg width="260" height="100" viewBox="0 0 260 100">
      <g style={{ mixBlendMode: 'multiply' }}>
        <circle cx="110" cy="56" r="34" fill="#FFCC33" />
        <rect x="110" y="22" width="56" height="56" fill="#0070FF" />
        <polygon points="148,18 188,80 110,80" fill="#E60026" />
      </g>
      <text x="20" y="92" fontFamily="monospace" fontSize="9" fill="#5B6470">primary references — synthesized across systems</text>
    </svg>
  )
}

const ILLUSTRATIONS: Record<KBCategory, React.ReactNode> = {
  'design-systems': <DesignSystemsIllustration />,
  'standards': <StandardsIllustration />,
  'foundations': <FoundationsIllustration />,
  'principles': <PrinciplesIllustration />,
}

function CategoryCard({ category }: { category: KBCategory }) {
  const meta = CATEGORY_META[category]
  const count = countEntries(category)
  const illustration = ILLUSTRATIONS[category]

  return (
    <div
      className="flex flex-col md:flex-row border rounded-radius-lg overflow-hidden relative bg-surface group cursor-pointer"
      style={{ borderColor: meta.featured ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <Link
        href={meta.href}
        className="absolute inset-0 z-0"
        aria-label={`Browse ${meta.title}`}
      />

      {/* Illustration area */}
      <div
        className="flex items-center justify-center relative overflow-hidden border-b border-border md:border-b-0 md:border-r shrink-0 h-[120px] md:h-auto md:w-[220px]"
        style={{ background: 'var(--color-surface-sunken)' }}
      >
        {illustration}
        <div className="absolute top-3 left-3.5">
          <span className="font-mono text-[11px] text-on-surface-muted">
            {count > 0 ? `${count} entries` : 'coming soon'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-5 md:p-[22px] relative z-10 pointer-events-none">
        <div className="flex items-center gap-2.5 mb-1">
          <h2
            className="font-serif font-medium m-0 text-[22px] md:text-[26px]"
            style={{ letterSpacing: '-0.015em' }}
          >
            {meta.title}
          </h2>
          {meta.featured && (
            <span
              className="px-2 py-0.5 rounded font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase"
              style={{ background: 'var(--color-brand-yellow)', color: 'var(--color-on-surface)' }}
            >
              primary references
            </span>
          )}
        </div>

        <p className="text-[13.5px] leading-[1.5] text-on-surface-muted mb-3.5">
          {meta.description}
        </p>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {meta.examples.map(ex => (
            <span
              key={ex}
              className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted"
            >
              {ex}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-on-surface-muted group-hover:text-on-surface transition-colors">
          Browse {meta.title} <ArrowRight size={11} />
        </span>
      </div>
    </div>
  )
}

export default function KBLandingPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">
        {/* Header */}
        <div className="mb-9">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Knowledge Base · {KB_CATEGORIES.reduce((sum, cat) => sum + countEntries(cat), 0)} entries
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3 text-[26px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 820 }}
          >
            Reference material plays read so your agent doesn&apos;t guess.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0"
            style={{ maxWidth: 740, fontSize: 16, lineHeight: 1.55, fontVariationSettings: "'opsz' 32" }}
          >
            The KB is for agents, not for human reading. Browse it to understand what is grounded,
            then go back to a play — that&apos;s where it gets pulled in automatically.
          </p>
        </div>

        {/* Principles — primary references, separated above resources */}
        <div className="mb-8">
          <CategoryCard category="principles" />
        </div>

        {/* Reference sources section */}
        <div className="mb-3">
          <h2
            className="font-serif font-medium text-on-surface m-0 mb-1 text-[18px] md:text-[20px]"
            style={{ letterSpacing: '-0.01em' }}
          >
            Reference Sources
          </h2>
          <p className="text-[13px] text-on-surface-muted m-0" style={{ lineHeight: 1.5 }}>
            Named systems, specifications, and theoretical foundations. These are raw material — consulted for prior art and conformance, not synthesis.
          </p>
        </div>
        <div className="flex flex-col gap-[14px] mb-10">
          {(['design-systems', 'standards', 'foundations'] as const).map(category => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>

        {/* KB utility strip */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-radius-md border border-border bg-surface"
          style={{ padding: '16px 20px' }}
        >
          <Logo size={28} />
          <strong className="text-[13.5px] text-on-surface">Looking for a specific document, not a category?</strong>
          <div className="sm:ml-auto flex gap-2.5">
            <SearchButton className="inline-flex items-center h-[30px] px-3 text-[12.5px] font-medium border border-border rounded-radius-md text-on-surface bg-surface hover:bg-surface-sunken transition-colors">
              Search the Knowledge Base
            </SearchButton>
            <Link
              href="/playbooks"
              className="inline-flex items-center h-[30px] px-3 text-[12.5px] font-medium rounded-radius-md text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
            >
              Browse plays
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
