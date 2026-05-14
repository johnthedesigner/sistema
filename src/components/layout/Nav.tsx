'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wordmark } from '@/components/Logo'

const NAV_LINKS = [
  { label: 'Plays', href: '/playbooks' },
  { label: 'Knowledge Base', href: '/kb' },
  { label: 'Tools', href: '/tools/palette' },
  { label: 'Guide', href: '/guide' },
]

export function Nav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/playbooks') return pathname.startsWith('/playbooks') || pathname.startsWith('/campaigns')
    return pathname.startsWith(href)
  }

  return (
    <header className="border-b border-border bg-surface-raised">
      <div className="flex items-center justify-between px-10 h-[68px]">
        {/* Left: wordmark + links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center">
            <Wordmark size={22} />
          </Link>
          <nav className="flex items-center gap-7">
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
                  style={active ? undefined : undefined}
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
        </div>

        {/* Right: search + auth */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 h-[34px] px-3 border border-border rounded-radius-md bg-surface-raised text-on-surface-subtle text-[13px] min-w-[260px]">
            <SearchIcon />
            <span>Search plays, KB, tools…</span>
            <span className="ml-auto font-mono text-[11px] px-1.5 py-0.5 border border-border rounded text-on-surface-subtle">
              ⌘K
            </span>
          </div>
          <button className="h-[34px] px-3 border border-border rounded-radius-md text-[13px] font-medium text-on-surface bg-surface-raised hover:bg-surface-sunken transition-colors">
            Sign in
          </button>
          <button className="h-[34px] px-3 rounded-radius-md text-[13px] font-medium text-on-primary bg-primary hover:opacity-90 transition-opacity">
            Get started
          </button>
        </div>
      </div>
    </header>
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
