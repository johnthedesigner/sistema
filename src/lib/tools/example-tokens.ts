/**
 * Sistema's own token files (tokens/src/), as text keyed by file name: the example
 * the validator and dark mode pages offer. Read at build time.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { contrastTable } from './contrast'

export function siteTokenFiles(only?: string[]): Record<string, string> {
  const dir = join(process.cwd(), 'tokens/src')
  return Object.fromEntries(
    readdirSync(dir)
      .filter(f => f.endsWith('.json') && (!only || only.includes(f)))
      .map(f => [f, readFileSync(join(dir, f), 'utf8')]),
  )
}

/** Every standard and level the contrast rules define, as "wcag-2.2 AA". */
export function standardOptions(): string[] {
  return Object.entries(contrastTable()).flatMap(([standard, levels]) => Object.keys(levels).map(level => `${standard} ${level}`))
}
