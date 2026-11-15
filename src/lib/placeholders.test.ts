import { describe, expect, it } from 'vitest'
import { extractVariables, formatVariableLabel, resolveSistemaUrl } from './placeholders'
import { PRODUCTION_URL, resolveSiteUrl } from './site-url'

describe('resolveSistemaUrl', () => {
  it('replaces every occurrence and trims a trailing slash from the base', () => {
    const text = 'GET {{sistema_url}}/raw/a and {{sistema_url}}/api/b'
    expect(resolveSistemaUrl(text, 'https://x.example/')).toBe('GET https://x.example/raw/a and https://x.example/api/b')
  })
  it('leaves user variables alone', () => {
    expect(resolveSistemaUrl('{{color_direction}}', 'https://x.example')).toBe('{{color_direction}}')
  })
  it('defaults to the production origin outside a Next build', () => {
    expect(resolveSistemaUrl('{{sistema_url}}')).toBe(process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || PRODUCTION_URL)
  })
})

describe('extractVariables and formatVariableLabel', () => {
  it('lists user variables once each, in order, excluding sistema_url', () => {
    expect(extractVariables('{{b}} {{sistema_url}} {{a}} {{b}}')).toEqual(['b', 'a'])
  })
  it('formats labels', () => {
    expect(formatVariableLabel('color_direction')).toBe('Color Direction')
  })
})

describe('resolveSiteUrl', () => {
  it('prefers an explicit NEXT_PUBLIC_SITE_URL', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://tunnel.example/' })).toBe('https://tunnel.example')
  })
  it('uses the branch URL on Vercel previews', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'sistema-git-v2.vercel.app' })).toBe(
      'https://sistema-git-v2.vercel.app',
    )
  })
  it('falls back to production', () => {
    expect(resolveSiteUrl({})).toBe(PRODUCTION_URL)
    expect(resolveSiteUrl({ VERCEL_ENV: 'production', VERCEL_BRANCH_URL: 'x.vercel.app' })).toBe(PRODUCTION_URL)
  })
})
