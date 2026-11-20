/**
 * Builds docs/v2/comparisons/palette-next.html: the current palette algorithm
 * beside the proposed one (src/lib/palette-next.ts), for owner review.
 *   npx tsx compare-palettes.ts   (from tools/)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { oklch, wcagContrast } from 'culori'
import type { PaletteResult } from '../src/lib/palette'
const { generatePalette } = await import('../src/lib/palette')
const { generatePaletteNext, targetContrast, EASE, CHROMA_PLATEAU, YELLOW } = await import('../src/lib/palette-next')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const library = JSON.parse(readFileSync(join(root, 'public/palettes/library.json'), 'utf-8')) as Record<string, PaletteResult>
const STOPS = ['50', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '750', '800', '850', '900', '950']
const seeds: Record<string, string> = Object.fromEntries(Object.entries(library).map(([k, v]) => [k, v.seed]))
seeds['yellow-brand'] = '#facc15'
seeds['ochre'] = '#c9a227'
seeds['relay petrol'] = '#00717F'
seeds['harbor green'] = '#1E6B5C'

const cur: Record<string, PaletteResult> = {}
const nxt: Record<string, PaletteResult> = {}
for (const [k, s] of Object.entries(seeds)) { cur[k] = generatePalette(s); nxt[k] = generatePaletteNext(s) }

const ok = (hex: string) => { const o = oklch(hex)!; return { l: o.l, c: o.c ?? 0, h: o.h ?? 0 } }
const tip = (hex: string, stop: string) => { const o = ok(hex); return `${stop}  ${hex}  L ${o.l.toFixed(3)}  C ${o.c.toFixed(3)}  h ${o.h.toFixed(0)}  ${wcagContrast(hex, '#fff').toFixed(2)}:1 on white` }
const strip = (p: PaletteResult) => `<div class="strip">${STOPS.map(s => `<i style="background:${p.stops[s].hex}" title="${tip(p.stops[s].hex, s)}"></i>`).join('')}</div>`

function line(points: number[], max: number, w: number, h: number, style: string) {
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * w) / (points.length - 1)},${h - (v / max) * h}`).join(' ')
  return `<path d="${d}" fill="none" ${style}/>`
}

// Contrast curve chart (log scale)
const curT = STOPS.map((_, i) => Math.log(targetContrast(i, 0)))
const nxtT = STOPS.map((_, i) => Math.log(targetContrast(i)))
const maxLog = Math.log(19)
const contrastChart = `<svg viewBox="-40 -10 640 250" class="chart">
${[1, 1.5, 2, 3, 4.5, 7, 12, 19].map(v => `<line x1="0" x2="600" y1="${220 - (Math.log(v) / maxLog) * 220}" y2="${220 - (Math.log(v) / maxLog) * 220}" stroke="#e7e7e4"/><text x="-8" y="${224 - (Math.log(v) / maxLog) * 220}" text-anchor="end">${v}</text>`).join('')}
${STOPS.map((s, i) => (i % 3 === 0 ? `<text x="${(i * 600) / 18}" y="240" text-anchor="middle">${s}</text>` : '')).join('')}
${line(curT, maxLog, 600, 220, 'stroke="#9a9a96" stroke-width="2" stroke-dasharray="5 4"')}
${line(nxtT, maxLog, 600, 220, 'stroke="#1E6B5C" stroke-width="2.5"')}
</svg>`

function chromaChart(names: string[]) {
  const max = 0.25
  const colors = ['#c0392b', '#d68910', '#b7950b', '#1e8449', '#2e5fd1', '#7d3c98']
  return `<svg viewBox="-36 -10 640 250" class="chart">
${[0, 0.05, 0.1, 0.15, 0.2, 0.25].map(v => `<line x1="0" x2="600" y1="${220 - (v / max) * 220}" y2="${220 - (v / max) * 220}" stroke="#e7e7e4"/><text x="-8" y="${224 - (v / max) * 220}" text-anchor="end">${v}</text>`).join('')}
${STOPS.map((s, i) => (i % 3 === 0 ? `<text x="${(i * 600) / 18}" y="240" text-anchor="middle">${s}</text>` : '')).join('')}
${names.map((n, j) => line(STOPS.map(s => ok(cur[n].stops[s].hex).c), max, 600, 220, `stroke="${colors[j]}" stroke-width="1.5" stroke-dasharray="4 4" opacity=".7"`) + line(STOPS.map(s => ok(nxt[n].stops[s].hex).c), max, 600, 220, `stroke="${colors[j]}" stroke-width="2.5"`)).join('')}
</svg><div class="keys">${names.map((n, j) => `<span><i style="background:${colors[j]}"></i>${n}</span>`).join('')}<span class="muted">dashed: current · solid: proposed</span></div>`
}

const chips = (set: Record<string, PaletteResult>, tint = '100') => `<div class="chips">${[['red', 'Held'], ['amber', 'Delayed'], ['yellow', 'Pending'], ['green', 'Delivered'], ['blue', 'In transit'], ['violet', 'Review']].map(([h, l]) => `<span style="background:${set[h].stops[tint].hex};color:${set[h].stops['800'].hex}"><i style="background:${set[h].stops['500'].hex}"></i>${l}</span>`).join('')}</div>`

const surfaces = (set: Record<string, PaletteResult>, dark: boolean) => {
  const n = set['neutral'].stops
  const page = dark ? n['950'].hex : n['50'].hex, panel = dark ? n['900'].hex : '#ffffff', hover = dark ? n['850'].hex : n['100'].hex, line = dark ? n['800'].hex : n['150'].hex
  const text = dark ? n['50'].hex : n['900'].hex, muted = dark ? n['400'].hex : n['600'].hex
  return `<div class="surf" style="background:${page};color:${text}"><div class="p" style="background:${panel}"><b>Panel</b><span style="color:${muted}">on the page</span><div class="row" style="border-top:1px solid ${line}">Row</div><div class="row" style="background:${hover};border-top:1px solid ${line}">Hovered row</div><div class="row" style="border-top:1px solid ${line}">Row</div></div><div class="side" style="color:${muted}">Page ${dark ? '950' : '50'} · panel ${dark ? '900' : 'white'} · hover ${dark ? '850' : '100'}</div></div>`
}

const firstLast = (i: number) => `<td>${targetContrast(i, 0).toFixed(2)}</td><td><b>${targetContrast(i).toFixed(2)}</b></td>`
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Palette: current and proposed</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap">
<style>
*{box-sizing:border-box;margin:0}
body{font-family:'Instrument Sans',system-ui,sans-serif;background:#f7f7f5;color:#1d1d1b;font-size:15px;line-height:1.5;padding:56px 40px 96px}
main{max-width:1180px;margin:0 auto}
h1{font-size:34px;letter-spacing:-0.03em;line-height:1.1;font-weight:600}
h2{font-size:21px;letter-spacing:-0.015em;font-weight:600;margin:64px 0 6px}
.lead{color:#5f5f5b;max-width:68ch;margin-top:12px;font-size:17px}
.sub{color:#5f5f5b;max-width:72ch;margin-bottom:22px}
.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:32px}
.rules div{background:#fff;border-radius:14px;padding:20px 22px}
.rules b{display:block;margin-bottom:6px}
.rules p{color:#5f5f5b;font-size:14px}
.rules code{font-size:12.5px;background:#f0f0ed;padding:1px 5px;border-radius:4px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start}
.chart{width:100%;height:auto;overflow:visible}
.chart text{font-size:11px;fill:#8a8a86}
.keys{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;margin-top:8px}
.keys i{display:inline-block;width:12px;height:3px;border-radius:2px;margin-right:6px;vertical-align:middle}
.muted{color:#8a8a86}
table{border-collapse:collapse;font-size:13.5px;font-variant-numeric:tabular-nums}
td,th{padding:6px 14px 6px 0;text-align:left}
th{font-weight:500;color:#8a8a86}
.ramp{display:grid;grid-template-columns:120px 1fr;gap:4px 16px;align-items:center;margin:10px 0}
.ramp .name{font-size:13.5px;font-weight:500;grid-row:span 2}
.ramp .tag{display:none}
.strip{display:grid;grid-template-columns:repeat(19,1fr);height:30px;border-radius:7px;overflow:hidden}
.strip i{display:block}
.strip + .strip{margin-top:0}
.legend{display:grid;grid-template-columns:120px 1fr;gap:16px;font-size:12px;color:#8a8a86;margin-bottom:6px}
.legend div{display:grid;grid-template-columns:repeat(19,1fr);text-align:center}
.pair{font-size:12px;color:#8a8a86}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px 0 9px;border-radius:7px;font-size:13.5px;font-weight:500}
.chips i{width:7px;height:7px;border-radius:9px}
.label{font-size:13px;color:#8a8a86;margin-bottom:10px}
.surf{border-radius:14px;padding:22px;display:grid;grid-template-columns:1fr 150px;gap:18px;font-size:14px}
.surf .p{border-radius:10px;padding:16px 16px 6px}
.surf .p b{display:block;font-weight:600}
.surf .row{padding:9px 6px;margin:0 -6px;border-radius:6px}
.surf .side{font-size:12px;align-self:end}
.big .strip{height:56px}
</style></head><body><main>
<h1>Palette: current and proposed</h1>
<p class="lead">Every ramp below is generated twice from the same seed: once by the current algorithm, once by the proposed one. Three fixed rules change; each is set by one named constant in <code>src/lib/palette-next.ts</code>, so the result stays deterministic and explainable. Hover any swatch for its values.</p>
<div class="rules">
<div><b>1. An eased contrast curve</b><p>Stops are still placed by contrast against white, from 1.01 to 19, and stop 500 is unchanged. The curve eases in and out, so steps are fine near white and black, where page and panel tones live, and wider through the mid-tones. <code>EASE = ${EASE}</code></p></div>
<div><b>2. Colorfulness by lightness, the same for every hue</b><p>The seed sets how colorful a ramp is. One shared curve sets how colorfulness rises from white (in proportion to distance from white), holds through the mid-tones (L ${CHROMA_PLATEAU.dark} to ${CHROMA_PLATEAU.light}, or up to the seed's own lightness for bright seeds such as yellow), and eases toward black. Where a hue can't reach it on screen, chroma approaches the limit smoothly, so no single stop is adjusted on its own.</p></div>
<div><b>3. Yellows lean warm as they darken</b><p>Dark yellow doesn't exist on screens; held at the same hue it can only become olive. Hues within ${YELLOW.halfWidth}° of ${YELLOW.center}° turn toward orange in proportion to how dark the stop is, up to ${YELLOW.maxTurn}° at black, the way ochres and browns behave.</p></div>
</div>

<h2>Rule 1: finer steps at both ends</h2>
<p class="sub">Target contrast against white for each stop. Dashed is the current, evenly spaced curve; solid is the eased one. The current curve jumps from 1.04 to 1.19 between stops 50 and 100, which is why there was no quiet page tone.</p>
<div class="grid2"><div>${contrastChart}<div class="keys"><span><i style="background:#9a9a96"></i>current</span><span><i style="background:#1E6B5C"></i>proposed</span></div></div>
<table><tr><th>Stop</th><th>Current</th><th>Proposed</th></tr>${[0, 1, 2, 3, 4, 9, 14, 15, 16, 17, 18].map(i => `<tr><td>${STOPS[i]}</td>${firstLast(i)}</tr>`).join('')}</table></div>

<h2>The neutral ramp in use</h2>
<p class="sub">A panel on a page, with a hovered row, built from the same stops in each version. Same stop names; only the values differ.</p>
<div class="grid2"><div><p class="label">Current, light</p>${surfaces(cur, false)}</div><div><p class="label">Proposed, light</p>${surfaces(nxt, false)}</div>
<div><p class="label">Current, dark</p>${surfaces(cur, true)}</div><div><p class="label">Proposed, dark</p>${surfaces(nxt, true)}</div></div>

<h2>Rule 2: tints with equal weight</h2>
<p class="sub">Status chips use a light tint behind stop 800 text: stop 100 today; in the proposal, stop 150, because the eased curve makes 100 lighter and 150 now sits where 100 did (1.17:1 against 1.19). Today green's tint is about four times as colorful as red's or blue's, because each hue's chroma is scaled to that hue's own on-screen maximum. Proposed, every hue follows the same colorfulness curve.</p>
<div class="grid2"><div><p class="label">Current</p>${chips(cur)}</div><div><p class="label">Proposed (stop 150, which now sits where 100 did)</p>${chips(nxt, '150')}</div></div>
<p class="sub" style="margin-top:28px">Chroma at every stop. Dashed lines are current, solid are proposed. The proposed lines are smooth from end to end: the shared curve and the soft limit change every stop a little, rather than a few stops a lot.</p>
${chromaChart(['red', 'amber', 'yellow', 'green', 'blue', 'violet'])}

<h2>Rule 3: yellows that stay rich when dark</h2>
<p class="sub">Current on top, proposed below, for the hues the turn affects most.</p>
<div class="big">${['yellow', 'yellow-brand', 'amber', 'ochre', 'lime', 'orange'].map(n => `<div class="ramp"><span class="name">${n}</span>${strip(cur[n])}${strip(nxt[n])}</div>`).join('')}</div>

<h2>Every library ramp</h2>
<p class="sub">Current on top, proposed below. Includes the two reference brand colors (Relay's petrol and the specimen's green).</p>
<div class="legend"><span></span><div>${STOPS.map(s => `<span>${s}</span>`).join('')}</div></div>
${Object.keys(seeds).map(n => `<div class="ramp"><span class="name">${n}<br><span class="pair">${seeds[n]}</span></span>${strip(cur[n])}${strip(nxt[n])}</div>`).join('')}
</main></body></html>`

mkdirSync(join(root, 'docs/v2/comparisons'), { recursive: true })
writeFileSync(join(root, 'docs/v2/comparisons/palette-next.html'), html)
console.log('wrote docs/v2/comparisons/palette-next.html')
