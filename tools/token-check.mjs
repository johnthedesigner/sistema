/**
 * Builds sistema-review/token-check.html for Sistema's own site (tokens.pipeline).
 * Called by style-dictionary.config.mjs. Loads the compiled CSS by a relative path,
 * shows colors in use before the swatches, then type, shape, and spacing, with a
 * light and dark switch.
 */
import fs from 'node:fs'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

export function buildTokenCheck({ base, dark, sistema }) {
  const src = JSON.parse(fs.readFileSync('tokens/src/color.json', 'utf8')).color
  const srcDark = JSON.parse(fs.readFileSync('tokens/src/color.dark.json', 'utf8')).color
  const ref = v => String(v).replace(/[{}]/g, '').replace('palette.', '')
  const roles = Object.keys(base).filter(k => k.startsWith('color.')).map(k => k.slice(6))
  const notes = fs.existsSync('sistema-review/token-notes.json') ? JSON.parse(fs.readFileSync('sistema-review/token-notes.json', 'utf8')) : {}
  const swatches = roles.map(r => `<tr><td><span class="sw" style="background:var(--color-${r})"></span><code>${r}</code></td><td>${ref(src[r].$value)}</td><td>${srcDark[r] ? ref(srcDark[r].$value) : 'same'}</td><td class="m">${esc(src[r].$description ?? '')}${notes[r] ? `<br><b>${esc(notes[r])}</b>` : ''}</td></tr>`).join('')
  const types = Object.keys(base).filter(k => k.startsWith('type.')).map(k => {
    const r = k.slice(5); const v = base[k].value
    return `<div class="trow"><div class="m">${r}<br>${v.fontSize} · ${v.fontWeight} · ${v.lineHeight}</div><div style="font-family:var(--type-${r}-family);font-size:var(--type-${r}-size);font-weight:var(--type-${r}-weight);line-height:var(--type-${r}-line-height);letter-spacing:var(--type-${r}-tracking)">Firm foundations for AI-built apps</div></div>`
  }).join('')
  const radii = Object.keys(base).filter(k => k.startsWith('radius.')).map(k => `<div class="rad"><div style="border-radius:var(--radius-${k.slice(7)})"></div><span>${k.slice(7)} · ${base[k].value}</span></div>`).join('')
  const shadows = Object.keys(base).filter(k => k.startsWith('shadow.')).map(k => `<div class="shd" style="box-shadow:var(--shadow-${k.slice(7)})">${k.slice(7)}</div>`).join('')
  const spaces = Object.keys(base).filter(k => k.startsWith('space.')).map(k => `<div class="sp"><span class="m">${k.slice(6)} · ${base[k].value}</span><i style="width:${base[k].value}"></i></div>`).join('')
  const ramps = JSON.parse(fs.readFileSync('tokens/src/palette.json', 'utf8')).palette
  const strips = Object.entries(ramps).filter(([g]) => g !== 'base').map(([g, stops]) => `<div class="ramp"><div class="m">${g}</div><div class="strip">${Object.entries(stops).map(([k, s]) => `<span style="background:${s.$value}" title="${g} ${k} ${s.$value}"></span>`).join('')}</div></div>`).join('')
  const steps = Object.entries(sistema.steps ?? {}).map(([id, s]) => `${id} ${s.status}`).join(' · ')

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sistema · Token check</title>
<link rel="stylesheet" href="../src/styles/tokens/generated.css">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:var(--color-surface);color:var(--color-on-surface);font:16px/1.6 var(--font-sans)}
.wrap{max-width:1100px;margin:0 auto;padding:24px 20px 64px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-family:var(--font-serif);font-weight:600;font-size:32px;margin:0}h2{font-family:var(--font-serif);font-weight:600;font-size:24px;margin:40px 0 8px}
.m{font-size:12.5px;color:var(--color-on-surface-muted)}code{font:13px var(--font-mono)}
.progress{font-size:12.5px;color:var(--color-on-surface-faint);margin:6px 0 0}
.switch button{font:inherit;font-size:14px;padding:6px 12px;border-radius:var(--radius-md);border:1px solid var(--color-border-strong);background:var(--color-surface-raised);color:var(--color-on-surface);cursor:pointer}
.switch button[aria-pressed=true]{background:var(--color-primary);color:var(--color-on-primary);border-color:var(--color-primary)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.panel{background:var(--color-surface-raised);border-radius:var(--radius-lg);padding:var(--layout-panel-padding)}
.row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-top:1px solid var(--color-border);font-size:14px}
.row.hover{background:var(--color-surface-hover)}.row.sel{background:var(--color-surface-selected);box-shadow:inset 2px 0 0 var(--color-primary)}
.chip{font-size:12px;font-weight:500;padding:2px 10px;border-radius:var(--radius-full)}
.msg{display:flex;gap:10px;padding:12px 14px;border-radius:var(--radius-md);background:var(--color-surface-subtle);margin:8px 0;font-size:14px}.msg b{display:block}
.menu{background:var(--color-surface-overlay);border-radius:var(--radius-xl);box-shadow:var(--shadow-overlay);padding:6px;max-width:260px;font-size:14px}
.menu div{padding:8px 10px;border-radius:var(--radius-sm)}.menu .hl{background:var(--color-surface-highlight)}.menu .del{color:var(--color-error)}
.btns{display:flex;gap:10px;flex-wrap:wrap}.btn{font:500 14px var(--font-sans);height:var(--layout-control-height);padding:0 16px;border-radius:var(--radius-md);border:1px solid transparent;display:inline-flex;align-items:center}
.btn.p{background:var(--color-primary);color:var(--color-on-primary);box-shadow:var(--shadow-control)}.btn.ph{background:var(--color-primary-hover);color:var(--color-on-primary)}
.btn.s{background:var(--color-surface-raised);border-color:var(--color-border-strong);color:var(--color-on-surface)}.btn.f{outline:2px solid var(--color-border-focus);outline-offset:2px}
.block{border-radius:var(--radius-lg);padding:20px;margin:8px 0}
.featured{background:var(--color-surface-featured);border-radius:var(--radius-xl);box-shadow:var(--shadow-featured);padding:20px}
table{border-collapse:collapse;width:100%;font-size:13.5px}td,th{padding:7px 8px;border-bottom:1px solid var(--color-border);text-align:left;vertical-align:top}
.sw{display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:-3px;margin-right:8px;box-shadow:0 0 0 1px var(--color-border)}
.trow{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:baseline;padding:8px 0;border-bottom:1px solid var(--color-border)}
.rad{display:inline-flex;flex-direction:column;gap:6px;margin:0 16px 16px 0}.rad div{width:96px;height:64px;background:var(--color-surface-raised);box-shadow:inset 0 0 0 1px var(--color-border-strong)}.rad span{font-size:12.5px}
.shd{display:inline-grid;place-items:center;width:140px;height:80px;margin:0 16px 16px 0;background:var(--color-surface-raised);border-radius:var(--radius-lg);font-size:13px}
.sp{display:grid;grid-template-columns:110px 1fr;gap:8px;align-items:center;margin:4px 0}.sp i{display:block;height:10px;background:var(--color-primary-container);border-radius:2px}
.ramp{margin:0 0 10px}.strip{display:flex;height:28px;border-radius:6px;overflow:hidden}.strip span{flex:1}
@media (max-width:600px){.trow{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<header><div><h1>Token check</h1><p class="progress">Start a design system · ${esc(steps)}</p></div>
<div class="switch" role="group" aria-label="Theme"><button type="button" data-t="light" aria-pressed="true">Light</button> <button type="button" data-t="dark" aria-pressed="false">Dark</button></div></header>

<h2>Colors in use</h2><p class="m">Built only from the role tokens. Switch the theme to compare.</p>
<div class="grid">
  <div class="panel"><b>Rows and chips</b>
    <div class="row">At rest <span class="chip" style="background:var(--color-success-container);color:var(--color-on-success-container)">Done</span></div>
    <div class="row hover">Hovered <span class="chip" style="background:var(--color-warning-container);color:var(--color-on-warning-container)">Running late</span></div>
    <div class="row sel">Selected <span class="chip" style="background:var(--color-info-container);color:var(--color-on-info-container)">In progress</span></div>
    <div class="row">At rest <span class="chip" style="background:var(--color-error-container);color:var(--color-on-error-container)">Blocked</span></div>
  </div>
  <div class="panel"><b>Messages</b>
    <div class="msg"><span style="color:var(--color-error)">●</span><div><b style="color:var(--color-error)">Couldn't copy the prompt.</b>Select it and copy it by hand.</div></div>
    <div class="msg"><span style="color:var(--color-warning)">●</span><div><b style="color:var(--color-warning)">This play needs a decision first.</b>Approve the direction to continue.</div></div>
    <div class="msg"><span style="color:var(--color-success)">●</span><div><b style="color:var(--color-success)">Copied.</b>Paste it into your agent.</div></div>
    <div class="msg"><span style="color:var(--color-info)">●</span><div><b style="color:var(--color-info)">Updated today.</b>This guide was reviewed on 21 November.</div></div>
  </div>
  <div class="panel"><b>Menu and buttons</b>
    <div class="menu" style="margin:12px 0"><div>Open play</div><div class="hl">Copy prompt</div><div>View raw</div><div class="del">Remove</div></div>
    <div class="btns"><span class="btn p">Copy prompt</span><span class="btn ph">Hover</span><span class="btn s">Secondary</span><span class="btn s f">Focused</span></div>
    <p style="margin:12px 0 0;font-size:14px">A <a style="color:var(--color-link)">link in text</a>, small: <a style="color:var(--color-link);font-size:13px">a small link</a>.</p>
  </div>
  <div class="panel" style="background:var(--color-surface)"><b>Emphasis</b>
    <div class="featured" style="margin:12px 0">The featured item: the prompt box.</div>
    <div class="block" style="background:var(--color-surface-brand);color:var(--color-on-surface-brand)">A brand block.</div>
    <div class="block" style="background:var(--color-surface-inverse);color:var(--color-on-surface-inverse)">An inverse block.</div>
    <div class="block" style="background:var(--color-brand-yellow-subtle)"><span style="display:inline-block;width:12px;height:12px;border-radius:99px;background:var(--color-brand-yellow)"></span> <span style="display:inline-block;width:12px;height:12px;border-radius:99px;background:var(--color-brand-red)"></span> Brand marks: logo colors only.</div>
  </div>
</div>

<h2>Color roles</h2><table><tr><th>Role</th><th>Light</th><th>Dark</th><th>For</th></tr>${swatches}</table>
<h2>Ramps</h2>${strips}
<h2>Type</h2>${types}
<h2>Radius</h2>${radii}
<h2>Shadows</h2>${shadows}
<h2>Spacing</h2>${spaces}
<p class="m" style="margin-top:40px">This project follows Sistema. To continue, fetch the URL in sistema.json "continue": ${esc(sistema.continue ?? '')}</p>
</div>
<script>
const bs=[...document.querySelectorAll('.switch button')];
bs.forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.t;bs.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
</script></body></html>`
}
