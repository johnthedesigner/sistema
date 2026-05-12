import fs from 'fs'
import path from 'path'
import type { Play } from './types'

const PLAYBOOKS_PATH = path.join(process.cwd(), '_meta', 'TASK_PLAYBOOKS.md')

export const STAGE_LABELS: Record<number, string> = {
  1: 'System definition',
  2: 'Primitive tokens',
  3: 'Semantic layer',
  4: 'Components',
  5: 'Migration and adoption',
}

/**
 * Parses TASK_PLAYBOOKS.md into structured Play objects.
 *
 * Expected format per play:
 *   ## slug — Title
 *   **Stage:** N
 *   **Tags:** tag1, tag2
 *
 *   [body text...]
 */
export function loadPlaybooks(): Play[] {
  const content = fs.readFileSync(PLAYBOOKS_PATH, 'utf-8')
  const plays: Play[] = []

  // Each play starts with a ## heading matching "slug — Title"
  const sections = content.split(/(?=^## [\w-]+ —)/m)

  for (const section of sections) {
    const headingMatch = section.match(/^## ([\w-]+) — (.+)$/m)
    if (!headingMatch) continue

    const slug = headingMatch[1]
    const title = headingMatch[2].trim()

    const stageMatch = section.match(/^\*\*Stage:\*\*\s*(\d)/m)
    const tagsMatch = section.match(/^\*\*Tags:\*\*\s*(.+)$/m)

    const stage = stageMatch ? (parseInt(stageMatch[1], 10) as 1 | 2 | 3 | 4 | 5) : 1
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : []

    // Body is everything after the Tags line (and following blank line)
    const tagsIdx = section.indexOf('**Tags:**')
    const afterTags = section.slice(tagsIdx)
    const bodyStart = afterTags.indexOf('\n\n')
    const body = bodyStart >= 0 ? afterTags.slice(bodyStart).trim() : ''

    plays.push({ slug, title, stage, tags, body })
  }

  return plays.sort((a, b) => a.stage - b.stage)
}

/**
 * Returns all unique stages present in the playbook, in order.
 */
export function loadStages(): Array<{ stage: 1 | 2 | 3 | 4 | 5; label: string }> {
  const plays = loadPlaybooks()
  const seen = new Set<number>()
  const stages: Array<{ stage: 1 | 2 | 3 | 4 | 5; label: string }> = []
  for (const play of plays) {
    if (!seen.has(play.stage)) {
      seen.add(play.stage)
      stages.push({ stage: play.stage, label: STAGE_LABELS[play.stage] ?? `Stage ${play.stage}` })
    }
  }
  return stages
}
