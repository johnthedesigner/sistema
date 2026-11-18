import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderGuideRaw } from '@/lib/content/render-reference'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().guides.map(g => ({ topic: g.topic, name: g.id.split('.')[2] }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ topic: string; name: string }> }) {
  const { topic, name } = await params
  const guide = loadCatalog().guideById.get(`guide.${topic}.${name}`)
  if (!guide) return new Response('Not found', { status: 404 })
  return textResponse(renderGuideRaw(guide, loadCatalog().sourceById))
}
