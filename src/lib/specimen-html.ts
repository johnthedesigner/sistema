/**
 * Renders a specimen (src/lib/specimen.ts) as one self-contained HTML page: a
 * small product screen with quiet zones, one featured item, a brand block, an
 * inverse toast, a floating menu, and the everyday controls. Placeholder
 * content can be replaced through `content`, so the person sees the options on
 * their own product.
 */
import type { Specimen } from './specimen'
import { chip as chipOf, esc, icon, page, type Tone } from './specimen-parts'
import { LAYOUT_RENDERERS } from './specimen-layouts'

export interface SpecimenContent {
  product?: string
  nav?: string[]
  nav_selected?: number
  nav_group?: string
  nav_group_items?: string[]
  date?: string
  page_title?: string
  primary_action?: string
  secondary_action?: string
  search?: string
  featured?: { label?: string; title?: string; meta?: string[]; steps?: string[]; step?: number; action?: string; secondary?: string }
  brand?: { label?: string; metric?: string; body?: string; action?: string }
  metrics?: Array<{ label: string; value: string; note?: string }>
  table?: { title?: string; tabs?: string[]; filter?: string; columns?: string[]; rows?: string[][]; status_column?: number; numeric_columns?: number[] }
  statuses?: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'>
  toast?: { text?: string; action?: string }
  menu?: string[]
}

export const DEFAULT_CONTENT: Required<Omit<SpecimenContent, 'featured' | 'brand' | 'table' | 'toast'>> & {
  featured: Required<NonNullable<SpecimenContent['featured']>>
  brand: Required<NonNullable<SpecimenContent['brand']>>
  table: Required<NonNullable<SpecimenContent['table']>>
  toast: Required<NonNullable<SpecimenContent['toast']>>
} = {
  product: 'Harbor',
  nav: ['Overview', 'Shipments', 'Carriers', 'Invoices'],
  nav_selected: 1,
  nav_group: 'Reports',
  nav_group_items: ['Weekly summary', 'Exceptions'],
  date: 'Tuesday, 14 May',
  page_title: 'Shipments',
  primary_action: 'New shipment',
  secondary_action: 'Export',
  search: 'Search shipments',
  featured: {
    label: 'Arriving next',
    title: 'Rotterdam to Leeds, 24 pallets',
    meta: ['SH-4821', 'Northsea Freight', 'Dock 3', 'ETA 14:20'],
    steps: ['Booked', 'Collected', 'In transit', 'At dock', 'Delivered'],
    step: 2,
    action: 'Confirm dock',
    secondary: 'Open shipment',
  },
  brand: { label: 'On-time delivery this week', metric: '96.4%', body: 'Up 2.1 points on last week, across 312 shipments.', action: 'View weekly summary' },
  metrics: [
    { label: 'In transit', value: '128' },
    { label: 'Delayed', value: '6', note: '2 new since 9:00' },
    { label: 'Delivered today', value: '41' },
    { label: 'Open exceptions', value: '3' },
  ],
  table: {
    title: 'All shipments',
    tabs: ['All', 'In transit', 'Delayed', 'Delivered'],
    filter: 'Carrier: All',
    columns: ['Shipment', 'Route', 'Carrier', 'ETA', 'Status', 'Pallets'],
    rows: [
      ['SH-4821', 'Rotterdam to Leeds', 'Northsea Freight', '14:20', 'In transit', '24'],
      ['SH-4817', 'Antwerp to Bristol', 'Calder Haulage', '15:05', 'Delayed', '12'],
      ['SH-4809', 'Hamburg to Hull', 'Northsea Freight', '11:40', 'Delivered', '30'],
      ['SH-4806', 'Calais to Dover', 'Strait Lines', '16:30', 'Held at customs', '8'],
      ['SH-4802', 'Le Havre to Southampton', 'Calder Haulage', '17:15', 'In transit', '18'],
      ['SH-4799', 'Zeebrugge to Felixstowe', 'Strait Lines', 'Tomorrow', 'Draft', '6'],
    ],
    status_column: 4,
    numeric_columns: [5],
  },
  statuses: { 'In transit': 'info', Delayed: 'warning', Delivered: 'success', 'Held at customs': 'error', Draft: 'neutral' },
  toast: { text: 'SH-4790 marked as delivered', action: 'Undo' },
  menu: ['Open shipment', 'Assign carrier', 'Change ETA', 'Mark as held'],
}

