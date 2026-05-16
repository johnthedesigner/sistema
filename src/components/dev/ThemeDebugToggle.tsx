'use client'

import { useEffect } from 'react'

const SESSION_KEY = 'debug-theme'

export function ThemeDebugToggle() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== 'KeyD' || !e.altKey || !e.shiftKey || e.metaKey || e.ctrlKey) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      if (isDark) {
        document.documentElement.removeAttribute('data-theme')
        sessionStorage.setItem(SESSION_KEY, 'light')
      } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        sessionStorage.setItem(SESSION_KEY, 'dark')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
