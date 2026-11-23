import type { NextRequest } from 'next/server'
import { ACCEPTED_FORMATS, parseColor } from '@/lib/color'
import { chooseStandard } from '@/lib/tools/contrast'
import { hexSource, mapDarkMode, parseRef, type Ref } from '@/lib/tools/dark-mode'
import { badRequest, json, options, readJson, trackToolCall } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'
import { readTokenFiles } from '@/lib/tools/tokens'

/**
 * Dark mode mapping (tool-apis.md section 7, D40, guide.color.architecture#stops-in-a-dark-theme).
 *   GET  /api/dark-mode?roles=<JSON: { "<role>": "<ramp>.<stop>" }>&colors=<JSON: { "<ramp>": "<seed>" }>&standard=wcag-2.2%20AA
 *   POST /api/dark-mode { roles: { "surface": "{palette.neutral.50}", ... }, colors?: { "neutral": "#6B7280" }, palette?: <DTCG palette file>, standard? }
 *   POST /api/dark-mode { files: { "color.json": {...}, "palette.json": {...} }, standard? }   roles read from color.<role> tokens
 * Returns { standard, level, roles: { <role>: { light, dark, how, hex? } }, tokens: <color.dark.json>, pairs: [...], notes }.
 */
const EXAMPLE = `/api/dark-mode?roles=${encodeURIComponent(JSON.stringify({ surface: 'neutral.50', 'surface-raised': 'white', 'on-surface': 'neutral.850' }))}&colors=${encodeURIComponent(JSON.stringify({ neutral: '#6B7280' }))}`

const parseJson = (raw: unknown) => {
  if (typeof raw !== 'string') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return Symbol.for('invalid')
  }
}

function respond(request: Request, input: { roles?: unknown; colors?: unknown; palette?: unknown; files?: unknown; standard?: unknown; level?: unknown; c?: unknown }) {
  const fail = (error: string, details?: string[]) => {
    trackToolCall(request, 'dark_mode', { c: input.c, status: 400, error })
    return badRequest(error, EXAMPLE, details ? { details } : {})
  }
  let rolesRaw = parseJson(input.roles)
  let palette = parseJson(input.palette)
  const files = parseJson(input.files)
  if (files && typeof files === 'object' && !Array.isArray(files)) {
    // Roles straight from the project's token files: every color.<role> token.
    const set = readTokenFiles(files as Record<string, unknown>)
    rolesRaw = Object.fromEntries([...set.base.values()].filter(t => /^color\.[a-z0-9-]+$/.test(t.name)).map(t => [t.name.slice(6), t.value]))
    if (!palette) palette = Object.entries(files as Record<string, unknown>).find(([name]) => /palette/.test(name))?.[1]
    if (typeof palette === 'string') palette = parseJson(palette)
  }
  if (!rolesRaw || typeof rolesRaw !== 'object' || Array.isArray(rolesRaw)) return fail('Send "roles": an object of color role to its light ramp stop, such as {"surface": "neutral.50"}, or "files" with color.json and palette.json.')
  const entries = Object.entries(rolesRaw as Record<string, unknown>)
  if (entries.length === 0) return fail('Send at least one role.')
  if (entries.length > LIMITS.dark_mode.roles) return fail(`At most ${LIMITS.dark_mode.roles} roles per request.`)

  const roles: Record<string, Ref> = {}
  const paths: Record<string, string | undefined> = {}
  const invalid: string[] = []
  for (const [name, raw] of entries) {
    const role = name.replace(/^color\./, '')
    const p = parseRef(raw)
    if (p.ok) {
      roles[role] = p.ref
      paths[role] = p.path
    } else if (typeof raw === 'string' && (/^\{[^{}]+\}$/.test(raw.trim()) || parseColor(raw).ok)) roles[role] = { fixed: raw.trim() }
    else invalid.push(`${role}: ${p.error}`)
  }
  if (invalid.length) return fail('Some roles are not ramp stops.', invalid)

  const colorsRaw = parseJson(input.colors)
  let colors: Record<string, string> | undefined
  if (colorsRaw !== undefined && colorsRaw !== null) {
    if (typeof colorsRaw !== 'object' || Array.isArray(colorsRaw)) return fail(`"colors" must be an object of ramp name to seed color (${ACCEPTED_FORMATS}).`)
    colors = {}
    const bad: string[] = []
    for (const [ramp, v] of Object.entries(colorsRaw as Record<string, unknown>)) {
      const c = parseColor(v)
      if (c.ok) colors[ramp] = c.color.hex
      else bad.push(`${ramp}: ${c.error}`)
    }
    if (bad.length) return fail('Invalid seed colors.', bad)
  }
  const std = chooseStandard(input.standard, input.level)
  if (!std.ok) return fail(std.error)
  const result = mapDarkMode(roles, { hex: hexSource(palette, colors), standard: std.standard, level: std.level, paths })
  trackToolCall(request, 'dark_mode', { c: input.c, status: 200, items: entries.length, standard: std.standard, level: std.level, failing: result.pairs.filter(p => p.dark && !p.dark.pass).length })
  return json({ ...result, ...(std.defaulted ? { defaulted: true } : {}) })
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const get = (k: string) => q.get(k) ?? undefined
  return respond(request, { roles: get('roles'), colors: get('colors'), palette: get('palette'), standard: get('standard'), level: get('level') })
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  return respond(request, b)
}

export const OPTIONS = options
