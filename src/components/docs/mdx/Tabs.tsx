import { useState, type ReactNode } from 'react';
import { cn } from '../../ui/utils';

interface Tab {
  label: string;
  children: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}

export function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div className="my-5 rounded-lg border border-border overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-muted/50 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 focus-visible:outline-none',
              active === i
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="p-4 text-sm">
        {tabs[active]?.children}
      </div>
    </div>
  );
}
