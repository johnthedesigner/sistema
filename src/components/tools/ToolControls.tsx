'use client'

/**
 * Controls shared by the tool demonstrations (D46): the demo layout, a labeled
 * group, the standard picker (each standard with when you'd choose it), and a
 * color field that starts from swatches of Sistema's palette library.
 */
import { useId, type ReactNode } from 'react'
import { STANDARD_INFO, standardName } from '@/lib/tools/levels'
import type { Swatch } from '@/lib/tools/swatches'

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

/** Sticky controls on the left, the result on the right; stacked on narrow screens. */
export function DemoLayout({ controls, output }: { controls: ReactNode; output: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 items-start">
      <div className="lg:sticky lg:top-24 rounded-radius-xl bg-surface-raised p-5 grid gap-6">{controls}</div>
      <div className="min-w-0">{output}</div>
    </div>
  )
}

export function ControlGroup({ label, hint, htmlFor, children }: { label: string; hint?: ReactNode; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      {htmlFor ? <label htmlFor={htmlFor} className="block text-label text-on-surface mb-1">{label}</label> : <p className="text-label text-on-surface m-0 mb-1">{label}</p>}
      {hint && <p className="text-caption text-on-surface-muted m-0 mb-2">{hint}</p>}
      <div className={hint ? '' : 'mt-2'}>{children}</div>
    </div>
  )
}

/** The order standards are offered in: the usual choice first. */
const STANDARD_ORDER = ['wcag-2.2 AA', 'wcag-2.2 AAA', 'wcag-2.1 AA', 'wcag-2.1 AAA', 'section-508 AA', 'en-301-549 AA']

/** Each standard and level as an option; the chosen one says when you'd choose it. */
export function StandardPicker({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const id = useId()
  const sorted = [...options].sort((a, b) => (STANDARD_ORDER.indexOf(a) + 1 || 99) - (STANDARD_ORDER.indexOf(b) + 1 || 99))
  return (
    <div>
      <p id={`${id}-l`} className="text-label text-on-surface m-0 mb-2">Accessibility standard</p>
      <div role="radiogroup" aria-labelledby={`${id}-l`} aria-describedby={`${id}-d`} className="grid grid-cols-2 gap-1.5">
        {sorted.map(o => {
          const on = o === value
          return (
            <button key={o} type="button" role="radio" aria-checked={on} onClick={() => onChange(o)}
              className={`text-left rounded-radius-md px-3 py-2 text-label transition-colors motion-reduce:transition-none ${focusRing} ${on ? 'bg-primary-container text-on-primary-container ring-1 ring-primary' : 'text-on-surface ring-1 ring-border hover:bg-surface-hover'}`}>
              {standardName(o)}
            </button>
          )
        })}
      </div>
      <p id={`${id}-d`} className="text-caption text-on-surface-muted m-0 mt-2">{STANDARD_INFO[value]}</p>
    </div>
  )
}

const HEX = /^#[0-9a-fA-F]{6}$/

/** A color input: swatches from the palette library first, then a hex field and the system picker. */
export function ColorField({ label, hint, value, onChange, swatches }: { label: string; hint?: string; value: string; onChange: (hex: string) => void; swatches: Swatch[] }) {
  const id = useId()
  const valid = HEX.test(value)
  return (
    <ControlGroup label={label} hint={hint} htmlFor={id}>
      <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label={`${label}: swatches from Sistema's palettes`}>
        {swatches.map(s => (
          <button key={s.hex + s.name} type="button" title={`${s.name} ${s.hex}`} aria-label={`${s.name}, ${s.hex}`} aria-pressed={s.hex.toLowerCase() === value.toLowerCase()} onClick={() => onChange(s.hex)}
            className={`w-7 h-7 rounded-radius-full shadow-control ring-offset-2 ring-offset-surface-raised aria-pressed:ring-2 aria-pressed:ring-primary ${focusRing}`} style={{ background: s.hex }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input type="color" value={valid ? value : '#000000'} onChange={e => onChange(e.target.value.toUpperCase())} aria-label={`${label}: pick any color`}
          className={`w-10 h-10 shrink-0 rounded-radius-md border border-border bg-surface-raised p-0.5 cursor-pointer ${focusRing}`} />
        <input id={id} type="text" value={value} maxLength={7} spellCheck={false}
          onChange={e => { const t = e.target.value.trim(); onChange(t.startsWith('#') ? t : `#${t}`) }}
          aria-invalid={!valid}
          className={`flex-1 min-w-0 h-10 px-3 rounded-radius-md border bg-surface-raised font-mono text-code text-on-surface ${valid ? 'border-border-strong' : 'border-error'} ${focusRing}`} />
      </div>
      {!valid && <p className="text-caption text-on-surface-muted m-0 mt-1.5">Enter a six-digit hex color, such as #1163D8.</p>}
    </ControlGroup>
  )
}
