/**
 * Reading DTCG token files (tokens.source.dtcg), shared by the token validator
 * and dark mode mapping. Files are keyed by name: `color.json` holds defaults,
 * and `color.dark.json` holds the dark mode's overrides (tokens.modes.overrides-only).
 */

export interface Token {
  name: string
  type?: string
  value: unknown
  file: string
}

export type TokenMap = Map<string, Token>

/** The $type values the DTCG format defines. */
export const DTCG_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'number',
  'strokeStyle', 'border', 'transition', 'shadow', 'gradient', 'typography',
])

/** Which kind of mode a file name's mode belongs to (tokens.modes.one-kind). */
export function modeKind(mode: string): 'theme' | 'density' | 'motion' | 'other' {
  if (/^(dark|light|high-contrast|contrast|dim)$/.test(mode)) return 'theme'
  if (/^(compact|comfortable|spacious|dense|sparse|balanced)$/.test(mode)) return 'density'
  if (/^(reduced|reduced-motion|no-motion)$/.test(mode)) return 'motion'
  return 'other'
}

/** Every token in one file, with group $type inherited as DTCG specifies. */
export function flatten(tree: unknown, file: string, prefix = '', inherited?: string): Token[] {
  if (!tree || typeof tree !== 'object' || Array.isArray(tree)) return []
  const node = tree as Record<string, unknown>
  const type = typeof node.$type === 'string' ? node.$type : inherited
  if ('$value' in node) return [{ name: prefix, type, value: node.$value, file }]
  const out: Token[] = []
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    out.push(...flatten(child, file, prefix ? `${prefix}.${key}` : key, type))
  }
  return out
}

export interface TokenSet {
  /** Defaults: every file without a mode in its name, merged. */
  base: TokenMap
  /** Each mode's overrides, by mode name. */
  modes: Record<string, { kind: ReturnType<typeof modeKind>; files: string[]; tokens: TokenMap }>
  /** Problems reading the files themselves. */
  errors: Array<{ file: string; message: string }>
}

/** Read a map of file name to JSON (an object, or its text) into defaults and modes. */
export function readTokenFiles(files: Record<string, unknown>): TokenSet {
  const set: TokenSet = { base: new Map(), modes: {}, errors: [] }
  for (const [path, raw] of Object.entries(files)) {
    const file = path.split('/').pop() ?? path
    let tree = raw
    if (typeof raw === 'string') {
      try {
        tree = JSON.parse(raw)
      } catch {
        set.errors.push({ file, message: 'is not valid JSON.' })
        continue
      }
    }
    if (!tree || typeof tree !== 'object' || Array.isArray(tree)) {
      set.errors.push({ file, message: 'must be a JSON object of token groups.' })
      continue
    }
    const parts = file.replace(/\.json$/, '').split('.')
    const mode = parts.length > 1 ? parts[parts.length - 1] : undefined
    const target = mode ? (set.modes[mode] ??= { kind: modeKind(mode), files: [], tokens: new Map() }) : undefined
    if (target) target.files.push(file)
    for (const t of flatten(tree, file)) {
      const into = target ? target.tokens : set.base
      if (into.has(t.name)) set.errors.push({ file, message: `defines "${t.name}" again (also in ${into.get(t.name)!.file}).` })
      into.set(t.name, t)
    }
  }
  return set
}

/** The defaults with one mode's overrides applied. */
export function withMode(set: TokenSet, mode?: string): TokenMap {
  if (!mode) return set.base
  const merged = new Map(set.base)
  for (const [name, t] of set.modes[mode]?.tokens ?? []) merged.set(name, t)
  return merged
}

const ALIAS = /^\{([^{}]+)\}$/

/** The token an alias points to, if a value is one: "{palette.neutral.50}" -> "palette.neutral.50". */
export const aliasOf = (value: unknown): string | null => (typeof value === 'string' ? (value.match(ALIAS)?.[1] ?? null) : null)

export type Resolved = { ok: true; value: unknown; chain: string[] } | { ok: false; error: string; chain: string[] }

/** Follow aliases to a final value, inside composite values too. Reports missing targets and cycles. */
export function resolve(name: string, tokens: TokenMap, seen: string[] = []): Resolved {
  if (seen.includes(name)) return { ok: false, error: `alias cycle: ${[...seen, name].join(' -> ')}`, chain: seen }
  const t = tokens.get(name)
  if (!t) return { ok: false, error: `"${name}" doesn't exist`, chain: seen }
  return resolveValue(t.value, tokens, [...seen, name])
}

function resolveValue(value: unknown, tokens: TokenMap, chain: string[]): Resolved {
  const target = aliasOf(value)
  if (target) {
    const r = resolve(target, tokens, chain)
    return r.ok ? { ...r, chain: r.chain } : r
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> | unknown[] = Array.isArray(value) ? [] : {}
    for (const [k, v] of Object.entries(value)) {
      const r = resolveValue(v, tokens, chain)
      if (!r.ok) return r
      ;(out as Record<string, unknown>)[k] = r.value
    }
    return { ok: true, value: out, chain }
  }
  return { ok: true, value, chain }
}

/** A ramp stop a color token points at, from its alias chain: "{palette.neutral.950}" -> { ramp: "neutral", stop: 950 }. */
export function rampStop(name: string, tokens: TokenMap): { ramp: string; stop: number } | 'white' | 'black' | null {
  const r = resolve(name, tokens)
  for (const step of r.chain) {
    const m = step.match(/(?:^|\.)([a-z][a-z0-9-]*)\.(\d{2,3})$/i)
    if (m && Number(m[2]) % 50 === 0 && Number(m[2]) <= 950) return { ramp: m[1], stop: Number(m[2]) }
    if (/(?:^|\.)white$/.test(step)) return 'white'
    if (/(?:^|\.)black$/.test(step)) return 'black'
  }
  if (r.ok && typeof r.value === 'string') {
    if (/^#?f{3}(f{3})?$/i.test(r.value)) return 'white'
    if (/^#?0{3}(0{3})?$/.test(r.value)) return 'black'
  }
  return null
}

/** Color role names in a token map: "color.on-surface" -> "on-surface". */
export const colorRoles = (tokens: TokenMap): string[] =>
  [...tokens.values()].filter(t => t.type === 'color' && /^color\.[a-z0-9-]+$/.test(t.name)).map(t => t.name.slice('color.'.length))
