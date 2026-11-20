import { NextResponse, type NextRequest } from 'next/server'
import { buildSpecimen, type SpecimenInput } from '@/lib/specimen'
import { renderSpecimenHtml, type SpecimenContent } from '@/lib/specimen-html'
import { SITE_URL } from '@/lib/site-url'
import { badRequest, CORS_HEADERS, json, options, readJson, trackToolCall } from '@/lib/tools/http'

/**
 * Specimen (D25, docs/v2/aesthetic-baseline.md).
 *   GET  /api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&density=comfortable&font=Figtree&theme=light
 *        add format=html for the rendered page; content=<JSON> replaces the placeholder content
 *   POST /api/specimen { accent, neutral, presence, radius, chips, separation, density, font, display_font, theme, content, format }
 * JSON responses hold every role with the ramp stop it comes from, the radius,
 * type, spacing, and shadow values, and `render`, the URL of the rendered page.
 */
const EXAMPLE = '/api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&density=comfortable&font=Figtree'
const KEYS = ['accent', 'neutral', 'presence', 'radius', 'chips', 'separation', 'density', 'font', 'display_font', 'theme'] as const

function renderUrl(input: Record<string, unknown>, content?: SpecimenContent): string {
  const q = new URLSearchParams()
  for (const k of KEYS) if (input[k] !== undefined && input[k] !== '') q.set(k, String(input[k]))
  if (content) q.set('content', JSON.stringify(content))
  q.set('format', 'html')
  return `${SITE_URL}/api/specimen?${q.toString()}`
}

function respond(request: Request, raw: SpecimenInput, content: SpecimenContent | undefined, format: unknown, c?: unknown) {
  const result = buildSpecimen(raw)
  const status = result.ok ? 200 : 400
  trackToolCall(request, 'specimen', { c, status, format: format ?? 'json', ...raw, content: content ? 'custom' : undefined })
  if (!result.ok) return badRequest(result.error, EXAMPLE)
  if (format === 'html') {
    return new NextResponse(renderSpecimenHtml(result.specimen, content), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
  return json({ ...result.specimen, render: renderUrl(result.specimen.input, content) })
}

function parseContent(raw: unknown): SpecimenContent | undefined | string {
  if (raw === undefined || raw === null || raw === '') return undefined
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw as SpecimenContent
  if (typeof raw === 'string') {
    try {
      const v = JSON.parse(raw)
      if (v && typeof v === 'object' && !Array.isArray(v)) return v
    } catch {}
  }
  return '"content" must be a JSON object, for example {"product": "Relay", "page_title": "Today"}.'
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const content = parseContent(q.get('content') ?? undefined)
  if (typeof content === 'string') {
    trackToolCall(request, 'specimen', { status: 400, error: content })
    return badRequest(content, EXAMPLE)
  }
  const raw: Record<string, unknown> = {}
  for (const k of KEYS) {
    const v = q.get(k)
    if (v !== null) raw[k] = k === 'radius' ? (v === '' ? undefined : Number(v)) : v
  }
  return respond(request, raw as SpecimenInput, content, q.get('format') ?? undefined)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return badRequest('Send JSON: { "accent": "#1E6B5C", "presence": "brand", "radius": 10 }', EXAMPLE)
  }
  const b = body as Record<string, unknown>
  const content = parseContent(b.content)
  if (typeof content === 'string') return badRequest(content, EXAMPLE)
  return respond(request, b as SpecimenInput, content, b.format, b.c)
}

export const OPTIONS = options
