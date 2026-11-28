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

import tokenTheme from './src/styles/tokens/tailwind-theme.json'

// Role colors are CSS variables holding hex values, so Tailwind can't add an alpha
// channel to them: `bg-surface-raised/95` would generate nothing. color-mix with
// Tailwind's <alpha-value> makes every opacity modifier work; at full opacity it's
// the same color as the variable.
const roleColors = Object.fromEntries(
  Object.entries(tokenTheme.colors as Record<string, string>).map(([name, value]) => [
    name,
    value.startsWith('var(') ? `color-mix(in srgb, ${value} calc(<alpha-value> * 100%), transparent)` : value,
  ]),
)

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

        // Roles from tokens/src, compiled by `npm run tokens`.
        ...roleColors,

      },

      fontFamily: {
        // Overrides Tailwind defaults so font-sans/serif/mono resolve to token vars.
        // next/font sets these vars on <html> — the class wins over :root in generated.css.
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },

      fontSize: tokenTheme.fontSize as unknown as Record<string, [string, Record<string, string>]>,
      borderRadius: tokenTheme.borderRadius,
      boxShadow: tokenTheme.boxShadow,
      spacing: tokenTheme.spacing,
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
