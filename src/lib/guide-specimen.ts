/**
 * Live specimens inside guides (V3.5). A guide embeds one as a fenced block:
 *
 *   ```specimen
 *   ramp #7B43E6 #72707A
 *   ```
 *
 * Kinds: ramp <hex>..., type-scale base=13 ratio=major-second roles=label:-1,body:0,
 * radius control=8, elevation accent=<hex>, surfaces accent=<hex> neutral=<warmth|hex>
 * separation=<tone|line|shadow>. The human page draws it from Sistema's own
 * code; /raw replaces it with one line naming the tool, so agents get no images.
 */
export const SPECIMEN_KINDS = ['ramp', 'type-scale', 'radius', 'elevation', 'surfaces'] as const
export type SpecimenKind = (typeof SPECIMEN_KINDS)[number]

export interface GuideSpecimen {
  kind: SpecimenKind
  args: string[]
  params: Record<string, string>
  caption?: string
}

/** Parse the block's text. Errors are thrown, so a bad block fails the build. */
export function parseSpecimen(text: string): GuideSpecimen {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  const [head, ...rest] = lines
  const tokens = (head ?? '').split(/\s+/)
  const kind = tokens[0] as SpecimenKind
  if (!(SPECIMEN_KINDS as readonly string[]).includes(kind)) throw new Error(`Unknown specimen kind "${tokens[0]}". Use one of: ${SPECIMEN_KINDS.join(', ')}.`)
  const args: string[] = []
  const params: Record<string, string> = {}
  for (const t of tokens.slice(1)) {
    const eq = t.indexOf('=')
    if (eq > 0) params[t.slice(0, eq)] = t.slice(eq + 1)
    else args.push(t)
  }
  const caption = rest.join(' ') || undefined
  if (kind === 'ramp' && args.length === 0) throw new Error('A ramp specimen needs at least one seed color.')
  return { kind, args, params, caption }
}

/** The one line that replaces a specimen in /raw. */
export function describeSpecimen(s: GuideSpecimen): string {
  const p = s.params
  const what: Record<SpecimenKind, string> = {
    ramp: `the palette tool's ramp${s.args.length > 1 ? 's' : ''} for ${s.args.join(', ')}`,
    'type-scale': `the type scale tool's scale at base ${p.base ?? 16}px, ratio ${p.ratio ?? 'major-third'}${p.roles ? `, roles ${p.roles}` : ''}`,
    radius: `the radius scale for a ${p.control ?? 8}px control radius (chips, controls, panels, featured, floating layers)`,
    elevation: 'the four shadow roles (control, raised, featured, overlay) in light and dark',
    surfaces: `page, panel, featured, menu, hover, and selected surfaces in light and dark${p.accent ? ` for accent ${p.accent}` : ''}`,
  }
  return `(Specimen on the guide's web page: ${what[s.kind]}.${s.caption ? ` ${s.caption}` : ''})`
}

/** Replace every specimen block in a guide body with its description, for /raw. */
export function specimensToText(markdown: string): string {
  return markdown.replace(/```specimen\n([\s\S]*?)```/g, (_m, body: string) => describeSpecimen(parseSpecimen(body)))
}
