import Link from 'next/link'
import { loadCampaigns } from '@/lib/campaigns'

export default function CampaignsPage() {
  const campaigns = loadCampaigns()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-sm text-on-surface-muted mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-on-surface">Sistema</Link>
        <span>/</span>
        <span className="text-on-surface">Campaigns</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
        <p className="text-on-surface-muted max-w-2xl">
          Campaigns sequence plays into guided multi-step workflows. Each step generates a prompt you run in your AI tool, then return to continue.
        </p>
      </div>

      <div className="space-y-4">
        {campaigns.map(campaign => (
          <Link
            key={campaign.slug}
            href={`/campaigns/${campaign.slug}/1`}
            className="block border border-border rounded-radius-lg p-6 hover:border-on-surface-muted hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                  {campaign.title}
                </h2>
                <p className="text-sm text-on-surface-muted">{campaign.description}</p>
              </div>
              <span className="text-sm text-on-surface-muted shrink-0 mt-0.5">
                {campaign.steps.length} steps →
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-4">
              {campaign.steps.map(step => (
                <div
                  key={step.number}
                  className="flex-1 h-1 bg-border rounded-full"
                  title={step.play.title}
                />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
