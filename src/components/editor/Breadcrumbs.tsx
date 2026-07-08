import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../services/api';
import { ChevronRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function Breadcrumbs() {
  const { session, openFileInTab } = useSession();
  const { themeColors } = useTheme();
  const [neighborhood, setNeighborhood] = useState<{
    imports: string[];
    importedBy: string[];
  } | null>(null);

  const [showImports, setShowImports] = useState(false);
  const [showImportedBy, setShowImportedBy] = useState(false);

  const importsRef = useRef<HTMLDivElement>(null);
  const importedByRef = useRef<HTMLDivElement>(null);

  const activeFile = session?.active_file || '';
  const sessionId = session?.id || '';

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (importsRef.current && !importsRef.current.contains(event.target as Node)) {
        setShowImports(false);
      }
      if (importedByRef.current && !importedByRef.current.contains(event.target as Node)) {
        setShowImportedBy(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch neighborhood metadata when active file changes
  useEffect(() => {
    if (!sessionId || !activeFile) {
      setNeighborhood(null);
      return;
    }

    let isMounted = true;
    apiClient.getContextFileNeighborhood(sessionId, activeFile)
      .then(data => {
        if (isMounted) {
          setNeighborhood({
            imports: data.imports || [],
            importedBy: data.importedBy || []
          });
        }
      })
      .catch(() => {
        if (isMounted) setNeighborhood(null);
      });

    return () => { isMounted = false; };
  }, [sessionId, activeFile]);

  if (!activeFile) return null;

  const pathParts = activeFile.split('/');
  const fileName = pathParts.pop() || '';

  return (
    <div
      className="flex items-center justify-between px-4 h-8 text-[11px] border-b select-none bg-surface shrink-0"
      style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}
    >
      {/* Path Breadcrumb segments */}
      <div className="flex items-center gap-1.5 overflow-hidden truncate mr-4">
        {pathParts.map((part, index) => (
          <span key={index} className="flex items-center gap-1.5 shrink-0">
            <span className="hover:text-foreground cursor-default">{part}</span>
            <ChevronRight size={10} className="opacity-60" />
          </span>
        ))}
        <span className="font-semibold text-foreground truncate">{fileName}</span>
      </div>

      {/* Neighborhood Imports / Imported By badges */}
      {neighborhood && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Imports Dropdown */}
          <div className="relative" ref={importsRef}>
            <button
              onClick={() => setShowImports(!showImports)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-muted/40 hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              <ArrowDownRight size={10} className="text-blue-500" />
              <span>Imports ({neighborhood.imports.length})</span>
            </button>
            
            {showImports && (
              <div
                className="absolute right-0 mt-1 w-64 rounded-md shadow-lg border bg-popover text-popover-foreground z-50 py-1 font-normal animate-in fade-in slide-in-from-top-1 duration-100"
                style={{ borderColor: themeColors.border }}
              >
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider opacity-60 border-b pb-1 mb-1" style={{ borderColor: themeColors.border }}>
                  Imports declared in this file
                </div>
                {neighborhood.imports.length === 0 ? (
                  <div className="px-3 py-1.5 opacity-60">No local imports</div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {neighborhood.imports.map(imp => (
                      <button
                        key={imp}
                        onClick={() => {
                          openFileInTab(imp);
                          setShowImports(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-accent hover:text-accent-foreground truncate text-xs cursor-pointer block"
                      >
                        {imp.split('/').pop()}
                        <span className="block text-[9px] opacity-60 truncate">{imp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Imported By Dropdown */}
          <div className="relative" ref={importedByRef}>
            <button
              onClick={() => setShowImportedBy(!showImportedBy)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-muted/40 hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              <ArrowUpRight size={10} className="text-emerald-500" />
              <span>Imported By ({neighborhood.importedBy.length})</span>
            </button>

            {showImportedBy && (
              <div
                className="absolute right-0 mt-1 w-64 rounded-md shadow-lg border bg-popover text-popover-foreground z-50 py-1 font-normal animate-in fade-in slide-in-from-top-1 duration-100"
                style={{ borderColor: themeColors.border }}
              >
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider opacity-60 border-b pb-1 mb-1" style={{ borderColor: themeColors.border }}>
                  Dependent consumer modules
                </div>
                {neighborhood.importedBy.length === 0 ? (
                  <div className="px-3 py-1.5 opacity-60">No local dependents</div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {neighborhood.importedBy.map(dep => (
                      <button
                        key={dep}
                        onClick={() => {
                          openFileInTab(dep);
                          setShowImportedBy(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-accent hover:text-accent-foreground truncate text-xs cursor-pointer block"
                      >
                        {dep.split('/').pop()}
                        <span className="block text-[9px] opacity-60 truncate">{dep}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
