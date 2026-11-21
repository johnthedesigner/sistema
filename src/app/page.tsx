import type { Metadata } from 'next'
import Link from 'next/link'
import { PromptBox } from '@/components/PromptBox'
import { catalog, orderedWorkflows, workflowHref, workflowPlayIds, workflowPrompt } from '@/lib/content/site'
import { AgentNote } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Sistema: firm foundations for AI-built apps',
  description:
    'Sistema guides your AI coding agent through building a design system in your repository, with your approval at each stage.',
  openGraph: {
    title: 'Sistema: firm foundations for AI-built apps',
    description:
      'Sistema guides your AI coding agent through building a design system in your repository, with your approval at each stage.',
  },
}

function ArrowRight() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  const start = catalog().workflowById.get('workflow.start')!
  const workflows = orderedWorkflows()

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-6 md:pt-12 pb-20">
        <AgentNote raw="/raw/agents" />
        {/* Hero */}
        <div className="mb-10 md:mb-12">
          <h1
            className="font-serif font-medium text-on-surface m-0 text-[42px] md:text-[72px]"
            style={{ lineHeight: 1.0, letterSpacing: '-0.03em', fontVariationSettings: "'opsz' 144, 'SUPERSOFT' 40", maxWidth: 940 }}
          >
            {'Firm foundations for AI-built apps. '}
            <span className="relative inline-block">
              More room to design.
              <span className="absolute rounded-sm -z-10" style={{ left: -2, right: -2, bottom: 4, height: 10, background: 'var(--color-brand-yellow)' }} />
            </span>
          </h1>
          <p
            className="mt-5 md:mt-7 text-on-surface-muted font-serif font-normal text-[16px] md:text-[19px]"
            style={{ lineHeight: 1.55, fontVariationSettings: "'opsz' 32", maxWidth: 820 }}
          >
            Sistema guides your AI coding agent through building a design system in your repository. Once colors, type, and spacing are decided and checked, every new screen starts from solid ground, and your time goes to design choices instead of fixing drift.
          </p>
          <p className="mt-4 text-[13px] text-on-surface-subtle" style={{ maxWidth: 580 }}>
            Made by{' '}
            <a href="https://johnthedesigner.com" className="text-on-surface-muted underline underline-offset-2 hover:text-on-surface transition-colors" target="_blank" rel="noopener noreferrer">
              John the Designer
            </a>
            {' '}after work on design systems at Wayfair, Salesforce, and ReflexAI.
          </p>
        </div>

        {/* Start */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <PromptBox label="Start a design system" body={workflowPrompt(start.id)} playSlug={start.id} expanded />
            <p className="text-[13px] text-on-surface-muted mt-3 m-0">
              Paste this into Claude Code, Cursor, or another coding agent, in your project folder. It works for new projects and for projects that already have colors or tokens: it keeps what you have.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/how-it-works" className="block border border-border rounded-radius-lg p-4 no-underline bg-surface hover:border-border-strong">
              <p className="font-semibold text-[14px] text-on-surface m-0 mb-1">How Sistema works</p>
              <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.45]">You see every stage in your browser before anything builds on it.</p>
            </Link>
            <Link href={workflowHref('workflow.session')} className="block border border-border rounded-radius-lg p-4 no-underline bg-surface hover:border-border-strong">
              <p className="font-semibold text-[14px] text-on-surface m-0 mb-1">Work on my system</p>
              <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.45]">Components, themes, audits, and what&apos;s next.</p>
            </Link>
          </div>
        </div>

        {/* Workflows */}
        <div className="mt-12 md:mt-14">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">Workflows</span>
            <Link href="/plays" className="flex items-center gap-1.5 text-[13px] font-medium text-primary no-underline">
              Browse all plays <ArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workflows.map((w, i) => (
              <Link
                key={w.id}
                href={workflowHref(w.id)}
                className="flex flex-col gap-2 p-4 rounded-radius-lg border no-underline"
                style={{
                  borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                  background: i === 0 ? 'var(--color-primary)' : 'var(--color-surface-raised)',
                  color: i === 0 ? 'white' : 'inherit',
                  minHeight: 120,
                }}
              >
                <span className="font-mono text-[11.5px]" style={{ opacity: 0.75 }}>{workflowPlayIds(w).length} plays</span>
                <p className="font-semibold text-[15px] leading-[1.25] m-0">{w.title}</p>
                <p className="text-[12.5px] leading-[1.45] m-0" style={{ color: i === 0 ? 'rgba(255,255,255,0.85)' : 'var(--color-on-surface-muted)' }}>
                  {w.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
