'use client'

/**
 * The contrast tool's demonstration (D46). The ratio is computed in the browser
 * with the same WCAG 2.x formula the API uses; the required values come from the
 * rules registry for each standard, built on the server (`table`).
 */
import { useEffect, useState } from 'react'
import { trackToolPage } from '@/lib/analytics/browser'
import { standardName } from '@/lib/tools/levels'
import type { ContrastTable } from '@/lib/tools/contrast'
import type { Swatch } from '@/lib/tools/swatches'
import { ColorField, DemoLayout, StandardPicker } from '@/components/tools/ToolControls'

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function luminance(hex: string): number {
  const h = hex.replace('#', '')
  return 0.2126 * linearize(parseInt(h.slice(0, 2), 16)) + 0.7152 * linearize(parseInt(h.slice(2, 4), 16)) + 0.0722 * linearize(parseInt(h.slice(4, 6), 16))
}
function contrast(fg: string, bg: string): number {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}
const HEX = /^#[0-9a-fA-F]{6}$/

/** The three checks the contrast API runs, with what each covers and the rule it comes from. */
const CHECKS = [
  { key: 'text', label: 'Normal text', covers: 'Body text, labels, and interface text', rule: 'color.contrast.text' },
  { key: 'large_text', label: 'Large text', covers: '24px and up, or bold at 18.66px and up', rule: 'color.contrast.large-text' },
  { key: 'ui', label: 'Interface parts', covers: 'Icons, control edges, and focus rings', rule: 'color.contrast.ui' },
] as const

export function ContrastChecker({ table, foregrounds, backgrounds }: { table: ContrastTable; foregrounds: Swatch[]; backgrounds: Swatch[] }) {
  const options = Object.entries(table).flatMap(([s, levels]) => Object.keys(levels).map(l => `${s} ${l}`))
  const [fg, setFg] = useState(foregrounds[0]?.hex ?? '#1F2937')
  const [bg, setBg] = useState('#FFFFFF')
  const [choice, setChoice] = useState(options.includes('wcag-2.2 AA') ? 'wcag-2.2 AA' : options[0])
  const [standard, level] = choice.split(' ')
  const required = table[standard]?.[level] ?? {}

  useEffect(() => {
    trackToolPage('contrast', { foreground: fg, background: bg, standard, level })
  }, [fg, bg, standard, level])

  const valid = HEX.test(fg) && HEX.test(bg)
  const ratio = valid ? contrast(fg, bg) : null
  // Passing uses the exact ratio; WCAG doesn't round up.
  const results = CHECKS.map(c => ({ ...c, needs: required[c.key], pass: ratio !== null && required[c.key] !== undefined ? ratio >= required[c.key]! : null }))
  const summary = ratio === null ? '' : results.every(r => r.pass !== false) ? 'Passes every check' : results.find(r => r.key === 'large_text')?.pass ? 'Large text and interface parts only' : 'Fails'

  return (
    <DemoLayout
      controls={
        <>
          <ColorField label="Text color" hint="The foreground: text, icons, or edges." value={fg} onChange={setFg} swatches={foregrounds} />
          <button type="button" onClick={() => { setFg(bg); setBg(fg) }}
            className="justify-self-start inline-flex items-center gap-2 h-control-height-sm px-3 rounded-radius-md border border-border-strong text-label text-on-surface hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Swap the colors
          </button>
          <ColorField label="Background" hint="The surface it sits on." value={bg} onChange={setBg} swatches={backgrounds} />
          <StandardPicker value={choice} onChange={setChoice} options={options} />
        </>
      }
      output={
        <div className="grid gap-4">
          <div className="rounded-radius-xl overflow-hidden shadow-featured" style={{ background: HEX.test(bg) ? bg : undefined, color: HEX.test(fg) ? fg : undefined }}>
            <div className="px-6 md:px-10 py-10 md:py-14">
              <p className="text-heading-lg font-serif m-0">Large text, as a heading</p>
              <p className="text-body m-0 mt-3 max-w-[60ch]">Normal text, as people read it in a paragraph, a label, or a menu. Contrast decides whether it stays readable for people with low vision, and in bright light for everyone.</p>
              <div className="flex items-center gap-3 mt-6" aria-hidden="true">
                <span className="inline-flex items-center h-control-height px-4 rounded-radius-md text-label" style={{ boxShadow: 'inset 0 0 0 1.5px currentColor' }}>A control edge</span>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>

          <div className="rounded-radius-xl bg-surface-raised p-5 md:p-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-heading-xl font-serif text-on-surface tabular-nums">{ratio !== null ? ratio.toFixed(2) : '—'}<span className="text-heading-sm text-on-surface-muted"> : 1</span></span>
              <span className="text-body text-on-surface-muted">{summary ? `${summary} for ${standardName(choice)}` : 'Enter two colors'}</span>
            </div>
            <ul className="list-none m-0 mt-5 p-0 divide-y divide-border">
              {results.map(r => (
                <li key={r.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center py-3">
                  <span className="min-w-0">
                    <span className="block text-label text-on-surface">{r.label}</span>
                    <span className="block text-caption text-on-surface-muted">{r.covers} · <span className="font-mono">{r.rule}</span></span>
                  </span>
                  <span className="flex items-center gap-4 text-body-sm">
                    <span className="text-on-surface-muted tabular-nums">{r.needs !== undefined ? `needs ${r.needs} : 1` : 'not required'}</span>
                    {r.pass !== null && (
                      <span className="inline-flex items-center gap-1.5 text-label text-on-surface w-12">
                        <span aria-hidden="true" className={`inline-block w-2 h-2 rounded-radius-full ${r.pass ? 'bg-success' : 'bg-error'}`} />
                        {r.pass ? 'Pass' : 'Fail'}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  )
}
