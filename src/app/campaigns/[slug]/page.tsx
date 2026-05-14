import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadCampaigns, loadCampaign } from '@/lib/campaigns'
import { CampaignPromptBox } from '@/components/campaigns/CampaignPromptBox'

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
        <div className="max-w-[1180px] mx-auto px-10 py-8">
          <div className="mb-1">
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Campaign · {campaign.steps.length} steps
            </span>
          </div>
          <h1
            className="font-serif font-medium text-white m-0 mb-4"
            style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {campaign.title}
          </h1>
          <p
            className="font-serif font-normal m-0 mb-7"
            style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', maxWidth: 620 }}
          >
            {campaign.description}
          </p>

          {/* Step sequence track */}
          <div className="flex items-center gap-1.5">
            {campaign.steps.map((step, i) => (
              <div key={step.playSlug} className="flex items-center gap-1.5 flex-1 min-w-0">
                <div
                  className="flex-1 px-2 py-1.5 rounded-[6px] min-w-0"
                  style={{
                    border: '1px solid rgba(255,255,255,0.22)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="font-mono mb-0.5" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)' }}>
                    STEP {i + 1}
                  </div>
                  <p
                    className="font-mono m-0 truncate"
                    style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1180px] mx-auto px-10 pt-8 pb-20">
        <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 280px' }}>

          {/* Main: campaign prompt */}
          <div>
            {campaign.prompt ? (
              <>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                    Campaign prompt
                  </span>
                  <span className="text-[12px] text-on-surface-muted">
                    paste once — the agent drives the rest
                  </span>
                </div>
                <CampaignPromptBox prompt={campaign.prompt} campaignSlug={campaign.slug} />
              </>
            ) : (
              <div className="border border-border rounded-radius-lg px-6 py-8 text-on-surface-muted text-[14px]">
                Campaign prompt not yet available.
              </div>
            )}
          </div>

          {/* Right rail: step list */}
          <div>
            <div className="sticky top-6">
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
                  <strong>Self-driving:</strong> paste the prompt once. The agent will work through all {campaign.steps.length} steps, ask for input when needed, and pause for confirmation before advancing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
