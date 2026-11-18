import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'
import { PaletteControls } from '@/components/palette/PaletteControls'
import { CustomSeedInput } from '@/components/palette/CustomSeedInput'

export const metadata: Metadata = {
  title: 'Palette Tool',
  robots: { index: false, follow: false },
}

interface PaletteStop {
  hex: string
  contrast_white: number
  contrast_black: number
}

interface PaletteResult {
  seed: string
  stops: Record<string, PaletteStop>
}

function loadLibrary(): Record<string, PaletteResult> {
  const libPath = path.join(process.cwd(), 'public', 'palettes', 'library.json')
  return JSON.parse(fs.readFileSync(libPath, 'utf-8'))
}

export default function PalettePage() {
  const library = loadLibrary()

  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
      <div className="flex items-start justify-between gap-6 mb-7">
        <div>
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Tools · Palette library
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3"
            style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 720 }}
          >
            OKLCH palettes, one seed at a time.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0"
            style={{ fontSize: 15, lineHeight: 1.55, fontVariationSettings: "'opsz' 32" }}
          >
            22 palettes generated using the same lightness curve and chroma envelope as the{' '}
            <Link href="/plays/color.scheme" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken">
              color.scheme
            </Link>{' '}
            play. Click any swatch to copy its hex.
          </p>
        </div>
      </div>

      <CustomSeedInput />

      <PaletteControls library={library} />

      <p className="text-xs text-on-surface-muted mt-10">
        Generated using the algorithm in{' '}
        <Link href="/guides/color/palette-generation" className="underline hover:text-on-surface">
          Palette generation guide
        </Link>
        . Agents get ramps for any seeds from{' '}
        <code className="font-mono break-all">GET {SITE_URL}/api/palette?primary=%231F5FD1&amp;neutral=…</code>, one named seed per
        parameter, as hex, <code className="font-mono">rgb()</code>, or <code className="font-mono">oklch()</code>. See{' '}
        <Link href="/reference/tools#palette" className="underline hover:text-on-surface">Tool APIs</Link> for the full request and response.
      </p>
      </div>
    </main>
  )
}
