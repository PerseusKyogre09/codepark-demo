import type { TOCItem } from '../../lib/docs/types';

export function ChangelogTOC({ items }: { items: TOCItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="rounded-xl border border-border bg-card/60 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">On this page</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${item.level === 3 ? 'pl-3' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

