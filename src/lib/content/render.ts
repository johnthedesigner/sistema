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

export const guideRawUrl = (base: string, topic: string, name: string) => `${base}/raw/guides/${topic}/${name}`
export const opinionsUrl = (base: string) => `${base}/raw/opinions`
export const fileRawUrl = (base: string, name: string) => `${base}/raw/files/${name}`
export const sourcesUrl = (base: string) => `${base}/raw/sources`
export const rulesUrl = (base: string) => `${base}/raw/rules`

/** A guide ref (guide.<topic>.<name>#section) as its plain-text URL and section. */
export function guideUrl(base: string, ref: string): { url: string; section?: string } {
  const [id, section] = ref.split('#')
  const [, topic, name] = id.split('.')
  return { url: guideRawUrl(base, topic, name), section }
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
        `GET ${base}/api/palette?<name>=<color>&<name>=<color>`,
        `  Example: ${base}/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)`,
        '  One query parameter per named seed, up to 12. Colors as hex, rgb(), or oklch(), URL-encoded (# is %23). Send every seed in one request.',
        `POST ${base}/api/palette  {"colors": {"<name>": "<color>", ...}}`,
        'Returns: {"palettes": {"<name>": {"seed": "#...", "stops": {"50": {"hex", "oklch", "contrast_white", "contrast_black"}, ... "950": {...}}}}}',
      ].join('\n'),
  },
  contrast: {
    title: 'Contrast',
    usage: base =>
      [
        `GET ${base}/api/contrast?fg=<color>&bg=<color>&label=<name>&standard=<standard>`,
        `  Example: ${base}/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&label=on-primary&standard=wcag-2.2%20AA`,
        '  Repeat fg, bg, and label for more pairs (up to 50); they pair by position. Pass the project\'s standard exactly as sistema.json project.a11y_standard has it. Without one, checks use WCAG 2.2 AA.',
        `POST ${base}/api/contrast  {"standard": "wcag-2.2 AA", "pairs": [{"foreground", "background", "label"}, ...]}  (up to 200 pairs)`,
        'Returns: {"standard", "level", "results": [{"label", "ratio": 5.81, "checks": {"text": {"rule", "required", "pass"}, "large_text": {...}, "ui": {...}}}, ...]}  (same order; an invalid pair gets {"error"}; a check the standard does not set is left out)',
      ].join('\n'),
  },
  type_scale: {
    title: 'Type scale',
    usage: base =>
      [
        `GET ${base}/api/type-scale?base=<px>&ratio=<name or number>&down=<n>&up=<n>&names=<numeric|tailwind|steps>&roles=<role>:<step>,...&standard=<standard>`,
        `  Example: ${base}/api/type-scale?base=16&ratio=major-third&down=2&up=6&names=tailwind&roles=caption:-2,label:-1,body:0,heading-sm:2,heading-lg:4,display:6&standard=wcag-2.2%20AA`,
        '  Defaults: base 16, major-third (1.25), 2 steps down, 6 up, numbered names. Ratio names: minor-second, major-second, minor-third, major-third, perfect-fourth, augmented-fourth, perfect-fifth, golden-ratio. Use the naming convention chosen for the project, and place the project\'s roles on steps. Pass the project\'s standard exactly as sistema.json has it.',
        `POST ${base}/api/type-scale  {"base": 16, "ratio": "major-third", "names": "tailwind", "roles": {"body": 0, "caption": -2}, "standard": "wcag-2.2 AA"}`,
        'Returns: {"base", "ratio", "names", "steps": [{"step", "name", "roles"?, "px", "rem", "line_height", "notes"?}], "notes"?, "checks": [{"rule", "pass", ...}]}  (line heights are starting suggestions; notes are advice from the typography guide, not failures)',
      ].join('\n'),
  },
}

/** For workflow starters: name the tools without their full usage, which each play carries. */
export function renderToolSummary(tools: ToolName[]): string {
  if (tools.length === 0) return ''
  const names = tools.map(t => TOOL_DOCS[t].title.toLowerCase())
  const list =
    names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
  return `## Tools\n\nThis workflow uses Sistema's ${list} ${names.length === 1 ? 'tool' : 'tools'}. Each play shows how to call the ones it needs. Use them. Never compute or estimate their results yourself.`
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

/**
 * One rule for an agent. When the play calls a tool that checks this rule
 * (`checked_by: [tool.<name>]`), the values by standard are left out: the tool
 * applies them for the project's standard and reports the result.
 */
export function renderRule(rule: Rule, tools: ToolName[] = []): string {
  const checker = tools.find(t => rule.checked_by.includes(`tool.${t}`))
  const params = checker && rule.parameters
    ? `\n  The ${TOOL_DOCS[checker].title.toLowerCase()} tool checks this for the standard in \`sistema.json\`. Use its result; don't apply a value yourself.`
    : rule.parameters
    ? '\n  Values by standard: ' +
      Object.entries(rule.parameters)
        .map(([std, levels]) => `${std} ${Object.entries(levels).map(([lvl, v]) => `${lvl} ${v}`).join(', ')}`)
        .join('; ') +
      '. Use the values for the standard in `sistema.json` `project.a11y_standard`.'
    : ''
  const when = rule.applies_when ? `\n  Applies when: ${rule.applies_when}` : ''
  const tag = rule.severity === 'blocking' ? 'Required' : 'Advisory'
  return `- **${rule.id}** (${tag}): ${rule.statement}${when}${params}\n  Why: ${rule.reason}`
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
      return rule ? renderRule(rule, play.tools) : `- **${id}**`
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
      gates: { 'direction-approved': { date: '<YYYY-MM-DD>', by: '<the approver\'s name, or "owner" if they gave none>', note: '<optional: what changed at approval>' } },
      routing: { 'color.scheme': 'color.map-existing' },
      telemetry: { id: '<the c value from this workflow URL, if it has one>' },
    },
    null,
    2,
  )
}

