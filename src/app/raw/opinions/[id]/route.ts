import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderOpinion } from '@/lib/content/render-reference'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().opinions.map(o => ({ id: o.id }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opinion = loadCatalog().opinionById.get(id)
  if (!opinion) return new Response('Not found', { status: 404 })
  return textResponse(renderOpinion(opinion))
}
