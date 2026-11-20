/**
 * Specimen layouts beyond the operations list (src/lib/specimen-html.ts): an
 * analytics dashboard, a record page with forms, a marketing page, an article,
 * and a product listing. Each shows the same roles in a different kind of
 * product, so a choice can be judged where it will be used. Placeholder content
 * can be replaced key by key through `content`.
 */
import type { Specimen } from './specimen'
import { chip, esc, icon, mergeContent, page } from './specimen-parts'

type Render = (sp: Specimen, content: Record<string, unknown>, title?: string) => string

// ─── Shared pieces ──────────────────────────────────────────────────────────

function appShellCss(sp: Specimen): string {
  const tinted = sp.input.presence === 'tinted'
  const line = sp.input.separation === 'line' && !tinted
  return `
.app{display:grid;grid-template-columns:232px 1fr;min-height:100vh}
.nav{background:var(--nav-bg);color:var(--nav-text);padding:18px 12px;display:flex;flex-direction:column;gap:2px${line ? ';border-right:1px solid var(--hairline)' : ''}}
.brandmark{display:flex;align-items:center;gap:10px;padding:2px 10px 18px;font-weight:600;font-size:var(--fs-heading);letter-spacing:-0.01em;color:${tinted ? 'var(--on-nav-selected)' : 'var(--text)'}}
${tinted ? '.brandmark .mark{background:var(--on-nav-selected)}.brandmark .mark:after{background:var(--nav-bg)}' : ''}
.nav a{display:flex;align-items:center;gap:10px;height:var(--control-h);padding:0 10px;border-radius:var(--r-control);font-weight:500}
.nav a.on{background:var(--nav-selected);color:var(--on-nav-selected)}
.nav h6{font-size:var(--fs-label);font-weight:500;letter-spacing:var(--ls-label);opacity:.75;padding:20px 10px 6px}
.nav .me{margin-top:auto;display:flex;align-items:center;gap:10px;padding:10px;font-weight:500}
.avatar{width:26px;height:26px;border-radius:999px;background:var(--accent-subtle);color:var(--on-accent-subtle);display:inline-grid;place-items:center;font-size:11px;font-weight:600;flex:none}
main{padding:var(--page) calc(var(--page) + 8px) calc(var(--page) + 24px);display:flex;flex-direction:column;gap:var(--gap);min-width:0}
h1{font-family:var(--display);font-size:var(--fs-title);font-weight:var(--fw-title);line-height:var(--lh-title);letter-spacing:var(--ls-title)}
h2{font-family:var(--display);font-size:var(--fs-heading);font-weight:var(--fw-heading);letter-spacing:var(--ls-heading)}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:calc(var(--gap) - 4px)}
.top .eyebrow{margin-bottom:4px}
.actions{display:flex;gap:8px;align-items:center}
`
}

function appShell(product: string, nav: string[], selected: number, icons: string[], main: string, group?: { title: string; items: string[] }): string {
  return `<div class="app">
  <aside class="nav">
    <div class="brandmark"><span class="mark"></span>${esc(product)}</div>
    ${nav.map((n, i) => `<a class="${i === selected ? 'on' : ''}">${icon(icons[i % icons.length])}${esc(n)}</a>`).join('')}
    ${group ? `<h6>${esc(group.title)}</h6>${group.items.map(n => `<a>${icon('chart')}${esc(n)}</a>`).join('')}` : ''}
    <div class="me"><span class="avatar">AK</span>Ana Kovač</div>
  </aside>
  <main>${main}</main>
</div>`
}

/** A smooth path through points (cubic segments between midpoints). */
function smooth(pts: Array<[number, number]>): string {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx = (x0 + x1) / 2
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
  }
  return d
}

function areaChart(current: number[], previous: number[], labels: string[], w = 720, h = 220): string {
  const max = Math.max(...current, ...previous) * 1.12
  const padL = 36, padB = 26, padT = 8
  const x = (i: number) => padL + (i * (w - padL - 8)) / (current.length - 1)
  const y = (v: number) => padT + (1 - v / max) * (h - padB - padT)
  const cur = current.map((v, i) => [x(i), y(v)] as [number, number])
  const prev = previous.map((v, i) => [x(i), y(v)] as [number, number])
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => max * t)
  const grid = ticks.map(t => `<line x1="${padL}" x2="${w - 8}" y1="${y(t)}" y2="${y(t)}" style="stroke:var(--hairline)"/><text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end">${Math.round(t / 1000)}k</text>`).join('')
  const xl = labels.map((l, i) => (i % 2 === 0 ? `<text x="${x(i)}" y="${h - 6}" text-anchor="middle">${esc(l)}</text>` : '')).join('')
  const area = `${smooth(cur)} L${x(current.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const last = cur[cur.length - 1]
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
  ${grid}${xl}
  <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--chart-1);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--chart-1);stop-opacity:0"/></linearGradient></defs>
  <path d="${area}" fill="url(#ga)"/>
  <path d="${smooth(prev)}" fill="none" style="stroke:var(--chart-2)" stroke-width="2" stroke-dasharray="4 4"/>
  <path d="${smooth(cur)}" fill="none" style="stroke:var(--chart-1)" stroke-width="2.25"/>
  <circle cx="${last[0]}" cy="${last[1]}" r="4.5" style="fill:var(--surface-featured);stroke:var(--chart-1)" stroke-width="2.25"/>
</svg>`
}

function spark(values: number[], tone: string): string {
  const w = 96, h = 28, max = Math.max(...values), min = Math.min(...values)
  const pts = values.map((v, i) => [(i * w) / (values.length - 1), h - 3 - ((v - min) / (max - min || 1)) * (h - 6)] as [number, number])
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${smooth(pts)}" fill="none" style="stroke:var(--${tone})" stroke-width="1.75"/></svg>`
}

function donut(parts: Array<{ value: number; tone: string }>): string {
  const total = parts.reduce((a, p) => a + p.value, 0)
  const r = 44, c = 2 * Math.PI * r
  let off = 0
  const arcs = parts.map(p => {
    const len = (p.value / total) * c
    const seg = `<circle cx="60" cy="60" r="${r}" fill="none" style="stroke:var(--${p.tone})" stroke-width="14" stroke-dasharray="${Math.max(0, len - 2)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`
    off += len
    return seg
  }).join('')
  return `<svg class="donut" viewBox="0 0 120 120" aria-hidden="true">${arcs}</svg>`
}

