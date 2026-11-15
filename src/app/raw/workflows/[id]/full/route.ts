import { loadCatalog } from '@/lib/content/load'
import { buildContext, textResponse } from '@/lib/content/context'
import { renderWorkflowFull, workflowSlug } from '@/lib/content/render'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().workflows.map(w => ({ id: workflowSlug(w.id) }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const catalog = loadCatalog()
  const workflow = catalog.workflowById.get(`workflow.${id}`)
  if (!workflow) return new Response('Not found', { status: 404 })
  return textResponse(renderWorkflowFull(workflow, buildContext(catalog), catalog.workflowById))
}
