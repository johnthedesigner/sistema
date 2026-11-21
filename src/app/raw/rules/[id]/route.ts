import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderRuleItem } from '@/lib/content/render-reference'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().rules.map(r => ({ id: r.id }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rule = loadCatalog().ruleById.get(id)
  if (!rule) return new Response('Not found', { status: 404 })
  return textResponse(renderRuleItem(rule))
}
