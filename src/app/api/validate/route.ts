import type { NextRequest } from 'next/server'
import { chooseStandard } from '@/lib/tools/contrast'
import { badRequest, json, options, readJson, trackToolCall } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'
import { validateTokens } from '@/lib/tools/validate'

/**
 * Token file validator (tool-apis.md section 6, D40).
 *   GET  /api/validate?files=<JSON: { "<file name>": <DTCG JSON> }>&standard=wcag-2.2%20AA
 *   POST /api/validate { files: { "color.json": {...}, "color.dark.json": {...}, "palette.json": {...} }, standard? }
 * File names carry modes: color.dark.json holds the dark theme's overrides. Files may be objects or JSON text.
 * Returns { standard, level, files, themes, tokens, summary, checks: [{ rule, severity, pass, message, items? }] }.
 */
const EXAMPLE = `/api/validate?files=${encodeURIComponent(JSON.stringify({ 'color.json': { color: { surface: { $type: 'color', $value: '#FFFFFF' }, 'on-surface': { $type: 'color', $value: '#1F2937' } } } }))}`

function respond(request: Request, filesRaw: unknown, standardRaw: unknown, levelRaw: unknown, bodyId?: unknown) {
  const fail = (error: string) => {
    trackToolCall(request, 'validate', { c: bodyId, status: 400, error })
    return badRequest(error, EXAMPLE)
  }
  let files = filesRaw
  if (typeof files === 'string') {
    try {
      files = JSON.parse(files)
    } catch {
      return fail('"files" must be JSON: an object of file name to token file, such as {"color.json": {...}}.')
    }
  }
  if (!files || typeof files !== 'object' || Array.isArray(files)) return fail('Send "files": an object of file name to token file, such as {"color.json": {...}, "color.dark.json": {...}}.')
  const entries = Object.entries(files as Record<string, unknown>)
  if (entries.length === 0) return fail('Send at least one token file.')
  if (entries.length > LIMITS.validate.files) return fail(`At most ${LIMITS.validate.files} files per request.`)
  if (JSON.stringify(files).length > LIMITS.validate.total_kb * 1024) return fail(`At most ${LIMITS.validate.total_kb} KB of token files per request.`)
  const std = chooseStandard(standardRaw, levelRaw)
  if (!std.ok) return fail(std.error)
  const result = validateTokens(files as Record<string, unknown>, std.standard, std.level)
  trackToolCall(request, 'validate', { c: bodyId, status: 200, items: entries.length, standard: std.standard, level: std.level, files: result.files, ...result.summary })
  return json({ ...result, ...(std.defaulted ? { defaulted: true } : {}) })
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  return respond(request, q.get('files') ?? undefined, q.get('standard') ?? undefined, q.get('level') ?? undefined)
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  return respond(request, b.files, b.standard, b.level, b.c)
}

export const OPTIONS = options
