import { describe, expect, it } from 'vitest'
import { OUTPUT_RULES, SOURCE_RULES, rawPathToStub, runRules, type Corpus } from './rules'

const ALL = [...SOURCE_RULES, ...OUTPUT_RULES]

function corpus(partial: Partial<Corpus>): Corpus {
  return { campaignPrompts: [], kbFiles: [], builtHtml: [], ...partial }
}

function ids(c: Corpus, rule: string) {
  return runRules(ALL, c).filter(v => v.rule === rule)
}

const stub = (path: string, target: string) => ({
  path,
  text: `---\ntype: stub\npoints_to: ${target}\nupdated: 2026-05-13\n---\nstub`,
})
const versioned = (path: string, fm = 'category: principles', body = 'body') => ({ path, text: `---\n${fm}\n---\n${body}` })

describe('rawPathToStub', () => {
  it('maps principles and reference categories', () => {
    expect(rawPathToStub('principles/color/architecture')).toBe('kb/principles/color/architecture.md')
    expect(rawPathToStub('standards/design-md/spec.md')).toBe('kb/reference/standards/design-md/spec.md')
    expect(rawPathToStub('principles/color/architecture#dark-mode')).toBe('kb/principles/color/architecture.md')
  })
})

describe('ref.raw-url', () => {
  const kb = [stub('kb/principles/color/architecture.md', 'architecture@2026-05-13.md')]
  it('passes when the stub exists', () => {
    const playbooks = { path: 'p.md', text: 'Read `{{sistema_url}}/raw/principles/color/architecture`.' }
    expect(ids(corpus({ playbooks, kbFiles: kb }), 'ref.raw-url')).toHaveLength(0)
  })
  it('fails when the stub is missing, and reports the line', () => {
    const playbooks = { path: 'p.md', text: 'one\nRead {{sistema_url}}/raw/principles/color/missing.' }
    const v = ids(corpus({ playbooks, kbFiles: kb }), 'ref.raw-url')
    expect(v).toHaveLength(1)
    expect(v[0].line).toBe(2)
  })
  it('ignores the /raw/... prose example', () => {
    const playbooks = { path: 'p.md', text: 'references `{{sistema_url}}/raw/...`, fetch them' }
    expect(ids(corpus({ playbooks }), 'ref.raw-url')).toHaveLength(0)
  })
})

describe('ref.relative-url', () => {
  it('flags bare paths and allows {{sistema_url}} and absolute URLs', () => {
    const playbooks = { path: 'p.md', text: 'verified via `/api/contrast`\nPOST {{sistema_url}}/api/contrast\nhttps://x.example/raw/a' }
    const v = ids(corpus({ playbooks }), 'ref.relative-url')
    expect(v.map(x => x.line)).toEqual([1])
  })
})

describe('ref.campaign-step', () => {
  const playbooks = { path: 'p.md', text: '## alpha — Alpha\n\n## beta — Beta\n' }
  it('passes for known plays and skips fenced examples', () => {
    const campaignsIndex = { path: 'c.md', text: '```\n**Steps:** play-slug-1\n```\n**Steps:** alpha, beta\n' }
    expect(ids(corpus({ playbooks, campaignsIndex }), 'ref.campaign-step')).toHaveLength(0)
  })
  it('fails for an unknown play', () => {
    const campaignsIndex = { path: 'c.md', text: '**Steps:** alpha, gamma\n' }
    expect(ids(corpus({ playbooks, campaignsIndex }), 'ref.campaign-step')).toHaveLength(1)
  })
})

describe('ref.stub-target and ref.orphan-version', () => {
  it('passes for a stub with its versioned file', () => {
    const kbFiles = [stub('kb/principles/a/x.md', 'x@2026-05-13.md'), versioned('kb/principles/a/x@2026-05-13.md')]
    const c = corpus({ kbFiles })
    expect(ids(c, 'ref.stub-target')).toHaveLength(0)
    expect(ids(c, 'ref.orphan-version')).toHaveLength(0)
  })
  it('fails for a stub pointing nowhere and a versioned file with no stub', () => {
    const kbFiles = [stub('kb/principles/a/x.md', 'x@2026-01-01.md'), versioned('kb/principles/a/y@2026-05-13.md')]
    const c = corpus({ kbFiles })
    expect(ids(c, 'ref.stub-target')).toHaveLength(1)
    expect(ids(c, 'ref.orphan-version')).toHaveLength(1)
  })
})

