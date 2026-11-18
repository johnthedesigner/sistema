import { describe, expect, it } from 'vitest'
import { parseColor } from './color'

const ok = (input: string) => {
  const r = parseColor(input)
  if (!r.ok) throw new Error(r.error)
  return r.color
}

describe('parseColor', () => {
  it('accepts hex with or without #, 3 or 6 digits, and uppercases it', () => {
    expect(ok('#1f5fd1').hex).toBe('#1F5FD1')
    expect(ok('1f5fd1').hex).toBe('#1F5FD1')
    expect(ok('#15d').hex).toBe('#1155DD')
    expect(ok('  #fff ').hex).toBe('#FFFFFF')
  })

  it('accepts rgb() in modern, legacy, and percentage syntax', () => {
    expect(ok('rgb(31 95 209)').hex).toBe('#1F5FD1')
    expect(ok('rgb(31, 95, 209)').hex).toBe('#1F5FD1')
    expect(ok('rgb(100% 0% 0%)').hex).toBe('#FF0000')
    expect(ok('rgba(31, 95, 209, 1)').hex).toBe('#1F5FD1')
  })

  it('accepts oklch() and round-trips through hex', () => {
    const c = ok('oklch(0.52 0.19 261)')
    expect(c.mapped).toBe(false)
    expect(ok(c.hex).oklch).toBe(c.oklch)
    expect(ok('oklch(52% 0.19 261)').hex).toBe(c.hex)
  })

  it('maps out-of-gamut oklch into sRGB and flags it', () => {
    const c = ok('oklch(0.7 0.4 145)')
    expect(c.mapped).toBe(true)
    expect(c.hex).toMatch(/^#[0-9A-F]{6}$/)
  })

  it('reports OKLCH for every color, with hue 0 for neutrals', () => {
    expect(ok('#FFFFFF').oklch).toBe('oklch(1 0 0)')
    expect(ok('#000').oklch).toBe('oklch(0 0 0)')
    expect(ok('#1F5FD1').oklch).toMatch(/^oklch\(0\.5\d+ 0\.1\d+ 26\d(\.\d)?\)$/)
  })

  it('rejects other formats, transparency, and non-strings, naming the accepted formats', () => {
    for (const bad of ['red', 'hsl(200 50% 50%)', '#12345', '#1f5fd1cc', 'rgb(1 2 3 / 0.5)', 'oklch(nope)', '', '   ']) {
      const r = parseColor(bad)
      expect(r.ok, bad).toBe(false)
      if (!r.ok) expect(r.error).toMatch(/hex|opaque/)
    }
    expect(parseColor(42).ok).toBe(false)
  })
})
