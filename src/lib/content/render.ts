/**
 * Channel renderers for the v2 content model (capability-model Section 6).
 * Pure functions: given parsed content and a base URL, produce the text an
 * agent reads. The same play renders to /raw/plays/<id>, the full workflow
 * expansion, and (in V4) MCP next_step responses.
 */
import type { Play, Workflow } from './parse'
import type { Rule, SequenceItem, ToolName } from './schema'

export interface RenderContext {
  base: string // site origin, no trailing slash
  plays: Map<string, Play>
  rules: Map<string, Rule>
}

// ─── URLs ───────────────────────────────────────────────────────────────────

export const playUrl = (base: string, id: string) => `${base}/raw/plays/${id}`
export const workflowSlug = (id: string) => id.replace(/^workflow\./, '')
export const workflowUrl = (base: string, id: string) => `${base}/raw/workflows/${workflowSlug(id)}`
export const workflowFullUrl = (base: string, id: string) => `${workflowUrl(base, id)}/full`
export const stateSchemaUrl = (base: string) => `${base}/raw/schema/sistema.json`

/** Guides live in kb/principles until V1.12 moves them to content/guides. */
export function guideUrl(base: string, ref: string): { url: string; section?: string } {
  const [id, section] = ref.split('#')
  const [, topic, name] = id.split('.')
  return { url: `${base}/raw/principles/${topic}/${name}`, section }
}

// ─── tools ──────────────────────────────────────────────────────────────────

interface ToolDoc {
  title: string
  usage: (base: string) => string
}

export const TOOL_DOCS: Record<ToolName, ToolDoc> = {
  palette: {
    title: 'Palette',
    usage: base =>
      [
        `POST ${base}/api/palette`,
        'Body: {"colors": {"<name>": "#rrggbb", ...}}  (6-digit hex; send every seed in one request)',
        'Returns: {"palettes": {"<name>": {"seed": "#...", "stops": {"50": {"hex", "contrast_white", "contrast_black"}, ... "950": {...}}}}}',
      ].join('\n'),
  },
  contrast: {
    title: 'Contrast',
    usage: base =>
      [
        `POST ${base}/api/contrast`,
        'Body: {"pairs": [{"foreground": "#hex", "background": "#hex", "label": "on-primary on primary"}, ...]}  (send every pair in one request, up to 200)',
        'Returns: {"results": [{"label", "ratio": 4.83, "passes": {"aa_text", "aa_large_text", "aa_ui", "aaa_text", "aaa_large_text"}}, ...]}  (same order; an invalid pair gets {"error"})',
      ].join('\n'),
  },
  type_scale: {
    title: 'Type scale',
    usage: () => 'Not yet available as an API. Until it is, follow the type scale guidance cited in this play and record the values you chose.',
  },
}

export function renderTools(base: string, tools: ToolName[]): string {
  if (tools.length === 0) return ''
  const blocks = tools.map(t => `**${TOOL_DOCS[t].title}**\n\n\`\`\`\n${TOOL_DOCS[t].usage(base)}\n\`\`\``)
  return `## Tools\n\nUse these tools. Never compute or estimate their results yourself.\n\n${blocks.join('\n\n')}`
}

// ─── state tokens ───────────────────────────────────────────────────────────

const SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  colors: 'Colors',
  typography: 'Typography',
  layout: 'Layout',
  'elevation-depth': 'Elevation & Depth',
  shapes: 'Shapes',
  components: 'Components',
  'dos-donts': "Do's and Don'ts",
}

/** Human description of a requires/produces token. */
export function describeToken(token: string): string {
  const t = token.replace(/\?$/, '')
  const optional = token.endsWith('?') ? ' (when it applies)' : ''
  if (t.startsWith('gate:')) return `the \`${t.slice(5)}\` approval is recorded in \`sistema.json\` \`gates\`${optional}`
  if (t.startsWith('project:')) return `\`sistema.json\` \`project.${t.slice(8).replace(/-/g, '_')}\` is set${optional}`
  if (t.startsWith('design-md#')) return `DESIGN.md has its ${SECTION_TITLES[t.slice(10)] ?? t.slice(10)} section${optional}`
  return `\`${t}\`${optional}`
}

