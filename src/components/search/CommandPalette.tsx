'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchEntry, SearchEntryType } from '@/lib/search'
import { scoreEntry } from '@/lib/search'

const TYPE_CONFIG: Record<SearchEntryType, { label: string; bg: string; color: string }> = {
  play: { label: 'play', bg: '#E6F0FF', color: '#1056BF' },
  featured: { label: 'featured', bg: '#0070FF', color: 'white' },
  kb: { label: 'kb', bg: 'var(--color-surface-sunken)', color: 'var(--color-on-surface-muted)' },
  tool: { label: 'tool', bg: '#FFF8E0', color: '#8A6500' },
}

function TypeBadge({ type }: { type: SearchEntryType }) {
  const { label, bg, color } = TYPE_CONFIG[type]
  return (
    <span
      className="inline-flex items-center shrink-0 h-[20px] px-1.5 rounded font-mono text-[10px] font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  )
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="shrink-0 text-on-surface-muted">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

interface Props {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const indexLoaded = useRef(false)

  // Load index on first open
  useEffect(() => {
    if (open && !indexLoaded.current) {
      fetch('/api/search-data')
        .then(r => r.json())
        .then((data: SearchEntry[]) => {
          setEntries(data)
          indexLoaded.current = true
        })
    }
  }, [open])

  // Focus input and reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      // Small delay so the DOM is painted before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  const results: SearchEntry[] = query.length === 0
    ? []
    : entries
        .map(e => ({ entry: e, score: scoreEntry(e, query) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(r => r.entry)

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const navigate = useCallback((entry: SearchEntry) => {
    router.push(entry.href)
    onClose()
  }, [router, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const target = results[activeIndex]
        if (target) navigate(target)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, activeIndex, navigate, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4"
      style={{ paddingTop: 'clamp(60px, 15vh, 160px)', background: 'rgba(14,17,22,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-radius-xl border border-border bg-surface-raised overflow-hidden"
        style={{ boxShadow: '0 8px 32px rgba(14,17,22,0.18), 0 2px 8px rgba(14,17,22,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 h-[54px] border-b border-border">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search plays, KB entries, tools…"
            className="flex-1 text-[15px] text-on-surface placeholder-on-surface-muted bg-transparent border-none outline-none"
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="text-[11px] font-mono text-on-surface-muted hover:text-on-surface border border-border rounded px-1.5 py-0.5 transition-colors"
            >
              clear
            </button>
          ) : (
            <kbd className="font-mono text-[11px] text-on-surface-subtle border border-border rounded px-1.5 py-0.5">
              esc
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
          {query.length === 0 && (
            <div className="flex items-center justify-center py-10 text-[13px] text-on-surface-muted">
              Type to search {entries.length > 0 ? `${entries.length} entries` : '…'}
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="flex items-center justify-center py-10 text-[13px] text-on-surface-muted">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-1.5" role="listbox">
              {results.map((entry, i) => {
                const isActive = i === activeIndex
                return (
                  <li key={entry.href} role="option" aria-selected={isActive}>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{
                        background: isActive ? 'var(--color-surface-sunken)' : 'transparent',
                        borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => navigate(entry)}
                    >
                      <TypeBadge type={entry.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-medium text-on-surface m-0 truncate">
                          {entry.title}
                        </p>
                        {entry.description && (
                          <p className="text-[12px] text-on-surface-muted m-0 truncate mt-0.5">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-on-surface-subtle">
                        {entry.meta}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 h-[34px] border-t border-border bg-surface-sunken">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-subtle">
            <kbd className="px-1 border border-border rounded text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-subtle">
            <kbd className="px-1 border border-border rounded text-[10px]">↵</kbd>
            open
          </span>
          <span className="ml-auto font-mono text-[11px] text-on-surface-subtle">
            {indexLoaded.current ? `${entries.length} indexed` : 'loading…'}
          </span>
        </div>
      </div>
    </div>
  )
}
