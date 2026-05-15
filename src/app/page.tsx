import Link from 'next/link'
import { loadPlaybooks } from '@/lib/playbooks'
import { Logo } from '@/components/Logo'
import { PromptBox } from '@/components/PromptBox'

function ArrowRight() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const QUICK_PLAYS = [
  {
    kind: 'campaign' as const,
    steps: 6,
    slug: null,
    href: '/campaigns/bootstrap',
    title: 'Bootstrap a Design System',
    desc: 'From positioning brief to a generated style dictionary, in six guided prompts.',
  },
  {
    kind: 'play' as const,
    stage: 2,
    slug: 'generate-color-scheme',
    href: '/playbooks/generate-color-scheme',
    title: 'Generate a Color Scheme',
    desc: 'OKLCH-grounded 19-stop palette from a single seed color.',
  },
  {
    kind: 'play' as const,
    stage: 6,
    slug: 'audit-token-coverage',
    href: '/playbooks/audit-token-coverage',
    title: 'Audit Token Coverage',
    desc: 'Find every hard-coded value that should be a token.',
  },
  {
    kind: 'play' as const,
    stage: 4,
    slug: 'scaffold-component-library',
    href: '/playbooks/scaffold-component-library',
    title: 'Scaffold a Component Library',
    desc: 'Generate the component spec set from your DESIGN.md.',
  },
]

const STAGE_CHIP_STYLES: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: '#E6F0FF', color: '#0058CC', border: '#BFD8FF' },
  2: { bg: '#E6F0FF', color: '#1056BF', border: '#BFD8FF' },
  3: { bg: '#F0E9FF', color: '#5325B8', border: '#D9C9FF' },
  4: { bg: '#E3F3EC', color: '#137A4D', border: '#BCE3CE' },
  5: { bg: '#FFF1E0', color: '#A65B00', border: '#FFD9A8' },
  6: { bg: '#FFF8E0', color: '#8A6500', border: '#F2DA8A' },
}

export default function Home() {
  const plays = loadPlaybooks()
  const positioningBrief = plays.find(p => p.slug === 'positioning-brief')

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-16 pb-20">
        {/* Hero */}
        <div className="mb-10 md:mb-14">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-border rounded-full bg-surface mb-5 md:mb-6">
            <span className="block w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[11.5px] tracking-[0.04em] text-on-surface-muted">
              grounded prompts for design-system work
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-medium text-on-surface m-0 text-[42px] md:text-[76px]"
            style={{
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              fontVariationSettings: "'opsz' 144, 'SOFT' 40",
              maxWidth: 920,
            }}
          >
            Your AI coding agent
            <br />
            needs better context.
            <br />
            <span className="relative inline-block">
              Here it is.
              <span
                className="absolute rounded-sm -z-10"
                style={{
                  left: -2,
                  right: -2,
                  bottom: 4,
                  height: 10,
                  background: 'var(--color-brand-yellow)',
                }}
              />
            </span>
          </h1>

          {/* Subhead */}
          <p
            className="mt-5 md:mt-7 text-on-surface-muted font-serif font-normal text-[16px] md:text-[19px]"
            style={{
              lineHeight: 1.55,
              maxWidth: 720,
              fontVariationSettings: "'opsz' 32",
            }}
          >
            Sistema packages production design-system references and ready-to-paste prompts —
            <em className="text-on-surface italic"> plays</em> — so Claude Code and Cursor generate
            tokens, components, and audits grounded in real systems instead of guessing.
          </p>
        </div>

        {/* Prompt showcase */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_280px]">
          {positioningBrief && (
            <PromptBox
              label="play · positioning-brief"
              body={positioningBrief.body}
              tokens="~640 tokens"
              refs="3 KB refs"
              variables={2}
            />
          )}

          <div className="flex flex-col gap-3">
            <div className="border border-border rounded-radius-lg p-4">
              <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2">
                This play
              </p>
              <p className="font-semibold text-[14px] text-on-surface mb-1">positioning-brief</p>
              <p className="text-[12.5px] text-on-surface-muted leading-[1.4]">
                Step 1 of <strong className="text-on-surface">Bootstrap a Design System</strong>.
                Drafts the opening section of your DESIGN.md.
              </p>
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                <span
                  className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
                  style={{
                    background: STAGE_CHIP_STYLES[1].bg,
                    color: STAGE_CHIP_STYLES[1].color,
                    borderColor: STAGE_CHIP_STYLES[1].border,
                  }}
                >
                  stage 1 · system
                </span>
                <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted">
                  positioning
                </span>
              </div>
            </div>

            <div className="border border-border rounded-radius-lg p-4">
              <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2">
                References pulled
              </p>
              <div className="flex flex-col gap-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="font-mono text-on-surface">principles/positioning</span>
                  <span className="text-on-surface-subtle">3.2k</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-on-surface">material/foundations</span>
                  <span className="text-on-surface-subtle">8.4k</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-on-surface">primer/principles</span>
                  <span className="text-on-surface-subtle">2.1k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-access row */}
        <div className="mt-10 md:mt-14">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-baseline gap-3.5">
              <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                Jump to a play
              </span>
              <span className="text-[13px] text-on-surface-muted">most-used this week</span>
            </div>
            <Link
              href="/playbooks"
              className="flex items-center gap-1.5 text-[13px] font-medium text-primary no-underline"
            >
              Browse all 18 plays <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_PLAYS.map(card => (
              <QuickCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4.5 mt-10 md:mt-12 text-[13px] text-on-surface-muted">
          <Logo size={20} />
          <span>Sistema is reference material for AI agents, not a tutorial for humans.</span>
          <div className="md:ml-auto flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-on-surface-subtle">v0.4 · public beta</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-on-surface-subtle" />
            <Link href="/guide" className="text-primary no-underline">
              How a play works →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

interface QuickCardProps {
  kind: 'campaign' | 'play'
  steps?: number
  stage?: number
  slug?: string | null
  href: string
  title: string
  desc: string
}

function QuickCard({ kind, steps, stage, href, title, desc }: QuickCardProps) {
  const isCampaign = kind === 'campaign'
  const stageStyle = stage ? STAGE_CHIP_STYLES[stage] : null

  return (
    <Link
      href={href}
      className="flex flex-col gap-2.5 p-4 rounded-radius-lg border no-underline relative"
      style={{
        borderColor: isCampaign ? 'var(--color-primary)' : 'var(--color-border)',
        background: isCampaign ? 'var(--color-primary)' : 'white',
        color: isCampaign ? 'white' : 'inherit',
        minHeight: 120,
        boxShadow: isCampaign
          ? '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.18)'
          : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        {isCampaign ? (
          <span
            className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
            style={{
              background: 'rgba(255,255,255,0.18)',
              borderColor: 'rgba(255,255,255,0.35)',
              color: 'white',
            }}
          >
            campaign · {steps} steps
          </span>
        ) : stageStyle ? (
          <span
            className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
            style={{
              background: stageStyle.bg,
              color: stageStyle.color,
              borderColor: stageStyle.border,
            }}
          >
            stage {stage}
          </span>
        ) : null}
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="font-semibold text-[14px] leading-[1.25] mt-0.5 m-0">{title}</p>

      <p
        className="text-[12px] leading-[1.45] m-0 grow"
        style={{ color: isCampaign ? 'rgba(255,255,255,0.82)' : 'var(--color-on-surface-muted)' }}
      >
        {desc}
      </p>

      {isCampaign && steps && (
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: steps }).map((_, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: 3,
                background: i === 0 ? 'var(--color-brand-yellow)' : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
        </div>
      )}
    </Link>
  )
}
