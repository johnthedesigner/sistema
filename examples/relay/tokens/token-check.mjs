// Builds sistema-review/token-check.html from the compiled tokens.
// Called by style-dictionary.config.mjs on every `npm run tokens`. Do not edit the HTML by hand.
import { readFileSync, existsSync } from 'node:fs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// "{palette.accent.550}" -> "accent 550"
const refName = (v) => {
  const m = typeof v === 'string' && v.match(/^\{palette\.([\w-]+)(?:\.(\w+))?\}$/);
  return m ? (m[2] ? `${m[1]} ${m[2]}` : m[1]) : null;
};

const OUTLINE = [
  ['Start a design system', [
    ['done', '1. Assess the project'],
    ['done', '2. Set the visual direction'],
    ['done gate', '◆ direction-approved'],
    ['done', '3. Write DESIGN.md'],
    ['done', '4. Voice and tone'],
    ['done', '5. Color scheme'],
    ['done', '6. Type scale'],
    ['done', '7. Shape and elevation'],
    ['done', '8. Spacing'],
    ['done', '9. Compile the tokens'],
    ['done gate', '◆ foundations-approved'],
  ]],
  ['Then: Build the patterns', [
    ['done', '1. Scaffold the core components'],
    ['done gate', '◆ components-approved'],
    ['', '2. Page examples (optional)'],
    ['', '3. System reference (optional)'],
  ]],
];

