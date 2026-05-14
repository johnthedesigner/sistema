import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadCampaigns, loadCampaign } from '@/lib/campaigns'
import { CampaignExport } from '@/components/campaigns/CampaignExport'

export async function generateStaticParams() {
  return loadCampaigns().map(c => ({ slug: c.slug }))
}

export default async function CampaignExportPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const campaign = loadCampaign(slug)
  if (!campaign) notFound()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-gray-900">Sistema</Link>
        <span>/</span>
        <Link href="/campaigns" className="hover:text-gray-900">Campaigns</Link>
        <span>/</span>
        <Link href={`/campaigns/${slug}/1`} className="hover:text-gray-900">{campaign.title}</Link>
        <span>/</span>
        <span className="text-gray-900">Export</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Campaign complete</p>
        <h1 className="text-2xl font-bold text-gray-900">Export Prompts</h1>
      </div>

      <CampaignExport
        campaignSlug={slug}
        campaignTitle={campaign.title}
        steps={campaign.steps.map(s => ({
          number: s.number,
          playSlug: s.playSlug,
          playTitle: s.play.title,
          playBody: s.play.body,
        }))}
      />
    </main>
  )
}
