import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadCampaigns, loadCampaign } from '@/lib/campaigns'
import { CampaignProgress } from '@/components/campaigns/CampaignProgress'
import { CampaignStep } from '@/components/campaigns/CampaignStep'

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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-gray-900">Sistema</Link>
        <span>/</span>
        <Link href="/campaigns" className="hover:text-gray-900">Campaigns</Link>
        <span>/</span>
        <Link href={`/campaigns/${slug}/1`} className="hover:text-gray-900">{campaign.title}</Link>
        <span>/</span>
        <span className="text-gray-900">Step {stepNumber}</span>
      </nav>

      <CampaignProgress
        steps={campaign.steps.map(s => ({ number: s.number, title: s.play.title }))}
        current={stepNumber}
        campaignSlug={slug}
      />

      <div className="mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          Step {stepNumber} of {campaign.steps.length}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{currentStep.play.title}</h1>
      </div>

      <CampaignStep
        campaignSlug={slug}
        stepNumber={stepNumber}
        totalSteps={campaign.steps.length}
        playSlug={currentStep.playSlug}
        playTitle={currentStep.play.title}
        playBody={currentStep.play.body}
      />
    </main>
  )
}
