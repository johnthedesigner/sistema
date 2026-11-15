/**
 * Content integrity rules (v2 plan Section 13, layer 1).
 *
 * Every rule is a pure function over a Corpus, so tests can build small
 * in-memory corpora. Rules are grouped by level:
 *   - code:    broken references and unresolved output. Blocking from V0.6.
 *   - content: problems in v1 play/campaign text. Report-only until V1
 *              moves that content into the new model.
 */

export type Level = 'code' | 'content'

export interface SourceFile {
  path: string // repo-relative, forward slashes
  text: string
}

export interface Corpus {
  playbooks?: SourceFile // _meta/TASK_PLAYBOOKS.md
  campaignsIndex?: SourceFile // _meta/CAMPAIGNS.md
  campaignPrompts: SourceFile[] // _meta/campaigns/*.md
  kbFiles: SourceFile[] // kb/**/* (md and json)
  playDescriptions?: SourceFile // src/lib/playbooks.ts
  builtHtml: SourceFile[] // .next/server/app/**/*.html (output mode only)
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

function kbPathSet(corpus: Corpus): Set<string> {
  return new Set(corpus.kbFiles.map(f => f.path))
}

/** Map a /raw/<category>/<...> URL path to the stub file it should resolve to. */
export function rawPathToStub(rawPath: string): string {
  const clean = rawPath.replace(/#.*$/, '').replace(/\.md$/, '').replace(/\/$/, '')
  const [category, ...rest] = clean.split('/')
  const base = category === 'principles' ? `kb/principles` : `kb/reference/${category}`
  return `${base}/${rest.join('/')}.md`
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
  if (corpus.playbooks) files.push(corpus.playbooks)
  files.push(...corpus.campaignPrompts)
  files.push(...corpus.kbFiles.filter(f => /@\d{4}-\d{2}-\d{2}\.md$/.test(f.path)))
  return files
}

/** Plays, campaign prompts, and public guides (not reference copies of external sources). */
function sistemaAuthoredFiles(corpus: Corpus): SourceFile[] {
  return agentTextFiles(corpus).filter(f => !f.path.startsWith('kb/reference/'))
}

function playSlugs(corpus: Corpus): string[] {
  if (!corpus.playbooks) return []
  return [...matches(corpus.playbooks.text, /^## ([\w-]+) — /m)].map(m => m[1])
}

// ─── code-level rules ───────────────────────────────────────────────────────

const rawUrlResolves: Rule = {
  id: 'ref.raw-url',
  level: 'code',
  description: 'Every {{sistema_url}}/raw/... URL in agent-facing text resolves to a KB stub.',
  check(corpus) {
    const known = kbPathSet(corpus)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of agentTextFiles(corpus)) {
      for (const m of matches(f.text, /\{\{sistema_url\}\}\/raw\/([A-Za-z0-9/_.#-]+)/)) {
        if (m[1].includes('...')) continue // prose example like /raw/...
        const raw = m[1].replace(/[.,;:]+$/, '')
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

const campaignStepsExist: Rule = {
  id: 'ref.campaign-step',
  level: 'code',
  description: 'Every play slug listed in a campaign exists. (The loader drops unknown slugs silently.)',
  check(corpus) {
    const f = corpus.campaignsIndex
    if (!f) return []
    const slugs = new Set(playSlugs(corpus))
    const fences = fencedRanges(f.text)
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const m of matches(f.text, /^\*\*Steps:\*\*\s*(.+)$/m)) {
      if (inRanges(m.index, fences)) continue
      for (const slug of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
        if (!slugs.has(slug)) out.push({ file: f.path, line: lineOf(f.text, m.index), message: `campaign step "${slug}" is not a play` })
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
    for (const f of corpus.kbFiles) {
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

// ─── content-level rules ────────────────────────────────────────────────────

const literalDates: Rule = {
  id: 'content.literal-date',
  level: 'content',
  description: 'Prompt templates contain no literal dates; they tell the agent to use today\'s date.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    const files = [...(corpus.playbooks ? [corpus.playbooks] : []), ...corpus.campaignPrompts]
    for (const f of files) {
      for (const m of matches(f.text, /\[20\d{2}-\d{2}-\d{2}\]/)) {
        out.push({ file: f.path, line: lineOf(f.text, m.index), message: `literal date ${m[0]} in a template` })
      }
    }
    return out
  },
}

const stepNumbers: Rule = {
  id: 'content.step-number',
  level: 'content',
  description: 'Campaign substeps match their step, and steps refer to other steps by name, not number.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.campaignPrompts) {
      let current: number | null = null
      const lines = f.text.split('\n')
      lines.forEach((text, i) => {
        const heading = text.match(/^## Step (\d+)\b/)
        if (heading) {
          current = Number(heading[1])
          return
        }
        if (current === null) return
        const sub = text.match(/^\*\*Step (\d+)([a-z])\b/)
        if (sub && Number(sub[1]) !== current) {
          out.push({ file: f.path, line: i + 1, message: `substep ${sub[1]}${sub[2]} sits under Step ${current}` })
          return
        }
        const before = text.match(/Before proceeding to Step (\d+)/)
        if (before && Number(before[1]) !== current + 1) {
          out.push({ file: f.path, line: i + 1, message: `"Before proceeding to Step ${before[1]}" sits under Step ${current}` })
          return
        }
        const next = current + 1
        for (const m of text.matchAll(/\b(in|from|to|of|by) Step (\d+)\b/g)) {
          const n = Number(m[2])
          // "proceed to Step N+1" in a pause prompt points forward on purpose.
          const forwardPause = n === next && /proceed(?:ing)? to Step/.test(text.slice(Math.max(0, (m.index ?? 0) - 12), (m.index ?? 0) + m[0].length))
          if (n !== current && !forwardPause) out.push({ file: f.path, line: i + 1, message: `refers to Step ${n} by number` })
        }
      })
    }
    return out
  },
}

const missingDescriptions: Rule = {
  id: 'content.missing-description',
  level: 'content',
  description: 'Every play has a description (today: an entry in PLAY_DESCRIPTIONS).',
  check(corpus) {
    const src = corpus.playDescriptions
    if (!src || !corpus.playbooks) return []
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const m of matches(corpus.playbooks.text, /^## ([\w-]+) — /m)) {
      if (!src.text.includes(`'${m[1]}':`)) {
        out.push({ file: corpus.playbooks.path, line: lineOf(corpus.playbooks.text, m.index), message: `play ${m[1]} has no description` })
      }
    }
    return out
  },
}

const missingTitles: Rule = {
  id: 'content.missing-title',
  level: 'content',
  description: 'Every public guide (kb/principles) has a human-written title, not one derived from its file name.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of corpus.kbFiles) {
      if (!f.path.startsWith('kb/principles/') || !/@\d{4}-\d{2}-\d{2}\.md$/.test(f.path)) continue
      const fm = frontmatter(f.text)
      if (!fm || !/^title:\s*\S/m.test(fm)) out.push({ file: f.path, line: 1, message: 'no title in frontmatter' })
    }
    return out
  },
}

const universalThresholds: Rule = {
  id: 'content.universal-threshold',
  level: 'content',
  description: 'No universal 44x44 touch target requirement; requirements come from the project\'s chosen standard.',
  check(corpus) {
    const out: Omit<Violation, 'rule' | 'level'>[] = []
    for (const f of sistemaAuthoredFiles(corpus)) {
      for (const m of matches(f.text, /44\s*[×x]\s*44/)) {
        out.push({ file: f.path, line: lineOf(f.text, m.index), message: 'hardcoded 44x44 touch target' })
      }
    }
    return out
  },
}

export const SOURCE_RULES: Rule[] = [
  rawUrlResolves,
  sourceRelativeUrl,
  campaignStepsExist,
  stubTargetsExist,
  versionedFilesHaveStubs,
  sourcesResolve,
  literalDates,
  stepNumbers,
  missingDescriptions,
  missingTitles,
  universalThresholds,
]

export const OUTPUT_RULES: Rule[] = [outputPlaceholder, outputRelativeUrl]

export function runRules(rules: Rule[], corpus: Corpus): Violation[] {
  return rules.flatMap(r => r.check(corpus).map(v => ({ ...v, rule: r.id, level: r.level })))
}
