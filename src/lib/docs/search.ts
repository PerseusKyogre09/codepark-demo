// ─── Search Index ────────────────────────────────────────────────────────────

import type { DocRegistry, SearchEntry } from './types';

/**
 * Builds a flat search index from the doc registry.
 * Each entry contains enough data for search result display without loading
 * the full markdown content.
 */
export function buildSearchIndex(registry: DocRegistry): SearchEntry[] {
  return registry.flat.map(entry => {
    // Build a plain-text excerpt from the first ~200 chars of content
    const plainText = entry.content
      .replace(/^#{1,6}\s+.+$/gm, '') // headings
      .replace(/```[\s\S]*?```/g, '')   // code blocks
      .replace(/`[^`]*`/g, '')          // inline code
      .replace(/!\[.*?\]\(.*?\)/g, '')  // images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → label
      .replace(/[*_~>#|]/g, '')         // markdown chars
      .replace(/\s+/g, ' ')
      .trim();

    return {
      slug: entry.slug,
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      category: entry.categorySlug,
      categoryLabel: entry.categoryLabel,
      tags: entry.frontmatter.tags ?? [],
      excerpt: plainText.slice(0, 200),
    };
  });
}

/**
 * Performs a simple client-side substring search over the index.
 * For large doc sets, swap this implementation for Fuse.js or Algolia
 * without changing any call sites.
 */
export function searchDocs(query: string, index: SearchEntry[]): SearchEntry[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();

  return index
    .filter(entry => {
      const haystack = [
        entry.title,
        entry.description,
        entry.categoryLabel,
        entry.excerpt,
        ...entry.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 12); // cap results for performance
}
