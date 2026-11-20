import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { rgb, wcagContrast } from 'culori'
import { generatePalette, targetContrast } from './palette'

const library = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'palettes', 'library.json'), 'utf-8')) as Record<
  string,
  { seed: string; stops: Record<string, { hex: string; contrast_white: number; contrast_black: number }> }
>

const STOPS = ['50', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '750', '800', '850', '900', '950']
const target = (i: number) => targetContrast(i)

describe('generatePalette', () => {
  it('matches the published library for every seed (library.json and the API agree)', () => {
    const drift: string[] = []
    for (const [name, p] of Object.entries(library)) {
      const now = generatePalette(p.seed)
      for (const stop of STOPS) {
        if (now.stops[stop].hex.toLowerCase() !== p.stops[stop].hex.toLowerCase()) drift.push(`${name}.${stop}: library ${p.stops[stop].hex}, API ${now.stops[stop].hex}`)
      }
    }
    expect(drift).toEqual([])
  })

  it('produces 19 stops, all in sRGB, getting darker in order', () => {
    for (const seed of ['#1F5FD1', '#FFCC33', '#16A34A', '#525252', '#E11D48']) {
      const p = generatePalette(seed)
      expect(Object.keys(p.stops)).toEqual(STOPS)
      let prev = 0
      for (const stop of STOPS) {
        const c = rgb(p.stops[stop].hex)!
        for (const v of [c.r, c.g, c.b]) expect(v).toBeGreaterThanOrEqual(0)
        const cw = wcagContrast(p.stops[stop].hex, '#ffffff')
        expect(cw, `${seed} ${stop}`).toBeGreaterThanOrEqual(prev)
        prev = cw
      }
    }
  })

  it('places each stop near its contrast target against white', () => {
    for (const seed of ['#1F5FD1', '#FFCC33', '#16A34A', '#525252']) {
      const p = generatePalette(seed)
      STOPS.forEach((stop, i) => {
        const off = Math.abs(p.stops[stop].contrast_white - target(i)) / target(i)
        expect(off, `${seed} ${stop}`).toBeLessThan(0.05)
      })
    }
  })

  it('stays stable for fixed seeds (fails on any unintended change to the algorithm)', () => {
    const snap = Object.fromEntries(['#1F5FD1', '#FFCC33'].map(s => {
      const p = generatePalette(s)
      return [s, STOPS.map(stop => p.stops[stop].hex)]
    }))
    expect(snap).toMatchSnapshot()
  })
})
