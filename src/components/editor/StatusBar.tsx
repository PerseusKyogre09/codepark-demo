import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Wifi, Check, RefreshCw, GitBranch, Terminal } from 'lucide-react';
import type { Session } from '../../types';
import { apiClient } from '../../services/api';



interface StatusBarProps {
    isConnected: boolean;
    session: Session | null;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    isReadOnly?: boolean;
    terminalVisible?: boolean;
    onToggleTerminal?: () => void;
    branch?: string;
    onBranchClick?: () => void;
    isMobile?: boolean;
}

export function StatusBar({
    isConnected,
    session,
    saveStatus,
    isReadOnly,
    terminalVisible,
    onToggleTerminal,
    branch,
    onBranchClick,
    isMobile = false
}: StatusBarProps) {
    const { settings } = useTheme();
    const _unused = { settings };
    Object.values(_unused);

    const [stackInfo, setStackInfo] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.id) return;
        let isMounted = true;
        apiClient.getContextFingerprint(session.id)
            .then(data => {
                if (!isMounted) return;
                const backend = data.frameworks?.backend?.name;
                const frontend = data.frameworks?.frontend?.name;
                const parts = [];
                if (backend && !backend.toLowerCase().includes("generic")) parts.push(backend);
                if (frontend && !frontend.toLowerCase().includes("client")) parts.push(frontend);
                if (parts.length > 0) {
                    setStackInfo(parts.join(' • '));
                }
            })
            .catch(() => {});
        return () => { isMounted = false; };
    }, [session?.id]);

    const statusLabel =
        saveStatus === 'saving' ? 'Saving...' :
            saveStatus === 'error' ? 'Save failed' :
                'Saved';

    return (
        <div
            className="h-6 flex items-center justify-between px-3 text-[11px] font-normal border-t border-border select-none bg-surface text-muted-foreground shrink-0"
            style={{ marginBottom: isMobile ? '56px' : '0px' }}
        >
            {/* Left Side */}
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                {/* Git Branch */}
                {branch && (
                    <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        title={`Current branch: ${branch}`}
                        onClick={onBranchClick}
                    >
                        <GitBranch size={10} />
                        <span>{branch}</span>
                    </button>
                )}

                {/* Sync / Save Status */}
                <div className="flex items-center gap-1 text-emerald-500 font-medium">
                    {saveStatus === 'saving' ? (
                        <RefreshCw size={9} className="animate-spin" />
                    ) : (
                        <Check size={11} />
                    )}
                    <span>{statusLabel}</span>
                </div>

                {/* Connection Status - Desktop only */}
                <div className="hidden md:flex items-center gap-1.5 opacity-80" title={isConnected ? 'Connected to server' : 'Disconnected from server'}>
                    <Wifi size={10} />
                    <span className="opacity-90">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>

                {/* Stack Info */}
                {stackInfo && (
                    <div className="hidden sm:flex items-center gap-1.5 opacity-80 border-l border-border pl-3" title="Detected Stack">
                        <span className="opacity-90">{stackInfo}</span>
                    </div>
                )}

                {/* Read Only Indicator */}
                {isReadOnly && (
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-200 rounded border border-yellow-400/30 h-4 leading-none text-[9px] font-bold">
                        READ ONLY
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Derived language */}
                {(() => {
                    const activeFile = session?.active_file || '';
                    const fileExt = activeFile.split('.').pop()?.toLowerCase() || '';
                    const languageMap: Record<string, string> = {
                        ts: 'TypeScript',
                        tsx: 'TypeScript JSX',
                        js: 'JavaScript',
                        jsx: 'JavaScript JSX',
                        html: 'HTML',
                        css: 'CSS',
                        json: 'JSON',
                        md: 'Markdown',
                        py: 'Python',
                        txt: 'Plaintext',
                    };
                    const language = languageMap[fileExt] || 'Plaintext';
                    return <span className="hidden md:inline opacity-80">{language}</span>;
                })()}

                {/* Encoding - Desktop only */}
                <span className="hidden sm:inline opacity-80">UTF-8</span>

                {/* Line / Col indicators */}
                <span className="hidden md:inline opacity-80">Ln 1, Col 1</span>

                {/* Terminal Toggle - Mobile/Tablet only */}
                {onToggleTerminal && (
                    <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors md:hidden"
                        onClick={onToggleTerminal}
                        title={terminalVisible ? 'Hide Terminal' : 'Show Terminal'}
                    >
                        <Terminal size={11} />
                        <span>Terminal</span>
                    </button>
                )}
            </div>
        </div>
    );
}
