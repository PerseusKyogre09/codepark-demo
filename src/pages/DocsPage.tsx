import { useParams, useLocation } from 'react-router-dom';
import { getRegistry } from '../lib/docs/registry';
import { DocLayout, DocLanding } from '../components/docs/DocLayout';

const registry = getRegistry();

/**
 * DocsPage — shared page shell for both:
 *   /docs/*          (marketing site — no AppShell)
 *   /dashboard/docs/* (inside AppShell)
 *
 * The layout is identical in both contexts.
 * The only difference is the basePath prop, which affects all internal links
 * and navigation so prev/next, breadcrumbs, and search all route correctly.
 */
export default function DocsPage() {
  const params = useParams();
  const location = useLocation();

  // Determine base path based on which route we came in from
  const isDashboard = location.pathname.startsWith('/dashboard');
  const basePath = isDashboard ? '/dashboard/docs' : '/docs';

  // Reconstruct the slug from the catch-all param
  // react-router-dom v7 uses '*' for splat params
  const slug = (params['*'] ?? '').replace(/^\//, '');

  // No slug → show the landing index page
  if (!slug) {
    return <DocLanding basePath={basePath} />;
  }

  // Look up the entry
  const entry = registry.bySlug.get(slug);

  // Slug exists but no entry → try to find first page of that category
  if (!entry) {
    const categoryEntry = registry.categories
      .find(c => c.slug === slug)
      ?.entries[0];

    if (categoryEntry) {
      // Redirect is handled by navigation, but render the first page here
      return <DocLayout entry={categoryEntry} basePath={basePath} />;
    }

    // Truly not found
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-4">
          <p className="text-4xl mb-4">📄</p>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            The documentation page{' '}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{slug}</code>{' '}
            doesn't exist yet.
          </p>
          <a
            href={basePath}
            className="text-sm text-primary hover:underline"
          >
            ← Back to docs
          </a>
        </div>
      </div>
    );
  }

  return <DocLayout entry={entry} basePath={basePath} />;
}
