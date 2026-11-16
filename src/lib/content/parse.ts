/**
 * Pure parsers for content/ files. Shared by the app loaders and the content
 * checker (tools/validate/content), so both see exactly the same model.
 */
import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { z } from 'zod'
import { GuideFrontmatter, OpinionFrontmatter, PlayFrontmatter, RuleFile, WorkflowFrontmatter, opinionSections, type Rule } from './schema'

export interface ParseIssue {
  path: string // field path inside the file
  message: string
}

export type Parsed<T> = { ok: true; value: T } | { ok: false; issues: ParseIssue[] }

export interface Play extends PlayFrontmatter {
  body: string
  file: string
}
export interface Workflow extends WorkflowFrontmatter {
  body: string
  file: string
}
export interface Guide extends GuideFrontmatter {
  /** guide.<topic>.<name> */
  id: string
  body: string
  file: string
}
export interface Opinion extends OpinionFrontmatter {
  body: string
  file: string
}

function issues(err: z.ZodError): ParseIssue[] {
  return err.issues.map(i => ({ path: i.path.join('.') || '(root)', message: i.message }))
}

function frontmatter(text: string): { data: Record<string, unknown>; content: string } {
  // Passing an options object makes gray-matter skip its content cache, which would hand back shared objects.
  const { data, content } = matter(text, {})
  // js-yaml parses ISO dates into Date objects; schemas expect strings.
  // JSON.stringify calls Date#toJSON before the replacer runs, so read the original from `this`.
  const normalized = JSON.parse(
    JSON.stringify(data, function (this: Record<string, unknown>, k, v) {
      const original = this[k]
      return original instanceof Date ? original.toISOString().slice(0, 10) : v
    }),
  )
  return { data: normalized, content }
}

function safeFrontmatter(text: string): { ok: true; data: Record<string, unknown>; content: string } | { ok: false; issues: ParseIssue[] } {
  try {
    return { ok: true, ...frontmatter(text) }
  } catch (e) {
    return { ok: false, issues: [{ path: '(frontmatter)', message: `invalid YAML: ${(e as Error).message.split('\n')[0]}` }] }
  }
}

export function parsePlay(file: string, text: string): Parsed<Play> {
  const fm = safeFrontmatter(text)
  if (!fm.ok) return fm
  const { data, content } = fm
  const result = PlayFrontmatter.safeParse(data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  if (!content.trim()) return { ok: false, issues: [{ path: 'body', message: 'play has no procedure' }] }
  return { ok: true, value: { ...result.data, body: content.trim(), file } }
}

export function parseWorkflow(file: string, text: string): Parsed<Workflow> {
  const fm = safeFrontmatter(text)
  if (!fm.ok) return fm
  const { data, content } = fm
  const result = WorkflowFrontmatter.safeParse(data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  return { ok: true, value: { ...result.data, body: content.trim(), file } }
}

export function parseGuide(file: string, text: string): Parsed<Guide> {
  const m = file.match(/^content\/guides\/([a-z-]+)\/([a-z0-9-]+)\.md$/)
  if (!m) return { ok: false, issues: [{ path: '(file)', message: 'guides live at content/guides/<topic>/<name>.md' }] }
  const fm = safeFrontmatter(text)
  if (!fm.ok) return fm
  const result = GuideFrontmatter.safeParse(fm.data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  if (result.data.topic !== m[1]) return { ok: false, issues: [{ path: 'topic', message: `topic ${result.data.topic} doesn't match folder ${m[1]}` }] }
  if (!fm.content.trim()) return { ok: false, issues: [{ path: 'body', message: 'guide has no content' }] }
  return { ok: true, value: { ...result.data, id: `guide.${m[1]}.${m[2]}`, body: fm.content.trim(), file } }
}

export function parseOpinion(file: string, text: string): Parsed<Opinion> {
  const fm = safeFrontmatter(text)
  if (!fm.ok) return fm
  const { data, content } = fm
  const result = OpinionFrontmatter.safeParse(data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  const headings = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map(m => m[1])
  const missing = opinionSections(result.data.group).filter(h => !headings.includes(h))
  if (missing.length) return { ok: false, issues: missing.map(h => ({ path: 'body', message: `missing section "## ${h}"` })) }
  return { ok: true, value: { ...result.data, body: content.trim(), file } }
}

/** Expected file path for an opinion ID: opinion.tokens-before-components -> content/opinions/tokens-before-components.md */
export function opinionPath(id: string): string {
  return `content/opinions/${id.slice('opinion.'.length)}.md`
}

export function parseRuleFile(text: string): Parsed<Rule[]> {
  let data: unknown
  try {
    data = yaml.load(text)
  } catch (e) {
    return { ok: false, issues: [{ path: '(root)', message: `invalid YAML: ${(e as Error).message}` }] }
  }
  const result = RuleFile.safeParse(data ?? [])
  if (!result.success) return { ok: false, issues: issues(result.error) }
  return { ok: true, value: result.data }
}

/** GitHub-style heading slug, used for guide section anchors. */
export function headingSlug(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
}

/** All heading anchors in a markdown document. */
export function headingAnchors(markdown: string): Set<string> {
  const out = new Set<string>()
  for (const m of markdown.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) out.add(headingSlug(m[1]))
  return out
}

/** Expected file path for a play ID: color.scheme -> content/plays/color/scheme.md */
export function playPath(id: string): string {
  const dot = id.indexOf('.')
  return `content/plays/${id.slice(0, dot)}/${id.slice(dot + 1)}.md`
}

/** The file for a guide ref: guide.color.architecture -> content/guides/color/architecture.md */
export function guideFiles(ref: string): string[] {
  const [, topic, name] = ref.replace(/#.*$/, '').split('.')
  return [`content/guides/${topic}/${name}.md`]
}
