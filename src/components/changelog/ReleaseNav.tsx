import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import type { ReleaseEntry } from '../../lib/changelog/types';

export function ReleaseNav({ prev, next, permalink }: { prev?: ReleaseEntry; next?: ReleaseEntry; permalink: string }) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(permalink);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {prev ? (
          <a href={`/changelog/${prev.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
            {prev.frontmatter.version}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground/40">
            <ChevronLeft size={16} />
            Newer
          </span>
        )}
        {next ? (
          <a href={`/changelog/${next.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {next.frontmatter.version}
            <ChevronRight size={16} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground/40">
            Older
            <ChevronRight size={16} />
          </span>
        )}
      </div>

      <button
        onClick={copyLink}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Copy size={15} />
        Copy link
      </button>
    </div>
  );
}