function producersOf(token: string, ctx: RenderContext): string[] {
  const t = token.replace(/\?$/, '')
  return [...ctx.plays.values()].filter(p => p.produces.some(x => x.replace(/\?$/, '') === t)).map(p => p.id)
}

// ─── play ───────────────────────────────────────────────────────────────────

function renderRule(rule: Rule): string {
  const params = rule.parameters
    ? '\n  Values by standard: ' +
      Object.entries(rule.parameters)
        .map(([std, levels]) => `${std} ${Object.entries(levels).map(([lvl, v]) => `${lvl} ${v}`).join(', ')}`)
        .join('; ') +
      '. Use the values for the standard in `sistema.json` `project.a11y_standard`.'
    : ''
  const tag = rule.severity === 'blocking' ? 'Required' : 'Advisory'
  return `- **${rule.id}** (${tag}): ${rule.statement}${params}\n  Why: ${rule.reason}`
}

/** One play as a self-contained document for an agent. */
export function renderPlay(play: Play, ctx: RenderContext): string {
  const parts: string[] = [`# ${play.title}`, `\`${play.id}\` · ${play.description}`]

  if (play.requires.length) {
    const lines = play.requires.map(r => {
      const from = producersOf(r, ctx).filter(id => id !== play.id)
      return `- ${describeToken(r)}${from.length ? ` (from ${from.map(id => `\`${id}\``).join(' or ')})` : ''}`
    })
    parts.push(`## Before you start\n\nCheck that:\n${lines.join('\n')}\n\nIf any of these is missing, stop and tell the person which play produces it.`)
  }

  parts.push(`## Procedure\n\n${play.body}`)

  const tools = renderTools(ctx.base, play.tools)
  if (tools) parts.push(tools)

  if (play.rules.length) {
    const lines = play.rules.map(id => {
      const rule = ctx.rules.get(id)
      return rule ? renderRule(rule) : `- **${id}**`
    })
    parts.push(`## Rules\n\n${lines.join('\n')}`)
  }

  if (play.knowledge.length) {
    // One line per guide, listing every section the play cites from it.
    const byUrl = new Map<string, string[]>()
    for (const ref of play.knowledge) {
      const { url, section } = guideUrl(ctx.base, ref)
      byUrl.set(url, [...(byUrl.get(url) ?? []), ...(section ? [section] : [])])
    }
    const lines = [...byUrl].map(([url, sections]) =>
      `- ${url}${sections.length ? ` (section${sections.length > 1 ? 's' : ''}: ${sections.join(', ')})` : ''}`,
    )
    parts.push(`## Read when you need it\n\nFetch these when the procedure refers to them, not all up front:\n${lines.join('\n')}`)
  }

  if (play.produces.length) parts.push(`## This play writes\n\n${play.produces.map(p => `- ${describeToken(p)}`).join('\n')}`)

  parts.push(`## Done when\n\n${play.evidence}`)

  parts.push(
    [
      '## Record it',
      '',
      `When the evidence is shown, set \`steps["${play.id}"]\` in \`sistema.json\` to \`{"status": "complete", "date": "<today, YYYY-MM-DD>", "evidence": "<one line>"}\`.`,
      `Then append one line to DECISIONS.md: \`<today, YYYY-MM-DD> | ${play.title} | <the decisions you made and why>\`.`,
    ].join('\n'),
  )

  return parts.join('\n\n') + '\n'
}

// ─── workflow ───────────────────────────────────────────────────────────────

interface Step {
  number: number
  play: Play
  optional: boolean
  gateAfter: Array<{ gate: string; prompt: string }>
}

/** Number the plays in a sequence; gates attach to the play before them. */
export function workflowSteps(workflow: Workflow, plays: Map<string, Play>): { steps: Step[]; leadingGates: Array<{ gate: string; prompt: string }> } {
  const steps: Step[] = []
  const leadingGates: Array<{ gate: string; prompt: string }> = []
  for (const item of workflow.sequence ?? ([] as SequenceItem[])) {
    if (typeof item !== 'string') {
      ;(steps.length ? steps[steps.length - 1].gateAfter : leadingGates).push(item)
      continue
    }
    const id = item.replace(/\?$/, '')
    const play = plays.get(id)
    if (!play) throw new Error(`${workflow.id}: unknown play ${id}`)
    steps.push({ number: steps.length + 1, play, optional: item.endsWith('?'), gateAfter: [] })
  }
  return { steps, leadingGates }
}

