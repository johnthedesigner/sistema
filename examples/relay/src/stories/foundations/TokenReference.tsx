"use client"

import * as React from "react"
// Token names come from the DTCG sources; every value shown is read at runtime
// from the compiled CSS custom properties (src/styles/tokens/tokens.css), so the
// reference follows the theme and any recompile. Nothing is copied.
import color from "../../../tokens/src/color.json"
import typography from "../../../tokens/src/typography.json"
import shape from "../../../tokens/src/shape.json"
import spacing from "../../../tokens/src/spacing.json"
// The primitive ramps are not compiled to CSS on purpose (code uses roles only),
// so the strips read the primitive source file.
import palette from "../../../tokens/src/palette.json"

const names = (o: Record<string, unknown>) => Object.keys(o).filter((k) => !k.startsWith("$"))

/** Reads CSS custom properties now and again whenever data-theme changes. */
function useCssVars(vars: string[]) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      setValues(Object.fromEntries(vars.map((v) => [v, cs.getPropertyValue(v).trim()])))
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    mq.addEventListener("change", read)
    return () => {
      mo.disconnect()
      mq.removeEventListener("change", read)
    }
  }, [vars.join("|")]) // eslint-disable-line react-hooks/exhaustive-deps
  return values
}

const describe = (o: Record<string, unknown>, k: string) =>
  String(((o[k] as Record<string, unknown>)?.$description as string | undefined) ?? "").split(" Light:")[0]

export function ColorRoles() {
  const roles = names(color.color)
  const vals = useCssVars(roles.map((r) => `--color-${r}`))
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-data">
        <thead>
          <tr className="border-b border-border text-label text-on-surface-muted">
            <th className="px-cell-padding-x py-1 text-left">Role</th>
            <th className="px-cell-padding-x py-1 text-left">Value (this theme)</th>
            <th className="px-cell-padding-x py-1 text-left">What it&rsquo;s for</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r} className="border-b border-border">
              <td className="px-cell-padding-x py-1 whitespace-nowrap">
                <span aria-hidden className="mr-2 inline-block size-4 rounded-xs align-middle shadow-control" style={{ background: `var(--color-${r})` }} />
                <code>{r}</code>
              </td>
              <td className="px-cell-padding-x py-1 tabular-nums">{vals[`--color-${r}`]}</td>
              <td className="px-cell-padding-x py-1 text-body text-on-surface-muted">{describe(color.color, r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Ramps() {
  const p = palette.palette as unknown as Record<string, Record<string, { $value: string }>>
  return (
    <div className="flex flex-col gap-stack-gap">
      {names(p).filter((n) => n !== "white").map((ramp) => (
        <div key={ramp} className="flex flex-col gap-1">
          <p className="text-label">{ramp}</p>
          <div className="overflow-x-auto">
            <div className="flex overflow-hidden rounded-sm" role="img" aria-label={`${ramp} ramp, 19 stops`}>
              {names(p[ramp]).map((s) => (
                <div key={s} className="flex h-row-height flex-1 basis-0 items-end" style={{ background: p[ramp][s].$value }} title={`${ramp} ${s} ${p[ramp][s].$value}`} />
              ))}
            </div>
            <div className="flex">
              {names(p[ramp]).map((s) => (
                <span key={s} className="flex-1 basis-0 text-center text-data text-on-surface-muted">{s}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const SAMPLE: Record<string, string> = {
  metric: "18 of 31",
  title: "Today's board",
  heading: "No heat, Hartley residence",
  body: "D. Okafor is 25 min behind. Reassign the job or notify the customer.",
  "body-strong": "K. Byrne, arriving 9:40 am",
  data: "JOB-20417 · 8–10 am · (555) 014-7781",
  label: "Assign tech",
  overline: "Job details",
}

export function TypeRoles() {
  const roles = names(typography.type)
  const vars = roles.flatMap((r) => ["size", "weight", "line-height", "letter-spacing"].map((p) => `--type-${r}-${p}`))
  const vals = useCssVars(vars)
  return (
    <div className="flex flex-col">
      {roles.map((r) => (
        <div key={r} className="grid grid-cols-1 gap-1 border-b border-border py-stack-gap sm:grid-cols-[12rem_1fr]">
          <p className="text-data text-on-surface-muted">
            <code className="text-on-surface">text-{r}</code>
            <br />
            {vals[`--type-${r}-size`]} / {vals[`--type-${r}-weight`]} / {vals[`--type-${r}-line-height`]} / {vals[`--type-${r}-letter-spacing`]}
          </p>
          <p className={`text-${r}`}>{SAMPLE[r] ?? r}</p>
        </div>
      ))}
    </div>
  )
}

export function Shapes() {
  const radii = names(shape.radius)
  const shadows = names(shape.shadow)
  const vals = useCssVars([...radii.map((r) => `--radius-${r}`), ...shadows.map((s) => `--shadow-${s}`)])
  return (
    <div className="flex flex-col gap-section-gap">
      <div className="grid grid-cols-2 gap-section-gap sm:grid-cols-4">
        {radii.map((r) => (
          <div key={r} className="flex flex-col gap-1">
            <div className="h-row-height bg-secondary-container" style={{ borderRadius: `var(--radius-${r})` }} />
            <p className="text-data"><code>rounded-{r}</code> {vals[`--radius-${r}`]}</p>
            <p className="text-data text-on-surface-muted">{describe(shape.radius, r)}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-section-gap rounded-lg bg-surface p-panel-padding sm:grid-cols-2">
        {shadows.map((s) => (
          <div key={s} className="flex flex-col gap-1">
            <div className="flex h-row-height items-center rounded-lg bg-surface-raised px-cell-padding-x text-data" style={{ boxShadow: `var(--shadow-${s})` }}>
              <code>shadow-{s}</code>
            </div>
            <p className="text-data text-on-surface-muted">{describe(shape.shadow, s).split(" One light source")[0]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Spacing() {
  const steps = names(spacing.space)
  const aliases = names(spacing.layout)
  const vals = useCssVars([...steps.map((s) => `--space-${s}`), ...aliases.map((a) => `--layout-${a}`)])
  const row = (label: string, v: string, note?: string) => (
    <div key={label} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 py-0-5">
      <code className="text-data">{label}</code>
      <span className="block h-2 rounded-xs bg-secondary" style={{ width: `var(${v})` }} />
      <span className="text-data text-on-surface-muted tabular-nums">{vals[v]}</span>
      {note && <span className="col-span-3 text-data text-on-surface-muted">{note}</span>}
    </div>
  )
  return (
    <div className="flex flex-col gap-stack-gap">
      <div>{steps.map((s) => row(`space-${s}`, `--space-${s}`))}</div>
      <div>{aliases.map((a) => row(a, `--layout-${a}`, describe(spacing.layout, a)))}</div>
    </div>
  )
}
