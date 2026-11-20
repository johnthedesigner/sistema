/**
 * Renders a specimen (src/lib/specimen.ts) as one self-contained HTML page: a
 * small product screen with quiet zones, one featured item, a brand block, an
 * inverse toast, a floating menu, and the everyday controls. Placeholder
 * content can be replaced through `content`, so the person sees the options on
 * their own product.
 */
import type { Specimen } from './specimen'

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

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

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

// Simple 16px stroke icons, drawn for this page.
const ICON: Record<string, string> = {
  overview: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
  box: '<path d="M2.5 5 8 2.5 13.5 5v6L8 13.5 2.5 11z"/><path d="M2.5 5 8 7.5 13.5 5M8 7.5v6"/>',
  truck: '<path d="M1.5 4.5h8v6.5h-8zM9.5 7h3l2 2.2V11h-5"/><circle cx="4.5" cy="11.5" r="1.3"/><circle cx="11.5" cy="11.5" r="1.3"/>',
  receipt: '<path d="M3.5 2h9v12l-2-1.2L8.5 14l-2-1.2L4.5 14l-1-.6z"/><path d="M6 5.5h4M6 8h4"/>',
  chart: '<path d="M2.5 13.5h11M4.5 11V8M8 11V4.5M11.5 11V6.5"/>',
  alert: '<path d="M8 2.5 14 13H2z"/><path d="M8 6.5v3M8 11.2v.1"/>',
  search: '<circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/>',
  download: '<path d="M8 2.5v8M4.8 7.5 8 10.7l3.2-3.2M3 13.5h10"/>',
  plus: '<path d="M8 3v10M3 8h10"/>',
  more: '<circle cx="3.5" cy="8" r=".6"/><circle cx="8" cy="8" r=".6"/><circle cx="12.5" cy="8" r=".6"/>',
  arrow: '<path d="M3 8h10M9 4l4 4-4 4"/>',
  chevron: '<path d="m4.5 6.5 3.5 3.5 3.5-3.5"/>',
  check: '<path d="m3.5 8.5 3 3 6-7"/>',
}
const NAV_ICONS = ['overview', 'box', 'truck', 'receipt']
const icon = (name: string, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name] ?? ''}</svg>`

function fontsHref(families: string[]): string {
  const uniq = [...new Set(families)]
  return 'https://fonts.googleapis.com/css2?' + uniq.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`).join('&') + '&display=swap'
}

