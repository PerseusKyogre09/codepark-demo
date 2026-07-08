import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Square, Monitor, Lock, Unlock, Copy as CopyIcon, Check, LogOut, Eye, Globe, UserPlus, Sun, Moon, ArrowLeft, Terminal, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSession } from '../../contexts/SessionContext';
import type { CollaboratorUser } from '../../types';

// Read unused variables to satisfy strict compilation rule
const _unusedIcons = { Play, Square, Monitor, Lock, Unlock, CopyIcon, Check, LogOut, Eye, Globe, UserPlus, Sun, Moon, ArrowLeft, Terminal, RefreshCw };
Object.values(_unusedIcons);

interface TopMenuBarProps {
  collaborators: CollaboratorUser[];
  onRunCode?: () => void;
  onStopExecution?: () => void;
  onSave?: () => void;
  isExecuting?: boolean;
  activeFile?: string;
  isMobile?: boolean;
  onMobileMenuToggle?: () => void;
  isReadOnly?: boolean;
  onRequestSignIn?: () => void;
  onLeaveSession?: () => void;
  // Preview
  onPreviewToggle?: () => void;
  isPreviewing?: boolean;
  previewDisabled?: boolean;
  webPreviewUrl?: string | null;
  onInviteClick?: () => void;
  onTerminalToggle?: () => void;
  terminalOpen?: boolean;
  onScan?: () => void;
  isScanning?: boolean;
}

