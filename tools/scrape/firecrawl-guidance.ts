import FirecrawlApp from '@mendable/firecrawl-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

// Conservative default to stay within Firecrawl's browser concurrency limit.
// Run multiple targeted passes against subsections rather than one large crawl.
const DEFAULT_LIMIT = 25;
const DEFAULT_WAIT_MS = 1500;

function parseArgs(): { url: string; slug: string; limit: number; waitMs: number } {
  const args = process.argv.slice(2);

  function flag(name: string): string | undefined {
    const idx = args.indexOf(name);
    return idx !== -1 ? args[idx + 1] : undefined;
  }

  const url = flag('--url');
  const slug = flag('--slug');

  if (!url || !slug) {
    console.error('Usage: tsx scrape/firecrawl-guidance.ts --url <url> --slug <slug> [--limit N] [--wait N]');
    console.error('');
    console.error('  --url    URL to crawl (crawls this page and its children within the same path)');
    console.error('  --slug   System slug, e.g. "material" — determines output directory');
    console.error(`  --limit  Max pages per crawl call (default: ${DEFAULT_LIMIT}). Keep ≤25 to avoid concurrency limits.`);
    console.error(`  --wait   MS to wait for JS rendering per page (default: ${DEFAULT_WAIT_MS})`);
    console.error('');
    console.error('Example (single section):');
    console.error('  tsx scrape/firecrawl-guidance.ts --url https://m3.material.io/styles/color --slug material');
    process.exit(1);
  }

  const limit = flag('--limit') ? parseInt(flag('--limit')!, 10) : DEFAULT_LIMIT;
  const waitMs = flag('--wait') ? parseInt(flag('--wait')!, 10) : DEFAULT_WAIT_MS;

  if (limit > 25) {
    console.warn(`Warning: --limit ${limit} exceeds recommended maximum of 25. This may hit Firecrawl browser concurrency limits.`);
  }

  return { url, slug, limit, waitMs };
}

function urlToFilename(sourceUrl: string): string {
  try {
    const pathname = new URL(sourceUrl).pathname;
    return pathname.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '_') || 'index';
  } catch {
    return 'unknown';
  }
}

function topSection(sourceUrl: string): string {
  try {
    const parts = new URL(sourceUrl).pathname.split('/').filter(Boolean);
    return parts[0] ?? 'root';
  } catch {
    return 'unknown';
  }
}

const { url, slug, limit, waitMs } = parseArgs();

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('Error: FIRECRAWL_API_KEY is not set.');
  console.error('Copy tools/.env.example to tools/.env and add your Firecrawl API key.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const repoRoot = join(__dirname, '..', '..');
const outputDir = join(repoRoot, 'raw-scrape', slug, today);

mkdirSync(outputDir, { recursive: true });
console.log(`Target:  ${url}`);
console.log(`Slug:    ${slug}`);
console.log(`Limit:   ${limit} pages`);
console.log(`Wait:    ${waitMs}ms per page`);
console.log(`Output:  ${outputDir}\n`);

const app = new FirecrawlApp({ apiKey });

const result = await app.crawlUrl(url, {
  limit,
  scrapeOptions: {
    formats: ['markdown'],
    waitFor: waitMs,
  },
});

if (!result.success) {
  console.error('Crawl failed:', (result as { error?: string }).error ?? 'unknown error');
  process.exit(1);
}

const pages = result.data ?? [];
const errored: string[] = [];
let totalBytes = 0;
const sections = new Set<string>();

for (const page of pages) {
  const sourceUrl: string = (page.metadata as Record<string, string>)?.sourceURL ?? '';
  const markdown: string = (page as unknown as { markdown?: string }).markdown ?? '';

  if (!markdown.trim()) {
    errored.push(sourceUrl || '(unknown url)');
    continue;
  }

  const filename = urlToFilename(sourceUrl);
  sections.add(topSection(sourceUrl));

  const fileContent = `<!-- source: ${sourceUrl} -->\n\n${markdown}`;
  writeFileSync(join(outputDir, `${filename}.md`), fileContent, 'utf-8');
  totalBytes += fileContent.length;
}

console.log('--- Scrape Summary ---');
console.log(`Pages fetched:  ${pages.length - errored.length}`);
console.log(`Total size:     ${Math.round(totalBytes / 1024)} KB`);
console.log(`Output dir:     ${outputDir}`);
console.log(`Top sections:   ${[...sections].sort().join(', ') || '(none)'}`);

if (errored.length > 0) {
  console.log(`\nEmpty or errored (${errored.length}):`);
  errored.forEach(u => console.log(`  - ${u}`));
}
