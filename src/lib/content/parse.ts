/**
 * Pure parsers for content/ files. Shared by the app loaders and the content
 * checker (tools/validate/content), so both see exactly the same model.
 */
import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { z } from 'zod'
import { PlayFrontmatter, RuleFile, WorkflowFrontmatter, type Rule } from './schema'

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

export function parsePlay(file: string, text: string): Parsed<Play> {
  const { data, content } = frontmatter(text)
  const result = PlayFrontmatter.safeParse(data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  if (!content.trim()) return { ok: false, issues: [{ path: 'body', message: 'play has no procedure' }] }
  return { ok: true, value: { ...result.data, body: content.trim(), file } }
}

export function parseWorkflow(file: string, text: string): Parsed<Workflow> {
  const { data, content } = frontmatter(text)
  const result = WorkflowFrontmatter.safeParse(data)
  if (!result.success) return { ok: false, issues: issues(result.error) }
  return { ok: true, value: { ...result.data, body: content.trim(), file } }
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

/** Expected file for a guide ref during V1 (before V1.12 moves guides into content/guides). */
export function guideFiles(ref: string): string[] {
  const [, topic, name] = ref.replace(/#.*$/, '').split('.')
  return [`content/guides/${topic}/${name}.md`, `kb/principles/${topic}/${name}.md`]
}
