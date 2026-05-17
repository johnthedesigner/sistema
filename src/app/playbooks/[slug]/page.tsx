import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPlaybooks, STAGE_LABELS } from '@/lib/playbooks'
import { loadCampaigns } from '@/lib/campaigns'
import { loadExemplars } from '@/lib/exemplars'
import { PlayDetail } from '@/components/playbooks/PlayDetail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const plays = loadPlaybooks()
  const play = plays.find(p => p.slug === slug)
  if (!play) return {}
  const description = PLAY_DESCRIPTIONS[slug] ?? play.title
  return {
    title: play.title,
    description,
    openGraph: { title: play.title, description },
  }
}

const PLAY_DESCRIPTIONS: Record<string, string> = {
  'positioning-brief': 'Produces the positioning brief section of your DESIGN.md — what the system is for, who it serves, and the three decisions that define its character.',
  'generate-design-md': 'Generates a complete DESIGN.md scaffold from your positioning brief, ready to commit and use as agent context.',
  'generate-color-scheme': 'Produces a perceptually-uniform 19-stop palette in OKLCH from a single seed color. Outputs hex previews, contrast targets, and a rationale per stop.',
  'generate-type-scale': 'Generates a modular type scale with optical sizing, line-height, and letter-spacing values matched to your system\'s density and brand stance.',
  'generate-shape-tokens': 'Produces a complete shape token set — border radii, elevation, and border width — calibrated to your system\'s character.',
  'generate-color-roles': 'Maps your primitive color palette to semantic roles: surface, on-surface, primary, error, and all their variants.',
  'generate-dark-mode': 'Generates dark-mode role overrides that maintain perceptual contrast and brand coherence across both themes.',
  'generate-style-dictionary': 'Exports your token set as Style Dictionary v5 source JSON, ready for multi-platform build pipelines.',
  'specify-component': 'Produces a component specification covering states, anatomy, token mappings, and accessibility requirements.',
  'implement-component': 'Implements a specified component in React using your token classes, following the patterns in your DESIGN.md.',
  'scaffold-component-library': 'Generates the full component spec set from your DESIGN.md — names, states, and anatomy for every component in scope.',
  'migrate-tailwind-tokens': 'Migrates a Tailwind v3 color config to your Style Dictionary token source, preserving stop names and adding semantic roles.',
  'audit-component': 'Produces a conformance report for an existing component — checking token usage, states, accessibility, and DESIGN.md alignment.',
  'session-start': 'Generates a catch-up brief for your agent at the start of a new session, loading the current state of DESIGN.md and open decisions.',
  'add-component': 'Adds a new component to an existing system — spec, implementation, and token mappings — following the patterns already established.',
  'audit-token-coverage': 'Finds every hard-coded value in your codebase that should be a token, grouped by token category.',
  'accessibility-audit': 'Produces WCAG 2.2 and APCA findings for your current token set, with specific remediation recommendations.',
  'design-system-retrospective': 'Facilitates a structured retrospective on the current iteration — what worked, what didn\'t, and what changed from the original intent.',
  'plan-next-iteration': 'Produces a prioritized backlog for the next design system iteration, grounded in the retrospective and the current DESIGN.md.',
}

const STAGE_CHIP_STYLES: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: 'var(--stage-1-bg)', color: 'var(--stage-1-text)', border: 'var(--stage-1-border)' },
  2: { bg: 'var(--stage-2-bg)', color: 'var(--stage-2-text)', border: 'var(--stage-2-border)' },
  3: { bg: 'var(--stage-3-bg)', color: 'var(--stage-3-text)', border: 'var(--stage-3-border)' },
  4: { bg: 'var(--stage-4-bg)', color: 'var(--stage-4-text)', border: 'var(--stage-4-border)' },
  5: { bg: 'var(--stage-5-bg)', color: 'var(--stage-5-text)', border: 'var(--stage-5-border)' },
  6: { bg: 'var(--stage-6-bg)', color: 'var(--stage-6-text)', border: 'var(--stage-6-border)' },
}

function extractRefs(body: string): string[] {
  const matches = [...body.matchAll(/\/raw\/([\w/-]+)/g)]
  return [...new Set(matches.map(m => m[1]))].slice(0, 4)
}