/** Plays a route workflow uses: the start play, then each route's plays, deduplicated. */
export function routePlays(workflow: Workflow, plays: Map<string, Play>): Play[] {
  const ids = [...(workflow.start_with ? [workflow.start_with] : []), ...Object.values(workflow.routes ?? {}).flatMap(r => r.plays)]
  return [...new Set(ids)].map(id => {
    const play = plays.get(id)
    if (!play) throw new Error(`${workflow.id}: unknown play ${id}`)
    return play
  })
}

/** Starter for a route workflow (workflow.session): orient, then one route per goal. */
function renderRoutesStarter(workflow: Workflow, ctx: RenderContext): string {
  const url = workflowUrl(ctx.base, workflow.id)
  const start = workflow.start_with ? ctx.plays.get(workflow.start_with) : undefined
  const tools = [...new Set(routePlays(workflow, ctx.plays).flatMap(p => p.tools))]
  const routeLines = Object.entries(workflow.routes ?? {}).flatMap(([name, route]) => {
    const plays = route.plays.map(id => ctx.plays.get(id)!)
    return [`- ${name} (${route.title}): ${plays.map(p => p.title).join(' → ')}`, ...plays.map(p => `    ${playUrl(ctx.base, p.id)}`)]
  })

  const parts = [
    `# ${workflow.title}`,
    workflow.description,
    ...(workflow.body ? [workflow.body] : []),
    'You are running a Sistema workflow. Each session starts by orienting, then follows one route.',
    [
      '## Routes',
      '',
      ...(start ? [`Start every session with **${start.title}**: ${start.description}`, `    ${playUrl(ctx.base, start.id)}`, ''] : []),
      'Then follow the route that fits the goal:',
      '',
      ...routeLines,
    ].join('\n'),
    [
      '## How to run it',
      '',
      ...(start ? [`1. Run ${start.title} (\`${start.id}\`). It reads the system's state, confirms the goal with the person, and picks a route. If the person's message already says what they want (for example, "I want to add a component: a date picker"), treat that as the goal and confirm it rather than asking again.`] : ['1. Ask the person for the goal of this session, and pick the route that fits. If their message already says what they want, confirm it rather than asking again.']),
      '2. Run the route\'s plays in order. Fetch each from its URL and follow it exactly.',
      "3. When a play's evidence is shown, record it in `sistema.json` `steps` (this replaces the record of that play's previous run) and add its line to DECISIONS.md.",
      '4. After each play, show one progress line, for example `add-component 1 of 2: specification done, implementation next`.',
      "5. When the route is done, say so, and ask whether there is another goal for this session. If there is, confirm it and pick its route. If no route fits a goal, say so, and agree with the person how to proceed outside Sistema's plays.",
      `6. Before ending any session, check \`sistema.json\` against the schema at ${stateSchemaUrl(ctx.base)} and fix anything that doesn't match.`,
    ].join('\n'),
    [
      '## State: sistema.json',
      '',
      `Set \`workflow\` to \`${workflowSlug(workflow.id)}\` and \`milestone\` to \`maintain\`. Keep \`continue\` at this workflow's URL, ${url}: this workflow is the standing entry point for design system work, so the Sistema section in the agent instructions file keeps pointing here. If the URL you fetched this from has a \`c\` parameter, keep it on \`continue\` and record it in \`sistema.json\` as \`telemetry.id\`. It is an anonymous usage ID: Sistema counts how its workflows, plays, and tools are used, and records nothing about the person or the project's code. Only play IDs go in \`steps\`. Work done outside a play goes in DECISIONS.md.`,
    ].join('\n'),
    ...(tools.length ? [renderToolSummary(tools)] : []),
    `If you cannot fetch URLs, use the full version, which includes every play: ${workflowFullUrl(ctx.base, workflow.id)}`,
  ]
  return parts.join('\n\n') + '\n'
}

/**
 * The end of a sequence workflow (owner, 2026-11-18): land the finish first, so the
 * person knows they're done, then offer what comes next as options for any time,
 * not as a push to keep going. `continue` moves to the standing session workflow.
 */
