import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DocEntry } from '../../lib/docs/types';

interface DocPrevNextProps {
  prev?: DocEntry;
  next?: DocEntry;
  basePath: string;
}

export function DocPrevNext({ prev, next, basePath }: DocPrevNextProps) {
  const navigate = useNavigate();

  if (!prev && !next) return null;

  return (
    <div className="mt-12 pt-6 border-t border-border grid sm:grid-cols-2 gap-3">
      {prev ? (
        <button
          onClick={() => navigate(`${basePath}/${prev.slug}`)}
          className="group flex flex-col gap-1 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-left"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wide">
            <ChevronLeft size={11} />
            Previous
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {prev.frontmatter.title}
          </span>
          <span className="text-[12px] text-muted-foreground">{prev.categoryLabel}</span>
        </button>
      ) : (
        <div /> /* spacer */
      )}

      {next ? (
        <button
          onClick={() => navigate(`${basePath}/${next.slug}`)}
          className="group flex flex-col gap-1 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-right sm:items-end"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wide">
            Next
            <ChevronRight size={11} />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {next.frontmatter.title}
          </span>
          <span className="text-[12px] text-muted-foreground">{next.categoryLabel}</span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
