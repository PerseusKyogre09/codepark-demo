// ─── Breadcrumb Builder ──────────────────────────────────────────────────────

import type { BreadcrumbItem, DocRegistry } from './types';

/**
 * Returns the breadcrumb trail for a given slug.
 * e.g. "collaboration/pair-programming" →
 *   [{ label: "Docs" }, { label: "Collaboration", slug: "collaboration" }, { label: "Pair Programming" }]
 */
export function getBreadcrumbs(
  slug: string,
  registry: DocRegistry,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: 'Docs', slug: '' }];

  const entry = registry.bySlug.get(slug);
  if (!entry) return crumbs;

  // Find the category
  const category = registry.categories.find(c => c.slug === entry.categorySlug);
  if (category) {
    crumbs.push({ label: category.label, slug: category.slug });
  }

  // Add the page itself (no slug — it's the current page)
  crumbs.push({ label: entry.frontmatter.title });

  return crumbs;
}
