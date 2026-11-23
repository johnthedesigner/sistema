/**
 * Agent Skills (capability model section 6): one skill per workflow, built from
 * the same content as the paste-in prompt and the MCP server. SKILL.md holds the
 * run loop; each play is a file in references/, read when its step is reached.
 * Tools and guides stay on the hosted site. Front matter uses only `name` and
 * `description`, the fields every client reads (agentskills.io specification).
 */
import { zipSync, strToU8 } from 'fflate'
import type { Catalog } from './load'
import type { Workflow } from './parse'
import { renderPlay, renderWorkflowStarter, routePlays, workflowSlug, workflowSteps, type RenderContext } from './render'

export const skillName = (workflowId: string) => `sistema-${workflowSlug(workflowId)}`

const yamlString = (s: string) => JSON.stringify(s)

/** The plays a skill carries: its workflow's, plus any play those name (such as a routing target), followed to the end. */
export function skillPlays(workflow: Workflow, catalog: Catalog): string[] {
  const direct = workflow.routes
    ? routePlays(workflow, catalog.playById).map(p => p.id)
    : workflowSteps(workflow, catalog.playById).steps.map(s => s.play.id)
  const ids = new Set(direct)
  const queue = [...direct]
  while (queue.length) {
    const play = catalog.playById.get(queue.shift()!)
    if (!play) continue
    for (const other of catalog.plays) {
      if (ids.has(other.id)) continue
      if (new RegExp(`(?<![a-z0-9.-])${other.id.replace(/\./g, '\\.')}(?![a-z0-9-])`).test(play.body)) {
        ids.add(other.id)
        queue.push(other.id)
      }
    }
  }
  return [...ids]
}

/** Every file in one workflow's skill, keyed by its path inside the skill folder. */
export function renderSkill(workflow: Workflow, catalog: Catalog, base: RenderContext): Record<string, string> {
  const ctx: RenderContext = { ...base, channel: 'skill' }
  const name = skillName(workflow.id)
  const description = `Sistema's "${workflow.title}" workflow. ${workflow.description} Use it when the person asks to ${workflow.title.charAt(0).toLowerCase()}${workflow.title.slice(1)}, or to continue Sistema work recorded in sistema.json.`
  const files: Record<string, string> = {
    'SKILL.md': `---\nname: ${name}\ndescription: ${yamlString(description)}\n---\n\n${renderWorkflowStarter(workflow, ctx, catalog.workflowById)}`,
  }
  for (const id of skillPlays(workflow, catalog)) {
    const play = catalog.playById.get(id)
    if (play) files[`references/${id}.md`] = renderPlay(play, ctx)
  }
  return files
}

/** The skill as a zip, with its files inside a folder named for the skill, ready to unzip into a skills directory. */
export function skillZip(workflow: Workflow, catalog: Catalog, base: RenderContext): Uint8Array {
  const name = skillName(workflow.id)
  const files = renderSkill(workflow, catalog, base)
  // A fixed date keeps the build output identical between builds.
  const mtime = new Date('2026-01-01T00:00:00Z')
  return zipSync(Object.fromEntries(Object.entries(files).map(([path, text]) => [`${name}/${path}`, [strToU8(text), { mtime }]])))
}
