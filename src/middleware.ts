/**
 * Usage analytics for agent fetches (docs/v2/analytics.md). Every request to /raw
 * and /llms.txt sends an `agent_fetch` event without delaying the response. A /raw
 * request with a valid visit ID (`c`) is rewritten to /raw-with-id, which serves
 * the same content with `c` added to every Sistema URL. Tool APIs send their own
 * `tool_call` events from their routes.
 */
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'
import { rawKind, validVisitId } from '@/lib/analytics/ids'
import { capture } from '@/lib/analytics/server'

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname, searchParams } = request.nextUrl
  const visitId = validVisitId(searchParams.get('c'))
  const what = pathname === '/llms.txt' ? { kind: 'llms' } : rawKind(pathname)
  event.waitUntil(capture({ event: 'agent_fetch', visitId, properties: { ...what, path: pathname } }, request.headers))

  if (visitId && pathname.startsWith('/raw/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/raw\//, '/raw-with-id/')
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/raw/:path*', '/llms.txt'],
}
