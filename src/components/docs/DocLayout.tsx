import { useState } from 'react';
import { Menu, X, Clock, Calendar } from 'lucide-react';
import { DocSidebar } from './DocSidebar';
import { DocTOC } from './DocTOC';
import { DocBreadcrumbs } from './DocBreadcrumbs';
import { DocPrevNext } from './DocPrevNext';
import { DocMarkdown } from './DocMarkdown';
import { getRegistry } from '../../lib/docs/registry';
import { getBreadcrumbs } from '../../lib/docs/breadcrumbs';
import { extractTOC } from '../../lib/docs/toc';
import { getPrevNext } from '../../lib/docs/navigation';
import type { DocEntry } from '../../lib/docs/types';

const registry = getRegistry();

interface DocLayoutProps {
  entry: DocEntry;
  /**
   * The URL base path — '/docs' or '/dashboard/docs'.
   * The layout is IDENTICAL in both contexts; only the base path changes.
   */
  basePath: string;
}

export function DocLayout({ entry, basePath }: DocLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const breadcrumbs = getBreadcrumbs(entry.slug, registry);
  const tocItems = extractTOC(entry.content);
  const { prev, next } = getPrevNext(entry.slug, registry);
  const fm = entry.frontmatter;

  return (
    <div className="min-h-full flex flex-col bg-background">
      {/* Mobile sidebar toggle bar */}
      <div className="lg:hidden sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(o => !o)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Menu</span>
        </button>
        {/* Breadcrumb short form on mobile */}
        <span className="text-sm text-muted-foreground truncate">
          {breadcrumbs.map(c => c.label).join(' › ')}
        </span>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-background border-r border-border overflow-y-auto">
            <DocSidebar
              currentSlug={entry.slug}
              basePath={basePath}
            />
          </aside>
        </div>
      )}

      {/* Main 3-column grid */}
      <div className="flex-1 flex max-w-screen-2xl mx-auto w-full">

        {/* ── Left Sidebar ── */}
        {/* Outer div owns the border and stretches full height of the content column */}
        <div className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-border">
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
            <DocSidebar currentSlug={entry.slug} basePath={basePath} />
          </aside>
        </div>

        {/* ── Center Article ── */}
        <main className="flex-1 min-w-0 px-6 md:px-10 xl:px-16 py-8 md:py-12 max-w-3xl">

          {/* Breadcrumbs */}
          <DocBreadcrumbs crumbs={breadcrumbs} basePath={basePath} />

          {/* Page title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
            {fm.title}
          </h1>

          {/* Description */}
          {fm.description && (
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              {fm.description}
            </p>
          )}

          {/* Metadata strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {entry.readingTime}
            </span>
            {fm.lastUpdated && (
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {fm.lastUpdated}
              </span>
            )}
            {fm.tags && fm.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {fm.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-muted border border-border font-mono text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Markdown content */}
          <DocMarkdown content={entry.content} />

          {/* Prev / Next */}
          <DocPrevNext prev={prev} next={next} basePath={basePath} />
        </main>

        {/* ── Right TOC ── */}
        <aside className="hidden xl:block w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-10 px-4">
          <DocTOC items={tocItems} />
        </aside>

      </div>
    </div>
  );
}

// ─── Landing page (when no slug is provided) ──────────────────────────────────

export function DocLanding({ basePath }: { basePath: string }) {
  const categories = registry.categories;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-full flex flex-col bg-background">
      {/* Mobile toggle */}
      <div className="lg:hidden sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2">
        <button
          onClick={() => setMobileSidebarOpen(o => !o)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Menu</span>
        </button>
      </div>

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-background border-r border-border overflow-y-auto">
            <DocSidebar currentSlug="" basePath={basePath} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex max-w-screen-2xl mx-auto w-full">
        <div className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-border">
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
            <DocSidebar currentSlug="" basePath={basePath} />
          </aside>
        </div>

        <main className="flex-1 min-w-0 px-6 md:px-10 xl:px-16 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Documentation
          </h1>
          <p className="text-base text-muted-foreground mb-10 max-w-2xl">
            Everything you need to build, collaborate, and ship with CodePark.
          </p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map(cat => (
              <a
                key={cat.slug}
                href={`${basePath}/${cat.entries[0]?.slug ?? cat.slug}`}
                className="group p-5 rounded-xl border border-border hover:border-primary/30 bg-card hover:bg-muted/50 transition-all no-underline"
              >
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {cat.label}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {cat.entries.length} {cat.entries.length === 1 ? 'page' : 'pages'}
                </p>
                <ul className="mt-3 space-y-1">
                  {cat.entries.slice(0, 3).map(entry => (
                    <li key={entry.slug} className="text-[13px] text-muted-foreground truncate">
                      · {entry.frontmatter.title}
                    </li>
                  ))}
                  {cat.entries.length > 3 && (
                    <li className="text-[12px] text-muted-foreground/60">
                      +{cat.entries.length - 3} more
                    </li>
                  )}
                </ul>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
