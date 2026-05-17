import type { Metadata } from 'next'
import Link from 'next/link'
import { Layers, ShieldCheck, FlaskConical, Bot, Compass } from 'lucide-react'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { Logo } from '@/components/Logo'
import { SearchButton } from '@/components/search/SearchButton'

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description:
    'Reference material from Material Design, Carbon, Atlassian, Primer, and more — grounded context for AI-assisted design system work.',
}

function countEntries(category: KBCategory): number {
  return listSystems(category).length
}

type CategoryIcon = React.ComponentType<{ size?: number; className?: string }>

const CATEGORY_META: Record<KBCategory, {
  title: string
  description: string
  examples: string[]
  featured?: boolean
  href: string
  icon: CategoryIcon
}> = {
  'design-systems': {
    title: 'Design Systems',
    description: 'Reference docs from named production systems. Use these to understand how proven systems solve structural problems.',
    examples: ['Material Design 3', 'Carbon (IBM)', 'Atlassian', 'Primer (GitHub)', 'Ant Design'],
    href: '/kb/design-systems',
    icon: Layers,
  },
  'standards': {
    title: 'Standards',
    description: 'Normative specifications. Use these when your output must satisfy a published standard.',
    examples: ['WCAG 2.2', 'ARIA APG', 'APCA', 'DESIGN.md spec'],
    href: '/kb/standards',
    icon: ShieldCheck,
  },
  'foundations': {
    title: 'Foundations',
    description: 'Scientific and theoretical underpinnings. Use these to understand why design systems are structured the way they are.',
    examples: ['OKLCH perception', 'Type rhythm', 'Spacing theory'],
    href: '/kb/foundations',
    icon: FlaskConical,
  },
  'skills': {
    title: 'Agent Skills',
    description: 'Open-source design skills for AI coding agents — reviewed for license compatibility and synthesized into Sistema\'s principles.',
    examples: ['Impeccable', 'Anthropic frontend-design', 'designer-skills'],
    href: '/kb/skills',
    icon: Bot,
  },
  'principles': {
    title: 'Principles',
    description: 'Cross-system synthesis. Frameworks for original work — primary references for plays.',
    examples: ['Positioning', 'Token architecture', 'Semantic layer design'],
    featured: true,
    href: '/kb/principles',
    icon: Compass,
  },
}

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CategoryCard({ category }: { category: KBCategory }) {
  const meta = CATEGORY_META[category]
  const count = countEntries(category)
  const Icon = meta.icon

  return (
    <div
      className="relative border rounded-radius-lg bg-surface group cursor-pointer"
      style={{ borderColor: meta.featured ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <Link
        href={meta.href}
        className="absolute inset-0 z-0"
        aria-label={`Browse ${meta.title}`}
      />

      <div className="p-5 md:p-[22px] relative z-10 pointer-events-none">
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-2">
          <Icon
            size={18}
            className={meta.featured ? 'text-primary shrink-0' : 'text-on-surface-muted shrink-0'}
          />
          <h2
            className="font-serif font-medium m-0 text-[20px] md:text-[22px] leading-none"
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
          <span className="ml-auto font-mono text-[11px] text-on-surface-subtle shrink-0">
            {count > 0 ? `${count} entries` : 'coming soon'}
          </span>
        </div>

        <p className="text-[13.5px] leading-[1.5] text-on-surface-muted mb-3.5 pl-[26px]">
          {meta.description}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap pl-[26px]">
          {meta.examples.map(ex => (
            <span
              key={ex}
              className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted"
            >
              {ex}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-medium text-on-surface-muted group-hover:text-on-surface transition-colors shrink-0">
            Browse {meta.title} <ArrowRight size={11} />
          </span>
        </div>
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
            The reference your plays use, so your agent doesn&apos;t guess.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0"
            style={{ maxWidth: 740, fontSize: 16, lineHeight: 1.55, fontVariationSettings: "'opsz' 32" }}
          >
            Every play pulls from this Knowledge Base at runtime. Browse by category to see what&apos;s covered,
            or search for a specific document.
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
        <div className="flex flex-col gap-[10px] mb-10">
          {(['design-systems', 'standards', 'foundations', 'skills'] as const).map(category => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>

        {/* Sources callout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-radius-md border border-border bg-surface-sunken px-5 py-4 mb-5">
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-on-surface mb-0.5">Knowledge Base sources</p>
            <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.45]">
              This Knowledge Base is built from publicly available documentation: Material Design, Carbon, Atlassian, Ant Design, Radix, Primer, W3C, Shopify Polaris, MailChimp, and more.
            </p>
          </div>
          <Link
            href="/sources"
            className="inline-flex items-center gap-1.5 h-[30px] px-3 text-[12.5px] font-medium border border-border rounded-radius-md text-on-surface bg-surface hover:bg-surface-sunken transition-colors no-underline shrink-0"
          >
            View all sources
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* KB utility strip */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-radius-md border border-border bg-surface"
          style={{ padding: '16px 20px' }}
        >
          <Logo size={28} />
          <strong className="text-[13.5px] text-on-surface">Find a specific document</strong>
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
