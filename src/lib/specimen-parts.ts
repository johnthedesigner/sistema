/**
 * Shared parts for specimen layouts (src/lib/specimen-html.ts, specimen-layouts.ts):
 * the page wrapper with every role as a CSS custom property, the base
 * components, and the icons. Layouts add their own CSS and body.
 */
import type { Specimen } from './specimen'

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

// Simple 16px stroke icons, drawn for these pages.
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
  user: '<circle cx="8" cy="5.5" r="2.5"/><path d="M3 13.5c.8-2.4 2.7-3.5 5-3.5s4.2 1.1 5 3.5"/>',
  settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2"/>',
  cart: '<path d="M1.8 2.5h2l1.6 7.5h7l1.6-5.5H4.6"/><circle cx="6.5" cy="12.8" r=".9"/><circle cx="11.5" cy="12.8" r=".9"/>',
  heart: '<path d="M8 13.2S2.5 10 2.5 6.2A2.8 2.8 0 0 1 8 5a2.8 2.8 0 0 1 5.5 1.2C13.5 10 8 13.2 8 13.2z"/>',
  star: '<path d="m8 2.3 1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 11.1 4.5 13l.8-3.9-2.9-2.7 3.9-.5z"/>',
  bolt: '<path d="M9 1.8 3.5 9h4L7 14.2 12.5 7h-4z"/>',
  layers: '<path d="M8 2 1.8 5.2 8 8.4l6.2-3.2zM1.8 8 8 11.2 14.2 8M1.8 10.8 8 14l6.2-3.2"/>',
  shield: '<path d="M8 1.8 13 3.6v4c0 3-2.2 5.3-5 6.6-2.8-1.3-5-3.6-5-6.6v-4z"/>',
  clock: '<circle cx="8" cy="8" r="5.8"/><path d="M8 4.8V8l2.2 1.4"/>',
  mail: '<rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 4.5 5.5 4 5.5-4"/>',
  filter: '<path d="M2.5 3.5h11M4.5 8h7M6.5 12.5h3"/>',
  calendar: '<rect x="2.5" y="3.5" width="11" height="10" rx="1.5"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/>',
}
export const icon = (name: string, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name] ?? ''}</svg>`

function fontsHref(families: string[]): string {
  const uniq = [...new Set(families)]
  return 'https://fonts.googleapis.com/css2?' + uniq.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`).join('&') + '&display=swap'
}

export type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral'
export const chip = (label: string, tone: Tone) =>
  `<span class="chip" style="background:var(--${tone}-container);color:var(--on-${tone}-container)"><i style="background:var(--${tone}-dot)"></i>${esc(label)}</span>`

/** Every role, radius, shadow, type size, and space value as a custom property. */
function vars(sp: Specimen): string {
  return [
    ...Object.entries(sp.colors).map(([k, v]) => `--${k}:${v.hex};`),
    ...Object.entries(sp.radius).map(([k, v]) => `--r-${k}:${v}px;`),
    ...Object.entries(sp.shadows).map(([k, v]) => `--sh-${k}:${v};`),
    `--control-h:${sp.space.control_height}px;--row-h:${sp.space.row_height}px;--pad:${sp.space.panel_padding}px;--gap:${sp.space.gap}px;--page:${sp.space.page_padding}px;`,
    ...Object.entries(sp.type).map(([k, t]) => `--fs-${k}:${t.size}px;--fw-${k}:${t.weight};--lh-${k}:${t.line_height};--ls-${k}:${t.tracking}em;`),
    `--font:'${sp.input.font}',ui-sans-serif,system-ui,sans-serif;--display:'${sp.input.display_font}','${sp.input.font}',ui-sans-serif,system-ui,sans-serif;`,
  ].join('')
}

