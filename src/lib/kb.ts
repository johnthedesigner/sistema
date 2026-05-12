import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentFile, ContentFrontmatter, StubFrontmatter, SystemIndex } from './types'

const KB_ROOT = process.cwd()

/**
 * Returns slugs for all design systems in the KB.
 * A valid system directory contains an _index.md file.
 */
export function listSystems(): string[] {
  const entries = fs.readdirSync(KB_ROOT, { withFileTypes: true })
  return entries
    .filter(e => {
      if (!e.isDirectory()) return false
      if (e.name.startsWith('_') || e.name.startsWith('.')) return false
      const indexPath = path.join(KB_ROOT, e.name, '_index.md')
      return fs.existsSync(indexPath)
    })
    .map(e => e.name)
    .sort()
}

/**
 * Reads and returns the raw markdown body of a system's _index.md.
 * The _index.md files are plain markdown with no YAML frontmatter.
 */
export function readSystemIndex(slug: string): SystemIndex {
  const indexPath = path.join(KB_ROOT, slug, '_index.md')
  if (!fs.existsSync(indexPath)) {
    throw new Error(`System index not found: ${slug}/_index.md`)
  }
  const body = fs.readFileSync(indexPath, 'utf-8')
  return { body, slug }
}

/**
 * Reads a stub file and returns the path to its versioned target.
 * stubPath is relative to KB_ROOT without extension.
 * Checks for .md stub first, then .json (asset stubs use .json extension).
 */
function readStubTarget(stubPath: string): string {
  const mdPath = path.join(KB_ROOT, `${stubPath}.md`)
  const jsonPath = path.join(KB_ROOT, `${stubPath}.json`)
  const stubFilePath = fs.existsSync(mdPath) ? mdPath
    : fs.existsSync(jsonPath) ? jsonPath
    : null

  if (!stubFilePath) {
    throw new Error(`Stub not found: ${stubPath} (tried .md and .json)`)
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
 * e.g. "material/guidance/foundations/color-system"
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
 * Returns all stub paths for a given system, as arrays of path segments.
 * Used to generate static params for the content page catch-all route.
 * Example: ['guidance', 'foundations', 'color-system']
 */
export function listStubsForSystem(slug: string): string[][] {
  const systemDir = path.join(KB_ROOT, slug)
  if (!fs.existsSync(systemDir)) {
    throw new Error(`System directory not found: ${slug}`)
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
