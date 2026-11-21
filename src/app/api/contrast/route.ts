import type { NextRequest } from 'next/server'
import { ACCEPTED_FORMATS } from '@/lib/color'
import { checkPair, chooseStandard } from '@/lib/tools/contrast'
import { badRequest, json, options, readJson, trackToolCall } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'

/**
 * Contrast (tool-apis.md section 2).
 *   GET  /api/contrast?fg=<color>&bg=<color>[&fg=..&bg=..][&label=..][&standard=wcag-2.2&level=AA]   up to 50 pairs
 *   POST /api/contrast { standard?, level?, pairs: [{ foreground, background, label?, purpose? }] }   up to 200 pairs
 * purpose: text | large_text | ui (only that check) or informational (the ratio, no checks).
 *   POST /api/contrast { standard?, level?, foreground, background }                                   one pair
 * Always returns { standard, level, defaulted?, results: [...] }. In a batch, an invalid pair gets
 * { error } in its slot; a request with one pair that fails returns 400.
 */
const MAX_GET_PAIRS = LIMITS.contrast.get_pairs
const MAX_POST_PAIRS = LIMITS.contrast.post_pairs
const EXAMPLE = '/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&standard=wcag-2.2&level=AA'

type PairInput = { foreground: unknown; background: unknown; label?: unknown; purpose?: unknown }

function respond(request: Request, pairs: PairInput[], standardRaw: unknown, levelRaw: unknown, max: number, bodyId?: unknown) {
  const track = (status: number, extra: Record<string, unknown> = {}) =>
    trackToolCall(request, 'contrast', {
      c: bodyId,
      status,
      items: pairs.length,
      standard: typeof standardRaw === 'string' ? standardRaw : undefined,
      level: typeof levelRaw === 'string' ? levelRaw : undefined,
      pairs: pairs.slice(0, 50).map(p => ({ foreground: p.foreground, background: p.background, label: p.label })),
      ...extra,
    })
  const fail = (error: string) => {
    track(400, { error })
    return badRequest(error, EXAMPLE)
  }
  if (pairs.length === 0) return fail(`Give at least one pair of colors (${ACCEPTED_FORMATS}).`)
  if (pairs.length > max) return fail(`At most ${max} pairs per request.`)
  const std = chooseStandard(standardRaw, levelRaw)
  if (!std.ok) return fail(std.error)
  const results = pairs.map(p => checkPair(p.foreground, p.background, std.standard, std.level, typeof p.label === 'string' ? p.label : undefined, undefined, p.purpose))
  if (results.length === 1 && 'error' in results[0]) return fail(results[0].error)
  const failing = results.filter(r => 'checks' in r && Object.values(r.checks).some(c => c && !c.pass)).length
  track(200, { standard: std.standard, level: std.level, defaulted: std.defaulted, invalid: results.filter(r => 'error' in r).length, failing })
  return json({ standard: std.standard, level: std.level, ...(std.defaulted ? { defaulted: true } : {}), results })
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const fgs = q.getAll('fg')
  const bgs = q.getAll('bg')
  const labels = q.getAll('label')
  const purposes = q.getAll('purpose')
  if (fgs.length !== bgs.length) {
    const error = `Each "fg" needs a matching "bg", in order (got ${fgs.length} fg and ${bgs.length} bg).`
    trackToolCall(request, 'contrast', { status: 400, error })
    return badRequest(error, EXAMPLE)
  }
  const pairs = fgs.map((fg, i) => ({ foreground: fg, background: bgs[i], label: labels[i], purpose: purposes[i] }))
  return respond(request, pairs, q.get('standard') ?? undefined, q.get('level') ?? undefined, MAX_GET_PAIRS)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  if (typeof body !== 'object' || body === null) {
    trackToolCall(request, 'contrast', { status: 400, error: 'invalid JSON' })
    return badRequest(`Send JSON: { "pairs": [{ "foreground", "background", "label"? }] }, with colors as ${ACCEPTED_FORMATS}.`, EXAMPLE)
  }
  const b = body as Record<string, unknown>
  if (b.pairs !== undefined) {
    if (!Array.isArray(b.pairs)) {
      trackToolCall(request, 'contrast', { status: 400, error: 'pairs not an array', c: b.c })
      return badRequest('"pairs" must be an array of { foreground, background, label? }.', EXAMPLE)
    }
    const pairs = b.pairs.map(p => (typeof p === 'object' && p !== null ? p : {}) as PairInput)
    return respond(request, pairs, b.standard, b.level, MAX_POST_PAIRS, b.c)
  }
  return respond(request, [{ foreground: b.foreground, background: b.background, label: b.label, purpose: b.purpose }], b.standard, b.level, 1, b.c)
}

export const OPTIONS = options
