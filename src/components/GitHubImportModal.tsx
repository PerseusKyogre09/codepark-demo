import { useState, useEffect } from 'react';
import { X, Lock, Globe, Star, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../services/api';

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    clone_url: string;
    html_url: string;
    default_branch: string;
    language: string | null;
    updated_at: string;
    stargazers_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface GitHubImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: (projectId: string, projectName: string) => void;
}

const langColors: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Rust: "#CE422B",
    Go: "#00ADD8",
    Python: "#3572A5",
    CSS: "#563D7C",
    HTML: "#E34F26",
    Svelte: "#FF3E00",
    Vue: "#4FC08D",
    Kotlin: "#A97BFF",
    Java: "#B07219",
    "C++": "#F34B7D",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
};

export default function GitHubImportModal({ isOpen, onClose, onImportSuccess }: GitHubImportModalProps) {
    const { themeColors, settings } = useTheme();
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [importing, setImporting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [githubUser, setGithubUser] = useState<{ username: string; avatar_url: string } | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        let isCurrent = true;

        const checkStatus = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const status = await apiClient.getGitHubStatus();
                if (!isCurrent) return;

                setIsConnected(status.connected);
                if (status.connected && status.username) {
                    setGithubUser({
                        username: status.username,
                        avatar_url: status.avatar_url || ''
                    });
                    
                    const result = await apiClient.getGitHubRepos(1);
                    if (isCurrent) {
                        setRepos(result.repos || []);
                        setPage(1);
                        setHasMore((result.repos || []).length === 30);
                    }
                } else {
                    setGithubUser(null);
                    setRepos([]);
                    setPage(1);
                    setHasMore(false);
                }
            } catch (err) {
                if (isCurrent) {
                    console.error('Failed to check GitHub status:', err);
                    setError('Failed to check GitHub connection');
                }
            } finally {
                if (isCurrent) {
                    setIsLoading(false);
                }
            }
        };

        checkStatus();

        return () => {
            isCurrent = false;
        };
    }, [isOpen]);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        setError(null);
        try {
            const nextPage = page + 1;
            const result = await apiClient.getGitHubRepos(nextPage);
            const newRepos = result.repos || [];
            setRepos(prev => [...prev, ...newRepos]);
            setPage(nextPage);
            setHasMore(newRepos.length === 30);
        } catch (err) {
            console.error('Failed to load more repos:', err);
            setError('Failed to load more repositories');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleConnect = () => {
        window.location.href = '/api/github/login?redirect=/dashboard';
    };

    const handleDisconnect = async () => {
        try {
            await apiClient.disconnectGitHub();
            setIsConnected(false);
            setGithubUser(null);
            setRepos([]);
            setPage(1);
            setHasMore(false);
        } catch (err) {
            console.error('Failed to disconnect GitHub:', err);
        }
    };

    const handleImport = async (repo: GitHubRepo) => {
        setImporting(repo.full_name);
        setError(null);
        try {
            const result = await apiClient.importGitHubRepo(repo.clone_url, repo.name);
            if (result.success && result.project_id) {
                onImportSuccess(result.project_id, result.name || repo.name);
                onClose();
            } else {
                setError(result.error || 'Import failed');
            }
        } catch (err: any) {
            console.error('Failed to import repo:', err);
            setError(err.message || 'Failed to import repository');
        } finally {
            setImporting(null);
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl border overflow-hidden flex flex-col shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200"
                style={{
                    background: themeColors.cardBg,
                    borderColor: themeColors.border,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: themeColors.border }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#24292e]/10 dark:bg-white/10 flex items-center justify-center text-foreground shrink-0">
                            <FontAwesomeIcon icon={faGithub} size="lg" style={{ color: themeColors.text }} />
                        </div>
                        <h2 className="text-lg font-semibold" style={{ color: themeColors.text, fontFamily: 'Space Grotesk' }}>
                            Import from GitHub
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={18} style={{ color: themeColors.textSecondary }} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin" style={{ color: settings.accentColor }} />
                        </div>
                    ) : !isConnected ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#24292e] dark:text-white">
                                <FontAwesomeIcon icon={faGithub} size="2x" />
                            </div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: themeColors.text, fontFamily: 'Space Grotesk' }}>
                                Connect Your GitHub Account
                            </h3>
                            <p className="text-sm mb-6 max-w-md" style={{ color: themeColors.textSecondary }}>
                                Connect your GitHub account to import repositories.
                                This allows CodePark to access your public and private repos.
                            </p>
                            <button
                                onClick={handleConnect}
                                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-lg shadow-black/20"
                                style={{
                                    background: '#24292e',
                                    color: 'white'
                                }}
                            >
                                <FontAwesomeIcon icon={faGithub} size="lg" />
                                Connect GitHub
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Connected User Info */}
                            <div className="flex items-center justify-between mb-6 p-4 rounded-xl border" style={{ background: themeColors.bg, borderColor: themeColors.border }}>
                                <div className="flex items-center gap-3">
                                    {githubUser?.avatar_url ? (
                                        <img
                                            src={githubUser.avatar_url}
                                            alt={githubUser.username}
                                            className="w-9 h-9 rounded-full border-2 border-primary/20"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faGithub} />
                                        </div>
                                    )}
                                    <span className="font-semibold text-sm" style={{ color: themeColors.text }}>
                                        {githubUser?.username}
                                    </span>
                                </div>
                                <button
                                    onClick={handleDisconnect}
                                    className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/10 active:bg-red-500/20 transition-all font-medium border border-transparent hover:border-red-500/20"
                                    style={{ color: themeColors.error }}
                                >
                                    Disconnect
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative mb-6">
                                <Search
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
                                    style={{ color: themeColors.textSecondary }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-transparent outline-none transition-all focus:ring-2 focus:ring-ring/30 focus:border-primary placeholder:text-muted-foreground text-sm"
                                    style={{
                                        borderColor: themeColors.border,
                                        color: themeColors.text
                                    }}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30">
                                    <AlertCircle size={18} className="text-red-500" />
                                    <span className="text-sm text-red-500">{error}</span>
                                </div>
                            )}

                            {/* Repos List */}
                            <div className="space-y-3">
                                {filteredRepos.length === 0 ? (
                                    <p className="text-center py-8 text-sm" style={{ color: themeColors.textSecondary }}>
                                        {searchQuery ? 'No repositories match your search' : 'No repositories found'}
                                    </p>
                                ) : (
                                    filteredRepos.map((repo) => (
                                        <div
                                            key={repo.id}
                                            className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-primary/40 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:shadow-sm"
                                            style={{
                                                background: themeColors.bg,
                                                borderColor: themeColors.border
                                            }}
                                        >
                                            <div className="flex-1 min-w-0 mr-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {repo.private ? (
                                                        <Lock size={14} className="text-yellow-500 shrink-0" />
                                                    ) : (
                                                        <Globe size={14} className="shrink-0" style={{ color: themeColors.textSecondary }} />
                                                    )}
                                                    <span className="font-semibold truncate text-sm" style={{ color: themeColors.text }}>
                                                        {repo.name}
                                                    </span>
                                                    {repo.stargazers_count > 0 && (
                                                        <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: themeColors.textSecondary }}>
                                                            <Star size={12} className="fill-yellow-500/20 text-yellow-500" />
                                                            {repo.stargazers_count}
                                                        </span>
                                                    )}
                                                </div>
                                                {repo.description && (
                                                    <p className="text-xs line-clamp-2 mb-2" style={{ color: themeColors.textSecondary }}>
                                                        {repo.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {repo.language && (
                                                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{
                                                            background: `${langColors[repo.language] ?? '#6BAF82'}20`,
                                                            color: langColors[repo.language] ?? '#6BAF82'
                                                        }}>
                                                            {repo.language}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleImport(repo)}
                                                disabled={importing !== null}
                                                className="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 hover:shadow-md shrink-0"
                                                style={{
                                                    background: settings.accentColor,
                                                    color: 'white'
                                                }}
                                            >
                                                {importing === repo.full_name ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Import'
                                                )}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {hasMore && repos.length > 0 && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 hover:bg-white/5 active:scale-95 cursor-pointer"
                                        style={{
                                            borderColor: themeColors.border,
                                            color: themeColors.text
                                        }}
                                    >
                                        {loadingMore ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                        ) : (
                                            'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
