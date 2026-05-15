import Link from 'next/link'
import { loadPlaybooks, loadStages, STAGE_LABELS } from '@/lib/playbooks'
import { loadCampaigns } from '@/lib/campaigns'

const STAGE_CHIP_STYLES: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: '#E6F0FF', color: '#0058CC', border: '#BFD8FF' },
  2: { bg: '#E6F0FF', color: '#1056BF', border: '#BFD8FF' },
  3: { bg: '#F0E9FF', color: '#5325B8', border: '#D9C9FF' },
  4: { bg: '#E3F3EC', color: '#137A4D', border: '#BCE3CE' },
  5: { bg: '#FFF1E0', color: '#A65B00', border: '#FFD9A8' },
  6: { bg: '#FFF8E0', color: '#8A6500', border: '#F2DA8A' },
}

const CAMPAIGN_TONES: Record<number, { bg: string; dim: string; body: string; chipBg: string; chipBd: string; stepBd: string; stepActiveBd: string; stepActiveBg: string }> = {
  0: {
    bg: '#0070FF',
    dim: 'rgba(255,255,255,0.55)',
    body: 'rgba(255,255,255,0.85)',
    chipBg: 'rgba(255,255,255,0.18)',
    chipBd: 'rgba(255,255,255,0.34)',
    stepBd: 'rgba(255,255,255,0.22)',
    stepActiveBd: 'rgba(255,255,255,0.55)',
    stepActiveBg: 'rgba(255,255,255,0.18)',
  },
  1: {
    bg: '#790083',
    dim: 'rgba(255,255,255,0.55)',
    body: 'rgba(255,255,255,0.85)',
    chipBg: 'rgba(255,255,255,0.16)',
    chipBd: 'rgba(255,255,255,0.30)',
    stepBd: 'rgba(255,255,255,0.20)',
    stepActiveBd: 'rgba(255,255,255,0.45)',
    stepActiveBg: 'rgba(255,255,255,0.16)',
  },
}

