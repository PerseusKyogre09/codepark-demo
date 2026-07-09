// ─── Documentation Engine — Shared Types ────────────────────────────────────

export interface DocFrontmatter {
  title: string;
  description: string;
  category?: string;
  order?: number;
  icon?: string;
  tags?: string[];
  version?: string;
  lastUpdated?: string;
  draft?: boolean;
}

export interface DocEntry {
  /** Relative slug, e.g. "collaboration/pair-programming" */
  slug: string;
  /** Top-level folder, e.g. "collaboration" */
  categorySlug: string;
  /** Human-readable category label derived from folder name */
  categoryLabel: string;
  frontmatter: DocFrontmatter;
  /** Raw markdown (without frontmatter block) */
  content: string;
  /** Calculated reading time, e.g. "4 min read" */
  readingTime: string;
}

export interface DocCategory {
  slug: string;
  label: string;
  icon?: string;
  entries: DocEntry[];
}

export interface DocRegistry {
  /** Ordered list of categories, each with ordered entries */
  categories: DocCategory[];
  /** Flat, sequential list for prev/next navigation */
  flat: DocEntry[];
  /** Map from slug to entry for O(1) lookup */
  bySlug: Map<string, DocEntry>;
}

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  excerpt: string;
}

export interface BreadcrumbItem {
  label: string;
  slug?: string;
}
