import { NextRequest, NextResponse } from 'next/server'
import { generatePalettes } from '@/lib/palette'
import { ACCEPTED_FORMATS, parseColor } from '@/lib/color'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('colors' in body) ||
    typeof (body as Record<string, unknown>).colors !== 'object' ||
    (body as Record<string, unknown>).colors === null
  ) {
    return NextResponse.json(
      { error: `Request body must be { colors: { [name]: color } }, with colors as ${ACCEPTED_FORMATS}` },
      { status: 400 }
    )
  }

  const colors = (body as { colors: Record<string, unknown> }).colors

  // Parse every seed; the palette is built from its sRGB hex.
  const invalid: string[] = []
  const seeds: Record<string, string> = {}
  for (const [name, value] of Object.entries(colors)) {
    const parsed = parseColor(value)
    if (parsed.ok) seeds[name] = parsed.color.hex
    else invalid.push(`${name}: ${parsed.error}`)
  }

  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'Invalid color values', details: invalid },
      { status: 400 }
    )
  }

  try {
    const palettes = generatePalettes(seeds)
    return NextResponse.json({ palettes })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
