/**
 * Agent Skill downloads: /skills/sistema-<workflow>.zip, one per workflow,
 * built at build time from the same content as /raw and the MCP server.
 */
import { loadCatalog } from '@/lib/content/load'
import { buildContext } from '@/lib/content/context'
import { skillName, skillZip } from '@/lib/content/render-skill'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().workflows.map(w => ({ file: `${skillName(w.id)}.zip` }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const catalog = loadCatalog()
  const workflow = catalog.workflows.find(w => `${skillName(w.id)}.zip` === file)
  if (!workflow) return new Response('Not found', { status: 404 })
  const zip = skillZip(workflow, catalog, buildContext(catalog))
  return new Response(zip as BodyInit, {
    headers: { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="${file}"` },
  })
}
