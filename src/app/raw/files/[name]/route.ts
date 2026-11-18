import { loadCatalog } from '@/lib/content/load'
import { textResponse } from '@/lib/content/context'
import { renderFileRaw } from '@/lib/content/render-reference'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return loadCatalog().files.map(f => ({ name: f.name }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const c = loadCatalog()
  const file = c.fileById.get(`file.${name}`)
  if (!file) return new Response('Not found', { status: 404 })
  return textResponse(renderFileRaw(file, c.sourceById))
}
