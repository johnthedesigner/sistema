/**
 * Swatches for the tool demos' color inputs, from Sistema's prepared palette
 * library (public/palettes/library.json), read at build time (D46: inputs start
 * from something good).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface Swatch {
  name: string
  hex: string
}

type Library = Record<string, { stops: Record<string, { hex: string }> }>

let cache: Library | null = null
const library = (): Library => (cache ??= JSON.parse(readFileSync(join(process.cwd(), 'public/palettes/library.json'), 'utf8')))

/** One swatch per family at a stop, such as [['blue', 600], ['neutral', 900]]. */
export function swatches(picks: Array<[string, number]>): Swatch[] {
  const lib = library()
  return picks.flatMap(([family, stop]) => {
    const hex = lib[family]?.stops[String(stop)]?.hex
    return hex ? [{ name: `${family} ${stop}`, hex: hex.toUpperCase() }] : []
  })
}
