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
  /**
   * 'mcp' when the text is served through the MCP server: name its tools instead of URLs to fetch.
   * 'skill' when it is packaged as an Agent Skill: plays are files in the skill's references/ folder.
   */
  channel?: 'mcp' | 'skill'
}

// ─── URLs ───────────────────────────────────────────────────────────────────

export const playUrl = (base: string, id: string) => `${base}/raw/plays/${id}`
/** Where an agent finds a play: its URL, or its file inside an Agent Skill. */
export const playRef = (ctx: RenderContext, id: string) => (ctx.channel === 'skill' ? `references/${id}.md` : playUrl(ctx.base, id))
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
        'Each pair may set "purpose" (in GET, repeat purpose=, paired by position): text, large_text, or ui returns only that check; informational returns the ratio with no checks, for boundaries no standard requires, such as a decorative divider or a status dot beside its word. Without it, every check is returned.',
      ].join('\n'),
  },
  type_scale: {
    title: 'Type scale',
    usage: base =>
      [
        `GET ${base}/api/type-scale?base=<px>&ratio=<ratio>&down=<n>&up=<n>&names=<naming>&roles=<role>:<step>,<role>:<step>&standard=<standard>`,
        `  Example: ${base}/api/type-scale?base=16&ratio=major-third&down=2&up=6&names=tailwind&roles=caption:-2,label:-1,body:0,heading-sm:2,heading-lg:4,display:6&standard=wcag-2.2%20AA`,
        '  <ratio> is a number or a name; <naming> is numeric, tailwind, or steps. Defaults: base 16, major-third (1.25), 2 steps down, 6 up, numbered names. Ratio names: minor-second, major-second, minor-third, major-third, perfect-fourth, augmented-fourth, perfect-fifth, golden-ratio. Use the naming convention chosen for the project, and place the project\'s roles on steps. Pass the project\'s standard exactly as sistema.json has it.',
        `POST ${base}/api/type-scale  {"base": 16, "ratio": "major-third", "names": "tailwind", "roles": {"body": 0, "caption": -2}, "standard": "wcag-2.2 AA"}`,
        'Returns: {"base", "ratio", "names", "steps": [{"step", "name", "roles"?, "px", "rem", "line_height", "notes"?}], "notes"?, "checks": [{"rule", "pass", ...}]}  (line heights are starting suggestions; notes are advice from the typography guide, not failures)',
      ].join('\n'),
  },
  specimen: {
    title: 'Specimen',
    usage: base =>
      [
        `GET ${base}/api/specimen?accent=<color>&neutral=<cool|neutral|warm|tinted|color>&presence=<quiet|brand|tinted>&radius=<px>&chips=<scaled|pill>&separation=<tone|line|shadow>&density=<compact|comfortable|spacious>&font=<family>&display_font=<family>&theme=<light|dark>&layout=<operations|dashboard|record|marketing|article|shop>`,
        `  Example: ${base}/api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&font=Figtree`,
        '  Renders one page from these choices. layout picks the kind of page: operations (a list with status, the default), dashboard (charts), record (a detail page with forms), marketing, article, or shop (a product listing). Pick the layout closest to the product. Every layout shows quiet panels, one featured element, and a block of brand or inverse color, with Sistema\'s craft baseline applied. Every parameter is optional. radius is the control radius (0 to 20); the other radii scale from it. font and display_font come from a fixed list of Google Fonts (an error lists them). neutral: cool or warm grays, tinted (grays tinted toward the accent), neutral (nearly neutral: a trace of the accent\'s hue, so the grays keep a temperature), or a color. Add content=<JSON> to use the product\'s own words, for example {"product": "Relay", "page_title": "Today", "table": {"columns": [...], "rows": [[...]]}, "statuses": {"Running late": "warning"}}. The fields depend on the layout; the JSON response lists them as content_fields with their placeholder values. A field the layout doesn\'t have, or a value of the wrong shape, is rejected with a message naming it. Status kinds are success, warning, error, info, and neutral.',
        `POST ${base}/api/specimen  {"accent": "#1E6B5C", "presence": "brand", "radius": 10, "content": {...}}`,
        'Returns: {"input", "seeds", "colors": {"<role>": {"hex", "from": "neutral 50"}}, "token_roles": {"<color.roles.required name>": {"hex", "from", "specimen_role"}}, "radius", "type", "space", "shadows", "notes", "content_fields", "placeholder_fields", "render": "<URL of the rendered page>"}. placeholder_fields lists the content fields still showing placeholder words; fill them before showing a render. token_roles names each color by the role the project\'s tokens will use, so the color play can take the same stop. Add format=html to get the page itself. Pass c (your visit ID) and the render URL keeps it. To compare options, show two or three render URLs side by side, changing one choice at a time.',
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

export function renderTools(base: string, tools: ToolName[], channel?: 'mcp' | 'skill'): string {
  if (tools.length === 0) return ''
  const blocks = tools.map(t => `**${TOOL_DOCS[t].title}**\n\n\`\`\`\n${TOOL_DOCS[t].usage(base)}\n\`\`\``)
  const how = channel === 'mcp'
    ? `Call the Sistema MCP server's ${tools.map(t => `\`${t}\``).join(', ')} ${tools.length === 1 ? 'tool' : 'tools'}. Each takes the same input as the POST body below and returns the same result. Never compute or estimate their results yourself.`
    : 'Use these tools. Never compute or estimate their results yourself.'
  return `## Tools\n\n${how}\n\n${blocks.join('\n\n')}`
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

  const tools = renderTools(ctx.base, play.tools, ctx.channel)
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
      `    ${playRef(ctx, s.play.id)}`,
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

/** For skills: where plays and the items they name live. */
const SKILL_ELSEWHERE = (base: string) =>
  `Each play is in this skill's \`references/\` folder as \`references/<id>.md\`. If one isn't there, it is at ${base}/raw/plays/<id>. Each opinion or rule a play names is at ${base}/raw/opinions/<id> or ${base}/raw/rules/<id>.`

const TELEMETRY = " If the URL you fetched this from has a `c` parameter, keep it on `continue` and record it in `sistema.json` as `telemetry.id`. It is an anonymous usage ID: Sistema counts how its workflows, plays, and tools are used, and records nothing about the person or the project's code."

/** Starter for a route workflow (workflow.session): orient, then one route per goal. */
function renderRoutesStarter(workflow: Workflow, ctx: RenderContext): string {
  const url = workflowUrl(ctx.base, workflow.id)
  const mcp = ctx.channel === 'mcp'
  const skill = ctx.channel === 'skill'
  const start = workflow.start_with ? ctx.plays.get(workflow.start_with) : undefined
  const tools = [...new Set(routePlays(workflow, ctx.plays).flatMap(p => p.tools))]
  const routeLines = Object.entries(workflow.routes ?? {}).flatMap(([name, route]) => {
    const plays = route.plays.map(id => ctx.plays.get(id)!)
    return [`- ${name} (${route.title}): ${plays.map(p => p.title).join(' → ')}`, ...plays.map(p => `    ${playRef(ctx, p.id)}`)]
  })

  const parts = [
    `# ${workflow.title}`,
    workflow.description,
    ...(workflow.body ? [workflow.body] : []),
    'You are running a Sistema workflow. Each session starts by orienting, then follows one route.',
    [
      '## Routes',
      '',
      ...(start ? [`Start every session with **${start.title}**: ${start.description}`, `    ${playRef(ctx, start.id)}`, ''] : []),
      'Then follow the route that fits the goal:',
      '',
      ...routeLines,
    ].join('\n'),
    [
      '## How to run it',
      '',
      ...(start ? [`1. Run ${start.title} (\`${start.id}\`). It reads the system's state, confirms the goal with the person, and picks a route. If the person's message already says what they want (for example, "I want to add a component: a date picker"), treat that as the goal and confirm it rather than asking again.`] : ['1. Ask the person for the goal of this session, and pick the route that fits. If their message already says what they want, confirm it rather than asking again.']),
      mcp
        ? "2. Run the route's plays in order. Get each with the Sistema MCP server's `read` tool (its ID) and follow it exactly."
        : skill
          ? `2. Run the route's plays in order. Read each from this skill's file (shown under its title above) and follow it exactly. ${SKILL_ELSEWHERE(ctx.base)}`
          : '2. Run the route\'s plays in order. Fetch each from its URL and follow it exactly.',
      "3. When a play's evidence is shown, record it in `sistema.json` `steps` (this replaces the record of that play's previous run) and add its line to DECISIONS.md.",
      '4. After each play, show one progress line, for example `add-component 1 of 2: specification done, implementation next`.',
      "5. When the route is done, say so, and ask whether there is another goal for this session. If there is, confirm it and pick its route. If no route fits a goal, say so, and agree with the person how to proceed outside Sistema's plays.",
      `6. Before ending any session, check \`sistema.json\` against the schema at ${stateSchemaUrl(ctx.base)} and fix anything that doesn't match.`,
    ].join('\n'),
    [
      '## State: sistema.json',
      '',
      `Set \`workflow\` to \`${workflowSlug(workflow.id)}\` and \`milestone\` to \`maintain\`. Keep \`continue\` at this workflow's URL, ${url}: this workflow is the standing entry point for design system work, so the Sistema section in the agent instructions file keeps pointing here.${mcp || skill ? '' : TELEMETRY} Only play IDs go in \`steps\`. Work done outside a play goes in DECISIONS.md.`,
    ].join('\n'),
    ...(tools.length ? [renderToolSummary(tools)] : []),
    ...(mcp || skill ? [] : [`If you cannot fetch URLs, use the full version, which includes every play: ${workflowFullUrl(ctx.base, workflow.id)}`]),
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
    'Close the workflow after the last approval, once any optional plays after it have been run or declined. Offer those optional plays in the same message as the thanks for the approval, so the person isn\'t asked twice. The person should come away knowing they have finished.',
    '',
    `1. **Land it.** Tell the person they have completed "${workflow.title}". In a few sentences, say what their project now has, naming the files and decisions this workflow produced, and where to see it (the review pages). Show the final outline with every step done. Make this the main message.`,
    entry
      ? `2. **Update the state and pointers.** In \`sistema.json\`, set \`continue\` to ${entry} (keeping its \`c\` parameter if it has one), \`workflow\` to \`session\`, and \`milestone\` to \`maintain\`. Replace the pointer line in DECISIONS.md, DESIGN.md, the review pages (the files in \`sistema-review/\` and any review route in the app, such as the component showcase), and the Sistema section of the agent instructions file with exactly: \`This project follows Sistema. "${workflow.title}" is finished. For later design system work, fetch the URL in sistema.json "continue".\` If the person goes straight on to another workflow in the same session, that workflow sets \`workflow\` and \`continue\` again; the finished workflow stays recorded by its completed steps, and a line in DECISIONS.md.`
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
  const mcp = ctx.channel === 'mcp'
  const skill = ctx.channel === 'skill'

  const parts = [
    `# ${workflow.title}`,
    workflow.description,
    ...(workflow.body ? [workflow.body] : []),
    'You are running a Sistema workflow. Work through it one play at a time.',
    [
      '## First: is this a resumed run?',
      '',
      'If `sistema.json` exists in the project root and its `workflow` is this one, or its `steps` already list plays from this workflow, this is a resumed run, whatever the person said ("continue", "pick up where I left off", or anything else). (A `sistema.json` left by an earlier workflow alone doesn\'t make this a resume: start this workflow\'s outline from its first play.) Read it, show the outline below with each step\'s status, and continue from the first step that is not complete or skipped. If a gate is waiting, ask for that approval first. Do not start other work until the workflow is finished or the person says to leave it.',
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
      ...(mcp
        ? [
            "2. If `sistema.json` `routing` maps that play to a different one, run that play instead. The Sistema MCP server's `next_step` tool does both: pass it this workflow and the contents of `sistema.json`, and it returns the play to run, or the approval that is waiting. Read any opinion, rule, or guide a play names with its `read` tool.",
            "3. Follow the play exactly.",
          ]
        : skill
          ? [
              `2. If \`sistema.json\` \`routing\` maps that play to a different one, run that play instead. ${SKILL_ELSEWHERE(ctx.base)}`,
              "3. Read the play's file, shown under its title in the outline, and follow it exactly.",
            ]
          : [
            `2. If \`sistema.json\` \`routing\` maps that play to a different one, run that play instead. Every play is at ${ctx.base}/raw/plays/<id>, and each opinion or rule a play names is at ${ctx.base}/raw/opinions/<id> or ${ctx.base}/raw/rules/<id>.`,
            "3. Fetch the play's instructions from its URL and follow them exactly.",
          ]),
      "4. If the play's outputs already exist and meet its checks, record it as complete with that evidence and move on.",
      '5. When a play\'s evidence is shown, record it in `sistema.json` and continue. Before an optional play, tell the person in one sentence what it gives them and ask whether they want it now. Say it can also be added later. If the play starts by asking the person something (for example, which pages to build), fetch it first and put that question in the same message, so one answer covers both. If they decline, record it as skipped. While optional plays are offered and not yet answered, the workflow stays open: `continue` stays on this workflow.',
      '6. At an approval, stop. Set the play before it to `in-progress`, ask the person to review, and continue only after they approve. Then record the gate and mark the play complete. Tell the person they can stop at any approval and pick up later in any new session.',
      '7. Set `milestone` to the milestone of the next unfinished play.',
      `8. Before ending any session, check \`sistema.json\` against the schema at ${stateSchemaUrl(ctx.base)} and fix anything that doesn't match.`,
    ].join('\n'),
    [
      '## State: sistema.json',
      '',
      'Use exactly this shape. Only play IDs go in `steps`. Status is one of `pending`, `in-progress` (started and waiting at an approval or on an answer from the person), `complete`, or `skipped`. `milestone` is one of `direction`, `foundations`, `patterns`, or `maintain`. Work done outside a play goes in DECISIONS.md, not in `steps`. A gate with `withdrawn` is not approved: a change reopened the steps before it (`project.revise`), and it needs approving again.',
      '',
      '```json',
      stateExample(workflow, ctx),
      '```',
      '',
      `\`continue\` is this workflow's URL: ${url}. The first play also adds a short Sistema section to the project's AGENTS.md or CLAUDE.md that points to it, so a new session finds its way back. If that section is missing when you resume, add it as \`project.assess\` describes.${mcp || skill ? '' : TELEMETRY}`,
    ].join('\n'),
    ...(tools.length ? [renderToolSummary(tools)] : []),
    workflowEnd(workflow, ctx, next, workflows),
    ...(mcp || skill ? [] : [`If you cannot fetch URLs, use the full version, which includes every play: ${workflowFullUrl(ctx.base, workflow.id)}`]),
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
