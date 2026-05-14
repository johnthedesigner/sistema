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
  6: 'Stewardship',
}

export const STAGE_DESCRIPTIONS: Record<number, string> = {
  1: 'Define what your system is for — product context, visual character, and the DESIGN.md spec that encodes your decisions for AI tools.',
  2: 'Generate primitive token sets — color palettes, type scales, shape ramps — using perceptual models and major design systems as references.',
  3: 'Build the semantic layer — role-based tokens, light/dark mode, and state colors — on top of your primitive foundation.',
  4: 'Specify and generate accessible component tokens and CSS for individual UI components.',
  5: 'Migrate existing color systems, audit token coverage, and adopt the token architecture incrementally.',
  6: 'Maintain and evolve a living design system — session startup, adding components, auditing drift, accessibility checks, retrospectives, and planning the next iteration.',
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

    const stage = stageMatch ? (parseInt(stageMatch[1], 10) as 1 | 2 | 3 | 4 | 5 | 6) : 1
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
export function loadStages(): Array<{ stage: 1 | 2 | 3 | 4 | 5 | 6; label: string }> {
  const plays = loadPlaybooks()
  const seen = new Set<number>()
  const stages: Array<{ stage: 1 | 2 | 3 | 4 | 5 | 6; label: string }> = []
  for (const play of plays) {
    if (!seen.has(play.stage)) {
      seen.add(play.stage)
      stages.push({ stage: play.stage, label: STAGE_LABELS[play.stage] ?? `Stage ${play.stage}` })
    }
  }
  return stages
}