export function renderSpecimenHtml(sp: Specimen, content?: SpecimenContent, opts: { title?: string } = {}): string {
  const C = merge(content)
  const col = sp.colors
  const vars = [
    ...Object.entries(col).map(([k, v]) => `--${k}:${v.hex};`),
    ...Object.entries(sp.radius).map(([k, v]) => `--r-${k}:${v}px;`),
    ...Object.entries(sp.shadows).map(([k, v]) => `--sh-${k}:${v};`),
    `--control-h:${sp.space.control_height}px;--row-h:${sp.space.row_height}px;--pad:${sp.space.panel_padding}px;--gap:${sp.space.gap}px;--page:${sp.space.page_padding}px;`,
    ...Object.entries(sp.type).map(([k, t]) => `--fs-${k}:${t.size}px;--fw-${k}:${t.weight};--lh-${k}:${t.line_height};--ls-${k}:${t.tracking}em;`),
    `--font:'${sp.input.font}',ui-sans-serif,system-ui,sans-serif;--display:'${sp.input.display_font}','${sp.input.font}',ui-sans-serif,system-ui,sans-serif;`,
  ].join('')
  const sep = sp.input.separation
  const dark = sp.input.theme === 'dark'
  const tone = (label: string) => C.statuses[label] ?? 'neutral'
  const chip = (label: string) =>
    `<span class="chip" style="background:var(--${tone(label)}-container);color:var(--on-${tone(label)}-container)"><i style="background:var(--${tone(label)}-dot)"></i>${esc(label)}</span>`

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

  return `<!doctype html>
<html lang="en" data-theme="${dark ? 'dark' : 'light'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title ?? 'Specimen')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsHref([sp.input.font, sp.input.display_font])}">
<style>
:root{${vars}color-scheme:${dark ? 'dark' : 'light'}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--canvas)}
body{font-family:var(--font);font-size:var(--fs-body);line-height:var(--lh-body);color:var(--text);-webkit-font-smoothing:antialiased;font-feature-settings:"cv11","ss01";min-width:1120px}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.i{width:16px;height:16px;flex:none}
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
.field{display:flex;align-items:center;gap:8px;height:var(--control-h);width:240px;padding:0 10px;border:1px solid var(--border-control);border-radius:var(--r-control);background:var(--surface);color:var(--text-tertiary)}
.field.focus{border-color:var(--focus);box-shadow:0 0 0 3px var(--accent-subtle)}
.btn{display:inline-flex;align-items:center;gap:7px;height:var(--control-h);padding:0 14px;border-radius:var(--r-control);font-weight:500;white-space:nowrap}
.btn.primary{background:var(--primary);color:var(--on-primary);box-shadow:var(--sh-control)}
.btn.secondary{background:var(--surface);border:1px solid var(--border-quiet);box-shadow:var(--sh-control)}
.btn.focus{outline:2px solid var(--focus);outline-offset:2px}
.btn.ghost{color:var(--text-secondary);padding:0 10px}
.btn.on-brand{background:rgb(255 255 255 / .16);color:var(--on-brand);padding:0 12px}
/* Panels: quiet levels */
.panel{background:var(--surface);border-radius:var(--r-panel);box-shadow:var(--sh-panel)${sep === 'line' ? ';border:1px solid var(--hairline)' : ''}}
/* Row 1: one featured item, one brand block */
.row1{display:grid;grid-template-columns:1.85fr 1fr;gap:var(--gap)}
.featured{background:var(--surface-featured);border-radius:var(--r-featured);box-shadow:var(--sh-featured)${dark ? ',inset 0 1px 0 rgb(255 255 255 / .06)' : ''};padding:calc(var(--pad) + 6px) calc(var(--pad) + 8px);display:flex;flex-direction:column;gap:14px;position:relative}
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
.brandblock{background:var(--surface-brand);color:var(--on-brand);border-radius:var(--r-featured);padding:calc(var(--pad) + 6px) calc(var(--pad) + 4px);display:flex;flex-direction:column;gap:6px}
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
.tabs{display:flex;gap:2px;padding:2px;background:var(--surface-hover);border-radius:calc(var(--r-control) + 2px);margin-left:8px}
.tabs button{height:calc(var(--control-h) - 6px);padding:0 10px;border-radius:var(--r-control);font-size:var(--fs-small);font-weight:500;color:var(--text-secondary)}
.tabs button.on{background:var(--surface);color:var(--text);box-shadow:var(--sh-control)}
.select{margin-left:auto;display:inline-flex;align-items:center;gap:8px;height:calc(var(--control-h) - 2px);padding:0 10px;border:1px solid var(--border-control);border-radius:var(--r-control);font-size:var(--fs-small);font-weight:500;background:var(--surface)}
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
.cb{width:16px;height:16px;border:1px solid var(--border-control);border-radius:calc(var(--r-small) * .6);display:grid;place-items:center;background:var(--surface)}
.cb.on{background:var(--primary);border-color:var(--primary);color:var(--on-primary)}
.ck{width:12px;height:12px;stroke-width:2}
.chip{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px 0 8px;border-radius:var(--r-chip);font-size:var(--fs-small);font-weight:500;line-height:1}
.chip i{width:6px;height:6px;border-radius:99px}
.icon-btn{width:28px;height:28px;display:inline-grid;place-items:center;border-radius:var(--r-control);color:var(--text-tertiary)}
.icon-btn.open{background:var(--surface-hover);color:var(--text)}
/* Floating layers */
.menu{position:absolute;right:calc(var(--pad) + 4px);width:168px;background:var(--surface-overlay);border-radius:var(--r-overlay);box-shadow:var(--sh-overlay)${dark ? ',inset 0 1px 0 rgb(255 255 255 / .06)' : ''};padding:5px;z-index:2}
.menu div{display:flex;align-items:center;height:calc(var(--control-h) - 2px);padding:0 10px;border-radius:calc(var(--r-overlay) - 5px);font-weight:400}
.menu div.on{background:var(--surface-hover)}
.menu hr{border:0;height:6px}
.menu div.danger{color:var(--on-error-container)}
.toast{position:fixed;right:28px;bottom:24px;display:flex;align-items:center;gap:14px;background:var(--surface-inverse);color:var(--on-inverse);padding:10px 10px 10px 14px;border-radius:var(--r-overlay);box-shadow:var(--sh-overlay);font-weight:500}
.toast .ok{width:18px;height:18px;border-radius:99px;background:var(--success-dot);display:grid;place-items:center;color:#fff}
.toast button{color:var(--on-inverse);font-weight:600;padding:4px 10px;border-radius:var(--r-small);background:rgb(127 127 127 / .18)}
</style>
</head>
<body>
<div class="app">
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
<div class="toast"><span class="ok">${icon('check', 'ck')}</span>${esc(C.toast.text)}<button>${esc(C.toast.action)}</button></div>
</body>
</html>`
}
