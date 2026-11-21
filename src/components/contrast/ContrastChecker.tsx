'use client'

import { useEffect, useState, useId } from 'react'
import { trackToolPage } from '@/lib/analytics/browser'
import { SITE_URL } from '@/lib/site-url'
import { STANDARD_LABELS } from '@/lib/tools/levels'
import type { ContrastTable } from '@/lib/tools/contrast'

// WCAG 2.x contrast computed client-side — no API round-trip needed for the UI
function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/

function isValidHex(s: string): boolean {
  return HEX_RE.test(s)
}

function normalizeInput(s: string): string {
  const t = s.trim()
  return t.startsWith('#') ? t : '#' + t
}

// The three checks the contrast API runs, with the rule each comes from.
const CHECKS = [
  { key: 'text', label: 'Normal text', sublabel: 'Body, labels, interface text', rule: 'color.contrast.text' },
  { key: 'large_text', label: 'Large text', sublabel: '24px and up, or 18.66px bold and up', rule: 'color.contrast.large-text' },
  { key: 'ui', label: 'UI components', sublabel: 'Icons, borders, focus rings, controls', rule: 'color.contrast.ui' },
] as const

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  const valid = isValidHex(value)

  return (
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="block font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Native color picker — synced to hex input */}
        <input
          type="color"
          value={valid ? value : '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-radius-md border border-border cursor-pointer bg-surface p-0.5 shrink-0"
          aria-label={`${label} color picker`}
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={e => onChange(normalizeInput(e.target.value))}
          maxLength={7}
          placeholder="#000000"
          className="flex-1 min-w-0 h-10 px-3 font-mono text-[13px] border rounded-radius-md bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          style={{ borderColor: valid ? 'var(--color-border)' : 'var(--color-error)' }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

/** `table` holds the required ratios from the rules registry, by standard and level (built on the server). */
export function ContrastChecker({ table }: { table: ContrastTable }) {
  const [fg, setFg] = useState('#1a1f2e')
  const [bg, setBg] = useState('#ffffff')
  const [standard, setStandard] = useState('wcag-2.2')
  const [level, setLevel] = useState('AA')
  const levels = Object.keys(table[standard] ?? {})
  const activeLevel = levels.includes(level) ? level : levels[0]
  const required = table[standard]?.[activeLevel] ?? {}

  useEffect(() => {
    trackToolPage('contrast', { foreground: fg, background: bg, standard, level: activeLevel })
  }, [fg, bg, standard, activeLevel])

  const fgValid = isValidHex(fg)
  const bgValid = isValidHex(bg)
  const bothValid = fgValid && bgValid

  const ratio = bothValid ? contrast(fg, bg) : null
  const ratioDisplay = ratio !== null ? ratio.toFixed(2) : '—'

  // Summary for the chosen standard. Passing uses the exact ratio; WCAG doesn't round up.
  const passText = ratio !== null && required.text !== undefined && ratio >= required.text
  const passLarge = ratio !== null && required.large_text !== undefined && ratio >= required.large_text
  const ratingLabel = passText ? 'Passes all text' : passLarge ? 'Large text and UI only' : 'Fails'
  const ratingColor = passText ? '#2C7900' : passLarge ? '#8B6B00' : '#E60026'

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <ColorInput label="Foreground" value={fg} onChange={setFg} />

        {/* Swap button */}
        <button
          onClick={() => { setFg(bg); setBg(fg) }}
          className="shrink-0 h-10 w-10 flex items-center justify-center border border-border rounded-radius-md bg-surface text-on-surface-muted hover:bg-surface-sunken transition-colors mb-[0px]"
          aria-label="Swap foreground and background"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ColorInput label="Background" value={bg} onChange={setBg} />
      </div>

      {/* Standard */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex-1 min-w-0">
          <span className="block font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted mb-2">Standard</span>
          <select
            value={standard}
            onChange={e => setStandard(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded-radius-md bg-surface text-on-surface text-[13px] focus:outline-none focus:border-primary appearance-none"
          >
            {Object.keys(table).map(s => (
              <option key={s} value={s}>{STANDARD_LABELS[s] ?? s}</option>
            ))}
          </select>
        </label>
        <label className="sm:w-40">
          <span className="block font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted mb-2">Level</span>
          <select
            value={activeLevel}
            onChange={e => setLevel(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded-radius-md bg-surface text-on-surface text-[13px] focus:outline-none focus:border-primary appearance-none"
          >
            {levels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Preview + ratio */}
      <div
        className="rounded-radius-lg border border-border overflow-hidden"
        style={{ background: bgValid ? bg : 'var(--color-surface-raised)' }}
      >
        {/* Text preview */}
        <div className="px-6 py-8">
          <p
            className="text-[32px] font-serif font-medium leading-tight m-0 mb-2"
            style={{ color: fgValid ? fg : 'var(--color-on-surface)' }}
          >
            Large text sample
          </p>
          <p
            className="text-[15px] leading-[1.6] m-0"
            style={{ color: fgValid ? fg : 'var(--color-on-surface)' }}
          >
            Normal body text. The quick brown fox jumps over the lazy dog.
            Used for reading tasks, labels, and interface copy.
          </p>
        </div>

        {/* Ratio strip */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4"
          style={{ background: 'rgba(0,0,0,0.06)', borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div>
            <span
              className="font-mono font-semibold"
              style={{ fontSize: 28, letterSpacing: '-0.02em', color: fgValid ? fg : 'inherit' }}
            >
              {ratioDisplay}
            </span>
            <span
              className="font-mono text-[14px] ml-1.5"
              style={{ color: fgValid ? fg : 'inherit', opacity: 0.7 }}
            >
              : 1
            </span>
          </div>
          {ratio !== null && (
            <span
              className="self-start sm:self-auto font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
              style={{ background: ratingColor, color: '#fff' }}
            >
              {ratingLabel}
            </span>
          )}
          <span
            className="font-mono text-[11px] sm:ml-auto"
            style={{ color: fgValid ? fg : 'inherit', opacity: 0.5 }}
          >
            WCAG contrast ratio
          </span>
        </div>
      </div>

      {/* Criteria grid */}
      <div className="border border-border rounded-radius-lg overflow-hidden divide-y divide-border">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-2 bg-surface-sunken">
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted">Criterion</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted text-right">Needs</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted text-right">Result</span>
        </div>

        {CHECKS.map(c => {
          const threshold = required[c.key]
          if (threshold === undefined) {
            return (
              <div key={c.key} className="grid grid-cols-[1fr_80px_80px] gap-4 items-center px-4 py-3 bg-surface">
                <div>
                  <p className="text-[13.5px] text-on-surface font-medium m-0">{c.label}</p>
                  <p className="text-[11.5px] text-on-surface-muted m-0">{STANDARD_LABELS[standard] ?? standard} sets no requirement for this</p>
                </div>
                <span className="font-mono text-[11px] text-on-surface-subtle text-right">—</span>
                <span className="font-mono text-[11px] text-on-surface-subtle text-right">—</span>
              </div>
            )
          }
          const passes = ratio !== null ? ratio >= threshold : null
          return (
            <div key={c.key} className="grid grid-cols-[1fr_80px_80px] gap-4 items-center px-4 py-3 bg-surface">
              <div>
                <p className="text-[13.5px] text-on-surface font-medium m-0">{c.label}</p>
                <p className="text-[11.5px] text-on-surface-muted m-0">{c.sublabel} · <span className="font-mono">{c.rule}</span></p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-on-surface-muted text-right">{threshold}:1</span>
              <div className="flex justify-end">
                {passes === null ? (
                  <span className="font-mono text-[11px] text-on-surface-subtle">—</span>
                ) : passes ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold" style={{ color: '#2C7900' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pass
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold" style={{ color: '#E60026' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    Fail
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* API callout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-radius-md border border-border bg-surface-sunken px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-on-surface mb-0.5">Use this in your AI prompts</p>
          <p className="text-[12px] text-on-surface-muted m-0 leading-[1.45] font-mono break-all">
            GET {SITE_URL}/api/contrast?fg=…&amp;bg=…
          </p>
        </div>
        <button
          onClick={() => {
            if (!bothValid) return
            const cmd = `${SITE_URL}/api/contrast?fg=${encodeURIComponent(fg)}&bg=${encodeURIComponent(bg)}&standard=${encodeURIComponent(`${standard} ${activeLevel}`)}`
            navigator.clipboard.writeText(cmd)
          }}
          disabled={!bothValid}
          className="shrink-0 inline-flex items-center h-[30px] px-3 text-[12px] font-medium border border-border rounded-radius-md text-on-surface bg-surface hover:bg-surface transition-colors disabled:opacity-40"
        >
          Copy
        </button>
      </div>
    </div>
  )
}
