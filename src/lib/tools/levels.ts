/**
 * Browser-safe helpers for standards and levels. Server code reads the rules;
 * pages pass the resulting values to client components.
 */
export const LEVELS = ['A', 'AA', 'AAA'] as const

export const STANDARD_LABELS: Record<string, string> = {
  'wcag-2.2': 'WCAG 2.2',
  'wcag-2.1': 'WCAG 2.1',
  'section-508': 'Section 508',
  'en-301-549': 'EN 301 549',
}

/** A value from a rule's `parameters` for one standard: that level's, or the nearest lower level defined. */
export function valueAtLevel(values: Record<string, unknown> | undefined, level: string): number | null {
  if (!values) return null
  for (let i = LEVELS.indexOf(level as (typeof LEVELS)[number]); i >= 0; i--) {
    const v = values[LEVELS[i]]
    if (typeof v === 'number') return v
  }
  return null
}

/**
 * When you'd choose each standard and level, for the standard pickers (D46). Keys
 * are "<standard> <level>" as sistema.json records them. Values stay in the rules.
 */
export const STANDARD_INFO: Record<string, string> = {
  'wcag-2.2 AA': 'The current web standard. The usual choice, and the level most accessibility laws point to.',
  'wcag-2.2 AAA': 'The strictest level of WCAG 2.2. For products serving people with low vision, or where you want the highest bar.',
  'wcag-2.1 AA': 'The previous version. Choose it when a contract or regulation names 2.1.',
  'wcag-2.1 AAA': 'The strictest level of WCAG 2.1, when a contract names it.',
  'section-508 AA': 'US federal procurement. Its contrast requirements match WCAG AA.',
  'en-301-549 AA': 'The European public sector and the European Accessibility Act. Its contrast requirements match WCAG AA.',
}

/** "wcag-2.2 AA" -> "WCAG 2.2 · AA" */
export const standardName = (key: string) => {
  const [s, l] = key.split(' ')
  return `${STANDARD_LABELS[s] ?? s}${l ? ` · ${l}` : ''}`
}
