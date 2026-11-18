import type { NextRequest } from 'next/server'
import { computeTypeScale, type Naming, type TypeScaleInput } from '@/lib/type-scale'
import { badRequest, json, options, readJson, trackToolCall } from '@/lib/tools/http'
import { chooseStandard, knownStandards, ruleValue, rulesFrom } from '@/lib/tools/standards'

/**
 * Type scale (tool-apis.md section 4).
 *   GET  /api/type-scale?base=16&ratio=major-third&down=2&up=6&names=numeric&roles=caption:-2,body:0&standard=wcag-2.2%20AAA
 *   POST /api/type-scale { base, ratio, down, up, names, roles: { body: 0 }, round, standard, level }
 * Returns the scale plus `checks`: every step has a unitless line height
 * (typography.line-height.by-role), and, when a standard sets one, body text meets
 * its line-height minimum (typography.line-height.body). Guide ranges come back as notes.
 */
const EXAMPLE = '/api/type-scale?base=16&ratio=major-third&down=2&up=6&roles=caption:-2,label:-1,body:0,heading-sm:2,heading-lg:4,display:6'

/** Respond, then record the call with its inputs and status. */
function tracked(request: Request, input: TypeScaleInput, standardRaw: unknown, levelRaw: unknown, bodyId?: unknown) {
  const res = respond(input, standardRaw, levelRaw)
  const { base, ratio, down, up, names, roles } = input
  trackToolCall(request, 'type_scale', { c: bodyId, status: res.status, base, ratio, down, up, names, roles, standard: standardRaw, level: levelRaw })
  return res
}

function respond(input: TypeScaleInput, standardRaw: unknown, levelRaw: unknown) {
  const result = computeTypeScale(input)
  if (!result.ok) return badRequest(result.error, EXAMPLE)
  const rules = rulesFrom('typography')
  const std = chooseStandard(standardRaw, levelRaw, knownStandards(rulesFrom('color')), null)
  if (std && !std.ok) return badRequest(std.error, EXAMPLE)

  const { scale } = result
  const checks: Array<Record<string, unknown>> = [
    { rule: 'typography.line-height.by-role', pass: scale.steps.every(s => Number.isFinite(s.line_height) && s.line_height > 0) },
  ]
  if (std?.ok) {
    const rule = rules.find(r => r.id === 'typography.line-height.body')
    const required = rule ? ruleValue(rule, std.standard, std.level) : null
    if (required !== null) {
      const body = scale.steps.find(s => s.roles?.includes('body')) ?? scale.steps.find(s => s.step === 0)!
      checks.push({ rule: 'typography.line-height.body', step: body.step, required, value: body.line_height, pass: body.line_height >= required })
    }
  }
  return json({ ...(std?.ok ? { standard: std.standard, level: std.level } : {}), ...scale, checks })
}

/** roles=caption:-2,label:-1,body:0 */
function parseRoles(raw: string | null): Record<string, number> | string | undefined {
  if (!raw) return undefined
  const out: Record<string, number> = {}
  for (const part of raw.split(',').map(p => p.trim()).filter(Boolean)) {
    const m = part.match(/^([^:]+):(-?\d+)$/)
    if (!m) return `"roles" entries look like body:0 or caption:-2 (got "${part}").`
    out[m[1]] = Number(m[2])
  }
  return out
}

const num = (v: string | null) => (v === null || v === '' ? undefined : Number(v))

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const roles = parseRoles(q.get('roles'))
  if (typeof roles === 'string') {
    trackToolCall(request, 'type_scale', { status: 400, error: roles })
    return badRequest(roles, EXAMPLE)
  }
  const ratioRaw = q.get('ratio') ?? undefined
  return tracked(
    request,
    {
      base: num(q.get('base')),
      ratio: ratioRaw !== undefined && /^[\d.]+$/.test(ratioRaw) ? Number(ratioRaw) : ratioRaw,
      down: num(q.get('down')),
      up: num(q.get('up')),
      names: (q.get('names') ?? undefined) as Naming | undefined,
      roles,
      round: q.get('round') === null ? undefined : q.get('round') !== 'false',
    },
    q.get('standard') ?? undefined,
    q.get('level') ?? undefined,
  )
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  if (typeof body !== 'object' || body === null) return badRequest('Send JSON: { "base": 16, "ratio": "major-third", "roles": { "body": 0 } }', EXAMPLE)
  const b = body as Record<string, unknown>
  if (b.roles !== undefined && (typeof b.roles !== 'object' || b.roles === null || Array.isArray(b.roles))) {
    return badRequest('"roles" must be an object such as { "body": 0, "caption": -2 }.', EXAMPLE)
  }
  return tracked(request, b as TypeScaleInput, b.standard, b.level, b.c)
}

export const OPTIONS = options
