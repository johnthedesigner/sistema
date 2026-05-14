import { NextRequest, NextResponse } from 'next/server'
import { generatePalettes } from '@/lib/palette'

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
      { error: 'Request body must be { colors: { [name]: "#hex" } }' },
      { status: 400 }
    )
  }

  const colors = (body as { colors: Record<string, unknown> }).colors

  // Validate all values are hex strings
  const invalid: string[] = []
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value !== 'string') {
      invalid.push(`${name}: must be a string`)
    } else {
      const normalized = value.startsWith('#') ? value : '#' + value
      if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
        invalid.push(`${name}: "${value}" is not a valid 6-digit hex color`)
      }
    }
  }

  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'Invalid color values', details: invalid },
      { status: 400 }
    )
  }

  try {
    const palettes = generatePalettes(colors as Record<string, string>)
    return NextResponse.json({ palettes })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
