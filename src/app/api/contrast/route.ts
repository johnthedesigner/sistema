import { NextRequest, NextResponse } from 'next/server'
import { wcagContrast } from 'culori'

const HEX_RE = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

function normalizeHex(raw: string): string | null {
  const m = raw.trim().match(HEX_RE)
  if (!m) return null
  const h = m[1]
  return '#' + (h.length === 3 ? h.split('').map(c => c + c).join('') : h)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Request body must be { foreground: "#hex", background: "#hex" }' }, { status: 400 })
  }

  const { foreground, background } = body as Record<string, unknown>

  if (typeof foreground !== 'string' || typeof background !== 'string') {
    return NextResponse.json({ error: '"foreground" and "background" must be hex color strings' }, { status: 400 })
  }

  const fg = normalizeHex(foreground)
  const bg = normalizeHex(background)

  if (!fg) return NextResponse.json({ error: `Invalid foreground color: "${foreground}"` }, { status: 400 })
  if (!bg) return NextResponse.json({ error: `Invalid background color: "${background}"` }, { status: 400 })

  const ratio = Math.round(wcagContrast(fg, bg) * 100) / 100

  return NextResponse.json({
    foreground: fg,
    background: bg,
    ratio,
    passes: {
      aa_text:       ratio >= 4.5,
      aa_large_text: ratio >= 3.0,
      aa_ui:         ratio >= 3.0,
      aaa_text:      ratio >= 7.0,
      aaa_large_text: ratio >= 4.5,
    },
  })
}
