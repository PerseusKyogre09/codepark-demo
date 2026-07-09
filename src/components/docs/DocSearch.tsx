import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getRegistry } from '../../lib/docs/registry';
import { buildSearchIndex, searchDocs } from '../../lib/docs/search';
import type { SearchEntry } from '../../lib/docs/types';

interface DocSearchProps {
  /** Base route prefix — '/docs' or '/dashboard/docs' */
  basePath: string;
}

// Build the search index once
const registry = getRegistry();
const searchIndex = buildSearchIndex(registry);

export function DocSearch({ basePath }: DocSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const navigate = useNavigate();

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search
  useEffect(() => {
    setResults(searchDocs(query, searchIndex));
  }, [query]);

  const navigateTo = useCallback((slug: string) => {
    navigate(`${basePath}/${slug}`);
    setOpen(false);
    setQuery('');
  }, [navigate, basePath]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-colors group"
        aria-label="Search documentation (Ctrl+K)"
      >
        <Search size={12} />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="text-[10px] border border-border rounded px-1 py-0.5 bg-background">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search documentation…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)}>
            <X size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() === '' ? (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              Start typing to search…
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              No results for "<span className="text-foreground">{query}</span>"
            </p>
          ) : (
            <ul className="py-2">
              {results.map(result => (
                <li key={result.slug}>
                  <button
                    onClick={() => navigateTo(result.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-2 shrink-0">
                        {result.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {result.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground">
          <span><kbd className="border border-border rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-border rounded px-1">↵</kbd> open</span>
          <span><kbd className="border border-border rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
