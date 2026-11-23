'use client'

/**
 * Pick or drop DTCG token files (tokens/src/*.json), or load an example set.
 * Files are read in the browser and kept as text, keyed by file name.
 */
import { useId, useState } from 'react'

export type TokenFiles = Record<string, string>

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export function TokenFilesInput({ files, onChange, example, exampleLabel, hint }: { files: TokenFiles; onChange: (f: TokenFiles) => void; example: TokenFiles; exampleLabel: string; hint: string }) {
  const id = useId()
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')

  async function add(list: FileList | null) {
    if (!list) return
    const next = { ...files }
    const skipped: string[] = []
    for (const f of Array.from(list)) {
      if (!f.name.endsWith('.json')) {
        skipped.push(f.name)
        continue
      }
      next[f.name] = await f.text()
    }
    setError(skipped.length ? `Skipped ${skipped.join(', ')}: only .json token files.` : '')
    onChange(next)
  }

  const names = Object.keys(files).sort()
  return (
    <div>
      <div
        onDragOver={e => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault()
          setOver(false)
          void add(e.dataTransfer.files)
        }}
        className={`rounded-radius-xl p-5 md:p-6 transition-colors motion-reduce:transition-none ${over ? 'bg-surface-selected' : 'bg-surface-raised'}`}
      >
        <p className="text-body text-on-surface m-0 mb-1">Drop your token files here, or choose them.</p>
        <p className="text-body-sm text-on-surface-muted m-0 mb-4">{hint}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className={`inline-flex items-center h-control-height px-4 rounded-radius-md bg-primary text-on-primary text-label cursor-pointer hover:bg-primary-hover focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-border-focus`}>
            Choose files
            <input id={id} type="file" accept=".json,application/json" multiple className="sr-only" onChange={e => void add(e.target.files)} />
          </label>
          <button type="button" onClick={() => { setError(''); onChange(example) }} className={`h-control-height px-4 rounded-radius-md border border-border-strong text-on-surface text-label hover:bg-surface-hover ${focusRing}`}>
            {exampleLabel}
          </button>
          {names.length > 0 && (
            <button type="button" onClick={() => onChange({})} className={`h-control-height px-3 rounded-radius-md text-label text-on-surface-muted hover:text-on-surface hover:bg-surface-hover ${focusRing}`}>
              Clear
            </button>
          )}
        </div>
        {error && <p role="alert" className="text-body-sm text-error m-0 mt-3">{error}</p>}
      </div>
      {names.length > 0 && (
        <ul className="flex flex-wrap gap-2 m-0 mt-3 p-0 list-none" aria-label="Loaded files">
          {names.map(n => (
            <li key={n} className="inline-flex items-center gap-1 h-control-height-sm pl-3 pr-1 rounded-radius-full bg-surface-raised text-caption font-mono text-on-surface">
              {n}
              <button
                type="button"
                aria-label={`Remove ${n}`}
                onClick={() => {
                  const next = { ...files }
                  delete next[n]
                  onChange(next)
                }}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-radius-full text-on-surface-muted hover:text-on-surface hover:bg-surface-hover ${focusRing}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** The standard picker shared by both tools. */
export function StandardSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-label text-on-surface">Standard</label>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className={`h-control-height-sm px-2 rounded-radius-md border border-border-strong bg-surface-raised text-body-sm text-on-surface ${focusRing}`}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
