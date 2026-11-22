'use client'

/**
 * The theme switch in the footer's bottom row (DECISIONS.md, 2026-11-21).
 * System follows the operating system (the CSS media query in generated.css);
 * Light and Dark set data-theme on <html>. The choice is kept in localStorage
 * under `sistema-theme` (the privacy page says so); THEME_SCRIPT applies it before
 * the first paint, so a reload doesn't flash the other theme.
 */
import { useEffect, useState } from 'react'

import { THEME_KEY } from '@/lib/theme'

type Theme = 'system' | 'light' | 'dark'
const OPTIONS: Theme[] = ['system', 'light', 'dark']
const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme')
    if (t === 'light' || t === 'dark') setTheme(t)
  }, [])

  function choose(t: Theme) {
    setTheme(t)
    if (t === 'system') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', t)
    try {
      if (t === 'system') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, t)
    } catch {}
  }

  return (
    <div role="group" aria-label="Theme" className="inline-flex p-0.5 rounded-radius-md bg-surface-hover">
      {OPTIONS.map(t => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => choose(t)}
          className="h-7 px-2.5 rounded-radius-sm text-caption text-on-surface-muted aria-pressed:bg-surface-raised aria-pressed:text-on-surface aria-pressed:shadow-control transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus"
        >
          {LABEL[t]}
        </button>
      ))}
    </div>
  )
}