// Simple product objects for image tiles, drawn for these pages.
const OBJECTS: Record<string, string> = {
  lamp: '<path d="M70 40h60l18 46H52z" style="fill:var(--image-accent)"/><rect x="97" y="86" width="6" height="64" style="fill:var(--image-ink)"/><rect x="72" y="150" width="56" height="8" rx="4" style="fill:var(--image-ink)"/>',
  vase: '<path d="M88 46h24v14c0 8 18 18 18 44 0 30-14 50-30 50s-30-20-30-50c0-26 18-36 18-44z" style="fill:var(--image-ink)"/><path d="M88 46h24" style="stroke:var(--image-accent)" stroke-width="6"/>',
  mug: '<rect x="66" y="70" width="58" height="72" rx="10" style="fill:var(--image-accent)"/><path d="M124 86h10a14 14 0 0 1 0 28h-10" fill="none" style="stroke:var(--image-accent)" stroke-width="9"/>',
  bowl: '<path d="M54 98h92c0 30-20 48-46 48s-46-18-46-48z" style="fill:var(--image-ink)"/><rect x="84" y="146" width="32" height="7" rx="3.5" style="fill:var(--image-ink)"/><ellipse cx="100" cy="98" rx="46" ry="7" style="fill:var(--image-accent)"/>',
  bottle: '<rect x="91" y="34" width="18" height="22" rx="4" style="fill:var(--image-accent)"/><path d="M86 56h28v14c10 6 14 14 14 26v50a10 10 0 0 1-10 10H82a10 10 0 0 1-10-10V96c0-12 4-20 14-26z" style="fill:var(--image-ink)"/>',
  stool: '<rect x="62" y="70" width="76" height="12" rx="6" style="fill:var(--image-accent)"/><path d="M74 82 66 156M126 82l8 74M100 82v74" style="stroke:var(--image-ink)" stroke-width="6" stroke-linecap="round"/>',
}
const objectSvg = (name: string, bg: string) =>
  `<svg viewBox="0 0 200 190" class="obj" style="background:var(--${bg})" aria-hidden="true">${OBJECTS[name] ?? ''}</svg>`

// ─── Dashboard ──────────────────────────────────────────────────────────────

const DASHBOARD = {
  product: 'Harbor',
  page_title: 'Performance',
  date: 'Last 30 days',
  kpis: [
    { label: 'Revenue', value: '£482.3k', delta: '+12.4%', up: true, spark: [12, 14, 13, 17, 16, 19, 22] },
    { label: 'Shipments', value: '3,128', delta: '+4.1%', up: true, spark: [30, 28, 31, 33, 32, 35, 34] },
    { label: 'On-time rate', value: '96.4%', delta: '+2.1 pts', up: true, spark: [92, 93, 93, 94, 95, 95, 96] },
    { label: 'Cost per pallet', value: '£38.20', delta: '+3.0%', up: false, spark: [35, 36, 36, 37, 37, 38, 38] },
  ],
  chart_title: 'Revenue',
  chart_value: '£482.3k',
  chart_note: 'Up £53.1k on the previous 30 days',
  current: [11, 12.5, 12, 14, 13.5, 15, 16.5, 16, 17.5, 19, 18.5, 20.5, 22, 23.5],
  previous: [10, 11, 11.5, 11.2, 12.5, 12.8, 13, 14, 13.6, 14.5, 15.2, 15, 16, 16.8],
  labels: ['1 Apr', '', '7 Apr', '', '13 Apr', '', '19 Apr', '', '25 Apr', '', '1 May', '', '7 May', ''],
  goal: { label: 'Quarterly target', value: '82%', body: '£1.18m of £1.44m, with 41 days left.' },
  channels: [{ label: 'Contract', value: 46 }, { label: 'Spot', value: 28 }, { label: 'Marketplace', value: 17 }, { label: 'Partners', value: 9 }],
  status: [{ label: 'Delivered', value: 2780, tone: 'success-dot' }, { label: 'In transit', value: 236, tone: 'info-dot' }, { label: 'Delayed', value: 84, tone: 'warning-dot' }, { label: 'Exceptions', value: 28, tone: 'error-dot' }],
  top: [['Northsea Freight', '£128.4k', '+18%'], ['Calder Haulage', '£96.2k', '+7%'], ['Strait Lines', '£71.9k', '−3%'], ['Peak Logistics', '£54.0k', '+11%']],
}

