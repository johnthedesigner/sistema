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
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-on-surface-muted mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-on-surface">Sistema</Link>
        <span>/</span>
        <Link href="/tools/palette" className="hover:text-on-surface">Tools</Link>
        <span>/</span>
        <span className="text-on-surface">Palette Library</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Palette Library</h1>
        <p className="text-on-surface-muted max-w-2xl">
          22 palettes generated from Tailwind&rsquo;s color family -600 stops. Each palette has 19 shades (50–950) selected by target contrast ratio against white — every stop at a given number has the same contrast guarantee across all hues. Click any swatch to copy its hex. Use the format selector to copy or export full palettes.
        </p>
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
    </main>
  )
}
