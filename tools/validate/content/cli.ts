/**
 * Content integrity check.
 *
 *   npm run check:content                 source rules, report only
 *   npm run check:content -- --output     also scan built pages (.next)
 *   npm run check:content -- --strict     exit 1 on any code-level violation
 *   npm run check:content -- --strict-all exit 1 on any violation (V1)
 *   npm run check:content -- --json       machine-readable summary
 *
 * prebuild runs source rules; postbuild runs output rules. See ROADMAP V0.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { OUTPUT_RULES, SOURCE_RULES, runRules, type Corpus, type SourceFile, type Violation } from './rules'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..', '..')

function read(rel: string): SourceFile | undefined {
  const abs = path.join(ROOT, rel)
  return fs.existsSync(abs) ? { path: rel, text: fs.readFileSync(abs, 'utf-8') } : undefined
}

function walk(relDir: string, filter: (p: string) => boolean): SourceFile[] {
  const absDir = path.join(ROOT, relDir)
  if (!fs.existsSync(absDir)) return []
  const out: SourceFile[] = []
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const rel = `${relDir}/${entry.name}`
    if (entry.isDirectory()) out.push(...walk(rel, filter))
    else if (filter(rel)) out.push({ path: rel, text: fs.readFileSync(path.join(ROOT, rel), 'utf-8') })
  }
  return out
}

export function loadCorpus(includeOutput: boolean): Corpus {
  return {
    playbooks: read('_meta/TASK_PLAYBOOKS.md'),
    campaignsIndex: read('_meta/CAMPAIGNS.md'),
    campaignPrompts: walk('_meta/campaigns', p => p.endsWith('.md')),
    kbFiles: walk('kb', p => /\.(md|json)$/.test(p)),
    playDescriptions: read('src/lib/playbooks.ts'),
    builtHtml: includeOutput ? walk('.next/server/app', p => p.endsWith('.html')) : [],
  }
}

function main() {
  const args = new Set(process.argv.slice(2))
  const includeOutput = args.has('--output')
  const outputOnly = args.has('--output-only')
  const corpus = loadCorpus(includeOutput || outputOnly)

  if ((includeOutput || outputOnly) && corpus.builtHtml.length === 0) {
    console.error('check:content: --output needs a build (.next/server/app has no HTML). Run `next build` first.')
    process.exit(1)
  }

  const rules = outputOnly ? OUTPUT_RULES : includeOutput ? [...SOURCE_RULES, ...OUTPUT_RULES] : SOURCE_RULES
  const violations = runRules(rules, corpus)

  const byRule = new Map<string, Violation[]>()
  for (const v of violations) byRule.set(v.rule, [...(byRule.get(v.rule) ?? []), v])

  if (args.has('--json')) {
    const summary = Object.fromEntries(rules.map(r => [r.id, { level: r.level, count: byRule.get(r.id)?.length ?? 0 }]))
    console.log(JSON.stringify({ total: violations.length, rules: summary, violations }, null, 2))
  } else {
    for (const r of rules) {
      const list = byRule.get(r.id) ?? []
      const mark = list.length === 0 ? 'ok  ' : r.level === 'code' ? 'FAIL' : 'warn'
      console.log(`${mark} ${r.id} (${r.level}) — ${list.length}`)
      // In --strict builds, content-level rules are summarized, not listed.
      if (args.has('--strict') && r.level === 'content') continue
      for (const v of list.slice(0, 50)) console.log(`       ${v.file}:${v.line}  ${v.message}`)
      if (list.length > 50) console.log(`       … ${list.length - 50} more`)
    }
    const code = violations.filter(v => v.level === 'code').length
    console.log(`\n${violations.length} violation(s): ${code} code-level, ${violations.length - code} content-level`)
  }

  const codeCount = violations.filter(v => v.level === 'code').length
  if (args.has('--strict-all') && violations.length > 0) process.exit(1)
  if (args.has('--strict') && codeCount > 0) process.exit(1)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
