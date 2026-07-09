import { parseFrontmatter } from '../docs/frontmatter';
import { calculateReadingTime } from '../docs/reading-time';
import type { ReleaseEntry, ReleaseFrontmatter } from './types';

const rawModules = import.meta.glob('/src/changelog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function compareVersions(a: string, b: string): number {
  const parse = (v: string) => v.replace(/^v/i, '').split(/[.-]/).map((n) => Number(n));
  const aa = parse(a);
  const bb = parse(b);
  const len = Math.max(aa.length, bb.length);
  for (let i = 0; i < len; i++) {
    const av = aa[i] ?? 0;
    const bv = bb[i] ?? 0;
    if (av !== bv) return bv - av;
  }
  return 0;
}

export function loadReleases(): ReleaseEntry[] {
  const isProd = import.meta.env.PROD;

  const releases = Object.entries(rawModules)
    .map(([filePath, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      const frontmatter = data as unknown as ReleaseFrontmatter;
      if (isProd && frontmatter.draft === true) return null;

      const slug = filePath.replace(/^\/src\/changelog\//, '').replace(/\.md$/, '');
      return {
        slug,
        frontmatter: {
          ...frontmatter,
          version: frontmatter.version || slug,
          title: frontmatter.title || slug,
          date: frontmatter.date || '',
          type: frontmatter.type || 'stable',
          summary: frontmatter.summary || '',
        },
        content,
        readingTime: calculateReadingTime(content),
      } as ReleaseEntry;
    })
    .filter((entry): entry is ReleaseEntry => entry !== null)
    .sort((a, b) => {
      const byDate = b.frontmatter.date.localeCompare(a.frontmatter.date);
      if (byDate !== 0) return byDate;
      return compareVersions(a.frontmatter.version, b.frontmatter.version);
    });

  return releases;
}