describe('ref.sources', () => {
  const target = stub('kb/reference/standards/wcag/contrast.md', 'contrast@2026-05-12.md')
  it('resolves pre-migration paths and directory indexes', () => {
    const kbFiles = [
      target,
      { path: 'kb/reference/standards/wcag/_index.md', text: '# WCAG' },
      stub('kb/reference/design-systems/p/assets/tokens/colors.json', 'colors@2026-05-12.json'),
      versioned('kb/principles/a/x@2026-05-13.md', 'sources:\n  - kb/standards/wcag/contrast\n  - kb/reference/standards/wcag\n  - kb/design-systems/p/assets/tokens/colors'),
    ]
    expect(ids(corpus({ kbFiles }), 'ref.sources')).toHaveLength(0)
  })
  it('fails for a missing source', () => {
    const kbFiles = [versioned('kb/principles/a/x@2026-05-13.md', 'sources:\n  - kb/principles/nope/missing')]
    expect(ids(corpus({ kbFiles }), 'ref.sources')).toHaveLength(1)
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
    const bad = [{ path: 'a.html', text: '<pre>Read `/raw/principles/color` now</pre>' }]
    const ok = [{ path: 'b.html', text: '<a href="/raw/principles/color">x</a> https://s.example/raw/principles/color https://s.example<!-- -->/raw/design-systems/x' }]
    expect(ids(corpus({ builtHtml: bad }), 'output.relative-url')).toHaveLength(1)
    expect(ids(corpus({ builtHtml: ok }), 'output.relative-url')).toHaveLength(0)
  })
})

describe('content rules', () => {
  it('content.literal-date flags bracketed dates in templates', () => {
    const playbooks = { path: 'p.md', text: '[2026-05-13] — Generated\n[date] — fine' }
    expect(ids(corpus({ playbooks }), 'content.literal-date')).toHaveLength(1)
  })

  it('content.step-number flags mismatched substeps and number references, not forward pauses', () => {
    const text = [
      '## Step 9 — scaffold',
      '**Step 10a — Confirm:**',
      '**Step 9b — Read:**',
      'Should be recorded from Step 2.',
      '### Before proceeding to Step 11',
      'Ready to proceed to Step 10 — pages?',
    ].join('\n')
    const v = ids(corpus({ campaignPrompts: [{ path: 'b.md', text }] }), 'content.step-number')
    expect(v.map(x => x.line)).toEqual([2, 4, 5])
  })

  it('content.missing-description flags plays without a description', () => {
    const playbooks = { path: 'p.md', text: '## alpha — A\n\n## beta — B\n' }
    const playDescriptions = { path: 'd.ts', text: "  'alpha': 'Does alpha.'," }
    expect(ids(corpus({ playbooks, playDescriptions }), 'content.missing-description').map(v => v.message)).toEqual([
      'play beta has no description',
    ])
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
    const playbooks = { path: 'p.md', text: 'touch target ≥ 44×44px' }
    const kbFiles = [versioned('kb/reference/standards/wcag/c@2026-05-12.md', 'x: y', 'at least 44 x 44 CSS pixels')]
    expect(ids(corpus({ playbooks, kbFiles }), 'content.universal-threshold')).toHaveLength(1)
  })

  it('content.universal-threshold: plays may not restate values; guides may when they name the standard', () => {
    const contentFiles = [
      { path: 'content/plays/accessibility/audit.md', text: 'Focus ring meets 3:1 against WCAG surfaces.' },
      { path: 'content/plays/color/scheme.md', text: 'Check every pair with the contrast tool.' },
    ]
    const kbFiles = [
      versioned('kb/reference/x/ok@2026-05-13.md', 'title: A', 'Under WCAG 2.2 AA, normal text needs 4.5:1.'),
      versioned('kb/principles/a/bad@2026-05-13.md', 'title: B', 'Body line height must be at least 1.5.\nTouch targets should be 44px.\nText at 4.5:1.'),
    ]
    const found = ids(corpus({ kbFiles, contentFiles }), 'content.universal-threshold')
    expect(found).toHaveLength(4)
  })
})
