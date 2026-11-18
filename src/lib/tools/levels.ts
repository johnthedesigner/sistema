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
