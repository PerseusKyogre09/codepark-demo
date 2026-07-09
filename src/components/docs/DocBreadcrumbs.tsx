import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '../../lib/docs/types';

interface DocBreadcrumbsProps {
  crumbs: BreadcrumbItem[];
  basePath: string;
}

export function DocBreadcrumbs({ crumbs, basePath }: DocBreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-6 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-muted-foreground/50" />}
            {isLast ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <button
                onClick={() =>
                  navigate(crumb.slug !== undefined ? `${basePath}/${crumb.slug}` : basePath)
                }
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {i === 0 && <Home size={11} />}
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
