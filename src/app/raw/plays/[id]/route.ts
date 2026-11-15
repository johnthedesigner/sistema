import { loadCatalog } from '@/lib/content/load'
import { buildContext, textResponse } from '@/lib/content/context'
import { renderPlay } from '@/lib/content/render'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().plays.map(p => ({ id: p.id }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const catalog = loadCatalog()
  const play = catalog.playById.get(id)
  if (!play) return new Response('Not found', { status: 404 })
  return textResponse(renderPlay(play, buildContext(catalog)))
}
