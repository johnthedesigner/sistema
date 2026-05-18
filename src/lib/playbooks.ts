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
export const PLAY_DESCRIPTIONS: Record<string, string> = {
  'positioning-brief': 'Seeds the living brief with brand stance, audience, density target, and OKLCH commitment level — the inputs every color, type, and token play expects.',
  'establish-visual-language': 'Translates the positioning brief into a reviewable style tile covering color, typography, shape, and surface treatment — human approval required before tokens are generated.',
  'generate-design-md': 'A committed DESIGN.md tells every agent in your repo what the visual language is — drafted from your positioning brief, formatted for AI tooling.',
  'generate-color-scheme': 'Starting from seed hex values, generates full OKLCH primitive ramps and maps each stop to a semantic role with contrast targets verified for both light and dark.',
  'generate-type-scale': "Named type roles with size, weight, line-height, and tracking — calibrated to your product's density and brand stance, not a generic modular ratio.",
  'generate-shape-tokens': 'Border radii as a personality decision, not a default — with a component mapping table so buttons, cards, inputs, and overlays stay visually consistent.',
  'generate-color-roles': 'Takes any existing color values — Figma swatches, a Tailwind config, a brand palette — and assigns each to the correct semantic role with contrast verification.',
  'generate-dark-mode': 'Dark mode built on tonal mirroring, not lightness inversion — role assignments that hold up perceptually against dark surfaces, verified against WCAG.',
  'generate-style-dictionary': 'Wires your semantic token JSON into a Style Dictionary v5 pipeline that outputs CSS custom properties, ESM, and platform targets from a single source.',
  'specify-component': 'Before any code: states, anatomy, token slot assignments, and WCAG requirements — the contract between design intent and what gets implemented.',
  'implement-component': 'Takes the component spec and produces working React code consuming your semantic tokens, following the patterns already established in DESIGN.md.',
  'scaffold-core-components': 'Maps every component named in DESIGN.md to a spec skeleton — variants, states, and anatomy — so implementation has a defined scope before a line of code is written.',
  'migrate-tailwind-tokens': 'Converts raw Tailwind color values into a two-tier token structure — existing stops become primitives, semantic roles get added — without touching component utility classes.',
  'audit-component': 'Finds every hardcoded value, missing state, accessibility gap, and DESIGN.md divergence in an existing component — with specific, line-level fixes.',
  'session-start': 'Orients a fresh agent to where the system stands — reads DESIGN.md, surfaces open decisions, and confirms what\'s in scope before work begins.',
  'add-component': 'Specs and implements a new component within your established system — token assignments already defined, patterns already set, no blank-slate decisions required.',
  'audit-token-coverage': 'Scans for hardcoded color, spacing, and type values that should be consuming tokens — grouped by category, with file and line references.',
  'accessibility-audit': 'Checks every semantic color pairing against WCAG 2.2 and APCA, flags non-compliant combinations, and produces token-level fixes rather than component-level workarounds.',
  'design-system-retrospective': 'Surfaces where code has drifted from DESIGN.md, which decisions no longer hold, and what should be formally reconsidered before the next iteration.',
  'plan-next-iteration': 'Turns retrospective findings and open DESIGN.md questions into a prioritized, scoped backlog — what to build, fix, or revisit, and in what order.',
  'establish-context': 'Reads every existing project file before asking a single question — produces a complete picture of what exists, what decisions have been made, and what still needs to be answered.',
  'generate-page-examples': 'Generates 1–2 full-page HTML compositions showing the token system and component patterns applied to realistic, product-appropriate page types.',
  'setup-documentation-site': 'Produces a self-contained docs/index.html with token swatches, component gallery, and usage notes — no build step, openable from the filesystem.',
  'define-voice-and-tone': 'Produces a VOICE_AND_TONE.md covering voice character, tone adjustments by context, writing mechanics, and UI copy patterns — the content equivalent of DESIGN.md.',
}

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
