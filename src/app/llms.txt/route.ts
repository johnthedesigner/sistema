import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderLlmsTxt } from '@/lib/content/render-reference'
import { SITE_URL } from '@/lib/site-url'

export const dynamic = 'force-static'

export function GET() {
  return textResponse(renderLlmsTxt(loadCatalog(), SITE_URL))
}
