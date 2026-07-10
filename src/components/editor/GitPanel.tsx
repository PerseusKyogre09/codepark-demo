import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RefreshCw, AlertCircle, ChevronRight, Check, Trash2,
  History, Plus, Layers
} from 'lucide-react';
import { GitDiff, GitFork, GitMerge, GitPullRequest, GitBranchIcon } from '../icons/SvgrepoGitIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSession } from '../../contexts/SessionContext';
import { useSocket } from '../../contexts/SocketContext';
import { useDialog } from '../../contexts/DialogContext';
import { apiClient } from '../../services/api';
import { DiffViewer } from './DiffViewer';
import { GitGraph } from './GitGraph';
import type { GitStatus, Commit } from '../../types';

interface GitSectionProps {
  title: string;
  count?: number;
  icon?: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  themeColors: any;
  actions?: React.ReactNode;
  allowOverflowVisible?: boolean;
}

function GitSection({ title, count, icon: Icon, isExpanded, onToggle, children, themeColors, actions, allowOverflowVisible }: GitSectionProps) {
  return (
    <div className="flex flex-col border-b last:border-0 shrink-0" style={{ borderColor: themeColors.border }}>
      <div
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-500/10 transition-colors cursor-pointer group select-none shrink-0"
        onClick={onToggle}
      >
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight size={14} style={{ color: themeColors.textSecondary }} />
        </div>
        {Icon && <Icon size={14} style={{ color: themeColors.textSecondary }} className="opacity-70" />}
        <span className="text-[10px] font-bold uppercase tracking-wider flex-1 opacity-80" style={{ color: themeColors.text }}>
          {title}
          {count !== undefined && <span className="ml-2 opacity-40 font-normal">({count})</span>}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          {actions}
        </div>
      </div>
      {isExpanded && (
        <div className={`w-full max-h-[360px] ${allowOverflowVisible ? 'overflow-visible' : 'overflow-y-auto overscroll-contain'} bg-black/5 dark:bg-black/20`} style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          {children}
        </div>
      )}
    </div>
  );
}



interface GitPanelProps {
  onStatusUpdate?: (status: GitStatus) => void;
}

