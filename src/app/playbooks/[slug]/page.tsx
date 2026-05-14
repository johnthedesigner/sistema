import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPlaybooks, STAGE_LABELS } from '@/lib/playbooks'
import { loadCampaigns } from '@/lib/campaigns'
import { loadExemplar } from '@/lib/exemplars'
import { PlayForm } from '@/components/playbooks/PlayForm'
import { ExemplarPreview } from '@/components/playbooks/ExemplarPreview'
import { DesignMdCallout } from '@/components/shared/DesignMdCallout'
import { PromptBox } from '@/components/PromptBox'

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
  1: { bg: '#E6F0FF', color: '#0058CC', border: '#BFD8FF' },
  2: { bg: '#E6F0FF', color: '#1056BF', border: '#BFD8FF' },
  3: { bg: '#F0E9FF', color: '#5325B8', border: '#D9C9FF' },
  4: { bg: '#E3F3EC', color: '#137A4D', border: '#BCE3CE' },
  5: { bg: '#FFF1E0', color: '#A65B00', border: '#FFD9A8' },
  6: { bg: '#FFF8E0', color: '#8A6500', border: '#F2DA8A' },
}

function extractRefs(body: string): string[] {
  const matches = [...body.matchAll(/\/raw\/([\w/-]+)/g)]
  return [...new Set(matches.map(m => m[1]))].slice(0, 4)
}

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
  const parentCampaign = campaigns.find(c => c.steps.some(s => s.playSlug === slug))
  const stepInCampaign = parentCampaign?.steps.find(s => s.playSlug === slug)

  const stageLabel = STAGE_LABELS[play.stage]
  const stageStyle = STAGE_CHIP_STYLES[play.stage]
  const description = PLAY_DESCRIPTIONS[slug]
  const hasVariables = /\{\{(?!sistema_url\}\})[^}]+\}\}/.test(play.body)
  const refs = extractRefs(play.body)
  const exemplar = loadExemplar(slug)

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-10 pt-7 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-5">
          <Link href="/playbooks" className="hover:text-on-surface transition-colors no-underline text-on-surface-muted">
            Plays
          </Link>
          <span className="text-on-surface-subtle">/</span>
          <Link
            href={`/playbooks/stage/${play.stage}`}
            className="hover:text-on-surface transition-colors no-underline text-on-surface-muted"
          >
            Stage {play.stage} · {stageLabel}
          </Link>
          <span className="text-on-surface-subtle">/</span>
          <span className="font-mono text-on-surface">{slug}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid gap-10" style={{ gridTemplateColumns: '1fr 280px' }}>
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
              className="font-serif font-medium text-on-surface m-0 mb-3.5"
              style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' }}
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

            {play.tags.includes('design-md') && (
              <div className="mb-6">
                <DesignMdCallout />
              </div>
            )}

            {/* Variables */}
            {hasVariables && (
              <div className="mb-7">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                    Variables
                  </span>
                  <span className="text-[12px] text-on-surface-muted">fill in to personalize the prompt</span>
                </div>
                <PlayForm body={play.body} tags={play.tags} />
              </div>
            )}

            {/* Prompt box */}
            {!hasVariables && (
              <div className="mb-9">
                <PromptBox
                  label={`play · ${slug}`}
                  body={play.body}
                  refs={refs.length > 0 ? `${refs.length} KB ref${refs.length !== 1 ? 's' : ''}` : undefined}
                  expanded
                />
              </div>
            )}
            {hasVariables && (
              <div className="mb-9">
                <div className="rounded-radius-xl border border-border bg-surface-raised overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border" style={{ background: 'linear-gradient(180deg, #FCFCFC 0%, #FFFFFF 100%)' }}>
                    <span className="block w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(0,112,255,0.15)' }} />
                    <span className="font-mono text-[11.5px] tracking-[0.04em] uppercase text-on-surface-muted">
                      play · {slug}
                    </span>
                  </div>
                  <div className="p-5 font-mono text-[13.5px] leading-[1.65] text-on-surface" style={{ whiteSpace: 'pre-wrap' }}>
                    {play.body}
                  </div>
                </div>
              </div>
            )}

            {/* Exemplar */}
            {exemplar && (
              <div className="mt-9">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                    Example output
                  </span>
                  <span className="text-[12px] text-on-surface-muted">what a successful run looks like</span>
                </div>
                <div className="border border-border rounded-radius-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b border-border"
                    style={{ background: '#FCFCFC' }}
                  >
                    <span className="font-mono text-[12px] text-on-surface-muted">{slug} · example output</span>
                  </div>
                  <div className="p-5">
                    <ExemplarPreview exemplar={exemplar} inline />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="flex flex-col gap-3.5" style={{ position: 'sticky', top: 28, alignSelf: 'start' }}>
            {/* In this play */}
            <div className="border border-border rounded-radius-lg p-4">
              <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
                In this play
              </p>
              {[
                hasVariables ? ['Variables', `${(play.body.match(/\{\{(?!sistema_url)[^}]+\}\}/g) ?? []).length}`] : null,
                ['Prompt body', ''],
                exemplar ? ['Example output', ''] : null,
                refs.length > 0 ? ['References', `${refs.length}`] : null,
              ].filter(Boolean).map(item => item && (
                <div
                  key={item[0]}
                  className="flex justify-between items-center py-1.5 text-[13px]"
                  style={{ borderBottom: '1px dashed var(--color-border)' }}
                >
                  <span>{item[0]}</span>
                  {item[1] && <span className="font-mono text-[11px] text-on-surface-subtle">{item[1]}</span>}
                </div>
              ))}
            </div>

            {/* Part of campaign */}
            {parentCampaign && (
              <div className="border border-border rounded-radius-lg p-4">
                <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
                  Part of a campaign
                </p>
                <p className="font-semibold text-[13.5px] text-on-surface mb-1">{parentCampaign.title}</p>
                <p className="text-[12px] text-on-surface-muted leading-[1.45] mb-2.5">
                  Step {stepInCampaign?.number} of {parentCampaign.steps.length}.
                </p>
                <Link
                  href={`/campaigns/${parentCampaign.slug}`}
                  className="flex items-center justify-center gap-2 w-full h-[30px] text-[12.5px] font-medium border border-border rounded-radius-md text-on-surface no-underline hover:bg-surface-sunken transition-colors"
                >
                  Continue campaign <ArrowRight size={12} />
                </Link>
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
                <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase" style={{ color: '#8A6500' }}>Tip</span>
              </div>
              <p className="text-[12.5px] leading-[1.5] m-0" style={{ color: '#5A4400' }}>
                Plays work best when your agent has read <span className="font-mono">DESIGN.md</span> first. Run <span className="font-mono">session-start</span> at the beginning of each session to orient it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
