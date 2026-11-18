/**
 * Shared HTTP handling for the tool APIs (tool-apis.md section 1): JSON
 * responses open to any origin, errors that carry a working example URL, and
 * the optional anonymous ID `c` (ignored in calculations; used for analytics
 * from V2.8).
 */
import { after, NextResponse } from 'next/server'
import { capture } from '@/lib/analytics/server'
import { SITE_URL } from '@/lib/site-url'

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

/** A 400 with a message and a working GET example, so an agent can fix its own call. */
export function badRequest(error: string, examplePath: string, extra: Record<string, unknown> = {}): NextResponse {
  return json({ error, ...extra, example: `${SITE_URL}${examplePath}` }, 400)
}

export function options(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

/** Read a JSON body, or null when it isn't valid JSON. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/** Query parameters reserved by every tool. `c` is the anonymous analytics ID. */
export const RESERVED_PARAMS = new Set(['c', 'standard', 'level', 'format'])

/**
 * Record a tool call (docs/v2/analytics.md section 3) after the response is sent.
 * Outside a request (tests), this does nothing.
 */
export function trackToolCall(request: Request, tool: string, properties: Record<string, unknown>): void {
  trackEvent(request, 'tool_call', { tool, ...properties })
}

/** Send a usage event after the response. Outside a request (tests), this does nothing. */
export function trackEvent(request: Request, event: string, properties: Record<string, unknown>): void {
  const fromBody = typeof properties.c === 'string' ? properties.c : undefined
  const visitId = new URL(request.url).searchParams.get('c') ?? fromBody
  try {
    after(() => capture({ event, visitId, properties: { method: request.method, ...properties } }, request.headers))
  } catch {
    // No request scope (unit tests): nothing to send.
  }
}
