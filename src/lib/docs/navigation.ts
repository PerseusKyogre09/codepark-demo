// ─── Prev / Next Navigation ──────────────────────────────────────────────────

import type { DocEntry, DocRegistry } from './types';

/**
 * Returns the previous and next entries in the sequential flat doc list.
 */
export function getPrevNext(
  slug: string,
  registry: DocRegistry,
): { prev?: DocEntry; next?: DocEntry } {
  const idx = registry.flat.findIndex(e => e.slug === slug);
  if (idx === -1) return {};

  return {
    prev: registry.flat[idx - 1],
    next: registry.flat[idx + 1],
  };
}
