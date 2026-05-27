'use client'

import { useState, useId } from 'react'

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

interface Criterion {
  label: string
  sublabel: string
  threshold: number
  level: 'AA' | 'AAA'
}

const CRITERIA: Criterion[] = [
  { label: 'Normal text',     sublabel: 'Body, labels, UI text',   threshold: 4.5, level: 'AA'  },
  { label: 'Large text',      sublabel: '18pt+ or 14pt+ bold',     threshold: 3.0, level: 'AA'  },
  { label: 'UI components',   sublabel: 'Icons, borders, controls', threshold: 3.0, level: 'AA'  },
  { label: 'Normal text',     sublabel: 'Body, labels, UI text',   threshold: 7.0, level: 'AAA' },
  { label: 'Large text',      sublabel: '18pt+ or 14pt+ bold',     threshold: 4.5, level: 'AAA' },
]

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

export function ContrastChecker() {
  const [fg, setFg] = useState('#1a1f2e')
  const [bg, setBg] = useState('#ffffff')

  const fgValid = isValidHex(fg)
  const bgValid = isValidHex(bg)
  const bothValid = fgValid && bgValid

  const ratio = bothValid ? contrast(fg, bg) : null
  const ratioDisplay = ratio !== null ? ratio.toFixed(2) : '—'

  // Determine the highest level this pair achieves
  const passesAAA = ratio !== null && ratio >= 7.0
  const passesAA  = ratio !== null && ratio >= 4.5
  const ratingLabel = passesAAA ? 'AAA' : passesAA ? 'AA' : ratio !== null && ratio >= 3.0 ? 'AA large / UI' : 'Fail'
  const ratingColor = passesAAA ? '#2C7900' : passesAA ? '#0070FF' : ratio !== null && ratio >= 3.0 ? '#8B6B00' : '#E60026'

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
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

      {/* Preview + ratio */}
      <div
        className="rounded-radius-lg border border-border overflow-hidden"
        style={{ background: bgValid ? bg : 'var(--color-surface)' }}
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
            Normal body text — the quick brown fox jumps over the lazy dog.
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
              className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
              style={{ background: ratingColor, color: '#fff' }}
            >
              {ratingLabel}
            </span>
          )}
          <span
            className="font-mono text-[11px] sm:ml-auto"
            style={{ color: fgValid ? fg : 'inherit', opacity: 0.5 }}
          >
            WCAG 2.2 contrast ratio
          </span>
        </div>
      </div>

      {/* Criteria grid */}
      <div className="border border-border rounded-radius-lg overflow-hidden divide-y divide-border">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-2 bg-surface-sunken">
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted">Criterion</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted text-right">Level</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-muted text-right">Result</span>
        </div>

        {CRITERIA.map((c, i) => {
          const passes = ratio !== null ? ratio >= c.threshold : null
          return (
            <div key={i} className="grid grid-cols-[1fr_80px_80px] gap-4 items-center px-4 py-3 bg-surface">
              <div>
                <p className="text-[13.5px] text-on-surface font-medium m-0">{c.label}</p>
                <p className="text-[11.5px] text-on-surface-muted m-0">{c.sublabel} · ≥ {c.threshold}:1</p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-on-surface-muted text-right">{c.level}</span>
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
            POST /api/contrast {'{ "foreground": "#hex", "background": "#hex" }'}
          </p>
        </div>
        <button
          onClick={() => {
            if (!bothValid) return
            const cmd = `POST {{sistema_url}}/api/contrast\n{ "foreground": "${fg}", "background": "${bg}" }`
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
