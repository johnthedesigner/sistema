import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentFile, ContentFrontmatter, StubFrontmatter, SystemIndex } from './types'

const KB_ROOT = process.cwd()
const KB_BASE = path.join(KB_ROOT, 'kb')

const REFERENCE_CATEGORIES = ['design-systems', 'standards', 'foundations', 'skills'] as const
const REFERENCE_CATEGORY_SET = new Set(REFERENCE_CATEGORIES as readonly string[])

export const KB_CATEGORIES = [...REFERENCE_CATEGORIES, 'principles'] as const
export type KBCategory = typeof KB_CATEGORIES[number]

function getCategoryDir(category: KBCategory): string {
  if (REFERENCE_CATEGORY_SET.has(category)) return path.join('reference', category)
  return category
}

function resolveKBPath(kbPath: string): string {
  for (const cat of REFERENCE_CATEGORIES) {
    if (kbPath.startsWith(`kb/${cat}/`) || kbPath === `kb/${cat}`) {
      return kbPath.replace(`kb/${cat}`, `kb/reference/${cat}`)
    }
  }
  return kbPath
}

/**
 * Returns slugs for all entries in a KB category.
 * A valid entry directory contains an _index.md file.
 */
export function listSystems(category: KBCategory = 'design-systems'): string[] {
  const categoryDir = path.join(KB_BASE, getCategoryDir(category))
  if (!fs.existsSync(categoryDir)) return []
  const entries = fs.readdirSync(categoryDir, { withFileTypes: true })
  return entries
    .filter(e => {
      if (!e.isDirectory()) return false
      if (e.name.startsWith('_') || e.name.startsWith('.')) return false
      const indexPath = path.join(KB_BASE, getCategoryDir(category), e.name, '_index.md')
      return fs.existsSync(indexPath)
    })
    .map(e => e.name)
    .sort()
}

/**
 * Reads and returns the raw markdown body of a system's _index.md.
 */
export function readSystemIndex(slug: string, category: KBCategory = 'design-systems'): SystemIndex {
  const indexPath = path.join(KB_BASE, getCategoryDir(category), slug, '_index.md')
  if (!fs.existsSync(indexPath)) {
    throw new Error(`System index not found: ${category}/${slug}/_index.md`)
  }
  const body = fs.readFileSync(indexPath, 'utf-8')
  return { body, slug }
}

/**
 * Reads a stub file and returns the path to its versioned target.
 * stubPath is relative to KB_ROOT without extension,
 * e.g. "kb/design-systems/material/guidance/foundations/color-system"
 */
function readStubTarget(stubPath: string): string {
  const resolvedPath = resolveKBPath(stubPath)
  const mdPath = path.join(KB_ROOT, `${resolvedPath}.md`)
  const jsonPath = path.join(KB_ROOT, `${resolvedPath}.json`)
  const stubFilePath = fs.existsSync(mdPath) ? mdPath
    : fs.existsSync(jsonPath) ? jsonPath
    : null

  if (!stubFilePath) {
    throw new Error(`Stub not found: ${resolvedPath} (tried .md and .json)`)
  }
  const raw = fs.readFileSync(stubFilePath, 'utf-8')
  const { data } = matter(raw)
  const stub = data as StubFrontmatter
  if (stub.type !== 'stub' || !stub.points_to) {
    throw new Error(`Not a valid stub file: ${stubFilePath}`)
  }
  const stubDir = path.dirname(stubFilePath)
  return path.join(stubDir, stub.points_to)
}

/**
 * Follows a stub to its versioned file and returns parsed frontmatter + body.
 * stubPath is relative to KB_ROOT without the .md extension,
 * e.g. "kb/design-systems/material/guidance/foundations/color-system"
 */
export function resolveStub(stubPath: string): ContentFile {
  const versionedPath = readStubTarget(stubPath)
  if (!fs.existsSync(versionedPath)) {
    throw new Error(`Versioned file not found: ${versionedPath} (from stub ${stubPath})`)
  }

  if (versionedPath.endsWith('.json')) {
    const raw = fs.readFileSync(versionedPath, 'utf-8')
    const json = JSON.parse(raw)
    const { _meta, ...rest } = json
    return {
      frontmatter: _meta as ContentFrontmatter,
      body: JSON.stringify(rest, null, 2),
      filePath: versionedPath,
      stubPath,
      isJson: true,
    }
  }

  const raw = fs.readFileSync(versionedPath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    frontmatter: data as ContentFrontmatter,
    body: content,
    filePath: versionedPath,
    stubPath,
    isJson: false,
  }
}

/**
 * Returns all stub paths for a given system as arrays of path segments.
 * Used to generate static params for the content page catch-all route.
 * Example: ['guidance', 'foundations', 'color-system']
 */
export function listStubsForSystem(slug: string, category: KBCategory = 'design-systems'): string[][] {
  const systemDir = path.join(KB_BASE, getCategoryDir(category), slug)
  if (!fs.existsSync(systemDir)) {
    throw new Error(`System directory not found: ${category}/${slug}`)
  }

  const stubs: string[][] = []

  function walk(dir: string, relParts: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...relParts, entry.name])
      } else if (
        !entry.name.includes('@') &&
        entry.name !== '_index.md' &&
        (entry.name.endsWith('.md') || entry.name.endsWith('.json'))
      ) {
        stubs.push([...relParts, entry.name.replace(/\.(md|json)$/, '')])
      }
    }
  }

  walk(systemDir, [])
  return stubs
}

/**
 * Returns the raw URL path for a system's DESIGN.md, or null if none exists.
 * e.g. "/raw/design-systems/material/design-md/DESIGN.md"
 */
export function findDesignMd(slug: string, category: KBCategory = 'design-systems'): string | null {
  const stubPath = path.join(KB_BASE, getCategoryDir(category), slug, 'design-md', 'DESIGN.md')
  return fs.existsSync(stubPath) ? `/raw/${category}/${slug}/design-md/DESIGN.md` : null
}

/**
 * Reads the raw content of a versioned KB file by stub path.
 * Used by the raw markdown endpoint to serve text/plain responses.
 * Returns null if the stub cannot be resolved.
 */
export function readRawContent(stubPath: string): string | null {
  try {
    const versionedPath = readStubTarget(stubPath)
    if (!fs.existsSync(versionedPath)) return null
    return fs.readFileSync(versionedPath, 'utf-8')
  } catch {
    return null
  }
}
