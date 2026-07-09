import { useLocation, useParams } from 'react-router-dom';
import { Calendar, Clock, Link2, ArrowRight } from 'lucide-react';
import { DocMarkdown } from '../components/docs/DocMarkdown';
import { extractTOC } from '../lib/docs/toc';
import { loadReleases } from '../lib/changelog/loader';
import { ReleaseTypeBadge } from '../components/changelog/ReleaseTypeBadge';
import { ChangelogTOC } from '../components/changelog/ChangelogTOC';
import { ReleaseNav } from '../components/changelog/ReleaseNav';

const releases = loadReleases();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReleaseNotesPage() {
  const { '*': slugParam } = useParams();
  const location = useLocation();
  const slug = slugParam?.replace(/^\/+/, '') ?? '';
  const release = slug ? releases.find((item) => item.slug === slug) : undefined;

  if (slug && !release) {
    return (
      <div className="min-h-full bg-background pt-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-16">
          <h1 className="text-3xl font-semibold text-foreground mb-3">Release not found</h1>
          <p className="text-muted-foreground">That release note does not exist yet.</p>
        </div>
      </div>
    );
  }

  if (release) {
    const toc = extractTOC(release.content);
    const index = releases.findIndex((item) => item.slug === release.slug);
    const prev = releases[index - 1];
    const next = releases[index + 1];
    const permalink = `${window.location.origin}${location.pathname}`;

    return (
      <div className="min-h-full bg-background pt-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:px-8 lg:grid-cols-[minmax(0,1fr)_280px] py-10 md:py-14">
          <main className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <ReleaseTypeBadge type={release.frontmatter.type} />
              {release.frontmatter.status && (
                <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {release.frontmatter.status}
                </span>
              )}
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                v{release.frontmatter.version}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
              {release.frontmatter.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(release.frontmatter.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {release.readingTime}
              </span>
              {release.frontmatter.author && <span>By {release.frontmatter.author}</span>}
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground mb-8">
              {release.frontmatter.summary}
            </p>

            <div className="mb-8">
              <button
                onClick={() => navigator.clipboard.writeText(permalink)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Link2 size={15} />
                Copy link
              </button>
            </div>

            <article className="release-notes prose prose-invert max-w-none">
              <DocMarkdown content={release.content} />
            </article>

            <div className="mt-10">
              <ReleaseNav prev={prev} next={next} permalink={permalink} />
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Release
                </p>
                <p className="text-sm text-foreground">{release.frontmatter.version}</p>
                <p className="text-sm text-muted-foreground">{formatDate(release.frontmatter.date)}</p>
              </div>
              <ChangelogTOC items={toc} />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pt-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Changelog
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
            Release notes for CodePark
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every release ships here first. Browse the timeline to see what changed, what improved, and what to expect next.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {releases.map((release, index) => (
            <a
              key={release.slug}
              href={`/changelog/${release.slug}`}
              className="group block rounded-2xl border border-border bg-card/60 p-5 md:p-6 transition-all hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-mono text-foreground">
                      v{release.frontmatter.version}
                    </span>
                    {index === 0 && (
                      <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                        Latest
                      </span>
                    )}
                    <ReleaseTypeBadge type={release.frontmatter.type} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {release.frontmatter.title}
                  </h2>
                  <p className="max-w-3xl text-sm md:text-[15px] leading-relaxed text-muted-foreground">
                    {release.frontmatter.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                  <span>{formatDate(release.frontmatter.date)}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

