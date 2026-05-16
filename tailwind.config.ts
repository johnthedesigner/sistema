import type { Config } from 'tailwindcss'
import fs from 'fs'
import path from 'path'

// Load the pre-generated OKLCH palette library and expand into Tailwind color stops.
// 22 families × 19 stops (50–950 in 50-step increments).
// Usage: bg-base-blue-200, text-base-purple-650, border-base-red-500, etc.
type PaletteLibrary = Record<string, { stops: Record<string, { hex: string }> }>
const _lib = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public/palettes/library.json'), 'utf-8')
) as PaletteLibrary
const baseColors: Record<string, Record<string, string>> = {}
for (const [name, data] of Object.entries(_lib)) {
  baseColors[`base-${name}`] = Object.fromEntries(
    Object.entries(data.stops).map(([stop, info]) => [stop, info.hex])
  )
}

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pre-generated OKLCH palette — bg-base-blue-200, text-base-purple-650, etc.
        ...baseColors,

        // Canvas (page background)
        canvas:           'var(--color-canvas)',

        // Surfaces
        surface:          'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        'surface-overlay':'var(--color-surface-overlay)',
        'surface-sunken': 'var(--color-surface-sunken)',

        // Text on surfaces
        'on-surface':        'var(--color-on-surface)',
        'on-surface-muted':  'var(--color-on-surface-muted)',
        'on-surface-subtle': 'var(--color-on-surface-subtle)',

        // Borders
        border:           'var(--color-border)',
        'border-strong':  'var(--color-border-strong)',
        'border-focus':   'var(--color-border-focus)',

        // Brand
        'brand-yellow':    'var(--color-brand-yellow)',
        'brand-yellow-50': 'var(--color-brand-yellow-50)',
        'brand-red':       'var(--color-brand-red)',
        'brand-blue-50':   'var(--color-brand-blue-50)',

        // Primary
        primary:              'var(--color-primary)',
        'on-primary':         'var(--color-on-primary)',
        'primary-container':  'var(--color-primary-container)',
        'on-primary-container':'var(--color-on-primary-container)',

        // Secondary
        secondary:              'var(--color-secondary)',
        'on-secondary':         'var(--color-on-secondary)',
        'secondary-container':  'var(--color-secondary-container)',
        'on-secondary-container':'var(--color-on-secondary-container)',

        // Semantic states
        error:      'var(--color-error)',
        'on-error': 'var(--color-on-error)',
        success:    'var(--color-success)',
        'on-success':'var(--color-on-success)',
        warning:    'var(--color-warning)',
        'on-warning':'var(--color-on-warning)',
      },

      fontFamily: {
        // Overrides Tailwind defaults so font-sans/serif/mono resolve to token vars.
        // next/font sets these vars on <html> — the class wins over :root in generated.css.
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },

      borderRadius: {
        'radius-none': 'var(--radius-none)',
        'radius-sm':   'var(--radius-sm)',
        'radius-md':   'var(--radius-md)',
        'radius-lg':   'var(--radius-lg)',
        'radius-xl':   'var(--radius-xl)',
        'radius-full': 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
