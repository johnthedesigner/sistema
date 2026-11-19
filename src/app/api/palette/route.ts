import type { NextRequest } from 'next/server'
import { ACCEPTED_FORMATS, parseColor } from '@/lib/color'
import { generatePalettes } from '@/lib/palette'
import { badRequest, json, options, readJson, RESERVED_PARAMS, trackToolCall } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'

/**
 * Palette (tool-apis.md section 3).
 *   GET  /api/palette?<name>=<color>[&<name>=<color>...]   up to 12 seeds
 *   POST /api/palette { colors: { <name>: <color> } }
 * Returns { palettes: { <name>: { seed, seed_mapped?, stops: { "50".."950": { hex, oklch, contrast_white, contrast_black } } } } }.
 */
const MAX_SEEDS = LIMITS.palette.seeds
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/
const EXAMPLE = '/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)'

/** Respond, then record the call with its seeds and status. */
function tracked(request: Request, colors: Record<string, unknown>, bodyId?: unknown) {
  const res = respond(colors)
  trackToolCall(request, 'palette', { c: bodyId, status: res.status, items: Object.keys(colors).length, seeds: colors })
  return res
}

function respond(colors: Record<string, unknown>) {
  const entries = Object.entries(colors)
  if (entries.length === 0) return badRequest(`Give at least one named seed color (${ACCEPTED_FORMATS}).`, EXAMPLE)
  if (entries.length > MAX_SEEDS) return badRequest(`At most ${MAX_SEEDS} seeds per request.`, EXAMPLE)

  const invalid: string[] = []
  const seeds: Record<string, string> = {}
  const mapped = new Set<string>()
  for (const [name, value] of entries) {
    if (RESERVED_PARAMS.has(name)) {
      invalid.push(`${name}: this name is reserved; use another seed name`)
      continue
    }
    if (!NAME_RE.test(name)) {
      invalid.push(`${name}: seed names use letters, digits, hyphens, and underscores (up to 40)`)
      continue
    }
    const parsed = parseColor(value)
    if (!parsed.ok) invalid.push(`${name}: ${parsed.error}`)
    else {
      seeds[name] = parsed.color.hex
      if (parsed.color.mapped) mapped.add(name)
    }
  }
  if (invalid.length > 0) return badRequest('Invalid seeds.', EXAMPLE, { details: invalid })

  const palettes = generatePalettes(seeds)
  const out: Record<string, unknown> = {}
  for (const [name, p] of Object.entries(palettes)) {
    const stops = Object.fromEntries(
      Object.entries(p.stops).map(([stop, s]) => [stop, { hex: s.hex.toUpperCase(), oklch: s.oklch, contrast_white: s.contrast_white, contrast_black: s.contrast_black }]),
    )
    out[name] = { seed: p.seed.toUpperCase(), ...(mapped.has(name) ? { seed_mapped: true } : {}), stops }
  }
  return json({ palettes: out })
}

export function GET(request: NextRequest) {
  const colors: Record<string, string> = {}
  for (const [name, value] of request.nextUrl.searchParams) if (name !== 'c') colors[name] = value
  return tracked(request, colors)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const colors = b.colors
  if (typeof colors !== 'object' || colors === null || Array.isArray(colors)) {
    trackToolCall(request, 'palette', { c: b.c, status: 400, error: 'invalid body' })
    return badRequest(`Send JSON: { "colors": { "<name>": "<color>" } }, with colors as ${ACCEPTED_FORMATS}.`, EXAMPLE)
  }
  return tracked(request, colors as Record<string, unknown>, b.c)
}

export const OPTIONS = options
