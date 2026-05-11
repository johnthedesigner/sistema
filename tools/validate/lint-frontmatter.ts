import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import matter from 'gray-matter';

const REQUIRED_FIELDS = [
  'system',
  'category',
  'topic',
  'content_type',
  'status',
  'retrieved',
  'source_url',
] as const;

const VALID_STATUSES = ['latest', 'legacy', 'draft', 'deprecated'] as const;
const VALID_CONTENT_TYPES = ['guidance', 'implementation', 'asset', 'design-md'] as const;

// Files that are not content files and should not be validated as such
const SKIP_FILES = new Set(['_index.md']);

function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectMdFiles(fullPath));
    } else if (entry.endsWith('.md') && entry !== '.gitkeep' && !SKIP_FILES.has(entry)) {
      results.push(fullPath);
    }
  }
  return results;
}

function isVersioned(filename: string): boolean {
  return /@/.test(filename);
}

function stubPathFor(versionedPath: string): string {
  const dir = dirname(versionedPath);
  const base = basename(versionedPath).replace(/@[^.]+/, '');
  return join(dir, base);
}

const systemDir = process.argv[2];

if (!systemDir) {
  console.error('Usage: tsx validate/lint-frontmatter.ts <system-directory>');
  console.error('Example: tsx validate/lint-frontmatter.ts material/');
  process.exit(1);
}

if (!existsSync(systemDir)) {
  console.error(`Directory not found: ${systemDir}`);
  process.exit(1);
}

const files = collectMdFiles(systemDir);
const errors: string[] = [];

for (const filepath of files) {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(readFileSync(filepath, 'utf-8'));
  } catch {
    errors.push(`${filepath}: failed to parse frontmatter`);
    continue;
  }

  const fm = parsed.data as Record<string, unknown>;

  // Stub files have different validation rules
  if (fm.type === 'stub') {
    if (!fm.points_to) {
      errors.push(`${filepath}: stub is missing required field 'points_to'`);
    } else {
      const target = join(dirname(filepath), String(fm.points_to));
      if (!existsSync(target)) {
        errors.push(`${filepath}: stub 'points_to' target does not exist: ${fm.points_to}`);
      }
    }
    continue;
  }

  // design-md files use derived_from instead of source_url
  const isDesignMd = fm.content_type === 'design-md';
  const requiredFields = isDesignMd
    ? REQUIRED_FIELDS.filter(f => f !== 'source_url')
    : REQUIRED_FIELDS;

  // Content files: check all required fields
  for (const field of requiredFields) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
      errors.push(`${filepath}: missing required field '${field}'`);
    }
  }

  // design-md files must have derived_from
  if (isDesignMd && !fm.derived_from) {
    errors.push(`${filepath}: design-md file missing required field 'derived_from'`);
  }

  // Validate status value
  if (fm.status && !VALID_STATUSES.includes(fm.status as typeof VALID_STATUSES[number])) {
    errors.push(
      `${filepath}: invalid status '${fm.status}' — must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  // Validate content_type value
  if (
    fm.content_type &&
    !VALID_CONTENT_TYPES.includes(fm.content_type as typeof VALID_CONTENT_TYPES[number])
  ) {
    errors.push(
      `${filepath}: invalid content_type '${fm.content_type}' — must be one of: ${VALID_CONTENT_TYPES.join(', ')}`
    );
  }

  // Versioned files must have a corresponding stub
  if (isVersioned(basename(filepath))) {
    const stubPath = stubPathFor(filepath);
    if (!existsSync(stubPath)) {
      errors.push(`${filepath}: versioned file has no corresponding stub at ${stubPath}`);
    }
  }
}

if (errors.length === 0) {
  console.log(`✓ No lint errors found in ${systemDir} (${files.length} files checked)`);
} else {
  console.log(`✗ Found ${errors.length} lint error(s) in ${systemDir} (${files.length} files checked):\n`);
  for (const err of errors) {
    console.log(`  ${err}`);
  }
  process.exit(1);
}
