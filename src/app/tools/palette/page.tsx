import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { PaletteControls } from '@/components/palette/PaletteControls'
import { CustomSeedInput } from '@/components/palette/CustomSeedInput'

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
      <div className="max-w-[1180px] mx-auto px-10 pt-10 pb-20">
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
            style={{ maxWidth: 660, fontSize: 15, lineHeight: 1.55, fontVariationSettings: "'opsz' 32" }}
          >
            22 palettes generated from Tailwind&rsquo;s color family -600 stops using the same lightness curve and chroma envelope as the{' '}
            <Link href="/playbooks/generate-color-scheme" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken">
              generate-color-scheme
            </Link>{' '}
            play. Click any swatch to copy its hex.
          </p>
        </div>
      </div>

      <CustomSeedInput />

      <PaletteControls library={library} />

      <p className="text-xs text-on-surface-muted mt-10">
        Generated using the algorithm in{' '}
        <Link href="/kb/principles/color/palette-generation.md" className="underline hover:text-on-surface">
          kb/principles/color/palette-generation
        </Link>
        . Custom seeds: <code className="font-mono">POST /api/palette</code>.
        Regenerate: <code className="font-mono">npm run palettes</code>.
      </p>
      </div>
    </main>
  )
}
