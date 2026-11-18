import type { NextRequest } from 'next/server'
import { ACCEPTED_FORMATS } from '@/lib/color'
import { checkPair, chooseStandard } from '@/lib/tools/contrast'
import { badRequest, json, options, readJson } from '@/lib/tools/http'

/**
 * Contrast (tool-apis.md section 2).
 *   GET  /api/contrast?fg=<color>&bg=<color>[&fg=..&bg=..][&label=..][&standard=wcag-2.2&level=AA]   up to 50 pairs
 *   POST /api/contrast { standard?, level?, pairs: [{ foreground, background, label? }] }             up to 200 pairs
 *   POST /api/contrast { standard?, level?, foreground, background }                                   one pair
 * Always returns { standard, level, defaulted?, results: [...] }. In a batch, an invalid pair gets
 * { error } in its slot; a request with one pair that fails returns 400.
 */
const MAX_GET_PAIRS = 50
const MAX_POST_PAIRS = 200
const EXAMPLE = '/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&standard=wcag-2.2&level=AA'

type PairInput = { foreground: unknown; background: unknown; label?: unknown }

function respond(pairs: PairInput[], standardRaw: unknown, levelRaw: unknown, max: number) {
  if (pairs.length === 0) return badRequest(`Give at least one pair of colors (${ACCEPTED_FORMATS}).`, EXAMPLE)
  if (pairs.length > max) return badRequest(`At most ${max} pairs per request.`, EXAMPLE)
  const std = chooseStandard(standardRaw, levelRaw)
  if (!std.ok) return badRequest(std.error, EXAMPLE)
  const results = pairs.map(p => checkPair(p.foreground, p.background, std.standard, std.level, typeof p.label === 'string' ? p.label : undefined))
  if (results.length === 1 && 'error' in results[0]) return badRequest(results[0].error, EXAMPLE)
  return json({ standard: std.standard, level: std.level, ...(std.defaulted ? { defaulted: true } : {}), results })
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const fgs = q.getAll('fg')
  const bgs = q.getAll('bg')
  const labels = q.getAll('label')
  if (fgs.length !== bgs.length) {
    return badRequest(`Each "fg" needs a matching "bg", in order (got ${fgs.length} fg and ${bgs.length} bg).`, EXAMPLE)
  }
  const pairs = fgs.map((fg, i) => ({ foreground: fg, background: bgs[i], label: labels[i] }))
  return respond(pairs, q.get('standard') ?? undefined, q.get('level') ?? undefined, MAX_GET_PAIRS)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  if (typeof body !== 'object' || body === null) {
    return badRequest(`Send JSON: { "pairs": [{ "foreground", "background", "label"? }] }, with colors as ${ACCEPTED_FORMATS}.`, EXAMPLE)
  }
  const b = body as Record<string, unknown>
  if (b.pairs !== undefined) {
    if (!Array.isArray(b.pairs)) return badRequest('"pairs" must be an array of { foreground, background, label? }.', EXAMPLE)
    const pairs = b.pairs.map(p => (typeof p === 'object' && p !== null ? p : {}) as PairInput)
    return respond(pairs, b.standard, b.level, MAX_POST_PAIRS)
  }
  return respond([{ foreground: b.foreground, background: b.background, label: b.label }], b.standard, b.level, 1)
}

export const OPTIONS = options
