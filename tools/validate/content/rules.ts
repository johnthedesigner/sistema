/**
 * Content integrity rules (v2 plan Section 13, layer 1).
 *
 * Every rule is a pure function over a Corpus, so tests can build small
 * in-memory corpora. Rules are grouped by level:
 *   - code:    broken references and unresolved output. Blocking from V0.6.
 *   - content: problems in the wording of plays and guides. Blocking from
 *              V1.14 (prebuild runs --strict-all).
 */

export type Level = 'code' | 'content'

export interface SourceFile {
  path: string // repo-relative, forward slashes
  text: string
}

export interface Corpus {
  kbFiles: SourceFile[] // kb/**/* (md and json): reference material
  builtHtml: SourceFile[] // .next/server/app/**/*.html (output mode only)
  contentFiles?: SourceFile[] // content/** (v2 content model)
}

export interface Violation {
  rule: string
  level: Level
  file: string
  line: number
  message: string
}

export interface Rule {
  id: string
  level: Level
  description: string
  check: (corpus: Corpus) => Omit<Violation, 'rule' | 'level'>[]
}

// ─── helpers ────────────────────────────────────────────────────────────────

export function lineOf(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++
  return line
}

function* matches(text: string, re: RegExp): Generator<RegExpExecArray> {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  let m: RegExpExecArray | null
  while ((m = g.exec(text)) !== null) {
    yield m
    if (m[0].length === 0) g.lastIndex++
  }
}

