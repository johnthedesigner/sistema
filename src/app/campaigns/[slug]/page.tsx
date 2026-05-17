import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadCampaigns, loadCampaign } from '@/lib/campaigns'
import { CampaignPromptBox } from '@/components/campaigns/CampaignPromptBox'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const campaign = loadCampaign(slug)
  if (!campaign) return {}
  return {
    title: campaign.title,
    description: campaign.description,
    openGraph: { title: campaign.title, description: campaign.description },
  }
}

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export async function generateStaticParams() {
  const campaigns = loadCampaigns()
  return campaigns.map(c => ({ slug: c.slug }))
}

export default async function CampaignLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const campaign = loadCampaign(slug)
  if (!campaign) notFound()

  return (
    <main>
      {/* Blue header */}
      <div style={{ background: '#0070FF', color: 'white' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-6 md:py-8">
          <div className="mb-1">
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Campaign · {campaign.steps.length} steps
            </span>
          </div>
          <h1
            className="font-serif font-medium text-white m-0 mb-3 md:mb-4 text-[28px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {campaign.title}
          </h1>
          <p
            className="font-serif font-normal m-0 text-[15px] md:text-[16px]"
            style={{ lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', maxWidth: 620 }}
          >
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 md:gap-8">

          {/* Main: campaign prompt */}
          <div>
            {campaign.prompt ? (
              <>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                    Campaign prompt
                  </span>
                  <span className="text-[12px] text-on-surface-muted">
                    Copy and paste into Claude Code or Cursor — the agent handles the rest.
                  </span>
                </div>
                <CampaignPromptBox prompt={campaign.prompt} campaignSlug={campaign.slug} />
              </>
            ) : (
              <div className="border border-border rounded-radius-lg px-6 py-8 text-on-surface-muted text-[14px]">
                Prompt not yet available. Browse the individual plays in the steps list.
              </div>
            )}
          </div>

          {/* Right rail: step list */}
          <div>
            <div className="md:sticky md:top-6">
              <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-3">
                Steps
              </p>
              <div className="space-y-2">
                {campaign.steps.map((step, i) => (
                  <Link
                    key={step.playSlug}
                    href={`/campaigns/${campaign.slug}/${i + 1}`}
                    className="flex items-start gap-3 px-3 py-3 rounded-radius-md border border-border bg-surface hover:border-on-surface-muted hover:bg-surface-sunken transition-colors no-underline group"
                  >
                    <span
                      className="font-mono text-[10.5px] shrink-0 mt-0.5"
                      style={{ color: 'var(--color-on-surface-muted)', minWidth: 16 }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] text-on-surface-muted truncate mb-0.5">
                        {step.playSlug}
                      </p>
                      <p className="text-[12.5px] text-on-surface leading-[1.4] m-0">
                        {step.play.title}
                      </p>
                    </div>
                    <span className="text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                      <ArrowRight size={11} />
                    </span>
                  </Link>
                ))}
              </div>

              <div
                className="mt-5 px-3 py-3.5 rounded-radius-md border"
                style={{ background: 'var(--color-brand-yellow-50)', borderColor: 'var(--color-brand-yellow)', borderStyle: 'dashed' }}
              >
                <p className="text-[12px] text-on-surface leading-[1.5] m-0">
                  <strong>Self-driving:</strong> paste once. The agent works through all {campaign.steps.length} steps, asks for input when needed, and pauses before advancing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
