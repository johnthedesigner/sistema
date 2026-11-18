import { describe, expect, it } from 'vitest'
import { buildPayload } from './server'

const ID = '3f2b8c1e-1d2a-4c3b-9e8f-0a1b2c3d4e5f'
const headers = (h: Record<string, string>) => new Headers(h)

describe('buildPayload', () => {
  it('sends an anonymous event with the visit ID, agent family, and Vercel location, and no IP', () => {
    const p = buildPayload(
      { event: 'agent_fetch', visitId: ID, properties: { kind: 'play', id: 'color.scheme' } },
      headers({
        'user-agent': 'Claude-User/1.0',
        'x-forwarded-for': '203.0.113.9',
        'x-real-ip': '203.0.113.9',
        'x-vercel-ip-country': 'DE',
        'x-vercel-ip-city': 'M%C3%BCnchen',
        'x-vercel-ip-latitude': '48.1',
      }),
      'key',
    )
    expect(p.distinct_id).toBe(ID)
    expect(p.properties).toMatchObject({
      kind: 'play', id: 'color.scheme', c: ID, agent: 'claude', $process_person_profile: false,
      $geoip_disable: true, $geoip_country_code: 'DE', $geoip_city_name: 'München', $geoip_latitude: 48.1, internal: false,
    })
    expect(JSON.stringify(p)).not.toContain('203.0.113.9')
    expect(p.properties).not.toHaveProperty('$ip')
  })

  it('uses a random ID when the request has no valid visit ID, and flags internal IDs', () => {
    const a = buildPayload({ event: 'tool_call', visitId: 'not-an-id' }, headers({}), 'key')
    expect(a.distinct_id).toMatch(/^[0-9a-f-]{36}$/)
    expect(a.properties.has_visit_id).toBe(false)
    const b = buildPayload({ event: 'tool_call', visitId: `test-${ID}` }, headers({}), 'key')
    expect(b.properties.internal).toBe(true)
  })
})