/** Ranges of fenced code blocks, so format examples can be skipped. */
function fencedRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  let open = -1
  for (const m of matches(text, /^```/m)) {
    if (open < 0) open = m.index
    else {
      ranges.push([open, m.index])
      open = -1
    }
  }
  return ranges
}

function inRanges(index: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([a, b]) => index >= a && index <= b)
}

function frontmatter(text: string): string | null {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  return m ? m[1] : null
}

/** Guides moved to content/guides in V1.12. Their legacy kb/principles paths still resolve (served by kb.ts). */
function guideFilesOf(corpus: Corpus): SourceFile[] {
  return (corpus.contentFiles ?? []).filter(f => /^content\/guides\/[^/]+\/[^/]+\.md$/.test(f.path))
}

function kbPathSet(corpus: Corpus): Set<string> {
  return new Set(corpus.kbFiles.map(f => f.path))
}

/** Map a /raw/<category>/<...> reference URL path to the stub file it should resolve to. */
export function rawPathToStub(rawPath: string): string {
  const clean = rawPath.replace(/#.*$/, '').replace(/\.md$/, '').replace(/\/$/, '')
  const [category, ...rest] = clean.split('/')
  return `kb/reference/${category}/${rest.join('/')}.md`
}

/** Model-backed /raw routes (V1.13): plays, workflows, guides, opinions, rules, agents, schema. */
function modelRawPaths(corpus: Corpus): Set<string> {
  const out = new Set(['opinions', 'rules', 'agents', 'schema/sistema.json'])
  for (const f of corpus.contentFiles ?? []) {
    const play = f.path.match(/^content\/plays\/[^/]+\/[^/]+\.md$/) && f.text.match(/^id:\s*(\S+)/m)
    if (play) out.add(`plays/${play[1]}`)
    const wf = f.path.match(/^content\/workflows\/([^/]+)\.md$/)
    if (wf) out.add(`workflows/${wf[1]}`).add(`workflows/${wf[1]}/full`)
    const guide = f.path.match(/^content\/guides\/([^/]+)\/([^/]+)\.md$/)
    if (guide) out.add(`guides/${guide[1]}/${guide[2]}`)
  }
  return out
}

/** Resolve a KB path from `sources` frontmatter (pre- or post-migration form). */
function kbSourceCandidates(kbPath: string): string[] {
  let p = kbPath.replace(/\.md$/, '').replace(/\/$/, '')
  for (const cat of ['design-systems', 'standards', 'foundations', 'skills']) {
    if (p.startsWith(`kb/${cat}/`)) p = p.replace(`kb/${cat}/`, `kb/reference/${cat}/`)
  }
  return [`${p}.md`, `${p}.json`, `${p}/_index.md`]
}

function agentTextFiles(corpus: Corpus): SourceFile[] {
  const files: SourceFile[] = []
  files.push(...corpus.kbFiles.filter(f => /@\d{4}-\d{2}-\d{2}\.md$/.test(f.path)))
  files.push(...(corpus.contentFiles ?? []).filter(f => f.path.endsWith('.md')))
  return files
}

/** Plays, workflows, guides, and opinions (not reference copies of external sources). */
function sistemaAuthoredFiles(corpus: Corpus): SourceFile[] {
  return agentTextFiles(corpus).filter(f => !f.path.startsWith('kb/reference/'))
}

// ─── code-level rules ───────────────────────────────────────────────────────

const rawUrlResolves: Rule = {
  id: 'ref.raw-url',
  level: 'code',
  description: 'Every {{sistema_url}}/raw/... URL in agent-facing text resolves to a route the site serves.',
  check(corpus) {
    const known = kbPathSet(corpus)
    const model = modelRawPaths(corpus)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of agentTextFiles(corpus)) {
      for (const m of matches(f.text, /\{\{sistema_url\}\}\/raw\/([A-Za-z0-9/_.#-]+)/)) {
        if (m[1].includes('...')) continue // prose example like /raw/...
        const raw = m[1].replace(/[.,;:]+$/, '')
        if (model.has(raw.replace(/#.*$/, '').replace(/\/$/, ''))) continue
        const stub = rawPathToStub(raw)
        if (!known.has(stub)) {
          out.push({ file: f.path, line: lineOf(f.text, m.index), message: `/raw/${raw} does not resolve (expected ${stub})` })
        }
      }
    }
    return out
  },
}

const sourceRelativeUrl: Rule = {
  id: 'ref.relative-url',
  level: 'code',
  description: 'Agent-facing text writes Sistema URLs as {{sistema_url}}/..., never as bare /raw/, /bundle/, or /api/ paths.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of sistemaAuthoredFiles(corpus)) {
      for (const m of matches(f.text, /(?<![\w}.\/-])\/(?:raw|bundle|api)\/[a-z]/)) {
        out.push({ file: f.path, line: lineOf(f.text, m.index), message: 'bare relative Sistema URL; use {{sistema_url}}/...' })
      }
    }
    return out
  },
}


const stubTargetsExist: Rule = {
  id: 'ref.stub-target',
  level: 'code',
  description: 'Every stub points_to a file that exists.',
  check(corpus) {
    const known = kbPathSet(corpus)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.kbFiles) {
      const fm = frontmatter(f.text)
      if (!fm || !/^type:\s*stub\s*$/m.test(fm)) continue
      const target = fm.match(/^points_to:\s*(\S+)/m)?.[1]
      if (!target) {
        out.push({ file: f.path, line: 1, message: 'stub has no points_to' })
        continue
      }
      const dir = f.path.slice(0, f.path.lastIndexOf('/'))
      if (!known.has(`${dir}/${target}`)) out.push({ file: f.path, line: 1, message: `points_to ${target} does not exist` })
    }
    return out
  },
}

const versionedFilesHaveStubs: Rule = {
  id: 'ref.orphan-version',
  level: 'code',
  description: 'Every versioned file (name@date.ext) has a stub at name.ext.',
  check(corpus) {
    const known = kbPathSet(corpus)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.kbFiles) {
      const m = f.path.match(/^(.*)@\d{4}-\d{2}-\d{2}(\.\w+)$/)
      if (m && !known.has(`${m[1]}${m[2]}`)) out.push({ file: f.path, line: 1, message: `no stub at ${m[1]}${m[2]}` })
    }
    return out
  },
}

const sourcesResolve: Rule = {
  id: 'ref.sources',
  level: 'code',
  description: 'Every KB path in `sources` frontmatter resolves.',
  check(corpus) {
    const known = kbPathSet(corpus)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of [...corpus.kbFiles, ...guideFilesOf(corpus)]) {
      const fm = frontmatter(f.text)
      if (!fm) continue
      for (const m of matches(fm, /^\s+-\s+(kb\/\S+)\s*$/m)) {
        if (!kbSourceCandidates(m[1]).some(c => known.has(c))) {
          out.push({ file: f.path, line: lineOf(fm, m.index) + 1, message: `source ${m[1]} does not resolve` })
        }
      }
    }
    return out
  },
}

// raw.placeholder was retired in V0.3: /raw and /bundle now resolve {{sistema_url}}
// server-side, and src/app/raw/raw-and-bundle.test.ts checks the real handlers.

const outputPlaceholder: Rule = {
  id: 'output.placeholder',
  level: 'code',
  description: 'Built pages contain no literal {{sistema_url}}.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.builtHtml) {
      const all = [...matches(f.text, /\{\{sistema_url\}\}/)]
      if (all.length) out.push({ file: f.path, line: lineOf(f.text, all[0].index), message: `${all.length} literal {{sistema_url}} occurrence(s)` })
    }
    return out
  },
}

const outputRelativeUrl: Rule = {
  id: 'output.relative-url',
  level: 'code',
  description: 'Built pages contain no relative /raw/, /bundle/, or /api/ URLs in text (attribute links are fine).',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.builtHtml) {
      // (?<!-->) skips React's <!-- --> text split inside an absolute URL.
      const all = [...matches(f.text, /(?<=[\s(`>*])(?<!-->)\/(?:raw|bundle|api)\/[a-z]/)]
      if (all.length) out.push({ file: f.path, line: lineOf(f.text, all[0].index), message: `${all.length} relative agent URL(s)` })
    }
    return out
  },
}