export function GitPanel({ onStatusUpdate }: GitPanelProps) {
  const { settings, themeColors } = useTheme();
  const { user, isGithubLinked, linkAccount } = useAuth();
  const { session, replaceSessionFiles, refreshSession } = useSession();
  const { socket, isConnected } = useSocket();
  const { showConfirm } = useDialog();

  const [gitStatus, setGitStatus] = useState<GitStatus>({
    modified: [],
    untracked: [],
    staged: [],
    deleted: [],
  });
  const [commits, setCommits] = useState<Commit[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [remotes, setRemotes] = useState<Array<{ name: string, url: string }>>([]);
  const [remoteStatus, setRemoteStatus] = useState<Record<string, boolean>>({});
  const [newRemoteName, setNewRemoteName] = useState('');
  const [newRemoteUrl, setNewRemoteUrl] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    changes: true,
    remotes: false,
    history: false
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [diffFile, setDiffFile] = useState<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch Git status
  const fetchGitStatus = useCallback(async () => {
    if (!session?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient.getGitStatus(session.id);

      setGitStatus({
        modified: data.modified || [],
        untracked: data.untracked || [],
        staged: data.staged || [],
        deleted: data.deleted || [],
        initialized: data.initialized !== false,
        branch: data.branch || '',
        has_commits: data.has_commits || false,
      });

      if (onStatusUpdate) {
        onStatusUpdate({
          modified: data.modified || [],
          untracked: data.untracked || [],
          staged: data.staged || [],
          deleted: data.deleted || [],
          initialized: data.initialized !== false,
          branch: data.branch || '',
          has_commits: data.has_commits || false,
        });
      }
    } catch (err: any) {
      console.error('Error fetching Git status:', err);
      setError(err.message || 'Failed to fetch Git status');
    } finally {
      setIsLoading(false);
    }
  }, [session?.id]);

  // Fetch commit history
  const fetchCommitHistory = useCallback(async () => {
    if (!session?.id) return;

    try {
      const data = await apiClient.getGitLog(session.id, 20);
      setCommits(data.commits || []);
    } catch (err) {
      console.error('Error fetching commit history:', err);
    }
  }, [session?.id]);

  // Fetch remotes
  const fetchRemotes = useCallback(async () => {
    if (!session?.id) return;

    try {
      const data = await apiClient.getGitRemotes(session.id);
      setRemotes(data.remotes || []);
      // Clear connection status when remotes are refreshed
      setRemoteStatus({});
    } catch (err) {
      console.error('Error fetching remotes:', err);
    }
  }, [session?.id]);

  // Fetch from remote
  const fetchFromRemote = async (remote: string = 'origin') => {
    try {
      const result = await apiClient.fetchFromRemote(session?.id || '', remote);
      if (result.success) {
        // Refresh status and history after fetch
        await fetchGitStatus();
        await fetchCommitHistory();
        alert(`✅ Fetched from "${remote}" successfully!`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch from remote');
    }
  };

  // Add remote
  const addRemote = async () => {
    if (!newRemoteName.trim() || !newRemoteUrl.trim()) return;

    try {
      const result = await apiClient.addGitRemote(session?.id || '', newRemoteName.trim(), newRemoteUrl.trim());
      if (result.success) {
        setNewRemoteName('');
        setNewRemoteUrl('');
        await fetchRemotes();
        await fetchGitStatus();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to add remote');
    }
  };

  // Remove remote
  const removeRemote = async (name: string) => {
    try {
      const result = await apiClient.removeGitRemote(session?.id || '', name);
      if (result.success) {
        await fetchRemotes();
        await fetchGitStatus();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to remove remote');
    }
  };

  // Push to remote
  const pushToRemote = async (remote: string = 'origin', branch: string = 'main') => {
    setIsPushing(true);
    try {
      const result = await apiClient.pushToRemote(session?.id || '', remote, branch);
      if (result.success) {
        await fetchGitStatus();
        await fetchCommitHistory();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to push');
    } finally {
      setIsPushing(false);
    }
  };



  const scheduleGitStatusRefresh = useCallback(() => {
    if (!session?.id) {
      return;
    }

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      void fetchGitStatus();
    }, 500);
  }, [fetchGitStatus, session?.id]);

  // Initial load
  useEffect(() => {
    if (session?.id && isConnected) {
      fetchGitStatus();
      fetchCommitHistory();
      fetchRemotes();
    }
  }, [session?.id, isConnected, fetchGitStatus, fetchCommitHistory, fetchRemotes]);

  // Listen for file changes to refresh status
  useEffect(() => {
    if (!socket || !session?.id) {
      return;
    }

    const handleOperationalChange = () => {
      // console.log('GitPanel: Detected change, scheduling refresh');
      scheduleGitStatusRefresh();
    };

    socket.on('operation_ack', handleOperationalChange);
    socket.on('operation', handleOperationalChange);
    socket.on('file_created', handleOperationalChange);
    socket.on('file_deleted', handleOperationalChange);
    socket.on('file_renamed', handleOperationalChange);

    return () => {
      socket.off('operation_ack', handleOperationalChange);
      socket.off('operation', handleOperationalChange);
      socket.off('file_created', handleOperationalChange);
      socket.off('file_deleted', handleOperationalChange);
      socket.off('file_renamed', handleOperationalChange);
    };
  }, [socket, session?.id, scheduleGitStatusRefresh]);

  useEffect(() => {
    if (!socket || !session?.id) {
      return;
    }

    const handleFilesChanged = (data: { session_id: string; reason?: string }) => {
      if (data.session_id !== session.id) {
        return;
      }

      scheduleGitStatusRefresh();

      if (data.reason === 'revert' || data.reason === 'git_command') {
        void fetchCommitHistory();
      }
    };

    socket.on('files_changed', handleFilesChanged);

    return () => {
      socket.off('files_changed', handleFilesChanged);
    };
  }, [socket, session?.id, scheduleGitStatusRefresh, fetchCommitHistory]);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Toggle file selection
  const toggleFileSelection = (filename: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filename)) {
        newSet.delete(filename);
      } else {
        newSet.add(filename);
      }
      return newSet;
    });
  };

  // Select all files
  const selectAllFiles = () => {
    const allFiles = [
      ...gitStatus.modified,
      ...gitStatus.untracked,
      ...gitStatus.deleted,
    ];
    setSelectedFiles(new Set(allFiles));
  };

  // Deselect all files
  const deselectAllFiles = () => {
    setSelectedFiles(new Set());
  };

  // Commit changes
  const handleCommit = async () => {
    if (!session?.id || !commitMessage.trim()) {
      return;
    }

    try {
      setIsCommitting(true);
      setError(null);

      const result = await apiClient.gitCommit(
        session.id,
        commitMessage.trim(),
        user?.name,
        user?.email,
        selectedFiles.size > 0 ? Array.from(selectedFiles) : undefined
      );

      if (result.success) {
        // Clear commit message and selections
        setCommitMessage('');
        setSelectedFiles(new Set());

        // Refresh status and history
        await fetchGitStatus();
        await fetchCommitHistory();
      } else {
        throw new Error(result.message || 'Commit failed');
      }
    } catch (err: any) {
      console.error('Error committing changes:', err);
      setError(err.message || 'Failed to commit changes');
    } finally {
      setIsCommitting(false);
    }
  };

  // Revert to a commit
  const handleRevert = async (commitHash: string) => {
    if (!session?.id) return;

    const confirmed = await showConfirm(
      'Confirm Revert',
      `Are you sure you want to revert to commit ${commitHash.substring(0, 7)}? This will replace all current files with the files from that commit.`
    );

    if (!confirmed) return;

    try {
      setIsReverting(true);
      setError(null);

      const result = await apiClient.gitRevert(session.id, commitHash);

      if (result.success) {
        if (result.files) {
          replaceSessionFiles(result.files, result.active_file);
        } else {
          await refreshSession(session.id);
        }

        // Refresh status and history to reflect revert
        await fetchGitStatus();
        await fetchCommitHistory();
      } else {
        throw new Error(result.error || 'Revert failed');
      }
    } catch (err: any) {
      console.error('Error reverting to commit:', err);
      setError(err.message || 'Failed to revert to commit');
    } finally {
      setIsReverting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return 'unknown';
    }

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        // Backend already sends relative text like "2 minutes ago"
        return dateString;
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Get all changed files
  const allChangedFiles = [
    ...gitStatus.modified,
    ...gitStatus.untracked,
    ...gitStatus.deleted,
  ];

  const hasChanges = allChangedFiles.length > 0;
  const canCommit = commitMessage.trim().length > 0 && hasChanges;

  /* New Remote methods */
  const pullFromRemote = async (remote: string, branch: string = 'main') => {
    setIsPulling(true);
    try {
      const result = await apiClient.pullFromRemote(session?.id || '', remote, branch);
      if (result.success) {
        await fetchGitStatus();
        await fetchCommitHistory();
        // Refresh session to get updated files
        refreshSession();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to pull');
    } finally {
      setIsPulling(false);
    }
  };

  const testRemoteConnection = async (remote: string) => {
    setIsTestingConnection(remote);
    try {
      const result = await apiClient.testRemoteConnection(session?.id || '', remote);
      if (result.success) {
        // remoteStatus update?
        setRemoteStatus(prev => ({ ...prev, [remote]: true }));
      } else {
        setRemoteStatus(prev => ({ ...prev, [remote]: false }));
        setError(result.message);
      }
    } catch (err) {
      setRemoteStatus(prev => ({ ...prev, [remote]: false }));
      setError('Connection failed');
    } finally {
      setIsTestingConnection(null);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: themeColors.bg, color: themeColors.text }}>
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center justify-between shrink-0" style={{ borderColor: themeColors.border }}>
        <h2 className="text-[10px] uppercase tracking-wider font-bold opacity-60">Source Control</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchGitStatus}
            disabled={isLoading}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ color: themeColors.textSecondary }} />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2 border-b shrink-0" style={{ borderColor: themeColors.border }}>
          <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-400 leading-tight">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400/40 hover:text-red-400 px-1">×</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto no-scrollbar" style={{ overscrollBehavior: 'none' }}>
        {/* Changes Section */}
        <GitSection
          title="Changes"
          count={allChangedFiles.length}
          icon={Layers}
          isExpanded={expandedSections.changes}
          onToggle={() => toggleSection('changes')}
          themeColors={themeColors}
          actions={
            <div className="flex gap-1">
              <button onClick={selectAllFiles} title="Select All" className="p-1 hover:bg-white/10 rounded"><Check size={12} /></button>
              <button onClick={deselectAllFiles} title="Clear All" className="p-1 hover:bg-white/10 rounded"><Trash2 size={12} /></button>
            </div>
          }
        >
          <div className="p-3 space-y-3">
            {/* Commit message moved to top of changes */}
            {hasChanges && (
              <div className="space-y-2">
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border rounded text-xs outline-none transition-all resize-none placeholder:opacity-30"
                  style={{
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = settings.accentColor)}
                  onBlur={(e) => (e.target.style.borderColor = themeColors.border)}
                  placeholder="Message (Ctrl+Enter to commit)"
                  rows={2}
                />
                <button
                  onClick={handleCommit}
                  disabled={!canCommit || isCommitting}
                  className="w-full h-8 flex items-center justify-center rounded text-xs font-bold transition-all text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: settings.accentColor,
                  }}
                >
                  {isCommitting ? <RefreshCw className="animate-spin mr-2" size={12} /> : <Check className="mr-2" size={12} />}
                  Commit
                </button>
              </div>
            )}

            {!hasChanges && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 opacity-20 text-center">
                <GitBranchIcon size={36} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Changes Detected</p>
              </div>
            )}

            {/* Change List */}
            <div className="space-y-[1px]">
              {[...gitStatus.modified, ...gitStatus.untracked, ...gitStatus.deleted].map((file) => {
                const isModified = gitStatus.modified.includes(file);
                const isDeleted = gitStatus.deleted.includes(file);
                const isUntracked = gitStatus.untracked.includes(file);

                return (
                  <div key={file} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 group transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file)}
                      onChange={() => toggleFileSelection(file)}
                      className="w-3 h-3 rounded bg-black/40 border-white/10 cursor-pointer accent-accent"
                    />
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className={`text-xs truncate ${isDeleted ? 'line-through opacity-40' : 'opacity-80'}`} title={file}>
                        {file.split('/').pop()}
                        <span className="ml-2 opacity-20 text-[9px] font-mono">{file.includes('/') ? file.split('/').slice(0, -1).join('/') : ''}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isModified && (
                        <button onClick={() => setDiffFile(file)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all" title="Open diff">
                          <GitDiff size={12} className="text-yellow-400/60" />
                        </button>
                      )}
                      <span className={`w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded ${isModified ? 'text-yellow-500' :
                        isUntracked ? 'text-green-500' :
                          'text-red-500'
                        }`}>
                        {isModified ? 'M' : isUntracked ? 'U' : 'D'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GitSection>

        {/* Remotes & Publishing Section */}
        <GitSection
          title="Publish & Remotes"
          icon={GitBranchIcon}
          isExpanded={expandedSections.remotes}
          onToggle={() => toggleSection('remotes')}
          themeColors={themeColors}
        >
          <div className="p-3 space-y-4">
            {/* Initialize / Publish */}
            {!gitStatus.initialized && (
              <div className="p-4 rounded-xl border border-white/5 bg-black/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent"><GitBranchIcon size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Not Initialized</p>
                    <p className="text-[11px] opacity-40 leading-relaxed">Initialize to start tracking changes.</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      setIsPushing(true);
                      if (!session?.id) return;
                      const result = await apiClient.gitInit(session.id);
                      if (result.success) await fetchGitStatus();
                      else setError(result.error || 'Init failed');
                    } catch (e: any) { setError(e.message); } finally { setIsPushing(false); }
                  }}
                  disabled={isPushing}
                  className="w-full py-1.5 rounded-lg text-xs font-bold transition-all bg-accent text-white"
                >
                  {isPushing ? <RefreshCw className="animate-spin mx-auto" size={14} /> : 'Initialize Repository'}
                </button>
              </div>
            )}

            {gitStatus.initialized && remotes.length === 0 && (
              <div className="p-4 rounded-xl border border-white/5 bg-black/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><GitBranchIcon size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Publish to GitHub</p>
                    <p className="text-[11px] opacity-40 leading-relaxed">Share your code with the world.</p>
                  </div>
                </div>

                {!isGithubLinked ? (
                  <button onClick={() => linkAccount('github')} className="w-full py-2 rounded-lg text-xs font-bold transition-all bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    Link GitHub Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Repository Name"
                      value={newRemoteName || session?.project_name || ''}
                      onChange={(e) => setNewRemoteName(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-all"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-7 h-4 bg-white/10 rounded-full relative transition-colors group-hover:bg-white/20">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={newRemoteUrl === 'private'}
                            onChange={(e) => setNewRemoteUrl(e.target.checked ? 'private' : 'public')}
                          />
                          <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-all ${newRemoteUrl === 'private' ? 'translate-x-3 bg-accent' : 'bg-white/40'}`} />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Private</span>
                      </label>
                      <button
                        onClick={async () => {
                          try {
                            setIsPushing(true);
                            const repoName = newRemoteName || session?.project_name;
                            if (session?.id && repoName) {
                              await apiClient.publishToGitHub(session.id, repoName, newRemoteUrl === 'private');
                              setNewRemoteName('');
                              setNewRemoteUrl('');
                              await fetchRemotes();
                              await fetchGitStatus();
                            }
                          } catch (e: any) { setError(e.message); } finally { setIsPushing(false); }
                        }}
                        disabled={isPushing}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-accent text-white"
                      >
                        {isPushing ? <RefreshCw className="animate-spin" size={14} /> : 'Publish'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Existing Remotes */}
            {remotes.length > 0 && (
              <div className="space-y-2">
                {remotes.map((remote) => (
                  <div key={remote.name} className="p-2 border border-white/5 bg-black/20 rounded-lg group" title={remote.url}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <GitBranchIcon size={14} className="opacity-70" />
                        <span className="text-xs font-bold text-accent">{remote.name}</span>
                        {remoteStatus[remote.name] !== undefined && (
                          <div className={`w-1.5 h-1.5 rounded-full ${remoteStatus[remote.name] ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => pushToRemote(remote.name)} disabled={isPushing} className={`p-1 hover:bg-white/10 rounded ${isPushing ? 'opacity-30' : ''}`} title="Push"><GitMerge size={14} /></button>
                        <button onClick={() => pullFromRemote(remote.name)} disabled={isPulling} className={`p-1 hover:bg-white/10 rounded ${isPulling ? 'opacity-30' : ''}`} title="Pull"><GitPullRequest size={14} /></button>
                        <button onClick={() => fetchFromRemote(remote.name)} className="p-1 hover:bg-white/10 rounded" title="Fetch"><GitFork size={14} /></button>
                        <button onClick={() => testRemoteConnection(remote.name)} disabled={isTestingConnection === remote.name} className={`p-1 hover:bg-white/10 rounded ${isTestingConnection === remote.name ? 'opacity-30' : ''}`} title="Test Connection"><History size={12} className={isTestingConnection === remote.name ? 'animate-spin' : ''} /></button>
                        <button onClick={() => removeRemote(remote.name)} className="p-1 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded" title="Remove"><Plus size={12} className="rotate-45" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Remote Button */}
            <div className="pt-2">
              <button
                className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  const name = prompt('Remote name:');
                  const url = prompt('Remote URL:');
                  if (name && url) {
                    setNewRemoteName(name);
                    setNewRemoteUrl(url);
                    addRemote();
                  }
                }}
              >
                <Plus size={12} /> Add Remote
              </button>
            </div>
          </div>
        </GitSection>

        {/* Commit History Section */}
        <GitSection
          title="History"
          count={commits.length}
          icon={History}
          isExpanded={expandedSections.history}
          onToggle={() => toggleSection('history')}
          themeColors={themeColors}
          allowOverflowVisible={true}
        >
          <div className="p-2 space-y-[1px]">
            {commits.length > 0 ? (
              <GitGraph
                commits={commits}
                onRevert={handleRevert}
                isReverting={isReverting}
                themeColors={themeColors}
                formatDate={formatDate}
                sessionId={session?.id}
              />
            ) : (
              <div className="py-8 text-center opacity-20 text-[10px] font-bold uppercase tracking-widest italic">No commits yet</div>
            )}
          </div>
        </GitSection>
      </div>

      {/* Diff Viewer Overlay */}
      {diffFile && session?.id && (
        <DiffViewer
          filePath={diffFile}
          sessionId={session.id}
          onClose={() => setDiffFile(null)}
        />
      )}
    </div>
  );
}
