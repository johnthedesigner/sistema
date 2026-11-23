'use client'

/** The dark mode mapping page: send color.json and palette.json to /api/dark-mode and show the result. */
import { useEffect, useState } from 'react'
import { trackToolPage } from '@/lib/analytics/browser'
import { StandardSelect, TokenFilesInput, type TokenFiles } from './TokenFilesInput'

interface Role {
  light: string
  dark: string
  how: string
  hex?: { light: string; dark: string }
}
interface Pair {
  foreground: string
  background: string
  purpose: string
  when?: string
  light?: { ratio: number; pass: boolean }
  dark?: { ratio: number; pass: boolean }
  suggestion?: string
}
interface Result {
  error?: string
  details?: string[]
  standard: string
  level: string
  roles: Record<string, Role>
  tokens: unknown
  pairs: Pair[]
  notes: string[]
}

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export function DarkModeMapper({ example, standards }: { example: TokenFiles; standards: string[] }) {
  const [files, setFiles] = useState<TokenFiles>({})
  const [standard, setStandard] = useState('wcag-2.2 AA')
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (Object.keys(files).length === 0) {
      setResult(null)
      return
    }
    const ctrl = new AbortController()
    setBusy(true)
    fetch('/api/dark-mode', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ files, standard }), signal: ctrl.signal })
      .then(r => r.json())
      .then((r: Result) => {
        setResult(r)
        setBusy(false)
        if (!r.error) trackToolPage('dark_mode', { roles: Object.keys(r.roles).length, standard, failing: r.pairs.filter(p => p.dark && !p.dark.pass).length })
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [files, standard])

  const text = result && !result.error ? JSON.stringify(result.tokens, null, 2) + '\n' : ''
  const failing = result?.pairs?.filter(p => p.dark && !p.dark.pass) ?? []
  const checked = result?.pairs?.filter(p => p.dark) ?? []

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }
  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'color.dark.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <TokenFilesInput
        files={files}
        onChange={setFiles}
        example={example}
        exampleLabel="Try Sistema's own colors"
        hint="Your light theme's color.json and the palette.json its roles point to. Each role should alias a ramp stop, such as {palette.neutral.50}."
      />
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-4">
        <StandardSelect value={standard} onChange={setStandard} options={standards} />
        <p role="status" aria-live="polite" className="text-body-sm text-on-surface-muted m-0">
          {busy ? 'Mapping…' : result && !result.error ? `${Object.keys(result.roles).length} roles. ${failing.length ? `${failing.length} of ${checked.length} pairs fail in dark.` : `All ${checked.length} pairs pass in dark.`}` : ''}
        </p>
      </div>

      {result?.error && (
        <div role="alert" className="rounded-radius-lg bg-surface-raised p-4 text-body text-on-surface">
          <span className="font-medium">Couldn&apos;t map these files.</span> {result.error}
          {result.details && <ul className="m-0 mt-2 pl-5 text-body-sm">{result.details.map(d => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}

      {result && !result.error && (
        <div className="space-y-8">
          {(failing.length > 0 || result.notes.length > 0) && (
            <section className="rounded-radius-lg bg-surface-raised p-4 md:p-5">
              <h2 className="text-heading-sm font-serif m-0 mb-3">To look at</h2>
              <ul className="m-0 pl-5 space-y-2 text-body-sm text-on-surface">
                {failing.map(p => (
                  <li key={`${p.foreground}/${p.background}`}>
                    <code className="font-mono text-caption">{p.foreground}</code> on <code className="font-mono text-caption">{p.background}</code> is {p.dark!.ratio} in dark{p.when ? `, if ${p.when}` : ''}. {p.suggestion ?? 'Choose another stop.'}
                  </li>
                ))}
                {result.notes.map(n => <li key={n} className="text-on-surface-muted">{n}</li>)}
              </ul>
            </section>
          )}

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-heading-sm font-serif m-0">Roles</h2>
              <div className="flex gap-2">
                <button type="button" onClick={copy} className={`h-control-height-sm px-3 rounded-radius-md border border-border-strong text-label text-on-surface hover:bg-surface-hover ${focusRing}`}>{copied ? 'Copied' : 'Copy color.dark.json'}</button>
                <button type="button" onClick={download} className={`h-control-height-sm px-3 rounded-radius-md bg-primary text-on-primary text-label hover:bg-primary-hover ${focusRing}`}>Download</button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-radius-lg bg-surface-raised">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="text-left text-caption text-on-surface-muted">
                    <th className="font-normal px-4 py-2">Role</th>
                    <th className="font-normal px-4 py-2 hidden sm:table-cell">Light</th>
                    <th className="font-normal px-4 py-2 hidden sm:table-cell">Dark</th>
                    <th className="font-normal px-4 py-2 sm:hidden">Light → dark</th>
                    <th className="font-normal px-4 py-2 hidden sm:table-cell">How</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.roles).map(([role, r]) => (
                    <tr key={role} className="border-t border-border">
                      <td className="px-4 py-2 align-top">
                        <span className="block font-mono text-caption text-on-surface">{role}</span>
                        <span className="block sm:hidden text-caption text-on-surface-muted">{r.how}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap hidden sm:table-cell"><Swatch hex={r.hex?.light} label={r.light} /></td>
                      <td className="px-4 py-2 whitespace-nowrap hidden sm:table-cell"><Swatch hex={r.hex?.dark} label={r.dark} /></td>
                      <td className="px-4 py-2 sm:hidden">
                        <span className="flex flex-col gap-1"><Swatch hex={r.hex?.light} label={r.light} /><Swatch hex={r.hex?.dark} label={r.dark} /></span>
                      </td>
                      <td className="px-4 py-2 text-on-surface-muted whitespace-nowrap hidden sm:table-cell">{r.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function Swatch({ hex, label }: { hex?: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="inline-block w-5 h-5 rounded-radius-sm shadow-control" style={{ background: hex ?? 'transparent' }} />
      <span className="font-mono text-caption text-on-surface break-all">{label}</span>
    </span>
  )
}