const renderDashboard: Render = (sp, content, title) => {
  const C = mergeContent(DASHBOARD, content)
  const css = appShellCss(sp) + `
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--gap)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);padding:var(--pad) calc(var(--pad) + 4px);gap:var(--gap)}
.kpi .l{font-size:var(--fs-small);color:var(--text-secondary)}
.kpi .row{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:6px}
.kpi .v{font-family:var(--display);font-size:var(--fs-metric);font-weight:var(--fw-metric);letter-spacing:var(--ls-metric);line-height:1.1;font-variant-numeric:tabular-nums}
.kpi .d{font-size:var(--fs-small);font-weight:500;margin-top:6px}
.up{color:var(--on-success-container)} .down{color:var(--on-error-container)}
.spark{width:96px;height:28px}
.row2{display:grid;grid-template-columns:2.2fr 1fr;gap:var(--gap)}
.chartcard{padding:calc(var(--pad) + 4px) calc(var(--pad) + 6px) var(--pad)}
.chartcard header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.chartcard .big{font-family:var(--display);font-size:calc(var(--fs-metric) + 6px);font-weight:600;letter-spacing:-0.03em;margin-top:2px;font-variant-numeric:tabular-nums}
.legend{display:flex;gap:16px;font-size:var(--fs-small);color:var(--text-secondary)}
.legend i{display:inline-block;width:10px;height:3px;border-radius:2px;margin-right:6px;vertical-align:middle}
.chart{width:100%;height:220px;display:block;overflow:visible}
.chart text{font-size:11px;fill:var(--text-tertiary);font-family:var(--font)}
.goal{padding:calc(var(--pad) + 6px);display:flex;flex-direction:column;gap:8px}
.goal .lbl{font-size:var(--fs-small);color:var(--on-brand-muted);font-weight:500}
.goal .big{font-family:var(--display);font-size:calc(var(--fs-metric) + 22px);font-weight:600;letter-spacing:-0.04em;line-height:1;margin-top:auto}
.goal .bar{height:6px;border-radius:99px;background:rgb(255 255 255 / .2);overflow:hidden}
.goal .bar span{display:block;height:100%;background:var(--on-brand);border-radius:99px}
.goal p{font-size:var(--fs-small);color:var(--on-brand-muted)}
.row3{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:var(--gap)}
.card{padding:var(--pad) calc(var(--pad) + 4px)}
.card h2{margin-bottom:14px}
.hbar{display:grid;grid-template-columns:96px 1fr 40px;align-items:center;gap:10px;margin:10px 0;font-size:var(--fs-small)}
.hbar .t{height:8px;border-radius:99px;background:var(--surface-hover);overflow:hidden}
.hbar .t span{display:block;height:100%;border-radius:99px;background:var(--chart-2)}
.hbar.lead .t span{background:var(--chart-1)}
.hbar .n{text-align:right;color:var(--text-secondary);font-variant-numeric:tabular-nums}
.don{display:flex;gap:20px;align-items:center}
.donut{width:120px;height:120px;flex:none}
.keys{display:flex;flex-direction:column;gap:8px;font-size:var(--fs-small);flex:1}
.keys div{display:flex;align-items:center;gap:8px}
.keys i{width:8px;height:8px;border-radius:99px}
.keys b{margin-left:auto;font-weight:500;font-variant-numeric:tabular-nums}
.list div{display:grid;grid-template-columns:1fr auto 52px;gap:12px;padding:9px 0;border-top:1px solid var(--hairline);font-variant-numeric:tabular-nums}
.list div:first-child{border-top:0}
.list span:nth-child(2){font-weight:500}
.list span:nth-child(3){text-align:right;font-size:var(--fs-small)}
`
  const kpis = C.kpis.map(k => `<div class="kpi"><div class="l">${esc(k.label)}</div><div class="row"><span class="v">${esc(k.value)}</span>${spark(k.spark, k.up ? 'chart-1' : 'chart-2')}</div><div class="d ${k.up ? 'up' : 'down'}">${esc(k.delta)} <span style="color:var(--text-tertiary);font-weight:400">vs last period</span></div></div>`).join('')
  const maxCh = Math.max(...C.channels.map(c => c.value))
  const main = `
<header class="top">
  <div><p class="eyebrow">${esc(C.date)}</p><h1>${esc(C.page_title)}</h1></div>
  <div class="actions"><div class="tabs"><button>7 days</button><button class="on">30 days</button><button>Quarter</button></div><button class="btn secondary">${icon('download')}Export</button></div>
</header>
<section class="panel kpis">${kpis}</section>
<section class="row2">
  <article class="featured chartcard">
    <header><div><div class="eyebrow">${esc(C.chart_title)}</div><div class="big">${esc(C.chart_value)}</div><div class="eyebrow" style="margin-top:2px">${esc(C.chart_note)}</div></div>
      <div class="legend"><span><i style="background:var(--chart-1)"></i>This period</span><span><i style="background:var(--chart-2)"></i>Previous</span></div></header>
    ${areaChart(C.current.map(v => v * 1000), C.previous.map(v => v * 1000), C.labels)}
  </article>
  <article class="brandblock goal"><span class="lbl">${esc(C.goal.label)}</span><span class="big">${esc(C.goal.value)}</span><div class="bar"><span style="width:${esc(C.goal.value)}"></span></div><p>${esc(C.goal.body)}</p></article>
</section>
<section class="row3">
  <article class="panel card"><h2>Revenue by channel</h2>${C.channels.map((c, i) => `<div class="hbar${i === 0 ? ' lead' : ''}"><span>${esc(c.label)}</span><span class="t"><span style="width:${(c.value / maxCh) * 100}%"></span></span><span class="n">${c.value}%</span></div>`).join('')}</article>
  <article class="panel card"><h2>Shipment status</h2><div class="don">${donut(C.status.map(s => ({ value: s.value, tone: s.tone })))}<div class="keys">${C.status.map(s => `<div><i style="background:var(--${s.tone})"></i>${esc(s.label)}<b>${s.value.toLocaleString('en-GB')}</b></div>`).join('')}</div></div></article>
  <article class="panel card"><h2>Top carriers</h2><div class="list">${C.top.map(r => `<div><span>${esc(r[0])}</span><span>${esc(r[1])}</span><span class="${String(r[2]).startsWith('−') ? 'down' : 'up'}">${esc(r[2])}</span></div>`).join('')}</div></article>
</section>`
  return page(sp, { title, css, body: appShell(C.product, ['Overview', 'Shipments', 'Carriers', 'Invoices'], 0, ['overview', 'box', 'truck', 'receipt'], main, { title: 'Reports', items: ['Performance', 'Exceptions'] }) })
}

// ─── Record (B2B detail with forms) ─────────────────────────────────────────

const RECORD = {
  product: 'Harbor',
  crumbs: ['Carriers', 'Northsea Freight'],
  page_title: 'Northsea Freight',
  status: 'Active',
  tabs: ['Overview', 'Contracts', 'Shipments', 'Billing', 'Settings'],
  tab: 4,
  alert: { title: 'Insurance certificate expires in 12 days', body: 'Upload the renewed certificate to keep this carrier assignable.', action: 'Upload' },
  fields: [['Legal name', 'Northsea Freight Ltd'], ['Company number', '08412977'], ['Billing email', 'accounts@northsea.example'], ['Phone', '+44 1482 555 019']],
  region: 'North of England',
  notes: 'Prefers dock bookings 24 hours ahead. Two drivers hold ADR certificates.',
  toggles: [
    { label: 'Delay alerts', body: 'Email the dispatcher when an ETA slips by more than 30 minutes.', on: true },
    { label: 'Weekly summary', body: 'A Monday report of on-time rate and costs.', on: true },
    { label: 'Invoice reminders', body: 'Remind the carrier 5 days before an invoice is due.', on: false },
  ],
  summary: { label: 'Contract value', value: '£412,000', meta: [['Renews', '1 Sep 2027'], ['Owner', 'Ana Kovač'], ['Rate card', 'Standard 2027']] },
  activity: [['Ana Kovač', 'changed the billing email', '2 hours ago'], ['System', 'flagged the insurance certificate', 'Yesterday'], ['Ben Osei', 'signed the 2027 rate card', '3 May'], ['Ana Kovač', 'added two drivers', '28 Apr']],
}

