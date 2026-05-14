import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        surface:          'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        'surface-overlay':'var(--color-surface-overlay)',

        // Text on surfaces
        'on-surface':     'var(--color-on-surface)',
        'on-surface-muted':'var(--color-on-surface-muted)',

        // Borders
        border:           'var(--color-border)',
        'border-focus':   'var(--color-border-focus)',

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
        // Token-named radius classes: rounded-radius-md, rounded-radius-lg, etc.
        // Kept separate from Tailwind defaults (rounded-md etc.) to avoid breakage.
        'radius-none': 'var(--radius-none)',
        'radius-sm':   'var(--radius-sm)',
        'radius-md':   'var(--radius-md)',
        'radius-lg':   'var(--radius-lg)',
        'radius-xl':   'var(--radius-xl)',
        'radius-full': 'var(--radius-full)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
