import Link from 'next/link'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { Logo } from '@/components/Logo'

function countEntries(category: KBCategory): number {
  return listSystems(category).length
}

const CATEGORY_META: Record<KBCategory, {
  title: string
  purpose: string
  purposeLabel: string
  description: string
  examples: string[]
  playLink: string
  playSlug: string
  accent: string
  featured?: boolean
  href: string
}> = {
  'design-systems': {
    title: 'Design Systems',
    purposeLabel: 'for imitation',
    purpose: 'for imitation',
    description: 'Reference docs from named production systems. Use these to understand how proven systems solve structural problems.',
    examples: ['Material Design 3', 'Carbon (IBM)', 'Atlassian', 'Primer (GitHub)', 'Ant Design'],
    playLink: 'generate-color-scheme',
    playSlug: 'generate-color-scheme',
    accent: '#0070FF',
    href: '/kb/design-systems',
  },
  'standards': {
    title: 'Standards',
    purposeLabel: 'for conformance',
    purpose: 'for conformance',
    description: 'Normative specifications. Use these when your output must satisfy a published standard.',
    examples: ['WCAG 2.2', 'ARIA APG', 'APCA', 'DESIGN.md spec'],
    playLink: 'accessibility-audit',
    playSlug: 'accessibility-audit',
    accent: '#0E1116',
    href: '/kb/standards',
  },
  'foundations': {
    title: 'Foundations',
    purposeLabel: 'for first-principles reasoning',
    purpose: 'for first-principles reasoning',
    description: 'Scientific and theoretical underpinnings. Use these to understand why design systems are structured the way they are.',
    examples: ['OKLCH perception', 'Type rhythm', 'Spacing theory'],
    playLink: 'generate-type-scale',
    playSlug: 'generate-type-scale',
    accent: '#FFCC33',
    href: '/kb/foundations',
  },
  'principles': {
    title: 'Principles',
    purposeLabel: 'for building something new',
    purpose: 'for building something new',
    description: 'Cross-system synthesis. Frameworks for original work — primary references for plays.',
    examples: ['Positioning', 'Token architecture', 'Semantic layer design'],
    playLink: 'positioning-brief',
    playSlug: 'positioning-brief',
    accent: '#E60026',
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

// Abstract geometric SVG illustrations per category
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

export default function KBLandingPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-10 pt-12 pb-20">
        {/* Header */}
        <div className="mb-9">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Knowledge Base · {KB_CATEGORIES.reduce((sum, cat) => sum + countEntries(cat), 0)} entries
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3"
            style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 820 }}
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

        {/* Category cards */}
        <div className="grid gap-4.5 mb-10" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {KB_CATEGORIES.map(category => {
            const meta = CATEGORY_META[category]
            const count = countEntries(category)
            const illustration = ILLUSTRATIONS[category]

            return (
              <div
                key={category}
                className="border rounded-radius-lg overflow-hidden relative bg-surface"
                style={{ borderColor: meta.featured ? 'var(--color-primary)' : 'var(--color-border)' }}
              >
                {/* Illustration area */}
                <div
                  className="flex items-center justify-center relative overflow-hidden border-b border-border"
                  style={{ height: 140, background: 'linear-gradient(180deg, #FCFCFB 0%, #F4F5F4 100%)' }}
                >
                  {illustration}
                  <div className="absolute top-3 left-3.5 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-on-surface-muted">
                      {count > 0 ? `${count} entries` : 'coming soon'}
                    </span>
                  </div>
                  {meta.featured && (
                    <div
                      className="absolute top-3 right-3.5 px-2 py-0.5 rounded font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase"
                      style={{ background: 'var(--color-brand-yellow)', color: '#0E1116' }}
                    >
                      primary references
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-[22px]">
                  <div className="flex items-baseline gap-2.5 mb-1">
                    <h2
                      className="font-serif font-medium m-0"
                      style={{ fontSize: 26, letterSpacing: '-0.015em' }}
                    >
                      {meta.title}
                    </h2>
                    <span
                      className="font-serif italic text-[11.5px]"
                      style={{ color: meta.accent }}
                    >
                      &ldquo;{meta.purposeLabel}&rdquo;
                    </span>
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

                  <div className="flex items-center justify-between">
                    <Link
                      href={meta.href}
                      className="inline-flex items-center h-[30px] px-3 text-[12.5px] font-medium border border-border rounded-radius-md text-on-surface no-underline hover:bg-surface-sunken transition-colors"
                    >
                      Browse {meta.title}
                    </Link>
                    <Link
                      href={`/playbooks/${meta.playSlug}`}
                      className="flex items-center gap-1.5 text-[12.5px] font-medium text-primary no-underline"
                    >
                      Go to{' '}
                      <span
                        className="font-mono text-[11.5px] px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--color-brand-blue-50)' }}
                      >
                        {meta.playLink}
                      </span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom strip */}
        <div
          className="flex items-center gap-4.5 px-5 py-4.5 rounded-radius-md border border-border bg-surface"
          style={{ gap: 18, padding: '18px 22px' }}
        >
          <Logo size={28} />
          <div className="text-[13.5px] text-on-surface leading-[1.4]">
            <strong>Looking for a specific document, not a category?</strong>
            <span className="text-on-surface-muted ml-2">
              Search every KB entry, or jump straight to the play that pulls it in.
            </span>
          </div>
          <div className="ml-auto flex gap-2.5">
            <button className="inline-flex items-center h-[30px] px-3 text-[12.5px] font-medium border border-border rounded-radius-md text-on-surface bg-surface hover:bg-surface-sunken transition-colors">
              Search KB
            </button>
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
