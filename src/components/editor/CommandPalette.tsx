import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../services/api';
import { Search, FileCode } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { session, openFileInTab } = useSession();
  const { themeColors } = useTheme();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    path: string;
    relevance: 'direct' | 'neighbor' | 'unrelated';
    relationReason: string | null;
    distance: number;
  }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sessionId = session?.id || '';
  const activeFile = session?.active_file || '';

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Query proximity-sorted list when search query changes
  useEffect(() => {
    if (!isOpen || !sessionId) return;
    
    let isMounted = true;
    apiClient.getContextProximitySort(sessionId, query, activeFile)
      .then(data => {
        if (isMounted) {
          setResults(data || []);
          setSelectedIndex(0);
        }
      })
      .catch(() => {
        if (isMounted) setResults([]);
      });
      
    return () => { isMounted = false; };
  }, [isOpen, sessionId, query, activeFile]);

  // Keyboard navigation within list
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          openFileInTab(results[selectedIndex].path);
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, openFileInTab]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24 animate-in fade-in duration-150">
      <div
        ref={containerRef}
        className="w-full max-w-xl rounded-lg shadow-2xl border flex flex-col overflow-hidden max-h-[400px] animate-in zoom-in-95 duration-150"
        style={{
          backgroundColor: themeColors.cardBg || '#1e1e1e',
          borderColor: themeColors.border,
          color: themeColors.text
        }}
      >
        {/* Search Input wrapper */}
        <div className="flex items-center gap-3 px-4 h-12 border-b" style={{ borderColor: themeColors.border }}>
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search files by path or graph proximity..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-hidden text-sm placeholder:text-muted-foreground"
          />
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">ESC</span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {query ? 'No matching files found' : 'Type to search workspace files...'}
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const fileName = item.path.split('/').pop() || '';
              
              // Determine relevance styling tags
              let tagColor = 'text-muted-foreground bg-muted/40';
              if (item.relevance === 'direct') tagColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
              if (item.relevance === 'neighbor') tagColor = 'text-purple-500 bg-purple-500/10 border-purple-500/20';

              return (
                <div
                  key={item.path}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/20'
                  }`}
                  onClick={() => {
                    openFileInTab(item.path);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCode size={16} className="text-muted-foreground shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">{fileName}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{item.path}</span>
                    </div>
                  </div>

                  {/* Relationship Badge */}
                  {item.relationReason && (
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${tagColor}`}>
                      {item.relationReason}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
