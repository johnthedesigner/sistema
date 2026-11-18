import { NextRequest, NextResponse } from 'next/server'
import { wcagContrast } from 'culori'
import { ACCEPTED_FORMATS, parseColor } from '@/lib/color'

const MAX_PAIRS = 200

type Checked = { foreground: string; background: string; ratio: number; passes: Record<string, boolean> } | { error: string }

/** Contrast for one pair. Returns an error object instead of throwing, so a batch reports each pair. */
function checkPair(foreground: unknown, background: unknown): Checked {
  if (typeof foreground !== 'string' || typeof background !== 'string') {
    return { error: `"foreground" and "background" must be color strings: ${ACCEPTED_FORMATS}` }
  }
  const pf = parseColor(foreground)
  const pb = parseColor(background)
  if (!pf.ok) return { error: `Invalid foreground color. ${pf.error}` }
  if (!pb.ok) return { error: `Invalid background color. ${pb.error}` }
  const fg = pf.color.hex
  const bg = pb.color.hex

  const ratio = Math.round(wcagContrast(fg, bg) * 100) / 100
  return {
    foreground: fg,
    background: bg,
    ratio,
    passes: {
      aa_text: ratio >= 4.5,
      aa_large_text: ratio >= 3.0,
      aa_ui: ratio >= 3.0,
      aaa_text: ratio >= 7.0,
      aaa_large_text: ratio >= 4.5,
    },
  }
}

/**
 * POST { foreground, background }            → one result
 * POST { pairs: [{ foreground, background, label? }, ...] } → { results: [...] }, same order
 * In a batch, an invalid pair gets { error } in its slot; the others still return.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Request body must be { foreground, background } or { pairs: [{ foreground, background }, ...] }, with colors as ' + ACCEPTED_FORMATS },
      { status: 400 },
    )
  }

  const { foreground, background, pairs } = body as Record<string, unknown>

  if (pairs !== undefined) {
    if (!Array.isArray(pairs) || pairs.length === 0) {
      return NextResponse.json({ error: '"pairs" must be a non-empty array of { foreground, background }' }, { status: 400 })
    }
    if (pairs.length > MAX_PAIRS) {
      return NextResponse.json({ error: `At most ${MAX_PAIRS} pairs per request` }, { status: 400 })
    }
    const results = pairs.map(p => {
      const pair = (typeof p === 'object' && p !== null ? p : {}) as Record<string, unknown>
      const result = checkPair(pair.foreground, pair.background)
      return typeof pair.label === 'string' ? { label: pair.label, ...result } : result
    })
    return NextResponse.json({ results })
  }

  const result = checkPair(foreground, background)
  return NextResponse.json(result, { status: 'error' in result ? 400 : 200 })
}
