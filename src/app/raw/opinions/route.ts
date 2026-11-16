import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderOpinions } from '@/lib/content/render-reference'

export const dynamic = 'force-static'

export function GET() {
  return textResponse(renderOpinions(loadCatalog()))
}