function merge(content: SpecimenContent = {}) {
  const d = DEFAULT_CONTENT
  return {
    ...d,
    ...content,
    featured: { ...d.featured, ...content.featured },
    brand: { ...d.brand, ...content.brand },
    table: { ...d.table, ...content.table },
    toast: { ...d.toast, ...content.toast },
    statuses: { ...d.statuses, ...content.statuses },
  }
}

const NAV_ICONS = ['overview', 'box', 'truck', 'receipt']

export function renderSpecimenHtml(sp: Specimen, content?: SpecimenContent | Record<string, unknown>, opts: { title?: string; layout?: string } = {}): string {
  const layout = opts.layout ?? sp.input.layout ?? 'operations'
  if (layout !== 'operations') {
    const render = LAYOUT_RENDERERS[layout]
    if (!render) throw new Error(`Unknown layout: ${layout}`)
    return render(sp, (content ?? {}) as Record<string, unknown>, opts.title)
  }
  return renderOperations(sp, content as SpecimenContent | undefined, opts.title)
}

function renderOperations(sp: Specimen, content: SpecimenContent | undefined, title?: string): string {
  const C = merge(content)
  const sep = sp.input.separation
  const dark = sp.input.theme === 'dark'
  const chip = (label: string) => chipOf(label, (C.statuses[label] ?? 'neutral') as Tone)

  const t = C.table
  const rowsHtml = t.rows.map((row, ri) => {
    const cls = ri === 0 ? ' class="sel"' : ri === 2 ? ' class="hov"' : ''
    const cells = row.map((cell, ci) => {
      if (ci === t.status_column) return `<td>${chip(cell)}</td>`
      const num = t.numeric_columns.includes(ci)
      return `<td class="${ci === 0 ? 'id' : ''}${num ? ' num' : ''}${ci > 1 && ci !== t.status_column && !num ? ' muted' : ''}">${esc(cell)}</td>`
    }).join('')
    const box = ri === 0 ? `<span class="cb on">${icon('check', 'ck')}</span>` : '<span class="cb"></span>'
    const more = `<button class="icon-btn${ri === 1 ? ' open' : ''}" aria-label="More">${icon('more')}</button>`
    return `<tr${cls}><td class="sel-col">${box}</td>${cells}<td class="more-col">${more}</td></tr>`
  }).join('')

  const f = C.featured
  const steps = f.steps.map((s, i) => `<li class="${i < f.step ? 'done' : i === f.step ? 'now' : ''}"><span></span>${esc(s)}</li>`).join('')

  const css = `
.app{display:grid;grid-template-columns:232px 1fr;min-height:100vh}
/* Navigation */
.nav{background:var(--nav-bg);color:var(--nav-text);padding:18px 12px;display:flex;flex-direction:column;gap:2px${sep === 'line' && !(sp.input.presence === 'tinted') ? ';border-right:1px solid var(--hairline)' : ''}}
.brandmark{display:flex;align-items:center;gap:10px;padding:2px 10px 18px;font-weight:600;font-size:var(--fs-heading);letter-spacing:-0.01em;color:${sp.input.presence === 'tinted' ? 'var(--on-nav-selected)' : 'var(--text)'}}
.brandmark b{width:22px;height:22px;border-radius:calc(var(--r-small) + 1px);background:${sp.input.presence === 'tinted' ? 'var(--on-nav-selected)' : 'var(--primary)'};display:grid;place-items:center}
.brandmark b:after{content:"";width:8px;height:8px;border-radius:2px;background:${sp.input.presence === 'tinted' ? 'var(--nav-bg)' : 'var(--on-primary)'}}
.nav a{display:flex;align-items:center;gap:10px;height:calc(var(--control-h) + 0px);padding:0 10px;border-radius:var(--r-control);text-decoration:none;color:inherit;font-weight:500}
.nav a.on{background:var(--nav-selected);color:var(--on-nav-selected)}
.nav a .count{margin-left:auto;font-size:var(--fs-small);font-variant-numeric:tabular-nums;opacity:.8}
.nav h6{font-size:var(--fs-label);font-weight:500;letter-spacing:var(--ls-label);opacity:.75;padding:20px 10px 6px}
.nav .me{margin-top:auto;display:flex;align-items:center;gap:10px;padding:10px;font-weight:500}
.nav .me i{width:26px;height:26px;border-radius:999px;background:var(--accent-subtle);color:var(--on-accent-subtle);display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:600}
/* Main */
main{padding:var(--page) calc(var(--page) + 8px) calc(var(--page) + 24px);display:flex;flex-direction:column;gap:var(--gap);min-width:0}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:calc(var(--gap) - 4px)}
.eyebrow{font-size:var(--fs-small);color:var(--text-secondary);margin-bottom:4px}
h1{font-family:var(--display);font-size:var(--fs-title);font-weight:var(--fw-title);line-height:var(--lh-title);letter-spacing:var(--ls-title)}
h2{font-family:var(--display);font-size:var(--fs-heading);font-weight:var(--fw-heading);letter-spacing:var(--ls-heading)}
.actions{display:flex;gap:8px;align-items:center}
.actions .field{width:240px}
.thead .tabs{margin-left:8px}
.thead .select{margin-left:auto}
.tablepanel .menu{right:calc(var(--pad) + 4px)}
/* Panels: quiet levels */
/* Row 1: one featured item, one brand block */
.row1{display:grid;grid-template-columns:1.85fr 1fr;gap:var(--gap)}
.featured{padding:calc(var(--pad) + 6px) calc(var(--pad) + 8px);display:flex;flex-direction:column;gap:14px;position:relative}
.featured .lead{display:flex;align-items:center;gap:8px;font-size:var(--fs-small);font-weight:500;color:var(--link)}
.featured .lead i{width:7px;height:7px;border-radius:99px;background:var(--primary);box-shadow:0 0 0 4px var(--accent-subtle)}
.featured h3{font-family:var(--display);font-size:calc(var(--fs-title) + 2px);font-weight:600;letter-spacing:-0.02em;line-height:1.2}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-secondary);font-size:var(--fs-small);font-variant-numeric:tabular-nums}
.steps{list-style:none;display:grid;grid-template-columns:repeat(${f.steps.length},1fr);gap:6px;margin-top:4px}
.steps li{font-size:var(--fs-small);color:var(--text-tertiary);display:flex;flex-direction:column;gap:8px}
.steps li span{height:4px;border-radius:99px;background:var(--border-quiet)}
.steps li.done span{background:var(--primary)}
.steps li.now span{background:linear-gradient(90deg,var(--primary) 55%,var(--border-quiet) 55%)}
.steps li.now{color:var(--text);font-weight:500}
.featured .acts{display:flex;gap:8px;margin-top:4px}
.brandblock{padding:calc(var(--pad) + 6px) calc(var(--pad) + 4px);display:flex;flex-direction:column;gap:6px}
.brandblock .lbl{font-size:var(--fs-small);color:var(--on-brand-muted);font-weight:500}
.brandblock .big{font-family:var(--display);font-size:calc(var(--fs-metric) + 14px);font-weight:600;letter-spacing:-0.035em;line-height:1.05;font-variant-numeric:tabular-nums;margin-top:auto}
.brandblock p{color:var(--on-brand-muted);font-size:var(--fs-small);max-width:30ch}
.brandblock .btn{margin-top:10px;align-self:flex-start}
/* Metrics: one quiet panel, divided by space only */
.metrics{display:grid;grid-template-columns:repeat(${C.metrics.length},1fr);padding:var(--pad) calc(var(--pad) + 4px)}
.metric .v{font-family:var(--display);font-size:var(--fs-metric);font-weight:var(--fw-metric);letter-spacing:var(--ls-metric);line-height:var(--lh-metric);font-variant-numeric:tabular-nums;margin-top:6px}
.metric .l{font-size:var(--fs-small);color:var(--text-secondary)}
.metric .n{font-size:var(--fs-small);color:var(--on-warning-container);margin-top:4px}
/* Table */
.tablepanel{padding:6px 0 8px;position:relative}
.thead{display:flex;align-items:center;gap:16px;padding:calc(var(--pad) - 6px) var(--pad) 12px}
table{width:100%;border-collapse:separate;border-spacing:0;font-variant-numeric:tabular-nums}
th{font-size:var(--fs-label);font-weight:500;letter-spacing:var(--ls-label);color:var(--text-tertiary);text-align:left;padding:0 12px 8px;white-space:nowrap}
td{height:var(--row-h);padding:0 12px;border-top:1px solid var(--hairline);white-space:nowrap}
tr:first-child td{border-top-color:${sep === 'line' ? 'var(--hairline)' : 'transparent'}}
td.id{font-weight:500}
td.muted{color:var(--text-secondary)}
td.num,th.num{text-align:right}
td.sel-col,th.sel-col{width:44px;padding-left:var(--pad);padding-right:0}
td.more-col{width:48px;padding-right:calc(var(--pad) - 6px);text-align:right}
tr.sel td{background:var(--selected-row)}
tr.hov td{background:var(--row-hover)}
tr.sel td:first-child,tr.hov td:first-child{border-radius:var(--r-small) 0 0 var(--r-small)}
tr.sel td:last-child,tr.hov td:last-child{border-radius:0 var(--r-small) var(--r-small) 0}
tr.sel td,tr.sel+tr td,tr.hov td,tr.hov+tr td{border-top-color:transparent}
.tablepanel table{padding:0 8px}
/* Floating layers */
`
  const body = `<div class="app">
  <aside class="nav">
    <div class="brandmark"><b></b>${esc(C.product)}</div>
    ${C.nav.map((n, i) => `<a class="${i === C.nav_selected ? 'on' : ''}">${icon(NAV_ICONS[i % NAV_ICONS.length])}${esc(n)}${i === C.nav_selected ? `<span class="count">${t.rows.length * 21}</span>` : ''}</a>`).join('')}
    <h6>${esc(C.nav_group)}</h6>
    ${C.nav_group_items.map((n, i) => `<a>${icon(i === 0 ? 'chart' : 'alert')}${esc(n)}</a>`).join('')}
    <div class="me"><i>AK</i>Ana Kovač</div>
  </aside>
  <main>
    <header class="top">
      <div><p class="eyebrow">${esc(C.date)}</p><h1>${esc(C.page_title)}</h1></div>
      <div class="actions">
        <span class="field focus">${icon('search')}${esc(C.search)}</span>
        <button class="btn secondary">${icon('download')}${esc(C.secondary_action)}</button>
        <button class="btn primary">${icon('plus')}${esc(C.primary_action)}</button>
      </div>
    </header>
    <section class="row1">
      <article class="featured">
        <span class="lead"><i></i>${esc(f.label)}</span>
        <h3>${esc(f.title)}</h3>
        <div class="meta">${f.meta.map(esc).map(m => `<span>${m}</span>`).join('')}</div>
        <ol class="steps">${steps}</ol>
        <div class="acts"><button class="btn primary">${esc(f.action)}</button><button class="btn ghost">${esc(f.secondary)}${icon('arrow')}</button></div>
      </article>
      <article class="brandblock">
        <span class="lbl">${esc(C.brand.label)}</span>
        <span class="big">${esc(C.brand.metric)}</span>
        <p>${esc(C.brand.body)}</p>
        <button class="btn on-brand">${esc(C.brand.action)}${icon('arrow')}</button>
      </article>
    </section>
    <section class="panel metrics">
      ${C.metrics.map(m => `<div class="metric"><div class="l">${esc(m.label)}</div><div class="v">${esc(m.value)}</div>${m.note ? `<div class="n">${esc(m.note)}</div>` : ''}</div>`).join('')}
    </section>
    <section class="panel tablepanel">
      <div class="thead"><h2>${esc(t.title)}</h2>
        <div class="tabs">${t.tabs.map((x, i) => `<button class="${i === 0 ? 'on' : ''}">${esc(x)}</button>`).join('')}</div>
        <span class="select">${esc(t.filter)}${icon('chevron')}</span>
      </div>
      <table>
        <thead><tr><th class="sel-col"><span class="cb"></span></th>${t.columns.map((h, i) => `<th class="${t.numeric_columns.includes(i) ? 'num' : ''}">${esc(h)}</th>`).join('')}<th></th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="menu" style="top:calc(var(--pad) + var(--control-h) + 30px + var(--row-h) * 2)">
        ${C.menu.map((m, i) => `<div class="${i === 0 ? 'on' : ''}${i === C.menu.length - 1 ? ' danger' : ''}">${esc(m)}</div>${i === C.menu.length - 2 ? '<hr>' : ''}`).join('')}
      </div>
    </section>
  </main>
</div>
<div class="toast"><span class="ok">${icon('check', 'ck')}</span>${esc(C.toast.text)}<button>${esc(C.toast.action)}</button></div>`
  return page(sp, { title, css, body })
}
