import { Files, Bug, GitBranch, Settings } from 'lucide-react';

type ActivePanel = 'explorer' | 'debug' | 'git' | 'settings' | 'apps' | null;

interface ActivityBarProps {
  activePanel: ActivePanel;
  onPanelChange: (panel: ActivePanel) => void;
  isMobile?: boolean;
  gitChangesCount?: number;
}

export function ActivityBar({
  activePanel,
  onPanelChange,
  isMobile = false,
  gitChangesCount = 0
}: ActivityBarProps) {
  const panels = [
    { id: 'explorer' as const, icon: Files, label: 'Explorer' },
    { id: 'git' as const, icon: GitBranch, label: 'Git', badge: gitChangesCount },
    { id: 'debug' as const, icon: Bug, label: 'Debug' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  if (isMobile) {
    // Mobile horizontal layout
    return (
      <>
        {panels.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => onPanelChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 hover:bg-white/10 transition-all relative"
            style={{
              background: activePanel === id ? 'var(--primary-hover-bg)' : 'transparent',
              color: activePanel === id ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
            {badge && badge > 0 ? (
              <span className="absolute top-1 right-2 size-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold leading-none">{badge}</span>
            ) : null}
            {activePanel === id && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </>
    );
  }

  // Desktop vertical layout
  return (
    <nav className="hidden md:flex w-11 flex-col bg-surface border-r border-border shrink-0 overflow-y-auto scrollbar-none">
      <div className="flex flex-col gap-0.5 p-1 pt-2">
        {panels.map(({ id, icon: Icon, label, badge }) => {
          const active = activePanel === id;
          return (
            <button
              key={id}
              onClick={() => onPanelChange(id)}
              title={label}
              className={`relative size-9 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={18} />
              {badge && badge > 0 ? (
                <span className="absolute top-1 right-1 size-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold leading-none">{badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

