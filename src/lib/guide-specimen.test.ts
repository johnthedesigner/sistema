import { describe, expect, it } from 'vitest'
import { parseSpecimen, specimensToText } from './guide-specimen'

describe('guide specimens', () => {
  it('parses kind, args, params, and caption', () => {
    const s = parseSpecimen('ramp #7B43E6 #72707A\nRelay\'s accent and grays.')
    expect(s).toEqual({ kind: 'ramp', args: ['#7B43E6', '#72707A'], params: {}, caption: "Relay's accent and grays." })
    expect(parseSpecimen('type-scale base=13 ratio=major-second').params).toEqual({ base: '13', ratio: 'major-second' })
  })
  it('rejects unknown kinds and seedless ramps', () => {
    expect(() => parseSpecimen('gradient #fff')).toThrow(/Unknown specimen/)
    expect(() => parseSpecimen('ramp')).toThrow(/seed/)
  })
  it('turns blocks into one line for /raw', () => {
    const out = specimensToText('Before\n\n```specimen\nradius control=8\n```\n\nAfter')
    expect(out).toContain('(Specimen on the guide\'s web page: the radius scale for a 8px control radius')
    expect(out).not.toContain('```')
  })
})
