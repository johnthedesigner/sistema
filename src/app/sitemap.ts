import type { MetadataRoute } from 'next'
import { loadPlaybooks } from '@/lib/playbooks'
import { loadCampaigns } from '@/lib/campaigns'
import { listSystems, KB_CATEGORIES, type KBCategory } from '@/lib/kb'
import { SITE_URL } from '@/lib/site-url'

const REFERENCE_CATEGORIES: KBCategory[] = ['design-systems', 'standards', 'foundations', 'skills']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const plays = loadPlaybooks()
  const campaigns = loadCampaigns()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/playbooks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/campaigns`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kb`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sources`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const playRoutes: MetadataRoute.Sitemap = plays.map(play => ({
    url: `${SITE_URL}/playbooks/${play.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const campaignRoutes: MetadataRoute.Sitemap = campaigns.map(campaign => ({
    url: `${SITE_URL}/campaigns/${campaign.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const kbCategoryRoutes: MetadataRoute.Sitemap = KB_CATEGORIES.map(category => ({
    url: `${SITE_URL}/kb/${category}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // KB system index pages only — not individual content files
  const kbSystemRoutes: MetadataRoute.Sitemap = REFERENCE_CATEGORIES.flatMap(category =>
    listSystems(category).map(slug => ({
      url: `${SITE_URL}/kb/${category}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  // Principles entries (no sub-slug structure — they resolve at category level)
  const principlesRoutes: MetadataRoute.Sitemap = listSystems('principles').map(slug => ({
    url: `${SITE_URL}/kb/principles/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [
    ...staticRoutes,
    ...playRoutes,
    ...campaignRoutes,
    ...kbCategoryRoutes,
    ...kbSystemRoutes,
    ...principlesRoutes,
  ]
}
