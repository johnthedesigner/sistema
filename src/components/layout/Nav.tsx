'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CommandPalette } from '@/components/search/CommandPalette'
import { SistemaByJtdLogo } from '@/components/logos/SistemaByJtdLogo'

const NAV_LINKS = [
  { label: 'Playbook', href: '/playbooks' },
  { label: 'Knowledge Base', href: '/kb' },
  { label: 'Tools', href: '/tools/palette' },
]

export function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/playbooks') return pathname.startsWith('/playbooks') || pathname.startsWith('/campaigns')
    return pathname.startsWith(href)
  }

  function close() { setMobileOpen(false) }

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 border-b border-border bg-surface-raised z-40">
        <div className="flex items-center px-5 md:px-10 h-[60px] md:h-[68px]">
          {/* Left: wordmark */}
          <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center" onClick={close}>
              <SistemaByJtdLogo height={40} />
            </Link>
          </div>

          {/* Center: desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'relative text-[14px] font-medium py-1.5 transition-colors',
                    active ? 'text-on-surface' : 'text-on-surface-muted hover:text-on-surface',
                  ].join(' ')}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute inset-x-0 bg-primary"
                      style={{ bottom: -18, height: 2 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right: desktop search + CTA / mobile controls */}
          <div className="flex items-center justify-end gap-3.5 flex-1">
            <div className="hidden md:flex items-center gap-3.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 h-[34px] px-3 border border-border rounded-radius-md bg-surface-raised text-on-surface-subtle hover:border-border-strong transition-colors"
                aria-label="Search"
              >
                <SearchIcon />
                <span className="font-mono text-[11px] px-1.5 py-0.5 border border-border border-blue-200 rounded text-on-surface-subtle">
                  ⌘K
                </span>
              </button>
              <Link
                href="/guide"
                className="h-[34px] px-3 inline-flex items-center rounded-radius-md text-[13px] font-medium text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
              >
                Get started
              </Link>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-radius-md border border-border text-on-surface-muted hover:bg-surface-sunken transition-colors"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-radius-md border border-border text-on-surface-muted hover:bg-surface-sunken transition-colors"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface-raised">
            <nav className="flex flex-col px-5 py-3">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className={[
                      'flex items-center h-11 text-[15px] font-medium border-b border-border transition-colors',
                      active ? 'text-primary' : 'text-on-surface-muted',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="flex px-5 pb-4 pt-2">
              <Link
                href="/guide"
                onClick={close}
                className="flex-1 inline-flex items-center justify-center h-[38px] rounded-radius-md text-[13.5px] font-medium text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function SearchIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
