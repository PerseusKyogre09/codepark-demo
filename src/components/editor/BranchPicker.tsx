import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, GitBranch, X, Check, History, GitMerge, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';
import { apiClient } from '../../services/api';

interface BranchInfo {
    name: string;
    date: string;
    author: string;
    hash: string;
    message: string;
    commit_count?: string;
    session_id?: string;
    active_users?: number;
    remote?: boolean;
}

interface BranchPickerProps {
    isOpen: boolean;
    onClose: () => void;
    currentBranch: string;
    onBranchSelect: (branchName: string) => Promise<void>;
    onCreateBranch: (branchName: string, startPoint?: string) => Promise<void>;
    onMergeBranch?: (branchName: string) => Promise<void>;
}

export function BranchPicker({
    isOpen,
    onClose,
    currentBranch,
    onBranchSelect,
    onCreateBranch,
    onMergeBranch
}: BranchPickerProps) {
    const { settings, themeColors } = useTheme();
    const { session } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [branches, setBranches] = useState<BranchInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [newBranchName, setNewBranchName] = useState('');
    const [mergingBranch, setMergingBranch] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const BRANCH_COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#52B788'
    ];

    const getBranchColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return BRANCH_COLORS[Math.abs(hash) % BRANCH_COLORS.length];
    };



    useEffect(() => {
        if (isOpen) {
            fetchBranches();
            setSearchTerm('');
            setView('list');
            setNewBranchName('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const fetchBranches = async () => {
        if (!session?.id) return;
        try {
            setLoading(true);
            const data = await apiClient.getBranches(session.id);
            setBranches(data.branches || []);
        } catch (err: any) {
            console.error('Failed to fetch branches:', err);
            setError(err.message || 'Failed to load branches');
        } finally {
            setLoading(false);
        }
    };

    const filteredBranches = branches.filter(b =>
        b && typeof b.name === 'string' && b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBranchName.trim()) return;

        try {
            setLoading(true);
            await onCreateBranch(newBranchName.trim());
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create branch');
        } finally {
            setLoading(false);
        }
    };

    const handleMerge = async (branchName: string) => {
        if (!onMergeBranch) return;
        try {
            setMergingBranch(branchName);
            await onMergeBranch(branchName);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Merge failed');
        } finally {
            setMergingBranch(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border animate-slide-up"
                style={{
                    background: themeColors.cardBg,
                    borderColor: themeColors.border,
                    boxShadow: `0 0 30px rgba(0,0,0,0.5), 0 0 10px ${settings.accentColor}20`
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header/Input */}
                <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
                    {view === 'list' ? (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: themeColors.textSecondary }} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Select a branch or tag to checkout"
                                className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-md border-none focus:ring-1 outline-none text-sm"
                                style={{
                                    color: themeColors.text,
                                    '--tw-ring-color': settings.accentColor
                                } as any}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Escape') onClose();
                                    if (e.key === 'Enter' && searchTerm && filteredBranches.length === 0) {
                                        setView('create');
                                        setNewBranchName(searchTerm);
                                    }
                                }}
                            />
                            <button
                                onClick={onClose}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                            >
                                <X className="w-3.5 h-3.5" style={{ color: themeColors.textSecondary }} />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateSubmit} className="relative">
                            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: settings.accentColor }} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Branch name"
                                className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-md border-none focus:ring-1 outline-none text-sm"
                                style={{
                                    color: themeColors.text,
                                    '--tw-ring-color': settings.accentColor
                                } as any}
                                value={newBranchName}
                                onChange={e => setNewBranchName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Escape') setView('list');
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-[10px] opacity-40">Enter to confirm</span>
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" style={{ color: themeColors.textSecondary }} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Content */}
                <div className="max-h-[400px] overflow-auto py-1 no-scrollbar">
                    {view === 'list' && (
                        <>
                            {/* Actions */}
                            {!searchTerm && (
                                <div className="px-1 mb-2">
                                    <button
                                        onClick={() => setView('create')}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 rounded-md transition-all group"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center rounded bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                        <span style={{ color: themeColors.text }}>Create new branch...</span>
                                    </button>
                                </div>
                            )}

                            {/* Branch List */}
                            {loading ? (
                                <div className="p-8 text-center animate-pulse">
                                    <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm opacity-40">Loading branches...</p>
                                </div>
                            ) : filteredBranches.length > 0 ? (
                                filteredBranches.map(branch => (
                                    <div
                                        key={branch.name}
                                        className="w-full flex items-start gap-4 px-4 py-3 hover:bg-white/5 transition-all text-left relative group border-b border-white/5 last:border-0"
                                    >
                                        <div
                                            className="mt-1.5 cursor-pointer"
                                            onClick={() => {
                                                onBranchSelect(branch.name);
                                                onClose();
                                            }}
                                        >
                                            <GitBranch
                                                className={`w-4 h-4 transition-transform group-hover:scale-110`}
                                                style={{ color: branch.name === currentBranch ? settings.accentColor : getBranchColor(branch.name) }}
                                            />
                                        </div>
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => {
                                                onBranchSelect(branch.name);
                                                onClose();
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 truncate">
                                                    <span
                                                        className={`font-semibold text-sm truncate`}
                                                        style={{ color: branch.name === currentBranch ? settings.accentColor : themeColors.text }}
                                                    >
                                                        {branch.name}
                                                    </span>
                                                    {branch.remote && (
                                                        <span className="text-[9px] px-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 font-mono">
                                                            remote
                                                        </span>
                                                    )}
                                                    {branch.commit_count && (
                                                        <span className="text-[9px] px-1 rounded bg-white/5 opacity-50 font-mono">
                                                            {branch.commit_count} commits
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] opacity-40 shrink-0 ml-2">{branch.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] opacity-60 truncate">
                                                <span className="font-mono bg-white/10 px-1 rounded text-[10px] border border-white/5">{branch.hash}</span>
                                                <span>•</span>
                                                <span className="truncate">{branch.message}</span>
                                            </div>
                                            <div className="text-[10px] opacity-30 mt-0.5">by {branch.author}</div>
                                        </div>

                                        {branch.active_users !== undefined && branch.active_users > 0 && (
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30" title={`${branch.active_users} active users`}>
                                                <Users className="w-3 h-3" />
                                                <span className="text-[10px] font-medium">{branch.active_users}</span>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 items-end shrink-0 ml-2">
                                            {branch.name === currentBranch ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20" style={{ borderColor: `${settings.accentColor}40`, background: `${settings.accentColor}10` }}>
                                                    <Check className="w-3 h-3" style={{ color: settings.accentColor }} />
                                                    <span className="text-[9px] font-bold tracking-tight uppercase" style={{ color: settings.accentColor }}>current</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onMergeBranch && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMerge(branch.name);
                                                            }}
                                                            disabled={mergingBranch !== null}
                                                            title={`Merge ${branch.name} into ${currentBranch}`}
                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-white text-[10px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                            style={{ background: settings.accentColor }}
                                                        >
                                                            {mergingBranch === branch.name ? (
                                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <GitMerge className="w-3 h-3" />
                                                            )}
                                                            MERGE
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-sm opacity-40">No branches found matching "{searchTerm}"</p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                setView('create');
                                                setNewBranchName(searchTerm);
                                            }}
                                            className="mt-4 px-4 py-2 rounded-lg bg-accent text-white text-sm hover:scale-105 transition-all"
                                            style={{ background: settings.accentColor }}
                                        >
                                            Create branch "{searchTerm}"
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {view === 'create' && (
                        <div className="p-4">
                            <p className="text-xs opacity-50 mb-4 flex items-center gap-2">
                                <History className="w-3 h-3" />
                                Branch will be created from <span className="font-mono text-accent" style={{ color: settings.accentColor }}>{currentBranch}</span>
                            </p>

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setView('list')}
                                    className="px-4 py-1.5 rounded-md text-sm hover:bg-white/5 transition-all"
                                    style={{ color: themeColors.textSecondary }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateSubmit}
                                    disabled={!newBranchName.trim() || loading}
                                    className="px-4 py-1.5 rounded-md text-sm text-white transition-all disabled:opacity-50"
                                    style={{ background: settings.accentColor }}
                                >
                                    {loading ? 'Creating...' : 'Create Branch'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-2 text-center bg-red-500/10 border-t border-red-500/20">
                        <p className="text-[11px] text-red-500">{error}</p>
                    </div>
                )}

                {/* Footer info */}
                <div className="px-4 py-2 bg-black/10 flex items-center justify-between">
                    <span className="text-[10px] opacity-40">Git Branching</span>
                    <div className="flex items-center gap-3">
                        <kbd className="text-[9px] opacity-40 px-1 border rounded">ESC</kbd>
                        <span className="text-[9px] opacity-40">to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
