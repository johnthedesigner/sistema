import fs from 'fs'
import path from 'path'
import type { Play } from './types'

const PLAYBOOKS_PATH = path.join(process.cwd(), '_meta', 'TASK_PLAYBOOKS.md')

/**
 * Parses TASK_PLAYBOOKS.md into structured Play objects.
 * Each play captures its id, title, category, tier, and full markdown body.
 */
export function loadPlaybooks(): Play[] {
  const content = fs.readFileSync(PLAYBOOKS_PATH, 'utf-8')
  const plays: Play[] = []

  // Split on category headings (## Category N: ...)
  const categorySections = content.split(/(?=^## Category \d)/m)

  for (const section of categorySections) {
    const catMatch = section.match(/^## Category (\d+): (.+)$/m)
    if (!catMatch) continue

    const categoryNumber = parseInt(catMatch[1], 10)
    const category = catMatch[2].trim()

    // Split on play headings (### N.M — ...) within this category
    const playSections = section.split(/(?=^### [\d.]+)/m).slice(1)

    for (const playSection of playSections) {
      const playMatch = playSection.match(/^### ([\d.]+) — (.+)$/m)
      if (!playMatch) continue

      const id = playMatch[1]
      const title = playMatch[2].trim()

      const tierMatch = playSection.match(/\*\*Tier:\*\*\s*(\d)/)
      const tier = tierMatch ? (parseInt(tierMatch[1], 10) as 1 | 2 | 3) : undefined

      plays.push({
        id,
        title,
        category,
        categoryNumber,
        tier,
        body: playSection.trim(),
      })
    }
  }

  return plays
}

/**
 * Returns all unique play categories in order.
 */
export function loadCategories(): Array<{ number: number; name: string }> {
  const plays = loadPlaybooks()
  const seen = new Set<number>()
  const categories: Array<{ number: number; name: string }> = []
  for (const play of plays) {
    if (!seen.has(play.categoryNumber)) {
      seen.add(play.categoryNumber)
      categories.push({ number: play.categoryNumber, name: play.category })
    }
  }
  return categories
}
