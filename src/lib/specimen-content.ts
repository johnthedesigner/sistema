/**
 * Checks `content` for the specimen tool against the placeholder content of the
 * chosen layout, so a misspelled or misshaped field is rejected with a message
 * instead of being ignored or rendered as "[object Object]".
 */
import { DEFAULT_CONTENT } from './specimen-html'
import { LAYOUT_CONTENT } from './specimen-layouts'

export const TONES = ['success', 'warning', 'error', 'info', 'neutral'] as const

export const CONTENT_DEFAULTS: Record<string, Record<string, unknown>> = {
  operations: DEFAULT_CONTENT as unknown as Record<string, unknown>,
  ...LAYOUT_CONTENT,
}

const kind = (v: unknown) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v)
const describe = (v: unknown): string => {
  if (Array.isArray(v)) return v.length ? `a list of ${describe(v[0])}s` : 'a list'
  if (v && typeof v === 'object') return 'an object'
  return `a ${typeof v}`
}

function check(value: unknown, def: unknown, path: string): string | null {
  if (path.endsWith('statuses')) {
    if (kind(value) !== 'object') return `"${path}" must be an object mapping each status word to one of: ${TONES.join(', ')}.`
    for (const [k, v] of Object.entries(value as Record<string, unknown>))
      if (!(TONES as readonly unknown[]).includes(v)) return `"${path}.${k}" must be one of: ${TONES.join(', ')} (got ${JSON.stringify(v)}).`
    return null
  }
  if (Array.isArray(def)) {
    if (!Array.isArray(value)) return `"${path}" must be ${describe(def)}.`
    if (def.length === 0) return null
    // Objects in a list may use any field any default item has.
    const proto = def.every(d => d && typeof d === 'object' && !Array.isArray(d)) ? Object.assign({}, ...def) : def[0]
    for (let i = 0; i < value.length; i++) {
      const err = check(value[i], proto, `${path}[${i}]`)
      if (err) return err
    }
    return null
  }
  if (def && typeof def === 'object') {
    if (kind(value) !== 'object') return `"${path}" must be an object with fields: ${Object.keys(def).join(', ')}.`
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (!(k in (def as Record<string, unknown>))) return `"${path}.${k}" isn't a field here. Fields: ${Object.keys(def).join(', ')}.`
      const err = check(v, (def as Record<string, unknown>)[k], `${path}.${k}`)
      if (err) return err
    }
    return null
  }
  if (typeof def === 'number' && typeof value !== 'number') return `"${path}" must be a number.`
  if (typeof def === 'string' && typeof value !== 'string') return `"${path}" must be text (got ${describe(value)}).`
  return null
}

/** Null when the content fits the layout, otherwise a message naming the field. */
export function validateContent(layout: string, content: Record<string, unknown>): string | null {
  const defaults = CONTENT_DEFAULTS[layout]
  if (!defaults) return null
  for (const [k, v] of Object.entries(content)) {
    if (!(k in defaults)) return `"content.${k}" isn't a field of the ${layout} layout. Fields: ${Object.keys(defaults).join(', ')}. The JSON response's "content_fields" shows each with its placeholder value.`
    const err = check(v, defaults[k], `content.${k}`)
    if (err) return err
  }
  return null
}
