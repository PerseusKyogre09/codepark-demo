import { Users, MessageSquare, Bot, Inbox, Terminal } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';

export type ActiveRightPanel = 'users' | 'chat' | 'ai' | 'requests' | 'friends' | null;

interface RightActivityBarProps {
  activePanel: ActiveRightPanel;
  onPanelChange: (panel: ActiveRightPanel) => void;
  isMobile?: boolean;
  unreadCounts?: Record<string, number>;
  terminalOpen?: boolean;
  onTerminalToggle?: () => void;
  collaboratorCount?: number;
}

export function RightActivityBar({
  activePanel,
  onPanelChange,
  isMobile = false,
  unreadCounts,
  terminalOpen = false,
  onTerminalToggle,
  collaboratorCount = 0
}: RightActivityBarProps) {
  const { settings } = useTheme();
  const _unused = { settings };
  Object.values(_unused);
  const { session, clientIdentity, accessRequests } = useSession();

  const panels: { id: Exclude<ActiveRightPanel, null>; icon: any; label: string }[] = [
    { id: 'users', icon: Users, label: 'Collaborators' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'ai', icon: Bot, label: 'AI' },
  ];

  const isOwner = session?.owner_id === clientIdentity?.id;
  if (isOwner) {
    panels.push({ id: 'requests' as const, icon: Inbox, label: 'Requests' });
  }

  // Add access requests count and collaborator count to unreadCounts
  const effectiveUnreadCounts: Record<string, number> = {
    ...unreadCounts,
    users: collaboratorCount,
    requests: accessRequests.length
  };

  if (isMobile) {
    // Mobile horizontal layout - maybe not needed for right sidebar on mobile
    return null;
  }

  // Desktop vertical layout
  return (
    <nav
      className="hidden md:flex w-11 flex-col bg-surface border-l border-border shrink-0 h-full overflow-hidden"
    >
      <div className="flex flex-col gap-0.5 p-1 pt-2 overflow-y-auto scrollbar-none">
        {panels.map(({ id, icon: Icon, label }) => {
          const active = activePanel === id;
          const unreadCount = effectiveUnreadCounts?.[id] || 0;
          const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

          return (
            <button
              key={id}
              onClick={() => onPanelChange(id)}
              title={label}
              className={`relative size-9 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 size-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold leading-none">
                  {displayCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {onTerminalToggle && (
        <div className="mt-auto p-1 border-t border-border">
          <button
            onClick={onTerminalToggle}
            title="Terminal (Ctrl+`)"
            className={`relative size-9 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              terminalOpen
                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Terminal size={18} />
          </button>
        </div>
      )}
    </nav>
  );
}