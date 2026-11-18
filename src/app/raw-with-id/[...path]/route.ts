/**
 * /raw content for a request that carries a visit ID (`c`). Middleware rewrites
 * /raw/...?c=<id> here; requests without `c` get the pre-built static files.
 * Each path is served by the same handler as /raw, then every Sistema URL in the
 * text gets `c` added, so the agent carries the ID into the plays, guides, and tool
 * calls it fetches next (docs/v2/analytics.md section 2).
 */
import { SITE_URL } from '@/lib/site-url'
import { validVisitId, withVisitId } from '@/lib/analytics/ids'
import { GET as agents } from '../../raw/agents/route'
import { GET as file } from '../../raw/files/[name]/route'
import { GET as guide } from '../../raw/guides/[topic]/[name]/route'
import { GET as opinions } from '../../raw/opinions/route'
import { GET as play } from '../../raw/plays/[id]/route'
import { GET as rules } from '../../raw/rules/route'
import { GET as schema } from '../../raw/schema/sistema.json/route'
import { GET as sources } from '../../raw/sources/route'
import { GET as workflowFull } from '../../raw/workflows/[id]/full/route'
import { GET as workflow } from '../../raw/workflows/[id]/route'

export const dynamic = 'force-dynamic'

const p = <T,>(v: T) => ({ params: Promise.resolve(v) })

async function original(req: Request, seg: string[]): Promise<Response | null> {
  const [a, b, c, d] = seg
  if (a === 'plays' && b && !c) return play(req, p({ id: b }))
  if (a === 'workflows' && b && c === 'full' && !d) return workflowFull(req, p({ id: b }))
  if (a === 'workflows' && b && !c) return workflow(req, p({ id: b }))
  if (a === 'guides' && b && c && !d) return guide(req, p({ topic: b, name: c }))
  if (a === 'files' && b && !c) return file(req, p({ name: b }))
  if (seg.length === 1 && a === 'opinions') return opinions()
  if (seg.length === 1 && a === 'rules') return rules()
  if (seg.length === 1 && a === 'sources') return sources()
  if (seg.length === 1 && a === 'agents') return agents()
  if (a === 'schema' && b === 'sistema.json' && !c) return schema()
  return null
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const res = await original(req, path)
  if (!res) return new Response('Not found', { status: 404 })
  const id = validVisitId(new URL(req.url).searchParams.get('c'))
  if (!id || !res.ok) return res
  const text = await res.text()
  return new Response(withVisitId(text, id, SITE_URL), { status: res.status, headers: res.headers })
}
