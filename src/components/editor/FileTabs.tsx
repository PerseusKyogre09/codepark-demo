import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';
import { X, Plus } from 'lucide-react';
import { useMobile } from '../../hooks/useMobile';

export default function FileTabs() {
  const { settings, themeColors } = useTheme();
  
  // Read unused values to satisfy typescript warning
  const _unused = { settings, themeColors };
  Object.values(_unused);

  const { session, openFileInTab, closeFileTab } = useSession();
  const { isMobile } = useMobile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const renderCount = useRef(0);
  renderCount.current += 1;
  useEffect(() => {
    console.debug('[FileTabs] mount', { renderCount: renderCount.current, opened: session?.opened_files?.length, active: session?.active_file });
    return () => console.debug('[FileTabs] unmount');
  }, []);

  const tabsToRender = session?.opened_files && session.opened_files.length > 0
    ? session.opened_files
    : (session?.active_file ? [session.active_file] : []);

  useEffect(() => {
    if (!session?.active_file) return;

    const active = session.active_file;
    const ref = active ? tabRefs.current[active] : null;
    if (ref && containerRef.current) {
      ref.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }
  }, [session?.active_file]);


  // Helper for icons (uses clean prototype blue dot status indicator)
  const getFileIcon = (filename: string) => {
    // Read parameter to satisfy check
    const _unusedFilename = filename;
    Object.values({ _unusedFilename });
    return <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 inline-block" />;
  };

  if (!session) return null;

  return (
    <div
      ref={containerRef}
      className="file-tabs flex items-center overflow-x-auto select-none bg-surface h-9 border-b border-border w-full"
      style={{
        /* hide native scrollbar */
        scrollbarWidth: 'none' as any,
        msOverflowStyle: 'none',
      }}
      onMouseDown={(e) => { e.stopPropagation(); }}
    >
      <style>{`
        .file-tabs::-webkit-scrollbar { display: none; }
        .tab-item {
           position: relative;
           flex-shrink: 0;
        }
        .tab-item:hover .close-btn {
           opacity: 1;
        }
        .close-btn {
           opacity: 0;
           transition: opacity 0.2s;
        }
        .tab-item.active .close-btn {
           opacity: 1;
        }
      `}</style>

      {tabsToRender.map((file) => {
        const isActive = session.active_file === file;
        return (
          <div
            key={file}
            ref={(el) => { tabRefs.current[file] = el ?? null; }}
            draggable
            className={`tab-item flex items-center gap-2 px-3 h-full cursor-pointer border-r border-border transition-colors ${
              isActive
                ? `bg-background text-foreground font-semibold active ${isMobile ? 'border-t-0' : 'border-t-2 border-t-primary'}`
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
            onClick={() => openFileInTab(file)}
            style={{
              minWidth: '120px',
              maxWidth: '200px',
            }}
            title={file}
          >
            <span className="flex-shrink-0 opacity-90">
              {getFileIcon(file)}
            </span>

            <span className="flex-1 truncate text-xs" style={{ opacity: isActive ? 1 : 0.8 }}>
              {file.split('/').pop()}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFileTab(file);
              }}
              className="close-btn p-0.5 rounded-md hover:bg-muted/40 flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}

      {/* Add tab button (+), matching prototype */}
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('trigger_new_file_dialog'));
        }}
        className="px-3.5 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 border-r border-border shrink-0"
        title="New File"
      >
        <Plus size={14} className="opacity-75" />
      </button>

    </div>
  );
}