export function buildTokenCheck({ base, all, modeTokens, sistema }) {
  const match = existsSync('sistema-review/preview-match.json')
    ? JSON.parse(readFileSync('sistema-review/preview-match.json', 'utf8'))
    : {};
  const dark = Object.fromEntries((modeTokens.dark || []).map((t) => [t.path.join('.'), t]));
  const by = (p) => base.filter((t) => t.path[0] === p);

  // Colors
  const colorRows = by('color').map((t) => {
    const role = t.path.slice(1).join('-');
    const d = dark[t.path.join('.')];
    const lRef = refName(t.original.$value) || 'own value';
    const dRef = d ? refName(d.original.$value) || 'own value' : lRef;
    const m = match[role];
    let status;
    if (!m) status = '<span class="tag">not in the preview</span>';
    else if (!m.preview) status = `<span class="tag">not in the preview</span> ${esc(m.note || '')}`;
    else if (m.light === lRef && m.dark === dRef && !m.note) status = `<span class="tag ok">matches</span> preview <code>${esc(m.preview)}</code>`;
    else if (m.light === lRef && m.dark === dRef) status = `<span class="tag ok">matches</span> preview <code>${esc(m.preview)}</code>. ${esc(m.note)}`;
    else status = `<span class="tag diff">differs</span> preview <code>${esc(m.preview)}</code> was ${esc(m.light)} / ${esc(m.dark)}. ${esc(m.note || '')}`;
    return `<tr><td><span class="sw" style="background:var(--${t.name})"></span><code>${role}</code></td>
<td>${esc(lRef)}<br><span class="hex">${esc(t.$value)}</span></td><td>${esc(dRef)}<br><span class="hex">${esc(d ? d.$value : t.$value)}</span></td><td class="st">${status}</td></tr>`;
  });

  // Ramps
  const ramps = {};
  for (const t of all.filter((t) => t.path[0] === 'palette' && t.path.length === 3)) {
    (ramps[t.path[1]] ||= []).push([t.path[2], t.$value]);
  }
  const rampHtml = Object.entries(ramps).map(([name, stops]) => `<div class="ramp"><div class="rn">${name}</div><div class="rs"><div class="strip">${stops
    .map(([s, v]) => `<i style="background:${v}" title="${name} ${s} ${v}"></i>`).join('')}</div><div class="rl">${stops
    .map(([s, v]) => `<span><b>${s}</b>${v}</span>`).join('')}</div></div></div>`).join('');

  // Type
  const roles = [...new Set(by('type').map((t) => t.path[1]))];
  const sample = {
    metric: '18 of 31', title: "Today's board", heading: 'No heat, 2-storey house · Hartley residence',
    body: 'D. Okafor is 25 min behind. Reassign the job or notify the customer.',
    'body-strong': 'K. Byrne, arriving 9:40 am', data: 'JOB-20417  Pine St Laundromat  8–10 am',
    label: 'Assign tech', overline: 'Job details',
  };
  const typeHtml = roles.map((r) => {
    const v = (k) => base.find((t) => t.path.join('.') === `type.${r}.${k}`)?.$value;
    const style = `font-family:var(--type-${r}-family);font-size:var(--type-${r}-size);font-weight:var(--type-${r}-weight);line-height:var(--type-${r}-line-height);letter-spacing:var(--type-${r}-letter-spacing)${r === 'overline' ? ';text-transform:uppercase' : ''}${['data', 'metric'].includes(r) ? ';font-variant-numeric:tabular-nums' : ''}`;
    return `<div class="trow"><div class="tl"><code>${r}</code><br>${v('size')} / ${v('weight')} / ${v('line-height')} / ${v('letter-spacing')}</div><div style="${style}">${esc(sample[r] || r)}</div></div>`;
  }).join('');

  const radiusHtml = by('radius').map((t) => `<div class="rad"><div class="box" style="border-radius:var(--${t.name})"></div><code>${t.path[1]}</code> ${t.$value}<p>${esc(t.original.$description || '')}</p></div>`).join('');
  const shadowHtml = by('shadow').map((t) => `<div class="shd"><div class="card" style="box-shadow:var(--${t.name})"><code>shadow-${t.path[1]}</code></div><p>${esc(t.original.$description || '')}</p></div>`).join('');
  const spaceHtml = [...by('space'), ...by('layout')].map((t) => `<div class="sp"><code>${t.path[0] === 'layout' ? t.path[1] : 'space-' + t.path[1]}</code><span class="bar" style="width:var(--${t.name})"></span><span>${t.$value}</span></div>`).join('');

  // shadcn/ui variables (src/styles/shadcn-theme.css :root): each points at a role token.
  let shadcnHtml = '<p class="sub">No shadcn theme file.</p>';
  if (existsSync('src/styles/shadcn-theme.css')) {
    const css = readFileSync('src/styles/shadcn-theme.css', 'utf8');
    const root = (css.match(/:root\s*{([^}]*)}/) || [])[1] || '';
    const rows = [...root.matchAll(/--([\w-]+):\s*var\(--([\w-]+)\);/g)]
      .map(([, v, t]) => `<tr><td><code>--${v}</code></td><td><span class="sw" style="background:var(--${t})"></span><code>${t.replace(/^color-/, '')}</code></td></tr>`);
    shadcnHtml = `<div class="tscroll"><table><thead><tr><th>shadcn variable</th><th>Role token</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p class="sub">Not mapped (no matching role; not invented): --chart-1..5, --sidebar-*.</p>`;
  }

  const outline = OUTLINE.map(([h, items]) => `<div><b>${h}</b><ol>${items.map(([c, l]) => `<li class="${c}">${esc(l)}</li>`).join('')}</ol></div>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relay token check</title>
<!-- Generated by style-dictionary.config.mjs (tokens/token-check.mjs). Do not edit by hand. -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600&display=swap">
<link rel="stylesheet" href="../src/styles/tokens/tokens.css">
<style>
*{box-sizing:border-box}
html,body{margin:0;background:var(--color-surface);color:var(--color-on-surface);font-family:var(--font-sans);font-size:var(--type-body-size);line-height:var(--type-body-line-height)}
.page{max-width:1180px;margin:0 auto;padding:0 var(--layout-page-gutter) 48px}
h1{font-size:var(--type-title-size);font-weight:var(--type-title-weight);letter-spacing:var(--type-title-letter-spacing);margin:20px 0 4px}
h2{font-size:var(--type-heading-size);font-weight:var(--type-heading-weight);margin:0 0 4px}
p.sub{color:var(--color-on-surface-muted);margin:0 0 12px;max-width:80ch}
section{background:var(--color-surface-raised);box-shadow:var(--shadow-raised);border-radius:var(--radius-lg);padding:var(--layout-panel-padding);margin:var(--layout-section-gap) 0}
code{font-size:12px;color:var(--color-on-surface)}
.outline{display:flex;flex-wrap:wrap;gap:8px 24px;padding:12px 0;font-size:12px}
.outline ol{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:4px}
.outline li{padding:2px 8px;border-radius:999px;background:var(--color-secondary-container);color:var(--color-on-secondary-container)}
.outline li.done{background:var(--color-success-container);color:var(--color-on-success-container)}
.outline li.current{background:var(--color-primary);color:var(--color-on-primary);font-weight:600}
.bar-top{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
.switch{display:flex;gap:4px}
.switch button{font:inherit;font-size:12px;height:var(--layout-control-height);padding:0 10px;border-radius:var(--radius-md);border:1px solid var(--color-border-strong);background:var(--color-surface-raised);color:var(--color-on-surface);cursor:pointer}
.switch button[aria-pressed=true]{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}
.tscroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;min-width:720px;font-size:12.5px}
th{text-align:left;color:var(--color-on-surface-muted);font-weight:500;padding:6px 8px;border-bottom:1px solid var(--color-border)}
td{padding:6px 8px;border-bottom:1px solid var(--color-border);vertical-align:top}
.sw{display:inline-block;width:18px;height:18px;border-radius:var(--radius-xs);vertical-align:-4px;margin-right:8px;box-shadow:inset 0 0 0 1px rgb(127 127 127 / .25)}
.hex{color:var(--color-on-surface-muted)}
td.st{max-width:420px}
.tag{display:inline-block;font-size:11px;padding:0 6px;border-radius:var(--radius-xs);background:var(--color-secondary-container);color:var(--color-on-secondary-container)}
.tag.ok{background:var(--color-success-container);color:var(--color-on-success-container)}
.tag.diff{background:var(--color-warning-container);color:var(--color-on-warning-container)}
.ramp{margin:10px 0}.rn{font-weight:600;font-size:12px;margin-bottom:4px}.rs{overflow-x:auto}
.strip,.rl{display:flex;min-width:760px}.strip{height:36px;border-radius:var(--radius-sm);overflow:hidden}.strip i{flex:1}
.rl span{flex:1;font-size:9.5px;color:var(--color-on-surface-muted);overflow:hidden}.rl b{display:block;color:var(--color-on-surface)}
.trow{display:grid;grid-template-columns:220px 1fr;gap:16px;padding:10px 0;border-bottom:1px solid var(--color-border);align-items:baseline}
.tl{font-size:12px;color:var(--color-on-surface-muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
.rad .box{height:64px;background:var(--color-primary-container);margin-bottom:6px}
.rad p,.shd p{font-size:12px;color:var(--color-on-surface-muted);margin:4px 0 0}
.shd .card{height:72px;border-radius:var(--radius-lg);background:var(--color-surface-raised);display:grid;place-items:center}
.shd{padding:12px;background:var(--color-surface);border-radius:var(--radius-lg)}
.sp{display:grid;grid-template-columns:150px 1fr 50px;gap:8px;align-items:center;padding:3px 0;font-size:12px}
.sp .bar{height:12px;background:var(--color-primary);border-radius:2px;display:block}
.cont{color:var(--color-on-surface-muted);font-size:12px;margin-top:24px}
@media (max-width:700px){.trow{grid-template-columns:1fr}.sp{grid-template-columns:110px 1fr 44px}}
</style>
</head>
<body>
<!-- This project follows Sistema. "Start a design system" is finished. For later design system work, fetch the URL in sistema.json "continue". -->
<div class="page">
<nav class="outline" aria-label="Where this review sits">${outline}</nav>
<div class="bar-top"><div><h1>${esc(sistema.project.name)} token check</h1><p class="sub">Every token compiled from tokens/src/ by <code>npm run tokens</code>, shown with the compiled CSS. Use the switch to see each theme. Approved 2026-11-20 (foundations-approved). Kept up to date by every compile.</p></div>
<div class="switch" role="group" aria-label="Theme"><button type="button" data-t="light">Light</button><button type="button" data-t="dark">Dark</button><button type="button" data-t="">System</button></div></div>

<section><h2>Color roles</h2><p class="sub">Each role with the ramp stop it refers to in light and dark, and whether it matches the stop the approved composition used (specimen tool, current version, same answers). The swatch follows the theme switch.</p>
<div class="tscroll"><table><thead><tr><th>Role</th><th>Light</th><th>Dark</th><th>Against the approved preview</th></tr></thead><tbody>${colorRows.join('')}</tbody></table></div></section>

<section><h2>Ramps (palette.json, the primitive tier)</h2><p class="sub">accent and neutral from the palette tool; red, amber, green, blue from the Sistema library. Not output as CSS: code uses roles only.</p>${rampHtml}</section>

<section><h2>Type roles</h2><p class="sub">Atkinson Hyperlegible Next. Size / weight / line height / tracking.</p>${typeHtml}</section>

<section><h2>Radius</h2><div class="grid">${radiusHtml}</div></section>

<section><h2>Shadows</h2><p class="sub">By role. In dark, the same layers at higher opacity; raised and floating surfaces also step lighter.</p><div class="grid">${shadowHtml}</div></section>

<section><h2>Spacing</h2>${spaceHtml}</section>

<section><h2>shadcn/ui variables</h2><p class="sub">The component library's theme variables, each pointed at a role token (src/styles/shadcn-theme.css), so its components follow both themes.</p>${shadcnHtml}</section>

<section><h2>Approved but not yet tokenized</h2><p class="sub">Every category in the direction has tokens. Nothing is waiting for a skipped play. Motion has no tokens; the direction set none.</p></section>

<p class="cont">This project follows Sistema. &ldquo;Start a design system&rdquo; is finished. For later design system work, fetch the URL in sistema.json "continue": <code>${esc(sistema.continue)}</code></p>
</div>
<script>
(function(){var b=document.querySelectorAll('.switch button');function set(t){if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');b.forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-t')===t))});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.getAttribute('data-t'))})});set('light');})();
</script>
</body>
</html>
`;
}