const renderRecord: Render = (sp, content, title) => {
  const C = mergeContent(RECORD, content)
  const css = appShellCss(sp) + `
.crumbs{display:flex;gap:8px;font-size:var(--fs-small);color:var(--text-tertiary);margin-bottom:6px}
.crumbs span:last-child{color:var(--text-secondary)}
.titlerow{display:flex;align-items:center;gap:12px}
.utabs{display:flex;gap:22px;box-shadow:inset 0 -1px 0 var(--hairline);margin-top:2px}
.utabs a{padding:10px 0 12px;font-weight:500;color:var(--text-secondary);position:relative}
.utabs a.on{color:var(--text)}
.utabs a.on:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:var(--primary)}
.cols{display:grid;grid-template-columns:1fr 340px;gap:calc(var(--gap) + 8px);align-items:start}
.stack{display:flex;flex-direction:column;gap:var(--gap)}
.alert{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:var(--r-panel);background:var(--warning-container);color:var(--on-warning-container)}
.alert b{display:block;font-weight:600}
.alert p{font-size:var(--fs-small)}
.alert .btn{margin-left:auto;background:var(--surface);color:var(--text);height:calc(var(--control-h) - 4px)}
.section{padding:calc(var(--pad) + 4px) calc(var(--pad) + 6px)}
.section h2{margin-bottom:4px}
.section .sub{font-size:var(--fs-small);color:var(--text-secondary);margin-bottom:18px}
.form{display:grid;grid-template-columns:1fr 1fr;gap:16px 18px}
.form label{display:flex;flex-direction:column;gap:6px;font-size:var(--fs-small);font-weight:500}
.form .wide{grid-column:1 / -1}
.form .field,.form .select{font-size:var(--fs-body);font-weight:400}
.form .lbl{display:flex;justify-content:space-between}
.textarea{height:auto;min-height:76px;align-items:flex-start;padding:9px 10px;line-height:1.5}
.form .hint{font-weight:400;color:var(--text-tertiary)}
.toggle{display:flex;gap:14px;align-items:flex-start;padding:12px 0}
.toggle + .toggle{border-top:1px solid var(--hairline)}
.sw{width:34px;height:20px;border-radius:99px;background:var(--border-control);position:relative;flex:none;margin-top:2px}
.sw:after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:99px;background:var(--surface);box-shadow:0 1px 2px rgb(0 0 0 / .2)}
.sw.on{background:var(--primary)}
.sw.on:after{left:16px}
.toggle b{display:block;font-weight:500}
.toggle p{font-size:var(--fs-small);color:var(--text-secondary)}
.bar{display:flex;justify-content:flex-end;gap:8px;padding-top:4px}
.summary{padding:calc(var(--pad) + 6px)}
.summary .big{font-family:var(--display);font-size:calc(var(--fs-metric) + 4px);font-weight:600;letter-spacing:-0.03em;margin:4px 0 16px;font-variant-numeric:tabular-nums}
.summary dl{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;font-size:var(--fs-small)}
.summary dt{color:var(--text-secondary)} .summary dd{text-align:right;font-weight:500}
.activity{padding:4px 4px 0}
.activity h2{margin-bottom:14px}
.ev{display:grid;grid-template-columns:14px 1fr;gap:12px;padding-bottom:16px;position:relative}
.ev:before{content:"";position:absolute;left:6px;top:14px;bottom:0;width:1px;background:var(--hairline)}
.ev:last-child:before{display:none}
.ev i{width:9px;height:9px;border-radius:99px;background:var(--neutral-dot);margin:5px 0 0 2px}
.ev:first-child i{background:var(--primary);box-shadow:0 0 0 3px var(--accent-subtle)}
.ev p{font-size:var(--fs-small)} .ev p b{font-weight:500} .ev time{font-size:var(--fs-small);color:var(--text-tertiary)}
`
  const main = `
<header>
  <div class="crumbs">${C.crumbs.map(c => `<span>${esc(c)}</span>`).join('<span>/</span>')}</div>
  <div class="top" style="padding-bottom:10px"><div class="titlerow"><h1>${esc(C.page_title)}</h1>${chip(C.status, 'success')}</div>
  <div class="actions"><button class="btn secondary">Message</button><button class="btn primary">${icon('plus')}New shipment</button></div></div>
  <nav class="utabs">${C.tabs.map((t, i) => `<a class="${i === C.tab ? 'on' : ''}">${esc(t)}</a>`).join('')}</nav>
</header>
<div class="cols">
  <div class="stack">
    <div class="alert">${icon('alert')}<div><b>${esc(C.alert.title)}</b><p>${esc(C.alert.body)}</p></div><button class="btn">${esc(C.alert.action)}</button></div>
    <section class="panel section"><h2>Company details</h2><p class="sub">Used on invoices and dock bookings.</p>
      <div class="form">
        ${C.fields.map((f, i) => `<label>${esc(f[0])}<span class="field filled${i === 2 ? ' focus' : ''}">${esc(f[1])}</span></label>`).join('')}
        <label>Region<span class="select" style="height:var(--control-h);font-size:var(--fs-body);font-weight:400;justify-content:space-between">${esc(C.region)}${icon('chevron')}</span></label>
        <label>Preferred contact<span style="display:flex;gap:16px;align-items:center;height:var(--control-h);font-weight:400"><span style="display:flex;gap:8px;align-items:center"><span class="cb on" style="border-radius:99px">${icon('check', 'ck')}</span>Email</span><span style="display:flex;gap:8px;align-items:center"><span class="cb" style="border-radius:99px"></span>Phone</span></span></label>
        <label class="wide"><span class="lbl">Notes<span class="hint">Visible to dispatchers</span></span><span class="field filled textarea">${esc(C.notes)}</span></label>
      </div>
    </section>
    <section class="panel section"><h2>Notifications</h2><p class="sub" style="margin-bottom:6px">What this carrier's dispatcher hears about.</p>
      ${C.toggles.map(t => `<div class="toggle"><span class="sw${t.on ? ' on' : ''}"></span><div><b>${esc(t.label)}</b><p>${esc(t.body)}</p></div></div>`).join('')}
    </section>
    <div class="bar"><button class="btn ghost">Discard</button><button class="btn primary">Save changes</button></div>
  </div>
  <aside class="stack">
    <article class="featured summary"><div class="eyebrow">${esc(C.summary.label)}</div><div class="big">${esc(C.summary.value)}</div><dl>${C.summary.meta.map(m => `<dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd>`).join('')}</dl></article>
    <section class="activity"><h2>Activity</h2>${C.activity.map(a => `<div class="ev"><i></i><div><p><b>${esc(a[0])}</b> ${esc(a[1])}</p><time>${esc(a[2])}</time></div></div>`).join('')}</section>
  </aside>
</div>`
  return page(sp, { title, css, body: appShell(C.product, ['Overview', 'Shipments', 'Carriers', 'Invoices'], 2, ['overview', 'box', 'truck', 'receipt'], main, { title: 'Reports', items: ['Performance', 'Exceptions'] }) })
}

// ─── Websites: shared header and footer ─────────────────────────────────────

function siteCss(sp: Specimen): string {
  const b = sp.type.body.size
  const tinted = sp.input.presence === 'tinted'
  return `
.wrap{max-width:1160px;margin:0 auto;padding:0 40px}
.site-head{position:relative;z-index:1}
.site-head .wrap{display:flex;align-items:center;gap:28px;height:68px}
.site-head .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:${b + 3}px;letter-spacing:-0.01em}
.site-head nav{display:flex;gap:24px;color:var(--text-secondary);font-weight:500}
.site-head .right{margin-left:auto;display:flex;gap:10px;align-items:center}
${tinted ? '.site-head{background:var(--nav-bg);color:var(--on-nav-selected)}.site-head nav{color:var(--nav-text)}.site-head .logo .mark{background:var(--on-nav-selected)}.site-head .logo .mark:after{background:var(--nav-bg)}.site-head .btn.secondary{background:transparent;color:var(--on-nav-selected);border-color:rgb(255 255 255 / .3);box-shadow:none}' : ''}
.display{font-family:var(--display);font-weight:600;letter-spacing:-0.035em;line-height:1.04}
.lead{font-size:${b + 4}px;line-height:1.55;color:var(--text-secondary)}
.kicker{font-size:var(--fs-small);font-weight:600;letter-spacing:.02em;color:var(--link)}
.site-foot{padding:56px 0 64px;color:var(--text-secondary);font-size:var(--fs-small)}
.site-foot .wrap{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:32px}
.site-foot h6{font-size:var(--fs-small);font-weight:600;color:var(--text);margin-bottom:12px}
.site-foot li{list-style:none;margin:8px 0}
`
}

