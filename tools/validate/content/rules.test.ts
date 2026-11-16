import { describe, expect, it } from 'vitest'
import { OUTPUT_RULES, SOURCE_RULES, rawPathToStub, runRules, type Corpus } from './rules'

const ALL = [...SOURCE_RULES, ...OUTPUT_RULES]

function corpus(partial: Partial<Corpus>): Corpus {
  return { kbFiles: [], builtHtml: [], ...partial }
}

function ids(c: Corpus, rule: string) {
  return runRules(ALL, c).filter(v => v.rule === rule)
}

const stub = (path: string, target: string) => ({
  path,
  text: `---\ntype: stub\npoints_to: ${target}\nupdated: 2026-05-13\n---\nstub`,
})
const versioned = (path: string, fm = 'category: standards', body = 'body') => ({ path, text: `---\n${fm}\n---\n${body}` })
const play = (body: string, path = 'content/plays/color/scheme.md') => ({ path, text: `---\nid: color.scheme\n---\n${body}` })
const guide = (body: string, path = 'content/guides/color/architecture.md') => ({ path, text: `---\ntitle: Color architecture\n---\n${body}` })

describe('rawPathToStub', () => {
  it('maps reference categories', () => {
    expect(rawPathToStub('standards/design-md/spec.md')).toBe('kb/reference/standards/design-md/spec.md')
    expect(rawPathToStub('standards/wcag/contrast#ratio')).toBe('kb/reference/standards/wcag/contrast.md')
  })
})

describe('ref.raw-url', () => {
  const kb = [stub('kb/reference/standards/design-md/spec.md', 'spec@2026-05-13.md')]
  const workflow = { path: 'content/workflows/start.md', text: '---\nid: workflow.start\n---\n' }
  it('passes for reference stubs and model routes', () => {
    const text = [
      'Read `{{sistema_url}}/raw/standards/design-md/spec`.',
      'Then {{sistema_url}}/raw/plays/color.scheme and {{sistema_url}}/raw/workflows/start/full.',
      'See {{sistema_url}}/raw/guides/color/architecture#dark-mode and {{sistema_url}}/raw/opinions.',
    ].join('\n')
    const c = corpus({ kbFiles: kb, contentFiles: [play(text), workflow, guide('x')] })
    expect(ids(c, 'ref.raw-url')).toHaveLength(0)
  })
  it('fails for a route that does not exist, and reports the line', () => {
    const c = corpus({ kbFiles: kb, contentFiles: [play('one\nRead {{sistema_url}}/raw/guides/color/missing.')] })
    const v = ids(c, 'ref.raw-url')
    expect(v).toHaveLength(1)
    expect(v[0].line).toBe(5)
  })
  it('ignores the /raw/... prose example', () => {
    expect(ids(corpus({ contentFiles: [play('references `{{sistema_url}}/raw/...`, fetch them')] }), 'ref.raw-url')).toHaveLength(0)
  })
})

describe('ref.relative-url', () => {
  it('flags bare paths and allows {{sistema_url}} and absolute URLs', () => {
    const v = ids(corpus({ contentFiles: [play('verified via `/api/contrast`\nPOST {{sistema_url}}/api/contrast\nhttps://x.example/raw/a')] }), 'ref.relative-url')
    expect(v.map(x => x.line)).toEqual([4])
  })
})

describe('ref.stub-target and ref.orphan-version', () => {
  it('passes for a stub with its versioned file', () => {
    const kbFiles = [stub('kb/reference/standards/a/x.md', 'x@2026-05-13.md'), versioned('kb/reference/standards/a/x@2026-05-13.md')]
    const c = corpus({ kbFiles })
    expect(ids(c, 'ref.stub-target')).toHaveLength(0)
    expect(ids(c, 'ref.orphan-version')).toHaveLength(0)
  })
  it('fails for a stub pointing nowhere and a versioned file with no stub', () => {
    const kbFiles = [stub('kb/reference/standards/a/x.md', 'x@2026-01-01.md'), versioned('kb/reference/standards/a/y@2026-05-13.md')]
    const c = corpus({ kbFiles })
    expect(ids(c, 'ref.stub-target')).toHaveLength(1)
    expect(ids(c, 'ref.orphan-version')).toHaveLength(1)
  })
})