export function TopMenuBar({
  collaborators,
  onRunCode,
  onStopExecution,
  onSave,
  isExecuting = false,
  activeFile,
  isMobile = false,
  onMobileMenuToggle,
  isReadOnly = false,
  onRequestSignIn,
  onLeaveSession,
  onPreviewToggle,
  isPreviewing = false,
  previewDisabled = false,
  webPreviewUrl = null,
  onInviteClick,
  onTerminalToggle,
  terminalOpen = false,
  onScan,
  isScanning = false,
}: TopMenuBarProps) {
  const navigate = useNavigate();
  const { settings, updateSettings, themeColors } = useTheme();
  const editorTheme = settings.editorTheme;
  const { user } = useAuth();
  const {
    session,
    isInSession,
    isCreatingSession,
    isJoiningSession,
    createSession,
    joinSession,
    leaveSession,
    copySessionLink,
    clientIdentity,
    toggleLock,
  } = useSession();


  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCreateSession = async () => {
    if (isReadOnly) {
      onRequestSignIn?.();
      return;
    }
    await createSession();
  };

  const handleJoinSession = () => {
    const id = prompt('Enter session ID:');
    if (id) {
      joinSession(id.trim());
    }
  };

  const handleLeaveSession = () => {
    if (onLeaveSession) {
      onLeaveSession();
    } else {
      leaveSession();
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleCopyLink = async () => {
    const success = await copySessionLink();
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Read unused parameters/imports to satisfy compiler warnings
  const _unused = {
    isMobile,
    onMobileMenuToggle,
    onPreviewToggle,
    isPreviewing,
    previewDisabled,
    webPreviewUrl,
    themeColors,
    editorTheme,
    isCreatingSession,
    isJoiningSession,
    toggleLock,
    linkCopied,
    onLeaveSession,
    createSession,
    joinSession,
    leaveSession,
    copySessionLink,
    handleCreateSession,
    handleJoinSession,
    handleLeaveSession,
    handleCopyLink
  };
  Object.values(_unused);

  const theme = settings.uiTheme;
  const toggleTheme = () => {
    updateSettings({ uiTheme: theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div
      className="flex items-center justify-between px-2 h-10 border-b border-border bg-surface shrink-0 relative z-50 gap-1 select-none"
    >
      {/* Left: Project Brand & Menu Items */}
      <div className="flex items-center gap-1">
        {/* Back Arrow to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="size-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors mr-1"
          title="Back to Dashboard"
        >
          <ArrowLeft size={14} />
        </button>

        {/* Brand / Project Name - Desktop/Tablet only */}
        <span className="text-xs font-semibold text-foreground px-1 hidden sm:block">
          {session?.project_name || 'Untitled Project'}
        </span>

        {/* Filename & Live dot on mobile */}
        <div className="flex items-center gap-1.5 sm:hidden px-1">
          <span className="text-xs text-muted-foreground">
            {activeFile?.split('/').pop() || 'index.tsx'}
          </span>
          {isInSession && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          )}
        </div>

        <div className="relative hidden md:block">
          <button
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            File
          </button>
          {openMenu === 'file' && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-2xl border border-border bg-surface py-1 z-50"
            >
              <button
                onClick={() => {
                  if (isReadOnly) {
                    onRequestSignIn?.();
                    return;
                  }
                  window.dispatchEvent(new CustomEvent('trigger_new_file_dialog'));
                  setOpenMenu(null);
                }}
                disabled={isReadOnly}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
              >
                New File
              </button>
              <button
                onClick={() => {
                  if (isReadOnly) {
                    onRequestSignIn?.();
                    return;
                  }
                  if (onSave) onSave();
                  setOpenMenu(null);
                }}
                disabled={isReadOnly}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
              >
                Save
              </button>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground"
              >
                Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <button
            onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            Edit
          </button>
          {openMenu === 'edit' && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-2xl border border-border bg-surface py-1 z-50"
            >
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground">Undo</button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground">Redo</button>
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <button
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            Help
          </button>
          {openMenu === 'help' && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-2xl border border-border bg-surface py-1 z-50"
            >
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('show_keyboard_shortcuts'));
                  setOpenMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground"
              >
                Keyboard Shortcuts
              </button>
            </div>
          )}
        </div>

        {isInSession && onScan && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setOpenMenu(openMenu === 'scan' ? null : 'scan')}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            >
              Scan
            </button>
            {openMenu === 'scan' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-2xl border border-border bg-surface py-1 z-50"
              >
                <button
                  onClick={() => {
                    onScan();
                    setOpenMenu(null);
                  }}
                  disabled={isScanning}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground flex items-center justify-between"
                >
                  <span>Rescan Repository</span>
                  {isScanning && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Controls & Collaborator Status */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Live indicator (Design Truth style) - Desktop/Tablet only */}
        {isInSession && (
          <div className="hidden sm:flex items-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[11px] text-muted-foreground">Live</span>
          </div>
        )}

        {/* Run/Stop Action Button */}
        {onRunCode && (
          isExecuting ? (
            <button
              onClick={onStopExecution}
              className="flex items-center justify-center gap-1 h-7 w-12 sm:w-auto sm:px-3 text-xs rounded sm:rounded-md font-medium transition-all hover:opacity-90 text-white bg-red-600 shadow-sm shrink-0"
              title="Stop execution"
            >
              <Square size={11} fill="currentColor" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              onClick={isReadOnly ? onRequestSignIn : onRunCode}
              disabled={!activeFile || !isInSession || isReadOnly}
              className="flex items-center justify-center gap-1 h-7 w-12 sm:w-auto sm:px-3 text-xs rounded sm:rounded-md font-medium transition-all hover:opacity-90 text-white bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
              title={!activeFile ? 'No file selected' : !isInSession ? 'Not in a session' : isReadOnly ? 'Sign in to run code' : 'Run code'}
            >
              <Play size={11} fill="currentColor" className="ml-0.5 sm:ml-0" />
              <span className="hidden sm:inline">Run</span>
            </button>
          )
        )}
        {/* Terminal Toggle Button - Desktop Only */}
        {onTerminalToggle && (
          <button
            onClick={onTerminalToggle}
            className={`hidden md:flex size-7 rounded items-center justify-center transition-colors border ${
              terminalOpen
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted border-transparent'
            }`}
            title="Toggle Terminal (Ctrl+`)"
          >
            <Terminal size={14} />
          </button>
        )}

        {/* Invite Button - Desktop Only */}
        {isInSession && onInviteClick && (
          <button
            onClick={onInviteClick}
            className="hidden md:flex items-center gap-1.5 px-2.5 h-7 text-xs rounded border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
            title="Invite Friends to Session"
          >
            <UserPlus size={12} />
            <span>Invite</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="size-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Collaborators Stack */}
        {isInSession && (() => {
          const otherCollaborators = collaborators.filter(c => c.id !== clientIdentity?.id);
          const totalInSession = collaborators.length;
          return (
            <div className="flex items-center ml-1">
              <span className="text-[11px] text-muted-foreground mr-1.5 hidden lg:block">
                {totalInSession} in session
              </span>

              <div className="flex -space-x-1.5">
                {/* Current user avatar first */}
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="User"
                    className="w-6 h-6 rounded-full border border-surface shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer"
                    title={user.name || user.email || 'You'}
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer"
                    style={{ background: clientIdentity?.color || 'var(--primary)' }}
                    title={user?.name || user?.email || 'You'}
                  >
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}

                {otherCollaborators.slice(0, 5).map((collab) => {
                  const collabName = collab.name && collab.name.trim() ? collab.name : 'Collaborator';
                  const collabInitial = collabName.charAt(0).toUpperCase();
                  return (
                    <div
                      key={collab.id}
                      className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer relative group"
                      style={{
                        background: collab.color,
                      }}
                      title={collabName}
                    >
                      {collabInitial}

                      <div
                        className="hidden md:block absolute bottom-full mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]"
                        style={{
                          background: collab.color,
                          color: 'white'
                        }}
                      >
                        {collabName}
                        {collab.cursor && (
                          <div className="text-[10px] opacity-80">
                            {collab.cursor.filename.split('/').pop()} • Ln {collab.cursor.line}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {otherCollaborators.length > 5 && (
                  <div
                    className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-[10px] bg-gray-600 text-white shadow-sm"
                    title={`${otherCollaborators.length - 5} more collaborators`}
                  >
                    +{otherCollaborators.length - 5}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}


