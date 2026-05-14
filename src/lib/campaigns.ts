import fs from 'fs'
import path from 'path'
import { loadPlaybooks } from './playbooks'
import type { Play } from './types'

const CAMPAIGNS_PATH = path.join(process.cwd(), '_meta', 'CAMPAIGNS.md')
const CAMPAIGNS_META_PATH = path.join(process.cwd(), '_meta', 'campaigns')

export interface CampaignStep {
  number: number       // 1-indexed
  playSlug: string
  play: Play
}

export interface Campaign {
  slug: string
  title: string
  description: string
  steps: CampaignStep[]
  prompt: string | null
}

export function loadCampaigns(): Campaign[] {
  const content = fs.readFileSync(CAMPAIGNS_PATH, 'utf-8')
  const plays = loadPlaybooks()
  const playsBySlug = Object.fromEntries(plays.map(p => [p.slug, p]))

  const campaigns: Campaign[] = []
  const sections = content.split(/(?=^## [\w-]+ —)/m)

  for (const section of sections) {
    const headingMatch = section.match(/^## ([\w-]+) — (.+)$/m)
    if (!headingMatch) continue

    const slug = headingMatch[1]
    const title = headingMatch[2].trim()

    const stepsMatch = section.match(/^\*\*Steps:\*\*\s*(.+)$/m)
    const descMatch = section.match(/^\*\*Description:\*\*\s*(.+)$/m)

    if (!stepsMatch) continue

    const stepSlugs = stepsMatch[1].split(',').map(s => s.trim())
    const description = descMatch ? descMatch[1].trim() : ''

    const steps: CampaignStep[] = []
    stepSlugs.forEach((playSlug, i) => {
      const play = playsBySlug[playSlug]
      if (play) steps.push({ number: i + 1, playSlug, play })
    })

    if (steps.length > 0) {
      campaigns.push({ slug, title, description, steps, prompt: loadCampaignPrompt(slug) })
    }
  }

  return campaigns
}

export function loadCampaign(slug: string): Campaign | null {
  return loadCampaigns().find(c => c.slug === slug) ?? null
}

export function loadCampaignPrompt(slug: string): string | null {
  const filePath = path.join(CAMPAIGNS_META_PATH, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf-8')
}
