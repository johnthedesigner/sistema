import { chromium } from 'playwright'
const [dir, ...names] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
for (const n of names) { await p.goto(`file://${dir}/${n}.html`); await p.waitForTimeout(1300); await p.screenshot({ path: `${dir}/${n}.png`, fullPage: true }) }
await b.close()
