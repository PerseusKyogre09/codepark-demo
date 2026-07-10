import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { getRegistry } from '../../lib/docs/registry';
import { buildSidebar } from '../../lib/docs/sidebar';
import { DocSearch } from './DocSearch';
import { cn } from '../ui/utils';
import type { DocCategory } from '../../lib/docs/types';

const registry = getRegistry();
const categories = buildSidebar(registry);

interface DocSidebarProps {
  /** The current doc slug, e.g. "collaboration/pair-programming" */
  currentSlug: string;
  /** '/docs' or '/dashboard/docs' */
  basePath: string;
}

export function DocSidebar({ currentSlug, basePath }: DocSidebarProps) {
  const navigate = useNavigate();

  // Remember which sections are open — default to all open
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(categories.map(c => c.slug)),
  );

  // Auto-expand the section containing the active page
  useEffect(() => {
    const activeCategory = currentSlug.split('/')[0];
    setOpenSections(prev => new Set([...prev, activeCategory]));
  }, [currentSlug]);

  const toggleSection = (slug: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border shrink-0">
        <DocSearch basePath={basePath} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {/* Docs home */}
        <button
          onClick={() => navigate(basePath)}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors',
            currentSlug === ''
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <BookOpen size={12} />
          Documentation Home
        </button>

        {/* Categories */}
        {categories.map(category => (
          <CategorySection
            key={category.slug}
            category={category}
            currentSlug={currentSlug}
            basePath={basePath}
            isOpen={openSections.has(category.slug)}
            onToggle={() => toggleSection(category.slug)}
            onNavigate={slug => navigate(`${basePath}/${slug}`)}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

interface CategorySectionProps {
  category: DocCategory;
  currentSlug: string;
  basePath: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (slug: string) => void;
}

function CategorySection({
  category,
  currentSlug,
  isOpen,
  onToggle,
  onNavigate,
}: CategorySectionProps) {
  const isActiveCategory = currentSlug.startsWith(category.slug);

  return (
    <div className="pt-1">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-colors',
          isActiveCategory
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        )}
      >
        <span>{category.label}</span>
        {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>

      {isOpen && (
        <ul className="mt-0.5 ml-1 space-y-0.5">
          {category.entries.map(entry => (
            <li key={entry.slug}>
              <button
                onClick={() => onNavigate(entry.slug)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-[13px] rounded-md transition-colors leading-snug',
                  currentSlug === entry.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {entry.frontmatter.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