function workflowEnd(workflow: Workflow, ctx: RenderContext, next: Workflow | undefined, workflows?: Map<string, Workflow>): string {
  const session = workflows?.get('workflow.session')
  const entry = session ? workflowUrl(ctx.base, session.id) : undefined
  const sentence = (t: string) => (t.charAt(0).toLowerCase() + t.slice(1)).replace(/\.$/, '')
  const later: string[] = []
  if (next && next.id !== 'workflow.session') later.push(`   - ${next.title}: ${sentence(next.description)} (${workflowUrl(ctx.base, next.id)}).`)
  if (session?.routes) {
    const routes = Object.values(session.routes).map(r => r.title.charAt(0).toLowerCase() + r.title.slice(1))
    const list = routes.length <= 2 ? routes.join(' or ') : `${routes.slice(0, -1).join('; ')}; or ${routes[routes.length - 1]}`
    later.push(`   - ${session.title}, whenever it's needed: ${list} (${entry}).`)
  }
  return [
    '## When this workflow is done',
    '',
    'After the last approval, close the workflow clearly. The person should come away knowing they have finished.',
    '',
    `1. **Land it.** Tell the person they have completed "${workflow.title}". In a few sentences, say what their project now has, naming the files and decisions this workflow produced, and where to see it (the review pages). Show the final outline with every step done. Make this the main message.`,
    entry
      ? `2. **Update the pointers.** Set \`continue\` in \`sistema.json\` to ${entry}, keeping its \`c\` parameter if it has one. Update the Sistema section in the agent instructions file and the pointer lines in DECISIONS.md, DESIGN.md, and the review pages to say this workflow is finished and that later design system work starts there.`
      : '2. **Update the pointers.** Remove `continue` from `sistema.json`, and update the Sistema section in the agent instructions file and the pointer lines in DECISIONS.md, DESIGN.md, and the review pages to say this workflow is finished.',
    later.length
      ? `3. **Then, briefly, mention what they can do later.** These are options for any time, not next steps:\n${later.join('\n')}\n\n   Say they can ask their agent to work on the design system whenever they want one. Don't ask whether to start one now. If the person asks to, start it.`
      : "3. **Then say what else is possible.** Further work is outside Sistema's process for now, so the person can decide how to go on.",
    '4. Ask: "Was anything in this process unclear, or would you change anything?" Add any answer to DECISIONS.md.',
  ].join('\n')
}

/** The short paste-in starter (capability-model 9.2, revised in V1.5). */
export function renderWorkflowStarter(workflow: Workflow, ctx: RenderContext, workflows?: Map<string, Workflow>): string {
  if (workflow.routes) return renderRoutesStarter(workflow, ctx)
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
      '5. When a play\'s evidence is shown, record it in `sistema.json` and continue. Before an optional play, tell the person in one sentence what it gives them and ask whether they want it now. Say it can also be added later. If they decline, record it as skipped.',
      '6. At an approval, stop. Set the play before it to `in-progress`, ask the person to review, and continue only after they approve. Then record the gate and mark the play complete. Tell the person they can stop at any approval and pick up later in any new session.',
      '7. Set `milestone` to the milestone of the next unfinished play.',
      `8. Before ending any session, check \`sistema.json\` against the schema at ${stateSchemaUrl(ctx.base)} and fix anything that doesn't match.`,
    ].join('\n'),
    [
      '## State: sistema.json',
      '',
      'Use exactly this shape. Only play IDs go in `steps`. Status is one of `pending`, `in-progress` (started and waiting at an approval or on an answer from the person), `complete`, or `skipped`. `milestone` is one of `direction`, `foundations`, `patterns`, or `maintain`. Work done outside a play goes in DECISIONS.md, not in `steps`.',
      '',
      '```json',
      stateExample(workflow, ctx),
      '```',
      '',
      `\`continue\` is this workflow's URL: ${url}. The first play also adds a short Sistema section to the project's AGENTS.md or CLAUDE.md that points to it, so a new session finds its way back. If that section is missing when you resume, add it as \`project.assess\` describes. If the URL you fetched this from has a \`c\` parameter, keep it on \`continue\` and record it in \`sistema.json\` as \`telemetry.id\`. It is an anonymous usage ID: Sistema counts how its workflows, plays, and tools are used, and records nothing about the person or the project's code.`,
    ].join('\n'),
    ...(tools.length ? [renderToolSummary(tools)] : []),
    workflowEnd(workflow, ctx, next, workflows),
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
    .replace("Fetch each from its URL and follow it exactly.", 'Follow each one, included below.')
  const plays = workflow.routes
    ? routePlays(workflow, ctx.plays).map((p, i) => demote(renderPlay(p, ctx)).replace(/^## /, `## Play ${i + 1}: `))
    : workflowSteps(workflow, ctx.plays).steps.map(s => demote(renderPlay(s.play, ctx)).replace(/^## /, `## Play ${s.number}: `))
  return [starter.trimEnd(), ...plays.map(p => p.trimEnd())].join('\n\n---\n\n') + '\n'
}