describe('ref.sources', () => {
  const target = stub('kb/reference/standards/wcag/contrast.md', 'contrast@2026-05-12.md')
  it('resolves pre-migration paths and directory indexes, in guides too', () => {
    const kbFiles = [
      target,
      { path: 'kb/reference/standards/wcag/_index.md', text: '# WCAG' },
      stub('kb/reference/design-systems/p/assets/tokens/colors.json', 'colors@2026-05-12.json'),
    ]
    const g = { path: 'content/guides/a/x.md', text: '---\nsources:\n  - kb/standards/wcag/contrast\n  - kb/reference/standards/wcag\n  - kb/design-systems/p/assets/tokens/colors\n---\nbody' }
    expect(ids(corpus({ kbFiles, contentFiles: [g] }), 'ref.sources')).toHaveLength(0)
  })
  it('fails for a missing source', () => {
    const g = { path: 'content/guides/a/x.md', text: '---\nsources:\n  - kb/reference/nope/missing\n---\nbody' }
    expect(ids(corpus({ contentFiles: [g] }), 'ref.sources')).toHaveLength(1)
  })
})

describe('output rules', () => {
  it('flags literal placeholders in built HTML, one violation per file', () => {
    const builtHtml = [{ path: 'a.html', text: '<p>{{sistema_url}}/raw/x and {{sistema_url}}/api/y</p>' }]
    const v = ids(corpus({ builtHtml }), 'output.placeholder')
    expect(v).toHaveLength(1)
    expect(v[0].message).toMatch(/^2 /)
  })
  it('flags relative agent URLs in text but not in attributes or absolute URLs', () => {
    const bad = [{ path: 'a.html', text: '<pre>Read `/raw/guides/color` now</pre>' }]
    const ok = [{ path: 'b.html', text: '<a href="/raw/guides/color">x</a> https://s.example/raw/guides/color https://s.example<!-- -->/raw/design-systems/x' }]
    expect(ids(corpus({ builtHtml: bad }), 'output.relative-url')).toHaveLength(1)
    expect(ids(corpus({ builtHtml: ok }), 'output.relative-url')).toHaveLength(0)
  })
})

describe('output.internal-link', () => {
  it('flags links to pages the build did not produce', () => {
    const builtHtml = [
      { path: '.next/server/app/index.html', text: '<a href="/plays">x</a><a href="/playbooks/x">y</a><a href="/raw/plays/a">z</a><a href="/og.png">i</a>' },
      { path: '.next/server/app/plays.html', text: '<a href="/">home</a><a href="/plays#color">c</a>' },
    ]
    const v = ids(corpus({ builtHtml }), 'output.internal-link')
    expect(v.map(x => x.message)).toEqual(['links to missing pages: /playbooks/x'])
  })
})

describe('content rules', () => {
  it('content.literal-date flags bracketed dates in plays', () => {
    expect(ids(corpus({ contentFiles: [play('[2026-05-13] — Generated\n[date] — fine')] }), 'content.literal-date')).toHaveLength(1)
  })

  it('content.missing-title checks guides only', () => {
    const contentFiles = [
      { path: 'content/guides/a/x.md', text: '---\ntopic: a\n---\nbody' },
      { path: 'content/guides/a/y.md', text: '---\ntitle: Why\n---\nbody' },
    ]
    const kbFiles = [versioned('kb/reference/standards/w/z@2026-05-13.md')]
    expect(ids(corpus({ kbFiles, contentFiles }), 'content.missing-title')).toHaveLength(1)
  })

  it('content.universal-threshold ignores reference copies of standards', () => {
    const kbFiles = [versioned('kb/reference/standards/wcag/c@2026-05-12.md', 'x: y', 'at least 44 x 44 CSS pixels')]
    expect(ids(corpus({ kbFiles, contentFiles: [play('touch target ≥ 44×44px')] }), 'content.universal-threshold')).toHaveLength(1)
  })

  it('content.universal-threshold: plays may not restate values; guides may when they name the standard', () => {
    const contentFiles = [
      play('Focus ring meets 3:1 against WCAG surfaces.', 'content/plays/accessibility/audit.md'),
      play('Check every pair with the contrast tool.'),
      guide('Under WCAG 2.2 AA, normal text needs 4.5:1.', 'content/guides/a/ok.md'),
      guide('Body line height must be at least 1.5.\nTouch targets should be 44px.\nText at 4.5:1.', 'content/guides/a/bad.md'),
    ]
    expect(ids(corpus({ contentFiles }), 'content.universal-threshold')).toHaveLength(4)
  })
  it('content.stale-path flags kb/principles paths in content', () => {
    expect(ids(corpus({ contentFiles: [guide('See `kb/principles/color/architecture`.')] }), 'content.stale-path')).toHaveLength(1)
    expect(ids(corpus({ contentFiles: [guide('See the Color architecture guide.')] }), 'content.stale-path')).toHaveLength(0)
  })
})
