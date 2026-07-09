import { useEffect, useRef, useState } from 'react';
import { cn } from '../ui/utils';
import type { TOCItem } from '../../lib/docs/types';

interface DocTOCProps {
  items: TOCItem[];
}

export function DocTOC({ items }: DocTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-spy using IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map(item => item.id);

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        // Find the topmost visible heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    headingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </p>
      <ul className="space-y-0.5">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block text-[13px] leading-snug py-1 transition-colors border-l-2',
                item.level === 3 ? 'pl-5' : 'pl-3',
                activeId === item.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              )}
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