const PLAY_OUTPUTS: Record<string, string> = {
  'positioning-brief': 'A DESIGN.md positioning section',
  'generate-design-md': 'A full DESIGN.md scaffold',
  'generate-color-scheme': '19-stop OKLCH palette from seed',
  'generate-type-scale': 'Modular type scale w/ leading',
  'generate-shape-tokens': 'Radius + elevation + border set',
  'generate-color-roles': 'Semantic role mapping',
  'generate-dark-mode': 'Dark-mode role overrides',
  'generate-style-dictionary': 'Style Dictionary v5 source JSON',
  'specify-component': 'Component spec (states, anatomy)',
  'implement-component': 'React + tokens implementation',
  'scaffold-component-library': 'Library skeleton from DESIGN.md',
  'migrate-tailwind-tokens': 'Tailwind theme → Style Dict.',
  'audit-component': 'Component conformance report',
  'session-start': 'Catch-up brief for the agent',
  'add-component': 'New component to existing system',
  'audit-token-coverage': 'Hard-coded values report',
  'accessibility-audit': 'WCAG 2.2 + APCA findings',
  'design-system-retrospective': "What worked, what didn't",
  'plan-next-iteration': 'Prioritized backlog for next q.',
}

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PlaysPage() {
  const plays = loadPlaybooks()
  const campaigns = loadCampaigns()
  const stages = loadStages()

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">
        {/* Page head */}
        <div className="mb-8">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Plays · {plays.length} single · {campaigns.length} featured
          </p>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
            <h1
              className="font-serif font-medium text-on-surface m-0 text-[28px] md:text-[36px]"
              style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Ready-to-paste prompts, grounded in real systems.
            </h1>
            {/* <div className="flex gap-2 items-center flex-wrap shrink-0">
              {['All', 'Tokens', 'Components', 'Audit', 'A11y'].map((label, i) => (
                <button
                  key={label}
                  className="h-[30px] px-3 text-[12.5px] font-medium rounded-full border cursor-pointer"
                  style={{
                    border: `1px solid ${i === 0 ? 'var(--color-on-surface)' : 'var(--color-border)'}`,
                    background: i === 0 ? 'var(--color-on-surface)' : 'white',
                    color: i === 0 ? 'white' : 'var(--color-on-surface)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div> */}
          </div>
        </div>

        {/* Featured plays */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-serif font-medium m-0" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>
              Featured plays
            </h2>
            <span className="text-[13px] text-on-surface-muted">
              multi-step plays that cover a complete arc.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {campaigns.map((campaign, idx) => {
            const tone = CAMPAIGN_TONES[idx % 2]
            return (
              <Link
                key={campaign.slug}
                href={`/campaigns/${campaign.slug}`}
                className="block rounded-radius-lg p-5 md:p-6 relative overflow-hidden no-underline"
                style={{ background: tone.bg, color: 'white' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
                    style={{ background: tone.chipBg, borderColor: tone.chipBd, color: 'white' }}
                  >
                    featured · {campaign.steps.length} steps
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: tone.dim }}>
                    ~{campaign.steps.length * 4} min
                  </span>
                </div>

                <h3
                  className="font-serif font-medium m-0 mb-2.5 text-[22px] md:text-[26px]"
                  style={{ lineHeight: 1.1, letterSpacing: '-0.015em' }}
                >
                  {campaign.title}
                </h3>

                <p
                  className="text-[13.5px] leading-[1.5] m-0 mb-5"
                  style={{ color: tone.body, maxWidth: 460 }}
                >
                  {campaign.description}
                </p>

                {/* Step sequence — hidden on small screens, shown on md+ */}
                <div className="hidden md:flex items-center gap-1.5 mb-5">
                  {campaign.steps.map((step, i) => (
                    <div key={step.playSlug} className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div
                        className="flex-1 px-2 py-[7px] rounded-[6px] border min-w-0"
                        style={{
                          borderColor: i === 0 ? tone.stepActiveBd : tone.stepBd,
                          background: i === 0 ? tone.stepActiveBg : 'rgba(255,255,255,0.04)',
                        }}
                      >
                        <p className="font-mono m-0 mb-0.5" style={{ fontSize: 9.5, color: tone.dim }}>
                          STEP {i + 1}
                        </p>
                        <p
                          className="font-mono m-0 truncate"
                          style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.95)' }}
                        >
                          {step.playSlug}
                        </p>
                      </div>
                      {i < campaign.steps.length - 1 && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile: simple step pill row */}
                <div className="flex md:hidden gap-1 mb-5 overflow-x-auto pb-1">
                  {campaign.steps.map((step, i) => (
                    <span
                      key={step.playSlug}
                      className="inline-flex items-center shrink-0 px-2 h-[22px] rounded font-mono text-[10px]"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {i + 1}. {step.playSlug}
                    </span>
                  ))}
                </div>

                <span
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-radius-md text-[13.5px] font-semibold"
                  style={{ background: 'white', color: tone.bg }}
                >
                  Open <ArrowRight size={14} />
                </span>
              </Link>
            )
          })}
        </div>

        {/* Single plays by stage */}
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>
            Plays <span className='font-mono text-[12.5px] text-on-surface-muted'>(by design system stage)</span>
          </h2>
          <span className="font-mono text-[11.5px] text-on-surface-subtle hidden md:inline">
            by stage · foundations → stewardship
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {stages.map(({ stage }) => {
            const stagePlays = plays.filter(p => p.stage === stage)
            const style = STAGE_CHIP_STYLES[stage]
            const label = STAGE_LABELS[stage] ?? `Stage ${stage}`
            return (
              <div key={stage}>
                {/* Stage header */}
                <div className="flex items-center gap-3.5 mb-3">
                  <span
                    className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
                    style={{ background: style.bg, color: style.color, borderColor: style.border }}
                  >
                    stage {stage} — {label}
                  </span>
                  {/* <h3 className="text-[14.5px] font-semibold text-on-surface m-0">{label}</h3> */}
                  <span className="text-[12.5px] text-on-surface-muted">
                    {stagePlays.length} {stagePlays.length === 1 ? 'play' : 'plays'}
                  </span>
                  <div className="flex-1 h-px bg-border hidden md:block" />
                </div>

                {/* Play cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {stagePlays.map(play => (
                    <Link
                      key={play.slug}
                      href={`/playbooks/${play.slug}`}
                      className="block border border-border rounded-radius-lg p-4 no-underline hover:border-border-strong transition-colors bg-surface-sunken relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
                          style={{ background: style.bg, color: style.color, borderColor: style.border }}
                        >
                          stage {stage}
                        </span>
                        <ArrowRight size={13} />
                      </div>
                      <p className="font-mono text-[11.5px] font-medium text-on-surface-subtle m-0">
                        {play.slug}
                      </p>
                      <p className="font-serif text-[24px] font-medium leading-[1.2] text-on-surface m-0 mb-3">
                        {play.title}
                      </p>
                      <p className="text-[13.5px] text-on-surface-muted m-0 mb-3 leading-[1.45]">
                        {PLAY_OUTPUTS[play.slug] ?? play.title}
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {play.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