const MILESTONE_TITLES: Record<string, string> = {
  direction: 'Direction',
  foundations: 'Foundations',
  patterns: 'Patterns',
  maintain: 'Maintain',
}

/** The workflow outline, grouped by milestone, with gates in place (proposal H). */
export function renderOutline(workflow: Workflow, ctx: RenderContext): string {
  const { steps, leadingGates } = workflowSteps(workflow, ctx.plays)
  const lines: string[] = leadingGates.map(g => `   ◆ Approval: ${g.gate}`)
  let milestone = ''
  for (const s of steps) {
    if (s.play.milestone !== milestone) {
      milestone = s.play.milestone
      lines.push(`${MILESTONE_TITLES[milestone] ?? milestone}`)
    }
    lines.push(
      `${String(s.number).padStart(2)}. ${s.play.title}${s.optional ? ' (optional)' : ''}: ${s.play.description}`,
      `    ${playUrl(ctx.base, s.play.id)}`,
    )
    for (const g of s.gateAfter) lines.push(`   ◆ Approval (${g.gate}): ${g.prompt}`)
  }
  return lines.join('\n')
}

/** The exact sistema.json shape, shown in the starter (fit review 3.1). */
function stateExample(workflow: Workflow, ctx: RenderContext): string {
  return JSON.stringify(
    {
      sistema: '2',
      workflow: workflowSlug(workflow.id),
      continue: workflowUrl(ctx.base, workflow.id),
      milestone: 'direction',
      project: {
        name: '<product name>',
        a11y_standard: 'wcag-2.2 AA',
        theme: 'light-dark',
        theme_primary: 'light',
        density: 'balanced',
        platform: 'web',
        stack: 'react-tailwind',
      },
      steps: {
        'project.assess': { status: 'complete', date: '<YYYY-MM-DD>', evidence: '<one line>' },
        'visual-language.direction': { status: 'in-progress', date: '<YYYY-MM-DD>' },
      },
      gates: { 'direction-approved': { date: '<YYYY-MM-DD>', by: '<who approved>', note: '<optional: what changed at approval>' } },
      routing: { 'color.scheme': 'color.map-existing' },
    },
    null,
    2,
  )
}

