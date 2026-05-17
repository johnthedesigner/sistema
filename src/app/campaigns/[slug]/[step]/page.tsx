import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadCampaigns, loadCampaign } from '@/lib/campaigns'
import { CampaignStep } from '@/components/campaigns/CampaignStep'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export async function generateStaticParams() {
  const campaigns = loadCampaigns()
  const params: { slug: string; step: string }[] = []
  for (const campaign of campaigns) {
    for (const step of campaign.steps) {
      params.push({ slug: campaign.slug, step: String(step.number) })
    }
  }
  return params
}

export default async function CampaignStepPage({
  params,
}: {
  params: Promise<{ slug: string; step: string }>
}) {
  const { slug, step: stepParam } = await params
  const campaign = loadCampaign(slug)
  if (!campaign) notFound()

  const stepNumber = parseInt(stepParam, 10)
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > campaign.steps.length) notFound()

  const currentStep = campaign.steps[stepNumber - 1]

  return (
    <main>
      {/* Blue header with progress track */}
      <div style={{ background: '#0070FF', color: 'white' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-5 md:py-6">
          {/* Campaign title + step counter */}
          <div className="flex items-baseline justify-between mb-4 md:mb-5">
            <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
              <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Campaign
              </span>
              <h1 className="font-serif font-medium m-0 text-white text-[18px] md:text-[22px]" style={{ letterSpacing: '-0.01em' }}>
                {campaign.title}
              </h1>
            </div>
            <span className="font-mono text-[11.5px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {stepNumber}/{campaign.steps.length}
            </span>
          </div>

          {/* Progress track — full on md+, hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5">
            {campaign.steps.map((step, i) => {
              const isDone = i + 1 < stepNumber
              const isCurrent = i + 1 === stepNumber
              return (
                <div key={step.playSlug} className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Link
                    href={`/campaigns/${slug}/${i + 1}`}
                    className="flex-1 px-2 py-1.5 rounded-[6px] border no-underline min-w-0"
                    style={{
                      borderColor: isDone
                        ? 'rgba(255,255,255,0.45)'
                        : isCurrent
                          ? 'var(--color-brand-yellow)'
                          : 'rgba(255,255,255,0.22)',
                      background: isDone
                        ? 'rgba(255,255,255,0.12)'
                        : isCurrent
                          ? 'rgba(0,0,0,0.15)'
                          : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)' }}>
                        STEP {i + 1}
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-white" style={{ color: '#0070FF' }}>
                          <svg width={7} height={7} viewBox="0 0 24 24" fill="none">
                            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p
                      className="font-mono m-0 truncate"
                      style={{ fontSize: 10.5, color: isCurrent ? 'white' : 'rgba(255,255,255,0.7)' }}
                    >
                      {step.playSlug}
                    </p>
                  </Link>
                  {i < campaign.steps.length - 1 && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>→</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile: progress bar + step slugs scrollable */}
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex gap-0.5">
              {campaign.steps.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: 3,
                    background: i + 1 < stepNumber
                      ? 'rgba(255,255,255,0.7)'
                      : i + 1 === stepNumber
                        ? 'var(--color-brand-yellow)'
                        : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-[11px] m-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {currentStep.playSlug}
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-20">
        {/* Step heading */}
        <div className="mb-6 md:mb-7">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2">
            Step {stepNumber} · {currentStep.play.title}
          </p>
          <h2
            className="font-serif font-medium text-on-surface m-0 text-[26px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {currentStep.play.title}
          </h2>
        </div>

        <CampaignStep
          campaignSlug={slug}
          stepNumber={stepNumber}
          totalSteps={campaign.steps.length}
          playSlug={currentStep.playSlug}
          playTitle={currentStep.play.title}
          playBody={currentStep.play.body}
        />
      </div>
    </main>
  )
}
