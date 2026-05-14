import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { PaletteSwatch } from '@/components/palette/PaletteSwatch'

interface PaletteStop {
  hex: string
  contrast_white: number
  contrast_black: number
}

interface PaletteResult {
  seed: string
  stops: Record<string, PaletteStop>
}

const STOPS = ['50','100','150','200','250','300','350','400','450','500','550','600','650','700','750','800','850','900','950']

// Grays first, then chromatic colors in hue order
const GRAY_NAMES = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const CHROMATIC_NAMES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

function loadLibrary(): Record<string, PaletteResult> {
  const libPath = path.join(process.cwd(), 'public', 'palettes', 'library.json')
  return JSON.parse(fs.readFileSync(libPath, 'utf-8'))
}

function PaletteRow({ name, palette }: { name: string; palette: PaletteResult }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium w-16 shrink-0 capitalize">{name}</span>
      <div className="flex gap-0.5 flex-1">
        {STOPS.map(stop => {
          const s = palette.stops[stop]
          return (
            <div key={stop} className="flex-1 min-w-0">
              <PaletteSwatch
                hex={s.hex}
                stop={stop}
                contrastWhite={s.contrast_white}
                contrastBlack={s.contrast_black}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PalettePage() {
  const library = loadLibrary()

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-gray-900">Sistema</Link>
        <span>/</span>
        <span className="text-gray-900">Palette Library</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Palette Library</h1>
        <p className="text-gray-500 max-w-2xl">
          22 palettes generated from Tailwind&rsquo;s color family -600 stops. Each palette has 19 shades (50–950) selected by target contrast ratio against white — every stop at a given number has the same contrast guarantee across all hues. Click any swatch to copy its hex value.
        </p>
      </div>

      {/* Stop labels */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-16 shrink-0" />
        <div className="flex gap-0.5 flex-1">
          {STOPS.map(stop => (
            <div key={stop} className="flex-1 min-w-0 text-center">
              <span className="text-[10px] text-gray-400 font-mono">{stop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gray families */}
      <div className="space-y-1.5 mb-6">
        {GRAY_NAMES.filter(n => library[n]).map(name => (
          <PaletteRow key={name} name={name} palette={library[name]} />
        ))}
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Chromatic colors */}
      <div className="space-y-1.5">
        {CHROMATIC_NAMES.filter(n => library[n]).map(name => (
          <PaletteRow key={name} name={name} palette={library[name]} />
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-10">
        Generated from seeds using the algorithm specified in{' '}
        <Link href="/kb/principles/color/palette-generation.md" className="underline hover:text-gray-600">
          kb/principles/color/palette-generation
        </Link>
        . To generate a palette from a custom seed, use{' '}
        <code className="font-mono">POST /api/palette</code>.
      </p>
    </main>
  )
}