/** Components every layout shares. */
function baseCss(sp: Specimen): string {
  const dark = sp.input.theme === 'dark'
  const sep = sp.input.separation
  const lift = dark ? ',inset 0 1px 0 rgb(255 255 255 / .06)' : ''
  return `
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--canvas)}
body{font-family:var(--font);font-size:var(--fs-body);line-height:var(--lh-body);color:var(--text);-webkit-font-smoothing:antialiased;min-width:1120px}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit;text-decoration:none}
.i{width:16px;height:16px;flex:none}
.eyebrow{font-size:var(--fs-small);color:var(--text-secondary)}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-secondary);font-size:var(--fs-small);font-variant-numeric:tabular-nums}
.field{display:flex;align-items:center;gap:8px;height:var(--control-h);padding:0 10px;border:1px solid var(--border-control);border-radius:var(--r-control);background:var(--surface);color:var(--text-tertiary)}
.field.filled{color:var(--text)}
.field.focus{border-color:var(--focus);box-shadow:0 0 0 3px var(--accent-subtle)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:var(--control-h);padding:0 14px;border-radius:var(--r-control);font-weight:500;white-space:nowrap}
.btn.primary{background:var(--primary);color:var(--on-primary);box-shadow:var(--sh-control)}
.btn.secondary{background:var(--surface);border:1px solid var(--border-quiet);box-shadow:var(--sh-control)}
.btn.ghost{color:var(--text-secondary);padding:0 10px}
.btn.on-brand{background:rgb(255 255 255 / .16);color:var(--on-brand);padding:0 14px}
.btn.on-inverse{background:var(--on-inverse);color:var(--surface-inverse)}
.btn.lg{height:calc(var(--control-h) + 10px);padding:0 20px;font-size:calc(var(--fs-body) + 1px)}
.panel{background:var(--surface);border-radius:var(--r-panel);box-shadow:var(--sh-panel)${sep === 'line' ? ';border:1px solid var(--hairline)' : ''}}
.featured{background:var(--surface-featured);border-radius:var(--r-featured);box-shadow:var(--sh-featured)${lift}}
.brandblock{background:var(--surface-brand);color:var(--on-brand);border-radius:var(--r-featured)}
.inverse{background:var(--surface-inverse);color:var(--on-inverse)}
.chip{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px 0 8px;border-radius:var(--r-chip);font-size:var(--fs-small);font-weight:500;line-height:1;white-space:nowrap}
.chip i{width:6px;height:6px;border-radius:99px}
.tag{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:var(--r-chip);font-size:var(--fs-small);font-weight:500;background:var(--accent-subtle);color:var(--on-accent-subtle)}
.cb{width:16px;height:16px;border:1px solid var(--border-control);border-radius:calc(var(--r-small) * .6);display:inline-grid;place-items:center;background:var(--surface);flex:none}
.cb.on{background:var(--primary);border-color:var(--primary);color:var(--on-primary)}
.ck{width:12px;height:12px;stroke-width:2}
.icon-btn{width:28px;height:28px;display:inline-grid;place-items:center;border-radius:var(--r-control);color:var(--text-tertiary)}
.icon-btn.open{background:var(--surface-hover);color:var(--text)}
.tabs{display:inline-flex;gap:2px;padding:2px;background:var(--surface-hover);border-radius:calc(var(--r-control) + 2px)}
.tabs button{height:calc(var(--control-h) - 6px);padding:0 10px;border-radius:var(--r-control);font-size:var(--fs-small);font-weight:500;color:var(--text-secondary)}
.tabs button.on{background:var(--surface);color:var(--text);box-shadow:var(--sh-control)}
.select{display:inline-flex;align-items:center;gap:8px;height:calc(var(--control-h) - 2px);padding:0 10px;border:1px solid var(--border-control);border-radius:var(--r-control);font-size:var(--fs-small);font-weight:500;background:var(--surface)}
.menu{position:absolute;width:168px;background:var(--surface-overlay);border-radius:var(--r-overlay);box-shadow:var(--sh-overlay)${lift};padding:5px;z-index:2}
.menu div{display:flex;align-items:center;height:calc(var(--control-h) - 2px);padding:0 10px;border-radius:calc(var(--r-overlay) - 5px)}
.menu div.on{background:var(--surface-hover)}
.menu hr{border:0;height:6px}
.menu div.danger{color:var(--on-error-container)}
.toast{position:fixed;right:28px;bottom:24px;display:flex;align-items:center;gap:14px;background:var(--surface-inverse);color:var(--on-inverse);padding:10px 10px 10px 14px;border-radius:var(--r-overlay);box-shadow:var(--sh-overlay);font-weight:500;z-index:3}
.toast .ok{width:18px;height:18px;border-radius:99px;background:var(--success-dot);display:grid;place-items:center;color:#fff}
.toast button{color:var(--on-inverse);font-weight:600;padding:4px 10px;border-radius:var(--r-small);background:rgb(127 127 127 / .18)}
.mark{width:22px;height:22px;border-radius:calc(var(--r-small) + 1px);background:var(--primary);display:inline-grid;place-items:center;flex:none}
.mark:after{content:"";width:8px;height:8px;border-radius:2px;background:var(--on-primary)}
`
}

export function page(sp: Specimen, o: { title?: string; css: string; body: string }): string {
  const dark = sp.input.theme === 'dark'
  return `<!doctype html>
<html lang="en" data-theme="${dark ? 'dark' : 'light'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title ?? 'Specimen')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsHref([sp.input.font, sp.input.display_font])}">
<style>
:root{${vars(sp)}color-scheme:${dark ? 'dark' : 'light'}}
${baseCss(sp)}
${o.css}
</style>
</head>
<body>
${o.body}
</body>
</html>`
}

/** Shallow-merge placeholder content with what the caller sends, one level deep. */
export function mergeContent<T extends Record<string, unknown>>(defaults: T, content: Record<string, unknown> = {}): T {
  const out: Record<string, unknown> = { ...defaults }
  for (const [k, v] of Object.entries(content)) {
    const d = (defaults as Record<string, unknown>)[k]
    out[k] = d && typeof d === 'object' && !Array.isArray(d) && v && typeof v === 'object' && !Array.isArray(v) ? { ...d, ...v } : v
  }
  return out as T
}
