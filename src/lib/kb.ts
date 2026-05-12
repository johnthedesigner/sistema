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
 * stubPath is relative to KB_ROOT without the .md extension,
 * e.g. "material/guidance/foundations/color-system"
 */
function readStubTarget(stubPath: string): string {
  const stubFilePath = path.join(KB_ROOT, `${stubPath}.md`)
  if (!fs.existsSync(stubFilePath)) {
    throw new Error(`Stub not found: ${stubPath}.md`)
  }
  const raw = fs.readFileSync(stubFilePath, 'utf-8')
  const { data } = matter(raw)
  const stub = data as StubFrontmatter
  if (stub.type !== 'stub' || !stub.points_to) {
    throw new Error(`Not a valid stub file: ${stubPath}.md`)
  }
  // points_to is relative to the stub file's directory
  const stubDir = path.dirname(path.join(KB_ROOT, `${stubPath}.md`))
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
  const raw = fs.readFileSync(versionedPath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    frontmatter: data as ContentFrontmatter,
    body: content,
    filePath: versionedPath,
    stubPath,
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
        entry.name.endsWith('.md') &&
        !entry.name.includes('@') &&
        entry.name !== '_index.md'
      ) {
        stubs.push([...relParts, entry.name.slice(0, -3)])
      }
    }
  }

  walk(systemDir, [])
  return stubs
}