function siteHead(name: string, links: string[], right: string): string {
  return `<header class="site-head"><div class="wrap"><a class="logo"><span class="mark"></span>${esc(name)}</a><nav>${links.map(l => `<a>${esc(l)}</a>`).join('')}</nav><div class="right">${right}</div></div></header>`
}

function siteFoot(name: string, blurb: string): string {
  const cols = [['Product', 'Features', 'Pricing', 'Changelog'], ['Company', 'About', 'Careers', 'Press'], ['Resources', 'Guides', 'Support', 'Status']]
  return `<footer class="site-foot"><div class="wrap"><div><a class="logo" style="display:flex;gap:10px;align-items:center;font-weight:600;color:var(--text);margin-bottom:10px"><span class="mark"></span>${esc(name)}</a><p style="max-width:30ch">${esc(blurb)}</p></div>${cols.map(c => `<div><h6>${esc(c[0])}</h6><ul>${c.slice(1).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div></footer>`
}

// ─── Marketing page ─────────────────────────────────────────────────────────

const MARKETING = {
  product: 'Harbor',
  links: ['Product', 'Customers', 'Pricing', 'Docs'],
  badge: 'New: live dock scheduling',
  headline: 'Every shipment, on one calm screen.',
  subhead: 'Harbor gives dispatch teams one place to plan loads, track every truck, and settle with carriers, without the spreadsheet.',
  cta: 'Start free trial',
  cta_secondary: 'Book a demo',
  note: 'Free for 14 days. No card needed.',
  logos: ['Northsea', 'CALDER', 'Strait Lines', 'peak&co', 'Meridian'],
  features: [
    { icon: 'bolt', title: 'Plan in minutes', body: 'Drag loads onto trucks and Harbor checks capacity, hours, and dock times as you go.' },
    { icon: 'layers', title: 'One live view', body: 'Every shipment, carrier, and exception in a single list your whole team shares.' },
    { icon: 'shield', title: 'Settle with confidence', body: 'Rates, proofs of delivery, and invoices matched automatically before anyone pays.' },
  ],
  quote: 'We cut the time we spend chasing ETAs by more than half. The team actually likes opening it in the morning.',
  quote_by: 'Maya Lindqvist, Head of Operations, Meridian Foods',
  plans: [
    { name: 'Team', price: '£24', per: 'per user / month', items: ['Up to 10 users', 'Live tracking', 'Email support'] },
    { name: 'Business', price: '£48', per: 'per user / month', items: ['Unlimited users', 'Dock scheduling', 'Carrier settlement', 'Priority support'], featured: true },
    { name: 'Enterprise', price: 'Custom', per: 'annual contract', items: ['SSO and audit log', 'Custom integrations', 'Dedicated manager'] },
  ],
  band: { title: 'Ready when your next truck is.', body: 'Set up your first route in an afternoon.', cta: 'Start free trial' },
}

const renderMarketing: Render = (sp, content, title) => {
  const C = mergeContent(MARKETING, content)
  const b = sp.type.body.size
  const css = siteCss(sp) + `
.hero{padding:72px 0 0}
.hero .wrap{display:flex;flex-direction:column;align-items:center;text-align:center}
.hero .display{font-size:${Math.round(b * 4.3)}px;max-width:15ch;margin:18px 0 18px}
.hero .lead{max-width:56ch}
.hero .ctas{display:flex;gap:10px;margin-top:28px}
.hero .note{font-size:var(--fs-small);color:var(--text-tertiary);margin-top:12px}
.shot{margin:56px auto 0;width:100%;max-width:1000px;height:340px;padding:14px;display:grid;grid-template-columns:150px 1fr;gap:14px;overflow:hidden}
.shot .side{display:flex;flex-direction:column;gap:8px;padding:6px}
.shot .side i{height:8px;border-radius:4px;background:var(--surface-hover)}
.shot .side i.on{background:var(--accent-subtle)}
.shot .main{display:flex;flex-direction:column;gap:10px;padding:6px}
.shot .r{display:grid;grid-template-columns:70px 1.5fr 1fr 96px;gap:16px;align-items:center;padding:9px 6px;border-top:1px solid var(--hairline);font-size:12px;color:var(--text-secondary);text-align:left}
.shot .r b{color:var(--text);font-weight:500}
.shot .r .chip{justify-self:start}
.shot .h{font-family:var(--display);font-weight:600;font-size:15px;text-align:left;padding:2px 6px 6px}
.logos{padding:56px 0 24px}
.logos .wrap{display:flex;justify-content:center;gap:64px;color:var(--text-tertiary);font-family:var(--display);font-weight:600;font-size:${b + 6}px;letter-spacing:-0.02em}
.feats{padding:64px 0}
.feats .wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.feat .ic{width:40px;height:40px;border-radius:var(--r-panel);background:var(--accent-subtle);color:var(--on-accent-subtle);display:grid;place-items:center;margin-bottom:18px}
.feat .ic .i{width:20px;height:20px}
.feat h3{font-family:var(--display);font-size:${b + 5}px;font-weight:600;letter-spacing:-0.015em;margin-bottom:8px}
.feat p{color:var(--text-secondary);line-height:1.6}
.quote{margin:16px 40px;border-radius:var(--r-featured);padding:72px 0}
.quote .wrap{max-width:860px;text-align:center}
.quote blockquote{font-family:var(--display);font-size:${Math.round(b * 2.1)}px;line-height:1.3;letter-spacing:-0.02em;font-weight:500}
.quote p{margin-top:22px;color:var(--on-inverse-muted);font-size:var(--fs-small)}
.pricing{padding:80px 0}
.pricing h2{font-family:var(--display);font-size:${Math.round(b * 2.4)}px;font-weight:600;letter-spacing:-0.03em;text-align:center;margin-bottom:40px}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:center}
.plan{padding:28px}
.plan.featured{padding:36px 28px}
.plan h3{font-weight:600;display:flex;justify-content:space-between;align-items:center}
.plan .price{font-family:var(--display);font-size:${Math.round(b * 2.6)}px;font-weight:600;letter-spacing:-0.03em;margin-top:14px}
.plan .per{font-size:var(--fs-small);color:var(--text-secondary)}
.plan ul{list-style:none;margin:20px 0 24px;display:flex;flex-direction:column;gap:10px}
.plan li{display:flex;gap:10px;align-items:center}
.plan li .i{color:var(--link)}
.plan .btn{width:100%}
.band{margin:0 40px;padding:64px 0}
.band .wrap{display:flex;justify-content:space-between;align-items:center}
.band h2{font-family:var(--display);font-size:${Math.round(b * 2.5)}px;font-weight:600;letter-spacing:-0.03em;line-height:1.1}
.band p{color:var(--on-brand-muted);margin-top:8px;font-size:${b + 2}px}
.band .btn{background:var(--on-brand);color:var(--surface-brand)}
`
  const shotRows = [['SH-4821', 'Rotterdam to Leeds', 'Northsea', 'In transit', 'info'], ['SH-4817', 'Antwerp to Bristol', 'Calder', 'Delayed', 'warning'], ['SH-4809', 'Hamburg to Hull', 'Northsea', 'Delivered', 'success'], ['SH-4806', 'Calais to Dover', 'Strait Lines', 'In transit', 'info'], ['SH-4802', 'Le Havre to Southampton', 'Calder', 'Delivered', 'success'], ['SH-4799', 'Zeebrugge to Felixstowe', 'Strait Lines', 'Delivered', 'success']]
  const body = `
${siteHead(C.product, C.links, `<a class="btn ghost">Sign in</a><a class="btn primary">${esc(C.cta)}</a>`)}
<section class="hero"><div class="wrap">
  <span class="tag">${esc(C.badge)}</span>
  <h1 class="display">${esc(C.headline)}</h1>
  <p class="lead">${esc(C.subhead)}</p>
  <div class="ctas"><a class="btn primary lg">${esc(C.cta)}${icon('arrow')}</a><a class="btn secondary lg">${esc(C.cta_secondary)}</a></div>
  <p class="note">${esc(C.note)}</p>
  <div class="featured shot"><div class="side"><i style="width:60%"></i><i class="on"></i><i></i><i style="width:80%"></i><i style="width:70%"></i></div>
    <div class="main"><div class="h">Shipments</div>${shotRows.map(r => `<div class="r"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span>${chip(r[3], r[4] as 'info')}</div>`).join('')}</div></div>
</div></section>
<section class="logos"><div class="wrap">${C.logos.map(l => `<span>${esc(l)}</span>`).join('')}</div></section>
<section class="feats"><div class="wrap">${C.features.map(f => `<div class="feat"><div class="ic">${icon(f.icon)}</div><h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></div>`).join('')}</div></section>
<section class="inverse quote"><div class="wrap"><blockquote>“${esc(C.quote)}”</blockquote><p>${esc(C.quote_by)}</p></div></section>
<section class="pricing"><div class="wrap"><h2>Simple pricing that scales with your fleet</h2><div class="plans">${C.plans.map(p => `<div class="${p.featured ? 'featured' : 'panel'} plan"><h3>${esc(p.name)}${p.featured ? '<span class="tag">Most popular</span>' : ''}</h3><div class="price">${esc(p.price)}</div><div class="per">${esc(p.per)}</div><ul>${p.items.map(i => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul><a class="btn ${p.featured ? 'primary' : 'secondary'}">${p.price === 'Custom' ? 'Talk to sales' : 'Choose ' + esc(p.name)}</a></div>`).join('')}</div></div></section>
<section class="brandblock band"><div class="wrap"><div><h2>${esc(C.band.title)}</h2><p>${esc(C.band.body)}</p></div><a class="btn lg">${esc(C.band.cta)}${icon('arrow')}</a></div></section>
${siteFoot(C.product, 'Dispatch software for teams that move freight.')}`
  return page(sp, { title, css, body })
}

// ─── Article ────────────────────────────────────────────────────────────────

const ARTICLE = {
  product: 'Harbor Journal',
  links: ['Operations', 'Engineering', 'Customers', 'News'],
  category: 'Operations',
  title: 'What a good dispatch morning looks like',
  dek: 'We sat with eleven dispatch teams for their first two hours of the day. The best ones had less on their screens, not more.',
  author: 'Ana Kovač',
  date: '14 May 2026',
  read: '8 min read',
  paragraphs: [
    'Every team we visited started the same way: coffee, a list, and a quick count of what had gone wrong overnight. What separated the calm teams from the frantic ones was not the size of the list. It was how quickly they could tell which three items on it mattered.',
    'The calmest dispatcher we met, at a regional food distributor, kept a single view open: today’s loads, sorted by what was at risk. Everything else was one click away, and nothing else asked for her attention until it needed it.',
  ],
  h2: 'Quiet screens, loud exceptions',
  paragraphs2: [
    'When every row on a screen has the same weight, people read all of it. When the screen is mostly quiet, the one late truck stands out without anyone looking for it.',
  ],
  quote: 'I don’t want to see the trucks that are fine. I want to see the one that isn’t.',
  quote_by: 'Dispatcher, regional food distributor',
  callout: 'Try it: sort your morning list by risk for a week, and hide anything that is on time.',
  list: ['Start from exceptions, not from the full list.', 'Give each status one clear color, and keep the rest neutral.', 'Make the next action the only button that stands out.'],
  related: [
    { title: 'Designing for the night shift', meta: 'Engineering · 6 min' },
    { title: 'How Meridian halved its ETA calls', meta: 'Customers · 5 min' },
    { title: 'A short guide to dock scheduling', meta: 'Operations · 9 min' },
  ],
}

const renderArticle: Render = (sp, content, title) => {
  const C = mergeContent(ARTICLE, content)
  const b = sp.type.body.size
  const read = b + 4
  const css = siteCss(sp) + `
.site-head{box-shadow:inset 0 -1px 0 var(--hairline)}
.ahead{max-width:760px;margin:0 auto;padding:72px 40px 36px;text-align:center}
.ahead .display{font-size:${Math.round(b * 3.6)}px;margin:14px 0 18px}
.ahead .lead{max-width:58ch;margin:0 auto}
.byline{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:28px;font-size:var(--fs-small);color:var(--text-secondary)}
.byline .avatar{width:30px;height:30px;border-radius:99px;background:var(--accent-subtle);color:var(--on-accent-subtle);display:grid;place-items:center;font-size:11px;font-weight:600}
.byline b{color:var(--text);font-weight:500}
.hero-fig{max-width:1080px;margin:16px auto 0;padding:0 40px}
.hero-fig .art{height:400px;border-radius:var(--r-featured);overflow:hidden;background:var(--image-2);position:relative}
.hero-fig figcaption{font-size:var(--fs-small);color:var(--text-tertiary);margin-top:10px;text-align:center}
.prose{max-width:680px;margin:0 auto;padding:48px 40px 24px;font-size:${read}px;line-height:1.7}
.prose p{margin:0 0 1.15em}
.prose p:first-child:first-letter{font-family:var(--display);font-weight:600;float:left;font-size:3.3em;line-height:.9;margin:.06em .1em 0 0}
.prose h2{font-family:var(--display);font-size:${Math.round(read * 1.45)}px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;margin:1.6em 0 .6em}
.prose blockquote{font-family:var(--display);font-size:${Math.round(read * 1.35)}px;line-height:1.35;letter-spacing:-0.015em;font-weight:500;margin:1.4em 0;padding-left:24px;box-shadow:inset 3px 0 0 var(--primary)}
.prose blockquote cite{display:block;font-family:var(--font);font-size:var(--fs-small);font-style:normal;font-weight:400;color:var(--text-secondary);margin-top:10px;letter-spacing:0}
.prose ul{margin:0 0 1.2em 1.1em}
.prose li{margin:.35em 0;padding-left:.2em}
.prose li::marker{color:var(--text-tertiary)}
.callout{display:flex;gap:12px;padding:16px 18px;border-radius:var(--r-panel);background:var(--accent-subtle);color:var(--on-accent-subtle);font-size:${read - 2}px;line-height:1.55;margin:1.4em 0}
.callout .i{margin-top:4px}
.related{max-width:1080px;margin:0 auto;padding:40px 40px 72px}
.related h2{font-family:var(--display);font-size:${b + 6}px;font-weight:600;letter-spacing:-0.015em;margin-bottom:20px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card .art{height:150px;border-radius:var(--r-panel);margin-bottom:14px;overflow:hidden}
.card h3{font-family:var(--display);font-size:${b + 3}px;font-weight:600;letter-spacing:-0.01em;line-height:1.3}
.card p{font-size:var(--fs-small);color:var(--text-secondary);margin-top:6px}
.news{margin:0 40px;border-radius:var(--r-featured);padding:52px 0}
.news .wrap{display:flex;justify-content:space-between;align-items:center;gap:40px;max-width:1000px}
.news h2{font-family:var(--display);font-size:${Math.round(b * 2)}px;font-weight:600;letter-spacing:-0.025em}
.news p{color:var(--on-inverse-muted);margin-top:6px}
.news form{display:flex;gap:8px}
.news .field{width:280px;background:transparent;border-color:var(--on-inverse-muted);color:var(--on-inverse-muted)}
`
  const art = (seed: number, bg: string) => `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;background:var(--${bg})" aria-hidden="true">
<circle cx="${120 + seed * 40}" cy="120" r="80" style="fill:var(--image-accent)" opacity=".85"/><rect x="${210 - seed * 20}" y="40" width="120" height="120" rx="12" style="fill:var(--image-ink)" opacity=".9"/><circle cx="${300 + seed * 10}" cy="60" r="22" style="fill:var(--canvas)"/></svg>`
  const body = `
${siteHead(C.product, C.links, `<span class="field" style="width:200px">${icon('search')}Search</span><a class="btn primary">Subscribe</a>`)}
<header class="ahead"><span class="kicker">${esc(C.category)}</span><h1 class="display">${esc(C.title)}</h1><p class="lead">${esc(C.dek)}</p>
<div class="byline"><span class="avatar">AK</span><b>${esc(C.author)}</b><span>·</span><span>${esc(C.date)}</span><span>·</span><span>${esc(C.read)}</span></div></header>
<figure class="hero-fig"><div class="art">${art(1, 'image-2')}</div><figcaption>The morning board at a regional distributor, 6:40 a.m.</figcaption></figure>
<article class="prose">
${C.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
<h2>${esc(C.h2)}</h2>
${C.paragraphs2.map(p => `<p>${esc(p)}</p>`).join('')}
<blockquote>${esc(C.quote)}<cite>${esc(C.quote_by)}</cite></blockquote>
<ul>${C.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
<div class="callout">${icon('bolt')}<span>${esc(C.callout)}</span></div>
</article>
<section class="related"><h2>Keep reading</h2><div class="cards">${C.related.map((r, i) => `<a class="card"><div class="art">${art(i, i === 1 ? 'image-2' : 'image-1')}</div><h3>${esc(r.title)}</h3><p>${esc(r.meta)}</p></a>`).join('')}</div></section>
<section class="inverse news"><div class="wrap"><div><h2>The Monday dispatch</h2><p>One short email a week on running calmer operations.</p></div><form><span class="field">${icon('mail')}you@company.com</span><a class="btn on-inverse">Subscribe</a></form></div></section>
${siteFoot(C.product, 'Writing from the team behind Harbor.')}`
  return page(sp, { title, css, body })
}

// ─── Product listing ────────────────────────────────────────────────────────

const SHOP = {
  product: 'Field & Kiln',
  links: ['Lighting', 'Tableware', 'Furniture', 'Journal'],
  promo: 'Free delivery on orders over £60, until Sunday',
  page_title: 'Lighting and objects',
  count: '48 products',
  categories: [['All objects', 48], ['Lamps', 14], ['Vases', 11], ['Tableware', 15], ['Seating', 8]],
  materials: [['Ceramic', true], ['Oak', false], ['Brass', true], ['Linen', false]],
  products: [
    { name: 'Arc table lamp', meta: 'Brushed brass', price: '£145', obj: 'lamp', bg: 'image-2', tag: 'New', rating: 4.8 },
    { name: 'Dune vase', meta: 'Stoneware, sand', price: '£58', obj: 'vase', bg: 'image-1', rating: 4.6 },
    { name: 'Morning mug', meta: 'Set of two', price: '£32', was: '£40', obj: 'mug', bg: 'image-1', sale: true, rating: 4.9 },
    { name: 'Low serving bowl', meta: 'Glazed ceramic', price: '£46', obj: 'bowl', bg: 'image-1', rating: 4.7 },
    { name: 'Still bottle', meta: 'Smoked glass', price: '£38', obj: 'bottle', bg: 'image-2', rating: 4.5 },
    { name: 'Kiln stool', meta: 'Oiled oak', price: '£210', obj: 'stool', bg: 'image-1', tag: 'Back in stock', rating: 4.8 },
    { name: 'Linen floor lamp', meta: 'Oak and linen', price: '£260', obj: 'lamp', bg: 'image-1', rating: 4.7 },
  ],
  editorial: { kicker: 'The autumn edit', title: 'Warm light for shorter days', cta: 'Shop the edit' },
}

const renderShop: Render = (sp, content, title) => {
  const C = mergeContent(SHOP, content)
  const b = sp.type.body.size
  const css = siteCss(sp) + `
.promo{background:var(--surface-brand);color:var(--on-brand);text-align:center;font-size:var(--fs-small);font-weight:500;padding:9px 0}
.site-head{box-shadow:inset 0 -1px 0 var(--hairline)}
.cartbtn{position:relative}
.cartbtn b{position:absolute;top:-4px;right:-6px;min-width:17px;height:17px;border-radius:99px;background:var(--primary);color:var(--on-primary);font-size:10px;display:grid;place-items:center;padding:0 4px}
.shophead{padding:40px 0 24px}
.shophead .wrap{display:flex;align-items:flex-end;justify-content:space-between}
.shophead h1{font-family:var(--display);font-size:${Math.round(b * 2.6)}px;font-weight:600;letter-spacing:-0.03em;line-height:1.1}
.shophead p{color:var(--text-secondary);margin-top:6px}
.shophead .tools{display:flex;gap:8px;align-items:center}
.layout .wrap{display:grid;grid-template-columns:220px 1fr;gap:40px;padding-bottom:64px}
.filters h6{font-size:var(--fs-small);font-weight:600;margin:0 0 12px}
.filters section{padding-bottom:22px;margin-bottom:22px;box-shadow:inset 0 -1px 0 var(--hairline)}
.filters section:last-child{box-shadow:none}
.filters .cat{display:flex;justify-content:space-between;padding:6px 10px;margin:0 -10px;border-radius:var(--r-control);color:var(--text-secondary)}
.filters .cat.on{background:var(--nav-selected);color:var(--on-nav-selected);font-weight:500}
.filters .cat span:last-child{font-variant-numeric:tabular-nums;font-size:var(--fs-small)}
.filters label{display:flex;gap:10px;align-items:center;margin:9px 0}
.swatches{display:flex;gap:8px}
.swatches i{width:22px;height:22px;border-radius:99px;box-shadow:inset 0 0 0 1px rgb(0 0 0 / .12)}
.swatches i.on{box-shadow:0 0 0 2px var(--canvas),0 0 0 4px var(--focus)}
.price{display:flex;gap:8px}
.price .field{width:100%;color:var(--text)}
.products{display:grid;grid-template-columns:repeat(3,1fr);gap:28px 22px}
.prod .img{position:relative;border-radius:var(--r-panel);overflow:hidden;aspect-ratio:1 / .95}
.obj{width:100%;height:100%;display:block}
.prod .badges{position:absolute;top:12px;left:12px;display:flex;gap:6px}
.prod .badges .tag{background:var(--surface);color:var(--text);box-shadow:var(--sh-control)}
.prod .badges .sale{background:var(--error-container);color:var(--on-error-container)}
.prod .fav{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:99px;background:var(--surface);display:grid;place-items:center;color:var(--text-secondary);box-shadow:var(--sh-control)}
.prod .add{position:absolute;left:12px;right:12px;bottom:12px}
.prod .add .btn{width:100%}
.prod h3{font-weight:500;margin-top:12px;display:flex;justify-content:space-between;gap:10px}
.prod .m{font-size:var(--fs-small);color:var(--text-secondary);margin-top:2px;display:flex;justify-content:space-between}
.prod s{color:var(--text-tertiary);font-weight:400;margin-right:6px}
.prod .now{color:var(--on-error-container)}
.stars{display:inline-flex;align-items:center;gap:4px;color:var(--text-secondary)}
.stars .i{width:13px;height:13px;color:var(--image-accent);fill:currentColor}
.edit{grid-column:span 2;border-radius:var(--r-featured);padding:36px;display:flex;flex-direction:column;justify-content:flex-end;min-height:100%;position:relative;overflow:hidden}
.edit .k{font-size:var(--fs-small);font-weight:500;color:var(--on-brand-muted)}
.edit h2{font-family:var(--display);font-size:${Math.round(b * 2.3)}px;font-weight:600;letter-spacing:-0.03em;line-height:1.1;margin:8px 0 18px;max-width:14ch}
.edit .btn{align-self:flex-start;background:var(--on-brand);color:var(--surface-brand)}
.edit svg{position:absolute;right:-20px;top:-10px;width:300px;height:280px;opacity:.9}
.pager{display:flex;justify-content:center;gap:6px;margin-top:40px}
.pager a{min-width:36px;height:36px;display:grid;place-items:center;border-radius:var(--r-control);color:var(--text-secondary);font-weight:500}
.pager a.on{background:var(--surface-hover);color:var(--text)}
`
  const card = (p: (typeof SHOP.products)[number], i: number) => `<div class="prod"><div class="img">${objectSvg(p.obj, p.bg)}<div class="badges">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}${p.sale ? '<span class="tag sale">Sale</span>' : ''}</div><span class="fav">${icon('heart')}</span>${i === 0 ? '<div class="add"><a class="btn primary">Add to cart</a></div>' : ''}</div>
<h3><span>${esc(p.name)}</span><span>${p.was ? `<s>${esc(p.was)}</s><span class="now">${esc(p.price)}</span>` : esc(p.price)}</span></h3><div class="m"><span>${esc(p.meta)}</span><span class="stars">${icon('star')}${p.rating}</span></div></div>`
  const prods = C.products.map(card)
  const editorial = `<article class="brandblock edit"><svg viewBox="0 0 200 190" aria-hidden="true"><circle cx="120" cy="80" r="70" style="fill:var(--on-brand)" opacity=".12"/><path d="M90 40h60l18 46H72z" style="fill:var(--on-brand)" opacity=".85"/><rect x="117" y="86" width="6" height="70" style="fill:var(--on-brand)" opacity=".85"/></svg><span class="k">${esc(C.editorial.kicker)}</span><h2>${esc(C.editorial.title)}</h2><a class="btn">${esc(C.editorial.cta)}</a></article>`
  prods.splice(3, 0, editorial)
  const body = `
<div class="promo">${esc(C.promo)}</div>
${siteHead(C.product, C.links, `<span class="field" style="width:220px">${icon('search')}Search objects</span><a class="icon-btn">${icon('user')}</a><a class="icon-btn cartbtn">${icon('cart')}<b>2</b></a>`)}
<section class="shophead"><div class="wrap"><div><h1>${esc(C.page_title)}</h1><p>${esc(C.count)}</p></div><div class="tools"><span class="select">Sort: Featured${icon('chevron')}</span></div></div></section>
<section class="layout"><div class="wrap">
<aside class="filters">
  <section><h6>Category</h6>${C.categories.map((c, i) => `<a class="cat${i === 1 ? ' on' : ''}"><span>${esc(c[0])}</span><span>${c[1]}</span></a>`).join('')}</section>
  <section><h6>Material</h6>${C.materials.map(m => `<label><span class="cb${m[1] ? ' on' : ''}">${m[1] ? icon('check', 'ck') : ''}</span>${esc(m[0])}</label>`).join('')}</section>
  <section><h6>Colour</h6><div class="swatches"><i style="background:var(--image-ink)"></i><i class="on" style="background:var(--image-accent)"></i><i style="background:var(--image-1)"></i><i style="background:var(--image-2)"></i></div></section>
  <section><h6>Price</h6><div class="price"><span class="field">£20</span><span class="field">£250</span></div></section>
</aside>
<div><div class="products">${prods.join('')}</div><nav class="pager"><a class="on">1</a><a>2</a><a>3</a><a>4</a><a>${icon('arrow')}</a></nav></div>
</div></section>
${siteFoot(C.product, 'Objects made in small batches by independent studios.')}`
  return page(sp, { title, css, body })
}

export const LAYOUT_RENDERERS: Record<string, Render> = {
  dashboard: renderDashboard,
  record: renderRecord,
  marketing: renderMarketing,
  article: renderArticle,
  shop: renderShop,
}