export async function generateStaticParams() {
  const plays = loadPlaybooks()
  return plays.map(p => ({ slug: p.slug }))
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const plays = loadPlaybooks()
  const play = plays.find(p => p.slug === slug)

  if (!play) notFound()

  const campaigns = loadCampaigns()
  const parentCampaigns = campaigns.filter(c => c.steps.some(s => s.playSlug === slug))

  const stageLabel = STAGE_LABELS[play.stage]
  const stageStyle = STAGE_CHIP_STYLES[play.stage]
  const description = PLAY_DESCRIPTIONS[slug]
  const refs = extractRefs(play.body)
  const exemplars = loadExemplars(slug)

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-5 md:pt-7 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-5 flex-wrap">
          <Link href="/playbooks" className="hover:text-on-surface transition-colors no-underline text-on-surface-muted">
            Plays
          </Link>
          <span className="text-on-surface-subtle">/</span>
          <Link
            href={`/playbooks/stage/${play.stage}`}
            className="hover:text-on-surface transition-colors no-underline text-on-surface-muted hidden sm:inline"
          >
            Stage {play.stage} · {stageLabel}
          </Link>
          <span className="text-on-surface-subtle hidden sm:inline">/</span>
          <span className="font-mono text-on-surface">{slug}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-10">
          {/* Main column */}
          <div>
            {/* Chips */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <span
                className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border"
                style={{ background: stageStyle.bg, color: stageStyle.color, borderColor: stageStyle.border }}
              >
                stage {play.stage} · {stageLabel.toLowerCase()}
              </span>
              {play.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className="font-serif font-medium text-on-surface m-0 mb-3.5 text-[28px] md:text-[36px]"
              style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              {play.title}
            </h1>

            {/* Description */}
            {description && (
              <p
                className="text-on-surface-muted font-serif font-normal m-0 mb-8"
                style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 640, fontVariationSettings: "'opsz' 32" }}
              >
                {description}
              </p>
            )}

            {/* Interactive: tabs + variables + prompt + exemplar */}
            <PlayDetail
              body={play.body}
              playSlug={slug}
              tags={play.tags}
              refs={refs}
              exemplars={exemplars}
            />
          </div>

          {/* Right rail — desktop */}
          <div className="hidden md:flex flex-col gap-3.5" style={{ position: 'sticky', top: 28, alignSelf: 'start' }}>
            <RailContent parentCampaigns={parentCampaigns} refs={refs} />
          </div>

          {/* Right rail — mobile */}
          <div className="mt-4 flex flex-col gap-3.5 md:hidden">
            <RailContent parentCampaigns={parentCampaigns} refs={refs} />
          </div>
        </div>
      </div>
    </main>
  )
}

type Campaign = ReturnType<typeof loadCampaigns>[number]

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RailContent({
  parentCampaigns,
  refs,
}: {
  parentCampaigns: Campaign[]
  refs: string[]
}) {
  return (
    <>
      {/* Part of campaign(s) */}
      {parentCampaigns.length > 0 && (
        <div className="border border-border rounded-radius-lg p-4">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            {parentCampaigns.length === 1 ? 'Part of a campaign' : 'Part of campaigns'}
          </p>
          <div className="flex flex-col gap-1.5">
            {parentCampaigns.map(c => (
              <Link
                key={c.slug}
                href={`/campaigns/${c.slug}`}
                className="flex items-center justify-between py-1.5 text-[13px] no-underline text-on-surface hover:text-primary transition-colors group"
                style={{ borderBottom: '1px dashed var(--color-border)' }}
              >
                <span>{c.title}</span>
                <span className="text-on-surface-subtle group-hover:text-primary transition-colors">
                  <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {refs.length > 0 && (
        <div className="border border-border rounded-radius-lg p-4">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            References pulled in
          </p>
          {refs.map(ref => (
            <Link
              key={ref}
              href={`/raw/${ref}`}
              className="flex items-center justify-between py-1.5 no-underline"
            >
              <span className="font-mono text-[12px] text-on-surface truncate">{ref}</span>
              <ArrowRight size={12} />
            </Link>
          ))}
        </div>
      )}

      {/* Tip card */}
      <div
        className="border rounded-radius-md p-3.5"
        style={{ borderColor: 'var(--color-border-strong)', borderStyle: 'dashed', background: 'var(--color-brand-yellow-50)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-brand-yellow)' }} />
          <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">Tip</span>
        </div>
        <p className="text-[12.5px] leading-[1.5] m-0 text-on-surface">
          Plays work best when your agent has read <span className="font-mono">DESIGN.md</span> first. Run <span className="font-mono">session-start</span> at the beginning of each session to orient it.
        </p>
      </div>
    </>
  )
}
