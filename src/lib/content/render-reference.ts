/**
 * Plain-text renderers for guides, opinions, rules, the agents page, and
 * llms.txt. Every URL is absolute (built from ctx.base).
 */
import type { Catalog } from './load'
import type { Guide } from './parse'
import { guideRawUrl, opinionsUrl, playUrl, renderRule, renderTools, rulesUrl, stateSchemaUrl, workflowUrl } from './render'
import { OPINION_GROUPS, TOPICS } from './schema'

const OPINION_GROUP_TITLES: Record<string, string> = {
  method: 'How Sistema works',
  process: 'Process',
  structure: 'Structure',
  'quality-floor': 'Quality floor',
  boundary: "What Sistema doesn't set",
}

const guideName = (g: Guide) => g.id.split('.')[2]
const ORDER = ['workflow.start', 'workflow.patterns', 'workflow.session']

export function renderGuideRaw(guide: Guide): string {
  const body = guide.body.replace(/^# .*\n+/, '')
  return [`# ${guide.title}`, guide.description, `Last reviewed: ${guide.last_reviewed}`, ...(guide.note ? [guide.note] : []), body].join('\n\n') + '\n'
}

export function renderOpinions(c: Catalog): string {
  const parts = [
    "# Sistema's opinions",
    "Defaults Sistema holds about process, structure, and the quality floor. It doesn't decide what a product looks like. A project can override any opinion outside \"How Sistema works\": record the override in DECISIONS.md like any decision, naming the opinion (for example, \"Overrides opinion.two-tiers\"), and follow the override from then on.",
  ]
  for (const group of OPINION_GROUPS) {
    const items = c.opinions.filter(o => o.group === group)
    if (!items.length) continue
    parts.push(`## ${OPINION_GROUP_TITLES[group]}`)
    for (const o of items) {
      const body = o.body.replace(/^## /gm, '#### ')
      parts.push(`### ${o.title} (\`${o.id}\`)\n\n${o.default}\n\n${body}${o.rules.length ? `\n\nRules: ${o.rules.join(', ')}` : ''}`)
    }
  }
  return parts.join('\n\n') + '\n'
}

export function renderRules(c: Catalog): string {
  const parts = [
    '# Sistema rules',
    "Required rules must pass before a play is done. Advisory rules raise a flag and suggest a fix. Where values depend on the accessibility standard, use the values for the standard in `sistema.json` `project.a11y_standard`.",
  ]
  for (const topic of TOPICS) {
    const rules = c.rules.filter(r => r.id.startsWith(`${topic}.`))
    if (rules.length) parts.push(`## ${topic}\n\n${rules.map(renderRule).join('\n')}`)
  }
  return parts.join('\n\n') + '\n'
}

function howAgentsUseSistema(base: string): string {
  return [
    '## How agents should use Sistema',
    '',
    `- To start a design system, or bring Sistema to an existing one, fetch ${workflowUrl(base, 'workflow.start')} and follow it.`,
    `- For ongoing work (components, themes, audits, reviews, planning), fetch ${workflowUrl(base, 'workflow.session')} and follow it.`,
    '- If `sistema.json` exists in the project root, read it first and fetch the URL in its `continue` field before doing anything else.',
    '- Use the palette and contrast tools for any value they calculate. Never estimate those values.',
    `- Check \`sistema.json\` against the schema at ${stateSchemaUrl(base)} before ending a session.`,
  ].join('\n')
}

export function renderAgents(c: Catalog, base: string): string {
  return [
    '# Sistema, for agents',
    "Sistema is a method and a set of tools for building a design system in a project's repository. Work is organized as workflows made of plays. Each play has a procedure, the rules it applies, and the evidence it must show before it's done.",
    howAgentsUseSistema(base),
    renderTools(base, ['palette', 'contrast']),
    `## More\n\n- Every workflow, play, and guide: ${base}/llms.txt\n- Opinions: ${opinionsUrl(base)}\n- Rules: ${rulesUrl(base)}`,
  ].join('\n\n') + '\n'
}

export function renderLlmsTxt(c: Catalog, base: string): string {
  const workflows = [...c.workflows].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
  const guides = [...c.guides].sort((a, b) => TOPICS.indexOf(a.topic) - TOPICS.indexOf(b.topic) || a.id.localeCompare(b.id))
  return [
    '# Sistema',
    "> Sistema guides an AI coding agent through building a design system in a project's repository: direction, tokens, components, and ongoing maintenance, with a person's approval at each milestone.",
    howAgentsUseSistema(base),
    `## Workflows\n\n${workflows.map(w => `- [${w.title}](${workflowUrl(base, w.id)}): ${w.description}`).join('\n')}`,
    `## Plays\n\n${c.plays.map(p => `- [${p.title}](${playUrl(base, p.id)}): ${p.description}`).join('\n')}`,
    `## Guides\n\n${guides.map(g => `- [${g.title}](${guideRawUrl(base, g.topic, guideName(g))}): ${g.description}`).join('\n')}`,
    `## Reference\n\n- [Opinions](${opinionsUrl(base)}): the defaults Sistema holds, why, and when to choose otherwise.\n- [Rules](${rulesUrl(base)}): every rule plays apply, with values by accessibility standard.\n- [sistema.json schema](${stateSchemaUrl(base)}): the project state file.\n- [For agents](${base}/raw/agents): this guidance plus tool request shapes.`,
  ].join('\n\n') + '\n'
}
