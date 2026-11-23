/**
 * The contrast pairs a set of color roles implies, from the color guide's
 * "Pairs to check" (guide.color.architecture#pairs-to-check), for the roles a
 * token file can express. Used by the token validator and dark mode mapping.
 */
import type { Purpose } from './contrast'

export interface RolePair {
  foreground: string
  background: string
  purpose: Purpose
  /** Set when the pair exists only if the product uses it, such as destructive menu items. */
  when?: string
}

/** Surfaces text sits on, in the order a reader meets them. */
export const TEXT_SURFACES = ['surface', 'surface-raised', 'surface-overlay', 'surface-subtle', 'surface-featured', 'surface-hover', 'surface-selected']
/** Text roles that sit on the ordinary surfaces. Disabled text is exempt from contrast (WCAG 1.4.3). */
const SURFACE_TEXT = ['on-surface', 'on-surface-muted', 'on-surface-faint', 'link']
/** Non-text roles that must stand out from the surfaces (color.contrast.ui). */
const SURFACE_UI = ['border-focus', 'border-strong']
const UI_SURFACES = ['surface', 'surface-raised', 'surface-overlay']

export function rolePairs(roles: Iterable<string>): RolePair[] {
  const has = new Set(roles)
  const pairs: RolePair[] = []
  const add = (foreground: string, background: string, purpose: Purpose, when?: string) => {
    if (has.has(foreground) && has.has(background) && !pairs.some(p => p.foreground === foreground && p.background === background)) pairs.push({ foreground, background, purpose, ...(when ? { when } : {}) })
  }
  for (const fg of SURFACE_TEXT) for (const bg of TEXT_SURFACES) add(fg, bg, 'text')
  for (const fg of SURFACE_UI) for (const bg of UI_SURFACES) add(fg, bg, 'ui')
  // Menus: each item on the highlight, including destructive ones.
  add('on-surface', 'surface-highlight', 'text')
  add('error', 'surface-highlight', 'text', 'menus have destructive items')
  // Every on-X role on its X, and on its X's hover fill (filled buttons and their hover).
  for (const role of has) {
    if (!role.startsWith('on-') || role === 'on-surface-disabled') continue
    const base = role.slice(3)
    if (SURFACE_TEXT.includes(role)) continue
    add(role, base, 'text')
    add(role, `${base}-hover`, 'text')
  }
  return pairs
}
