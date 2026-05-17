import fs from 'fs'
import path from 'path'
import { loadPlaybooks } from './playbooks'
import { loadCampaigns } from './campaigns'
import { listSystems, KB_CATEGORIES, type KBCategory } from './kb'
import type { SearchEntry } from './search'

const KB_BASE = path.join(process.cwd(), 'kb')

const CATEGORY_DIR: Record<KBCategory, string> = {
  'design-systems': 'reference/design-systems',
  'standards': 'reference/standards',
  'foundations': 'reference/foundations',
  'skills': 'reference/skills',
  'principles': 'principles',
}

const CATEGORY_META: Record<KBCategory, string> = {
  'design-systems': 'design systems',
  'standards': 'standards',
  'foundations': 'foundations',
  'skills': 'agent skills',
  'principles': 'principles',
}

function readKBTitle(category: KBCategory, slug: string): string {
  const indexPath = path.join(KB_BASE, CATEGORY_DIR[category], slug, '_index.md')
  if (!fs.existsSync(indexPath)) return slug.replace(/-/g, ' ')
  const body = fs.readFileSync(indexPath, 'utf-8')
  const match = body.match(/^# (.+)$/m)
  if (!match) return slug.replace(/-/g, ' ')
  return match[1].replace(/ — .*$/, '').trim()
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const play of loadPlaybooks()) {
    entries.push({
      type: 'play',
      title: play.title,
      slug: play.slug,
      href: `/playbooks/${play.slug}`,
      tags: play.tags,
      description: '',
      meta: `stage ${play.stage}`,
    })
  }

  for (const campaign of loadCampaigns()) {
    entries.push({
      type: 'featured',
      title: campaign.title,
      slug: campaign.slug,
      href: `/campaigns/${campaign.slug}`,
      tags: campaign.steps.map(s => s.playSlug),
      description: campaign.description,
      meta: `${campaign.steps.length} steps`,
    })
  }

  for (const category of KB_CATEGORIES) {
    for (const slug of listSystems(category)) {
      entries.push({
        type: 'kb',
        title: readKBTitle(category, slug),
        slug,
        href: `/kb/${category}/${slug}`,
        tags: [],
        description: '',
        meta: CATEGORY_META[category],
      })
    }
  }

  entries.push({
    type: 'tool',
    title: 'Palette Library',
    slug: 'palette',
    href: '/tools/palette',
    tags: ['oklch', 'color', 'palette', 'tool'],
    description: 'OKLCH palettes generated from seed colors',
    meta: 'tool',
  })

  return entries
}