/** Site path of a built page: .next/server/app/a/b.html -> /a/b, index.html -> / */
function builtPagePath(file: string): string | null {
  const m = file.match(/(?:^|\/)server\/app\/(.+)\.html$/)
  if (!m) return null
  return m[1] === 'index' ? '/' : `/${m[1]}`
}

const outputInternalLinks: Rule = {
  id: 'output.internal-link',
  level: 'code',
  description: 'Every internal link (href="/...") in a built page points at a page the build produced.',
  check(corpus) {
    const pages = new Set(corpus.builtHtml.map(f => builtPagePath(f.path)).filter((p): p is string => p !== null))
    if (pages.size === 0) return []
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.builtHtml) {
      const page = builtPagePath(f.path)
      if (!page) continue
      // Reference material pages (/kb) have known broken source links and are removed in V1.16.
      if (page.startsWith('/kb/')) continue
      const broken = new Set<string>()
      for (const m of matches(f.text, /href="(\/[^"#?]*)/)) {
        const href = m[1].replace(/\/$/, '') || '/'
        if (/^\/(?:_next|api|raw)\//.test(href) || /\.(?:png|svg|ico|jpe?g|json|txt|xml|webmanifest|woff2?|css|js)$/.test(href)) continue
        if (!pages.has(href)) broken.add(href)
      }
      if (broken.size) out.push({ file: f.path, line: 1, message: `links to missing pages: ${[...broken].join(', ')}` })
    }
    return out
  },
}

// ─── content-level rules ────────────────────────────────────────────────────

const literalDates: Rule = {
  id: 'content.literal-date',
  level: 'content',
  description: 'Prompt templates contain no literal dates; they tell the agent to use today\'s date.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    const files = (corpus.contentFiles ?? []).filter(f => f.path.endsWith('.md'))
    for (const f of files) {
      for (const m of matches(f.text, /\[20\d{2}-\d{2}-\d{2}\]/)) {
        out.push({ file: f.path, line: lineOf(f.text, m.index), message: `literal date ${m[0]} in a template` })
      }
    }
    return out
  },
}



