import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderAgents } from '@/lib/content/render-reference'
import { SITE_URL } from '@/lib/site-url'

export const dynamic = 'force-static'

export function GET() {
  return textResponse(renderAgents(loadCatalog(), SITE_URL))
}
