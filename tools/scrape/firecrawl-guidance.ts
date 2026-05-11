import FirecrawlApp from '@mendable/firecrawl-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

function parseArgs(): { url: string; slug: string } {
  const args = process.argv.slice(2);
  const urlIdx = args.indexOf('--url');
  const slugIdx = args.indexOf('--slug');

  if (urlIdx === -1 || !args[urlIdx + 1] || slugIdx === -1 || !args[slugIdx + 1]) {
    console.error('Usage: tsx scrape/firecrawl-guidance.ts --url <url> --slug <slug>');
    console.error('Example: tsx scrape/firecrawl-guidance.ts --url https://m3.material.io/styles --slug material');
    process.exit(1);
  }

  return { url: args[urlIdx + 1], slug: args[slugIdx + 1] };
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

const { url, slug } = parseArgs();

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
console.log(`Output:  ${outputDir}\n`);

const app = new FirecrawlApp({ apiKey });

const result = await app.crawlUrl(url, {
  limit: 200,
  scrapeOptions: {
    formats: ['markdown'],
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
