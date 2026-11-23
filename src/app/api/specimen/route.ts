import { NextResponse, type NextRequest } from 'next/server'
import { buildSpecimen, type SpecimenInput } from '@/lib/specimen'
import { renderSpecimenHtml, type SpecimenContent } from '@/lib/specimen-html'
import { CONTENT_DEFAULTS, validateContent } from '@/lib/specimen-content'
import { TOKEN_ROLES } from '@/lib/specimen-roles'
import { SITE_URL } from '@/lib/site-url'
import { badRequest, CORS_HEADERS, json, options, readJson, trackToolCall } from '@/lib/tools/http'

/**
 * Specimen (D25, docs/v2/aesthetic-baseline.md).
 *   GET  /api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&density=comfortable&font=Figtree&theme=light
 *        add format=html for the rendered page; content=<JSON> replaces the placeholder content
 *   POST /api/specimen { accent, neutral, presence, radius, chips, separation, density, font, display_font, theme, layout, content, format }
 * layout: operations (default), dashboard, record, marketing, article, or shop.
 * JSON responses hold every role with the ramp stop it comes from, the radius,
 * type, spacing, and shadow values, and `render`, the URL of the rendered page.
 */
const EXAMPLE = '/api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&density=comfortable&font=Figtree'
const KEYS = ['accent', 'neutral', 'presence', 'radius', 'chips', 'separation', 'density', 'font', 'display_font', 'theme', 'layout'] as const

function renderUrl(input: Record<string, unknown>, content?: SpecimenContent, c?: unknown): string {
  const q = new URLSearchParams()
  for (const k of KEYS) if (input[k] !== undefined && input[k] !== '') q.set(k, String(input[k]))
  if (content) q.set('content', JSON.stringify(content))
  q.set('format', 'html')
  if (typeof c === 'string' && c) q.set('c', c)
  return `${SITE_URL}/api/specimen?${q.toString()}`
}

function respond(request: Request, raw: SpecimenInput, content: SpecimenContent | undefined, format: unknown, c?: unknown) {
  const result = buildSpecimen(raw)
  const status = result.ok ? 200 : 400
  trackToolCall(request, 'specimen', { c, status, format: format ?? 'json', ...raw, content: content ? 'custom' : undefined })
  if (!result.ok) return badRequest(result.error, EXAMPLE)
  const layout = result.specimen.input.layout
  if (content) {
    const err = validateContent(layout, content as Record<string, unknown>)
    if (err) return badRequest(err, EXAMPLE)
  }
  if (format === 'html') {
    return new NextResponse(renderSpecimenHtml(result.specimen, content as Record<string, unknown> | undefined), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
  const roles = Object.fromEntries(
    Object.entries(TOKEN_ROLES).flatMap(([token, specimenRole]) => {
      const role = result.specimen.colors[specimenRole]
      return role ? [[token, { ...role, specimen_role: specimenRole }]] : []
    }),
  )
  // Fields the content left out render the placeholder product's words: name them, so a render never mixes two products unnoticed.
  const placeholder = Object.keys(CONTENT_DEFAULTS[layout] ?? {}).filter(k => !content || !(k in content))
  const notes = placeholder.length
    ? [...result.specimen.notes, `${content ? 'These content fields still show placeholder content from another product' : 'This render shows placeholder content from another product'}: ${placeholder.join(', ')}. Fill them with the product's own words before showing it to the person.`]
    : result.specimen.notes
  return json({ ...result.specimen, notes, token_roles: roles, content_fields: CONTENT_DEFAULTS[layout], placeholder_fields: placeholder, render: renderUrl(result.specimen.input, content, c) })
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
  return respond(request, raw as SpecimenInput, content, q.get('format') ?? undefined, q.get('c') ?? undefined)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return badRequest('Send JSON: { "accent": "#1E6B5C", "presence": "brand", "radius": 10 }', EXAMPLE)
  }
  const b = body as Record<string, unknown>
  const content = parseContent(b.content)
  if (typeof content === 'string') return badRequest(content, EXAMPLE)
  return respond(request, b as SpecimenInput, content, b.format ?? request.nextUrl.searchParams.get('format') ?? undefined, b.c ?? request.nextUrl.searchParams.get('c') ?? undefined)
}

export const OPTIONS = options
