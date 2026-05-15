import Link from 'next/link'
import { loadCampaigns } from '@/lib/campaigns'

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CampaignsPage() {
  const campaigns = loadCampaigns()

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="mb-9">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Campaigns · {campaigns.length} available
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3 text-[28px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 720 }}
          >
            Self-driving workflows for design systems.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0"
            style={{ maxWidth: 660, fontSize: 16, lineHeight: 1.55, fontVariationSettings: "'opsz' 32" }}
          >
            Copy one prompt and paste it into your AI tool. The agent works through every step in order, asks for input when needed, and pauses for your approval before advancing.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {campaigns.map(campaign => (
            <Link
              key={campaign.slug}
              href={`/campaigns/${campaign.slug}`}
              className="flex items-start justify-between gap-4 border border-border rounded-radius-lg p-5 md:p-6 bg-surface hover:border-on-surface-muted hover:shadow-sm transition-all group no-underline"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="font-mono text-[11px] text-on-surface-muted tracking-[0.06em]">
                    {campaign.steps.length} steps
                  </span>
                  {campaign.prompt && (
                    <span
                      className="inline-flex items-center h-[18px] px-2 rounded-full font-mono text-[10px] font-medium"
                      style={{ background: 'var(--color-brand-blue-50)', color: 'var(--color-primary)' }}
                    >
                      prompt ready
                    </span>
                  )}
                </div>
                <h2
                  className="font-serif font-medium text-on-surface m-0 mb-1.5 group-hover:text-primary transition-colors text-[20px] md:text-[22px]"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {campaign.title}
                </h2>
                <p className="text-[13.5px] text-on-surface-muted leading-[1.5] m-0">
                  {campaign.description}
                </p>

                {/* Step slug labels */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {campaign.steps.map((step) => (
                    <span
                      key={step.playSlug}
                      className="font-mono text-[10.5px] text-on-surface-subtle"
                    >
                      {step.playSlug}{step.number < campaign.steps.length ? ' →' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-[13px] font-medium text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="hidden sm:inline">View</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
