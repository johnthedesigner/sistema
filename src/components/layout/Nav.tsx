'use client'

/**
 * Site navigation (site-structure.md section 1): Get started, Guides, Reference,
 * and Tools, with search and GitHub on the right. The current section is
 * marked in blue (DESIGN.md: blue marks where you are).
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CommandPalette } from '@/components/search/CommandPalette'
import { SistemaByJtdLogo } from '@/components/logos/SistemaByJtdLogo'

const GET_STARTED = [
  { label: 'How Sistema works', href: '/how-it-works', desc: 'Stages, approvals, and what lands in your repo.' },
  { label: 'Start a design system', href: '/start', desc: 'From nothing to an approved, checked token system.' },
  { label: 'Audit what you have', href: '/audit', desc: 'What’s consistent, what fails, what’s missing.' },
  { label: 'Update my system', href: '/update', desc: 'Document it, add to it, check it, plan.' },
  { label: 'Connect the MCP server', href: '/connect', desc: 'Use Sistema inside your agent.' },
]
const LINKS = [
  { label: 'Plays', href: '/plays' },
  { label: 'Guides', href: '/guides' },
  { label: 'Reference', href: '/reference' },
  { label: 'Tools', href: '/tools' },
]
const START_PATHS = ['/how-it-works', '/start', '/audit', '/update', '/connect']

/** Workflow pages sit under Plays. */
const isActive = (pathname: string, href: string) => pathname.startsWith(href) || (href === '/plays' && pathname.startsWith('/workflows'))

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'
const item = (active: boolean) =>
  `inline-flex items-center gap-1 h-control-height-sm px-3 rounded-radius-md text-label transition-colors motion-reduce:transition-none ${focusRing} ${
    active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-muted hover:text-on-surface hover:bg-surface-hover'
  }`

export function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const startActive = START_PATHS.some(p => pathname.startsWith(p))

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
      if (e.key === 'Escape') setMenuOpen(false)
    }
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-raised/95 backdrop-blur supports-[backdrop-filter]:bg-surface-raised/80 shadow-[inset_0_-1px_0_var(--color-border)]">
        <div className="max-w-[1240px] mx-auto flex items-center gap-4 px-5 md:px-10 h-[60px]">
          <Link href="/" className={`flex items-center shrink-0 rounded-radius-sm ${focusRing}`} aria-label="Sistema home">
            <SistemaByJtdLogo height={34} />
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-1 ml-4">
            <div className="relative" ref={menuRef}>
              <button type="button" aria-expanded={menuOpen} aria-controls="get-started-menu" onClick={() => setMenuOpen(o => !o)} className={item(startActive)}>
                Get started
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${menuOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {menuOpen && (
                <div id="get-started-menu" className="absolute left-0 top-[calc(100%+8px)] w-[340px] rounded-radius-xl bg-surface-overlay shadow-overlay p-2">
                  {GET_STARTED.map(l => (
                    <Link key={l.href} href={l.href} className={`block rounded-radius-sm px-3 py-2.5 no-underline hover:bg-surface-highlight ${focusRing}`}>
                      <span className="block text-label text-on-surface">{l.label}</span>
                      <span className="block text-caption text-on-surface-muted">{l.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} aria-current={isActive(pathname, l.href) ? 'page' : undefined} className={`${item(isActive(pathname, l.href))} no-underline`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search (⌘K)" className={`${item(false)} hidden md:inline-flex`}>
              <SearchIcon />
              <span className="font-mono text-caption text-on-surface-faint">⌘K</span>
            </button>
            <a href="https://github.com/johnthedesigner/sistema" aria-label="Sistema on GitHub" className={`${item(false)} hidden md:inline-flex`}>
              <GitHubIcon />
            </a>
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={`${item(false)} md:hidden`}>
              <SearchIcon />
            </button>
            <button type="button" onClick={() => setMobileOpen(o => !o)} aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className={`${item(false)} md:hidden`}>
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav id="mobile-nav" aria-label="Main" className="md:hidden px-5 pb-4 bg-surface-raised">
            <p className="text-caption text-on-surface-faint m-0 mt-2 mb-1">Get started</p>
            {GET_STARTED.map(l => (
              <Link key={l.href} href={l.href} className={`flex items-center min-h-11 text-body text-on-surface no-underline ${focusRing}`}>{l.label}</Link>
            ))}
            <div className="h-px bg-border my-2" />
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`flex items-center min-h-11 text-body no-underline ${pathname.startsWith(l.href) ? 'text-link' : 'text-on-surface'} ${focusRing}`}>{l.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function SearchIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function GitHubIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
