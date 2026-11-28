/**
 * Draws a guide specimen (src/lib/guide-specimen.ts) from Sistema's own tools,
 * so a guide shows real ramps, scales, radii, shadows, and surfaces. Server
 * component: everything is computed at build time.
 */
import { generatePalette } from '@/lib/palette'
import { computeTypeScale } from '@/lib/type-scale'
import { buildSpecimen, type Specimen as Spec } from '@/lib/specimen'
import type { GuideSpecimen } from '@/lib/guide-specimen'

const Frame = ({ children, caption }: { children: React.ReactNode; caption?: string }) => (
  <figure className="not-prose my-6">
    <div className="rounded-radius-md border border-border bg-surface-raised p-3 md:p-4 overflow-hidden">{children}</div>
    {caption && <figcaption className="text-[12.5px] text-on-surface-muted mt-2 leading-[1.5]">{caption}</figcaption>}
  </figure>
)

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-medium text-on-surface-muted mb-1.5">{children}</div>
)

function Ramp({ seeds }: { seeds: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {seeds.map(seed => {
        const p = generatePalette(seed)
        if (!('stops' in p)) return null
        const stops = Object.entries(p.stops)
        return (
          <div key={seed}>
            <Label>Seed {seed.toUpperCase()}</Label>
            <div className="flex rounded-radius-sm overflow-hidden" style={{ height: 44 }}>
              {stops.map(([k, s]) => (
                <div key={k} title={`${k} ${s.hex} · ${s.contrast_white}:1 on white`} style={{ background: s.hex, flex: 1 }} />
              ))}
            </div>
            <div className="flex text-[9.5px] md:text-[10.5px] text-on-surface-muted mt-1 tabular-nums">
              {stops.map(([k]) => (
                <div key={k} style={{ flex: 1, textAlign: 'center' }} className={Number(k) % 100 === 0 ? '' : 'hidden md:block'}>
                  {k}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TypeScale({ params }: { params: Record<string, string> }) {
  const roles = params.roles
    ? Object.fromEntries(params.roles.split(',').map(r => r.split(':')).map(([n, s]) => [n, Number(s)]))
    : undefined
  const result = computeTypeScale({
    base: params.base ? Number(params.base) : undefined,
    ratio: params.ratio,
    down: params.down ? Number(params.down) : undefined,
    up: params.up ? Number(params.up) : undefined,
    roles,
  })
  if (!result.ok) throw new Error(`type-scale specimen: ${result.error}`)
  const steps = [...result.scale.steps].reverse().filter(s => !roles || s.roles?.length)
  return (
    <div className="flex flex-col divide-y divide-border">
      {steps.map(s => (
        <div key={s.step} className="flex items-baseline gap-3 py-2 min-w-0">
          <div className="w-[88px] shrink-0 text-[11.5px] text-on-surface-muted tabular-nums">
            {(s.roles ?? [s.name]).join(', ')}
            <br />
            {s.px}px / {s.line_height}
          </div>
          <div className="min-w-0 truncate text-on-surface" style={{ fontSize: s.px, lineHeight: s.line_height }}>
            Next job: no heat at the Hartley residence
          </div>
        </div>
      ))}
    </div>
  )
}

function Radius({ control }: { control: number }) {
  const sp = buildSpecimen({ radius: control })
  if (!sp.ok) throw new Error(`radius specimen: ${sp.error}`)
  const r = sp.specimen.radius
  const items: Array<[string, number, number, number]> = [
    ['Chip', r.chip, 64, 24],
    ['Control', r.control, 96, 32],
    ['Panel', r.panel, 120, 72],
    ['Featured', r.featured, 120, 72],
    ['Floating', r.overlay, 120, 72],
  ]
  return (
    <div className="flex flex-wrap items-end gap-4">
      {items.map(([name, rad, w, h]) => (
        <div key={name} className="flex flex-col items-start gap-1.5">
          <div className="bg-surface-raised border border-border" style={{ width: w, height: h, borderRadius: Math.min(rad, 999) }} />
          <div className="text-[11.5px] text-on-surface-muted tabular-nums">
            {name} · {rad >= 999 ? 'full' : `${rad}px`}
          </div>
        </div>
      ))}
    </div>
  )
}

function Theme({ sp, children }: { sp: Spec; children: (c: Record<string, string>) => React.ReactNode }) {
  const c = Object.fromEntries(Object.entries(sp.colors).map(([k, v]) => [k, v.hex]))
  return children(c)
}

function Elevation({ params }: { params: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(['light', 'dark'] as const).map(theme => {
        const sp = buildSpecimen({ accent: params.accent, neutral: params.neutral, separation: 'shadow', theme })
        if (!sp.ok) throw new Error(`elevation specimen: ${sp.error}`)
        const s = sp.specimen
        return (
          <Theme key={theme} sp={s}>
            {c => (
              <div className="rounded-radius-sm p-4 flex flex-wrap gap-3" style={{ background: c.canvas }}>
                {([
                  ['Control', s.shadows.control, c.surface, 40],
                  ['Raised', s.shadows.panel, c.surface, 64],
                  ['Featured', s.shadows.featured, c['surface-featured'], 64],
                  ['Overlay', s.shadows.overlay, c['surface-overlay'], 64],
                ] as const).map(([name, shadow, bg, h]) => (
                  <div key={name} className="flex items-end p-2 text-[11.5px]" style={{ width: 92, height: h, background: bg, boxShadow: shadow, borderRadius: s.radius.panel, color: c['text-secondary'] }}>
                    {name}
                  </div>
                ))}
                <div className="w-full text-[11px]" style={{ color: c['text-tertiary'] }}>{theme}</div>
              </div>
            )}
          </Theme>
        )
      })}
    </div>
  )
}

function Surfaces({ params }: { params: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(['light', 'dark'] as const).map(theme => {
        const sp = buildSpecimen({ accent: params.accent, neutral: params.neutral, separation: params.separation ?? 'tone', theme })
        if (!sp.ok) throw new Error(`surfaces specimen: ${sp.error}`)
        const s = sp.specimen
        const from = (k: string) => s.colors[k]?.from ?? ''
        return (
          <Theme key={theme} sp={s}>
            {c => (
              <div className="rounded-radius-sm p-3" style={{ background: c.canvas, color: c.text }}>
                <div className="text-[11px] mb-2" style={{ color: c['text-tertiary'] }}>
                  {theme} · page {from('canvas')}
                </div>
                <div className="p-2.5 mb-2.5" style={{ background: c['surface-featured'], borderRadius: s.radius.featured, boxShadow: s.shadows.featured }}>
                  <div className="text-[12px] font-medium">Featured · {from('surface-featured')}</div>
                </div>
                <div className="p-1.5" style={{ background: c.surface, borderRadius: s.radius.panel, boxShadow: s.shadows.panel }}>
                  <div className="text-[11px] px-1.5 py-1" style={{ color: c['text-secondary'] }}>Panel · {from('surface')}</div>
                  {([
                    ['Row', undefined],
                    ['Hover', 'row-hover'],
                    ['Selected', 'selected-row'],
                  ] as const).map(([name, role]) => (
                    <div key={name} className="text-[12px] px-1.5 py-1.5 flex justify-between" style={{ background: role ? c[role] : undefined, boxShadow: name === 'Selected' ? `inset 2px 0 0 ${c.primary}` : undefined, borderTop: `1px solid ${c.hairline}` }}>
                      <span>{name}</span>
                      <span style={{ color: c['text-tertiary'] }}>{role ? from(role) : ''}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 p-1.5 w-[70%] ml-auto" style={{ background: c['surface-overlay'], borderRadius: s.radius.overlay, boxShadow: s.shadows.overlay }}>
                  <div className="text-[12px] px-1.5 py-1">Menu · {from('surface-overlay')}</div>
                  <div className="text-[12px] px-1.5 py-1" style={{ background: c['surface-hover'], borderRadius: s.radius.small }}>
                    Highlighted · {from('surface-hover')}
                  </div>
                </div>
              </div>
            )}
          </Theme>
        )
      })}
    </div>
  )
}

export function GuideSpecimenView({ spec }: { spec: GuideSpecimen }) {
  const p = spec.params
  const body = (() => {
    switch (spec.kind) {
      case 'ramp':
        return <Ramp seeds={spec.args} />
      case 'type-scale':
        return <TypeScale params={p} />
      case 'radius':
        return <Radius control={Number(p.control ?? 8)} />
      case 'elevation':
        return <Elevation params={p} />
      case 'surfaces':
        return <Surfaces params={p} />
    }
  })()
  return <Frame caption={spec.caption}>{body}</Frame>
}
