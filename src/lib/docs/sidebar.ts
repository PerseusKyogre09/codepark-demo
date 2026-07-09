// ─── Sidebar Builder ─────────────────────────────────────────────────────────

import type { DocCategory, DocRegistry } from './types';

/**
 * Returns the ordered list of sidebar categories (already sorted by registry).
 */
export function buildSidebar(registry: DocRegistry): DocCategory[] {
  return registry.categories;
}

/**
 * Returns a flat sequential list of all entries — used for prev/next nav.
 */
export function flattenSidebar(registry: DocRegistry) {
  return registry.flat;
}
