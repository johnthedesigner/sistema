'use client'

/** The token validator page: send token files to /api/validate and show each check. */
import { useEffect, useState } from 'react'
import { trackToolPage } from '@/lib/analytics/browser'
import { StandardSelect, TokenFilesInput, type TokenFiles } from './TokenFilesInput'

interface Check {
  rule: string
  severity: 'blocking' | 'advisory'
  pass: boolean
  message: string
  items?: string[]
}
interface Result {
  error?: string
  details?: string[]
  standard: string
  level: string
  themes: string[]
  tokens: number
  summary: { blocking_failures: number; advisory_failures: number; passed: number }
  checks: Check[]
}

export function TokenValidator({ example, standards }: { example: TokenFiles; standards: string[] }) {
  const [files, setFiles] = useState<TokenFiles>({})
  const [standard, setStandard] = useState('wcag-2.2 AA')
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (Object.keys(files).length === 0) {
      setResult(null)
      return
    }
    const ctrl = new AbortController()
    setBusy(true)
    fetch('/api/validate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ files, standard }), signal: ctrl.signal })
      .then(r => r.json())
      .then((r: Result) => {
        setResult(r)
        setBusy(false)
        if (!r.error) trackToolPage('validate', { files: Object.keys(files).length, standard, ...r.summary })
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [files, standard])

  const failing = result?.checks?.filter(c => !c.pass) ?? []
  const passing = result?.checks?.filter(c => c.pass) ?? []
  return (
    <div>
      <TokenFilesInput
        files={files}
        onChange={setFiles}
        example={example}
        exampleLabel="Try Sistema's own tokens"
        hint="Every file in tokens/src/. A file named for a mode, such as color.dark.json, holds that mode's overrides. Files stay in your browser except for the check itself."
      />
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-4">
        <StandardSelect value={standard} onChange={setStandard} options={standards} />
        <p role="status" aria-live="polite" className="text-body-sm text-on-surface-muted m-0">
          {busy ? 'Checking…' : result && !result.error ? summaryLine(result) : ''}
        </p>
      </div>
      {result?.error && (
        <div role="alert" className="rounded-radius-lg bg-surface-raised p-4 text-body text-on-surface">
          <span className="font-medium">Couldn&apos;t check these files.</span> {result.error}
          {result.details && <ul className="m-0 mt-2 pl-5 text-body-sm">{result.details.map(d => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}
      {result && !result.error && (
        <div className="space-y-3">
          {failing.map((c, i) => <CheckRow key={`f${i}`} c={c} />)}
          {passing.length > 0 && (
            <div className="rounded-radius-lg bg-surface-raised px-4 py-3">
              <p className="text-label text-on-surface m-0 mb-1">{passing.length} checks pass</p>
              {passing.map((c, i) => <CheckRow key={`p${i}`} c={c} quiet />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function summaryLine(r: Result) {
  const themes = r.themes.length === 1 ? 'one theme' : `${r.themes.length} themes`
  const s = r.summary
  const bad = [s.blocking_failures && `${s.blocking_failures} blocking`, s.advisory_failures && `${s.advisory_failures} advisory`].filter(Boolean).join(' and ')
  return `${r.tokens} tokens, ${themes}, ${r.standard} ${r.level}. ${bad ? `${bad} to look at.` : 'Everything passes.'}`
}

function CheckRow({ c, quiet }: { c: Check; quiet?: boolean }) {
  const dot = c.pass ? 'bg-success' : c.severity === 'blocking' ? 'bg-error' : 'bg-warning'
  const label = c.pass ? 'Pass' : c.severity === 'blocking' ? 'Blocking' : 'Advisory'
  return (
    <div className={quiet ? 'py-1' : 'rounded-radius-lg bg-surface-raised p-4'}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-label text-on-surface"><span aria-hidden="true" className={`inline-block w-2 h-2 rounded-radius-full ${dot}`} />{label}</span>
        <span className="text-body text-on-surface">{c.message}</span>
        <code className="font-mono text-caption text-on-surface-faint">{c.rule}</code>
      </div>
      {c.items && c.items.length > 0 && (
        <ul className="m-0 mt-2 pl-5 text-body-sm text-on-surface-muted space-y-1 break-words">
          {c.items.slice(0, 40).map(item => <li key={item}>{item}</li>)}
          {c.items.length > 40 && <li>and {c.items.length - 40} more</li>}
        </ul>
      )}
    </div>
  )
}
