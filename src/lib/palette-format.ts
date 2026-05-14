export const STOPS = ['50','100','150','200','250','300','350','400','450','500','550','600','650','700','750','800','850','900','950'] as const

export type Format = 'css' | 'tailwind' | 'figma'

export interface PaletteStop {
  hex: string
  contrast_white: number
  contrast_black: number
}

export interface PaletteResult {
  seed: string
  stops: Record<string, PaletteStop>
}

export function hexToRgbFloat(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace('#', ''), 16)
  return {
    r: Math.round(((n >> 16) & 255) / 255 * 1000) / 1000,
    g: Math.round(((n >> 8) & 255) / 255 * 1000) / 1000,
    b: Math.round((n & 255) / 255 * 1000) / 1000,
  }
}

export function toCss(name: string, palette: PaletteResult): string {
  const lines = STOPS.map(stop => `  --color-${name}-${stop}: ${palette.stops[stop].hex};`)
  return `/* ${name} */\n:root {\n${lines.join('\n')}\n}`
}

export function toTailwind(name: string, palette: PaletteResult): string {
  const lines = STOPS.map(stop => `    '${stop}': '${palette.stops[stop].hex}',`)
  return `// tailwind.config.js — extend.colors\n${name}: {\n${lines.join('\n')}\n},`
}

export function toFigmaCollection(
  names: string[],
  library: Record<string, PaletteResult>
): object {
  const variables = names.flatMap(name =>
    STOPS.map(stop => {
      const { r, g, b } = hexToRgbFloat(library[name].stops[stop].hex)
      return {
        name: `${name}/${stop}`,
        type: 'COLOR',
        value: { r, g, b, a: 1 },
      }
    })
  )
  return {
    collections: [{ name: 'Color Palette', modes: ['Default'], variables }],
  }
}

export function downloadJson(filename: string, data: object) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