/** The short paste-in starter (capability-model 9.2, revised in V1.5). */
export function renderWorkflowStarter(workflow: Workflow, ctx: RenderContext, workflows?: Map<string, Workflow>): string {
  const { steps } = workflowSteps(workflow, ctx.plays)
  const tools = [...new Set(steps.flatMap(s => s.play.tools))]
  const next = workflow.continue_with ? workflows?.get(workflow.continue_with) : undefined
  const url = workflowUrl(ctx.base, workflow.id)

  const parts = [
    `# ${workflow.title}`,
    workflow.description,
    ...(workflow.body ? [workflow.body] : []),
    'You are running a Sistema workflow. Work through it one play at a time.',
    [
      '## First: is this a resumed run?',
      '',
      'If `sistema.json` exists in the project root, this is a resumed run, whatever the person said ("continue", "pick up where I left off", or anything else). Read it, show the outline below with each step\'s status, and continue from the first step that is not complete or skipped. If a gate is waiting, ask for that approval first. Do not start other work until the workflow is finished or the person says to leave it.',
    ].join('\n'),
    [
      '## Outline',
      '',
      'Show this outline to the person once, after the first play, with steps that will be skipped or replaced already marked. After each play, show one progress line, for example `Foundations 3 of 6: color done, typography next`. At each approval, and when resuming, show the full outline with each step\'s status. Review pages carry the same outline as a strip at the top.',
      '',
      '```',
      renderOutline(workflow, ctx),
      '```',
    ].join('\n'),
    [
      '## How to run it',
      '',
      '1. Find the first play in the outline that is not marked complete or skipped in `sistema.json` `steps`.',
      `2. If \`sistema.json\` \`routing\` maps that play to a different one, run that play instead. Every play is at ${ctx.base}/raw/plays/<id>.`,
      "3. Fetch the play's instructions from its URL and follow them exactly.",
      "4. If the play's outputs already exist and meet its checks, record it as complete with that evidence and move on.",
      '5. When a play\'s evidence is shown, record it in `sistema.json` and continue. If the person declines an optional play, record it as skipped.',
      '6. At an approval, stop. Set the play before it to `in-progress`, ask the person to review, and continue only after they approve. Then record the gate and mark the play complete. Tell the person they can stop at any approval and pick up later in any new session.',
      '7. Set `milestone` to the milestone of the next unfinished play.',
      `8. Before ending any session, check \`sistema.json\` against the schema at ${stateSchemaUrl(ctx.base)} and fix anything that doesn't match.`,
    ].join('\n'),
    [
      '## State: sistema.json',
      '',
      'Use exactly this shape. Only play IDs go in `steps`. Status is one of `pending`, `in-progress`, `complete`, or `skipped`. `milestone` is one of `direction`, `foundations`, `patterns`, or `maintain`. Work done outside a play goes in DECISIONS.md, not in `steps`.',
      '',
      '```json',
      stateExample(workflow, ctx),
      '```',
      '',
      `\`continue\` is this workflow's URL: ${url}. The first play also adds a short Sistema section to the project's AGENTS.md or CLAUDE.md that points to it, so a new session finds its way back. If that section is missing when you resume, add it as \`project.assess\` describes.`,
    ].join('\n'),
    ...(tools.length ? [renderTools(ctx.base, tools)] : []),
    [
      '## When this workflow is done',
      '',
      'After the last approval:',
      `1. Tell the person the "${workflow.title}" workflow is complete, and show the final outline.`,
      next
        ? `2. Offer to continue with ${next.title}: ${workflowUrl(ctx.base, next.id)}. If they accept, set \`continue\` to that URL. If not, remove \`continue\` and update the pointer lines in the agent instructions file, DECISIONS.md, DESIGN.md, and the review pages to say the workflow is finished.`
        : '2. Say that there is no next Sistema workflow yet, and that further work (for example, building components) is outside Sistema\'s process, so they can decide how to go on. Remove `continue` from `sistema.json`. Change the Sistema section in the agent instructions file, and the pointer lines in DECISIONS.md, DESIGN.md, and the review pages, to say the workflow is finished and DESIGN.md is the reference.',
      '3. Ask: "Was anything in this process unclear, or would you change anything?" Add any answer to DECISIONS.md.',
    ].join('\n'),
    `If you cannot fetch URLs, use the full version, which includes every play: ${workflowFullUrl(ctx.base, workflow.id)}`,
  ]
  return parts.join('\n\n') + '\n'
}

/** Shift every markdown heading down one level (for embedding). */
function demote(markdown: string): string {
  let inFence = false
  return markdown
    .split('\n')
    .map(line => {
      if (line.startsWith('```')) inFence = !inFence
      return !inFence && /^#{1,5} /.test(line) ? `#${line}` : line
    })
    .join('\n')
}

/** Starter plus every play inline, for agents that cannot fetch. */
export function renderWorkflowFull(workflow: Workflow, ctx: RenderContext, workflows?: Map<string, Workflow>): string {
  const starter = renderWorkflowStarter(workflow, ctx, workflows)
    .replace(/\n\nIf you cannot fetch URLs, use the full version[^\n]*\n$/, '\n')
    .replace("3. Fetch the play's instructions from its URL and follow them exactly.", "3. Follow that play's instructions, included below.")
  const { steps } = workflowSteps(workflow, ctx.plays)
  const plays = steps.map(s => demote(renderPlay(s.play, ctx)).replace(/^## /, `## Play ${s.number}: `))
  return [starter.trimEnd(), ...plays.map(p => p.trimEnd())].join('\n\n---\n\n') + '\n'
}
