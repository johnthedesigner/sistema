import * as React from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import { Atkinson_Hyperlegible_Next } from 'next/font/google'
// The same global stylesheet the app imports (src/app/layout.tsx): Tailwind,
// the compiled tokens, the Tailwind theme mapping, and the shadcn variables.
import '../src/app/globals.css'

// The same font loader and weights as src/app/layout.tsx.
const fontSans = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson-next',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

type Theme = 'light' | 'dark' | 'system'

/** Sets data-theme on <html> exactly as the app's theme switch does (system = no attribute). */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme (sets data-theme on <html>, like the app)',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme ?? 'light') as Theme
      React.useEffect(() => applyTheme(theme), [theme])
      applyTheme(theme)
      return (
        // Storybook's preview styles set its own body font, and docs pages put
        // stories on a white block; repeat the app's body rules (globals.css) on
        // the wrapper so every story, in the canvas or on a docs page, sits on the
        // theme's page color and inherits what the app does.
        <div className={`${fontSans.variable} bg-surface font-sans text-body text-on-surface`}>
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Violations fail the story tests (addon-vitest); checked in both themes.
      test: 'error',
    },
    docs: { codePanel: true },
  },
}

export default preview