const missingTitles: Rule = {
  id: 'content.missing-title',
  level: 'content',
  description: 'Every guide (content/guides) has a human-written title, not one derived from its file name.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of guideFilesOf(corpus)) {
      const fm = frontmatter(f.text)
      if (!fm || !/^title:\s*\S/m.test(fm)) out.push({ file: f.path, line: 1, message: 'no title in frontmatter' })
    }
    return out
  },
}

const stalePrinciplesPath: Rule = {
  id: 'content.stale-path',
  level: 'content',
  description: 'Sistema content never names kb/principles paths; guides moved to content/guides in V1.12. Name the guide instead.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of (corpus.contentFiles ?? []).filter(f => f.path.endsWith('.md'))) {
      for (const m of matches(f.text, /kb\/principles\//)) {
        out.push({ file: f.path, line: lineOf(f.text, m.index), message: 'names a kb/principles path; name the guide instead' })
      }
    }
    return out
  },
}

/**
 * Known rule values that tend to get restated in prose. Each comes from a
 * registry rule (content/rules/), which is where the value belongs.
 */
export const RESTATED_VALUES: Array<{ re: RegExp; what: string; rule: string }> = [
  { re: /\b(?:3|4\.5|7)(?:\.0)?:1\b/, what: 'a contrast ratio', rule: 'color.contrast.*' },
  { re: /\b(?:24|44|48)\s*[×x]\s*(?:24|44|48)\b/, what: 'a target size', rule: 'accessibility.target-size' },
  { re: /\b(?:target|touch|tap|hit area)[^.\n]{0,40}\b(?:24|44|48)\s?(?:px|pt|dp)\b/i, what: 'a target size', rule: 'accessibility.target-size' },
  { re: /\bline[- ]height[^.\n]{0,40}(?:at least|minimum|≥|>=)\s*1\.5\b/i, what: 'a line-height minimum', rule: 'typography.line-height.body' },
  { re: /\b(?:body|text)[^.\n]{0,30}(?:at least|minimum|≥|>=)\s*16\s?px\b/i, what: 'a text size minimum', rule: '(none: guidance only)' },
]

/** A line that names the standard a value comes from is a citation, not a restated rule. */
const NAMES_A_STANDARD = /\b(?:WCAG|APCA|Section 508|EN 301 549|ISO|Apple HIG|Human Interface Guidelines|Material Design)\b/

const universalThresholds: Rule = {
  id: 'content.universal-threshold',
  level: 'content',
  description:
    'Rule values (contrast ratios, target sizes, line-height and text-size minimums) are not restated in prose. Plays cite the rule; guides may quote a value only on a line that names its standard.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of sistemaAuthoredFiles(corpus)) {
      const isPlay = /^content\/(?:plays|workflows)\//.test(f.path)
      const lines = f.text.split('\n')
      lines.forEach((line, i) => {
        if (!isPlay && NAMES_A_STANDARD.test(line)) return
        for (const v of RESTATED_VALUES) {
          if (v.re.test(line)) {
            out.push({ file: f.path, line: i + 1, message: `restates ${v.what}; cite ${v.rule} instead${isPlay ? '' : ', or name the standard on this line'}` })
            break
          }
        }
      })
    }
    return out
  },
}

export const SOURCE_RULES: Rule[] = [
  rawUrlResolves,
  sourceRelativeUrl,
  stubTargetsExist,
  versionedFilesHaveStubs,
  sourcesResolve,
  literalDates,
  missingTitles,
  universalThresholds,
  stalePrinciplesPath,
]

export const OUTPUT_RULES: Rule[] = [outputPlaceholder, outputRelativeUrl, outputInternalLinks]

export function runRules(rules: Rule[], corpus: Corpus): Violation[] {
  return rules.flatMap(r => r.check(corpus).map(v => ({ ...v, rule: r.id, level: r.level })))
}
