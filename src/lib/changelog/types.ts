export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix' | 'beta' | 'alpha' | 'preview' | 'stable';

export interface ReleaseFrontmatter {
  version: string;
  title: string;
  date: string;
  type: ReleaseType;
  status?: 'stable' | 'beta' | 'preview' | 'alpha';
  author?: string;
  summary: string;
  draft?: boolean;
}

export interface ReleaseEntry {
  slug: string;
  frontmatter: ReleaseFrontmatter;
  content: string;
  readingTime: string;
}

