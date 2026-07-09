// ─── Doc Registry ────────────────────────────────────────────────────────────
// Builds and memoizes the complete document manifest.
// This is the single source of truth for all documentation metadata.

import { loadDocs } from './loader';
import type { DocCategory, DocEntry, DocRegistry } from './types';

// Defines the display order of top-level categories.
// Any category not listed here is appended alphabetically at the end.
const CATEGORY_ORDER: string[] = [
  'getting-started',
  'projects',
  'collaboration',
  'environments',
  'editor',
  'ai',
  'contextbase',
  'cli',
  'api',
  'templates',
  'integrations',
  'deployment',
  'troubleshooting',
  'faq',
];

let _registry: DocRegistry | null = null;

/**
 * Returns the singleton doc registry. Builds it on first call.
 * The registry is immutable — adding a new .md file requires a dev-server
 * hot reload or rebuild (Vite's HMR handles this automatically).
 */
export function getRegistry(): DocRegistry {
  if (_registry) return _registry;

  const entries = loadDocs();

  // Group by category
  const categoryMap = new Map<string, DocEntry[]>();
  for (const entry of entries) {
    const list = categoryMap.get(entry.categorySlug) ?? [];
    list.push(entry);
    categoryMap.set(entry.categorySlug, list);
  }

  // Sort entries within each category by `order` then title
  for (const [, list] of categoryMap) {
    list.sort((a, b) => {
      const ao = a.frontmatter.order ?? 999;
      const bo = b.frontmatter.order ?? 999;
      if (ao !== bo) return ao - bo;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  }

  // Sort categories
  const allCategorySlugs = [...categoryMap.keys()];
  allCategorySlugs.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  const categories: DocCategory[] = allCategorySlugs.map(slug => {
    const catEntries = categoryMap.get(slug)!;
    const firstEntry = catEntries[0];
    return {
      slug,
      label: firstEntry.categoryLabel,
      icon: firstEntry.frontmatter.icon,
      entries: catEntries,
    };
  });

  // Build flat list and slug map
  const flat: DocEntry[] = categories.flatMap(c => c.entries);
  const bySlug = new Map(flat.map(e => [e.slug, e]));

  _registry = { categories, flat, bySlug };
  return _registry;
}

// Hot-module replacement: reset the registry when any doc file changes
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    _registry = null;
  });
}
