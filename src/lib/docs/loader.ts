// ─── Doc Loader ──────────────────────────────────────────────────────────────
// Discovers all .md files in src/docs/ via Vite's static import.meta.glob.
// This is resolved entirely at build time — zero runtime file system access.

import { parseFrontmatter } from './frontmatter';
import { calculateReadingTime } from './reading-time';
import type { DocEntry } from './types';

// Eagerly import all markdown files as raw strings.
// The path must be a string literal for Vite's static analysis.
const rawModules = import.meta.glob('/src/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Converts a folder name like "getting-started" → "Getting Started" */
function labelFromSlug(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Loads and parses every .md file found under src/docs/.
 * Draft pages are excluded in production (import.meta.env.PROD).
 */
export function loadDocs(): DocEntry[] {
  const entries: DocEntry[] = [];
  const isProd = import.meta.env.PROD;

  for (const [filePath, raw] of Object.entries(rawModules)) {
    if (typeof raw !== 'string') continue;

    // Derive slug from path: /src/docs/collaboration/pair-programming.md
    //                      → collaboration/pair-programming
    const slugFull = filePath
      .replace(/^\/src\/docs\//, '')
      .replace(/\.md$/, '');

    const parts = slugFull.split('/');
    const categorySlug = parts[0];

    const { data: frontmatter, content } = parseFrontmatter(raw);

    // Skip drafts in production
    if (isProd && frontmatter.draft === true) continue;

    // Derive category label from folder name, allowing frontmatter override
    const categoryLabel = frontmatter.category || labelFromSlug(categorySlug);

    entries.push({
      slug: slugFull,
      categorySlug,
      categoryLabel,
      frontmatter: {
        title: frontmatter.title || labelFromSlug(parts[parts.length - 1]),
        description: frontmatter.description || '',
        ...frontmatter,
        category: categoryLabel,
      },
      content,
      readingTime: calculateReadingTime(content),
    });
  }

  return entries;
}
